import { defineConfig } from 'vite';
import { resolve } from 'path';

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
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        results: resolve(__dirname, 'results.html'),
        resources: resolve(__dirname, 'resources.html')
      }
    }
  }
});
