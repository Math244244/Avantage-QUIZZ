# Guide de Déploiement - Cloud Functions pour Statistiques

**Date:** 2025-11-09  
**Priorité:** P1-2  
**Statut:** ✅ **STRUCTURE CRÉÉE** - ⏳ **EN ATTENTE DE DÉPLOIEMENT**

---

## 📋 Résumé

Ce guide explique comment déployer les Cloud Functions pour l'agrégation des statistiques dans QuizPro. Les fonctions permettent de réduire les coûts Firestore en calculant les statistiques côté serveur.

---

## 🎯 Objectif

Créer deux Cloud Functions :
1. **`getGlobalStats`** : Agrège les statistiques globales (utilisateurs, quiz, questions, ressources)
2. **`getModuleStats`** : Agrège les statistiques par module

---

## ✅ Structure Créée

```
functions/
├── index.js          # Code des Cloud Functions
├── package.json      # Dépendances Node.js
└── .gitignore       # Fichiers à ignorer
```

---

## 📝 Étapes de Déploiement

### 1️⃣ Installer les Dépendances

```powershell
cd functions
npm install
```

### 2️⃣ Vérifier la Configuration Firebase

Assurez-vous que `firebase.json` contient :

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

✅ **Déjà configuré**

### 3️⃣ Se Connecter à Firebase

```powershell
firebase login
```

### 4️⃣ Déployer les Cloud Functions

```powershell
# Depuis la racine du projet
firebase deploy --only functions
```

Ou déployer une fonction spécifique :

```powershell
firebase deploy --only functions:getGlobalStats
firebase deploy --only functions:getModuleStats
```

---

## 🔧 Configuration Requise

### Firebase CLI

Si Firebase CLI n'est pas installé :

```powershell
npm install -g firebase-tools
```

### Node.js

Les Cloud Functions nécessitent **Node.js 20** (configuré dans `functions/package.json`).

---

## 🧪 Test Local (Optionnel)

Avant de déployer, vous pouvez tester localement avec l'émulateur :

```powershell
cd functions
npm run serve
```

Puis dans un autre terminal :

```powershell
firebase emulators:start --only functions
```

---

## 📊 Utilisation dans le Code Client

Le code client (`js/admin-dashboard.js`) est déjà configuré pour :

1. **Essayer d'utiliser la Cloud Function** en premier
2. **Fallback automatique** sur le code client si la fonction n'est pas disponible

Aucune modification supplémentaire n'est nécessaire dans le code client.

---

## 🔒 Sécurité

Les Cloud Functions vérifient :
- ✅ Authentification de l'appelant (`context.auth`)
- ✅ Validation du `clientId` pour isolation multi-tenant
- ✅ Gestion d'erreurs robuste

---

## 💰 Coûts

### Avant (Code Client)
- **~5-10 lectures Firestore** par chargement du dashboard
- **Coût estimé:** ~$0.0001 par chargement

### Après (Cloud Function)
- **~3-5 lectures Firestore** par appel de fonction
- **Coût estimé:** ~$0.00005 par appel + coût d'invocation Cloud Function (~$0.0000004)

**Économie estimée:** ~50% de réduction des coûts Firestore

---

## 📈 Avantages

1. **Performance** : Calculs côté serveur plus rapides
2. **Coûts** : Réduction des lectures Firestore
3. **Scalabilité** : Gestion automatique de la charge
4. **Cache** : Possibilité d'ajouter un cache côté serveur (futur)

---

## ⚠️ Notes Importantes

1. **Premier déploiement** : Peut prendre 2-5 minutes
2. **Cold Start** : Première invocation peut être plus lente (~1-2 secondes)
3. **Quotas** : Vérifier les quotas Firebase Functions dans la console
4. **Monitoring** : Surveiller les logs dans Firebase Console > Functions

---

## 🐛 Dépannage

### Erreur: "Function not found"
- Vérifier que la fonction est déployée : `firebase functions:list`
- Vérifier le nom de la fonction dans le code client

### Erreur: "Permission denied"
- Vérifier que l'utilisateur est authentifié
- Vérifier que le `clientId` est fourni

### Erreur: "Module not found"
- Exécuter `npm install` dans le dossier `functions`
- Vérifier que `package.json` contient toutes les dépendances

---

## ✅ Checklist de Déploiement

- [ ] Installer les dépendances (`cd functions && npm install`)
- [ ] Se connecter à Firebase (`firebase login`)
- [ ] Vérifier la configuration (`firebase.json`)
- [ ] Déployer les fonctions (`firebase deploy --only functions`)
- [ ] Tester dans l'interface admin
- [ ] Vérifier les logs dans Firebase Console

---

## 📞 Support

- **Documentation Firebase Functions** : https://firebase.google.com/docs/functions
- **Firebase Console** : https://console.firebase.google.com
- **Logs Functions** : Firebase Console > Functions > Logs

---

**Note** : Le code client fonctionne déjà avec un fallback automatique. Les Cloud Functions peuvent être déployées à tout moment sans impact sur l'application existante.

