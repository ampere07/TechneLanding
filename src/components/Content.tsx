import React from 'react';
import { CONTENT_LOGOS } from '../content/logos';
import { CACHED_CONTENT, LOCATION_LABEL, PEERED_NETWORKS } from '../content/site';
import { LogoGrid } from './NetworkMap';
import {
  ServiceLayout,
  HighlightsPanel,
  SectionTitle,
  SpecTable,
  DataTable,
  FAQ,
} from './ServiceLayout';

export const Content: React.FC = () => (
  <ServiceLayout
    eyebrow="Connectivity"
    title="Content"
    lead="Direct access to CDN caches and content networks. Popular traffic reaches your subscribers over a shorter path and moves off your upstream links."
    focus="content"
    related={['ip-transit', 'colocation', 'vxc']}
    meta={[
      { label: 'Port speeds', value: '1, 10 or 100 Gbps' },
      { label: 'Commitment', value: '100 Mbps to 10 Gbps' },
      { label: 'Billing', value: 'Fixed or burstable' },
      { label: 'Contract terms', value: '12, 24 or 36 months' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <section>
        <SectionTitle
          title="Why networks buy content access"
          intro="A large share of subscriber traffic comes from a small number of CDNs and platforms. Serving that traffic closer to your network lowers latency and leaves your transit capacity free for everything else."
        />
        <LogoGrid logos={CONTENT_LOGOS} />
      </section>

      <section>
        <SectionTitle title="What you can reach" />
        <DataTable
          headers={['Access type', 'Networks']}
          rows={[
            ['Peered traffic', PEERED_NETWORKS.join(', ')],
            ['Cached content', CACHED_CONTENT.join(', ')],
            ['Regional exchanges', 'Expanded content through partner internet exchanges in Singapore and Hong Kong'],
          ]}
        />
      </section>

      <HighlightsPanel
        heading="What is included"
        items={[
          'Bilateral and multilateral peering through redundant route servers',
          'BGP community-based route control',
          'Private VLAN support for isolated traffic exchange',
          'Access to open-source mirror servers',
          'Fixed-bandwidth and burstable plans',
          `Available at ${LOCATION_LABEL}`,
        ]}
      />

      <section>
        <SectionTitle title="Plan details" />
        <SpecTable
          rows={[
            { k: 'Port speeds', v: '1 Gbps, 10 Gbps or 100 Gbps' },
            { k: 'Commitment', v: '100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps or 10 Gbps' },
            { k: 'Billing', v: 'Fixed bandwidth or burstable, usage-based' },
            { k: 'Contract terms', v: '12, 24 or 36 months' },
            { k: 'Location', v: LOCATION_LABEL },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Does Content replace IP Transit?',
              a: 'No. Content reaches CDNs and content networks only, so you still need transit for the rest of the internet. It reduces how much transit you need.',
            },
            {
              q: 'Do I need my own ASN?',
              a: 'Peering relies on BGP, so you will need a public ASN. Our engineers can advise you if you are still setting one up.',
            },
            {
              q: 'Can I use a burstable plan?',
              a: 'Yes. Plans are available as fixed bandwidth or as burstable, usage-based billing.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
