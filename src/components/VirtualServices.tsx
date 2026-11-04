import React from 'react';
import { LOCATION_NAMES } from '../content/site';
import {
  ServiceLayout,
  FeatureGrid,
  HighlightsPanel,
  SectionTitle,
  SpecTable,
  DataTable,
  FAQ,
} from './ServiceLayout';

export const VirtualCrossConnect: React.FC = () => (
  <ServiceLayout
    eyebrow="Virtual services"
    title="Virtual Cross Connect"
    lead="A private Layer 2 connection between two ports on the Techne fabric. Reach a carrier, a partner or your own equipment in another facility without ordering a new fiber run."
    focus="vxc"
    related={['vswitch', 'vrouter', 'colocation']}
    meta={[
      { label: 'Network layer', value: 'Layer 2' },
      { label: 'Topology', value: 'Point to point' },
      { label: 'Delivery', value: 'On the Techne fabric' },
      { label: 'Locations', value: '5 cities' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <section>
        <SectionTitle title="Common uses" />
        <FeatureGrid
          items={[
            { title: 'Reach a carrier in another building', desc: 'Connect to a carrier or transit provider that is on the fabric, without being in the same facility.' },
            { title: 'Link your own sites', desc: 'Join your racks in two data centers with a private connection you control.' },
            { title: 'Connect privately to a partner', desc: 'Exchange traffic directly with a customer or supplier, away from the public internet.' },
            { title: 'Add a backup path', desc: 'Keep a second route to a critical site alongside your existing physical connection.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle
          title="Physical or virtual cross connect?"
          intro="A physical cross connect is often the right choice inside one building. A virtual one is useful when the two ends are far apart, or when connections change often."
        />
        <DataTable
          headers={['', 'Physical cross connect', 'Virtual Cross Connect']}
          rows={[
            ['What it is', 'A fiber patched between two cabinets', 'A logical circuit carried over the fabric'],
            ['Reach', 'Usually within one facility', 'Between facilities on the fabric'],
            ['How it is set up', 'On-site work and LOA/CFA paperwork', 'Configuration on the fabric'],
            ['Port use', 'One port for each connection', 'Several connections can share one port'],
            ['Suits', 'High, steady traffic between two racks', 'Connections across sites, or that may change'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Service details" />
        <SpecTable
          rows={[
            { k: 'Network layer', v: 'Layer 2' },
            { k: 'Topology', v: 'Point to point, between two ports' },
            { k: 'Routing', v: 'Handled by you, on your own equipment' },
            { k: 'Locations', v: LOCATION_NAMES },
            { k: 'Capacity and pricing', v: 'Scoped to your connection. Ask our engineers for current options.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Do I need a port on the Techne network first?',
              a: 'Each end of the connection lands on a port on the fabric. Our engineers can confirm what you need at each location.',
            },
            {
              q: 'How is this different from a Virtual Switch?',
              a: 'A Virtual Cross Connect joins exactly two ports. A Virtual Switch joins three or more ports or sites in a shared private LAN.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);

export const VirtualSwitch: React.FC = () => (
  <ServiceLayout
    eyebrow="Virtual services"
    title="Virtual Switch"
    lead="A private Layer 2 domain hosted on the Techne fabric. Join several ports, sites or partners as if they were all patched into the same switch."
    focus="vswitch"
    related={['vxc', 'vrouter', 'colocation']}
    meta={[
      { label: 'Network layer', value: 'Layer 2' },
      { label: 'Topology', value: 'Multipoint' },
      { label: 'Hardware needed', value: 'None added' },
      { label: 'Locations', value: '5 cities' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <section>
        <SectionTitle title="Common uses" />
        <FeatureGrid
          items={[
            { title: 'Extend a LAN across sites', desc: 'Carry the same private network between your racks and offices in different locations.' },
            { title: 'Private peering between partners', desc: 'Give a group of networks a shared LAN for exchanging traffic among themselves.' },
            { title: 'Consolidate connections', desc: 'Replace several point-to-point links with one switched domain that is simpler to run.' },
            { title: 'Connect to a Virtual Router', desc: 'Attach your sites to a hosted router on the same fabric and add routing without new hardware.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Virtual Switch or Virtual Cross Connect?" />
        <DataTable
          headers={['', 'Virtual Switch', 'Virtual Cross Connect']}
          rows={[
            ['Connects', 'Three or more ports or sites', 'Exactly two ports'],
            ['Topology', 'Multipoint', 'Point to point'],
            ['Adding a site', 'Attach another port to the same domain', 'Order another connection'],
            ['Suits', 'Groups of sites or partners', 'One private link'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Service details" />
        <SpecTable
          rows={[
            { k: 'Network layer', v: 'Layer 2' },
            { k: 'Topology', v: 'Multipoint, shared private LAN' },
            { k: 'Routing', v: 'Handled by you, or by a Virtual Router on the same fabric' },
            { k: 'Locations', v: LOCATION_NAMES },
            { k: 'Capacity and pricing', v: 'Scoped to your design. Ask our engineers for current options.' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Can other customers see my traffic?',
              a: 'No. A Virtual Switch is a private Layer 2 domain, and only the ports you attach to it are part of that domain.',
            },
            {
              q: 'Can a Virtual Switch span several cities?',
              a: 'Ask our engineers about your specific locations. They will confirm what the fabric can reach and how it will perform.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);

export const VirtualRouter: React.FC = () => (
  <ServiceLayout
    eyebrow="Virtual services"
    title="Virtual Router"
    lead="A hosted routing instance with BGP and dual-stack IPv4 and IPv6. Add routing at a location without buying or installing router hardware."
    focus="vrouter"
    related={['vswitch', 'ip-transit', 'consulting']}
    meta={[
      { label: 'Network layer', value: 'Layer 3' },
      { label: 'Resources', value: '1 to 8 vCPU' },
      { label: 'IP versions', value: 'IPv4 and IPv6' },
      { label: 'Management', value: 'Self or fully managed' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <HighlightsPanel
        heading="What is included"
        sub="For teams adding a site, a BGP session or a gateway without a hardware purchase."
        items={[
          'Enterprise routing with BGP support',
          'IPv4 and IPv6 dual stack',
          'Stateful packet filters and access logs',
          'Flow log export using NetFlow or IPFIX',
          'CPU and memory that can be resized as needs change',
          'Direct link to local internet peering through PHOpenIX',
        ]}
      />

      <section>
        <SectionTitle title="Capacity tiers" intro="Choose a tier that suits your routing table and traffic. You can resize later." />
        <DataTable
          headers={['Tier', 'vCPU', 'Memory']}
          rows={[
            ['Starter', '1 vCPU', '2 GB'],
            ['Professional', '2 vCPU', '4 GB'],
            ['Enterprise', '4 vCPU', '8 GB'],
            ['Carrier', '8 vCPU', '16 GB'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Management options" />
        <DataTable
          headers={['Option', 'What Techne handles']}
          rows={[
            ['Self-managed', 'The platform. You configure and run the router.'],
            ['Semi-managed', 'Configuration backups and updates.'],
            ['Fully managed', '24/7 engineer management of the router.'],
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Service details" />
        <SpecTable
          rows={[
            { k: 'Network layer', v: 'Layer 3, routed' },
            { k: 'Routing', v: 'BGP, with IPv4 and IPv6 dual stack' },
            { k: 'Security', v: 'Stateful packet filters and access logs' },
            { k: 'Visibility', v: 'NetFlow and IPFIX flow log export' },
            { k: 'Integrations', v: 'API control keys and an optional cloud-delivered DNS firewall' },
            { k: 'Locations', v: LOCATION_NAMES },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Can I run my own BGP sessions?',
              a: 'Yes. The Virtual Router supports BGP, so you can peer with upstreams and partners and set your own routing policy.',
            },
            {
              q: 'Can I move between capacity tiers?',
              a: 'Yes. CPU and memory can be resized as your routing table and traffic grow.',
            },
            {
              q: 'Who manages it?',
              a: 'That is your choice. You can run it yourself, have Techne handle backups and updates, or have our engineers manage it 24/7.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
