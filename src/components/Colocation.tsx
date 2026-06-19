import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Colocation: React.FC = () => {
  return (
    <section className="pt-36 pb-24 bg-paper min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Infrastructure Services</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight tracking-tight mb-6">
            Colocation Services
          </h1>
          <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mb-12 max-w-2xl border-b border-rule pb-12">
            Techne provides colocation access for organizations that need to host network equipment in a reliable, connectivity-ready environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 divide-rule border border-rule rounded-[4px] mb-12">
            {[
              { title: 'Equipment Hosting', desc: 'Routers, switches, servers, monitoring systems, DNS, and security appliances.' },
              { title: 'Network Presence', desc: 'Useful for ISP edge, core, interconnection, peering, and infrastructure expansion.' },
              { title: 'Infrastructure Ready', desc: 'Designed for operators that need better data center and network access.' },
              { title: 'Growth Focused', desc: 'Supports customers preparing for stronger connectivity and operational scale.' },
            ].map((item, i) => (
              <div key={i} className={`p-6 bg-paper-2 ${i % 2 === 0 ? 'md:border-r border-rule' : ''} ${i < 2 ? 'border-b border-rule' : ''}`}>
                <h3 className="font-display font-semibold text-ink mb-2">{item.title}</h3>
                <p className="font-body text-sm text-ink-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-paper border border-rule rounded-[4px]">
            <h3 className="font-display font-semibold text-ink mb-2">Host critical network systems in a better environment</h3>
            <p className="font-body text-sm text-ink-2 mb-5">Ideal for ISP core, edge, DNS, monitoring, and cybersecurity platforms.</p>
            <ul className="space-y-3">
              {[
                'Carrier-neutral cross-connects with major local fiber providers',
                'A+B redundant power with separate UPS configurations',
                '24/7 smart-hands engineering support on-site',
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
