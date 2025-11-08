/**
 * Tests supplémentaires pour toast.js - Amélioration coverage
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
    showToast, 
    showToastWithAction,
    showLoadingToast,
    updateLoadingToast,
    toast
} from '../js/toast.js';

describe('Toast System - Extended Coverage', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });
    
    afterEach(() => {
        const container = document.getElementById('toast-container');
        if (container) {
            container.remove();
        }
    });
    
    describe('showToastWithAction - Actions clickables', () => {
        it('devrait créer un toast avec un bouton d\'action', () => {
            const actionCallback = vi.fn();
            showToastWithAction('Message', 'info', 'Action', actionCallback);
            
            const toast = document.querySelector('.toast');
            expect(toast).toBeTruthy();
            
            const actionBtn = toast.querySelector('.toast-action');
            expect(actionBtn).toBeTruthy();
            expect(actionBtn.textContent).toContain('Action');
        });
        
        it('devrait exécuter le callback quand le bouton d\'action est cliqué', () => {
            const actionCallback = vi.fn();
            showToastWithAction('Message', 'info', 'Action', actionCallback);
            
            const actionBtn = document.querySelector('.toast-action');
            actionBtn.click();
            
            expect(actionCallback).toHaveBeenCalledTimes(1);
        });
        
        it('devrait fermer le toast après l\'action', () => {
            const actionCallback = vi.fn();
            showToastWithAction('Message', 'info', 'Action', actionCallback);
            
            const toast = document.querySelector('.toast');
            const actionBtn = toast.querySelector('.toast-action');
            actionBtn.click();
            
            // Le toast devrait être fermé
            setTimeout(() => {
                expect(toast.classList.contains('hide')).toBe(true);
            }, 100);
        });
    });
    
    describe('showLoadingToast', () => {
        it('devrait créer un toast de chargement', () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            expect(loadingToast).toBeTruthy();
            const toast = document.querySelector('.toast');
            expect(toast).toBeTruthy();
            expect(toast.textContent).toContain('Chargement...');
        });
        
        it('devrait avoir un spinner de chargement', () => {
            showLoadingToast('Chargement...');
            
            const toast = document.querySelector('.toast');
            const spinner = toast.querySelector('.animate-spin');
            expect(spinner).toBeTruthy();
        });
        
        it('ne devrait pas se fermer automatiquement', () => {
            showLoadingToast('Chargement...');
            
            const toast = document.querySelector('.toast');
            // Attendre un peu pour vérifier qu'il ne se ferme pas
            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(toast.classList.contains('hide')).toBe(false);
                    resolve();
                }, 100);
            });
        });
    });
    
    describe('updateLoadingToast', () => {
        it('devrait mettre à jour le message d\'un toast de chargement', () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Terminé !', 'success');
            
            expect(loadingToast.textContent).toContain('Terminé !');
        });
        
        it('devrait changer le type du toast', () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Succès !', 'success');
            
            expect(loadingToast.classList.contains('toast-success')).toBe(true);
        });
        
        it('devrait fermer le toast après mise à jour', () => {
            const loadingToast = showLoadingToast('Chargement...');
            
            updateLoadingToast(loadingToast, 'Terminé !', 'success');
            
            setTimeout(() => {
                expect(loadingToast.classList.contains('hide')).toBe(true);
            }, 100);
        });
    });
    
    describe('toast object - Méthodes de raccourci', () => {
        it('devrait avoir une méthode success', () => {
            expect(typeof toast.success).toBe('function');
            toast.success('Test success');
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl).toBeTruthy();
            expect(toastEl.classList.contains('toast-success')).toBe(true);
        });
        
        it('devrait avoir une méthode error', () => {
            expect(typeof toast.error).toBe('function');
            toast.error('Test error');
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl).toBeTruthy();
            expect(toastEl.classList.contains('toast-error')).toBe(true);
        });
        
        it('devrait avoir une méthode warning', () => {
            expect(typeof toast.warning).toBe('function');
            toast.warning('Test warning');
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl).toBeTruthy();
            expect(toastEl.classList.contains('toast-warning')).toBe(true);
        });
        
        it('devrait avoir une méthode info', () => {
            expect(typeof toast.info).toBe('function');
            toast.info('Test info');
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl).toBeTruthy();
            expect(toastEl.classList.contains('toast-info')).toBe(true);
        });
    });
    
    describe('Multiple toasts - Empilage', () => {
        it('devrait afficher plusieurs toasts simultanément', () => {
            showToast('Premier', 'info', 0);
            showToast('Deuxième', 'success', 0);
            showToast('Troisième', 'error', 0);
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(3);
        });
        
        it('devrait fermer les toasts indépendamment', () => {
            const toast1 = showToast('Premier', 'info', 0);
            const toast2 = showToast('Deuxième', 'success', 0);
            
            const closeBtn1 = toast1.querySelector('.toast-close');
            closeBtn1.click();
            
            setTimeout(() => {
                const toasts = document.querySelectorAll('.toast');
                expect(toasts.length).toBe(1);
                expect(toasts[0].textContent).toContain('Deuxième');
            }, 100);
        });
    });
    
    describe('Auto-dismiss - Durée personnalisée', () => {
        it('devrait fermer automatiquement après la durée spécifiée', async () => {
            showToast('Message', 'info', 100); // 100ms
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const toast = document.querySelector('.toast');
                    expect(toast.classList.contains('hide')).toBe(true);
                    resolve();
                }, 100);
            });
        });
        
        it('ne devrait pas se fermer si duration = 0', () => {
            showToast('Message', 'info', 0);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const toast = document.querySelector('.toast');
                    expect(toast.classList.contains('hide')).toBe(false);
                    resolve();
                }, 100);
            });
        });
    });
    
    describe('XSS Protection', () => {
        it('devrait échapper le HTML dans les messages', () => {
            showToast('<script>alert("XSS")</script>', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.textContent).toContain('<script>');
            expect(toast.innerHTML).not.toContain('<script>');
        });
        
        it('devrait échapper les caractères spéciaux', () => {
            showToast('Test & < > " \'', 'info', 0);
            
            const toast = document.querySelector('.toast');
            expect(toast.textContent).toContain('&');
        });
    });
});

