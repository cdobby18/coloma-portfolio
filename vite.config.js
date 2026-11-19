import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'node:child_process'

// Dev-only shim: `vite dev` can't run the Vercel Python function in api/rag.py,
// so this shells out to the same module directly for local testing.
// Production still uses the real Vercel Python runtime for api/rag.py.
function ragApiDevMiddleware() {
  return {
    name: 'rag-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/rag', (req, res) => {
        if (req.method === 'GET') {
          const py = spawn('python3', [
            '-c',
            'import sys, json\nsys.path.insert(0, "api")\nimport rag\nprint(json.dumps({"eval": rag.evaluate(), "chunks": rag.CHUNK_COUNT, "docs": len(rag.DOCS)}))',
          ])
          let out = ''
          let err = ''
          py.stdout.on('data', (d) => { out += d })
          py.stderr.on('data', (d) => { err += d })
          py.on('close', (code) => {
            res.setHeader('Content-Type', 'application/json')
            if (code !== 0) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err || 'python process failed' }))
              return
            }
            res.statusCode = 200
            res.end(out)
          })
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          let query = ''
          let context = ''
          try {
            const payload = JSON.parse(body || '{}')
            query = payload.query || ''
            if (typeof payload.context === 'string') context = payload.context
          } catch {}
          const py = spawn('python3', [
            '-c',
            'import sys, json\nsys.path.insert(0, "api")\nimport rag\nprint(json.dumps(rag.run_query(sys.argv[1], context=sys.argv[2] or None)))',
            query,
            context,
          ])
          let out = ''
          let err = ''
          py.stdout.on('data', (d) => { out += d })
          py.stderr.on('data', (d) => { err += d })
          py.on('close', (code) => {
            res.setHeader('Content-Type', 'application/json')
            if (code !== 0) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err || 'python process failed' }))
              return
            }
            res.statusCode = 200
            res.end(out)
          })
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), ragApiDevMiddleware()],
  server: {
    port: 5173,
    open: true,
  }
})
