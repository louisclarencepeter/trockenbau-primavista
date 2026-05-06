export const THEME_STORAGE_KEY = 'primavista-theme';
export const LIGHT_THEME_COLOR = '#f7f4ed';
export const DARK_THEME_COLOR = '#0d1218';

const isTheme = (theme) => theme === 'light' || theme === 'dark';

export const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(storedTheme)
      ? storedTheme
      : null;
  } catch {
    return null;
  }
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return null;
};

export const getLocalTimeTheme = (date = new Date()) => {
  const hour = date.getHours();

  return hour < 7 || hour >= 19 ? 'dark' : 'light';
};

export const resolveAutomaticTheme = () => (
  getSystemTheme() ?? getLocalTimeTheme()
);

export const getInitialTheme = () => getStoredTheme() ?? resolveAutomaticTheme();

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
