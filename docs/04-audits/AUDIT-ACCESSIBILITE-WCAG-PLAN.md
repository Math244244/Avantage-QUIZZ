# 🌐 AUDIT ACCESSIBILITÉ WCAG 2.1 AA - AVANTAGE QUIZZ

**Date:** 9 novembre 2025  
**Norme:** WCAG 2.1 Level AA  
**Objectif:** Rendre l'application accessible à tous les utilisateurs

---

## 📋 MÉTHODOLOGIE

### Outils d'Audit
1. ✅ **axe DevTools** - Extension Chrome
2. ✅ **WAVE** - Web Accessibility Evaluation Tool
3. ✅ **Lighthouse** - Audit Chrome intégré
4. ✅ **Screen Reader** - NVDA/JAWS (Windows) ou VoiceOver (Mac)
5. ✅ **Keyboard Navigation** - Tests manuels
6. ✅ **Color Contrast Analyzer** - Vérification ratios

### Critères WCAG 2.1 AA
**4 Principes:**
1. **Perceptible** - L'information doit être présentée de manière perceptible
2. **Utilisable** - L'interface doit être utilisable par tous
3. **Compréhensible** - L'information et l'interface doivent être compréhensibles
4. **Robuste** - Le contenu doit être robuste pour différentes technologies

---

## 🔍 ANALYSE INITIALE (Basée sur le code)

### 1️⃣ PERCEPTIBLE

#### 1.1 Alternatives Textuelles
**Critère:** Fournir des alternatives textuelles pour tout contenu non textuel

**Problèmes identifiés:**
- 🔴 **Images logo** - Alt text "Avantage Plus Logo" présent ✅
- 🟡 **Icônes SVG** - Beaucoup d'icônes décoratives sans aria-hidden
- 🟡 **Images avatar** - Alt text générique "Avatar utilisateur"
- 🟡 **Graphiques Chart.js** - Pas de description alternative pour screen readers

**Actions requises:**
- [ ] Ajouter `aria-hidden="true"` aux icônes décoratives
- [ ] Ajouter descriptions alternatives pour graphiques
- [ ] Améliorer alt text dynamique des avatars

---

#### 1.2 Médias Temporels
**Critère:** Fournir des alternatives pour les médias temporels

**Statut:** ✅ PAS DE VIDÉO/AUDIO - N/A

---

#### 1.3 Contenu Adaptable
**Critère:** Créer un contenu qui peut être présenté de différentes manières

**Problèmes identifiés:**
- 🟡 **Structure sémantique** - Utilisation de `<div>` au lieu de `<section>`, `<article>`
- 🟡 **Landmarks ARIA** - Absents (navigation, main, complementary)
- 🟡 **Headings hierarchy** - H1 présent, mais hiérarchie à vérifier
- 🔴 **Form labels** - Certains selects/inputs sans labels visibles

**Actions requises:**
- [ ] Ajouter landmarks ARIA (`role="navigation"`, `role="main"`)
- [ ] Remplacer `<div>` par éléments sémantiques HTML5
- [ ] Vérifier hiérarchie H1→H2→H3
- [ ] Associer tous les inputs avec labels explicites

---

#### 1.4 Distinguable
**Critère:** Faciliter la perception du contenu par les utilisateurs

##### 1.4.1 Utilisation de la Couleur
**Problèmes identifiés:**
- 🟡 **Cartes de statut** - Couleur seule pour différencier (complété=doré, actif=rouge)
- 🟡 **Scores** - Vert/jaune/rouge sans indicateur textuel

**Actions requises:**
- [ ] Ajouter icônes + texte pour statuts (pas que couleur)
- [ ] Ajouter labels textuels aux scores colorés

##### 1.4.3 Contraste (Minimum)
**Norme:** Ratio 4.5:1 pour texte normal, 3:1 pour gros texte

**À vérifier:**
- 🔴 **Texte blanc sur rouge AP** - Ratio à calculer
- 🔴 **Texte doré sur blanc** - Ratio à calculer
- 🟡 **Texte gris sur blanc** - Probablement OK
- 🟡 **Sidebar links** - Blanc sur rouge foncé

**Actions requises:**
- [ ] Analyser tous les ratios de contraste
- [ ] Ajuster couleurs si ratio < 4.5:1

##### 1.4.4 Redimensionnement du Texte
**Critère:** Texte redimensionnable jusqu'à 200% sans perte de contenu

**Statut:** 🟡 À TESTER - Utilisation de rem/em recommandée

**Actions requises:**
- [ ] Tester zoom 200%
- [ ] Vérifier pas de débordement/chevauchement

##### 1.4.10 Reflow
**Critère:** Pas de scroll horizontal à 320px de largeur

**Statut:** 🟡 À TESTER - Design responsive existant

**Actions requises:**
- [ ] Tester sur mobile 320px
- [ ] Vérifier sidebar responsive

##### 1.4.11 Contraste Non-Textuel
**Critère:** Contraste 3:1 pour composants UI et graphiques

**Problèmes identifiés:**
- 🟡 **Bordures inputs** - À vérifier
- 🟡 **Focus indicators** - Doré sur fond clair

**Actions requises:**
- [ ] Vérifier contraste focus indicators
- [ ] Vérifier contraste bordures boutons

##### 1.4.12 Espacement du Texte
**Critère:** Pas de perte de contenu avec espacement personnalisé

**Statut:** 🟡 À TESTER

---

### 2️⃣ UTILISABLE

#### 2.1 Accessible au Clavier

##### 2.1.1 Clavier
**Critère:** Toutes les fonctionnalités accessibles au clavier

**Problèmes identifiés:**
- 🔴 **Cartes modules** - `<a href="#">` mais pas de vrai href
- 🔴 **Boutons avec event listeners** - Certains `<div>` cliquables au lieu de `<button>`
- 🟡 **Modal résultats** - Navigation clavier à tester
- 🟡 **Dropdowns** - Gestion des flèches à implémenter

**Actions requises:**
- [ ] Remplacer `<a href="#"` par `<button>` pour actions
- [ ] Ajouter gestion Arrow keys pour dropdowns
- [ ] Tester Tab navigation complète
- [ ] Ajouter keyboard shortcuts (optionnel)

##### 2.1.2 Pas de Piège Clavier
**Critère:** Le focus peut toujours sortir d'un composant

**Statut:** 🟡 À TESTER - Modals à vérifier

**Actions requises:**
- [ ] Tester trap focus dans modals
- [ ] Ajouter Escape pour fermer modals

##### 2.1.4 Raccourcis Clavier
**Critère:** Possibilité de désactiver ou remapper

**Statut:** ✅ PAS DE SHORTCUTS - N/A

---

#### 2.2 Délai Suffisant

##### 2.2.1 Réglage du Délai
**Critère:** L'utilisateur peut ajuster les délais

**Problèmes identifiés:**
- 🟡 **Timer quiz** - Pas d'option pour prolonger
- 🟡 **Toasts** - Disparaissent automatiquement

**Actions requises:**
- [ ] Ajouter option "Pause illimitée" pour quiz
- [ ] Permettre fermeture manuelle des toasts (déjà fait?)
- [ ] Documenter temps limites

##### 2.2.2 Pause, Arrêt, Masquage
**Critère:** Contrôle sur contenu en mouvement

**Problèmes identifiés:**
- 🟡 **Animations CSS** - Pas de contrôle utilisateur
- 🟡 **Shimmer effects** - Animations continues

**Actions requises:**
- [ ] Ajouter `prefers-reduced-motion` support
- [ ] Désactiver animations si préférence utilisateur

---

#### 2.3 Crises et Réactions Physiques

##### 2.3.1 Limite de Trois Flashs
**Statut:** ✅ PAS DE FLASHS - N/A

---

#### 2.4 Navigable

##### 2.4.1 Contourner des Blocs
**Critère:** Mécanisme pour sauter les blocs répétitifs

**Problèmes identifiés:**
- 🔴 **Pas de "Skip to content" link**
- 🔴 **Sidebar présente sur toutes les pages**

**Actions requises:**
- [ ] Ajouter "Skip to main content" link
- [ ] Masquer visuellement mais accessible au clavier

##### 2.4.2 Titre de Page
**Critère:** Pages web ont des titres descriptifs

**Statut:** ✅ Titres présents dans `<title>`

**À vérifier:**
- [ ] Titres descriptifs et uniques par page

##### 2.4.3 Ordre du Focus
**Critère:** Ordre logique de navigation

**Statut:** 🟡 À TESTER - Layout flexbox/grid peut affecter

**Actions requises:**
- [ ] Tester ordre Tab sur toutes les pages
- [ ] Vérifier pas de saut illogique

##### 2.4.4 Fonction du Lien (en Contexte)
**Critère:** Objectif du lien déterminable par son texte

**Problèmes identifiés:**
- 🟡 **Liens "Détails"** - Pas de contexte (quel résultat?)
- 🟡 **Liens icônes** - Certains sans texte

**Actions requises:**
- [ ] Ajouter `aria-label` aux liens génériques
- [ ] "Détails du quiz Auto - Janvier 2025"

##### 2.4.5 Multiples Façons
**Critère:** Plusieurs moyens de trouver une page

**Statut:** ✅ Sidebar navigation + breadcrumbs partiels

##### 2.4.6 En-têtes et Étiquettes
**Critère:** En-têtes et étiquettes décrivent le sujet

**Statut:** 🟡 À AMÉLIORER - Labels génériques

**Actions requises:**
- [ ] Améliorer labels filtres ("Module" → "Filtrer par module")
- [ ] Headings plus descriptifs

##### 2.4.7 Focus Visible
**Critère:** Focus clavier visible

**Statut:** ✅ Focus outline doré implémenté

**À vérifier:**
- [ ] Contraste suffisant partout
- [ ] Pas masqué par hover states

---

#### 2.5 Modalités d'Entrée

##### 2.5.1 Gestes pour le Pointeur
**Statut:** ✅ PAS DE GESTES COMPLEXES - N/A

##### 2.5.2 Annulation du Pointeur
**Statut:** ✅ Événements sur click (pas mousedown) - OK

##### 2.5.3 Étiquette dans le Nom
**Critère:** Nom accessible contient le label visible

**Statut:** 🟡 À VÉRIFIER

##### 2.5.4 Activation par le Mouvement
**Statut:** ✅ PAS DE MOTION ACTIVATION - N/A

---

### 3️⃣ COMPRÉHENSIBLE

#### 3.1 Lisible

##### 3.1.1 Langue de la Page
**Critère:** Langue spécifiée

**Statut:** ✅ `<html lang="fr">` présent

##### 3.1.2 Langue d'un Passage
**Statut:** ✅ Contenu entièrement français - N/A

---

#### 3.2 Prévisible

##### 3.2.1 Au Focus
**Critère:** Recevoir le focus ne déclenche pas de changement de contexte

**Statut:** 🟡 À VÉRIFIER - Dropdowns à tester

##### 3.2.2 À la Saisie
**Critère:** Changer une valeur ne déclenche pas de changement automatique

**Problèmes identifiés:**
- 🟡 **Filtres résultats** - Appliqués automatiquement au change

**Actions requises:**
- [ ] Ajouter bouton "Appliquer les filtres" (optionnel)
- [ ] Ou documenter comportement

##### 3.2.3 Navigation Cohérente
**Critère:** Mécanismes de navigation cohérents

**Statut:** ✅ Sidebar identique partout

##### 3.2.4 Identification Cohérente
**Critère:** Composants identiques fonctionnent de même façon

**Statut:** ✅ Boutons cohérents, cartes cohérentes

---

#### 3.3 Assistance à la Saisie

##### 3.3.1 Identification des Erreurs
**Critère:** Erreurs identifiées en texte

**Statut:** ✅ Toast messages présents

**À améliorer:**
- [ ] Associer erreurs aux champs (formulaires)
- [ ] ARIA live regions pour toasts

##### 3.3.2 Étiquettes ou Instructions
**Critère:** Labels fournis pour les entrées

**Problèmes identifiés:**
- 🟡 **Certains inputs admin** - Labels visuels mais pas associés
- 🔴 **Selects filtres** - Labels présents mais à vérifier association

**Actions requises:**
- [ ] Vérifier tous les `<label for="id">` correspondent à `<input id="id">`
- [ ] Ajouter `aria-describedby` pour instructions

##### 3.3.3 Suggestion après une Erreur
**Critère:** Suggestions fournies si erreur détectée

**Statut:** 🟡 PARTIEL - Toasts avec messages

**À améliorer:**
- [ ] Messages d'erreur plus spécifiques
- [ ] Suggestions de correction

##### 3.3.4 Prévention des Erreurs (Légal, Financier, Données)
**Statut:** ✅ N/A - Pas de transactions sensibles

---

### 4️⃣ ROBUSTE

#### 4.1 Compatible

##### 4.1.1 Analyse Syntaxique
**Critère:** HTML valide

**Statut:** 🟡 À VALIDER avec W3C Validator

**Actions requises:**
- [ ] Valider HTML avec W3C
- [ ] Corriger erreurs/warnings

##### 4.1.2 Nom, Rôle, Valeur
**Critère:** Attributs ARIA corrects

**Problèmes identifiés:**
- 🔴 **Composants custom** - Manque rôles ARIA
- 🔴 **Boutons toggle** - Pas d'`aria-pressed` ou `aria-expanded`
- 🟡 **Modals** - Manque `role="dialog"`, `aria-modal="true"`
- 🟡 **Tabs admin** - Manque pattern ARIA tabs

**Actions requises:**
- [ ] Ajouter `role="dialog"` aux modals
- [ ] Ajouter `aria-modal="true"`, `aria-labelledby`
- [ ] Implémenter pattern ARIA tabs
- [ ] Ajouter `aria-expanded` aux dropdowns

##### 4.1.3 Messages de Statut
**Critère:** Messages communiqués aux technologies d'assistance

**Problèmes identifiés:**
- 🔴 **Toasts** - Pas de `role="status"` ou `aria-live`
- 🔴 **Loading states** - Pas d'annonce pour screen readers

**Actions requises:**
- [ ] Ajouter `role="status"` et `aria-live="polite"` aux toasts
- [ ] Ajouter `aria-busy="true"` pendant chargements
- [ ] Annoncer résultats de recherche/filtres

---

## 📊 SCORE PRÉVISIONNEL

### Estimation Initiale (Avant Corrections)

| Critère | Conformité | Score |
|---------|------------|-------|
| **1. Perceptible** | 60% | 🟡 Moyen |
| **2. Utilisable** | 65% | 🟡 Moyen |
| **3. Compréhensible** | 75% | 🟢 Bon |
| **4. Robuste** | 55% | 🟡 Faible |
| **GLOBAL** | **64%** | **🟡 C** |

### Objectif Après Corrections

| Critère | Conformité | Score |
|---------|------------|-------|
| **1. Perceptible** | 90%+ | 🟢 Excellent |
| **2. Utilisable** | 90%+ | 🟢 Excellent |
| **3. Compréhensible** | 95%+ | 🟢 Excellent |
| **4. Robuste** | 90%+ | 🟢 Excellent |
| **GLOBAL** | **91%+** | **🟢 A** |

---

## 📋 PLAN D'ACTION PRIORISÉ

### 🔴 PRIORITÉ CRITIQUE (Impact Fort - 2h)

1. **ARIA Landmarks** - `role="navigation"`, `role="main"`
2. **Skip to Content** - Lien caché pour sauter sidebar
3. **Modals ARIA** - `role="dialog"`, `aria-modal`, `aria-labelledby`
4. **Keyboard Focus** - Remplacer `<a href="#">` par `<button>`
5. **Live Regions** - `aria-live` pour toasts et notifications
6. **Form Labels** - Associer tous les labels avec `for/id`

### 🟡 PRIORITÉ HAUTE (Impact Moyen - 1.5h)

7. **Icônes Décoratives** - `aria-hidden="true"`
8. **Contraste Couleurs** - Vérifier et ajuster ratios
9. **Headings Hierarchy** - Vérifier H1→H2→H3
10. **Button States** - `aria-expanded`, `aria-pressed`
11. **Alt Text Dynamique** - Améliorer descriptions
12. **Keyboard Navigation** - Tester et corriger ordre Tab

### 🟢 PRIORITÉ MOYENNE (Impact Faible - 1h)

13. **Reduced Motion** - Support `prefers-reduced-motion`
14. **Link Context** - `aria-label` pour liens génériques
15. **HTML Validation** - Corriger erreurs W3C
16. **Graph Descriptions** - Alternatives pour Chart.js
17. **Error Messages** - Améliorer suggestions
18. **Focus Indicators** - Vérifier contraste partout

---

## 🛠️ OUTILS ET RESSOURCES

### Extensions Chrome
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
- [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

### Screen Readers
- **Windows:** NVDA (gratuit), JAWS (payant)
- **Mac:** VoiceOver (intégré)
- **Linux:** Orca

### Validateurs
- [W3C HTML Validator](https://validator.w3.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Documentation
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)

---

## ⏱️ ESTIMATION TOTALE

**Temps total:** 4-5 heures

- Audit automatisé: 30 min
- Tests manuels: 1h
- Corrections critiques: 2h
- Corrections priorité haute: 1.5h
- Tests validation: 1h

---

## 📝 PROCHAINES ÉTAPES

1. ✅ Créer ce plan d'audit
2. ⏳ Lancer audit automatisé (axe, WAVE, Lighthouse)
3. ⏳ Identifier problèmes spécifiques avec ligne de code
4. ⏳ Implémenter corrections par priorité
5. ⏳ Tester avec screen reader
6. ⏳ Valider avec checklist WCAG
7. ⏳ Générer rapport final

---

**Prêt à commencer l'audit! 🚀**

