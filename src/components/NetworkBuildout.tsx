import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowLeftRight, ChevronLeft, ChevronRight, ExternalLink, ImageIcon } from 'lucide-react';
import { HOME_PATH } from '../constants';
import { ClosingCTA } from './ClosingCTA';
import { Reveal } from './Reveal';
import { ProcessSteps, SectionTitle } from './ServiceLayout';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How each project shows its photos:
 * 'comparison' is a before/after slider, 'single' is one finished-result photo,
 * 'gallery' is a set of photos (`count` of them) the visitor can step through.
 */
type Kind = 'comparison' | 'single' | 'gallery';
interface Project {
  title: string;
  kind: Kind;
  count?: number;
  /** A real photo for a 'single' project. Leave out to show the placeholder. */
  photo?: string;
  /** Real photos for a 'gallery' project. Portrait. */
  photos?: string[];
  /** Real before and after photos for a 'comparison' project. Both are portrait. */
  before?: string;
  /** Several before and after pairs, shown side by side. Used instead of `before` and `after`. */
  pairs?: { before: string; after: string }[];
  after?: string;
  summary?: string;
  link?: string;
}
const PROJECTS: Project[] = [
  {
    title: "Laguna Network Deployment",
    kind: 'comparison',
    before: '/network-buildout/laguna-before.jpg',
    after: '/network-buildout/laguna-after.jpg',
    summary:
      "End-to-end deployment and implementation of a Core, Distribution, and Network Monitoring System for an ISP network in Laguna. The project focused on building a scalable network architecture, improving traffic visibility, and strengthening overall network performance, reliability, and manageability.",
    link: 'https://www.facebook.com/share/p/1MqTipwuMd/',
  },
  {
    title: "Surigao Network Deployment",
    kind: 'gallery',
    photos: [1, 2, 3, 4, 5].map((n) => `/network-buildout/surigao-${n}.jpg`),
    summary:
      "End-to-end deployment and implementation of a Core, Distribution, and Network Monitoring System for an ISP network in Surigao. The project focused on building a more scalable and resilient infrastructure while improving network visibility, performance, and operational control.",
    link: 'https://www.facebook.com/share/p/1CQxGmaFUC/',
  },
  {
    title: "Rizal Network Deployment",
    kind: 'comparison',
    pairs: [
      { before: '/network-buildout/rizal-before-1.jpg', after: '/network-buildout/rizal-after-1.jpg' },
      { before: '/network-buildout/rizal-before-2.jpg', after: '/network-buildout/rizal-after-2.jpg' },
    ],
    summary:
      "Deployment and implementation of a Core, Distribution, and Network Monitoring System for an ISP network in Rizal, designed to improve scalability, reliability, traffic visibility, and overall network operations.",
    link: 'https://www.facebook.com/share/p/1CuNUEEJv1/',
  },
  {
    title: "Zamboanga, Basilan & Jolo Network Deployment",
    kind: 'gallery',
    photos: [1, 2, 3, 4, 5].map((n) => `/network-buildout/zamboanga-${n}.jpg`),
    summary:
      "Deployment and implementation of a multi-site ISP network across Zamboanga, Basilan, and Jolo, focused on strengthening inter-site connectivity, network reliability, scalability, and operational visibility across geographically challenging areas.",
    link: 'https://www.facebook.com/share/p/19enECDbgv/',
  },
  {
    title: "Vitro Makati 2 Data Center Presence Deployment",
    kind: 'gallery',
    photos: [1, 2, 3, 4].map((n) => `/network-buildout/vitro-makati-2-${n}.jpg`),
    summary:
      "Deployment and implementation of a data center network presence at VITRO Makati 2 for an ISP client from Leyte, providing a stronger foundation for upstream connectivity, peering, network scalability, and future expansion.",
    link: 'https://www.facebook.com/share/p/1eQvr8uvki/',
  },
  {
    title: "Bohol Network Deployment",
    kind: 'gallery',
    photos: Array.from({ length: 10 }, (_, i) => `/network-buildout/bohol-${i + 1}.jpg`),
    summary:
      "Deployment and implementation of a scalable ISP network infrastructure for clients in Bohol, focused on improving core connectivity, network reliability, traffic visibility, and readiness for future capacity and service expansion.",
    link: 'https://www.facebook.com/share/p/1X3jPwFEwW/',
  },
  {
    title: "Leyte Network Deployment",
    kind: 'gallery',
    photos: Array.from({ length: 6 }, (_, i) => `/network-buildout/leyte-${i + 1}.jpg`),
    summary:
      "Deployment and implementation of a core and distribution network infrastructure for an ISP in Leyte, designed to improve network reliability, scalability, traffic management, and overall service performance while preparing the network for future growth and expansion.",
    link: 'https://www.facebook.com/share/p/1DCofhk6Wq/',
  },
];

const FACTS = [
  { label: 'Scope', value: 'Survey to handover' },
  { label: 'Delivery', value: 'Single accountable team' },
  { label: 'Documentation', value: 'As-built records supplied' },
  { label: 'Coverage', value: 'Philippines' },
];

const STEPS = [
  { title: 'Survey', desc: 'Site assessment of power, space, fibre routes and existing equipment.' },
  { title: 'Design', desc: 'Topology, capacity plan and bill of materials prepared by our engineers.' },
  { title: 'Build', desc: 'Racks, cabling, optics and routers installed, labelled and documented.' },
  { title: 'Commission', desc: 'Links tested, accepted by the customer and handed over for monitoring.' },
];

/**
 * Rack drawn in the page header, built the way a real buildout goes: the rack frame stands, each unit is slid in
 * from the side one after another, fibre is patched to every unit from a trunk, and then the port lights come on.
 */
type UnitKind = 'router' | 'switch' | 'olt';
const UNITS: { kind: UnitKind; label: string }[] = [
  { kind: 'router', label: 'RADI-1' },
  { kind: 'router', label: 'MGMT-1' },
  { kind: 'switch', label: 'CSW-1' },
  { kind: 'router', label: 'CRT-1' },
  { kind: 'router', label: 'AGR-1' },
  { kind: 'router', label: 'AC-1' },
  { kind: 'router', label: 'AC-2' },
  { kind: 'switch', label: 'DSW-1' },
  { kind: 'olt', label: 'OLT-1' },
  { kind: 'olt', label: 'OLT-2' },
];

const TEAL = 'var(--color-teal-bright)';
const MONO = 'var(--font-data)';
const FIBRE = '#f2c230';

const RACK = { x: 130, w: 200, top: 22, bottom: 372 };
const UNIT = { x: 140, w: 180, h: 26, first: 40, step: 32 };
const TRUNK_X = 96;

/** Port detail drawn on the face of each kind of unit. */
const Ports: React.FC<{ kind: UnitKind; y: number }> = ({ kind, y }) => {
  if (kind === 'router') {
    return (
      <>
        {Array.from({ length: 12 }, (_, k) => (
          <rect key={k} x={UNIT.x + 30 + k * 9 + Math.floor(k / 4) * 5} y={y + 9} width={7} height={7} rx={1} fill="#fff" fillOpacity={0.35} />
        ))}
        <rect x={UNIT.x + 8} y={y + 7} width={12} height={12} rx={1.5} fill={TEAL} fillOpacity={0.55} />
      </>
    );
  }
  if (kind === 'switch') {
    return (
      <>
        {Array.from({ length: 8 }, (_, k) => (
          <rect key={k} x={UNIT.x + 14 + k * 15} y={y + 8} width={11} height={10} rx={1} fill={TEAL} fillOpacity={0.5} />
        ))}
      </>
    );
  }
  return (
    <>
      {Array.from({ length: 8 }, (_, k) => (
        <rect key={k} x={UNIT.x + 14 + k * 11} y={y + 8} width={8} height={10} rx={1} fill="#4aa3ff" fillOpacity={0.75} />
      ))}
      <rect x={UNIT.x + 108} y={y + 8} width={36} height={10} rx={1} fill="#fff" fillOpacity={0.2} />
    </>
  );
};

/** How long one deployment runs before the rack is cleared and built again. */
const CYCLE = 11;

/** Progress bar and stage name, counting up as the rack is built. */
const Progress: React.FC = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const run = animate(0, 100, { duration: 3.7, delay: 0.35, ease: 'linear', onUpdate: (v) => setPct(Math.round(v)) });
    return () => run.stop();
  }, []);
  const stage = pct >= 100 ? 'Rack commissioned' : pct >= 70 ? 'Bringing links up' : pct >= 40 ? 'Patching fibre' : 'Racking units';
  return (
    <g>
      <rect x={RACK.x} y={382} width={RACK.w} height={3} rx={1.5} fill="#fff" fillOpacity={0.15} />
      <rect x={RACK.x} y={382} width={(RACK.w * pct) / 100} height={3} rx={1.5} fill={TEAL} />
      <circle cx={RACK.x + 3} cy={398} r={3.5} fill={pct >= 100 ? '#3ddc84' : '#f5a623'} />
      <text x={RACK.x + 12} y={402} fontSize={11} fontFamily={MONO} fill="#fff" fillOpacity={0.8}>
        {stage}
        {pct < 100 ? '...' : ''}
      </text>
      <text x={RACK.x + RACK.w} y={402} textAnchor="end" fontSize={11} fontFamily={MONO} fill={TEAL}>
        {pct}%
      </text>
    </g>
  );
};

/**
 * The build always plays. For people who ask their system for less motion it plays once, as fades only, and then stays
 * still: no sliding, no looping and no blinking lights.
 */
const HeroNetwork: React.FC = () => {
  const calm = !!useReducedMotion();
  // The deployment runs again and again: after a pause the rack fades out and is built from the start.
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (calm) return;
    const timer = setTimeout(() => setCycle((c) => c + 1), CYCLE * 1000);
    return () => clearTimeout(timer);
  }, [calm, cycle]);

  const ready = 0.35 + UNITS.length * 0.22;
  const yOf = (i: number) => UNIT.first + i * UNIT.step;

  return (
    <svg viewBox="0 0 460 412" className="w-full h-auto max-w-[460px] mx-auto" role="img" aria-label="A network rack being built: units are installed, fibre is patched to each one, and the port lights come on">
      <motion.g
        key={cycle}
        initial={{ opacity: 1 }}
        animate={calm ? { opacity: 1 } : { opacity: [1, 1, 0] }}
        transition={{ duration: CYCLE, times: [0, 0.93, 1], ease: 'linear' }}
      >
        {/* Rack frame */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <rect x={RACK.x} y={RACK.top} width={RACK.w} height={RACK.bottom - RACK.top} rx={4} fill="#fff" fillOpacity={0.03} stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
          {[RACK.x + 5, RACK.x + RACK.w - 5].map((x) =>
            Array.from({ length: 22 }, (_, k) => <circle key={`${x}-${k}`} cx={x} cy={RACK.top + 12 + k * 15.5} r={1.4} fill="#fff" fillOpacity={0.25} />),
          )}
        </motion.g>

        {/* Fibre trunk, then a branch into each unit */}
        <motion.path
          d={`M${TRUNK_X} ${UNIT.first - 18} V${RACK.bottom - 10}`}
          stroke={FIBRE} strokeWidth={5} strokeLinecap="round" strokeOpacity={0.9} fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: ready - 0.4, ease: EASE }}
        />
        {UNITS.map((_, i) => {
          const y = yOf(i) + UNIT.h / 2;
          return (
            <g key={i}>
              <motion.path
                d={`M${TRUNK_X} ${y} C${TRUNK_X + 16} ${y} ${UNIT.x - 14} ${y} ${UNIT.x + 14} ${y}`}
                stroke={FIBRE} strokeWidth={2} strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: ready + i * 0.07, ease: EASE }}
              />
              <motion.circle
                cx={UNIT.x + 14} cy={y} r={2.5} fill={FIBRE}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ready + 0.4 + i * 0.07 }}
              />
            </g>
          );
        })}

        {/* A pulse travels down the trunk once it is live */}
        {!calm && (
          <motion.circle
            cx={TRUNK_X} r={3.5} fill="#fff"
            initial={{ cy: UNIT.first - 18, opacity: 0 }}
            animate={{ cy: [UNIT.first - 18, RACK.bottom - 10], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, delay: ready + 1.2, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
          />
        )}

        {/* Units slide in from the side, one after another */}
        {UNITS.map((u, i) => {
          const y = yOf(i);
          const start = 0.35 + i * 0.22;
          const online = ready + 0.5 + i * 0.07;
          return (
            <motion.g
              key={i}
              initial={{ x: calm ? 0 : 90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: start, ease: EASE }}
            >
              <rect x={UNIT.x} y={y} width={UNIT.w} height={UNIT.h} rx={2.5} fill="#fff" fillOpacity={0.09} stroke="#fff" strokeOpacity={0.4} strokeWidth={1.25} />
              {/* A bright outline marks the unit as it seats in the rack */}
              <motion.rect
                x={UNIT.x} y={y} width={UNIT.w} height={UNIT.h} rx={2.5} fill="none" stroke={TEAL} strokeWidth={2}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: start + 0.55, ease: 'easeOut' }}
              />
              <Ports kind={u.kind} y={y} />
              {/* Status light: amber and flickering while the unit is provisioned, then green once it is online */}
              {!calm && (
                <motion.circle
                  cx={UNIT.x + UNIT.w - 24} cy={y + UNIT.h / 2} r={2.6} fill="#f5a623"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.2, 1, 0.2, 1, 0.2, 1, 0] }}
                  transition={{ delay: start + 0.5, duration: online - start - 0.5, ease: 'linear' }}
                />
              )}
              <motion.circle
                cx={UNIT.x + UNIT.w - 24} cy={y + UNIT.h / 2} r={2.6} fill="#3ddc84"
                initial={{ opacity: 0 }}
                animate={calm ? { opacity: 1 } : { opacity: [0, 1, 0.35, 1] }}
                transition={calm ? { delay: online, duration: 0.4 } : { delay: online, duration: 1.6 + (i % 4) * 0.45, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              />
              <motion.circle
                cx={UNIT.x + UNIT.w - 13} cy={y + UNIT.h / 2} r={2.6} fill="#4aa3ff"
                initial={{ opacity: 0 }}
                animate={calm ? { opacity: 1 } : { opacity: [0, 1, 0.35, 1] }}
                transition={calm ? { delay: online + 0.2, duration: 0.4 } : { delay: online + 0.2, duration: 1.2 + ((i + 1) % 4) * 0.45, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              />
              <text x={RACK.x + RACK.w + 12} y={y + UNIT.h / 2 + 3.5} fontSize={10} fontFamily={MONO} fill="#fff" fillOpacity={0.6}>
                {u.label}
              </text>
            </motion.g>
          );
        })}

        <Progress />
      </motion.g>
    </svg>
  );
};

/** Photo stand-in. Swap the contents for an <img> once real photos are supplied. */
const PhotoPlaceholder: React.FC<{ kind: 'before' | 'after'; label?: string }> = ({ kind, label }) => {
  const after = kind === 'after';
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${after ? 'bg-navy-2 text-white/70' : 'bg-paper-3 text-ink-3'}`}
      style={{
        backgroundImage: after
          ? 'linear-gradient(rgb(99 180 181 / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(99 180 181 / 0.12) 1px, transparent 1px)'
          : 'repeating-linear-gradient(135deg, rgb(11 37 54 / 0.05) 0 10px, transparent 10px 20px)',
        backgroundSize: after ? '32px 32px' : undefined,
      }}
    >
      <ImageIcon size={32} aria-hidden="true" />
      <span className="font-data text-[0.8125rem]">{label ?? (after ? 'After photo placeholder' : 'Before photo placeholder')}</span>
    </div>
  );
};

/** A single finished-result photo for projects with no before shot. */
const SuccessPhoto: React.FC<{ src?: string; alt?: string }> = ({ src, alt = '' }) => (
  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-rule bg-navy-2">
    {src ? (
      <>
        {/* A blurred copy fills the frame, so a portrait photo is shown whole without bars */}
        <img src={src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60" />
        <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-contain" />
      </>
    ) : (
      <PhotoPlaceholder kind="after" label="Completed project photo placeholder" />
    )}
    <span className="absolute top-3 left-3 bg-navy/85 text-white text-[0.75rem] font-medium px-2.5 py-1 rounded-[3px]">As delivered</span>
  </div>
);

/** Draggable comparison. It sweeps once when it scrolls into view to show it can be moved. */
const BeforeAfter: React.FC<{ label: string; before?: string; after?: string }> = ({ label, before, after }) => {
  const portrait = !!(before && after);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  // The handle moves with a transform, which the browser can do without re-laying out the page.
  const x = useTransform(pos, (v) => `${v}%`);
  const dragging = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const handle = useRef<HTMLDivElement>(null);

  // Keep the screen-reader value current without re-rendering React on every frame.
  useEffect(() => pos.on('change', (v) => handle.current?.setAttribute('aria-valuenow', String(Math.round(v)))), [pos]);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(pos, [50, 18, 82, 50], { duration: 2.4, ease: 'easeInOut', delay: 0.3 });
    return () => controls.stop();
  }, [inView, reduced, pos]);

  const moveTo = (clientX: number) => {
    const rect = rectRef.current;
    if (!rect) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  const end = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={box}
      className={`relative w-full overflow-hidden rounded-[4px] border border-rule select-none touch-pan-y cursor-ew-resize ${portrait ? 'aspect-[3/4] max-w-[460px] mx-auto' : 'aspect-[16/10]'}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        rectRef.current = box.current?.getBoundingClientRect() ?? null; // measured once per drag, not per move
        pos.stop();
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {after ? <img src={after} alt={`${label}: after`} draggable={false} className="absolute inset-0 w-full h-full object-cover" /> : <PhotoPlaceholder kind="after" />}
      <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: clip }}>
        {before ? <img src={before} alt={`${label}: before`} draggable={false} className="absolute inset-0 w-full h-full object-cover" /> : <PhotoPlaceholder kind="before" />}
      </motion.div>

      <span className="absolute top-3 left-3 bg-paper/90 text-ink text-[0.75rem] font-medium px-2.5 py-1 rounded-[3px]">Before</span>
      <span className="absolute top-3 right-3 bg-navy/85 text-white text-[0.75rem] font-medium px-2.5 py-1 rounded-[3px]">After</span>

      {/* Full-width layer, so a percentage translate moves by a share of the photo width, not of the 1px line. */}
      <motion.div className="absolute inset-0 pointer-events-none will-change-transform" style={{ x }}>
        <div className="absolute inset-y-0 left-0 w-px bg-white shadow-[0_0_0_1px_rgb(11_37_54_/_0.25)]" aria-hidden="true" />
        {/* Wide grab zone. touch-none lets a finger drag it sideways without the page scrolling. */}
        <div className="absolute inset-y-0 -left-6 w-12 touch-none pointer-events-auto" aria-hidden="true" />
        <div
          ref={handle}
          role="slider"
          tabIndex={0}
          aria-label={`${label}: compare before and after`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') pos.set(Math.max(0, pos.get() - 5));
            if (e.key === 'ArrowRight') pos.set(Math.min(100, pos.get() + 5));
          }}
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 touch-none pointer-events-auto rounded-[3px] bg-white text-ink border border-rule shadow-[0_2px_8px_-2px_rgb(11_37_54_/_0.35)] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeftRight size={18} aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  );
};

/** Several photos of one deployment. Slides move in the direction of travel, and thumbnails below jump to any photo. */
const Gallery: React.FC<{ label: string; count: number; photos?: string[] }> = ({ label, count: placeholders, photos }) => {
  const count = photos?.length ?? placeholders;
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const go = (next: number) => setState(([current]) => [(next + count) % count, next > current ? 1 : -1]);
  const step = (d: number) => setState(([current]) => [(current + d + count) % count, d]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photos`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }}
      className={`focus-visible:outline-2 focus-visible:outline-offset-4 rounded-[4px] ${photos ? 'max-w-[460px] mx-auto' : ''}`}
    >
      <div className={`relative w-full overflow-hidden rounded-[4px] border border-rule ${photos ? 'aspect-[3/4] bg-navy-2' : 'aspect-[16/10]'}`}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            className="absolute inset-0"
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? '40%' : '-40%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d >= 0 ? '-40%' : '40%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
          >
            {photos ? (
              <>
                {/* Shown whole, so a wide photo is not cropped. A blurred copy fills the rest of the frame. */}
                <img src={photos[index]} alt="" aria-hidden="true" draggable={false} className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60" />
                <img src={photos[index]} alt={`${label}, photo ${index + 1} of ${count}`} draggable={false} className="absolute inset-0 w-full h-full object-contain" />
              </>
            ) : <PhotoPlaceholder kind="after" label={`Photo ${index + 1} placeholder`} />}
          </motion.div>
        </AnimatePresence>

        <span className="absolute top-3 left-3 bg-navy/85 text-white text-[0.75rem] font-medium px-2.5 py-1 rounded-[3px]">As delivered</span>
        <span className="absolute top-3 right-3 bg-paper/90 text-ink font-data text-[0.75rem] px-2.5 py-1 rounded-[3px]" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>

        {(['prev', 'next'] as const).map((side) => (
          <button
            key={side}
            type="button"
            aria-label={side === 'prev' ? 'Previous photo' : 'Next photo'}
            onClick={() => step(side === 'prev' ? -1 : 1)}
            className={`absolute top-1/2 -translate-y-1/2 ${side === 'prev' ? 'left-3' : 'right-3'} w-10 h-10 rounded-[3px] bg-white text-ink border border-rule flex items-center justify-center cursor-pointer transition-colors duration-150 hover:text-accent`}
          >
            {side === 'prev' ? <ChevronLeft size={20} aria-hidden="true" /> : <ChevronRight size={20} aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`relative shrink-0 w-20 aspect-[4/3] rounded-[3px] border bg-paper-3 text-ink-3 flex items-center justify-center cursor-pointer transition-[border-color,opacity] duration-150 ${i === index ? 'border-accent opacity-100' : 'border-rule opacity-60 hover:opacity-100'}`}
          >
            {photos ? <img src={photos[i]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover rounded-[3px]" /> : <ImageIcon size={16} aria-hidden="true" />}
            {i === index && <motion.span layoutId={`${label}-thumb`} className="absolute inset-0 rounded-[3px] ring-2 ring-accent" transition={{ duration: 0.3, ease: EASE }} />}
          </button>
        ))}
      </div>
    </div>
  );
};

/** Before and after photos of network buildout projects. Placeholders until real photos are supplied. */
export const NetworkBuildout: React.FC = () => (
  <>
    <section className="bg-navy text-white overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="wrap relative grid grid-cols-1 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-8 items-center py-12 lg:py-16">
        <div>
          <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-white/70 mb-6 flex items-center gap-1.5">
            <Link to={HOME_PATH} className="hover:text-white transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">Network Buildout</span>
          </nav>
          <Reveal distance={12}>
            <p className="eyebrow !text-teal-bright mb-2">Project portfolio</p>
            <h1 className="heading-1 !text-white">Network buildout, delivered to specification</h1>
            <p className="text-[1.0625rem] leading-relaxed text-white/85 mt-5 max-w-xl">
              A selection of completed network deployments for ISPs and enterprises, from site survey through to commissioning and handover.
            </p>
          </Reveal>
        </div>
        <HeroNetwork />
      </div>
    </section>

    <section aria-label="Key facts" className="bg-paper border-b border-rule">
      <dl className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 py-7">
        {FACTS.map((item) => (
          <div key={item.label}>
            <dt className="text-[0.8125rem] text-ink-3">{item.label}</dt>
            <dd className="font-data text-[1rem] font-medium text-ink mt-0.5">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>

    <section className="section bg-paper">
      <div className="wrap">
        <SectionTitle eyebrow="Case studies" title="Completed deployments" intro="Each project is documented from survey to handover." />
        <div className="space-y-16">
          {PROJECTS.map((project, index) => (
            <Reveal key={index} distance={10}>
              <article className="border-t-2 border-ink pt-6">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-data text-[0.875rem] text-ink-3">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="heading-2">{project.title}</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-6 lg:gap-10 items-start">
                  <div>
                    {project.kind === 'comparison' &&
                      (project.pairs ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {project.pairs.map((pair, n) => (
                            <BeforeAfter key={n} label={`${project.title}, view ${n + 1}`} before={pair.before} after={pair.after} />
                          ))}
                        </div>
                      ) : (
                        <BeforeAfter label={project.title} before={project.before} after={project.after} />
                      ))}
                    {project.kind === 'single' && <SuccessPhoto src={project.photo} alt={project.title} />}
                    {project.kind === 'gallery' && <Gallery label={`${project.title} (${index + 1})`} count={project.count ?? 4} photos={project.photos} />}
                  </div>
                  <div>
                    <p className="body-copy">
                      {project.summary ?? 'Project summary placeholder. A short account of the requirement, what Techne built and the outcome for the customer.'}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View the ${project.title} post on Facebook (opens in a new tab)`}
                        className="inline-flex items-center gap-2 mt-5 text-[0.9375rem] font-medium text-white bg-navy hover:bg-accent rounded-[3px] px-4 py-2.5 transition-colors duration-150"
                      >
                        View on Facebook
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section bg-paper-2 border-t border-rule">
      <div className="wrap">
        <SectionTitle eyebrow="How we build" title="Delivery methodology" intro="Every buildout follows the same four stages, with sign-off at each." />
        <ProcessSteps steps={STEPS} animate />
      </div>
    </section>

    <ClosingCTA reveal />
  </>
);
