import React from 'react';
import {
  ServiceLayout,
  FeatureGrid,
  HighlightsPanel,
  SectionTitle,
  ProcessSteps,
  SpecTable,
  FAQ,
} from './ServiceLayout';

const CONSULTING_PROCESS = [
  { title: 'Discover', desc: 'We map your current architecture, traffic, pain points, and business objectives.' },
  { title: 'Design', desc: 'We produce high- and low-level designs, IP plans, and routing policy you own.' },
  { title: 'Implement', desc: 'We support or lead the rollout, with cutover planning and validation testing.' },
  { title: 'Transfer', desc: 'We hand over full documentation, SOPs, and knowledge transfer to your team.' },
];

export const NetworkConsulting: React.FC = () => {
  return (
    <ServiceLayout
      eyebrow="Advisory Services"
      title="Network Consulting"
      lead="Expert strategic guidance for your network architecture. We help businesses design, optimize, and manage complex networking environments to ensure maximum performance and security."
      meta={[
        { label: 'Engagement', value: 'Advisory' },
        { label: 'Focus', value: 'BGP · topology' },
        { label: 'Compliance', value: 'NTC · PDNS' },
        { label: 'Scope', value: 'Design → NOC' },
      ]}
    >
      <div className="space-y-16 md:space-y-20">
        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Vendor-neutral network engineering expertise"
            intro="From BGP and core topology to NTC compliance and NOC design — practical, documented guidance you can act on, across any vendor in your stack."
          />
          <FeatureGrid
            items={[
              { title: 'Design & Audit', desc: 'Comprehensive analysis of current infrastructure and future-proof design planning.' },
              { title: 'Managed Security', desc: 'Integrating advanced security protocols and monitoring into your network core.' },
            ]}
          />
        </section>

        <section>
          <HighlightsPanel
            heading="Consulting Scope"
            items={[
              'BGP routing architecture review and peering strategy',
              'Core and distribution network topology planning',
              'NTC regulatory compliance and Protective DNS integration',
              'Incident response planning and NOC workflow design',
              'Capacity planning and growth roadmaps',
              'Vendor-neutral across Cisco, Juniper, MikroTik, Arista',
            ]}
          />
        </section>

        <section>
          <SectionTitle
            eyebrow="Engagement"
            title="How an engagement works"
            intro="Most engagements run two to eight weeks, ending with documentation your team fully owns."
          />
          <ProcessSteps steps={CONSULTING_PROCESS} />
        </section>

        <section>
          <SectionTitle eyebrow="Datasheet" title="Engagement details" />
          <SpecTable
            rows={[
              { k: 'Engagement types', v: 'Advisory, design, audit, and retainer' },
              { k: 'Typical duration', v: '2–8 weeks per engagement' },
              { k: 'Deliverables', v: 'HLD / LLD, IP plan, routing policy, SOPs' },
              { k: 'Focus areas', v: 'BGP, MPLS, core/distribution, security, NOC' },
              { k: 'Vendors', v: 'Cisco, Juniper, MikroTik, Arista, and others' },
              { k: 'Compliance', v: 'NTC, Protective DNS, data privacy' },
              { k: 'Handover', v: 'Documentation and knowledge transfer' },
            ]}
          />
        </section>

        <section>
          <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
          <FAQ
            items={[
              {
                q: 'What does a typical engagement look like?',
                a: 'We begin with an assessment, produce high- and low-level designs, support implementation, and finish with documentation and knowledge transfer. Most engagements run two to eight weeks.',
              },
              {
                q: 'Can you work with our existing vendors?',
                a: 'Yes. We are vendor-neutral and work across Cisco, Juniper, MikroTik, Arista, and others, so our recommendations fit the hardware you already run.',
              },
              {
                q: 'Do you help with NTC compliance?',
                a: 'Yes — including Protective DNS integration and data-privacy alignment for telcos, ISPs, and financial institutions.',
              },
              {
                q: 'Do you offer ongoing support?',
                a: 'We offer retainer-based advisory and can design your NOC workflows and incident-response procedures for the long term.',
              },
            ]}
          />
        </section>
      </div>
    </ServiceLayout>
  );
};
