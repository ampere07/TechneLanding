import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { FabricFocus } from '../three/FabricStage';
import fabricStill from '../assets/fabric-still.webp';
import { FABRIC_DESCRIPTIONS } from './fabricDescriptions';

const FabricCanvas = lazy(() => import('./FabricCanvas'));


interface FabricViewProps {
  focus?: FabricFocus;
  /** Hides annotation labels. Useful when the model is drawn very small. */
  labels?: boolean;
  /** 'focus' moves the camera to the service. 'full' keeps the whole hall in frame. */
  framing?: 'focus' | 'full';
  className?: string;
}

/**
 * The interconnection hall model. Starts loading shortly before it scrolls into
 * view, and falls back to a still image on devices without WebGL.
 */
export const FabricView: React.FC<FabricViewProps> = ({ focus = 'overview', labels = true, framing = 'focus', className = '' }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={FABRIC_DESCRIPTIONS[focus]}
      className={`relative overflow-hidden transition-opacity duration-500 ${ready || failed ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {failed && <img src={fabricStill} alt="" className="absolute inset-0 w-full h-full object-contain" draggable="false" />}
      {near && !failed && (
        <Suspense fallback={null}>
          <FabricCanvas
            focus={focus}
            showLabels={labels}
            framing={framing}
            onReady={() => setReady(true)}
            onFailed={() => setFailed(true)}
          />
        </Suspense>
      )}
    </div>
  );
};
