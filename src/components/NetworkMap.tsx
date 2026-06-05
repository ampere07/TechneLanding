import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

import brandVyos from '../assets/trusted/6.png';
import brandArista from '../assets/trusted/Arista-networks-logo.svg';
import brandCisco from '../assets/trusted/Cisco_logo_blue_2016.svg.png';
import brandDell from '../assets/trusted/Dell_Logo.png';
import brandHp from '../assets/trusted/HP_logo_2012.svg.png';
import brandHuawei from '../assets/trusted/Huawei_Standard_logo.svg.png';
import brandJuniper from '../assets/trusted/Juniper_Networks_logo.svg.png';
import brandProxmox from '../assets/trusted/Logo_Proxmox.svg';
import brandMikrotik from '../assets/trusted/MikroTik_Logo_(2022).svg.png';
import brandPfsense from '../assets/trusted/PfSense_logo.png';
import brandSupermicro from '../assets/trusted/Super_Micro_Computer_Logo.svg.png';
import brandZte from '../assets/trusted/ZTE-logo.svg.png';
import brandLibreqos from '../assets/trusted/libreqos.logo.svg';

interface Location {
  id: string;
  name: string;
  region: string;
  description: string;
  x: number;
  y: number;
  t: number;
}

export const NetworkMap: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  const visayasLocations = [
    { id: 'visayas_1', name: 'Visayas Core', region: 'Visayas', description: 'Visayas central backbone gateway in Cebu.' },
    { id: 'visayas_2', name: 'Visayas Edge 1', region: 'Visayas', description: 'Redundant peering path linking Panay and Negros.' },
    { id: 'visayas_3', name: 'Visayas Edge 2', region: 'Visayas', description: 'Local content cache and DNS caching server.' },
    { id: 'visayas_4', name: 'Visayas Edge 3', region: 'Visayas', description: 'Enterprise distribution ring for local businesses.' },
    { id: 'visayas_5', name: 'Visayas Edge 4', region: 'Visayas', description: 'Secondary backup link securing Visayas network path.' }
  ];

  const mindanaoLocations = [
    { id: 'mindanao_1', name: 'Mindanao Core', region: 'Mindanao', description: 'Mindanao aggregation gateway based in Davao.' },
    { id: 'mindanao_2', name: 'Mindanao Edge 1', region: 'Mindanao', description: 'Regional fiber interface connecting southern networks.' },
    { id: 'mindanao_3', name: 'Mindanao Edge 2', region: 'Mindanao', description: 'Peering interface linking local internet exchanges.' },
    { id: 'mindanao_4', name: 'Mindanao Edge 3', region: 'Mindanao', description: 'Redundant backbone loop for Mindanao businesses.' },
    { id: 'mindanao_5', name: 'Mindanao Edge 4', region: 'Mindanao', description: 'Regional enterprise access switch in Zamboanga.' }
  ];

  const luzonLocations = [
    { id: 'luzon_1', name: 'Luzon Core', region: 'Luzon', description: 'Primary network gateway and fiber aggregation node.' },
    { id: 'luzon_2', name: 'Luzon Edge 1', region: 'Luzon', description: 'Local distribution path supporting regional ISPs.' },
    { id: 'luzon_3', name: 'Luzon Edge 2', region: 'Luzon', description: 'Dedicated enterprise access and backup transit loop.' },
    { id: 'luzon_4', name: 'Luzon Edge 3', region: 'Luzon', description: 'Peering interconnection and content caching node.' },
    { id: 'luzon_5', name: 'Luzon Edge 4', region: 'Luzon', description: 'Local carrier integration and cross connect facility.' },
    { id: 'luzon_6', name: 'Luzon Edge 5', region: 'Luzon', description: 'Redundant core routing and load balancing gateway.' },
    { id: 'luzon_7', name: 'Luzon Edge 6', region: 'Luzon', description: 'Regional fiber termination and network monitoring hub.' },
    { id: 'luzon_8', name: 'Luzon Edge 7', region: 'Luzon', description: 'Secure enterprise firewall and SD-WAN controller.' },
    { id: 'luzon_9', name: 'Luzon Edge 8', region: 'Luzon', description: 'High-availability power path and hosting facility.' },
    { id: 'luzon_10', name: 'Luzon Edge 9', region: 'Luzon', description: 'Direct backbone path linking northern provinces.' },
    { id: 'luzon_11', name: 'Luzon Edge 10', region: 'Luzon', description: 'Local exchange cache and DNS server hub.' },
    { id: 'luzon_12', name: 'Luzon Edge 11', region: 'Luzon', description: 'Wireless aggregation point and microwave relay.' },
    { id: 'luzon_13', name: 'Luzon Edge 12', region: 'Luzon', description: 'Subsea cable landing station partner link.' },
    { id: 'luzon_14', name: 'Luzon Edge 13', region: 'Luzon', description: 'Colocation rack facility and cabinet access node.' },
    { id: 'luzon_15', name: 'Luzon Edge 14', region: 'Luzon', description: 'Stateful packet filter and local routing node.' },
    { id: 'luzon_16', name: 'Luzon Edge 15', region: 'Luzon', description: 'BGP peering gate for regional telecom channels.' },
    { id: 'luzon_17', name: 'Luzon Edge 16', region: 'Luzon', description: 'Metro Manila ring aggregation system.' },
    { id: 'luzon_18', name: 'Luzon Edge 17', region: 'Luzon', description: 'Enterprise core fiber distribution cabinet.' },
    { id: 'luzon_19', name: 'Luzon Edge 18', region: 'Luzon', description: 'Southern Luzon gateway and aggregation node.' },
    { id: 'luzon_20', name: 'Luzon Edge 19', region: 'Luzon', description: 'East Luzon access loop and route reflector.' },
    { id: 'luzon_21', name: 'Luzon Edge 20', region: 'Luzon', description: 'Luzon backbone redundant ring interface.' },
    { id: 'luzon_22', name: 'Luzon Edge 21', region: 'Luzon', description: 'North Luzon distribution ring.' },
    { id: 'luzon_23', name: 'Luzon Edge 22', region: 'Luzon', description: 'Central Luzon carrier interface.' },
    { id: 'luzon_24', name: 'Luzon Edge 23', region: 'Luzon', description: 'West Luzon backup transit cabinet.' }
  ];

  // Orbital system variables
  const xc = 400;
  const yc = 250;
  const angleRad = -15 * Math.PI / 180; // ring tilt

  // Map locations dynamically along the Saturn orbit
  const mapPointsForRing = (rawList: { id: string; name: string; region: string; description: string }[], ringA: number, ringB: number): Location[] => {
    return rawList.map((loc, idx) => {
      const t = (idx / rawList.length) * 2 * Math.PI;
      const x0 = ringA * Math.cos(t);
      const y0 = ringB * Math.sin(t);
      const x = xc + x0 * Math.cos(angleRad) - y0 * Math.sin(angleRad);
      const y = yc + x0 * Math.sin(angleRad) + y0 * Math.cos(angleRad);
      return {
        ...loc,
        x,
        y,
        t
      };
    });
  };

  // Calculate back and front paths
  const getEllipsePath = (tStart: number, tEnd: number, ringA: number, ringB: number) => {
    const steps = 60;
    const points: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = tStart + (i / steps) * (tEnd - tStart);
      const x0 = ringA * Math.cos(t);
      const y0 = ringB * Math.sin(t);
      const x = xc + x0 * Math.cos(angleRad) - y0 * Math.sin(angleRad);
      const y = yc + x0 * Math.sin(angleRad) + y0 * Math.cos(angleRad);
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  // Ring 1 (Inner) - Visayas (4 pins)
  const ring1A = 150;
  const ring1B = 48;
  const ring1Points = mapPointsForRing(visayasLocations, ring1A, ring1B);
  const backRing1Path = getEllipsePath(Math.PI, 2 * Math.PI, ring1A, ring1B);
  const frontRing1Path = getEllipsePath(0, Math.PI, ring1A, ring1B);
  const backPoints1 = ring1Points.filter(p => p.t >= Math.PI && p.t < 2 * Math.PI);
  const frontPoints1 = ring1Points.filter(p => p.t >= 0 && p.t < Math.PI);

  // Ring 2 (Middle) - Mindanao (4 pins)
  const ring2A = 220;
  const ring2B = 70;
  const ring2Points = mapPointsForRing(mindanaoLocations, ring2A, ring2B);
  const backRing2Path = getEllipsePath(Math.PI, 2 * Math.PI, ring2A, ring2B);
  const frontRing2Path = getEllipsePath(0, Math.PI, ring2A, ring2B);
  const backPoints2 = ring2Points.filter(p => p.t >= Math.PI && p.t < 2 * Math.PI);
  const frontPoints2 = ring2Points.filter(p => p.t >= 0 && p.t < Math.PI);

  // Ring 3 (Outer) - Luzon (24 pins)
  const ring3A = 290;
  const ring3B = 94;
  const ring3Points = mapPointsForRing(luzonLocations, ring3A, ring3B);
  const backRing3Path = getEllipsePath(Math.PI, 2 * Math.PI, ring3A, ring3B);
  const frontRing3Path = getEllipsePath(0, Math.PI, ring3A, ring3B);
  const backPoints3 = ring3Points.filter(p => p.t >= Math.PI && p.t < 2 * Math.PI);
  const frontPoints3 = ring3Points.filter(p => p.t >= 0 && p.t < Math.PI);

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
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto tracking-tight mb-4">
            Delivering Network Solutions Across 32+ Networks Nationwide
          </h2>
          <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-medium">
            Note: Includes past and present network engagements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto w-full overflow-hidden h-[300px] sm:h-[420px] lg:h-auto lg:aspect-[8/5]"
        >
          <svg viewBox="0 0 800 500" className="absolute h-full left-1/2 -translate-x-1/2 select-none lg:static lg:w-full lg:h-full lg:translate-x-0 lg:left-0">
            <style>{`
              @keyframes flow-clockwise {
                to {
                  stroke-dashoffset: -100;
                }
              }
              .animate-orbit-flow-1 {
                stroke-dasharray: 15 15;
                animation: flow-clockwise 10s linear infinite;
              }
              .animate-orbit-flow-2 {
                stroke-dasharray: 20 20;
                animation: flow-clockwise 15s linear infinite;
              }
              .animate-orbit-flow-3 {
                stroke-dasharray: 25 25;
                animation: flow-clockwise 20s linear infinite;
              }
            `}</style>
            <defs>
              <radialGradient id="planetGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#63b4b5" />
                <stop offset="75%" stopColor="#2e6d6e" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="ringGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Paths for text rendering along the curves */}
              <path id="labelPath1" d={backRing1Path} fill="none" stroke="none" />
              <path id="labelPath2" d={backRing2Path} fill="none" stroke="none" />
              <path id="labelPath3" d={backRing3Path} fill="none" stroke="none" />
            </defs>

            {/* 1. Back Ring Arcs (Rendered outer to inner: 3 -> 2 -> 1) */}
            <path d={backRing3Path} className="animate-orbit-flow-3" fill="none" stroke="#63b4b5" strokeWidth="4.5" strokeLinecap="round" opacity="0.15" filter="url(#ringGlow)" />
            <path d={backRing3Path} className="animate-orbit-flow-3" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.50" />

            <path d={backRing2Path} className="animate-orbit-flow-2" fill="none" stroke="#63b4b5" strokeWidth="4.0" strokeLinecap="round" opacity="0.18" filter="url(#ringGlow)" />
            <path d={backRing2Path} className="animate-orbit-flow-2" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

            <path d={backRing1Path} className="animate-orbit-flow-1" fill="none" stroke="#63b4b5" strokeWidth="3.5" strokeLinecap="round" opacity="0.22" filter="url(#ringGlow)" />
            <path d={backRing1Path} className="animate-orbit-flow-1" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.60" />

            {/* 2. Back Pins (Rendered outer to inner: 3 -> 2 -> 1) */}
            {backPoints3.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}
            {backPoints2.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}
            {backPoints1.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}

            {/* 3. Central Planet (Techne) */}
            <g>
              <circle cx={xc} cy={yc} r="94" fill="#63b4b5" opacity="0.22" filter="url(#glow)" />
              <circle cx={xc} cy={yc} r="90" fill="url(#planetGradient)" />
              <text x={xc} y={yc + 2} textAnchor="middle" dominantBaseline="middle" fill="white" className="font-bold text-2xl tracking-wider select-none pointer-events-none font-sans">
                Techne
              </text>
            </g>

            {/* 4. Front Ring Arcs (Rendered inner to outer: 1 -> 2 -> 3) */}
            <path d={frontRing1Path} className="animate-orbit-flow-1" fill="none" stroke="#63b4b5" strokeWidth="3.5" strokeLinecap="round" opacity="0.22" filter="url(#ringGlow)" />
            <path d={frontRing1Path} className="animate-orbit-flow-1" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.60" />

            <path d={frontRing2Path} className="animate-orbit-flow-2" fill="none" stroke="#63b4b5" strokeWidth="4.0" strokeLinecap="round" opacity="0.18" filter="url(#ringGlow)" />
            <path d={frontRing2Path} className="animate-orbit-flow-2" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />

            <path d={frontRing3Path} className="animate-orbit-flow-3" fill="none" stroke="#63b4b5" strokeWidth="4.5" strokeLinecap="round" opacity="0.15" filter="url(#ringGlow)" />
            <path d={frontRing3Path} className="animate-orbit-flow-3" fill="none" stroke="#63b4b5" strokeWidth="1.2" strokeLinecap="round" opacity="0.50" />

            {/* 5. Front Pins (Rendered inner to outer: 1 -> 2 -> 3) */}
            {frontPoints1.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}
            {frontPoints2.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}
            {frontPoints3.map((pin) => (
              <g key={pin.id} className="cursor-pointer group" onClick={() => setActiveLocation(pin)}>
                <circle cx={pin.x} cy={pin.y} r="6.5" fill="#63b4b5" stroke="white" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-[#2e6d6e] group-hover:r-[8px]" />
              </g>
            ))}

            {/* 6. Ring Labels (Curved along the top-left orbits) */}
            <text fill="#63b4b5" opacity="0.8" dy="-8" className="text-xs font-bold uppercase tracking-widest select-none pointer-events-none font-sans">
              <textPath href="#labelPath1" startOffset="15%" textAnchor="middle">
                Visayas
              </textPath>
            </text>
            <text fill="#63b4b5" opacity="0.8" dy="-8" className="text-xs font-bold uppercase tracking-widest select-none pointer-events-none font-sans">
              <textPath href="#labelPath2" startOffset="15%" textAnchor="middle">
                Mindanao
              </textPath>
            </text>
            <text fill="#63b4b5" opacity="0.8" dy="-8" className="text-xs font-bold uppercase tracking-widest select-none pointer-events-none font-sans">
              <textPath href="#labelPath3" startOffset="15%" textAnchor="middle">
                Luzon
              </textPath>
            </text>
          </svg>

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

export const TrustedBrands: React.FC = () => {
  const brands = [
    { name: 'Cisco', logo: brandCisco },
    { name: 'Juniper Networks', logo: brandJuniper },
    { name: 'Arista Networks', logo: brandArista },
    { name: 'MikroTik', logo: brandMikrotik },
    { name: 'VyOS', logo: brandVyos },
    { name: 'LibreQoS', logo: brandLibreqos },
    { name: 'pfSense', logo: brandPfsense },
    { name: 'Proxmox VE', logo: brandProxmox },
    { name: 'Dell Enterprise', logo: brandDell },
    { name: 'HP Enterprise', logo: brandHp },
    { name: 'Supermicro', logo: brandSupermicro },
    { name: 'Huawei', logo: brandHuawei },
    { name: 'ZTE', logo: brandZte },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Techne Trusted Brands
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-10 md:gap-16 max-w-6xl mx-auto"
        >
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 md:h-12 w-auto object-contain opacity-75 group-hover:opacity-100 transition-all duration-300 select-none"
                draggable="false"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
