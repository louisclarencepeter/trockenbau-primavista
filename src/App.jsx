import { Suspense, lazy, startTransition, useEffect, useState } from 'react';
import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import CalculatorTeaser from './components/CalculatorTeaser/CalculatorTeaser';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY } from './utils/theme';

const LegalPage = lazy(() => import('./components/Legal/LegalPage'));
const CalculatorPage = lazy(() => import('./components/Calculator/Calculator'));
const AnfragePage = lazy(() => import('./components/Anfrage/Anfrage'));
const Reviews = lazy(() => import('./components/Reviews/Reviews'));
const Chatbot = lazy(() => import('./components/Chatbot/Chatbot'));
const CookieBanner = lazy(() => import('./components/CookieBanner/CookieBanner'));
const Footer = lazy(() => import('./components/Footer/Footer'));

const getCurrentPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const normalizedPath = window.location.pathname.replace(/\/+$/, '');
  return normalizedPath || '/';
};

function App({ initialTheme = 'light' }) {
  const currentPath = getCurrentPath();
  const isHomePage = currentPath === '/';
  const isImpressumPage = currentPath === '/impressum';
  const isPrivacyPage = currentPath === '/datenschutz';
  const isCalculatorPage = currentPath === '/kalkulator';
  const isAnfragePage = currentPath === '/anfrage';
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? 'system');
  const [systemTheme, setSystemTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const [showDeferredSections, setShowDeferredSections] = useState(() => !isHomePage);
  const [showDeferredUi, setShowDeferredUi] = useState(() => !isHomePage);
  const [showFooter, setShowFooter] = useState(() => !isHomePage);
  const theme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const titleByPath = {
      '/': 'Trockenbau Prima Vista | Decken, Wände, Boden und Dachschrägen',
      '/kalkulator': 'Trockenbau Kalkulator | Prima Vista B&G GmbH',
      '/anfrage': 'Anfrage stellen | Prima Vista B&G GmbH',
      '/impressum': 'Impressum | Prima Vista B&G GmbH',
      '/datenschutz': 'Datenschutzerklärung | Prima Vista B&G GmbH',
    };

    document.title = titleByPath[currentPath] ?? titleByPath['/'];
  }, [currentPath]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (themePreference === 'system') {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
      }
    } catch {
      // Ignore unavailable storage.
    }
  }, [themePreference]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (!isHomePage) {
      startTransition(() => {
        setShowDeferredSections(true);
        setShowDeferredUi(true);
        setShowFooter(true);
      });

      return undefined;
    }

    if (window.location.hash && window.location.hash !== '#top') {
      startTransition(() => {
        setShowDeferredUi(true);
        setShowFooter(true);
      });

      return undefined;
    }

    if (showDeferredUi && showFooter) {
      return undefined;
    }

    let timeoutId;
    let idleId;
    let hasRevealedSupplementalUi = false;

    const revealSupplementalUi = () => {
      if (hasRevealedSupplementalUi) {
        return;
      }

      hasRevealedSupplementalUi = true;
      startTransition(() => {
        setShowDeferredUi(true);
        setShowFooter(true);
      });
    };

    const supplementalUiEvents = ['pointerdown', 'keydown', 'touchstart', 'wheel'];

    supplementalUiEvents.forEach((eventName) => {
      window.addEventListener(eventName, revealSupplementalUi, {
        passive: true,
        once: true,
      });
    });

    window.addEventListener('scroll', revealSupplementalUi, {
      passive: true,
      once: true,
    });

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealSupplementalUi, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(revealSupplementalUi, 4000);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      supplementalUiEvents.forEach((eventName) => {
        window.removeEventListener(eventName, revealSupplementalUi);
      });
      window.removeEventListener('scroll', revealSupplementalUi);
    };
  }, [isHomePage, showDeferredUi, showFooter]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHomePage || showDeferredSections) {
      return undefined;
    }

    let timeoutId;
    let idleId;
    let hasRevealedDeferredSection = false;

    const revealDeferredSection = () => {
      if (hasRevealedDeferredSection) {
        return;
      }

      hasRevealedDeferredSection = true;
      startTransition(() => {
        setShowDeferredSections(true);
      });
    };

    const maybeRevealDeferredSection = () => {
      const revealThreshold = Math.max(window.innerHeight * 1.75, 1800);
      const scrollProgress = window.scrollY + window.innerHeight;

      if (scrollProgress >= revealThreshold) {
        revealDeferredSection();
      }
    };

    maybeRevealDeferredSection();
    window.addEventListener('scroll', maybeRevealDeferredSection, { passive: true });
    window.addEventListener('resize', maybeRevealDeferredSection);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealDeferredSection, { timeout: 6500 });
    } else {
      timeoutId = window.setTimeout(revealDeferredSection, 6500);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('scroll', maybeRevealDeferredSection);
      window.removeEventListener('resize', maybeRevealDeferredSection);
    };
  }, [isHomePage, showDeferredSections]);

  return (
    <>
      <Navbar isHomePage={isHomePage} currentPath={currentPath} />
      <main id="main-content">
        {isImpressumPage ? (
          <Suspense fallback={null}>
            <LegalPage page="impressum" />
          </Suspense>
        ) : isPrivacyPage ? (
          <Suspense fallback={null}>
            <LegalPage page="datenschutz" />
          </Suspense>
        ) : isCalculatorPage ? (
          <Suspense fallback={null}>
            <CalculatorPage />
          </Suspense>
        ) : isAnfragePage ? (
          <Suspense fallback={null}>
            <AnfragePage />
          </Suspense>
        ) : (
          <>
            <Hero />
            <Services />
            <CalculatorTeaser />
            <About />
            <Projects />
            {showDeferredSections ? (
              <Suspense fallback={null}>
                <Reviews />
              </Suspense>
            ) : null}
            <Contact />
          </>
        )}
      </main>
      {showFooter ? (
        <Suspense fallback={null}>
          <Footer
            isHomePage={isHomePage}
            themePreference={themePreference}
            resolvedTheme={theme}
            onThemeChange={setThemePreference}
          />
        </Suspense>
      ) : null}
      {showDeferredUi ? (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      ) : null}
      {showDeferredUi ? (
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      ) : null}
    </>
  );
}

export default App;
