import React from 'react';
import { PencilRuler, Share2, Gauge, Lock, Search, AlertTriangle, ShieldCheck, Activity, Check } from 'lucide-react';
import {
  ServiceLayout,
  type ServiceMeta,
  SectionTitle,
  ProcessSteps,
  SpecTable,
  FAQ,
  DEFAULT_PROCESS,
} from './ServiceLayout';

const ServiceTemplate: React.FC<{
  label: string;
  title: string;
  description: string;
  meta?: ServiceMeta[];
  children?: React.ReactNode;
}> = ({ label, title, description, meta, children }) => (
  <ServiceLayout eyebrow={label} title={title} lead={description} meta={meta}>
    {children}
  </ServiceLayout>
);

const SectionHeading: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-baseline gap-4 mb-5">
    <span className="font-mono text-sm text-ink-2/50 shrink-0">{number}</span>
    <h2 className="font-display text-2xl font-bold text-ink tracking-tight">{title}</h2>
  </div>
);

const CapabilityBox: React.FC<{ icon: React.ReactNode; heading: string; items: string[] }> = ({ icon, heading, items }) => (
  <div className="bg-ink rounded-[4px] p-8 text-white">
    <h3 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      {heading}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 text-white/60 text-sm font-body">
          <div className="w-1 h-1 rounded-full bg-accent shrink-0" />
          {item}
        </div>
      ))}
    </div>
  </div>
);

export const CoreConfig = () => (
  <ServiceTemplate
    label="Managed Services"
    title="Core Network Configuration"
    description="Advanced backbone and core router configuration services to ensure maximum network stability and throughput for your enterprise."
    meta={[
      { label: 'Layer', value: 'Core / Backbone' },
      { label: 'Protocols', value: 'BGP · OSPF' },
      { label: 'Resilience', value: 'Multi-path' },
      { label: 'Deliverables', value: 'SOP + diagrams' },
    ]}
  >
    <div className="space-y-16">
      <div>
        <SectionHeading number="01" title="BGP Routing Architecture" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed">
          Techne provides a fully optimized Border Gateway Protocol (BGP) setup to ensure resilient, intelligent, and redundant routing across multiple upstream and peering partners.
        </p>
      </div>

      <div>
        <SectionHeading number="02" title="Core Network Design & Engineering" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed mb-6">
          Techne provides end-to-end network design to ensure your infrastructure is prepared for growth, reliability, and performance.
        </p>
        <CapabilityBox
          icon={<PencilRuler size={18} />}
          heading="Key Capabilities"
          items={[
            'Comprehensive core network topology planning',
            'Multi-site data center interconnection (DCI) design',
            'IPv4/IPv6 addressing schema & capacity planning',
            'Routing policy creation for global traffic distribution',
            'Security frameworks (ACLs, RPKI validation)',
            'Full documentation and SOP diagrams',
          ]}
        />
      </div>

      <div>
        <SectionTitle
          eyebrow="Engagement"
          title="How we deliver"
          intro="A staged path from assessment to a documented, monitored core network."
        />
        <ProcessSteps steps={DEFAULT_PROCESS} />
      </div>

      <div>
        <SectionTitle eyebrow="Datasheet" title="Technical specifications" />
        <SpecTable
          rows={[
            { k: 'Scope', v: 'Core / backbone routing' },
            { k: 'Protocols', v: 'BGP, OSPF, IS-IS' },
            { k: 'Resilience', v: 'ECMP, fast reroute, multi-path' },
            { k: 'Addressing', v: 'IPv4 + IPv6 schema design' },
            { k: 'Security', v: 'ACLs, RPKI validation, control-plane policing' },
            { k: 'Deliverables', v: 'Topology diagrams and SOPs' },
          ]}
        />
      </div>

      <div>
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Which routers and platforms do you support?',
              a: 'We configure across major vendors — Cisco, Juniper, MikroTik, and Arista — and document everything to your operational standards.',
            },
            {
              q: 'Can you migrate our core without downtime?',
              a: 'Yes. We plan staged cutovers with rollback paths and validation testing to minimize or eliminate downtime.',
            },
            {
              q: 'Do you implement RPKI and route security?',
              a: 'Yes — RPKI ROA validation, prefix filtering, and control-plane protections are part of a standard core build.',
            },
          ]}
        />
      </div>
    </div>
  </ServiceTemplate>
);

export const DistConfig = () => (
  <ServiceTemplate
    label="Managed Services"
    title="Distribution Configuration"
    description="Distribution Network Solutions provide a highly optimized, scalable, and resilient platform that bridges your core infrastructure to your access network. Designed for ISPs, enterprises, and carriers, our architecture ensures seamless traffic distribution, subscriber management, and high-availability service delivery."
    meta={[
      { label: 'Layer', value: 'Distribution' },
      { label: 'Subscribers', value: 'PPPoE / IPoE' },
      { label: 'Backhaul', value: 'Fiber · wireless' },
      { label: 'Handover', value: 'Wholesale · ENT' },
    ]}
  >
    <div className="space-y-16">
      <div>
        <SectionHeading number="01" title="Aggregation Routing Layer" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed">
          Our Aggregation Router configuration serves as the strategic handoff point between upstream transit, peering networks, and the local distribution network.
        </p>
      </div>

      <div>
        <SectionHeading number="02" title="Access Concentrator Architecture" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed">
          Techne deploys a robust AC (Access Concentrator) configuration designed for scalability, stability, and seamless subscriber management.
        </p>
      </div>

      <div>
        <SectionHeading number="03" title="Network Design & Implementation" />
        <CapabilityBox
          icon={<Share2 size={18} />}
          heading="Design Principles"
          items={[
            'Scalable distribution topology',
            'Fiber and wireless backhaul planning',
            'Redundant aggregation paths',
            'Multi-service traffic segmentation',
            'End-to-end documentation & monitoring',
            'Wholesale and enterprise handover packages',
          ]}
        />
      </div>

      <div>
        <SectionTitle
          eyebrow="Engagement"
          title="How we deliver"
          intro="From aggregation design to live subscriber services, on a predictable plan."
        />
        <ProcessSteps steps={DEFAULT_PROCESS} />
      </div>

      <div>
        <SectionTitle eyebrow="Datasheet" title="Technical specifications" />
        <SpecTable
          rows={[
            { k: 'Layer', v: 'Aggregation and access' },
            { k: 'Subscriber mgmt', v: 'PPPoE / IPoE via BNG / access concentrator' },
            { k: 'Backhaul', v: 'Fiber and licensed / unlicensed wireless' },
            { k: 'Redundancy', v: 'Redundant aggregation paths' },
            { k: 'Segmentation', v: 'Multi-service VLAN and QoS' },
            { k: 'Handover', v: 'Wholesale and enterprise packages' },
          ]}
        />
      </div>

      <div>
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Can this scale with subscriber growth?',
              a: 'Yes. The distribution topology is designed so you can add aggregation and access capacity without re-architecting the network.',
            },
            {
              q: 'Do you support PPPoE and IPoE?',
              a: 'Yes — both subscriber models, with BNG / access-concentrator configuration tuned for stability at scale.',
            },
            {
              q: 'Can you mix fiber and wireless backhaul?',
              a: 'Yes. We plan hybrid backhaul with redundant paths so a single link failure does not isolate a segment.',
            },
          ]}
        />
      </div>
    </div>
  </ServiceTemplate>
);

export const SystemIntegration = () => (
  <ServiceTemplate
    label="Managed Services"
    title="System Integration"
    description="Bridging the gap between disparate IT systems and network infrastructure for a unified, efficient operational environment. Techne specializes in deploying and optimizing enterprise-grade tools for monitoring, alerting, and automated management."
    meta={[
      { label: 'Domain', value: 'NMS · Telemetry' },
      { label: 'Testing', value: 'Ookla server' },
      { label: 'Visibility', value: 'Real-time' },
      { label: 'Delivery', value: 'Integrated' },
    ]}
  >
    <div className="space-y-16">
      <div>
        <SectionHeading number="01" title="Network Monitoring Systems" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed">
          Get deep, real-time visibility into your entire network infrastructure with enterprise-grade monitoring tools integrated and optimized by Techne.
        </p>
      </div>

      <div>
        <SectionHeading number="02" title="Performance & Speed Testing" />
        <CapabilityBox
          icon={<Gauge size={18} />}
          heading="4.1 Ookla Speedtest Server Deployment"
          items={[
            'ISP-grade speedtest platform deployment',
            'Optimized server config for accurate results',
            'Enhanced visibility of network quality',
            'Customer-facing performance validation',
            'Internal capacity validation workflows',
          ]}
        />
      </div>

      <div>
        <SectionTitle eyebrow="Datasheet" title="Technical specifications" />
        <SpecTable
          rows={[
            { k: 'Monitoring', v: 'SNMP, flow (NetFlow / IPFIX), syslog' },
            { k: 'Alerting', v: 'Threshold and anomaly, with escalation policies' },
            { k: 'Speed testing', v: 'ISP-grade Ookla server deployment' },
            { k: 'Dashboards', v: 'Real-time network visibility' },
            { k: 'Integration', v: 'Existing NMS and ticketing tools' },
          ]}
        />
      </div>

      <div>
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Which monitoring tools do you deploy?',
              a: 'We integrate enterprise-grade NMS, flow collectors, and dashboards, and can work with the tools you already run.',
            },
            {
              q: 'What is the Ookla speedtest server for?',
              a: 'It gives you and your customers accurate, branded performance validation and supports internal capacity checks.',
            },
            {
              q: 'Can you integrate with our ticketing system?',
              a: 'Yes — alerts can route directly into your existing escalation and ticketing workflows.',
            },
          ]}
        />
      </div>
    </div>
  </ServiceTemplate>
);

export const ProtectiveDNS = () => (
  <ServiceTemplate
    label="Security Services"
    title="Protective DNS Integration"
    description="Ensuring Compliance, Security, and Network Integrity. In alignment with NTC Memorandum No. 001-01-2025, Techne delivers a fully integrated Protective DNS solution that enables service providers to meet regulatory requirements while strengthening their network defenses."
    meta={[
      { label: 'Mandate', value: 'NTC 001-01-2025' },
      { label: 'Function', value: 'DNS filtering' },
      { label: 'Coverage', value: 'Real-time' },
      { label: 'Status', value: 'Compliant' },
    ]}
  >
    <div className="space-y-16">
      {/* NTC compliance callout */}
      <div className="p-7 bg-accent/8 border border-accent/20 rounded-[4px] flex items-start gap-5">
        <div className="w-11 h-11 bg-accent rounded-[4px] flex items-center justify-center text-white shrink-0">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink mb-2">NTC Compliance Ready</h2>
          <p className="font-body text-sm text-ink-2 leading-relaxed">
            All Value-Added Service (VAS) providers are required to implement a Protective DNS (PDNS) system. Techne ensures your infrastructure is fully compliant with{' '}
            <span className="font-semibold text-accent">NTC Memorandum No. 001-01-2025</span>.
          </p>
        </div>
      </div>

      {/* Why DNS */}
      <div>
        <SectionHeading number="01" title="Why Protective DNS?" />
        <p className="font-body text-[1rem] text-ink-2 leading-relaxed mb-8">
          Protective DNS actively monitors, filters, and blocks harmful domain queries, preventing access to infrastructure used by cybercriminals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: <AlertTriangle size={16} className="text-amber-500" />, title: 'Malicious Domains', desc: 'Blocks access to known malware distribution hosts and command centers.' },
            { icon: <Search size={16} className="text-accent" />, title: 'Phishing & Fraud', desc: 'Filters fraudulent sites designed to steal user credentials and financial data.' },
            { icon: <Activity size={16} className="text-rose-500" />, title: 'Botnet C&C', desc: 'Prevents infected devices from communicating with botnet control servers.' },
            { icon: <ShieldCheck size={16} className="text-emerald-500" />, title: 'Network Integrity', desc: 'Reduces the risk of widespread infections and enhances subscriber safety.' },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-paper-2 border border-rule rounded-[4px]">
              <div className="w-8 h-8 bg-paper border border-rule rounded-[4px] flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-display font-semibold text-ink mb-1.5">{item.title}</h3>
              <p className="font-body text-sm text-ink-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-ink rounded-[4px] p-10 text-center">
        <h3 className="font-display text-2xl font-bold text-white mb-3">Protect Your Users. Secure Your Reputation.</h3>
        <p className="font-body text-sm text-white/50 max-w-2xl mx-auto leading-relaxed">
          This ensures safer browsing for end-users and significantly reduces the risk of widespread infections within your network infrastructure.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-4">
          {['NTC Compliant', 'Subscriber Protection', 'Real-Time Filtering', 'Easy Deployment'].map((tag, i) => (
            <li key={i} className="flex items-center gap-1.5 font-mono text-xs text-white/60">
              <Check size={11} className="text-accent" />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <FAQ
          items={[
            {
              q: 'Is this compliant with NTC requirements?',
              a: 'Yes — our Protective DNS integration is built to meet NTC Memorandum No. 001-01-2025 for Value-Added Service providers.',
            },
            {
              q: 'Will it slow down DNS resolution?',
              a: 'No. Filtering happens in real time at the resolver level with negligible latency impact for end users.',
            },
            {
              q: 'What threats does it block?',
              a: 'Malicious domains, phishing and fraud sites, and botnet command-and-control communication.',
            },
            {
              q: 'How long does deployment take?',
              a: 'Integration is straightforward and typically completed within a few business days.',
            },
          ]}
        />
      </div>
    </div>
  </ServiceTemplate>
);
