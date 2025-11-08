# 📋 PLAN DE MIGRATION VERS STATEMANAGER

## 🎯 OBJECTIF
Remplacer toutes les variables globales éparpillées par le StateManager centralisé.

---

## 📊 ANALYSE DE LA SITUATION

### Fichier 1 : `js/quiz.js`
**Variables globales à migrer** (14 variables) :
1. `currentQuiz` → `stateManager.get('currentQuiz')`
2. `currentQuestionIndex` → `stateManager.get('currentQuestionIndex')`
3. `userAnswers` → `stateManager.get('userAnswers')`
4. `startTime` → `stateManager.get('startTime')`
5. `timerInterval` → `stateManager.get('timerInterval')`
6. `questionStartTime` → `stateManager.get('questionStartTime')`
7. `currentStreak` → `stateManager.get('currentStreak')`
8. `isPaused` → `stateManager.get('isPaused')`
9. `totalPausedDuration` → `stateManager.get('pausedDuration')`
10. `pauseStartedAt` → `stateManager.get('pauseStartedAt')`
11. `currentModule` → `stateManager.get('currentModule')`
12. `currentMonth` → `stateManager.get('currentMonth')`
13. `currentYear` → `stateManager.get('currentYear')`
14. `hasCurrentQuestionBeenAnswered` → `stateManager.get('hasCurrentQuestionBeenAnswered')`
15. `quizEventDelegationInitialized` → `stateManager.get('quizEventDelegationInitialized')`

**Utilisations** : ~47 occurrences dans le fichier

---

### Fichier 2 : `js/dashboard.js`
**Variables globales à migrer** :
1. `monthsData` → `stateManager.get('monthsData')`
2. `currentMonthIndex` → `stateManager.get('currentMonthIndex')`
3. `dashboardEventDelegationAttached` → `stateManager.get('dashboardEventDelegationAttached')`

**Utilisations** : ~20 occurrences

---

## 🔄 PLAN D'EXÉCUTION

### ÉTAPE 1 : Préparation
- ✅ StateManager créé (`js/state-manager.js`)
- ✅ Vérifier que StateManager fonctionne

### ÉTAPE 2 : Migration de `quiz.js` (PRIORITAIRE)
**Ordre de migration** :
1. Importer StateManager
2. Remplacer les déclarations `let` par des initialisations dans StateManager
3. Remplacer toutes les lectures (`currentQuiz`) par `stateManager.get('currentQuiz')`
4. Remplacer toutes les écritures (`currentQuiz = ...`) par `stateManager.set('currentQuiz', ...)`
5. Tester après chaque groupe de modifications

**Points d'attention** :
- Les fonctions `stopTimer()` doivent nettoyer `timerInterval`
- Les fonctions de reset doivent utiliser `stateManager.resetQuiz()`
- Les fonctions async doivent attendre les valeurs du StateManager

### ÉTAPE 3 : Migration de `dashboard.js`
**Même processus** :
1. Importer StateManager
2. Remplacer les variables globales
3. Tester

### ÉTAPE 4 : Tests finaux
- Tester le quiz complet
- Tester le dashboard
- Vérifier qu'il n'y a pas de régressions

---

## ⚠️ PRÉCAUTIONS

1. **Ne pas supprimer les variables globales avant d'avoir tout remplacé**
2. **Tester après chaque modification importante**
3. **Garder une copie de sauvegarde mentale (git)**
4. **Vérifier le linter après chaque modification**

---

## ✅ CRITÈRES DE SUCCÈS

- [ ] Toutes les variables globales remplacées
- [ ] Aucune erreur de linter
- [ ] Le quiz fonctionne normalement
- [ ] Le dashboard fonctionne normalement
- [ ] Pas de régressions

---

**Date de création** : Novembre 2025  
**Statut** : En cours

