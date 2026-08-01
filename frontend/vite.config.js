import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* The API and uploaded images are proxied to the Express server in dev, so the
   browser sees a single origin and the httpOnly session cookie just works. */
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api':     { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
  /* `vite preview` serves the production bundle and does not inherit
     server.proxy, so it needs its own copy or the built app has no API. */
  preview: {
    proxy: {
      '/api':     { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
