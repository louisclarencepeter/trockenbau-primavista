import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'
import { handler as chatHandler } from './netlify/functions/chat.js'
import { handler as reviewsHandler } from './netlify/functions/reviews.js'

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      resolve('')
      return
    }

    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => resolve(body))
    req.on('error', reject)
  })

const buildEvent = async (req) => {
  const url = new URL(req.url || '/', 'http://localhost')
  const searchParams = Object.fromEntries(url.searchParams.entries())

  return {
    httpMethod: req.method || 'GET',
    headers: req.headers,
    path: url.pathname,
    rawUrl: url.toString(),
    queryStringParameters: Object.keys(searchParams).length ? searchParams : null,
    body: await readRequestBody(req),
    isBase64Encoded: false,
  }
}

const sendFunctionResponse = (res, response) => {
  const { statusCode = 200, headers = {}, body = '' } = response || {}

  res.statusCode = statusCode

  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined) {
      res.setHeader(key, value)
    }
  })

  res.end(body)
}

const netlifyFunctionDevPlugin = () => ({
  name: 'netlify-function-dev-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const pathname = new URL(req.url || '/', 'http://localhost').pathname

      if (pathname !== '/api/reviews' && pathname !== '/api/chat') {
        next()
        return
      }

      const handler = pathname === '/api/reviews' ? reviewsHandler : chatHandler

      try {
        const event = await buildEvent(req)
        const response = await handler(event)
        sendFunctionResponse(res, response)
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }))
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  Object.assign(process.env, env)

  return {
    plugins: [react(), netlifyFunctionDevPlugin()],
    server: {
      host: true,
      open: true,
      port: 5173,
    },
  }
})
