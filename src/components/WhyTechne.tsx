import React from 'react';
import { motion } from 'framer-motion';
import { Eyebrow } from './ServiceLayout';

const features = [
  {
    title: 'Unmatched Expertise',
    desc: 'Years of experience in BGP routing, carrier-grade NAT, and complex core network design for ISPs and enterprises across the Philippines and APAC.',
  },
  {
    title: 'Regulatory Compliance',
    desc: 'Fully aligned with NTC mandates including Protective DNS (PDNS) integration and data privacy requirements for telecoms and financial institutions.',
  },
  {
    title: 'High Performance',
    desc: 'Deploying 100G+ backbone fabrics and optimized CDN integrations for ultra-low latency service delivery across multiple exchange points.',
  },
  {
    title: 'Dedicated Support',
    desc: 'Our NOC and engineering teams provide proactive monitoring and rapid incident response — targeting 99.99% SLA uptime for all managed environments.',
  },
  {
    title: 'Future-Proof Scaling',
    desc: 'Architectures designed to grow with your subscriber base, from initial setup to multi-gigabit expansion without topology rework.',
  },
  {
    title: 'Enterprise Value',
    desc: 'Carrier-grade reliability at cost-effective price points, specifically calibrated for the Philippines market and local regulatory landscape.',
  },
];

const reviews = [
  {
    name: 'Engr. Emmanuel Santos',
    initials: 'ES',
    role: 'Chief Network Architect',
    company: 'Royal Cable Vision',
    text: "Techne's expertise in BGP routing and local exchange peering helped us optimize our gateway latency by over 30%. Their support is unmatched.",
  },
  {
    name: 'Ma. Cristina Valenzuela',
    initials: 'CV',
    role: 'IT Infrastructure Director',
    company: 'Vanguard Retail Group',
    text: 'Setting up our private WAN and colocation with Techne was seamless. Their team handled NTC compliance and firewall configurations perfectly.',
  },
  {
    name: 'Atty. Ronaldo G. Tecson',
    initials: 'RT',
    role: 'CTO & Co-Founder',
    company: 'FinTech Pilipinas',
    text: "With Techne's Protective DNS integration, we secured our cloud infrastructure and met BSP compliance requirements ahead of schedule.",
  },
];

export const WhyTechne: React.FC = () => {
  return (
    <section className="py-24 bg-paper">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-rule pb-10 mb-12"
        >
          <Eyebrow className="mb-5">Why Techne</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight leading-tight max-w-lg">
            The Techne Advantage
          </h2>
          <p className="font-body text-[1rem] text-ink-2 leading-relaxed mt-3 max-w-md">
            Precision engineering and local expertise for your digital foundation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 divide-rule mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`py-8 pr-0 md:pr-10 ${i % 3 !== 2 ? 'md:border-r md:border-rule' : ''} ${i < 3 ? 'lg:border-b lg:border-rule pb-8' : 'pt-8'}`}
            >
              <span className="font-mono text-sm text-ink-2/50 block mb-3">
                0{i + 1}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="border-t border-rule pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Eyebrow className="mb-5">Testimonials</Eyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
              Client Testimonials
            </h2>
            <p className="font-body text-[1rem] text-ink-2 mt-2">
              ISPs, telcos, and financial institutions scaling their networks with Techne.
            </p>
          </motion.div>

          <div className="divide-y divide-rule">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: i * 0.06 }}
                className="py-8 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-sm shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-ink">{review.name}</p>
                    <p className="font-body text-xs text-ink-2 mt-0.5">{review.role}</p>
                    <p className="font-mono text-xs text-accent mt-0.5">{review.company}</p>
                  </div>
                </div>

                <blockquote className="font-body text-[1rem] text-ink-2 leading-relaxed self-center">
                  "{review.text}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
