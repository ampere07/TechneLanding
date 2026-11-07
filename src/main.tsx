import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Montserrat Extra Bold, for the AS number title. It is bundled with the site, so it does not depend on another server.
import '@fontsource/montserrat/800.css'

const root = createRoot(document.getElementById('root')!)

/** Loads the app's code, without drawing it yet. */
const loadApp = () => import('./App.tsx')
const drawApp = (App: Awaited<ReturnType<typeof loadApp>>['default']) => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/**
 * The splash screen in index.html. A 3D rack runs on it, with servers sliding in and out one at a time, until
 * the page and its fonts have finished loading. It is a loading indicator that stays inside its own box, so it
 * runs for visitors who ask for reduced motion too, as the other 3D scenes on the site do for short sequences.
 *
 * The app is loaded first but only drawn when the splash is about to leave. Drawing the whole page, including
 * its own 3D scene, would use up the processor while the rack is moving, and the rack would stutter.
 */
const splash = document.getElementById('splash')

if (!splash) {
  void loadApp().then((module) => drawApp(module.default))
} else {
  const minimum = 1000
  const pageLoaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve()
    else window.addEventListener('load', () => resolve(), { once: true })
  })
  const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined, () => undefined)
  const minimumTime = new Promise<void>((resolve) => window.setTimeout(resolve, Math.max(0, minimum - performance.now())))
  // Waits until the page is drawing smoothly again, so the fade does not stutter while the app's first draw is still busy.
  const untilSmooth = () =>
    new Promise<void>((resolve) => {
      const deadline = performance.now() + 2000
      let last = performance.now()
      let smooth = 0
      const tick = (now: number) => {
        smooth = now - last < 40 ? smooth + 1 : 0
        last = now
        if (smooth >= 5 || now > deadline) resolve()
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })

  void (async () => {
    // Both are fetched at once. The rack is drawn the moment its code arrives, with nothing else in its place.
    const appLoading = loadApp()
    const rackLoading = import('./three/SplashRack')
    appLoading.catch(() => undefined)

    let rack: { dispose: () => void } | null = null
    const stage = document.getElementById('splash-stage')
    if (stage) {
      await Promise.race([
        rackLoading.then(async ({ SplashRack }) => {
          try {
            rack = new SplashRack(stage)
            // Stay long enough for the servers to go into the rack once, from the moment it appears.
            await new Promise<void>((resolve) => window.setTimeout(resolve, 2300))
          } catch {
            rack = null
          }
        }),
        new Promise<void>((resolve) => window.setTimeout(resolve, 4000)),
      ]).catch(() => undefined)
    }

    let module: Awaited<ReturnType<typeof loadApp>>
    try {
      module = await appLoading
    } catch {
      splash.remove()
      document.documentElement.classList.remove('is-loading')
      return
    }

    // Wait for the page and its fonts, then draw the app underneath and let the splash fade away.
    await Promise.all([pageLoaded, fontsReady, minimumTime])
    splash.classList.add('splash--ready')
    await new Promise<void>((resolve) => window.setTimeout(resolve, 200))
    drawApp(module.default)
    await untilSmooth()
    splash.classList.add('splash--out')
    document.documentElement.classList.remove('is-loading')
    window.setTimeout(() => {
      splash.remove()
      rack?.dispose()
    }, 700)
  })()
}
