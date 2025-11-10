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
      },
      // ✅ P1 OPTIMISATION: Code-splitting pour réduire le bundle initial
      output: {
        manualChunks: (id) => {
          // Admin bundle (chargé uniquement sur admin.html)
          if (id.includes('admin-dashboard.js') || 
              id.includes('admin-users.js') || 
              id.includes('admin-questions.js') ||
              id.includes('admin-auth-guard.js')) {
            return 'admin';
          }
          
          // Quiz bundle (chargé uniquement lors du démarrage d'un quiz)
          if (id.includes('quiz.js') || 
              id.includes('confetti.js') ||
              id.includes('quiz-scoring.js')) {
            return 'quiz';
          }
          
          // Results bundle (chargé uniquement sur results.html)
          if (id.includes('results.js')) {
            return 'results';
          }
          
          // Resources bundle (chargé uniquement sur resources.html)
          if (id.includes('resources.js')) {
            return 'resources';
          }
          
          // Vendor bundle (Firebase, Chart.js, etc.)
          if (id.includes('node_modules')) {
            // Séparer Firebase des autres dépendances
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'vendor-firebase';
            }
            // Autres dépendances vendor
            return 'vendor';
          }
          
          // Services partagés
          if (id.includes('services/') || 
              id.includes('firestore-service.js') ||
              id.includes('state-manager.js') ||
              id.includes('client-manager.js')) {
            return 'services';
          }
        }
      }
    }
  }
});
