# Prompts prêts à l'emploi pour Copilot Chat

Copie/colle ces prompts selon le besoin. Adapte les chemins si nécessaire.

## 1) Audit rapide d'un fichier
« Analyse `js/results.js` :
- Liste les fonctions exportées
- Repère imports morts
- Signale erreurs possibles (async, null, perf)
- Propose 2 améliorations rapides »

## 2) Créer un test unitaire ciblé
« Écris un test Vitest pour `js/firestore-service.js`, fonction `saveQuizResult` :
- Mock Firebase
- Vérifie que `completedAt` est ajouté
- Cas d'erreur: si userId manquant, rejette correctement »

## 3) Debug E2E
« Mon test Playwright `e2e/quiz-flow.spec.js` échoue aléatoirement:
- Propose des attentes robustes (getByRole, locator)
- Ajoute `test.slow()` ou timeouts ciblés
- Ajoute trace/réseau (réglages config) »

## 4) Performance Lighthouse
« Donne 3 optimisations pour PWA:
- Mise en cache SW sélective
- Préchargement des assets critiques
- Détection des resources inutilisées sur `index.html` »

## 5) Revue de PR
« Passe en revue ce diff (collé ci-dessous) :
- Note risques
- Propose tests manquants
- Vérifie style (ESLint/Prettier) »

## 6) Refactor guidé
« Refactor `js/auth.js` :
- Extraire la garde anti-double popup
- Rendre la gestion d'erreurs plus claire (code -> message) »

## 7) Migration de schéma Firestore
« Je veux backfiller `completedAt` sur `quizResults` 
- Propose un script admin sûr (batch/limit, retries)
- Ajoute un dry-run
- Ajoute logs minimalistes »

## 8) Aide au déploiement
« Vérifie `firebase.json`, `service-worker.js` et `vite.config.js` pour un PWA propre:
- Liste les points d'attention
- Propose patch minimal s'il y a un problème »
