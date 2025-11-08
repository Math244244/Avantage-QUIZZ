# 🧪 GUIDE DE TEST - VALIDATION DES CORRECTIONS
## Vérification Complète Post-Corrections - Avantage QUIZZ

**Date** : Novembre 2025  
**Objectif** : Valider que toutes les corrections fonctionnent et qu'aucune régression n'a été introduite

---

## 📋 CHECKLIST DE VALIDATION RAPIDE

### ✅ Tests Critiques (À faire en premier)

- [ ] **Test 1** : Division par zéro évitée (Section 2)
- [ ] **Test 2** : Mois dynamique (Section 2)
- [ ] **Test 3** : Sauvegarde avec retry (Section 3)
- [ ] **Test 4** : Protection XSS (Section 4)
- [ ] **Test 5** : Timer nettoyé (Section 3)
- [ ] **Test 6** : Transactions Firestore (Section 3)
- [ ] **Test 7** : Validation serveur (Section 2)
- [ ] **Test 8** : Rate limiting (Section 4)

---

## 🚀 DÉMARRAGE RAPIDE

### Option 1 : Tests Automatisés (Recommandé)

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer les tests unitaires
npm test

# Lancer les tests E2E (nécessite un navigateur)
npm run test:e2e

# Lancer tous les tests
npm run test:all
```

### Option 2 : Tests Manuels (Détaillés ci-dessous)

Suivre les scénarios de test manuels pour chaque correction.

---

## 🧪 TESTS PAR SECTION

### SECTION 1 : Architecture et Structure

#### Test 1.1 : Gestion d'erreurs centralisée

**Objectif** : Vérifier que les erreurs sont capturées et loggées

**Scénario** :
1. Ouvrir la console du navigateur (F12)
2. Aller sur la page principale
3. Vérifier dans la console : `✅ Firebase initialisé avec succès`
4. Simuler une erreur : Dans la console, taper `throw new Error('Test erreur')`
5. **Résultat attendu** :
   - ✅ Erreur capturée par `error-handler.js`
   - ✅ Message toast affiché à l'utilisateur
   - ✅ Erreur loggée dans la console

**Fichiers à vérifier** :
- `js/error-handler.js` existe
- `index.html` importe `error-handler.js`

---

#### Test 1.2 : Retry automatique

**Objectif** : Vérifier que les requêtes Firestore sont retentées en cas d'échec

**Scénario** :
1. Ouvrir la console du navigateur
2. Démarrer un quiz
3. Simuler une perte de connexion (DevTools > Network > Offline)
4. Terminer le quiz et tenter de sauvegarder
5. **Résultat attendu** :
   - ✅ Toast "Nouvelle tentative de sauvegarde 1/3..."
   - ✅ Retry automatique avec backoff
   - ✅ Sauvegarde locale si tous les retries échouent

**Fichiers à vérifier** :
- `js/retry-handler.js` existe
- `js/quiz.js` utilise `withFirestoreRetry()`

---

### SECTION 2 : Logique Métier

#### Test 2.1 : Mois dynamique (CRITIQUE)

**Objectif** : Vérifier que le mois change automatiquement

**Scénario** :
1. Aller sur le dashboard (page principale)
2. Vérifier le mois affiché
3. **Résultat attendu** :
   - ✅ Le mois affiché correspond au mois actuel (pas "Novembre 2025" hardcodé)
   - ✅ Si on est en Décembre 2025, ça affiche "Décembre 2025"

**Vérification code** :
```javascript
// Dans js/dashboard.js ligne 15
const currentMonthIndex = getCurrentMonthIndex(); // Doit être dynamique
```

**Test manuel** :
- Changer la date système (si possible) ou attendre le mois suivant
- Vérifier que le dashboard affiche le bon mois

---

#### Test 2.2 : Normalisation du format des mois

**Objectif** : Vérifier que le format des mois est cohérent

**Scénario** :
1. Compléter un quiz
2. Vérifier dans Firestore Console que le champ `month` est au format "Novembre 2025" (première lettre majuscule)
3. Vérifier dans le dashboard que la progression mensuelle s'affiche correctement
4. **Résultat attendu** :
   - ✅ Format "Novembre 2025" partout (pas "novembre 2025")
   - ✅ Progression mensuelle visible dans le dashboard

**Vérification code** :
```javascript
// Dans js/firestore-service.js
const normalizedMonth = normalizeMonthFormat(month); // Doit normaliser
```

**Test Firestore** :
1. Aller dans Firebase Console > Firestore
2. Collection `monthlyProgress`
3. Vérifier que le champ `month` est au format "Novembre 2025"

---

#### Test 2.3 : Validation des scores (Division par zéro)

**Objectif** : Vérifier que la division par zéro est impossible

**Scénario** :
1. Démarrer un quiz
2. **NE PAS répondre à aucune question**
3. Essayer de terminer le quiz (si possible via console ou manipulation)
4. **Résultat attendu** :
   - ✅ Toast d'erreur : "Aucune réponse enregistrée. Le quiz ne peut pas être complété."
   - ✅ Aucun score `NaN` sauvegardé
   - ✅ Quiz ne se termine pas

**Vérification code** :
```javascript
// Dans js/quiz.js ligne 672-676
if (userAnswers.length === 0) {
    toast.error('Aucune réponse enregistrée...');
    return; // Doit empêcher le calcul
}
```

**Test manuel** :
- Ouvrir la console
- Essayer de forcer `showResults()` avec `userAnswers = []`
- Vérifier que ça ne sauvegarde pas de score

---

#### Test 2.4 : Validation côté serveur

**Objectif** : Vérifier que Firestore rejette les scores invalides

**Scénario** :
1. Ouvrir la console du navigateur
2. Essayer de sauvegarder un score invalide via console :
```javascript
// Dans la console
import { saveQuizResult } from './js/firestore-service.js';
await saveQuizResult({
    score: 999, // Score invalide (> 100)
    totalQuestions: 10,
    correctAnswers: 5,
    moduleId: 'auto',
    month: 'Novembre 2025',
    year: 2025
});
```
3. **Résultat attendu** :
   - ✅ Erreur côté client : "Score invalide: 999. Doit être entre 0 et 100."
   - ✅ Si contourné côté client, Firestore rules rejettent

**Vérification Firestore Rules** :
```javascript
// Dans firestore.rules ligne 74-77
request.resource.data.score is int &&
request.resource.data.score >= 0 &&
request.resource.data.score <= 100
```

---

#### Test 2.5 : Filtrage par année

**Objectif** : Vérifier que `getAnnualProgress()` filtre par année

**Scénario** :
1. Créer des données de test dans Firestore pour différentes années
2. Appeler `getAnnualProgress(uid, 2025)`
3. **Résultat attendu** :
   - ✅ Seulement les mois de 2025 sont retournés
   - ✅ Les mois de 2024 ou 2026 ne sont pas inclus

**Vérification code** :
```javascript
// Dans js/firestore-service.js ligne 315-330
const dataYear = data.year || extractYearFromMonth(data.month);
if (dataYear === year) { // Doit filtrer par année
    // ...
}
```

---

### SECTION 3 : Bugs et Stabilité

#### Test 3.1 : Nettoyage du timer

**Objectif** : Vérifier que le timer est nettoyé dans tous les scénarios

**Scénario 1 : Fermeture de l'onglet** :
1. Démarrer un quiz
2. Fermer l'onglet (ou naviguer vers une autre page)
3. **Résultat attendu** :
   - ✅ Timer nettoyé (pas de fuite mémoire)
   - ✅ Pas d'erreur dans la console

**Scénario 2 : Erreur pendant le quiz** :
1. Démarrer un quiz
2. Simuler une erreur (DevTools > Network > Offline)
3. Tenter de sauvegarder
4. **Résultat attendu** :
   - ✅ Timer nettoyé dans le `catch`
   - ✅ Pas de timer qui continue à tourner

**Vérification code** :
```javascript
// Dans js/quiz.js ligne 908-911
window.addEventListener('beforeunload', () => {
    stopTimer(); // Doit être appelé
});
```

**Test manuel** :
- Ouvrir DevTools > Performance
- Démarrer un quiz
- Fermer l'onglet
- Vérifier qu'il n'y a pas de fuite mémoire (timer qui continue)

---

#### Test 3.2 : Notifications utilisateur pour erreurs

**Objectif** : Vérifier que l'utilisateur est informé des erreurs

**Scénario** :
1. Démarrer un quiz
2. Simuler une perte de connexion (DevTools > Network > Offline)
3. Terminer le quiz et tenter de sauvegarder
4. **Résultat attendu** :
   - ✅ Toast d'erreur : "Erreur lors de la sauvegarde. Le résultat sera sauvegardé localement..."
   - ✅ Toast de retry : "Nouvelle tentative de sauvegarde 1/3..."
   - ✅ Toast de succès si sauvegarde réussie après retry

**Vérification visuelle** :
- Les toasts doivent s'afficher clairement
- Les messages doivent être compréhensibles

---

#### Test 3.3 : Sauvegarde locale en cas d'échec

**Objectif** : Vérifier que les données sont sauvegardées localement

**Scénario** :
1. Démarrer un quiz
2. Simuler une perte de connexion (DevTools > Network > Offline)
3. Terminer le quiz
4. Vérifier dans DevTools > Application > Local Storage
5. **Résultat attendu** :
   - ✅ Clé `quiz_result_*` présente dans localStorage
   - ✅ Données du quiz sauvegardées (score, réponses, etc.)
6. Rétablir la connexion (DevTools > Network > Online)
7. **Résultat attendu** :
   - ✅ Toast : "Résultat synchronisé avec succès !"
   - ✅ Clé supprimée de localStorage
   - ✅ Données présentes dans Firestore

**Vérification localStorage** :
```javascript
// Dans DevTools Console
Object.keys(localStorage).filter(k => k.startsWith('quiz_result_'))
// Doit retourner les clés de sauvegarde locale
```

---

#### Test 3.4 : Transactions Firestore (Race conditions)

**Objectif** : Vérifier que les transactions évitent les race conditions

**Scénario** :
1. Ouvrir deux onglets avec le même utilisateur
2. Dans les deux onglets, terminer un quiz simultanément
3. Vérifier les statistiques utilisateur dans Firestore
4. **Résultat attendu** :
   - ✅ `totalQuizzes` est correct (pas de perte)
   - ✅ `averageScore` est correct
   - ✅ Pas de données corrompues

**Vérification code** :
```javascript
// Dans js/firestore-service.js ligne 356
await runTransaction(db, async (transaction) => {
    // Doit utiliser transaction.get() et transaction.update()
});
```

**Test manuel** :
- Compléter 2 quiz rapidement (dans les 2 secondes)
- Vérifier que les stats sont correctes

---

### SECTION 4 : Sécurité et Performance

#### Test 4.1 : Protection XSS (CRITIQUE)

**Objectif** : Vérifier que les données utilisateur sont échappées

**Scénario 1 : Test dans le quiz** :
1. Créer une question avec du HTML malveillant :
   - Question : `<script>alert('XSS')</script>Test`
   - Option : `<img src=x onerror=alert('XSS')>`
2. Charger le quiz avec cette question
3. **Résultat attendu** :
   - ✅ Le HTML est échappé (affiché comme texte, pas exécuté)
   - ✅ Pas d'alerte JavaScript
   - ✅ Pas de script exécuté

**Scénario 2 : Test dans admin-dashboard** :
1. Créer un utilisateur avec un nom malveillant : `<script>alert('XSS')</script>Admin`
2. Afficher le dashboard admin
3. **Résultat attendu** :
   - ✅ Le nom est échappé
   - ✅ Pas de script exécuté

**Vérification code** :
```javascript
// Dans js/quiz.js
${escapeHtml(question.question)} // Doit être échappé
```

**Test manuel** :
- Essayer d'injecter `<script>alert(1)</script>` dans une question
- Vérifier que ça ne s'exécute pas

---

#### Test 4.2 : Rate limiting

**Objectif** : Vérifier que le rate limiting fonctionne

**Scénario** :
1. Ouvrir la console
2. Faire 101 requêtes Firestore rapidement :
```javascript
// Dans la console
import { safeFirestoreRead } from './js/rate-limiter.js';
for (let i = 0; i < 101; i++) {
    safeFirestoreRead(() => getDocs(collection(db, 'users')))
        .catch(err => console.log(`Requête ${i}: ${err.message}`));
}
```
3. **Résultat attendu** :
   - ✅ Les 100 premières requêtes passent
   - ✅ La 101ème est bloquée avec message : "Trop de requêtes. Veuillez patienter X secondes."

**Vérification code** :
```javascript
// Dans js/rate-limiter.js
const firestoreRateLimiter = new RateLimiter(100, 60000); // 100 req/min
```

**Note** : Ce test nécessite que le rate limiting soit intégré dans `firestore-service.js` (actuellement seulement importé dans `quiz.js`)

---

#### Test 4.3 : Limitation de `loadTopUsers()`

**Objectif** : Vérifier que seulement 1000 résultats sont chargés

**Scénario** :
1. Aller sur le dashboard admin
2. Ouvrir DevTools > Network
3. Filtrer par "Firestore"
4. Cliquer sur "Top 10 Utilisateurs"
5. Vérifier la requête Firestore
6. **Résultat attendu** :
   - ✅ Requête avec `limit(1000)` et `orderBy('completedAt', 'desc')`
   - ✅ Dashboard se charge rapidement (< 3 secondes)
   - ✅ Pas de timeout

**Vérification code** :
```javascript
// Dans js/admin-dashboard.js ligne 221-226
const q = query(
    collection(db, 'quizResults'),
    orderBy('completedAt', 'desc'),
    limit(1000) // Doit être présent
);
```

**Test manuel** :
- Avec beaucoup de résultats dans Firestore (> 1000)
- Vérifier que le dashboard admin se charge rapidement

---

## 🔧 TESTS AUTOMATISÉS

### Tests Unitaires (Vitest)

**Lancer les tests** :
```bash
npm test
```

**Tests existants** :
- `tests/toast.test.js` : Tests du système de toast
- `tests/skeleton.test.js` : Tests des skeletons
- `tests/empty-states.test.js` : Tests des états vides
- `tests/tooltip.test.js` : Tests des tooltips

**Créer de nouveaux tests** :

Exemple : Test de `normalizeMonthFormat()`
```javascript
// tests/month-utils.test.js
import { describe, it, expect } from 'vitest';
import { normalizeMonthFormat, getCurrentMonthIndex } from '../js/month-utils.js';

describe('month-utils', () => {
    it('should normalize month format', () => {
        expect(normalizeMonthFormat(11, 2025)).toBe('Novembre 2025');
        expect(normalizeMonthFormat('novembre', 2025)).toBe('Novembre 2025');
        expect(normalizeMonthFormat('Novembre 2025')).toBe('Novembre 2025');
    });
    
    it('should get current month index', () => {
        const index = getCurrentMonthIndex();
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThanOrEqual(11);
    });
});
```

---

### Tests E2E (Playwright)

**Lancer les tests E2E** :
```bash
npm run test:e2e
```

**Tests existants** :
- `e2e/auth.spec.js` : Tests d'authentification
- `e2e/quiz-flow.spec.js` : Tests du flux de quiz

**Créer de nouveaux tests** :

Exemple : Test de la sauvegarde avec retry
```javascript
// e2e/quiz-save-retry.spec.js
import { test, expect } from '@playwright/test';

test('should retry save on network error', async ({ page, context }) => {
    // Simuler offline
    await context.setOffline(true);
    
    // Compléter un quiz
    await page.goto('/');
    // ... compléter le quiz
    
    // Vérifier le toast de retry
    await expect(page.locator('.toast')).toContainText('Nouvelle tentative');
    
    // Vérifier la sauvegarde locale
    const localStorage = await page.evaluate(() => {
        return Object.keys(localStorage).filter(k => k.startsWith('quiz_result_'));
    });
    expect(localStorage.length).toBeGreaterThan(0);
});
```

---

## 📊 CHECKLIST COMPLÈTE DE VALIDATION

### Tests Fonctionnels

#### Dashboard
- [ ] Le mois affiché correspond au mois actuel (pas hardcodé)
- [ ] La progression mensuelle s'affiche correctement
- [ ] Les modules sont cliquables et démarrent un quiz
- [ ] Le streak (série) s'affiche correctement

#### Quiz
- [ ] Les questions se chargent correctement
- [ ] Les réponses peuvent être sélectionnées
- [ ] Le timer fonctionne et s'affiche
- [ ] Le score est calculé correctement
- [ ] Les résultats s'affichent après complétion
- [ ] La sauvegarde fonctionne (vérifier dans Firestore)
- [ ] Les données utilisateur sont échappées (pas de XSS)

#### Admin Dashboard
- [ ] Les statistiques globales s'affichent
- [ ] Le top 10 se charge rapidement (< 3 secondes)
- [ ] L'activité récente s'affiche
- [ ] Les graphiques se chargent

#### Admin Questions
- [ ] Les questions s'affichent
- [ ] La création de question fonctionne
- [ ] L'édition fonctionne (si implémentée)
- [ ] La suppression fonctionne
- [ ] Les données sont échappées (pas de XSS)

#### Admin Users
- [ ] La liste des utilisateurs s'affiche
- [ ] Les statistiques utilisateur sont correctes
- [ ] Les données sont échappées (pas de XSS)

---

### Tests de Sécurité

#### Protection XSS
- [ ] Tester avec `<script>alert('XSS')</script>` dans une question
- [ ] Tester avec `<img src=x onerror=alert('XSS')>` dans une option
- [ ] Tester avec du HTML dans un nom d'utilisateur
- [ ] Vérifier que rien ne s'exécute

#### Validation Serveur
- [ ] Essayer de sauvegarder un score > 100 (doit être rejeté)
- [ ] Essayer de sauvegarder un score < 0 (doit être rejeté)
- [ ] Essayer de sauvegarder un score NaN (doit être rejeté)
- [ ] Vérifier dans Firestore Console que les règles rejettent

---

### Tests de Robustesse

#### Gestion d'Erreurs
- [ ] Simuler une perte de connexion pendant un quiz
- [ ] Vérifier que l'utilisateur est informé
- [ ] Vérifier que les données sont sauvegardées localement
- [ ] Vérifier la synchronisation à la reconnexion

#### Nettoyage des Ressources
- [ ] Démarrer un quiz et fermer l'onglet
- [ ] Vérifier qu'il n'y a pas de fuite mémoire (DevTools > Performance)
- [ ] Vérifier que le timer est nettoyé

#### Transactions
- [ ] Compléter 2 quiz rapidement
- [ ] Vérifier que les statistiques sont correctes
- [ ] Vérifier qu'il n'y a pas de perte de données

---

### Tests de Performance

#### Chargement
- [ ] Dashboard se charge en < 2 secondes
- [ ] Quiz se charge en < 1 seconde
- [ ] Admin dashboard se charge en < 3 secondes

#### Requêtes
- [ ] Vérifier dans DevTools > Network que les requêtes sont limitées
- [ ] Vérifier que `loadTopUsers()` limite à 1000 résultats
- [ ] Vérifier que les requêtes sont parallèles (Promise.all)

---

## 🐛 DÉBOGAGE

### Problèmes Courants

#### Le mois ne change pas automatiquement
**Solution** : Vérifier que `getCurrentMonthIndex()` est utilisé dans `dashboard.js`

#### Les scores NaN sont sauvegardés
**Solution** : Vérifier que la validation `userAnswers.length === 0` est présente

#### Le timer continue après fermeture
**Solution** : Vérifier que `beforeunload` listener est présent

#### Protection XSS ne fonctionne pas
**Solution** : Vérifier que `escapeHtml()` est importé et utilisé

#### Rate limiting ne fonctionne pas
**Solution** : Vérifier que `safeFirestoreRead/Write` est utilisé dans `firestore-service.js`

---

## 📝 RAPPORT DE TEST

### Template de Rapport

```
Date : [Date]
Testeur : [Nom]
Version : [Version]

RÉSULTATS :
✅ Tests passés : X/Y
❌ Tests échoués : X/Y
⚠️ Tests partiels : X/Y

DÉTAILS :
- Test 1 : [Résultat]
- Test 2 : [Résultat]
...

PROBLÈMES IDENTIFIÉS :
- [Liste des problèmes]

RECOMMANDATIONS :
- [Liste des recommandations]
```

---

## 🎯 TESTS PRIORITAIRES (À faire en premier)

1. **Test du mois dynamique** (2 minutes)
   - Vérifier que le dashboard affiche le bon mois

2. **Test de la division par zéro** (2 minutes)
   - Essayer de terminer un quiz sans répondre

3. **Test de la sauvegarde avec retry** (5 minutes)
   - Simuler offline et vérifier le retry

4. **Test de la protection XSS** (5 minutes)
   - Injecter du HTML malveillant

5. **Test du nettoyage du timer** (2 minutes)
   - Fermer l'onglet pendant un quiz

**Temps total estimé** : ~15 minutes pour les tests prioritaires

---

## ✅ CRITÈRES DE SUCCÈS

**Tests réussis si** :
- ✅ Tous les tests critiques passent
- ✅ Aucune régression détectée
- ✅ Performance acceptable (< 3 secondes pour dashboard admin)
- ✅ Aucune erreur dans la console (sauf erreurs réseau simulées)
- ✅ Protection XSS active
- ✅ Validation serveur fonctionne

**Si un test échoue** :
1. Noter le problème
2. Vérifier le code correspondant
3. Corriger si nécessaire
4. Re-tester

---

**Guide créé** : Novembre 2025  
**Dernière mise à jour** : Novembre 2025


