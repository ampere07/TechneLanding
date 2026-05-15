import React from 'react';
import { motion } from 'framer-motion';

export const DIA: React.FC = () => {
  return (
    <section className="py-24 bg-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Dedicated Internet Access <span className="text-brand-blue">(DIA)</span></h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Symmetrical, high-speed internet connectivity reserved exclusively for your business. Unlike broadband, our DIA provides guaranteed bandwidth and enterprise-level service reliability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Symmetrical Speed</h3>
                <p className="text-sm text-slate-500">Identical upload and download speeds for cloud-heavy operations.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">SLA Guaranteed</h3>
                <p className="text-sm text-slate-500">Industry-leading service level agreements for uptime and latency.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
