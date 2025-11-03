// Logger conditionnel - Désactive les logs en production
// Garde seulement console.error actif pour débogage critique

const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '192.168.1.1' ||
                     window.location.port === '3200'; // Port Vite

/**
 * Logger intelligent qui désactive les logs en production
 * console.error reste toujours actif
 */
export const logger = {
    /**
     * Log d'information (développement uniquement)
     */
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
    
    /**
     * Log d'erreur (toujours actif)
     */
    error: (...args) => {
        console.error(...args);
    },
    
    /**
     * Log d'avertissement (développement uniquement)
     */
    warn: (...args) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },
    
    /**
     * Log d'information (développement uniquement)
     */
    info: (...args) => {
        if (isDevelopment) {
            console.info(...args);
        }
    },
    
    /**
     * Log de groupe (développement uniquement)
     */
    group: (...args) => {
        if (isDevelopment) {
            console.group(...args);
        }
    },
    
    /**
     * Fin de groupe (développement uniquement)
     */
    groupEnd: () => {
        if (isDevelopment) {
            console.groupEnd();
        }
    },
    
    /**
     * Table (développement uniquement)
     */
    table: (...args) => {
        if (isDevelopment) {
            console.table(...args);
        }
    }
};

// Message de démarrage
if (isDevelopment) {
    console.log('🔧 Mode développement - Logs activés');
} else {
    console.log('🚀 Mode production - Logs désactivés (sauf erreurs)');
}

export default logger;
