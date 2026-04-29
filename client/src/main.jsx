import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import { initializeAnalytics } from './utils/analytics';
import { applyTheme, getInitialTheme } from './utils/theme';

const initialTheme = getInitialTheme();

applyTheme(initialTheme);
initializeAnalytics();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App initialTheme={initialTheme} />
    </ErrorBoundary>
  </React.StrictMode>,
);
