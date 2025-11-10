/**
 * Utilitaires pour le calcul de score et la logique de déblocage mensuel
 * 
 * ✅ P0 CRITIQUE: Extraction des fonctions critiques pour tests unitaires
 */

/**
 * Calcule le score d'un quiz basé sur les réponses de l'utilisateur
 * @param {Array} userAnswers - Tableau des réponses de l'utilisateur avec propriété `isCorrect`
 * @returns {number} Score entre 0 et 100, ou 0 si aucune réponse
 */
export function calculateScore(userAnswers) {
    if (!userAnswers || userAnswers.length === 0) {
        return 0;
    }
    
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / userAnswers.length) * 100);
    
    // Validation du score calculé
    if (isNaN(score) || score < 0 || score > 100) {
        console.error('❌ Score invalide calculé:', score);
        return 0;
    }
    
    return score;
}

/**
 * Détermine si un quiz mensuel est débloqué
 * @param {number} monthIndex - Index du mois (0-11, où 0 = janvier, 11 = décembre)
 * @param {number} currentMonthIndex - Index du mois actuel (0-11)
 * @returns {boolean} true si le quiz est débloqué, false sinon
 */
export function isMonthlyQuizUnlocked(monthIndex, currentMonthIndex) {
    // Validation des paramètres
    if (typeof monthIndex !== 'number' || monthIndex < 0 || monthIndex > 11) {
        console.error('❌ monthIndex invalide:', monthIndex);
        return false;
    }
    
    if (typeof currentMonthIndex !== 'number' || currentMonthIndex < 0 || currentMonthIndex > 11) {
        console.error('❌ currentMonthIndex invalide:', currentMonthIndex);
        return false;
    }
    
    // Un quiz est débloqué si son index est <= au mois actuel
    // Exemple: Si on est en novembre (index 10), les quiz de janvier (0) à novembre (10) sont débloqués
    return monthIndex <= currentMonthIndex;
}

/**
 * Détermine l'état d'un quiz mensuel
 * @param {number} monthIndex - Index du mois (0-11)
 * @param {number} currentMonthIndex - Index du mois actuel (0-11)
 * @param {number|null} monthScore - Score obtenu pour ce mois (null si non complété)
 * @returns {string} 'completed' | 'active' | 'incomplete' | 'locked'
 */
export function getMonthlyQuizStatus(monthIndex, currentMonthIndex, monthScore = null) {
    if (monthIndex < currentMonthIndex) {
        // Mois passé
        return monthScore !== null ? 'completed' : 'incomplete';
    } else if (monthIndex === currentMonthIndex) {
        // Mois actuel
        return 'active';
    } else {
        // Mois futur
        return 'locked';
    }
}

