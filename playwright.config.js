import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour tests E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  testIgnore: ['**/auth.spec.js', '**/quiz-flow.spec.js'], // Désactivé: tests obsolètes (mode démo supprimé v2.0.2)
  // Nouveaux tests: auth-google.spec.js (sans authentification réelle)
  
  /* Timeout maximum par test */
  timeout: 30 * 1000,
  
  /* Expect timeout */
  expect: {
    timeout: 5000
  },
  
  /* Exécution des tests */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter */
  reporter: [
    ['html'],
    ['list']
  ],
  
  /* Configuration partagée pour tous les projets */
  use: {
    /* URL de base */
    baseURL: 'http://localhost:3200',
    
    /* Collecter les traces en cas d'échec */
    trace: 'on-first-retry',
    
    /* Screenshots en cas d'échec */
    screenshot: 'only-on-failure',
    
    /* Video en cas d'échec */
    video: 'retain-on-failure',
  },

  /* Projets de test pour différents navigateurs */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Décommenter pour tester sur d'autres navigateurs
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    /* Test sur mobile */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  /* Démarrer le serveur de dev avant les tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
