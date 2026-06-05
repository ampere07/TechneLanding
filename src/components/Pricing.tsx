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
  'Manila': [
    'Vitro Makati 1',
    'Vitro Makati 2',
    'Vitro Pasig',
    'Vitro Parañaque',
    'TIM Carmona',
    'Globe MK2',
    'My location is not listed'
  ],
  'Cebu City': ['Vitro Cebu', 'Globe Cebu', 'My location is not listed'],
  'Davao City': ['Vitro Davao', 'Globe Davao', 'My location is not listed'],
  'Hong Kong': ['Equinix HK1', 'Mega-i Advantage', 'My location is not listed'],
  'Singapore': ['Equinix SG1', 'Global Switch Singapore', 'My location is not listed']
};

export const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('internet');

  // 1. Internet State
  const [internetLoc, setInternetLoc] = useState<LocationType>('Manila');
  const [internetDC, setInternetDC] = useState<string>('Vitro Makati 1');
  const [isDcDropdownOpen, setIsDcDropdownOpen] = useState(false);
  const dcDropdownRef = useRef<HTMLDivElement>(null);
  const [portSize, setPortSize] = useState<PortSizeType>('1 Gbps');
  const [numPorts, setNumPorts] = useState<number>(1);
  const [reachPlanType, setReachPlanType] = useState<ReachPlanType>('Fixed Bandwidth');
  const [speedCommit, setSpeedCommit] = useState<SpeedCommitType>('None');

  // Sync selected datacenter on location switch
  useEffect(() => {
    setInternetDC(datacenterOptions[internetLoc][0]);
  }, [internetLoc]);

  // Click outside datacenter dropdown listener to auto-close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dcDropdownRef.current && !dcDropdownRef.current.contains(event.target as Node)) {
        setIsDcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 2. Colocation State
  const [coloLoc, setColoLoc] = useState<'Manila' | 'Cebu City' | 'Davao City'>('Manila');
  const [cabinetSize, setCabinetSize] = useState<ColoCabinetType>('1U Server');
  const [powerAlloc, setPowerAlloc] = useState<ColoPowerType>('1 kW');

  // 3. Virtual Services State
  const [virtualLoc, setVirtualLoc] = useState<LocationType>('Manila');
  const [vService, setVService] = useState<VirtualServiceType>('Virtual Router');
  const [vTier, setVTier] = useState<VirtualTierType>('Starter');
  const [vSupport, setVSupport] = useState<VirtualSupportType>('Self-Managed');

  // Global state
  const [contractTerm, setContractTerm] = useState<ContractTermType>('12 months');

  // Leaflet Map References
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

  // Geolocation trigger state
  const [isLocating, setIsLocating] = useState(false);

  // Active Location getter helper
  const getActiveLoc = () => {
    if (activeTab === 'internet') return internetLoc;
    if (activeTab === 'colocation') return coloLoc;
    return virtualLoc;
  };
  const activeLoc = getActiveLoc();

  // Find nearest node using browser location coordinates
  const findMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        let closestLoc: LocationType = 'Manila';
        let minDistance = Infinity;

        // For Colocation, restrict geolocation mapping to Philippines sites only
        const isColo = activeTab === 'colocation';
        const availableLocs = isColo 
          ? (['Manila', 'Cebu City', 'Davao City'] as LocationType[]) 
          : locations;

        availableLocs.forEach((loc) => {
          const [locLat, locLon] = locationCoordinates[loc];
          // Squared distance formula
          const dist = Math.pow(latitude - locLat, 2) + Math.pow(longitude - locLon, 2);
          if (dist < minDistance) {
            minDistance = dist;
            closestLoc = loc;
          }
        });

        // Set state
        if (activeTab === 'internet') setInternetLoc(closestLoc);
        else if (activeTab === 'colocation') setColoLoc(closestLoc as any);
        else if (activeTab === 'virtual') setVirtualLoc(closestLoc);

        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to determine your location. Please select a node directly on the map.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      const existingLink = document.getElementById('leaflet-css');
      const existingScript = document.getElementById('leaflet-js');
      if (existingLink) document.head.removeChild(existingLink);
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const L = window.L;
    const map = L.map(mapContainerRef.current, {
      center: [12.0, 115.0],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Update Marker and Map Click Handler
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const L = window.L;
    const map = mapRef.current;
    const isColo = activeTab === 'colocation';

    // Clear old markers
    Object.keys(markersRef.current).forEach((key) => {
      map.removeLayer(markersRef.current[key]);
    });
    markersRef.current = {};

    // Draw only the single active marker
    const coords = locationCoordinates[activeLoc];
    const icon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 group">
          <div class="absolute inset-0 rounded-full bg-brand-blue/30 animate-ping"></div>
          <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg bg-brand-blue scale-125 transition-all duration-300 relative z-10"></div>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker(coords, { icon });
    marker.addTo(map);
    markersRef.current[activeLoc] = marker;

    // Register click handler on map to find closest available node and jump there
    const onMapClick = (e: any) => {
      const { lat, lng } = e.latlng;
      let closestLoc: LocationType = 'Manila';
      let minDistance = Infinity;

      const availableLocs = isColo 
        ? (['Manila', 'Cebu City', 'Davao City'] as LocationType[]) 
        : locations;

      availableLocs.forEach((loc) => {
        const [locLat, locLon] = locationCoordinates[loc];
        const dist = Math.pow(lat - locLat, 2) + Math.pow(lng - locLon, 2);
        if (dist < minDistance) {
          minDistance = dist;
          closestLoc = loc;
        }
      });

      if (activeTab === 'internet') setInternetLoc(closestLoc);
      else if (activeTab === 'colocation') setColoLoc(closestLoc as any);
      else if (activeTab === 'virtual') setVirtualLoc(closestLoc);
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
    };
  }, [leafletLoaded, activeTab, internetLoc, coloLoc, virtualLoc, activeLoc]);

  // Pan Map to active location
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const coords = locationCoordinates[activeLoc];
    mapRef.current.setView(coords, mapRef.current.getZoom(), {
      animate: true,
      duration: 0.8
    });
  }, [leafletLoaded, activeTab, internetLoc, coloLoc, virtualLoc]);

  // Pricing calculations
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
        case '100 Mbps': reachMbps = 100; break;
        case '200 Mbps': reachMbps = 200; break;
        case '500 Mbps': reachMbps = 500; break;
        case '1 Gbps': reachMbps = 1000; break;
        case '2 Gbps': reachMbps = 2000; break;
        case '5 Gbps': reachMbps = 5000; break;
        case '10 Gbps': reachMbps = 10000; break;
      }

      let reachCost = 0;
      if (reachMbps > 0) {
        let ratePerMbps = 2.0;
        if (reachMbps <= 200) ratePerMbps = 2.0;
        else if (reachMbps <= 1000) ratePerMbps = 1.4;
        else if (reachMbps <= 5000) ratePerMbps = 0.9;
        else ratePerMbps = 0.7;

        if (reachPlanType === 'Burstable') {
          ratePerMbps *= 1.25;
        }
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

      // Manila markup
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

    // Discount Term
    let discountPercent = 0;
    if (contractTerm === '24 months') discountPercent = 0.10;
    else if (contractTerm === '36 months') discountPercent = 0.15;

    const discountAmount = subtotal * discountPercent;
    const finalUSD = Math.round(subtotal - discountAmount);

    return {
      monthlyUSD: finalUSD,
      monthlyPHP: Math.round(finalUSD * 58),
      discount: Math.round(discountAmount),
      query: `type=${activeTab}&term=${contractTerm}&${details}`
    };
  };

  const costResult = calculateCost();

  return (
    <section className="py-20 bg-slate-50/50 min-h-[90vh]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
              Subscription Cost Calculator
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-4 tracking-tight">
            Tailored Interconnection <span className="text-brand-blue">Pricing</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Choose a service line, customize hardware and bandwidth commitments, and calculate your SLA-backed rates.
          </p>
        </div>

        {/* Top Service Tabs */}
        <div className="bg-white border border-slate-200/80 p-1.5 rounded-2xl shadow-sm mb-12 flex flex-wrap justify-between items-center gap-1 max-w-3xl mx-auto">
          {(['internet', 'colocation', 'virtual'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 min-w-[150px] text-center py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative flex items-center justify-center space-x-2"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeCategoryTabBg"
                  className="absolute inset-0 bg-brand-blue rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center justify-center space-x-2 transition-colors duration-300 ${
                activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-900'
              }`}>
                {tab === 'internet' && <Wifi size={16} />}
                {tab === 'colocation' && <Server size={16} />}
                {tab === 'virtual' && <Cpu size={16} />}
                <span className="capitalize">{tab === 'internet' ? 'Internet' : tab === 'colocation' ? 'Colocation' : 'Virtual Services'}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Calculator workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Config Controls */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/30 space-y-8">
            
            {/* Shared Location Map Selector */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Interconnection Node</h3>
                <div className="flex items-center space-x-3 self-start sm:self-auto">
                  <button
                    onClick={findMyLocation}
                    disabled={isLocating}
                    className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-blue hover:border-brand-blue transition-all duration-300 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <div className="w-3.5 h-3.5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Locate size={14} />
                    )}
                    <span>Find My Location</span>
                  </button>
                  <span className="text-xs font-bold text-brand-blue flex items-center space-x-1 bg-brand-blue/10 px-3 py-1.5 rounded-xl border border-brand-blue/10">
                    <MapPin size={12} />
                    <span>Active: {activeLoc}</span>
                  </span>
                </div>
              </div>

              {/* Leaflet OSM Map */}
              <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner relative bg-slate-100 z-0">
                {!leafletLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50">
                    <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                    Loading Interconnection Map...
                  </div>
                )}
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-slate-100 my-6"></div>

            {/* Internet Options Panel */}
            {activeTab === 'internet' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Port Size */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Port Size</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['1 Gbps', '10 Gbps', '100 Gbps'] as PortSizeType[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPortSize(size)}
                        className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                          portSize === size 
                            ? 'border-brand-blue bg-brand-blue/[0.03]' 
                            : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-2xl font-black text-slate-900 tracking-tight">{size}</span>
                          {portSize === size && <div className="w-5.5 h-5.5 rounded-full bg-brand-blue flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Peering Interface</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Ports */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Number of Ports</h3>
                  <div className="grid grid-cols-4 gap-4 max-w-sm">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumPorts(num)}
                        className={`py-3.5 rounded-xl border font-bold transition-all duration-300 ${
                          numPorts === num
                            ? 'border-brand-blue bg-brand-blue text-white'
                            : 'border-slate-200/60 text-slate-600 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Techne Reach Plan */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Techne Reach Plan</h3>
                      <p className="text-[11px] text-slate-400 mt-1">Global upstream & exchange cache paths</p>
                    </div>
                    <div className="bg-slate-100 p-1 rounded-xl flex space-x-1">
                      {(['Fixed Bandwidth', 'Burstable'] as ReachPlanType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setReachPlanType(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                            reachPlanType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-blue outline-none transition-all duration-300 font-medium text-sm appearance-none cursor-pointer"
                    >
                      {speedCommits.map((speed) => (
                        <option key={speed} value={speed}>
                          {speed === 'None' ? 'No Techne Reach Plan (Peering Ports Only)' : `Commitment: ${speed}`}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Datacenter Selection Dropdown */}
                  <div className="mt-6" ref={dcDropdownRef}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select Interface Datacenter</h3>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDcDropdownOpen(!isDcDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-4 focus:ring-2 focus:ring-brand-blue outline-none transition-all duration-300 font-medium text-sm text-left flex justify-between items-center cursor-pointer"
                      >
                        <span>{internetDC}</span>
                        <svg
                          className={`fill-current h-4 w-4 text-slate-400 transition-transform duration-300 ${isDcDropdownOpen ? 'rotate-180' : ''}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </button>
                      
                      {isDcDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col z-30">
                          {datacenterOptions[internetLoc].map((dc) => {
                            const isSelected = internetDC === dc;
                            return (
                              <button
                                key={dc}
                                type="button"
                                onClick={() => {
                                  setInternetDC(dc);
                                  setIsDcDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 text-[15px] font-sans transition-colors leading-normal ${
                                  isSelected
                                    ? 'bg-[#0B66D6] text-white font-normal'
                                    : 'bg-white text-slate-900 hover:bg-slate-50 font-normal'
                                }`}
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

            {/* Colocation Options Panel */}
            {activeTab === 'colocation' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Cabinet Size */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cabinet Space Size</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      { id: '1U Server', label: '1U Server Slot', desc: 'Best for standard rack servers' },
                      { id: '10U Quarter', label: '10U Quarter Cabinet', desc: 'Secure shared cabinet partition' },
                      { id: '20U Half', label: '20U Half Cabinet', desc: 'Ideal for growing enterprise setups' },
                      { id: '42U Full', label: '42U Full Cabinet', desc: 'Dedicated full-height locked cabinet' }
                    ] as { id: ColoCabinetType; label: string; desc: string }[]).map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setCabinetSize(size.id)}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 flex justify-between items-start ${
                          cabinetSize === size.id 
                            ? 'border-brand-blue bg-brand-blue/[0.03]' 
                            : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 block mb-1 text-sm">{size.label}</span>
                          <span className="text-[11px] text-slate-400">{size.desc}</span>
                        </div>
                        {cabinetSize === size.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power Allocation */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Redundant Power Limit</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(['1 kW', '2 kW', '3 kW', '5 kW'] as ColoPowerType[]).map((power) => (
                      <button
                        key={power}
                        onClick={() => setPowerAlloc(power)}
                        className={`py-3.5 rounded-xl border font-bold text-sm transition-all duration-300 ${
                          powerAlloc === power 
                            ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' 
                            : 'border-slate-200/60 text-slate-500 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        {power}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Virtual Services Options Panel */}
            {activeTab === 'virtual' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Service Type */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Service Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      { id: 'Virtual Router', label: 'Virtual Router (vRouter)', desc: 'Enterprise routing engine with BGP supports' },
                      { id: 'Virtual Firewall', label: 'Virtual Firewall (vFirewall)', desc: 'Edge protection with unified threat control' },
                      { id: 'Cloud Gateway', label: 'Multi-Cloud Connect Gateway', desc: 'Secure pathways to AWS, Azure, & GCP' },
                      { id: 'SD-WAN Edge', label: 'SD-WAN Edge Gateway', desc: 'Software-defined wide area orchestration' }
                    ] as { id: VirtualServiceType; label: string; desc: string }[]).map((serv) => (
                      <button
                        key={serv.id}
                        onClick={() => setVService(serv.id)}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 flex justify-between items-start ${
                          vService === serv.id 
                            ? 'border-brand-blue bg-brand-blue/[0.03]' 
                            : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 block mb-1 text-sm">{serv.label}</span>
                          <span className="text-[11px] text-slate-400">{serv.desc}</span>
                        </div>
                        {vService === serv.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource Tier */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resource Capacity Tier</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {([
                      { id: 'Starter', specs: '1 vCPU / 2GB' },
                      { id: 'Professional', specs: '2 vCPU / 4GB' },
                      { id: 'Enterprise', specs: '4 vCPU / 8GB' },
                      { id: 'Carrier', specs: '8 vCPU / 16GB' }
                    ] as { id: VirtualTierType; specs: string }[]).map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setVTier(tier.id)}
                        className={`p-4 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-center ${
                          vTier === tier.id 
                            ? 'border-brand-blue bg-brand-blue/[0.03]' 
                            : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        <span className="font-bold text-slate-900 text-sm">{tier.id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">{tier.specs}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Managed Support Level */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Managed Engineering Support</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {([
                      { id: 'Self-Managed', label: 'Self-Managed', desc: 'No engineer support' },
                      { id: 'Semi-Managed', label: 'Semi-Managed', desc: 'Config backup & updates' },
                      { id: 'Fully-Managed', label: 'Fully-Managed', desc: '24/7 engineer management' }
                    ] as { id: VirtualSupportType; label: string; desc: string }[]).map((supp) => (
                      <button
                        key={supp.id}
                        onClick={() => setVSupport(supp.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-start ${
                          vSupport === supp.id 
                            ? 'border-brand-blue bg-brand-blue/[0.03]' 
                            : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-55'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 text-sm block mb-1">{supp.label}</span>
                          <span className="text-[10px] text-slate-400">{supp.desc}</span>
                        </div>
                        {vSupport === supp.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-2"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Global Contract Term */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contract Term</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {terms.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setContractTerm(t.name)}
                    className={`p-5 rounded-2xl border text-center transition-all duration-300 relative flex flex-col items-center justify-center ${
                      contractTerm === t.name 
                        ? 'border-brand-blue bg-brand-blue/[0.03] shadow-md shadow-brand-blue/5' 
                        : 'border-slate-200/60 hover:border-slate-400 hover:bg-slate-55'
                    }`}
                  >
                    <span className="font-bold text-slate-900">{t.name}</span>
                    {t.note && (
                      <span className="text-[10px] text-brand-blue font-bold mt-1 bg-brand-blue/10 px-2 py-0.5 rounded-full">
                        {t.note}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quote Sidebar Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-blue/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-brand-blue/10 blur-xl pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Your Subscription</h3>
                
                {/* Cost Output */}
                <div className="mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black tracking-tight text-white">
                      ${costResult.monthlyUSD.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-sm ml-2 font-medium">/ mo</span>
                  </div>
                  <div className="text-brand-blue text-xs font-bold mt-2">
                    ~ ₱{costResult.monthlyPHP.toLocaleString()} PHP / month
                  </div>
                </div>

                {/* Selected Details List */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Category:</span>
                    <span className="text-white font-semibold capitalize">{activeTab}</span>
                  </div>
                  
                  {activeTab === 'internet' && (
                    <>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Location:</span>
                        <span className="text-white font-semibold flex items-center space-x-1">
                          <MapPin size={12} className="text-brand-blue" />
                          <span>{internetLoc}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Datacenter:</span>
                        <span className="text-white font-semibold">{internetDC}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Ports:</span>
                        <span className="text-white font-semibold">{numPorts} × {portSize}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Reach Plan:</span>
                        <span className="text-white font-semibold">
                          {speedCommit === 'None' ? 'Peering Only' : `${reachPlanType} (${speedCommit})`}
                        </span>
                      </div>
                    </>
                  )}

                  {activeTab === 'colocation' && (
                    <>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Location:</span>
                        <span className="text-white font-semibold flex items-center space-x-1">
                          <MapPin size={12} className="text-brand-blue" />
                          <span>{coloLoc}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Space:</span>
                        <span className="text-white font-semibold">{cabinetSize}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Power:</span>
                        <span className="text-white font-semibold">{powerAlloc}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'virtual' && (
                    <>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Edge Node:</span>
                        <span className="text-white font-semibold flex items-center space-x-1">
                          <MapPin size={12} className="text-brand-blue" />
                          <span>{virtualLoc}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Service:</span>
                        <span className="text-white font-semibold">{vService}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Tier:</span>
                        <span className="text-white font-semibold">{vTier}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Managed:</span>
                        <span className="text-white font-semibold">{vSupport}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Term Commitment:</span>
                    <span className="text-white font-semibold">{contractTerm}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                <Link
                  to={`/${PANEL_IDS.CONTACT}?${costResult.query}`}
                  className="w-full py-4 bg-brand-blue text-white rounded-xl text-center font-bold text-sm hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-lg shadow-brand-blue/10"
                >
                  <span>Apply Now</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Inclusions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-200/80 pt-16">
          
          {/* Active Tab Left Column Inclusions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue">
                {activeTab === 'internet' ? <Cpu size={20} /> : activeTab === 'colocation' ? <Server size={20} /> : <Shield size={20} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'internet' && 'Port Plan Inclusions'}
                {activeTab === 'colocation' && 'Datacenter Standards'}
                {activeTab === 'virtual' && 'Virtual Edge Benefits'}
              </h3>
            </div>
            
            <ul className="space-y-3.5">
              {activeTab === 'internet' && [
                'Peered traffic from Alibaba, Amazon, Facebook, Fastly, Google, Riot Games, Swarmify, Tencent, TikTok, Twitch, Zenlayer',
                'Bilateral/multilateral peering support via redundant route servers',
                'Advanced BGP community-based route control',
                'Private VLAN support for secure and isolated traffic exchange',
                'Access to open-source mirror servers'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}

              {activeTab === 'colocation' && [
                'A+B Redundant Power allocation from separate UPS configurations',
                'Carrier-Neutral cross connects with all major local fibers',
                'Strict environmental controls (20-24°C, 40-60% humidity)',
                'Direct physical access authorization workflows',
                '24/7 smart-hands engineer support availability on-site'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}

              {activeTab === 'virtual' && [
                'Instant automated deployment and configuration sync',
                'Full IPv4/IPv6 dual stack support built-in',
                'Redundant virtual backplane linking all Edge locations',
                'Integrated stateful packet filters and access logs',
                'Elastic scalability to dynamically resize CPU/RAM capacity'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Tab Center Column Inclusions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue">
                {activeTab === 'internet' ? <Activity size={20} /> : activeTab === 'colocation' ? <Cpu size={20} /> : <Activity size={20} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'internet' && 'Techne Reach Plan Inclusions'}
                {activeTab === 'colocation' && 'Infrastructure Facilities'}
                {activeTab === 'virtual' && 'Edge Node Integrations'}
              </h3>
            </div>

            <ul className="space-y-3.5">
              {activeTab === 'internet' && [
                'Expanded content offering via partner Internet Exchanges and CDNs in Singapore and Hong Kong',
                'Includes cached content from Akamai, Cloudflare, Conversant, Facebook, Google, Microsoft, Netflix (coming soon), and Steam',
                'Burstable plans and usage-based pricing',
                'Longer contract terms now available for Manila',
                'Optimized for performance by serving content closer to your network'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}

              {activeTab === 'colocation' && [
                'Precision N+1 cooling infrastructure with hot/cold aisle setups',
                'Gas-based fire suppression systems (FM-200 or equivalent)',
                'Dual diesel engine backup generators with 72-hour fuel storage',
                'Underfloor cable pathways for power and fiber routing',
                'Dedicated client testing benches and assembly spaces'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}

              {activeTab === 'virtual' && [
                'Direct link to local Internet Peering (PHOpenIX)',
                'Zero-downtime routing protocol migrations',
                'Optional cloud-delivered DNS firewall integration',
                'Custom API endpoint control keys',
                'Comprehensive flow log export pipelines (NetFlow/IPFIX)'
              ].map((item, index) => (
                <li key={index} className="flex items-start text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mr-3 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dedicated "Not sure what to choose" Card */}
          <div className="lg:col-span-4 h-full">
            <div className="p-8 bg-brand-blue/5 border border-brand-blue/20 rounded-3xl flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-blue mb-6 shadow-sm">
                  <HelpCircle size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Not sure what to choose?</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Let our interconnection experts design a custom network structure tailored specifically for your business requirements, routing policies, and latency targets.
                </p>
              </div>
              <Link
                to={`/${PANEL_IDS.CONTACT}`}
                className="w-full py-3.5 bg-brand-blue text-white rounded-xl text-center font-bold text-sm hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md shadow-brand-blue/10"
              >
                <span>Contact Us</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
