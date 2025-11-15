// Helpers de sécurité - Validation et sanitization des entrées

/**
 * Échappe les caractères HTML pour prévenir les attaques XSS
 * @param {string} str - Chaîne à échapper
 * @returns {string} Chaîne sécurisée
 */
const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};

const HTML_ESCAPE_REGEX = /[&<>"'`]/g;

export function sanitizeHTML(str) {
    if (str === null || str === undefined) return '';
    
    const value = String(str);
    return value.replace(HTML_ESCAPE_REGEX, char => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Échappe les caractères HTML (alias pour compatibilité)
 * @param {string} text - Texte à échapper
 * @returns {string} Texte sécurisé
 */
export function escapeHtml(text) {
    return sanitizeHTML(text);
}

/**
 * Valide et sécurise une URL
 * @param {string} url - URL à valider
 * @returns {string} URL sécurisée ou '#' si invalide
 */
export function sanitizeURL(url) {
    if (!url || typeof url !== 'string') return '#';
    
    try {
        const parsed = new URL(url);
        // Autoriser seulement http: et https:
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            console.warn('⚠️ URL avec protocole non autorisé bloquée:', url);
            return '#';
        }
        return url;
    } catch {
        console.warn('⚠️ URL invalide bloquée:', url);
        return '#';
    }
}

/**
 * Validateurs pour différents types de données
 */
export const validators = {
    /**
     * Valide un email
     */
    email: (email) => {
        if (!email || typeof email !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    /**
     * Valide le texte d'une question
     */
    questionText: (text) => {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        if (trimmed.length < 10) return false;
        if (trimmed.length > 500) return false;
        return true;
    },
    
    /**
     * Valide une option de réponse
     */
    option: (opt) => {
        if (!opt || typeof opt !== 'string') return false;
        const trimmed = opt.trim();
        if (trimmed.length < 2) return false;
        if (trimmed.length > 200) return false;
        return true;
    },
    
    /**
     * Valide une explication
     */
    explanation: (text) => {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        if (trimmed.length < 20) return false;
        if (trimmed.length > 1000) return false;
        return true;
    },
    
    /**
     * Valide un module
     */
    module: (mod) => {
        return ['auto', 'loisir', 'vr', 'tracteur'].includes(mod);
    },
    
    /**
     * Valide un mois (1-12)
     */
    month: (m) => {
        return Number.isInteger(m) && m >= 1 && m <= 12;
    },
    
    /**
     * Valide une année (2020-2030)
     */
    year: (y) => {
        return Number.isInteger(y) && y >= 2020 && y <= 2030;
    },
    
    /**
     * Valide un index de réponse correcte (0-3)
     */
    correctAnswer: (idx) => {
        return Number.isInteger(idx) && idx >= 0 && idx <= 3;
    },
    
    /**
     * Valide un rôle utilisateur
     */
    role: (role) => {
        return ['user', 'admin'].includes(role);
    },
    
    /**
     * Valide un score (0-100)
     */
    score: (score) => {
        return typeof score === 'number' && score >= 0 && score <= 100;
    }
};

/**
 * Valide les données complètes d'une question
 * @param {Object} data - Données de la question
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuestionData(data) {
    const errors = [];
    
    // Validation question
    if (!validators.questionText(data.question)) {
        errors.push('Question invalide (10-500 caractères requis)');
    }
    
    // Validation options
    if (!Array.isArray(data.options) || data.options.length !== 4) {
        errors.push('Exactement 4 options requises');
    } else {
        data.options.forEach((opt, idx) => {
            if (!validators.option(opt)) {
                errors.push(`Option ${idx + 1} invalide (2-200 caractères requis)`);
            }
        });
    }
    
    // Validation réponse correcte
    if (!validators.correctAnswer(data.correctAnswer)) {
        errors.push('Index de réponse correcte invalide (0-3)');
    }
    
    // Validation explication
    if (!validators.explanation(data.explanation)) {
        errors.push('Explication invalide (20-1000 caractères requis)');
    }
    
    // Validation module
    if (!validators.module(data.module)) {
        errors.push('Module invalide (auto, loisir, vr, tracteur)');
    }
    
    // Validation mois
    if (!validators.month(data.month)) {
        errors.push('Mois invalide (1-12)');
    }
    
    // Validation année
    if (!validators.year(data.year)) {
        errors.push('Année invalide (2020-2030)');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Nettoie et valide les données d'une question
 * @param {Object} data - Données brutes
 * @returns {Object} Données nettoyées et validées
 */
export function sanitizeQuestionData(data) {
    return {
        question: sanitizeHTML(data.question?.trim() || ''),
        options: (data.options || []).map(opt => sanitizeHTML(opt?.trim() || '')),
        correctAnswer: parseInt(data.correctAnswer, 10),
        explanation: sanitizeHTML(data.explanation?.trim() || ''),
        module: data.module,
        month: parseInt(data.month, 10),
        year: parseInt(data.year, 10),
        reference: sanitizeHTML(data.reference?.trim() || ''),
        tags: (data.tags || []).map(tag => sanitizeHTML(tag?.trim() || ''))
    };
}

/**
 * Limite la taille d'une chaîne
 * @param {string} str - Chaîne à limiter
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Chaîne limitée
 */
export function truncateString(str, maxLength = 100) {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}

/**
 * Détecte les tentatives d'injection SQL/NoSQL dans une chaîne
 * @param {string} str - Chaîne à analyser
 * @returns {boolean} true si suspect
 */
export function detectInjectionAttempt(str) {
    if (!str || typeof str !== 'string') return false;
    
    const suspiciousPatterns = [
        /(<script|javascript:|onerror=|onclick=)/i,
        /(union.*select|insert.*into|drop.*table)/i,
        /(\$where|\$ne|\$gt|\$lt)/i, // NoSQL injection
        /(eval\(|exec\(|system\()/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(str));
}

/**
 * Nettoie les données utilisateur pour affichage sécurisé
 * @param {Object} user - Objet utilisateur
 * @returns {Object} Utilisateur avec données nettoyées
 */
export function sanitizeUserData(user) {
    if (!user) return null;
    
    return {
        uid: user.uid,
        email: sanitizeHTML(user.email || ''),
        displayName: sanitizeHTML(user.displayName || 'Utilisateur'),
        photoURL: user.photoURL ? sanitizeURL(user.photoURL) : null,
        role: validators.role(user.role) ? user.role : 'user'
    };
}

export default {
    sanitizeHTML,
    escapeHtml,
    sanitizeURL,
    validators,
    validateQuestionData,
    sanitizeQuestionData,
    truncateString,
    detectInjectionAttempt,
    sanitizeUserData
};
