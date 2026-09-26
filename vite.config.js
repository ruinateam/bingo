import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// The site is published to GitHub Pages on the custom domain bingo.ruina.team,
// so it is served from the domain root and assets resolve from "/".
// BASE_URL is supplied by actions/configure-pages: it is empty for a custom
// domain and holds the repository subpath for project pages without one.
const base = process.env.BASE_URL || '/';

export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    port: 5173
  }
});
