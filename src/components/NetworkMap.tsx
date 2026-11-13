import React, { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CONTENT_LOGOS, PLATFORM_LOGOS, type Logo } from '../content/logos';
import { HOME_NETWORK, TRANSIT_NETWORKS, type TransitNetwork } from '../content/transit';
import { PHILIPPINES_PATH, WORLD, WORLD_H, WORLD_W, worldPercent } from '../content/worldMap';
import { useTheme } from '../theme';
import type { PhilippinesOrigin } from './Globe';
import { PhilippinesClients } from './PhilippinesClients';
import { Reveal } from './Reveal';

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
const PH_SCALE = 4.1;

/** The world, with the Philippines enlarged and highlighted, and each country's upstream network shown locked or unlocked. */
const WorldMap: React.FC<{ onSelectPhilippines?: (origin: PhilippinesOrigin) => void }> = ({ onSelectPhilippines }) => {
  const dark = useTheme() === 'dark';
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
          <path key={country.name} d={country.d} fill={UNLOCKED_COUNTRIES.has(country.name) ? (dark ? '#1f5f66' : '#b9dcdc') : dark ? '#22394a' : '#dbe3e9'} stroke={dark ? '#0f1f2c' : '#f6f9fb'} strokeWidth="0.5" />
        ))}
        <g
          transform={`translate(${cx} ${cy}) scale(${PH_SCALE}) translate(${-cx} ${-cy})`}
          onClick={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            onSelectPhilippines?.({ x: box.left + box.width / 2, y: box.top + box.height / 2, height: box.height });
          }}
          className={onSelectPhilippines ? 'cursor-pointer' : undefined}
        >
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
          <span className="block text-[0.6875rem] text-ink-2">{HOME_NETWORK.country}</span>
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

const GlobeOrMap: React.FC<{ zoomed: boolean; skipIntro?: boolean; onSelectPhilippines: (origin: PhilippinesOrigin) => void }> = ({
  zoomed,
  skipIntro,
  onSelectPhilippines,
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <WorldMap onSelectPhilippines={onSelectPhilippines} />;
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[640px] aspect-square" />}>
      <Globe onFailed={() => setFailed(true)} zoomed={zoomed} skipIntro={skipIntro} onSelectPhilippines={onSelectPhilippines} />
    </Suspense>
  );
};

/**
 * The two-line title. The second line is sized so that it is exactly as wide as the first, with ordinary spacing
 * between its words. It is measured again whenever the window or the fonts change.
 */
const AsTitle: React.FC = () => {
  const first = useRef<HTMLSpanElement>(null);
  const second = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const a = first.current;
    const b = second.current;
    if (!a || !b) return;
    const fit = () => {
      b.style.fontSize = '1em';
      const target = a.getBoundingClientRect().width;
      const natural = b.getBoundingClientRect().width;
      if (target > 0 && natural > 0) b.style.fontSize = `${(target / natural).toFixed(4)}em`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(a);
    document.fonts?.ready.then(fit, () => undefined);
    return () => observer.disconnect();
  }, []);

  return (
    <p className="font-['Montserrat',sans-serif] text-[length:var(--t)] font-extrabold uppercase leading-[0.95] tracking-normal text-ink">
      <span ref={first} className="block w-fit mx-auto whitespace-nowrap">AS number</span>
      <span ref={second} className="block w-fit mx-auto whitespace-nowrap">
        is <span className="text-accent">{HOME_NETWORK.asn}</span>
      </span>
    </p>
  );
};

/** Where Techne's services are delivered from. */
export const NetworkMap: React.FC = () => {
  // Clicking the Philippines on the globe opens its own map, with a pin for each client, beside the globe.
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState<PhilippinesOrigin | undefined>();
  return (
  <section id="locations" className="section bg-paper-2 border-y border-rule overflow-x-clip">
    <div className="wrap">
      <Reveal className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="heading-2">Expanding Techne’s Global IP Transit Network</h2>
        <p className="lede mt-3 mx-auto text-justify [text-align-last:center]">
          Techne is building its IP Transit platform from the Philippines, with plans to expand international connectivity through additional upstream and regional network partners. The goal is to deliver better route diversity, redundancy, capacity, and scalable global connectivity for Philippine ISPs.
        </p>
      </Reveal>

      {/* Like a magazine cover: the big title sits behind the globe, and on wider screens the globe rises over the lower part of its second line. On phones the globe sits just below the title, so every letter stays readable. */}
      {/* Clicking the Philippines on the globe sends only the islands out to the left as a map, with the client list beside it. The globe fades behind them, so both sit in the same grid cell while they cross. */}
      <div className="grid">
        <AnimatePresence initial={false}>
          {!zoomed && (
            <motion.div
              key="globe"
              className="col-start-1 row-start-1 [--t:clamp(min(2.5rem,calc((100vw_-_40px)/6.9)),7.4vw,6.5rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Reveal className="relative z-0 text-center -translate-y-[calc(var(--t)*0.3)]">
                <AsTitle />
              </Reveal>

              <Reveal className="relative z-10 mt-[calc(var(--t)*-0.2-min(640px,100vw-40px)*0.085)] md:mt-[calc(var(--t)*-0.66-min(640px,100vw-40px)*0.085)]">
                <GlobeOrMap
                  zoomed={false}
                  skipIntro={origin !== undefined}
                  onSelectPhilippines={(from) => {
                    setOrigin(from);
                    setZoomed(true);
                  }}
                />
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {zoomed && <PhilippinesClients key="clients" from={origin} onClose={() => setZoomed(false)} />}
        </AnimatePresence>
      </div>
    </div>
  </section>
  );
};

/** Logos with white detail inside them. A plain silhouette would lose that detail, so they stay grey in dark mode. */
const KEEP_DETAIL = new Set(['Twitch', 'Supermicro', 'SmokePing', 'YouTube', 'WhatsApp', 'Spotify', 'Facebook']);

const LogoTile: React.FC<{ logo: Logo }> = ({ logo }) => {
  return (
  <div className="group bg-paper h-20 md:h-24 flex items-center justify-center gap-2 px-6">
    <img
      src={logo.src}
      alt={logo.label ? '' : logo.name}
      loading="lazy"
      className={`${KEEP_DETAIL.has(logo.name) ? 'logo-grey' : 'logo-mark'} max-h-8 md:max-h-9 max-w-[120px] w-auto object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150`}
      draggable="false"
    />
    {logo.label && (
      <span className="font-display text-[1.125rem] md:text-[1.25rem] font-bold tracking-tight text-ink-3 group-hover:text-ink transition-colors duration-150">
        {logo.label}
      </span>
    )}
  </div>
  );
};

export const LogoGrid: React.FC<{ logos: Logo[] }> = ({ logos }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
    {logos.map((logo) => (
      <LogoTile key={logo.name} logo={logo} />
    ))}
    {Array.from({ length: logos.length % 2 }, (_, i) => (
      <div key={`two-${i}`} className="bg-paper md:hidden" aria-hidden="true" />
    ))}
    {Array.from({ length: (5 - (logos.length % 5)) % 5 }, (_, i) => (
      <div key={`five-${i}`} className="bg-paper hidden md:block" aria-hidden="true" />
    ))}
  </div>
);

/** Content networks and the vendor platforms Techne works with. */
export const TrustedBrands: React.FC = () => {
  const dark = useTheme() === 'dark';
  return (
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
            <span key={logo.name} className="group inline-flex items-center gap-2">
              {logo.src && (
                <img
                  src={dark && logo.srcDark ? logo.srcDark : logo.src}
                  alt={logo.label ? '' : logo.name}
                  loading="lazy"
                  className={`${KEEP_DETAIL.has(logo.name) ? 'logo-grey' : 'logo-mark'} h-7 md:h-8 max-w-[110px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150`}
                  draggable="false"
                />
              )}
              {(!logo.src || logo.label) && (
                <span className="font-display text-[1.125rem] md:text-[1.25rem] font-bold tracking-tight text-ink-3 group-hover:text-ink transition-colors duration-150">
                  {logo.label ?? logo.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
  );
};
