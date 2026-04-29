const GA_MEASUREMENT_ID = 'G-3RYZDCMPBX';
const GTAG_SCRIPT_ID = 'prima-vista-gtag';

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
