// Tests pour le système de toasts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
    showToast, 
    showSuccessToast, 
    showErrorToast, 
    showWarningToast, 
    showInfoToast,
    showToastWithAction,
    showLoadingToast,
    updateLoadingToast,
    toast
} from '../js/toast.js';

describe('Toast System', () => {
    beforeEach(() => {
        // Nettoyer le DOM
        document.body.innerHTML = '';
    });
    
    afterEach(() => {
        // Nettoyer les toasts
        const container = document.getElementById('toast-container');
        if (container) {
            container.remove();
        }
    });
    
    describe('showToast', () => {
        it('devrait créer un toast avec le message fourni', () => {
            showToast('Test message', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast).toBeTruthy();
            expect(toast.textContent).toContain('Test message');
        });
        
        it('devrait créer le conteneur de toasts s\'il n\'existe pas', () => {
            expect(document.getElementById('toast-container')).toBeNull();
            
            showToast('Test', 'info', 0);
            
            const container = document.getElementById('toast-container');
            expect(container).toBeTruthy();
            expect(container.className).toContain('fixed');
        });
        
        it('devrait réutiliser le conteneur existant', () => {
            showToast('Premier toast', 'info', 0);
            showToast('Deuxième toast', 'success', 0);
            
            const containers = document.querySelectorAll('#toast-container');
            expect(containers.length).toBe(1);
        });
        
        it('devrait ajouter la classe show après animation', async () => {
            const toast = showToast('Test', 'info', 0);
            
            await new Promise(resolve => setTimeout(resolve, 20));
            
            expect(toast.classList.contains('show')).toBe(true);
        });
        
        it('devrait se fermer automatiquement après la durée', async () => {
            showToast('Test', 'info', 100);
            
            expect(document.querySelectorAll('.toast').length).toBe(1);
            
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Le toast devrait avoir été supprimé du DOM
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(0);
        });
        
        it('ne devrait pas se fermer si duration = 0', async () => {
            showToast('Test persistent', 'info', 0);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const toast = document.querySelector('.toast');
            expect(toast).toBeTruthy();
        });
    });
    
    describe('Types de toasts', () => {
        it('devrait créer un toast de type info', () => {
            showToast('Info message', 'info', 0);
            
            const toast = document.querySelector('.toast-info');
            expect(toast).toBeTruthy();
        });
        
        it('devrait créer un toast de type success', () => {
            showToast('Success message', 'success', 0);
            
            const toast = document.querySelector('.toast-success');
            expect(toast).toBeTruthy();
            expect(toast.innerHTML).toContain('text-green-600');
        });
        
        it('devrait créer un toast de type error', () => {
            showToast('Error message', 'error', 0);
            
            const toast = document.querySelector('.toast-error');
            expect(toast).toBeTruthy();
            expect(toast.innerHTML).toContain('text-red-600');
        });
        
        it('devrait créer un toast de type warning', () => {
            showToast('Warning message', 'warning', 0);
            
            const toast = document.querySelector('.toast-warning');
            expect(toast).toBeTruthy();
            expect(toast.innerHTML).toContain('text-yellow-600');
        });
    });
    
    describe('Bouton de fermeture', () => {
        it('devrait avoir un bouton de fermeture', () => {
            showToast('Test', 'info', 0);
            
            const closeBtn = document.querySelector('.toast-close');
            expect(closeBtn).toBeTruthy();
        });
        
        it('devrait fermer le toast au clic sur le bouton', async () => {
            showToast('Test', 'info', 0);
            
            const closeBtn = document.querySelector('.toast-close');
            closeBtn.click();
            
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(0);
        });
    });
    
    describe('Fonctions helper', () => {
        it('showSuccessToast devrait créer un toast success', () => {
            showSuccessToast('Success!', 0);
            
            const toast = document.querySelector('.toast-success');
            expect(toast).toBeTruthy();
        });
        
        it('showErrorToast devrait créer un toast error', () => {
            showErrorToast('Error!', 0);
            
            const toast = document.querySelector('.toast-error');
            expect(toast).toBeTruthy();
        });
        
        it('showWarningToast devrait créer un toast warning', () => {
            showWarningToast('Warning!', 0);
            
            const toast = document.querySelector('.toast-warning');
            expect(toast).toBeTruthy();
        });
        
        it('showInfoToast devrait créer un toast info', () => {
            showInfoToast('Info!', 0);
            
            const toast = document.querySelector('.toast-info');
            expect(toast).toBeTruthy();
        });
    });
    
    describe('Icônes', () => {
        it('devrait afficher une icône de succès', () => {
            showToast('Success', 'success', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.innerHTML).toContain('<svg');
            expect(toast.innerHTML).toContain('M5 13l4 4L19 7'); // Checkmark path
        });
        
        it('devrait afficher une icône d\'erreur', () => {
            showToast('Error', 'error', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.innerHTML).toContain('<svg');
            expect(toast.innerHTML).toContain('M6 18L18 6M6 6l12 12'); // X path
        });
        
        it('devrait afficher une icône d\'avertissement', () => {
            showToast('Warning', 'warning', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.innerHTML).toContain('<svg');
            expect(toast.innerHTML).toContain('M12 9v2m0 4h.01'); // Alert path
        });
        
        it('devrait afficher une icône d\'info', () => {
            showToast('Info', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.innerHTML).toContain('<svg');
            expect(toast.innerHTML).toContain('M13 16h-1v-4h-1m1-4h.01'); // Info path
        });
    });
    
    describe('Multiples toasts', () => {
        it('devrait pouvoir afficher plusieurs toasts simultanément', () => {
            showToast('Toast 1', 'info', 0);
            showToast('Toast 2', 'success', 0);
            showToast('Toast 3', 'error', 0);
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(3);
        });
        
        it('devrait empiler les toasts verticalement', () => {
            showToast('Toast 1', 'info', 0);
            showToast('Toast 2', 'success', 0);
            
            const container = document.getElementById('toast-container');
            expect(container.className).toContain('flex-col');
            expect(container.className).toContain('gap-3');
        });
    });
    
    describe('Styles et classes', () => {
        it('devrait avoir les classes de base', () => {
            showToast('Test', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.classList.contains('toast')).toBe(true);
            expect(toast.classList.contains('toast-info')).toBe(true);
        });
        
        it('devrait avoir les classes d\'animation', () => {
            showToast('Test', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.className).toContain('transform');
            expect(toast.className).toContain('transition');
        });
        
        it('devrait avoir une bordure colorée selon le type', () => {
            showToast('Success', 'success', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.innerHTML).toContain('border-green-500');
        });
    });
    
    describe('Accessibilité', () => {
        it('devrait avoir un conteneur avec z-index élevé', () => {
            showToast('Test', 'info', 0);
            
            const container = document.getElementById('toast-container');
            expect(container.className).toContain('z-50');
        });
        
        it('devrait être positionné en haut à droite', () => {
            showToast('Test', 'info', 0);
            
            const container = document.getElementById('toast-container');
            expect(container.className).toContain('top-4');
            expect(container.className).toContain('right-4');
        });
    });
    
    describe('Toast avec action (showToastWithAction)', () => {
        it('devrait créer un toast avec un bouton d\'action', () => {
            const callback = vi.fn();
            
            showToastWithAction('Message avec action', 'info', 'Annuler', callback);
            
            const actionBtn = document.querySelector('.toast-action');
            expect(actionBtn).toBeTruthy();
            expect(actionBtn.textContent.trim()).toBe('Annuler');
        });
        
        it('devrait appeler le callback au clic sur l\'action', async () => {
            const callback = vi.fn();
            
            showToastWithAction('Message', 'success', 'Confirmer', callback);
            
            const actionBtn = document.querySelector('.toast-action');
            actionBtn.click();
            
            expect(callback).toHaveBeenCalledTimes(1);
        });
        
        it('devrait fermer le toast après le clic sur l\'action', async () => {
            const callback = vi.fn();
            
            showToastWithAction('Message', 'warning', 'OK', callback);
            
            const actionBtn = document.querySelector('.toast-action');
            actionBtn.click();
            
            await new Promise(resolve => setTimeout(resolve, 400));
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(0);
        });
    });
    
    describe('Toast de chargement (showLoadingToast)', () => {
        it('devrait créer un toast de chargement', () => {
            const loadingToast = showLoadingToast('Chargement en cours...');
            
            expect(loadingToast).toBeTruthy();
            expect(loadingToast.classList.contains('toast-loading')).toBe(true);
            expect(loadingToast.getAttribute('data-loading')).toBe('true');
        });
        
        it('devrait afficher un spinner animé', () => {
            showLoadingToast('Chargement...');
            
            const spinner = document.querySelector('.animate-spin');
            expect(spinner).toBeTruthy();
        });
        
        it('devrait afficher le message de chargement', () => {
            showLoadingToast('Téléchargement des données...');
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl.textContent).toContain('Téléchargement des données...');
        });
        
        it('ne devrait pas se fermer automatiquement', async () => {
            showLoadingToast('Chargement permanent...');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const toastEl = document.querySelector('.toast-loading');
            expect(toastEl).toBeTruthy();
        });
    });
    
    describe('Mise à jour toast chargement (updateLoadingToast)', () => {
        it('devrait mettre à jour un toast de chargement en succès', async () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            updateLoadingToast(loadingToast, 'Chargement terminé !', 'success');
            
            expect(loadingToast.textContent).toContain('Chargement terminé !');
            expect(loadingToast.innerHTML).toContain('border-green-500');
            expect(loadingToast.hasAttribute('data-loading')).toBe(false);
        });
        
        it('devrait mettre à jour un toast de chargement en erreur', async () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Erreur de chargement', 'error');
            
            expect(loadingToast.textContent).toContain('Erreur de chargement');
            expect(loadingToast.innerHTML).toContain('border-red-500');
        });
        
        it('devrait ajouter un bouton de fermeture après mise à jour', async () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Terminé', 'success');
            
            const closeBtn = loadingToast.querySelector('.toast-close');
            expect(closeBtn).toBeTruthy();
        });
        
        it('devrait se fermer automatiquement après 3s', async () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Terminé', 'success');
            
            await new Promise(resolve => setTimeout(resolve, 3500));
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(0);
        });
        
        it('ne devrait rien faire si le toast n\'est pas un loading toast', () => {
            const normalToast = showToast('Normal toast', 'info', 0);
            const originalContent = normalToast.innerHTML;
            
            updateLoadingToast(normalToast, 'Tentative mise à jour', 'success');
            
            // Le contenu ne devrait pas changer
            expect(normalToast.innerHTML).toBe(originalContent);
        });
        
        it('ne devrait rien faire si le toast est null', () => {
            // Ne devrait pas throw d'erreur
            expect(() => {
                updateLoadingToast(null, 'Message', 'success');
            }).not.toThrow();
        });
    });
    
    describe('Nettoyage du conteneur', () => {
        it('devrait supprimer le conteneur quand tous les toasts sont fermés', async () => {
            showToast('Toast 1', 'info', 100);
            showToast('Toast 2', 'success', 100);
            
            expect(document.getElementById('toast-container')).toBeTruthy();
            
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Tous les toasts fermés, conteneur supprimé
            expect(document.getElementById('toast-container')).toBeNull();
        });
        
        it('ne devrait pas supprimer le conteneur si d\'autres toasts existent', async () => {
            showToast('Toast 1', 'info', 100);
            showToast('Toast 2', 'success', 0); // Persistent
            
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Toast 2 toujours présent
            expect(document.getElementById('toast-container')).toBeTruthy();
            expect(document.querySelectorAll('.toast').length).toBe(1);
        });
    });
    
    describe('Objets toast helper', () => {
        it('toast.success devrait créer un toast success', () => {
            toast.success('Success!', 0);
            
            const toastEl = document.querySelector('.toast-success');
            expect(toastEl).toBeTruthy();
        });
        
        it('toast.error devrait créer un toast error', () => {
            toast.error('Error!', 0);
            
            const toastEl = document.querySelector('.toast-error');
            expect(toastEl).toBeTruthy();
        });
        
        it('toast.warning devrait créer un toast warning', () => {
            toast.warning('Warning!', 0);
            
            const toastEl = document.querySelector('.toast-warning');
            expect(toastEl).toBeTruthy();
        });
        
        it('toast.info devrait créer un toast info', () => {
            toast.info('Info!', 0);
            
            const toastEl = document.querySelector('.toast-info');
            expect(toastEl).toBeTruthy();
        });
    });
});
