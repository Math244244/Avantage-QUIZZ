# 🔧 Configuration Cloud Function - Création d'Utilisateurs

## 📋 Contexte

Actuellement, l'application QuizPro 2025 permet uniquement l'authentification via **Google OAuth**. Pour permettre aux administrateurs de créer des utilisateurs manuellement avec email/mot de passe, une **Cloud Function Firebase** est nécessaire.

---

## ⚠️ Statut Actuel

**Interface Admin** : ✅ Formulaire de création d'utilisateur implémenté dans `admin.html`  
**Logique JavaScript** : ✅ Gestionnaire prêt dans `admin-users.js`  
**Cloud Function** : ❌ À créer et déployer  
**Firebase Auth Email/Password** : ❌ À activer

---

## 🎯 Objectif

Permettre aux administrateurs de créer des comptes utilisateurs avec :
- Nom complet
- Email
- Mot de passe temporaire
- Rôle (user/admin)

---

## 📝 Étapes de Configuration

### 1️⃣ Activer l'authentification Email/Password

1. Aller dans **Firebase Console**
2. **Authentication** → **Sign-in method**
3. Activer **Email/Password**
4. Sauvegarder

### 2️⃣ Installer Firebase Functions

```powershell
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser les fonctions
firebase init functions

# Choisir:
# - JavaScript ou TypeScript (recommandé: JavaScript)
# - Installer les dépendances: Oui
```

### 3️⃣ Créer la Cloud Function

**Fichier** : `functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function pour créer un utilisateur avec email/password
 * Accessible uniquement par les administrateurs
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  // Vérifier que l'appelant est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié pour appeler cette fonction.'
    );
  }

  // Vérifier que l'appelant est admin
  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore()
    .collection('users')
    .where('uid', '==', callerUid)
    .limit(1)
    .get();

  if (callerDoc.empty) {
    throw new functions.https.HttpsError('permission-denied', 'Utilisateur non trouvé');
  }

  const callerData = callerDoc.docs[0].data();
  if (callerData.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Seuls les administrateurs peuvent créer des utilisateurs.'
    );
  }

  // Valider les données
  const { email, password, displayName, role } = data;

  if (!email || !password || !displayName || !role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Tous les champs sont obligatoires: email, password, displayName, role'
    );
  }

  if (password.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Le mot de passe doit contenir au moins 6 caractères'
    );
  }

  if (!['user', 'admin'].includes(role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Le rôle doit être "user" ou "admin"'
    );
  }

  try {
    // Créer l'utilisateur dans Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false // L'utilisateur devra vérifier son email
    });

    console.log('✅ Utilisateur créé dans Auth:', userRecord.uid);

    // Créer le document utilisateur dans Firestore
    await admin.firestore().collection('users').add({
      uid: userRecord.uid,
      email: email,
      displayName: displayName,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: callerUid,
      lastLogin: null,
      stats: {
        totalQuizzes: 0,
        averageScore: 0,
        totalTime: 0
      }
    });

    console.log('✅ Document Firestore créé pour:', userRecord.uid);

    // Envoyer un email de bienvenue (optionnel)
    // await sendWelcomeEmail(email, displayName, password);

    return {
      success: true,
      uid: userRecord.uid,
      email: email,
      message: 'Utilisateur créé avec succès'
    };

  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error);

    // Gérer les erreurs spécifiques
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'Cette adresse email est déjà utilisée'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Erreur lors de la création de l\'utilisateur: ' + error.message
    );
  }
});
```

### 4️⃣ Déployer la Cloud Function

```powershell
# Déployer uniquement la fonction createUser
firebase deploy --only functions:createUser

# Ou déployer toutes les fonctions
firebase deploy --only functions
```

### 5️⃣ Mettre à jour le code client

**Fichier** : `js/admin-users.js`

Remplacer le bloc `throw new Error(...)` par :

```javascript
import { functions } from './firebase-config.js';
import { httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

// Dans handleCreateUser()
const createUserFunction = httpsCallable(functions, 'createUser');
const result = await createUserFunction(userData);

console.log('✅ Utilisateur créé avec succès:', result.data);

// Afficher le message de succès
successDiv.textContent = `✅ Utilisateur créé avec succès ! Email: ${userData.email}`;
successDiv.classList.remove('hidden');

// Réinitialiser le formulaire
e.target.reset();

// Recharger la liste des utilisateurs
await loadUsers();
```

### 6️⃣ Ajouter functions à firebase-config.js

**Fichier** : `js/firebase-config.js`

```javascript
import { getFunctions } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

// Après initializeApp
export const functions = getFunctions(app);
```

---

## 🧪 Test

1. Se connecter en tant qu'admin
2. Aller dans **Interface Admin** → **Utilisateurs**
3. Remplir le formulaire de création
4. Cliquer sur "Créer l'utilisateur"
5. Vérifier que :
   - L'utilisateur apparaît dans Firebase Auth
   - Le document est créé dans Firestore collection `users`
   - L'utilisateur peut se connecter avec son email/mot de passe

---

## 📊 Structure de données Firestore

**Collection** : `users`

```json
{
  "uid": "abc123...",
  "email": "jean.dupont@example.com",
  "displayName": "Jean Dupont",
  "role": "user",
  "createdAt": "Timestamp",
  "createdBy": "uid-admin",
  "lastLogin": null,
  "stats": {
    "totalQuizzes": 0,
    "averageScore": 0,
    "totalTime": 0
  }
}
```

---

## 🔒 Sécurité

La Cloud Function vérifie :
- ✅ Authentification de l'appelant
- ✅ Rôle admin de l'appelant
- ✅ Validation des données (email, password, role)
- ✅ Longueur minimale du mot de passe (6 caractères)

Les **Firestore Rules** doivent permettre :
- Les admins peuvent lire/écrire dans `users`
- Les users peuvent uniquement lire leur propre document

---

## 📞 Support

- **Documentation Firebase Functions** : https://firebase.google.com/docs/functions
- **Authentification Admin SDK** : https://firebase.google.com/docs/auth/admin

---

## ✅ Checklist Complète

- [ ] Activer Email/Password dans Firebase Auth
- [ ] Installer Firebase Functions (`firebase init functions`)
- [ ] Créer la fonction `createUser` dans `functions/index.js`
- [ ] Déployer la fonction (`firebase deploy --only functions:createUser`)
- [ ] Ajouter `functions` à `firebase-config.js`
- [ ] Mettre à jour `admin-users.js` pour appeler la fonction
- [ ] Tester la création d'un utilisateur
- [ ] Vérifier les permissions Firestore Rules

---

## 🎉 Résultat Attendu

Une fois configuré, les administrateurs pourront :
- ✅ Créer des utilisateurs manuellement
- ✅ Définir des mots de passe temporaires
- ✅ Assigner des rôles (user/admin)
- ✅ Générer des mots de passe aléatoires sécurisés

**Note** : Pour l'instant, le système affiche un message explicite indiquant qu'une Cloud Function est requise. L'interface est prête et fonctionnera immédiatement après le déploiement de la fonction.
