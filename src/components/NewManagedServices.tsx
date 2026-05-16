import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, PencilRuler, CheckCircle2, Share2, Server, Cpu, Globe, Bell, Shield, Gauge, Lock, Search, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

const ServiceTemplate: React.FC<{ title: string, description: string, children?: React.ReactNode }> = ({ title, description, children }) => (
  <section className="py-24 bg-white min-h-[80vh]">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">{title}</h1>
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-500 leading-relaxed mb-12">{description}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  </section>
);

export const CoreConfig = () => (
  <ServiceTemplate 
    title="Core Network Configuration" 
    description="Advanced backbone and core router configuration services to ensure maximum network stability and throughput for your enterprise."
  >
    <div className="space-y-16">
      {/* 1. BGP Routing Architecture */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">1</div>
           <h2 className="text-3xl font-bold text-slate-900">BGP Routing Architecture</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Techne provides a fully optimized Border Gateway Protocol (BGP) setup to ensure resilient, intelligent, and redundant routing across multiple upstream and peering partners.
        </p>
        
      </div>

      {/* 2. Data Center Network Infrastructure */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">2</div>
           <h2 className="text-3xl font-bold text-slate-900">Data Center Network Infrastructure</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Techne designs and implements a scalable, secure, and fully redundant data center network aimed at supporting heavy workloads, content delivery, and mission-critical applications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Database size={18} className="text-brand-blue" />
              <span>2.1 CDN Appliance Integration</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>Integration with Akamai, Cloudflare, Meta, Google, Netflix, etc.</span></li>
              <li className="flex items-start space-y-2 text-sm text-slate-500">
                <CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> 
                <span>Bandwidth optimization and cache efficiency tuning</span>
              </li>
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>Deployment of dedicated VLANs and route filtering</span></li>
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>Monitoring and performance analytics for traffic flow</span></li>
            </ul>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Database size={18} className="text-brand-blue" />
              <span>2.2 Core & Backbone Configuration</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>High-speed fabric design (10G to 400G backbones)</span></li>
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>Redundant core architecture (MLAG, ECMP, VRRP)</span></li>
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>MPLS or Segment Routing support</span></li>
              <li className="flex items-start space-x-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-brand-blue/60" /> <span>QoS, traffic shaping, and congestion management</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Core Network Design & Engineering */}
      <div className="space-y-8 pb-12">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">3</div>
           <h2 className="text-3xl font-bold text-slate-900">Core Network Design & Engineering</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Techne provides end-to-end network design to ensure your infrastructure is prepared for growth, reliability, and performance.
        </p>
        
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PencilRuler size={120} />
          </div>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <PencilRuler size={20} className="text-brand-blue" />
            <span>Key Capabilities</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Comprehensive core network topology planning",
              "Multi-site data center interconnection (DCI) design",
              "IPv4/IPv6 addressing schema & capacity planning",
              "Routing policy creation for global traffic distribution",
              "Security frameworks (ACLs, RPKI validation)",
              "Full documentation and SOP diagrams"
            ].map((cap, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ServiceTemplate>
);

export const DistConfig = () => (
  <ServiceTemplate 
    title="Distribution Configuration" 
    description="Distribution Network Solutions provide a highly optimized, scalable, and resilient platform that bridges your core infrastructure to your access network. Designed for ISPs, enterprises, and carriers, our architecture ensures seamless traffic distribution, subscriber management, and high-availability service delivery across all customer segments."
  >
    <div className="space-y-16">
      {/* 1. Aggregation Routing Layer */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">1</div>
           <h2 className="text-3xl font-bold text-slate-900">Aggregation Routing Layer</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Our Aggregation Router configuration serves as the strategic handoff point between upstream transit, peering networks, and the local distribution network.
        </p>
        
      </div>

      {/* 2. Access Concentrator Architecture */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">2</div>
           <h2 className="text-3xl font-bold text-slate-900">Access Concentrator Architecture</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Techne deploys a robust AC (Access Concentrator) configuration designed for scalability, stability, and seamless subscriber management.
        </p>
        
      </div>

      {/* 3. CGNAT Deployment */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">3</div>
           <h2 className="text-3xl font-bold text-slate-900">CGNAT (Carrier-Grade NAT) Deployment</h2>
        </div>
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-600 mb-6 leading-relaxed">
            Techne implements a carrier-grade NAT solution designed to support large-scale residential traffic while minimizing public IPv4 consumption.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Port-block allocation (PBA) for mapping",
              "Load-balanced NAT pools across gateways",
              "Logging and compliance for traceability",
              "Optimized NAT for streaming, gaming, and VoIP",
              "High-performance multi-gigabit throughput"
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-500 text-sm">
                <CheckCircle2 size={16} className="text-brand-blue" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Distribution Network Design */}
      <div className="space-y-8 pb-12">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">4</div>
           <h2 className="text-3xl font-bold text-slate-900">Network Design & Implementation</h2>
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PencilRuler size={120} />
          </div>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Share2 size={20} className="text-brand-blue" />
            <span>Design Principles</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Scalable distribution topology",
              "Fiber and wireless backhaul planning",
              "Redundant aggregation paths",
              "Multi-service traffic segmentation",
              "End-to-end documentation & monitoring",
              "Wholesale and enterprise handover packages"
            ].map((cap, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ServiceTemplate>
);

export const SystemIntegration = () => (
  <ServiceTemplate 
    title="System Integration" 
    description="Bridging the gap between disparate IT systems and network infrastructure for a unified, efficient operational environment. Techne specializes in deploying and optimizing enterprise-grade tools for monitoring, alerting, and automated management."
  >
    <div className="space-y-16">
      {/* 1. Network Monitoring Systems */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">1</div>
           <h2 className="text-3xl font-bold text-slate-900">Network Monitoring Systems</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Get deep, real-time visibility into your entire network infrastructure with enterprise-grade monitoring tools integrated and optimized by Techne.
        </p>
        
      </div>

      {/* 2 & 3 Combined - Alerting & Backups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">2</div>
             <h2 className="text-2xl font-bold text-slate-900">Centralized Alerting</h2>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2 text-sm">
              <Bell size={16} className="text-brand-blue" />
              <span>2.1 Syslog-to-Telegram</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time alerts delivered directly to Telegram channels. Custom severity-based filtering for faster incident response.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">3</div>
             <h2 className="text-2xl font-bold text-slate-900">Automated Backups</h2>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2 text-sm">
              <Shield size={16} className="text-brand-blue" />
              <span>3.1 Oxidized Automation</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Version-controlled configuration backups with multi-vendor support. Historical comparison and quick rollback.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Network Performance */}
      <div className="space-y-8 pb-12">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">4</div>
           <h2 className="text-3xl font-bold text-slate-900">Performance & Speed Testing</h2>
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Gauge size={120} />
          </div>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Gauge size={20} className="text-brand-blue" />
            <span>4.1 Ookla Speedtest Server Deployment</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "ISP-grade speedtest platform deployment",
              "Optimized server config for accurate results",
              "Enhanced visibility of network quality",
              "Customer-facing performance validation",
              "Internal capacity validation workflows"
            ].map((cap, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ServiceTemplate>
);

export const ProtectiveDNS = () => (
  <ServiceTemplate 
    title="Protective DNS Integration" 
    description="Ensuring Compliance, Security, and Network Integrity. In alignment with NTC Memorandum No. 001-01-2025, Techne delivers a fully integrated Protective DNS solution that enables service providers to meet regulatory requirements while strengthening their network defenses."
  >
    <div className="space-y-16">
      {/* 1. Regulatory Compliance */}
      <div className="p-8 bg-brand-blue/5 rounded-3xl border border-brand-blue/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck size={120} />
        </div>
        <div className="flex items-start space-x-6">
          <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-blue/20">
            <Lock size={24} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">NTC Compliance Ready</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              All Value-Added Service (VAS) providers are required to implement a Protective DNS (PDNS) system to enhance cybersecurity posture and protect subscribers from malicious online threats. Techne ensures your infrastructure is fully compliant with <span className="font-bold text-brand-blue">NTC Memorandum No. 001-01-2025</span>.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Why Protective DNS? */}
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">?</div>
           <h2 className="text-3xl font-bold text-slate-900">Why Protective DNS?</h2>
        </div>
        <p className="text-slate-600 leading-relaxed ml-4">
          Protective DNS actively monitors, filters, and blocks harmful domain queries, preventing access to infrastructure used by cybercriminals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-4">
          {[
            { icon: <AlertTriangle className="text-amber-500" />, title: "Malicious Domains", desc: "Blocks access to known malware distribution hosts and command centers." },
            { icon: <Search className="text-brand-blue" />, title: "Phishing & Fraud", desc: "Filters fraudulent sites designed to steal user credentials and financial data." },
            { icon: <Activity className="text-rose-500" />, title: "Botnet C&C", desc: "Prevents infected devices from communicating with botnet control servers." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Network Integrity", desc: "Reduces the risk of widespread infections and enhances subscriber safety." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Protect Your Users. Secure Your Reputation.</h3>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed mb-0">
          This ensures safer browsing for end-users and significantly reduces the risk of widespread infections within your network infrastructure.
        </p>
      </div>
    </div>
  </ServiceTemplate>
);
