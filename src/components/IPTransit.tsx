import React from 'react';
import {
  ServiceLayout,
  HighlightsPanel,
  SectionTitle,
  ProcessSteps,
  SpecTable,
  DataTable,
  FAQ,
  DEFAULT_PROCESS,
} from './ServiceLayout';

export const IPTransit: React.FC = () => (
  <ServiceLayout
    eyebrow="Connectivity"
    title="IP Transit"
    lead="Full-table BGP upstream for networks that run their own routing. You bring your ASN and IP resources, and we carry your traffic to the global internet over diverse paths."
    focus="ip-transit"
    related={['content', 'colocation', 'vrouter']}
    meta={[
      { label: 'Delivery', value: 'BGP with your ASN' },
      { label: 'Port speeds', value: '1 to 100 Gbps' },
      { label: 'Availability SLA', value: '99.9%' },
      { label: 'Provisioning', value: '5 to 10 business days' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <HighlightsPanel
        heading="What is included"
        sub="For ISPs, hosting providers, content networks and enterprises with their own ASN."
        items={[
          'Full-table BGP for IPv4 and IPv6, with a default route as an option',
          'RPKI validation and prefix filtering for safer routing',
          'Committed-rate or 95th-percentile burstable billing',
          'Diverse upstream paths for resilience',
          'Global reachability across multiple carriers',
          '24/7 NOC support',
        ]}
      />

      <section>
        <SectionTitle
          title="IP Transit or Content?"
          intro="Many networks use both. Transit gives you reach to everything, and Content moves your heaviest traffic onto a closer, more direct path."
        />
        <DataTable
          headers={['', 'IP Transit', 'Content']}
          rows={[
            ['Reaches', 'The entire internet', 'CDN caches and content networks'],
            ['Best for', 'All traffic, as your default route', 'Streaming, gaming and software downloads'],
            ['Effect on your network', 'Provides your upstream capacity', 'Reduces the load on your upstream capacity'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Technical specifications" />
        <SpecTable
          rows={[
            { k: 'Routing', v: 'Full-table BGP for IPv4 and IPv6, default route optional' },
            { k: 'Port options', v: '1G, 10G, 25G and 100G over single-mode fiber' },
            { k: 'Billing', v: 'Committed rate or 95th-percentile burstable' },
            { k: 'Requirements', v: 'Public ASN and your own IPv4 and IPv6 resources' },
            { k: 'Security', v: 'RPKI ROA validation and prefix filtering' },
            { k: 'Redundancy', v: 'Dual-upstream and diverse-path options' },
            { k: 'SLA', v: '99.9% availability, 24/7 NOC support' },
            { k: 'Provisioning', v: 'Typically 5 to 10 business days' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="How we deliver" intro="A predictable path from first assessment to a monitored circuit." />
        <ProcessSteps steps={DEFAULT_PROCESS} />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Do I need my own ASN and IP space?',
              a: 'For full BGP transit, yes. You need a public ASN and your own IPv4 and IPv6 resources. If you are starting out, we can advise on APNIC registration and interim addressing.',
            },
            {
              q: 'What port speeds are available?',
              a: 'We deliver 1G through 100G on single-mode fiber, with committed-rate or burstable billing depending on your traffic profile.',
            },
            {
              q: 'How is bandwidth billed?',
              a: 'You can choose a fixed committed rate or 95th-percentile usage-based billing, whichever better matches how your traffic peaks.',
            },
            {
              q: 'How long does provisioning take?',
              a: 'Typically 5 to 10 business days once the cross-connect and LOA/CFA paperwork are in place.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
