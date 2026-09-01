import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { handleCampaignUnsubscribeRequest } from './campaign-unsubscribe.mjs';

const LEAD_ID = '507f1f77bcf86cd799439011';
const TOKEN = 'signed_payload.signed_signature';
const API_BASE = 'https://campaign-api.example.test/api/public';
const PAGE_URL = `https://trockenbau-primavista.ch/abmelden/${LEAD_ID}`;

const request = ({ body, method = 'GET', token = TOKEN } = {}) => {
  const url = new URL(PAGE_URL);

  if (token !== null) {
    url.searchParams.set('token', token);
  }

  return new Request(url, {
    method,
    ...(body === undefined
      ? {}
      : {
          body,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
  });
};

const assertPrivateBrandedPage = async (response) => {
  const html = await response.text();
  const csp = response.headers.get('content-security-policy') || '';

  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
  assert.match(csp, /default-src 'none'/);
  assert.match(csp, /style-src 'nonce-[^']+'/);
  assert.match(html, /Trockenbau PrimaVista Schweiz/);
  assert.doesNotMatch(html, /OutreachOS|outreachos\.dev|onrender\.com/i);

  return html;
};

test('GET renders a branded confirmation without changing subscription state', async () => {
  let fetchCalls = 0;
  const response = await handleCampaignUnsubscribeRequest(request(), {
    apiBase: API_BASE,
    fetchImpl: async () => {
      fetchCalls += 1;
      return new Response(null, { status: 200 });
    },
    leadId: LEAD_ID,
  });

  assert.equal(response.status, 200);
  assert.equal(fetchCalls, 0);
  const html = await assertPrivateBrandedPage(response);
  assert.match(html, /E-Mails abbestellen/);
  assert.match(html, new RegExp(`action="/abmelden/${LEAD_ID}"`));
  assert.match(html, new RegExp(`name="token" value="${TOKEN}"`));
  assert.match(html, /<style nonce="[^"]+">/);
});

test('GET rejects a missing or malformed token without reflecting it', async () => {
  for (const token of [null, '<script>alert(1)</script>']) {
    const response = await handleCampaignUnsubscribeRequest(request({ token }), {
      apiBase: API_BASE,
      leadId: LEAD_ID,
    });

    assert.equal(response.status, 400);
    const html = await assertPrivateBrandedPage(response);
    assert.match(html, /Abmeldung nicht möglich/);
    assert.doesNotMatch(html, /<script>alert/);
  }
});

test('manual POST relays the token server-side and renders branded success', async () => {
  const calls = [];
  const response = await handleCampaignUnsubscribeRequest(
    request({ body: new URLSearchParams({ token: TOKEN }).toString(), method: 'POST', token: null }),
    {
      apiBase: `${API_BASE}/`,
      fetchImpl: async (url, options) => {
        calls.push({ url, options });
        return Response.json({ message: 'ok' });
      },
      leadId: LEAD_ID,
    },
  );

  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${API_BASE}/unsubscribe/${LEAD_ID}`);
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.redirect, 'error');
  assert.equal(calls[0].options.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].options.body), { token: TOKEN });
  assert.ok(calls[0].options.signal instanceof AbortSignal);
  const html = await assertPrivateBrandedPage(response);
  assert.match(html, /Sie sind abgemeldet/);
});

test('RFC 8058 one-click POST uses the query token and returns 204', async () => {
  let relayedToken = '';
  const response = await handleCampaignUnsubscribeRequest(
    request({ body: 'List-Unsubscribe=One-Click', method: 'POST' }),
    {
      apiBase: API_BASE,
      fetchImpl: async (_url, options) => {
        relayedToken = JSON.parse(options.body).token;
        return Response.json({ message: 'ok' });
      },
      leadId: LEAD_ID,
    },
  );

  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');
  assert.equal(relayedToken, TOKEN);
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
});

test('invalid upstream tokens get a branded 400 and are not exposed', async () => {
  const response = await handleCampaignUnsubscribeRequest(
    request({ body: new URLSearchParams({ token: TOKEN }).toString(), method: 'POST', token: null }),
    {
      apiBase: API_BASE,
      fetchImpl: async () => Response.json({ error: 'internal platform message' }, { status: 400 }),
      leadId: LEAD_ID,
    },
  );

  assert.equal(response.status, 400);
  const html = await assertPrivateBrandedPage(response);
  assert.match(html, /Abmeldung nicht möglich/);
  assert.doesNotMatch(html, /internal platform message/);
});

test('configuration, upstream, and timeout failures return a retryable branded 503', async () => {
  const cases = [
    {
      apiBase: '',
      fetchImpl: async () => {
        throw new Error('must not be called');
      },
    },
    {
      apiBase: API_BASE,
      fetchImpl: async () => Response.json({ error: 'down' }, { status: 500 }),
    },
    {
      apiBase: API_BASE,
      fetchImpl: async () => {
        throw new DOMException('timed out', 'AbortError');
      },
    },
  ];

  for (const testCase of cases) {
    const response = await handleCampaignUnsubscribeRequest(
      request({ body: new URLSearchParams({ token: TOKEN }).toString(), method: 'POST', token: null }),
      { ...testCase, leadId: LEAD_ID },
    );

    assert.equal(response.status, 503);
    assert.equal(response.headers.get('retry-after'), '60');
    const html = await assertPrivateBrandedPage(response);
    assert.match(html, /Bitte versuchen Sie es später noch einmal/);
  }
});

test('oversized bodies and unsupported methods are rejected before relay', async () => {
  const oversized = await handleCampaignUnsubscribeRequest(
    request({ body: `token=${'a'.repeat(9 * 1024)}`, method: 'POST', token: null }),
    { apiBase: API_BASE, leadId: LEAD_ID },
  );
  assert.equal(oversized.status, 413);

  const unsupported = await handleCampaignUnsubscribeRequest(
    new Request(PAGE_URL, { method: 'PUT' }),
    { apiBase: API_BASE, leadId: LEAD_ID },
  );
  assert.equal(unsupported.status, 405);
  assert.equal(unsupported.headers.get('allow'), 'GET, POST');
});

test('service worker bypasses branded unsubscribe navigation', async () => {
  const serviceWorker = await readFile(
    new URL('../../../client/public/sw.js', import.meta.url),
    'utf8',
  );

  assert.match(serviceWorker, /requestUrl\.pathname\.startsWith\('\/abmelden\/'\)/);
});
