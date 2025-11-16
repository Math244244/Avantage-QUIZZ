# RAPPORT TRANSFERT CONNAISSANCES - PARTIE 2

## 5. FONCTIONNALITÉS PRINCIPALES

### 5.1 Authentification

#### Connexion Google OAuth 2.0

**Flux d'authentification**:

```
1. User clique "Connexion avec Google"
   ↓
2. Popup Google Sign-In (via Firebase Auth)
   ↓
3. User sélectionne compte Google
   ↓
4. Firebase retourne token JWT
   ↓
5. createOrUpdateUser() crée/maj profil Firestore
   ↓
6. Redirection vers dashboard
```

**Code**:

```javascript
// js/auth.js
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Créer profil utilisateur
  await createOrUpdateUser(user);

  return user;
}
```

**Gestion de l'état d'authentification**:

```javascript
onAuthChange((user) => {
  if (user) {
    // User connecté → Charger dashboard
    showView('dashboard');
    loadDashboardData();
  } else {
    // User déconnecté → Afficher login
    showView('login');
  }
});
```

### 5.2 Dashboard Principal

#### Vue d'ensemble

Le dashboard affiche:

1. **Bannière de marque** Avantage Plus
2. **Badge de série** (streak) avec animation flamme 🔥
3. **Grille de 12 cartes mensuelles** (Janvier → Décembre)
4. **Hero Card** pour le mois actuel (mise en avant)

#### Cartes Mensuelles

**États possibles**:

- ✅ **Complété** (score affiché, fond vert)
- 🔒 **Verrouillé** (mois futur, icône cadenas)
- ⏳ **En attente** (mois actuel/passé non complété)

**Code génération**:

```javascript
function generateModuleCards() {
  const currentMonth = getCurrentMonthIndex(); // 0-11
  const currentYear = getCurrentYear(); // 2025

  MONTH_NAMES.forEach((monthName, index) => {
    const monthData = getMonthlyProgress(index);

    const card = createCard({
      month: monthName,
      score: monthData?.score,
      isCompleted: monthData?.completed,
      isCurrentMonth: index === currentMonth,
      isLocked: index > currentMonth,
    });

    modulesGrid.appendChild(card);
  });
}
```

#### Hero Card (Mois Actuel)

**Caractéristiques**:

- Taille 2x (prend 2 colonnes sur desktop)
- Gradient animé
- Bouton CTA "Commencer le Quiz"
- Animation pulse

### 5.3 Système de Quiz

#### Architecture du Quiz

**Étapes**:

1. **Sélection module** (Auto/Loisir/VR/Tracteur)
2. **Chargement questions** depuis Firestore
3. **Affichage questions** une par une
4. **Validation réponse** avec feedback visuel
5. **Calcul score** final
6. **Sauvegarde résultat** dans Firestore
7. **Affichage résultat** avec animation

#### Chargement Questions

```javascript
async function loadQuizFromFirestore(moduleId, monthNumber, year) {
  // Requête Firestore avec filtres
  const q = query(
    collection(db, 'questions'),
    where('module', '==', moduleId),
    where('month', '==', monthNumber),
    where('year', '==', year),
    where('clientId', '==', clientId) // Multi-tenant
  );

  const snapshot = await getDocs(q);
  const questions = snapshot.docs.map((doc) => ({
    id: doc.id,
    question: doc.data().question,
    options: doc.data().options,
    correctAnswer: doc.data().correctAnswer,
    explanation: doc.data().explanation,
  }));

  return questions;
}
```

#### Interface Quiz

**Composants**:

- **Header**: Chronomètre, boutons Pause/Focus/Quitter
- **Progress Bar**: Visualisation progression (ex: "3/10")
- **Question Card**: Question + 4 options (A, B, C, D)
- **Feedback**: Badge de réponse (Correct/Incorrect)
- **Combo System**: Multiplicateur de points (x2, x3, x5)

**Gestion des réponses**:

```javascript
function handleAnswer(selectedOption) {
  const currentQuestion = getCurrentQuiz().questions[getCurrentQuestionIndex()];
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  // Arrêter le chronomètre de la question
  const timeSpent = Date.now() - getQuestionStartTime();

  // Feedback visuel
  if (isCorrect) {
    updateComboStreak(+1);
    showFeedback('Correct!', 'success');
  } else {
    resetComboStreak();
    showFeedback('Incorrect', 'error');
    showExplanation(currentQuestion.explanation);
  }

  // Sauvegarder réponse
  saveUserAnswer({
    questionId: currentQuestion.id,
    selectedOption,
    isCorrect,
    timeSpent,
  });

  // Question suivante ou résultats
  if (hasNextQuestion()) {
    nextQuestion();
  } else {
    showResults();
  }
}
```

#### Calcul du Score

**Formule**:

```javascript
function calculateScore() {
  const correctAnswers = getUserAnswers().filter((a) => a.isCorrect).length;
  const totalQuestions = getCurrentQuiz().questions.length;

  // Score brut (0-100)
  const baseScore = Math.round((correctAnswers / totalQuestions) * 100);

  // Bonus combo (optionnel)
  const comboBonus = calculateComboBonus();

  // Score final
  const finalScore = Math.min(baseScore + comboBonus, 100);

  return {
    score: finalScore,
    correctAnswers,
    totalQuestions,
    comboBonus,
  };
}
```

#### Sauvegarde Résultat

```javascript
async function saveResults() {
  const user = getCurrentUser();
  const quiz = getCurrentQuiz();
  const scoreData = calculateScore();

  const result = {
    userId: user.uid,
    userEmail: user.email,
    clientId: await getCurrentClientId(),
    moduleId: quiz.moduleId,
    moduleName: moduleConfig[quiz.moduleId].name,
    month: quiz.month,
    year: quiz.year,
    score: scoreData.score,
    correctAnswers: scoreData.correctAnswers,
    totalQuestions: scoreData.totalQuestions,
    timeElapsed: calculateElapsedTime(),
    answers: getUserAnswers(),
    completedAt: Timestamp.now(),
  };

  // Sauvegarder dans Firestore
  await saveQuizResult(result);

  // Mettre à jour progression mensuelle
  await updateMonthlyProgress(user.uid, quiz.month, quiz.year, scoreData.score);

  // Mettre à jour statistiques utilisateur
  await updateUserStats(user.uid, scoreData.score);

  // Mettre à jour série
  await updateStreak(user.uid);
}
```

### 5.4 Page Résultats

#### Affichage

**Sections**:

1. **Score principal** (gros chiffre avec animation)
2. **Détails** (bonnes réponses, temps passé)
3. **Graphique radar** des compétences par module
4. **Historique** des 10 derniers quiz
5. **Progression mensuelle** (graphique en barres)

#### Graphiques (Chart.js)

**Radar des compétences**:

```javascript
new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Auto', 'Loisir', 'VR', 'Tracteur'],
    datasets: [
      {
        label: 'Vos scores',
        data: [85, 92, 78, 88],
        backgroundColor: 'rgba(196, 30, 58, 0.2)',
        borderColor: '#C41E3A',
      },
    ],
  },
});
```

### 5.5 Interface Admin

**Accès**: Réservé aux utilisateurs avec `role: 'admin'`

#### Onglet Dashboard

**Statistiques affichées**:

- Total utilisateurs
- Utilisateurs actifs (aujourd'hui, cette semaine)
- Total quiz complétés
- Score moyen global
- Total questions
- Total ressources

**Graphiques**:

1. **Évolution 30 jours** (ligne)
2. **Répartition par module** (doughnut)
3. **Activité 7 jours** (barres)

**Top 10 utilisateurs**:

- Classement par nombre de quiz complétés
- Avatar, nom, score moyen, total quiz

**Activité récente**:

- 20 derniers quiz complétés
- Nom utilisateur, module, score, date

#### Onglet Questions

**Fonctionnalités**:

- ✅ Créer question (formulaire)
- ✅ Importer questions depuis JSON
- ✅ Lister questions (pagination, filtres)
- ✅ Modifier question
- ✅ Supprimer question
- ✅ Statistiques (par module, mois, difficulté)

**Formulaire création**:

```javascript
{
  module: 'auto' | 'loisir' | 'vr' | 'tracteur',
  month: 1-12,
  year: 2025,
  question: string (min 10 chars),
  options: [string, string, string, string],
  correctAnswer: 0-3,
  explanation: string (min 20 chars)
}
```

**Import JSON**:

```json
[
  {
    "module": "auto",
    "month": 11,
    "year": 2025,
    "question": "Quelle est la couverture de la garantie AT?",
    "options": [
      "Moteur seulement",
      "Moteur et transmission",
      "Tous les composants mécaniques",
      "Aucune couverture"
    ],
    "correctAnswer": 2,
    "explanation": "La garantie AT couvre tous les composants mécaniques du véhicule..."
  }
]
```

#### Onglet Utilisateurs

**Fonctionnalités**:

- ✅ Créer utilisateur (email/password temporaire)
- ✅ Lister utilisateurs (filtres: rôle, statut)
- ✅ Modifier rôle (user ↔ admin)
- ✅ Voir statistiques utilisateur
- ⏳ Désactiver utilisateur (à venir)

**Création utilisateur**:

```javascript
{
  displayName: string,
  email: string,
  password: string (min 6 chars, temporaire),
  role: 'user' | 'admin'
}
```

### 5.6 Gamification

#### Système de Série (Streak)

**Logique**:

- +1 jour si quiz complété aujourd'hui
- Réinitialisation si aucun quiz depuis 2 jours
- Affichage badge 🔥 avec animation pulse

**Calcul**:

```javascript
async function updateStreak(userId) {
  const userProfile = await getUserProfile(userId);
  const lastQuizDate = userProfile.lastQuizDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastQuizDate) {
    // Premier quiz
    return { currentStreak: 1 };
  }

  const daysSinceLastQuiz = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));

  if (daysSinceLastQuiz === 0) {
    // Déjà fait aujourd'hui
    return { currentStreak: userProfile.currentStreak };
  } else if (daysSinceLastQuiz === 1) {
    // Jour consécutif
    const newStreak = userProfile.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userProfile.longestStreak),
    };
  } else {
    // Série interrompue
    return { currentStreak: 1 };
  }
}
```

#### Combo System (Quiz)

**Mécanisme**:

- 3 bonnes réponses consécutives = x2
- 5 bonnes réponses consécutives = x3
- 7+ bonnes réponses consécutives = x5

**Affichage**:

- Badge "COMBO x2" avec animation
- Particules de célébration

---

## 6. BASE DE DONNÉES FIREBASE

### 6.1 Cloud Firestore - Collections

#### Collection: `users/`

**Structure**:

```javascript
{
  uid: string,                    // ID Firebase Auth
  email: string,                  // Email utilisateur
  displayName: string,            // Nom affiché
  photoURL: string | null,        // URL avatar Google
  clientId: string,               // ID client (multi-tenant)
  role: 'user' | 'admin',         // Rôle
  createdAt: Timestamp,           // Date création
  lastLogin: Timestamp,           // Dernière connexion
  lastQuizDate: Timestamp | null, // Dernier quiz
  totalQuizzes: number,           // Total quiz complétés
  averageScore: number,           // Score moyen (0-100)
  currentStreak: number,          // Série actuelle
  longestStreak: number,          // Série la plus longue
  updatedAt: Timestamp            // Dernière MAJ
}
```

**Index**:

- `clientId` (simple)
- `clientId + role` (composite)

#### Collection: `questions/`

**Structure**:

```javascript
{
  clientId: string,               // ID client
  module: 'auto' | 'loisir' | 'vr' | 'tracteur',
  month: number,                  // 1-12
  year: number,                   // 2025
  question: string,               // Texte de la question
  options: string[],              // 4 options [A, B, C, D]
  correctAnswer: number,          // Index 0-3
  explanation: string,            // Explication détaillée
  reference: string,              // Référence doc (optionnel)
  tags: string[],                 // Tags pour recherche
  active: boolean,                // Question active?
  createdAt: Timestamp,
  createdBy: string,              // UID admin
  updatedAt: Timestamp
}
```

**Index Firestore requis**:

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "questions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clientId", "order": "ASCENDING" },
        { "fieldPath": "module", "order": "ASCENDING" },
        { "fieldPath": "month", "order": "ASCENDING" },
        { "fieldPath": "year", "order": "ASCENDING" }
      ]
    }
  ]
}
```

#### Collection: `quizResults/`

**Structure**:

```javascript
{
  userId: string,                 // UID utilisateur
  userEmail: string,              // Email (dénormalisé)
  clientId: string,               // ID client
  moduleId: string,               // 'auto', 'loisir', etc.
  moduleName: string,             // Nom lisible
  month: number,                  // 1-12
  year: number,                   // 2025
  score: number,                  // 0-100
  correctAnswers: number,         // Nombre de bonnes réponses
  totalQuestions: number,         // Total questions
  timeElapsed: number,            // Temps passé (secondes)
  answers: [                      // Détail des réponses
    {
      questionId: string,
      selectedOption: number,
      isCorrect: boolean,
      timeSpent: number
    }
  ],
  completedAt: Timestamp,         // Date de complétion
  createdAt: Timestamp
}
```

**Index**:

- `clientId + userId + completedAt` (composite)
- `clientId + moduleId + completedAt` (composite)

#### Collection: `monthlyProgress/`

**Document ID**: `{userId}_{month}_{year}`

**Structure**:

```javascript
{
  userId: string,
  clientId: string,
  month: number,                  // 1-12
  year: number,                   // 2025
  score: number,                  // Meilleur score du mois
  completed: boolean,             // Quiz complété?
  completedAt: Timestamp | null,
  moduleId: string,               // Module complété
  updatedAt: Timestamp
}
```

#### Collection: `resources/`

**Structure**:

```javascript
{
  clientId: string,
  title: string,
  description: string,
  type: 'pdf' | 'video' | 'link',
  url: string,
  module: string,                 // Module associé
  thumbnail: string | null,
  tags: string[],
  active: boolean,
  createdAt: Timestamp,
  createdBy: string
}
```

#### Collection: `auditLogs/`

**Structure**:

```javascript
{
  clientId: string,
  userId: string,
  action: string,                 // 'create', 'update', 'delete'
  resource: string,               // 'question', 'user', etc.
  resourceId: string,
  details: object,                // Détails de l'action
  timestamp: Timestamp,
  ipAddress: string | null
}
```

### 6.2 Règles de Sécurité Firestore

**Fichier**: `firestore.rules`

**Principes**:

1. **Authentification obligatoire** pour toute lecture/écriture
2. **Isolation multi-tenant** via `clientId`
3. **Permissions basées sur rôles** (user vs admin)
4. **Validation des données** côté serveur

**Exemples de règles**:

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

    function getCurrentUserClientId() {
      let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return userDoc.data.get('clientId', 'default');
    }

    function sameClient(userId) {
      let currentUserDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      let targetUserDoc = get(/databases/$(database)/documents/users/$(userId));
      return currentUserDoc.data.clientId == targetUserDoc.data.clientId;
    }

    // Collection: users
    match /users/{userId} {
      // Lecture: soi-même OU admin du même client
      allow get: if isOwner(userId) || (isAdmin() && sameClient(userId));
      allow list: if isAdmin();

      // Création: soi-même (signup)
      allow create: if isOwner(userId) &&
                       request.resource.data.email is string &&
                       request.resource.data.clientId is string;

      // Mise à jour: soi-même (sauf role/clientId) OU admin
      allow update: if (isOwner(userId) &&
                          !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'clientId'])) ||
                       (isAdmin() && sameClient(userId));

      // Suppression: admin seulement
      allow delete: if isAdmin() && sameClient(userId);
    }

    // Collection: questions
    match /questions/{questionId} {
      // Lecture: tous utilisateurs authentifiés
      allow get, list: if isAuthenticated();

      // Écriture: admin seulement, même client
      allow create, update, delete: if isAdmin() &&
                                        request.resource.data.clientId == getCurrentUserClientId();

      // Validation des données
      allow create, update: if isAdmin() &&
        request.resource.data.question is string &&
        request.resource.data.question.size() >= 10 &&
        request.resource.data.options is list &&
        request.resource.data.options.size() == 4 &&
        request.resource.data.correctAnswer is int &&
        request.resource.data.correctAnswer >= 0 &&
        request.resource.data.correctAnswer <= 3 &&
        request.resource.data.module in ['auto', 'loisir', 'vr', 'tracteur'];
    }

    // Collection: quizResults
    match /quizResults/{resultId} {
      // Lecture: soi-même OU admin
      allow get: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());
      allow list: if isAuthenticated();

      // Création: soi-même, validation stricte
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.score is int &&
                       request.resource.data.score >= 0 &&
                       request.resource.data.score <= 100;

      // Mise à jour/suppression: admin seulement
      allow update, delete: if isAdmin() && sameClient(resource.data.userId);
    }

    // Collection: monthlyProgress
    match /monthlyProgress/{progressId} {
      allow get: if isAuthenticated() &&
                    (resource.data.userId == request.auth.uid || isAdmin());
      allow list: if isAuthenticated();
      allow create, update: if isAuthenticated() &&
                               request.resource.data.userId == request.auth.uid;
      allow delete: if isAdmin() && sameClient(resource.data.userId);
    }
  }
}
```

---

**(Suite dans la Partie 3...)**
