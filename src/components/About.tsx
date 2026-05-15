import React from 'react';
import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="py-24 bg-white min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100"
        >
          <div className="w-20 h-20 bg-brand-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-blue">
            <Hammer size={40} className="animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Under Construction</h1>
          <p className="text-slate-500 leading-relaxed">
            We are currently refining our company narrative to better reflect our vision. Check back soon for the full Techne story.
          </p>
          
          <div className="mt-10 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
