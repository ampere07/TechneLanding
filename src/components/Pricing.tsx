import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Cpu, Wifi, Server, HelpCircle } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { quoteLink } from '../content/quote';
import { LOCATION } from '../content/site';

type BandwidthType = 'Fixed Bandwidth' | 'Burstable';
type CommitmentType = '1 Gbps' | '2 Gbps' | '5 Gbps' | '10 Gbps' | '20 Gbps' | '50 Gbps' | '100 Gbps';
type TabType = 'internet' | 'colocation' | 'virtual';
type PortSizeType = '1 Gbps' | '10 Gbps' | '100 Gbps';
type ContractTermType = '12 months' | '24 months' | '36 months';

type ColoCabinetType = '1U Server' | '10U Quarter' | '20U Half' | '42U Full';
type ColoPowerType = '1 kW' | '2 kW' | '3 kW' | '5 kW';

type VirtualServiceType = 'Virtual Router' | 'Virtual Switch' | 'Virtual Cross Connect';

/** Burstable plans run on a 10 Gbps port. The commit is billed, and use above it is billed at the 95th percentile. */
const BURST_PORT = '10 Gbps';
const BURST_COMMITMENTS: CommitmentType[] = ['1 Gbps', '2 Gbps', '5 Gbps'];
const burstBilling = (commitment: string) => `${commitment} committed + 95th percentile overage`;

/** How a bandwidth option reads. Fixed shows the speed alone. Burstable spells out the port and the billing. */
const bandwidthLabel = (type: string, commitment: string) =>
  type === 'Burstable' ? `Commit ${commitment}, ${BURST_PORT} port capacity, billing model: ${burstBilling(commitment)}` : commitment;

const DATA_CENTER_OPTIONS = [LOCATION.facility, 'My location is not listed'];

/** What can be chosen for each virtual service. */
const ROUTER_BANDWIDTHS = ['10 Gbps', '20 Gbps', '30 Gbps', '40 Gbps'];
const SWITCH_PORT_SIZES = ['1 Gbps', '10 Gbps'];
const SWITCH_PORT_CAPACITIES = ['1 Gbps', '2 Gbps', '5 Gbps', '10 Gbps'];
const VXC_CAPACITIES = ['1 Gbps', '2 Gbps', '5 Gbps', '10 Gbps'];

/** A row of cards, one of which is chosen. */
const OptionGroup: React.FC<{ title: string; options: string[]; value: string; onChange: (value: string) => void }> = ({ title, options, value, onChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-ink mb-4">{title}</h3>
    <div className={`grid grid-cols-2 gap-3 ${options.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-4'}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`p-4 rounded-[4px] border text-center transition-colors duration-[180ms] flex flex-col items-center ${value === option ? 'border-brand-blue bg-brand-blue/5' : 'border-rule hover:border-ink-2 bg-paper-2'}`}
        >
          <span className="font-data font-semibold text-ink text-sm">{option}</span>
        </button>
      ))}
    </div>
  </div>
);

const CONTRACT_TERMS: ContractTermType[] = ['12 months', '24 months', '36 months'];

export const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('internet');

  const [internetDC, setInternetDC] = useState<string>(LOCATION.facility);
  const [isDcDropdownOpen, setIsDcDropdownOpen] = useState(false);
  const dcDropdownRef = useRef<HTMLDivElement>(null);
  const [bandwidthType, setBandwidthType] = useState<BandwidthType>('Fixed Bandwidth');
  // The port size chosen for a fixed plan, kept while a burstable plan locks the port to 10 Gbps.
  const [fixedPort, setFixedPort] = useState<PortSizeType>('1 Gbps');
  const [commitment, setCommitment] = useState<CommitmentType>('1 Gbps');
  const [portSize, setPortSize] = useState<PortSizeType>('1 Gbps');

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
  const [routerBandwidth, setRouterBandwidth] = useState('10 Gbps');
  const [switchPortSize, setSwitchPortSize] = useState('1 Gbps');
  const [switchPortCapacity, setSwitchPortCapacity] = useState('1 Gbps');
  const [vxcCapacity, setVxcCapacity] = useState('1 Gbps');

  const [contractTerm, setContractTerm] = useState<ContractTermType>('12 months');


  const burstable = bandwidthType === 'Burstable';
  // A 100 Gbps port offers 10, 20, 50 and 100 Gbps. The smaller ports offer 1, 2, 5 and 10 Gbps.
  const commitments: CommitmentType[] = burstable
    ? BURST_COMMITMENTS
    : portSize === '100 Gbps'
      ? ['10 Gbps', '20 Gbps', '50 Gbps', '100 Gbps']
      : ['1 Gbps', '2 Gbps', '5 Gbps', '10 Gbps'];
  // If the chosen speed is not offered on this port, the first one that is offered is used.
  const activeCommitment: CommitmentType = commitments.includes(commitment) ? commitment : commitments[0];
  const chooseBandwidthType = (type: BandwidthType) => {
    if (type === bandwidthType) return;
    setBandwidthType(type);
    if (type === 'Burstable') {
      setFixedPort(portSize);
      setPortSize(BURST_PORT);
      if (!BURST_COMMITMENTS.includes(commitment)) setCommitment('1 Gbps');
    } else {
      setPortSize(fixedPort);
    }
  };
  // What the visitor has chosen. It fills the summary panel and the contact form.
  const selection: { label: string; value: string }[] =
    activeTab === 'internet'
      ? [
          { label: 'Service', value: 'Internet' },
          { label: 'Location', value: LOCATION.city },
          { label: 'Data center', value: internetDC },
          { label: 'Port size', value: portSize },
          { label: 'Bandwidth plan', value: bandwidthType === 'Burstable' ? `Burstable, commit ${activeCommitment}` : `${bandwidthType}, ${activeCommitment}` },
          ...(bandwidthType === 'Burstable' ? [{ label: 'Billing model', value: burstBilling(activeCommitment) }] : []),
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
            ...(vService === 'Virtual Router' ? [{ label: 'Bandwidth capacity', value: routerBandwidth }] : []),
            ...(vService === 'Virtual Switch'
              ? [
                  { label: 'Port size', value: switchPortSize },
                  { label: 'Port capacity', value: switchPortCapacity },
                ]
              : []),
            ...(vService === 'Virtual Cross Connect' ? [{ label: 'Capacity', value: vxcCapacity }] : []),
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

            {/* Internet options */}
            {activeTab === 'internet' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-ink mb-4">Port Size</h3>
                  {burstable && <p className="font-body text-xs text-ink-2 -mt-2 mb-4">Burstable plans run on a {BURST_PORT} port, so the port size cannot be changed.</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['1 Gbps', '10 Gbps', '100 Gbps'] as PortSizeType[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setPortSize(size)}
                        disabled={burstable}
                        className={`p-5 rounded-[4px] border text-left transition-colors duration-[180ms] ${portSize === size ? 'border-brand-blue bg-brand-blue/5' : burstable ? 'border-rule bg-paper-2' : 'border-rule hover:border-ink-2 bg-paper-2'} ${burstable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-data text-xl font-semibold text-ink">{size}</span>
                          {portSize === size && <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white"><Check size={11} strokeWidth={3} /></div>}
                        </div>
                        <span className="text-sm font-semibold text-ink">Port capacity</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-rule">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Bandwidth Plan</h3>
                      <p className="font-body text-xs text-ink-2 mt-1">The bandwidth you commit to on this port</p>
                    </div>
                    <div className="bg-paper-2 border border-rule p-1 rounded-[4px] flex gap-1">
                      {(['Fixed Bandwidth', 'Burstable'] as BandwidthType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => chooseBandwidthType(type)}
                          className={`px-3 py-1.5 rounded-[4px] font-body text-xs font-semibold transition-colors duration-[180ms] ${bandwidthType === type ? 'bg-paper text-ink shadow-sm border border-rule' : 'text-ink-2 hover:text-ink'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={activeCommitment}
                      onChange={(e) => setCommitment(e.target.value as CommitmentType)}
                      className="input-field appearance-none cursor-pointer"
                      aria-label="Bandwidth"
                    >
                      {commitments.map((speed) => (
                        <option key={speed} value={speed}>
                          {bandwidthLabel(bandwidthType, speed)}
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

                {vService === 'Virtual Router' && (
                  <OptionGroup title="Bandwidth Capacity" options={ROUTER_BANDWIDTHS} value={routerBandwidth} onChange={setRouterBandwidth} />
                )}
                {vService === 'Virtual Switch' && (
                  <>
                    <OptionGroup title="Port Size" options={SWITCH_PORT_SIZES} value={switchPortSize} onChange={setSwitchPortSize} />
                    <OptionGroup title="Port Capacity" options={SWITCH_PORT_CAPACITIES} value={switchPortCapacity} onChange={setSwitchPortCapacity} />
                  </>
                )}
                {vService === 'Virtual Cross Connect' && (
                  <OptionGroup title="Capacity" options={VXC_CAPACITIES} value={vxcCapacity} onChange={setVxcCapacity} />
                )}
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
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-navy text-white rounded-[4px] p-8">
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

            <div className="p-7 bg-paper border border-rule rounded-[4px]">
              <div className="w-10 h-10 rounded-[4px] bg-paper-2 border border-rule flex items-center justify-center text-accent mb-5">
                <HelpCircle size={20} aria-hidden="true" />
              </div>
              <h4 className="font-display font-bold text-ink mb-2">Not sure what to choose?</h4>
              <p className="font-body text-sm text-ink-2 leading-relaxed mb-5">
                Let our interconnection experts design a custom network structure tailored for your routing policies, latency targets, and business requirements.
              </p>
              <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary w-full justify-center py-3">
                Contact Us
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
