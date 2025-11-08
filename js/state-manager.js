/**
 * Gestionnaire d'État Centralisé
 * 
 * ✅ CORRECTION SECTION 5 : Centralisation des variables globales
 * 
 * Remplace toutes les variables globales éparpillées dans :
 * - js/quiz.js
 * - js/dashboard.js
 * - js/admin-dashboard.js
 * - etc.
 * 
 * Avantages :
 * - État centralisé et traçable
 * - Pas de conflits de noms
 * - Tests facilités
 * - Reset automatique possible
 */

class StateManager {
    constructor() {
        // État initial
        this.state = {
            // Quiz state
            currentQuiz: null,
            currentQuestionIndex: 0,
            userAnswers: [],
            startTime: null,
            timerInterval: null,
            questionStartTime: null,
            pausedDuration: 0,
            isPaused: false,
            currentModule: null,
            currentMonth: null,
            currentYear: null,
            currentStreak: 0,
            
            // Dashboard state
            monthsData: [],
            currentMonthIndex: null,
            annualProgress: {},
            userProfile: null,
            
            // Admin state
            globalStats: null,
            topUsers: [],
            recentActivity: [],
            allUsers: [],
            questionsStats: null,
            usersStats: null,
            
            // Auth state
            currentUser: null,
            isDemoMode: false,
            clientId: null,
            
            // UI state
            isLoading: false,
            error: null,
            notifications: []
        };
        
        // Listeners pour les changements d'état
        this.listeners = new Map();
        
        // Historique pour le debug (optionnel)
        this.history = [];
        this.maxHistorySize = 50;
    }
    
    /**
     * Obtenir une valeur de l'état
     * @param {string} key - Clé de l'état
     * @returns {*} Valeur de l'état
     */
    get(key) {
        if (key.includes('.')) {
            // Support pour les clés imbriquées (ex: 'quiz.currentQuestionIndex')
            const keys = key.split('.');
            let value = this.state;
            for (const k of keys) {
                if (value == null) return undefined;
                value = value[k];
            }
            return value;
        }
        return this.state[key];
    }
    
    /**
     * Définir une valeur dans l'état
     * @param {string} key - Clé de l'état
     * @param {*} value - Nouvelle valeur
     * @param {boolean} silent - Si true, ne déclenche pas les listeners
     */
    set(key, value, silent = false) {
        const oldValue = this.get(key);
        
        if (key.includes('.')) {
            // Support pour les clés imbriquées
            const keys = key.split('.');
            const lastKey = keys.pop();
            let target = this.state;
            for (const k of keys) {
                if (!target[k] || typeof target[k] !== 'object') {
                    target[k] = {};
                }
                target = target[k];
            }
            target[lastKey] = value;
        } else {
            this.state[key] = value;
        }
        
        // Ajouter à l'historique
        this.addToHistory(key, value, oldValue);
        
        // Notifier les listeners
        if (!silent) {
            this.notify(key, value, oldValue);
        }
    }
    
    /**
     * Mettre à jour plusieurs valeurs en une fois
     * @param {Object} updates - Objet avec les clés/valeurs à mettre à jour
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            this.set(key, updates[key], true);
        });
        // Notifier une seule fois pour toutes les mises à jour
        Object.keys(updates).forEach(key => {
            this.notify(key, updates[key], this.get(key));
        });
    }
    
    /**
     * S'abonner aux changements d'une clé
     * @param {string} key - Clé à écouter
     * @param {Function} callback - Fonction appelée lors du changement
     * @returns {Function} Fonction de désabonnement
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
        
        // Retourner fonction de désabonnement
        return () => {
            const callbacks = this.listeners.get(key);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        };
    }
    
    /**
     * Notifier les listeners d'un changement
     * @param {string} key - Clé modifiée
     * @param {*} newValue - Nouvelle valeur
     * @param {*} oldValue - Ancienne valeur
     */
    notify(key, newValue, oldValue) {
        const callbacks = this.listeners.get(key) || [];
        callbacks.forEach(callback => {
            try {
                callback(newValue, oldValue, key);
            } catch (error) {
                console.error(`❌ Erreur dans listener pour ${key}:`, error);
            }
        });
    }
    
    /**
     * Réinitialiser l'état du quiz
     */
    resetQuiz() {
        this.update({
            currentQuiz: null,
            currentQuestionIndex: 0,
            userAnswers: [],
            startTime: null,
            timerInterval: null,
            questionStartTime: null,
            pausedDuration: 0,
            isPaused: false,
            currentModule: null,
            currentMonth: null,
            currentYear: null
        });
    }
    
    /**
     * Réinitialiser l'état du dashboard
     */
    resetDashboard() {
        this.update({
            monthsData: [],
            currentMonthIndex: null,
            annualProgress: {}
        });
    }
    
    /**
     * Réinitialiser l'état admin
     */
    resetAdmin() {
        this.update({
            globalStats: null,
            topUsers: [],
            recentActivity: [],
            allUsers: [],
            questionsStats: null,
            usersStats: null
        });
    }
    
    /**
     * Réinitialiser tout l'état (sauf auth)
     */
    reset() {
        this.resetQuiz();
        this.resetDashboard();
        this.resetAdmin();
        this.set('error', null);
        this.set('isLoading', false);
    }
    
    /**
     * Ajouter une entrée à l'historique
     * @param {string} key - Clé modifiée
     * @param {*} newValue - Nouvelle valeur
     * @param {*} oldValue - Ancienne valeur
     */
    addToHistory(key, newValue, oldValue) {
        this.history.push({
            key,
            newValue,
            oldValue,
            timestamp: Date.now()
        });
        
        // Limiter la taille de l'historique
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }
    
    /**
     * Obtenir l'historique des changements
     * @param {string} key - Filtrer par clé (optionnel)
     * @returns {Array} Historique
     */
    getHistory(key = null) {
        if (key) {
            return this.history.filter(entry => entry.key === key);
        }
        return [...this.history];
    }
    
    /**
     * Obtenir un snapshot de l'état complet
     * @returns {Object} Copie de l'état
     */
    getSnapshot() {
        return JSON.parse(JSON.stringify(this.state));
    }
    
    /**
     * Restaurer un snapshot de l'état
     * @param {Object} snapshot - Snapshot à restaurer
     */
    restoreSnapshot(snapshot) {
        this.state = JSON.parse(JSON.stringify(snapshot));
        // Notifier tous les listeners
        Object.keys(snapshot).forEach(key => {
            this.notify(key, snapshot[key], this.get(key));
        });
    }
    
    /**
     * Vérifier si une clé existe dans l'état
     * @param {string} key - Clé à vérifier
     * @returns {boolean} True si la clé existe
     */
    has(key) {
        if (key.includes('.')) {
            const keys = key.split('.');
            let value = this.state;
            for (const k of keys) {
                if (value == null || !(k in value)) return false;
                value = value[k];
            }
            return true;
        }
        return key in this.state;
    }
    
    /**
     * Supprimer une clé de l'état
     * @param {string} key - Clé à supprimer
     */
    delete(key) {
        const oldValue = this.get(key);
        
        if (key.includes('.')) {
            const keys = key.split('.');
            const lastKey = keys.pop();
            let target = this.state;
            for (const k of keys) {
                if (!target[k] || typeof target[k] !== 'object') {
                    return; // Clé non trouvée
                }
                target = target[k];
            }
            delete target[lastKey];
        } else {
            delete this.state[key];
        }
        
        this.addToHistory(key, undefined, oldValue);
        this.notify(key, undefined, oldValue);
    }
}

// Export singleton
export const stateManager = new StateManager();

// Export de la classe pour les tests
export { StateManager };

// Helpers pour faciliter l'utilisation
export const state = {
    get: (key) => stateManager.get(key),
    set: (key, value) => stateManager.set(key, value),
    update: (updates) => stateManager.update(updates),
    subscribe: (key, callback) => stateManager.subscribe(key, callback),
    reset: () => stateManager.reset(),
    resetQuiz: () => stateManager.resetQuiz(),
    resetDashboard: () => stateManager.resetDashboard(),
    resetAdmin: () => stateManager.resetAdmin()
};

