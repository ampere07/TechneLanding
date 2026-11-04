import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { ENGAGEMENT_STEPS, serviceById, type ServiceSummary } from '../content/site';
import type { FabricFocus } from '../three/FabricStage';
import { ClosingCTA } from './ClosingCTA';
import { FabricView } from './FabricView';

export interface ServiceMeta {
  label: string;
  value: string;
}

interface ServiceLayoutProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** Key facts shown in a band under the page header. */
  meta?: ServiceMeta[];
  /** Highlights this service on the 3D hall in the page header. */
  focus?: FabricFocus;
  /** Other services worth reading about, shown before the closing band. */
  related?: ServiceSummary['id'][];
  children: React.ReactNode;
}

/** Shared page frame for every service and detail page. */
export const ServiceLayout: React.FC<ServiceLayoutProps> = ({ eyebrow, title, lead, meta, focus, related, children }) => (
  <>
    <section className="bg-paper-2 border-b border-rule overflow-hidden">
      <div className={`wrap grid grid-cols-1 gap-6 items-center ${focus ? 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]' : ''}`}>
        <div className={`pt-8 ${focus ? 'lg:py-12' : 'pb-12'}`}>
          <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-2 mb-6 flex flex-wrap items-center gap-1.5">
            <Link to={`/${PANEL_IDS.HOME}`} className="hover:text-accent transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/${PANEL_IDS.SERVICES}`} className="hover:text-accent transition-colors duration-150">Services</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <p className="eyebrow mb-2">{eyebrow}</p>
          <h1 className="heading-1">{title}</h1>
          <p className="lede mt-5">{lead}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary">Request a quote</Link>
            <Link to={`/${PANEL_IDS.PRICING}`} className="btn-secondary">View pricing</Link>
          </div>
        </div>
        {focus && <FabricView focus={focus} framing="full" className="h-[280px] sm:h-[400px] lg:h-[480px] lg:-mr-20" />}
      </div>
    </section>

    {meta && meta.length > 0 && (
      <section aria-label="Key facts" className="bg-paper border-b border-rule">
        <dl className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 py-7">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-[0.8125rem] text-ink-3">{item.label}</dt>
              <dd className="text-[1.0625rem] font-semibold text-ink mt-0.5 tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    )}

    <section className="section bg-paper">
      <div className="wrap">{children}</div>
    </section>

    {related && related.length > 0 && (
      <section className="section bg-paper-2 border-t border-rule">
        <div className="wrap">
          <h2 className="heading-2 mb-6">Related services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
            {related.map((id) => {
              const service = serviceById(id);
              return (
                <Link key={id} to={service.path} className="group bg-paper p-6 block">
                  <h3 className="heading-3 group-hover:text-accent transition-colors duration-150">{service.name}</h3>
                  <p className="body-copy mt-2">{service.menuLine}</p>
                  <span className="text-link mt-4">
                    Learn more
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    )}

    <ClosingCTA primaryLabel="Request a quote" />
  </>
);

/** Two-column list of short titled paragraphs. */
export const FeatureGrid: React.FC<{ items: { title: string; desc: string }[] }> = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
    {items.map((item) => (
      <div key={item.title} className="border-t border-rule pt-4">
        <h3 className="heading-3">{item.title}</h3>
        <p className="body-copy mt-1.5">{item.desc}</p>
      </div>
    ))}
  </div>
);

/** Small label above a heading. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string; align?: 'left' | 'center' }> = ({
  children,
  className = '',
  align = 'left',
}) => <p className={`eyebrow ${align === 'center' ? 'text-center' : ''} ${className}`}>{children}</p>;

/** In-body section header. */
export const SectionTitle: React.FC<{ eyebrow?: string; title: string; intro?: string }> = ({ eyebrow, title, intro }) => (
  <div className="mb-7 max-w-3xl">
    {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
    <h2 className="heading-2">{title}</h2>
    {intro && <p className="lede mt-3">{intro}</p>}
  </div>
);

/** Sequence of delivery stages, joined by a line on wide screens. */
export const ProcessSteps: React.FC<{ steps: { title: string; desc: string }[] }> = ({ steps }) => (
  <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
    {steps.map((step, index) => (
      <li key={step.title} className="relative">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-8 shrink-0 rounded-full bg-navy text-white text-[0.875rem] font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="hidden lg:block h-px flex-1 bg-rule-strong" aria-hidden="true" />
        </div>
        <h3 className="heading-3">{step.title}</h3>
        <p className="body-copy mt-1.5 pr-2">{step.desc}</p>
      </li>
    ))}
  </ol>
);

/** Two-column specification table. */
export const SpecTable: React.FC<{ rows: { k: string; v: string }[] }> = ({ rows }) => (
  <div className="border-t-2 border-ink">
    <table className="data-table">
      <tbody>
        {rows.map((row) => (
          <tr key={row.k}>
            <th scope="row" className="w-[36%] md:w-[28%]">{row.k}</th>
            <td>{row.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** General purpose table. Stacks into labelled blocks on phones so no column is hidden. */
export const DataTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <>
    <div className="md:hidden border-t-2 border-ink">
      {rows.map((row) => (
        <div key={row[0]} className="py-3.5 border-b border-rule">
          <p className="text-[1rem] font-semibold text-ink">{row[0]}</p>
          <dl className="mt-1.5 space-y-2">
            {row.slice(1).map((cell, index) => (
              <div key={index}>
                {headers.length > 2 && <dt className="text-[0.8125rem] text-ink-3">{headers[index + 1]}</dt>}
                <dd className="body-copy">{cell}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
    <div className="hidden md:block table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">{cell}</th>
                ) : (
                  <td key={index}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

/** Accordion built on native details elements, so it works without JavaScript state. */
export const FAQ: React.FC<{ items: { q: string; a: string }[] }> = ({ items }) => (
  <div className="border-t-2 border-ink">
    {items.map((item) => (
      <details key={item.q} className="group border-b border-rule">
        <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-4 [&::-webkit-details-marker]:hidden">
          <span className="text-[1.0625rem] font-semibold text-ink leading-snug group-hover:text-accent transition-colors duration-150">{item.q}</span>
          <span className="shrink-0 text-ink-2 transition-transform duration-150 group-open:rotate-45">
            <Plus size={18} aria-hidden="true" />
          </span>
        </summary>
        <p className="body-copy pb-5 max-w-[68ch]">{item.a}</p>
      </details>
    ))}
  </div>
);

/** Techne's standard engagement stages, reused across service pages. */
export const DEFAULT_PROCESS = ENGAGEMENT_STEPS;

/** Checklist of what a service includes. */
export const HighlightsPanel: React.FC<{ heading: string; sub?: string; items: string[] }> = ({ heading, sub, items }) => (
  <div>
    <h2 className="heading-2">{heading}</h2>
    {sub && <p className="lede mt-3">{sub}</p>}
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 mt-6">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <span className="body-copy">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
