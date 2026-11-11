import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * The animation for choosing a partner on the About page. The logo that was clicked lifts off the page and glides to
 * the middle of the screen, the page behind it fades out, and then the partner's page opens. It lives above the
 * routes, so it keeps running while the page underneath changes.
 */
export interface Flight {
  /** Where to go when the logo arrives. */
  to: string;
  name: string;
  /** The logo image. Without it the partner's name is shown as text. */
  src?: string;
  /** A logo drawn in black or a very dark colour, which is turned white in dark mode. */
  darkLogo?: boolean;
  /** Where the logo is now, in window coordinates, and how big the text is if it is text. */
  rect: { left: number; top: number; width: number; height: number };
  fontSize?: string;
}

let current: Flight | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Starts the animation. Returns false if one is already running. */
export const flyPartner = (flight: Flight) => {
  if (current) return false;
  current = flight;
  emit();
  return true;
};

const EASE = [0.65, 0, 0.35, 1] as const;

export const PartnerFlyer: React.FC = () => {
  const flight = useSyncExternalStore(subscribe, () => current, () => null);
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'go' | 'leave'>('go');

  useEffect(() => {
    setPhase('go');
  }, [flight]);

  if (!flight) return null;

  const { rect } = flight;
  const centreX = window.innerWidth / 2;
  const centreY = window.innerHeight / 2;
  const dx = centreX - (rect.left + rect.width / 2);
  const dy = centreY - (rect.top + rect.height / 2);
  // It grows to about 200px tall, but never wider than the screen allows.
  const scale = Math.max(1, Math.min(200 / rect.height, Math.min(window.innerWidth * 0.8, 380) / rect.width));
  const going = phase === 'go';

  const done = () => {
    if (phase === 'go') {
      navigate(flight.to);
      setPhase('leave');
    } else {
      current = null;
      emit();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[300]" style={{ pointerEvents: 'auto' }} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-paper"
        initial={{ opacity: 0 }}
        animate={{ opacity: going ? 0.96 : 0 }}
        transition={{ duration: going ? 0.45 : 0.5, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={{ x: dx, y: dy, scale, opacity: going ? 1 : 0 }}
        transition={{
          x: { duration: 0.7, ease: EASE },
          y: { duration: 0.7, ease: EASE },
          scale: { duration: 0.7, ease: EASE },
          opacity: { duration: going ? 0.2 : 0.45, ease: 'easeOut' },
        }}
        onAnimationComplete={done}
      >
        {flight.src ? (
          <img
            src={flight.src}
            alt=""
            draggable={false}
            className={`${flight.darkLogo ? 'logo-on-dark ' : ''}w-full h-full object-contain`}
          />
        ) : (
          <span className="font-display font-bold tracking-tight text-ink whitespace-nowrap" style={{ fontSize: flight.fontSize }}>
            {flight.name}
          </span>
        )}
      </motion.div>
    </div>,
    document.body,
  );
};
