/**
 * Tests pour StateManager
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager, stateManager } from '../js/state-manager.js';

describe('StateManager', () => {
    let manager;
    
    beforeEach(() => {
        manager = new StateManager();
    });
    
    describe('Initialization', () => {
        it('devrait initialiser avec un état vide', () => {
            expect(manager.get('currentQuiz')).toBeNull();
            expect(manager.get('currentQuestionIndex')).toBe(0);
            expect(manager.get('userAnswers')).toEqual([]);
        });
        
        it('devrait avoir un historique vide au départ', () => {
            expect(manager.getHistory().length).toBe(0);
        });
    });
    
    describe('get()', () => {
        it('devrait retourner une valeur existante', () => {
            manager.set('currentQuiz', { id: 'test' });
            expect(manager.get('currentQuiz')).toEqual({ id: 'test' });
        });
        
        it('devrait retourner undefined pour une clé inexistante', () => {
            expect(manager.get('nonExistent')).toBeUndefined();
        });
        
        it('devrait supporter les clés imbriquées', () => {
            manager.set('quiz', { current: { index: 5 } });
            expect(manager.get('quiz.current.index')).toBe(5);
        });
    });
    
    describe('set()', () => {
        it('devrait définir une valeur', () => {
            manager.set('currentQuiz', { id: 'test' });
            expect(manager.get('currentQuiz')).toEqual({ id: 'test' });
        });
        
        it('devrait ajouter à l\'historique', () => {
            manager.set('testKey', 'value1');
            manager.set('testKey', 'value2');
            
            const history = manager.getHistory('testKey');
            expect(history.length).toBe(2);
            expect(history[0].oldValue).toBeUndefined();
            expect(history[0].newValue).toBe('value1');
            expect(history[1].oldValue).toBe('value1');
            expect(history[1].newValue).toBe('value2');
        });
        
        it('devrait supporter les clés imbriquées', () => {
            manager.set('quiz.current.index', 5);
            expect(manager.get('quiz.current.index')).toBe(5);
        });
    });
    
    describe('update()', () => {
        it('devrait mettre à jour plusieurs valeurs en une fois', () => {
            manager.update({
                currentQuiz: { id: 'test' },
                currentQuestionIndex: 5
            });
            
            expect(manager.get('currentQuiz')).toEqual({ id: 'test' });
            expect(manager.get('currentQuestionIndex')).toBe(5);
        });
    });
    
    describe('subscribe()', () => {
        it('devrait appeler le callback lors d\'un changement', () => {
            const callback = vi.fn();
            manager.subscribe('testKey', callback);
            
            manager.set('testKey', 'newValue');
            
            expect(callback).toHaveBeenCalledWith('newValue', undefined, 'testKey');
        });
        
        it('devrait retourner une fonction de désabonnement', () => {
            const callback = vi.fn();
            const unsubscribe = manager.subscribe('testKey', callback);
            
            unsubscribe();
            manager.set('testKey', 'newValue');
            
            // Le callback ne devrait pas être appelé après désabonnement
            expect(callback).not.toHaveBeenCalled();
        });
    });
    
    describe('resetQuiz()', () => {
        it('devrait réinitialiser l\'état du quiz', () => {
            manager.set('currentQuiz', { id: 'test' });
            manager.set('currentQuestionIndex', 5);
            manager.set('userAnswers', [{ answer: 1 }]);
            
            manager.resetQuiz();
            
            expect(manager.get('currentQuiz')).toBeNull();
            expect(manager.get('currentQuestionIndex')).toBe(0);
            expect(manager.get('userAnswers')).toEqual([]);
        });
    });
    
    describe('resetDashboard()', () => {
        it('devrait réinitialiser l\'état du dashboard', () => {
            manager.set('monthsData', [{ name: 'Janvier' }]);
            manager.set('currentMonthIndex', 5);
            
            manager.resetDashboard();
            
            expect(manager.get('monthsData')).toEqual([]);
            expect(manager.get('currentMonthIndex')).toBeNull();
        });
    });
    
    describe('resetAdmin()', () => {
        it('devrait réinitialiser l\'état admin', () => {
            manager.set('globalStats', { total: 100 });
            manager.set('topUsers', [{ id: '1' }]);
            
            manager.resetAdmin();
            
            expect(manager.get('globalStats')).toBeNull();
            expect(manager.get('topUsers')).toEqual([]);
        });
    });
    
    describe('reset()', () => {
        it('devrait réinitialiser tout l\'état (sauf auth)', () => {
            manager.set('currentQuiz', { id: 'test' });
            manager.set('monthsData', [{ name: 'Janvier' }]);
            manager.set('globalStats', { total: 100 });
            manager.set('currentUser', { id: 'user1' }); // Ne devrait pas être réinitialisé
            
            manager.reset();
            
            expect(manager.get('currentQuiz')).toBeNull();
            expect(manager.get('monthsData')).toEqual([]);
            expect(manager.get('globalStats')).toBeNull();
            expect(manager.get('currentUser')).toEqual({ id: 'user1' }); // Conservé
        });
    });
    
    describe('getHistory()', () => {
        it('devrait retourner l\'historique complet', () => {
            manager.set('key1', 'value1');
            manager.set('key2', 'value2');
            
            const history = manager.getHistory();
            expect(history.length).toBe(2);
        });
        
        it('devrait filtrer par clé', () => {
            manager.set('key1', 'value1');
            manager.set('key2', 'value2');
            manager.set('key1', 'value3');
            
            const history = manager.getHistory('key1');
            expect(history.length).toBe(2);
            expect(history.every(h => h.key === 'key1')).toBe(true);
        });
    });
    
    describe('getSnapshot()', () => {
        it('devrait retourner une copie de l\'état', () => {
            manager.set('testKey', 'testValue');
            
            const snapshot = manager.getSnapshot();
            expect(snapshot.testKey).toBe('testValue');
            
            // Modifier le snapshot ne devrait pas affecter l'état original
            snapshot.testKey = 'modified';
            expect(manager.get('testKey')).toBe('testValue');
        });
    });
    
    describe('restoreSnapshot()', () => {
        it('devrait restaurer un snapshot', () => {
            manager.set('key1', 'value1');
            manager.set('key2', 'value2');
            
            const snapshot = manager.getSnapshot();
            manager.set('key1', 'modified');
            
            manager.restoreSnapshot(snapshot);
            expect(manager.get('key1')).toBe('value1');
        });
    });
    
    describe('has()', () => {
        it('devrait retourner true pour une clé existante', () => {
            manager.set('testKey', 'value');
            expect(manager.has('testKey')).toBe(true);
        });
        
        it('devrait retourner false pour une clé inexistante', () => {
            expect(manager.has('nonExistent')).toBe(false);
        });
        
        it('devrait supporter les clés imbriquées', () => {
            manager.set('quiz.current.index', 5);
            expect(manager.has('quiz.current.index')).toBe(true);
            expect(manager.has('quiz.current.nonExistent')).toBe(false);
        });
    });
    
    describe('delete()', () => {
        it('devrait supprimer une clé', () => {
            manager.set('testKey', 'value');
            manager.delete('testKey');
            
            expect(manager.has('testKey')).toBe(false);
            expect(manager.get('testKey')).toBeUndefined();
        });
        
        it('devrait supporter les clés imbriquées', () => {
            manager.set('quiz.current.index', 5);
            manager.delete('quiz.current.index');
            
            expect(manager.has('quiz.current.index')).toBe(false);
        });
    });
    
    describe('Singleton stateManager', () => {
        it('devrait être une instance unique', () => {
            expect(stateManager).toBeInstanceOf(StateManager);
        });
    });
});

