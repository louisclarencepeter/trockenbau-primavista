import { randomBytes } from 'node:crypto';

const MAX_FORM_BODY_BYTES = 8 * 1024;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 8_000;
const DEFAULT_CAMPAIGN_UNSUBSCRIBE_API_BASE = 'https://outreachos.dev/api/public';
const LEAD_ID_PATTERN = /^[a-f\d]{24}$/i;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

class FormBodyTooLargeError extends Error {
  constructor() {
    super('Unsubscribe form body is too large.');
    this.name = 'FormBodyTooLargeError';
  }
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );

const getNetlifyEnvironmentValue = (name) => {
  const netlifyValue = globalThis.Netlify?.env?.get?.(name);

  if (typeof netlifyValue === 'string' && netlifyValue.trim()) {
    return netlifyValue.trim();
  }

  const processValue = process.env[name];
  return typeof processValue === 'string' ? processValue.trim() : '';
};

const normalizeApiBase = (value) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
      return null;
    }

    return url.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
};

const validLeadId = (value) => LEAD_ID_PATTERN.test(String(value || ''));

const validToken = (value) => {
  const token = String(value || '');
  return token.length <= 2_048 && TOKEN_PATTERN.test(token);
};

const readFormParameters = async (request) => {
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_FORM_BODY_BYTES) {
    throw new FormBodyTooLargeError();
  }

  const body = await request.text();

  if (new TextEncoder().encode(body).byteLength > MAX_FORM_BODY_BYTES) {
    throw new FormBodyTooLargeError();
  }

  return new URLSearchParams(body);
};

const securityHeaders = (nonce) => ({
  'Cache-Control': 'no-store, max-age=0',
  'Content-Security-Policy': [
    "default-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self'",
    `style-src 'nonce-${nonce}'`,
  ].join('; '),
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  Pragma: 'no-cache',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
});

const pageCopy = {
  confirm: {
    eyebrow: 'E-Mail-Einstellungen',
    title: 'E-Mails abbestellen',
    message:
      'Wenn Sie bestätigen, erhalten Sie von Trockenbau PrimaVista Schweiz keine weiteren Werbe-E-Mails.',
  },
  success: {
    eyebrow: 'Bestätigung',
    title: 'Sie sind abgemeldet',
    message: 'Sie erhalten von Trockenbau PrimaVista Schweiz keine weiteren Werbe-E-Mails.',
  },
  invalid: {
    eyebrow: 'Link nicht gültig',
    title: 'Abmeldung nicht möglich',
    message:
      'Dieser Abmelde-Link ist nicht gültig. Bitte antworten Sie auf die E-Mail, wenn Sie keine weiteren Nachrichten möchten.',
  },
  retry: {
    eyebrow: 'Technisches Problem',
    title: 'Bitte versuchen Sie es später noch einmal',
    message: 'Die Abmeldung ist gerade nicht möglich. Bitte versuchen Sie es in einigen Minuten noch einmal.',
  },
  tooLarge: {
    eyebrow: 'Anfrage nicht möglich',
    title: 'Die Anfrage ist zu groß',
    message: 'Bitte öffnen Sie den Link aus der E-Mail noch einmal und versuchen Sie es erneut.',
  },
};

const pageStyles = `
  :root {
    color-scheme: light;
    font-family: Inter, Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #e8dfdf;
    color: #1a1a1a;
  }
  * { box-sizing: border-box; }
  body {
    min-height: 100vh;
    margin: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    background:
      radial-gradient(circle at 12% 8%, rgba(200, 154, 106, 0.2), transparent 34%),
      linear-gradient(145deg, #f7f2ee 0%, #e8dfdf 58%, #dfd3ce 100%);
  }
  .shell { width: min(100%, 620px); }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 20px;
    color: #3b0905;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .brand img { width: 44px; height: 44px; border-radius: 8px; }
  .card {
    overflow: hidden;
    border: 1px solid rgba(26, 26, 26, 0.1);
    border-radius: 12px;
    background: rgba(247, 242, 238, 0.96);
    box-shadow: 0 24px 60px rgba(59, 9, 5, 0.14);
  }
  .accent { height: 5px; background: linear-gradient(90deg, #3b0905, #826140, #c89a6a); }
  .content { padding: clamp(30px, 7vw, 52px); }
  .eyebrow {
    margin: 0 0 14px;
    color: #826140;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }
  h1 {
    margin: 0;
    color: #3b0905;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(34px, 7vw, 52px);
    font-weight: 500;
    line-height: 1.04;
  }
  p { margin: 20px 0 0; color: #4a433d; font-size: 17px; line-height: 1.65; }
  form { margin-top: 30px; }
  button {
    width: 100%;
    min-height: 52px;
    border: 0;
    border-radius: 6px;
    background: #3b0905;
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-weight: 750;
  }
  button:hover { background: #5a2417; }
  button:focus-visible, a:focus-visible { outline: 3px solid #c89a6a; outline-offset: 3px; }
  .home {
    display: inline-block;
    margin-top: 24px;
    color: #5a2417;
    font-size: 14px;
    font-weight: 700;
    text-underline-offset: 4px;
  }
  .note { margin-top: 16px; color: #665f58; font-size: 13px; }
  @media (max-width: 480px) {
    body { padding: 16px; }
    .brand { align-items: flex-start; }
    .content { padding: 30px 24px; }
  }
`;

const renderPage = ({ state, leadId = '', token = '' }) => {
  const nonce = randomBytes(18).toString('base64');
  const copy = pageCopy[state];
  const showForm = state === 'confirm';
  const formAction = `/abmelden/${encodeURIComponent(leadId)}`;

  const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow,noarchive">
    <title>${escapeHtml(copy.title)} | Trockenbau PrimaVista Schweiz</title>
    <style nonce="${nonce}">${pageStyles}</style>
  </head>
  <body>
    <div class="shell">
      <a class="brand" href="/" aria-label="Zur Website von Trockenbau PrimaVista Schweiz">
        <img src="/pwa-192x192.png" width="44" height="44" alt="">
        <span>Trockenbau PrimaVista Schweiz</span>
      </a>
      <main class="card">
        <div class="accent" aria-hidden="true"></div>
        <div class="content">
          <div class="eyebrow">${escapeHtml(copy.eyebrow)}</div>
          <h1>${escapeHtml(copy.title)}</h1>
          <p>${escapeHtml(copy.message)}</p>
          ${
            showForm
              ? `<form action="${escapeHtml(formAction)}" method="post">
            <input type="hidden" name="token" value="${escapeHtml(token)}">
            <button type="submit">Jetzt abmelden</button>
          </form>
          <div class="note">Die Abmeldung gilt sofort.</div>`
              : ''
          }
          <a class="home" href="/">Zur Website</a>
        </div>
      </main>
    </div>
  </body>
</html>`;

  return { html, nonce };
};

const htmlResponse = (status, state, options = {}, extraHeaders = {}) => {
  const { html, nonce } = renderPage({ state, ...options });

  return new Response(html, {
    status,
    headers: {
      ...securityHeaders(nonce),
      'Content-Type': 'text/html; charset=utf-8',
      ...extraHeaders,
    },
  });
};

const oneClickResponse = (status, extraHeaders = {}) =>
  new Response(null, {
    status,
    headers: {
      ...securityHeaders(randomBytes(18).toString('base64')),
      ...extraHeaders,
    },
  });

const relayUnsubscribe = async ({ apiBase, fetchImpl, leadId, timeoutMs, token }) => {
  const target = `${apiBase}/unsubscribe/${encodeURIComponent(leadId)}`;

  return fetchImpl(target, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    redirect: 'error',
    signal: AbortSignal.timeout(timeoutMs),
  });
};

export const handleCampaignUnsubscribeRequest = async (
  request,
  {
    apiBase =
      getNetlifyEnvironmentValue('CAMPAIGN_UNSUBSCRIBE_API_BASE') ||
      DEFAULT_CAMPAIGN_UNSUBSCRIBE_API_BASE,
    fetchImpl = fetch,
    leadId,
    timeoutMs = DEFAULT_UPSTREAM_TIMEOUT_MS,
  } = {},
) => {
  if (!['GET', 'POST'].includes(request.method)) {
    return htmlResponse(405, 'invalid', {}, { Allow: 'GET, POST' });
  }

  const requestUrl = new URL(request.url);

  if (!validLeadId(leadId)) {
    return htmlResponse(400, 'invalid');
  }

  if (request.method === 'GET') {
    const token = requestUrl.searchParams.get('token') || '';

    if (!validToken(token)) {
      return htmlResponse(400, 'invalid');
    }

    return htmlResponse(200, 'confirm', { leadId, token });
  }

  let formParameters;

  try {
    formParameters = await readFormParameters(request);
  } catch (error) {
    if (error instanceof FormBodyTooLargeError) {
      return htmlResponse(413, 'tooLarge');
    }

    return htmlResponse(400, 'invalid');
  }

  const isOneClick = formParameters.get('List-Unsubscribe') === 'One-Click';
  const token = requestUrl.searchParams.get('token') || formParameters.get('token') || '';

  if (!validToken(token)) {
    return isOneClick ? oneClickResponse(400) : htmlResponse(400, 'invalid');
  }

  const normalizedApiBase = normalizeApiBase(apiBase);

  if (!normalizedApiBase) {
    return isOneClick
      ? oneClickResponse(503, { 'Retry-After': '60' })
      : htmlResponse(503, 'retry', {}, { 'Retry-After': '60' });
  }

  let upstreamResponse;

  try {
    upstreamResponse = await relayUnsubscribe({
      apiBase: normalizedApiBase,
      fetchImpl,
      leadId,
      timeoutMs,
      token,
    });
  } catch (error) {
    console.error('[campaign-unsubscribe] Upstream request failed.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });

    return isOneClick
      ? oneClickResponse(503, { 'Retry-After': '60' })
      : htmlResponse(503, 'retry', {}, { 'Retry-After': '60' });
  }

  if (upstreamResponse.ok) {
    return isOneClick ? oneClickResponse(204) : htmlResponse(200, 'success');
  }

  if (upstreamResponse.status >= 400 && upstreamResponse.status < 500 && upstreamResponse.status !== 429) {
    return isOneClick ? oneClickResponse(400) : htmlResponse(400, 'invalid');
  }

  return isOneClick
    ? oneClickResponse(503, { 'Retry-After': '60' })
    : htmlResponse(503, 'retry', {}, { 'Retry-After': '60' });
};
