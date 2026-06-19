import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '200+', unit: 'Gbps', label: 'Backbone Capacity' },
  { value: '5+', unit: '', label: 'Regional Edge Nodes' },
  { value: '99.99%', unit: '', label: 'Guaranteed SLA' },
  { value: '50+', unit: '', label: 'ISP & Enterprise Clients' },
];

const values = [
  {
    title: 'Our Mission',
    desc: 'To democratize high-performance connectivity in the Philippines by building carrier-neutral exchange paths and robust edge services for local ISPs and enterprises.',
  },
  {
    title: 'Our Vision',
    desc: 'To become the leading digital infrastructure backbone empowering local ISPs, retail networks, and financial institutions to scale infinitely across the region.',
  },
  {
    title: 'Our Values',
    desc: 'Integrity, technical precision, transparency in SLAs, and a commitment to carrier neutrality across all interconnected nodes and peering agreements.',
  },
];

const team = [
  {
    name: 'John Doe',
    role: 'Founder & Managing Director',
    bio: 'Telecom pioneer with 20+ years of digital infrastructure design across Southeast Asia. Dedicated to scaling local peering fabrics.',
    initials: 'JD',
  },
  {
    name: 'John Doe',
    role: 'Chief Technology Officer',
    bio: 'Peering veteran and BGP protocol expert. Previously designed core routing systems for major telecommunications conglomerates in the APAC region.',
    initials: 'JD',
  },
  {
    name: 'John Doe',
    role: 'Head of Infrastructure Operations',
    bio: 'Specializes in carrier relations, NTC regulatory compliance, and datacenter facility operations. Ensures 24/7 SLA uptime standards.',
    initials: 'JD',
  },
];

const milestones = [
  { year: '2023', title: 'Company Founded', desc: 'Techne was established in Manila to resolve local ISP carrier dependency and improve routing latency issues.' },
  { year: '2024', title: 'PHOpenIX & Peering Deployed', desc: 'Integrated with major local exchanges and launched dedicated peering paths, reducing domestic routing delays by 40%.' },
  { year: '2025', title: 'Backbone Expansion', desc: 'Expanded network backbone capacity to 200+ Gbps and launched regional edge nodes in Cebu and Davao.' },
  { year: '2026', title: 'SD-WAN & Edge Services', desc: 'Launched custom Colocation offerings and software-defined edge routers, enabling true hybrid cloud integrations.' },
];

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-paper">

      {/* Hero */}
      <section className="pt-36 pb-16 bg-paper border-b border-rule">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display font-bold text-ink tracking-tight leading-tight" style={{ fontSize: 'var(--text-display-s)' }}>
              Architecting Philippine Connectivity
            </h1>
            <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mt-6 max-w-2xl">
              We are a carrier-neutral network engineering and digital infrastructure firm. We design, deploy, and manage the core backbones that connect local businesses, ISPs, and platforms to the global network fabric.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 bg-paper-2 border-b border-rule">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-rule">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-left md:pl-8 first:pl-0">
                <div className="font-mono font-semibold text-ink" style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}>
                  {stat.value}<span className="text-ink-2 text-sm ml-1">{stat.unit}</span>
                </div>
                <div className="font-body text-xs text-ink-2 uppercase tracking-[0.08em] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-paper border-b border-rule">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="font-display text-2xl font-bold text-ink mb-10 tracking-tight">Mission, Vision & Values</h2>
          <div className="divide-y divide-rule">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: idx * 0.05 }}
                className="py-7 grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 md:gap-10"
              >
                <h3 className="font-display font-semibold text-base text-ink">{val.title}</h3>
                <p className="font-body text-[1rem] text-ink-2 leading-relaxed max-w-2xl">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-paper-2 border-b border-rule">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="font-display text-2xl font-bold text-ink mb-10 tracking-tight">Milestones</h2>
          <div className="divide-y divide-rule">
            {milestones.map((m, idx) => (
              <div key={idx} className="py-7 grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-4 md:gap-10">
                <span className="font-mono font-semibold text-accent" style={{ fontSize: 'var(--text-lg)' }}>
                  {m.year}
                </span>
                <div>
                  <h4 className="font-display font-semibold text-base text-ink mb-1">{m.title}</h4>
                  <p className="font-body text-sm text-ink-2 leading-relaxed max-w-2xl">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-paper">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="font-display text-2xl font-bold text-ink mb-10 tracking-tight">Leadership Team</h2>
          <div className="divide-y divide-rule">
            {team.map((member, idx) => (
              <div key={idx} className="py-7 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-sm shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-ink">{member.name}</p>
                    <p className="font-mono text-xs text-accent mt-0.5">{member.role}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-ink-2 leading-relaxed self-center max-w-2xl">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
