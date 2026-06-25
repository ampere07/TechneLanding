import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { PANEL_IDS } from '../constants';

const EASE = [0.16, 1, 0.3, 1] as const;

export interface ServiceMeta {
  label: string;
  value: string;
}

interface ServiceLayoutProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** Optional spec rail rendered alongside the page title. */
  meta?: ServiceMeta[];
  children: React.ReactNode;
}

/**
 * Shared chrome for every service / detail page: a ruled header band with a
 * breadcrumb, eyebrow, title, lead and an optional spec rail, followed by the
 * page body and a closing CTA band. Gives the whole "Long Document" page family
 * one consistent, professional rhythm instead of bespoke per-page headers.
 */
export const ServiceLayout: React.FC<ServiceLayoutProps> = ({ eyebrow, title, lead, meta, children }) => {
  const hasMeta = !!meta && meta.length > 0;

  return (
    <>
      {/* Header band */}
      <section className="bg-paper-2 border-b border-rule pt-32 pb-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="font-mono text-[11px] tracking-[0.08em] uppercase mb-8 flex items-center gap-2 text-ink-2/70"
            aria-label="Breadcrumb"
          >
            <Link to={`/${PANEL_IDS.HOME}`} className="hover:text-accent transition-colors">Home</Link>
            <span className="text-rule">/</span>
            <Link to={`/${PANEL_IDS.SERVICES}`} className="hover:text-accent transition-colors">Services</Link>
            <span className="text-rule">/</span>
            <span className="text-ink-2">{title}</span>
          </motion.nav>

          <div className={`grid grid-cols-1 gap-10 lg:gap-16 items-end ${hasMeta ? 'lg:grid-cols-[1.5fr_1fr]' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-accent" />
                <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">{eyebrow}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-[1.05] tracking-tight">
                {title}
              </h1>
              <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mt-6 max-w-2xl">
                {lead}
              </p>
            </motion.div>

            {hasMeta && (
              <motion.dl
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.12, ease: EASE }}
                className="border border-rule rounded-[4px] bg-paper divide-y divide-rule"
              >
                {meta!.map((m) => (
                  <div key={m.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <dt className="font-mono text-[11px] text-ink-2 uppercase tracking-[0.08em]">{m.label}</dt>
                    <dd className="font-mono text-sm font-medium text-ink text-right">{m.value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-paper py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.08, ease: EASE }}
          className="container mx-auto px-6 max-w-6xl"
        >
          {children}
        </motion.div>
      </section>

      {/* Closing CTA band */}
      <section className="bg-ink">
        <div className="container mx-auto px-6 max-w-6xl py-16 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl md:text-[2rem] font-bold text-white tracking-tight leading-tight">
              Ready to engineer your network?
            </h2>
            <p className="font-body text-sm text-white/50 mt-3 max-w-md leading-relaxed">
              Talk to our engineers about your topology, capacity, and compliance requirements — we respond within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary px-6 py-3">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link
              to={`/${PANEL_IDS.PRICING}`}
              className="inline-flex items-center justify-center px-6 py-3 font-display font-semibold text-sm text-white border border-white/20 rounded-[4px] hover:bg-white/5 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

/** Hairline-ruled card grid that fills the body width for any item count. */
export const FeatureGrid: React.FC<{ items: { title: string; desc: string }[] }> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
    {items.map((item) => (
      <div key={item.title} className="p-7 bg-paper-2">
        <h3 className="font-display font-semibold text-ink mb-2">{item.title}</h3>
        <p className="font-body text-sm text-ink-2 leading-relaxed">{item.desc}</p>
      </div>
    ))}
  </div>
);

/** Accent-tick eyebrow label — the shared section-marker used across the site. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' }> = ({
  children,
  className = '',
  align = 'left',
}) => (
  <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''} ${className}`}>
    <span className="h-px w-8 bg-accent" />
    <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">{children}</span>
  </div>
);

/** In-body section header with an accent eyebrow, used to break up long pages. */
export const SectionTitle: React.FC<{ eyebrow?: string; title: string; intro?: string }> = ({ eyebrow, title, intro }) => (
  <div className="mb-8 max-w-2xl">
    {eyebrow && (
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-accent" />
        <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">{eyebrow}</span>
      </div>
    )}
    <h2 className="font-display text-2xl md:text-[2rem] font-bold text-ink tracking-tight leading-tight">{title}</h2>
    {intro && <p className="font-body text-[1rem] text-ink-2 leading-relaxed mt-3">{intro}</p>}
  </div>
);

/** Numbered delivery-process band with large mono numerals. */
export const ProcessSteps: React.FC<{ steps: { title: string; desc: string }[] }> = ({ steps }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
    {steps.map((s, i) => (
      <div key={s.title} className="bg-paper p-7">
        <div className="font-mono text-[1.75rem] font-semibold text-accent leading-none mb-5">
          {String(i + 1).padStart(2, '0')}
        </div>
        <h3 className="font-display font-semibold text-ink mb-2">{s.title}</h3>
        <p className="font-body text-sm text-ink-2 leading-relaxed">{s.desc}</p>
      </div>
    ))}
  </div>
);

/** Two-column datasheet of technical specifications. */
export const SpecTable: React.FC<{ rows: { k: string; v: string }[] }> = ({ rows }) => (
  <div className="border border-rule rounded-[4px] overflow-hidden">
    {rows.map((r, i) => (
      <div
        key={r.k}
        className={`grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] ${i < rows.length - 1 ? 'border-b border-rule' : ''}`}
      >
        <div className="px-5 py-3.5 bg-paper-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 sm:border-r border-rule">
          {r.k}
        </div>
        <div className="px-5 py-3.5 font-body text-sm text-ink leading-relaxed">{r.v}</div>
      </div>
    ))}
  </div>
);

/** Accessible accordion FAQ built on native <details> — no JS state needed. */
export const FAQ: React.FC<{ items: { q: string; a: string }[] }> = ({ items }) => (
  <div className="border-t border-rule">
    {items.map((it) => (
      <details key={it.q} className="group border-b border-rule">
        <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
          <span className="font-display font-semibold text-ink text-[1.0625rem] leading-snug">{it.q}</span>
          <span className="shrink-0 text-ink-2 transition-transform duration-200 group-open:rotate-45">
            <Plus size={18} />
          </span>
        </summary>
        <p className="font-body text-sm text-ink-2 leading-relaxed pb-6 max-w-2xl">{it.a}</p>
      </details>
    ))}
  </div>
);

/** Techne's standard engagement methodology — reused across service pages. */
export const DEFAULT_PROCESS = [
  { title: 'Assess', desc: 'We audit your current topology, traffic profile, and growth targets before proposing anything.' },
  { title: 'Design', desc: 'We architect a resilient, standards-based design with capacity headroom and clear documentation.' },
  { title: 'Deploy', desc: 'We provision, configure, and migrate with zero-downtime cutover planning and rollback paths.' },
  { title: 'Operate', desc: '24/7 NOC monitoring, proactive maintenance, and SLA-backed incident response after go-live.' },
];

/** Bordered highlights panel with a two-column checklist. */
export const HighlightsPanel: React.FC<{ heading: string; sub?: string; items: string[] }> = ({ heading, sub, items }) => (
  <div className="p-8 bg-paper border border-rule rounded-[4px]">
    <h3 className="font-display text-lg font-semibold text-ink">{heading}</h3>
    {sub && <p className="font-body text-sm text-ink-2 mt-1.5">{sub}</p>}
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5 mt-6">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-ink-2">
          <span className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
            <Check size={10} strokeWidth={3} />
          </span>
          <span className="font-body text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
