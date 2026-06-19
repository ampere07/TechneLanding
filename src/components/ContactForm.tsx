import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sending email to: cliff@technefiber.com');
      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-paper-2 border-t border-rule">
      <div className="container mx-auto px-6 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 border-b border-rule pb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight leading-tight">
            Get in Touch
          </h1>
          <p className="font-body text-[1.125rem] text-ink-2 mt-3 max-w-xl leading-relaxed">
            Tell us about your network requirements and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">

          {/* Left: contact info */}
          <div className="space-y-10">
            <div>
              <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-5">Contact Details</p>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:cliff@technefiber.com" className="font-body text-sm text-ink hover:text-accent transition-colors duration-[180ms]">cliff@technefiber.com</a>
                    <br />
                    <a href="mailto:info@technefiber.com" className="font-body text-sm text-ink hover:text-accent transition-colors duration-[180ms]">info@technefiber.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-1">Phone</p>
                    <span className="font-mono text-sm text-ink flex items-center gap-1.5">
                      <MessageSquare size={11} className="text-ink-2" />
                      +63 968 702 8433
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-1">Location</p>
                    <span className="font-body text-sm text-ink">Cebu City, Philippines</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border-t border-rule pt-8">
              <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Response Time</p>
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Our team responds to inquiries within 24 business hours. For urgent network issues, reach out by phone.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-paper border border-rule rounded-[4px] p-8 md:p-10">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-[4px] flex items-center justify-center mb-6">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-display text-2xl font-bold text-ink mb-2">Message Sent</h3>
                <p className="font-body text-sm text-ink-2 mb-8">Thank you for reaching out. Cliff will get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-body text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-[180ms]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="input-field"
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      className="input-field"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Network Consulting Inquiry"
                    className="input-field"
                    value={formState.subject}
                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your project..."
                    className="input-field resize-none"
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full py-3.5 disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
