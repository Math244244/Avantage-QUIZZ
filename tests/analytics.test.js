/**
 * Tests pour le module Analytics
 * 
 * ✅ CORRECTION SECTION 10 : Amélioration coverage tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Firebase Analytics
const mockLogEvent = vi.fn();
const mockSetUserId = vi.fn();
const mockSetUserProperties = vi.fn();
const mockGetAnalytics = vi.fn(() => ({
    logEvent: mockLogEvent,
    setUserId: mockSetUserId,
    setUserProperties: mockSetUserProperties
}));

vi.mock('https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js', () => ({
    getAnalytics: mockGetAnalytics,
    logEvent: mockLogEvent,
    setUserId: mockSetUserId,
    setUserProperties: mockSetUserProperties
}));

vi.mock('../js/firebase-config.js', () => ({
    app: {},
    auth: {
        onAuthStateChanged: vi.fn((callback) => {
            // Simuler un utilisateur connecté
            callback({ uid: 'test-user', email: 'test@example.com', displayName: 'Test User' });
            return () => {}; // Retourner fonction unsubscribe
        })
    }
}));

describe('Analytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Réinitialiser le module
        delete require.cache[require.resolve('../js/analytics.js')];
    });
    
    describe('initAnalytics()', () => {
        it('devrait initialiser Firebase Analytics', async () => {
            const { initAnalytics } = await import('../js/analytics.js');
            const analytics = initAnalytics();
            
            expect(mockGetAnalytics).toHaveBeenCalled();
            expect(analytics).toBeTruthy();
        });
    });
    
    describe('trackEvent()', () => {
        it('devrait tracker un événement', async () => {
            const { trackEvent } = await import('../js/analytics.js');
            
            trackEvent('test_event', { param1: 'value1' });
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'test_event',
                expect.objectContaining({
                    param1: 'value1',
                    timestamp: expect.any(Number),
                    page: expect.any(String)
                })
            );
        });
        
        it('devrait fonctionner même si analytics non disponible', async () => {
            mockGetAnalytics.mockReturnValueOnce(null);
            const { trackEvent } = await import('../js/analytics.js');
            
            // Ne devrait pas throw d'erreur
            expect(() => trackEvent('test_event')).not.toThrow();
        });
    });
    
    describe('trackError()', () => {
        it('devrait tracker une erreur', async () => {
            const { trackError } = await import('../js/analytics.js');
            const error = new Error('Test error');
            
            trackError(error, { context: 'test' });
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'exception',
                expect.objectContaining({
                    description: 'Test error',
                    fatal: false,
                    error_type: 'Error',
                    context: 'test'
                })
            );
        });
    });
    
    describe('trackPerformance()', () => {
        it('devrait tracker une métrique de performance', async () => {
            const { trackPerformance } = await import('../js/analytics.js');
            
            trackPerformance('load_time', 150, 'ms');
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'performance',
                expect.objectContaining({
                    metric_name: 'load_time',
                    metric_value: 150,
                    metric_unit: 'ms'
                })
            );
        });
    });
    
    describe('trackPageView()', () => {
        it('devrait tracker une page vue', async () => {
            const { trackPageView } = await import('../js/analytics.js');
            
            trackPageView('Dashboard', '/dashboard.html');
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'page_view',
                expect.objectContaining({
                    page_title: 'Dashboard',
                    page_path: '/dashboard.html'
                })
            );
        });
    });
    
    describe('trackQuizStart()', () => {
        it('devrait tracker le début d\'un quiz', async () => {
            const { trackQuizStart } = await import('../js/analytics.js');
            
            trackQuizStart('auto', 'Novembre 2025');
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'quiz_start',
                expect.objectContaining({
                    module_id: 'auto',
                    month: 'Novembre 2025'
                })
            );
        });
    });
    
    describe('trackQuizComplete()', () => {
        it('devrait tracker la fin d\'un quiz', async () => {
            const { trackQuizComplete } = await import('../js/analytics.js');
            
            trackQuizComplete('auto', 85, 120, 10);
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'quiz_complete',
                expect.objectContaining({
                    module_id: 'auto',
                    score: 85,
                    time_elapsed: 120,
                    total_questions: 10,
                    passed: true
                })
            );
        });
        
        it('devrait marquer comme échoué si score < 60', async () => {
            const { trackQuizComplete } = await import('../js/analytics.js');
            
            trackQuizComplete('auto', 50, 120, 10);
            
            expect(mockLogEvent).toHaveBeenCalledWith(
                expect.anything(),
                'quiz_complete',
                expect.objectContaining({
                    passed: false
                })
            );
        });
    });
    
    describe('setAnalyticsUser()', () => {
        it('devrait définir l\'utilisateur', async () => {
            const { setAnalyticsUser } = await import('../js/analytics.js');
            
            setAnalyticsUser('user-123');
            
            expect(mockSetUserId).toHaveBeenCalledWith(expect.anything(), 'user-123');
        });
    });
    
    describe('setUserProperties()', () => {
        it('devrait définir les propriétés utilisateur', async () => {
            const { setUserProperties } = await import('../js/analytics.js');
            
            setUserProperties({ email: 'test@example.com' });
            
            expect(mockSetUserProperties).toHaveBeenCalledWith(
                expect.anything(),
                { email: 'test@example.com' }
            );
        });
    });
});

