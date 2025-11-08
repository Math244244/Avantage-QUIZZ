// Module Firestore - Gestion des données
import { db, auth } from './firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ===== COLLECTIONS =====
const COLLECTIONS = {
    users: 'users',
    quizResults: 'quizResults',
    monthlyProgress: 'monthlyProgress',
    questions: 'questions'
};

// Cache en mémoire pour limiter les lectures Firestore répétées
const cacheStore = new Map();

function buildCacheKey(parts = []) {
    return parts.filter(Boolean).join('::');
}

function getCachedValue(key) {
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

function setCachedValue(key, value, ttlMs = 5 * 60 * 1000) {
    cacheStore.set(key, {
        value,
        expireAt: Date.now() + ttlMs
    });
}

function invalidateCache(prefix) {
    cacheStore.forEach((_, key) => {
        if (key.startsWith(prefix)) {
            cacheStore.delete(key);
        }
    });
}

// ===== GESTION DES UTILISATEURS =====

/**
 * Créer ou mettre à jour le profil utilisateur
 */
export async function createOrUpdateUser(user) {
    try {
        const userRef = doc(db, COLLECTIONS.users, user.uid);
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        
        // Vérifier si l'utilisateur existe
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            // Nouvel utilisateur
            userData.createdAt = Timestamp.now();
            userData.totalQuizzes = 0;
            userData.averageScore = 0;
            userData.currentStreak = 0;
            userData.longestStreak = 0;
            userData.role = 'user'; // ✅ Rôle par défaut pour nouveaux utilisateurs
            console.log('👤 Création du profil utilisateur:', user.email);
        }
        
        await setDoc(userRef, userData, { merge: true });
        console.log('✅ Profil utilisateur sauvegardé');
        return userData;
    } catch (error) {
        console.error('❌ Erreur création utilisateur:', error);
        throw error;
    }
}

/**
 * Récupérer le profil utilisateur
 */
export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, COLLECTIONS.users, uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('❌ Erreur récupération profil:', error);
        throw error;
    }
}

// ===== GESTION DES RÉSULTATS DE QUIZ =====

/**
 * Sauvegarder un résultat de quiz
 */
export async function saveQuizResult(quizData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        const resultData = {
            userId: user.uid,
            userEmail: user.email,
            moduleId: quizData.moduleId,
            moduleName: quizData.moduleName,
            score: quizData.score,
            correctAnswers: quizData.correctAnswers,
            totalQuestions: quizData.totalQuestions,
            timeElapsed: quizData.timeElapsed,
            answers: quizData.answers,
            // Champ historique (utilisé par anciens écrans / index existants)
            date: Timestamp.now(),
            // Nouveau champ normalisé utilisé pour les requêtes récentes
            completedAt: Timestamp.now(),
            month: quizData.month || new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        };
        
        // Ajouter le résultat
        const resultRef = await addDoc(collection(db, COLLECTIONS.quizResults), resultData);
        console.log('✅ Résultat de quiz sauvegardé:', resultRef.id);
        
        // Mettre à jour les statistiques utilisateur
        await updateUserStats(user.uid, quizData.score);
        
        // Mettre à jour la progression mensuelle
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
 * Récupérer tous les résultats d'un utilisateur
 */
export async function getUserQuizResults(uid, limitCount = 50) {
    const cacheKey = buildCacheKey(['quizResults', uid, limitCount]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const q = query(
            collection(db, COLLECTIONS.quizResults),
            where('userId', '==', uid),
            orderBy('date', 'desc'),
            limit(limitCount)
        );
        
        const querySnapshot = await getDocs(q);
        const results = [];
        
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📊 ${results.length} résultats chargés`);
        setCachedValue(cacheKey, results);
        return results;
    } catch (error) {
        console.error('❌ Erreur récupération résultats:', error);
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
        const q = query(
            collection(db, COLLECTIONS.quizResults),
            where('userId', '==', uid),
            where('month', '==', month),
            orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const results = [];
        
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        
        setCachedValue(cacheKey, results);
        return results;
    } catch (error) {
        console.error('❌ Erreur récupération résultats mensuels:', error);
        throw error;
    }
}

// ===== GESTION DE LA PROGRESSION MENSUELLE =====

/**
 * Mettre à jour la progression mensuelle
 */
export async function updateMonthlyProgress(uid, month, score) {
    try {
        const progressRef = doc(db, COLLECTIONS.monthlyProgress, `${uid}_${month}`);
        
        const progressData = {
            userId: uid,
            month: month,
            score: score,
            completed: true,
            completedAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        
        await setDoc(progressRef, progressData, { merge: true });
        console.log('✅ Progression mensuelle mise à jour');

        invalidateCache(buildCacheKey(['monthlyResults', uid]));
        invalidateCache(buildCacheKey(['annualProgress', uid]));
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
        const q = query(
            collection(db, COLLECTIONS.monthlyProgress),
            where('userId', '==', uid)
        );
        
        const querySnapshot = await getDocs(q);
        const progress = {};
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            progress[data.month] = data;
        });
        
        console.log('📅 Progression annuelle chargée');
        setCachedValue(cacheKey, progress);
        return progress;
    } catch (error) {
        console.error('❌ Erreur récupération progression:', error);
        throw error;
    }
}

// ===== STATISTIQUES UTILISATEUR =====

/**
 * Mettre à jour les statistiques utilisateur
 */
async function updateUserStats(uid, newScore) {
    try {
        const userRef = doc(db, COLLECTIONS.users, uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const totalQuizzes = (userData.totalQuizzes || 0) + 1;
            const currentAverage = userData.averageScore || 0;
            const newAverage = ((currentAverage * (totalQuizzes - 1)) + newScore) / totalQuizzes;
            
            await updateDoc(userRef, {
                totalQuizzes: totalQuizzes,
                averageScore: Math.round(newAverage),
                lastQuizDate: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            
            console.log('📊 Statistiques mises à jour');

            invalidateCache('users');
            invalidateCache('users-stats');
        }
    } catch (error) {
        console.error('❌ Erreur mise à jour statistiques:', error);
        throw error;
    }
}

/**
 * Calculer et mettre à jour la série (streak)
 */
export async function updateStreak(uid) {
    try {
        const results = await getUserQuizResults(uid, 12);
        
        // Calculer la série de mois consécutifs avec score >= 60%
        let currentStreak = 0;
        const monthsSet = new Set();
        
        for (const result of results) {
            if (result.score >= 60) {
                monthsSet.add(result.month);
            }
        }
        
        // Compter les mois consécutifs
        const months = Array.from(monthsSet).sort().reverse();
        for (let i = 0; i < months.length; i++) {
            currentStreak++;
            // Vérifier si le mois suivant est consécutif
            if (i < months.length - 1) {
                // Logique de vérification de consécutivité
                // (simplifiée ici)
            } else {
                break;
            }
        }
        
        const userRef = doc(db, COLLECTIONS.users, uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const longestStreak = Math.max(currentStreak, userData.longestStreak || 0);
            
            await updateDoc(userRef, {
                currentStreak: currentStreak,
                longestStreak: longestStreak,
                updatedAt: Timestamp.now()
            });
            
            console.log(`🔥 Série mise à jour: ${currentStreak} mois`);

            invalidateCache('users');
            invalidateCache('users-stats');
        }
        
        return currentStreak;
    } catch (error) {
        console.error('❌ Erreur mise à jour série:', error);
        throw error;
    }
}

// ===== LEADERBOARD =====

/**
 * Récupérer le classement général
 */
export async function getLeaderboard(limitCount = 10) {
    try {
        const q = query(
            collection(db, COLLECTIONS.users),
            orderBy('averageScore', 'desc'),
            orderBy('totalQuizzes', 'desc'),
            limit(limitCount)
        );
        
        const querySnapshot = await getDocs(q);
        const leaderboard = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboard.push({
                uid: doc.id,
                displayName: data.displayName,
                photoURL: data.photoURL,
                averageScore: data.averageScore,
                totalQuizzes: data.totalQuizzes,
                currentStreak: data.currentStreak
            });
        });
        
        console.log('🏆 Classement chargé');
        return leaderboard;
    } catch (error) {
        console.error('❌ Erreur récupération classement:', error);
        throw error;
    }
}

// ===== FONCTIONS ADMINISTRATEUR =====

/**
 * Vérifier si l'utilisateur actuel est admin
 */
export async function isCurrentUserAdmin() {
    try {
        const user = auth.currentUser;
        if (!user) return false;
        
        const userProfile = await getUserProfile(user.uid);
        return userProfile?.role === 'admin';
    } catch (error) {
        console.error('❌ Erreur vérification admin:', error);
        return false;
    }
}

/**
 * ADMIN: Récupérer toutes les questions avec filtres optionnels
 */
export async function getQuestions(filters = {}) {
    const cacheKey = buildCacheKey(['questions', JSON.stringify(filters || {})]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        let q = collection(db, COLLECTIONS.questions);
        const constraints = [];
        
        // Filtres optionnels
        if (filters.module) {
            constraints.push(where('module', '==', filters.module));
        }
        if (filters.month) {
            constraints.push(where('month', '==', filters.month));
        }
        if (filters.year) {
            constraints.push(where('year', '==', filters.year));
        }
        
        // Tri par date de création
        constraints.push(orderBy('createdAt', 'desc'));
        
        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }
        
        const querySnapshot = await getDocs(q);
        const questions = [];
        
        querySnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`📚 ${questions.length} questions chargées`);
        setCachedValue(cacheKey, questions);
        return questions;
    } catch (error) {
        console.error('❌ Erreur récupération questions:', error);
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
        
        // Validation
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
        
        const newQuestion = {
            question: questionData.question.trim(),
            options: questionData.options.map(opt => opt.trim()),
            correctAnswer: parseInt(questionData.correctAnswer),
            explanation: questionData.explanation.trim(),
            module: questionData.module,
            month: parseInt(questionData.month),
            year: questionData.year || new Date().getFullYear(),
            createdAt: Timestamp.now(),
            createdBy: user.uid,
            updatedAt: Timestamp.now()
        };
        
        const questionRef = await addDoc(collection(db, COLLECTIONS.questions), newQuestion);
        console.log('✅ Question créée:', questionRef.id);
        
        // Log d'audit
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
        
        // Ne pas permettre la modification de certains champs
        delete updatedData.createdAt;
        delete updatedData.createdBy;
        
        await updateDoc(questionRef, updatedData);
        console.log('✅ Question mise à jour:', questionId);
        
        // Log d'audit
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
        
        // Récupérer les données avant suppression pour le log
        const questionDoc = await getDoc(questionRef);
        const questionData = questionDoc.data();
        
        await deleteDoc(questionRef);
        console.log('🗑️ Question supprimée:', questionId);
        
        // Log d'audit
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
        
        // Validation du JSON
        if (!jsonData.module || !jsonData.month || !jsonData.year || !jsonData.questions) {
            throw new Error('Format JSON invalide - champs obligatoires manquants');
        }
        
        if (!Array.isArray(jsonData.questions) || jsonData.questions.length === 0) {
            throw new Error('Le fichier JSON doit contenir au moins une question');
        }
        
        const importedIds = [];
        const errors = [];
        
        // Importer chaque question
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
        
        // Log d'import
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
 * ADMIN: Récupérer tous les utilisateurs
 */
export async function getAllUsers(filters = {}) {
    const cacheKey = buildCacheKey(['users', JSON.stringify(filters || {})]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        let q = collection(db, COLLECTIONS.users);
        const constraints = [];
        
        // Filtres optionnels
        if (filters.role) {
            constraints.push(where('role', '==', filters.role));
        }
        
        // Tri
        constraints.push(orderBy('createdAt', 'desc'));
        
        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }
        
        const querySnapshot = await getDocs(q);
        const users = [];
        
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`👥 ${users.length} utilisateurs chargés`);
        setCachedValue(cacheKey, users);
        return users;
    } catch (error) {
        console.error('❌ Erreur récupération utilisateurs:', error);
        throw error;
    }
}

/**
 * ADMIN: Mettre à jour le rôle d'un utilisateur
 */
export async function updateUserRole(userId, newRole) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Utilisateur non connecté');
        
        if (!['user', 'admin'].includes(newRole)) {
            throw new Error('Rôle invalide - doit être "user" ou "admin"');
        }
        
        const userRef = doc(db, COLLECTIONS.users, userId);
        
        await updateDoc(userRef, {
            role: newRole,
            updatedAt: Timestamp.now()
        });
        
        console.log(`✅ Rôle mis à jour pour ${userId}: ${newRole}`);
        
        // Log d'audit
        await createAuditLog({
            action: 'UPDATE_USER_ROLE',
            targetUserId: userId,
            newRole: newRole,
            adminId: user.uid,
            adminEmail: user.email
        });

        invalidateCache('users');
        invalidateCache('users-stats');
        
        return true;
    } catch (error) {
        console.error('❌ Erreur mise à jour rôle:', error);
        throw error;
    }
}

/**
 * ADMIN: Créer un log d'import
 */
async function createImportLog(logData) {
    try {
        const log = {
            ...logData,
            importedAt: Timestamp.now()
        };
        
        await addDoc(collection(db, 'importLogs'), log);
        console.log('Log import cree');
    } catch (error) {
        console.error('Erreur creation log import:', error);
    }
}

/**
 * ADMIN: Créer un log d'audit
 */
async function createAuditLog(logData) {
    try {
        const log = {
            ...logData,
            timestamp: Timestamp.now()
        };
        
        await addDoc(collection(db, 'auditLogs'), log);
        console.log('Log audit cree');
    } catch (error) {
        console.error('Erreur creation log audit:', error);
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
            // Par module
            stats.byModule[q.module] = (stats.byModule[q.module] || 0) + 1;
            
            // Par mois
            stats.byMonth[q.month] = (stats.byMonth[q.month] || 0) + 1;
            
            // Par année
            stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
        });
        
        setCachedValue(cacheKey, stats, 2 * 60 * 1000);
        return stats;
    } catch (error) {
        console.error('❌ Erreur statistiques questions:', error);
        throw error;
    }
}

/**
 * ADMIN: Récupérer les statistiques des utilisateurs
 */
export async function getUsersStats() {
    const cacheKey = 'users-stats';
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const users = await getAllUsers();
        
        const stats = {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            regularUsers: users.filter(u => u.role !== 'admin').length,
            activeLastWeek: 0,
            averageScore: 0,
            totalQuizzes: 0
        };
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        users.forEach(u => {
            if (u.lastLogin && u.lastLogin.toDate() > oneWeekAgo) {
                stats.activeLastWeek++;
            }
            stats.totalQuizzes += (u.totalQuizzes || 0);
            stats.averageScore += (u.averageScore || 0);
        });
        
        stats.averageScore = stats.total > 0 ? Math.round(stats.averageScore / stats.total) : 0;
        
        setCachedValue(cacheKey, stats, 2 * 60 * 1000);
        return stats;
    } catch (error) {
        console.error('❌ Erreur statistiques utilisateurs:', error);
        throw error;
    }
}
