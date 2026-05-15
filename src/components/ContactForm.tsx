import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

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
    <section id="contact" className="py-24 relative overflow-hidden bg-white border-t border-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            <div className="bg-[#63b4b5] p-10 md:p-12 rounded-[2.5rem] text-white flex flex-col justify-center shadow-xl shadow-[#63b4b5]/20">
              <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">Ready to <span className="text-white/80">Upgrade</span> Your Connectivity?</h2>
              <p className="text-white/90 mb-8 text-lg leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours. We're ready to discuss your network needs and provide a tailored solution.
              </p>
            </div>

            {/* Vertical Divider (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 -translate-x-1/2 z-10" />

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-brand-blue/5 relative">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500">Thank you for reaching out. Cliff will get back to you soon.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-brand-blue hover:text-brand-blue/80 font-medium underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="input-field"
                        value={formState.name}
                        onChange={e => setFormState({...formState, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@company.com"
                        className="input-field"
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Network Consulting Inquiry"
                      className="input-field"
                      value={formState.subject}
                      onChange={e => setFormState({...formState, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Tell us about your project..."
                      className="input-field resize-none"
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
