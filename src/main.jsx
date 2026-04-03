import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
