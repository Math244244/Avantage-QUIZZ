/**
 * Image Optimizer - Utilitaires pour optimiser le chargement des images
 * 
 * P1-4: Lazy-loading des images (WebP) et optimisation des assets
 * 
 * Fonctionnalités:
 * - Support WebP avec fallback automatique
 * - Lazy-loading natif
 * - Dimensions pour éviter layout shift
 * - Placeholder blur pour meilleure UX
 */

/**
 * Créer une balise <picture> optimisée avec support WebP
 * 
 * @param {Object} options - Options de configuration
 * @param {string} options.src - Chemin de l'image source (PNG/JPG)
 * @param {string} options.alt - Texte alternatif
 * @param {number} options.width - Largeur de l'image
 * @param {number} options.height - Hauteur de l'image
 * @param {boolean} options.lazy - Activer le lazy-loading (défaut: true)
 * @param {string} options.className - Classes CSS à ajouter
 * @param {string} options.id - ID de l'élément
 * @param {string} options.webpSrc - Chemin de la version WebP (optionnel, généré automatiquement si non fourni)
 * @returns {string} HTML de la balise <picture>
 */
export function createOptimizedImage({
    src,
    alt,
    width,
    height,
    lazy = true,
    className = '',
    id = '',
    webpSrc = null
}) {
    // Générer le chemin WebP si non fourni
    if (!webpSrc) {
        webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }

    // Attributs de base
    const imgAttributes = [
        `src="${src}"`,
        `alt="${alt}"`,
        width ? `width="${width}"` : '',
        height ? `height="${height}"` : '',
        lazy ? 'loading="lazy"' : '',
        className ? `class="${className}"` : '',
        id ? `id="${id}"` : '',
        'decoding="async"'
    ].filter(Boolean).join(' ');

    return `
        <picture>
            <source srcset="${webpSrc}" type="image/webp">
            <img ${imgAttributes}>
        </picture>
    `;
}

/**
 * Créer une balise <img> optimisée simple (sans WebP)
 * 
 * @param {Object} options - Options de configuration
 * @param {string} options.src - Chemin de l'image source
 * @param {string} options.alt - Texte alternatif
 * @param {number} options.width - Largeur de l'image
 * @param {number} options.height - Hauteur de l'image
 * @param {boolean} options.lazy - Activer le lazy-loading (défaut: true)
 * @param {string} options.className - Classes CSS à ajouter
 * @param {string} options.id - ID de l'élément
 * @returns {string} HTML de la balise <img>
 */
export function createOptimizedImg({
    src,
    alt,
    width,
    height,
    lazy = true,
    className = '',
    id = ''
}) {
    const attributes = [
        `src="${src}"`,
        `alt="${alt}"`,
        width ? `width="${width}"` : '',
        height ? `height="${height}"` : '',
        lazy ? 'loading="lazy"' : '',
        className ? `class="${className}"` : '',
        id ? `id="${id}"` : '',
        'decoding="async"'
    ].filter(Boolean).join(' ');

    return `<img ${attributes}>`;
}

/**
 * Vérifier si le navigateur supporte WebP
 * 
 * @returns {Promise<boolean>} True si WebP est supporté
 */
export function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

/**
 * Convertir une image en WebP (nécessite un service backend ou outil de build)
 * Cette fonction est un placeholder - la conversion réelle devrait être faite
 * au moment du build ou via un service backend
 * 
 * @param {string} imagePath - Chemin de l'image source
 * @returns {Promise<string>} Chemin de l'image WebP générée
 */
export async function convertToWebP(imagePath) {
    // TODO: Implémenter la conversion WebP
    // Pour l'instant, retourner le chemin avec extension .webp
    // La conversion réelle devrait être faite au build avec sharp/imagemin
    return imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

/**
 * Précharger une image critique
 * 
 * @param {string} src - Chemin de l'image
 * @param {string} type - Type d'image ('image/webp' ou 'image/png')
 */
export function preloadImage(src, type = 'image/png') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = type;
    document.head.appendChild(link);
}

/**
 * Observer les images pour le lazy-loading avec Intersection Observer
 * (Alternative au lazy-loading natif pour meilleur contrôle)
 * 
 * @param {NodeList|Array} images - Liste des images à observer
 * @param {Object} options - Options de l'Intersection Observer
 */
export function observeImages(images, options = {}) {
    if (!('IntersectionObserver' in window)) {
        // Fallback: charger toutes les images immédiatement
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        return;
    }

    const defaultOptions = {
        rootMargin: '50px',
        threshold: 0.01
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, { ...defaultOptions, ...options });

    images.forEach(img => observer.observe(img));
}



