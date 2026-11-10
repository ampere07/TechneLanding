import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { CLIENT_SITES, REGIONS, SERVICES, type Region, type Service } from '../content/clients';
import { PHILIPPINES_PATH, WORLD_H, WORLD_W, worldPercent } from '../content/worldMap';
import type { PhilippinesOrigin } from './Globe';

const EASE = [0.16, 1, 0.3, 1] as const;

// The part of the world map that holds the Philippines, in the map's own units.
const VB = { x: 822, y: 174, w: 34, h: 50 };

/** A longitude and latitude as a percentage of the map's width and height. */
const toBox = (lon: number, lat: number) => {
  const p = worldPercent(lon, lat);
  return {
    left: ((((p.left / 100) * WORLD_W) - VB.x) / VB.w) * 100,
    top: ((((p.top / 100) * WORLD_H) - VB.y) / VB.h) * 100,
  };
};

/** The area each island group fills, so the map can move in on it. */
const REGION_AREA: Record<Region, { lon: [number, number]; lat: [number, number] }> = {
  Luzon: { lon: [117.8, 124.6], lat: [19.2, 12.0] },
  Visayas: { lon: [121.8, 126.4], lat: [12.9, 9.0] },
  Mindanao: { lon: [121.6, 127.0], lat: [10.0, 5.0] },
};

interface Framing {
  /** Scale, and shift as a percentage of the frame, that make an island group fill it. */
  s: number;
  x: number;
  y: number;
}

const framing = (region: Region | null): Framing => {
  if (!region) return { s: 1, x: 0, y: 0 };
  const { lon, lat } = REGION_AREA[region];
  const a = toBox(lon[0], lat[0]);
  const b = toBox(lon[1], lat[1]);
  const s = Math.min(100 / (b.left - a.left), 100 / (b.top - a.top), 3.2);
  return { s, x: 50 - ((a.left + b.left) / 2) * s, y: 50 - ((a.top + b.top) / 2) * s };
};

// One easing for the map and every pin. They all move by the same curve, so they stay together on the way.
const MOVE = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)';

/**
 * A pin. The map is moved by a scale and a shift. A pin is moved by the shift that puts it at the same place on the
 * scaled map, but it is never scaled itself, so it keeps its size.
 */
const Pin: React.FC<{
  n: number;
  delay: number;
  left: number;
  top: number;
  view: Framing;
  still: boolean;
  open: boolean;
  name: string;
  detail: string;
  onActive: (on: boolean) => void;
  onToggle: () => void;
}> = ({ n, delay, left, top, view, still, open, name, detail, onActive, onToggle }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      transform: `translate(${(view.s - 1) * left + view.x}%, ${(view.s - 1) * top + view.y}%)`,
      transition: still ? 'none' : MOVE,
      zIndex: open ? 20 : 10,
    }}
  >
    <div className="absolute pointer-events-auto" style={{ left: `${left}%`, top: `${top}%` }}>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay, ease: EASE }}
      >
        <button
          type="button"
          aria-label={`${n + 1}. ${name}, ${detail}`}
          onPointerEnter={() => onActive(true)}
          onFocus={() => onActive(true)}
          onBlur={() => onActive(false)}
          onClick={onToggle}
          className={`absolute -left-[10px] -top-[10px] w-5 h-5 rounded-full border-2 border-white font-data text-[0.625rem] font-semibold leading-none flex items-center justify-center cursor-pointer shadow-[0_1px_4px_rgb(11_37_54_/_0.5)] transition-[transform,background-color] duration-150 ${open ? 'scale-125 bg-accent text-white' : 'bg-navy text-white hover:scale-110'}`}
        >
          {n + 1}
        </button>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`absolute bottom-4 ${left > 55 ? 'right-[-8px]' : 'left-[-8px]'} whitespace-nowrap bg-paper border border-accent rounded-[2px] px-2.5 py-1.5 shadow-sm leading-tight pointer-events-none`}
          >
            <span className="block text-[0.8125rem] font-semibold text-ink">{name}</span>
            <span className="block text-[0.75rem] text-ink-2">{detail}</span>
          </motion.span>
        )}
      </motion.div>
    </div>
  </div>
);

/**
 * The Philippines at full size with a numbered pin for each Techne client site, and beside it the same clients
 * listed by island group. Hovering a pin or a row lights up the other. Choosing an island group moves the map in on it.
 */
export const PhilippinesClients: React.FC<{ onClose: () => void; from?: PhilippinesOrigin }> = ({ onClose, from }) => {
  const [active, setActive] = useState<number | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [service, setService] = useState<Service | null>(null);
  // The areas shown, numbered in this order. A service filter leaves out the areas without it.
  const sites = CLIENT_SITES.filter((s) => !service || s.services.includes(service));
  const calm = !!useReducedMotion();

  // The map starts out small, on top of the islands on the globe, then grows and slides to its place at the left.
  const mapBox = useRef<HTMLDivElement>(null);
  const flyX = useMotionValue(0);
  const flyY = useMotionValue(0);
  const flyScale = useMotionValue(1);
  useLayoutEffect(() => {
    const box = mapBox.current;
    if (!box || !from || calm) return;
    const rect = box.getBoundingClientRect();
    flyX.set(from.x - (rect.left + rect.width / 2));
    flyY.set(from.y - (rect.top + rect.height / 2));
    flyScale.set(Math.min(0.85, Math.max(0.2, from.height / rect.height)));
    const options = { duration: 1.1, ease: EASE };
    const controls = [animate(flyX, 0, options), animate(flyY, 0, options), animate(flyScale, 1, options)];
    return () => controls.forEach((c) => c.stop());
  }, [from, calm, flyX, flyY, flyScale]);

  // The view the map is moving to. It is applied two frames after the choice, so the browser always sees the old
  // position first and then animates to the new one. The movement is a CSS transition on a transform, which the
  // graphics chip does by itself, so it stays smooth while the list below opens.
  const [view, setView] = useState<Framing>(framing(null));
  useEffect(() => {
    const target = framing(region);
    if (calm) {
      setView(target);
      return;
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setView(target));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [region, calm]);

  const pick = (next: Region) => {
    setActive(null);
    setRegion((current) => (current === next ? null : next));
  };

  const edge = 'absolute z-20 pointer-events-none from-paper-2 to-transparent';

  return (
    <motion.section
      aria-label="Techne client sites in the Philippines"
      className="col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 lg:gap-14 items-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3 }}
    >
      {/* Map, with no frame around it */}
      <motion.div
        ref={mapBox}
        className="w-full max-w-[400px] justify-self-center md:justify-self-end"
        style={{ x: flyX, y: flyY, scale: flyScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="relative" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          <div className="absolute inset-0 overflow-hidden" onPointerLeave={() => setActive(null)}>
            <div
              className="absolute inset-0"
              style={{
                transformOrigin: '0 0',
                transform: `translate(${view.x}%, ${view.y}%) scale(${view.s})`,
                transition: calm ? 'none' : MOVE,
              }}
            >
              <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
                <motion.path
                  d={PHILIPPINES_PATH}
                  fill="#2a8f93"
                  stroke="#ffffff"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
              </svg>
            </div>

            {/* Pins appear only for the island group that has been chosen */}
            {sites.map((site, i) => {
              if (site.region !== region) return null;
              const at = toBox(site.lon, site.lat);
              const order = sites.filter((s) => s.region === region).indexOf(site);
              return (
                <Pin
                  key={site.name}
                  n={i}
                  delay={0.7 + order * 0.1}
                  left={at.left}
                  top={at.top}
                  view={view}
                  still={calm}
                  open={active === i}
                  name={site.name}
                  detail={site.services.join(' · ')}
                  onActive={(on) => setActive(on ? i : null)}
                  onToggle={() => setActive(active === i ? null : i)}
                />
              );
            })}

            {/* Soft edges, so a zoomed-in map fades out at the frame instead of ending in a hard line */}
            <span aria-hidden="true" className={`${edge} inset-x-0 top-0 h-[7%] bg-gradient-to-b`} />
            <span aria-hidden="true" className={`${edge} inset-x-0 bottom-0 h-[7%] bg-gradient-to-t`} />
            <span aria-hidden="true" className={`${edge} inset-y-0 left-0 w-[7%] bg-gradient-to-r`} />
            <span aria-hidden="true" className={`${edge} inset-y-0 right-0 w-[7%] bg-gradient-to-l`} />
          </div>

          {region && (
            <button
              type="button"
              onClick={() => setRegion(null)}
              className="absolute top-0 left-0 z-30 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-2 hover:text-accent bg-paper-2/90 rounded-[3px] px-2 py-1 cursor-pointer transition-colors duration-150"
            >
              <Maximize2 size={13} aria-hidden="true" />
              Show all islands
            </button>
          )}

          {/* The name of the island group slides in each time one is chosen */}
          <AnimatePresence mode="wait">
            {region && (
              <motion.p
                key={region}
                aria-hidden="true"
                className="absolute bottom-2 left-0 z-30 font-display text-[1.75rem] font-bold uppercase tracking-tight text-ink/80 pointer-events-none"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {region}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* List, by island group */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-ink-2 hover:text-accent cursor-pointer transition-colors duration-150 mb-5"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to the globe
        </button>
        <p className="eyebrow mb-1">Philippines</p>
        <h3 className="heading-2">Where our clients are</h3>
        <p className="lede mt-3">{sites.length} client areas across Luzon, Visayas and Mindanao. Choose an island group to see its clients on the map.</p>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by service">
          {([null, ...SERVICES] as (Service | null)[]).map((option) => (
            <button
              key={option ?? 'all'}
              type="button"
              aria-pressed={service === option}
              onClick={() => {
                setActive(null);
                setService(option);
              }}
              className={`text-[0.8125rem] font-medium rounded-[3px] border px-3 py-1.5 cursor-pointer transition-colors duration-150 ${service === option ? 'bg-navy border-navy text-white' : 'border-rule text-ink-2 hover:border-accent hover:text-accent'}`}
            >
              {option ?? 'All'}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {REGIONS.map((name, g) => {
            const rows = sites.map((site, index) => ({ site, index })).filter(({ site }) => site.region === name);
            const selected = region === name;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + g * 0.12, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => pick(name)}
                  aria-pressed={selected}
                  aria-expanded={selected}
                  aria-label={`${name}, ${rows.length} areas. ${selected ? 'Hide the clients' : `Show the clients in ${name} on the map`}`}
                  className="group w-full flex items-baseline justify-between border-b-2 border-ink pb-1.5 cursor-pointer text-left"
                >
                  <span className={`text-[0.9375rem] font-semibold transition-colors duration-150 ${selected ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>{name}</span>
                  <span className="flex items-center gap-3 font-data text-[0.8125rem] text-ink-3">
                    <span className="hidden sm:inline text-[0.75rem] font-body text-ink-3 group-hover:text-accent transition-colors duration-150">
                      {selected ? 'Hide' : 'View clients'}
                    </span>
                    {String(rows.length).padStart(2, '0')}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.ul
                      key="rows"
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      {rows.map(({ site, index }) => (
                        <li
                          key={site.name}
                          onPointerEnter={() => setActive(index)}
                          onPointerLeave={() => setActive(null)}
                          className={`flex items-center gap-3 py-2.5 border-b border-rule transition-colors duration-150 ${active === index ? 'bg-accent-soft' : ''}`}
                        >
                          <span className={`font-data w-6 h-6 shrink-0 rounded-full text-[0.6875rem] font-semibold flex items-center justify-center transition-colors duration-150 ${active === index ? 'bg-accent text-white' : 'bg-navy text-white'}`}>
                            {index + 1}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[0.9375rem] font-medium text-ink truncate">{site.name}</span>
                          </span>
                          <span className="flex flex-wrap justify-end gap-1.5">
                            {site.services.map((sv) => (
                              <span key={sv} className="text-[0.75rem] text-ink-3 border border-rule rounded-[2px] px-1.5 py-0.5">{sv}</span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
};
