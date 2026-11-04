import React from 'react';
import { LOCATIONS } from '../content/site';
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

export const Colocation: React.FC = () => (
  <ServiceLayout
    eyebrow="Data center"
    title="Colocation"
    lead="Rack space with redundant power and controlled cooling for your network equipment, in facilities where you can cross-connect to carriers and to the Techne network."
    focus="colocation"
    related={['ip-transit', 'vxc', 'content']}
    meta={[
      { label: 'Space', value: '1U to 42U' },
      { label: 'Power', value: '1 to 5 kW, A+B feeds' },
      { label: 'Cooling', value: 'N+1' },
      { label: 'Remote hands', value: '24/7' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <HighlightsPanel
        heading="What is included"
        sub="Suitable for ISP core and edge equipment, DNS, monitoring and security platforms."
        items={[
          'A+B redundant power from separate UPS systems',
          'Carrier-neutral cross-connects to major local fiber providers',
          'On-net access to Techne IP Transit and peering',
          'Precision N+1 cooling with hot and cold aisle layouts',
          '24/7 smart-hands engineering on site',
          'CCTV, biometric access and 24/7 facility security',
        ]}
      />

      <section>
        <SectionTitle title="Cabinet options" intro="Start with a single server slot and move up as your deployment grows." />
        <DataTable
          headers={['Option', 'Space', 'Suits']}
          rows={[
            ['Server slot', '1U', 'A standard rack server'],
            ['Quarter cabinet', '10U', 'A secure partition in a shared cabinet'],
            ['Half cabinet', '20U', 'Growing enterprise and ISP deployments'],
            ['Full cabinet', '42U', 'A dedicated, full-height locked cabinet'],
          ]}
        />
        <p className="body-copy mt-4">Power is allocated at 1, 2, 3 or 5 kW. Contact us for requirements above this.</p>
      </section>

      <section>
        <SectionTitle title="Colocation locations" />
        <DataTable
          headers={['City', 'Facilities']}
          rows={LOCATIONS.filter((location) => location.colocation).map((location) => [
            location.city,
            location.facilities.join(', '),
          ])}
        />
      </section>

      <section>
        <SectionTitle title="Facility specifications" />
        <SpecTable
          rows={[
            { k: 'Power', v: 'A+B feeds, redundant UPS, dual diesel generators with 72-hour fuel storage' },
            { k: 'Cooling', v: 'Precision N+1 with hot and cold aisle layouts' },
            { k: 'Environment', v: '20 to 24°C, 40 to 60% humidity' },
            { k: 'Fire suppression', v: 'Gas-based, FM-200 or equivalent' },
            { k: 'Cabling', v: 'Underfloor pathways for power and fiber' },
            { k: 'Security', v: '24/7 on-site staff, CCTV and biometric access' },
            { k: 'Cross-connects', v: 'Carrier-neutral to major local fiber providers' },
            { k: 'Remote hands', v: '24/7 smart-hands engineering' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="How we deliver" intro="From space and power planning to live cross-connects and ongoing remote hands." />
        <ProcessSteps steps={DEFAULT_PROCESS} />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Is the facility carrier-neutral?',
              a: 'Yes. You can cross-connect to major local fiber providers as well as to Techne transit and peering, so you are not tied to one carrier.',
            },
            {
              q: 'What power redundancy is provided?',
              a: 'A+B power feeds backed by separate UPS systems and generator backup, so a single failure does not take your equipment offline.',
            },
            {
              q: 'Do you offer remote hands?',
              a: 'Yes. Smart-hands engineers are available 24/7 for installs, reboots, cabling and on-site troubleshooting.',
            },
            {
              q: 'What if I need a connection to another facility?',
              a: 'A Virtual Cross Connect links your cabinet to a port in another facility over the Techne fabric, without a new fiber run.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
