/**
 * Module Firestore - Point d'entrée principal
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Réexporte tous les services pour compatibilité
 * 
 * Ce fichier sert maintenant de point d'entrée unique qui réexporte toutes les fonctions
 * des services séparés pour maintenir la compatibilité avec le code existant.
 * 
 * ⚠️ NOTE PERFORMANCE (Vite Build Warning):
 * Les warnings Vite sur les dynamic imports de user-service.js et quiz-service.js sont
 * causés par une dépendance circulaire nécessaire entre ces deux services.
 * Impact performance: MINEUR (les modules sont déjà chargés via ce barrel export).
 * Pour résoudre complètement, il faudrait refactoriser l'architecture des services.
 */

// Réexporter toutes les fonctions des services
export {
    // User Service
    createOrUpdateUser,
    getUserProfile,
    updateUserStats,
    updateStreak,
    getLeaderboard,
    isCurrentUserAdmin,
    getAllUsers,
    getAllUsersPaginated, // ✅ CORRECTION SECTION 7 : Pagination
    updateUserRole,
    getUsersStats
} from './services/user-service.js';

export {
    // Quiz Service
    saveQuizResult,
    getUserQuizResults,
    getUserQuizResultsPaginated, // ✅ CORRECTION SECTION 7 : Pagination
    getMonthlyResults,
    updateMonthlyProgress,
    getAnnualProgress
} from './services/quiz-service.js';

export {
    // Question Service
    getQuestions,
    getQuestionsPaginated, // ✅ CORRECTION SECTION 7 : Pagination
    createQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestionsFromJSON,
    getQuestionsStats
} from './services/question-service.js';

export {
    // Audit Service
    createImportLog,
    createAuditLog
} from './services/audit-service.js';

export {
    // Cache Service
    buildCacheKey,
    getCachedValue,
    setCachedValue,
    invalidateCache,
    clearCache,
    getCacheSize,
    invalidateByDataType,
    invalidateByEvent,
    getCacheStats,
    cleanExpiredEntries
} from './services/cache-service.js';
