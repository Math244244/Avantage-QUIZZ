// Empty States - Helper pour afficher des états vides avec illustrations SVG
/**
 * empty-states.js - Gestion centralisée des états vides
 * 
 * Illustrations SVG inline pour:
 * - Aucune question
 * - Aucun résultat
 * - Aucune ressource
 * - Aucun utilisateur
 * - Aucune notification
 * - Erreurs génériques
 */

/**
 * Illustrations SVG
 */
const illustrations = {
    // Aucune question créée
    noQuestions: `
        <svg class="w-32 h-32 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.3"/>
        </svg>
    `,
    
    // Aucun résultat de quiz
    noResults: `
        <svg class="w-32 h-32 mx-auto mb-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            </path>
            <line x1="6" y1="15" x2="6" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <line x1="12" y1="11" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <line x1="18" y1="7" x2="18" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        </svg>
    `,
    
    // Aucune ressource disponible
    noResources: `
        <svg class="w-32 h-32 mx-auto mb-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
            </path>
            <circle cx="7" cy="10" r="1" fill="currentColor" opacity="0.3"/>
            <circle cx="17" cy="10" r="1" fill="currentColor" opacity="0.3"/>
        </svg>
    `,
    
    // Aucun utilisateur trouvé
    noUsers: `
        <svg class="w-32 h-32 mx-auto mb-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
        </svg>
    `,
    
    // Aucune notification
    noNotifications: `
        <svg class="w-32 h-32 mx-auto mb-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.5 9.5l5 5m0-5l-5 5" opacity="0.3">
            </path>
        </svg>
    `,
    
    // Erreur générique
    error: `
        <svg class="w-32 h-32 mx-auto mb-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
            </path>
            <circle cx="12" cy="15" r="1" fill="currentColor"/>
        </svg>
    `,
    
    // Chargement en cours
    loading: `
        <svg class="w-32 h-32 mx-auto mb-6 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
            </path>
        </svg>
    `,
    
    // Recherche sans résultat
    noSearchResults: `
        <svg class="w-32 h-32 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 9l6 6m0-6l-6 6" opacity="0.3">
            </path>
        </svg>
    `
};

/**
 * Configuration des messages par type
 */
const emptyStateConfig = {
    noQuestions: {
        title: 'Aucune question créée',
        description: 'Commencez par créer votre première question ou importez un fichier JSON',
        illustration: illustrations.noQuestions,
        action: {
            text: '➕ Créer une question',
            show: true
        }
    },
    noResults: {
        title: 'Aucun quiz complété',
        description: 'Commencez votre premier quiz pour voir vos résultats ici',
        illustration: illustrations.noResults,
        action: {
            text: '🎯 Commencer un quiz',
            show: true,
            href: 'index.html'
        }
    },
    noResources: {
        title: 'Aucune ressource disponible',
        description: 'Les documents et ressources seront ajoutés prochainement',
        illustration: illustrations.noResources,
        action: {
            show: false
        }
    },
    noUsers: {
        title: 'Aucun utilisateur trouvé',
        description: 'Créez votre premier utilisateur pour commencer',
        illustration: illustrations.noUsers,
        action: {
            text: '👤 Créer un utilisateur',
            show: true
        }
    },
    noNotifications: {
        title: 'Aucune notification',
        description: 'Vous êtes à jour ! Aucune nouvelle notification pour le moment.',
        illustration: illustrations.noNotifications,
        action: {
            show: false
        }
    },
    error: {
        title: 'Une erreur est survenue',
        description: 'Impossible de charger les données. Veuillez réessayer.',
        illustration: illustrations.error,
        action: {
            text: '🔄 Réessayer',
            show: true
        }
    },
    noSearchResults: {
        title: 'Aucun résultat trouvé',
        description: 'Essayez avec d\'autres mots-clés ou filtres',
        illustration: illustrations.noSearchResults,
        action: {
            text: '🔍 Réinitialiser les filtres',
            show: true
        }
    },
    loading: {
        title: 'Chargement en cours...',
        description: 'Veuillez patienter pendant le chargement des données',
        illustration: illustrations.loading,
        action: {
            show: false
        }
    }
};

/**
 * Créer un état vide HTML
 * @param {string} type - Type d'état vide (noQuestions, noResults, etc.)
 * @param {object} options - Options de personnalisation
 * @returns {string} HTML de l'état vide
 */
export function createEmptyState(type, options = {}) {
    const config = emptyStateConfig[type];
    if (!config) {
        console.error(`Type d'état vide inconnu: ${type}`);
        return '';
    }
    
    const title = options.title || config.title;
    const description = options.description || config.description;
    const illustration = options.illustration || config.illustration;
    const action = options.action !== undefined ? options.action : config.action;
    
    return `
        <div class="empty-state text-center py-16 px-6">
            ${illustration}
            <h3 class="text-2xl font-bold text-slate-700 mb-3">
                ${title}
            </h3>
            <p class="text-slate-500 mb-6 max-w-md mx-auto">
                ${description}
            </p>
            ${action.show ? `
                <button 
                    class="empty-state-action px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    ${action.href ? `onclick="window.location.href='${action.href}'"` : ''}
                >
                    ${action.text}
                </button>
            ` : ''}
        </div>
    `;
}

/**
 * Afficher un état vide dans un conteneur
 * @param {string} containerId - ID du conteneur
 * @param {string} type - Type d'état vide
 * @param {object} options - Options de personnalisation
 */
export function showEmptyState(containerId, type, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Conteneur non trouvé: ${containerId}`);
        return;
    }
    
    container.innerHTML = createEmptyState(type, options);
    
    // Animation d'apparition
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        emptyState.style.opacity = '0';
        emptyState.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            emptyState.style.transition = 'all 400ms ease-out';
            emptyState.style.opacity = '1';
            emptyState.style.transform = 'translateY(0)';
        }, 10);
    }
}

/**
 * Créer un état d'erreur personnalisé
 * @param {string} message - Message d'erreur
 * @param {function} onRetry - Callback pour le bouton réessayer
 * @returns {string} HTML de l'erreur
 */
export function createErrorState(message, onRetry = null) {
    const retryId = `retry-btn-${Math.random().toString(36).substr(2, 9)}`;
    
    const html = `
        <div class="empty-state text-center py-16 px-6">
            ${illustrations.error}
            <h3 class="text-2xl font-bold text-red-600 mb-3">
                Une erreur est survenue
            </h3>
            <p class="text-slate-600 mb-6 max-w-md mx-auto">
                ${message}
            </p>
            ${onRetry ? `
                <button 
                    id="${retryId}"
                    class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                    🔄 Réessayer
                </button>
            ` : ''}
        </div>
    `;
    
    // Attacher le callback après insertion dans le DOM
    if (onRetry) {
        setTimeout(() => {
            const btn = document.getElementById(retryId);
            if (btn) {
                btn.addEventListener('click', onRetry);
            }
        }, 10);
    }
    
    return html;
}

/**
 * Afficher un état d'erreur dans un conteneur
 * @param {string} containerId - ID du conteneur
 * @param {string} message - Message d'erreur
 * @param {function} onRetry - Callback pour le bouton réessayer
 */
export function showErrorState(containerId, message, onRetry = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Conteneur non trouvé: ${containerId}`);
        return;
    }
    
    container.innerHTML = createErrorState(message, onRetry);
}

/**
 * Helper pour remplacer les états vides existants
 * Recherche et remplace les divs avec certaines classes
 */
export function upgradeExistingEmptyStates() {
    // Rechercher les anciens états vides (texte simple)
    const oldEmptyStates = document.querySelectorAll('[data-empty-state-type]');
    
    oldEmptyStates.forEach(element => {
        const type = element.dataset.emptyStateType;
        const containerId = element.id || `empty-${Math.random().toString(36).substr(2, 9)}`;
        element.id = containerId;
        
        showEmptyState(containerId, type);
    });
}

// Export des illustrations pour utilisation directe
export { illustrations };

// Initialiser automatiquement au chargement
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        upgradeExistingEmptyStates();
    });
}

// Rendre accessible globalement
if (typeof window !== 'undefined') {
    window.EmptyStates = {
        create: createEmptyState,
        show: showEmptyState,
        createError: createErrorState,
        showError: showErrorState,
        illustrations
    };
}
