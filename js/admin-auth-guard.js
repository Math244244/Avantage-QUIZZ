// Admin Auth Guard - Protection des routes administrateur
import { auth } from './firebase-config.js';
import { getUserProfile } from './firestore-service.js';
import { isDemoMode, getDemoUser } from './auth.js';

/**
 * Vérifie si l'utilisateur actuel est admin
 * Redirige vers index.html si non autorisé
 * Support du mode démo et Firebase
 */
export async function requireAdmin() {
    return new Promise((resolve, reject) => {
        // ✅ Vérifier d'abord le mode démo
        if (isDemoMode()) {
            const demoUser = getDemoUser();
            if (demoUser && demoUser.role === 'admin') {
                console.log('✅ Admin autorisé (mode démo):', demoUser.email);
                resolve(demoUser);
                return;
            } else {
                console.warn('❌ Accès refusé: utilisateur démo non admin');
                alert('Accès refusé. Cette page est réservée aux administrateurs.');
                window.location.href = '/index.html';
                reject(new Error('Non autorisé'));
                return;
            }
        }
        
        // ✅ Mode Firebase normal
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe(); // Se désabonner immédiatement
            
            if (!user) {
                console.warn('❌ Accès refusé: Utilisateur non connecté');
                window.location.href = '/index.html';
                reject(new Error('Non authentifié'));
                return;
            }
            
            try {
                // Vérifier le rôle
                const userProfile = await getUserProfile(user.uid);
                
                if (!userProfile || userProfile.role !== 'admin') {
                    console.warn('❌ Accès refusé: Utilisateur non administrateur');
                    alert('Accès refusé. Cette page est réservée aux administrateurs.');
                    window.location.href = '/index.html';
                    reject(new Error('Non autorisé'));
                    return;
                }
                
                console.log('✅ Admin autorisé:', user.email);
                resolve(user);
            } catch (error) {
                console.error('❌ Erreur vérification admin:', error);
                window.location.href = '/index.html';
                reject(error);
            }
        });
    });
}

/**
 * Vérifie si l'utilisateur est admin sans redirection
 * Retourne true/false
 * Support du mode démo et Firebase
 */
export async function isAdmin() {
    try {
        // ✅ Vérifier le mode démo d'abord
        if (isDemoMode()) {
            const demoUser = getDemoUser();
            return demoUser?.role === 'admin';
        }
        
        // ✅ Mode Firebase normal
        const user = auth.currentUser;
        if (!user) return false;
        
        const userProfile = await getUserProfile(user.uid);
        return userProfile?.role === 'admin';
    } catch (error) {
        console.error('Erreur verification admin:', error);
        return false;
    }
}

/**
 * Ajoute le badge admin dans le profil utilisateur
 */
export function addAdminBadge() {
    const userProfile = document.getElementById('user-profile');
    if (!userProfile) return;
    
    const existingBadge = userProfile.querySelector('.admin-badge');
    if (existingBadge) return; // Badge déjà ajouté
    
    const badge = document.createElement('div');
    badge.className = 'admin-badge bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded mt-1';
    badge.innerHTML = '🔰 Admin';
    badge.style.display = 'inline-block';
    
    userProfile.appendChild(badge);
}
