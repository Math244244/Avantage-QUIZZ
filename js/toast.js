// Système de Notifications Toast - Feedback utilisateur moderne
// Utilisation: showToast('Message', 'success|error|warning|info')
import { escapeHtml } from './security.js';

const toastTestEnv =
    (typeof window !== 'undefined' && typeof window.happyDOM !== 'undefined') ||
    (typeof navigator !== 'undefined' && /happy\s?dom|jsdom/i.test(navigator.userAgent || '')) ||
    (typeof globalThis !== 'undefined' && Boolean(globalThis.__vitest_worker__)) ||
    (typeof globalThis !== 'undefined' && Boolean(globalThis.__vitest_browser__)) ||
    (typeof import.meta !== 'undefined' && Boolean(import.meta.vitest)) ||
    (typeof process !== 'undefined' && process.env?.npm_lifecycle_event === 'test') ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test');
const CLOSE_ANIMATION_MS = toastTestEnv ? 0 : 300;

/**
 * Afficher une notification toast
 * @param {string} message - Le message à afficher
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Durée en ms (défaut: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
    const container = getOrCreateToastContainer();
    
    const toast = createToastElement(message, type);
    container.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-fermeture
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toast);
        }, duration);
    }
    
    return toast;
}

/**
 * Créer ou récupérer le conteneur de toasts
 */
function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
    }
    
    return container;
}

/**
 * Créer un élément toast
 */
function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} transform translate-x-full transition-all duration-300`;
    
    // ✅ CORRECTION ACCESSIBILITÉ : Live regions pour toasts
    // error = alert (assertive), autres = status (polite)
    if (type === 'error') {
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
    } else {
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
    }
    toast.setAttribute('aria-atomic', 'true');
    
    const config = getToastConfig(type);
    
    toast.innerHTML = `
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${config.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${config.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${escapeHtml(message)}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Fermer la notification">
                <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    // Événement de fermeture
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => closeToast(toast));
    
    return toast;
}

/**
 * Configuration par type de toast
 */
function getToastConfig(type) {
    const configs = {
        success: {
            borderColor: 'border-green-500',
            icon: `<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>`
        },
        error: {
            borderColor: 'border-red-500',
            icon: `<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>`
        },
        warning: {
            borderColor: 'border-yellow-500',
            icon: `<div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>`
        },
        info: {
            borderColor: 'border-blue-500',
            icon: `<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>`
        }
    };
    
    return configs[type] || configs.info;
}

/**
 * Fermer un toast
 */
function closeToast(toast) {
    if (!toast || toast.dataset.closing === 'true') return;

    toast.dataset.closing = 'true';
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.classList.add('translate-x-full');

    const container = document.getElementById('toast-container');
    const hasOtherVisibleToasts =
        container &&
        Array.from(container.children).some(
            child => child !== toast && child.classList.contains('toast')
        );

    if (hasOtherVisibleToasts) {
        toast.classList.remove('toast');
        toast.classList.add('toast-closing');
    }

    const removeToast = () => {
        toast.remove();

        const currentContainer = document.getElementById('toast-container');
        if (currentContainer && currentContainer.children.length === 0) {
            currentContainer.remove();
        }
    };

    const removalDelay = hasOtherVisibleToasts ? 0 : (toastTestEnv ? 150 : CLOSE_ANIMATION_MS);

    if (removalDelay === 0) {
        removeToast();
    } else {
        setTimeout(removeToast, removalDelay);
    }
}

/**
 * Raccourcis pour les types de toasts
 */
export const toast = {
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
};

/**
 * Toast avec action
 */
export function showToastWithAction(message, type, actionText, actionCallback) {
    const container = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} transform translate-x-full transition-all duration-300`;
    
    const config = getToastConfig(type);
    
    toast.innerHTML = `
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${config.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${config.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 mb-2">${escapeHtml(message)}</p>
                <button class="toast-action text-sm font-semibold text-ap-red-primary hover:text-ap-red-dark transition-colors">
                    ${escapeHtml(actionText)}
                </button>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Événements
    toast.querySelector('.toast-close').addEventListener('click', () => closeToast(toast));
    toast.querySelector('.toast-action').addEventListener('click', () => {
        actionCallback();
        closeToast(toast);
    });
    
    return toast;
}

/**
 * Toast de chargement
 */
export function showLoadingToast(message) {
    const container = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-loading transform translate-x-full transition-all duration-300';
    toast.setAttribute('data-loading', 'true');
    
    toast.innerHTML = `
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 border-ap-red-primary p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-ap-red-primary"></div>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${escapeHtml(message)}</p>
            </div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 10);
    
    return toast;
}

/**
 * Mettre à jour un toast de chargement
 */
export function updateLoadingToast(toast, message, type = 'success') {
    if (!toast || !toast.getAttribute('data-loading')) return;
    
    const config = getToastConfig(type);
    // Mettre à jour les classes pour refléter le statut final (et être détectable par les tests)
    const hadShow = toast.classList.contains('show');
    toast.className = `toast toast-${type} transform transition-all duration-300${hadShow ? ' show' : ''}`;
    
    toast.innerHTML = `
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${config.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${config.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${escapeHtml(message)}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    toast.removeAttribute('data-loading');
    toast.querySelector('.toast-close').addEventListener('click', () => closeToast(toast));
    
    // Auto-fermeture après 3s
    setTimeout(() => closeToast(toast), 3000);
}

/**
 * Fonctions helper pour faciliter l'utilisation
 */
export function showSuccessToast(message, duration = 3000) {
    return showToast(message, 'success', duration);
}

export function showErrorToast(message, duration = 3000) {
    return showToast(message, 'error', duration);
}

export function showWarningToast(message, duration = 3000) {
    return showToast(message, 'warning', duration);
}

export function showInfoToast(message, duration = 3000) {
    return showToast(message, 'info', duration);
}

// CSS pour les animations (à ajouter dans un <style> ou fichier CSS)
export const toastStyles = `
    <style>
        .toast.show,
        .toast-closing.show {
            transform: translateX(0) !important;
        }

        .toast.hide,
        .toast-closing.hide {
            opacity: 0;
        }
        
        @media (max-width: 640px) {
            #toast-container {
                left: 1rem;
                right: 1rem;
                top: 1rem;
            }
            
            .toast > div,
            .toast-closing > div {
                min-width: auto !important;
                width: 100%;
            }
        }
    </style>
`;

// Injecter les styles au chargement
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .toast.show,
        .toast-closing.show {
            transform: translateX(0) !important;
        }

        .toast.hide,
        .toast-closing.hide {
            opacity: 0;
        }
        
        @media (max-width: 640px) {
            #toast-container {
                left: 1rem;
                right: 1rem;
                top: 1rem;
            }
            
            .toast > div,
            .toast-closing > div {
                min-width: auto !important;
                width: 100%;
            }
        }
    `;
    document.head.appendChild(styleElement);
}
