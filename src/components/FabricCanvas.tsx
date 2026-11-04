import React, { useEffect, useRef } from 'react';
import { FabricStage, type FabricFocus } from '../three/FabricStage';

interface FabricCanvasProps {
  focus: FabricFocus;
  showLabels: boolean;
  framing: 'focus' | 'full';
  onReady: () => void;
  onFailed: () => void;
}

/** Loaded on demand so three.js never delays the first paint of the page. */
const FabricCanvas: React.FC<FabricCanvasProps> = ({ focus, showLabels, framing, onReady, onFailed }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<FabricStage | null>(null);
  const initial = useRef({ focus, showLabels, framing, onReady, onFailed });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const { focus: startFocus, showLabels: startLabels, framing: startFraming, onReady: ready, onFailed: failed } = initial.current;
    try {
      stageRef.current = new FabricStage(host, {
        focus: startFocus,
        showLabels: startLabels,
        framing: startFraming,
        onReady: ready,
      });
    } catch {
      // No WebGL on this device. FabricView shows a still image instead.
      failed();
    }
    return () => {
      stageRef.current?.dispose();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    stageRef.current?.setFocus(focus);
  }, [focus]);

  useEffect(() => {
    stageRef.current?.setShowLabels(showLabels);
  }, [showLabels]);

  return <div ref={hostRef} className="absolute inset-0" />;
};

export default FabricCanvas;
