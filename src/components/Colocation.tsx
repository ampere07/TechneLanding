import React from 'react';
import { motion } from 'framer-motion';

export const Colocation: React.FC = () => {
  return (
    <section className="py-24 bg-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6"><span className="text-brand-blue">Colocation</span> Services</h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Techne Fiber provides colocation access for organizations that need to host network equipment in a reliable, connectivity-ready environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Equipment Hosting</h3>
                <p className="text-sm text-slate-500">Routers, switches, servers, monitoring systems, DNS, and security appliances.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Network Presence</h3>
                <p className="text-sm text-slate-500">Useful for ISP edge, core, interconnection, peering, and infrastructure expansion.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Infrastructure Ready</h3>
                <p className="text-sm text-slate-500">Designed for operators that need better data center and network access.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Growth Focused</h3>
                <p className="text-sm text-slate-500">Supports customers preparing for stronger connectivity and operational scale.</p>
              </div>
            </div>
            
            <div className="mt-12 p-8 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Host critical network systems in a better environment</h3>
              <p className="text-slate-600">Ideal for ISP core, edge, DNS, monitoring, and cybersecurity platforms</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
