import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_DECLINED,
  getCookieConsent,
  initializeAnalytics,
  setCookieConsent,
} from '../../utils/analytics';
import './CookieBanner.scss';

function CookieBanner() {
  const [bannerState, setBannerState] = useState(() => {
    const cookieConsent = getCookieConsent();
    return {
      isVisible: !cookieConsent,
      hasChoice: !!cookieConsent,
      consent: cookieConsent,
    };
  });

  const isVisible = bannerState.isVisible;
  const hasChoice = bannerState.hasChoice;

  const handleAccept = () => {
    const previousConsent = bannerState.consent;
    setCookieConsent(COOKIE_CONSENT_ACCEPTED);
    setBannerState({ isVisible: false, hasChoice: true, consent: COOKIE_CONSENT_ACCEPTED });
    initializeAnalytics();

    if (previousConsent === COOKIE_CONSENT_DECLINED) {
      window.location.reload();
    }
  };

  const handleDecline = () => {
    const previousConsent = bannerState.consent;
    setCookieConsent(COOKIE_CONSENT_DECLINED);
    setBannerState({ isVisible: false, hasChoice: true, consent: COOKIE_CONSENT_DECLINED });

    if (previousConsent === COOKIE_CONSENT_ACCEPTED) {
      window.location.reload();
    }
  };

  return (
    <>
      {hasChoice && !isVisible ? (
        <button
          type="button"
          className="cookie-banner__trigger"
          onClick={() => setBannerState({ ...bannerState, isVisible: true })}
          aria-label="Cookie-Einstellungen öffnen"
        >
          <span className="cookie-banner__trigger-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path
                d="M12 3a9 9 0 1 0 9 9 1 1 0 0 1-1 1 4 4 0 0 1-4-4 4 4 0 0 0-4-4 4 4 0 0 1-4-4 1 1 0 0 1 1-1h3Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
              <circle cx="8" cy="14" r="1.1" fill="currentColor" />
              <circle cx="13.5" cy="16.5" r="1.1" fill="currentColor" />
              <circle cx="15.5" cy="10" r="1.1" fill="currentColor" />
            </svg>
          </span>
        </button>
      ) : null}

      <div className={`cookie-banner${isVisible ? ' cookie-banner--visible' : ''}`}>
        <div className="cookie-banner__content">
          <div className="cookie-banner__text-wrap">
            <span className="cookie-banner__eyebrow">Cookies</span>
            <h3 className="cookie-banner__title">Wir verwenden Cookies</h3>
            <p className="cookie-banner__text">
              Diese Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern
              und grundlegende Funktionen bereitzustellen. Sie können der Verwendung
              zustimmen oder ablehnen. Weitere Informationen finden Sie in unserer{' '}
              <Link to="/datenschutz" className="cookie-banner__link">
                Datenschutzerklärung
              </Link>.
            </p>
          </div>

          <div className="cookie-banner__actions">
            <button
              type="button"
              className="cookie-banner__button cookie-banner__button--secondary"
              onClick={handleDecline}
            >
              Ablehnen
            </button>
            <button
              type="button"
              className="cookie-banner__button cookie-banner__button--primary"
              onClick={handleAccept}
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CookieBanner;
