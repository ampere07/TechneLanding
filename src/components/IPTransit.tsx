import React from 'react';
import { motion } from 'framer-motion';

export const IPTransit: React.FC = () => {
  return (
    <section className="py-24 bg-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6">IP <span className="text-brand-blue">Transit</span></h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Reliable, high-capacity IP transit services providing global connectivity for ISPs, content providers, and enterprises. Our network ensures low-latency and high-availability routing across major internet hubs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Global Reach</h3>
                <p className="text-sm text-slate-500">Access to major global internet exchange points and Tier-1 carriers.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Scalability</h3>
                <p className="text-sm text-slate-500">Flexible bandwidth options from 1Gbps to 100Gbps+ ports.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
