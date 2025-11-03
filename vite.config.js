import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    // Use a fixed port for reliable E2E. strictPort avoids auto-fallbacks that break test baseURL.
    port: 3200,
    strictPort: true,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true
  }
});
