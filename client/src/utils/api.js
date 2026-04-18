const normalizedApiBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const getApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedApiBase ? `${normalizedApiBase}${normalizedPath}` : normalizedPath;
};
