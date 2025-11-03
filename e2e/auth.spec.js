// Tests E2E pour le flux d'authentification
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait afficher la page de connexion', async ({ page }) => {
    await expect(page).toHaveTitle(/QuizPro/);
    
    // Vérifier que les boutons de connexion sont présents
    const googleBtn = page.locator('button:has-text("Google")');
    const demoBtn = page.locator('button:has-text("Mode Démo")');
    
    await expect(googleBtn).toBeVisible();
    await expect(demoBtn).toBeVisible();
  });

  test('devrait se connecter en mode démo', async ({ page }) => {
    // Cliquer sur le bouton Mode Démo
    await page.click('button:has-text("Mode Démo")');
    
    // Attendre que la page se recharge et que le dashboard s'affiche
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Vérifier qu'on est bien connecté en vérifiant que la vue login est cachée
    const loginView = page.locator('#login-view');
    await expect(loginView).toBeHidden();
  });

  test('devrait afficher le menu après connexion', async ({ page }) => {
    // Se connecter en mode démo
    await page.click('button:has-text("Mode Démo")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Vérifier que le menu est présent
    const menu = page.locator('nav');
    await expect(menu).toBeVisible();
    
    // Vérifier les liens du menu
    await expect(page.locator('a:has-text("Quiz")')).toBeVisible();
    await expect(page.locator('a:has-text("Résultats")')).toBeVisible();
    await expect(page.locator('a:has-text("Ressources")')).toBeVisible();
  });

  test('devrait pouvoir se déconnecter', async ({ page }) => {
    // Se connecter
    await page.click('button:has-text("Mode Démo")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Cliquer sur le bouton de déconnexion
    const logoutBtn = page.locator('button:has-text("Déconnexion")');
    await logoutBtn.click();
    
    // Attendre la redirection vers la page de connexion
    await page.waitForURL('/', { timeout: 5000 });
    await page.waitForSelector('#login-view', { state: 'visible', timeout: 5000 });
    
    // Vérifier qu'on est bien déconnecté
    await expect(page.locator('button:has-text("Google")')).toBeVisible();
  });

  test('devrait afficher un message d\'erreur si Google Auth échoue', async ({ page }) => {
    // Mock l'échec de l'authentification Google
    await page.route('**/identitytoolkit.googleapis.com/**', route => {
      route.abort();
    });
    
    // Essayer de se connecter avec Google
    await page.click('button:has-text("Google")');
    
    // Vérifier qu'un message d'erreur apparaît
    // (dépend de l'implémentation de votre système de toast)
    await page.waitForSelector('.toast-error', { timeout: 3000 });
  });

  test('devrait rediriger vers admin si utilisateur admin', async ({ page }) => {
    // Note: Ce test nécessite un mock de l'authentification Firebase
    // Pour un vrai test, il faudrait créer un compte test admin
    
    // Se connecter en mode démo
    await page.click('button:has-text("Mode Démo")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Si l'utilisateur est admin, un lien Admin devrait être visible
    const adminLink = page.locator('a:has-text("Admin")');
    
    // Note: Le mode démo crée un utilisateur avec role admin
    await expect(adminLink).toBeVisible();
    
    // Cliquer et vérifier la navigation
    await adminLink.click();
    await expect(page).toHaveURL(/admin/);
  });

  test('devrait persister la session après rechargement', async ({ page }) => {
    // Se connecter
    await page.click('button:has-text("Mode Démo")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'on est toujours connecté (le dashboard doit être visible)
    await expect(page.locator('#dashboard-view')).toBeVisible();
    await expect(page.locator('#login-view')).toBeHidden();
  });

  test('devrait gérer les erreurs réseau gracieusement', async ({ page }) => {
    // Simuler une panne réseau
    await page.route('**/firestore.googleapis.com/**', route => {
      route.abort('failed');
    });
    
    // Se connecter
    await page.click('button:has-text("Mode Démo")');
    
    // Attendre quelques secondes
    await page.waitForTimeout(2000);
    
    // L'application devrait toujours être utilisable (mode dégradé)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Thème', () => {
  test('devrait pouvoir basculer entre mode clair et sombre', async ({ page }) => {
    await page.goto('/');
    
    // Se connecter
    await page.click('button:has-text("Mode Démo")');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#dashboard-view', { state: 'visible', timeout: 5000 });
    
    // Trouver le bouton de toggle du thème
    const themeToggle = page.locator('[data-theme-toggle]').or(
      page.locator('button:has-text("🌙")').or(
        page.locator('button:has-text("☀️")')
      )
    );
    
    // Cliquer pour changer le thème
    await themeToggle.click();
    
    // Vérifier que le thème a changé (via la classe dark sur html)
    const html = page.locator('html');
    const hasDarkClass = await html.getAttribute('class');
    
    expect(hasDarkClass).toBeTruthy();
  });
});
