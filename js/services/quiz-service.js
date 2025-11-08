/**
 * Service de Gestion des Quiz et Résultats
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Extraction des fonctions quiz
 */

import { db, auth } from '../firebase-config.js';
import { 
    collection, 
    doc, 
    getDocs, 
    addDoc,
    setDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { safeFirestoreRead, safeFirestoreWrite } from '../rate-limiter.js';
import { getCurrentClientId } from '../client-manager.js';
import { normalizeMonthFormat, createMonthlyProgressId, extractYearFromMonth } from '../month-utils.js';
import { buildCacheKey, getCachedValue, setCachedValue, invalidateCache } from './cache-service.js';

const COLLECTIONS = {
    quizResults: 'quizResults',
    monthlyProgress: 'monthlyProgress'
};

/**
 * Sauvegarder un résultat de quiz
 */
export async function saveQuizResult(quizData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        const score = quizData.score;
        if (isNaN(score) || score < 0 || score > 100) {
            throw new Error(`Score invalide: ${score}. Doit être entre 0 et 100.`);
        }
        
        if (!quizData.totalQuestions || quizData.totalQuestions <= 0) {
            throw new Error(`Nombre total de questions invalide: ${quizData.totalQuestions}`);
        }
        if (quizData.correctAnswers < 0 || quizData.correctAnswers > quizData.totalQuestions) {
            throw new Error(`Nombre de bonnes réponses invalide: ${quizData.correctAnswers}`);
        }
        
        const normalizedMonth = normalizeMonthFormat(quizData.month || new Date().getMonth() + 1, quizData.year || new Date().getFullYear());
        const year = extractYearFromMonth(normalizedMonth);
        
        const clientId = await getCurrentClientId();
        
        const resultData = {
            userId: user.uid,
            userEmail: user.email,
            moduleId: quizData.moduleId,
            moduleName: quizData.moduleName,
            score: score,
            correctAnswers: quizData.correctAnswers,
            totalQuestions: quizData.totalQuestions,
            timeElapsed: quizData.timeElapsed,
            answers: quizData.answers,
            date: Timestamp.now(),
            completedAt: Timestamp.now(),
            month: normalizedMonth,
            year: year,
            clientId: clientId
        };
        
        const resultRef = await safeFirestoreWrite(() => 
            addDoc(collection(db, COLLECTIONS.quizResults), resultData)
        );
        console.log('✅ Résultat de quiz sauvegardé:', resultRef.id);
        
        // Import dynamique pour éviter dépendance circulaire
        const { updateUserStats } = await import('./user-service.js');
        await updateUserStats(user.uid, quizData.score);
        await updateMonthlyProgress(user.uid, quizData.month, quizData.score);

        invalidateCache(buildCacheKey(['quizResults', user.uid]));
        invalidateCache(buildCacheKey(['monthlyResults', user.uid]));
        invalidateCache(buildCacheKey(['annualProgress', user.uid]));
        invalidateCache('users');
        invalidateCache('users-stats');
        
        return resultRef.id;
    } catch (error) {
        console.error('❌ Erreur sauvegarde résultat:', error);
        throw error;
    }
}

/**
 * Récupérer tous les résultats d'un utilisateur (sans pagination - pour compatibilité)
 */
export async function getUserQuizResults(uid, limitCount = 50) {
    const cacheKey = buildCacheKey(['quizResults', uid, limitCount]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const clientId = await getCurrentClientId();
        
        const q = query(
            collection(db, COLLECTIONS.quizResults),
            where('userId', '==', uid),
            where('clientId', '==', clientId),
            orderBy('date', 'desc'),
            limit(limitCount)
        );
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const results = [];
        
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📊 ${results.length} résultats chargés`);
        setCachedValue(cacheKey, results, 'quizResults');
        return results;
    } catch (error) {
        console.error('❌ Erreur récupération résultats:', error);
        throw error;
    }
}

/**
 * ✅ CORRECTION SECTION 7 : Pagination - Récupérer les résultats d'un utilisateur avec pagination
 * @param {string} uid - ID de l'utilisateur
 * @param {number} pageSize - Nombre d'éléments par page (défaut: 20)
 * @param {QueryDocumentSnapshot|null} lastDoc - Document de départ pour la pagination
 * @returns {Promise<{results: Array, lastDoc: QueryDocumentSnapshot|null, hasMore: boolean}>}
 */
export async function getUserQuizResultsPaginated(uid, pageSize = 20, lastDoc = null) {
    try {
        const clientId = await getCurrentClientId();
        
        const constraints = [
            where('userId', '==', uid),
            where('clientId', '==', clientId),
            orderBy('date', 'desc'),
            limit(pageSize + 1) // +1 pour détecter s'il y a plus de résultats
        ];
        
        let q = query(collection(db, COLLECTIONS.quizResults), ...constraints);
        
        // Si on a un document de départ, commencer après
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const results = [];
        let newLastDoc = null;
        let hasMore = false;
        
        querySnapshot.forEach((doc, index) => {
            if (index < pageSize) {
                results.push({ id: doc.id, ...doc.data() });
            } else {
                hasMore = true;
            }
        });
        
        if (querySnapshot.docs.length > 0 && results.length === pageSize) {
            newLastDoc = querySnapshot.docs[pageSize - 1];
        }
        
        console.log(`📊 ${results.length} résultats chargés (pagination)`);
        return {
            results,
            lastDoc: newLastDoc,
            hasMore
        };
    } catch (error) {
        console.error('❌ Erreur récupération résultats paginés:', error);
        throw error;
    }
}

/**
 * Récupérer les résultats d'un mois spécifique
 */
export async function getMonthlyResults(uid, month) {
    const cacheKey = buildCacheKey(['monthlyResults', uid, month]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const clientId = await getCurrentClientId();
        
        const q = query(
            collection(db, COLLECTIONS.quizResults),
            where('userId', '==', uid),
            where('month', '==', month),
            where('clientId', '==', clientId),
            orderBy('date', 'desc')
        );
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const results = [];
        
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        
        setCachedValue(cacheKey, results, 'monthlyProgress');
        return results;
    } catch (error) {
        console.error('❌ Erreur récupération résultats mensuels:', error);
        throw error;
    }
}

/**
 * Mettre à jour la progression mensuelle
 */
export async function updateMonthlyProgress(uid, month, score) {
    try {
        const normalizedMonth = normalizeMonthFormat(month);
        const year = extractYearFromMonth(normalizedMonth);
        
        const progressId = createMonthlyProgressId(uid, normalizedMonth);
        const progressRef = doc(db, COLLECTIONS.monthlyProgress, progressId);
        
        const clientId = await getCurrentClientId();
        
        const progressData = {
            userId: uid,
            month: normalizedMonth,
            year: year,
            score: score,
            completed: true,
            completedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            clientId: clientId
        };
        
        await safeFirestoreWrite(() => setDoc(progressRef, progressData, { merge: true }));
        console.log('✅ Progression mensuelle mise à jour');

        invalidateCache(buildCacheKey(['monthlyResults', uid]));
        invalidateCache(buildCacheKey(['annualProgress', uid, year]));
    } catch (error) {
        console.error('❌ Erreur mise à jour progression:', error);
        throw error;
    }
}

/**
 * Récupérer la progression annuelle
 */
export async function getAnnualProgress(uid, year = new Date().getFullYear()) {
    const cacheKey = buildCacheKey(['annualProgress', uid, year]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const clientId = await getCurrentClientId();
        
        const q = query(
            collection(db, COLLECTIONS.monthlyProgress),
            where('userId', '==', uid),
            where('clientId', '==', clientId)
        );
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const progress = {};
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dataYear = data.year || extractYearFromMonth(data.month);
            if (dataYear === year) {
                const normalizedMonth = normalizeMonthFormat(data.month, dataYear);
                progress[normalizedMonth] = {
                    ...data,
                    month: normalizedMonth,
                    year: dataYear
                };
            }
        });
        
        console.log('📅 Progression annuelle chargée');
        setCachedValue(cacheKey, progress, 'annualProgress');
        return progress;
    } catch (error) {
        console.error('❌ Erreur récupération progression:', error);
        throw error;
    }
}

