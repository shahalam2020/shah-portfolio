import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site.js';

/**
 * Injects values from src/config/site.js into index.html (title, meta, OG, JSON-LD)
 * so there is ONE place to change your identity. Tokens look like __SITE_NAME__.
 */
const injectSiteMeta = () => ({
  name: 'inject-site-meta',
  transformIndexHtml(html) {
    const map = {
      SITE_NAME: site.name,
      SITE_ROLE: site.role,
      SITE_URL: site.url.replace(/\/$/, ''),
      SITE_TITLE: site.seo.title,
      SITE_DESCRIPTION: site.seo.description,
      SITE_OG_URL: site.url.replace(/\/$/, '') + site.ogImage,
      SITE_GITHUB: site.socials.github,
      SITE_LINKEDIN: site.socials.linkedin,
      SITE_TWITTER: site.seo.twitterHandle,
    };
    return html.replace(/__([A-Z_]+)__/g, (m, key) => (key in map ? map[key] : m));
  },
});

export default defineConfig({
  plugins: [react(), injectSiteMeta()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          three: ['three', '@react-three/fiber'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
        },
      },
    },
  },
});
