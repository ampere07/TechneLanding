import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Lock, LockOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { PANEL_IDS } from '../constants';
import { CONTENT_LOGOS, PLATFORM_LOGOS, type Logo } from '../content/logos';
import { LOCATION, SERVICES } from '../content/site';
import { HOME_NETWORK, TRANSIT_NETWORKS, type TransitNetwork } from '../content/transit';
import { PHILIPPINES_PATH, WORLD, WORLD_H, WORLD_W, worldPercent } from '../content/worldMap';
import { Reveal } from './Reveal';

// Consulting is not tied to a facility, so it is not listed as available there.
const servicesAtFacility = SERVICES.filter((service) => service.id !== 'consulting');

/** A ring that spreads out from the pin three times when the map first comes into view, then rests. */
const PinPulse: React.FC = () => {
  const calm = useReducedMotion();
  if (calm) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-accent"
      initial={{ scale: 1, opacity: 0 }}
      whileInView={{ scale: [1, 3.6], opacity: [0.45, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 2.2, ease: 'easeOut', repeat: 2, delay: 0.9 }}
    />
  );
};

const MANILA = worldPercent(HOME_NETWORK.lon, HOME_NETWORK.lat);
const SIDE: Record<TransitNetwork['side'], string> = {
  left: 'right-full mr-1.5 top-1/2 -translate-y-1/2',
  right: 'left-full ml-1.5 top-1/2 -translate-y-1/2',
  top: 'bottom-full mb-1.5 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-1.5 left-1/2 -translate-x-1/2',
};
const UNLOCKED_COUNTRIES = new Set(TRANSIT_NETWORKS.filter((network) => network.unlocked).map((network) => network.country));
/** The Philippines is drawn this many times larger than its true size, so it stands out. */
const PH_SCALE = 2.6;

/** The world, with the Philippines enlarged and highlighted, and each country's upstream network shown locked or unlocked. */
const WorldMap: React.FC = () => {
  const cx = (MANILA.left / 100) * WORLD_W;
  const cy = (MANILA.top / 100) * WORLD_H;
  return (
    <figure className="relative w-full" style={{ aspectRatio: `${WORLD_W} / ${WORLD_H}` }}>
      <svg
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="World map with the Philippines enlarged and highlighted. Hong Kong and Australia are unlocked and the other countries are locked."
      >
        {WORLD.map((country) => (
          <path key={country.name} d={country.d} fill={UNLOCKED_COUNTRIES.has(country.name) ? '#b9dcdc' : '#dbe3e9'} stroke="#f6f9fb" strokeWidth="0.5" />
        ))}
        <g transform={`translate(${cx} ${cy}) scale(${PH_SCALE}) translate(${-cx} ${-cy})`}>
          <path
            d={PHILIPPINES_PATH}
            fill="#0e6b70"
            stroke="#ffffff"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ filter: 'drop-shadow(0 2px 3px rgba(11,37,54,0.35))' }}
          />
        </g>
      </svg>

      <div className="absolute" style={{ left: `${MANILA.left}%`, top: `${MANILA.top}%` }}>
        <PinPulse />
        <span className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-white ring-2 ring-accent" />
      </div>
      <div className="absolute hidden md:block" style={{ right: 0, top: `${MANILA.top + 4}%` }}>
        <span className="block whitespace-nowrap leading-tight bg-paper border border-accent rounded-[2px] px-2 py-1 shadow-sm">
          <span className="block text-[0.6875rem] text-ink-2">{HOME_NETWORK.country}, Vitro Makati 2</span>
          <span className="block font-data text-[0.8125rem] font-semibold text-accent">{HOME_NETWORK.asn}</span>
        </span>
      </div>

      {TRANSIT_NETWORKS.map((network) => {
        const at = worldPercent(network.lon, network.lat);
        return (
          <div key={network.country} className="absolute hidden md:block" style={{ left: `${at.left}%`, top: `${at.top}%` }}>
            <span className={`absolute -left-1 -top-1 w-2 h-2 rounded-full ${network.unlocked ? 'bg-accent' : 'bg-ink-3/60'}`} />
            <span
              className={`absolute ${SIDE[network.side]} flex items-center gap-1 whitespace-nowrap rounded-[2px] border px-1.5 py-0.5 text-[0.6875rem] leading-tight ${
                network.unlocked ? 'bg-paper border-accent text-ink' : 'bg-paper/70 border-rule text-ink-3 border-dashed'
              }`}
            >
              {network.unlocked ? <LockOpen size={11} className="text-accent" aria-hidden="true" /> : <Lock size={11} aria-hidden="true" />}
              <span className="font-data font-semibold">{network.asn}</span>
              <span>{network.country}</span>
            </span>
          </div>
        );
      })}
    </figure>
  );
};

// The globe loads three.js, so it loads on demand. If WebGL is missing, the flat map is shown instead.
const Globe = lazy(() => import('./Globe'));

const GlobeOrMap: React.FC = () => {
  const [failed, setFailed] = useState(false);
  if (failed) return <WorldMap />;
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[640px] aspect-square" />}>
      <Globe onFailed={() => setFailed(true)} />
    </Suspense>
  );
};

/** Where Techne's services are delivered from. */
export const NetworkMap: React.FC = () => (
  <section id="locations" className="section bg-paper-2 border-y border-rule">
    <div className="wrap">
      <Reveal className="max-w-3xl mb-10">
        <h2 className="heading-2">Where you can connect</h2>
        <p className="lede mt-3">
          Techne services are delivered from {LOCATION.facility} in {LOCATION.city}. If your site is somewhere else, tell us where it is and we will check what can reach it.
        </p>
      </Reveal>

      <Reveal>
        <GlobeOrMap />
      </Reveal>

      <div className="mt-10 max-w-3xl mx-auto">
        <Reveal delay={0.05} className="bg-paper border border-rule rounded-[4px] p-6 md:p-8">
          <h3 className="text-[1.375rem] font-semibold text-ink leading-tight">{LOCATION.facility}</h3>
          <p className="body-copy mt-1">{LOCATION.city}, {LOCATION.country}</p>
          <p className="mt-3 text-[0.9375rem] text-ink-2">
            Our AS number is <span className="font-data font-semibold text-ink">{HOME_NETWORK.asn}</span>.
          </p>

          <h4 className="text-[0.9375rem] font-semibold text-ink mt-6 pb-2 border-b border-rule">Services available here</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
            {servicesAtFacility.map((service) => (
              <li key={service.id} className="flex items-center gap-2">
                <Check size={16} className="text-accent shrink-0" aria-hidden="true" />
                <Link to={service.path} className="text-[0.9375rem] text-ink hover:text-accent transition-colors duration-150">{service.name}</Link>
              </li>
            ))}
          </ul>

          <Link to={`/${PANEL_IDS.CONTACT}`} className="text-link mt-6">
            Ask about another location
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </Reveal>

      </div>
    </div>
  </section>
);

const LogoTile: React.FC<{ logo: Logo }> = ({ logo }) => (
  <div className="bg-paper h-20 md:h-24 flex items-center justify-center px-6">
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      className="max-h-8 md:max-h-9 max-w-[120px] w-auto object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150"
      draggable="false"
    />
  </div>
);

export const LogoGrid: React.FC<{ logos: Logo[] }> = ({ logos }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
    {logos.map((logo) => (
      <LogoTile key={logo.name} logo={logo} />
    ))}
  </div>
);

/** Content networks and the vendor platforms Techne works with. */
export const TrustedBrands: React.FC = () => (
  <section className="section bg-paper">
    <div className="wrap space-y-14">
      <div>
        <Reveal className="max-w-3xl mb-8">
          <h2 className="heading-2">Connected to leading content networks</h2>
          <p className="lede mt-3">Direct connections to CDNs and content platforms keep popular traffic local for your subscribers.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <LogoGrid logos={CONTENT_LOGOS} />
        </Reveal>
      </div>

      <Reveal>
        <h3 className="heading-3 mb-5">Hardware and software platforms we deploy and support</h3>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          {PLATFORM_LOGOS.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="h-7 md:h-8 max-w-[110px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150"
              draggable="false"
            />
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
