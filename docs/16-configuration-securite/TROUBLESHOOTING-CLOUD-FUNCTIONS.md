# 🔧 Dépannage - Erreur Déploiement Cloud Functions

**Erreur:** `An unexpected error has occurred`

---

## 🔍 Causes Possibles

### 1. Dépendances Non Installées
Les `node_modules` doivent être installés dans le dossier `functions/`.

**Solution:**
```powershell
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

### 2. Version Firebase CLI Obsolète
Une version ancienne de Firebase CLI peut causer des problèmes.

**Solution:**
```powershell
npm install -g firebase-tools@latest
firebase --version  # Vérifier la version (devrait être >= 13.0.0)
```

---

### 3. APIs Google Cloud Non Activées
Certaines APIs nécessaires peuvent ne pas être activées.

**Solution:**
1. Aller dans [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionner le projet `avantage-quizz`
3. Aller dans **APIs & Services** > **Library**
4. Activer les APIs suivantes :
   - Cloud Functions API
   - Cloud Build API
   - Artifact Registry API
   - Cloud Logging API

---

### 4. Permissions Insuffisantes
Le compte Firebase peut ne pas avoir les permissions nécessaires.

**Solution:**
```powershell
# Vérifier les permissions
firebase projects:list

# Se reconnecter si nécessaire
firebase logout
firebase login
```

---

### 5. Problème de Syntaxe dans le Code
Une erreur de syntaxe peut empêcher le déploiement.

**Solution:**
```powershell
cd functions
node -c index.js  # Vérifier la syntaxe
npm run lint      # Vérifier avec ESLint
```

---

### 6. Problème de Taille/Quota
Le package peut être trop volumineux ou le quota dépassé.

**Solution:**
- Vérifier la taille du package (devrait être < 100 MB)
- Vérifier les quotas dans Firebase Console

---

### 7. Problème de Réseau/Connexion
Une connexion instable peut causer l'erreur.

**Solution:**
- Réessayer le déploiement
- Vérifier la connexion Internet
- Utiliser un VPN si nécessaire

---

## 🛠️ Solutions par Ordre de Priorité

### Solution 1: Réinstaller les Dépendances
```powershell
cd functions
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
cd ..
firebase deploy --only functions
```

### Solution 2: Mettre à Jour Firebase CLI
```powershell
npm install -g firebase-tools@latest
firebase deploy --only functions
```

### Solution 3: Vérifier les Logs Détaillés
```powershell
firebase deploy --only functions --debug
```

### Solution 4: Déployer une Fonction à la Fois
```powershell
firebase deploy --only functions:getGlobalStats
# Si ça fonctionne, déployer la deuxième
firebase deploy --only functions:getModuleStats
```

---

## 📋 Checklist de Dépannage

- [ ] Dépendances installées dans `functions/` (`npm install`)
- [ ] Firebase CLI à jour (`firebase-tools@latest`)
- [ ] APIs Google Cloud activées
- [ ] Permissions Firebase correctes
- [ ] Syntaxe du code valide (`node -c index.js`)
- [ ] Connexion Internet stable
- [ ] Quotas Firebase non dépassés

---

## 🔗 Ressources

- **Firebase Console:** https://console.firebase.google.com/project/avantage-quizz
- **Google Cloud Console:** https://console.cloud.google.com
- **Documentation Firebase Functions:** https://firebase.google.com/docs/functions

---

## 💡 Note Importante

Le code client fonctionne déjà avec un **fallback automatique**. Même si le déploiement échoue, l'application continue de fonctionner normalement en utilisant le code client pour calculer les statistiques.

Les Cloud Functions peuvent être déployées plus tard sans impact sur l'application.

