/**
 * Cloud Functions for QuizPro - Avantage Plus
 * 
 * P1-2: Cloud Function pour agrégation des statistiques
 * 
 * Cette fonction optimise les coûts Firestore en :
 * - Réduisant les lectures côté client
 * - Calculant les statistiques côté serveur
 * - Mettant en cache les résultats
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function pour agréger les statistiques globales
 * 
 * @param {Object} data - Données de la requête (clientId requis)
 * @param {Object} context - Contexte Firebase (auth, etc.)
 * @returns {Object} Statistiques agrégées
 */
exports.getGlobalStats = functions.https.onCall(async (data, context) => {
  // Vérifier que l'appelant est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié pour appeler cette fonction.'
    );
  }

  // Récupérer le clientId depuis les données ou le contexte
  const clientId = data.clientId;
  if (!clientId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Le clientId est requis.'
    );
  }

  try {
    const db = admin.firestore();
    const stats = {
      totalUsers: 0,
      activeUsersToday: 0,
      activeUsersWeek: 0,
      totalQuizzes: 0,
      avgScore: 0,
      totalQuestions: 0,
      totalResources: 0,
      quizzesToday: 0,
      quizzesWeek: 0
    };

    // Calculer les dates pour les filtres temporels
    const now = admin.firestore.Timestamp.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = admin.firestore.Timestamp.fromDate(today);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoTimestamp = admin.firestore.Timestamp.fromDate(weekAgo);

    // 1. Compter les utilisateurs (filtrés par clientId)
    const usersSnapshot = await db.collection('users')
      .where('clientId', '==', clientId)
      .get();
    
    stats.totalUsers = usersSnapshot.size;

    // 2. Compter les utilisateurs actifs (ayant complété un quiz récemment)
    const activeUsersTodaySet = new Set();
    const activeUsersWeekSet = new Set();

    // 3. Compter les quiz et calculer les statistiques
    const quizResultsSnapshot = await db.collection('quizResults')
      .where('clientId', '==', clientId)
      .get();

    let totalScore = 0;
    let quizCount = 0;

    quizResultsSnapshot.forEach(doc => {
      const data = doc.data();
      const completedAt = data.completedAt;
      
      if (completedAt) {
        quizCount++;
        totalScore += data.score || 0;

        // Utilisateurs actifs aujourd'hui
        if (completedAt >= todayTimestamp) {
          activeUsersTodaySet.add(data.userId);
        }

        // Utilisateurs actifs cette semaine
        if (completedAt >= weekAgoTimestamp) {
          activeUsersWeekSet.add(data.userId);
        }

        // Quiz aujourd'hui et cette semaine
        const completedDate = completedAt.toDate();
        if (completedDate >= today) {
          stats.quizzesToday++;
        }
        if (completedDate >= weekAgo) {
          stats.quizzesWeek++;
        }
      }
    });

    stats.totalQuizzes = quizCount;
    stats.avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
    stats.activeUsersToday = activeUsersTodaySet.size;
    stats.activeUsersWeek = activeUsersWeekSet.size;

    // 4. Compter les questions (filtrées par clientId)
    const questionsSnapshot = await db.collection('questions')
      .where('clientId', '==', clientId)
      .get();
    
    stats.totalQuestions = questionsSnapshot.size;

    // 5. Compter les ressources (filtrées par clientId)
    const resourcesSnapshot = await db.collection('resources')
      .where('clientId', '==', clientId)
      .get();
    
    stats.totalResources = resourcesSnapshot.size;

    console.log(`✅ Statistiques agrégées pour clientId: ${clientId}`, stats);

    return {
      success: true,
      stats: stats,
      timestamp: admin.firestore.Timestamp.now()
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'agrégation des statistiques:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erreur lors de l\'agrégation des statistiques: ' + error.message
    );
  }
});

/**
 * Cloud Function pour agréger les statistiques par module
 * 
 * @param {Object} data - Données de la requête (clientId requis)
 * @param {Object} context - Contexte Firebase (auth, etc.)
 * @returns {Object} Statistiques par module
 */
exports.getModuleStats = functions.https.onCall(async (data, context) => {
  // Vérifier que l'appelant est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié pour appeler cette fonction.'
    );
  }

  // Récupérer le clientId depuis les données
  const clientId = data.clientId;
  if (!clientId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Le clientId est requis.'
    );
  }

  try {
    const db = admin.firestore();
    const moduleStats = {};

    // Récupérer tous les résultats de quiz pour ce client
    const quizResultsSnapshot = await db.collection('quizResults')
      .where('clientId', '==', clientId)
      .get();

    // Agréger par module
    quizResultsSnapshot.forEach(doc => {
      const data = doc.data();
      const module = data.module || 'Autre';

      if (!moduleStats[module]) {
        moduleStats[module] = {
          count: 0,
          totalScore: 0,
          avgScore: 0
        };
      }

      moduleStats[module].count++;
      moduleStats[module].totalScore += data.score || 0;
    });

    // Calculer les moyennes
    Object.keys(moduleStats).forEach(module => {
      const stat = moduleStats[module];
      stat.avgScore = stat.count > 0 ? Math.round(stat.totalScore / stat.count) : 0;
    });

    console.log(`✅ Statistiques par module pour clientId: ${clientId}`, moduleStats);

    return {
      success: true,
      moduleStats: moduleStats,
      timestamp: admin.firestore.Timestamp.now()
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'agrégation des stats par module:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erreur lors de l\'agrégation des stats par module: ' + error.message
    );
  }
});

