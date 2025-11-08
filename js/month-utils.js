/**
 * Utilitaires pour la gestion des mois (Section 2 - Logique Métier)
 * 
 * Ce module fournit des fonctions pour normaliser et gérer les formats de mois
 * afin d'éviter les incohérences entre dashboard et quiz.
 */

/**
 * Noms des mois en français (première lettre majuscule)
 */
export const MONTH_NAMES = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Noms des mois en minuscules (pour compatibilité)
 */
export const MONTH_NAMES_LOWERCASE = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

/**
 * Obtient l'index du mois actuel (0-11)
 * @returns {number} Index du mois actuel (0 = Janvier, 11 = Décembre)
 */
export function getCurrentMonthIndex() {
    const now = new Date();
    return now.getMonth(); // 0-11
}

/**
 * Obtient le numéro du mois actuel (1-12)
 * @returns {number} Numéro du mois actuel (1 = Janvier, 12 = Décembre)
 */
export function getCurrentMonthNumber() {
    return getCurrentMonthIndex() + 1;
}

/**
 * Obtient l'année actuelle
 * @returns {number} Année actuelle
 */
export function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * Normalise le format d'un mois pour garantir la cohérence
 * 
 * Format de sortie garanti : "Novembre 2025" (première lettre majuscule, espace, année)
 * 
 * @param {string|number} month - Mois (texte ou numéro 1-12)
 * @param {number} year - Année (optionnel, utilise l'année actuelle par défaut)
 * @returns {string} Mois normalisé au format "Novembre 2025"
 */
export function normalizeMonthFormat(month, year = getCurrentYear()) {
    let monthName;
    
    // Si c'est un numéro (1-12)
    if (typeof month === 'number') {
        if (month < 1 || month > 12) {
            throw new Error(`Numéro de mois invalide: ${month}. Doit être entre 1 et 12.`);
        }
        monthName = MONTH_NAMES[month - 1];
    }
    // Si c'est une chaîne
    else if (typeof month === 'string') {
        // Normaliser la casse
        const monthLower = month.toLowerCase().trim();
        
        // Chercher dans la liste des mois en minuscules
        const monthIndex = MONTH_NAMES_LOWERCASE.findIndex(m => m === monthLower);
        if (monthIndex !== -1) {
            monthName = MONTH_NAMES[monthIndex];
        } else {
            // Essayer de parser un format comme "novembre 2025" ou "Novembre 2025"
            const parts = month.split(' ');
            if (parts.length >= 1) {
                const monthPart = parts[0].toLowerCase();
                const monthIdx = MONTH_NAMES_LOWERCASE.findIndex(m => m === monthPart);
                if (monthIdx !== -1) {
                    monthName = MONTH_NAMES[monthIdx];
                    // Si l'année est dans la chaîne, l'utiliser
                    if (parts.length >= 2) {
                        const yearPart = parseInt(parts[1]);
                        if (!isNaN(yearPart)) {
                            year = yearPart;
                        }
                    }
                } else {
                    throw new Error(`Format de mois invalide: ${month}`);
                }
            } else {
                throw new Error(`Format de mois invalide: ${month}`);
            }
        }
    } else {
        throw new Error(`Type de mois invalide: ${typeof month}`);
    }
    
    return `${monthName} ${year}`;
}

/**
 * Crée un ID de document Firestore pour monthlyProgress
 * Remplace les espaces par des underscores pour éviter les problèmes
 * 
 * @param {string} userId - ID de l'utilisateur
 * @param {string|number} month - Mois (texte ou numéro)
 * @param {number} year - Année (optionnel)
 * @returns {string} ID du document au format "userId_Novembre_2025"
 */
export function createMonthlyProgressId(userId, month, year = getCurrentYear()) {
    const normalizedMonth = normalizeMonthFormat(month, year);
    // Remplacer les espaces par des underscores pour l'ID Firestore
    return `${userId}_${normalizedMonth.replace(/\s+/g, '_')}`;
}

/**
 * Extrait l'année d'une chaîne de mois normalisée
 * 
 * @param {string} normalizedMonth - Mois normalisé au format "Novembre 2025"
 * @returns {number} Année extraite
 */
export function extractYearFromMonth(normalizedMonth) {
    const parts = normalizedMonth.split(' ');
    if (parts.length >= 2) {
        const year = parseInt(parts[parts.length - 1]);
        if (!isNaN(year)) {
            return year;
        }
    }
    return getCurrentYear();
}

/**
 * Valide qu'un format de mois est correct
 * 
 * @param {string} month - Mois à valider
 * @returns {boolean} True si le format est valide
 */
export function isValidMonthFormat(month) {
    try {
        normalizeMonthFormat(month);
        return true;
    } catch (e) {
        return false;
    }
}

export default {
    MONTH_NAMES,
    MONTH_NAMES_LOWERCASE,
    getCurrentMonthIndex,
    getCurrentMonthNumber,
    getCurrentYear,
    normalizeMonthFormat,
    createMonthlyProgressId,
    extractYearFromMonth,
    isValidMonthFormat
};


