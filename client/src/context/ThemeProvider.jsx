import { useEffect, useMemo, useState } from 'react';
import ThemeContext from './ThemeContext';
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveLocationTheme,
  THEME_STORAGE_KEY,
} from '../utils/theme';

function ThemeProvider({ children, initialTheme = 'light' }) {
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? null);
  const [automaticTheme, setAutomaticTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const resolvedTheme = themePreference ?? automaticTheme;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      const systemTheme = getSystemTheme();

      if (systemTheme) {
        setAutomaticTheme(systemTheme);
      }
    };

    darkQuery.addEventListener('change', handleChange);
    lightQuery.addEventListener('change', handleChange);

    return () => {
      darkQuery.removeEventListener('change', handleChange);
      lightQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (themePreference) {
      return undefined;
    }

    return resolveLocationTheme({
      onResolve: setAutomaticTheme,
    });
  }, [themePreference]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (themePreference) {
        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch {
      // Ignore unavailable storage.
    }
  }, [themePreference]);

  const value = useMemo(() => ({
    themePreference,
    resolvedTheme,
    setThemePreference,
  }), [resolvedTheme, themePreference]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
