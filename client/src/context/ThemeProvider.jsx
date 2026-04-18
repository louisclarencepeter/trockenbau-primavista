import { useEffect, useMemo, useState } from 'react';
import ThemeContext from './ThemeContext';
import { applyTheme, getStoredTheme, THEME_STORAGE_KEY } from '../utils/theme';

function ThemeProvider({ children, initialTheme = 'light' }) {
  const [themePreference, setThemePreference] = useState(() => getStoredTheme() ?? 'system');
  const [systemTheme, setSystemTheme] = useState(() => (
    initialTheme === 'dark' ? 'dark' : 'light'
  ));
  const resolvedTheme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

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
