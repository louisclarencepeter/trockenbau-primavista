import { useEffect, useState } from 'react';
import './styles/colors.scss';
import './styles/fonts.scss';
import './styles/layout.scss';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Chatbot from './components/Chatbot/Chatbot';
import CookieBanner from './components/CookieBanner/CookieBanner';
import Footer from './components/Footer/Footer';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY } from './utils/theme';

function App({ initialTheme = 'light' }) {
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? 'system');
  const [systemTheme, setSystemTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const theme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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

  const handleToggleTheme = () => {
    setThemePreference(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <main id="main-content">
        <Hero />
        <Services />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <CookieBanner />
    </>
  );
}

export default App;
