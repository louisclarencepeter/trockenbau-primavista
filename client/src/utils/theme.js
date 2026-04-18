export const THEME_STORAGE_KEY = 'primavista-theme';
export const LIGHT_THEME_COLOR = '#f7f4ed';
export const DARK_THEME_COLOR = '#0d1218';

export const resolveThemePreference = (themePreference) => (
  themePreference === 'system' ? getSystemTheme() : themePreference === 'dark' ? 'dark' : 'light'
);

export const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
      ? storedTheme
      : null;
  } catch {
    return null;
  }
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getInitialTheme = () => resolveThemePreference(getStoredTheme() ?? 'system');

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      'content',
      resolvedTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
    );
  }
};
