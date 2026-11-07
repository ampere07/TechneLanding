import React, { useLayoutEffect, useRef } from 'react';

/**
 * Holds part of the page back until the About opening has finished, then fades it in. The fade is run in code, not
 * with a CSS transition, so it still plays when the visitor's device asks for reduced motion.
 */
export const AfterIntro: React.FC<{ ready: boolean; delay?: number; children: React.ReactNode }> = ({ ready, delay = 500, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ready) return;
    const animation = ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay, easing: 'ease', fill: 'backwards' });
    return () => animation?.cancel();
  }, [ready, delay]);
  return (
    <div ref={ref} style={{ opacity: ready ? 1 : 0, visibility: ready ? 'visible' : 'hidden' }}>
      {children}
    </div>
  );
};
