// Configuration Lighthouse CI
module.exports = {
  ci: {
    collect: {
      // URLs à auditer (PRODUCTION BUILD)
      url: [
        'http://localhost:4173',
        'http://localhost:4173/quiz.html',
        'http://localhost:4173/results.html',
        'http://localhost:4173/resources.html',
        'http://localhost:4173/admin.html'
      ],
      // Nombre de runs par URL pour la moyenne
      numberOfRuns: 3,
      // Démarrer le serveur automatiquement
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
    },
    assert: {
      // Assertions sur les scores
      assertions: {
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.8}],
        'categories:pwa': ['warn', {minScore: 0.6}],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['warn', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['warn', {maxNumericValue: 0.1}],
        'total-blocking-time': ['warn', {maxNumericValue: 300}],
        
        // Autres métriques importantes
        'speed-index': ['warn', {maxNumericValue: 3000}],
        'interactive': ['warn', {maxNumericValue: 3500}],
      },
    },
    upload: {
      // Sauvegarder les rapports localement
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
};
