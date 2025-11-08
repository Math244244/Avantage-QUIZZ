# 🎨 Assets de Branding Avantage Plus

## 📂 Organisation des Fichiers

### `/logos/` - Logos Principaux

#### Version Fond Rouge
- `logo-avantage-plus-white-on-red.png` - Logo blanc sur fond rouge (haute résolution)
- `logo-avantage-plus-white-on-red-500.png` - Version 500x500px
- `logo-avantage-plus-white-on-red-250.png` - Version 250x250px
- `logo-avantage-plus-white-on-red-150.png` - Version 150x150px (sidebar)
- `logo-avantage-plus-white-on-red-60.png` - Version 60x60px (header)

**Utilisation:**
- Sidebar (haut de la navigation)
- Page de login (grand logo centré)
- Emails de notification
- Présentations
- Documents imprimés

---

#### Version Transparente Rouge
- `logo-avantage-plus-red-transparent.png` - Logo rouge sur fond transparent (haute résolution)
- `logo-avantage-plus-red-transparent-500.png` - Version 500x500px
- `logo-avantage-plus-red-transparent-150.png` - Version 150x150px
- `logo-avantage-plus-red-transparent-60.png` - Version 60x60px

**Utilisation:**
- Watermark sur backgrounds clairs
- Pattern répétable (très subtil, opacity 0.05)
- Overlays sur cartes
- Footer
- Page 404

---

### `/favicons/` - Icons pour Navigateurs

**À générer depuis les logos:**
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-96x96.png`
- `apple-touch-icon-180x180.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `favicon.ico` (multi-résolution)

---

### `/patterns/` - Motifs de Background

#### Pattern Bouclier Subtil
- `pattern-shield-light.svg` - Motif clair (pour backgrounds blancs)
- `pattern-shield-dark.svg` - Motif sombre (pour backgrounds rouges)

**Utilisation:**
```css
background-image: url('/assets/images/patterns/pattern-shield-light.svg');
background-repeat: repeat;
opacity: 0.03;
```

---

## 🎨 Palette de Couleurs Extraite

Basée sur les logos fournis:

```css
:root {
  /* Rouge Principal (du logo) */
  --avantage-red-primary: #C41E3A;
  --avantage-red-dark: #8B1429;
  --avantage-red-light: #E63946;
  --avantage-red-bg: #DC1F32; /* Fond rouge du logo */
  
  /* Blanc (du logo) */
  --avantage-white: #FFFFFF;
  
  /* Gris (complémentaires) */
  --avantage-gray-light: #F8F9FA;
  --avantage-gray-medium: #6C757D;
  --avantage-gray-dark: #343A40;
  
  /* Doré (accents) */
  --avantage-gold: #FFD700;
  --avantage-gold-light: #FFF4CC;
}
```

---

## 📐 Spécifications Techniques

### Logo Blanc sur Rouge
- **Format:** PNG avec fond rouge
- **Ratio:** 1:1 (carré)
- **Couleur fond:** #DC1F32 (rouge profond)
- **Couleur logo:** #FFFFFF (blanc pur)
- **Éléments:** Bouclier + texte "PRODUITS AVANTAGEPLUS"

### Logo Rouge Transparent
- **Format:** PNG avec transparence
- **Ratio:** 1:1 (carré)
- **Couleur logo:** #E20613 ou #DC1F32 (rouge vif)
- **Background:** Transparent (canal alpha)
- **Utilisation:** Overlay, watermark, pattern

---

## 🔧 Commandes de Conversion

### Générer Favicons (avec ImageMagick)
```bash
# Depuis logo blanc sur rouge
convert logo-avantage-plus-white-on-red.png -resize 16x16 favicon-16x16.png
convert logo-avantage-plus-white-on-red.png -resize 32x32 favicon-32x32.png
convert logo-avantage-plus-white-on-red.png -resize 96x96 favicon-96x96.png
convert logo-avantage-plus-white-on-red.png -resize 180x180 apple-touch-icon-180x180.png
convert logo-avantage-plus-white-on-red.png -resize 192x192 android-chrome-192x192.png
convert logo-avantage-plus-white-on-red.png -resize 512x512 android-chrome-512x512.png
```

### Optimiser PNGs (avec pngquant)
```bash
pngquant --quality=80-95 --ext -optimized.png *.png
```

### Créer WebP (pour performance)
```bash
cwebp -q 90 logo-avantage-plus-white-on-red.png -o logo-avantage-plus-white-on-red.webp
cwebp -q 90 logo-avantage-plus-red-transparent.png -o logo-avantage-plus-red-transparent.webp
```

---

## 📋 Checklist d'Intégration

### ✅ Images à Ajouter Manuellement
- [ ] `logo-avantage-plus-white-on-red.png` (image 1 du chat)
- [ ] `logo-avantage-plus-red-transparent.png` (image 2 du chat)

### 🔄 À Générer
- [ ] Favicons (toutes tailles)
- [ ] Versions optimisées WebP
- [ ] Pattern SVG du bouclier
- [ ] Versions redimensionnées

### 🎨 À Intégrer dans le Code
- [ ] Sidebar (logo 150x150)
- [ ] Header pages (logo 60x60)
- [ ] Page login (logo 250x250)
- [ ] Favicon (index.html, admin.html, etc.)
- [ ] Manifest.json (PWA icons)
- [ ] Pattern background (subtil)

---

## 🚀 Prochaines Étapes

1. **Ajouter les 2 images dans `/logos/`**
2. **Générer les favicons** (ou utiliser un outil en ligne)
3. **Créer les patterns SVG** du bouclier
4. **Intégrer dans le code** selon le plan de refonte
5. **Tester sur différents backgrounds**

---

*Document créé le 2025-11-08*
*Dernière mise à jour: 2025-11-08*

