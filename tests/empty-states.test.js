// Tests pour empty-states.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createEmptyState,
    showEmptyState,
    createErrorState,
    showErrorState,
    illustrations
} from '../js/empty-states.js';

describe('Empty States', () => {
    describe('illustrations', () => {
        it('devrait contenir toutes les illustrations SVG', () => {
            expect(illustrations).toHaveProperty('noQuestions');
            expect(illustrations).toHaveProperty('noResults');
            expect(illustrations).toHaveProperty('noResources');
            expect(illustrations).toHaveProperty('noUsers');
            expect(illustrations).toHaveProperty('noNotifications');
            expect(illustrations).toHaveProperty('error');
            expect(illustrations).toHaveProperty('loading');
            expect(illustrations).toHaveProperty('noSearchResults');
        });
        
        it('toutes les illustrations doivent être du SVG valide', () => {
            Object.values(illustrations).forEach(svg => {
                expect(svg).toContain('<svg');
                expect(svg).toContain('</svg>');
            });
        });
    });
    
    describe('createEmptyState', () => {
        it('devrait créer un état vide pour noQuestions', () => {
            const html = createEmptyState('noQuestions');
            expect(html).toContain('Aucune question créée');
            expect(html).toContain('empty-state');
            expect(html).toContain('<svg');
        });
        
        it('devrait créer un état vide pour noResults', () => {
            const html = createEmptyState('noResults');
            expect(html).toContain('Aucun quiz complété');
            expect(html).toContain('Commencer un quiz');
        });
        
        it('devrait créer un état vide pour noResources', () => {
            const html = createEmptyState('noResources');
            expect(html).toContain('Aucune ressource disponible');
        });
        
        it('devrait créer un état vide pour noUsers', () => {
            const html = createEmptyState('noUsers');
            expect(html).toContain('Aucun utilisateur trouvé');
        });
        
        it('devrait créer un état vide pour noNotifications', () => {
            const html = createEmptyState('noNotifications');
            expect(html).toContain('Aucune notification');
            expect(html).toContain('Vous êtes à jour');
        });
        
        it('devrait créer un état d\'erreur', () => {
            const html = createEmptyState('error');
            expect(html).toContain('Une erreur est survenue');
            expect(html).toContain('Réessayer');
        });
        
        it('devrait créer un état de loading', () => {
            const html = createEmptyState('loading');
            expect(html).toContain('Chargement en cours');
        });
        
        it('devrait créer un état noSearchResults', () => {
            const html = createEmptyState('noSearchResults');
            expect(html).toContain('Aucun résultat trouvé');
            expect(html).toContain('mots-clés ou filtres');
        });
        
        it('devrait accepter des options personnalisées', () => {
            const html = createEmptyState('noQuestions', {
                title: 'Titre personnalisé',
                description: 'Description personnalisée'
            });
            expect(html).toContain('Titre personnalisé');
            expect(html).toContain('Description personnalisée');
        });
        
        it('devrait masquer le bouton d\'action si action.show = false', () => {
            const html = createEmptyState('noResources', {
                action: { show: false }
            });
            expect(html).not.toContain('empty-state-action');
        });
        
        it('devrait afficher le bouton d\'action si action.show = true', () => {
            const html = createEmptyState('noQuestions', {
                action: { text: 'Mon Action', show: true }
            });
            expect(html).toContain('Mon Action');
            expect(html).toContain('empty-state-action');
        });
        
        it('devrait ajouter un href si fourni dans action', () => {
            const html = createEmptyState('noResults', {
                action: { 
                    text: 'Aller quelque part',
                    show: true,
                    href: 'test.html'
                }
            });
            expect(html).toContain('test.html');
        });
        
        it('devrait retourner chaîne vide pour type inconnu', () => {
            const html = createEmptyState('typeInconnu');
            expect(html).toBe('');
        });
    });
    
    describe('showEmptyState', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="test-container"></div>';
        });
        
        it('devrait afficher l\'état vide dans le conteneur', () => {
            showEmptyState('test-container', 'noQuestions');
            
            const container = document.getElementById('test-container');
            expect(container.innerHTML).toContain('Aucune question créée');
            expect(container.innerHTML).toContain('empty-state');
        });
        
        it('devrait accepter des options personnalisées', () => {
            showEmptyState('test-container', 'noQuestions', {
                title: 'Custom Title'
            });
            
            const container = document.getElementById('test-container');
            expect(container.innerHTML).toContain('Custom Title');
        });
        
        it('devrait gérer un conteneur inexistant', () => {
            // Ne devrait pas throw
            expect(() => {
                showEmptyState('non-existent', 'noQuestions');
            }).not.toThrow();
        });
        
        it('devrait appliquer une animation fade-in', (done) => {
            showEmptyState('test-container', 'noQuestions');
            
            const container = document.getElementById('test-container');
            const emptyState = container.querySelector('.empty-state');
            
            // Vérifier que l'élément existe
            expect(emptyState).toBeTruthy();
            
            // Vérifier l'animation après 50ms
            setTimeout(() => {
                expect(emptyState.style.transition).toContain('all');
                done();
            }, 50);
        });
    });
    
    describe('createErrorState', () => {
        it('devrait créer un état d\'erreur avec message', () => {
            const html = createErrorState('Erreur de connexion');
            expect(html).toContain('Erreur de connexion');
            expect(html).toContain('Une erreur est survenue');
        });
        
        it('devrait afficher bouton réessayer si callback fourni', () => {
            const callback = vi.fn();
            const html = createErrorState('Erreur', callback);
            expect(html).toContain('Réessayer');
        });
        
        it('ne devrait pas afficher bouton réessayer si pas de callback', () => {
            const html = createErrorState('Erreur');
            expect(html).not.toContain('Réessayer');
        });
        
        it('devrait générer un ID unique pour le bouton', () => {
            const html1 = createErrorState('Erreur 1', vi.fn());
            const html2 = createErrorState('Erreur 2', vi.fn());
            
            const id1Match = html1.match(/id="(retry-btn-[^"]+)"/);
            const id2Match = html2.match(/id="(retry-btn-[^"]+)"/);
            
            expect(id1Match[1]).not.toBe(id2Match[1]);
        });
    });
    
    describe('showErrorState', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="test-container"></div>';
        });
        
        it('devrait afficher l\'état d\'erreur', () => {
            showErrorState('test-container', 'Erreur critique');
            
            const container = document.getElementById('test-container');
            expect(container.innerHTML).toContain('Erreur critique');
        });
        
        it('devrait attacher le callback au bouton', (done) => {
            const callback = vi.fn();
            showErrorState('test-container', 'Erreur', callback);
            
            setTimeout(() => {
                const container = document.getElementById('test-container');
                const button = container.querySelector('button');
                
                expect(button).toBeTruthy();
                
                // Simuler un clic
                button.click();
                
                setTimeout(() => {
                    expect(callback).toHaveBeenCalledTimes(1);
                    done();
                }, 50);
            }, 50);
        });
        
        it('devrait gérer un conteneur inexistant', () => {
            expect(() => {
                showErrorState('non-existent', 'Erreur');
            }).not.toThrow();
        });
    });
});
