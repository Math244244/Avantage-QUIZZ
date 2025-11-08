/**
 * Service de Cache Centralisé
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Extraction du système de cache
 * ✅ CORRECTION SECTION 6 : Amélioration - TTL configurable par type et invalidation intelligente
 * 
 * Gère le cache en mémoire avec TTL configurable par type de données
 */

// Cache en mémoire pour limiter les lectures Firestore répétées
const cacheStore = new Map();

// ✅ CORRECTION SECTION 6 : TTL configurable par type de données
const CACHE_CONFIG = {
    users: 10 * 60 * 1000,        // 10 minutes
    quizResults: 5 * 60 * 1000,  // 5 minutes
    questions: 30 * 60 * 1000,     // 30 minutes
    stats: 2 * 60 * 1000,          // 2 minutes
    monthlyProgress: 10 * 60 * 1000, // 10 minutes
    annualProgress: 15 * 60 * 1000,  // 15 minutes
    default: 5 * 60 * 1000        // 5 minutes par défaut
};

/**
 * Obtenir le TTL pour un type de données
 * @param {string} dataType - Type de données (users, quizResults, questions, stats, etc.)
 * @returns {number} TTL en millisecondes
 */
function getTTLForDataType(dataType) {
    return CACHE_CONFIG[dataType] || CACHE_CONFIG.default;
}

/**
 * Construire une clé de cache à partir de parties
 * @param {Array} parts - Parties de la clé
 * @returns {string} Clé de cache
 */
export function buildCacheKey(parts = []) {
    return parts.filter(Boolean).join('::');
}

/**
 * Obtenir une valeur du cache
 * @param {string} key - Clé de cache
 * @returns {*} Valeur en cache ou null
 */
export function getCachedValue(key) {
    const entry = cacheStore.get(key);
    if (!entry) {
        return null;
    }
    if (Date.now() > entry.expireAt) {
        cacheStore.delete(key);
        return null;
    }
    return entry.value;
}

/**
 * Définir une valeur dans le cache
 * @param {string} key - Clé de cache
 * @param {*} value - Valeur à mettre en cache
 * @param {number|string} ttlMsOrType - Durée de vie en millisecondes OU type de données pour TTL automatique
 */
export function setCachedValue(key, value, ttlMsOrType = CACHE_CONFIG.default) {
    // ✅ CORRECTION SECTION 6 : Si ttlMsOrType est une string, utiliser le TTL configuré pour ce type
    const ttlMs = typeof ttlMsOrType === 'string' 
        ? getTTLForDataType(ttlMsOrType)
        : ttlMsOrType;
    
    cacheStore.set(key, {
        value,
        expireAt: Date.now() + ttlMs,
        dataType: typeof ttlMsOrType === 'string' ? ttlMsOrType : null
    });
}

/**
 * Invalider le cache par préfixe
 * @param {string} prefix - Préfixe des clés à invalider
 */
export function invalidateCache(prefix) {
    cacheStore.forEach((_, key) => {
        if (key.startsWith(prefix)) {
            cacheStore.delete(key);
        }
    });
}

/**
 * ✅ CORRECTION SECTION 6 : Invalidation intelligente par type de données
 * @param {string} dataType - Type de données à invalider (users, quizResults, questions, stats, etc.)
 */
export function invalidateByDataType(dataType) {
    cacheStore.forEach((entry, key) => {
        if (entry.dataType === dataType || key.includes(dataType)) {
            cacheStore.delete(key);
        }
    });
}

/**
 * ✅ CORRECTION SECTION 6 : Invalidation intelligente basée sur les événements
 * @param {string} event - Événement déclenché (quizCompleted, userUpdated, questionCreated, etc.)
 */
export function invalidateByEvent(event) {
    const eventMap = {
        'quizCompleted': ['quizResults', 'stats', 'monthlyProgress', 'annualProgress'],
        'userUpdated': ['users', 'stats'], // ✅ CORRECTION : Invalider aussi 'stats' pour userUpdated
        'questionCreated': ['questions', 'questions-stats'],
        'questionUpdated': ['questions', 'questions-stats'],
        'questionDeleted': ['questions', 'questions-stats'],
        'userRoleUpdated': ['users', 'stats'] // ✅ CORRECTION : Invalider aussi 'stats' pour userRoleUpdated
    };
    
    const typesToInvalidate = eventMap[event] || [];
    typesToInvalidate.forEach(type => {
        invalidateByDataType(type);
    });
}

/**
 * Vider tout le cache
 */
export function clearCache() {
    cacheStore.clear();
}

/**
 * Obtenir la taille du cache
 * @returns {number} Nombre d'entrées en cache
 */
export function getCacheSize() {
    return cacheStore.size;
}

/**
 * ✅ CORRECTION SECTION 6 : Obtenir les statistiques du cache
 * @returns {Object} Statistiques du cache
 */
export function getCacheStats() {
    const stats = {
        total: cacheStore.size, // ✅ CORRECTION : Utiliser 'total' au lieu de 'totalEntries'
        totalEntries: cacheStore.size, // Garder pour compatibilité
        byDataType: {}, // ✅ CORRECTION : Utiliser 'byDataType' au lieu de 'byType'
        byType: {}, // Garder pour compatibilité
        expiredEntries: 0
    };
    
    const now = Date.now();
    cacheStore.forEach((entry, key) => {
        if (entry.expireAt < now) {
            stats.expiredEntries++;
        }
        
        const type = entry.dataType || 'unknown';
        stats.byDataType[type] = (stats.byDataType[type] || 0) + 1;
        stats.byType[type] = (stats.byType[type] || 0) + 1; // Garder pour compatibilité
    });
    
    return stats;
}

/**
 * ✅ CORRECTION SECTION 6 : Nettoyer les entrées expirées
 * @returns {number} Nombre d'entrées supprimées
 */
export function cleanExpiredEntries() {
    const now = Date.now();
    let cleaned = 0;
    
    cacheStore.forEach((entry, key) => {
        if (entry.expireAt < now) {
            cacheStore.delete(key);
            cleaned++;
        }
    });
    
    return cleaned;
}
