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

export const DIA: React.FC = () => {
  return (
    <ServiceLayout
      eyebrow="Internet Services"
      title="Dedicated Internet Access"
      lead="Symmetrical, high-speed internet connectivity reserved exclusively for your business. Unlike broadband, our DIA provides guaranteed bandwidth and enterprise-level service reliability."
      meta={[
        { label: 'Profile', value: 'Symmetrical' },
        { label: 'Capacity', value: '10 Mbps–10 Gbps' },
        { label: 'Contention', value: '1:1 dedicated' },
        { label: 'SLA', value: '99.9% uptime' },
      ]}
    >
      <div className="space-y-16 md:space-y-20">
        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Bandwidth that is always yours"
            intro="A dedicated, non-contended circuit with identical upload and download speeds and a hard SLA, which is the connectivity production workloads and cloud operations depend on."
          />
          <FeatureGrid
            items={[
              { title: 'Symmetrical Speed', desc: 'Identical upload and download speeds for cloud-heavy operations.' },
              { title: 'SLA Guaranteed', desc: 'Industry-leading service level agreements for uptime and latency.' },
            ]}
          />
        </section>

        <section>
          <HighlightsPanel
            heading="Service Highlights"
            items={[
              'Guaranteed symmetrical bandwidth, no contention',
              'Carrier-grade SLA with 99.9% uptime commitment',
              'Scalable from 10 Mbps to 10 Gbps dedicated circuits',
              'Static IPv4 allocation, IPv6 on request',
              'Priority routing for production and cloud workloads',
              '4-hour mean-time-to-repair target',
            ]}
          />
        </section>

        <section>
          <SectionTitle
            eyebrow="Engagement"
            title="How we deliver"
            intro="From site survey to a monitored, SLA-backed circuit on a predictable timeline."
          />
          <ProcessSteps steps={DEFAULT_PROCESS} />
        </section>

        <section>
          <SectionTitle eyebrow="Datasheet" title="Technical specifications" />
          <SpecTable
            rows={[
              { k: 'Profile', v: 'Symmetrical, 1:1 non-contended' },
              { k: 'Capacity', v: '10 Mbps – 10 Gbps' },
              { k: 'Handoff', v: 'Ethernet (RJ45 / SFP / SFP+)' },
              { k: 'IP allocation', v: 'Static IPv4 /30 to /28; IPv6 on request' },
              { k: 'Availability SLA', v: '99.9% uptime, 24/7 monitoring' },
              { k: 'MTTR target', v: '4-hour mean time to repair' },
              { k: 'Provisioning', v: '5–15 business days (location dependent)' },
            ]}
          />
        </section>

        <section>
          <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
          <FAQ
            items={[
              {
                q: 'How is DIA different from broadband?',
                a: 'DIA is dedicated and symmetrical. You get your full committed bandwidth at all times with no contention, backed by an SLA. Broadband is shared and best-effort with no guarantees.',
              },
              {
                q: 'Can I get static IP addresses?',
                a: 'Yes. We provide static IPv4 blocks from /30 to /28, with IPv6 available on request.',
              },
              {
                q: 'Is there a service level agreement?',
                a: 'Yes. We commit to 99.9% availability with a 4-hour mean-time-to-repair target and 24/7 support.',
              },
              {
                q: 'Can I scale bandwidth later?',
                a: 'Circuits scale from 10 Mbps to 10 Gbps, and most upgrades are a configuration change rather than a re-install.',
              },
            ]}
          />
        </section>
      </div>
    </ServiceLayout>
  );
};
