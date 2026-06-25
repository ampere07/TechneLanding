import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Player } from '@remotion/player';
import { PANEL_IDS } from '../constants';
import { NetworkScene, SCENE } from '../remotion/NetworkScene';

const EASE = [0.16, 1, 0.3, 1] as const;

// Freeze the Remotion loop on a representative frame when the visitor prefers
// reduced motion — the graphic still reads as a network fabric, just still.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const stats = [
  { value: '99.9%', label: 'Network Uptime' },
  { value: '24/7', label: 'Local NOC Support' },
  { value: '200+', unit: 'Gbps', label: 'Backbone Capacity' },
];

export const Hero: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="home" className="relative pt-28 pb-20 bg-paper overflow-x-clip">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Left — thesis */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-accent" />
              <span className="font-mono text-xs text-ink-2 tracking-[0.14em] uppercase">
                Carrier-neutral · Philippines
              </span>
            </div>

            <h1
              className="font-display font-bold text-ink leading-[1.04]"
              style={{ fontSize: 'var(--text-display)' }}
            >
              Network infrastructure,
              <br />
              engineered to peer.
            </h1>

            <p className="font-body text-[1.125rem] text-ink-2 leading-relaxed mt-6 max-w-xl">
              Carrier-neutral exchange paths, dedicated internet access, and managed
              configuration &amp; consulting for ISPs and enterprises across the Philippines.
            </p>

            <div className="flex flex-wrap gap-3 mt-9">
              <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary px-6 py-3">
                Get Started
              </Link>
              <Link to={`/${PANEL_IDS.SERVICES}`} className="btn-secondary px-6 py-3">
                View Services
              </Link>
            </div>

            {/* Stat strip */}
            <div className="border-t border-rule mt-12 pt-8 grid grid-cols-3 gap-6 max-w-xl">
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-mono font-semibold text-ink flex items-baseline gap-0.5"
                    style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}
                  >
                    {s.value}
                    {s.unit && <span className="text-ink-2 text-base font-medium">{s.unit}</span>}
                  </div>
                  <div className="font-body text-xs text-ink-2 tracking-[0.04em] mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — signature element: Remotion exchange-fabric */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="relative"
          >
            <div className="relative border border-rule rounded-[4px] bg-paper-2 overflow-hidden shadow-[0_1px_0_0_var(--color-rule)]">
              {/* Console header strip */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-rule bg-paper">
                <span className="font-mono text-[11px] text-ink-2 tracking-[0.12em] uppercase">
                  Exchange Fabric
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] text-accent tracking-[0.1em] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Live
                </span>
              </div>

              <Player
                component={NetworkScene}
                durationInFrames={SCENE.durationInFrames}
                fps={SCENE.fps}
                compositionWidth={SCENE.width}
                compositionHeight={SCENE.height}
                style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', display: 'block' }}
                autoPlay={!reducedMotion}
                loop
                controls={false}
                clickToPlay={false}
                doubleClickToFullscreen={false}
                initialFrame={reducedMotion ? 90 : 0}
              />
            </div>

            {/* Caption */}
            <p className="font-mono text-[11px] text-ink-2/70 mt-3 tracking-[0.04em]">
              Illustrative topology — core peering with exchange points, datacenters &amp; CDN caches.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
