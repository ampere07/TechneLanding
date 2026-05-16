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
            className="mt-20 flex items-center justify-center gap-12 md:gap-24"
          >
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-2">
                99.9 <span className="text-red-500">%</span>
              </div>
              <div className="text-slate-500 font-medium text-sm md:text-base">
                Network Uptime
              </div>
            </div>
            
            <div className="w-px h-16 bg-slate-200"></div>
            
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-2">
                24/7
              </div>
              <div className="text-slate-500 font-medium text-sm md:text-base">
                Local Support
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
