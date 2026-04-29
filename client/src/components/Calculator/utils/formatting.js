export const formatCurrency = (value) =>
  new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value) =>
  new Intl.NumberFormat('de-CH', {
    maximumFractionDigits: 2,
  }).format(value);

export const formatSquareMeters = (value) => `${formatNumber(value)} m²`;
