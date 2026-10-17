import {defineConfig} from 'vite';

// SITE_BASE lets the same source build for local preview ("/") and for a
// GitHub Pages project site ("/Birthday1/").
export default defineConfig({
  base: process.env.SITE_BASE || '/',
  build: {
    // Keep prior build assets; do not recursively clear the output directory.
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/remotion|mediabunny/.test(id)) return 'film-engine';
          if (/react|scheduler/.test(id)) return 'react';
        },
      },
    },
  },
});
