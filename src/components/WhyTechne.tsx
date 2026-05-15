import React, { useRef, useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { ShieldCheck, Award, TrendingUp, Users, Zap, PhilippinePeso, ChevronLeft, ChevronRight } from 'lucide-react';

export const WhyTechne: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const features = [
    {
      icon: <Award size={28} className="text-brand-blue" />,
      title: "Unmatched Expertise",
      desc: "Years of experience in BGP routing, carrier-grade NAT, and complex core network design for ISPs and enterprises."
    },
    {
      icon: <ShieldCheck size={28} className="text-brand-blue" />,
      title: "Regulatory Compliance",
      desc: "Fully aligned with NTC mandates, including Protective DNS (PDNS) and data privacy requirements."
    },
    {
      icon: <Zap size={28} className="text-brand-blue" />,
      title: "High Performance",
      desc: "Deploying 100G+ backbone fabrics and optimized CDN integrations for ultra-low latency service delivery."
    },
    {
      icon: <Users size={28} className="text-brand-blue" />,
      title: "Dedicated Support",
      desc: "Our NOC and engineering teams provide proactive monitoring and rapid incident response to ensure 99.99% uptime."
    },
    {
      icon: <TrendingUp size={28} className="text-brand-blue" />,
      title: "Future-Proof Scaling",
      desc: "Architectures designed to grow with your subscriber base, from initial setup to multi-gigabit expansion."
    },
    {
      icon: <PhilippinePeso size={28} className="text-brand-blue" />,
      title: "Enterprise Value",
      desc: "Enterprise-grade reliability at cost-effective price points, tailored for the Philippine market landscape."
    }
  ];

  const smoothScroll = (target: number) => {
    if (!scrollRef.current) return;
    
    animate(scrollRef.current.scrollLeft, target, {
      type: "spring",
      stiffness: 60,
      damping: 20,
      onUpdate: (val) => {
        if (scrollRef.current) scrollRef.current.scrollLeft = val;
      }
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;
        
        let targetScroll = currentScroll + 400;
        if (currentScroll >= maxScrollLeft - 10) {
          targetScroll = 0;
        }
        
        smoothScroll(targetScroll);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const step = clientWidth * 0.8;
      const target = direction === 'left' ? scrollLeft - step : scrollLeft + step;
      smoothScroll(Math.max(0, Math.min(target, scrollRef.current.scrollWidth - clientWidth)));
    }
  };

  return (
    <section 
      className="py-24 bg-slate-50 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-blue/5 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">The Techne Advantage</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Why Choose <span className="text-brand-blue">Techne</span>?</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Precision engineering and local expertise for your digital foundation.
              </p>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            <button 
              onClick={() => handleManualScroll('left')}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-brand-blue hover:text-white transition-all active:scale-95 group"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => handleManualScroll('right')}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-brand-blue hover:text-white transition-all active:scale-95 group"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="min-w-[320px] md:min-w-[450px] p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-blue/10 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue/10 transition-colors">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 text-base leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};
