import { useLayoutEffect, useState } from 'react';

/**
 * How long the title stays in the middle of the screen before it moves up and the page appears, in milliseconds.
 * In that time it fades in, then a shine sweeps across it.
 */
export const INTRO_HOLD = 2300;

/**
 * Runs the opening of the page. The title appears in the middle of the screen with nothing else showing. After the
 * hold, it moves to its place and the rest of the page fades in. It starts once the loading splash has gone.
 */
export function useJourneyIntro() {
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  useLayoutEffect(() => {
    let timer = 0;
    let poll = 0;
    const begin = () => {
      setStarted(true);
      timer = window.setTimeout(() => setReady(true), INTRO_HOLD);
    };
    const waitForSplash = () => {
      if (document.getElementById('splash')) poll = window.setTimeout(waitForSplash, 60);
      else begin();
    };
    waitForSplash();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(poll);
    };
  }, []);
  return { ready, started };
}
