import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const NetworkConsulting: React.FC = () => {
  return (
    <section className="pt-36 pb-24 bg-paper min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Advisory Services</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight tracking-tight mb-6">
            Network Consulting
          </h1>
          <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mb-12 max-w-2xl border-b border-rule pb-12">
            Expert strategic guidance for your network architecture. We help businesses design, optimize, and manage complex networking environments to ensure maximum performance and security.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 divide-rule border border-rule rounded-[4px] mb-12">
            {[
              { title: 'Design & Audit', desc: 'Comprehensive analysis of current infrastructure and future-proof design planning.' },
              { title: 'Managed Security', desc: 'Integrating advanced security protocols and monitoring into your network core.' },
            ].map((item, i) => (
              <div key={i} className={`p-6 bg-paper-2 ${i % 2 === 0 ? 'md:border-r border-rule' : ''}`}>
                <h3 className="font-display font-semibold text-ink mb-2">{item.title}</h3>
                <p className="font-body text-sm text-ink-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-paper border border-rule rounded-[4px]">
            <h3 className="font-display font-semibold text-ink mb-5">Consulting Scope</h3>
            <ul className="space-y-3">
              {[
                'BGP routing architecture review and peering strategy',
                'Core and distribution network topology planning',
                'NTC regulatory compliance and Protective DNS integration',
                'Incident response planning and NOC workflow design',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
