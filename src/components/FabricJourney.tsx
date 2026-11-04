import React, { useEffect, useRef, useState } from 'react';
import { FabricStage, type FabricFocus, type FabricJourneyLayout } from '../three/FabricStage';
import { FABRIC_DESCRIPTIONS } from './fabricDescriptions';

interface FabricJourneyProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  heroSlotRef: React.RefObject<HTMLDivElement | null>;
  columnRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  focus: FabricFocus;
  onFailed: () => void;
}

/**
 * Draws the shared model above the hero and the services panel. The stage is a
 * sticky element, so the browser moves it during scrolling and it stays locked to
 * the panel it lands in. Script only supplies how far along the route it is.
 */
const FabricJourney: React.FC<FabricJourneyProps> = ({ trackRef, heroSlotRef, columnRef, panelRef, focus, onFailed }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<FabricStage | null>(null);
  const initial = useRef({ focus, onFailed });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const heroSlot = heroSlotRef.current;
    const column = columnRef.current;
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    const host = hostRef.current;
    if (!track || !heroSlot || !column || !panel || !overlay || !host) return;

    let start = 0;
    let end = 1;

    const measure = (): FabricJourneyLayout => {
      const trackBox = track.getBoundingClientRect();
      const heroBox = heroSlot.getBoundingClientRect();
      const columnBox = column.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(panel).top) || 0;

      const left = Math.min(heroBox.left, panelBox.left);
      const width = Math.max(heroBox.right, panelBox.right) - left;
      const height = Math.max(heroBox.height, panelBox.height);
      const heroTop = heroBox.top - trackBox.top;

      // The extra height makes the stage and the panel scroll away at the same moment.
      overlay.style.height = `${columnBox.bottom - trackBox.top + height - panelBox.height}px`;
      host.style.marginLeft = `${left - trackBox.left}px`;
      host.style.marginTop = `${heroTop}px`;
      host.style.top = `${stickyTop}px`;
      host.style.width = `${width}px`;
      host.style.height = `${height}px`;

      const trackPageTop = trackBox.top + window.scrollY;
      start = trackPageTop + heroTop - stickyTop;
      end = trackPageTop + (columnBox.top - trackBox.top) - stickyTop;

      return {
        hero: { x: heroBox.left - left, y: 0, w: heroBox.width, h: heroBox.height },
        // Inset by one pixel so the model sits inside the panel's border.
        panel: { x: panelBox.left - left + 1, y: 1, w: panelBox.width - 2, h: panelBox.height - 2 },
      };
    };

    const progress = () => (end > start ? (window.scrollY - start) / (end - start) : 1);

    const layout = measure();
    try {
      stageRef.current = new FabricStage(host, {
        focus: initial.current.focus,
        showLabels: true,
        journey: { ...layout, progress: progress() },
        onReady: () => setReady(true),
      });
    } catch {
      // No WebGL. The home page falls back to a still image in each place.
      initial.current.onFailed();
      return;
    }

    const onScroll = () => stageRef.current?.setJourneyProgress(progress());
    window.addEventListener('scroll', onScroll, { passive: true });

    // Opening a dropdown changes the column height, which moves where the stage must let go.
    const observer = new ResizeObserver(() => {
      stageRef.current?.setJourneyLayout(measure());
      onScroll();
    });
    [track, heroSlot, column, panel].forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      stageRef.current?.dispose();
      stageRef.current = null;
    };
  }, [trackRef, heroSlotRef, columnRef, panelRef]);

  useEffect(() => {
    stageRef.current?.setFocus(focus);
  }, [focus]);

  return (
    <div ref={overlayRef} className="absolute inset-x-0 top-0 z-20 pointer-events-none">
      <div
        ref={hostRef}
        role="img"
        aria-label={FABRIC_DESCRIPTIONS[focus]}
        className={`sticky transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default FabricJourney;
