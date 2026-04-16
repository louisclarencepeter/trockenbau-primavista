import { Suspense, lazy, useEffect, useState } from 'react';
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
import Footer from './components/Footer/Footer';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY } from './utils/theme';

const LegalPage = lazy(() => import('./components/Legal/LegalPage'));
const CalculatorPage = lazy(() => import('./components/Calculator/Calculator'));
const Reviews = lazy(() => import('./components/Reviews/Reviews'));
const Chatbot = lazy(() => import('./components/Chatbot/Chatbot'));
const CookieBanner = lazy(() => import('./components/CookieBanner/CookieBanner'));

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
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? 'system');
  const [systemTheme, setSystemTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const [showDeferredSections, setShowDeferredSections] = useState(() => !isHomePage);
  const [showDeferredUi, setShowDeferredUi] = useState(() => !isHomePage);
  const theme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const titleByPath = {
      '/': 'Trockenbau Prima Vista | Decken, Wände, Boden und Dachschrägen',
      '/kalkulator': 'Trockenbau Kalkulator | Prima Vista B&G GmbH',
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

    if (!isHomePage || (showDeferredSections && showDeferredUi)) {
      return undefined;
    }

    let timeoutId;
    let idleId;

    const revealDeferredContent = () => {
      setShowDeferredSections(true);
      setShowDeferredUi(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(revealDeferredContent, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(revealDeferredContent, 1200);
    }

    return () => {
      if (typeof idleId === 'number' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isHomePage, showDeferredSections, showDeferredUi]);

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
      <Footer
        isHomePage={isHomePage}
        themePreference={themePreference}
        resolvedTheme={theme}
        onThemeChange={setThemePreference}
      />
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
