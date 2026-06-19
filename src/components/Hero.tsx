import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-36 pb-24 bg-paper overflow-x-clip">
      <div className="container mx-auto px-6 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <h1
            className="font-display font-bold text-ink tracking-tight leading-[1.05]"
            style={{ fontSize: 'var(--text-display)' }}
          >
            Enterprise Network Infrastructure
          </h1>

          <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mt-6 max-w-xl">
            Carrier-neutral exchange paths, dedicated internet access, and managed network services for ISPs and enterprises across the Philippines.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary px-6 py-3">
              Get Started
            </Link>
            <Link to={`/${PANEL_IDS.SERVICES}`} className="btn-secondary px-6 py-3">
              View Services
            </Link>
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.32, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-rule mt-16 pt-10 flex flex-wrap gap-10 md:gap-16"
        >
          <div>
            <div className="font-mono font-semibold text-ink" style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}>
              99.9%
            </div>
            <div className="font-body text-xs text-ink-2 uppercase tracking-[0.08em] mt-2">
              Network Uptime
            </div>
          </div>

          <div className="w-px bg-rule self-stretch hidden sm:block" />

          <div>
            <div className="font-mono font-semibold text-ink" style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}>
              24/7
            </div>
            <div className="font-body text-xs text-ink-2 uppercase tracking-[0.08em] mt-2">
              Local Support
            </div>
          </div>

          <div className="w-px bg-rule self-stretch hidden sm:block" />

          <div>
            <div className="font-mono font-semibold text-ink" style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}>
              200+<span className="text-ink-2 text-[1.5rem]">Gbps</span>
            </div>
            <div className="font-body text-xs text-ink-2 uppercase tracking-[0.08em] mt-2">
              Backbone Capacity
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
