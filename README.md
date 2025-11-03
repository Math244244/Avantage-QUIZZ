# Avantage QUIZZ

Application web progressive (PWA) avec Firebase, Firestore et authentification Google.

## 🚀 Technologies utilisées

- **Firebase** (Authentication & Firestore)
- **JavaScript** (Vanilla ES6+)
- **Tailwind CSS** (Framework CSS)
- **PWA** (Progressive Web App - installable sur mobile)

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Un compte Firebase
- npm ou yarn

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez **Authentication** → Méthode de connexion → **Google**
4. Activez **Firestore Database** → Mode test (pour débuter)
5. Allez dans Paramètres du projet → Vos applications → Web
6. Copiez la configuration Firebase

### 3. Mettre à jour la configuration

Ouvrez `js/firebase-config.js` et remplacez les valeurs par votre configuration:

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

### 4. Configurer Firebase Authentication

Dans la console Firebase:
1. Authentication → Paramètres → Domaines autorisés
2. Ajoutez `localhost` et votre domaine de production

### 5. Créer les icônes PWA

Consultez `icons/README.md` pour créer les icônes nécessaires pour l'installation mobile.

## 🎨 Compiler Tailwind CSS

### Mode développement (avec watch)

```bash
npm run dev
```

### Mode production (minifié)

```bash
npm run build
```

## 🌐 Lancer l'application

```bash
npm run serve
```

L'application sera accessible sur: http://localhost:8080

## 📱 Installation sur mobile

1. Ouvrez l'application dans le navigateur mobile (Chrome/Safari)
2. Un bouton "Installer" devrait apparaître
3. Suivez les instructions pour ajouter à l'écran d'accueil

## 📂 Structure du projet

```
Avantage QUIZZ/
├── .github/
│   └── copilot-instructions.md
├── css/
│   ├── input.css          # CSS source avec Tailwind
│   └── output.css         # CSS compilé (généré)
├── js/
│   ├── firebase-config.js # Configuration Firebase
│   ├── auth.js           # Gestion de l'authentification
│   └── app.js            # Logique principale
├── icons/                # Icônes PWA (à créer)
├── index.html            # Page principale
├── manifest.json         # Manifest PWA
├── service-worker.js     # Service Worker pour PWA
├── package.json          # Dépendances npm
├── tailwind.config.js    # Configuration Tailwind
└── README.md            # Ce fichier
```

## 🔐 Fonctionnalités d'authentification

- Connexion avec Google
- Déconnexion
- Gestion de l'état d'authentification
- Affichage du profil utilisateur

## 💾 Firestore

L'application inclut un exemple de test Firestore:
- Ajout de documents à une collection
- Gestion des erreurs

## 🛠️ Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm install` | Installer les dépendances |
| `npm run dev` | Compiler CSS en mode watch |
| `npm run build` | Compiler CSS pour production |
| `npm run serve` | Lancer le serveur local |

## 🔒 Sécurité

⚠️ **Important**: 
- Ne committez JAMAIS votre configuration Firebase avec les vraies clés
- Configurez les règles de sécurité Firestore en production
- Utilisez des variables d'environnement pour les clés sensibles

### Règles Firestore recommandées (pour débuter)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📝 Prochaines étapes

1. ✅ Structure de base créée
2. ✅ Configuration Firebase
3. ✅ Authentification Google
4. ✅ PWA configuré
5. ⏳ Ajouter les fonctionnalités de quiz
6. ⏳ Créer l'interface utilisateur complète
7. ⏳ Ajouter la gestion des données Firestore

## 🐛 Débogage

Si vous rencontrez des problèmes:

1. Vérifiez la console du navigateur (F12)
2. Vérifiez que Firebase est bien configuré
3. Vérifiez que les domaines sont autorisés dans Firebase
4. Vérifiez que Firestore est activé

## 📞 Support

Pour plus d'informations:
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Guide PWA](https://web.dev/progressive-web-apps/)

## 📄 Licence

ISC

---

Créé avec ❤️ pour Avantage QUIZZ
