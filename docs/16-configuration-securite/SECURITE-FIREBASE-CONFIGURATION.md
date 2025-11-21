# 🔐 Configuration de Sécurité Firebase

## ⚠️ IMPORTANT : Clé API Firebase Exposée

La clé API Firebase est exposée dans le code source côté client (`js/firebase-config.js`). **C'est normal et attendu** pour Firebase, car Firebase est conçu pour fonctionner avec des clés API publiques côté client.

## 🛡️ PROTECTION REQUISE

### 1. Restrictions d'API dans Google Cloud Console

**Action requise** : Configurer les restrictions d'API pour limiter l'utilisation de la clé.

**Étapes** :
1. Aller dans [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionner le projet : `avantage-quizz`
3. Aller dans **APIs & Services** > **Credentials**
4. Trouver la clé API : `AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0`
5. Cliquer sur **Edit** (icône crayon)
6. Dans **Application restrictions** :
   - Sélectionner **HTTP referrers (web sites)**
   - Ajouter les domaines autorisés :
     ```
     https://avantage-quizz.web.app/*
     https://avantage-quizz.firebaseapp.com/*
     http://localhost:3200/*
     http://127.0.0.1:3200/*
     ```
7. Dans **API restrictions** (optionnel mais recommandé) :
   - Sélectionner **Restrict key**
   - Cocher uniquement :
     - Firebase Authentication API
     - Cloud Firestore API
     - Firebase Realtime Database API
8. Cliquer sur **Save**

### 2. Surveillance des Quotas et Coûts

**Action requise** : Configurer des alertes pour surveiller l'utilisation.

**Étapes** :
1. Aller dans [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner le projet : `avantage-quizz`
3. Aller dans **Usage and billing**
4. Configurer des alertes :
   - Alerte à 50% du quota
   - Alerte à 80% du quota
   - Alerte à 90% du quota
5. Configurer des alertes de coûts :
   - Alerte à $10/mois
   - Alerte à $50/mois
   - Alerte à $100/mois

### 3. Règles Firestore (Déjà Configurées ✅)

Les règles Firestore dans `firestore.rules` protègent les données côté serveur. **Ne jamais les assouplir** sans validation de sécurité.

### 4. Firebase App Check (Recommandé pour Production)

**Action recommandée** : Activer Firebase App Check pour une protection supplémentaire.

**Étapes** :
1. Aller dans Firebase Console > **App Check**
2. Activer App Check pour :
   - Web App
   - Utiliser reCAPTCHA v3
3. Configurer les domaines autorisés

## 📋 CHECKLIST DE SÉCURITÉ

- [ ] Restrictions HTTP referrers configurées
- [ ] Restrictions API configurées (optionnel)
- [ ] Alertes de quota configurées
- [ ] Alertes de coûts configurées
- [ ] Règles Firestore déployées et testées
- [ ] Firebase App Check activé (recommandé)

## ⚠️ RAPPEL IMPORTANT

**Ne JAMAIS utiliser cette clé API pour des opérations sensibles côté serveur.**

Toute la sécurité repose sur :
1. Les règles Firestore (côté serveur)
2. Les restrictions d'API (Google Cloud Console)
3. La validation des données (côté client ET serveur)

---

**Date de création** : Novembre 2025  
**Dernière mise à jour** : Novembre 2025


