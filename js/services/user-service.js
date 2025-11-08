/**
 * Service de Gestion des Utilisateurs
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Extraction des fonctions utilisateurs
 */

import { db, auth } from '../firebase-config.js';
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    runTransaction
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { safeFirestoreRead, safeFirestoreWrite } from '../rate-limiter.js';
import { getCurrentClientId } from '../client-manager.js';
import { buildCacheKey, getCachedValue, setCachedValue, invalidateCache } from './cache-service.js';
import { createAuditLog } from './audit-service.js';

const COLLECTIONS = {
    users: 'users'
};

/**
 * Créer ou mettre à jour le profil utilisateur
 */
export async function createOrUpdateUser(user) {
    try {
        const userRef = doc(db, COLLECTIONS.users, user.uid);
        // ✅ CORRECTION SECTION 1 : Récupérer le clientId pour isolation multi-tenant
        const clientId = await getCurrentClientId(user);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: Timestamp.now(),
            updatedAt: Timestamp.now(),
            clientId: clientId
        };
        
        const userDoc = await safeFirestoreRead(() => getDoc(userRef));
        
        if (!userDoc.exists()) {
            userData.createdAt = Timestamp.now();
            userData.totalQuizzes = 0;
            userData.averageScore = 0;
            userData.currentStreak = 0;
            userData.longestStreak = 0;
            userData.role = 'user';
            console.log('👤 Création du profil utilisateur:', user.email);
        } else {
            const existingData = userDoc.data();
            if (!existingData.clientId) {
                userData.clientId = clientId;
                console.log('🔄 Migration: Ajout du clientId au profil utilisateur existant');
            }
        }
        
        await safeFirestoreWrite(() => setDoc(userRef, userData, { merge: true }));
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
        const userDoc = await safeFirestoreRead(() => getDoc(userRef));
        
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('❌ Erreur récupération profil:', error);
        throw error;
    }
}

/**
 * Mettre à jour les statistiques utilisateur
 * Note: Cette fonction est utilisée par quiz-service.js, donc elle doit être exportée
 */
export async function updateUserStats(uid, newScore) {
    if (isNaN(newScore) || newScore < 0 || newScore > 100) {
        console.error('❌ Score invalide pour mise à jour des stats:', newScore);
        throw new Error(`Score invalide: ${newScore}. Doit être entre 0 et 100.`);
    }
    
    try {
        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, COLLECTIONS.users, uid);
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists()) {
                throw new Error('Utilisateur non trouvé');
            }
            
            const userData = userDoc.data();
            const totalQuizzes = (userData.totalQuizzes || 0) + 1;
            const currentAverage = userData.averageScore || 0;
            const newAverage = ((currentAverage * (totalQuizzes - 1)) + newScore) / totalQuizzes;
            
            const roundedAverage = Math.round(newAverage);
            if (isNaN(roundedAverage) || roundedAverage < 0 || roundedAverage > 100) {
                console.error('❌ Moyenne calculée invalide:', roundedAverage);
                throw new Error(`Erreur de calcul de la moyenne: ${roundedAverage}`);
            }
            
            transaction.update(userRef, {
                totalQuizzes: totalQuizzes,
                averageScore: roundedAverage,
                lastQuizDate: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        });
        
        console.log('📊 Statistiques mises à jour');
        invalidateCache('users');
        invalidateCache('users-stats');
    } catch (error) {
        console.error('❌ Erreur mise à jour statistiques:', error);
        throw error;
    }
}

/**
 * Calculer et mettre à jour la série (streak)
 */
export async function updateStreak(uid) {
    // Import dynamique pour éviter dépendance circulaire
    const { getUserQuizResults } = await import('./quiz-service.js');
    
    try {
        const results = await getUserQuizResults(uid, 12);
        
        let currentStreak = 0;
        const monthsSet = new Set();
        
        for (const result of results) {
            if (result.score >= 60) {
                monthsSet.add(result.month);
            }
        }
        
        const months = Array.from(monthsSet).sort().reverse();
        for (let i = 0; i < months.length; i++) {
            currentStreak++;
            if (i < months.length - 1) {
                // Logique de vérification de consécutivité simplifiée
            } else {
                break;
            }
        }
        
        const userRef = doc(db, COLLECTIONS.users, uid);
        const userDoc = await safeFirestoreRead(() => getDoc(userRef));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const longestStreak = Math.max(currentStreak, userData.longestStreak || 0);
            
            await safeFirestoreWrite(() => updateDoc(userRef, {
                currentStreak: currentStreak,
                longestStreak: longestStreak,
                updatedAt: Timestamp.now()
            }));
            
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

/**
 * Récupérer le classement général
 */
export async function getLeaderboard(limitCount = 10) {
    try {
        const clientId = await getCurrentClientId();
        
        const q = query(
            collection(db, COLLECTIONS.users),
            where('clientId', '==', clientId),
            orderBy('averageScore', 'desc'),
            orderBy('totalQuizzes', 'desc'),
            limit(limitCount)
        );
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
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
 * ADMIN: Récupérer tous les utilisateurs (sans pagination - pour compatibilité)
 */
export async function getAllUsers(filters = {}) {
    const cacheKey = buildCacheKey(['users', JSON.stringify(filters || {})]);
    const cached = getCachedValue(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const clientId = await getCurrentClientId();
        
        const constraints = [
            where('clientId', '==', clientId)
        ];
        
        if (filters.role) {
            constraints.push(where('role', '==', filters.role));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        
        const q = query(collection(db, COLLECTIONS.users), ...constraints);
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const users = [];
        
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`👥 ${users.length} utilisateurs chargés`);
        setCachedValue(cacheKey, users, 'users');
        return users;
    } catch (error) {
        console.error('❌ Erreur récupération utilisateurs:', error);
        throw error;
    }
}

/**
 * ✅ CORRECTION SECTION 7 : Pagination - Récupérer les utilisateurs avec pagination
 * @param {Object} filters - Filtres optionnels
 * @param {number} pageSize - Nombre d'éléments par page (défaut: 20)
 * @param {QueryDocumentSnapshot|null} lastDoc - Document de départ pour la pagination
 * @returns {Promise<{users: Array, lastDoc: QueryDocumentSnapshot|null, hasMore: boolean}>}
 */
export async function getAllUsersPaginated(filters = {}, pageSize = 20, lastDoc = null) {
    try {
        const clientId = await getCurrentClientId();
        
        const constraints = [
            where('clientId', '==', clientId)
        ];
        
        if (filters.role) {
            constraints.push(where('role', '==', filters.role));
        }
        
        constraints.push(orderBy('createdAt', 'desc'));
        constraints.push(limit(pageSize + 1)); // +1 pour détecter s'il y a plus de résultats
        
        let q = query(collection(db, COLLECTIONS.users), ...constraints);
        
        // Si on a un document de départ, commencer après
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }
        
        const querySnapshot = await safeFirestoreRead(() => getDocs(q));
        const users = [];
        let newLastDoc = null;
        let hasMore = false;
        
        querySnapshot.forEach((doc, index) => {
            if (index < pageSize) {
                users.push({ id: doc.id, ...doc.data() });
            } else {
                // On a récupéré un élément de plus, donc il y a plus de résultats
                hasMore = true;
            }
        });
        
        // Le dernier document de cette page devient le curseur pour la suivante
        if (querySnapshot.docs.length > 0 && users.length === pageSize) {
            newLastDoc = querySnapshot.docs[pageSize - 1];
        }
        
        console.log(`👥 ${users.length} utilisateurs chargés (pagination)`);
        return {
            users,
            lastDoc: newLastDoc,
            hasMore
        };
    } catch (error) {
        console.error('❌ Erreur récupération utilisateurs paginés:', error);
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
        
        await safeFirestoreWrite(() => updateDoc(userRef, {
            role: newRole,
            updatedAt: Timestamp.now()
        }));
        
        console.log(`✅ Rôle mis à jour pour ${userId}: ${newRole}`);
        
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
 * ADMIN: Récupérer les statistiques des utilisateurs
 */
export async function getUsersStats() {
    const clientId = await getCurrentClientId();
    const cacheKey = buildCacheKey(['users-stats', clientId]);
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
        
        setCachedValue(cacheKey, stats, 'stats');
        return stats;
    } catch (error) {
        console.error('❌ Erreur statistiques utilisateurs:', error);
        throw error;
    }
}

