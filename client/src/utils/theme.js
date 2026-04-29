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

export const getLocationTimeTheme = ({ longitude }, date = new Date()) => {
  if (!Number.isFinite(longitude)) {
    return getLocalTimeTheme(date);
  }

  const utcHour = date.getUTCHours() + (date.getUTCMinutes() / 60);
  const solarHour = (utcHour + (longitude / 15) + 24) % 24;

  return solarHour < 7 || solarHour >= 19 ? 'dark' : 'light';
};

export const resolveAutomaticTheme = () => (
  getSystemTheme() ?? getLocalTimeTheme()
);

export const getInitialTheme = () => getStoredTheme() ?? resolveAutomaticTheme();

export const resolveLocationTheme = ({ onResolve } = {}) => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return undefined;
  }

  const systemTheme = getSystemTheme();

  if (systemTheme) {
    return undefined;
  }

  let isCancelled = false;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (isCancelled) return;
      onResolve?.(getLocationTimeTheme(position.coords));
    },
    () => {
      if (isCancelled) return;
      onResolve?.(getLocalTimeTheme());
    },
    {
      enableHighAccuracy: false,
      maximumAge: 60 * 60 * 1000,
      timeout: 2500,
    },
  );

  return () => {
    isCancelled = true;
  };
};

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
