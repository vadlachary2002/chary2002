import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const RELATIVE_ASSET_BASE = './';

// https://vite.dev/config/
export default defineConfig({
  base: RELATIVE_ASSET_BASE,
  plugins: [react()],
});
