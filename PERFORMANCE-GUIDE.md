# 🚀 Guide d'Optimisation des Performances

## 📊 Objectifs Lighthouse
- **Performance**: ≥ 80/100
- **Accessibility**: ≥ 90/100
- **Best Practices**: ≥ 90/100
- **SEO**: ≥ 80/100
- **PWA**: ≥ 60/100

## 🎯 Core Web Vitals Cibles
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## ✅ Optimisations Déjà Implémentées

### 1. Build & Bundle
- ✅ Vite pour le bundling moderne
- ✅ Code splitting automatique
- ✅ Minification CSS/JS en production
- ✅ Tree-shaking des dépendances

### 2. Assets
- ✅ Tailwind CSS optimisé (purge des classes inutilisées)
- ✅ SVG inline pour les icônes (pas de requêtes HTTP)
- ✅ Fonts locales (pas de Google Fonts externe)

### 3. JavaScript
- ✅ Modules ES6 natifs
- ✅ Imports dynamiques possibles
- ✅ Code organisé en fichiers séparés

---

## 🔧 Optimisations à Implémenter

### 1. Images (si ajoutées à l'avenir)

```javascript
// Lazy loading natif
<img src="image.jpg" loading="lazy" alt="Description">

// WebP avec fallback
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>

// Responsive images
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
  src="medium.jpg" 
  alt="Description"
>
```

### 2. Code Splitting Avancé

```javascript
// Lazy load des pages admin
const adminModule = () => import('./js/admin.js');

// Lazy load Chart.js seulement si nécessaire
if (needsChart) {
  const Chart = await import('chart.js/auto');
}

// Lazy load Firebase Analytics seulement si consentement
if (userConsent) {
  const { getAnalytics } = await import('firebase/analytics');
}
```

### 3. Preload/Prefetch Critiques

```html
<!-- Dans index.html -->
<head>
  <!-- Preload des ressources critiques -->
  <link rel="preload" href="/js/auth.js" as="script">
  <link rel="preload" href="/css/output.css" as="style">
  
  <!-- Prefetch des pages probables -->
  <link rel="prefetch" href="/quiz.html">
  
  <!-- DNS prefetch pour Firebase -->
  <link rel="dns-prefetch" href="https://firestore.googleapis.com">
  <link rel="dns-prefetch" href="https://www.googleapis.com">
</head>
```

### 4. Service Worker Avancé

```javascript
// js/service-worker.js
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// Cache strategy: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});
```

### 5. Optimisation Firebase

```javascript
// Activer la persistance hors ligne
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('Multiple tabs open');
  } else if (err.code == 'unimplemented') {
    console.log('Browser not supported');
  }
});

// Limiter les requêtes avec pagination
const q = query(
  collection(db, 'questions'),
  limit(20) // Pagination
);

// Utiliser onSnapshot avec debounce
let timeout;
const debouncedSnapshot = onSnapshot(q, (snapshot) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Traiter les données
  }, 300);
});
```

### 6. CSS Critique

```html
<!-- Inline le CSS critique dans <head> -->
<style>
  /* CSS critique pour first paint */
  body { font-family: Inter, sans-serif; }
  .container { max-width: 1200px; margin: 0 auto; }
  /* ... */
</style>

<!-- Charger le reste en async -->
<link rel="stylesheet" href="/css/output.css" media="print" onload="this.media='all'">
```

### 7. Optimisation JavaScript

```javascript
// Debounce pour les recherches
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utilisation
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
  performSearch(e.target.value);
}, 300));

// Intersection Observer pour lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadContent(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.lazy-load').forEach(el => {
  observer.observe(el);
});
```

### 8. Compression & Headers (Firebase Hosting)

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 📱 Optimisations Mobile

### 1. Viewport & Touch

```html
<!-- Viewport optimisé -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">

<!-- Touch icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

### 2. Tap Targets

```css
/* Boutons tactiles suffisamment grands */
button, a, input[type="checkbox"] {
  min-height: 44px;
  min-width: 44px;
}

/* Espacements pour éviter les clics accidentels */
.touch-target {
  padding: 12px;
  margin: 8px 0;
}
```

---

## 🔍 SEO Avancé

### 1. Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "QuizPro",
  "description": "Application de quiz éducatifs",
  "url": "https://votre-domaine.web.app"
}
</script>
```

### 2. Meta Tags Complets

```html
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="QuizPro - Quiz Éducatifs">
<meta property="og:description" content="Description de l'application">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://votre-domaine.web.app">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="QuizPro">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="/twitter-image.jpg">

<!-- Canonical -->
<link rel="canonical" href="https://votre-domaine.web.app">
```

### 3. Sitemap & Robots

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://votre-domaine.web.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://votre-domaine.web.app/quiz.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... -->
</urlset>
```

```txt
<!-- public/robots.txt -->
User-agent: *
Allow: /
Disallow: /admin.html

Sitemap: https://votre-domaine.web.app/sitemap.xml
```

---

## 📊 Monitoring Continu

### 1. Script de Test Performance

```javascript
// scripts/perf-test.js
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  
  console.log('Performance score:', runnerResult.lhr.categories.performance.score * 100);
  return runnerResult;
}

runLighthouse('http://localhost:3000');
```

### 2. Budget de Performance

```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      {
        "metric": "interactive",
        "budget": 3500
      },
      {
        "metric": "first-contentful-paint",
        "budget": 2000
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 300
      },
      {
        "resourceType": "stylesheet",
        "budget": 100
      }
    ]
  }
]
```

---

## ✅ Checklist Avant Déploiement

- [ ] Tests Lighthouse > 80 sur toutes les pages
- [ ] Core Web Vitals dans les limites
- [ ] Service Worker activé et testé
- [ ] Cache correctement configuré
- [ ] Meta tags SEO complets
- [ ] Sitemap.xml généré
- [ ] robots.txt configuré
- [ ] Images optimisées (WebP)
- [ ] Code splitting vérifié
- [ ] Bundle size < 500KB
- [ ] Aucune erreur console
- [ ] Tests E2E passent
- [ ] Accessibilité WCAG AA

---

**Date de création** : 2 novembre 2025  
**Dernière mise à jour** : 2 novembre 2025
