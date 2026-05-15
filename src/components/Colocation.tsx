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
              Secure, enterprise-grade data center housing for your critical IT infrastructure. Benefit from high-redundancy power, cooling, and specialized security while maintaining full control over your hardware.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Carrier Neutral</h3>
                <p className="text-sm text-slate-500">Connect to multiple carriers and internet exchange points from our facility.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Physical Security</h3>
                <p className="text-sm text-slate-500">24/7 biometric access, CCTV monitoring, and secure equipment racks.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
