import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { CONTACT } from '../content/site';

type FieldName = 'name' | 'email' | 'company' | 'phone' | 'subject' | 'message';
type Fields = Record<FieldName, string>;
type FieldErrors = Partial<Record<FieldName, string>>;

interface ApiReply {
  ok?: boolean;
  code?: string;
  fields?: FieldErrors;
}

const EMPTY: Fields = { name: '', email: '', company: '', phone: '', subject: '', message: '' };
const FIELD_ORDER: FieldName[] = ['name', 'email', 'company', 'phone', 'subject', 'message'];

// Kept in step with LIMITS in api/contact.ts. The server is the one that decides.
const MAX = { name: 100, email: 254, company: 120, phone: 30, subject: 150, message: 5000 };

/** The hidden field that only bots fill in. Its name matches TRAP_FIELD in api/contact.ts. */
const TRAP_FIELD = 'hp_check';

const ALTERNATIVE = `email ${CONTACT.email} or call ${CONTACT.phoneDisplay}`;
const MESSAGES = {
  invalid: 'Please check the highlighted fields.',
  tooMany: `You have sent several messages in a short time. Please wait a few minutes, or ${ALTERNATIVE}.`,
  failed: `We could not send your message. Please try again, or ${ALTERNATIVE}.`,
  network: `We could not reach the server. Check your connection and try again, or ${ALTERNATIVE}.`,
};

interface FieldProps {
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  rows?: number;
}

const Field: React.FC<FieldProps> = ({ name, label, value, error, onChange, type = 'text', autoComplete, rows }) => {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    required: true,
    value,
    onChange,
    maxLength: MAX[name],
    autoComplete,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {rows ? (
        <textarea {...shared} rows={rows} className="input-field resize-y" />
      ) : (
        <input {...shared} type={type} inputMode={type === 'tel' ? 'tel' : undefined} className="input-field" />
      )}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
};

interface ContactFormBodyProps {
  initialSubject: string;
  initialMessage: string;
}

const ContactFormBody: React.FC<ContactFormBodyProps> = ({ initialSubject, initialMessage }) => {
  const [prefilled, setPrefilled] = useState(initialSubject !== '' || initialMessage !== '');
  const [fields, setFields] = useState<Fields>({ ...EMPTY, subject: initialSubject, message: initialMessage });
  const [trap, setTrap] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState('');
  const [sentTo, setSentTo] = useState('');
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const sendingRef = useRef(false);

  // Move focus to the confirmation, so screen reader users hear that the message was sent.
  useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus();
  }, [status]);

  const update = (name: FieldName) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFields((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;
    setStatus('sending');
    setErrors({});
    setNotice('');

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, [TRAP_FIELD]: trap }),
        signal: controller.signal,
      });
      const reply = (await response.json().catch(() => null)) as ApiReply | null;

      if (response.ok && reply?.ok) {
        setSentTo(fields.email.trim());
        setFields(EMPTY);
        setPrefilled(false);
        setStatus('success');
        return;
      }
      if (response.status === 400 && reply?.fields) {
        const found = reply.fields;
        setErrors(found);
        setNotice(MESSAGES.invalid);
        setStatus('error');
        const first = FIELD_ORDER.find((name) => found[name]);
        if (first) document.getElementById(`contact-${first}`)?.focus();
        return;
      }
      setNotice(response.status === 429 ? MESSAGES.tooMany : MESSAGES.failed);
      setStatus('error');
    } catch {
      setNotice(MESSAGES.network);
      setStatus('error');
    } finally {
      window.clearTimeout(timer);
      sendingRef.current = false;
    }
  };

  return (
    <>
      <section className="bg-paper-2 border-b border-rule">
        <div className="wrap py-12 md:py-16">
          <h1 className="heading-1">Contact us</h1>
          <p className="lede mt-4">
            Tell us about your location, capacity and timeline, and we will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section id="contact" className="section bg-paper">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 lg:gap-14">
          <div>
            <h2 className="heading-3 mb-4">Contact details</h2>
            <dl className="border-t-2 border-ink">
              <div className="py-4 border-b border-rule">
                <dt className="text-[0.8125rem] text-ink-3">Phone</dt>
                <dd className="mt-0.5">
                  <a href={CONTACT.phoneHref} className="text-[1rem] font-semibold text-ink hover:text-accent transition-colors duration-150">{CONTACT.phoneDisplay}</a>
                </dd>
              </div>
              <div className="py-4 border-b border-rule">
                <dt className="text-[0.8125rem] text-ink-3">Email</dt>
                <dd className="mt-0.5 space-y-0.5">
                  <a href={`mailto:${CONTACT.email}`} className="block text-[1rem] font-semibold text-ink hover:text-accent transition-colors duration-150">{CONTACT.email}</a>
                </dd>
              </div>
              <div className="py-4 border-b border-rule">
                <dt className="text-[0.8125rem] text-ink-3">Office</dt>
                <dd className="mt-0.5 text-[1rem] font-semibold text-ink">{CONTACT.city}</dd>
              </div>
            </dl>
            <p className="body-copy mt-5">We respond to inquiries within 24 business hours. For an urgent network issue, please call us.</p>
          </div>

          <div className="bg-paper-2 border border-rule rounded-[4px] p-6 md:p-8">
            {status === 'success' ? (
              <div role="status" className="py-10">
                <CheckCircle size={32} className="text-accent mb-4" aria-hidden="true" />
                <h2 ref={confirmationRef} tabIndex={-1} className="heading-2 mb-2 outline-none">Message sent</h2>
                <p className="body-copy mb-5">
                  Thank you for reaching out. We will reply to {sentTo} within 24 business hours.
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="text-link cursor-pointer">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div>
                  <h2 className="heading-3">{prefilled ? 'Your quote request' : 'Send us a message'}</h2>
                  <p className="body-copy mt-1">
                    {prefilled ? 'We filled in the subject and message from your selection. You can edit anything before sending. ' : ''}
                    All fields are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field name="name" label="Your name" value={fields.name} error={errors.name} onChange={update('name')} autoComplete="name" />
                  <Field name="email" label="Work email" type="email" value={fields.email} error={errors.email} onChange={update('email')} autoComplete="email" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field name="company" label="Company name" value={fields.company} error={errors.company} onChange={update('company')} autoComplete="organization" />
                  <Field name="phone" label="Contact number" type="tel" value={fields.phone} error={errors.phone} onChange={update('phone')} autoComplete="tel" />
                </div>
                <Field name="subject" label="Subject" value={fields.subject} error={errors.subject} onChange={update('subject')} />
                <Field name="message" label="How can we help?" rows={prefilled ? 12 : 6} value={fields.message} error={errors.message} onChange={update('message')} />

                {/* People never see this field. Bots fill it in, and the server then discards the message. */}
                <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="contact-trap">Leave this field empty</label>
                  <input
                    id="contact-trap"
                    name={TRAP_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trap}
                    onChange={(event) => setTrap(event.target.value)}
                  />
                </div>

                {status === 'error' && notice && (
                  <div role="alert" className="flex items-start gap-2.5 bg-paper border border-danger rounded-[4px] px-4 py-3 text-[0.9375rem] text-ink">
                    <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{notice}</span>
                  </div>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-primary">
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    'Send message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

/** A link can pre-fill the form. The key resets the form whenever those details change. */
export const ContactForm: React.FC = () => {
  const [params] = useSearchParams();
  return (
    <ContactFormBody
      key={params.toString()}
      initialSubject={params.get('subject') ?? ''}
      initialMessage={params.get('message') ?? ''}
    />
  );
};
