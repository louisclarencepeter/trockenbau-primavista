import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'
import { handler as chatHandler } from './netlify/functions/chat.js'
import confirmationsHandler from './netlify/functions/confirmations.js'
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

const buildRequestHeaders = (headers = {}) => {
  const requestHeaders = new Headers()

  Object.entries(headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => requestHeaders.append(key, item))
      return
    }

    if (typeof value === 'string') {
      requestHeaders.set(key, value)
    }
  })

  return requestHeaders
}

const buildRequest = async (req) => {
  const method = req.method || 'GET'
  const init = {
    method,
    headers: buildRequestHeaders(req.headers),
  }

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = await readRequestBody(req)
  }

  return new Request(new URL(req.url || '/', 'http://localhost'), init)
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

const sendWebResponse = async (res, response) => {
  res.statusCode = response.status

  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  res.end(await response.text())
}

const getHeaderValue = (header) => {
  if (Array.isArray(header)) {
    return header.join(', ')
  }

  return typeof header === 'string' ? header : ''
}

const handleLocalNetlifyFormSubmission = async (req, res, pathname) => {
  if (pathname !== '/' || req.method !== 'POST') {
    return false
  }

  const contentType = getHeaderValue(req.headers['content-type'])

  if (!contentType.includes('application/x-www-form-urlencoded')) {
    return false
  }

  const body = await readRequestBody(req)
  const formData = new URLSearchParams(body)

  if (!formData.get('form-name')) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing form-name field.' }))
    return true
  }

  // Netlify Forms does not exist in the Vite dev server, so we acknowledge
  // the submission locally and let the frontend continue its normal flow.
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ ok: true, localDev: true }))
  return true
}

const netlifyFunctionDevPlugin = () => ({
  name: 'netlify-function-dev-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(req.url || '/', 'http://localhost')
      const pathname = requestUrl.pathname

      if (await handleLocalNetlifyFormSubmission(req, res, pathname)) {
        return
      }

      if (pathname === '/.netlify/images') {
        const sourceUrl = requestUrl.searchParams.get('url')

        if (!sourceUrl) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing image url parameter' }))
          return
        }

        res.statusCode = 302
        res.setHeader('Location', sourceUrl)
        res.end()
        return
      }

      if (pathname === '/api/confirmations') {
        try {
          const request = await buildRequest(req)
          const response = await confirmationsHandler(request)
          await sendWebResponse(res, response)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }))
        }
        return
      }

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
