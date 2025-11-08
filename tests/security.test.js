/**
 * Tests pour le module Security (escapeHtml)
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../js/security.js';

describe('Security - escapeHtml', () => {
    describe('escapeHtml()', () => {
        it('devrait échapper les caractères HTML de base', () => {
            expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });
        
        it('devrait échapper les chevrons', () => {
            expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
            expect(escapeHtml('</div>')).toBe('&lt;/div&gt;');
        });
        
        it('devrait échapper les guillemets', () => {
            expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
            expect(escapeHtml("'test'")).toBe("&#x27;test&#x27;");
        });
        
        it('devrait échapper les ampersands', () => {
            expect(escapeHtml('A & B')).toBe('A &amp; B');
        });
        
        it('devrait gérer les chaînes vides', () => {
            expect(escapeHtml('')).toBe('');
        });
        
        it('devrait gérer les chaînes normales sans caractères spéciaux', () => {
            expect(escapeHtml('Hello World')).toBe('Hello World');
        });
        
        it('devrait échapper les caractères multiples', () => {
            expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });
        
        it('devrait échapper les caractères dans du texte mixte', () => {
            expect(escapeHtml('Hello <b>World</b>!')).toBe('Hello &lt;b&gt;World&lt;/b&gt;!');
        });
    });
});

