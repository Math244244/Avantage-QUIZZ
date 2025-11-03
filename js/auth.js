// Module Authentication - Gestion de l'authentification Google
import { auth } from './firebase-config.js';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { createOrUpdateUser } from './firestore-service.js';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});

// Sign in with Google
export async function signInWithGoogle() {
    try {
        console.log('🔐 Tentative de connexion Google...');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log('✅ Authentification réussie:', user.displayName);
        console.log('📧 Email:', user.email);
        
        // Créer ou mettre à jour le profil utilisateur dans Firestore
        await createOrUpdateUser(user);
        
        return user;
    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
        
        // Messages d'erreur personnalisés
        let errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Connexion annulée. Veuillez réessayer.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up bloquée. Autorisez les pop-ups pour ce site.';
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'Domaine non autorisé. Configurez Firebase Authentication.';
        }
        
        alert(errorMessage);
        throw error;
    }
}

// Sign out
export async function signOutUser() {
    try {
        const userName = auth.currentUser?.displayName || 'Utilisateur';
        await signOut(auth);
        console.log('✅ Déconnexion réussie:', userName);
    } catch (error) {
        console.error('❌ Erreur de déconnexion:', error);
        throw error;
    }
}

// Listen for auth state changes
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('👤 Utilisateur connecté:', user.email);
        } else {
            console.log('👤 Aucun utilisateur connecté');
        }
        callback(user);
    });
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Check if user is authenticated
export function isAuthenticated() {
    return auth.currentUser !== null;
}

// Show admin UI elements if user is admin
export async function showAdminUIIfAdmin(userProfile) {
    if (!userProfile) return;
    
    const isAdmin = userProfile.role === 'admin';
    
    if (isAdmin) {
        // Afficher l'onglet Admin dans la navigation
        const navAdminItem = document.getElementById('nav-admin-item');
        if (navAdminItem) {
            navAdminItem.classList.remove('hidden');
        }
        
        // Afficher le badge Admin
        const adminBadgeNav = document.getElementById('admin-badge-nav');
        if (adminBadgeNav) {
            adminBadgeNav.classList.remove('hidden');
        }
        
        console.log('Admin UI elements shown');
    }
}

// ============================================
// MODE DÉMO
// ============================================

/**
 * Activer le mode démo sans authentification Firebase
 * Crée un utilisateur fictif en localStorage
 */
export async function activateDemoMode() {
    try {
        console.log('🎭 Activation du mode démo...');
        
        // Créer un utilisateur démo
        const demoUser = {
            uid: 'demo-user-' + Date.now(),
            email: 'demo@avantage-quizz.local',
            displayName: 'Utilisateur Démo',
            photoURL: null,
            isDemo: true,
            role: 'admin', // Admin par défaut pour tester toutes les fonctionnalités
            createdAt: new Date().toISOString()
        };
        
        // Stocker en localStorage
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
        localStorage.setItem('authMode', 'demo');
        
        console.log('✅ Mode démo activé:', demoUser.displayName);
        console.log('📧 Email:', demoUser.email);
        console.log('👑 Rôle:', demoUser.role);
        
        return demoUser;
        
    } catch (error) {
        console.error('❌ Erreur activation mode démo:', error);
        throw error;
    }
}

/**
 * Désactiver le mode démo
 */
export function deactivateDemoMode() {
    localStorage.removeItem('demoUser');
    localStorage.removeItem('authMode');
    console.log('✅ Mode démo désactivé');
}

/**
 * Vérifier si le mode démo est actif
 */
export function isDemoMode() {
    return localStorage.getItem('authMode') === 'demo';
}

/**
 * Récupérer l'utilisateur démo depuis localStorage
 */
export function getDemoUser() {
    try {
        const demoUserJson = localStorage.getItem('demoUser');
        if (!demoUserJson) return null;
        
        const demoUser = JSON.parse(demoUserJson);
        return demoUser;
    } catch (error) {
        console.error('❌ Erreur lecture utilisateur démo:', error);
        return null;
    }
}

/**
 * Obtenir l'utilisateur actuel (Firebase ou Démo)
 */
export function getCurrentUserUnified() {
    // Mode démo
    if (isDemoMode()) {
        return getDemoUser();
    }
    
    // Mode Firebase normal
    return getCurrentUser();
}
