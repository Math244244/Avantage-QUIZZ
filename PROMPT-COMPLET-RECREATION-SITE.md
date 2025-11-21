# 🎯 PROMPT COMPLET ET OPTIMAL - RECRÉATION AVANTAGE QUIZZ

**Date de création:** 20 Novembre 2025  
**Version:** 1.0.0  
**Objectif:** Recréer intégralement l'application web **Avantage QUIZZ** (QuizPro) de zéro, sans les erreurs du projet initial.

---

## 📋 CONTEXTE BUSINESS

Tu vas créer une **Progressive Web App (PWA)** complète nommée **"Avantage QUIZZ" (QuizPro)**, une plateforme de formation continue et d'évaluation mensuelle pour **Avantage Plus**, une entreprise spécialisée dans les produits de protection mécanique exceptionnelle pour véhicules.

### Objectifs Métier

1. **Formation Continue:** Évaluation mensuelle des connaissances produits des employés et partenaires
2. **Gamification:** Système de points, séries (streaks), et classements pour engager les utilisateurs
3. **Multi-Tenant:** Support de plusieurs clients (entreprises) avec isolation complète des données
4. **Analytics:** Suivi des performances individuelles et globales en temps réel
5. **Accessibilité:** Application disponible sur desktop, tablette et mobile (PWA installable)

### Utilisateurs Cibles

- **Employés Avantage Plus:** Formation interne produits
- **Partenaires Concessionnaires:** Certification produits
- **Administrateurs:** Gestion questions, utilisateurs, analytics

---

## 🏗️ ARCHITECTURE TECHNIQUE GLOBALE

### Stack Technologique (à respecter strictement)

| Composant            | Technologie             | Version | Justification                                    |
| -------------------- | ----------------------- | ------- | ------------------------------------------------ |
| **Frontend**         | Vanilla JavaScript ES6+ | Native  | Performance optimale, pas de framework lourd     |
| **Styling**          | Tailwind CSS            | 3.3.5   | Utility-first, responsive, purge CSS automatique |
| **Backend**          | Firebase (BaaS)         | 10.7.1  | Serverless, scaling automatique, auth prête      |
| **Base de Données**  | Cloud Firestore         | -       | NoSQL temps réel, offline persistence            |
| **Authentification** | Firebase Auth (Google)  | -       | SSO simple et sécurisé                           |
| **Hosting**          | Firebase Hosting        | -       | CDN global, HTTPS automatique                    |
| **Build Tool**       | Vite                    | 7.1.12  | Ultra rapide, HMR instantané                     |
| **Tests Unitaires**  | Vitest                  | 4.0.6   | Rapide, compatible Vite                          |
| **Tests E2E**        | Playwright              | 1.56.1  | Cross-browser, API moderne                       |
| **PWA**              | Service Worker          | Native  | Offline-first, installable                       |

### Type d'Application

- **SPA (Single Page Application)** avec navigation côté client
- **PWA (Progressive Web App)** installable sur mobile
- **Architecture Serverless** (Firebase)
- **Multi-Tenant** avec isolation complète par `clientId`

---

## 🎨 IDENTITÉ VISUELLE AVANTAGE PLUS

### Palette de Couleurs (à respecter STRICTEMENT)

#### Couleurs Principales

```css
/* Rouge Avantage Plus (couleur de marque) */
--ap-red-primary: #c41e3a;
--ap-red-dark: #8b1429;
--ap-red-light: #e63946;
--ap-red-bg: #dc1f32;

/* Blanc & Gris (complémentaires) */
--ap-white: #ffffff;
--ap-gray-50: #f4f6f9; /* Backgrounds ultra froids */
--ap-gray-600: #6c757d; /* Textes secondaires */
--ap-gray-900: #212529; /* Textes principaux */

/* Anthracite + Argent (accent premium moderne) */
--ap-accent: #2d3748; /* Base UI moderne */
--ap-silver: #c0c7d0; /* Accents premium, badges */
--ap-platinum: #f5f8fb; /* Highlights, reflets */
```

#### Dégradés Principaux

```css
/* Headers, cartes principales */
--ap-gradient-primary: linear-gradient(135deg, #c41e3a 0%, #8b1429 100%);

/* Sidebar navigation */
--ap-gradient-sidebar: linear-gradient(180deg, #8b1429 0%, #c41e3a 100%);

/* Cartes premium, badges */
--ap-gradient-accent: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);

/* Effet métallique argent */
--ap-gradient-silver: linear-gradient(135deg, #e2e8f0 0%, #c0c7d0 100%);
```

#### Couleurs Fonctionnelles

```css
--ap-success: #28a745; /* Validation */
--ap-info: #17a2b8; /* Information */
--ap-warning: #ff9f43; /* Avertissement */
--ap-danger: #c41e3a; /* Danger (même que rouge principal) */
```

### Typographie

- **Font Family:** 'Inter', sans-serif (Google Fonts)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Height:** 1.6 (body), 1.3 (headings)
- **Letter Spacing:** -0.01em (body), -0.02em (headings)

### Ombres (Box Shadows)

```css
--ap-shadow-sm: 0 2px 4px rgba(196, 30, 58, 0.08);
--ap-shadow-md: 0 4px 12px rgba(196, 30, 58, 0.12);
--ap-shadow-lg: 0 8px 30px rgba(196, 30, 58, 0.15);
--ap-shadow-hover: 0 10px 30px rgba(196, 30, 58, 0.25);
--ap-shadow-silver: 0 4px 15px rgba(192, 199, 208, 0.3);
```

### Accessibilité (WCAG AA minimum)

Tous les contrastes doivent être vérifiés:

- Rouge sur blanc: 5.8:1 ✓
- Blanc sur rouge: 5.8:1 ✓
- Anthracite sur blanc: 11.8:1 ✓ (AAA)

---

## 📁 STRUCTURE DU PROJET (à créer EXACTEMENT)

```
avantage-quizz/
│
├── 📁 assets/
│   └── images/
│       └── logos/
│           ├── logo-avantage-plus-white-on-red.png
│           └── Bandeau AVEX.png
│
├── 📁 css/
│   ├── input.css                   # Source Tailwind (+ customs)
│   ├── output.css                  # CSS compilé (généré)
│   ├── colors-avantage-plus.css    # Palette de couleurs
│   ├── typography-avantage-plus.css # Typographie
│   ├── animations-avantage-plus.css # Animations
│   ├── sidebar-avantage-plus.css    # Sidebar navigation
│   ├── dashboard-avantage-plus.css  # Dashboard styles
│   ├── mobile-navigation.css        # Menu hamburger mobile
│   ├── micro-interactions.css       # Micro-animations
│   └── skeleton.css                 # Loading skeletons
│
├── 📁 js/
│   ├── firebase-config.js          # Config & init Firebase SDK
│   ├── auth.js                     # Google Sign-In, logout, user state
│   ├── dashboard.js                # Tableau de bord principal
│   ├── quiz.js                     # Système complet quiz
│   ├── confetti.js                 # Animation confetti
│   ├── results.js                  # Historique résultats
│   ├── resources.js                # Page ressources
│   ├── admin-dashboard.js          # Dashboard admin
│   ├── admin-questions.js          # Gestion questions (CRUD)
│   ├── admin-users.js              # Gestion utilisateurs (CRUD)
│   ├── admin-auth-guard.js         # Protection routes admin
│   ├── client-manager.js           # Gestion multi-tenant
│   ├── firestore-service.js        # CRUD Firestore générique
│   ├── state-manager.js            # State global centralisé
│   ├── month-utils.js              # Utilitaires dates/mois
│   ├── error-handler.js            # Gestion erreurs globale
│   ├── retry-handler.js            # Retry automatique failed requests
│   ├── rate-limiter.js             # Protection DDoS/spam
│   ├── security.js                 # Helpers sécurité (XSS, validation)
│   ├── logger.js                   # Logs centralisés
│   ├── analytics.js                # Firebase Analytics events
│   ├── toast.js                    # Toasts (messages flash)
│   ├── tooltip.js                  # Tooltips
│   ├── skeleton.js                 # Loading states
│   ├── empty-states.js             # États vides (no data)
│   ├── offline-manager.js          # Gestion mode hors-ligne
│   ├── sync-queue.js               # Queue synchro offline
│   ├── sidebar-mobile.js           # Menu hamburger mobile
│   ├── index-init.js               # Point d'entrée principal
│   │
│   ├── 📁 services/                # Services métier
│   │   ├── quiz-service.js         # Logique métier quiz
│   │   ├── user-service.js         # Logique métier utilisateurs
│   │   ├── question-service.js     # Logique métier questions
│   │   ├── cache-service.js        # Gestion cache mémoire
│   │   └── audit-service.js        # Logs d'audit (traçabilité)
│   │
│   └── 📁 utils/
│       ├── quiz-scoring.js         # Calcul scores & statuts
│       └── image-optimizer.js      # Optimisation images
│
├── 📁 functions/                   # Firebase Cloud Functions
│   ├── index.js                    # Functions definition
│   ├── package.json                # Node.js dependencies
│   └── ... (autres fichiers)
│
├── 📁 tests/                       # Tests unitaires (Vitest)
├── 📁 e2e/                         # Tests E2E (Playwright)
│
├── 📄 HTML PAGES
├── index.html                      # Page principale (Dashboard)
├── admin.html                      # Interface administrateur
├── results.html                    # Historique résultats
├── resources.html                  # Ressources documentaires
│
├── 📄 PWA MANIFEST & SERVICE WORKER
├── manifest.json                   # Manifest PWA
├── service-worker.js               # Service Worker (cache offline)
│
├── 📄 FIREBASE CONFIGURATION
├── firebase.json                   # Config Firebase Hosting & Functions
├── firestore.rules                 # Règles de sécurité Firestore
├── firestore.indexes.json          # Index Firestore optimisés
├── .firebaserc                     # Projet Firebase actif
│
├── 📄 BUILD & TOOLING CONFIG
├── package.json                    # Dépendances NPM
├── vite.config.js                  # Configuration Vite
├── vitest.config.js                # Configuration Vitest
├── playwright.config.js            # Configuration Playwright
├── tailwind.config.js              # Configuration Tailwind CSS
├── .eslintrc.json                  # Configuration ESLint
├── .prettierrc.json                # Configuration Prettier
│
└── 📄 DOCUMENTATION
    ├── README.md                   # Documentation principale
    ├── ARCHITECTURE.md             # Architecture technique
    ├── SETUP.md                    # Guide installation
    └── GUIDE-TEST.md               # Guide de test
```

---

## 🔥 FIREBASE - CONFIGURATION BACKEND

### Collections Firestore (à créer EXACTEMENT)

#### 1. Collection `users/`

**Document ID:** `{userId}` (UID Firebase Auth)

**Structure:**

```javascript
{
  uid: string,                    // UID Firebase Auth
  email: string,                  // Email utilisateur
  displayName: string,            // Nom complet
  photoURL: string,               // URL photo profil
  role: 'user' | 'admin',         // Rôle (user par défaut)
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  createdAt: Timestamp,           // Date de création
  lastLogin: Timestamp,           // Dernière connexion
  totalQuizzes: number,           // Nombre total de quiz complétés
  averageScore: number,           // Score moyen (0-100)
  currentStreak: number,          // Série active (jours consécutifs)
  longestStreak: number,          // Série la plus longue
  updatedAt: Timestamp            // Dernière mise à jour
}
```

**Index requis:**

- `clientId` (ASC) + `createdAt` (DESC)
- `clientId` (ASC) + `averageScore` (DESC) + `totalQuizzes` (DESC)

#### 2. Collection `questions/`

**Document ID:** Auto-généré

**Structure:**

```javascript
{
  question: string,               // Texte de la question (min 10 caractères)
  options: array[4],              // Tableau de 4 options de réponse
  correctAnswer: int,             // Index de la bonne réponse (0-3)
  explanation: string,            // Explication détaillée (min 20 caractères)
  reference: string,              // Référence document (optionnel)
  tags: array,                    // Tags pour filtrage (optionnel)
  module: string,                 // 'auto' | 'loisir' | 'vr' | 'tracteur'
  month: int,                     // Numéro du mois (1-12)
  year: int,                      // Année (2024, 2025, etc.)
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  createdAt: Timestamp,           // Date de création
  createdBy: string,              // UID de l'admin créateur
  active: boolean,                // Question active ou archivée
  updatedAt: Timestamp            // Dernière mise à jour
}
```

**Index requis:**

- `clientId` (ASC) + `year` (ASC) + `createdAt` (DESC)
- `clientId` (ASC) + `module` (ASC) + `year` (ASC) + `createdAt` (DESC)
- `clientId` (ASC) + `module` (ASC) + `month` (ASC) + `year` (ASC) + `createdAt` (DESC)

**Validation (Firestore Rules):**

- `question.length >= 10`
- `options.length == 4`
- `correctAnswer >= 0 && correctAnswer <= 3`
- `explanation.length >= 20`
- `module in ['auto', 'loisir', 'vr', 'tracteur']`
- `month >= 1 && month <= 12`

#### 3. Collection `quizResults/`

**Document ID:** Auto-généré

**Structure:**

```javascript
{
  userId: string,                 // UID de l'utilisateur
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  userEmail: string,              // Email (dénormalisé pour performance)
  moduleId: string,               // 'auto' | 'loisir' | 'vr' | 'tracteur'
  moduleName: string,             // Nom du module (dénormalisé)
  score: int,                     // Score final (0-100)
  correctAnswers: int,            // Nombre de bonnes réponses
  totalQuestions: int,            // Nombre total de questions
  timeElapsed: int,               // Temps écoulé (secondes)
  answers: array,                 // Détail des réponses [{questionId, userAnswer, isCorrect}]
  date: Timestamp,                // Date de complétion
  completedAt: Timestamp,         // Timestamp de complétion
  month: string,                  // Mois (format "YYYY-MM")
  year: int                       // Année
}
```

**Index requis:**

- `userId` (ASC) + `completedAt` (DESC)
- `clientId` (ASC) + `userId` (ASC) + `date` (DESC)
- `clientId` (ASC) + `completedAt` (ASC)
- `clientId` (ASC) + `completedAt` (DESC)

**Validation (Firestore Rules):**

- `score >= 0 && score <= 100`
- `correctAnswers >= 0 && correctAnswers <= totalQuestions`
- `totalQuestions > 0`
- `moduleId in ['auto', 'loisir', 'vr', 'tracteur']`

#### 4. Collection `monthlyProgress/`

**Document ID:** `{userId}_{month}` (ex: "abc123_2025-11")

**Structure:**

```javascript
{
  userId: string,                 // UID de l'utilisateur
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  month: string,                  // Format "YYYY-MM"
  year: int,                      // Année
  monthIndex: int,                // Index du mois (0-11)
  score: int,                     // Score final du mois (0-100)
  completed: boolean,             // Quiz du mois complété
  completedAt: Timestamp,         // Date de complétion
  updatedAt: Timestamp            // Dernière mise à jour
}
```

**Index requis:**

- `userId` (ASC) + `year` (ASC)

#### 5. Collection `resources/`

**Document ID:** Auto-généré

**Structure:**

```javascript
{
  title: string,                  // Titre de la ressource
  description: string,            // Description
  type: string,                   // 'pdf' | 'video' | 'link' | 'document'
  url: string,                    // URL de la ressource
  category: string,               // Catégorie
  tags: array,                    // Tags pour filtrage
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  createdAt: Timestamp,
  createdBy: string,
  active: boolean
}
```

#### 6. Collection `auditLogs/`

**Document ID:** Auto-généré

**Structure:**

```javascript
{
  action: string,                 // Type d'action (CREATE, UPDATE, DELETE)
  entity: string,                 // Type d'entité (question, user, etc.)
  entityId: string,               // ID de l'entité
  userId: string,                 // UID de l'admin qui a fait l'action
  userEmail: string,
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  details: object,                // Détails de l'action
  timestamp: Timestamp,
  ip: string                      // Adresse IP (optionnel)
}
```

#### 7. Collection `importLogs/`

**Document ID:** Auto-généré

**Structure:**

```javascript
{
  fileName: string,               // Nom du fichier importé
  totalQuestions: int,            // Nombre total de questions
  successCount: int,              // Nombre de succès
  errorCount: int,                // Nombre d'erreurs
  errors: array,                  // Liste des erreurs
  userId: string,                 // UID de l'admin
  clientId: string,               // ⚠️ CRITIQUE: Isolation multi-tenant
  timestamp: Timestamp
}
```

### Règles de Sécurité Firestore (firestore.rules)

**⚠️ CRITIQUE:** Isolation multi-tenant stricte

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // ⚠️ CRITIQUE: Helper pour isolation multi-tenant
    function getCurrentUserClientId() {
      let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return userDoc.data.get('clientId', 'default');
    }

    // ⚠️ CRITIQUE: Vérifier que deux utilisateurs sont du même client
    function sameClient(userId) {
      let currentUserDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      let targetUserDoc = get(/databases/$(database)/documents/users/$(userId));
      return currentUserDoc.data.clientId == targetUserDoc.data.clientId;
    }

    // Collection: users
    match /users/{userId} {
      // Lecture - Isolation multi-tenant stricte
      allow get: if isOwner(userId) ||
                    (isAdmin() && sameClient(userId)) ||
                    (isAuthenticated() && resource.data.clientId == getCurrentUserClientId());

      // Liste - Admins peuvent lire tous les utilisateurs du même client
      allow list: if isAdmin();

      // Création - Permettre création initiale du profil
      allow create: if isOwner(userId) &&
                       request.resource.data.email is string &&
                       request.resource.data.clientId is string;

      // Modification - User peut modifier son profil (sauf rôle et clientId)
      allow update: if (isOwner(userId) &&
                          (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'clientId']))) ||
                       (isAdmin() && sameClient(userId));

      // Suppression - Seulement admins du même client
      allow delete: if isAdmin() && sameClient(userId);
    }

    // Collection: questions
    match /questions/{questionId} {
      // Lecture - Utilisateurs authentifiés
      allow get, list: if isAuthenticated();

      // Écriture - Seulement admins du même client
      allow create, update, delete: if isAdmin() &&
                                        request.resource.data.clientId == getCurrentUserClientId();

      // Validation des données lors de la création/modification
      allow create, update: if isAdmin() &&
        request.resource.data.clientId == getCurrentUserClientId() &&
        request.resource.data.question is string &&
        request.resource.data.question.size() >= 10 &&
        request.resource.data.options is list &&
        request.resource.data.options.size() == 4 &&
        request.resource.data.correctAnswer is int &&
        request.resource.data.correctAnswer >= 0 &&
        request.resource.data.correctAnswer <= 3 &&
        request.resource.data.explanation is string &&
        request.resource.data.explanation.size() >= 20 &&
        request.resource.data.module in ['auto', 'loisir', 'vr', 'tracteur'] &&
        request.resource.data.month is int &&
        request.resource.data.month >= 1 &&
        request.resource.data.month <= 12;
    }

    // Collection: quizResults
    match /quizResults/{resultId} {
      // Lecture - Ses propres résultats OU admins
      allow get: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());

      // Liste - Utilisateurs authentifiés
      allow list: if isAuthenticated();

      // Création - Validation stricte
      allow create: if isAuthenticated() &&
                   request.resource.data.userId == request.auth.uid &&
                   request.resource.data.score is int &&
                   request.resource.data.score >= 0 &&
                   request.resource.data.score <= 100 &&
                   request.resource.data.totalQuestions is int &&
                   request.resource.data.totalQuestions > 0 &&
                   request.resource.data.correctAnswers is int &&
                   request.resource.data.correctAnswers >= 0 &&
                   request.resource.data.correctAnswers <= request.resource.data.totalQuestions &&
                   request.resource.data.moduleId is string &&
                   request.resource.data.moduleId in ['auto', 'loisir', 'vr', 'tracteur'];

      // Modification/Suppression - Admins du même client
      allow update, delete: if isAdmin() && sameClient(resource.data.userId);
    }

    // Collection: monthlyProgress
    match /monthlyProgress/{progressId} {
      // Lecture - Sa propre progression OU admins
      allow get: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());

      // Liste - Utilisateurs authentifiés
      allow list: if isAuthenticated();

      // Écriture - Validation stricte
      allow create, update: if isAuthenticated() &&
                               request.resource.data.userId == request.auth.uid;

      // Suppression - Admins du même client
      allow delete: if isAdmin() && sameClient(resource.data.userId);
    }

    // Collection: resources
    match /resources/{resourceId} {
      // Lecture - Utilisateurs authentifiés
      allow get, list: if isAuthenticated();

      // Écriture - Admins du même client
      allow create, update, delete: if isAdmin() &&
                                        request.resource.data.clientId == getCurrentUserClientId();
    }

    // Collection: importLogs
    match /importLogs/{logId} {
      // Lecture - Admins du même client
      allow get: if isAdmin() &&
                    resource.data.clientId == getCurrentUserClientId();
      allow list: if isAdmin() &&
                     request.query.where('clientId', '==', getCurrentUserClientId());

      // Création - Admins du même client
      allow create: if isAdmin() &&
                      request.resource.data.clientId == getCurrentUserClientId();

      // Modification/Suppression - Interdite (logs immuables)
      allow update, delete: if false;
    }

    // Collection: auditLogs
    match /auditLogs/{logId} {
      // Lecture - Admins du même client
      allow get: if isAdmin() &&
                    resource.data.clientId == getCurrentUserClientId();
      allow list: if isAdmin() &&
                     request.query.where('clientId', '==', getCurrentUserClientId());

      // Création - Admins du même client
      allow create: if isAdmin() &&
                      request.resource.data.clientId == getCurrentUserClientId();

      // Modification/Suppression - Interdite (logs immuables)
      allow update, delete: if false;
    }
  }
}
```

### Index Firestore (firestore.indexes.json)

**⚠️ CRITIQUE:** Les index suivants sont OBLIGATOIRES pour les performances

```json
{
  "indexes": [
    {
      "collectionGroup": "quizResults",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "completedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "quizResults",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientId", "order": "ASCENDING" },
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientId", "order": "ASCENDING" },
        { "fieldPath": "module", "order": "ASCENDING" },
        { "fieldPath": "month", "order": "ASCENDING" },
        { "fieldPath": "year", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientId", "order": "ASCENDING" },
        { "fieldPath": "averageScore", "order": "DESCENDING" },
        { "fieldPath": "totalQuizzes", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Cloud Functions (functions/index.js)

**⚠️ IMPORTANT:** Créer 2 Cloud Functions pour les statistiques admin

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// ⚠️ CORS Configuration
const cors = require('cors')({ origin: true });

/**
 * Cloud Function: getGlobalStats
 * Retourne les statistiques globales pour le dashboard admin
 */
exports.getGlobalStats = functions.https.onCall(async (data, context) => {
  // Vérifier que l'utilisateur est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié');
  }

  try {
    const userId = context.auth.uid;

    // Récupérer le profil utilisateur pour vérifier le rôle et le clientId
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Accès refusé. Rôle admin requis.');
    }

    const clientId = userDoc.data().clientId;

    // Requêtes parallèles pour les statistiques
    const [usersSnapshot, quizResultsSnapshot, questionsSnapshot] = await Promise.all([
      db.collection('users').where('clientId', '==', clientId).get(),
      db.collection('quizResults').where('clientId', '==', clientId).get(),
      db.collection('questions').where('clientId', '==', clientId).get(),
    ]);

    const totalUsers = usersSnapshot.size;
    const totalQuizzes = quizResultsSnapshot.size;
    const totalQuestions = questionsSnapshot.size;

    // Calculer le score moyen
    let totalScore = 0;
    quizResultsSnapshot.forEach((doc) => {
      totalScore += doc.data().score || 0;
    });
    const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;

    return {
      totalUsers,
      totalQuizzes,
      totalQuestions,
      averageScore,
    };
  } catch (error) {
    console.error('Erreur getGlobalStats:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Cloud Function: getModuleStats
 * Retourne les statistiques par module
 */
exports.getModuleStats = functions.https.onCall(async (data, context) => {
  // Même vérifications que getGlobalStats...

  try {
    // ... (code similaire)

    // Statistiques par module
    const moduleStats = {};
    quizResultsSnapshot.forEach((doc) => {
      const data = doc.data();
      const moduleId = data.moduleId;

      if (!moduleStats[moduleId]) {
        moduleStats[moduleId] = { count: 0, totalScore: 0 };
      }

      moduleStats[moduleId].count++;
      moduleStats[moduleId].totalScore += data.score || 0;
    });

    // Calculer les moyennes
    Object.keys(moduleStats).forEach((moduleId) => {
      const stats = moduleStats[moduleId];
      stats.averageScore = stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0;
    });

    return moduleStats;
  } catch (error) {
    console.error('Erreur getModuleStats:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

---

## 🎯 FONCTIONNALITÉS PRINCIPALES (à implémenter EXACTEMENT)

### 1. AUTHENTIFICATION (auth.js)

#### Google Sign-In

```javascript
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Créer ou mettre à jour le profil utilisateur dans Firestore
    await createOrUpdateUser(user);

    return user;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
}
```

#### Création/Mise à jour du profil (firestore-service.js)

```javascript
export async function createOrUpdateUser(user) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // ⚠️ IMPORTANT: Déterminer le clientId
    // Option 1: Depuis l'email (domaine)
    // Option 2: Depuis un paramètre URL
    // Option 3: Client par défaut
    const clientId = determineClientId(user.email);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      clientId: clientId, // ⚠️ CRITIQUE
      role: 'user',
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      totalQuizzes: 0,
      averageScore: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
  } else {
    // Mettre à jour lastLogin
    await updateDoc(userRef, {
      lastLogin: Timestamp.now(),
    });
  }
}

function determineClientId(email) {
  // Logique pour déterminer le clientId
  // Exemple: Si email se termine par @avantage-plus.com → clientId = 'avantage-plus'
  // Sinon: clientId = 'default-client-001'

  const domain = email.split('@')[1];

  if (domain === 'avantage-plus.com') {
    return 'avantage-plus';
  }

  return 'default-client-001';
}
```

#### Protection des routes admin (admin-auth-guard.js)

```javascript
export async function requireAdmin() {
  const user = auth.currentUser;

  if (!user) {
    window.location.href = '/';
    throw new Error('Non authentifié');
  }

  const userDoc = await getDoc(doc(db, 'users', user.uid));

  if (!userDoc.exists() || userDoc.data().role !== 'admin') {
    window.location.href = '/';
    throw new Error('Accès refusé. Rôle admin requis.');
  }

  return user;
}
```

### 2. TABLEAU DE BORD (dashboard.js)

#### Interface principale

- **Header avec gradient rouge** (--ap-gradient-primary)
- **Streak Badge** animé (🔥 emoji + nombre de jours)
- **Grille de 12 cartes mensuelles** (Janvier à Décembre)
- **Navigation vers sélection des modules** au clic sur une carte

#### Cartes mensuelles

```javascript
function createMonthCard(month, index) {
  const card = document.createElement('div');
  card.className = 'month-card';

  // Style différent selon le statut
  if (month.score !== null) {
    // Quiz complété
    card.className += ' completed';
    card.innerHTML = `
      <div class="month-name">${month.name}</div>
      <div class="score">${month.score}%</div>
      <div class="status">✓ Complété</div>
    `;
  } else if (index === currentMonthIndex) {
    // Mois actuel (hero card)
    card.className += ' current hero';
    card.innerHTML = `
      <div class="hero-badge">MOIS ACTUEL</div>
      <div class="month-name">${month.name}</div>
      <button class="cta-button">Commencer le Quiz</button>
    `;
  } else if (index < currentMonthIndex) {
    // Mois passé non complété
    card.className += ' past-incomplete';
    card.innerHTML = `
      <div class="month-name">${month.name}</div>
      <div class="status">⚠️ Non complété</div>
    `;
  } else {
    // Mois futur
    card.className += ' future locked';
    card.innerHTML = `
      <div class="month-name">${month.name}</div>
      <div class="status">🔒 À venir</div>
    `;
  }

  return card;
}
```

#### Calcul des streaks

```javascript
export async function updateStreak(userId, clientId) {
  // Récupérer tous les résultats de l'utilisateur
  const resultsRef = collection(db, 'quizResults');
  const q = query(
    resultsRef,
    where('userId', '==', userId),
    where('clientId', '==', clientId),
    orderBy('completedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  // Calculer la série active
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  let lastDate = null;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const completedAt = data.completedAt.toDate();

    if (!lastDate) {
      // Premier résultat
      const daysDiff = Math.floor((today - completedAt) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        // Complété aujourd'hui ou hier
        currentStreak = 1;
        tempStreak = 1;
      }
    } else {
      // Vérifier si c'est consécutif (jours consécutifs)
      const daysDiff = Math.floor((lastDate - completedAt) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Jour consécutif
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        // Rupture de série
        tempStreak = 1;
      }
    }

    lastDate = completedAt;
  });

  // Mettre à jour le profil utilisateur
  await updateDoc(doc(db, 'users', userId), {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  });

  return { currentStreak, longestStreak };
}
```

### 3. SYSTÈME DE QUIZ (quiz.js)

#### Chargement des questions depuis Firestore

```javascript
async function loadQuizQuestions(moduleId, monthIndex, year) {
  const questionsRef = collection(db, 'questions');

  // ⚠️ IMPORTANT: Filtrer par clientId de l'utilisateur
  const clientId = await getCurrentUserClientId();

  const q = query(
    questionsRef,
    where('clientId', '==', clientId),
    where('module', '==', moduleId),
    where('month', '==', monthIndex + 1), // mois 1-12
    where('year', '==', year),
    where('active', '==', true)
  );

  const snapshot = await getDocs(q);

  const questions = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    questions.push({
      id: doc.id,
      question: data.question,
      options: data.options.map((opt, index) => ({
        id: String.fromCharCode(65 + index), // A, B, C, D
        text: opt,
        correct: index === data.correctAnswer,
      })),
      explanation: data.explanation,
      reference: data.reference || '',
    });
  });

  // Mélanger les questions
  return shuffleArray(questions);
}
```

#### Interface du quiz

- **Écran de question avec 4 options** (A, B, C, D)
- **Timer en haut à droite** (compte le temps)
- **Barre de progression** (question X sur Y)
- **Bouton "Valider la réponse"**
- **Feedback visuel** (vert si correct, rouge si incorrect)
- **Explication après chaque réponse**
- **Système de combo** (x2, x3, x5 si plusieurs bonnes réponses consécutives)
- **Animation confetti** à la fin si score >= 80%

#### Calcul du score final

```javascript
function calculateScore(userAnswers, totalQuestions) {
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    score,
    correctAnswers: correctCount,
    totalQuestions,
    status: getScoreStatus(score),
  };
}

function getScoreStatus(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'needs-improvement';
}
```

#### Sauvegarde du résultat

```javascript
export async function saveQuizResult(quizData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Utilisateur non connecté');

  const clientId = await getCurrentUserClientId();

  const resultData = {
    userId: user.uid,
    clientId: clientId, // ⚠️ CRITIQUE
    userEmail: user.email,
    moduleId: quizData.moduleId,
    moduleName: quizData.moduleName,
    score: quizData.score,
    correctAnswers: quizData.correctAnswers,
    totalQuestions: quizData.totalQuestions,
    timeElapsed: quizData.timeElapsed,
    answers: quizData.answers,
    date: Timestamp.now(),
    completedAt: Timestamp.now(),
    month: quizData.month,
    year: quizData.year,
  };

  // Sauvegarder le résultat
  await addDoc(collection(db, 'quizResults'), resultData);

  // Mettre à jour la progression mensuelle
  await updateMonthlyProgress(user.uid, quizData.monthIndex, quizData.score, clientId);

  // Mettre à jour les stats utilisateur
  await updateUserStats(user.uid, quizData.score);

  // Mettre à jour la série (streak)
  await updateStreak(user.uid, clientId);
}
```

### 4. INTERFACE ADMIN (admin-dashboard.js, admin-questions.js, admin-users.js)

#### Dashboard Admin

**Statistiques globales** (cartes):

- Nombre total d'utilisateurs
- Nombre total de quiz complétés
- Score moyen global
- Nombre total de questions

**Graphiques** (Chart.js):

- Évolution sur 30 jours (ligne)
- Répartition par module (donut)
- Activité des 7 derniers jours (barres)

**Top 10 utilisateurs** (leaderboard):

- Avatar + nom + email
- Score moyen
- Nombre de quiz complétés

**Activité récente**:

- Liste des 20 derniers quiz complétés
- Nom utilisateur + module + score + date

#### Gestion des questions (admin-questions.js)

**Formulaire de création:**

- Module (select: auto, loisir, vr, tracteur)
- Mois (select: 1-12)
- Année (input number)
- Question (textarea, min 10 caractères)
- 4 options de réponse (inputs)
- Bonne réponse (radio buttons A/B/C/D)
- Explication (textarea, min 20 caractères)

**Validation côté client:**

```javascript
function validateQuestionForm(formData) {
  const errors = [];

  if (!formData.module) errors.push('Module requis');
  if (!formData.month) errors.push('Mois requis');
  if (!formData.year) errors.push('Année requise');

  if (formData.question.length < 10) {
    errors.push('Question trop courte (min 10 caractères)');
  }

  if (formData.explanation.length < 20) {
    errors.push('Explication trop courte (min 20 caractères)');
  }

  formData.options.forEach((opt, i) => {
    if (opt.length < 2) {
      errors.push(`Option ${String.fromCharCode(65 + i)} trop courte`);
    }
  });

  if (formData.correctAnswer === null || formData.correctAnswer === undefined) {
    errors.push('Bonne réponse non sélectionnée');
  }

  return errors;
}
```

**Import JSON batch:**

- Drag & drop ou browse
- Format JSON attendu:

```json
[
  {
    "question": "Quelle est la durée de la garantie AT?",
    "options": ["1 an", "2 ans", "3 ans", "5 ans"],
    "correctAnswer": 2,
    "explanation": "La garantie AT est de 3 ans...",
    "module": "auto",
    "month": 11,
    "year": 2025
  }
]
```

- Validation avant import
- Rapport d'import (succès/erreurs)
- Log dans `importLogs/`

**Liste des questions:**

- Filtres: module, mois, année, recherche
- Pagination (20 questions par page)
- Actions: Modifier, Supprimer
- Confirmation avant suppression

#### Gestion des utilisateurs (admin-users.js)

**Liste des utilisateurs:**

- Filtres: rôle (user/admin), statut (actif/inactif)
- Recherche par nom ou email
- Affichage: Avatar + nom + email + rôle + stats (score moyen, nombre de quiz)
- Actions: Modifier rôle, Supprimer

**Modification du rôle:**

```javascript
async function updateUserRole(userId, newRole) {
  // ⚠️ IMPORTANT: Vérifier que l'utilisateur est du même client
  const currentUser = auth.currentUser;
  const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
  const targetUserDoc = await getDoc(doc(db, 'users', userId));

  if (currentUserDoc.data().clientId !== targetUserDoc.data().clientId) {
    throw new Error("Accès refusé. Utilisateur d'un autre client.");
  }

  // Créer un log d'audit
  await addDoc(collection(db, 'auditLogs'), {
    action: 'UPDATE',
    entity: 'user',
    entityId: userId,
    userId: currentUser.uid,
    userEmail: currentUser.email,
    clientId: currentUserDoc.data().clientId,
    details: {
      field: 'role',
      oldValue: targetUserDoc.data().role,
      newValue: newRole,
    },
    timestamp: Timestamp.now(),
  });

  // Mettre à jour le rôle
  await updateDoc(doc(db, 'users', userId), {
    role: newRole,
    updatedAt: Timestamp.now(),
  });
}
```

### 5. HISTORIQUE DES RÉSULTATS (results.html)

#### Interface

- **Header avec gradient rouge**
- **Filtres:** Module, période (mois/année)
- **Tableau des résultats:**
  - Date
  - Module
  - Score (avec badge coloré selon performance)
  - Temps écoulé
  - Nombre de questions
  - Actions (Détails)
- **Modal détails:** Liste de toutes les questions avec réponses correctes/incorrectes

#### Badges de performance

```javascript
function getPerformanceBadge(score) {
  if (score >= 90) return { text: 'Excellent', class: 'badge-excellent', color: 'green' };
  if (score >= 80) return { text: 'Très bien', class: 'badge-good', color: 'blue' };
  if (score >= 60) return { text: 'Bien', class: 'badge-fair', color: 'yellow' };
  return { text: 'À améliorer', class: 'badge-poor', color: 'red' };
}
```

### 6. RESSOURCES (resources.html)

#### Interface

- **Header avec gradient rouge**
- **Grille de cartes de ressources:**
  - Titre
  - Description
  - Type (PDF, Vidéo, Lien)
  - Bouton "Télécharger" ou "Ouvrir"
- **Filtres:** Type, catégorie, tags

---

## 🔒 SÉCURITÉ (à implémenter OBLIGATOIREMENT)

### 1. Protection XSS (security.js)

**⚠️ CRITIQUE:** Toutes les données utilisateur doivent être échappées avant insertion dans le DOM

```javascript
/**
 * Échappe les caractères HTML dangereux
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

/**
 * Validation d'email
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validation de score (0-100)
 */
export function validateScore(score) {
  return Number.isInteger(score) && score >= 0 && score <= 100;
}
```

**Utilisation obligatoire:**

```javascript
// ❌ DANGEREUX - Ne JAMAIS faire ça
element.innerHTML = user.displayName;

// ✅ CORRECT - Toujours échapper
import { escapeHtml } from './security.js';
element.innerHTML = escapeHtml(user.displayName);

// ✅ ENCORE MIEUX - Utiliser textContent quand possible
element.textContent = user.displayName;
```

### 2. Rate Limiting (rate-limiter.js)

**⚠️ CRITIQUE:** Protection contre les abus (DDoS, spam)

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  checkLimit(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Nettoyer les anciennes requêtes
    const validRequests = userRequests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      throw new Error('Trop de requêtes. Veuillez patienter.');
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }
}

// Instances globales
const firestoreRateLimiter = new RateLimiter(100, 60000); // 100 req/min
const firestoreWriteRateLimiter = new RateLimiter(50, 60000); // 50 write/min

/**
 * Wrapper pour requêtes Firestore avec rate limiting
 */
export async function safeFirestoreRead(operation) {
  const userId = auth.currentUser?.uid || 'anonymous';
  firestoreRateLimiter.checkLimit(userId);

  return await operation();
}

export async function safeFirestoreWrite(operation) {
  const userId = auth.currentUser?.uid || 'anonymous';
  firestoreWriteRateLimiter.checkLimit(userId);

  return await operation();
}
```

**Utilisation obligatoire:**

```javascript
// ❌ DANGEREUX - Pas de rate limiting
const snapshot = await getDocs(query(collection(db, 'questions')));

// ✅ CORRECT - Avec rate limiting
import { safeFirestoreRead } from './rate-limiter.js';

const snapshot = await safeFirestoreRead(() => getDocs(query(collection(db, 'questions'))));
```

### 3. Gestion des Erreurs (error-handler.js)

```javascript
/**
 * Gestionnaire d'erreurs centralisé
 */
export function handleError(error, context = '') {
  console.error(`[ERROR] ${context}:`, error);

  let userMessage = 'Une erreur est survenue. Veuillez réessayer.';

  // Messages personnalisés selon le type d'erreur
  if (error.code === 'permission-denied') {
    userMessage = "Accès refusé. Vous n'avez pas les permissions nécessaires.";
  } else if (error.code === 'not-found') {
    userMessage = 'Ressource non trouvée.';
  } else if (error.code === 'unavailable') {
    userMessage = 'Service temporairement indisponible. Veuillez réessayer.';
  } else if (error.message.includes('Trop de requêtes')) {
    userMessage = 'Trop de requêtes. Veuillez patienter quelques secondes.';
  }

  // Afficher un toast à l'utilisateur
  toast.error(userMessage, 5000);

  // Logger l'erreur (optionnel: envoyer à un service de monitoring)
  // trackError(error, context);
}

/**
 * Setup des gestionnaires d'erreurs globaux
 */
export function setupGlobalErrorHandlers() {
  // Erreurs JavaScript non catchées
  window.addEventListener('error', (event) => {
    handleError(event.error, 'Uncaught Error');
  });

  // Promesses rejetées non catchées
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'Unhandled Promise Rejection');
  });
}
```

### 4. Retry Handler (retry-handler.js)

```javascript
/**
 * Retry automatique avec backoff exponentiel
 */
export async function withFirestoreRetry(operation, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Ne pas retry si erreur de permission
      if (error.code === 'permission-denied') {
        throw error;
      }

      // Attendre avant de retry (backoff exponentiel)
      const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.warn(`Retry ${attempt + 1}/${maxRetries} après ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
```

---

## 🎯 GESTION D'ÉTAT CENTRALISÉE (state-manager.js)

**⚠️ IMPORTANT:** Éviter les variables globales éparpillées

```javascript
class StateManager {
  constructor() {
    this.state = {
      // Auth state
      currentUser: null,
      isDemoMode: false,

      // Dashboard state
      monthsData: [],
      currentMonthIndex: null,
      annualProgress: {},

      // Quiz state
      currentQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: [],
      startTime: null,
      timerInterval: null,
      isPaused: false,
      pausedDuration: 0,
      currentStreak: 0,

      // Admin state
      globalStats: null,
      topUsers: [],
      recentActivity: [],
    };

    this.listeners = new Map();
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    this.notify(key, value, oldValue);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);

    // Retourner fonction de désabonnement
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  notify(key, newValue, oldValue) {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach((callback) => callback(newValue, oldValue));
  }

  reset() {
    this.state = { ...this.constructor().state };
  }
}

export const stateManager = new StateManager();
```

---

## 📱 PROGRESSIVE WEB APP (PWA)

### 1. Manifest (manifest.json)

```json
{
  "name": "Avantage QUIZZ",
  "short_name": "QUIZZ",
  "description": "Plateforme de formation continue Avantage Plus",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#C41E3A",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' fill='%23C41E3A'/%3E%3Ctext x='96' y='130' text-anchor='middle' font-size='120' fill='white' font-family='Arial'%3EQ%3C/text%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' fill='%23C41E3A'/%3E%3Ctext x='256' y='350' text-anchor='middle' font-size='320' fill='white' font-family='Arial'%3EQ%3C/text%3E%3C/svg%3E",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
```

### 2. Service Worker (service-worker.js)

**⚠️ IMPORTANT:** Cache strategy pour mode offline

```javascript
const CACHE_VERSION = '2025-11-20-v1.0.0';
const STATIC_CACHE = `avantage-quizz-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `avantage-quizz-dynamic-${CACHE_VERSION}`;
const QUESTIONS_CACHE = `avantage-quizz-questions-${CACHE_VERSION}`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/results.html',
  '/resources.html',
  '/css/output.css',
  '/css/colors-avantage-plus.css',
  '/js/firebase-config.js',
  '/js/auth.js',
  '/js/dashboard.js',
  '/js/quiz.js',
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS)));
});

// Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== QUESTIONS_CACHE
          )
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch - Strategy: Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Stratégie selon le type de ressource
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firestore')) {
    // API: Network First
    event.respondWith(networkFirst(request));
  } else if (CORE_ASSETS.includes(url.pathname)) {
    // Assets core: Cache First
    event.respondWith(cacheFirst(request));
  } else {
    // Autres: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Strategies
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });

  return cached || fetchPromise;
}
```

---

## 🧪 TESTS & QUALITÉ

### 1. Tests Unitaires (Vitest)

**Configuration:** `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.config.js'],
    },
  },
});
```

**Exemples de tests:**

```javascript
// tests/security.test.js
import { describe, it, expect } from 'vitest';
import { escapeHtml, validateEmail, validateScore } from '../js/security.js';

describe('security.js', () => {
  describe('escapeHtml', () => {
    it('should escape HTML tags', () => {
      const input = '<script>alert("XSS")</script>';
      const output = escapeHtml(input);
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });

    it('should escape quotes', () => {
      const input = 'Test "quotes" and \'apostrophes\'';
      const output = escapeHtml(input);
      expect(output).toContain('&quot;');
      expect(output).toContain('&#039;');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateScore', () => {
    it('should validate scores 0-100', () => {
      expect(validateScore(0)).toBe(true);
      expect(validateScore(50)).toBe(true);
      expect(validateScore(100)).toBe(true);
    });

    it('should reject invalid scores', () => {
      expect(validateScore(-1)).toBe(false);
      expect(validateScore(101)).toBe(false);
      expect(validateScore(50.5)).toBe(false);
      expect(validateScore('50')).toBe(false);
    });
  });
});
```

### 2. Tests E2E (Playwright)

**Configuration:** `playwright.config.js`

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Exemples de tests:**

```javascript
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#login-view')).toBeVisible();
    await expect(page.locator('#google-signin-btn')).toBeVisible();
    await expect(page.getByText('Connexion avec Google')).toBeVisible();
  });

  test('should redirect to dashboard after login', async ({ page }) => {
    // Ce test nécessite une configuration pour mocker Firebase Auth
    // ou utiliser un compte de test
  });
});

// e2e/dashboard.spec.js
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Se connecter avec un compte de test
    await page.goto('/');
    // ... mock login ...
  });

  test('should display 12 month cards', async ({ page }) => {
    await expect(page.locator('.month-card')).toHaveCount(12);
  });

  test('should highlight current month', async ({ page }) => {
    const currentMonthCard = page.locator('.month-card.current');
    await expect(currentMonthCard).toBeVisible();
    await expect(currentMonthCard.getByText('MOIS ACTUEL')).toBeVisible();
  });
});

// e2e/quiz.spec.js
test.describe('Quiz', () => {
  test('should start quiz and answer questions', async ({ page }) => {
    // ... setup ...

    // Cliquer sur la carte du mois actuel
    await page.locator('.month-card.current').click();

    // Sélectionner un module
    await page.locator('[data-module="auto"]').click();

    // Attendre le chargement des questions
    await expect(page.locator('.quiz-question')).toBeVisible();

    // Répondre à la première question
    await page.locator('.quiz-option').first().click();
    await page.locator('button:has-text("Valider")').click();

    // Vérifier le feedback
    await expect(page.locator('.feedback-correct, .feedback-incorrect')).toBeVisible();
  });
});
```

### 3. Linting & Formatting

**ESLint:** `.eslintrc.json`

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "prefer-const": "error"
  }
}
```

**Prettier:** `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 🚀 BUILD & DÉPLOIEMENT

### 1. Package.json

```json
{
  "name": "avantage-quizz",
  "version": "1.0.0",
  "description": "Plateforme de formation continue Avantage Plus",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npm run build:css && vite build",
    "build:css": "tailwindcss -i ./css/input.css -o ./css/output.css --minify",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  },
  "dependencies": {
    "firebase": "^12.5.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "@vitest/coverage-v8": "^4.0.6",
    "@vitest/ui": "^4.0.6",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^9.1.2",
    "firebase-admin": "^13.6.0",
    "happy-dom": "^20.0.10",
    "http-server": "^14.1.1",
    "prettier": "^3.6.2",
    "tailwindcss": "^3.3.5",
    "vite": "^7.1.12",
    "vitest": "^4.0.6"
  }
}
```

### 2. Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
        results: 'results.html',
        resources: 'resources.html',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

### 3. Tailwind Configuration (tailwind.config.js)

```javascript
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'ap-red': {
          primary: '#C41E3A',
          dark: '#8B1429',
          light: '#E63946',
        },
        'ap-accent': {
          DEFAULT: '#2D3748',
          medium: '#4A5568',
          light: '#718096',
        },
        'ap-silver': {
          DEFAULT: '#C0C7D0',
          dark: '#A0AEC0',
          light: '#E2E8F0',
        },
      },
      backgroundImage: {
        'ap-gradient-primary': 'linear-gradient(135deg, #C41E3A 0%, #8B1429 100%)',
        'ap-gradient-sidebar': 'linear-gradient(180deg, #8B1429 0%, #C41E3A 100%)',
      },
      boxShadow: {
        'ap-md': '0 4px 12px rgba(196, 30, 58, 0.12)',
        'ap-lg': '0 8px 30px rgba(196, 30, 58, 0.15)',
      },
    },
  },
  plugins: [],
};
```

### 4. Firebase Configuration (firebase.json)

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
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

### 5. Commandes de Déploiement

```bash
# 1. Installer les dépendances
npm install

# 2. Compiler Tailwind CSS
npm run build:css

# 3. Build de production
npm run build

# 4. Tester localement
npm run preview

# 5. Déployer sur Firebase
firebase login
firebase deploy
```

---

## 📝 NOTES IMPORTANTES

### ⚠️ ERREURS À ÉVITER (du projet initial)

1. **❌ NE PAS hardcoder le mois actuel**
   - ✅ Utiliser `getCurrentMonthIndex()` dynamique

2. **❌ NE PAS oublier le champ `clientId` dans TOUTES les collections**
   - ✅ Isolation multi-tenant stricte obligatoire

3. **❌ NE PAS utiliser `innerHTML` sans échapper**
   - ✅ Toujours utiliser `escapeHtml()` ou `textContent`

4. **❌ NE PAS oublier le rate limiting**
   - ✅ Wrapper toutes les requêtes Firestore avec `safeFirestoreRead/Write()`

5. **❌ NE PAS créer des fichiers monolithiques > 1000 lignes**
   - ✅ Séparer en modules/services

6. **❌ NE PAS avoir des variables globales éparpillées**
   - ✅ Utiliser `StateManager` centralisé

7. **❌ NE PAS oublier les index Firestore**
   - ✅ Créer tous les index nécessaires dès le début

8. **❌ NE PAS avoir des requêtes Firestore sans retry**
   - ✅ Utiliser `withFirestoreRetry()` pour les opérations critiques

9. **❌ NE PAS avoir des logs d'audit incomplets**
   - ✅ Tracer toutes les actions admin (CREATE, UPDATE, DELETE)

10. **❌ NE PAS avoir des validation insuffisantes**
    - ✅ Validation côté client ET côté serveur (Firestore Rules)

### ✅ BONNES PRATIQUES À SUIVRE

1. **Séparation des responsabilités:**
   - UI Logic (dashboard.js, quiz.js)
   - Business Logic (services/)
   - Data Access (firestore-service.js)
   - Utilities (utils/)

2. **Gestion d'erreurs systématique:**
   - Try/catch partout
   - Messages utilisateur clairs
   - Logs détaillés

3. **Performance:**
   - Lazy loading des modules
   - Cache strategy appropriée
   - Requêtes Firestore optimisées (avec index)
   - Pagination pour grandes listes

4. **Sécurité:**
   - Protection XSS (escapeHtml)
   - Rate limiting (100 req/min)
   - Firestore Rules strictes
   - Validation côté client ET serveur

5. **Accessibilité:**
   - Attributs ARIA
   - Skip links
   - Contrastes WCAG AA
   - Clavier navigation

6. **Mobile-First:**
   - Responsive design
   - Menu hamburger
   - Touch-friendly targets
   - PWA installable

7. **Tests:**
   - Tests unitaires (80%+ coverage)
   - Tests E2E (parcours critiques)
   - Tests de charge

8. **Documentation:**
   - README complet
   - Commentaires dans le code
   - Architecture documentée
   - Guide de test

---

## 🎯 RÉSUMÉ FINAL - CHECKLIST DE CRÉATION

### Phase 1: Setup Initial (Jour 1)

- [ ] Créer le projet avec Vite
- [ ] Installer les dépendances (Firebase, Tailwind)
- [ ] Configurer Tailwind CSS
- [ ] Créer la structure de dossiers complète
- [ ] Créer le projet Firebase
- [ ] Configurer Firebase Auth (Google)
- [ ] Créer les collections Firestore
- [ ] Déployer les règles de sécurité
- [ ] Créer les index Firestore

### Phase 2: Identité Visuelle (Jour 2)

- [ ] Créer `colors-avantage-plus.css` (palette complète)
- [ ] Créer `typography-avantage-plus.css`
- [ ] Créer `animations-avantage-plus.css`
- [ ] Configurer Tailwind avec les couleurs Avantage Plus
- [ ] Créer le logo SVG inline (manifest.json)
- [ ] Tester les contrastes WCAG

### Phase 3: Authentification (Jour 3)

- [ ] Implémenter `firebase-config.js`
- [ ] Implémenter `auth.js` (Google Sign-In)
- [ ] Implémenter `firestore-service.js` (createOrUpdateUser)
- [ ] Implémenter `admin-auth-guard.js` (protection routes)
- [ ] Tester le flow d'authentification
- [ ] Vérifier l'isolation multi-tenant (clientId)

### Phase 4: Dashboard (Jour 4-5)

- [ ] Créer `index.html` avec structure complète
- [ ] Implémenter `dashboard.js`
  - [ ] Génération des 12 cartes mensuelles
  - [ ] Chargement des données Firestore
  - [ ] Calcul des streaks
  - [ ] Navigation vers module selection
- [ ] Créer `sidebar-avantage-plus.css` (navigation latérale)
- [ ] Implémenter le menu hamburger mobile
- [ ] Tester le responsive design

### Phase 5: Système de Quiz (Jour 6-7)

- [ ] Créer l'interface de sélection des modules
- [ ] Implémenter `quiz.js`
  - [ ] Chargement des questions depuis Firestore
  - [ ] Interface de quiz (4 options)
  - [ ] Timer et barre de progression
  - [ ] Validation des réponses
  - [ ] Feedback visuel (vert/rouge)
  - [ ] Système de combo
  - [ ] Calcul du score
  - [ ] Sauvegarde des résultats
- [ ] Implémenter `confetti.js` (animation célébration)
- [ ] Tester le flow complet du quiz

### Phase 6: Historique des Résultats (Jour 8)

- [ ] Créer `results.html`
- [ ] Implémenter `results.js`
  - [ ] Chargement des résultats
  - [ ] Tableau avec filtres
  - [ ] Modal détails
  - [ ] Badges de performance
- [ ] Tester les filtres et le tri

### Phase 7: Interface Admin - Dashboard (Jour 9)

- [ ] Créer `admin.html` avec système de tabs
- [ ] Implémenter `admin-dashboard.js`
  - [ ] Cartes de statistiques globales
  - [ ] Graphiques (Chart.js)
  - [ ] Top 10 utilisateurs
  - [ ] Activité récente
- [ ] Déployer les Cloud Functions (getGlobalStats, getModuleStats)
- [ ] Tester les graphiques et les stats

### Phase 8: Interface Admin - Questions (Jour 10)

- [ ] Implémenter `admin-questions.js`
  - [ ] Formulaire de création
  - [ ] Validation côté client
  - [ ] Import JSON batch
  - [ ] Liste avec filtres
  - [ ] Actions CRUD
  - [ ] Logs d'audit
- [ ] Tester l'import JSON
- [ ] Tester les validations

### Phase 9: Interface Admin - Utilisateurs (Jour 11)

- [ ] Implémenter `admin-users.js`
  - [ ] Liste avec filtres
  - [ ] Modification du rôle
  - [ ] Suppression
  - [ ] Logs d'audit
- [ ] Tester les permissions
- [ ] Tester l'isolation multi-tenant

### Phase 10: Sécurité & Performance (Jour 12)

- [ ] Implémenter `security.js` (escapeHtml, validation)
- [ ] Implémenter `rate-limiter.js`
- [ ] Implémenter `error-handler.js`
- [ ] Implémenter `retry-handler.js`
- [ ] Wrapper toutes les requêtes Firestore
- [ ] Auditer tous les usages de innerHTML
- [ ] Tester les protections XSS
- [ ] Tester le rate limiting

### Phase 11: PWA & Offline (Jour 13)

- [ ] Créer `manifest.json`
- [ ] Implémenter `service-worker.js`
- [ ] Implémenter `offline-manager.js`
- [ ] Implémenter `sync-queue.js`
- [ ] Tester le mode offline
- [ ] Tester l'installation PWA

### Phase 12: Tests (Jour 14-15)

- [ ] Configurer Vitest
- [ ] Écrire tests unitaires
  - [ ] security.js
  - [ ] rate-limiter.js
  - [ ] quiz-scoring.js
  - [ ] month-utils.js
- [ ] Configurer Playwright
- [ ] Écrire tests E2E
  - [ ] Authentification
  - [ ] Dashboard
  - [ ] Quiz complet
  - [ ] Admin CRUD questions
  - [ ] Admin CRUD utilisateurs
- [ ] Vérifier coverage (80%+)

### Phase 13: Optimisations (Jour 16)

- [ ] Optimiser les images (WebP)
- [ ] Minifier CSS/JS
- [ ] Auditer avec Lighthouse (score 90+)
- [ ] Optimiser les requêtes Firestore (utiliser les index)
- [ ] Implémenter le cache intelligent
- [ ] Tester les performances

### Phase 14: Documentation (Jour 17)

- [ ] Écrire `README.md` complet
- [ ] Écrire `ARCHITECTURE.md`
- [ ] Écrire `SETUP.md` (guide installation)
- [ ] Écrire `GUIDE-TEST.md`
- [ ] Documenter les Cloud Functions
- [ ] Créer les commentaires JSDoc

### Phase 15: Déploiement (Jour 18)

- [ ] Tester en local (`npm run preview`)
- [ ] Build de production (`npm run build`)
- [ ] Déployer sur Firebase Hosting
- [ ] Déployer les Cloud Functions
- [ ] Déployer les règles Firestore
- [ ] Créer les index Firestore
- [ ] Vérifier en production
- [ ] Tests de charge

---

## 🏁 RÉSULTAT ATTENDU

À la fin, tu auras créé une application web professionnelle, complète et production-ready :

- ✅ **Authentification Google** fonctionnelle
- ✅ **Tableau de bord** avec 12 mois et progression annuelle
- ✅ **Système de quiz** complet avec feedback en temps réel
- ✅ **Interface admin** complète (dashboard, questions, utilisateurs)
- ✅ **Multi-tenant** avec isolation stricte par clientId
- ✅ **Sécurité robuste** (XSS, rate limiting, Firestore Rules)
- ✅ **PWA installable** avec mode offline
- ✅ **Tests** (unitaires + E2E) avec bonne coverage
- ✅ **Performance optimale** (Lighthouse 90+)
- ✅ **Design moderne** Avantage Plus (rouge + anthracite + argent)
- ✅ **Responsive** mobile-first
- ✅ **Documentation complète**

---

## 📞 SUPPORT & RESSOURCES

### Documentation Officielle

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

### Ressources Utiles

- [Firestore Rules Playground](https://firebase.google.com/docs/rules/simulator)
- [Tailwind UI Components](https://tailwindui.com/)
- [Firebase Extensions](https://firebase.google.com/products/extensions)

---

**🎯 CE PROMPT EST COMPLET ET OPTIMAL POUR RECRÉER L'APPLICATION DE ZÉRO SANS LES ERREURS DU PROJET INITIAL.**

**BONNE CRÉATION ! 🚀**
