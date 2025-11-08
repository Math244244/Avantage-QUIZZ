// Initialisation de la page d'accueil (index.html)
import { signInWithGoogle } from './auth.js';
import { showErrorToast, showSuccessToast, showLoadingToast, updateLoadingToast } from './toast.js';
// Import des gestionnaires d'erreurs centralisés (Section 1 - Architecture)
import { errorHandler, withErrorHandling } from './error-handler.js';
import { withRetry, withFirestoreRetry } from './retry-handler.js';
// ✅ CORRECTION SECTION 8 : Gestion Offline Complète
import { offlineManager } from './offline-manager.js';

console.log('Initialisation de la page d accueil...');

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', initIndexPage);

function initIndexPage() {
    console.log('📄 DOM chargé - configuration du bouton de connexion...');
    
    // Bouton Google Sign-In
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleSignIn);
        console.log('✅ Bouton Google configuré');
    } else {
        console.warn('⚠️ Bouton Google non trouvé');
    }
}

/**
 * Handler pour le bouton Google Sign-In
 */
async function handleGoogleSignIn() {
    console.log('🔐 Clic sur connexion Google...');
    
    const loadingToast = showLoadingToast('Connexion en cours...');
    
    try {
        const user = await signInWithGoogle();
        
    // Succès
    updateLoadingToast(loadingToast, `Bienvenue ${user.displayName} !`, 'success');
        
        // Recharger la page pour que le dashboard détecte l'utilisateur connecté
        setTimeout(() => {
            window.location.reload();
        }, 800);
        
    } catch (error) {
        console.error('❌ Erreur connexion Google:', error);
        
        // Messages d'erreur personnalisés
        let errorMessage = 'Erreur lors de la connexion';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Connexion annulée';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up bloquée. Autorisez les pop-ups.';
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = 'Domaine non autorisé dans Firebase';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
        }
        
    updateLoadingToast(loadingToast, errorMessage, 'error');
    }
}

// Export pour tests
export { handleGoogleSignIn };
