import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Environnement de test
    environment: 'jsdom',
    
    // Globals (describe, it, expect disponibles sans import)
    globals: true,
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.config.js',
        '**/firebase-config.js', // Config Firebase (secrets)
        '**/*.test.js',
        '**/*.spec.js'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80
    },
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Include/Exclude
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Timeout
    testTimeout: 10000,
    
    // Retry failed tests
    retry: 1,
    
    // Mock options
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    
    // Reporters
    reporters: ['verbose'],
    
    // UI
    ui: true,
    
    // Watch mode
    watch: false
  },
  
  // Resolve alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './js'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
});
