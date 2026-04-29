import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildChatReply, ChatRequestError } from './lib/chat.js';
import {
  ConfirmationRequestError,
  processConfirmationRequest,
} from './lib/confirmations.js';
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

const app = express();

app.disable('x-powered-by');

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

    return protocol === 'https:' && hostname.endsWith('--trockenbau-primavista.netlify.app');
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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
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

app.post('/api/confirmations', async (req, res) => {
  try {
    const result = await processConfirmationRequest({
      formName: req.body?.formName,
      submission: req.body?.submission,
    });

    res.json(result);
  } catch (error) {
    if (error instanceof ConfirmationRequestError) {
      sendJsonError(res, error.status, error.message);
      return;
    }

    console.error('[server] Confirmation request failed', error);
    sendJsonError(res, 500, 'Confirmation request failed.');
  }
});

app.post('/api/forms/submit', async (req, res) => {
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

app.use((error, _req, res, next) => {
  void next;

  if (error instanceof SyntaxError && 'body' in error) {
    sendJsonError(res, 400, 'Invalid JSON body.');
    return;
  }

  console.error('[server] Unhandled error', error);
  sendJsonError(res, 500, 'Internal server error.');
});

export default app;
