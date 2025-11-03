// Initialisation de la page d'accueil (index.html)
import { signInWithGoogle, activateDemoMode } from './auth.js';
import { showErrorToast, showSuccessToast, showLoadingToast, updateLoadingToast } from './toast.js';

console.log('Initialisation de la page d accueil...');

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', initIndexPage);

function initIndexPage() {
    console.log('📄 DOM chargé - configuration des boutons...');
    
    // Bouton Google Sign-In
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleSignIn);
        console.log('✅ Bouton Google configuré');
    } else {
        console.warn('⚠️ Bouton Google non trouvé');
    }
    
    // Bouton Mode Démo
    const demoBtn = document.getElementById('demo-mode-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', handleDemoMode);
        console.log('✅ Bouton Mode Démo configuré');
    } else {
        console.warn('⚠️ Bouton Mode Démo non trouvé');
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

/**
 * Handler pour le bouton Mode Démo
 */
async function handleDemoMode() {
    console.log('🎭 Clic sur Mode Démo...');
    
    const loadingToast = showLoadingToast('Activation du mode démo...');
    
    try {
        const demoUser = await activateDemoMode();
        
        console.log('✅ Mode démo activé:', demoUser);
        
    // Succès
    updateLoadingToast(loadingToast, 'Mode démo activé ! Rechargement...', 'success');
        
        // Recharger la page pour que le dashboard détecte le mode démo
        setTimeout(() => {
            window.location.reload();
        }, 500);
        
    } catch (error) {
        console.error('❌ Erreur activation mode démo:', error);
        updateLoadingToast(loadingToast, 'error', 'Impossible d\'activer le mode démo');
    }
}

// Export pour tests
export { handleGoogleSignIn, handleDemoMode };
