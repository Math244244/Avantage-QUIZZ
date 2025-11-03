// Tests pour skeleton.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createCardSkeleton,
    createListSkeleton,
    createTableSkeleton,
    createChartSkeleton,
    createGridSkeleton,
    createFormSkeleton,
    createQuestionSkeleton,
    createUserSkeleton,
    createResultSkeleton,
    createResourceSkeleton,
    createStatsSkeleton,
    createFullPageSkeleton,
    showSkeleton,
    hideSkeleton
} from '../js/skeleton.js';

describe('Skeleton Loaders', () => {
    describe('createCardSkeleton', () => {
        it('devrait créer le nombre correct de cartes', () => {
            const html = createCardSkeleton(3);
            const matches = html.match(/skeleton-card/g);
            expect(matches).toHaveLength(3);
        });
        
        it('devrait utiliser le count par défaut (3)', () => {
            const html = createCardSkeleton();
            const matches = html.match(/skeleton-card/g);
            expect(matches).toHaveLength(3);
        });
        
        it('devrait contenir des éléments animate-pulse', () => {
            const html = createCardSkeleton(1);
            expect(html).toContain('animate-pulse');
        });
    });
    
    describe('createListSkeleton', () => {
        it('devrait créer le nombre correct d\'items', () => {
            const html = createListSkeleton(5);
            const matches = html.match(/skeleton-list-item/g);
            expect(matches).toHaveLength(5);
        });
        
        it('devrait utiliser le count par défaut (5)', () => {
            const html = createListSkeleton();
            const matches = html.match(/skeleton-list-item/g);
            expect(matches).toHaveLength(5);
        });
        
        it('devrait contenir des avatars circulaires', () => {
            const html = createListSkeleton(1);
            expect(html).toContain('rounded-full');
        });
    });
    
    describe('createTableSkeleton', () => {
        it('devrait créer une table avec headers', () => {
            const html = createTableSkeleton(3, 4);
            expect(html).toContain('<table');
            expect(html).toContain('<thead');
            expect(html).toContain('<tbody');
        });
        
        it('devrait créer le bon nombre de rows', () => {
            const html = createTableSkeleton(5, 3);
            const tbodyMatches = html.match(/<tbody[\s\S]*<\/tbody>/)[0];
            const rowMatches = tbodyMatches.match(/<tr/g);
            expect(rowMatches).toHaveLength(5);
        });
        
        it('devrait créer le bon nombre de colonnes', () => {
            const html = createTableSkeleton(3, 4);
            const theadMatches = html.match(/<thead[\s\S]*<\/thead>/)[0];
            const colMatches = theadMatches.match(/<th\s/g);
            expect(colMatches).toHaveLength(4);
        });
        
        it('devrait utiliser les valeurs par défaut', () => {
            const html = createTableSkeleton();
            expect(html).toContain('<table');
        });
    });
    
    describe('createChartSkeleton', () => {
        it('devrait créer un skeleton de graphique', () => {
            const html = createChartSkeleton();
            expect(html).toContain('skeleton-chart');
            expect(html).toContain('h-64');
        });
        
        it('devrait contenir des barres', () => {
            const html = createChartSkeleton();
            const barMatches = html.match(/skeleton-bar/g);
            expect(barMatches).toBeTruthy();
            expect(barMatches.length).toBeGreaterThan(5);
        });
    });
    
    describe('createGridSkeleton', () => {
        it('devrait créer une grille avec le bon nombre d\'items', () => {
            const html = createGridSkeleton(6, 3);
            const itemMatches = html.match(/skeleton-grid-item/g);
            expect(itemMatches).toHaveLength(6);
        });
        
        it('devrait utiliser les valeurs par défaut', () => {
            const html = createGridSkeleton();
            expect(html).toContain('grid');
        });
    });
    
    describe('createFormSkeleton', () => {
        it('devrait créer le bon nombre de champs', () => {
            const html = createFormSkeleton(4);
            const fieldMatches = html.match(/skeleton-input/g);
            expect(fieldMatches).toHaveLength(4);
        });
        
        it('devrait utiliser la valeur par défaut (4)', () => {
            const html = createFormSkeleton();
            const fieldMatches = html.match(/skeleton-input/g);
            expect(fieldMatches).toHaveLength(4);
        });
    });
    
    describe('createQuestionSkeleton', () => {
        it('devrait créer le bon nombre de questions', () => {
            const html = createQuestionSkeleton(3);
            const questionMatches = html.match(/skeleton-question/g);
            expect(questionMatches).toHaveLength(3);
        });
        
        it('devrait contenir les éléments de question', () => {
            const html = createQuestionSkeleton(1);
            expect(html).toContain('skeleton-badge');
            expect(html).toContain('skeleton-icon');
        });
    });
    
    describe('createUserSkeleton', () => {
        it('devrait créer le bon nombre d\'utilisateurs', () => {
            const html = createUserSkeleton(10);
            const userMatches = html.match(/skeleton-avatar/g);
            expect(userMatches).toHaveLength(10);
        });
    });
    
    describe('createResultSkeleton', () => {
        it('devrait créer le bon nombre de résultats', () => {
            const html = createResultSkeleton(5);
            const resultMatches = html.match(/bg-white[^>]*rounded-lg/g);
            expect(resultMatches).toHaveLength(5);
        });
    });
    
    describe('createResourceSkeleton', () => {
        it('devrait créer le bon nombre de ressources', () => {
            const html = createResourceSkeleton(6);
            const resourceMatches = html.match(/skeleton-resource/g);
            expect(resourceMatches).toHaveLength(6);
        });
    });
    
    describe('createStatsSkeleton', () => {
        it('devrait créer le bon nombre de stats', () => {
            const html = createStatsSkeleton(4);
            const statMatches = html.match(/skeleton-stats/g);
            expect(statMatches).toHaveLength(4);
        });
    });
    
    describe('createFullPageSkeleton', () => {
        it('devrait créer un skeleton de page complète', () => {
            const html = createFullPageSkeleton();
            expect(html).toContain('min-h-screen');
            expect(html).toContain('Header');
            expect(html).toContain('Content');
        });
    });
    
    describe('showSkeleton', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="test-container"></div>';
        });
        
        it('devrait afficher le skeleton dans le conteneur', () => {
            const html = '<div class="skeleton">Loading...</div>';
            showSkeleton('test-container', html);
            
            const container = document.getElementById('test-container');
            expect(container.innerHTML).toContain('Loading...');
        });
        
        it('devrait gérer un conteneur inexistant', () => {
            expect(() => {
                showSkeleton('non-existent', '<div>Test</div>');
            }).not.toThrow();
        });
    });
    
    describe('hideSkeleton', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="test-container"><div class="skeleton">Loading...</div></div>';
        });
        
        it('devrait remplacer le skeleton par du contenu', () => {
            const html = '<div class="content">Real content</div>';
            hideSkeleton('test-container', html);
            
            // Wait for transition
            setTimeout(() => {
                const container = document.getElementById('test-container');
                expect(container.innerHTML).toContain('Real content');
                expect(container.innerHTML).not.toContain('Loading...');
            }, 350);
        });
        
        it('devrait gérer un conteneur inexistant', () => {
            expect(() => {
                hideSkeleton('non-existent', '<div>Test</div>');
            }).not.toThrow();
        });
    });
});
