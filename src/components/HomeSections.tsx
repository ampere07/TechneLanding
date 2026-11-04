import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { FACTS, SERVICES, SERVICE_GROUPS, serviceById, type ServiceSummary } from '../content/site';
import { FabricView } from './FabricView';
import { Reveal } from './Reveal';
import { FAQ, ProcessSteps, DEFAULT_PROCESS } from './ServiceLayout';

const EASE = [0.16, 1, 0.3, 1] as const;

interface ServiceExplorerProps {
  active: ServiceSummary['id'];
  onSelect: (id: ServiceSummary['id']) => void;
  columnRef?: React.Ref<HTMLDivElement>;
  panelRef?: React.Ref<HTMLDivElement>;
  /** True when the home page's shared travelling model is drawn into this panel. */
  sharedModel?: boolean;
}

/** The seven services, each one highlighting its place in the 3D hall. */
export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({ active, onSelect, columnRef, panelRef, sharedModel = false }) => {
  const calm = useReducedMotion();
  return (
    <section id="services" className="section bg-paper">
      <div className="wrap">
        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12">
          <Reveal className="mb-8 lg:col-start-1 lg:row-start-1">
            <h2 className="heading-2">Seven services on one network</h2>
            <p className="lede mt-3">
              Every Techne service runs on the same fabric, so you can start with one and add others without changing
              providers. Select a service to see where it sits in a typical data hall.
            </p>
          </Reveal>

          <div ref={columnRef} className="contents lg:block lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div
              ref={panelRef}
              className="sticky top-[72px] lg:top-24 z-10 mb-6 lg:mb-0 h-[220px] sm:h-[320px] lg:h-[520px] bg-paper-2 border border-rule rounded-[4px] overflow-hidden"
            >
              {!sharedModel && <FabricView focus={active} className="h-full" />}
            </div>
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            {SERVICE_GROUPS.map((group, groupIndex) => (
              <Reveal key={group} className="mb-6 last:mb-0" delay={groupIndex * 0.07}>
                <h3 className="text-[0.8125rem] font-semibold text-ink-3 pb-2 border-b border-rule">{group}</h3>
                <ul>
                  {SERVICES.filter((service) => service.group === group).map((service) => {
                    const isActive = active === service.id;
                    return (
                      <li key={service.id} className="border-b border-rule">
                        <button
                          type="button"
                          aria-expanded={isActive}
                          onClick={() => onSelect(service.id)}
                          className={`w-full flex items-center justify-between gap-4 py-3.5 text-left cursor-pointer transition-colors duration-150 ${isActive ? 'text-accent' : 'text-ink hover:text-accent'}`}
                        >
                          <span className="text-[1.0625rem] font-semibold">{service.name}</span>
                          <ChevronDown size={18} aria-hidden="true" className={`shrink-0 transition-transform duration-150 ${isActive ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key="details"
                              className="overflow-hidden -mx-1 px-1"
                              initial={{ height: calm ? 'auto' : 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: calm ? 'auto' : 0, opacity: 0 }}
                              transition={{ duration: calm ? 0.2 : 0.35, ease: EASE }}
                            >
                              <div className="pb-5">
                                <p className="body-copy">{service.summary}</p>
                                <p className="text-[0.875rem] text-ink-2 mt-3">
                                  <span className="font-semibold text-ink">Built for: </span>
                                  {service.builtFor}
                                </p>
                                <Link to={service.path} className="text-link mt-3">
                                  {service.name} details
                                  <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const needs: { need: string; service: ServiceSummary['id'] }[] = [
  { need: 'Host routers, switches or servers in a secured data center', service: 'colocation' },
  { need: 'Buy upstream capacity using my own ASN and BGP', service: 'ip-transit' },
  { need: 'Reach CDNs and content networks without using my upstream links', service: 'content' },
  { need: 'Connect privately to one carrier or partner', service: 'vxc' },
  { need: 'Join several networks or partners on one private LAN', service: 'vswitch' },
  { need: 'Run BGP or a gateway without buying hardware', service: 'vrouter' },
  { need: 'Get an independent design, audit or compliance review', service: 'consulting' },
];

/** A direct answer to "which service do I need?". */
export const ServiceFinder: React.FC = () => (
  <section className="section bg-paper-2 border-y border-rule">
    <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-14">
      <Reveal>
        <h2 className="heading-2">Which service do you need?</h2>
        <p className="body-copy mt-3 max-w-sm">
          Start from what you are trying to do. If your requirement spans several of these, our engineers can scope it with you.
        </p>
        <Link to={`/${PANEL_IDS.CONTACT}`} className="text-link mt-4">
          Ask an engineer
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </Reveal>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">I need to</th>
              <th scope="col">Service</th>
            </tr>
          </thead>
          <tbody>
            {needs.map((row, rowIndex) => {
              const service = serviceById(row.service);
              return (
                <Reveal as="tr" key={row.need} distance={0} delay={Math.min(rowIndex * 0.06, 0.36)}>
                  <td className="!text-ink">{row.need}</td>
                  <td className="sm:whitespace-nowrap">
                    <Link to={service.path} className="font-semibold text-accent hover:underline underline-offset-2">{service.name}</Link>
                  </td>
                </Reveal>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const compareRows = [
  { label: 'Network layer', values: ['Layer 2', 'Layer 2', 'Layer 3'] },
  { label: 'Topology', values: ['Point to point', 'Multipoint', 'Routed'] },
  { label: 'Connects', values: ['Two ports', 'Three or more ports', 'Networks and upstreams, through routing'] },
  { label: 'Who runs routing', values: ['You, on your equipment', 'You, on your equipment', 'The instance, self-managed or managed by Techne'] },
  { label: 'Typical use', values: ['Private link to a carrier or partner', 'Shared private LAN between networks', 'BGP or a gateway without router hardware'] },
];

/** Plain explanation of how the three virtual services differ. */
export const VirtualCompare: React.FC = () => (
  <section className="section bg-paper">
    <div className="wrap">
      <Reveal className="max-w-3xl mb-8">
        <h2 className="heading-2">Virtual services compared</h2>
        <p className="lede mt-3">
          All three run on the Techne fabric and need no new physical cabling. The difference is what they connect and who handles routing.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
      <div className="md:hidden space-y-8">
        {(['vxc', 'vswitch', 'vrouter'] as const).map((id, serviceIndex) => {
          const service = serviceById(id);
          return (
            <div key={id} className="border-t-2 border-ink pt-3">
              <h3 className="heading-3">
                <Link to={service.path} className="hover:text-accent transition-colors duration-150">{service.name}</Link>
              </h3>
              <dl className="mt-2">
                {compareRows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-x-3 py-2 border-b border-rule">
                    <dt className="text-[0.875rem] font-semibold text-ink">{row.label}</dt>
                    <dd className="text-[0.875rem] text-ink-2">{row.values[serviceIndex]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <div className="hidden md:block table-scroll">
        <table className="data-table min-w-[720px]">
          <thead>
            <tr>
              <td className="!border-b-2 !border-ink" />
              {(['vxc', 'vswitch', 'vrouter'] as const).map((id) => {
                const service = serviceById(id);
                return (
                  <th key={id} scope="col">
                    <Link to={service.path} className="hover:text-accent transition-colors duration-150">{service.name}</Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="whitespace-nowrap">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Reveal>
    </div>
  </section>
);

const reasons = [
  {
    title: 'Carrier-neutral',
    desc: 'Choose your own carriers. At Vitro Makati 2 you can cross-connect to local fiber providers as well as to our own transit and peering.',
  },
  {
    title: 'Vendor-neutral engineering',
    desc: 'We design around what you already run, across Cisco, Juniper, Arista, MikroTik and others, instead of selling you a platform.',
  },
  {
    title: 'Documentation you keep',
    desc: 'Consulting engagements end with high and low level designs, IP plans, routing policy and SOPs that belong to your team.',
  },
  {
    title: 'Regulatory support',
    desc: 'We integrate Protective DNS in line with NTC Memorandum No. 001-01-2025, and help with data-privacy requirements for telcos and financial institutions.',
  },
];

export const WhyChooseTechne: React.FC = () => (
  <section className="section bg-navy text-white">
    <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 lg:gap-14">
      <Reveal>
        <h2 className="heading-2 !text-white">Why networks work with Techne</h2>
        <div className="mt-8 border-t border-white/20 pt-6">
          <p className="font-display text-[3rem] font-semibold tracking-tight leading-none tabular-nums">{FACTS.networks}</p>
          <p className="text-[0.9375rem] text-white/75 mt-3 max-w-xs">
            Networks served across Luzon, Visayas and Mindanao, including past and present engagements.
          </p>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {reasons.map((reason, reasonIndex) => (
          <Reveal key={reason.title} className="border-t border-white/20 pt-5" delay={reasonIndex * 0.08}>
            <h3 className="text-[1.125rem] font-semibold">{reason.title}</h3>
            <p className="text-[0.9375rem] leading-relaxed text-white/75 mt-2">{reason.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const Methodology: React.FC = () => (
  <section className="section bg-paper-2 border-y border-rule">
    <div className="wrap">
      <Reveal className="max-w-3xl mb-10">
        <h2 className="heading-2">How an engagement works</h2>
        <p className="lede mt-3">The same four stages apply whether you are ordering one port or rebuilding a core network.</p>
      </Reveal>
      <ProcessSteps steps={DEFAULT_PROCESS} animate />
    </div>
  </section>
);

export const HomeFAQ: React.FC = () => (
  <section className="section bg-paper">
    <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-14">
      <Reveal>
        <h2 className="heading-2">Common questions</h2>
        <p className="body-copy mt-3 max-w-sm">Coverage, requirements and how we work. For anything specific to your network, ask our engineers.</p>
      </Reveal>
      <Reveal delay={0.1}>
      <FAQ
        items={[
          {
            q: 'Where does Techne operate?',
            a: 'Our services are delivered from Vitro Makati 2 in Manila. If your site is somewhere else, tell us where it is and we will check what can reach it.',
          },
          {
            q: 'Who are your services for?',
            a: 'ISPs, enterprises, telcos and financial institutions that need reliable, compliant network infrastructure.',
          },
          {
            q: 'Do I need my own ASN for IP Transit?',
            a: 'Yes. Full BGP transit needs a public ASN and your own IPv4 and IPv6 resources. If you are starting out, we can advise on APNIC registration and interim addressing.',
          },
          {
            q: 'What is the difference between IP Transit and Content?',
            a: 'IP Transit gives you reach to the whole internet. Content gives you direct access to CDN caches and content networks, which moves popular traffic off your transit links. Many networks buy both.',
          },
          {
            q: 'Can you work with our existing network?',
            a: 'Yes. We are vendor-neutral and design around the equipment and topology you already run.',
          },
          {
            q: 'Do you handle NTC compliance?',
            a: 'Yes, including Protective DNS integration aligned with NTC Memorandum No. 001-01-2025, plus data-privacy requirements.',
          },
          {
            q: 'How quickly do you respond?',
            a: 'We respond to new inquiries within 24 hours, and our NOC operates 24/7. For an urgent network issue, please call us.',
          },
        ]}
      />
      </Reveal>
    </div>
  </section>
);
