import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A relative base lets the build run from any folder or sub-path (GitHub Pages, a CDN folder, a file share).
export default defineConfig({
  base: './',
  plugins: [react()],
});
