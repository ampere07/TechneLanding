import React from 'react';
import { FACTS, LOCATION } from '../content/site';
import { ClosingCTA } from './ClosingCTA';

const stats = [
  { value: FACTS.backbone, label: 'Backbone capacity' },
  { value: FACTS.sla, label: 'Availability SLA' },
  { value: FACTS.networks, label: 'Networks served, past and present' },
  { value: LOCATION.facility, label: `Data center in ${LOCATION.city}` },
];

const values = [
  {
    title: 'Our mission',
    desc: 'To make high-performance connectivity easier to reach in the Philippines, by building carrier-neutral exchange paths and dependable edge services for local ISPs and enterprises.',
  },
  {
    title: 'Our vision',
    desc: 'To be the digital infrastructure partner that local ISPs, retail networks and financial institutions rely on as they grow across the region.',
  },
  {
    title: 'Our values',
    desc: 'Integrity, technical precision, transparent SLAs, and carrier neutrality across every interconnection and peering agreement.',
  },
];

const milestones = [
  {
    year: '2023',
    title: 'Company founded',
    desc: 'Techne was established in Manila to reduce local ISP dependence on single carriers and to improve routing latency.',
  },
  {
    year: '2024',
    title: 'Peering deployed',
    desc: 'We integrated with major local exchanges, including PHOpenIX, and launched dedicated peering paths.',
  },
  {
    year: '2025',
    title: 'Backbone expansion',
    desc: 'Backbone capacity expanded to more than 200 Gbps.',
  },
  {
    year: '2026',
    title: 'Colocation and virtual services',
    desc: 'We launched colocation offerings and software-defined edge routing.',
  },
];

export const About: React.FC = () => (
  <>
    <section className="bg-paper-2 border-b border-rule">
      <div className="wrap py-12 md:py-16">
        <h1 className="heading-1">About Techne</h1>
        <p className="lede mt-4">
          We are a carrier-neutral network engineering and digital infrastructure firm. We design, deploy and manage the networks that connect local businesses, ISPs and platforms to the global internet.
        </p>
      </div>
    </section>

    <section aria-label="Company facts" className="bg-navy text-white">
      <dl className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 py-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-[1.625rem] font-semibold tracking-tight leading-tight tabular-nums">{stat.value}</dd>
            <dt className="text-[0.875rem] text-white/70 mt-1">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>

    <section className="section bg-paper">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-14">
        <h2 className="heading-2">What guides our work</h2>
        <div className="border-t-2 border-ink">
          {values.map((value) => (
            <div key={value.title} className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] gap-x-8 gap-y-1 py-5 border-b border-rule">
              <h3 className="heading-3">{value.title}</h3>
              <p className="body-copy">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section bg-paper-2 border-t border-rule">
      <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-14">
        <h2 className="heading-2">Company history</h2>
        <div className="border-t-2 border-ink">
          {milestones.map((milestone) => (
            <div key={milestone.year} className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-6 py-5 border-b border-rule">
              <span className="font-data text-[1.0625rem] font-medium text-accent">{milestone.year}</span>
              <div>
                <h3 className="heading-3">{milestone.title}</h3>
                <p className="body-copy mt-1">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <ClosingCTA />
  </>
);
