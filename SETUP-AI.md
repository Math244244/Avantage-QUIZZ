# Pack IA Complet (Option B)

Ce document décrit l'environnement amélioré pour accélérer le développement, garantir la qualité et offrir une expérience proche de Cursor tout en restant dans VS Code.

## 1. Extensions recommandées
Installe (si pas déjà):
- GitHub Copilot
- GitHub Copilot Chat
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Playwright Test for VS Code
- Firebase Explorer

## 2. Scripts NPM
- `npm run dev` : serveur local Vite.
- `npm run build` : build + postbuild (cache SW, Tailwind minifié).
- `npm run deploy` : build puis `firebase deploy`.
- `npm run test` / `test:run` / `test:ui` : tests unitaires (Vitest).
- `npm run test:e2e` / `test:e2e:ui` : tests E2E (Playwright).
- `npm run lint` / `lint:fix` : analyse ESLint.
- `npm run format` / `format:check` : Prettier.

## 3. Tâches VS Code
Dans `.vscode/tasks.json` : dev, build, deploy, test, test:e2e, lint, format.
Tu peux exécuter via: Terminal > Run Task.

## 4. Qualité automatique
- Husky pré-commit (après installation): exécute lint-staged.
- lint-staged (à ajouter) va formater uniquement les fichiers modifiés.

## 5. ESLint & Prettier
- Config minimale basée sur `eslint:recommended` + ignore dossiers générés.
- Prettier force singleQuote, largeur 100 caractères.

## 6. Prompts IA
Voir `AI-PROMPTS.md` pour des prompts prêts à coller dans Copilot Chat.

## 7. Actions CI (proposé)
Un workflow GitHub peut:
- Installer dépendances
- Lancer lint + tests + build
- (Optionnel) déployer sur Firebase (manuel/release).

## 8. Améliorations futures
- Ajout d'analyse performance ciblée Lighthouse dans CI.
- Backfill `completedAt` sur anciens documents Firestore via script admin.
- Génération auto docs (JSDoc -> site statique).

## 9. Commandes utiles
```powershell
npm install           # installe dépendances (incluant ESLint, Prettier, Husky)
pm run prepare        # initialise Husky (.husky/)
npm run lint:fix       # corrige automatiquement style + erreurs simples
npm run test:run       # tests rapides en mode CI
npm run test:e2e       # tests E2E
```

## 10. Maintenance
- Mettre à jour libs de sécurité: `npm outdated` puis patch spécifique.
- Purger `dist/` si artefacts obsolètes.

---
Si tu veux que j'ajoute le workflow CI et husky immédiatement, dis-le (ou je peux continuer maintenant).