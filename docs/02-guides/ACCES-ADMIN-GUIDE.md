# 🔐 Guide d'Accès à l'Interface Admin

## 📍 Vous êtes ici : Page principale (index.html)
L'interface admin est sur une **page séparée** : `/admin.html`

---

## ✅ Étapes pour accéder à l'admin

### **Étape 1 : Se connecter**
1. Sur http://localhost:3000
2. Cliquez sur "Connexion avec Google" OU "Mode Démo"
3. Vous arrivez sur le **Tableau de Bord**

### **Étape 2 : Vérifier votre rôle dans Firebase**
1. Ouvrez Firebase Console : https://console.firebase.google.com
2. Sélectionnez votre projet : **avantage-quizz**
3. Menu de gauche → **Firestore Database**
4. Collection **users**
5. Trouvez votre document (votre email)
6. Regardez le champ **`role`** :
   - Si c'est `"user"` → **Vous n'avez PAS accès admin**
   - Si c'est `"admin"` → **Vous AVEZ accès admin**

### **Étape 3 : Se donner les droits admin**
#### Option A : Via Firebase Console (RECOMMANDÉ)
1. Dans Firestore → Collection `users` → Votre document
2. Cliquez sur l'icône **crayon** (éditer)
3. Trouvez le champ `role`
4. Changez `"user"` en `"admin"`
5. Cliquez sur **Update**
6. ✅ C'est fait !

#### Option B : Créer manuellement un document user
Si vous n'avez pas de document user :
1. Firestore → Collection `users`
2. Cliquez sur **Add document**
3. **Document ID** : Votre UID Firebase (voir Authentication)
4. Ajoutez ces champs :
   ```
   email: "votre@email.com"
   displayName: "Votre Nom"
   role: "admin"  ← IMPORTANT
   createdAt: [timestamp actuel]
   ```
5. Cliquez sur **Save**

### **Étape 4 : Recharger la page**
1. Retournez sur http://localhost:3000
2. **Rechargez la page** (F5 ou Ctrl+R)
3. ✅ Le badge "🔰 Administrateur" apparaît dans la sidebar
4. ✅ Le lien "Gestion Admin" apparaît dans le menu de gauche

### **Étape 5 : Accéder à l'interface admin**
1. Cliquez sur **"Gestion Admin 🔰"** dans la sidebar gauche
2. Vous êtes redirigé vers `/admin.html`
3. ✅ Vous voyez maintenant les 2 onglets :
   - **Questions** (créer, importer, gérer)
   - **Utilisateurs** (changer les rôles)

---

## 🎯 Ce que vous DEVEZ voir après avoir les droits admin

### Sur `index.html` (page principale)
```
┌──────────────────────────────────┐
│ QuizPro                          │
│ Formation Continue               │
├──────────────────────────────────┤
│ 📊 Tableau de Bord               │
│ 📋 Mes Résultats                 │
│ 📦 Ressources                    │
│ ⚙️ Gestion Admin 🔰  ← NOUVEAU  │ ✅
├──────────────────────────────────┤
│ 🔰 Administrateur  ← NOUVEAU     │ ✅
│ [Mode Sombre]                    │
│ 👤 Votre Nom                     │
└──────────────────────────────────┘
```

### Sur `admin.html` (page admin)
```
┌─────────────────────────────────────────┐
│ 🔰 Interface d'Administration           │
│ ← Retour au tableau de bord             │
├─────────────────────────────────────────┤
│ [Questions] [Utilisateurs]              │
├─────────────────────────────────────────┤
│ 📝 Créer une nouvelle question          │
│ ┌────────────────────────────────────┐  │
│ │ Question: [___________________]    │  │
│ │ Module:   [Auto ▼]                 │  │
│ │ Mois:     [Novembre ▼]             │  │
│ │ Année:    [2025]                   │  │
│ │ Option A: [___________________]    │  │
│ │ Option B: [___________________]    │  │
│ │ Option C: [___________________]    │  │
│ │ Option D: [___________________]    │  │
│ │ Réponse:  [B ▼]                    │  │
│ │ Explication: [________________]    │  │
│ │ [Créer la question]                │  │
│ └────────────────────────────────────┘  │
│                                          │
│ 📤 Importer depuis JSON                  │
│ ┌────────────────────────────────────┐  │
│ │ [Choisir un fichier] [Importer]    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ 📚 Liste des questions                   │
│ Filtres: [Module ▼] [Mois ▼] [🔍...]   │
│ ┌────────────────────────────────────┐  │
│ │ Q1: Dans quel délai...?            │  │
│ │ Auto | Novembre 2025               │  │
│ │ [✏️ Modifier] [🗑️ Supprimer]       │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🚨 Problèmes Fréquents

### ❌ "Je ne vois pas le lien Gestion Admin"
**Causes possibles :**
1. Vous n'avez pas le rôle `admin` dans Firestore
2. Vous n'avez pas rechargé la page après avoir changé le rôle
3. Le document user n'existe pas

**Solution :**
1. Vérifiez Firestore → Collection `users` → Votre document
2. Vérifiez que `role: "admin"` (avec des guillemets)
3. Rechargez la page (F5)
4. Déconnectez-vous et reconnectez-vous

### ❌ "Je clique sur Gestion Admin mais je suis redirigé vers index.html"
**Cause :** Le fichier `admin-auth-guard.js` vous considère comme non-admin

**Solution :**
1. Ouvrez la Console du navigateur (F12)
2. Regardez les messages d'erreur
3. Vérifiez que `role === "admin"` dans Firestore
4. Essayez en navigation privée

### ❌ "J'ai accès mais je ne vois pas les onglets Questions/Utilisateurs"
**Cause :** Vous êtes peut-être sur `index.html` au lieu de `admin.html`

**Solution :**
1. Vérifiez l'URL : doit être `http://localhost:3000/admin.html`
2. Cliquez sur "Gestion Admin" dans le menu de gauche
3. Ou accédez directement à : http://localhost:3000/admin.html

### ❌ "Le fichier admin.html n'existe pas"
**Cause :** Le fichier n'a pas été créé

**Solution :**
```powershell
# Vérifiez que le fichier existe
Get-ChildItem "C:\Users\guilb\Desktop\Avantage QUIZZ\admin.html"
```
Si le fichier n'existe pas, je peux le recréer pour vous.

---

## 📱 Accès Rapide (après avoir les droits admin)

### URL directe de l'admin
```
http://localhost:3000/admin.html
```

### Navigation depuis le dashboard
```
index.html → Cliquez "Gestion Admin 🔰" → admin.html
```

---

## 🔍 Vérifier votre rôle actuel

### Via la Console du navigateur
1. Ouvrez la page principale (index.html)
2. Appuyez sur **F12** (ouvrir DevTools)
3. Allez dans l'onglet **Console**
4. Tapez :
```javascript
// Vérifier le user actuel
auth.currentUser
// Voir son UID
auth.currentUser.uid
// Aller dans Firestore avec cet UID
```

### Via Firebase Console
1. https://console.firebase.google.com
2. Projet : **avantage-quizz**
3. **Authentication** → Voir votre UID
4. **Firestore Database** → Collection `users` → Document avec votre UID
5. Regardez le champ `role`

---

## ✅ Checklist de Vérification

Avant de dire "ça ne marche pas", vérifiez :

- [ ] Je suis connecté (Google ou Mode Démo)
- [ ] J'ai un document dans Firestore → Collection `users`
- [ ] Mon document a le champ `role: "admin"`
- [ ] J'ai rechargé la page après avoir changé le rôle
- [ ] Je vois le badge "🔰 Administrateur" dans la sidebar
- [ ] Je vois le lien "Gestion Admin" dans le menu
- [ ] Je clique sur "Gestion Admin" et j'arrive sur `/admin.html`
- [ ] Je vois les onglets "Questions" et "Utilisateurs"

Si TOUS ces points sont cochés → ✅ Vous avez accès à l'admin !

---

## 🎓 Résumé en 3 étapes

1. **Connectez-vous** (Google ou Mode Démo)
2. **Donnez-vous le rôle admin** dans Firebase → Firestore → users → `role: "admin"`
3. **Rechargez** la page → Cliquez "Gestion Admin" → Vous y êtes !

---

**Besoin d'aide ?** Vérifiez que :
- Le serveur tourne : `npm run dev`
- Firebase est configuré : `firebase.json` existe
- Les fichiers existent : `admin.html`, `js/admin-questions.js`, etc.
