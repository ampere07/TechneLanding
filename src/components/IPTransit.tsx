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
              Techne Fiber offers IP Transit services for networks that need reliable internet connectivity, global reachability, and scalable bandwidth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Best For</h3>
                <p className="text-sm text-slate-500">ISPs, enterprise networks, content networks, hosting providers, and network operators.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Routing Ready</h3>
                <p className="text-sm text-slate-500">Suitable for organizations with ASN, IP resources, and BGP connectivity requirements.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Operational Focus</h3>
                <p className="text-sm text-slate-500">Built for stable upstream connectivity and practical network growth.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Scalable Service</h3>
                <p className="text-sm text-slate-500">Designed to support bandwidth growth and future connectivity expansion.</p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Service Highlights</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start">
                  <span className="text-brand-blue mr-2 font-bold">•</span>
                  BGP-ready internet connectivity
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-2 font-bold">•</span>
                  Suitable for ISP and enterprise requirements
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-2 font-bold">•</span>
                  Supports networks preparing for expansion and higher capacity
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
