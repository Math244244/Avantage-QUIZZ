// Système de Tooltips - Position-aware tooltips pour l'interface
/**
 * Tooltip.js - Système complet de tooltips intelligents
 * 
 * Features:
 * - Auto-positionnement (détection de débordement)
 * - Animations fluides (fade-in/fade-out)
 * - Délai configurable (hover delay)
 * - Support keyboard (focus)
 * - Personnalisation (thèmes, tailles)
 * - Mobile-friendly (désactivé sur touch)
 * - Accessibilité (ARIA attributes)
 */

class TooltipManager {
    constructor() {
        this.activeTooltip = null;
        this.hoverDelay = 300; // ms avant affichage
        this.hideDelay = 100; // ms avant masquage
        this.hoverTimer = null;
        this.hideTimer = null;
        this.isTouchDevice = ('ontouchstart' in window);
        
        this.init();
    }
    
    /**
     * Initialiser le système de tooltips
     */
    init() {
        console.log('🎯 Initialisation du système de tooltips');
        
        // Créer le container global pour les tooltips
        this.createTooltipContainer();
        
        // Scanner et initialiser tous les éléments avec data-tooltip
        this.initializeTooltips();
        
        // Observer les nouveaux éléments ajoutés au DOM
        this.observeDOM();
        
        console.log('✅ Système de tooltips initialisé');
    }
    
    /**
     * Créer le container pour les tooltips
     */
    createTooltipContainer() {
        let container = document.getElementById('tooltip-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'tooltip-container';
            container.className = 'fixed pointer-events-none z-[9999]';
            document.body.appendChild(container);
        }
        this.container = container;
    }
    
    /**
     * Initialiser tous les tooltips existants
     */
    initializeTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]');
        elements.forEach(el => this.attachTooltip(el));
        console.log(`📌 ${elements.length} tooltips initialisés`);
    }
    
    /**
     * Observer les mutations du DOM
     */
    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.hasAttribute && node.hasAttribute('data-tooltip')) {
                            this.attachTooltip(node);
                        }
                        // Chercher dans les enfants
                        if (node.querySelectorAll) {
                            node.querySelectorAll('[data-tooltip]').forEach(el => {
                                this.attachTooltip(el);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Attacher un tooltip à un élément
     */
    attachTooltip(element) {
        // Éviter les doublons
        if (element.dataset.tooltipAttached) return;
        element.dataset.tooltipAttached = 'true';
        
        // Désactiver sur mobile touch
        if (this.isTouchDevice) return;
        
        // Events
        element.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, element));
        element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        element.addEventListener('focus', (e) => this.handleFocus(e, element));
        element.addEventListener('blur', (e) => this.handleBlur(e));
        
        // ARIA attributes pour accessibilité
        element.setAttribute('aria-describedby', `tooltip-${this.generateId()}`);
    }
    
    /**
     * Générer un ID unique
     */
    generateId() {
        return Math.random().toString(36).substring(2, 11);
    }
    
    /**
     * Gérer mouseenter
     */
    handleMouseEnter(event, element) {
        clearTimeout(this.hideTimer);
        
        this.hoverTimer = setTimeout(() => {
            this.showTooltip(element);
        }, this.hoverDelay);
    }
    
    /**
     * Gérer mouseleave
     */
    handleMouseLeave(event) {
        clearTimeout(this.hoverTimer);
        
        this.hideTimer = setTimeout(() => {
            this.hideTooltip();
        }, this.hideDelay);
    }
    
    /**
     * Gérer focus (keyboard)
     */
    handleFocus(event, element) {
        this.showTooltip(element);
    }
    
    /**
     * Gérer blur (keyboard)
     */
    handleBlur(event) {
        this.hideTooltip();
    }
    
    /**
     * Afficher le tooltip
     */
    showTooltip(element) {
        const text = element.dataset.tooltip;
        const position = element.dataset.tooltipPosition || 'top';
        const theme = element.dataset.tooltipTheme || 'dark';
        const size = element.dataset.tooltipSize || 'medium';
        
        if (!text) return;
        
        // Cacher l'ancien tooltip
        this.hideTooltip();
        
        // Créer le nouveau tooltip
        const tooltip = this.createTooltipElement(text, theme, size);
        this.container.appendChild(tooltip);
        this.activeTooltip = tooltip;
        
        // Positionner le tooltip
        this.positionTooltip(tooltip, element, position);
        
        // Animation d'apparition
        setTimeout(() => {
            tooltip.classList.remove('opacity-0', 'scale-95');
            tooltip.classList.add('opacity-100', 'scale-100');
        }, 10);
    }
    
    /**
     * Créer l'élément tooltip
     */
    createTooltipElement(text, theme, size) {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip absolute opacity-0 scale-95 transform transition-all duration-200 ease-out ${this.getThemeClasses(theme)} ${this.getSizeClasses(size)}`;
        
        // Contenu
        tooltip.innerHTML = `
            <div class="tooltip-content relative">
                ${text}
                <div class="tooltip-arrow absolute w-2 h-2 transform rotate-45 ${this.getArrowClasses(theme)}"></div>
            </div>
        `;
        
        return tooltip;
    }
    
    /**
     * Obtenir les classes de thème
     */
    getThemeClasses(theme) {
        const themes = {
            'dark': 'bg-slate-900 text-white shadow-lg',
            'light': 'bg-white text-slate-900 shadow-lg border border-slate-200',
            'success': 'bg-green-600 text-white shadow-lg',
            'error': 'bg-red-600 text-white shadow-lg',
            'warning': 'bg-orange-600 text-white shadow-lg',
            'info': 'bg-blue-600 text-white shadow-lg'
        };
        return themes[theme] || themes.dark;
    }
    
    /**
     * Obtenir les classes de taille
     */
    getSizeClasses(size) {
        const sizes = {
            'small': 'text-xs px-2 py-1 rounded',
            'medium': 'text-sm px-3 py-2 rounded-md',
            'large': 'text-base px-4 py-3 rounded-lg'
        };
        return sizes[size] || sizes.medium;
    }
    
    /**
     * Obtenir les classes de flèche
     */
    getArrowClasses(theme) {
        const arrows = {
            'dark': 'bg-slate-900',
            'light': 'bg-white border-l border-b border-slate-200',
            'success': 'bg-green-600',
            'error': 'bg-red-600',
            'warning': 'bg-orange-600',
            'info': 'bg-blue-600'
        };
        return arrows[theme] || arrows.dark;
    }
    
    /**
     * Positionner le tooltip intelligemment
     */
    positionTooltip(tooltip, element, preferredPosition) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const arrow = tooltip.querySelector('.tooltip-arrow');
        
        const spacing = 8; // Espace entre élément et tooltip
        const arrowSize = 8;
        
        // Calculer toutes les positions possibles
        const positions = {
            top: {
                top: rect.top - tooltipRect.height - spacing,
                left: rect.left + (rect.width / 2) - (tooltipRect.width / 2),
                arrowTop: tooltipRect.height - arrowSize / 2,
                arrowLeft: tooltipRect.width / 2 - arrowSize / 2,
                arrowRotate: 'rotate(45deg)'
            },
            bottom: {
                top: rect.bottom + spacing,
                left: rect.left + (rect.width / 2) - (tooltipRect.width / 2),
                arrowTop: -arrowSize / 2,
                arrowLeft: tooltipRect.width / 2 - arrowSize / 2,
                arrowRotate: 'rotate(225deg)'
            },
            left: {
                top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
                left: rect.left - tooltipRect.width - spacing,
                arrowTop: tooltipRect.height / 2 - arrowSize / 2,
                arrowLeft: tooltipRect.width - arrowSize / 2,
                arrowRotate: 'rotate(135deg)'
            },
            right: {
                top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
                left: rect.right + spacing,
                arrowTop: tooltipRect.height / 2 - arrowSize / 2,
                arrowLeft: -arrowSize / 2,
                arrowRotate: 'rotate(315deg)'
            }
        };
        
        // Déterminer la meilleure position
        let position = preferredPosition;
        
        // Vérifier si la position préférée déborde
        const testPosition = positions[preferredPosition];
        if (testPosition) {
            const wouldOverflow = 
                testPosition.top < 0 || 
                testPosition.top + tooltipRect.height > window.innerHeight ||
                testPosition.left < 0 || 
                testPosition.left + tooltipRect.width > window.innerWidth;
            
            // Trouver une position alternative
            if (wouldOverflow) {
                const alternatives = ['top', 'bottom', 'left', 'right'];
                for (const alt of alternatives) {
                    const altPos = positions[alt];
                    const altOverflow = 
                        altPos.top < 0 || 
                        altPos.top + tooltipRect.height > window.innerHeight ||
                        altPos.left < 0 || 
                        altPos.left + tooltipRect.width > window.innerWidth;
                    
                    if (!altOverflow) {
                        position = alt;
                        break;
                    }
                }
            }
        }
        
        // Appliquer la position
        const finalPosition = positions[position] || positions.top;
        tooltip.style.top = `${finalPosition.top}px`;
        tooltip.style.left = `${finalPosition.left}px`;
        
        // Positionner la flèche
        if (arrow) {
            arrow.style.top = `${finalPosition.arrowTop}px`;
            arrow.style.left = `${finalPosition.arrowLeft}px`;
            arrow.style.transform = finalPosition.arrowRotate;
        }
    }
    
    /**
     * Cacher le tooltip
     */
    hideTooltip() {
        if (!this.activeTooltip) return;
        
        // Animation de disparition
        this.activeTooltip.classList.remove('opacity-100', 'scale-100');
        this.activeTooltip.classList.add('opacity-0', 'scale-95');
        
        // Supprimer après l'animation
        setTimeout(() => {
            if (this.activeTooltip && this.activeTooltip.parentNode) {
                this.activeTooltip.parentNode.removeChild(this.activeTooltip);
            }
            this.activeTooltip = null;
        }, 200);
    }
    
    /**
     * Ajouter un tooltip programmatiquement
     */
    add(element, text, options = {}) {
        element.dataset.tooltip = text;
        element.dataset.tooltipPosition = options.position || 'top';
        element.dataset.tooltipTheme = options.theme || 'dark';
        element.dataset.tooltipSize = options.size || 'medium';
        
        this.attachTooltip(element);
    }
    
    /**
     * Retirer un tooltip
     */
    remove(element) {
        element.removeAttribute('data-tooltip');
        element.removeAttribute('data-tooltip-position');
        element.removeAttribute('data-tooltip-theme');
        element.removeAttribute('data-tooltip-size');
        element.removeAttribute('data-tooltip-attached');
        element.removeAttribute('aria-describedby');
    }
    
    /**
     * Mettre à jour un tooltip
     */
    update(element, text, options = {}) {
        this.remove(element);
        this.add(element, text, options);
    }
    
    /**
     * Détruire le système de tooltips
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        clearTimeout(this.hoverTimer);
        clearTimeout(this.hideTimer);
        
        console.log('🗑️ Système de tooltips détruit');
    }
}

// Créer l'instance globale
const tooltip = new TooltipManager();

// Export pour utilisation dans d'autres modules
export { tooltip, TooltipManager };

// Rendre accessible globalement
window.tooltip = tooltip;
