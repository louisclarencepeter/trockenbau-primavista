// Google tags (Ads AW-726250173 + Analytics G-3RYZDCMPBX) and Consent Mode v2
// defaults live in index.html. This module only flips consent on/off in response
// to the visitor's cookie-banner choice.

export const COOKIE_CONSENT_STORAGE_KEY = 'cookie-consent';
export const COOKIE_CONSENT_ACCEPTED = 'accepted';
export const COOKIE_CONSENT_DECLINED = 'declined';

// Consent categories the cookie banner toggles together (analytics + ads).
const CONSENT_KEYS = [
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
  'analytics_storage',
];

let runtimeConsent = null;

export const getCookieConsent = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setCookieConsent = (value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore unavailable storage.
  }
};

const updateConsent = (granted) => {
  runtimeConsent = granted;

  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const value = granted ? 'granted' : 'denied';
  window.gtag(
    'consent',
    'update',
    Object.fromEntries(CONSENT_KEYS.map((key) => [key, value])),
  );
};

export const grantConsent = () => updateConsent(true);

export const denyConsent = () => updateConsent(false);

// On boot, mirror a previously stored choice. Consent Mode defaults to "denied"
// in index.html, so we only need to upgrade when the visitor already accepted.
export const applyStoredConsent = () => {
  if (getCookieConsent() === COOKIE_CONSENT_ACCEPTED) {
    grantConsent();
  }
};

// Preserve the existing direct Ads destination and Consent Mode behavior for
// contact/anfrage forms. New GA4 events below require explicit analytics consent.
const LEAD_CONVERSION_SEND_TO = 'AW-726250173/n7KtCO2MlcYcEL3lptoC';
const GA4_MEASUREMENT_ID = 'G-3RYZDCMPBX';
const ENQUIRY_FORMS = new Set(['contact', 'anfrage', 'calculator']);
const LEGACY_ADS_FORMS = new Set(['contact', 'anfrage']);
const CONTACT_METHODS = new Set(['phone', 'whatsapp']);
const recordedGa4Leads = new Set();
const recordedAdsLeads = new Set();

const sendEvent = (eventName, parameters) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  try {
    window.gtag('event', eventName, parameters);
    return true;
  } catch {
    // Analytics must never turn a successfully delivered enquiry into an error.
    return false;
  }
};

export const trackLeadConversion = () => {
  return sendEvent('conversion', { send_to: LEAD_CONVERSION_SEND_TO });
};

const hasAnalyticsConsent = () => (
  runtimeConsent !== false && getCookieConsent() === COOKIE_CONSENT_ACCEPTED
);

const getAnalyticsPage = () => {
  try {
    const location = new URL(window.location.href);
    return `${location.origin}${location.pathname}`;
  } catch {
    return 'https://trockenbau-primavista.ch/';
  }
};

const sendGa4Event = (eventName, parameters) => {
  if (!hasAnalyticsConsent()) {
    return false;
  }

  return sendEvent(eventName, {
    send_to: GA4_MEASUREMENT_ID,
    ...parameters,
    page_location: getAnalyticsPage(),
    page_referrer: '',
  });
};

export const isAcceptedEnquiry = ({ httpStatus, formName, result }) => (
  httpStatus === 200
  && ENQUIRY_FORMS.has(formName)
  && result?.status === 'accepted'
  && result.formName === formName
  && result.spam === false
  && result.emails?.internalNotification?.status === 'sent'
);

// Keys stay in memory only: no submission IDs, form values, or contact details
// are sent to either destination. Denied GA4 events are not queued for replay.
export const trackAcceptedEnquiry = ({ httpStatus, formName, result, trackingKey }) => {
  if (!isAcceptedEnquiry({ httpStatus, formName, result })) {
    return;
  }

  const key = trackingKey || result.submissionId;
  if (!key || typeof key !== 'string') {
    return;
  }

  const eventKey = `${formName}:${key}`;
  if (!recordedGa4Leads.has(eventKey)) {
    recordedGa4Leads.add(eventKey);
    sendGa4Event('generate_lead', { form_name: formName });
  }

  if (LEGACY_ADS_FORMS.has(formName) && !recordedAdsLeads.has(eventKey)) {
    recordedAdsLeads.add(eventKey);
    trackLeadConversion();
  }
};

export const trackContactClick = (contactMethod) => {
  if (CONTACT_METHODS.has(contactMethod)) {
    sendGa4Event('contact_click', { contact_method: contactMethod });
  }
};

export const registerContactClickTracking = (target = document) => {
  const handleClick = (event) => {
    if (event.defaultPrevented || (typeof event.button === 'number' && event.button !== 0)) {
      return;
    }

    const element = event.target?.closest ? event.target : event.target?.parentElement;
    const href = element?.closest?.('a[href]')?.getAttribute('href');
    if (typeof href !== 'string') {
      return;
    }

    if (href.toLowerCase().startsWith('tel:')) {
      trackContactClick('phone');
      return;
    }

    try {
      const url = new URL(href);
      if (url.protocol === 'https:' && url.hostname === 'wa.me') {
        trackContactClick('whatsapp');
      }
    } catch {
      // Other navigation links are not contact interactions.
    }
  };

  target.addEventListener('click', handleClick);
  return () => target.removeEventListener('click', handleClick);
};
