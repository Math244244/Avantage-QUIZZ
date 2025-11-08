// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { logger } from './logger.js';

/**
 * Configuration Firebase - Avantage QUIZZ
 * 
 * ⚠️ SÉCURITÉ - Clé API Firebase Exposée :
 * 
 * La clé API Firebase est exposée dans le code source côté client, ce qui est
 * NORMAL et ATTENDU pour Firebase. Firebase est conçu pour fonctionner avec
 * des clés API publiques côté client.
 * 
 * PROTECTION :
 * 1. Les règles Firestore (firestore.rules) protègent les données côté serveur
 * 2. Les restrictions d'API doivent être configurées dans Firebase Console :
 *    - Aller dans Google Cloud Console > APIs & Services > Credentials
 *    - Sélectionner la clé API
 *    - Ajouter des restrictions :
 *      * Application restrictions : HTTP referrers (web sites)
 *      * Limiter aux domaines autorisés uniquement
 * 3. Surveiller les quotas et coûts dans Firebase Console
 * 4. Configurer des alertes de coûts
 * 
 * ⚠️ IMPORTANT : Ne JAMAIS utiliser cette clé pour des opérations sensibles
 * côté serveur. Toute la sécurité repose sur les règles Firestore.
 */
const firebaseConfig = {
  apiKey: "AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0",
  authDomain: "avantage-quizz.firebaseapp.com",
  databaseURL: "https://avantage-quizz-default-rtdb.firebaseio.com",
  projectId: "avantage-quizz",
  storageBucket: "avantage-quizz.firebasestorage.app",
  messagingSenderId: "919472910099",
  appId: "1:919472910099:web:e17d4c1cdc7a04c6cab4e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);

// ✅ CORRECTION SECTION 9 : Exporter app pour Analytics
export { app };

logger.log('✅ Firebase initialisé avec succès');
logger.log('📊 Projet:', firebaseConfig.projectId);
logger.log('🔐 Services: Authentication, Firestore, Realtime Database');
