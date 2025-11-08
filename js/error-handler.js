/**
 * Gestionnaire d'erreurs centralisé pour l'application Avantage QUIZZ
 * 
 * Ce module fournit une gestion d'erreurs centralisée pour :
 * - Capturer les erreurs non gérées
 * - Logger les erreurs de manière cohérente
 * - Afficher des messages utilisateur appropriés
 * - Envoyer les erreurs critiques à Firestore (si admin)
 */

import { logger } from './logger.js';
import { toast } from './toast.js';
import { isDemoMode } from './auth.js';

/**
 * Types d'erreurs possibles
 */
export const ErrorTypes = {
    NETWORK: 'NETWORK',
    FIRESTORE: 'FIRESTORE',
    AUTH: 'AUTH',
    VALIDATION: 'VALIDATION',
    UNKNOWN: 'UNKNOWN'
};

/**
 * Classe pour gérer les erreurs de manière centralisée
 */
class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100; // Limiter la taille du log en mémoire
        this.setupGlobalHandlers();
    }

    /**
     * Configure les gestionnaires d'erreurs globaux
     */
    setupGlobalHandlers() {
        // Gestionnaire pour les erreurs JavaScript non capturées
        window.addEventListener('error', (event) => {
            this.handleError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                type: ErrorTypes.UNKNOWN
            }, 'Global error handler');
        });

        // Gestionnaire pour les promesses rejetées non gérées
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                message: event.reason?.message || 'Unhandled promise rejection',
                error: event.reason,
                type: ErrorTypes.UNKNOWN
            }, 'Unhandled promise rejection');
        });
    }

    /**
     * Gère une erreur de manière centralisée
     * @param {Error|Object} error - L'erreur à gérer
     * @param {string} context - Contexte où l'erreur s'est produite
     * @param {Object} options - Options supplémentaires
     */
    handleError(error, context = 'Unknown', options = {}) {
        const errorData = this.normalizeError(error, context, options);
        
        // Logger l'erreur
        this.logError(errorData);
        
        // Afficher un message utilisateur si nécessaire
        if (options.showToUser !== false) {
            this.showUserMessage(errorData, options);
        }
        
        // Envoyer à Firestore si critique et en production
        if (options.critical && !isDemoMode()) {
            this.sendToFirestore(errorData).catch(err => {
                logger.error('Impossible d\'envoyer l\'erreur à Firestore:', err);
            });
        }
        
        return errorData;
    }

    /**
     * Normalise une erreur en objet standardisé
     * @param {Error|Object} error - L'erreur à normaliser
     * @param {string} context - Contexte
     * @param {Object} options - Options
     * @returns {Object} Erreur normalisée
     */
    normalizeError(error, context, options) {
        const errorData = {
            message: error?.message || String(error) || 'Erreur inconnue',
            stack: error?.stack,
            context: context,
            type: this.detectErrorType(error),
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...options.metadata
        };

        // Ajouter des informations spécifiques selon le type d'erreur
        if (error?.code) {
            errorData.code = error.code;
        }
        if (error?.name) {
            errorData.name = error.name;
        }

        return errorData;
    }

    /**
     * Détecte le type d'erreur basé sur le message ou le code
     * @param {Error|Object} error - L'erreur
     * @returns {string} Type d'erreur
     */
    detectErrorType(error) {
        if (!error) return ErrorTypes.UNKNOWN;

        const message = (error.message || '').toLowerCase();
        const code = error.code || '';

        if (code === 'unavailable' || code === 'deadline-exceeded' || message.includes('network') || message.includes('fetch')) {
            return ErrorTypes.NETWORK;
        }
        if (code === 'permission-denied' || code === 'unauthenticated' || message.includes('auth')) {
            return ErrorTypes.AUTH;
        }
        if (code === 'invalid-argument' || code === 'failed-precondition' || message.includes('validation')) {
            return ErrorTypes.VALIDATION;
        }
        if (message.includes('firestore') || code.startsWith('firestore')) {
            return ErrorTypes.FIRESTORE;
        }

        return ErrorTypes.UNKNOWN;
    }

    /**
     * Log l'erreur de manière cohérente
     * @param {Object} errorData - Données d'erreur normalisées
     */
    logError(errorData) {
        // Ajouter au log en mémoire
        this.errorLog.push(errorData);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift(); // Garder seulement les N dernières erreurs
        }

        // Logger selon le type
        const logMessage = `[${errorData.type}] ${errorData.context}: ${errorData.message}`;
        
        if (errorData.type === ErrorTypes.NETWORK) {
            logger.warn(logMessage, errorData);
        } else {
            logger.error(logMessage, errorData);
        }
    }

    /**
     * Affiche un message utilisateur approprié
     * @param {Object} errorData - Données d'erreur
     * @param {Object} options - Options
     */
    showUserMessage(errorData, options) {
        let message = options.userMessage;
        
        if (!message) {
            // Messages par défaut selon le type
            switch (errorData.type) {
                case ErrorTypes.NETWORK:
                    message = 'Problème de connexion. Vérifiez votre connexion internet.';
                    break;
                case ErrorTypes.AUTH:
                    message = 'Erreur d\'authentification. Veuillez vous reconnecter.';
                    break;
                case ErrorTypes.VALIDATION:
                    message = 'Données invalides. Veuillez vérifier vos informations.';
                    break;
                case ErrorTypes.FIRESTORE:
                    message = 'Erreur lors de l\'accès aux données. Veuillez réessayer.';
                    break;
                default:
                    message = 'Une erreur est survenue. Veuillez réessayer.';
            }
        }

        // Afficher le toast
        const duration = options.duration || (errorData.type === ErrorTypes.NETWORK ? 8000 : 5000);
        toast.error(message, duration);
    }

    /**
     * Envoie l'erreur à Firestore pour analyse (si admin)
     * ✅ CORRECTION SECTION 9 : Ajouter tracking Analytics
     * @param {Object} errorData - Données d'erreur
     */
    async sendToFirestore(errorData) {
        // ✅ CORRECTION SECTION 9 : Tracker l'erreur avec Analytics
        try {
            const { trackError } = await import('./analytics.js');
            trackError(new Error(errorData.message), {
                error_type: errorData.type,
                error_source: errorData.source,
                user_id: errorData.userId || 'anonymous'
            });
        } catch (analyticsError) {
            // Mode silencieux si analytics non disponible
            console.warn('Analytics non disponible pour tracking erreur');
        }
        
        try {
            // Import dynamique pour éviter les dépendances circulaires
            const { db } = await import('./firebase-config.js');
            const { collection, addDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const { isCurrentUserAdmin } = await import('./firestore-service.js');
            
            // Seulement si admin (pour éviter les coûts)
            const isAdmin = await isCurrentUserAdmin();
            if (!isAdmin) {
                return;
            }

            await addDoc(collection(db, 'errorLogs'), {
                ...errorData,
                timestamp: Timestamp.now()
            });
        } catch (err) {
            // Ne pas logger pour éviter les boucles infinies
            console.error('Impossible d\'envoyer l\'erreur à Firestore:', err);
        }
    }

    /**
     * Récupère les erreurs récentes
     * @param {number} limit - Nombre d'erreurs à retourner
     * @returns {Array} Liste des erreurs
     */
    getRecentErrors(limit = 10) {
        return this.errorLog.slice(-limit);
    }

    /**
     * Efface le log d'erreurs
     */
    clearErrorLog() {
        this.errorLog = [];
    }
}

// Instance singleton
export const errorHandler = new ErrorHandler();

/**
 * Fonction utilitaire pour wrapper les fonctions async avec gestion d'erreur
 * @param {Function} fn - Fonction async à wrapper
 * @param {string} context - Contexte de l'erreur
 * @param {Object} options - Options
 * @returns {Function} Fonction wrappée
 */
export function withErrorHandling(fn, context, options = {}) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            errorHandler.handleError(error, context, options);
            throw error; // Re-throw pour permettre la gestion en amont si nécessaire
        }
    };
}

/**
 * Fonction utilitaire pour créer un gestionnaire d'erreur pour une fonction spécifique
 * @param {Function} fn - Fonction à protéger
 * @param {string} context - Contexte
 * @param {Object} options - Options
 * @returns {Function} Fonction protégée
 */
export function protectFunction(fn, context, options = {}) {
    return withErrorHandling(fn, context, {
        ...options,
        showToUser: options.showToUser !== false
    });
}

export default errorHandler;


