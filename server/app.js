import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildChatReply, ChatRequestError } from './lib/chat.js';
import { submitForm, FormSubmissionError } from './lib/forms.js';
import { getGoogleReviews, ReviewsRequestError } from './lib/reviews.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../client/dist');
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'https://trockenbau-primavista.ch',
  'https://www.trockenbau-primavista.ch',
];
const NETLIFY_PREVIEW_HOSTNAME_PATTERN = /^(deploy-preview-\d+|[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)--trockenbau-primavista\.netlify\.app$/;
const FORM_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const FORM_RATE_LIMIT_MAX_REQUESTS = 5;
const CHAT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CHAT_RATE_LIMIT_MAX_REQUESTS = 20;

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

const getAllowedOrigins = () => {
  const configuredOrigins = String(process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);
};

const isAllowedCorsOrigin = (origin) => {
  if (!origin) {
    return false;
  }

  if (getAllowedOrigins().has(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);

    return protocol === 'https:' && NETLIFY_PREVIEW_HOSTNAME_PATTERN.test(hostname);
  } catch {
    return false;
  }
};

app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedCorsOrigin(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.append('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json({ limit: '1mb' }));

const sendJsonError = (res, status, message, extra = {}) => {
  res.status(status).json({
    error: message,
    ...extra,
  });
};

const getRateLimitKey = (req) =>
  req.ip
    || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

const createRateLimiter = ({ windowMs, max, message }) => {
  const buckets = new Map();

  const pruneExpired = (now) => {
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }
  };

  return (req, res, next) => {
    const now = Date.now();

    if (buckets.size > 1000) {
      pruneExpired(now);
    }

    const key = getRateLimitKey(req);
    const currentBucket = buckets.get(key);
    const bucket = currentBucket && currentBucket.resetAt > now
      ? currentBucket
      : { count: 0, resetAt: now + windowMs };

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);

      res.set('Retry-After', String(retryAfterSeconds));
      sendJsonError(res, 429, message);
      return;
    }

    next();
  };
};

const formRateLimiter = createRateLimiter({
  windowMs: FORM_RATE_LIMIT_WINDOW_MS,
  max: FORM_RATE_LIMIT_MAX_REQUESTS,
  message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
});

const chatRateLimiter = createRateLimiter({
  windowMs: CHAT_RATE_LIMIT_WINDOW_MS,
  max: CHAT_RATE_LIMIT_MAX_REQUESTS,
  message: 'Zu viele Chat-Anfragen. Bitte versuchen Sie es später erneut.',
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', chatRateLimiter, async (req, res) => {
  try {
    const reply = await buildChatReply(req.body?.messages);
    res.json({ reply });
  } catch (error) {
    if (error instanceof ChatRequestError) {
      sendJsonError(res, error.status, error.reply);
      return;
    }

    console.error('[server] Chat request failed', error);
    sendJsonError(res, 500, 'Es gab einen Fehler. Bitte versuchen Sie es später erneut.');
  }
});

app.get('/api/reviews', async (_req, res) => {
  try {
    const data = await getGoogleReviews();
    const hasReviews = Array.isArray(data.reviews) && data.reviews.length > 0;
    const isProduction = process.env.NODE_ENV === 'production';

    res.set('Cache-Control', isProduction && hasReviews ? 'public, max-age=86400' : 'no-store');
    res.json(data);
  } catch (error) {
    if (error instanceof ReviewsRequestError) {
      sendJsonError(res, error.status, error.message);
      return;
    }

    console.error('[server] Reviews request failed', error);
    sendJsonError(res, 500, 'Bewertungen konnten nicht geladen werden.');
  }
});

app.post('/api/forms/submit', formRateLimiter, async (req, res) => {
  try {
    const result = await submitForm({
      formName: req.body?.formName,
      submission: req.body?.submission,
    });

    res.status(result.spam ? 202 : 200).json(result);
  } catch (error) {
    if (error instanceof FormSubmissionError) {
      sendJsonError(res, error.status, error.message);
      return;
    }

    console.error('[server] Form submission failed', error);
    sendJsonError(res, 500, 'Form submission failed.');
  }
});

app.use('/api', (_req, res) => {
  sendJsonError(res, 404, 'API route not found.');
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    sendJsonError(res, 400, 'Invalid JSON body.');
    return;
  }

  console.error('[server] Unhandled error', error);
  sendJsonError(res, 500, 'Internal server error.');
});

export default app;
