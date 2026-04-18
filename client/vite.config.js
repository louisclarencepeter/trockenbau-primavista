import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envDir: '..',
  plugins: [react()],
  server: {
    host: true,
    open: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
