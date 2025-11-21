# RAPPORT TRANSFERT CONNAISSANCES - PARTIE 3

## 7. SÉCURITÉ

### 7.1 Protection XSS (Cross-Site Scripting)

#### Fonction d'échappement HTML

**Fichier**: `js/security.js`

```javascript
/**
 * Échappe les caractères HTML dangereux
 * @param {string} text - Texte à sécuriser
 * @returns {string} Texte sécurisé
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return text;

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}
```

**Utilisation**:

```javascript
// TOUJOURS échapper avant d'injecter dans le DOM
element.innerHTML = escapeHtml(userInput);

// Exemple: Affichage d'une question
questionText.innerHTML = escapeHtml(currentQuestion.question);
```

**Endroits critiques**:

- Questions de quiz
- Noms d'utilisateurs
- Résultats de recherche
- Messages d'erreur contenant données utilisateur

### 7.2 Rate Limiting

#### Limitation des requêtes Firestore

**Fichier**: `js/rate-limiter.js`

**Objectif**: Prévenir abus et réduire coûts Firebase

```javascript
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests; // 100 requêtes
    this.windowMs = windowMs; // par minute
    this.requests = [];
  }

  checkLimit() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Nettoyer anciennes requêtes
    this.requests = this.requests.filter((time) => time > windowStart);

    if (this.requests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded. Veuillez patienter.');
    }

    this.requests.push(now);
  }
}

// Wrapper pour lectures Firestore
export async function safeFirestoreRead(operation) {
  readLimiter.checkLimit();
  return await operation();
}

// Wrapper pour écritures Firestore
export async function safeFirestoreWrite(operation) {
  writeLimiter.checkLimit();
  return await operation();
}
```

**Utilisation**:

```javascript
// Au lieu de:
const doc = await getDoc(userRef);

// Utiliser:
const doc = await safeFirestoreRead(() => getDoc(userRef));
```

### 7.3 Gestion d'Erreurs Centralisée

#### Error Handler

**Fichier**: `js/error-handler.js`

```javascript
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Erreurs JavaScript non capturées
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Uncaught Error');
    });

    // Promesses rejetées non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });
  }

  handleError(error, context = 'Unknown') {
    console.error(`❌ [${context}]:`, error);

    // Logger l'erreur
    this.logError(error, context);

    // Afficher notification utilisateur
    this.notifyUser(error);

    // Reporter à Firebase Analytics (optionnel)
    this.reportToAnalytics(error, context);
  }

  logError(error, context) {
    this.errorLog.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    // Limiter taille du log
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  notifyUser(error) {
    import('./toast.js').then(({ toast }) => {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    });
  }
}
```

#### Retry Handler

**Fichier**: `js/retry-handler.js`

**Objectif**: Réessayer automatiquement les opérations échouées

```javascript
/**
 * Exécute une opération Firestore avec retry automatique
 * @param {Function} operation - Fonction async à exécuter
 * @param {number} maxRetries - Nombre max de tentatives (défaut: 3)
 * @param {number} delayMs - Délai entre tentatives (défaut: 1000ms)
 */
export async function withFirestoreRetry(operation, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Tentative ${attempt}/${maxRetries} échouée:`, error.message);

      // Ne pas retry pour certaines erreurs
      if (isNonRetryableError(error)) {
        throw error;
      }

      // Attendre avant de réessayer (exponential backoff)
      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

function isNonRetryableError(error) {
  const nonRetryableCodes = [
    'permission-denied',
    'unauthenticated',
    'invalid-argument',
    'not-found',
  ];
  return nonRetryableCodes.includes(error.code);
}
```

**Utilisation**:

```javascript
// Wrapper automatique
const questions = await withFirestoreRetry(() => getDocs(questionsQuery));
```

### 7.4 Protection CSRF

**Firebase gère automatiquement**:

- Tokens anti-CSRF dans Authentication
- Validation origin/referrer

**Bonnes pratiques appliquées**:

- Pas d'opérations sensibles en GET
- Validation `request.auth` dans règles Firestore
- Headers CORS configurés dans `firebase.json`

### 7.5 Validation des Données

#### Côté Client (JavaScript)

```javascript
function validateQuizResult(result) {
  // Score valide
  if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
    throw new Error('Score invalide');
  }

  // Nombre de questions cohérent
  if (result.correctAnswers > result.totalQuestions) {
    throw new Error('Données incohérentes');
  }

  // Temps réaliste (min 1 seconde par question)
  if (result.timeElapsed < result.totalQuestions) {
    throw new Error('Temps suspect');
  }

  return true;
}
```

#### Côté Serveur (Règles Firestore)

```javascript
// Dans firestore.rules
allow create: if request.resource.data.score is int &&
                 request.resource.data.score >= 0 &&
                 request.resource.data.score <= 100 &&
                 request.resource.data.correctAnswers <= request.resource.data.totalQuestions;
```

### 7.6 Sécurité Firebase

#### Clé API Publique

**Est-ce un problème?** ❌ **NON**

Firebase est conçu pour exposer la clé API côté client. La sécurité repose sur:

1. **Règles Firestore**: Validation côté serveur
2. **Firebase Authentication**: Tokens JWT sécurisés
3. **Restrictions API**: Configurées dans Google Cloud Console

**Restrictions API recommandées**:

```
Google Cloud Console → APIs & Services → Credentials
→ Sélectionner la clé API
→ Application restrictions: HTTP referrers
→ Ajouter: https://avantage-quizz.web.app/*
```

---

## 8. SYSTÈMES DE DÉPLOIEMENT

### 8.1 Environnements

| Environnement     | URL                              | Usage          |
| ----------------- | -------------------------------- | -------------- |
| **Développement** | `http://localhost:3200`          | Dev local      |
| **Staging**       | Preview Channels Firebase        | Tests pré-prod |
| **Production**    | `https://avantage-quizz.web.app` | Production     |

### 8.2 Build Process

#### Configuration Vite

**Fichier**: `vite.config.js`

**Étapes du build**:

```bash
npm run build
```

1. **Compilation Tailwind CSS**:

   ```bash
   tailwindcss -i ./css/input.css -o ./css/output.css --minify
   ```

2. **Build Vite**:

   ```bash
   vite build
   ```

   - Bundling JavaScript (ES modules → compatible navigateurs)
   - Minification (Terser)
   - Code-splitting automatique
   - Génération sourcemaps
   - Optimisation assets (images, fonts)

3. **Post-build** (`scripts/postbuild.mjs`):
   - Copie des assets supplémentaires
   - Génération `dist/index.html` optimisé

**Output** (répertoire `dist/`):

```
dist/
├── index.html
├── admin.html
├── results.html
├── resources.html
├── manifest.json
├── service-worker.js
└── assets/
    ├── main-abc123.js
    ├── admin-def456.js
    ├── quiz-ghi789.js
    ├── vendor-firebase-jkl012.js
    ├── services-mno345.js
    ├── main-pqr678.css
    └── ...
```

### 8.3 Déploiement Firebase Hosting

#### Configuration

**Fichier**: `firebase.json`

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "**/*.md"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

#### Commandes de Déploiement

**Déploiement complet**:

```bash
npm run deploy
# Équivalent à: npm run build && firebase deploy
```

**Déploiement sélectif**:

```bash
firebase deploy --only hosting          # Hosting uniquement
firebase deploy --only firestore:rules  # Règles Firestore
firebase deploy --only functions        # Cloud Functions
```

**Preview Channel** (staging):

```bash
firebase hosting:channel:deploy staging
# URL: https://avantage-quizz--staging-xyz.web.app
```

### 8.4 CI/CD (Optionnel - à implémenter)

**Pipeline recommandé** (GitHub Actions):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

### 8.5 Cloud Functions Deployment

#### Build Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

**Fonctions déployées**:

- `getGlobalStats`: Agrégation statistiques globales
- `getModuleStats`: Statistiques par module

**Runtime**: Node.js 20

**Région**: `us-central1` (défaut)

#### Appel depuis le Client

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app);
const getGlobalStats = httpsCallable(functions, 'getGlobalStats');

// Appel
const result = await getGlobalStats({ clientId: 'default' });
console.log(result.data.stats);
```

---

## 9. DÉPENDANCES

### 9.1 Dépendances de Production

**Fichier**: `package.json`

```json
{
  "dependencies": {
    "firebase": "^12.5.0" // SDK Firebase complet
  }
}
```

**Modules Firebase utilisés**:

- `firebase/app`: Core
- `firebase/auth`: Authentication
- `firebase/firestore`: Cloud Firestore
- `firebase/database`: Realtime Database (futur)
- `firebase/functions`: Cloud Functions
- `firebase/analytics`: Analytics

### 9.2 Dépendances de Développement

```json
{
  "devDependencies": {
    // Build Tools
    "vite": "^7.1.12", // Build tool moderne
    "tailwindcss": "^3.3.5", // Framework CSS

    // Testing
    "vitest": "^4.0.6", // Tests unitaires
    "@vitest/ui": "^4.0.6", // UI pour Vitest
    "@vitest/coverage-v8": "^4.0.6", // Coverage
    "@playwright/test": "^1.56.1", // Tests E2E
    "@testing-library/dom": "^10.4.1", // Testing utilities
    "happy-dom": "^20.0.10", // DOM léger pour tests
    "jsdom": "^27.1.0", // DOM complet pour tests

    // Code Quality
    "eslint": "^9.39.1", // Linting
    "eslint-config-prettier": "^9.1.2", // ESLint + Prettier
    "prettier": "^3.6.2", // Formatage
    "husky": "^9.1.7", // Git hooks
    "lint-staged": "^15.5.2", // Lint pré-commit

    // Performance
    "@lhci/cli": "^0.15.1", // Lighthouse CI
    "lighthouse": "^12.8.2", // Audits performance

    // Backend
    "firebase-admin": "^13.6.0", // Admin SDK (scripts)

    // Utils
    "http-server": "^14.1.1" // Serveur local simple
  }
}
```

### 9.3 Scripts NPM

```json
{
  "scripts": {
    "dev": "vite", // Dev server
    "build": "npm run build:css && vite build && node scripts/postbuild.mjs",
    "build:css": "tailwindcss -i ./css/input.css -o ./css/output.css --minify",
    "preview": "vite preview", // Preview build local
    "deploy": "npm run build && firebase deploy",

    "test": "vitest", // Tests unitaires (watch)
    "test:ui": "vitest --ui", // UI interactive
    "test:run": "vitest run", // Tests une fois
    "test:coverage": "vitest run --coverage",

    "test:e2e": "playwright test", // Tests E2E
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",

    "lighthouse": "lhci autorun", // Audit Lighthouse
    "lighthouse:report": "start lighthouse-reports/index.html",

    "convert:webp": "node scripts/convert-images-to-webp.js",

    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

### 9.4 CDN (Externes)

**Google Fonts**:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Chart.js** (admin):

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
```

**jsPDF** (admin):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

---

## 10. CONFIGURATION ET INSTALLATION

### 10.1 Prérequis

**Logiciels requis**:

- **Node.js**: Version 20.x ou supérieure
- **npm**: Version 10.x ou supérieure
- **Git**: Pour version control
- **Compte Firebase**: Projet Firebase configuré
- **Compte Google Cloud**: Pour Cloud Functions

**Vérifier versions**:

```bash
node --version   # v20.x.x
npm --version    # 10.x.x
git --version    # 2.x.x
```

### 10.2 Installation Initiale

#### Étape 1: Cloner le Projet

```bash
git clone https://github.com/votre-organisation/avantage-quizz.git
cd avantage-quizz
```

#### Étape 2: Installer les Dépendances

```bash
npm install
```

#### Étape 3: Installer Firebase CLI

```bash
npm install -g firebase-tools

# Login Firebase
firebase login
```

#### Étape 4: Sélectionner le Projet Firebase

```bash
firebase use avantage-quizz
```

### 10.3 Configuration Firebase

#### Créer Projet Firebase

1. Aller sur https://console.firebase.google.com
2. Créer nouveau projet → "avantage-quizz"
3. Activer Google Analytics (optionnel)

#### Configurer Authentication

1. Firebase Console → Authentication → Sign-in method
2. Activer "Google" provider
3. Ajouter domaines autorisés:
   - `localhost`
   - `avantage-quizz.web.app`
   - `avantage-quizz.firebaseapp.com`

#### Configurer Firestore

1. Firebase Console → Firestore Database → Create database
2. Choisir région: `northamerica-northeast1` (Montréal)
3. Mode: **Production** (avec règles sécurisées)

#### Déployer Règles et Index

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

#### Configurer Cloud Functions

1. Activer Billing dans Firebase Console
2. Upgrader vers plan Blaze (pay-as-you-go)

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 10.4 Variables d'Environnement

**Fichier**: `js/firebase-config.js`

**Configuration actuelle** (déjà dans le code):

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0',
  authDomain: 'avantage-quizz.firebaseapp.com',
  databaseURL: 'https://avantage-quizz-default-rtdb.firebaseio.com',
  projectId: 'avantage-quizz',
  storageBucket: 'avantage-quizz.firebasestorage.app',
  messagingSenderId: '919472910099',
  appId: '1:919472910099:web:e17d4c1cdc7a04c6cab4e6',
};
```

⚠️ **Note**: Pour un environnement multi-projets, créer `.env.local` (à ajouter à `.gitignore`).

### 10.5 Lancer en Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3200`

**Hot reload activé** (modifications CSS/JS rechargées automatiquement)

---

## 11. GUIDE DE DÉVELOPPEMENT

### 11.1 Workflow de Développement

#### 1. Créer une Branche

```bash
git checkout -b feature/nom-fonctionnalite
```

#### 2. Développer

- Éditer fichiers dans `js/`, `css/`, HTML
- Tester en local (`npm run dev`)
- Vérifier console navigateur (erreurs)

#### 3. Linting & Formatage

```bash
npm run lint:fix   # Corriger erreurs ESLint
npm run format     # Formatter avec Prettier
```

#### 4. Tester

```bash
npm run test           # Tests unitaires
npm run test:e2e       # Tests E2E
npm run lighthouse     # Audit performance
```

#### 5. Build Local

```bash
npm run build
npm run preview   # Tester le build
```

#### 6. Commit

```bash
git add .
git commit -m "feat: Ajouter fonctionnalité X"
```

**Convention de commits**:

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage (pas de changement code)
- `refactor:` Refactorisation
- `test:` Ajout/modification tests
- `chore:` Tâches de maintenance

#### 7. Push & Pull Request

```bash
git push origin feature/nom-fonctionnalite
```

Créer Pull Request sur GitHub → Review → Merge

### 11.2 Conventions de Code

#### Nommage

**Variables/Fonctions** (camelCase):

```javascript
const currentUser = getCurrentUser();
async function loadQuizData() {}
```

**Classes** (PascalCase):

```javascript
class StateManager {}
class ErrorHandler {}
```

**Constantes** (UPPER_SNAKE_CASE):

```javascript
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_CLIENT_ID = 'default';
```

**Fichiers** (kebab-case):

```
state-manager.js
firebase-config.js
admin-dashboard.js
```

#### Structure d'un Module

```javascript
// 1. Imports
import { auth } from './firebase-config.js';
import { getUserProfile } from './firestore-service.js';

// 2. Constantes
const MAX_QUESTIONS = 10;

// 3. Variables de module (privées)
let currentQuiz = null;

// 4. Fonctions principales (exportées)
export async function startQuiz(moduleId) {
  // ...
}

// 5. Fonctions utilitaires (privées)
function validateQuizData(data) {
  // ...
}

// 6. Initialisation
initializeQuizSystem();
```

#### Commentaires

**JSDoc pour fonctions publiques**:

```javascript
/**
 * Charge les questions depuis Firestore
 * @param {string} moduleId - ID du module ('auto', 'loisir', etc.)
 * @param {number} monthNumber - Numéro du mois (1-12)
 * @param {number} year - Année (2025)
 * @returns {Promise<Array>} Liste des questions
 * @throws {Error} Si aucune question trouvée
 */
export async function loadQuestions(moduleId, monthNumber, year) {
  // ...
}
```

**Commentaires inline**:

```javascript
// ✅ Bonne pratique: Expliquer le "pourquoi"
// Attendre 2 secondes pour éviter rate limit Firebase
await sleep(2000);

// ❌ Mauvaise pratique: Expliquer le "quoi" (évident)
// Incrémenter le compteur
counter++;
```

### 11.3 Debugging

#### Console Logs

**Convention** (émojis pour filtrage rapide):

```javascript
console.log('✅ Opération réussie');
console.warn('⚠️ Attention: valeur suspecte');
console.error('❌ Erreur critique');
console.info('ℹ️ Information');
console.debug('🔍 Debug:', data);
```

#### Firebase Emulator Suite (Optionnel)

```bash
firebase init emulators
firebase emulators:start
```

**Avantages**:

- Tester sans toucher production
- Données de test réinitialisables
- Gratuit (pas de coûts Firebase)

**Configuration** (`.firebaserc`):

```json
{
  "projects": {
    "default": "avantage-quizz"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 }
  }
}
```

#### Chrome DevTools

**Breakpoints**:

- `debugger;` dans le code
- Ou breakpoints visuels dans DevTools

**Network Tab**:

- Inspecter requêtes Firestore
- Vérifier temps de réponse
- Identifier requêtes lentes

**Performance Tab**:

- Profiling JavaScript
- Identifier bottlenecks

---

**(Suite dans la Partie 4...)**
