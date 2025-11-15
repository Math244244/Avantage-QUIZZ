/**
 * Module Analytics et Monitoring
 * 
 * ✅ CORRECTION SECTION 9 : Monitoring et Analytics
 * 
 * Gère Firebase Analytics et le tracking d'erreurs
 */

import { getAnalytics, logEvent, setUserProperties, setUserId } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';
import { app } from './firebase-config.js';
import { auth } from './firebase-config.js';

const hasWindow = typeof window !== 'undefined';
const hasDocument = typeof document !== 'undefined';
const hasNavigator = typeof navigator !== 'undefined';
const isVitest = typeof import.meta !== 'undefined' && Boolean(import.meta.vitest);
const nodeTestEnv =
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test');
const isTestRuntime = isVitest || nodeTestEnv;
const supportsServiceWorker = hasNavigator && 'serviceWorker' in navigator;

let analytics = null;

function getPageMetadata() {
    if (hasWindow && window.location) {
        return {
            path: window.location.pathname,
            href: window.location.href
        };
    }
    return {
        path: '/test',
        href: 'https://localhost/test'
    };
}

/**
 * Initialiser Firebase Analytics
 */
export function initAnalytics() {
    try {
        if (analytics) return analytics;
        // Autoriser l'initialisation sur navigateur ou en environnement de test (Vitest)
        if ((hasWindow && supportsServiceWorker) || isTestRuntime) {
            analytics = getAnalytics(app);
            console.log('✅ Firebase Analytics initialisé');
        } else {
            console.warn('⚠️ Firebase Analytics non disponible dans cet environnement');
        }
        return analytics;
    } catch (error) {
        console.error('❌ Erreur initialisation Analytics:', error);
        return null;
    }
}

/**
 * Tracker un événement
 * @param {string} eventName - Nom de l'événement
 * @param {Object} params - Paramètres de l'événement
 */
export function trackEvent(eventName, params = {}) {
    if (!analytics) {
        // Mode silencieux si analytics non disponible
        console.log(`[Analytics] ${eventName}`, params);
        return;
    }
    
    try {
        const { path } = getPageMetadata();
        logEvent(analytics, eventName, {
            ...params,
            timestamp: Date.now(),
            page: path
        });
        console.log(`📊 Event tracked: ${eventName}`, params);
    } catch (error) {
        console.error('❌ Erreur tracking événement:', error);
    }
}

/**
 * Tracker une erreur
 * @param {Error} error - Erreur à tracker
 * @param {Object} context - Contexte supplémentaire
 */
export function trackError(error, context = {}) {
    if (!analytics) {
        console.error('[Analytics Error]', error, context);
        return;
    }
    
    try {
        logEvent(analytics, 'exception', {
            description: error.message || 'Unknown error',
            fatal: false,
            error_type: error.name || 'Error',
            error_stack: error.stack?.substring(0, 500) || '', // Limiter la taille
            ...context
        });
        console.error('📊 Error tracked:', error.message);
    } catch (trackingError) {
        console.error('❌ Erreur tracking erreur:', trackingError);
    }
}

/**
 * Tracker une métrique de performance
 * @param {string} metricName - Nom de la métrique
 * @param {number} value - Valeur de la métrique
 * @param {string} unit - Unité (ms, bytes, etc.)
 */
export function trackPerformance(metricName, value, unit = 'ms') {
    if (!analytics) {
        console.log(`[Analytics Performance] ${metricName}: ${value}${unit}`);
        return;
    }
    
    try {
        const { path } = getPageMetadata();
        logEvent(analytics, 'performance', {
            metric_name: metricName,
            metric_value: value,
            metric_unit: unit,
            page: path
        });
        console.log(`📊 Performance tracked: ${metricName} = ${value}${unit}`);
    } catch (error) {
        console.error('❌ Erreur tracking performance:', error);
    }
}

/**
 * Définir l'utilisateur pour Analytics
 * @param {string} userId - ID de l'utilisateur
 */
export function setAnalyticsUser(userId) {
    if (!analytics) return;
    
    try {
        setUserId(analytics, userId);
        console.log('✅ Analytics user set:', userId);
    } catch (error) {
        console.error('❌ Erreur définition utilisateur Analytics:', error);
    }
}

/**
 * Définir les propriétés utilisateur
 * @param {Object} properties - Propriétés utilisateur
 */
export function setAnalyticsUserProperties(properties) {
    if (!analytics) return;
    
    try {
        setUserProperties(analytics, properties);
        console.log('✅ Analytics user properties set:', properties);
    } catch (error) {
        console.error('❌ Erreur définition propriétés utilisateur:', error);
    }
}

/**
 * Tracker une page vue
 * @param {string} pageName - Nom de la page
 * @param {string} pagePath - Chemin de la page
 */
export function trackPageView(pageName, pagePath) {
    if (!analytics) {
        console.log(`[Analytics PageView] ${pageName} - ${pagePath || getPageMetadata().path}`);
        return;
    }
    
    try {
        const { path, href } = getPageMetadata();
        logEvent(analytics, 'page_view', {
            page_title: pageName,
            page_location: href,
            page_path: pagePath || path
        });
        console.log(`📊 Page view tracked: ${pageName}`);
    } catch (error) {
        console.error('❌ Erreur tracking page view:', error);
    }
}

/**
 * Tracker le début d'un quiz
 * @param {string} moduleId - ID du module
 * @param {string} month - Mois du quiz
 */
export function trackQuizStart(moduleId, month) {
    trackEvent('quiz_start', {
        module_id: moduleId,
        month: month
    });
}

/**
 * Tracker la fin d'un quiz
 * @param {string} moduleId - ID du module
 * @param {number} score - Score obtenu
 * @param {number} timeElapsed - Temps écoulé en secondes
 * @param {number} totalQuestions - Nombre total de questions
 */
export function trackQuizComplete(moduleId, score, timeElapsed, totalQuestions) {
    trackEvent('quiz_complete', {
        module_id: moduleId,
        score: score,
        time_elapsed: timeElapsed,
        total_questions: totalQuestions,
        passed: score >= 60
    });
}

/**
 * Tracker une action utilisateur
 * @param {string} action - Action effectuée
 * @param {string} category - Catégorie de l'action
 * @param {Object} params - Paramètres supplémentaires
 */
export function trackUserAction(action, category = 'user_interaction', params = {}) {
    trackEvent('user_action', {
        action: action,
        category: category,
        ...params
    });
}

/**
 * Tracker un événement de conversion
 * @param {string} conversionType - Type de conversion
 * @param {Object} params - Paramètres de conversion
 */
export function trackConversion(conversionType, params = {}) {
    trackEvent('conversion', {
        conversion_type: conversionType,
        ...params
    });
}

// Initialiser automatiquement si possible
const shouldAutoInit = hasWindow || isTestRuntime;

if (shouldAutoInit) {
    // Attendre le chargement complet pour éviter les erreurs de circular dependency
    const initWhenReady = () => {
        try {
            initAnalytics();
            
            if (auth && typeof auth.onAuthStateChanged === 'function') {
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        setAnalyticsUser(user.uid);
                        setAnalyticsUserProperties({
                            email: user.email || '',
                            display_name: user.displayName || ''
                        });
                    }
                });
            }
        } catch (error) {
            console.warn('⚠️ Analytics auto-init skipped:', error.message);
        }
    };
    
    if (hasDocument && document.readyState === 'loading' && hasWindow) {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else if (hasWindow) {
        // Utiliser setTimeout pour éviter les circular dependencies
        setTimeout(initWhenReady, 0);
    }
}

