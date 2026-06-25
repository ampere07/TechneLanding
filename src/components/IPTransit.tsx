import React from 'react';
import {
  ServiceLayout,
  FeatureGrid,
  HighlightsPanel,
  SectionTitle,
  ProcessSteps,
  SpecTable,
  FAQ,
  DEFAULT_PROCESS,
} from './ServiceLayout';

export const IPTransit: React.FC = () => {
  return (
    <ServiceLayout
      eyebrow="Internet Services"
      title="IP Transit"
      lead="Techne offers IP Transit services for networks that need reliable internet connectivity, global reachability, and scalable bandwidth — delivered over a carrier-neutral backbone with full BGP control."
      meta={[
        { label: 'Delivery', value: 'BGP / ASN' },
        { label: 'Capacity', value: '1–100 Gbps' },
        { label: 'SLA', value: '99.9% uptime' },
        { label: 'Best for', value: 'ISP · Enterprise' },
      ]}
    >
      <div className="space-y-16 md:space-y-20">
        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Upstream connectivity built for growth"
            intro="Full-table BGP transit with IPv4 and IPv6, diverse upstream paths, and burstable capacity — engineered for operators that need the global routing table, not just an internet connection."
          />
          <FeatureGrid
            items={[
              { title: 'Best For', desc: 'ISPs, enterprise networks, content networks, hosting providers, and network operators.' },
              { title: 'Routing Ready', desc: 'Suitable for organizations with ASN, IP resources, and BGP connectivity requirements.' },
              { title: 'Operational Focus', desc: 'Built for stable upstream connectivity and practical network growth.' },
              { title: 'Scalable Service', desc: 'Designed to support bandwidth growth and future connectivity expansion.' },
            ]}
          />
        </section>

        <section>
          <HighlightsPanel
            heading="Service Highlights"
            items={[
              'Full-table BGP (IPv4 + IPv6), default route optional',
              'RPKI-validated route origin for safer routing',
              'Committed-rate or 95th-percentile burstable billing',
              'Diverse upstream paths for resilience',
              'Global reachability across multiple carriers',
              'Supports networks preparing for higher capacity',
            ]}
          />
        </section>

        <section>
          <SectionTitle
            eyebrow="Engagement"
            title="How we deliver"
            intro="A predictable path from first assessment to a fully operational, monitored circuit."
          />
          <ProcessSteps steps={DEFAULT_PROCESS} />
        </section>

        <section>
          <SectionTitle eyebrow="Datasheet" title="Technical specifications" />
          <SpecTable
            rows={[
              { k: 'Routing', v: 'Full-table BGP (IPv4 + IPv6); default route optional' },
              { k: 'Port options', v: '1G, 10G, 25G, 100G over single-mode fiber' },
              { k: 'Billing', v: 'Committed rate (CDR) or 95th-percentile burstable' },
              { k: 'Requirements', v: 'Public ASN and your own IPv4/IPv6 resources' },
              { k: 'Security', v: 'RPKI ROA validation; prefix filtering' },
              { k: 'Redundancy', v: 'Dual-upstream and diverse-path options' },
              { k: 'SLA', v: '99.9% availability, 24/7 NOC support' },
              { k: 'Provisioning', v: 'Typically 5–10 business days' },
            ]}
          />
        </section>

        <section>
          <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
          <FAQ
            items={[
              {
                q: 'Do I need my own ASN and IP space?',
                a: 'For full BGP transit, yes — you need a public ASN and your own IPv4/IPv6 resources. If you are just starting out, we can advise on APNIC/PHNOG registration and interim addressing.',
              },
              {
                q: 'What port speeds are available?',
                a: 'We deliver 1G through 100G on single-mode fiber, with either committed-rate or burstable billing depending on your traffic profile.',
              },
              {
                q: 'How is bandwidth billed?',
                a: 'You can choose a fixed committed rate or 95th-percentile usage-based billing — whichever better matches how your traffic peaks.',
              },
              {
                q: 'How long does provisioning take?',
                a: 'Typically 5–10 business days once the cross-connect and LOA/CFA paperwork are in place.',
              },
            ]}
          />
        </section>
      </div>
    </ServiceLayout>
  );
};
