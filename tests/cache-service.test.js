/**
 * Tests pour cache-service.js
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    buildCacheKey,
    getCachedValue,
    setCachedValue,
    invalidateCache,
    clearCache,
    getCacheSize,
    invalidateByDataType,
    invalidateByEvent,
    getCacheStats,
    cleanExpiredEntries
} from '../js/services/cache-service.js';

describe('cache-service', () => {
    beforeEach(() => {
        // Nettoyer le cache avant chaque test
        clearCache();
    });
    
    describe('buildCacheKey', () => {
        it('devrait construire une clé à partir de parties', () => {
            const key = buildCacheKey(['users', '123']);
            expect(key).toBe('users::123');
        });
        
        it('devrait filtrer les valeurs falsy', () => {
            const key = buildCacheKey(['users', null, '123', undefined, '']);
            expect(key).toBe('users::123');
        });
        
        it('devrait retourner une chaîne vide pour un tableau vide', () => {
            const key = buildCacheKey([]);
            expect(key).toBe('');
        });
    });
    
    describe('getCachedValue', () => {
        it('devrait retourner null pour une clé inexistante', () => {
            const value = getCachedValue('nonexistent');
            expect(value).toBeNull();
        });
        
        it('devrait retourner la valeur mise en cache', () => {
            setCachedValue('test-key', { data: 'test' });
            const value = getCachedValue('test-key');
            expect(value).toEqual({ data: 'test' });
        });
        
        it('devrait retourner null pour une entrée expirée', () => {
            setCachedValue('expired-key', 'value', 100); // 100ms TTL
            // Attendre que l'entrée expire
            return new Promise((resolve) => {
                setTimeout(() => {
                    const value = getCachedValue('expired-key');
                    expect(value).toBeNull();
                    resolve();
                }, 150);
            });
        });
    });
    
    describe('setCachedValue', () => {
        it('devrait mettre une valeur en cache', () => {
            setCachedValue('test-key', 'test-value');
            expect(getCachedValue('test-key')).toBe('test-value');
        });
        
        it('devrait utiliser le TTL par défaut si non spécifié', () => {
            setCachedValue('test-key', 'value');
            const value = getCachedValue('test-key');
            expect(value).toBe('value');
        });
        
        it('devrait utiliser le TTL configuré pour un type de données', () => {
            setCachedValue('users-key', 'value', 'users');
            const value = getCachedValue('users-key');
            expect(value).toBe('value');
        });
        
        it('devrait écraser une valeur existante', () => {
            setCachedValue('test-key', 'old-value');
            setCachedValue('test-key', 'new-value');
            expect(getCachedValue('test-key')).toBe('new-value');
        });
    });
    
    describe('invalidateCache', () => {
        it('devrait supprimer les entrées avec le préfixe donné', () => {
            setCachedValue('users::123', 'value1');
            setCachedValue('users::456', 'value2');
            setCachedValue('questions::123', 'value3');
            
            invalidateCache('users');
            
            expect(getCachedValue('users::123')).toBeNull();
            expect(getCachedValue('users::456')).toBeNull();
            expect(getCachedValue('questions::123')).toBe('value3');
        });
        
        it('ne devrait rien supprimer si le préfixe ne correspond pas', () => {
            setCachedValue('users::123', 'value');
            invalidateCache('nonexistent');
            expect(getCachedValue('users::123')).toBe('value');
        });
    });
    
    describe('clearCache', () => {
        it('devrait supprimer toutes les entrées', () => {
            setCachedValue('key1', 'value1');
            setCachedValue('key2', 'value2');
            
            clearCache();
            
            expect(getCachedValue('key1')).toBeNull();
            expect(getCachedValue('key2')).toBeNull();
        });
    });
    
    describe('getCacheSize', () => {
        it('devrait retourner 0 pour un cache vide', () => {
            expect(getCacheSize()).toBe(0);
        });
        
        it('devrait retourner le nombre d\'entrées', () => {
            setCachedValue('key1', 'value1');
            setCachedValue('key2', 'value2');
            expect(getCacheSize()).toBe(2);
        });
    });
    
    describe('invalidateByDataType', () => {
        it('devrait invalider les entrées d\'un type de données spécifique', () => {
            setCachedValue('key1', 'value1', 'users');
            setCachedValue('key2', 'value2', 'questions');
            setCachedValue('key3', 'value3', 'users');
            
            invalidateByDataType('users');
            
            expect(getCachedValue('key1')).toBeNull();
            expect(getCachedValue('key2')).toBe('value2');
            expect(getCachedValue('key3')).toBeNull();
        });
    });
    
    describe('invalidateByEvent', () => {
        it('devrait invalider les types appropriés pour quizCompleted', () => {
            setCachedValue('quizResults::123', 'value1', 'quizResults');
            setCachedValue('monthlyProgress::123', 'value2', 'monthlyProgress');
            setCachedValue('users::123', 'value3', 'users');
            
            invalidateByEvent('quizCompleted');
            
            expect(getCachedValue('quizResults::123')).toBeNull();
            expect(getCachedValue('monthlyProgress::123')).toBeNull();
            expect(getCachedValue('users::123')).toBe('value3');
        });
        
        it('devrait invalider les types appropriés pour userUpdated', () => {
            setCachedValue('users::123', 'value1', 'users');
            setCachedValue('stats::123', 'value2', 'stats');
            setCachedValue('questions::123', 'value3', 'questions');
            
            invalidateByEvent('userUpdated');
            
            expect(getCachedValue('users::123')).toBeNull();
            expect(getCachedValue('stats::123')).toBeNull(); // ✅ CORRECTION : stats est maintenant invalidé pour userUpdated
            expect(getCachedValue('questions::123')).toBe('value3');
        });
    });
    
    describe('getCacheStats', () => {
        it('devrait retourner des statistiques du cache', () => {
            setCachedValue('key1', 'value1', 'users');
            setCachedValue('key2', 'value2', 'questions');
            
            const stats = getCacheStats();
            
            expect(stats).toHaveProperty('total');
            expect(stats).toHaveProperty('byDataType');
            expect(stats.total).toBeGreaterThanOrEqual(2);
        });
    });
    
    describe('cleanExpiredEntries', () => {
        it('devrait supprimer les entrées expirées', () => {
            setCachedValue('expired', 'value', 10); // 10ms TTL
            setCachedValue('valid', 'value', 10000); // 10s TTL
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const cleaned = cleanExpiredEntries();
                    expect(cleaned).toBeGreaterThanOrEqual(0);
                    expect(getCachedValue('expired')).toBeNull();
                    expect(getCachedValue('valid')).toBe('value');
                    resolve();
                }, 50);
            });
        });
    });
});

