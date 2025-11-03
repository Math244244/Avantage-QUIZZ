// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { logger } from './logger.js';

// Configuration Firebase - Avantage QUIZZ
// Configuration complète avec Firestore + Realtime Database
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

logger.log('✅ Firebase initialisé avec succès');
logger.log('📊 Projet:', firebaseConfig.projectId);
logger.log('🔐 Services: Authentication, Firestore, Realtime Database');
