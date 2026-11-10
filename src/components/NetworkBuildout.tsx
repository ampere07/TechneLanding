import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowLeftRight, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
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
const PROJECTS: { title: string; kind: Kind; count?: number }[] = [
  { title: 'Project title', kind: 'comparison' },
  { title: 'Project title', kind: 'single' },
  { title: 'Project title', kind: 'gallery', count: 5 },
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
 * Network drawn in the page header, built up the way a real buildout is:
 * devices are racked, links are patched in (dashed, unlit), the core lights each link outward,
 * and then traffic flows along every live link.
 */
type NodeKind = 'core' | 'dist' | 'edge';
const NODES: { x: number; y: number; kind: NodeKind; label: string; hops: number }[] = [
  { x: 60, y: 200, kind: 'edge', label: 'EDGE-01', hops: 2 },
  { x: 180, y: 90, kind: 'dist', label: 'DIST-01', hops: 1 },
  { x: 190, y: 290, kind: 'dist', label: 'DIST-02', hops: 1 },
  { x: 320, y: 190, kind: 'core', label: 'CORE', hops: 0 },
  { x: 440, y: 80, kind: 'dist', label: 'DIST-03', hops: 1 },
  { x: 450, y: 300, kind: 'dist', label: 'DIST-04', hops: 1 },
  { x: 560, y: 190, kind: 'edge', label: 'EDGE-02', hops: 2 },
];
const LINKS: { a: number; b: number; cap?: string }[] = [
  { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3, cap: '100G' }, { a: 2, b: 3 }, { a: 1, b: 4 }, { a: 3, b: 4 },
  { a: 3, b: 5, cap: '100G' }, { a: 2, b: 5 }, { a: 4, b: 6 }, { a: 5, b: 6 }, { a: 3, b: 6, cap: '10G' },
];

const TEAL = 'var(--color-teal-bright)';
const MONO = 'var(--font-data)';

const HeroNetwork: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 620 380" className="w-full h-auto" role="img" aria-label="Network topology with a core router, distribution switches and edge sites, all links up">
      {LINKS.map(({ a, b, cap }, i) => {
        const A = NODES[a];
        const B = NODES[b];
        const lit = 0.9 + Math.max(A.hops, B.hops) * 0.7;
        const flow = lit + 0.9;
        const forward = i % 2 === 0;
        return (
          <g key={i}>
            {/* Cable run, not yet carrying traffic */}
            <motion.line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke="#fff" strokeOpacity={0.22} strokeWidth={1.25} strokeDasharray="3 5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
            />
            {/* Link comes up, spreading outward from the core */}
            <motion.line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={TEAL} strokeOpacity={0.6} strokeWidth={1.75}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: lit, ease: EASE }}
            />
            {/* Traffic moving along the live link */}
            <motion.line
              x1={forward ? A.x : B.x} y1={forward ? A.y : B.y} x2={forward ? B.x : A.x} y2={forward ? B.y : A.y}
              stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeDasharray="1 13"
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={reduced ? { opacity: 0.7 } : { opacity: 0.85, strokeDashoffset: -28 }}
              transition={{
                opacity: { duration: 0.6, delay: flow },
                strokeDashoffset: { duration: 2.4 + (i % 3) * 0.5, delay: flow, repeat: Infinity, ease: 'linear' },
              }}
            />
            {cap && (
              <motion.text
                x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 7} textAnchor="middle"
                fontSize={10} fontFamily={MONO} fill={TEAL} stroke="var(--color-navy)" strokeWidth={4} paintOrder="stroke"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: flow + 0.2 }}
              >
                {cap}
              </motion.text>
            )}
          </g>
        );
      })}

      {NODES.map((n, i) => {
        const size = n.kind === 'core' ? 26 : n.kind === 'dist' ? 18 : 14;
        const appear = 0.15 + i * 0.08;
        const online = 0.9 + n.hops * 0.7;
        return (
          <g key={i}>
            {/* One ring leaves each device as it comes online */}
            <motion.rect
              x={n.x - size / 2} y={n.y - size / 2} width={size} height={size} rx={n.kind === 'edge' ? size / 2 : 3}
              fill="none" stroke={TEAL} strokeWidth={1.5}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              initial={{ opacity: 0, scale: 1 }} animate={{ opacity: [0, 0.8, 0], scale: [1, 2.6] }}
              transition={{ duration: 1.2, delay: online, ease: 'easeOut' }}
            />
            <motion.rect
              x={n.x - size / 2} y={n.y - size / 2} width={size} height={size} rx={n.kind === 'edge' ? size / 2 : 3}
              fill="var(--color-navy)" stroke={TEAL} strokeWidth={2}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: appear, ease: EASE }}
            />
            {n.kind === 'core' && (
              <motion.path
                d={`M${n.x - 6} ${n.y - 2} h12 M${n.x - 6} ${n.y + 3} h12`} stroke={TEAL} strokeWidth={1.5} strokeLinecap="round"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: appear + 0.3 }}
              />
            )}
            <motion.text
              x={n.x} y={n.y + size / 2 + 15} textAnchor="middle" fontSize={10} fontFamily={MONO} fill="#fff" fillOpacity={0.6}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: appear + 0.3 }}
            >
              {n.label}
            </motion.text>
          </g>
        );
      })}

      {/* Status line shown once everything is up */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 3.2 }}>
        <motion.circle
          cx={64} cy={350} r={4} fill={TEAL}
          animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text x={76} y={354} fontSize={11} fontFamily={MONO} fill="#fff" fillOpacity={0.75}>All links up</text>
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
const SuccessPhoto: React.FC = () => (
  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-rule">
    <PhotoPlaceholder kind="after" label="Completed project photo placeholder" />
    <span className="absolute top-3 left-3 bg-navy/85 text-white text-[0.75rem] font-medium px-2.5 py-1 rounded-[3px]">As delivered</span>
  </div>
);

/** Draggable comparison. It sweeps once when it scrolls into view to show it can be moved. */
const BeforeAfter: React.FC<{ label: string }> = ({ label }) => {
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
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-rule select-none touch-pan-y cursor-ew-resize"
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
      <PhotoPlaceholder kind="after" />
      <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: clip }}>
        <PhotoPlaceholder kind="before" />
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
const Gallery: React.FC<{ label: string; count: number }> = ({ label, count }) => {
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
      className="focus-visible:outline-2 focus-visible:outline-offset-4 rounded-[4px]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-rule">
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
            <PhotoPlaceholder kind="after" label={`Photo ${index + 1} placeholder`} />
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
            <ImageIcon size={16} aria-hidden="true" />
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
                    {project.kind === 'comparison' && <BeforeAfter label={project.title} />}
                    {project.kind === 'single' && <SuccessPhoto />}
                    {project.kind === 'gallery' && <Gallery label={`${project.title} (${index + 1})`} count={project.count ?? 4} />}
                  </div>
                  <div>
                    <p className="body-copy">Project summary placeholder. A short account of the requirement, what Techne built and the outcome for the customer.</p>
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
