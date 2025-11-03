# 📘 CAHIER DES CHARGES V2.0 - QuizPro Amélioré

**Date** : 2 novembre 2025  
**Version** : 2.0 - Améliorations Majeures  
**Statut** : En cours d'implémentation

---

## 🎯 OBJECTIFS DE CETTE VERSION

### Corrections Critiques
1. **Supprimer toutes les questions hardcodées** - Charger depuis Firestore uniquement
2. **Compléter les pages manquantes** - Mes Résultats, Ressources
3. **Améliorer la gestion des utilisateurs** - Création manuelle, profils complets
4. **Enrichir l'interface** - Animations, feedbacks, notifications

### Nouvelles Fonctionnalités
- Système de notifications en temps réel
- Dashboard admin avec analytics avancés
- Page de profil utilisateur complète
- Exports de données (CSV, PDF, Excel)
- Système de badges et récompenses
- Graphiques interactifs avec Chart.js

---

## 🗂️ STRUCTURE DES AMÉLIORATIONS

### 1. QUIZ - Chargement Dynamique
**Problème actuel** : Questions hardcodées dans `quiz.js`  
**Solution** :
```javascript
// AVANT (quiz.js) - ❌ À SUPPRIMER
const quizData = {
  'auto': { questions: [...] } // Hardcodé
}

// APRÈS - ✅ Charger depuis Firestore
async function loadQuizQuestions(module, month, year) {
  const questionsSnapshot = await getDocs(query(
    collection(db, 'questions'),
    where('module', '==', module),
    where('month', '==', month),
    where('year', '==', year)
  ));
  return questionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
```

**Impacts** :
- Les quiz utilisent les vraies questions de l'admin
- Pas de décalage entre admin et quiz
- Facilite la mise à jour du contenu

---

### 2. PAGE "MES RÉSULTATS" - Implémentation Complète

**Emplacement** : Accessible via le menu latéral  
**Fonctionnalités** :

#### 2.1 Vue d'ensemble
```
┌────────────────────────────────────────────┐
│ 📊 Mes Résultats                           │
├────────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│ │ Score    │  │ Quizzes  │  │ Temps    │  │
│ │ Moyen    │  │ Complétés│  │ Total    │  │
│ │  85%     │  │   12/12  │  │  4h 30m  │  │
│ └──────────┘  └──────────┘  └──────────┘  │
├────────────────────────────────────────────┤
│ 📈 Évolution des scores                    │
│ [Graphique linéaire interactif]           │
├────────────────────────────────────────────┤
│ 📋 Historique des quiz                     │
│ ┌────────────────────────────────────────┐ │
│ │ Nov 2025 - Auto         85% ✅         │ │
│ │ 2 nov 2025 - 10:30      [Voir détails]│ │
│ ├────────────────────────────────────────┤ │
│ │ Oct 2025 - Loisir       92% ✅         │ │
│ │ 1 oct 2025 - 14:15      [Voir détails]│ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### 2.2 Détails d'un quiz
- Questions posées + réponses données
- Temps par question
- Explications des erreurs
- Bouton "Refaire ce quiz"

#### 2.3 Statistiques avancées
- Taux de réussite par module
- Questions les plus ratées
- Progression mensuelle
- Comparaison avec la moyenne

**Fichiers à créer** :
- `results.html` - Page principale
- `js/results.js` - Logique de chargement
- `js/charts.js` - Gestion des graphiques

---

### 3. PAGE "RESSOURCES" - Bibliothèque de Documents

**Emplacement** : Accessible via le menu latéral  
**Fonctionnalités** :

#### 3.1 Structure
```
┌────────────────────────────────────────────┐
│ 📚 Ressources                              │
├────────────────────────────────────────────┤
│ [Rechercher...] [Filtrer ▼] [Uploader]    │
├────────────────────────────────────────────┤
│ 📁 Guides de Formation                     │
│ ┌────────────────────────────────────────┐ │
│ │ 📄 Guide Auto - Garanties Prolongées   │ │
│ │ PDF - 2.4 MB - 15 pages                │ │
│ │ [📥 Télécharger] [👁️ Aperçu] [⭐ Fav] │ │
│ ├────────────────────────────────────────┤ │
│ │ 📄 Manuel VR - Inspection PDI          │ │
│ │ PDF - 1.8 MB - 10 pages                │ │
│ │ [📥 Télécharger] [👁️ Aperçu] [⭐ Fav] │ │
│ └────────────────────────────────────────┘ │
├────────────────────────────────────────────┤
│ 🎥 Vidéos Tutoriels                        │
│ ┌────────────────────────────────────────┐ │
│ │ [Thumbnail] Procédure de Réclamation   │ │
│ │ Durée: 5:30 - 250 vues                 │ │
│ │ [▶️ Regarder]                           │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### 3.2 Catégories
- 📁 Guides de formation (PDF)
- 🎥 Vidéos tutoriels
- 📊 Présentations (PowerPoint/PDF)
- 📝 Documents administratifs
- ❓ FAQ interactives
- 🔗 Liens utiles

#### 3.3 Fonctionnalités
- Upload de fichiers (admin uniquement)
- Téléchargement
- Aperçu en ligne (PDF viewer)
- Système de favoris
- Compteur de vues
- Notation et commentaires
- Recherche full-text

**Collections Firestore** :
```javascript
{
  resources: {
    id: auto-generated,
    title: string,
    description: string,
    type: 'pdf' | 'video' | 'ppt' | 'doc' | 'link',
    category: string,
    fileURL: string,
    thumbnailURL: string,
    fileSize: number,
    pageCount: number, // pour PDF
    uploadedBy: userId,
    uploadedAt: timestamp,
    views: number,
    downloads: number,
    favorites: [userId],
    tags: [string],
    rating: number,
    comments: [{ userId, text, date }]
  }
}
```

**Fichiers à créer** :
- `resources.html` - Page principale
- `js/resources.js` - Logique de gestion
- `js/upload.js` - Upload de fichiers avec Firebase Storage

---

### 4. GESTION DES UTILISATEURS - Complet

**Améliorations** :

#### 4.1 Création manuelle d'utilisateurs (Admin)
```html
<div class="modal" id="create-user-modal">
  <h2>➕ Créer un utilisateur</h2>
  <form id="create-user-form">
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="displayName" placeholder="Nom complet" required>
    <input type="password" name="password" placeholder="Mot de passe" required>
    <select name="role">
      <option value="user">Utilisateur</option>
      <option value="admin">Administrateur</option>
    </select>
    <select name="department">
      <option>Ventes</option>
      <option>Service</option>
      <option>Administration</option>
    </select>
    <button type="submit">Créer</button>
  </form>
</div>
```

**Note** : Utiliser Firebase Admin SDK ou Cloud Functions pour créer des users avec email/password

#### 4.2 Profil utilisateur complet
**URL** : `/profile.html?uid=xxx` ou `/profile.html` (profil personnel)

**Contenu** :
```
┌────────────────────────────────────────────┐
│ 👤 Profil de MATTHIEU GUILBAULT            │
├────────────────────────────────────────────┤
│ 📧 quizpro461@gmail.com                    │
│ 🏢 Département: Ventes                     │
│ 🔰 Rôle: Administrateur                    │
│ 📅 Inscrit depuis: 2 novembre 2025         │
│ 🔥 Série active: 10 jours                  │
├────────────────────────────────────────────┤
│ 📊 Statistiques                            │
│ • Quizzes complétés: 12/12 (100%)          │
│ • Score moyen: 85%                         │
│ • Temps total: 4h 30m                      │
│ • Meilleur score: 96% (Auto - Nov)         │
│ • Badges obtenus: 8 🏆                     │
├────────────────────────────────────────────┤
│ 🏆 Badges & Récompenses                    │
│ [🎯 Perfectionniste] [🔥 Série de 10]     │
│ [⚡ Rapide] [🌟 Premier Quiz]              │
├────────────────────────────────────────────┤
│ [✏️ Modifier mon profil] [🔒 Changer MDP] │
└────────────────────────────────────────────┘
```

**Fichiers** :
- `profile.html` - Page de profil
- `js/profile.js` - Gestion du profil
- `js/badges.js` - Système de badges

#### 4.3 Système de badges
**Badges disponibles** :
- 🌟 **Premier pas** : Compléter le premier quiz
- 🎯 **Perfectionniste** : Score de 100%
- 🔥 **Série de feu** : 7 jours consécutifs
- ⚡ **Rapide** : Compléter un quiz en moins de 10 min
- 📚 **Érudit** : Compléter tous les modules d'un mois
- 🏆 **Champion annuel** : 12/12 mois complétés
- 💎 **Expert** : Moyenne de 90%+ sur 5 quiz
- 🌈 **Polyvalent** : Compléter les 4 modules

**Collection Firestore** :
```javascript
{
  userBadges: {
    userId: string,
    badges: [
      {
        badgeId: string,
        name: string,
        icon: string,
        unlockedAt: timestamp,
        description: string
      }
    ]
  }
}
```

---

### 5. SYSTÈME DE NOTIFICATIONS

**Types de notifications** :

#### 5.1 Notifications in-app
```
┌────────────────────────────────────────────┐
│ 🔔 Notifications (3 non lues)              │
├────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐ │
│ │ 🎉 Badge débloqué !                    │ │
│ │ Vous avez obtenu "Perfectionniste"     │ │
│ │ Il y a 5 minutes                       │ │
│ ├────────────────────────────────────────┤ │
│ │ 📝 Nouveau quiz disponible              │ │
│ │ Le quiz de Décembre est prêt !         │ │
│ │ Il y a 2 heures                        │ │
│ ├────────────────────────────────────────┤ │
│ │ 📊 Rapport mensuel                      │ │
│ │ Votre rapport de Novembre est prêt     │ │
│ │ Hier à 18:00                           │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### 5.2 Notifications par email
- Quiz mensuel disponible
- Rappel si quiz non complété
- Badge débloqué
- Rapport mensuel
- Nouvelles ressources disponibles

#### 5.3 Notifications push (PWA)
- Utiliser Firebase Cloud Messaging
- Demander permission au premier lancement
- Gérer les préférences de notifications

**Collections Firestore** :
```javascript
{
  notifications: {
    userId: string,
    type: 'badge' | 'quiz' | 'report' | 'resource' | 'admin',
    title: string,
    message: string,
    icon: string,
    link: string,
    read: boolean,
    createdAt: timestamp
  },
  
  notificationPreferences: {
    userId: string,
    emailNotifications: boolean,
    pushNotifications: boolean,
    types: {
      badges: boolean,
      quizzes: boolean,
      reports: boolean,
      resources: boolean
    }
  }
}
```

**Fichiers** :
- `js/notifications.js` - Gestion des notifications
- `js/email-service.js` - Envoi d'emails (Cloud Functions)
- `js/push-notifications.js` - Notifications push

---

### 6. DASHBOARD ADMIN AVANCÉ

**Améliorations** :

#### 6.1 Vue d'ensemble
```
┌────────────────────────────────────────────────────────────┐
│ 🔰 Dashboard Administrateur                                │
├────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│ │ 👥 Users│ │ 📝 Quiz │ │ 📊 Avg  │ │ 🎯 Compl│          │
│ │   245   │ │   1,234 │ │   87%   │ │   92%   │          │
│ │  +12    │ │  +156   │ │  +2%    │ │  -1%    │          │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
├────────────────────────────────────────────────────────────┤
│ 📈 Activité des 30 derniers jours                          │
│ [Graphique en barres - Quiz complétés par jour]           │
├────────────────────────────────────────────────────────────┤
│ 🏆 Top Performers                  │ ⚠️ À Risque          │
│ 1. Jean Dupont - 96%               │ • Marie L. - Inactif │
│ 2. Sophie Martin - 94%             │ • Paul D. - 3 échecs │
│ 3. Marc Tremblay - 93%             │ • Julie R. - Pas de  │
├────────────────────────────────────┤   connexion (15j)    │
│ 📊 Stats par module                │                      │
│ Auto:    245 quiz - 85% avg        │                      │
│ Loisir:  198 quiz - 88% avg        │                      │
│ VR:      156 quiz - 82% avg        │                      │
│ Tracteur:134 quiz - 86% avg        │                      │
└────────────────────────────────────────────────────────────┘
```

#### 6.2 Rapports exportables
**Formats** :
- CSV (Excel)
- PDF (formaté)
- JSON (API)

**Types de rapports** :
- Rapport mensuel global
- Rapport par utilisateur
- Rapport par module
- Rapport de progression
- Rapport d'activité

**Boutons d'export** :
```html
<div class="export-buttons">
  <button onclick="exportToCSV()">
    📊 Exporter CSV
  </button>
  <button onclick="exportToPDF()">
    📄 Exporter PDF
  </button>
  <button onclick="exportToJSON()">
    💾 Exporter JSON
  </button>
</div>
```

**Fichiers** :
- `js/export-csv.js` - Export CSV
- `js/export-pdf.js` - Export PDF avec jsPDF
- `js/dashboard-admin.js` - Dashboard admin enrichi

---

### 7. AMÉLIORATION UI/UX GLOBALE

#### 7.1 Système de toasts
```javascript
// Toast de succès
showToast({
  type: 'success',
  title: 'Question créée !',
  message: 'La question a été ajoutée avec succès.',
  duration: 3000
});

// Toast d'erreur
showToast({
  type: 'error',
  title: 'Erreur',
  message: 'Impossible de charger les questions.',
  duration: 5000
});

// Toast d'information
showToast({
  type: 'info',
  title: 'Nouveau quiz disponible',
  message: 'Le quiz de Décembre est maintenant accessible.',
  duration: 4000
});
```

**Fichier** : `js/toast.js`

#### 7.2 Confirmations modales améliorées
```javascript
// Confirmation de suppression
confirmModal({
  title: '⚠️ Supprimer cette question ?',
  message: 'Cette action est irréversible.',
  confirmText: 'Supprimer',
  cancelText: 'Annuler',
  confirmClass: 'bg-red-600',
  onConfirm: () => deleteQuestion(id)
});
```

**Fichier** : `js/modal.js`

#### 7.3 Skeletons de chargement
```html
<div class="skeleton-card">
  <div class="skeleton-header"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text short"></div>
  <div class="skeleton-button"></div>
</div>
```

#### 7.4 Animations améliorées
- Fade in/out fluides
- Slide transitions
- Bounce effects sur les boutons
- Shimmer effect pendant chargement
- Confettis améliorés

#### 7.5 Tooltips
```html
<button data-tooltip="Créer une nouvelle question">
  ➕
</button>
```

**Fichier** : `js/tooltips.js`

---

### 8. OPTIMISATIONS TECHNIQUES

#### 8.1 Lazy loading
```javascript
// Charger les images progressivement
<img loading="lazy" src="image.jpg" alt="Description">

// Charger les composants à la demande
const module = await import('./module.js');
```

#### 8.2 Gestion d'erreurs globale
```javascript
// Error boundary
window.addEventListener('error', (event) => {
  logError(event.error);
  showToast({
    type: 'error',
    title: 'Une erreur est survenue',
    message: 'Nos équipes ont été notifiées.'
  });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason);
});
```

**Fichier** : `js/error-handler.js`

#### 8.3 Logging avancé
```javascript
class Logger {
  static info(message, data = {}) {
    console.log(`ℹ️ ${message}`, data);
    this.sendToFirestore('info', message, data);
  }
  
  static error(message, error = {}) {
    console.error(`❌ ${message}`, error);
    this.sendToFirestore('error', message, error);
  }
  
  static warn(message, data = {}) {
    console.warn(`⚠️ ${message}`, data);
    this.sendToFirestore('warn', message, data);
  }
}
```

**Collection** : `logs` dans Firestore

---

### 9. PWA COMPLÈTE

#### 9.1 Service Worker fonctionnel
```javascript
// service-worker.js
const CACHE_NAME = 'quizpro-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/css/output.css',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### 9.2 Manifest amélioré
```json
{
  "name": "QuizPro - Formation Continue",
  "short_name": "QuizPro",
  "description": "Plateforme de formation par quiz pour concessions",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#312e81",
  "theme_color": "#312e81",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

---

## 📁 STRUCTURE DES FICHIERS (Mise à jour)

```
Avantage QUIZZ/
├── index.html (✅ existe)
├── admin.html (✅ existe)
├── results.html (➕ À CRÉER)
├── resources.html (➕ À CRÉER)
├── profile.html (➕ À CRÉER)
├── manifest.json (✅ existe - à améliorer)
├── service-worker.js (➕ À RÉACTIVER)
├── css/
│   ├── input.css (✅ existe)
│   └── output.css (✅ existe)
├── js/
│   ├── firebase-config.js (✅ existe)
│   ├── auth.js (✅ existe)
│   ├── dashboard.js (✅ existe - à modifier)
│   ├── quiz.js (✅ existe - **À MODIFIER MAJEUR**)
│   ├── firestore-service.js (✅ existe)
│   ├── admin-questions.js (✅ existe)
│   ├── admin-users.js (✅ existe)
│   ├── admin-auth-guard.js (✅ existe)
│   ├── results.js (➕ À CRÉER)
│   ├── resources.js (➕ À CRÉER)
│   ├── profile.js (➕ À CRÉER)
│   ├── notifications.js (➕ À CRÉER)
│   ├── badges.js (➕ À CRÉER)
│   ├── charts.js (➕ À CRÉER)
│   ├── export-csv.js (➕ À CRÉER)
│   ├── export-pdf.js (➕ À CRÉER)
│   ├── toast.js (➕ À CRÉER)
│   ├── modal.js (➕ À CRÉER)
│   ├── tooltips.js (➕ À CRÉER)
│   ├── upload.js (➕ À CRÉER)
│   ├── error-handler.js (➕ À CRÉER)
│   └── logger.js (➕ À CRÉER)
├── functions/ (➕ À CRÉER - Cloud Functions)
│   ├── index.js
│   ├── create-user.js
│   ├── send-email.js
│   └── generate-reports.js
└── docs/
    ├── CAHIER-DES-CHARGES-V2.md (✅ ce document)
    ├── AUDIT-COMPLET-200Q.md (✅ existe)
    ├── TESTS-ADMIN.md (✅ existe)
    └── RESUME-FINAL.md (✅ existe)
```

---

## 🚀 PLAN D'IMPLÉMENTATION (5 Phases)

### PHASE 1 : CORRECTIONS CRITIQUES (Priorité Maximale)
**Durée estimée** : 2-3 heures

1. ✅ **Supprimer questions hardcodées dans quiz.js**
   - Retirer l'objet `quizData`
   - Créer fonction `loadQuizFromFirestore(module, month, year)`
   - Adapter le rendu des questions

2. ✅ **Implémenter le chargement dynamique**
   - Queries Firestore optimisées
   - Gestion des cas d'erreur
   - Feedback de chargement (skeleton)

### PHASE 2 : PAGES MANQUANTES (Priorité Haute)
**Durée estimée** : 4-5 heures

3. ✅ **Créer la page "Mes Résultats"**
   - results.html
   - results.js (chargement historique)
   - Graphiques Chart.js
   - Détails par quiz

4. ✅ **Créer la page "Ressources"**
   - resources.html
   - resources.js
   - Upload avec Firebase Storage
   - Viewer PDF intégré

### PHASE 3 : GESTION UTILISATEURS (Priorité Haute)
**Durée estimée** : 3-4 heures

5. ✅ **Création manuelle d'utilisateurs**
   - Modal de création dans admin.html
   - Cloud Function pour créer users avec email/password
   - Validation côté serveur

6. ✅ **Page de profil complète**
   - profile.html
   - profile.js
   - Système de badges
   - Statistiques détaillées

### PHASE 4 : NOTIFICATIONS & UI/UX (Priorité Moyenne)
**Durée estimée** : 4-5 heures

7. ✅ **Système de notifications**
   - notifications.js
   - Collection Firestore
   - Notifications push (PWA)
   - Emails automatiques (Cloud Functions)

8. ✅ **Amélioration UI/UX**
   - Toasts
   - Modales améliorées
   - Skeletons
   - Tooltips
   - Animations

### PHASE 5 : ANALYTICS & EXPORTS (Priorité Basse)
**Durée estimée** : 3-4 heures

9. ✅ **Dashboard admin avancé**
   - Statistiques en temps réel
   - Graphiques interactifs
   - Top performers
   - Alertes automatiques

10. ✅ **Exports de données**
    - Export CSV
    - Export PDF
    - Export JSON
    - Rapports personnalisés

---

## 📊 ESTIMATION TOTALE

**Temps de développement** : 16-21 heures  
**Complexité** : Moyenne-Haute  
**Dépendances externes** :
- Chart.js (graphiques)
- jsPDF (exports PDF)
- Firebase Cloud Functions (création users, emails)
- Firebase Cloud Messaging (notifications push)

---

## ✅ CHECKLIST DE VALIDATION

### Phase 1
- [ ] Questions hardcodées supprimées
- [ ] Quiz charge depuis Firestore
- [ ] Skeleton de chargement affiché
- [ ] Gestion d'erreurs si aucune question

### Phase 2
- [ ] Page "Mes Résultats" accessible
- [ ] Historique des quiz affiché
- [ ] Graphiques fonctionnels
- [ ] Page "Ressources" accessible
- [ ] Upload de fichiers fonctionne
- [ ] Téléchargement fonctionne

### Phase 3
- [ ] Admin peut créer un user avec email/password
- [ ] Page de profil accessible
- [ ] Badges affichés et débloquables
- [ ] Statistiques utilisateur correctes

### Phase 4
- [ ] Notifications in-app fonctionnelles
- [ ] Toasts affichés correctement
- [ ] Modales améliorées
- [ ] Animations fluides

### Phase 5
- [ ] Dashboard admin avec stats avancées
- [ ] Export CSV fonctionne
- [ ] Export PDF fonctionne
- [ ] Rapports générés correctement

---

**STATUT ACTUEL** : ⏳ Prêt à commencer l'implémentation  
**PROCHAINE ÉTAPE** : Phase 1 - Suppression questions hardcodées
