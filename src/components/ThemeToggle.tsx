import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, useTheme } from '../theme';

// One easing for everything on the switch, so the knob, the icons and the track move together.
const GLIDE = '0.5s cubic-bezier(0.65, 0, 0.35, 1)';

/**
 * A switch that glides between light and dark. The knob moves with a CSS transition on its transform, which the
 * graphics chip runs by itself, so it stays smooth even while the page behind it is busy changing colour. The
 * switch moves first, and the page colours change a moment later, once the glide has started.
 * `withLabel` adds the words "Light mode" or "Dark mode" beside it, for the phone menu.
 */
export const ThemeToggle: React.FC<{ className?: string; withLabel?: boolean }> = ({ className = '', withLabel = false }) => {
  const theme = useTheme();
  // The switch follows this, not the page, so it can start moving before the page has finished redrawing.
  const [dark, setDark] = useState(theme === 'dark');
  useEffect(() => setDark(theme === 'dark'), [theme]);

  const flip = () => {
    const next = !dark;
    setDark(next);
    // Wait two frames, so the knob has begun to move before the page does its heavier work.
    requestAnimationFrame(() => requestAnimationFrame(() => setTheme(next ? 'dark' : 'light')));
  };

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      onClick={flip}
      className="relative shrink-0 w-[62px] h-[32px] rounded-full border border-rule-strong cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: dark ? 'var(--color-navy-2)' : 'var(--color-paper-3)', transition: `background-color ${GLIDE}` }}
    >
      {/* The two icons sit in the track, behind the knob */}
      <Sun size={15} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true" />
      <Moon size={15} className="absolute right-[9px] top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true" />

      {/* The knob */}
      <span
        className="absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-full bg-accent text-accent-ink shadow-[0_2px_6px_-1px_rgb(11_37_54_/_0.45)] will-change-transform"
        style={{ transform: `translateX(${dark ? 30 : 0}px)`, transition: `transform ${GLIDE}` }}
      >
        <Sun
          size={14}
          className="absolute inset-0 m-auto"
          aria-hidden="true"
          style={{ opacity: dark ? 0 : 1, transform: `rotate(${dark ? 90 : 0}deg) scale(${dark ? 0.4 : 1})`, transition: `opacity ${GLIDE}, transform ${GLIDE}` }}
        />
        <Moon
          size={14}
          className="absolute inset-0 m-auto"
          aria-hidden="true"
          style={{ opacity: dark ? 1 : 0, transform: `rotate(${dark ? 0 : -90}deg) scale(${dark ? 1 : 0.4})`, transition: `opacity ${GLIDE}, transform ${GLIDE}` }}
        />
      </span>
    </button>
  );

  if (!withLabel) return <span className={`inline-flex ${className}`}>{toggle}</span>;

  return (
    <div className={`flex items-center justify-between gap-4 border border-rule rounded-[3px] px-4 py-2.5 ${className}`}>
      <span className="text-[0.9375rem] font-medium text-ink">{dark ? 'Dark mode' : 'Light mode'}</span>
      {toggle}
    </div>
  );
};
