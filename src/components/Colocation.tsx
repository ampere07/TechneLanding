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

export const Colocation: React.FC = () => {
  return (
    <ServiceLayout
      eyebrow="Infrastructure Services"
      title="Colocation Services"
      lead="Techne provides colocation access for organizations that need to host network equipment in a reliable, connectivity-ready environment — with carrier-neutral cross-connects and 24/7 engineering support."
      meta={[
        { label: 'Power', value: 'A+B redundant' },
        { label: 'Cross-connect', value: 'Carrier-neutral' },
        { label: 'Support', value: '24/7 smart-hands' },
        { label: 'Best for', value: 'ISP core · edge' },
      ]}
    >
      <div className="space-y-16 md:space-y-20">
        <section>
          <SectionTitle
            eyebrow="Overview"
            title="A connectivity-ready home for your hardware"
            intro="Rack space with redundant power, controlled cooling, and direct cross-connects to major local fiber and to Techne's transit and peering fabric."
          />
          <FeatureGrid
            items={[
              { title: 'Equipment Hosting', desc: 'Routers, switches, servers, monitoring systems, DNS, and security appliances.' },
              { title: 'Network Presence', desc: 'Useful for ISP edge, core, interconnection, peering, and infrastructure expansion.' },
              { title: 'Infrastructure Ready', desc: 'Designed for operators that need better data center and network access.' },
              { title: 'Growth Focused', desc: 'Supports customers preparing for stronger connectivity and operational scale.' },
            ]}
          />
        </section>

        <section>
          <HighlightsPanel
            heading="Host critical network systems in a better environment"
            sub="Ideal for ISP core, edge, DNS, monitoring, and cybersecurity platforms."
            items={[
              'Carrier-neutral cross-connects with major local fiber providers',
              'A+B redundant power with separate UPS configurations',
              '24/7 smart-hands engineering support on-site',
              'On-net to Techne IP Transit and peering',
              'CCTV, biometric access, and 24/7 facility security',
              'Connectivity-ready cabinets for rapid deployment',
            ]}
          />
        </section>

        <section>
          <SectionTitle
            eyebrow="Engagement"
            title="How we deliver"
            intro="From space and power planning to live cross-connects and ongoing remote hands."
          />
          <ProcessSteps steps={DEFAULT_PROCESS} />
        </section>

        <section>
          <SectionTitle eyebrow="Datasheet" title="Facility specifications" />
          <SpecTable
            rows={[
              { k: 'Space', v: 'Quarter, half, and full racks; private cages' },
              { k: 'Power', v: 'A+B feeds, redundant UPS, generator backup' },
              { k: 'Cooling', v: 'N+1 with hot/cold aisle containment' },
              { k: 'Cross-connects', v: 'Carrier-neutral to major local fiber providers' },
              { k: 'Connectivity', v: 'On-net to Techne IP Transit and peering' },
              { k: 'Security', v: '24/7 on-site staff, CCTV, biometric access' },
              { k: 'Remote hands', v: '24/7 smart-hands engineering' },
            ]}
          />
        </section>

        <section>
          <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
          <FAQ
            items={[
              {
                q: 'Is the facility carrier-neutral?',
                a: 'Yes. You can cross-connect to major local fiber providers as well as to Techne’s own transit and peering fabric, so you are never locked to a single carrier.',
              },
              {
                q: 'What power redundancy is provided?',
                a: 'A+B power feeds backed by independent UPS systems and generator backup, so a single failure never takes your equipment offline.',
              },
              {
                q: 'Do you offer remote hands?',
                a: 'Yes — 24/7 smart-hands engineering for installs, reboots, cabling, and on-site troubleshooting.',
              },
              {
                q: 'What rack options are available?',
                a: 'From quarter racks through to private cages, all delivered as connectivity-ready cabinets for fast deployment.',
              },
            ]}
          />
        </section>
      </div>
    </ServiceLayout>
  );
};
