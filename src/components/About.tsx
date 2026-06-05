import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Shield } from 'lucide-react';

const stats = [
  { value: "200+ Gbps", label: "Backbone Capacity" },
  { value: "5+", label: "Regional Edge Nodes" },
  { value: "99.99%", label: "Guaranteed SLA Uptime" },
  { value: "50+", label: "ISP & Enterprise Clients" }
];

const values = [
  {
    icon: <Target className="text-brand-blue" size={24} />,
    title: "Our Mission",
    desc: "To democratize high-performance connectivity in the Philippines by building carrier-neutral exchange paths and robust edge services."
  },
  {
    icon: <Compass className="text-brand-blue" size={24} />,
    title: "Our Vision",
    desc: "To become the leading digital infrastructure backbone that empowers local ISPs, retail networks, and financial institutions to scale infinitely."
  },
  {
    icon: <Shield className="text-brand-blue" size={24} />,
    title: "Our Values",
    desc: "Integrity, technical precision, transparency in SLAs, and commitment to carrier neutrality across all interconnected nodes."
  }
];

const team = [
  {
    name: "John Doe",
    role: "Founder & Managing Director",
    bio: "Telecom pioneer with 20+ years of digital infrastructure design experience across Southeast Asia. Dedicated to scaling local peering fabrics.",
    initials: "JD"
  },
  {
    name: "John Doe",
    role: "Chief Technology Officer",
    bio: "Peering veteran and BGP protocol expert. Previously designed core routing systems for major telecommunications conglomerates in the APAC region.",
    initials: "JD"
  },
  {
    name: "John Doe",
    role: "Head of Infrastructure Operations",
    bio: "Specializes in carrier relations, NTC regulatory compliance, and datacenter facility operations. Ensures 24/7 SLA uptime standards.",
    initials: "JD"
  }
];

const milestones = [
  {
    year: "2023",
    title: "Company Founded",
    desc: "Techne was established in Manila to resolve local ISP carrier dependency and improve routing latency issues."
  },
  {
    year: "2024",
    title: "PHOpenIX & Peering Deployed",
    desc: "Integrated with major local exchanges and launched dedicated peering paths, reducing domestic routing delays by 40%."
  },
  {
    year: "2025",
    title: "Backbone Expansion",
    desc: "Expanded network backbone capacity to 200+ Gbps and launched regional edge nodes in Cebu and Davao."
  },
  {
    year: "2026",
    title: "SD-WAN & Edge Services",
    desc: "Launched custom Colocation offerings and software-defined edge routers, enabling true hybrid cloud integrations."
  }
];

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-white text-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,180,181,0.12),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
              About Techne
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 mb-6 text-slate-900">
              Architecting the Future of <br className="hidden md:inline" />
              <span className="text-brand-blue">Philippine Connectivity</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              We are a carrier-neutral network engineering and digital infrastructure firm. We design, deploy, and manage the core backbones that connect local businesses, ISPs, and platforms to the global network fabric.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50 border-y border-slate-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">Our Journey</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Milestones of Progress</h3>
          </div>
          
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-12">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Dot marker */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-blue border-4 border-white shadow" />
                
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <span className="text-xl font-black text-brand-blue shrink-0 min-w-[60px] md:absolute md:-left-24 md:text-right">
                    {m.year}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1.5">{m.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">Leadership Team</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">The Minds Behind Techne</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="p-8 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xl mb-6">
                    {member.initials}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                  <p className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-4">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
