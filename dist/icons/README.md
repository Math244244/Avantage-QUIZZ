# Instructions pour créer les icônes PWA

Ce fichier explique comment générer les icônes nécessaires pour votre Progressive Web App.

## Option 1: Utiliser un générateur en ligne (Recommandé)

1. Allez sur: https://www.pwabuilder.com/imageGenerator
2. Téléchargez une image carrée de haute qualité (au moins 512x512px)
3. Téléchargez le pack d'icônes généré
4. Extrayez les icônes dans le dossier `icons/`

## Option 2: Créer manuellement avec un éditeur d'images

Créez des images PNG carrées aux dimensions suivantes:
- 72x72px → icon-72x72.png
- 96x96px → icon-96x96.png
- 128x128px → icon-128x128.png
- 144x144px → icon-144x144.png
- 152x152px → icon-152x152.png
- 192x192px → icon-192x192.png
- 384x384px → icon-384x384.png
- 512x512px → icon-512x512.png

## Option 3: Utiliser ImageMagick (ligne de commande)

Si vous avez ImageMagick installé:

```bash
# Créer toutes les tailles à partir d'une image source
magick convert source.png -resize 72x72 icons/icon-72x72.png
magick convert source.png -resize 96x96 icons/icon-96x96.png
magick convert source.png -resize 128x128 icons/icon-128x128.png
magick convert source.png -resize 144x144 icons/icon-144x144.png
magick convert source.png -resize 152x152 icons/icon-152x152.png
magick convert source.png -resize 192x192 icons/icon-192x192.png
magick convert source.png -resize 384x384 icons/icon-384x384.png
magick convert source.png -resize 512x512 icons/icon-512x512.png
```

⚠️ **Note**: Les icônes sont nécessaires pour que l'application soit installable sur mobile!
