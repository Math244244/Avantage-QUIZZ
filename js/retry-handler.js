/**
 * Gestionnaire de retry automatique pour les opérations réseau/Firestore
 * 
 * Ce module fournit un système de retry avec backoff exponentiel pour :
 * - Les requêtes Firestore qui échouent
 * - Les opérations réseau
 * - Les appels API
 */

import { logger } from './logger.js';
import { errorHandler, ErrorTypes } from './error-handler.js';

/**
 * Options par défaut pour le retry
 */
const DEFAULT_OPTIONS = {
    maxRetries: 3,
    initialDelay: 1000, // 1 seconde
    maxDelay: 30000, // 30 secondes max
    backoffMultiplier: 2,
    retryableErrors: ['unavailable', 'deadline-exceeded', 'internal', 'aborted'],
    onRetry: null // Callback appelé à chaque retry
};

/**
 * Vérifie si une erreur est retryable
 * @param {Error} error - L'erreur à vérifier
 * @param {Array} retryableErrors - Liste des codes d'erreur retryables
 * @returns {boolean} True si l'erreur est retryable
 */
function isRetryableError(error, retryableErrors) {
    if (!error) return false;
    
    const code = error.code || '';
    const message = (error.message || '').toLowerCase();
    
    // Erreurs réseau toujours retryables
    if (code === 'unavailable' || code === 'deadline-exceeded' || 
        message.includes('network') || message.includes('fetch failed')) {
        return true;
    }
    
    // Vérifier dans la liste des erreurs retryables
    return retryableErrors.some(retryableCode => 
        code === retryableCode || message.includes(retryableCode.toLowerCase())
    );
}

/**
 * Calcule le délai avant le prochain retry (backoff exponentiel)
 * @param {number} attempt - Numéro de la tentative (0 = première retry)
 * @param {number} initialDelay - Délai initial
 * @param {number} maxDelay - Délai maximum
 * @param {number} backoffMultiplier - Multiplicateur
 * @returns {number} Délai en millisecondes
 */
function calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier) {
    const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
    return Math.min(delay, maxDelay);
}

/**
 * Attend un certain délai
 * @param {number} ms - Millisecondes à attendre
 * @returns {Promise} Promise qui se résout après le délai
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exécute une fonction avec retry automatique
 * @param {Function} fn - Fonction async à exécuter
 * @param {Object} options - Options de retry
 * @returns {Promise} Résultat de la fonction
 */
export async function withRetry(fn, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError;
    
    // Première tentative
    try {
        return await fn();
    } catch (error) {
        lastError = error;
        
        // Si l'erreur n'est pas retryable, on arrête immédiatement
        if (!isRetryableError(error, opts.retryableErrors)) {
            throw error;
        }
    }
    
    // Retries
    for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
        const delay = calculateDelay(
            attempt,
            opts.initialDelay,
            opts.maxDelay,
            opts.backoffMultiplier
        );
        
        // Callback onRetry si fourni
        if (opts.onRetry) {
            opts.onRetry(attempt + 1, delay, lastError);
        } else {
            // Message par défaut
            logger.warn(`Nouvelle tentative ${attempt + 1}/${opts.maxRetries} dans ${delay}ms...`);
        }
        
        // Attendre avant de retry
        await wait(delay);
        
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            // Si l'erreur n'est plus retryable, arrêter
            if (!isRetryableError(error, opts.retryableErrors)) {
                throw error;
            }
            
            // Si c'est la dernière tentative, logger et throw
            if (attempt === opts.maxRetries - 1) {
                errorHandler.handleError(error, 'Retry handler - Max retries reached', {
                    showToUser: true,
                    userMessage: `Échec après ${opts.maxRetries} tentatives. Veuillez réessayer plus tard.`
                });
                throw error;
            }
        }
    }
    
    // Ne devrait jamais arriver ici, mais au cas où
    throw lastError;
}

/**
 * Wrapper spécialisé pour les opérations Firestore
 * @param {Function} firestoreOperation - Opération Firestore async
 * @param {Object} options - Options de retry
 * @returns {Promise} Résultat de l'opération
 */
export async function withFirestoreRetry(firestoreOperation, options = {}) {
    return withRetry(firestoreOperation, {
        ...options,
        retryableErrors: [
            'unavailable',
            'deadline-exceeded',
            'internal',
            'aborted',
            'resource-exhausted'
        ],
        onRetry: options.onRetry || ((attempt, delay) => {
            logger.warn(`Retry Firestore ${attempt}/${options.maxRetries || 3} dans ${delay}ms...`);
        })
    });
}

/**
 * Wrapper spécialisé pour les opérations réseau (fetch)
 * @param {Function} networkOperation - Opération réseau async
 * @param {Object} options - Options de retry
 * @returns {Promise} Résultat de l'opération
 */
export async function withNetworkRetry(networkOperation, options = {}) {
    return withRetry(networkOperation, {
        ...options,
        retryableErrors: ['network', 'timeout', 'fetch'],
        onRetry: options.onRetry || ((attempt, delay) => {
            logger.warn(`Retry réseau ${attempt}/${options.maxRetries || 3} dans ${delay}ms...`);
        })
    });
}

export default {
    withRetry,
    withFirestoreRetry,
    withNetworkRetry
};


