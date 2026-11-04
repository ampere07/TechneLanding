import React from 'react';
import { LOCATION, LOCATION_LABEL } from '../content/site';
import {
  ServiceLayout,
  FeatureGrid,
  HighlightsPanel,
  SectionTitle,
  SpecTable,
  DataTable,
  FAQ,
} from './ServiceLayout';

export const MetroE: React.FC = () => (
  <ServiceLayout
    eyebrow="Connectivity"
    title="Metro-E"
    lead="A Layer 2 Ethernet transport service that carries your traffic from point A to point B. Link two of your sites, or a site and Vitro Makati 2, over one private circuit."
    focus="metro-e"
    related={['vxc', 'ip-transit', 'colocation']}
    meta={[
      { label: 'Network layer', value: 'Layer 2' },
      { label: 'Topology', value: 'Point A to point B' },
      { label: 'Interface', value: 'Ethernet handoff' },
      { label: 'Data center', value: LOCATION.facility },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <HighlightsPanel
        heading="What you get"
        sub="One transport circuit between two endpoints, with Ethernet handed to your equipment at each end."
        items={[
          'A dedicated Layer 2 path from point A to point B',
          'Ethernet handoff, so your routers and switches connect as they do on any LAN',
          'Your VLANs and routing stay under your control',
          'Ends can be your sites, or one of your sites and Vitro Makati 2',
          'Engineers scope the route and confirm both endpoints before you order',
        ]}
      />

      <section>
        <SectionTitle title="Common uses" />
        <FeatureGrid
          items={[
            { title: 'Link two sites', desc: 'Join a head office and a branch, or two points of presence, as one Layer 2 network.' },
            { title: 'Reach the data center', desc: 'Carry traffic from your site to your equipment, or to the Techne network, at Vitro Makati 2.' },
            { title: 'Backhaul for ISPs', desc: 'Move subscriber traffic from an access site back to your core.' },
            { title: 'Connect to a carrier or partner', desc: 'Deliver a circuit from your location to a carrier or partner that is on the fabric.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle
          title="Metro-E or Virtual Cross Connect?"
          intro="Both are Layer 2 and point to point. The difference is where the two ends are."
        />
        <DataTable
          headers={['', 'Metro-E', 'Virtual Cross Connect']}
          rows={[
            ['What it does', 'Carries traffic across distance, from one location to another', 'Joins two ports that are already on the Techne fabric'],
            ['Where the ends are', 'Your site, and another site or the data center', `Both ends in ${LOCATION.facility}`],
            ['Physical work', 'A circuit to each endpoint that is not already connected', 'None, it is configured on the fabric'],
            ['Suits', 'Linking sites or reaching the data center', 'Private links between networks already in the facility'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Service details" />
        <SpecTable
          rows={[
            { k: 'Network layer', v: 'Layer 2 Ethernet' },
            { k: 'Topology', v: 'Point to point, from point A to point B' },
            { k: 'Handoff', v: 'Ethernet, at each end' },
            { k: 'Routing', v: 'Handled by you, on your own equipment' },
            { k: 'Data center', v: LOCATION_LABEL },
            { k: 'Capacity and pricing', v: 'Scoped to your route. Request a quote for current options.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'What do I need to tell you to get a quote?',
              a: 'The address or building at point A and at point B, the capacity you need, and when you need it. Our engineers confirm the route and what can be delivered.',
            },
            {
              q: 'Can I run my own routing and VLANs over it?',
              a: 'Yes. Metro-E carries Ethernet between your two ends, and you run routing and VLANs on your own equipment.',
            },
            {
              q: 'Does one end have to be at Vitro Makati 2?',
              a: 'No. It can join two of your own sites. A common use is reaching your equipment or the Techne network at Vitro Makati 2.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
