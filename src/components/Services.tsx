import React from 'react';
import { Wifi, Cpu, Globe, Cloud, Layout, Search } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: <Wifi className="w-8 h-8 text-brand-blue" />,
      title: "Internet Services",
      desc: "Reliable, high-speed fiber internet solutions for businesses and homes."
    },
    {
      icon: <Cpu className="w-8 h-8 text-brand-blue" />,
      title: "Network Consulting",
      desc: "Expert guidance on infrastructure design, optimization, and management."
    },
    {
      icon: <Globe className="w-8 h-8 text-brand-blue" />,
      title: "SD-WAN Solutions",
      desc: "Next-generation software-defined wide area network management."
    },
    {
      icon: <Cloud className="w-8 h-8 text-brand-blue" />,
      title: "Cloud Connectivity",
      desc: "Secure and direct paths to major cloud providers like AWS, Azure, and Google."
    },
    {
      icon: <Layout className="w-8 h-8 text-brand-blue" />,
      title: "Managed Services",
      desc: "Proactive monitoring and maintenance of your entire network environment."
    },
    {
      icon: <Search className="w-8 h-8 text-brand-blue" />,
      title: "Security Audits",
      desc: "Comprehensive vulnerability assessments and security infrastructure planning."
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Comprehensive IT <span className="text-brand-blue">Infrastructure</span></h2>
          <p className="text-slate-500 text-lg">
            We offer a full suite of networking and internet services designed to keep your business running smoothly in the digital age.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="p-8 bg-white rounded-3xl border border-slate-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-300 group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
