import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * The splash screen in index.html. A 3D rack runs on it, with servers sliding in and out one at a time, until
 * the page and its fonts have finished loading. It is a loading indicator that stays inside its own box, so it
 * runs for visitors who ask for reduced motion too, as the other 3D scenes on the site do for short sequences.
 */
const splash = document.getElementById('splash')
if (splash) {
  const minimum = 1000
  const pageLoaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined, () => undefined)
  const minimumTime = new Promise<void>((resolve) => window.setTimeout(resolve, Math.max(0, minimum - performance.now())))

  // The 3D rack loads on its own and is given a moment. If it cannot start, the flat racks stay.
  let rack: { dispose: () => void } | null = null
  const stage = document.getElementById('splash-stage')
  const rackReady = !stage
    ? Promise.resolve()
    : Promise.race([
        import('./three/SplashRack').then(({ SplashRack }) => {
          try {
            rack = new SplashRack(stage)
            stage.classList.add('splash__stage--3d')
            // Stay long enough for the servers to go into the rack once, from the moment it appears.
            return new Promise<void>((resolve) => window.setTimeout(resolve, 2300))
          } catch {
            rack = null
          }
        }),
        new Promise<void>((resolve) => window.setTimeout(resolve, 2500)),
      ]).catch(() => undefined)

  void Promise.all([pageLoaded, fontsReady, rackReady, minimumTime]).then(() => {
    splash.classList.add('splash--ready')
    window.setTimeout(() => {
      splash.classList.add('splash--out')
      document.documentElement.classList.remove('is-loading')
      window.setTimeout(() => {
        splash.remove()
        rack?.dispose()
      }, 700)
    }, 200)
  })
}
