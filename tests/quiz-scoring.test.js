/**
 * Tests unitaires pour les fonctions critiques de scoring et déblocage mensuel
 * 
 * ✅ P0 CRITIQUE: Tests pour calculateScore() et unlockMonthlyQuiz()
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { calculateScore, isMonthlyQuizUnlocked, getMonthlyQuizStatus } from '../js/utils/quiz-scoring.js';

describe('calculateScore', () => {
    it('devrait retourner 100% pour toutes les bonnes réponses', () => {
        const userAnswers = [
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: true }
        ];
        expect(calculateScore(userAnswers)).toBe(100);
    });
    
    it('devrait retourner 0% pour aucune bonne réponse', () => {
        const userAnswers = [
            { isCorrect: false },
            { isCorrect: false },
            { isCorrect: false },
            { isCorrect: false }
        ];
        expect(calculateScore(userAnswers)).toBe(0);
    });
    
    it('devrait retourner 50% pour la moitié des bonnes réponses', () => {
        const userAnswers = [
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: false },
            { isCorrect: false }
        ];
        expect(calculateScore(userAnswers)).toBe(50);
    });
    
    it('devrait arrondir correctement (33% pour 1/3)', () => {
        const userAnswers = [
            { isCorrect: true },
            { isCorrect: false },
            { isCorrect: false }
        ];
        expect(calculateScore(userAnswers)).toBe(33); // 33.33% arrondi à 33
    });
    
    it('devrait arrondir correctement (67% pour 2/3)', () => {
        const userAnswers = [
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: false }
        ];
        expect(calculateScore(userAnswers)).toBe(67); // 66.66% arrondi à 67
    });
    
    it('devrait gérer le cas edge: 0 questions', () => {
        expect(calculateScore([])).toBe(0);
    });
    
    it('devrait gérer le cas edge: null/undefined', () => {
        expect(calculateScore(null)).toBe(0);
        expect(calculateScore(undefined)).toBe(0);
    });
    
    it('devrait gérer 1 question correcte', () => {
        const userAnswers = [{ isCorrect: true }];
        expect(calculateScore(userAnswers)).toBe(100);
    });
    
    it('devrait gérer 1 question incorrecte', () => {
        const userAnswers = [{ isCorrect: false }];
        expect(calculateScore(userAnswers)).toBe(0);
    });
    
    it('devrait gérer 10 questions avec 7 correctes (70%)', () => {
        const userAnswers = Array(10).fill(null).map((_, i) => ({
            isCorrect: i < 7
        }));
        expect(calculateScore(userAnswers)).toBe(70);
    });
});

describe('isMonthlyQuizUnlocked', () => {
    // Scénario: Nous sommes en novembre (index 10)
    const currentMonthIndex = 10; // Novembre
    
    it('devrait débloquer les mois passés (janvier à octobre)', () => {
        for (let i = 0; i < currentMonthIndex; i++) {
            expect(isMonthlyQuizUnlocked(i, currentMonthIndex)).toBe(true);
        }
    });
    
    it('devrait débloquer le mois actuel (novembre)', () => {
        expect(isMonthlyQuizUnlocked(currentMonthIndex, currentMonthIndex)).toBe(true);
    });
    
    it('ne devrait PAS débloquer les mois futurs (décembre)', () => {
        expect(isMonthlyQuizUnlocked(11, currentMonthIndex)).toBe(false);
    });
    
    it('devrait débloquer janvier (index 0) si on est en janvier', () => {
        expect(isMonthlyQuizUnlocked(0, 0)).toBe(true);
    });
    
    it('ne devrait PAS débloquer février (index 1) si on est en janvier', () => {
        expect(isMonthlyQuizUnlocked(1, 0)).toBe(false);
    });
    
    it('devrait gérer le cas edge: tous les mois débloqués en décembre', () => {
        const decemberIndex = 11;
        for (let i = 0; i <= decemberIndex; i++) {
            expect(isMonthlyQuizUnlocked(i, decemberIndex)).toBe(true);
        }
    });
    
    it('devrait retourner false pour monthIndex invalide (< 0)', () => {
        expect(isMonthlyQuizUnlocked(-1, 5)).toBe(false);
    });
    
    it('devrait retourner false pour monthIndex invalide (> 11)', () => {
        expect(isMonthlyQuizUnlocked(12, 5)).toBe(false);
    });
    
    it('devrait retourner false pour currentMonthIndex invalide (< 0)', () => {
        expect(isMonthlyQuizUnlocked(5, -1)).toBe(false);
    });
    
    it('devrait retourner false pour currentMonthIndex invalide (> 11)', () => {
        expect(isMonthlyQuizUnlocked(5, 12)).toBe(false);
    });
});

describe('getMonthlyQuizStatus', () => {
    const currentMonthIndex = 5; // Juin
    
    it('devrait retourner "completed" pour un mois passé avec score', () => {
        expect(getMonthlyQuizStatus(3, currentMonthIndex, 85)).toBe('completed');
    });
    
    it('devrait retourner "incomplete" pour un mois passé sans score', () => {
        expect(getMonthlyQuizStatus(3, currentMonthIndex, null)).toBe('incomplete');
    });
    
    it('devrait retourner "active" pour le mois actuel', () => {
        expect(getMonthlyQuizStatus(currentMonthIndex, currentMonthIndex, null)).toBe('active');
        expect(getMonthlyQuizStatus(currentMonthIndex, currentMonthIndex, 90)).toBe('active');
    });
    
    it('devrait retourner "locked" pour un mois futur', () => {
        expect(getMonthlyQuizStatus(8, currentMonthIndex, null)).toBe('locked');
    });
    
    it('devrait gérer janvier (index 0) comme mois actuel', () => {
        expect(getMonthlyQuizStatus(0, 0, null)).toBe('active');
        expect(getMonthlyQuizStatus(0, 0, 75)).toBe('active');
    });
    
    it('devrait gérer décembre (index 11) comme mois actuel', () => {
        expect(getMonthlyQuizStatus(11, 11, null)).toBe('active');
    });
});

