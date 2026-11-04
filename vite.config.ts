import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

type ApiHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>

/** Serves /api/contact while developing, the same way Vercel does once the site is deployed. */
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        server
          .ssrLoadModule('/api/contact.ts')
          .then((module) => (module.default as ApiHandler)(req, res))
          .catch((error: unknown) => {
            server.config.logger.error(`/api/contact failed to load: ${error instanceof Error ? error.message : 'unknown error'}`)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, code: 'send_failed' }))
          })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The contact form's server settings live in .env.local. Only these names are passed on, and only to the
  // server side. Anything already set in the shell wins, as it does on Vercel.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of Object.keys(env)) {
    if ((key.startsWith('RESEND_') || key === 'CONTACT_TO') && process.env[key] === undefined) process.env[key] = env[key]
  }
  return { plugins: [react(), contactApi()] }
})
