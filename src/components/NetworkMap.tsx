import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import phMap from '../assets/ph_map.png';
import { MapPin, X } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  region: string;
  description: string;
  top: string;
  left: string;
}

export const NetworkMap: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: 'luzon',
      name: 'Manila Node',
      region: 'Luzon',
      description: 'Primary core backbone and international peering gateway.',
      top: '25%',
      left: '46%'
    },
    {
      id: 'visayas',
      name: 'Cebu Hub',
      region: 'Visayas',
      description: 'Regional distribution hub and primary Visayas aggregation point.',
      top: '52%',
      left: '55%'
    },
    {
      id: 'mindanao',
      name: 'Davao Data Center',
      region: 'Mindanao',
      description: 'Southern edge node providing low-latency access to Mindanao.',
      top: '75%',
      left: '68%'
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">Our Presence</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Nationwide <span className="text-brand-blue">Connectivity</span></h3>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Click on our network nodes to view localized infrastructure details and regional coverage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-xl mx-auto"
        >
          <img 
            src={phMap} 
            alt="Philippines Map" 
            className="w-full h-auto grayscale opacity-40 select-none pointer-events-none" 
            draggable="false"
          />
          
          {/* Interactive Pins */}
          {locations.map((loc) => (
            <div 
              key={loc.id}
              className="absolute group cursor-pointer"
              style={{ top: loc.top, left: loc.left }}
              onClick={() => setActiveLocation(loc)}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-brand-blue rounded-full shadow-lg shadow-brand-blue/40 relative z-10 border-2 border-white" />
                <div className="absolute inset-0 bg-brand-blue rounded-full animate-ping opacity-75" />
                
                {/* Hover label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  {loc.name}
                </div>
              </div>
            </div>
          ))}

          {/* Mini Modal */}
          <AnimatePresence>
            {activeLocation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-left"
              >
                <button 
                  onClick={() => setActiveLocation(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{activeLocation.name}</h4>
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">{activeLocation.region}</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activeLocation.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Backdrop for closing modal */}
        <AnimatePresence>
          {activeLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLocation(null)}
              className="fixed inset-0 bg-slate-900/5 backdrop-blur-sm z-40"
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
