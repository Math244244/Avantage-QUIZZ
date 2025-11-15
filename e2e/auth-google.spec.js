/**
 * Tests E2E pour l'authentification Google
 * 
 * Note: Ces tests vérifient l'UI de connexion sans effectuer d'authentification réelle
 * (OAuth Google nécessite un flow complexe avec des credentials de test)
 */

import { test, expect } from '@playwright/test';

test.describe('Page de connexion - UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait afficher la page de connexion', async ({ page }) => {
    // Vérifier le titre
    await expect(page).toHaveTitle(/QuizPro/);
    
    // Vérifier le logo et le titre
    await expect(page.locator('h1:has-text("QuizPro")')).toBeVisible();
    await expect(page.locator('#login-view').getByText('by Avantage Plus')).toBeVisible();
  });

  test('devrait afficher le bouton de connexion Google', async ({ page }) => {
    const googleBtn = page.locator('button:has-text("Connexion avec Google")');
    
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toBeEnabled();
  });

  test('devrait afficher le message de bienvenue', async ({ page }) => {
    await expect(page.locator('h2:has-text("Bienvenue")')).toBeVisible();
    await expect(page.locator('text=Connectez-vous pour accéder')).toBeVisible();
  });

  test('devrait afficher le message de sécurité', async ({ page }) => {
    await expect(page.locator('text=Connexion sécurisée par Firebase')).toBeVisible();
  });

  test('devrait avoir un design responsive', async ({ page }) => {
    // Vérifier que la carte de connexion existe
    const loginCard = page.locator('.bg-white\\/80');
    await expect(loginCard).toBeVisible();
    
    // Vérifier le padding et l'espacement
    const boundingBox = await loginCard.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox.width).toBeGreaterThan(200);
  });

  test('devrait afficher le logo Google dans le bouton', async ({ page }) => {
    const googleBtn = page.locator('button:has-text("Connexion avec Google")');
    const googleIcon = googleBtn.locator('svg');
    
    await expect(googleIcon).toBeVisible();
  });

  test('devrait avoir des animations au survol', async ({ page }) => {
    const googleBtn = page.locator('button:has-text("Connexion avec Google")');
    
    // Vérifier que le bouton a des classes d'animation
    const classes = await googleBtn.getAttribute('class');
    expect(classes).toContain('transition');
  });
});

test.describe('Page de connexion - Accessibilité', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait avoir un skip link pour l\'accessibilité', async ({ page }) => {
    const skipLink = page.locator('a:has-text("Aller au contenu principal")');
    await expect(skipLink).toHaveCount(1);
  });

  test('le bouton Google devrait avoir un aria-label', async ({ page }) => {
    const googleBtn = page.locator('button:has-text("Connexion avec Google")');
    const ariaLabel = await googleBtn.getAttribute('aria-label');
    
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Google');
  });

  test('devrait avoir la meta viewport pour mobile', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
  });

  test('devrait avoir une description meta', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });
});

test.describe('Page de connexion - SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait avoir une balise title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('devrait avoir un manifeste PWA', async ({ page }) => {
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveCount(1);
  });

  test('devrait avoir une icône apple-touch', async ({ page }) => {
    const appleIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleIcon).toHaveCount(1);
  });

  test('devrait avoir une theme-color', async ({ page }) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveCount(1);
  });
});

test.describe('Sidebar - Navigation (non authentifié)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait afficher le logo Avantage Plus dans la sidebar', async ({ page }) => {
    const logo = page.getByAltText('Avantage Plus Logo');
    await expect(logo).toBeVisible();
  });

  test('devrait afficher les items de navigation', async ({ page }) => {
    // Vérifier que les items existent dans la sidebar (même s'ils ne sont pas cliquables sans auth)
    await expect(page.getByRole('menuitem', { name: 'Tableau de Bord' })).toBeVisible();
    await expect(page.locator('.sidebar-item:has-text("Quiz")').first()).toBeVisible();
    await expect(page.locator('.sidebar-item:has-text("Mes Résultats")').first()).toBeVisible();
    await expect(page.locator('.sidebar-item:has-text("Ressources")').first()).toBeVisible();
  });

  test('devrait masquer le lien Admin par défaut', async ({ page }) => {
    const adminLink = page.locator('#nav-admin-item');
    await expect(adminLink).toHaveClass(/hidden/);
  });

  test('devrait avoir un toggle de thème', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
  });
});

test.describe('Performance - Page de connexion', () => {
  test('devrait charger en moins de 3 secondes', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('devrait précharger les ressources critiques', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que les preload sont présents
    const preloads = page.locator('link[rel="preload"]');
    const count = await preloads.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('devrait charger les Google Fonts', async ({ page }) => {
    await page.goto('/');
    
    const googleFonts = page.locator('link[href*="fonts.googleapis.com"]');
    await expect(googleFonts).toHaveCount(1);
  });
});

test.describe('Responsive Design', () => {
  test('devrait être responsive sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Vérifier que le contenu est visible
    await expect(page.locator('h1:has-text("QuizPro")')).toBeVisible();
    await expect(page.locator('button:has-text("Connexion avec Google")')).toBeVisible();
  });

  test('devrait être responsive sur tablette', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('h1:has-text("QuizPro")')).toBeVisible();
    await expect(page.locator('button:has-text("Connexion avec Google")')).toBeVisible();
  });

  test('devrait être responsive sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.locator('h1:has-text("QuizPro")')).toBeVisible();
    await expect(page.locator('button:has-text("Connexion avec Google")')).toBeVisible();
  });
});

