import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import {
  ServiceLayout,
  HighlightsPanel,
  SectionTitle,
  ProcessSteps,
  SpecTable,
  FAQ,
} from './ServiceLayout';

const CONSULTING_PROCESS = [
  { title: 'Discover', desc: 'We map your current architecture, traffic, problem areas and business objectives.' },
  { title: 'Design', desc: 'We produce high and low level designs, IP plans and routing policy that you own.' },
  { title: 'Implement', desc: 'We support or lead the rollout, with cutover planning and validation testing.' },
  { title: 'Transfer', desc: 'We hand over full documentation and SOPs, and train your team on them.' },
];

const SPECIALIST_WORK = [
  { name: 'Core network configuration', desc: 'BGP architecture and backbone routing', path: PANEL_IDS.CORE_CONFIG },
  { name: 'Distribution configuration', desc: 'OSPF, MPLS and aggregation design', path: PANEL_IDS.DIST_CONFIG },
  { name: 'System integration', desc: 'Monitoring and platform integration', path: PANEL_IDS.SYSTEM_INTEGRATION },
  { name: 'Protective DNS integration', desc: 'NTC-aligned PDNS deployment', path: PANEL_IDS.PROTECTIVE_DNS },
];

export const NetworkConsulting: React.FC = () => (
  <ServiceLayout
    eyebrow="Advisory"
    title="Network Consulting"
    lead="Vendor-neutral design, routing reviews, audits and compliance support for ISPs, telcos, enterprises and financial institutions, delivered with documentation your team keeps."
    focus="consulting"
    related={['ip-transit', 'colocation', 'vrouter']}
    meta={[
      { label: 'Engagement types', value: 'Advisory, audit, retainer' },
      { label: 'Typical duration', value: '2 to 8 weeks' },
      { label: 'Focus', value: 'BGP and core design' },
      { label: 'Compliance', value: 'NTC and Protective DNS' },
    ]}
  >
    <div className="space-y-14 md:space-y-16">
      <HighlightsPanel
        heading="What we cover"
        items={[
          'BGP routing architecture review and peering strategy',
          'Core and distribution network topology planning',
          'NTC regulatory compliance and Protective DNS integration',
          'Incident response planning and NOC workflow design',
          'Capacity planning and growth roadmaps',
          'Vendor-neutral across Cisco, Juniper, MikroTik and Arista',
        ]}
      />

      <section>
        <SectionTitle title="Specialist engagements" intro="Focused projects for a specific part of your network." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
          {SPECIALIST_WORK.map((item) => (
            <Link key={item.name} to={`/${item.path}`} className="group bg-paper p-5 flex items-center justify-between gap-4">
              <span>
                <span className="block text-[1rem] font-semibold text-ink group-hover:text-accent transition-colors duration-150">{item.name}</span>
                <span className="block text-[0.875rem] text-ink-2 mt-0.5">{item.desc}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-accent" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="How an engagement works" intro="Most engagements run two to eight weeks and end with documentation your team fully owns." />
        <ProcessSteps steps={CONSULTING_PROCESS} />
      </section>

      <section>
        <SectionTitle title="Engagement details" />
        <SpecTable
          rows={[
            { k: 'Engagement types', v: 'Advisory, design, audit and retainer' },
            { k: 'Typical duration', v: '2 to 8 weeks per engagement' },
            { k: 'Deliverables', v: 'High and low level designs, IP plan, routing policy and SOPs' },
            { k: 'Focus areas', v: 'BGP, MPLS, core and distribution, security and NOC' },
            { k: 'Vendors', v: 'Cisco, Juniper, MikroTik, Arista and others' },
            { k: 'Compliance', v: 'NTC, Protective DNS and data privacy' },
            { k: 'Handover', v: 'Documentation and knowledge transfer' },
          ]}
        />
      </section>

      <section>
        <SectionTitle title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'What does a typical engagement look like?',
              a: 'We begin with an assessment, produce high and low level designs, support implementation, and finish with documentation and knowledge transfer. Most engagements run two to eight weeks.',
            },
            {
              q: 'Can you work with our existing vendors?',
              a: 'Yes. We work across Cisco, Juniper, MikroTik, Arista and others, so our recommendations fit the hardware you already run.',
            },
            {
              q: 'Do you help with NTC compliance?',
              a: 'Yes, including Protective DNS integration and data-privacy alignment for telcos, ISPs and financial institutions.',
            },
            {
              q: 'Do you offer ongoing support?',
              a: 'We offer retainer-based advisory, and we can design your NOC workflows and incident response procedures for the long term.',
            },
          ]}
        />
      </section>
    </div>
  </ServiceLayout>
);
