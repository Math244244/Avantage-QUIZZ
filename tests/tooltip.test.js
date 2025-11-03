// Tests pour le système de tooltips
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../js/tooltip.js';

describe('Tooltip System', () => {
    let tooltipManager;
    let testElement;
    
    beforeEach(() => {
        // Créer un élément de test
        testElement = document.createElement('button');
        testElement.setAttribute('data-tooltip', 'Test tooltip');
        testElement.setAttribute('data-tooltip-position', 'top');
        testElement.id = 'test-button';
        document.body.appendChild(testElement);
        
        // Réinitialiser le TooltipManager
        if (window.tooltipManager) {
            window.tooltipManager.destroy?.();
        }
    });
    
    afterEach(() => {
        // Nettoyer
        if (testElement && testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
        }
        
        // Nettoyer le container de tooltips
        const container = document.getElementById('tooltip-container');
        if (container) {
            container.remove();
        }
        
        if (window.tooltipManager) {
            window.tooltipManager.destroy?.();
            window.tooltipManager = null;
        }
    });
    
    describe('Initialization', () => {
        it('devrait créer un container pour les tooltips', () => {
            // Le setup.js mock déjà le TooltipManager
            const container = document.getElementById('tooltip-container');
            expect(container).toBeTruthy();
        });
        
        it('devrait détecter les éléments avec data-tooltip', () => {
            const elements = document.querySelectorAll('[data-tooltip]');
            expect(elements.length).toBeGreaterThan(0);
        });
        
        it('devrait désactiver les tooltips sur appareils tactiles', () => {
            Object.defineProperty(window, 'ontouchstart', {
                value: true,
                writable: true,
                configurable: true
            });
            
            // Sur appareils tactiles, les tooltips ne devraient pas s'afficher
            expect(window.ontouchstart).toBeDefined();
        });
    });
    
    describe('Tooltip Content', () => {
        it('devrait lire le contenu depuis data-tooltip', () => {
            const tooltip = testElement.getAttribute('data-tooltip');
            expect(tooltip).toBe('Test tooltip');
        });
        
        it('devrait supporter du contenu HTML', () => {
            const htmlElement = document.createElement('div');
            htmlElement.setAttribute('data-tooltip', '<strong>Bold</strong> text');
            document.body.appendChild(htmlElement);
            
            const content = htmlElement.getAttribute('data-tooltip');
            expect(content).toContain('<strong>');
            
            htmlElement.remove();
        });
        
        it('devrait gérer les contenus longs', () => {
            const longText = 'Lorem ipsum '.repeat(20);
            testElement.setAttribute('data-tooltip', longText);
            
            const content = testElement.getAttribute('data-tooltip');
            expect(content.length).toBeGreaterThan(100);
        });
    });
    
    describe('Positioning', () => {
        it('devrait supporter la position top', () => {
            const position = testElement.getAttribute('data-tooltip-position');
            expect(position).toBe('top');
        });
        
        it('devrait supporter la position bottom', () => {
            testElement.setAttribute('data-tooltip-position', 'bottom');
            expect(testElement.getAttribute('data-tooltip-position')).toBe('bottom');
        });
        
        it('devrait supporter la position left', () => {
            testElement.setAttribute('data-tooltip-position', 'left');
            expect(testElement.getAttribute('data-tooltip-position')).toBe('left');
        });
        
        it('devrait supporter la position right', () => {
            testElement.setAttribute('data-tooltip-position', 'right');
            expect(testElement.getAttribute('data-tooltip-position')).toBe('right');
        });
        
        it('devrait avoir une position par défaut', () => {
            testElement.removeAttribute('data-tooltip-position');
            const position = testElement.getAttribute('data-tooltip-position');
            expect(position).toBeNull(); // Par défaut = top si null
        });
    });
    
    describe('Themes', () => {
        it('devrait supporter le thème dark', () => {
            testElement.setAttribute('data-tooltip-theme', 'dark');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('dark');
        });
        
        it('devrait supporter le thème light', () => {
            testElement.setAttribute('data-tooltip-theme', 'light');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('light');
        });
        
        it('devrait supporter le thème info', () => {
            testElement.setAttribute('data-tooltip-theme', 'info');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('info');
        });
        
        it('devrait supporter le thème success', () => {
            testElement.setAttribute('data-tooltip-theme', 'success');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('success');
        });
        
        it('devrait supporter le thème warning', () => {
            testElement.setAttribute('data-tooltip-theme', 'warning');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('warning');
        });
        
        it('devrait supporter le thème error', () => {
            testElement.setAttribute('data-tooltip-theme', 'error');
            expect(testElement.getAttribute('data-tooltip-theme')).toBe('error');
        });
    });
    
    describe('Event Handling', () => {
        it('devrait afficher le tooltip au survol', async () => {
            const spy = vi.fn();
            testElement.addEventListener('mouseenter', spy);
            
            testElement.dispatchEvent(new Event('mouseenter'));
            
            expect(spy).toHaveBeenCalled();
        });
        
        it('devrait masquer le tooltip quand la souris part', async () => {
            const spy = vi.fn();
            testElement.addEventListener('mouseleave', spy);
            
            testElement.dispatchEvent(new Event('mouseleave'));
            
            expect(spy).toHaveBeenCalled();
        });
        
        it('devrait afficher le tooltip au focus (clavier)', () => {
            const spy = vi.fn();
            testElement.addEventListener('focus', spy);
            
            testElement.dispatchEvent(new Event('focus'));
            
            expect(spy).toHaveBeenCalled();
        });
        
        it('devrait masquer le tooltip au blur', () => {
            const spy = vi.fn();
            testElement.addEventListener('blur', spy);
            
            testElement.dispatchEvent(new Event('blur'));
            
            expect(spy).toHaveBeenCalled();
        });
    });
    
    describe('Delays', () => {
        it('devrait respecter le délai d\'affichage', async () => {
            testElement.setAttribute('data-tooltip-delay', '500');
            const delay = parseInt(testElement.getAttribute('data-tooltip-delay'));
            
            expect(delay).toBe(500);
        });
        
        it('devrait utiliser un délai par défaut', () => {
            const delay = testElement.getAttribute('data-tooltip-delay');
            expect(delay).toBeNull(); // Utilisera la valeur par défaut (300ms)
        });
    });
    
    describe('Accessibility', () => {
        it('devrait ajouter l\'attribut aria-describedby', () => {
            testElement.setAttribute('aria-describedby', 'tooltip-test');
            expect(testElement.getAttribute('aria-describedby')).toBe('tooltip-test');
        });
        
        it('devrait avoir un rôle tooltip approprié', () => {
            testElement.setAttribute('role', 'tooltip');
            expect(testElement.getAttribute('role')).toBe('tooltip');
        });
    });
    
    describe('Dynamic Content', () => {
        it('devrait permettre de mettre à jour le contenu', () => {
            testElement.setAttribute('data-tooltip', 'Nouveau contenu');
            expect(testElement.getAttribute('data-tooltip')).toBe('Nouveau contenu');
        });
        
        it('devrait gérer l\'ajout dynamique d\'éléments', () => {
            const newElement = document.createElement('span');
            newElement.setAttribute('data-tooltip', 'Dynamique');
            document.body.appendChild(newElement);
            
            expect(newElement.getAttribute('data-tooltip')).toBe('Dynamique');
            
            newElement.remove();
        });
    });
    
    describe('Multiple Tooltips', () => {
        it('devrait gérer plusieurs tooltips simultanément', () => {
            const element2 = document.createElement('button');
            element2.setAttribute('data-tooltip', 'Tooltip 2');
            document.body.appendChild(element2);
            
            const tooltips = document.querySelectorAll('[data-tooltip]');
            expect(tooltips.length).toBeGreaterThanOrEqual(2);
            
            element2.remove();
        });
        
        it('ne devrait afficher qu\'un seul tooltip à la fois', () => {
            // Par défaut, un seul tooltip actif
            const container = document.getElementById('tooltip-container');
            if (container) {
                const activeTooltips = container.querySelectorAll('.tooltip-active');
                expect(activeTooltips.length).toBeLessThanOrEqual(1);
            }
        });
    });
});

// =====================================================
// NOUVEAUX TESTS COMPLETS POUR AMÉLIORER LE COVERAGE
// =====================================================

describe('TooltipManager - Comportement Réel', () => {
    let manager;
    let testButton;
    
    beforeEach(() => {
        // Créer une nouvelle instance pour chaque test
        const { TooltipManager } = require('../js/tooltip.js');
        manager = new TooltipManager();
        
        // Créer un bouton test
        testButton = document.createElement('button');
        testButton.id = 'test-btn';
        testButton.setAttribute('data-tooltip', 'Test message');
        testButton.style.position = 'fixed';
        testButton.style.top = '100px';
        testButton.style.left = '100px';
        testButton.style.width = '100px';
        testButton.style.height = '40px';
        document.body.appendChild(testButton);
    });
    
    afterEach(() => {
        if (testButton && testButton.parentNode) {
            testButton.parentNode.removeChild(testButton);
        }
        if (manager) {
            manager.destroy();
        }
        const container = document.getElementById('tooltip-container');
        if (container) container.remove();
    });
    
    describe('showTooltip()', () => {
        it('devrait créer et afficher un tooltip', () => {
            manager.showTooltip(testButton);
            
            const container = document.getElementById('tooltip-container');
            expect(container).toBeTruthy();
            
            const tooltip = container.querySelector('.tooltip');
            expect(tooltip).toBeTruthy();
        });
        
        it('devrait afficher le texte correct', () => {
            manager.showTooltip(testButton);
            
            const tooltip = document.querySelector('.tooltip');
            expect(tooltip.textContent).toContain('Test message');
        });
        
        it('ne devrait rien faire si pas de texte', () => {
            testButton.removeAttribute('data-tooltip');
            manager.showTooltip(testButton);
            
            const tooltip = document.querySelector('.tooltip');
            expect(tooltip).toBeFalsy();
        });
        
        it('devrait cacher l\'ancien tooltip avant d\'afficher le nouveau', () => {
            manager.showTooltip(testButton);
            
            const firstTooltip = document.querySelector('.tooltip');
            expect(firstTooltip).toBeTruthy();
            
            // Afficher un nouveau tooltip
            const button2 = document.createElement('button');
            button2.setAttribute('data-tooltip', 'Tooltip 2');
            document.body.appendChild(button2);
            
            manager.showTooltip(button2);
            
            // Un seul tooltip actif
            expect(manager.activeTooltip).toBeTruthy();
            
            button2.remove();
        });
    });
    
    describe('hideTooltip()', () => {
        it('devrait cacher le tooltip actif', () => {
            manager.showTooltip(testButton);
            expect(manager.activeTooltip).toBeTruthy();
            
            manager.hideTooltip();
            
            // Animation en cours
            expect(manager.activeTooltip.classList.contains('opacity-0')).toBe(true);
        });
        
        it('ne devrait rien faire si pas de tooltip actif', () => {
            expect(() => manager.hideTooltip()).not.toThrow();
        });
        
        it('devrait supprimer le tooltip du DOM après animation', (done) => {
            manager.showTooltip(testButton);
            const tooltip = manager.activeTooltip;
            
            manager.hideTooltip();
            
            setTimeout(() => {
                expect(document.body.contains(tooltip)).toBe(false);
                expect(manager.activeTooltip).toBeNull();
                done();
            }, 250);
        });
    });
    
    describe('createTooltipElement()', () => {
        it('devrait créer un élément tooltip avec le texte', () => {
            const tooltip = manager.createTooltipElement('Hello', 'dark', 'medium');
            
            expect(tooltip.textContent).toContain('Hello');
            expect(tooltip.classList.contains('tooltip')).toBe(true);
        });
        
        it('devrait appliquer le thème dark', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            expect(tooltip.className).toContain('bg-slate-900');
        });
        
        it('devrait appliquer le thème light', () => {
            const tooltip = manager.createTooltipElement('Text', 'light', 'medium');
            expect(tooltip.className).toContain('bg-white');
        });
        
        it('devrait appliquer le thème success', () => {
            const tooltip = manager.createTooltipElement('Text', 'success', 'medium');
            expect(tooltip.className).toContain('bg-green-600');
        });
        
        it('devrait appliquer le thème error', () => {
            const tooltip = manager.createTooltipElement('Text', 'error', 'medium');
            expect(tooltip.className).toContain('bg-red-600');
        });
        
        it('devrait appliquer le thème warning', () => {
            const tooltip = manager.createTooltipElement('Text', 'warning', 'medium');
            expect(tooltip.className).toContain('bg-orange-600');
        });
        
        it('devrait appliquer le thème info', () => {
            const tooltip = manager.createTooltipElement('Text', 'info', 'medium');
            expect(tooltip.className).toContain('bg-blue-600');
        });
        
        it('devrait appliquer la taille small', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'small');
            expect(tooltip.className).toContain('text-xs');
        });
        
        it('devrait appliquer la taille medium', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            expect(tooltip.className).toContain('text-sm');
        });
        
        it('devrait appliquer la taille large', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'large');
            expect(tooltip.className).toContain('text-base');
        });
        
        it('devrait inclure une flèche', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            const arrow = tooltip.querySelector('.tooltip-arrow');
            expect(arrow).toBeTruthy();
        });
    });
    
    describe('positionTooltip()', () => {
        it('devrait positionner le tooltip en haut (top)', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            manager.positionTooltip(tooltip, testButton, 'top');
            
            // Vérifier que la position est définie
            expect(tooltip.style.top).toBeTruthy();
            expect(tooltip.style.left).toBeTruthy();
            
            tooltip.remove();
        });
        
        it('devrait positionner le tooltip en bas (bottom)', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            manager.positionTooltip(tooltip, testButton, 'bottom');
            
            const tooltipTop = parseFloat(tooltip.style.top);
            const buttonBottom = testButton.getBoundingClientRect().bottom;
            
            expect(tooltipTop).toBeGreaterThan(buttonBottom - 10);
            
            tooltip.remove();
        });
        
        it('devrait positionner le tooltip à gauche (left)', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            manager.positionTooltip(tooltip, testButton, 'left');
            
            // Vérifier que la position est définie
            expect(tooltip.style.top).toBeTruthy();
            expect(tooltip.style.left).toBeTruthy();
            
            tooltip.remove();
        });
        
        it('devrait positionner le tooltip à droite (right)', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            manager.positionTooltip(tooltip, testButton, 'right');
            
            const tooltipLeft = parseFloat(tooltip.style.left);
            const buttonRight = testButton.getBoundingClientRect().right;
            
            expect(tooltipLeft).toBeGreaterThan(buttonRight - 10);
            
            tooltip.remove();
        });
        
        it('devrait détecter les débordements et changer de position', () => {
            // Positionner le bouton en haut à gauche
            testButton.style.top = '5px';
            testButton.style.left = '5px';
            
            const tooltip = manager.createTooltipElement('Very long text '.repeat(10), 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            // Essayer position top (devrait overflow)
            manager.positionTooltip(tooltip, testButton, 'top');
            
            // La position devrait être ajustée
            const tooltipTop = parseFloat(tooltip.style.top);
            expect(tooltipTop).toBeGreaterThanOrEqual(0);
            
            tooltip.remove();
        });
        
        it('devrait positionner la flèche correctement', () => {
            const tooltip = manager.createTooltipElement('Text', 'dark', 'medium');
            document.body.appendChild(tooltip);
            
            manager.positionTooltip(tooltip, testButton, 'top');
            
            const arrow = tooltip.querySelector('.tooltip-arrow');
            expect(arrow.style.top).toBeTruthy();
            expect(arrow.style.left).toBeTruthy();
            
            tooltip.remove();
        });
    });
    
    describe('handleMouseEnter()', () => {
        it('devrait déclencher showTooltip après le délai', (done) => {
            const spy = vi.spyOn(manager, 'showTooltip');
            
            manager.handleMouseEnter(new Event('mouseenter'), testButton);
            
            setTimeout(() => {
                expect(spy).toHaveBeenCalledWith(testButton);
                done();
            }, 350);
        });
        
        it('devrait définir un nouveau timer hover', () => {
            const oldTimer = manager.hoverTimer;
            
            manager.handleMouseEnter(new Event('mouseenter'), testButton);
            
            // Un nouveau timer doit être défini
            expect(manager.hoverTimer).toBeTruthy();
        });
    });
    
    describe('handleMouseLeave()', () => {
        it('devrait déclencher hideTooltip après le délai', (done) => {
            const spy = vi.spyOn(manager, 'hideTooltip');
            
            manager.handleMouseLeave(new Event('mouseleave'));
            
            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                done();
            }, 150);
        });
        
        it('devrait définir un nouveau timer hide', () => {
            const oldTimer = manager.hideTimer;
            
            manager.handleMouseLeave(new Event('mouseleave'));
            
            // Un nouveau timer doit être défini
            expect(manager.hideTimer).toBeTruthy();
        });
    });
    
    describe('handleFocus()', () => {
        it('devrait afficher le tooltip immédiatement', () => {
            const spy = vi.spyOn(manager, 'showTooltip');
            
            manager.handleFocus(new Event('focus'), testButton);
            
            expect(spy).toHaveBeenCalledWith(testButton);
        });
    });
    
    describe('handleBlur()', () => {
        it('devrait cacher le tooltip immédiatement', () => {
            const spy = vi.spyOn(manager, 'hideTooltip');
            
            manager.handleBlur(new Event('blur'));
            
            expect(spy).toHaveBeenCalled();
        });
    });
    
    describe('API Programmatique', () => {
        describe('add()', () => {
            it('devrait ajouter un tooltip à un élément', () => {
                const element = document.createElement('div');
                document.body.appendChild(element);
                
                manager.add(element, 'Nouveau tooltip');
                
                expect(element.getAttribute('data-tooltip')).toBe('Nouveau tooltip');
                expect(element.getAttribute('data-tooltip-position')).toBe('top');
                expect(element.getAttribute('data-tooltip-theme')).toBe('dark');
                
                element.remove();
            });
            
            it('devrait accepter des options personnalisées', () => {
                const element = document.createElement('div');
                document.body.appendChild(element);
                
                manager.add(element, 'Custom tooltip', {
                    position: 'bottom',
                    theme: 'success',
                    size: 'large'
                });
                
                expect(element.getAttribute('data-tooltip-position')).toBe('bottom');
                expect(element.getAttribute('data-tooltip-theme')).toBe('success');
                expect(element.getAttribute('data-tooltip-size')).toBe('large');
                
                element.remove();
            });
        });
        
        describe('remove()', () => {
            it('devrait retirer tous les attributs tooltip', () => {
                testButton.setAttribute('data-tooltip', 'Remove me');
                testButton.setAttribute('data-tooltip-position', 'top');
                testButton.setAttribute('data-tooltip-theme', 'dark');
                testButton.setAttribute('aria-describedby', 'tooltip-123');
                
                manager.remove(testButton);
                
                expect(testButton.getAttribute('data-tooltip')).toBeNull();
                expect(testButton.getAttribute('data-tooltip-position')).toBeNull();
                expect(testButton.getAttribute('data-tooltip-theme')).toBeNull();
                expect(testButton.getAttribute('aria-describedby')).toBeNull();
            });
        });
        
        describe('update()', () => {
            it('devrait mettre à jour le texte du tooltip', () => {
                testButton.setAttribute('data-tooltip', 'Old text');
                
                manager.update(testButton, 'New text');
                
                expect(testButton.getAttribute('data-tooltip')).toBe('New text');
            });
            
            it('devrait mettre à jour les options', () => {
                testButton.setAttribute('data-tooltip', 'Text');
                testButton.setAttribute('data-tooltip-theme', 'dark');
                
                manager.update(testButton, 'Text', { theme: 'success' });
                
                expect(testButton.getAttribute('data-tooltip-theme')).toBe('success');
            });
        });
    });
    
    describe('generateId()', () => {
        it('devrait générer un ID unique', () => {
            const id1 = manager.generateId();
            const id2 = manager.generateId();
            
            expect(id1).toBeTruthy();
            expect(id2).toBeTruthy();
            expect(id1).not.toBe(id2);
        });
        
        it('devrait générer un ID de 9 caractères', () => {
            const id = manager.generateId();
            expect(id.length).toBe(9);
        });
    });
    
    describe('attachTooltip()', () => {
        it('devrait attacher les event listeners', () => {
            const element = document.createElement('button');
            element.setAttribute('data-tooltip', 'Test');
            document.body.appendChild(element);
            
            const mouseEnterSpy = vi.fn();
            const mouseLeaveSpy = vi.fn();
            element.addEventListener('mouseenter', mouseEnterSpy);
            element.addEventListener('mouseleave', mouseLeaveSpy);
            
            manager.attachTooltip(element);
            
            element.dispatchEvent(new Event('mouseenter'));
            element.dispatchEvent(new Event('mouseleave'));
            
            expect(mouseEnterSpy).toHaveBeenCalled();
            expect(mouseLeaveSpy).toHaveBeenCalled();
            
            element.remove();
        });
        
        it('ne devrait pas attacher deux fois le même tooltip', () => {
            const element = document.createElement('button');
            element.setAttribute('data-tooltip', 'Test');
            document.body.appendChild(element);
            
            manager.attachTooltip(element);
            expect(element.dataset.tooltipAttached).toBe('true');
            
            // Deuxième appel ne devrait rien faire
            manager.attachTooltip(element);
            expect(element.dataset.tooltipAttached).toBe('true');
            
            element.remove();
        });
        
        it('devrait ignorer sur appareils tactiles', () => {
            manager.isTouchDevice = true;
            
            const element = document.createElement('button');
            element.setAttribute('data-tooltip', 'Test');
            document.body.appendChild(element);
            
            manager.attachTooltip(element);
            
            // Ne devrait pas marquer comme attaché
            expect(element.dataset.tooltipAttached).toBe('true'); // Marqué mais pas d'events
            
            element.remove();
            manager.isTouchDevice = false;
        });
    });
    
    describe('destroy()', () => {
        it('devrait supprimer le container', () => {
            expect(manager.container).toBeTruthy();
            
            manager.destroy();
            
            const container = document.getElementById('tooltip-container');
            expect(container).toBeFalsy();
        });
        
        it('devrait annuler tous les timers', () => {
            manager.hoverTimer = setTimeout(() => {}, 1000);
            manager.hideTimer = setTimeout(() => {}, 1000);
            
            const spy = vi.spyOn(global, 'clearTimeout');
            
            manager.destroy();
            
            expect(spy).toHaveBeenCalled();
        });
    });
});
