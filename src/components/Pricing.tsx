import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Activity, Cpu, Wifi, Server, Shield, Locate, HelpCircle } from 'lucide-react';
import { PANEL_IDS } from '../constants';

declare global {
  interface Window {
    L: any;
  }
}

type TabType = 'internet' | 'colocation' | 'virtual';
type LocationType = 'Manila' | 'Cebu City' | 'Davao City' | 'Hong Kong' | 'Singapore';
type PortSizeType = '1 Gbps' | '10 Gbps' | '100 Gbps';
type ReachPlanType = 'Fixed Bandwidth' | 'Burstable';
type ContractTermType = '12 months' | '24 months' | '36 months';
type SpeedCommitType = 'None' | '100 Mbps' | '200 Mbps' | '500 Mbps' | '1 Gbps' | '2 Gbps' | '5 Gbps' | '10 Gbps';

type ColoCabinetType = '1U Server' | '10U Quarter' | '20U Half' | '42U Full';
type ColoPowerType = '1 kW' | '2 kW' | '3 kW' | '5 kW';

type VirtualServiceType = 'Virtual Router' | 'Virtual Firewall' | 'Cloud Gateway' | 'SD-WAN Edge';
type VirtualTierType = 'Starter' | 'Professional' | 'Enterprise' | 'Carrier';
type VirtualSupportType = 'Self-Managed' | 'Semi-Managed' | 'Fully-Managed';

const locationCoordinates: { [key in LocationType]: [number, number] } = {
  'Manila': [14.5995, 120.9842],
  'Cebu City': [10.3157, 123.8854],
  'Davao City': [7.0707, 125.6087],
  'Hong Kong': [22.3193, 114.1694],
  'Singapore': [1.3521, 103.8198]
};

const datacenterOptions: { [key in LocationType]: string[] } = {
  'Manila': ['Vitro Makati 1','Vitro Makati 2','Vitro Pasig','Vitro Parañaque','TIM Carmona','Globe MK2','My location is not listed'],
  'Cebu City': ['Vitro Cebu', 'Globe Cebu', 'My location is not listed'],
  'Davao City': ['Vitro Davao', 'Globe Davao', 'My location is not listed'],
  'Hong Kong': ['Equinix HK1', 'Mega-i Advantage', 'My location is not listed'],
  'Singapore': ['Equinix SG1', 'Global Switch Singapore', 'My location is not listed']
};

export const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('internet');

  const [internetLoc, setInternetLoc] = useState<LocationType>('Manila');
  const [internetDC, setInternetDC] = useState<string>('Vitro Makati 1');
  const [isDcDropdownOpen, setIsDcDropdownOpen] = useState(false);
  const dcDropdownRef = useRef<HTMLDivElement>(null);
  const [portSize, setPortSize] = useState<PortSizeType>('1 Gbps');
  const [numPorts, setNumPorts] = useState<number>(1);
  const [reachPlanType, setReachPlanType] = useState<ReachPlanType>('Fixed Bandwidth');
  const [speedCommit, setSpeedCommit] = useState<SpeedCommitType>('None');

  useEffect(() => {
    setInternetDC(datacenterOptions[internetLoc][0]);
  }, [internetLoc]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dcDropdownRef.current && !dcDropdownRef.current.contains(event.target as Node)) {
        setIsDcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const [coloLoc, setColoLoc] = useState<'Manila' | 'Cebu City' | 'Davao City'>('Manila');
  const [cabinetSize, setCabinetSize] = useState<ColoCabinetType>('1U Server');
  const [powerAlloc, setPowerAlloc] = useState<ColoPowerType>('1 kW');

  const [virtualLoc, setVirtualLoc] = useState<LocationType>('Manila');
  const [vService, setVService] = useState<VirtualServiceType>('Virtual Router');
  const [vTier, setVTier] = useState<VirtualTierType>('Starter');
  const [vSupport, setVSupport] = useState<VirtualSupportType>('Self-Managed');

  const [contractTerm, setContractTerm] = useState<ContractTermType>('12 months');

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  const locations: LocationType[] = ['Manila', 'Cebu City', 'Davao City', 'Hong Kong', 'Singapore'];
  const speedCommits: SpeedCommitType[] = ['None', '100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps', '2 Gbps', '5 Gbps', '10 Gbps'];
  const terms: { name: ContractTermType; note?: string }[] = [
    { name: '12 months' },
    { name: '24 months', note: 'Save 10%' },
    { name: '36 months', note: 'Save 15%' }
  ];

  const [isLocating, setIsLocating] = useState(false);

  const getActiveLoc = () => {
    if (activeTab === 'internet') return internetLoc;
    if (activeTab === 'colocation') return coloLoc;
    return virtualLoc;
  };
  const activeLoc = getActiveLoc();

  const findMyLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation is not supported by your browser.'); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closestLoc: LocationType = 'Manila';
        let minDistance = Infinity;
        const isColo = activeTab === 'colocation';
        const availableLocs = isColo ? (['Manila', 'Cebu City', 'Davao City'] as LocationType[]) : locations;
        availableLocs.forEach((loc) => {
          const [locLat, locLon] = locationCoordinates[loc];
          const dist = Math.pow(latitude - locLat, 2) + Math.pow(longitude - locLon, 2);
          if (dist < minDistance) { minDistance = dist; closestLoc = loc; }
        });
        if (activeTab === 'internet') setInternetLoc(closestLoc);
        else if (activeTab === 'colocation') setColoLoc(closestLoc as any);
        else if (activeTab === 'virtual') setVirtualLoc(closestLoc);
        setIsLocating(false);
      },
      (error) => { console.error('Geolocation error:', error); alert('Unable to determine your location.'); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.async = true;
    script.onload = () => { setLeafletLoaded(true); };
    document.body.appendChild(script);
    return () => {
      const existingLink = document.getElementById('leaflet-css');
      const existingScript = document.getElementById('leaflet-js');
      if (existingLink) document.head.removeChild(existingLink);
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    if (mapRef.current) return;
    const L = window.L;
    const map = L.map(mapContainerRef.current, { center: [12.0, 115.0], zoom: 4, zoomControl: false, attributionControl: false, scrollWheelZoom: true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [leafletLoaded]);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = window.L;
    const map = mapRef.current;
    const isColo = activeTab === 'colocation';
    Object.keys(markersRef.current).forEach((key) => { map.removeLayer(markersRef.current[key]); });
    markersRef.current = {};
    const coords = locationCoordinates[activeLoc];
    const icon = L.divIcon({
      html: `<div class="relative flex items-center justify-center w-8 h-8"><div class="absolute inset-0 rounded-full bg-brand-blue/30 animate-ping"></div><div class="w-4 h-4 rounded-full border-2 border-white shadow-lg bg-brand-blue scale-125 transition-all duration-300 relative z-10"></div></div>`,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    const marker = L.marker(coords, { icon });
    marker.addTo(map);
    markersRef.current[activeLoc] = marker;
    const onMapClick = (e: any) => {
      const { lat, lng } = e.latlng;
      let closestLoc: LocationType = 'Manila';
      let minDistance = Infinity;
      const availableLocs = isColo ? (['Manila', 'Cebu City', 'Davao City'] as LocationType[]) : locations;
      availableLocs.forEach((loc) => {
        const [locLat, locLon] = locationCoordinates[loc];
        const dist = Math.pow(lat - locLat, 2) + Math.pow(lng - locLon, 2);
        if (dist < minDistance) { minDistance = dist; closestLoc = loc; }
      });
      if (activeTab === 'internet') setInternetLoc(closestLoc);
      else if (activeTab === 'colocation') setColoLoc(closestLoc as any);
      else if (activeTab === 'virtual') setVirtualLoc(closestLoc);
    };
    map.on('click', onMapClick);
    return () => { map.off('click', onMapClick); };
  }, [leafletLoaded, activeTab, internetLoc, coloLoc, virtualLoc, activeLoc]);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const coords = locationCoordinates[activeLoc];
    mapRef.current.setView(coords, mapRef.current.getZoom(), { animate: true, duration: 0.8 });
  }, [leafletLoaded, activeTab, internetLoc, coloLoc, virtualLoc]);

  const calculateCost = () => {
    let subtotal = 0;
    let details = '';
    if (activeTab === 'internet') {
      const isInt = internetLoc === 'Hong Kong' || internetLoc === 'Singapore';
      let portRate = 0;
      if (portSize === '1 Gbps') portRate = isInt ? 120 : 150;
      else if (portSize === '10 Gbps') portRate = isInt ? 450 : 600;
      else if (portSize === '100 Gbps') portRate = isInt ? 2500 : 3500;
      const portCost = portRate * numPorts;
      let reachMbps = 0;
      switch (speedCommit) {
        case '100 Mbps': reachMbps = 100; break; case '200 Mbps': reachMbps = 200; break;
        case '500 Mbps': reachMbps = 500; break; case '1 Gbps': reachMbps = 1000; break;
        case '2 Gbps': reachMbps = 2000; break; case '5 Gbps': reachMbps = 5000; break;
        case '10 Gbps': reachMbps = 10000; break;
      }
      let reachCost = 0;
      if (reachMbps > 0) {
        let ratePerMbps = 2.0;
        if (reachMbps <= 200) ratePerMbps = 2.0;
        else if (reachMbps <= 1000) ratePerMbps = 1.4;
        else if (reachMbps <= 5000) ratePerMbps = 0.9;
        else ratePerMbps = 0.7;
        if (reachPlanType === 'Burstable') ratePerMbps *= 1.25;
        reachCost = reachMbps * ratePerMbps;
      }
      subtotal = portCost + reachCost;
      details = `loc=${internetLoc}&dc=${internetDC}&ports=${numPorts}&size=${portSize}&reach=${speedCommit}&reachtype=${reachPlanType}`;
    } else if (activeTab === 'colocation') {
      let cabinetCost = 0;
      if (cabinetSize === '1U Server') cabinetCost = 99;
      else if (cabinetSize === '10U Quarter') cabinetCost = 299;
      else if (cabinetSize === '20U Half') cabinetCost = 499;
      else if (cabinetSize === '42U Full') cabinetCost = 799;
      let powerCost = 0;
      if (powerAlloc === '1 kW') powerCost = 100;
      else if (powerAlloc === '2 kW') powerCost = 200;
      else if (powerAlloc === '3 kW') powerCost = 300;
      else if (powerAlloc === '5 kW') powerCost = 500;
      const locationMultiplier = coloLoc === 'Manila' ? 1.1 : 1.0;
      subtotal = (cabinetCost + powerCost) * locationMultiplier;
      details = `loc=${coloLoc}&space=${cabinetSize}&power=${powerAlloc}`;
    } else if (activeTab === 'virtual') {
      let serviceBase = 0;
      if (vService === 'Virtual Router') serviceBase = 49;
      else if (vService === 'Virtual Firewall') serviceBase = 79;
      else if (vService === 'Cloud Gateway') serviceBase = 119;
      else if (vService === 'SD-WAN Edge') serviceBase = 149;
      let tierCost = 0;
      if (vTier === 'Starter') tierCost = 20;
      else if (vTier === 'Professional') tierCost = 45;
      else if (vTier === 'Enterprise') tierCost = 90;
      else if (vTier === 'Carrier') tierCost = 180;
      let supportCost = 0;
      if (vSupport === 'Semi-Managed') supportCost = 99;
      else if (vSupport === 'Fully-Managed') supportCost = 249;
      subtotal = serviceBase + tierCost + supportCost;
      details = `loc=${virtualLoc}&service=${vService}&tier=${vTier}&support=${vSupport}`;
    }
    let discountPercent = 0;
    if (contractTerm === '24 months') discountPercent = 0.10;
    else if (contractTerm === '36 months') discountPercent = 0.15;
    const discountAmount = subtotal * discountPercent;
    const finalUSD = Math.round(subtotal - discountAmount);
    return { monthlyUSD: finalUSD, monthlyPHP: Math.round(finalUSD * 58), discount: Math.round(discountAmount), query: `type=${activeTab}&term=${contractTerm}&${details}` };
  };

  const costResult = calculateCost();

  return (
    <section className="py-20 bg-paper-2 min-h-[90vh]">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight">
            Tailored Interconnection Pricing
          </h1>
          <p className="font-body text-[1.125rem] text-ink-2 mt-4 leading-relaxed">
            Choose a service line, customize hardware and bandwidth commitments, and calculate your SLA-backed rates.
          </p>
        </motion.div>

        {/* Service tabs */}
        <div className="bg-paper border border-rule p-1 rounded-[4px] mb-10 flex flex-wrap justify-between items-center gap-1 max-w-3xl mx-auto">
          {(['internet', 'colocation', 'virtual'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 min-w-[120px] text-center py-3 px-4 rounded-[4px] font-display text-sm font-semibold transition-colors duration-[180ms] relative flex items-center justify-center gap-2"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeCategoryTabBg"
                  className="absolute inset-0 bg-brand-blue rounded-[4px]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center justify-center gap-2 transition-colors duration-[180ms] ${activeTab === tab ? 'text-white' : 'text-ink-2 hover:text-ink'}`}>
                {tab === 'internet' && <Wifi size={15} />}
                {tab === 'colocation' && <Server size={15} />}
                {tab === 'virtual' && <Cpu size={15} />}
                <span>{tab === 'internet' ? 'Internet' : tab === 'colocation' ? 'Colocation' : 'Virtual Services'}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Calculator workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">

          {/* Config panel */}
          <div className="lg:col-span-8 bg-paper border border-rule rounded-[4px] p-6 md:p-8 space-y-8">

            {/* Map selector */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Select Interconnection Node</h3>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <button
                    onClick={findMyLocation}
                    disabled={isLocating}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-rule rounded-[4px] font-display text-xs font-semibold text-ink-2 hover:text-accent hover:border-accent transition-colors duration-[180ms] disabled:opacity-50"
                  >
                    {isLocating ? (
                      <div className="w-3.5 h-3.5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Locate size={13} />
                    )}
                    <span>Find My Location</span>
                  </button>
                  <span className="font-mono text-xs text-accent flex items-center gap-1 bg-accent/8 px-3 py-1.5 rounded-[4px] border border-accent/20">
                    <MapPin size={11} />
                    <span>{activeLoc}</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-[300px] rounded-[4px] overflow-hidden border border-rule relative bg-paper-2 z-0">
                {!leafletLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-ink-2 text-sm font-body bg-paper-2">
                    <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mr-3" />
                    Loading map...
                  </div>
                )}
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            </div>

            <div className="border-t border-rule" />

            {/* Internet options */}
            {activeTab === 'internet' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Port Size</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['1 Gbps', '10 Gbps', '100 Gbps'] as PortSizeType[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPortSize(size)}
                        className={`p-5 rounded-[4px] border text-left transition-colors duration-[180ms] ${portSize === size ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xl font-bold text-ink">{size}</span>
                          {portSize === size && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white"><Check size={11} strokeWidth={3} /></div>}
                        </div>
                        <span className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Peering Interface</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Number of Ports</h3>
                  <div className="grid grid-cols-4 gap-3 max-w-xs">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumPorts(num)}
                        className={`py-3 rounded-[4px] border font-display font-semibold text-sm transition-colors duration-[180ms] ${numPorts === num ? 'border-brand-blue bg-brand-blue text-white' : 'border-rule text-ink-2 hover:border-ink-2 bg-paper-2'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-rule">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest">Techne Reach Plan</h3>
                      <p className="font-body text-xs text-ink-2 mt-1">Global upstream & exchange cache paths</p>
                    </div>
                    <div className="bg-paper-2 border border-rule p-1 rounded-[4px] flex gap-1">
                      {(['Fixed Bandwidth', 'Burstable'] as ReachPlanType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setReachPlanType(type)}
                          className={`px-3 py-1.5 rounded-[4px] font-display text-xs font-semibold transition-colors duration-[180ms] ${reachPlanType === type ? 'bg-paper text-ink shadow-sm border border-rule' : 'text-ink-2 hover:text-ink'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={speedCommit}
                      onChange={(e) => setSpeedCommit(e.target.value as SpeedCommitType)}
                      className="input-field appearance-none cursor-pointer"
                    >
                      {speedCommits.map((speed) => (
                        <option key={speed} value={speed}>
                          {speed === 'None' ? 'No Techne Reach Plan (Peering Ports Only)' : `Commitment: ${speed}`}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink-2">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>

                  <div className="mt-5" ref={dcDropdownRef}>
                    <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-3">Select Interface Datacenter</h3>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDcDropdownOpen(!isDcDropdownOpen)}
                        className="input-field text-left flex justify-between items-center cursor-pointer"
                      >
                        <span>{internetDC}</span>
                        <svg className={`fill-current h-4 w-4 text-ink-2 transition-transform duration-[180ms] ${isDcDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </button>
                      {isDcDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-paper border border-rule rounded-[4px] shadow-sm overflow-hidden flex flex-col z-30">
                          {datacenterOptions[internetLoc].map((dc) => {
                            const isSelected = internetDC === dc;
                            return (
                              <button
                                key={dc}
                                type="button"
                                onClick={() => { setInternetDC(dc); setIsDcDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors duration-[180ms] ${isSelected ? 'bg-brand-blue text-white' : 'bg-paper text-ink hover:bg-paper-2'}`}
                              >
                                {dc}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Colocation options */}
            {activeTab === 'colocation' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Cabinet Space Size</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { id: '1U Server', label: '1U Server Slot', desc: 'Best for standard rack servers' },
                      { id: '10U Quarter', label: '10U Quarter Cabinet', desc: 'Secure shared cabinet partition' },
                      { id: '20U Half', label: '20U Half Cabinet', desc: 'Ideal for growing enterprise setups' },
                      { id: '42U Full', label: '42U Full Cabinet', desc: 'Dedicated full-height locked cabinet' }
                    ] as { id: ColoCabinetType; label: string; desc: string }[]).map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setCabinetSize(size.id)}
                        className={`p-4 rounded-[4px] border text-left transition-colors duration-[180ms] flex justify-between items-start ${cabinetSize === size.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div>
                          <span className="font-display font-semibold text-ink block mb-1 text-sm">{size.label}</span>
                          <span className="font-body text-xs text-ink-2">{size.desc}</span>
                        </div>
                        {cabinetSize === size.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Redundant Power Limit</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['1 kW', '2 kW', '3 kW', '5 kW'] as ColoPowerType[]).map((power) => (
                      <button
                        key={power}
                        onClick={() => setPowerAlloc(power)}
                        className={`py-3 rounded-[4px] border font-mono font-semibold text-sm transition-colors duration-[180ms] ${powerAlloc === power ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-rule text-ink-2 hover:border-ink-2 bg-paper-2'}`}
                      >
                        {power}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Virtual options */}
            {activeTab === 'virtual' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Service Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { id: 'Virtual Router', label: 'Virtual Router (vRouter)', desc: 'Enterprise routing engine with BGP supports' },
                      { id: 'Virtual Firewall', label: 'Virtual Firewall (vFirewall)', desc: 'Edge protection with unified threat control' },
                      { id: 'Cloud Gateway', label: 'Multi-Cloud Connect Gateway', desc: 'Secure pathways to AWS, Azure, & GCP' },
                      { id: 'SD-WAN Edge', label: 'SD-WAN Edge Gateway', desc: 'Software-defined wide area orchestration' }
                    ] as { id: VirtualServiceType; label: string; desc: string }[]).map((serv) => (
                      <button
                        key={serv.id}
                        onClick={() => setVService(serv.id)}
                        className={`p-4 rounded-[4px] border text-left transition-colors duration-[180ms] flex justify-between items-start ${vService === serv.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div>
                          <span className="font-display font-semibold text-ink block mb-1 text-sm">{serv.label}</span>
                          <span className="font-body text-xs text-ink-2">{serv.desc}</span>
                        </div>
                        {vService === serv.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Resource Capacity Tier</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([
                      { id: 'Starter', specs: '1 vCPU / 2GB' },
                      { id: 'Professional', specs: '2 vCPU / 4GB' },
                      { id: 'Enterprise', specs: '4 vCPU / 8GB' },
                      { id: 'Carrier', specs: '8 vCPU / 16GB' }
                    ] as { id: VirtualTierType; specs: string }[]).map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setVTier(tier.id)}
                        className={`p-4 rounded-[4px] border text-center transition-colors duration-[180ms] flex flex-col items-center ${vTier === tier.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <span className="font-display font-semibold text-ink text-sm">{tier.id}</span>
                        <span className="font-mono text-[10px] text-ink-2 mt-1">{tier.specs}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Managed Engineering Support</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { id: 'Self-Managed', label: 'Self-Managed', desc: 'No engineer support' },
                      { id: 'Semi-Managed', label: 'Semi-Managed', desc: 'Config backup & updates' },
                      { id: 'Fully-Managed', label: 'Fully-Managed', desc: '24/7 engineer management' }
                    ] as { id: VirtualSupportType; label: string; desc: string }[]).map((supp) => (
                      <button
                        key={supp.id}
                        onClick={() => setVSupport(supp.id)}
                        className={`p-4 rounded-[4px] border text-left transition-colors duration-[180ms] flex justify-between items-start ${vSupport === supp.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div>
                          <span className="font-display font-semibold text-ink text-sm block mb-1">{supp.label}</span>
                          <span className="font-body text-xs text-ink-2">{supp.desc}</span>
                        </div>
                        {vSupport === supp.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-2"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contract term */}
            <div className="pt-6 border-t border-rule">
              <h3 className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-4">Contract Term</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {terms.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setContractTerm(t.name)}
                    className={`p-4 rounded-[4px] border text-center transition-colors duration-[180ms] flex flex-col items-center ${contractTerm === t.name ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                  >
                    <span className="font-display font-semibold text-ink text-sm">{t.name}</span>
                    {t.note && (
                      <span className="font-mono text-[10px] text-accent mt-1 bg-accent/10 px-2 py-0.5 rounded-[2px]">
                        {t.note}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quote sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-ink text-white rounded-[4px] p-8 flex flex-col justify-between min-h-[440px]">
              <div>
                <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">Your Subscription</h3>

                <div className="mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-white" style={{ fontSize: 'var(--text-4xl)', lineHeight: 1 }}>
                      ${costResult.monthlyUSD.toLocaleString()}
                    </span>
                    <span className="font-body text-white/40 text-sm">/ mo</span>
                  </div>
                  <div className="font-mono text-accent text-xs mt-2">
                    ~ ₱{costResult.monthlyPHP.toLocaleString()} PHP / month
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-white/40">
                    <span className="font-body">Category:</span>
                    <span className="font-display font-semibold text-white capitalize">{activeTab}</span>
                  </div>

                  {activeTab === 'internet' && (<>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Location:</span>
                      <span className="font-display font-semibold text-white flex items-center gap-1"><MapPin size={11} className="text-accent" />{internetLoc}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Datacenter:</span>
                      <span className="font-display font-semibold text-white text-right max-w-[10rem] truncate">{internetDC}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Ports:</span>
                      <span className="font-mono font-semibold text-white">{numPorts} × {portSize}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Reach Plan:</span>
                      <span className="font-display font-semibold text-white text-right">{speedCommit === 'None' ? 'Peering Only' : `${reachPlanType} (${speedCommit})`}</span>
                    </div>
                  </>)}

                  {activeTab === 'colocation' && (<>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Location:</span>
                      <span className="font-display font-semibold text-white flex items-center gap-1"><MapPin size={11} className="text-accent" />{coloLoc}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Space:</span>
                      <span className="font-display font-semibold text-white">{cabinetSize}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Power:</span>
                      <span className="font-mono font-semibold text-white">{powerAlloc}</span>
                    </div>
                  </>)}

                  {activeTab === 'virtual' && (<>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Edge Node:</span>
                      <span className="font-display font-semibold text-white flex items-center gap-1"><MapPin size={11} className="text-accent" />{virtualLoc}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Service:</span>
                      <span className="font-display font-semibold text-white">{vService}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Tier:</span>
                      <span className="font-display font-semibold text-white">{vTier}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40">
                      <span className="font-body">Managed:</span>
                      <span className="font-display font-semibold text-white">{vSupport}</span>
                    </div>
                  </>)}

                  <div className="flex justify-between items-center text-white/40">
                    <span className="font-body">Term:</span>
                    <span className="font-mono font-semibold text-white">{contractTerm}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  to={`/${PANEL_IDS.CONTACT}?${costResult.query}`}
                  className="w-full py-3.5 bg-accent hover:bg-accent-hover text-accent-ink rounded-[4px] text-center font-display font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors duration-[180ms]"
                >
                  Apply Now
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Inclusions grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-rule pt-16">

          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-[4px] text-accent">
                {activeTab === 'internet' ? <Cpu size={18} /> : activeTab === 'colocation' ? <Server size={18} /> : <Shield size={18} />}
              </div>
              <h3 className="font-display font-semibold text-ink">
                {activeTab === 'internet' && 'Port Plan Inclusions'}
                {activeTab === 'colocation' && 'Datacenter Standards'}
                {activeTab === 'virtual' && 'Virtual Edge Benefits'}
              </h3>
            </div>
            <ul className="space-y-3">
              {activeTab === 'internet' && ['Peered traffic from Alibaba, Amazon, Facebook, Fastly, Google, Riot Games, Swarmify, Tencent, TikTok, Twitch, Zenlayer','Bilateral/multilateral peering support via redundant route servers','Advanced BGP community-based route control','Private VLAN support for secure and isolated traffic exchange','Access to open-source mirror servers'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
              {activeTab === 'colocation' && ['A+B Redundant Power allocation from separate UPS configurations','Carrier-Neutral cross connects with all major local fibers','Strict environmental controls (20-24°C, 40-60% humidity)','Direct physical access authorization workflows','24/7 smart-hands engineer support availability on-site'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
              {activeTab === 'virtual' && ['Instant automated deployment and configuration sync','Full IPv4/IPv6 dual stack support built-in','Redundant virtual backplane linking all Edge locations','Integrated stateful packet filters and access logs','Elastic scalability to dynamically resize CPU/RAM capacity'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-[4px] text-accent">
                {activeTab === 'internet' ? <Activity size={18} /> : activeTab === 'colocation' ? <Cpu size={18} /> : <Activity size={18} />}
              </div>
              <h3 className="font-display font-semibold text-ink">
                {activeTab === 'internet' && 'Techne Reach Plan Inclusions'}
                {activeTab === 'colocation' && 'Infrastructure Facilities'}
                {activeTab === 'virtual' && 'Edge Node Integrations'}
              </h3>
            </div>
            <ul className="space-y-3">
              {activeTab === 'internet' && ['Expanded content via partner Internet Exchanges in Singapore and Hong Kong','Cached content from Akamai, Cloudflare, Facebook, Google, Microsoft, Netflix (coming soon), Steam','Burstable plans and usage-based pricing','Longer contract terms available for Manila','Optimized performance by serving content closer to your network'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
              {activeTab === 'colocation' && ['Precision N+1 cooling infrastructure with hot/cold aisle setups','Gas-based fire suppression systems (FM-200 or equivalent)','Dual diesel engine backup generators with 72-hour fuel storage','Underfloor cable pathways for power and fiber routing','Dedicated client testing benches and assembly spaces'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
              {activeTab === 'virtual' && ['Direct link to local Internet Peering (PHOpenIX)','Zero-downtime routing protocol migrations','Optional cloud-delivered DNS firewall integration','Custom API endpoint control keys','Comprehensive flow log export pipelines (NetFlow/IPFIX)'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-2">
                  <div className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <span className="font-body text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="p-7 bg-paper border border-rule rounded-[4px] flex flex-col justify-between h-full min-h-[260px]">
              <div>
                <div className="w-10 h-10 rounded-[4px] bg-paper-2 border border-rule flex items-center justify-center text-accent mb-5">
                  <HelpCircle size={20} />
                </div>
                <h4 className="font-display font-bold text-ink mb-2">Not sure what to choose?</h4>
                <p className="font-body text-sm text-ink-2 leading-relaxed mb-5">
                  Let our interconnection experts design a custom network structure tailored for your routing policies, latency targets, and business requirements.
                </p>
              </div>
              <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary w-full justify-center py-3">
                Contact Us
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
