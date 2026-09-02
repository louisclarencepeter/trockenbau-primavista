import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_DECLINED,
  denyConsent,
  grantConsent,
  isAcceptedEnquiry,
  registerContactClickTracking,
  setCookieConsent,
  trackAcceptedEnquiry,
  trackContactClick,
} from '../src/utils/analytics.js';
import { submitProjectForm } from '../src/utils/formSubmission.js';

const originalWindow = globalThis.window;
const originalFormData = globalThis.FormData;
let calls;
let sequence = 0;

class TestFormData {
  constructor(form) {
    this.fields = new Map(Object.entries(form.fields));
  }

  get(name) { return this.fields.get(name) ?? null; }
  set(name, value) { this.fields.set(name, value); }
  forEach(callback) { this.fields.forEach(callback); }
}

beforeEach(() => {
  calls = [];
  const storage = new Map();
  globalThis.window = {
    gtag: (...args) => calls.push(args),
    location: { href: 'https://trockenbau-primavista.ch/anfrage?email=private@example.com#private' },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  globalThis.FormData = TestFormData;
  denyConsent();
});

afterEach(() => {
  if (originalWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }
  globalThis.FormData = originalFormData;
});

const events = () => calls.filter(([command]) => command === 'event');
const ga4Events = () => events().filter(([, , parameters]) => parameters.send_to === 'G-3RYZDCMPBX');
const adsEvents = () => events().filter(([, name]) => name === 'conversion');
const acceptConsent = () => {
  setCookieConsent(COOKIE_CONSENT_ACCEPTED);
  grantConsent();
};
const accepted = (formName = 'contact') => ({
  httpStatus: 200,
  formName,
  result: {
    status: 'accepted',
    formName,
    spam: false,
    emails: { internalNotification: { status: 'sent' } },
    submissionId: `test-submission-${sequence += 1}`,
  },
});
const form = () => ({
  fields: {
    name: ' Private Person ',
    email: 'private@example.com',
    message: 'Private project notes',
    'bot-field': '',
    confirmation_request_id: '',
  },
});
const successfulResponse = (request) => {
  const payload = JSON.parse(request.body);
  const enquiry = accepted(payload.formName);
  enquiry.result.submissionId = payload.submission.confirmation_request_id;
  return new Response(JSON.stringify(enquiry.result), { status: 200 });
};

test('new events require explicit consent, while valid legacy Ads behavior is preserved', () => {
  for (const formName of ['contact', 'anfrage', 'calculator']) {
    trackAcceptedEnquiry(accepted(formName));
  }
  trackContactClick('phone');
  trackContactClick('whatsapp');

  assert.deepEqual(ga4Events(), []);
  assert.deepEqual(adsEvents(), [
    ['event', 'conversion', { send_to: 'AW-726250173/n7KtCO2MlcYcEL3lptoC' }],
    ['event', 'conversion', { send_to: 'AW-726250173/n7KtCO2MlcYcEL3lptoC' }],
  ]);
});

test('all three accepted forms send fixed, GA4-only lead parameters with no PII or query strings', () => {
  acceptConsent();
  for (const formName of ['contact', 'anfrage', 'calculator']) {
    const enquiry = accepted(formName);
    enquiry.result.email = 'private@example.com';
    enquiry.result.message = 'Private project notes';
    trackAcceptedEnquiry(enquiry);
  }

  assert.deepEqual(ga4Events(), ['contact', 'anfrage', 'calculator'].map((formName) => [
    'event', 'generate_lead', {
      send_to: 'G-3RYZDCMPBX',
      form_name: formName,
      page_location: 'https://trockenbau-primavista.ch/anfrage',
      page_referrer: '',
    },
  ]));
  assert.equal(adsEvents().length, 2);
  assert.doesNotMatch(JSON.stringify(events()), /private|submission|@|\?|#/i);
});

test('revoking consent immediately stops new events, including with stale accepted storage', () => {
  acceptConsent();
  trackContactClick('phone');
  denyConsent();
  trackAcceptedEnquiry(accepted('calculator'));
  trackContactClick('whatsapp');
  assert.equal(ga4Events().length, 1);

  grantConsent();
  setCookieConsent(COOKIE_CONSENT_DECLINED);
  trackContactClick('phone');
  assert.equal(ga4Events().length, 1);
});

test('blocked consent storage fails closed for new events', () => {
  acceptConsent();
  window.localStorage.getItem = () => { throw new Error('Storage blocked'); };
  trackAcceptedEnquiry(accepted('calculator'));
  trackContactClick('phone');
  assert.deepEqual(ga4Events(), []);
});

test('denied leads are dropped, not replayed after consent is accepted', () => {
  const enquiry = accepted('contact');
  trackAcceptedEnquiry(enquiry);
  acceptConsent();
  trackAcceptedEnquiry(enquiry);
  assert.deepEqual(ga4Events(), []);
  assert.equal(adsEvents().length, 1);
  trackAcceptedEnquiry(accepted('contact'));
  assert.equal(ga4Events().length, 1);
});

test('spam, failures and incomplete or mismatched backend results never count', () => {
  acceptConsent();
  const base = accepted();
  const invalid = [
    { ...base, httpStatus: 202 },
    { ...base, httpStatus: 400 },
    { ...base, httpStatus: 500 },
    { ...base, result: { ...base.result, spam: true } },
    { ...base, result: { ...base.result, spam: undefined } },
    { ...base, result: { ...base.result, status: 'pending' } },
    { ...base, result: { ...base.result, formName: 'calculator' } },
    { ...base, result: { ...base.result, emails: { internalNotification: { status: 'failed' } } } },
    { ...base, result: { ...base.result, emails: null } },
    { ...base, result: null },
    { ...base, formName: 'private@example.com' },
  ];
  for (const enquiry of invalid) {
    assert.equal(isAcceptedEnquiry(enquiry), false);
    trackAcceptedEnquiry(enquiry);
  }
  assert.deepEqual(events(), []);
});

test('the same successful submission is counted once per destination', () => {
  acceptConsent();
  const enquiry = accepted();
  trackAcceptedEnquiry(enquiry);
  trackAcceptedEnquiry(enquiry);
  assert.equal(ga4Events().length, 1);
  assert.equal(adsEvents().length, 1);
});

test('contact clicks are separate GA4 events, never leads or legacy Ads conversions', () => {
  acceptConsent();
  trackContactClick('phone');
  trackContactClick('whatsapp');
  trackContactClick('private@example.com');
  assert.deepEqual(ga4Events(), ['phone', 'whatsapp'].map((method) => [
    'event', 'contact_click', {
      send_to: 'G-3RYZDCMPBX',
      contact_method: method,
      page_location: 'https://trockenbau-primavista.ch/anfrage',
      page_referrer: '',
    },
  ]));
  assert.deepEqual(adsEvents(), []);
});

test('delegated contact tracking handles nested links and cleans up without changing navigation', () => {
  acceptConsent();
  const listeners = new Set();
  const target = {
    addEventListener: (name, callback) => { assert.equal(name, 'click'); listeners.add(callback); },
    removeEventListener: (name, callback) => { assert.equal(name, 'click'); listeners.delete(callback); },
  };
  const click = (href, extra = {}) => {
    const element = { closest: () => ({ getAttribute: () => href }) };
    for (const listener of listeners) {
      listener({ target: { parentElement: element }, button: 0, defaultPrevented: false, ...extra });
    }
  };
  const cleanup = registerContactClickTracking(target);
  click('tel:+41782659332');
  click('https://wa.me/491793596697?text=private%20message');
  for (const href of ['/anfrage', 'mailto:private@example.com', 'https://wa.me.evil.example/123', 'http://wa.me/123']) {
    click(href);
  }
  click('tel:+41782659332', { defaultPrevented: true });
  click('tel:+41782659332', { button: 1 });
  assert.deepEqual(ga4Events().map(([, , parameters]) => parameters.contact_method), ['phone', 'whatsapp']);
  assert.doesNotMatch(JSON.stringify(events()), /41782659332|491793596697|private|wa\.me/);
  cleanup();
  assert.equal(listeners.size, 0);
  const secondCleanup = registerContactClickTracking(target);
  assert.equal(listeners.size, 1);
  secondCleanup();
});

test('forms wait for backend acceptance and preserve their return data and outgoing request', async (t) => {
  acceptConsent();
  let finishRequest;
  let sentRequest;
  t.mock.method(globalThis, 'fetch', async (url, request) => {
    assert.equal(url, '/api/forms/submit');
    sentRequest = request;
    return new Promise((resolve) => { finishRequest = resolve; });
  });
  const pending = submitProjectForm({ form: form(), formName: 'contact' });
  assert.deepEqual(events(), []);
  finishRequest(successfulResponse(sentRequest));
  const result = await pending;
  assert.equal(result.name, 'Private Person');
  assert.equal(result.email, 'private@example.com');
  assert.equal(JSON.parse(sentRequest.body).submission.message, 'Private project notes');
  assert.equal(ga4Events().length, 1);
  assert.equal(adsEvents().length, 1);
  assert.doesNotMatch(JSON.stringify(events()), /Private|private|submission|@/);
});

test('HTTP202 spam keeps the existing form response but does not produce any conversion', async (t) => {
  acceptConsent();
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
    status: 'accepted', formName: 'contact', spam: true, emails: null, submissionId: null,
  }), { status: 202 }));
  const result = await submitProjectForm({ form: form(), formName: 'contact' });
  assert.equal(result.email, 'private@example.com');
  assert.deepEqual(events(), []);
});

test('consent revoked while a form request is pending prevents the later GA4 lead event', async (t) => {
  acceptConsent();
  let finishRequest;
  let sentRequest;
  t.mock.method(globalThis, 'fetch', async (url, request) => {
    sentRequest = request;
    return new Promise((resolve) => { finishRequest = resolve; });
  });
  const pending = submitProjectForm({ form: form(), formName: 'calculator' });
  setCookieConsent(COOKIE_CONSENT_DECLINED);
  denyConsent();
  finishRequest(successfulResponse(sentRequest));
  await pending;
  assert.deepEqual(events(), []);
  acceptConsent();
  assert.deepEqual(events(), []);
});

test('HTTP and network failures keep rejecting and never produce events', async (t) => {
  acceptConsent();
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 503 }));
  await assert.rejects(submitProjectForm({ form: form(), formName: 'contact' }), /503/);
  fetchMock.mock.mockImplementation(async () => { throw new Error('Network unavailable'); });
  await assert.rejects(submitProjectForm({ form: form(), formName: 'contact' }), /Network unavailable/);
  assert.deepEqual(events(), []);
});

test('malformed successful responses and tracking errors do not change form success behavior', async (t) => {
  acceptConsent();
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response('not-json', { status: 200 }));
  await submitProjectForm({ form: form(), formName: 'contact' });
  assert.deepEqual(events(), []);
  fetchMock.mock.mockImplementation(async (url, request) => successfulResponse(request));
  window.gtag = () => { throw new Error('Tracking unavailable'); };
  await assert.doesNotReject(submitProjectForm({ form: form(), formName: 'contact' }));
});

test('identical successful retries on one form are deduplicated without reusing real request IDs', async (t) => {
  acceptConsent();
  const requestIds = [];
  t.mock.method(globalThis, 'fetch', async (url, request) => {
    requestIds.push(JSON.parse(request.body).submission.confirmation_request_id);
    return successfulResponse(request);
  });
  const currentForm = form();
  await submitProjectForm({ form: currentForm, formName: 'contact' });
  await submitProjectForm({ form: currentForm, formName: 'contact' });
  assert.notEqual(requestIds[0], requestIds[1]);
  assert.equal(ga4Events().length, 1);
  assert.equal(adsEvents().length, 1);
  currentForm.fields.message = 'A different genuine enquiry';
  await submitProjectForm({ form: currentForm, formName: 'contact' });
  assert.equal(ga4Events().length, 2);
});

test('calculator success is tracked in GA4 without adding a legacy Ads conversion', async (t) => {
  acceptConsent();
  t.mock.method(globalThis, 'fetch', async (url, request) => successfulResponse(request));
  await submitProjectForm({ form: form(), formName: 'calculator' });
  assert.equal(ga4Events().length, 1);
  assert.equal(ga4Events()[0][2].form_name, 'calculator');
  assert.deepEqual(adsEvents(), []);
});

test('all enquiry components use the shared confirmed-success path without duplicate conversion calls', async () => {
  for (const component of ['Contact/Contact', 'Anfrage/Anfrage', 'Calculator/Calculator']) {
    const source = await readFile(new URL(`../src/components/${component}.jsx`, import.meta.url), 'utf8');
    assert.match(source, /await submitProjectForm\(/);
    assert.doesNotMatch(source, /trackLeadConversion|gtag\(/);
  }
});
