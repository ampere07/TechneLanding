import { after, before, beforeEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import handler, { TRAP_FIELD, formatAddress, validate } from '../api/contact.ts';

/**
 * Starts the real endpoint on a local port and talks to it over HTTP.
 * Only Resend's web address is faked, so no real mail is ever sent.
 */

const realFetch = globalThis.fetch;

interface ResendCall {
  url: string;
  init: RequestInit;
}
interface Reply {
  status: number;
  body: unknown;
}

const RESEND_URL = 'https://api.resend.com/emails';

let resendCalls: ResendCall[] = [];
let resendReply: Reply = { status: 200, body: { id: 'email-1' } };

globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith('http://127.0.0.1')) return realFetch(input, init);
  resendCalls.push({ url, init: init ?? {} });
  const reply: Reply = url === RESEND_URL ? resendReply : { status: 404, body: {} };
  return new Response(JSON.stringify(reply.body), { status: reply.status, headers: { 'Content-Type': 'application/json' } });
}) as typeof fetch;

let server: http.Server;
let base = '';

before(async () => {
  server = http.createServer((req, res) => {
    void handler(req, res);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.closeAllConnections();
  server.close();
  globalThis.fetch = realFetch;
});

beforeEach(() => {
  resendCalls = [];
  resendReply = { status: 200, body: { id: 'email-1' } };
  process.env.RESEND_API_KEY = 're_test_key_value';
  process.env.RESEND_FROM = 'noreply@techne.ph';
  process.env.CONTACT_TO = 'info@techne.ph';
});

interface Response2 {
  status: number;
  headers: http.IncomingHttpHeaders;
  text: string;
  json: Record<string, unknown>;
}

let ipCounter = 0;
const nextIp = () => {
  ipCounter += 1;
  return `10.1.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`;
};

function request(options: { method?: string; headers?: Record<string, string>; body?: string; ip?: string }): Promise<Response2> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      new URL('/api/contact', base),
      { method: options.method ?? 'POST', headers: { 'x-forwarded-for': options.ip ?? nextIp(), ...options.headers } },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json: Record<string, unknown> = {};
          try {
            json = JSON.parse(text) as Record<string, unknown>;
          } catch {
            /* not JSON */
          }
          resolve({ status: res.statusCode ?? 0, headers: res.headers, text, json });
        });
      },
    );
    req.on('error', reject);
    if (options.body !== undefined) req.write(options.body);
    req.end();
  });
}

const post = (payload: unknown, options: { headers?: Record<string, string>; ip?: string } = {}) =>
  request({ ...options, headers: { 'content-type': 'application/json', ...options.headers }, body: JSON.stringify(payload) });

const valid = {
  name: 'Maria Santos',
  email: 'maria@acme.ph',
  company: 'Acme Networks Inc.',
  phone: '+63 968 702 8433',
  subject: 'Quote request: Colocation, 42U Full',
  message: 'Hello Techne,\n\nI would like a quote for a 42U cabinet.\n\nPlease let me know the next steps.',
};

// ---------- What would be sent to Resend ----------

interface SentEmail {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
}

const sentEmail = (): SentEmail => {
  const call = resendCalls.find((candidate) => candidate.url === RESEND_URL);
  assert.ok(call, 'an email should have been sent to Resend');
  return JSON.parse(String(call.init.body)) as SentEmail;
};

// ---------- Sending ----------

describe('sending', () => {
  it('sends a valid message through Resend', async () => {
    const response = await post(valid);
    assert.equal(response.status, 200);
    assert.deepEqual(response.json, { ok: true });

    assert.equal(resendCalls.length, 1);
    assert.equal(resendCalls[0].url, RESEND_URL);
    assert.equal(resendCalls[0].init.method, 'POST');
    assert.equal((resendCalls[0].init.headers as Record<string, string>).Authorization, 'Bearer re_test_key_value');

    const mail = sentEmail();
    assert.deepEqual(mail.to, ['info@techne.ph']);
    assert.equal(mail.from, '"Maria Santos (maria@acme.ph)" <noreply@techne.ph>');
    assert.equal(mail.reply_to, '"Maria Santos" <maria@acme.ph>');
    assert.equal(mail.subject, '[Techne website] Quote request: Colocation, 42U Full');
    for (const line of ['Name: Maria Santos', 'Company: Acme Networks Inc.', 'Email: maria@acme.ph', 'Phone: +63 968 702 8433']) {
      assert.ok(mail.text.includes(line), `text part should include "${line}"`);
    }
    assert.ok(mail.text.includes('I would like a quote for a 42U cabinet.'));
    assert.ok(mail.html.includes('Acme Networks Inc.'));
    assert.ok(mail.html.includes('+63 968 702 8433'));
    assert.ok(mail.html.includes('href="mailto:maria@acme.ph"'));
  });

  it('delivers to every address in CONTACT_TO', async () => {
    process.env.CONTACT_TO = 'sales@techne.ph, info@techne.ph';
    assert.equal((await post(valid)).status, 200);
    assert.deepEqual(sentEmail().to, ['sales@techne.ph', 'info@techne.ph']);
  });

  it('sends each message once and does not retry a failure', async () => {
    resendReply = { status: 500, body: {} };
    const logged = mock.method(console, 'error', () => {});
    const response = await post(valid);
    logged.mock.restore();
    assert.equal(response.status, 502);
    assert.equal(resendCalls.length, 1);
  });
});

// ---------- Safety ----------

describe('keeping visitor text out of the recipients', () => {
  it('cannot add recipients or fields through any field', async () => {
    const response = await post({
      ...valid,
      name: 'Bob\r\nBcc: attacker@evil.test',
      company: 'Acme\r\nTo: attacker@evil.test',
      subject: 'Hello\r\nBcc: attacker@evil.test\r\nX-Evil: 1',
    });
    assert.equal(response.status, 200);
    const mail = sentEmail();
    assert.deepEqual(Object.keys(mail).sort(), ['from', 'html', 'reply_to', 'subject', 'text', 'to']);
    assert.deepEqual(mail.to, ['info@techne.ph']);
    assert.equal(mail.subject, '[Techne website] Hello Bcc: attacker@evil.test X-Evil: 1');
    assert.ok(!/[\r\n]/.test(mail.reply_to) && !/[\r\n]/.test(mail.subject) && !/[\r\n]/.test(mail.from));
  });

  it('rejects an email address that carries a second header', async () => {
    const response = await post({ ...valid, email: 'victim@example.com\r\nBcc: attacker@evil.test' });
    assert.equal(response.status, 400);
    assert.ok((response.json.fields as Record<string, string>).email);
    assert.equal(resendCalls.length, 0);
  });

  it('keeps a name from breaking out of the Reply-To value', async () => {
    const response = await post({ ...valid, name: 'Eve" <attacker@evil.test>' });
    assert.equal(response.status, 200);
    assert.equal(sentEmail().reply_to, '"Eve attacker@evil.test" <maria@acme.ph>');
    assert.equal(formatAddress('"<>\\', 'a@b.ph'), 'a@b.ph');
  });

  it('escapes visitor text in the HTML part', async () => {
    const response = await post({ ...valid, company: '<b>Acme</b>', message: '<script>alert(1)</script> & "quotes" <img src=x onerror=alert(1)>' });
    assert.equal(response.status, 200);
    const mail = sentEmail();
    assert.ok(!mail.html.includes('<script>'));
    assert.ok(!mail.html.includes('<img'));
    assert.ok(!mail.html.includes('<b>Acme</b>'));
    assert.ok(mail.html.includes('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;'));
    assert.ok(mail.text.includes('<script>alert(1)</script>'), 'the plain text part keeps the original');
  });

  it('keeps names and subjects that are not plain English', async () => {
    const subject = 'Cotización de colocación – 42U 🙂 con un asunto bastante largo';
    const response = await post({ ...valid, name: 'Niño Peña', subject, message: 'Kumusta po. Gusto naming magtanong tungkol sa serbisyo. ✓' });
    assert.equal(response.status, 200);
    const mail = sentEmail();
    assert.equal(mail.subject, `[Techne website] ${subject}`);
    assert.equal(mail.reply_to, '"Niño Peña" <maria@acme.ph>');
    assert.ok(mail.text.includes('Kumusta po.') && mail.text.includes('✓'));
  });

  it('always sends to the configured address, whatever the form says', async () => {
    const response = await post({ ...valid, to: 'attacker@evil.test', cc: 'attacker@evil.test', bcc: 'attacker@evil.test', recipient: 'attacker@evil.test' });
    assert.equal(response.status, 200);
    assert.deepEqual(sentEmail().to, ['info@techne.ph']);
    assert.ok(!JSON.stringify(resendCalls).includes('attacker@evil.test'));
  });
});

// ---------- Validation ----------

describe('validation', () => {
  it('reports every missing field and sends nothing', async () => {
    const response = await post({});
    assert.equal(response.status, 400);
    assert.equal(response.json.code, 'invalid');
    assert.deepEqual(Object.keys(response.json.fields as object).sort(), ['company', 'email', 'message', 'name', 'phone', 'subject']);
    assert.equal(resendCalls.length, 0);
  });

  const badCases: [string, Record<string, unknown>, string][] = [
    ['a phone number with letters', { phone: 'call me maybe' }, 'phone'],
    ['a phone number that is too short', { phone: '12345' }, 'phone'],
    ['a phone number with the plus in the middle', { phone: '63+9687028433' }, 'phone'],
    ['a phone number that is too long', { phone: '1'.repeat(31) }, 'phone'],
    ['an email without a domain', { email: 'maria@' }, 'email'],
    ['an email with spaces', { email: 'maria santos@acme.ph' }, 'email'],
    ['a one-letter name', { name: 'M' }, 'name'],
    ['a company that is only spaces', { company: '    ' }, 'company'],
    ['a message that is too short', { message: 'Hi' }, 'message'],
    ['a message that is too long', { message: 'x'.repeat(5001) }, 'message'],
    ['a subject that is too long', { subject: 'x'.repeat(151) }, 'subject'],
    ['fields that are not text', { name: 42, company: { a: 1 }, phone: ['1'] }, 'name'],
  ];
  for (const [label, override, field] of badCases) {
    it(`rejects ${label}`, async () => {
      const response = await post({ ...valid, ...override });
      assert.equal(response.status, 400);
      assert.ok((response.json.fields as Record<string, string>)[field], `expected an error on ${field}`);
      assert.equal(resendCalls.length, 0);
    });
  }

  for (const phone of ['+63 968 702 8433', '0968 702 8433', '(02) 8123 4567', '+63 (2) 8123-4567', '09687028433']) {
    it(`accepts the phone number ${phone}`, async () => {
      assert.equal((await post({ ...valid, phone })).status, 200);
    });
  }

  it('trims text and flattens line breaks in short fields', () => {
    const result = validate({ ...valid, name: '  Maria   Santos \n ', subject: 'A\r\nB\tC' });
    assert.ok(result.ok);
    assert.equal(result.value.name, 'Maria Santos');
    assert.equal(result.value.subject, 'A B C');
  });

  it('removes control characters from short fields', () => {
    const nul = String.fromCharCode(0);
    const del = String.fromCharCode(0x7f);
    const nel = String.fromCharCode(0x85);
    const result = validate({ ...valid, name: `Mar${nul}ia${del} Santos${nel}`, company: 'Ac' + String.fromCharCode(7) + 'me' });
    assert.ok(result.ok);
    assert.equal(result.value.name, 'Mar ia Santos');
    assert.equal(result.value.company, 'Ac me');
  });

  it('keeps line breaks in the message', () => {
    const result = validate({ ...valid, message: 'Line one\r\n\r\nLine two\u0000 end' });
    assert.ok(result.ok);
    assert.equal(result.value.message, 'Line one\n\nLine two  end');
  });
});

// ---------- Abuse and misuse ----------

describe('abuse and misuse', () => {
  it('quietly ignores bots that fill in the hidden field', async () => {
    const response = await post({ ...valid, [TRAP_FIELD]: 'http://spam.example' });
    assert.equal(response.status, 200);
    assert.deepEqual(response.json, { ok: true });
    assert.equal(resendCalls.length, 0);
  });

  it('only accepts POST', async () => {
    const response = await request({ method: 'GET' });
    assert.equal(response.status, 405);
    assert.equal(response.headers.allow, 'POST');
    assert.equal(resendCalls.length, 0);
  });

  it('refuses requests from another website', async () => {
    const response = await post(valid, { headers: { origin: 'https://evil.example' } });
    assert.equal(response.status, 403);
    assert.equal(resendCalls.length, 0);
  });

  it('accepts requests from its own website', async () => {
    assert.equal((await post(valid, { headers: { origin: base } })).status, 200);
  });

  it('refuses a body that is not JSON', async () => {
    const response = await request({ headers: { 'content-type': 'text/plain' }, body: 'hello' });
    assert.equal(response.status, 415);
  });

  it('refuses broken JSON and JSON that is not an object', async () => {
    assert.equal((await request({ headers: { 'content-type': 'application/json' }, body: '{not json' })).status, 400);
    assert.equal((await request({ headers: { 'content-type': 'application/json' }, body: '[1,2,3]' })).status, 400);
    assert.equal((await request({ headers: { 'content-type': 'application/json' }, body: 'null' })).status, 400);
  });

  it('refuses a body that is far too large', async () => {
    const response = await post({ ...valid, message: 'x'.repeat(30_000) });
    assert.equal(response.status, 413);
    assert.equal(resendCalls.length, 0);
  });

  it('limits how often one address can submit, and only that address', async () => {
    const ip = '203.0.113.9';
    for (let attempt = 0; attempt < 8; attempt += 1) assert.equal((await post({}, { ip })).status, 400);
    assert.equal((await post(valid, { ip })).status, 429);
    assert.equal(resendCalls.length, 0);
    assert.equal((await post(valid, { ip: '203.0.113.10' })).status, 200);
  });
});

// ---------- Failures ----------

describe('when something goes wrong', () => {
  it('says mail is unavailable, without details, when it is not configured', async () => {
    const logged = mock.method(console, 'error', () => {});
    delete process.env.RESEND_API_KEY;
    const response = await post(valid);
    logged.mock.restore();
    assert.equal(response.status, 500);
    assert.deepEqual(response.json, { ok: false, code: 'mail_unavailable' });
    assert.ok(!/resend|key|secret|token/i.test(response.text));
    assert.equal(resendCalls.length, 0);
  });

  it('treats a missing or badly formed sender as not configured', async () => {
    const logged = mock.method(console, 'error', () => {});
    delete process.env.RESEND_FROM;
    assert.equal((await post(valid)).json.code, 'mail_unavailable');
    process.env.RESEND_FROM = 'Techne <noreply@techne.ph>';
    assert.equal((await post(valid)).json.code, 'mail_unavailable');
    logged.mock.restore();
    assert.equal(resendCalls.length, 0);
  });

  it('treats a badly formed CONTACT_TO as not configured', async () => {
    const logged = mock.method(console, 'error', () => {});
    process.env.CONTACT_TO = 'not-an-email';
    const response = await post(valid);
    logged.mock.restore();
    assert.equal(response.status, 500);
    assert.equal(response.json.code, 'mail_unavailable');
  });

  it('keeps Resend error details in the log, and out of the reply, when Resend refuses the message', async () => {
    const logged = mock.method(console, 'error', () => {});
    resendReply = { status: 403, body: { statusCode: 403, name: 'validation_error', message: 'The techne.ph domain is not verified.' } };
    const response = await post(valid);
    const lines = logged.mock.calls.map((call) => call.arguments.join(' '));
    logged.mock.restore();
    assert.equal(response.status, 502);
    assert.deepEqual(response.json, { ok: false, code: 'send_failed' });
    assert.ok(!/validation_error|not verified|resend/i.test(response.text), 'the reply says nothing about Resend');
    assert.ok(lines.some((line) => line.includes('403') && line.includes('not verified')), 'the log explains what happened');
    assert.ok(lines.every((line) => !line.includes('re_test_key_value')), 'the API key is never logged');
  });

  it('reports a refused API key as a send failure', async () => {
    const logged = mock.method(console, 'error', () => {});
    resendReply = { status: 401, body: { statusCode: 401, name: 'validation_error', message: 'API key is invalid' } };
    const response = await post(valid);
    const lines = logged.mock.calls.map((call) => call.arguments.join(' '));
    logged.mock.restore();
    assert.equal(response.status, 502);
    assert.ok(lines.some((line) => line.includes('401') && line.includes('API key is invalid')));
  });

  it('does not log what the visitor wrote', async () => {
    const logged = mock.method(console, 'error', () => {});
    resendReply = { status: 500, body: {} };
    await post({ ...valid, message: 'a confidential message about our network design' });
    const lines = logged.mock.calls.map((call) => call.arguments.join(' '));
    logged.mock.restore();
    assert.ok(lines.length > 0);
    assert.ok(lines.every((line) => !line.includes('confidential') && !line.includes('maria@acme.ph')));
  });
});
