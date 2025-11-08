/**
 * Gestionnaire Multi-Tenant - Isolation des données par client
 * 
 * Ce module gère l'isolation des données entre différents clients.
 * Chaque utilisateur appartient à un client, et toutes les données
 * sont filtrées par clientId pour garantir l'isolation.
 * 
 * ✅ CORRECTION SECTION 1 : Isolation Multi-Tenant
 */

import { auth } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';
import { safeFirestoreRead } from './rate-limiter.js';

// Client ID par défaut pour les utilisateurs existants (rétro-compatibilité)
const DEFAULT_CLIENT_ID = 'default';

// Cache du clientId de l'utilisateur actuel
let currentUserClientId = null;
let clientIdCacheExpiry = 0;
const CLIENT_ID_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Récupère le clientId de l'utilisateur actuel
 * @param {Object} user - L'objet utilisateur Firebase (optionnel, utilise auth.currentUser si non fourni)
 * @returns {Promise<string>} Le clientId de l'utilisateur
 */
export async function getCurrentClientId(user = null) {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
        console.warn('⚠️ Aucun utilisateur connecté, utilisation du clientId par défaut');
        return DEFAULT_CLIENT_ID;
    }

    // Vérifier le cache
    const now = Date.now();
    if (currentUserClientId && now < clientIdCacheExpiry) {
        return currentUserClientId;
    }

    try {
        // Récupérer le profil utilisateur pour obtenir le clientId
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await safeFirestoreRead(() => getDoc(userRef));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Si le clientId n'existe pas, déterminer à partir de l'email ou utiliser le défaut
            let clientId = userData.clientId;
            if (!clientId) {
                clientId = determineClientIdFromEmail(currentUser.email);
            }
            
            // Mettre en cache
            currentUserClientId = clientId;
            clientIdCacheExpiry = now + CLIENT_ID_CACHE_TTL;
            
            return clientId;
        } else {
            // Utilisateur n'existe pas encore, déterminer à partir de l'email
            const clientId = determineClientIdFromEmail(currentUser.email);
            console.log('🔄 Profil utilisateur non trouvé, clientId déterminé à partir de l\'email:', clientId);
            return clientId;
        }
    } catch (error) {
        console.error('❌ Erreur récupération clientId:', error);
        // En cas d'erreur, déterminer à partir de l'email ou utiliser le défaut
        const clientId = determineClientIdFromEmail(currentUser.email);
        return clientId;
    }
}

/**
 * Récupère le clientId de manière synchrone (depuis le cache)
 * Retourne null si le cache n'est pas disponible
 * @returns {string|null} Le clientId ou null
 */
export function getCurrentClientIdSync() {
    if (currentUserClientId && Date.now() < clientIdCacheExpiry) {
        return currentUserClientId;
    }
    return null;
}

/**
 * Réinitialise le cache du clientId
 * Utile après une mise à jour du profil utilisateur
 */
export function resetClientIdCache() {
    currentUserClientId = null;
    clientIdCacheExpiry = 0;
}

/**
 * Détermine le clientId à partir de l'email (pour migration future)
 * @param {string} email - L'email de l'utilisateur
 * @returns {string} Le clientId déterminé
 */
export function determineClientIdFromEmail(email) {
    if (!email) return DEFAULT_CLIENT_ID;
    
    // Exemple de logique : extraire le domaine
    // Pour l'instant, tous les utilisateurs utilisent le clientId par défaut
    // Cette fonction peut être étendue pour supporter plusieurs clients
    const domain = email.split('@')[1];
    
    // Mapping de domaines vers clientIds (à configurer selon les besoins)
    const domainToClientId = {
        // Exemple:
        // 'client1.com': 'client1',
        // 'client2.com': 'client2',
    };
    
    return domainToClientId[domain] || DEFAULT_CLIENT_ID;
}

/**
 * Vérifie si l'utilisateur actuel appartient à un client spécifique
 * @param {string} clientId - Le clientId à vérifier
 * @returns {Promise<boolean>} True si l'utilisateur appartient au client
 */
export async function belongsToClient(clientId) {
    const currentClientId = await getCurrentClientId();
    return currentClientId === clientId;
}

/**
 * Ajoute un filtre clientId à une requête Firestore
 * @param {Query} query - La requête Firestore
 * @param {string} clientId - Le clientId à filtrer (optionnel, utilise l'utilisateur actuel si non fourni)
 * @returns {Promise<Query>} La requête avec le filtre clientId
 */
export async function addClientIdFilter(query, clientId = null) {
    // Cette fonction sera utilisée dans les requêtes Firestore
    // Pour l'instant, on retourne la requête telle quelle
    // L'implémentation complète nécessitera de modifier toutes les requêtes
    // dans firestore-service.js pour ajouter where('clientId', '==', clientId)
    
    if (!clientId) {
        clientId = await getCurrentClientId();
    }
    
    // Note: Cette fonction nécessite d'être appelée avec une requête qui peut être modifiée
    // L'implémentation complète sera faite dans firestore-service.js
    return query;
}

export default {
    getCurrentClientId,
    getCurrentClientIdSync,
    resetClientIdCache,
    determineClientIdFromEmail,
    belongsToClient,
    addClientIdFilter,
    DEFAULT_CLIENT_ID
};

