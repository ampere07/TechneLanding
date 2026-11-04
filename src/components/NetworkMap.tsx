import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import luzonMap from '../assets/luzon_map.svg';
import { PANEL_IDS } from '../constants';
import { CONTENT_LOGOS, PLATFORM_LOGOS, type Logo } from '../content/logos';
import { LOCATION, SERVICES } from '../content/site';
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-12 lg:items-center">
        <Reveal className="mx-auto w-full max-w-[250px]">
        <figure className="relative w-full" style={{ aspectRatio: '275 / 442' }}>
          <img src={luzonMap} alt="Map of Luzon in the Philippines, with Manila marked" className="absolute inset-0 w-full h-full" draggable="false" />
          <div className="absolute" style={{ left: '27.6%', top: '66.7%' }}>
            <PinPulse />
            <span className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-accent ring-2 ring-paper-2" />
            <span className="absolute top-1/2 -translate-y-1/2 left-3 xl:left-auto xl:right-3 h-px w-3 bg-ink-3" aria-hidden="true" />
            <span className="absolute -top-[19px] left-6 xl:left-auto xl:right-6 whitespace-nowrap leading-tight bg-paper border border-rule-strong rounded-[2px] px-2 py-1">
              <span className="block text-[0.8125rem] font-semibold text-ink">{LOCATION.city}</span>
              <span className="block text-[0.75rem] text-ink-2">{LOCATION.facility}</span>
            </span>
          </div>
        </figure>
        </Reveal>

        <Reveal delay={0.12} className="bg-paper border border-rule rounded-[4px] p-6 md:p-8">
          <h3 className="text-[1.375rem] font-semibold text-ink leading-tight">{LOCATION.facility}</h3>
          <p className="body-copy mt-1">{LOCATION.city}, {LOCATION.country}</p>

          <h4 className="text-[0.9375rem] font-semibold text-ink mt-6 pb-2 border-b border-rule">Services available here</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-4">
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
