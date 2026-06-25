import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { ProcessSteps, FAQ, DEFAULT_PROCESS } from './ServiceLayout';

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.32, ease: EASE },
};

/** "How we work" — Techne's delivery methodology as a numbered process band. */
export const Methodology: React.FC = () => (
  <section className="py-24 bg-paper-2 border-t border-rule">
    <div className="container mx-auto px-6 max-w-7xl">
      <motion.div {...reveal} className="mb-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-accent" />
          <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">How we work</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
          A disciplined path from assessment to operations
        </h2>
        <p className="font-body text-[1.0625rem] text-ink-2 leading-relaxed mt-3">
          Every engagement follows the same engineering rigor — so you always know what happens next.
        </p>
      </motion.div>
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
        <ProcessSteps steps={DEFAULT_PROCESS} />
      </motion.div>
    </div>
  </section>
);

/** Closing FAQ — answers the questions operators ask before they reach out. */
export const HomeFAQ: React.FC = () => (
  <section className="py-24 bg-paper border-t border-rule">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
        <motion.div {...reveal}>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-accent" />
            <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">FAQ</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight">
            Questions, answered
          </h2>
          <p className="font-body text-[1.0625rem] text-ink-2 leading-relaxed mt-3 max-w-sm">
            The essentials on coverage, compliance, and how we engage. Need something specific?
          </p>
          <Link
            to={`/${PANEL_IDS.CONTACT}`}
            className="inline-flex items-center gap-1.5 font-display font-semibold text-sm text-accent mt-6 hover:gap-2.5 transition-all duration-[180ms]"
          >
            Talk to our engineers
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
          <FAQ
            items={[
              {
                q: 'Where does Techne operate?',
                a: 'We are carrier-neutral and operate across the Philippines, with backbone capacity and exchange presence in key metros including Manila and Cebu.',
              },
              {
                q: 'Who are your services for?',
                a: 'ISPs, enterprises, telcos, and financial institutions that need reliable, compliant, carrier-grade network infrastructure.',
              },
              {
                q: 'Do you handle NTC compliance?',
                a: 'Yes — including Protective DNS integration aligned with NTC Memorandum No. 001-01-2025, plus data-privacy requirements.',
              },
              {
                q: 'Can you work with our existing network?',
                a: 'Yes. We are vendor-neutral and design around the equipment and topology you already run — Cisco, Juniper, MikroTik, Arista, and more.',
              },
              {
                q: 'How fast can you respond?',
                a: 'Our NOC operates 24/7, and we respond to new inquiries within 24 hours.',
              },
            ]}
          />
        </motion.div>
      </div>
    </div>
  </section>
);
