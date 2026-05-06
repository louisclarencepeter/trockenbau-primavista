const GA_MEASUREMENT_ID = 'G-3RYZDCMPBX';
const GTAG_SCRIPT_ID = 'prima-vista-gtag';

export const COOKIE_CONSENT_STORAGE_KEY = 'cookie-consent';
export const COOKIE_CONSENT_ACCEPTED = 'accepted';
export const COOKIE_CONSENT_DECLINED = 'declined';

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

export const initializeAnalytics = () => {
  if (typeof window === 'undefined' || document.getElementById(GTAG_SCRIPT_ID)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const script = document.createElement('script');

  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
};

export const initializeAnalyticsIfConsented = () => {
  if (getCookieConsent() === COOKIE_CONSENT_ACCEPTED) {
    initializeAnalytics();
  }
};
