# 🔧 Guide - Activer les APIs Google Cloud pour avantage-quizz

**Projet Firebase:** `avantage-quizz`  
**Project ID:** `avantage-quizz`  
**Project Number:** `919472910099`

---

## 🎯 Problème

Le projet Firebase existe, mais il n'apparaît pas dans Google Cloud Console ou les APIs nécessaires ne sont pas activées.

---

## ✅ Solution 1: Accéder au Projet via Firebase Console

### Étape 1: Aller dans Firebase Console
1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionner le projet **"Avantage QUIZZ"** (`avantage-quizz`)

### Étape 2: Ouvrir Google Cloud Console depuis Firebase
1. Dans Firebase Console, aller dans **⚙️ Paramètres du projet** (en haut à gauche)
2. Cliquer sur **"Paramètres du projet"**
3. Faire défiler jusqu'à **"Votre projet"**
4. Cliquer sur **"Ouvrir dans Google Cloud Console"** (lien bleu)

Cela ouvrira Google Cloud Console avec le projet `avantage-quizz` sélectionné.

---

## ✅ Solution 2: Activer les APIs Directement

### Via Firebase Console (Recommandé)

1. Aller sur [Firebase Console](https://console.firebase.google.com/project/avantage-quizz)
2. Aller dans **⚙️ Paramètres du projet** > **"Paramètres du projet"**
3. Faire défiler jusqu'à **"Votre projet"**
4. Cliquer sur **"Ouvrir dans Google Cloud Console"**

### Via URL Directe

Vous pouvez accéder directement au projet via cette URL :
```
https://console.cloud.google.com/home/dashboard?project=avantage-quizz
```

---

## 🔧 Activer les APIs Nécessaires

Une fois dans Google Cloud Console avec le projet `avantage-quizz` sélectionné :

### 1. Aller dans APIs & Services
- Menu latéral > **APIs & Services** > **Library**

### 2. Activer les APIs Suivantes

Rechercher et activer chacune de ces APIs :

#### ✅ Cloud Functions API
- Rechercher : `Cloud Functions API`
- Cliquer sur **"Activer"**

#### ✅ Cloud Build API
- Rechercher : `Cloud Build API`
- Cliquer sur **"Activer"**

#### ✅ Artifact Registry API
- Rechercher : `Artifact Registry API`
- Cliquer sur **"Activer"**

#### ✅ Cloud Logging API
- Rechercher : `Cloud Logging API`
- Cliquer sur **"Activer"**

---

## 🚀 Vérification

Après avoir activé les APIs, vérifier que tout est correct :

```powershell
# Vérifier que le projet est bien sélectionné
firebase use avantage-quizz

# Essayer de déployer à nouveau
firebase deploy --only functions
```

---

## 📋 Checklist

- [ ] Accéder à Firebase Console
- [ ] Sélectionner le projet "Avantage QUIZZ"
- [ ] Ouvrir Google Cloud Console depuis Firebase
- [ ] Activer Cloud Functions API
- [ ] Activer Cloud Build API
- [ ] Activer Artifact Registry API
- [ ] Activer Cloud Logging API
- [ ] Réessayer le déploiement

---

## 🔗 Liens Utiles

- **Firebase Console:** https://console.firebase.google.com/project/avantage-quizz
- **Google Cloud Console (direct):** https://console.cloud.google.com/home/dashboard?project=avantage-quizz
- **APIs & Services:** https://console.cloud.google.com/apis/library?project=avantage-quizz

---

## ⚠️ Note Importante

Si le projet n'apparaît toujours pas dans Google Cloud Console après avoir suivi ces étapes, il est possible que :
1. Le projet Firebase n'ait pas encore été lié à Google Cloud (cela se fait automatiquement lors de la première utilisation)
2. Vous n'ayez pas les permissions nécessaires sur le projet

Dans ce cas, vous pouvez essayer de déployer directement depuis Firebase CLI - Firebase activera automatiquement les APIs nécessaires lors du premier déploiement.

---

**Note:** Le code client fonctionne déjà avec un fallback automatique. Les Cloud Functions peuvent être déployées plus tard sans impact sur l'application.

