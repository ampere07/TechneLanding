import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    number: '01',
    title: 'Internet Services',
    desc: 'Reliable, high-speed fiber internet for businesses. IP Transit, Dedicated Internet Access (DIA), and burstable bandwidth options with 99.9% SLA.',
  },
  {
    number: '02',
    title: 'Network Consulting',
    desc: 'Expert guidance on infrastructure design, BGP routing architecture, peering strategy, and complex core network optimization for ISPs and enterprises.',
  },
  {
    number: '03',
    title: 'SD-WAN Solutions',
    desc: 'Software-defined wide area network management with centralized policy control, traffic prioritization, and zero-touch provisioning.',
  },
  {
    number: '04',
    title: 'Cloud Connectivity',
    desc: 'Secure, low-latency direct paths to AWS, Azure, and Google Cloud. Eliminate public internet dependency for production workloads.',
  },
  {
    number: '05',
    title: 'Managed Services',
    desc: 'Proactive 24/7 monitoring, configuration management, and incident response for your entire network environment.',
  },
  {
    number: '06',
    title: 'Security Audits',
    desc: 'Comprehensive vulnerability assessments, Protective DNS integration, and security infrastructure planning aligned with NTC mandates.',
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-paper-2">
      <div className="container mx-auto px-6 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-rule pb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight max-w-lg">
            Comprehensive IT Infrastructure
          </h2>
          <p className="font-body text-[1rem] text-ink-2 leading-relaxed max-w-sm">
            A full suite of networking and internet services designed to keep your business running in the digital age.
          </p>
        </motion.div>

        <div className="divide-y divide-rule">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-[5rem_1fr_2fr] gap-4 md:gap-8 py-7 group"
            >
              <span className="font-mono text-sm text-ink-2/60 self-start pt-0.5">
                {service.number}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink self-start">
                {service.title}
              </h3>
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
