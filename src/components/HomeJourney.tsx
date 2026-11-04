import React, { Suspense, lazy, useRef, useState, useSyncExternalStore } from 'react';
import type { ServiceSummary } from '../content/site';
import { Hero } from './Hero';
import { ServiceExplorer } from './HomeSections';

const FabricJourney = lazy(() => import('./FabricJourney'));

const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
  );

/**
 * The top of the home page. On desktop one 3D model starts in the hero, travels
 * down as the visitor scrolls, and lands in the services panel, where selecting a
 * service carries on animating that same model. Phones and tablets get a separate
 * model in each place instead, because a model pinned over the page would cover
 * the text on a small screen.
 */
export const HomeJourney: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroSlotRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ServiceSummary['id']>('colocation');
  const [failed, setFailed] = useState(false);

  const desktop = useMediaQuery('(min-width: 1024px)');
  const sharedModel = desktop && !failed;

  return (
    <div ref={trackRef} className="relative">
      <Hero slotRef={heroSlotRef} sharedModel={sharedModel} />
      <ServiceExplorer
        active={active}
        onSelect={setActive}
        columnRef={columnRef}
        panelRef={panelRef}
        sharedModel={sharedModel}
      />
      {sharedModel && (
        <Suspense fallback={null}>
          <FabricJourney
            trackRef={trackRef}
            heroSlotRef={heroSlotRef}
            columnRef={columnRef}
            panelRef={panelRef}
            focus={active}
            onFailed={() => setFailed(true)}
          />
        </Suspense>
      )}
    </div>
  );
};
