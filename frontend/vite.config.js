import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* The API and uploaded images are proxied to the Express server in dev, so the
   browser sees a single origin and the httpOnly session cookie just works. */
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:5000';

const proxy = {
  '/api':     { target: API_TARGET, changeOrigin: true },
  '/uploads': { target: API_TARGET, changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy,
    warmup: {
      /* Pre-transform the modules on the first-paint path so the initial dev
         page load is not a waterfall of on-demand compiles. */
      clientFiles: ['./src/main.jsx', './src/App.jsx', './src/pages/HomePage.jsx'],
    },
  },
  /* `vite preview` serves the production bundle and does not inherit
     server.proxy, so it needs its own copy or the built app has no API. */
  preview: { proxy },

  build: {
    outDir: 'dist',
    sourcemap: false,
    /* Every browser this site targets understands ES2020, so emitting older
       syntax only inflates the bundle. */
    target: 'es2020',
    cssMinify: 'esbuild',
    /* Assets under this size are inlined as data URIs, saving a request each. */
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /* Dependencies change far less often than the site's own code, so
           splitting them out means a content edit does not invalidate the
           largest cached chunk. Matched on the resolved path rather than the
           bare package name: "react-dom/client" and the router's own copy of
           react would otherwise miss a name-based rule and get hoisted into
           whichever chunk imported them first. */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
          if (/[\\/]node_modules[\\/]react-router/.test(id)) return 'router-vendor';
          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return 'icons-vendor';
          return 'vendor';
        },
        /* Content-hashed names, grouped by type, so a CDN can cache them
           immutably. */
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
