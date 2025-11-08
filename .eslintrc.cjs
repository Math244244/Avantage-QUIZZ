module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'eqeqeq': ['warn', 'always'],
    'no-console': ['off']
  },
  ignorePatterns: [
    'dist/',
    'coverage/',
    'playwright-report/',
    'lighthouse-reports/'
  ]
};
