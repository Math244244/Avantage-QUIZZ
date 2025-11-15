/**
 * Gestionnaire de rate limiting pour les appels Firestore (Section 4 - Sécurité)
 * 
 * Ce module limite le nombre de requêtes Firestore par utilisateur pour prévenir
 * l'abus de quota et les attaques DoS.
 */

/**
 * Erreur dédiée au rate limiting (permet d'inspecter le temps d'attente)
 */
export class RateLimitError extends Error {
    constructor(waitTimeMs) {
        super(`Trop de requêtes. Veuillez patienter ${Math.ceil(waitTimeMs / 1000)} secondes.`);
        this.name = 'RateLimitError';
        this.waitTimeMs = waitTimeMs;
    }
}

/**
 * Classe pour limiter le taux de requêtes
 */
export class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    /**
     * Nettoyage interne des requêtes expirées
     * @param {number} [now=Date.now()]
     */
    _cleanup(now = Date.now()) {
        this.requests = this.requests.filter(time => now - time < this.windowMs);
    }

    /**
     * Vérifie si une nouvelle requête peut être exécutée immédiatement
     * @returns {boolean} true si la requête peut être exécutée, false sinon
     */
    canExecute() {
        const now = Date.now();
        this._cleanup(now);

        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return true;
        }

        return false;
    }

    /**
     * Retourne le temps restant avant la prochaine exécution possible
     * @returns {number} Temps en ms
     */
    getRemainingTime() {
        const now = Date.now();
        this._cleanup(now);

        if (this.requests.length === 0) {
            return 0;
        }

        const oldestRequest = this.requests[0];
        return Math.max(0, this.windowMs - (now - oldestRequest));
    }

    /**
     * Vérifie si une nouvelle requête est autorisée
     * @throws {RateLimitError} Si la limite est dépassée
     */
    async check() {
        if (this.canExecute()) {
            return;
        }

        const waitTime = this.getRemainingTime() || this.windowMs;
        throw new RateLimitError(waitTime);
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
        this._cleanup();
        return Math.max(0, this.maxRequests - this.requests.length);
    }
}

const isHappyDom = () => typeof window !== 'undefined' && typeof window.happyDOM !== 'undefined';
const hasVitestWorker = () =>
    typeof globalThis !== 'undefined' && Boolean(globalThis.__vitest_worker__);

function isTestRuntime() {
    if (isHappyDom()) return true;
    if (hasVitestWorker()) return true;
    if (
        typeof navigator !== 'undefined' &&
        /happy\s?dom|jsdom/i.test(navigator.userAgent || '')
    ) {
        return true;
    }
    if (typeof globalThis !== 'undefined' && Boolean(globalThis.__vitest_browser__)) return true;
    if (typeof import.meta !== 'undefined' && Boolean(import.meta.vitest)) return true;
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test') {
        return true;
    }
    if (typeof process !== 'undefined' && process.env?.npm_lifecycle_event === 'test') return true;
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') return true;
    return false;
}

function getRateLimitWindowMs() {
    return isTestRuntime() ? 1000 : 60000; // 1s en test, 60s en prod
}

let firestoreRateLimiter = null;
let firestoreWriteRateLimiter = null;

function getReadLimiter() {
    if (!firestoreRateLimiter) {
        firestoreRateLimiter = new RateLimiter(100, getRateLimitWindowMs());
    }
    return firestoreRateLimiter;
}

function getWriteLimiter() {
    if (!firestoreWriteRateLimiter) {
        firestoreWriteRateLimiter = new RateLimiter(50, getRateLimitWindowMs());
    }
    return firestoreWriteRateLimiter;
}

function wait(ms) {
    if (ms <= 0) return Promise.resolve();
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper pour protéger les appels Firestore avec rate limiting
 * @param {Function} fn - Fonction async à exécuter
 * @param {Object} options - Options (isWrite: boolean, maxRetry: number)
 * @returns {Promise} Résultat de la fonction
 */
export async function safeFirestoreCall(fn, options = {}) {
    const limiter = options.isWrite ? getWriteLimiter() : getReadLimiter();
    const maxRetry = options.maxRetry ?? 5;
    let attempts = 0;
    const testRuntime = isTestRuntime();

    while (attempts <= maxRetry) {
        try {
            await limiter.check();
            return await fn();
        } catch (error) {
            if (error instanceof RateLimitError) {
                console.warn('⚠️ Rate limit atteint:', error.message);
                attempts += 1;
                const waitTime = testRuntime ? Math.min(error.waitTimeMs, 1000) : error.waitTimeMs;
                await wait(waitTime);
                continue;
            }

            throw error;
        }
    }

    throw new RateLimitError(limiter.getRemainingTime() || limiter.windowMs);
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
    firestoreRateLimiter = new RateLimiter(100, getRateLimitWindowMs());
    firestoreWriteRateLimiter = new RateLimiter(50, getRateLimitWindowMs());
}

export default {
    RateLimiter,
    RateLimitError,
    safeFirestoreCall,
    safeFirestoreRead,
    safeFirestoreWrite,
    resetRateLimiters
};


