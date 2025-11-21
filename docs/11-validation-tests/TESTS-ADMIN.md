# 🧪 Guide de Tests - Interface Admin QuizPro

## ✅ Modifications Complétées

### 1. **Suppression de la difficulté** ✓
- ❌ Aucun champ `difficulty` dans la structure des questions
- ✅ `firestore.rules` : Validation sans `difficulty`
- ✅ `quiz.js` : Questions de démo sans `difficulty`
- ✅ `admin-questions.js` : Formulaire sans sélection de difficulté
- ✅ `CAHIER-DES-CHARGES-ADMIN.md` : Spécification complète

### 2. **Cartes de mois corrigées** ✓
- ✅ **Complété** (vert) : Mois avec score !== null
- ✅ **Pas encore complété** (gris) : Mois passé avec score === null
- ✅ **En cours** (bleu) : Mois actuel (novembre)
- ✅ **Verrouillé** (gris clair) : Mois futurs

### 3. **Infrastructure Admin** ✓
- ✅ `admin.html` : Interface avec 2 onglets (Questions, Users)
- ✅ `admin-questions.js` : CRUD complet + import JSON
- ✅ `admin-users.js` : Gestion des rôles
- ✅ `admin-auth-guard.js` : Protection des routes
- ✅ Navigation admin : Visible uniquement si `role === 'admin'`

---

## 🧪 Plan de Tests

### **Phase 1 : Authentification**

#### Test 1.1 : Connexion avec Google
1. Ouvrir http://localhost:3000
2. Cliquer sur "Connexion avec Google"
3. ✅ Vérifier : Redirection vers dashboard après connexion

#### Test 1.2 : Affichage Admin (si admin)
1. Connecté en tant qu'admin
2. ✅ Vérifier : Badge "🔰 Administrateur" visible dans la sidebar
3. ✅ Vérifier : Lien "Gestion Admin 🔰" visible dans le menu

#### Test 1.3 : Affichage Standard (si user)
1. Connecté en tant qu'utilisateur normal
2. ✅ Vérifier : Badge admin NON visible
3. ✅ Vérifier : Lien admin NON visible

---

### **Phase 2 : Dashboard**

#### Test 2.1 : Cartes de mois - États
1. Accéder au dashboard
2. ✅ Vérifier les mois PASSÉS :
   - Si complété → Carte verte avec score affiché
   - Si non complété → Carte grise "Pas encore complété 0%"
3. ✅ Vérifier le mois ACTUEL (Novembre) :
   - Carte bleue avec badge "ACTIF"
   - Bouton "Démarrer le quiz"
4. ✅ Vérifier les mois FUTURS :
   - Carte grise clair avec cadenas
   - "Disponible le 1er du mois"

#### Test 2.2 : Progression annuelle
1. ✅ Vérifier : Barre de progression = (mois complétés / 12)
2. ✅ Vérifier : Texte "X/12 modules complétés"

---

### **Phase 3 : Interface Admin**

#### Test 3.1 : Accès à l'admin (protégé)
1. **En tant qu'admin** : Cliquer sur "Gestion Admin"
2. ✅ Vérifier : Accès à `/admin.html`
3. **En tant que user** : Tenter d'accéder directement à `/admin.html`
4. ✅ Vérifier : Redirection vers `/index.html` (protection)

#### Test 3.2 : Navigation entre onglets
1. Sur `/admin.html`
2. Cliquer sur "Questions"
3. ✅ Vérifier : Affichage du formulaire de création + liste
4. Cliquer sur "Utilisateurs"
5. ✅ Vérifier : Affichage de la liste des users

---

### **Phase 4 : Gestion des Questions**

#### Test 4.1 : Créer une question manuellement
1. Onglet "Questions"
2. Remplir le formulaire :
   - **Question** : "Test question - Quelle est la bonne réponse?"
   - **Module** : Auto
   - **Mois** : Novembre
   - **Année** : 2025
   - **Option A** : Mauvaise réponse 1
   - **Option B** : Bonne réponse ✅
   - **Option C** : Mauvaise réponse 2
   - **Option D** : Mauvaise réponse 3
   - **Réponse correcte** : B
   - **Explication** : Explication de test
3. Cliquer sur "Créer la question"
4. ✅ Vérifier : Message de succès
5. ✅ Vérifier : Question apparaît dans la liste en bas
6. ✅ Vérifier : **AUCUN champ "difficulty"** dans la question créée

#### Test 4.2 : Import JSON
1. Créer un fichier `test-questions.json` :

```json
[
  {
    "question": "Question importée - Quel est le délai standard?",
    "options": ["24h", "48h", "72h", "7 jours"],
    "correctAnswer": 1,
    "explanation": "Le délai standard est de 48 heures.",
    "module": "auto",
    "month": "novembre",
    "year": 2025
  },
  {
    "question": "Question importée 2 - Quelle est la limite?",
    "options": ["1000$", "2500$", "5000$", "Illimité"],
    "correctAnswer": 1,
    "explanation": "La limite est de 2500$.",
    "module": "loisir",
    "month": "novembre",
    "year": 2025
  }
]
```

2. Dans l'onglet Questions, cliquer sur "Choisir un fichier"
3. Sélectionner `test-questions.json`
4. Cliquer sur "Importer"
5. ✅ Vérifier : Message "2 questions importées avec succès"
6. ✅ Vérifier : 2 nouvelles questions dans la liste
7. ✅ Vérifier : **AUCUN champ "difficulty"** dans les questions importées

#### Test 4.3 : Validation JSON (avec difficulty - DOIT ÉCHOUER)
1. Créer un fichier `test-invalid.json` :

```json
[
  {
    "question": "Question avec difficulty - NE DOIT PAS PASSER",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "difficulty": "facile",
    "explanation": "Test",
    "module": "auto",
    "month": "novembre",
    "year": 2025
  }
]
```

2. Tenter d'importer ce fichier
3. ✅ Vérifier : **Message d'erreur** "Le champ 'difficulty' n'est pas autorisé"
4. ✅ Vérifier : Import refusé

#### Test 4.4 : Filtres de questions
1. Liste des questions en bas de la page
2. **Filtre Module** : Sélectionner "Auto"
3. ✅ Vérifier : Seules les questions du module Auto apparaissent
4. **Filtre Mois** : Sélectionner "Novembre"
5. ✅ Vérifier : Seules les questions de novembre apparaissent
6. **Recherche** : Taper "délai"
7. ✅ Vérifier : Seules les questions contenant "délai" apparaissent

#### Test 4.5 : Modifier une question
1. Cliquer sur "✏️ Modifier" d'une question
2. ✅ Vérifier : Modal s'ouvre avec données pré-remplies
3. Modifier le texte de la question
4. Cliquer sur "Enregistrer"
5. ✅ Vérifier : Message de succès
6. ✅ Vérifier : Question mise à jour dans la liste

#### Test 4.6 : Supprimer une question
1. Cliquer sur "🗑️ Supprimer" d'une question
2. ✅ Vérifier : Confirmation demandée
3. Confirmer la suppression
4. ✅ Vérifier : Message de succès
5. ✅ Vérifier : Question disparaît de la liste

---

### **Phase 5 : Gestion des Utilisateurs**

#### Test 5.1 : Liste des utilisateurs
1. Onglet "Utilisateurs"
2. ✅ Vérifier : Liste de tous les utilisateurs
3. ✅ Vérifier : Chaque user a :
   - Photo de profil
   - Nom + email
   - Badge de rôle (🔰 Admin ou 👤 Utilisateur)
   - Date d'inscription

#### Test 5.2 : Filtres utilisateurs
1. **Filtre Rôle** : Sélectionner "Admin"
2. ✅ Vérifier : Seuls les admins apparaissent
3. **Filtre Rôle** : Sélectionner "Utilisateur"
4. ✅ Vérifier : Seuls les users apparaissent
5. **Recherche** : Taper un nom d'utilisateur
6. ✅ Vérifier : Résultats filtrés

#### Test 5.3 : Changer le rôle d'un utilisateur
1. Trouver un utilisateur standard
2. Cliquer sur "Modifier le rôle"
3. ✅ Vérifier : Modal s'ouvre
4. Sélectionner "Administrateur"
5. Cliquer sur "Enregistrer"
6. ✅ Vérifier : Message de succès
7. ✅ Vérifier : Badge passe de "👤" à "🔰"
8. Répéter pour rétrograder : Admin → Utilisateur
9. ✅ Vérifier : Badge passe de "🔰" à "👤"

---

### **Phase 6 : Permissions Firebase**

#### Test 6.1 : Lecture questions (tous)
1. Connecté en tant qu'utilisateur normal
2. ✅ Vérifier : Peut charger les questions pour un quiz

#### Test 6.2 : Écriture questions (admin seulement)
1. **En tant qu'admin** : Créer une question
2. ✅ Vérifier : Succès
3. **En tant que user** : Tenter de créer une question (via console)
4. ✅ Vérifier : Erreur Firebase "Permission denied"

#### Test 6.3 : Modification rôles (admin seulement)
1. **En tant qu'admin** : Modifier un rôle utilisateur
2. ✅ Vérifier : Succès
3. **En tant que user** : Tenter de modifier un rôle (via console)
4. ✅ Vérifier : Erreur Firebase "Permission denied"

---

### **Phase 7 : Logs et Audits**

#### Test 7.1 : Logs d'import
1. Importer des questions via JSON
2. Aller dans Firestore Console → Collection `importLogs`
3. ✅ Vérifier : Log créé avec :
   - `userId` : ID de l'admin
   - `fileName` : nom du fichier JSON
   - `questionsCount` : nombre de questions importées
   - `timestamp` : date/heure
   - `status` : "success"

#### Test 7.2 : Logs d'audit
1. Créer une question
2. Aller dans Firestore Console → Collection `auditLogs`
3. ✅ Vérifier : Log créé avec :
   - `action` : "question_created"
   - `userId` : ID de l'admin
   - `details` : informations sur la question
   - `timestamp` : date/heure

---

## 📊 Récapitulatif des Tests

### Checklist Finale

- [ ] ✅ Authentification Google fonctionne
- [ ] ✅ Navigation admin visible uniquement pour admins
- [ ] ✅ Cartes de mois affichent les 3 états correctement
- [ ] ✅ Protection de `/admin.html` (redirection si non-admin)
- [ ] ✅ Création manuelle de question SANS difficulty
- [ ] ✅ Import JSON valide SANS difficulty
- [ ] ✅ Import JSON AVEC difficulty → REJETÉ
- [ ] ✅ Filtres de questions fonctionnent
- [ ] ✅ Modification de question fonctionne
- [ ] ✅ Suppression de question fonctionne
- [ ] ✅ Liste des utilisateurs affichée
- [ ] ✅ Changement de rôle utilisateur fonctionne
- [ ] ✅ Permissions Firebase respectées
- [ ] ✅ Logs d'import créés
- [ ] ✅ Logs d'audit créés

---

## 🚀 Commandes Utiles

```powershell
# Démarrer le serveur de développement
npm run dev

# Compiler le CSS
npm run build

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Ouvrir la console Firebase
firebase open
```

---

## 🐛 Problèmes Connus

### Problème : Questions en double dans l'import
**Solution** : Ajouter une vérification de doublons dans `admin-questions.js`

### Problème : Badge admin ne disparaît pas après changement de rôle
**Solution** : Recharger la page ou déconnecter/reconnecter

---

## 📝 Notes Importantes

1. **PAS DE DIFFICULTY** : Aucune question ne doit avoir de champ `difficulty`
2. **Validation stricte** : Le JSON doit respecter le format exact (voir CAHIER-DES-CHARGES-ADMIN.md)
3. **Sécurité** : Les règles Firebase empêchent toute modification non autorisée
4. **Logs** : Toutes les actions admin sont enregistrées dans `auditLogs`

---

## ✅ Résultat Attendu

À la fin des tests, vous devez avoir :
- ✅ Une interface admin complète et fonctionnelle
- ✅ Des questions créées sans champ `difficulty`
- ✅ Des utilisateurs avec rôles (admin/user) gérés correctement
- ✅ Une protection des routes admin efficace
- ✅ Des logs d'audit pour traçabilité
- ✅ Des cartes de mois affichant les bons états

---

**Date de création** : 2 novembre 2025  
**Version** : 1.0  
**Statut** : ✅ Prêt pour les tests
