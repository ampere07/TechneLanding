import React from 'react';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative py-20 overflow-hidden bg-white min-h-[80vh] flex items-center">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-brand-blue/5 to-transparent -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-brand-blue uppercase bg-brand-blue/10 rounded-full border border-brand-blue/20">
              Network Consulting & Internet Services
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
              Enterprise Network Solutions for <span className="text-brand-blue">Global Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              We provide cutting-edge network infrastructure, specialized consulting, and high-speed internet solutions to keep your business connected and secure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary w-full sm:w-auto px-8">Get Started Now</Link>
              <Link to={`/${PANEL_IDS.SERVICES}`} className="btn-secondary w-full sm:w-auto px-8">View Our Services</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {[
              { icon: <Zap className="text-brand-blue" />, title: "High Speed", desc: "Fiber-grade connectivity for peak performance." },
              { icon: <Network className="text-brand-blue" />, title: "Scalable", desc: "Solutions that grow with your business needs." },
              { icon: <ShieldCheck className="text-brand-blue" />, title: "Secure", desc: "Enterprise-level security for your network infrastructure." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-blue/5 hover:border-brand-blue/30 transition-all group">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-blue/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
