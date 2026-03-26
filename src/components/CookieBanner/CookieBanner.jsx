import { useEffect, useState } from 'react';
import './CookieBanner.scss';

function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');

    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
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
  );
}

export default CookieBanner;