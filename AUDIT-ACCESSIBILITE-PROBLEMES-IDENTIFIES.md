# 🔍 AUDIT ACCESSIBILITÉ - PROBLÈMES IDENTIFIÉS

**Date:** 9 novembre 2025  
**Analyse:** Code source + Lighthouse existant  
**Norme:** WCAG 2.1 Level AA

---

## 📊 SCORE INITIAL

### Statistiques Globales
- **Attributs ARIA dans index.html:** 3 (TRÈS FAIBLE)
- **Attributs `role`:** 3 (TRÈS FAIBLE)
- **Landmarks ARIA:** 1 (`role="navigation"` uniquement)
- **Éléments sémantiques HTML5:** Moyens

### Score Estimé: **35/100** 🔴 CRITIQUE

---

## 🔴 PROBLÈMES CRITIQUES (À Corriger Immédiatement)

### 1. Absence de Landmark `<main>`
**Impact:** Screen readers ne peuvent pas sauter directement au contenu principal

**Problème:**
```html
<!-- index.html ligne ~260 -->
<div class="flex-1 ml-64 h-full overflow-y-auto">
    <!-- CONTENU PRINCIPAL sans <main> ni role="main" -->
```

**Solution:**
```html
<main role="main" id="main-content" class="flex-1 ml-64 h-full overflow-y-auto">
    <!-- CONTENU PRINCIPAL -->
</main>
```

**Fichiers:** `index.html`, `results.html`, `resources.html`, `admin.html`

---

### 2. Pas de "Skip to Content" Link
**Impact:** Utilisateurs clavier doivent tabber à travers toute la sidebar

**Problème:** Aucun mécanisme de saut

**Solution:**
```html
<!-- Ajouter au début du <body> -->
<a href="#main-content" class="skip-link">
    Aller au contenu principal
</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--ap-red-primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
</style>
```

**Fichiers:** Tous les HTML

---

### 3. Icônes SVG Sans `aria-hidden`
**Impact:** Screen readers lisent "image" sans contexte

**Problème:**
```html
<!-- Exemple ligne 193 - index.html -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
    <!-- SVG décoratif SANS aria-hidden -->
</svg>
```

**Solution:**
```html
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
    <!-- SVG décoratif -->
</svg>
```

**Impact:** 50+ SVG à corriger dans tous les fichiers

---

### 4. Boutons Déguisés en Liens
**Impact:** Sémantique incorrecte, navigation confuse

**Problème:**
```html
<!-- Cartes modules - ligne ~398 index.html -->
<a href="#" data-module="auto" class="module-card ...">
    <!-- Carte qui devrait être un bouton -->
</a>
```

**Solution:**
```html
<button type="button" data-module="auto" class="module-card ..." aria-label="Démarrer le quiz Auto">
    <!-- Carte -->
</button>
```

**Fichiers:** `index.html` (4 cartes modules)

---

### 5. Modals Sans ARIA
**Impact:** Screen readers ne savent pas qu'un modal est ouvert

**Problème:** Modals de résultats quiz sans attributs ARIA

**Solution:**
```javascript
// Ajouter lors de l'ouverture du modal
modalElement.setAttribute('role', 'dialog');
modalElement.setAttribute('aria-modal', 'true');
modalElement.setAttribute('aria-labelledby', 'modal-title-id');

// Focus trap
modalElement.focus();

// Gestion Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
```

**Fichiers:** `js/quiz.js`, `js/results.js`

---

### 6. Toasts Sans Live Regions
**Impact:** Screen readers ne lisent pas les notifications

**Problème:**
```javascript
// js/toast.js - Toasts créés dynamiquement sans ARIA
showToast(message, type) {
    const toast = document.createElement('div');
    // Pas de role="status" ni aria-live
}
```

**Solution:**
```javascript
showToast(message, type) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    // ...
}
```

**Fichiers:** `js/toast.js`

---

### 7. Form Labels Non-Associés
**Impact:** Screen readers ne savent pas quel label va avec quel input

**Problème:**
```html
<!-- admin-questions.js génère dynamiquement -->
<label class="block text-sm font-medium text-slate-700 mb-2">Module</label>
<select id="filter-module" ...>
    <!-- Label pas associé avec for="filter-module" -->
</select>
```

**Solution:**
```html
<label for="filter-module" class="block text-sm font-medium text-slate-700 mb-2">Module</label>
<select id="filter-module" ...>
```

**Fichiers:** `results.html`, `admin.html`, `resources.html`

---

### 8. Headings Hierarchy Cassée
**Impact:** Navigation par titres impossible

**Problème à vérifier:**
```
- H1: "Tableau de Bord" ✅
- H2: "Quiz de Novembre" ✅
- H3: ??? (à vérifier si présents)
- Possibles sauts H1 → H4
```

**Solution:** Audit complet de la hiérarchie H1→H2→H3→H4

**Fichiers:** Tous

---

## 🟡 PROBLÈMES IMPORTANTS (Haute Priorité)

### 9. Contraste Couleurs Insuffisant
**Impact:** Texte difficile à lire pour malvoyants

**À vérifier avec outil:**
- Texte blanc sur rouge AP (#C41E3A)
- Texte doré sur blanc (#D4AF37)
- Texte gris clair sur blanc

**Ratio requis:**
- Texte normal: 4.5:1
- Gros texte (18px+ ou 14px+ bold): 3:1

**Solution:** Ajuster les couleurs si ratio insuffisant

---

### 10. Boutons Sans État ARIA
**Impact:** Screen readers ne savent pas si élément est ouvert/fermé

**Problème:**
```html
<!-- Theme toggle button - ligne ~246 -->
<button id="theme-toggle">
    <!-- Pas d'aria-pressed ou aria-expanded -->
</button>
```

**Solution:**
```html
<button id="theme-toggle" aria-pressed="false" aria-label="Activer le mode sombre">
    <!-- SVG -->
</button>

<!-- JavaScript -->
toggle.addEventListener('click', () => {
    const pressed = toggle.getAttribute('aria-pressed') === 'true';
    toggle.setAttribute('aria-pressed', !pressed);
    toggle.setAttribute('aria-label', pressed ? 'Activer le mode sombre' : 'Activer le mode clair');
});
```

**Fichiers:** `index.html`, JavaScript gérant les toggles

---

### 11. Liens Sans Contexte
**Impact:** "Détails" n'indique pas détails de quoi

**Problème:**
```html
<!-- js/results.js - créé dynamiquement -->
<button class="result-details-btn">Détails</button>
```

**Solution:**
```html
<button class="result-details-btn" aria-label="Détails du quiz Auto - Janvier 2025">
    Détails
</button>
```

---

### 12. Graphiques Sans Description
**Impact:** Chart.js non accessible aux screen readers

**Problème:**
```html
<canvas id="progress-chart" height="250"></canvas>
<!-- Pas de description alternative -->
```

**Solution:**
```html
<div role="img" aria-label="Graphique montrant l'évolution de vos scores sur les 10 derniers quiz">
    <canvas id="progress-chart" height="250"></canvas>
</div>

<!-- OU -->
<canvas id="progress-chart" height="250" aria-label="Évolution des scores"></canvas>
<div id="progress-chart-description" class="sr-only">
    <!-- Description textuelle détaillée du graphique -->
</div>
```

**Fichiers:** `results.html`, `admin.html`

---

### 13. Animations Sans `prefers-reduced-motion`
**Impact:** Animations peuvent causer nausée/désorientation

**Problème:**
```css
/* css/animations-avantage-plus.css */
@keyframes fadeInUp { ... }
/* Pas de respect de prefers-reduced-motion */
```

**Solution:**
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Fichiers:** `css/animations-avantage-plus.css`, `css/micro-interactions.css`

---

### 14. Timer Quiz Sans Pause
**Impact:** Utilisateurs avec handicap cognitif ont besoin de plus de temps

**Problème:** Timer sans option "temps illimité"

**Solution:**
```html
<!-- Ajouter dans paramètres quiz -->
<label>
    <input type="checkbox" id="unlimited-time">
    Mode temps illimité (accessible)
</label>

<!-- JavaScript -->
if (unlimitedTimeEnabled) {
    // Ne pas démarrer le timer
}
```

**Fichiers:** `js/quiz.js`, `index.html`

---

## 🟢 PROBLÈMES MOYENS (Bonne Pratique)

### 15. Alt Text Générique
**Problème:**
```html
<img id="user-avatar" src="..." alt="Avatar utilisateur">
```

**Amélioration:**
```html
<img id="user-avatar" src="..." alt="Photo de profil de Jean Dupont">
```

---

### 16. Langue Non-Spécifiée pour Passages
**Statut:** Tout en français - OK  
**Action:** Vérifier `<html lang="fr">` présent

---

### 17. Focus Indicators Inconsistants
**Problème:** Focus doré peut être difficile à voir sur fond clair

**Solution:** Vérifier contraste 3:1 minimum pour focus

---

### 18. Landmarks Complémentaires Absents
**Problème:** Pas de `<aside>`, `<footer>` avec rôles

**Solution:**
```html
<aside role="complementary" aria-label="Statistiques rapides">
    <!-- Sidebar stats -->
</aside>

<footer role="contentinfo">
    <!-- Footer -->
</footer>
```

---

## 📋 CHECKLIST DE CORRECTION

### Priorité 1 (2h) - CRITIQUE
- [ ] Ajouter `<main role="main">` dans tous les HTML
- [ ] Ajouter "Skip to content" link
- [ ] Ajouter `aria-hidden="true"` sur tous les SVG décoratifs
- [ ] Convertir cartes modules en `<button>` avec aria-label
- [ ] Ajouter ARIA aux modals (role="dialog", aria-modal)
- [ ] Ajouter `role="status" aria-live="polite"` aux toasts

### Priorité 2 (1.5h) - IMPORTANT
- [ ] Associer tous les labels avec `for/id`
- [ ] Vérifier contraste couleurs (outil)
- [ ] Ajouter `aria-pressed` aux boutons toggle
- [ ] Ajouter `aria-label` aux liens génériques
- [ ] Ajouter descriptions aux graphiques
- [ ] Implémenter `prefers-reduced-motion`

### Priorité 3 (1h) - BON
- [ ] Améliorer alt text dynamiques
- [ ] Vérifier hiérarchie headings
- [ ] Ajouter landmarks complémentaires
- [ ] Focus indicators contraste
- [ ] Option temps illimité quiz
- [ ] Tester navigation clavier complète

---

## 🧪 TESTS À EFFECTUER

### Tests Automatisés
1. **axe DevTools** - Scan complet
2. **WAVE** - Analyse visuelle
3. **Lighthouse** - Score accessibility
4. **W3C Validator** - HTML valide

### Tests Manuels
1. **Navigation clavier** - Tab partout, pas de piège
2. **Screen reader** - NVDA sur Windows, VoiceOver sur Mac
3. **Zoom 200%** - Pas de perte de contenu
4. **Contraste** - WebAIM Contrast Checker
5. **Responsive 320px** - Pas de scroll horizontal

---

## 📊 PROCHAINES ÉTAPES

1. ✅ Plan créé
2. ✅ Problèmes identifiés
3. ⏳ Commencer corrections Priorité 1
4. ⏳ Tests automatisés
5. ⏳ Tests manuels
6. ⏳ Rapport final

---

**Prêt à implémenter les corrections! 🚀**

