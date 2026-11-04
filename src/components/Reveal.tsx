import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const tags = { div: motion.div, li: motion.li, tr: motion.tr } as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof tags;
  /** Seconds to wait once the block is in view. Use small steps to stagger a group. */
  delay?: number;
  /** How far the block rises while it fades in, in pixels. Table rows use 0 because their borders stay put. */
  distance?: number;
  /** Renders a plain element, so a shared component can opt out of the motion. */
  disabled?: boolean;
}

/**
 * Fades a block in, and lifts it slightly, the first time it scrolls into view. It plays once.
 * Under a reduced-motion setting the lift is removed by the app's MotionConfig and only the fade remains.
 */
export const Reveal: React.FC<RevealProps> = ({ children, className, as = 'div', delay = 0, distance = 18, disabled = false }) => {
  if (disabled) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Tag = tags[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};
