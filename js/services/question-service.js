/**
 * Service de Gestion des Questions
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Extraction des fonctions questions
 */

import { db, auth } from '../firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { safeFirestoreRead, safeFirestoreWrite } from '../rate-limiter.js';
import { getCurrentClientId } from '../client-manager.js';
import { buildCacheKey, getCachedValue, setCachedValue, invalidateCache } from './cache-service.js';
import { createAuditLog, createImportLog } from './audit-service.js';

const COLLECTIONS = {
    questions: 'questions'
};

/**
 * ADMIN: Récupérer toutes les questions avec filtres optionnels (sans pagination - pour compatibilité)
 */
export async function getQuestions(filters = {}) {
    const cacheKey = buildCacheKey(['questions', JSON.stringify(filters || {})]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // ✅ P0 CRITIQUE: Filtrer par clientId pour isolation multi-tenant
        const clientId = await getCurrentClientId();
        let q = collection(db, COLLECTIONS.questions);
        const constraints = [where('clientId', '==', clientId)];
        
        if (filters.module) {
            constraints.push(where('module', '==', filters.module));
        }
        if (filters.month) {
            constraints.push(where('month', '==', filters.month));
        }
        if (filters.year) {
            constraints.push(where('year', '==', filters.year));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        q = query(q, ...constraints);
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const questions = [];
        
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📚 ${questions.length} questions chargées`);
        setCachedValue(cacheKey, questions, 'questions');
        return questions;
    } catch (error) {
        console.error('❌ Erreur récupération questions:', error);
        throw error;
    }
}

/**
 * ✅ CORRECTION SECTION 7 : Pagination - Récupérer les questions avec pagination
 * @param {Object} filters - Filtres optionnels
 * @param {number} pageSize - Nombre d'éléments par page (défaut: 20)
 * @param {QueryDocumentSnapshot|null} lastDoc - Document de départ pour la pagination
 * @returns {Promise<{questions: Array, lastDoc: QueryDocumentSnapshot|null, hasMore: boolean}>}
 */
export async function getQuestionsPaginated(filters = {}, pageSize = 20, lastDoc = null) {
    try {
        // ✅ P0 CRITIQUE: Filtrer par clientId pour isolation multi-tenant
        const clientId = await getCurrentClientId();
        let q = collection(db, COLLECTIONS.questions);
        const constraints = [where('clientId', '==', clientId)];
        
        if (filters.module) {
            constraints.push(where('module', '==', filters.module));
        }
        if (filters.month) {
            constraints.push(where('month', '==', filters.month));
        }
        if (filters.year) {
            constraints.push(where('year', '==', filters.year));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        constraints.push(limit(pageSize + 1)); // +1 pour détecter s'il y a plus de résultats
        
        q = query(q, ...constraints);
        
        // Si on a un document de départ, commencer après
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const questions = [];
        let newLastDoc = null;
        let hasMore = false;
        
        querySnapshot.forEach((doc, index) => {
            if (index < pageSize) {
                questions.push({ id: doc.id, ...doc.data() });
            } else {
                hasMore = true;
            }
        });
        
        if (querySnapshot.docs.length > 0 && questions.length === pageSize) {
            newLastDoc = querySnapshot.docs[pageSize - 1];
        }
        
        console.log(`📚 ${questions.length} questions chargées (pagination)`);
        return {
            questions,
            lastDoc: newLastDoc,
            hasMore
        };
    } catch (error) {
        console.error('❌ Erreur récupération questions paginées:', error);
        throw error;
    }
}

/**
 * ADMIN: Créer une nouvelle question
 */
export async function createQuestion(questionData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        if (!questionData.question || questionData.question.length < 10) {
            throw new Error('La question doit contenir au moins 10 caractères');
        }
        if (!questionData.options || questionData.options.length !== 4) {
            throw new Error('La question doit avoir exactement 4 options');
        }
        if (questionData.correctAnswer === undefined || questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
            throw new Error('La réponse correcte doit être entre 0 et 3');
        }
        if (!questionData.explanation || questionData.explanation.length < 20) {
            throw new Error('L\'explication doit contenir au moins 20 caractères');
        }
        if (!['auto', 'loisir', 'vr', 'tracteur'].includes(questionData.module)) {
            throw new Error('Module invalide');
        }
        if (!questionData.month || questionData.month < 1 || questionData.month > 12) {
            throw new Error('Mois invalide');
        }
        
        // ✅ P0 CRITIQUE: Ajouter clientId pour isolation multi-tenant
        const clientId = await getCurrentClientId();
        
        const newQuestion = {
            question: questionData.question.trim(),
            options: questionData.options.map(opt => opt.trim()),
            correctAnswer: parseInt(questionData.correctAnswer),
            explanation: questionData.explanation.trim(),
            module: questionData.module,
            month: parseInt(questionData.month),
            year: questionData.year || new Date().getFullYear(),
            clientId: clientId, // ✅ P0 CRITIQUE: Isolation multi-tenant
            createdAt: Timestamp.now(),
            createdBy: user.uid,
            updatedAt: Timestamp.now()
        };
        
        const questionRef = await safeFirestoreWrite(() => 
            addDoc(collection(db, COLLECTIONS.questions), newQuestion)
        );
        console.log('✅ Question créée:', questionRef.id);
        
        await createAuditLog({
            action: 'CREATE_QUESTION',
            questionId: questionRef.id,
            adminId: user.uid,
            adminEmail: user.email
        });

        invalidateCache('questions');
        invalidateCache('questions-stats');
        
        return questionRef.id;
    } catch (error) {
        console.error('❌ Erreur création question:', error);
        throw error;
    }
}

/**
 * ADMIN: Mettre à jour une question existante
 */
export async function updateQuestion(questionId, questionData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        const questionRef = doc(db, COLLECTIONS.questions, questionId);
        
        const updatedData = {
            ...questionData,
            updatedAt: Timestamp.now()
        };
        
        delete updatedData.createdAt;
        delete updatedData.createdBy;
        
        await safeFirestoreWrite(() => updateDoc(questionRef, updatedData));
        console.log('✅ Question mise à jour:', questionId);
        
        await createAuditLog({
            action: 'UPDATE_QUESTION',
            questionId: questionId,
            adminId: user.uid,
            adminEmail: user.email,
            changes: questionData
        });

        invalidateCache('questions');
        invalidateCache('questions-stats');
        
        return true;
    } catch (error) {
        console.error('❌ Erreur mise à jour question:', error);
        throw error;
    }
}

/**
 * ADMIN: Supprimer une question
 */
export async function deleteQuestion(questionId) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        const questionRef = doc(db, COLLECTIONS.questions, questionId);
        
        const questionDoc = await safeFirestoreRead(() => getDoc(questionRef));
        const questionData = questionDoc.data();
        
        await safeFirestoreWrite(() => deleteDoc(questionRef));
        console.log('🗑️ Question supprimée:', questionId);
        
        await createAuditLog({
            action: 'DELETE_QUESTION',
            questionId: questionId,
            adminId: user.uid,
            adminEmail: user.email,
            deletedData: questionData
        });

        invalidateCache('questions');
        invalidateCache('questions-stats');
        
        return true;
    } catch (error) {
        console.error('❌ Erreur suppression question:', error);
        throw error;
    }
}

/**
 * ADMIN: Importer des questions depuis JSON
 */
export async function importQuestionsFromJSON(jsonData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        if (!jsonData.module || !jsonData.month || !jsonData.year || !jsonData.questions) {
            throw new Error('Format JSON invalide - champs obligatoires manquants');
        }
        
        if (!Array.isArray(jsonData.questions) || jsonData.questions.length === 0) {
            throw new Error('Le fichier JSON doit contenir au moins une question');
        }
        
        const importedIds = [];
        const errors = [];
        
        for (let i = 0; i < jsonData.questions.length; i++) {
            const question = jsonData.questions[i];
            
            try {
                const questionData = {
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
                    module: jsonData.module,
                    month: jsonData.month,
                    year: jsonData.year
                };
                
                const questionId = await createQuestion(questionData);
                importedIds.push(questionId);
            } catch (err) {
                errors.push({ index: i, error: err.message });
                console.error(`❌ Erreur question ${i + 1}:`, err.message);
            }
        }
        
        await createImportLog({
            importedBy: user.uid,
            module: jsonData.module,
            month: jsonData.month,
            year: jsonData.year,
            totalQuestions: jsonData.questions.length,
            successCount: importedIds.length,
            errorCount: errors.length,
            status: errors.length === 0 ? 'success' : 'partial'
        });
        
        console.log(`✅ Import terminé: ${importedIds.length}/${jsonData.questions.length} questions importées`);

        invalidateCache('questions');
        invalidateCache('questions-stats');
        
        return {
            success: importedIds.length,
            total: jsonData.questions.length,
            errors: errors,
            ids: importedIds
        };
    } catch (error) {
        console.error('❌ Erreur import JSON:', error);
        throw error;
    }
}

/**
 * ADMIN: Récupérer les statistiques des questions
 */
export async function getQuestionsStats() {
    const cacheKey = 'questions-stats';
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const questions = await getQuestions();
        
        const stats = {
            total: questions.length,
            byModule: {},
            byMonth: {},
            byYear: {}
        };
        
        questions.forEach(q => {
            stats.byModule[q.module] = (stats.byModule[q.module] || 0) + 1;
            stats.byMonth[q.month] = (stats.byMonth[q.month] || 0) + 1;
            stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
        });
        
        setCachedValue(cacheKey, stats, 'stats');
        return stats;
    } catch (error) {
        console.error('❌ Erreur statistiques questions:', error);
        throw error;
    }
}

