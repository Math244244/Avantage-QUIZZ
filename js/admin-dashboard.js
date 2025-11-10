// Dashboard Admin Avancé - Statistiques globales et analytics
import { db, functions } from './firebase-config.js';
import { collection, query, getDocs, where, orderBy, limit, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';
import { toast } from './toast.js';
import { logger } from './logger.js';
import { isDemoMode } from './auth.js';
// Import des fonctions de sécurité (Section 4 - Sécurité)
import { escapeHtml } from './security.js';
// ✅ CORRECTION SECTION 5 : StateManager - Centralisation des variables globales
import { stateManager } from './state-manager.js';
// ✅ P0 CRITIQUE: Import pour validation stricte du clientId
import { getCurrentClientId } from './client-manager.js';
import {
    createStatsSkeleton,
    createChartSkeleton,
    createListSkeleton,
    showSkeleton,
    hideSkeleton
} from './skeleton.js';

// ✅ Données simulées pour le mode démo
const MOCK_DATA = {
    stats: {
        totalUsers: 42,
        totalQuizzes: 156,
        totalQuestions: 240,
        totalResources: 35,
        avgScore: 78,
        activeUsersToday: 8,
        activeUsersWeek: 23,
        quizzesToday: 12,
        quizzesWeek: 67
    },
    topUsers: [
        { id: '1', email: 'alice.dupont@example.com', displayName: 'Alice Dupont', totalQuizzes: 24, averageScore: 92 },
        { id: '2', email: 'bob.martin@example.com', displayName: 'Bob Martin', totalQuizzes: 21, averageScore: 88 },
        { id: '3', email: 'claire.bernard@example.com', displayName: 'Claire Bernard', totalQuizzes: 19, averageScore: 85 },
        { id: '4', email: 'david.dubois@example.com', displayName: 'David Dubois', totalQuizzes: 18, averageScore: 83 },
        { id: '5', email: 'emma.petit@example.com', displayName: 'Emma Petit', totalQuizzes: 16, averageScore: 81 },
        { id: '6', email: 'francois.roux@example.com', displayName: 'François Roux', totalQuizzes: 15, averageScore: 79 },
        { id: '7', email: 'julie.moreau@example.com', displayName: 'Julie Moreau', totalQuizzes: 14, averageScore: 76 },
        { id: '8', email: 'lucas.simon@example.com', displayName: 'Lucas Simon', totalQuizzes: 13, averageScore: 74 },
        { id: '9', email: 'marie.laurent@example.com', displayName: 'Marie Laurent', totalQuizzes: 12, averageScore: 72 },
        { id: '10', email: 'nicolas.michel@example.com', displayName: 'Nicolas Michel', totalQuizzes: 11, averageScore: 70 }
    ],
    recentActivity: [
        { id: '1', userName: 'Alice Dupont', module: 'Auto - Novembre', score: 95, completedAt: new Date(Date.now() - 300000) },
        { id: '2', userName: 'Emma Petit', module: 'Loisir - Novembre', score: 90, completedAt: new Date(Date.now() - 720000) },
        { id: '3', userName: 'Bob Martin', module: 'VR - Novembre', score: 88, completedAt: new Date(Date.now() - 1380000) },
        { id: '4', userName: 'Claire Bernard', module: 'Auto - Octobre', score: 82, completedAt: new Date(Date.now() - 2700000) },
        { id: '5', userName: 'David Dubois', module: 'Tracteur - Octobre', score: 79, completedAt: new Date(Date.now() - 3600000) }
    ],
    moduleStats: [
        { module: 'Auto', questionsCount: 85, avgScore: 76, completions: 67 },
        { module: 'Loisir', questionsCount: 62, avgScore: 81, completions: 45 },
        { module: 'VR', questionsCount: 54, avgScore: 73, completions: 32 },
        { module: 'Tracteur', questionsCount: 39, avgScore: 79, completions: 28 }
    ]
};

// ✅ CORRECTION SECTION 5 : StateManager - Migrer globalStats et chartProgress/Modules/Activity vers StateManager
// Initialiser globalStats dans StateManager
stateManager.set('globalStats', {
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    totalResources: 0,
    avgScore: 0,
    activeUsersToday: 0,
    activeUsersWeek: 0,
    quizzesToday: 0,
    quizzesWeek: 0
});

// Initialiser les graphiques dans StateManager
stateManager.set('chartProgress', null);
stateManager.set('chartModules', null);
stateManager.set('chartActivity', null);

/**
 * Initialiser le dashboard admin
 */
export async function initAdminDashboard() {
    logger.info('📊 Initialisation du dashboard admin avancé');
    
    // Afficher loading
    showLoadingState();
    
    try {
        // Charger toutes les statistiques
        await Promise.all([
            loadGlobalStats(),
            loadTopUsers(),
            loadRecentActivity(),
            loadModuleStats()
        ]);
        
        // Créer les graphiques
        createCharts();
        
        // Initialiser les event listeners
        initEventListeners();
        
        hideLoadingState();
        toast.success('Dashboard chargé avec succès !', 3000);
        
    } catch (error) {
    logger.error('❌ Erreur chargement dashboard:', error);
        hideLoadingState();
        toast.error('Erreur lors du chargement du dashboard', 4000);
    }
}

/**
 * Charger les statistiques globales
 * ✅ P1-2: Utilise Cloud Function si disponible, sinon fallback sur code client
 */
async function loadGlobalStats() {
    try {
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour globalStats
        let globalStats = stateManager.get('globalStats');
        
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            logger.info('📊 Mode démo : Chargement des statistiques simulées...');
            globalStats = MOCK_DATA.stats;
            stateManager.set('globalStats', globalStats);
            renderGlobalStats();
            logger.info('✅ Statistiques simulées chargées:', globalStats);
            return;
        }
        
        logger.info('📈 Chargement des statistiques globales...');
        
        // ✅ P0 CRITIQUE: Récupérer le clientId pour isolation multi-tenant
        const clientId = await getCurrentClientId();
        
        // ✅ P1-2: Essayer d'utiliser la Cloud Function en premier
        try {
            const getGlobalStatsFunction = httpsCallable(functions, 'getGlobalStats');
            const result = await getGlobalStatsFunction({ clientId });
            
            if (result.data && result.data.success) {
                logger.info('✅ Statistiques chargées via Cloud Function');
                globalStats = result.data.stats;
                stateManager.set('globalStats', globalStats);
                renderGlobalStats();
                return;
            }
        } catch (cloudFunctionError) {
            // Si la Cloud Function n'est pas disponible ou échoue, utiliser le fallback
            logger.warn('⚠️ Cloud Function non disponible, utilisation du fallback:', cloudFunctionError.message);
        }
        
        // ✅ FALLBACK: Utiliser le code client existant si Cloud Function non disponible
        // ✅ P1 OPTIMISATION: Utiliser les services existants qui optimisent déjà les requêtes
        const { getUsersStats } = await import('./firestore-service.js');
        const { getQuestionsStats } = await import('./firestore-service.js');
        
        // ✅ P1 OPTIMISATION: Utiliser getUsersStats() qui calcule déjà les stats utilisateurs efficacement
        const usersStats = await getUsersStats();
        globalStats.totalUsers = usersStats.total || 0;
        globalStats.activeUsersToday = usersStats.activeLastWeek || 0; // Approximation (sera amélioré avec Cloud Function)
        globalStats.activeUsersWeek = usersStats.activeLastWeek || 0;
        
        // ✅ P1 OPTIMISATION: Utiliser les stats agrégées des utilisateurs pour totalQuizzes et avgScore
        globalStats.totalQuizzes = usersStats.totalQuizzes || 0;
        globalStats.avgScore = usersStats.averageScore || 0;
        
        // ✅ P1 OPTIMISATION: Utiliser getQuestionsStats() pour les questions
        const questionsStats = await getQuestionsStats();
        globalStats.totalQuestions = questionsStats.total || 0;
        
        // Compter les ressources (filtrées par clientId) - Limiter à 1000 pour éviter les coûts
        const resourcesQuery = query(
            collection(db, 'resources'), 
            where('clientId', '==', clientId),
            limit(1000) // ✅ P1 OPTIMISATION: Limiter pour éviter les coûts excessifs
        );
        const resourcesSnapshot = await getDocs(resourcesQuery);
        globalStats.totalResources = resourcesSnapshot.size;
        
        // ✅ P1 OPTIMISATION: Calculer les quiz aujourd'hui/semaine avec requête limitée (30 derniers jours)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentQuizzesQuery = query(
            collection(db, 'quizResults'),
            where('clientId', '==', clientId),
            where('completedAt', '>=', Timestamp.fromDate(thirtyDaysAgo)),
            orderBy('completedAt', 'desc'),
            limit(1000) // ✅ P1 OPTIMISATION: Limiter à 1000 résultats récents
        );
        const recentQuizzesSnapshot = await getDocs(recentQuizzesQuery);
        
        // Calculer les quiz aujourd'hui et cette semaine depuis les résultats récents uniquement
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        let quizzesToday = 0;
        let quizzesWeek = 0;
        recentQuizzesSnapshot.forEach(doc => {
            const completedAt = doc.data().completedAt?.toDate();
            if (completedAt) {
                if (completedAt >= today) {
                    quizzesToday++;
                }
                if (completedAt >= weekAgo) {
                    quizzesWeek++;
                }
            }
        });
        globalStats.quizzesToday = quizzesToday;
        globalStats.quizzesWeek = quizzesWeek;
        
        // ✅ CORRECTION SECTION 5 : StateManager - Sauvegarder globalStats dans StateManager
        stateManager.set('globalStats', globalStats);
        
        // Afficher les statistiques
        renderGlobalStats();
        
        logger.info('✅ Statistiques globales chargées (fallback):', globalStats);
        
    } catch (error) {
        logger.error('❌ Erreur chargement stats globales:', error);
        throw error;
    }
}

/**
 * Charger le top 10 des utilisateurs
 */
async function loadTopUsers() {
    try {
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            logger.info('🏆 Mode démo : Chargement du top 10 simulé...');
            renderTopUsers(MOCK_DATA.topUsers);
            logger.info('✅ Top 10 simulé chargé');
            return;
        }
        
    logger.info('🏆 Chargement du top 10 utilisateurs...');
        
        // ✅ P1 OPTIMISATION: Utiliser getLeaderboard() qui filtre déjà par clientId et utilise les stats agrégées
        const { getLeaderboard } = await import('./firestore-service.js');
        const topUsers = await getLeaderboard(10);
        
        // Transformer le format pour compatibilité avec renderTopUsers()
        const formattedTopUsers = topUsers.map((user, index) => ({
            id: user.uid || `user-${index}`,
            email: user.email || '',
            displayName: user.displayName || 'Utilisateur',
            totalQuizzes: user.totalQuizzes || 0,
            averageScore: user.averageScore || 0
        }));
        
        // Afficher le top 10
        renderTopUsers(formattedTopUsers);
        
    logger.info('✅ Top 10 utilisateurs chargé:', topUsers);
        
    } catch (error) {
    logger.error('❌ Erreur chargement top users:', error);
        throw error;
    }
}

/**
 * Charger l'activité récente
 */
async function loadRecentActivity() {
    try {
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            logger.info('📅 Mode démo : Chargement de l\'activité simulée...');
            renderRecentActivity(MOCK_DATA.recentActivity);
            logger.info('✅ Activité simulée chargée');
            return;
        }
        
    logger.info('📅 Chargement de l\'activité récente...');
        
        // Récupérer les 10 derniers quiz complétés
        const q = query(
            collection(db, 'quizResults'),
            orderBy('completedAt', 'desc'),
            limit(10)
        );
        
        const snapshot = await getDocs(q);
        const activities = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            activities.push({
                id: doc.id,
                userName: data.userName || 'Utilisateur',
                module: data.module || 'Module',
                score: data.score || 0,
                completedAt: data.completedAt?.toDate() || new Date()
            });
        });
        
        // Afficher l'activité
        renderRecentActivity(activities);
        
    logger.info('✅ Activité récente chargée:', activities);
        
    } catch (error) {
    logger.error('❌ Erreur chargement activité:', error);
        throw error;
    }
}

/**
 * Charger les statistiques par module
 * ✅ P1-2: Utilise Cloud Function si disponible, sinon fallback sur code client
 */
async function loadModuleStats() {
    try {
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            logger.info('📊 Mode démo : Chargement des stats modules simulées...');
            // Transformer les données mockées au format attendu
            const mockStats = {
                'Auto': { count: 85, totalScore: 6460, avgScore: 76 },
                'Loisir': { count: 62, totalScore: 5022, avgScore: 81 },
                'VR': { count: 54, totalScore: 3942, avgScore: 73 },
                'Tracteur': { count: 39, totalScore: 3081, avgScore: 79 }
            };
            logger.info('✅ Stats modules simulées chargées:', mockStats);
            return mockStats;
        }
        
        logger.info('📊 Chargement des stats par module...');
        
        // ✅ P0 CRITIQUE: Filtrer par clientId
        const clientId = await getCurrentClientId();
        
        // ✅ P1-2: Essayer d'utiliser la Cloud Function en premier
        try {
            const getModuleStatsFunction = httpsCallable(functions, 'getModuleStats');
            const result = await getModuleStatsFunction({ clientId });
            
            if (result.data && result.data.success) {
                logger.info('✅ Stats par module chargées via Cloud Function');
                return result.data.moduleStats;
            }
        } catch (cloudFunctionError) {
            // Si la Cloud Function n'est pas disponible ou échoue, utiliser le fallback
            logger.warn('⚠️ Cloud Function non disponible, utilisation du fallback:', cloudFunctionError.message);
        }
        
        // ✅ FALLBACK: Utiliser le code client existant si Cloud Function non disponible
        const resultsQuery = query(collection(db, 'quizResults'), where('clientId', '==', clientId));
        const resultsSnapshot = await getDocs(resultsQuery);
        const moduleStats = {};
        
        resultsSnapshot.forEach(doc => {
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
        Object.values(moduleStats).forEach(stat => {
            stat.avgScore = Math.round(stat.totalScore / stat.count);
        });
        
        logger.info('✅ Stats par module chargées (fallback):', moduleStats);
        return moduleStats;
        
    } catch (error) {
        logger.error('❌ Erreur chargement stats modules:', error);
        throw error;
    }
}

/**
 * Afficher les statistiques globales
 */
function renderGlobalStats() {
    const container = document.getElementById('global-stats-cards');
    if (!container) return;
    
    // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour globalStats
    const globalStats = stateManager.get('globalStats');
    
    container.innerHTML = `
        <!-- Total Utilisateurs -->
        <div class="bg-ap-gradient-primary rounded-xl p-6 text-white shadow-ap-lg hover:shadow-ap-xl transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Total</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${escapeHtml(String(globalStats.totalUsers))}</h3>
            <p class="text-white/90 text-sm font-medium">Utilisateurs inscrits</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${globalStats.activeUsersToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${globalStats.activeUsersWeek} cette semaine</span>
            </div>
        </div>
        
        <!-- Total Quiz -->
        <div class="bg-ap-gradient-success rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Complétés</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${globalStats.totalQuizzes}</h3>
            <p class="text-white/90 text-sm font-medium">Quiz réalisés</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${globalStats.quizzesToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${globalStats.quizzesWeek} cette semaine</span>
            </div>
        </div>
        
        <!-- Score Moyen -->
        <div class="bg-ap-gradient-silver rounded-xl p-6 text-white shadow-ap-silver-lg hover:shadow-ap-silver transition-all" style="background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Moyenne</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${globalStats.avgScore}%</h3>
            <p class="text-white/90 text-sm font-medium">Score moyen global</p>
            <div class="mt-3">
                <div class="bg-white/20 rounded-full h-2.5">
                    <div class="bg-white rounded-full h-2.5 shadow-lg" style="width: ${globalStats.avgScore}%"></div>
                </div>
            </div>
        </div>
        
        <!-- Total Questions -->
        <div class="bg-ap-gradient-accent rounded-xl p-6 text-white shadow-ap-accent-lg hover:shadow-ap-accent transition-all" style="background: linear-gradient(135deg, #718096 0%, #4A5568 100%);">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Base</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${globalStats.totalQuestions}</h3>
            <p class="text-white/90 text-sm font-medium">Questions disponibles</p>
            <div class="mt-3 text-xs">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📚 ${globalStats.totalResources} ressources</span>
            </div>
        </div>
    `;
}

/**
 * Afficher le top 10 utilisateurs
 */
function renderTopUsers(users) {
    const container = document.getElementById('top-users-list');
    if (!container) return;
    
    if (users.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-8 text-slate-500';
        empty.innerHTML = `
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="font-medium">Aucun utilisateur</p>
        `;
        container.replaceChildren(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    users.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const bgColor = index === 0 ? 'bg-ap-gold-light border-ap-gold' :
            index === 1 ? 'bg-slate-50 border-slate-300' :
            index === 2 ? 'bg-ap-warning-light border-ap-warning' :
            'bg-white border-slate-200';
    const rawUserName = user.userName || user.displayName || user.email || 'Utilisateur';
    const userName = escapeHtml(rawUserName);
        const totalQuizzes = Number.isFinite(user.totalQuizzes) ? user.totalQuizzes : 0;
        const avgScore = Number.isFinite(user.avgScore) ? user.avgScore : 0;

    const card = document.createElement('article');
        card.className = `flex items-center justify-between p-4 rounded-lg border ${bgColor} hover:shadow-md transition-shadow`;
        card.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-2xl font-bold w-8">${escapeHtml(medal)}</span>
                <div>
                    <h4 class="font-semibold text-slate-900">${userName}</h4>
                    <p class="text-sm text-slate-600">${escapeHtml(`${totalQuizzes} quiz complétés`)}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-ap-success">${escapeHtml(`${avgScore}%`)}</div>
                <div class="text-xs text-slate-500">Score moyen</div>
            </div>
        `;
        fragment.appendChild(card);
    });

    container.replaceChildren(fragment);
}

/**
 * Afficher l'activité récente
 */
function renderRecentActivity(activities) {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;
    
    if (activities.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-center py-8 text-slate-500';
        empty.innerHTML = `
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="font-medium">Aucune activité récente</p>
        `;
        container.replaceChildren(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    activities.forEach(activity => {
    const rawTimeAgo = getTimeAgo(activity.completedAt);
    const timeAgo = escapeHtml(rawTimeAgo);
        const scoreColor = activity.score >= 80 ? 'text-green-600' :
            activity.score >= 60 ? 'text-yellow-600' :
            'text-red-600';
    const rawUserName = activity.userName || 'Utilisateur';
    const userName = escapeHtml(rawUserName);
    const moduleName = escapeHtml(activity.module || 'Module');
        const scoreDisplay = escapeHtml(`${Number.isFinite(activity.score) ? activity.score : 0}%`);
    const avatarInitial = escapeHtml(rawUserName.charAt(0).toUpperCase());

        const row = document.createElement('article');
        row.className = 'flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors';
        row.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ap-red-100 rounded-full flex items-center justify-center">
                    <span class="text-lg font-bold text-ap-red-primary">${avatarInitial}</span>
                </div>
                <div>
                    <p class="font-medium text-slate-900">${userName}</p>
                    <p class="text-sm text-slate-600">${moduleName}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold ${scoreColor}">${scoreDisplay}</div>
                <div class="text-xs text-slate-500">${timeAgo}</div>
            </div>
        `;
        fragment.appendChild(row);
    });

    container.replaceChildren(fragment);
}

/**
 * Créer les graphiques Chart.js
 */
function createCharts() {
    // Graphique de progression (Line Chart)
    createProgressChart();
    
    // Graphique par modules (Doughnut Chart)
    createModulesChart();
    
    // Graphique d'activité (Bar Chart)
    createActivityChart();
}

/**
 * Créer le graphique de progression
 */
async function createProgressChart() {
    const canvas = document.getElementById('chart-progress');
    if (!canvas) return;
    
    try {
        let labels, counts, avgScores;
        
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            logger.info('📈 Mode démo : Création graphique progression simulé...');
            
            // Générer 30 jours de données mockées
            labels = [];
            counts = [];
            avgScores = [];
            
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
                
                // Données aléatoires mais cohérentes
                counts.push(Math.floor(Math.random() * 15) + 5);
                avgScores.push(Math.floor(Math.random() * 20) + 70);
            }
        } else {
            // Mode Firebase normal
            // Récupérer les quiz des 30 derniers jours
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            // ✅ P0 CRITIQUE: Filtrer par clientId
            const clientId = await getCurrentClientId();
            const resultsQuery = query(collection(db, 'quizResults'), where('clientId', '==', clientId));
            const resultsSnapshot = await getDocs(resultsQuery);
            const dailyData = {};
            
            // Initialiser les 30 derniers jours
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                dailyData[dateStr] = { count: 0, totalScore: 0 };
            }
            
            // Compter les quiz par jour
            resultsSnapshot.forEach(doc => {
                const data = doc.data();
                const completedAt = data.completedAt?.toDate();
                if (completedAt && completedAt >= thirtyDaysAgo) {
                    const dateStr = completedAt.toISOString().split('T')[0];
                    if (dailyData[dateStr]) {
                        dailyData[dateStr].count++;
                        dailyData[dateStr].totalScore += data.score || 0;
                    }
                }
            });
            
            // Préparer les données pour le graphique
            labels = Object.keys(dailyData).reverse().map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            });
            
            counts = Object.values(dailyData).reverse().map(d => d.count);
            avgScores = Object.values(dailyData).reverse().map(d => 
                d.count > 0 ? Math.round(d.totalScore / d.count) : 0
            );
        }
        
        // Créer le graphique
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour chartProgress
        const existingChart = stateManager.get('chartProgress');
        if (existingChart) existingChart.destroy();
        
        const chartProgress = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Quiz complétés',
                        data: counts,
                        borderColor: 'rgb(196, 30, 58)',          // Rouge Avantage Plus
                        backgroundColor: 'rgba(196, 30, 58, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y',
                        pointBackgroundColor: 'rgb(196, 30, 58)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Score moyen (%)',
                        data: avgScores,
                        borderColor: 'rgb(212, 175, 55)',        // Doré Avantage Plus
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1',
                        pointBackgroundColor: 'rgb(212, 175, 55)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Nombre de quiz'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Score moyen (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Évolution sur 30 jours'
                    }
                }
            }
        });
        
        // ✅ CORRECTION SECTION 5 : StateManager - Sauvegarder chartProgress dans StateManager
        stateManager.set('chartProgress', chartProgress);
        
    } catch (error) {
    logger.error('❌ Erreur création graphique progression:', error);
    }
}

/**
 * Créer le graphique par modules
 */
async function createModulesChart() {
    const canvas = document.getElementById('chart-modules');
    if (!canvas) return;
    
    try {
        const moduleStats = await loadModuleStats();
        
        const labels = Object.keys(moduleStats);
        const data = Object.values(moduleStats).map(s => s.count);
        
        const colors = [
            'rgba(196, 30, 58, 0.9)',     // Rouge Avantage Plus
            'rgba(212, 175, 55, 0.9)',    // Doré Avantage Plus
            'rgba(40, 167, 69, 0.9)',     // Vert succès
            'rgba(255, 159, 67, 0.9)',    // Orange pêche
            'rgba(139, 20, 41, 0.9)'      // Rouge foncé AP
        ];
        
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour chartModules
        const existingChartModules = stateManager.get('chartModules');
        if (existingChartModules) existingChartModules.destroy();
        
        const chartModules = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Répartition par module'
                    }
                }
            }
        });
        
        // ✅ CORRECTION SECTION 5 : StateManager - Sauvegarder chartModules dans StateManager
        stateManager.set('chartModules', chartModules);
        
    } catch (error) {
    logger.error('❌ Erreur création graphique modules:', error);
    }
}

/**
 * Créer le graphique d'activité
 */
async function createActivityChart() {
    const canvas = document.getElementById('chart-activity');
    if (!canvas) return;
    
    try {
        // Activité des 7 derniers jours
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 20) + 5); // Données de démo
        }
        
        // ✅ CORRECTION : Utiliser StateManager pour chartActivity
        const existingChart = stateManager.get('chartActivity');
        if (existingChart) existingChart.destroy();
        
        const chartActivity = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Utilisateurs actifs',
                    data: data,
                    backgroundColor: 'rgba(196, 30, 58, 0.8)',  // Rouge Avantage Plus
                    borderColor: 'rgb(196, 30, 58)',
                    borderWidth: 2,
                    borderRadius: 4,
                    hoverBackgroundColor: 'rgba(196, 30, 58, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Activité des 7 derniers jours'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            }
        });
        
        // ✅ CORRECTION SECTION 5 : StateManager - Sauvegarder chartActivity dans StateManager
        stateManager.set('chartActivity', chartActivity);
        
    } catch (error) {
    logger.error('❌ Erreur création graphique activité:', error);
    }
}

/**
 * Exporter en PDF
 */
export async function exportToPDF() {
    const loadingToast = toast.showLoadingToast('Génération du PDF...');
    
    try {
        // Importer jsPDF dynamiquement
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Titre
        doc.setFontSize(20);
        doc.text('Dashboard Admin - QuizPro', 20, 20);
        
        // Date
        doc.setFontSize(10);
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
        
        // Statistiques globales
        doc.setFontSize(14);
        doc.text('Statistiques Globales', 20, 45);
        
        doc.setFontSize(10);
        let y = 55;
        doc.text(`Total Utilisateurs: ${globalStats.totalUsers}`, 25, y);
        y += 7;
        doc.text(`Total Quiz: ${globalStats.totalQuizzes}`, 25, y);
        y += 7;
        doc.text(`Score Moyen: ${globalStats.avgScore}%`, 25, y);
        y += 7;
        doc.text(`Questions: ${globalStats.totalQuestions}`, 25, y);
        y += 7;
        doc.text(`Ressources: ${globalStats.totalResources}`, 25, y);
        
        // Sauvegarder
        doc.save(`dashboard-admin-${new Date().toISOString().split('T')[0]}.pdf`);
        
        toast.updateLoadingToast(loadingToast, 'PDF généré avec succès !', 'success');
        
    } catch (error) {
        logger.error('❌ Erreur export PDF:', error);
        toast.updateLoadingToast(loadingToast, 'Erreur d\'export PDF', 'error');
        toast.error('Erreur: Assurez-vous que jsPDF est chargé', 4000);
    }
}

/**
 * Exporter en CSV avancé
 */
export async function exportToAdvancedCSV() {
    const loadingToast = toast.showLoadingToast('Génération du CSV...');
    
    try {
        // ✅ P0 CRITIQUE: Filtrer par clientId
        const clientId = await getCurrentClientId();
        const resultsQuery = query(collection(db, 'quizResults'), where('clientId', '==', clientId));
        const resultsSnapshot = await getDocs(resultsQuery);
        
        const headers = ['Date', 'Utilisateur', 'Module', 'Mois', 'Année', 'Score (%)', 'Bonnes réponses', 'Total questions', 'Temps (s)'];
        const rows = [];
        
        resultsSnapshot.forEach(doc => {
            const data = doc.data();
            const date = data.completedAt?.toDate().toLocaleString('fr-FR') || 'N/A';
            
            rows.push([
                date,
                data.userName || 'Inconnu',
                data.module || 'N/A',
                data.month || 'N/A',
                data.year || 'N/A',
                data.score || 0,
                data.correctAnswers || 0,
                data.totalQuestions || 0,
                data.timeSpent || 0
            ]);
        });
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `dashboard-complet-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast.updateLoadingToast(loadingToast, 'CSV généré avec succès !', 'success');
        
    } catch (error) {
        logger.error('❌ Erreur export CSV:', error);
        toast.updateLoadingToast(loadingToast, 'Erreur d\'export CSV', 'error');
        toast.error('Erreur lors de l\'export CSV', 4000);
    }
}

/**
 * Initialiser les event listeners
 */
function initEventListeners() {
    // Boutons d'export
    document.getElementById('export-pdf-btn')?.addEventListener('click', exportToPDF);
    document.getElementById('export-csv-btn')?.addEventListener('click', exportToAdvancedCSV);
    
    // Filtres de période (à implémenter)
    document.getElementById('period-filter')?.addEventListener('change', handlePeriodChange);
    
    // Rafraîchir
    document.getElementById('refresh-dashboard-btn')?.addEventListener('click', () => {
        toast.info('Actualisation du dashboard...', 2000);
        initAdminDashboard();
    });
}

/**
 * Gérer le changement de période
 */
async function handlePeriodChange(e) {
    const period = e.target.value;
    toast.info(`Filtrage: ${period}`, 2000);
    // TODO: Filtrer les données selon la période
}

// ✅ CORRECTION SECTION 4 : Fonction escapeHtml() supprimée - Utiliser celle de security.js

/**
 * Afficher l'état de chargement
 */
function showLoadingState() {
    // Skeletons pour les stats
    const statsContainer = document.getElementById('global-stats-cards');
    if (statsContainer) {
        showSkeleton('global-stats-cards', createStatsSkeleton(4));
    }
    
    // Skeletons pour les top users
    const topUsersContainer = document.getElementById('top-users-list');
    if (topUsersContainer) {
        showSkeleton('top-users-list', createListSkeleton(10));
    }
    
    // Skeletons pour l'activité récente
    const activityContainer = document.getElementById('recent-activity-list');
    if (activityContainer) {
        showSkeleton('recent-activity-list', createListSkeleton(8));
    }
    
    // Skeletons pour les graphiques
    const progressChartContainer = document.getElementById('progress-chart');
    if (progressChartContainer) {
        progressChartContainer.innerHTML = createChartSkeleton();
    }
    
    const modulesChartContainer = document.getElementById('modules-chart');
    if (modulesChartContainer) {
        modulesChartContainer.innerHTML = createChartSkeleton();
    }
    
    const activityChartContainer = document.getElementById('activity-chart');
    if (activityChartContainer) {
        activityChartContainer.innerHTML = createChartSkeleton();
    }
}

/**
 * Cacher l'état de chargement
 */
function hideLoadingState() {
    // Les conteneurs sont mis à jour par les fonctions de rendu
}

/**
 * Temps relatif
 */
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
}
