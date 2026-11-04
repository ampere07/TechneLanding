import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { CONTACT } from '../content/site';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Sending email to: cliff@technefiber.com');
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
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
                  <a href={`mailto:${CONTACT.generalEmail}`} className="block text-[1rem] font-semibold text-ink hover:text-accent transition-colors duration-150">{CONTACT.generalEmail}</a>
                  <a href={`mailto:${CONTACT.salesEmail}`} className="block text-[1rem] font-semibold text-ink hover:text-accent transition-colors duration-150">{CONTACT.salesEmail}</a>
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
              <div className="py-10">
                <CheckCircle size={32} className="text-accent mb-4" aria-hidden="true" />
                <h2 className="heading-2 mb-2">Message sent</h2>
                <p className="body-copy mb-5">Thank you for reaching out. Our team will get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="text-link cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="heading-3">Send us a message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="field-label">Your name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      className="input-field"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="field-label">Work email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      className="input-field"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="field-label">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    className="input-field"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="field-label">How can we help?</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    className="input-field resize-y"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>
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
