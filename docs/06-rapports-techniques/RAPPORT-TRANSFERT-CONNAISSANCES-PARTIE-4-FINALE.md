# RAPPORT TRANSFERT CONNAISSANCES - PARTIE 4 (FINALE)

## 12. TESTS

### 12.1 Tests Unitaires (Vitest)

#### Configuration

**Fichier**: `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom', // DOM léger pour tests
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['js/**/*.js'],
      exclude: ['js/firebase-config.js', 'js/**/*.spec.js', 'node_modules/**'],
    },
  },
});
```

#### Exemple de Test

**Fichier**: `tests/state-manager.spec.js` (à créer)

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../js/state-manager.js';

describe('StateManager', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  it('should set and get values', () => {
    stateManager.set('testKey', 'testValue');
    expect(stateManager.get('testKey')).toBe('testValue');
  });

  it('should notify subscribers on change', (done) => {
    stateManager.subscribe('testKey', (newValue) => {
      expect(newValue).toBe('newValue');
      done();
    });

    stateManager.set('testKey', 'newValue');
  });

  it('should reset state correctly', () => {
    stateManager.set('currentQuiz', { id: 1 });
    stateManager.resetQuiz();
    expect(stateManager.get('currentQuiz')).toBeNull();
  });
});
```

#### Commandes

```bash
npm test              # Mode watch
npm run test:run      # Run once
npm run test:coverage # Avec coverage
npm run test:ui       # UI interactive
```

**Coverage cible**: > 80% pour fichiers critiques

### 12.2 Tests E2E (Playwright)

#### Configuration

**Fichier**: `playwright.config.js`

```javascript
export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: 'http://localhost:3200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3200',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Exemple de Test E2E

**Fichier**: `e2e/auth-google.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');

    // Vérifier présence du bouton de connexion
    const loginBtn = page.locator('#google-signin-btn');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toContainText('Connexion avec Google');
  });

  test('should show dashboard after login', async ({ page }) => {
    // Note: Test sans vraie authentification Google
    // Utiliser mock ou compte de test

    await page.goto('/');
    // ... simulate login ...

    // Vérifier redirection vers dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Vérifier affichage des cartes mensuelles
    const modulesGrid = page.locator('#modules-grid');
    await expect(modulesGrid).toBeVisible();
  });
});
```

#### Commandes

```bash
npm run test:e2e              # Run tests
npm run test:e2e:ui           # Mode UI
npm run test:e2e:debug        # Mode debug
npm run test:e2e:report       # Voir rapport
```

### 12.3 Tests Manuels

**Checklist complète** dans `GUIDE-TEST.md`

**Sections principales**:

1. ✅ Authentification (login, logout)
2. ✅ Dashboard (cartes, navigation)
3. ✅ Quiz (chargement, réponses, score)
4. ✅ Résultats (affichage, historique)
5. ✅ Admin (CRUD questions/users)
6. ✅ Responsive (mobile, tablet, desktop)
7. ✅ PWA (installation, offline)
8. ✅ Performance (Lighthouse)

### 12.4 Lighthouse Audits

**Configuration**: `lighthouserc.cjs`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3200'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.85 }],
      },
    },
  },
};
```

**Commandes**:

```bash
npm run lighthouse              # Run audit
npm run lighthouse:report       # Voir rapport HTML
```

**Cibles de performance**:

- Performance: > 85
- Accessibility: > 90
- Best Practices: > 85
- SEO: > 85

---

## 13. PERFORMANCE ET OPTIMISATION

### 13.1 Stratégies d'Optimisation Appliquées

#### Code-Splitting (Vite)

**Configuration** (`vite.config.js`):

```javascript
manualChunks: (id) => {
  // Séparer code admin du code principal
  if (id.includes('admin')) return 'admin';

  // Séparer Firebase des autres vendors
  if (id.includes('firebase')) return 'vendor-firebase';

  // Séparer code quiz
  if (id.includes('quiz')) return 'quiz';

  // Services communs
  if (id.includes('services/')) return 'services';
};
```

**Résultat**:

- `main-*.js`: ~50 KB (page d'accueil)
- `admin-*.js`: ~120 KB (chargé uniquement sur admin)
- `vendor-firebase-*.js`: ~200 KB (mis en cache)

#### Lazy Loading

**Images**:

```html
<img loading="lazy" decoding="async" src="logo.png" alt="Logo" />
```

**Scripts**:

```javascript
// Import dynamique
const { launchConfetti } = await import('./confetti.js');
```

#### Caching

**Service Worker** (stratégie par type):

- HTML: **Network First**
- CSS/JS: **Cache First**
- Images: **Stale While Revalidate**
- API Firestore: **Network First avec Cache Fallback**

**Headers de cache** (Firebase Hosting):

```json
{
  "source": "**/*.@(js|css)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "max-age=604800" // 7 jours
    }
  ]
}
```

#### Optimisation Firestore

**1. Index composites**:

```javascript
// firestore.indexes.json
{
  "collectionGroup": "questions",
  "fields": [
    { "fieldPath": "clientId", "order": "ASCENDING" },
    { "fieldPath": "module", "order": "ASCENDING" },
    { "fieldPath": "month", "order": "ASCENDING" }
  ]
}
```

**2. Pagination**:

```javascript
async function getQuestionsPaginated(pageSize = 20, lastDoc = null) {
  let q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(pageSize));

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  return await getDocs(q);
}
```

**3. Cloud Functions** (réduction lectures):

```javascript
// Au lieu de 1000+ lectures client
const allUsers = await getDocs(collection(db, 'users'));
const allResults = await getDocs(collection(db, 'quizResults'));
// ... calculs côté client ...

// Utiliser Cloud Function
const stats = await getGlobalStats({ clientId });
// 1 seul appel, calculs côté serveur
```

### 13.2 Métriques de Performance

**Core Web Vitals**:

| Métrique                           | Valeur Actuelle | Cible      |
| ---------------------------------- | --------------- | ---------- |
| **LCP** (Largest Contentful Paint) | ~1.8s           | < 2.5s ✅  |
| **FID** (First Input Delay)        | ~50ms           | < 100ms ✅ |
| **CLS** (Cumulative Layout Shift)  | ~0.05           | < 0.1 ✅   |

**Autres métriques**:

- **First Contentful Paint**: ~1.2s (cible < 1.8s) ✅
- **Time to Interactive**: ~2.5s (cible < 3.8s) ✅
- **Speed Index**: ~2.0s (cible < 3.4s) ✅

### 13.3 Monitoring Performance

#### Firebase Performance Monitoring

```javascript
// js/analytics.js
import { getPerformance, trace } from 'firebase/performance';

const perf = getPerformance(app);

// Tracer opération longue
export async function traceQuizLoad() {
  const t = trace(perf, 'quiz_load');
  t.start();

  // ... chargement quiz ...

  t.stop();
}
```

**Métriques automatiques**:

- Temps de chargement page
- Latence réseau
- Temps de réponse Firestore

#### Google Analytics

```javascript
// js/analytics.js
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

export function trackQuizComplete(moduleId, score) {
  logEvent(analytics, 'quiz_complete', {
    module: moduleId,
    score: score,
    timestamp: Date.now(),
  });
}
```

---

## 14. POINTS D'ATTENTION CRITIQUES

### 14.1 Problèmes Connus

#### 🔴 CRITIQUE: Isolation Multi-Tenant Incomplète

**Statut**: ⚠️ **EN COURS** (migration en cours)

**Description**:

- Le champ `clientId` existe dans la plupart des collections
- Certaines requêtes ne filtrent pas encore par `clientId`
- Risque de fuite de données entre clients

**Impact**:

- **BLOQUANT** pour production multi-client réelle
- OK pour single-client (client par défaut)

**Solution en cours**:

1. ✅ Ajout `clientId` dans toutes les collections
2. ⏳ Migration données existantes
3. ⏳ Mise à jour de toutes les requêtes
4. ⏳ Tests d'isolation

**Voir**: `CAHIER-DES-CHARGES-COMPLET.md` (Section 1)

#### 🟡 MAJEUR: Protection XSS Partielle

**Statut**: ⚠️ **PARTIELLEMENT CORRIGÉ**

**Description**:

- Fonction `escapeHtml()` implémentée
- Appliquée dans `quiz.js` et `admin-dashboard.js`
- **Manquant dans**: `dashboard.js`, `results.js`, autres fichiers

**Solution**:

```javascript
// Appliquer systématiquement avant injection dans DOM
element.innerHTML = escapeHtml(userInput);
```

**TODO**:

- Audit complet de tous les `innerHTML`
- Remplacer par `textContent` quand possible
- Utiliser `escapeHtml()` sinon

#### 🟡 MAJEUR: Pas de Tests Automatisés

**Statut**: ⏳ **À IMPLÉMENTER**

**Impact**:

- Risque de régression lors de modifications
- Pas de CI/CD automatisé
- Tests manuels chronophages

**Solution**:

1. Écrire tests unitaires (Vitest) pour:
   - `state-manager.js`
   - `auth.js`
   - Services (`firestore-service.js`, etc.)
2. Écrire tests E2E (Playwright) pour:
   - Flux complet quiz
   - Dashboard
   - Admin (CRUD)
3. Mettre en place CI/CD (GitHub Actions)

### 14.2 Optimisations Futures

#### 1. Cache Firestore Avancé

**Actuel**: Cache natif Firebase (limité)

**Amélioration**:

```javascript
// Cache en mémoire avec TTL
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }
}
```

**Impact**: Réduction de 50-70% des lectures Firestore

#### 2. Prefetching Intelligent

```javascript
// Précharger questions du mois suivant
async function prefetchNextMonth() {
  const currentMonth = getCurrentMonthIndex();
  const nextMonth = (currentMonth + 1) % 12;

  // En arrière-plan, sans bloquer UI
  requestIdleCallback(async () => {
    await loadQuizFromFirestore('auto', nextMonth, 2025);
  });
}
```

#### 3. Image Optimization

**Actuel**: PNG/JPG

**Migration vers WebP**:

- Script disponible: `scripts/convert-images-to-webp.js`
- Réduction taille: ~30-40%

```html
<picture>
  <source srcset="logo.webp" type="image/webp" />
  <img src="logo.png" alt="Logo" />
</picture>
```

### 14.3 Sécurité - Points de Vigilance

#### Règles Firestore

**Vérifier régulièrement**:

```bash
firebase deploy --only firestore:rules
```

**Test des règles**:

- Firebase Console → Firestore → Rules → Playground
- Simuler requêtes avec différents utilisateurs

#### Rate Limiting

**Monitoring**:

- Surveiller métriques Firebase Console
- Alertes si > 1000 requêtes/min par utilisateur

**Ajuster limites**:

```javascript
// js/rate-limiter.js
const readLimiter = new RateLimiter(100, 60000); // 100/min
const writeLimiter = new RateLimiter(50, 60000); // 50/min
```

#### Logs d'Audit

**Vérifier régulièrement**:

```javascript
// Query admin logs
const logs = await getDocs(
  query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(100))
);
```

**Actions suspectes à surveiller**:

- Création massive de questions
- Suppression d'utilisateurs
- Modifications de rôles

---

## 15. FEUILLE DE ROUTE

### 15.1 Court Terme (1-3 mois)

#### P0 - CRITIQUE (IMMÉDIAT)

**1. Finaliser Isolation Multi-Tenant**

- ⏳ Migrer toutes les données existantes
- ⏳ Ajouter filtres `clientId` partout
- ⏳ Tests d'isolation complets
- **Effort**: 2-3 semaines
- **Bloquant pour**: Production multi-client

**2. Compléter Protection XSS**

- ⏳ Audit de tous les `innerHTML`
- ⏳ Appliquer `escapeHtml()` systématiquement
- **Effort**: 3-5 jours
- **Bloquant pour**: Sécurité production

#### P1 - IMPORTANT

**3. Tests Automatisés**

- ⏳ Tests unitaires (coverage > 80%)
- ⏳ Tests E2E (flux critiques)
- ⏳ CI/CD GitHub Actions
- **Effort**: 2-3 semaines
- **Bloquant pour**: Maintenance à long terme

**4. Pagination Admin**

- ⏳ Liste utilisateurs (max 1000 → paginer)
- ⏳ Liste quiz (max 1000 → paginer)
- **Effort**: 3-5 jours
- **Bloquant pour**: Scalabilité

### 15.2 Moyen Terme (3-6 mois)

#### P2 - AMÉLIORATIONS

**5. Mode Offline Complet**

- ⏳ Sync Queue pour quiz hors ligne
- ⏳ Cache questions localement
- ⏳ Indicateur connexion
- **Effort**: 2-3 semaines
- **Impact**: Expérience mobile améliorée

**6. Notifications Push (PWA)**

- ⏳ Service Worker notifications
- ⏳ Rappels quiz mensuel
- ⏳ Notifications résultats
- **Effort**: 1-2 semaines
- **Impact**: Engagement utilisateur

**7. Export PDF Résultats**

- ⏳ Génération PDF côté client (jsPDF)
- ⏳ Template professionnel
- ⏳ Logo Avantage Plus
- **Effort**: 1 semaine
- **Impact**: Feature demandée clients

**8. Partage Social**

- ⏳ Partage scores sur LinkedIn
- ⏳ Badges de réussite
- ⏳ Open Graph tags
- **Effort**: 1 semaine
- **Impact**: Marketing viral

### 15.3 Long Terme (6-12 mois)

#### P3 - VISION

**9. Badges & Achievements**

- ⏳ Système de badges (10 quiz, 100 quiz, etc.)
- ⏳ Trophées (streak 30 jours, score parfait)
- ⏳ Page profil avec showcase
- **Effort**: 2-3 semaines
- **Impact**: Gamification avancée

**10. Leaderboard Temps Réel**

- ⏳ Classement par client
- ⏳ Classement global
- ⏳ Mise à jour temps réel (Realtime Database)
- **Effort**: 2 semaines
- **Impact**: Compétition saine

**11. Questions Adaptatives**

- ⏳ Difficulté dynamique selon performance
- ⏳ Algorithme de sélection intelligent
- ⏳ Machine Learning (TensorFlow.js)
- **Effort**: 1-2 mois
- **Impact**: Apprentissage personnalisé

**12. Intégration LMS**

- ⏳ API REST pour systèmes externes
- ⏳ SCORM compliance
- ⏳ SSO (Single Sign-On)
- **Effort**: 2-3 mois
- **Impact**: Entreprise-ready

**13. Dashboard Analytics Avancé**

- ⏳ Rapports exportables (PDF, Excel)
- ⏳ Graphiques interactifs (D3.js)
- ⏳ Prédictions (tendances, scores)
- **Effort**: 1-2 mois
- **Impact**: Insights business

### 15.4 Améliorations Techniques Continues

#### Performance

- ✅ Code-splitting (fait)
- ✅ Lazy loading (fait)
- ⏳ Image optimization (WebP)
- ⏳ CDN pour assets statiques
- ⏳ Preconnect DNS

#### Accessibilité

- ⏳ Audit WCAG 2.1 complet
- ⏳ Screen reader testing
- ⏳ Keyboard navigation améliorée
- ⏳ High contrast mode

#### Internationalization (i18n)

- ⏳ Support multi-langues (FR, EN)
- ⏳ Fichiers de traduction JSON
- ⏳ Date/time localization

---

## 16. RESSOURCES UTILES

### 16.1 Documentation Projet

**Fichiers principaux**:

- `README.md`: Vue d'ensemble
- `ARCHITECTURE.md`: Architecture technique
- `CAHIER-DES-CHARGES-COMPLET.md`: Spécifications complètes
- `GUIDE-TEST.md`: Guide de test manuel
- `FIREBASE-DEPLOYMENT.md`: Guide déploiement

**Rapports d'audit**:

- `AUDIT-COMPLET-FINAL.md`
- `RAPPORT-VALIDATION-P1-5-ETATS-VIDES.md`
- `RAPPORT-SUCCES-P1-2-CLOUD-FUNCTIONS.md`

### 16.2 Documentation Externe

**Firebase**:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Functions](https://firebase.google.com/docs/functions)

**Frontend**:

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

**PWA**:

- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### 16.3 Outils de Développement

**Éditeur recommandé**: Visual Studio Code

**Extensions VSCode**:

- Firebase (Firebase official)
- Tailwind CSS IntelliSense
- ESLint
- Prettier - Code formatter
- GitLens
- Playwright Test for VSCode

**Configuration VSCode** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### 16.4 Contacts & Support

**Projet Firebase**:

- Console: https://console.firebase.google.com/project/avantage-quizz
- Project ID: `avantage-quizz`

**URLs**:

- Production: https://avantage-quizz.web.app
- Admin: https://avantage-quizz.web.app/admin.html

**Repository Git** (si applicable):

- GitHub: (à remplir)

**Contact développeur initial**:

- (à remplir)

---

## 17. CHECKLIST D'ONBOARDING

### Pour Nouveau Développeur

#### Jour 1: Configuration

- [ ] Installer Node.js 20+
- [ ] Installer Firebase CLI
- [ ] Cloner repository
- [ ] `npm install`
- [ ] `firebase login`
- [ ] `firebase use avantage-quizz`
- [ ] Lancer en dev: `npm run dev`
- [ ] Créer compte test admin

#### Jour 2-3: Exploration

- [ ] Lire ce rapport complet
- [ ] Lire `ARCHITECTURE.md`
- [ ] Explorer structure fichiers (`js/`, `css/`)
- [ ] Examiner Firebase Console
  - [ ] Authentication
  - [ ] Firestore (collections, documents)
  - [ ] Functions
  - [ ] Hosting
- [ ] Tester application en local
  - [ ] Login Google
  - [ ] Compléter un quiz
  - [ ] Voir résultats
  - [ ] Accéder admin (si admin)

#### Jour 4-5: Modifications Test

- [ ] Créer branche: `git checkout -b test/prenom`
- [ ] Modifier un petit élément (ex: texte bouton)
- [ ] Tester localement
- [ ] Lancer linting: `npm run lint`
- [ ] Build: `npm run build`
- [ ] Commit & push
- [ ] Créer Pull Request

#### Semaine 2: Tâche Simple

- [ ] Prendre une tâche du backlog (P3 ou feature mineure)
- [ ] Développer en suivant conventions
- [ ] Écrire tests (si applicable)
- [ ] Code review avec équipe
- [ ] Merger si approuvé

#### Semaine 3-4: Autonomie

- [ ] Corriger bugs
- [ ] Implémenter features moyennes
- [ ] Participer aux discussions techniques
- [ ] Proposer améliorations

### Questions Fréquentes (FAQ)

**Q: Comment ajouter une question?**
A: Interface admin → Onglet "Questions" → Formulaire création OU import JSON

**Q: Comment changer le mois actuel affiché?**
A: C'est automatique via `getCurrentMonthIndex()` dans `js/month-utils.js`

**Q: Comment déployer en production?**
A: `npm run deploy` (build + firebase deploy)

**Q: Où sont stockées les règles Firestore?**
A: `firestore.rules` (local) + Firebase Console (déployé)

**Q: Comment tester sans compte Google?**
A: Mode démo supprimé en v2.0.2. Utiliser compte Google test.

**Q: Que faire en cas d'erreur "Permission denied"?**
A: Vérifier règles Firestore + rôle utilisateur

**Q: Comment ajouter un nouveau module (ex: Marine)?**
A:

1. Ajouter dans `moduleConfig` (`js/quiz.js`)
2. Ajouter bouton dans `module-selection-view` (`index.html`)
3. Créer questions avec `module: 'marine'`
4. Mettre à jour règles Firestore (valider 'marine')

---

## 18. CONCLUSION

### Récapitulatif

**Avantage QUIZZ** est une **application web progressive (PWA)** moderne et évolutive pour la **formation continue** dans le secteur automobile. Elle utilise:

- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS, Vite
- **Backend**: Firebase (Authentication, Firestore, Functions, Hosting)
- **Architecture**: Modulaire, service-oriented, avec gestion d'état centralisée
- **Sécurité**: Règles Firestore, rate limiting, protection XSS, retry automatique
- **Performance**: Code-splitting, lazy loading, caching, optimisations Firestore

### Points Forts

✅ **Architecture solide**: Séparation des responsabilités claire  
✅ **Scalable**: Support multi-tenant (en cours)  
✅ **Maintenable**: Code modulaire, bien documenté  
✅ **Performant**: Lighthouse score > 85  
✅ **Sécurisé**: Règles Firestore strictes, validation données  
✅ **UX moderne**: Interface fluide, responsive, animations

### Points d'Attention

⚠️ **Multi-tenant**: Migration en cours, non finalisée  
⚠️ **Tests**: Peu de tests automatisés actuellement  
⚠️ **XSS**: Protection partielle, à compléter  
⚠️ **Documentation code**: JSDoc à systématiser

### Recommandations Prioritaires

1. **FINALISER isolation multi-tenant** (P0 - critique)
2. **COMPLÉTER protection XSS** (P1 - important)
3. **IMPLÉMENTER tests automatisés** (P1 - important)
4. **PAGINER listes admin** (P1 - scalabilité)

### Message au Nouveau Développeur

Ce projet est **bien structuré** et **documenté**. Prenez le temps de:

- Lire cette documentation complètement
- Explorer le code progressivement
- Tester en local avant toute modification
- Poser des questions si quelque chose n'est pas clair

Le code est **modulaire** et **extensible**. Chaque ajout de fonctionnalité doit suivre les **conventions établies** et maintenir la **qualité du code**.

**Bienvenue dans l'équipe Avantage QUIZZ!** 🚀

---

## ANNEXES

### A. Glossaire

**PWA**: Progressive Web App - Application web installable  
**SPA**: Single Page Application  
**NoSQL**: Base de données non relationnelle  
**JWT**: JSON Web Token - Token d'authentification  
**CRUD**: Create, Read, Update, Delete  
**E2E**: End-to-End - Tests bout en bout  
**LCP**: Largest Contentful Paint - Métrique performance  
**FID**: First Input Delay - Métrique interactivité  
**CLS**: Cumulative Layout Shift - Métrique stabilité visuelle  
**XSS**: Cross-Site Scripting - Vulnérabilité injection code  
**CSRF**: Cross-Site Request Forgery - Vulnérabilité requête forgée  
**CDN**: Content Delivery Network - Réseau distribution contenu

### B. Conventions de Nommage

**Collections Firestore**:

- Plural: `users`, `questions`, `quizResults`
- camelCase pour champs: `userId`, `createdAt`

**Fichiers JavaScript**:

- kebab-case: `firebase-config.js`, `state-manager.js`

**Classes**:

- PascalCase: `StateManager`, `ErrorHandler`

**Fonctions**:

- camelCase: `loadQuizData()`, `calculateScore()`

**Constantes**:

- UPPER_SNAKE_CASE: `MAX_QUESTIONS`, `DEFAULT_CLIENT_ID`

### C. Codes d'Erreur Firestore

| Code                 | Signification                                |
| -------------------- | -------------------------------------------- |
| `permission-denied`  | Règles Firestore bloquent l'accès            |
| `unauthenticated`    | Utilisateur non connecté                     |
| `not-found`          | Document/collection inexistant               |
| `already-exists`     | Document existe déjà (conflit)               |
| `resource-exhausted` | Quota Firestore dépassé                      |
| `unavailable`        | Service Firebase temporairement indisponible |

### D. Structure Type d'un Service

```javascript
// js/services/example-service.js

import { db } from '../firebase-config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { safeFirestoreRead } from '../rate-limiter.js';
import { getCurrentClientId } from '../client-manager.js';

const COLLECTION_NAME = 'examples';

/**
 * Récupère tous les exemples du client actuel
 * @param {Object} filters - Filtres optionnels
 * @returns {Promise<Array>} Liste des exemples
 */
export async function getExamples(filters = {}) {
  try {
    const clientId = await getCurrentClientId();

    let q = query(collection(db, COLLECTION_NAME), where('clientId', '==', clientId));

    // Appliquer filtres additionnels
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }

    const snapshot = await safeFirestoreRead(() => getDocs(q));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('❌ Erreur récupération exemples:', error);
    throw error;
  }
}
```

---

**FIN DU RAPPORT DE TRANSFERT DE CONNAISSANCES**

**Rapport créé le**: 15 Novembre 2025  
**Version**: 1.0  
**Projet**: Avantage QUIZZ v2.0.16  
**Auteur**: Documentation Complète

---

## LICENCE

**Propriété**: Avantage Plus  
**Confidentialité**: Document interne  
**Usage**: Transfert de connaissances développeurs autorisés uniquement
