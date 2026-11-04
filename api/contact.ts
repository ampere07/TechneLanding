import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Contact form endpoint. It checks the visitor's message and sends it to Techne through Resend.
 *
 * Runs as a Vercel serverless function at /api/contact, and under `npm run dev` through a Vite middleware.
 * The Resend API key comes from an environment variable and never reaches the browser.
 * Setup steps are in docs/contact-form-resend-setup.md.
 */

// ---------- Limits ----------

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { min: 2, max: 120 },
  phone: { max: 30, minDigits: 7, maxDigits: 20 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 5000 },
  body: 20_000,
};

const RATE_LIMIT = { max: 8, windowMs: 10 * 60_000, tracked: 5000 };
const RESEND_URL = 'https://api.resend.com/emails';
const REQUEST_TIMEOUT_MS = 7000;

/** The hidden field that only bots fill in. Its name is nonsense on purpose, so browser autofill never touches it. */
export const TRAP_FIELD = 'hp_check';

// ---------- Types ----------

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

type Code =
  | 'invalid'
  | 'bad_request'
  | 'method_not_allowed'
  | 'forbidden'
  | 'unsupported'
  | 'too_large'
  | 'rate_limited'
  | 'mail_unavailable'
  | 'send_failed';

class HttpError extends Error {
  status: number;
  code: Code;
  constructor(status: number, code: Code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

class MailError extends Error {}

// ---------- Validation ----------

/**
 * Removes control characters. Single-line fields also lose line breaks and collapse spaces,
 * so a visitor can never add a mail header through the name, subject or any other short field.
 */
const clean = (value: unknown, multiline = false): string => {
  if (typeof value !== 'string') return '';
  if (multiline) {
    return value
      // eslint-disable-next-line no-control-regex -- removing control characters is the point of this filter
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
      .replace(/\r\n?/g, '\n')
      .trim();
  }
  return value
    // eslint-disable-next-line no-control-regex -- removing control characters is the point of this filter
    .replace(/[\u0000-\u001F\u007F\u0085\u2028\u2029]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const EMAIL = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"'.]{2,}$/;
const PHONE = /^\+?[\d\s().-]+$/;

export function validate(body: Record<string, unknown>): { ok: true; value: ContactInput } | { ok: false; errors: FieldErrors } {
  const value: ContactInput = {
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company),
    phone: clean(body.phone),
    subject: clean(body.subject),
    message: clean(body.message, true),
  };
  const errors: FieldErrors = {};
  const tooLong = (max: number) => `Use ${max} characters or fewer.`;

  if (value.name.length < LIMITS.name.min) errors.name = 'Enter your name.';
  else if (value.name.length > LIMITS.name.max) errors.name = tooLong(LIMITS.name.max);

  if (value.email.length > LIMITS.email.max) errors.email = tooLong(LIMITS.email.max);
  else if (!EMAIL.test(value.email)) errors.email = 'Enter a valid email address.';

  if (value.company.length < LIMITS.company.min) errors.company = 'Enter your company name.';
  else if (value.company.length > LIMITS.company.max) errors.company = tooLong(LIMITS.company.max);

  const digits = value.phone.replace(/\D/g, '').length;
  if (value.phone.length > LIMITS.phone.max) errors.phone = tooLong(LIMITS.phone.max);
  else if (!PHONE.test(value.phone) || digits < LIMITS.phone.minDigits || digits > LIMITS.phone.maxDigits) {
    errors.phone = `Enter a contact number with ${LIMITS.phone.minDigits} to ${LIMITS.phone.maxDigits} digits.`;
  }

  if (value.subject.length < LIMITS.subject.min) errors.subject = 'Enter a subject.';
  else if (value.subject.length > LIMITS.subject.max) errors.subject = tooLong(LIMITS.subject.max);

  if (value.message.length < LIMITS.message.min) errors.message = `Tell us how we can help, in at least ${LIMITS.message.min} characters.`;
  else if (value.message.length > LIMITS.message.max) errors.message = tooLong(LIMITS.message.max);

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

// ---------- Building the email ----------

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

/** A "Name <address>" value. The address is validated before it gets here, and the name loses anything that could break the format. */
export function formatAddress(name: string, email: string): string {
  const safeName = name.replace(/["\\<>]/g, '').trim();
  return safeName ? `"${safeName}" <${email}>` : email;
}

/** What Resend receives. Resend builds the actual message, so no mail header is ever assembled by hand here. */
export interface OutgoingEmail {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
}

export function buildEmail(input: ContactInput, config: { from: string; to: string[] }, receivedAt: Date): OutgoingEmail {
  const stamp = `${receivedAt.toISOString()} (UTC)`;

  const text = [
    'New message from the Techne website contact form.',
    '',
    `Name: ${input.name}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    '',
    `Subject: ${input.subject}`,
    '',
    'Message:',
    input.message,
    '',
    `Received ${stamp}. Reply to this email to answer the sender.`,
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#455a68;vertical-align:top">${label}</td><td style="padding:4px 0;color:#0b2536"><strong>${value}</strong></td></tr>`;
  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#0b2536">',
    '<p style="margin:0 0 12px">New message from the Techne website contact form.</p>',
    '<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse">',
    row('Name', escapeHtml(input.name)),
    row('Company', escapeHtml(input.company)),
    row('Email', `<a href="mailto:${escapeHtml(input.email)}" style="color:#0e6b70">${escapeHtml(input.email)}</a>`),
    row('Phone', escapeHtml(input.phone)),
    row('Subject', escapeHtml(input.subject)),
    '</table>',
    '<p style="margin:16px 0 4px;color:#455a68">Message</p>',
    `<div style="white-space:pre-wrap;border-top:1px solid #d8e0e6;padding-top:8px">${escapeHtml(input.message)}</div>`,
    `<p style="margin:16px 0 0;color:#5f717d;font-size:12px">Received ${escapeHtml(stamp)}. Reply to this email to answer the sender.</p>`,
    '</div>',
  ].join('');

  return {
    from: formatAddress(`${input.name} (${input.email})`, config.from),
    to: config.to,
    reply_to: formatAddress(input.name, input.email),
    subject: `[Techne website] ${input.subject}`,
    text,
    html,
  };
}

// ---------- Resend ----------

interface MailConfig {
  apiKey: string;
  from: string;
  to: string[];
}

function readConfig(env: NodeJS.ProcessEnv): MailConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.RESEND_FROM?.trim();
  const to = (env.CONTACT_TO ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
  if (!apiKey || !from || !to.length) return null;
  if (!EMAIL.test(from) || !to.every((address) => EMAIL.test(address))) return null;
  return { apiKey, from, to };
}

async function sendEmail(config: MailConfig, email: OutgoingEmail): Promise<void> {
  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'User-Agent': 'techne-website-contact' },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { name?: unknown; message?: unknown };
    const detail = `${String(data.name ?? '')} ${String(data.message ?? '')}`.trim().slice(0, 200);
    throw new MailError(`send failed with ${response.status} ${detail}`.trim());
  }
}

// ---------- Request handling ----------

const header = (req: IncomingMessage, name: string): string | undefined => {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
};

const rateHits = new Map<string, number[]>();

/** Best effort only. Each serverless instance keeps its own count. */
function isRateLimited(ip: string, now: number): boolean {
  const recent = (rateHits.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  while (rateHits.size > RATE_LIMIT.tracked) {
    const oldest = rateHits.keys().next().value;
    if (oldest === undefined) break;
    rateHits.delete(oldest);
  }
  return false;
}

const clientIp = (req: IncomingMessage) =>
  (header(req, 'x-forwarded-for')?.split(',')[0] ?? header(req, 'x-real-ip') ?? req.socket?.remoteAddress ?? 'unknown').trim();

/** Browsers always send Origin on a POST. It must match the site that served the page. */
function isSameOrigin(req: IncomingMessage): boolean {
  const origin = header(req, 'origin');
  if (!origin) return true;
  const requestHost = (header(req, 'x-forwarded-host') ?? header(req, 'host') ?? '').split(',')[0]?.trim();
  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  let preParsed: unknown;
  try {
    // Vercel parses JSON bodies on first access. Plain Node leaves this undefined.
    preParsed = (req as IncomingMessage & { body?: unknown }).body;
  } catch {
    throw new HttpError(400, 'bad_request');
  }
  if (preParsed !== undefined) {
    if (typeof preParsed === 'string' || Buffer.isBuffer(preParsed)) {
      try {
        return JSON.parse(preParsed.toString());
      } catch {
        throw new HttpError(400, 'bad_request');
      }
    }
    return preParsed;
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const piece = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    size += piece.length;
    if (size > LIMITS.body) throw new HttpError(413, 'too_large');
    chunks.push(piece);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'bad_request');
  }
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    throw new HttpError(405, 'method_not_allowed');
  }
  if (!isSameOrigin(req)) throw new HttpError(403, 'forbidden');
  if (!(header(req, 'content-type') ?? '').toLowerCase().includes('application/json')) throw new HttpError(415, 'unsupported');
  if (Number(header(req, 'content-length') ?? 0) > LIMITS.body) throw new HttpError(413, 'too_large');
  if (isRateLimited(clientIp(req), Date.now())) throw new HttpError(429, 'rate_limited');

  const body = await readBody(req);
  if (typeof body !== 'object' || body === null || Array.isArray(body)) throw new HttpError(400, 'bad_request');
  const fields = body as Record<string, unknown>;

  // A hidden field that people never see. Bots fill it in. They get a normal reply and nothing is sent.
  const trap = fields[TRAP_FIELD];
  if (typeof trap === 'string' && trap.trim() !== '') {
    sendJson(res, 200, { ok: true });
    return;
  }

  const result = validate(fields);
  if (!result.ok) {
    sendJson(res, 400, { ok: false, code: 'invalid', fields: result.errors });
    return;
  }

  const config = readConfig(process.env);
  if (!config) {
    console.error('[contact] mail is not configured. Set RESEND_API_KEY, RESEND_FROM and CONTACT_TO.');
    throw new HttpError(500, 'mail_unavailable');
  }

  try {
    await sendEmail(config, buildEmail(result.value, config, new Date()));
  } catch (error) {
    // Details stay in the server log. The visitor only learns that sending failed.
    const detail = error instanceof MailError ? error.message : error instanceof Error ? error.name : 'unknown error';
    console.error(`[contact] resend ${detail}`);
    throw new HttpError(502, 'send_failed');
  }
  sendJson(res, 200, { ok: true });
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await handle(req, res);
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(res, error.status, { ok: false, code: error.code });
      return;
    }
    console.error('[contact] unexpected failure', error instanceof Error ? error.name : 'unknown');
    sendJson(res, 500, { ok: false, code: 'send_failed' });
  }
}
