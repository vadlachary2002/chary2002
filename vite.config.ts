import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const GITHUB_PAGES_BASE = '/chary2002/';

// https://vite.dev/config/
export default defineConfig({
  base: GITHUB_PAGES_BASE,
  plugins: [react()],
});
