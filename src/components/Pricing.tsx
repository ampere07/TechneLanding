import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Activity, Cpu, Wifi, Server, Shield, HelpCircle } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { quoteLink } from '../content/quote';
import { LOCATION } from '../content/site';

declare global {
  interface Window {
    L: any;
  }
}

type TabType = 'internet' | 'colocation' | 'virtual';
type PortSizeType = '1 Gbps' | '10 Gbps' | '100 Gbps';
type ReachPlanType = 'Fixed Bandwidth' | 'Burstable';
type ContractTermType = '12 months' | '24 months' | '36 months';
type SpeedCommitType = 'None' | '100 Mbps' | '200 Mbps' | '500 Mbps' | '1 Gbps' | '2 Gbps' | '5 Gbps' | '10 Gbps';

type ColoCabinetType = '1U Server' | '10U Quarter' | '20U Half' | '42U Full';
type ColoPowerType = '1 kW' | '2 kW' | '3 kW' | '5 kW';

type VirtualServiceType = 'Virtual Router' | 'Virtual Switch' | 'Virtual Cross Connect';
type VirtualTierType = 'Starter' | 'Professional' | 'Enterprise' | 'Carrier';
type VirtualSupportType = 'Self-Managed' | 'Semi-Managed' | 'Fully-Managed';

const SITE_COORDINATES: [number, number] = [14.5547, 121.0244];

const DATA_CENTER_OPTIONS = [LOCATION.facility, 'My location is not listed'];

const VIRTUAL_TIERS: { id: VirtualTierType; specs: string }[] = [
  { id: 'Starter', specs: '1 vCPU / 2GB' },
  { id: 'Professional', specs: '2 vCPU / 4GB' },
  { id: 'Enterprise', specs: '4 vCPU / 8GB' },
  { id: 'Carrier', specs: '8 vCPU / 16GB' },
];

const CONTRACT_TERMS: ContractTermType[] = ['12 months', '24 months', '36 months'];

export const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('internet');

  const [internetDC, setInternetDC] = useState<string>(LOCATION.facility);
  const [isDcDropdownOpen, setIsDcDropdownOpen] = useState(false);
  const dcDropdownRef = useRef<HTMLDivElement>(null);
  const [portSize, setPortSize] = useState<PortSizeType>('1 Gbps');
  const [reachPlanType, setReachPlanType] = useState<ReachPlanType>('Fixed Bandwidth');
  const [speedCommit, setSpeedCommit] = useState<SpeedCommitType>('None');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dcDropdownRef.current && !dcDropdownRef.current.contains(event.target as Node)) {
        setIsDcDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const [cabinetSize, setCabinetSize] = useState<ColoCabinetType>('1U Server');
  const [powerAlloc, setPowerAlloc] = useState<ColoPowerType>('1 kW');

  const [vService, setVService] = useState<VirtualServiceType>('Virtual Router');
  const [vTier, setVTier] = useState<VirtualTierType>('Starter');
  const [vSupport, setVSupport] = useState<VirtualSupportType>('Self-Managed');

  const [contractTerm, setContractTerm] = useState<ContractTermType>('12 months');

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const speedCommits: SpeedCommitType[] = ['None', '100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps', '2 Gbps', '5 Gbps', '10 Gbps'];
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
    const map = L.map(mapContainerRef.current, { center: SITE_COORDINATES, zoom: 11, zoomControl: false, scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      className: 'pricing-map-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const icon = L.divIcon({
      html: `<div class="relative flex items-center justify-center w-8 h-8"><div class="absolute inset-0 rounded-full bg-brand-blue/30 animate-ping"></div><div class="w-4 h-4 rounded-full border-2 border-white shadow-lg bg-brand-blue scale-125 relative z-10"></div></div>`,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker(SITE_COORDINATES, { icon }).addTo(map);
    mapRef.current = map;
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [leafletLoaded]);

  // What the visitor has chosen. It fills the summary panel and the contact form.
  const selectedTier = VIRTUAL_TIERS.find((tier) => tier.id === vTier);
  const selection: { label: string; value: string }[] =
    activeTab === 'internet'
      ? [
          { label: 'Service', value: 'Internet' },
          { label: 'Location', value: LOCATION.city },
          { label: 'Data center', value: internetDC },
          { label: 'Port size', value: portSize },
          { label: 'Reach plan', value: speedCommit === 'None' ? 'None, peering ports only' : `${reachPlanType}, ${speedCommit}` },
          { label: 'Contract term', value: contractTerm },
        ]
      : activeTab === 'colocation'
        ? [
            { label: 'Service', value: 'Colocation' },
            { label: 'Location', value: LOCATION.city },
            { label: 'Data center', value: LOCATION.facility },
            { label: 'Space', value: cabinetSize },
            { label: 'Power', value: powerAlloc },
            { label: 'Contract term', value: contractTerm },
          ]
        : [
            { label: 'Service', value: vService },
            { label: 'Location', value: LOCATION.city },
            { label: 'Data center', value: LOCATION.facility },
            ...(vService === 'Virtual Router'
              ? [
                  { label: 'Capacity', value: `${vTier}, ${selectedTier?.specs}` },
                  { label: 'Management', value: vSupport },
                ]
              : []),
            { label: 'Contract term', value: contractTerm },
          ];

  const quoteSubject =
    activeTab === 'internet'
      ? `Internet, ${portSize}`
      : activeTab === 'colocation'
        ? `Colocation, ${cabinetSize}`
        : vService;
  const quote = quoteLink(quoteSubject, [
    'I would like a quote for the following:',
    '',
    ...selection.map((row) => `${row.label}: ${row.value}`),
  ]);

  return (
    <section className="section bg-paper-2">
      <div className="wrap">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-10"
        >
          <h1 className="heading-1">Request a quote</h1>
          <p className="lede mt-4">
            Choose a service and your options, then send us your selection. We respond to new inquiries within 24 hours.
          </p>
        </motion.div>

        {/* Service tabs */}
        <div className="bg-paper border border-rule p-1 rounded-[4px] mb-8 flex flex-wrap justify-between items-center gap-1 max-w-3xl">
          {(['internet', 'colocation', 'virtual'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 min-w-[120px] text-center py-3 px-4 rounded-[4px] font-body text-sm font-semibold transition-colors duration-[180ms] relative flex items-center justify-center gap-2"
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
                <h3 className="text-sm font-semibold text-ink">Location</h3>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="tabular-nums text-xs text-accent flex items-center gap-1 bg-accent/8 px-3 py-1.5 rounded-[4px] border border-accent/20">
                    <MapPin size={11} />
                    <span>{LOCATION.city}</span>
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
                  <h3 className="text-sm font-semibold text-ink mb-4">Port Size</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['1 Gbps', '10 Gbps', '100 Gbps'] as PortSizeType[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPortSize(size)}
                        className={`p-5 rounded-[4px] border text-left transition-colors duration-[180ms] ${portSize === size ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-data text-xl font-semibold text-ink">{size}</span>
                          {portSize === size && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white"><Check size={11} strokeWidth={3} /></div>}
                        </div>
                        <span className="text-sm font-semibold text-ink">Peering Interface</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-rule">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Techne Reach Plan</h3>
                      <p className="font-body text-xs text-ink-2 mt-1">Global upstream & exchange cache paths</p>
                    </div>
                    <div className="bg-paper-2 border border-rule p-1 rounded-[4px] flex gap-1">
                      {(['Fixed Bandwidth', 'Burstable'] as ReachPlanType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setReachPlanType(type)}
                          className={`px-3 py-1.5 rounded-[4px] font-body text-xs font-semibold transition-colors duration-[180ms] ${reachPlanType === type ? 'bg-paper text-ink shadow-sm border border-rule' : 'text-ink-2 hover:text-ink'}`}
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
                    <h3 className="text-sm font-semibold text-ink mb-3">Select Interface Datacenter</h3>
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
                          {DATA_CENTER_OPTIONS.map((dc) => {
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
                  <h3 className="text-sm font-semibold text-ink mb-4">Cabinet Space Size</h3>
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
                          <span className="font-body font-semibold text-ink block mb-1 text-sm">{size.label}</span>
                          <span className="font-body text-xs text-ink-2">{size.desc}</span>
                        </div>
                        {cabinetSize === size.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-ink mb-4">Redundant Power Limit</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['1 kW', '2 kW', '3 kW', '5 kW'] as ColoPowerType[]).map((power) => (
                      <button
                        key={power}
                        onClick={() => setPowerAlloc(power)}
                        className={`py-3 rounded-[4px] border font-data font-medium text-sm transition-colors duration-[180ms] ${powerAlloc === power ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-rule text-ink-2 hover:border-ink-2 bg-paper-2'}`}
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
                  <h3 className="text-sm font-semibold text-ink mb-4">Service Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { id: 'Virtual Router', label: 'Virtual Router', desc: 'Hosted routing with BGP support' },
                      { id: 'Virtual Switch', label: 'Virtual Switch', desc: 'Private Layer 2 domain on the fabric' },
                      { id: 'Virtual Cross Connect', label: 'Virtual Cross Connect', desc: 'Private Layer 2 link between two ports' }
                    ] as { id: VirtualServiceType; label: string; desc: string }[]).map((serv) => (
                      <button
                        key={serv.id}
                        onClick={() => setVService(serv.id)}
                        className={`p-4 rounded-[4px] border text-left transition-colors duration-[180ms] flex justify-between items-start ${vService === serv.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <div>
                          <span className="font-body font-semibold text-ink block mb-1 text-sm">{serv.label}</span>
                          <span className="font-body text-xs text-ink-2">{serv.desc}</span>
                        </div>
                        {vService === serv.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-3"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                {vService === 'Virtual Router' && (<>
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-4">Resource Capacity Tier</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {VIRTUAL_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setVTier(tier.id)}
                        className={`p-4 rounded-[4px] border text-center transition-colors duration-[180ms] flex flex-col items-center ${vTier === tier.id ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                      >
                        <span className="font-body font-semibold text-ink text-sm">{tier.id}</span>
                        <span className="font-data text-xs text-ink-2 mt-1">{tier.specs}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-ink mb-4">Managed Engineering Support</h3>
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
                          <span className="font-body font-semibold text-ink text-sm block mb-1">{supp.label}</span>
                          <span className="font-body text-xs text-ink-2">{supp.desc}</span>
                        </div>
                        {vSupport === supp.id && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white shrink-0 ml-2"><Check size={11} strokeWidth={3} /></div>}
                      </button>
                    ))}
                  </div>
                </div>
                </>)}
              </motion.div>
            )}

            {/* Contract term */}
            <div className="pt-6 border-t border-rule">
              <h3 className="text-sm font-semibold text-ink mb-4">Contract Term</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CONTRACT_TERMS.map((term) => (
                  <button
                    key={term}
                    onClick={() => setContractTerm(term)}
                    className={`p-4 rounded-[4px] border text-center transition-colors duration-[180ms] flex flex-col items-center ${contractTerm === term ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
                  >
                    <span className="font-data font-medium text-ink text-sm">{term}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quote sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-ink text-white rounded-[4px] p-8">
              <h3 className="text-[1.125rem] font-semibold text-white mb-5">Your selection</h3>
              <dl className="space-y-3 text-sm">
                {selection.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-white/70">{row.label}</dt>
                    <dd className="font-data text-[0.8125rem] font-medium text-white text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link to={quote} className="btn-on-navy w-full">
                  Request quote
                  <ChevronRight size={15} aria-hidden="true" />
                </Link>
                <p className="text-[0.8125rem] leading-snug text-white/70 mt-3">
                  We will open the contact form with these details filled in.
                </p>
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
              {activeTab === 'virtual' && ['Instant automated deployment and configuration sync','Full IPv4/IPv6 dual stack support built-in','Redundant virtual backplane','Integrated stateful packet filters and access logs','Elastic scalability to dynamically resize CPU/RAM capacity'].map((item, i) => (
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
                {activeTab === 'virtual' && 'Virtual Service Integrations'}
              </h3>
            </div>
            <ul className="space-y-3">
              {activeTab === 'internet' && ['Expanded content via partner Internet Exchanges in Singapore and Hong Kong','Cached content from Akamai, Cloudflare, Facebook, Google, Microsoft, Netflix (coming soon), Steam','Burstable plans and usage-based billing','Longer contract terms available','Optimized performance by serving content closer to your network'].map((item, i) => (
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
