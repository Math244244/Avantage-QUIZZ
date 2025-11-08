/**
 * Tests pour month-utils.js
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect } from 'vitest';
import {
    MONTH_NAMES,
    MONTH_NAMES_LOWERCASE,
    getCurrentMonthIndex,
    getCurrentMonthNumber,
    getCurrentYear,
    normalizeMonthFormat,
    createMonthlyProgressId,
    extractYearFromMonth,
    isValidMonthFormat
} from '../js/month-utils.js';

describe('month-utils', () => {
    describe('MONTH_NAMES', () => {
        it('devrait contenir 12 mois', () => {
            expect(MONTH_NAMES).toHaveLength(12);
        });
        
        it('devrait commencer par Janvier', () => {
            expect(MONTH_NAMES[0]).toBe('Janvier');
        });
        
        it('devrait se terminer par Décembre', () => {
            expect(MONTH_NAMES[11]).toBe('Décembre');
        });
    });
    
    describe('MONTH_NAMES_LOWERCASE', () => {
        it('devrait contenir 12 mois en minuscules', () => {
            expect(MONTH_NAMES_LOWERCASE).toHaveLength(12);
        });
        
        it('devrait être en minuscules', () => {
            expect(MONTH_NAMES_LOWERCASE[0]).toBe('janvier');
        });
    });
    
    describe('getCurrentMonthIndex', () => {
        it('devrait retourner un nombre entre 0 et 11', () => {
            const index = getCurrentMonthIndex();
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThanOrEqual(11);
        });
    });
    
    describe('getCurrentMonthNumber', () => {
        it('devrait retourner un nombre entre 1 et 12', () => {
            const number = getCurrentMonthNumber();
            expect(number).toBeGreaterThanOrEqual(1);
            expect(number).toBeLessThanOrEqual(12);
        });
        
        it('devrait être getCurrentMonthIndex() + 1', () => {
            const index = getCurrentMonthIndex();
            const number = getCurrentMonthNumber();
            expect(number).toBe(index + 1);
        });
    });
    
    describe('getCurrentYear', () => {
        it('devrait retourner l\'année actuelle', () => {
            const year = getCurrentYear();
            const currentYear = new Date().getFullYear();
            expect(year).toBe(currentYear);
        });
    });
    
    describe('normalizeMonthFormat', () => {
        it('devrait normaliser un numéro de mois (1-12)', () => {
            const result = normalizeMonthFormat(1, 2025);
            expect(result).toBe('Janvier 2025');
        });
        
        it('devrait normaliser le mois 12', () => {
            const result = normalizeMonthFormat(12, 2025);
            expect(result).toBe('Décembre 2025');
        });
        
        it('devrait normaliser un mois en minuscules', () => {
            const result = normalizeMonthFormat('novembre', 2025);
            expect(result).toBe('Novembre 2025');
        });
        
        it('devrait normaliser un mois avec première lettre majuscule', () => {
            const result = normalizeMonthFormat('Novembre', 2025);
            expect(result).toBe('Novembre 2025');
        });
        
        it('devrait normaliser un format "mois année"', () => {
            const result = normalizeMonthFormat('novembre 2025');
            expect(result).toBe('Novembre 2025');
        });
        
        it('devrait utiliser l\'année actuelle par défaut', () => {
            const currentYear = getCurrentYear();
            const result = normalizeMonthFormat(1);
            expect(result).toContain(currentYear.toString());
        });
        
        it('devrait lancer une erreur pour un numéro invalide (< 1)', () => {
            expect(() => normalizeMonthFormat(0, 2025)).toThrow();
        });
        
        it('devrait lancer une erreur pour un numéro invalide (> 12)', () => {
            expect(() => normalizeMonthFormat(13, 2025)).toThrow();
        });
        
        it('devrait lancer une erreur pour un format invalide', () => {
            expect(() => normalizeMonthFormat('invalid', 2025)).toThrow();
        });
        
        it('devrait lancer une erreur pour un type invalide', () => {
            expect(() => normalizeMonthFormat(null, 2025)).toThrow();
        });
    });
    
    describe('createMonthlyProgressId', () => {
        it('devrait créer un ID avec userId et mois normalisé', () => {
            const id = createMonthlyProgressId('user123', 11, 2025);
            expect(id).toBe('user123_Novembre_2025');
        });
        
        it('devrait remplacer les espaces par des underscores', () => {
            const id = createMonthlyProgressId('user123', 'Novembre 2025');
            expect(id).not.toContain(' ');
            expect(id).toContain('_');
        });
        
        it('devrait utiliser l\'année actuelle par défaut', () => {
            const currentYear = getCurrentYear();
            const id = createMonthlyProgressId('user123', 1);
            expect(id).toContain(currentYear.toString());
        });
    });
    
    describe('extractYearFromMonth', () => {
        it('devrait extraire l\'année d\'un mois normalisé', () => {
            const year = extractYearFromMonth('Novembre 2025');
            expect(year).toBe(2025);
        });
        
        it('devrait retourner l\'année actuelle si pas d\'année', () => {
            const currentYear = getCurrentYear();
            const year = extractYearFromMonth('Novembre');
            expect(year).toBe(currentYear);
        });
        
        it('devrait gérer les années futures', () => {
            const year = extractYearFromMonth('Janvier 2030');
            expect(year).toBe(2030);
        });
    });
    
    describe('isValidMonthFormat', () => {
        it('devrait retourner true pour un format valide (numéro)', () => {
            expect(isValidMonthFormat(1)).toBe(true);
        });
        
        it('devrait retourner true pour un format valide (texte)', () => {
            expect(isValidMonthFormat('novembre')).toBe(true);
        });
        
        it('devrait retourner false pour un format invalide', () => {
            expect(isValidMonthFormat('invalid')).toBe(false);
        });
        
        it('devrait retourner false pour null', () => {
            expect(isValidMonthFormat(null)).toBe(false);
        });
    });
});

