import { useEffect, useState } from 'react';
import './CookieBanner.scss';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');

    if (cookieConsent) {
      setHasChoice(true);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasChoice(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setHasChoice(true);
    setIsVisible(false);
  };

  return (
    <>
      {hasChoice && !isVisible ? (
        <button
          type="button"
          className="cookie-banner__trigger"
          onClick={() => setIsVisible(true)}
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

      {isVisible ? (
        <div className="cookie-banner">
          <div className="cookie-banner__content">
            <div className="cookie-banner__text-wrap">
              <span className="cookie-banner__eyebrow">Cookies</span>
              <h3 className="cookie-banner__title">Wir verwenden Cookies</h3>
              <p className="cookie-banner__text">
                Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern
                und grundlegende Funktionen bereitzustellen. Sie können der Verwendung
                zustimmen oder ablehnen.
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
      ) : null}
    </>
  );
}

export default CookieBanner;
