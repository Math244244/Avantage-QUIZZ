/**
 * Gestionnaire de rate limiting pour les appels Firestore (Section 4 - Sécurité)
 * 
 * Ce module limite le nombre de requêtes Firestore par utilisateur pour prévenir
 * l'abus de quota et les attaques DoS.
 */

/**
 * Classe pour limiter le taux de requêtes
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    
    /**
     * Vérifie si une nouvelle requête est autorisée
     * @throws {Error} Si la limite est dépassée
     */
    async check() {
        const now = Date.now();
        
        // Nettoyer les requêtes anciennes (hors de la fenêtre)
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        
        // Vérifier si la limite est atteinte
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest);
            throw new Error(`Trop de requêtes. Veuillez patienter ${Math.ceil(waitTime / 1000)} secondes.`);
        }
        
        // Enregistrer la nouvelle requête
        this.requests.push(now);
    }
    
    /**
     * Réinitialise le compteur
     */
    reset() {
        this.requests = [];
    }
    
    /**
     * Retourne le nombre de requêtes restantes dans la fenêtre
     */
    getRemainingRequests() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxRequests - this.requests.length);
    }
}

/**
 * Rate limiter pour les requêtes Firestore
 * Limite : 100 requêtes par minute par utilisateur
 */
const firestoreRateLimiter = new RateLimiter(100, 60000); // 100 req/min

/**
 * Rate limiter pour les écritures Firestore (plus restrictif)
 * Limite : 50 écritures par minute par utilisateur
 */
const firestoreWriteRateLimiter = new RateLimiter(50, 60000); // 50 req/min

/**
 * Wrapper pour protéger les appels Firestore avec rate limiting
 * @param {Function} fn - Fonction async à exécuter
 * @param {Object} options - Options (isWrite: boolean)
 * @returns {Promise} Résultat de la fonction
 */
export async function safeFirestoreCall(fn, options = {}) {
    const limiter = options.isWrite ? firestoreWriteRateLimiter : firestoreRateLimiter;
    
    try {
        await limiter.check();
        return await fn();
    } catch (error) {
        // Si c'est une erreur de rate limiting, logger et re-throw
        if (error.message.includes('Trop de requêtes')) {
            console.warn('⚠️ Rate limit atteint:', error.message);
            throw error;
        }
        // Sinon, c'est une erreur de la fonction elle-même
        throw error;
    }
}

/**
 * Wrapper spécialisé pour les lectures Firestore
 */
export async function safeFirestoreRead(fn) {
    return safeFirestoreCall(fn, { isWrite: false });
}

/**
 * Wrapper spécialisé pour les écritures Firestore
 */
export async function safeFirestoreWrite(fn) {
    return safeFirestoreCall(fn, { isWrite: true });
}

/**
 * Réinitialise les rate limiters (utile pour les tests)
 */
export function resetRateLimiters() {
    firestoreRateLimiter.reset();
    firestoreWriteRateLimiter.reset();
}

export default {
    safeFirestoreCall,
    safeFirestoreRead,
    safeFirestoreWrite,
    resetRateLimiters
};


