import { useEffect, useState } from 'react';
import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import CalculatorTeaser from './components/CalculatorTeaser/CalculatorTeaser';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Reviews from './components/Reviews/Reviews';
import Contact from './components/Contact/Contact';
import LegalPage from './components/Legal/LegalPage';
import CalculatorPage from './components/Calculator/Calculator';
import Chatbot from './components/Chatbot/Chatbot';
import CookieBanner from './components/CookieBanner/CookieBanner';
import Footer from './components/Footer/Footer';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY } from './utils/theme';

const getCurrentPath = () => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const normalizedPath = window.location.pathname.replace(/\/+$/, '');
  return normalizedPath || '/';
};

function App({ initialTheme = 'light' }) {
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? 'system');
  const [systemTheme, setSystemTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const currentPath = getCurrentPath();
  const theme = themePreference === 'system' ? systemTheme : themePreference;
  const isHomePage = currentPath === '/';
  const isImpressumPage = currentPath === '/impressum';
  const isPrivacyPage = currentPath === '/datenschutz';
  const isCalculatorPage = currentPath === '/kalkulator';

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const titleByPath = {
      '/': 'Trockenbau Prima Vista | Trockenbau, Sanierung, Fenster und Innenausbau',
      '/kalkulator': 'Kalkulator | Prima Vista B&G GmbH',
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

  return (
    <>
      <Navbar isHomePage={isHomePage} currentPath={currentPath} />
      <main id="main-content">
        {isImpressumPage ? (
          <LegalPage page="impressum" />
        ) : isPrivacyPage ? (
          <LegalPage page="datenschutz" />
        ) : isCalculatorPage ? (
          <CalculatorPage />
        ) : (
          <>
            <Hero />
            <Services />
            <CalculatorTeaser />
            <About />
            <Projects />
            <Reviews />
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
      <Chatbot />
      <CookieBanner />
    </>
  );
}

export default App;
