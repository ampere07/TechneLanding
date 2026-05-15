import React from 'react';
import { motion } from 'framer-motion';

export const NetworkConsulting: React.FC = () => {
  return (
    <section className="py-24 bg-white min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Network <span className="text-brand-blue">Consulting</span></h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-8">
              Expert strategic guidance for your network architecture. We help businesses design, optimize, and manage complex networking environments to ensure maximum performance and security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Design & Audit</h3>
                <p className="text-sm text-slate-500">Comprehensive analysis of current infrastructure and future-proof design planning.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Managed Security</h3>
                <p className="text-sm text-slate-500">Integrating advanced security protocols and monitoring into your network core.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
