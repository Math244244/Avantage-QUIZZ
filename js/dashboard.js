// Dashboard principal - Gestion de l'interface QuizPro

// ✅ CORRECTION FOND JAUNE: Forcer le background blanc IMMÉDIATEMENT (avant même le chargement du DOM)
(function() {
    'use strict';
    // Exécuter immédiatement, même si le DOM n'est pas encore chargé
    if (document.documentElement) {
        document.documentElement.style.setProperty('background', '#F9FAFB', 'important');
        document.documentElement.style.setProperty('background-color', '#F9FAFB', 'important');
        document.documentElement.style.setProperty('background-image', 'none', 'important');
    }
    if (document.body) {
        document.body.style.setProperty('background', '#F9FAFB', 'important');
        document.body.style.setProperty('background-color', '#F9FAFB', 'important');
        document.body.style.setProperty('background-image', 'none', 'important');
    }
    // Observer pour forcer le blanc dès que main-content existe
    const observer = new MutationObserver(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.setProperty('background', '#F9FAFB', 'important');
            mainContent.style.setProperty('background-color', '#F9FAFB', 'important');
            mainContent.style.setProperty('background-image', 'none', 'important');
        }
    });
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();

import { onAuthChange, signInWithGoogle, signOutUser, getCurrentUserUnified, showAdminUIIfAdmin } from './auth.js';
import { startQuiz } from './quiz.js';
import { 
    getUserProfile, 
    getAnnualProgress, 
    getUserQuizResults,
    updateStreak
} from './firestore-service.js';
// Import des utilitaires de mois (Section 2 - Correction logique mensuelle)
import { MONTH_NAMES, getCurrentMonthIndex, getCurrentYear, normalizeMonthFormat } from './month-utils.js';
// ✅ CORRECTION SECTION 4 : Protection XSS
import { escapeHtml } from './security.js';
// ✅ CORRECTION SECTION 5 : StateManager - Centralisation des variables globales
import { stateManager } from './state-manager.js';
// ✅ CORRECTION SECTION 9 : Analytics
import { trackPageView } from './analytics.js';

// --- CONSTANTES GLOBALES ---
// ✅ CORRECTION SECTION 2 : Utilise la date réelle au lieu d'une valeur hardcodée
const currentMonthIndex = getCurrentMonthIndex(); // 0-11, change automatiquement chaque mois
const MONTH_NAMES_IMPORTED = MONTH_NAMES; // Alias pour compatibilité

// ✅ CORRECTION SECTION 5 : StateManager - Initialiser monthsData dans le StateManager
// Données des mois (sera remplacé par les données Firebase)
stateManager.set('monthsData', MONTH_NAMES_IMPORTED.map(name => ({ name, score: null })));
stateManager.set('currentMonthIndex', currentMonthIndex);

// --- ÉLÉMENTS DOM ---
const views = {
    login: document.getElementById('login-view'),
    dashboard: document.getElementById('dashboard-view'),
    moduleSelection: document.getElementById('module-selection-view')
};

const elements = {
    modulesGrid: document.getElementById('modules-grid'),
    annualProgressBar: document.getElementById('annual-progress-bar'),
    annualProgressText: document.getElementById('annual-progress-text'),
    moduleSelectionTitle: document.getElementById('module-selection-title'),
    welcomeMessage: document.getElementById('welcome-message'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    googleSigninBtn: document.getElementById('google-signin-btn'),
    signoutLink: document.getElementById('signout-link')
};

// ✅ CORRECTION SECTION 5 : StateManager - dashboardEventDelegationAttached migré vers StateManager
stateManager.set('dashboardEventDelegationAttached', false);

// --- FONCTIONS DE NAVIGATION ---

function showView(viewId) {
    Object.values(views).forEach(view => {
        if (view) view.classList.add('view-hidden');
    });
    if (views[viewId]) {
        views[viewId].classList.remove('view-hidden');
        
        // ✅ CORRECTION FOND BEIGE/JAUNE: Forcer le background blanc sur main-content
        forceWhiteBackground();
    } else {
        console.error('❌ Vue non trouvée:', viewId);
    }
}

// ✅ Fonction dédiée pour forcer le background blanc (réutilisable)
function forceWhiteBackground() {
    // Utiliser la fonction globale si elle existe (définie dans index.html)
    if (window.forceWhiteBackground && window.forceWhiteBackground !== forceWhiteBackground) {
        window.forceWhiteBackground();
        return;
    }
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.setProperty('background', '#FFFFFF', 'important');
        mainContent.style.setProperty('background-color', '#FFFFFF', 'important');
        mainContent.style.setProperty('background-image', 'none', 'important');
    }
    
    // ✅ Forcer aussi sur body et html pour être sûr
    document.body.style.setProperty('background', '#FFFFFF', 'important');
    document.body.style.setProperty('background-color', '#FFFFFF', 'important');
    document.body.style.setProperty('background-image', 'none', 'important');
    
    document.documentElement.style.setProperty('background', '#FFFFFF', 'important');
    document.documentElement.style.setProperty('background-color', '#FFFFFF', 'important');
    document.documentElement.style.setProperty('background-image', 'none', 'important');
    
    // ✅ Supprimer toutes les classes Tailwind qui pourraient ajouter un background
    if (mainContent) {
        mainContent.classList.remove('bg-slate-100', 'bg-gray-100', 'bg-yellow-50', 'bg-amber-50', 'bg-ap-red-50');
    }
    document.body.classList.remove('bg-slate-100', 'bg-gray-100', 'bg-yellow-50', 'bg-amber-50', 'bg-ap-red-50');
    document.documentElement.classList.remove('bg-slate-100', 'bg-gray-100', 'bg-yellow-50', 'bg-amber-50', 'bg-ap-red-50');
}

function updateActiveNavLink(navId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-ap-accent', 'text-white');
        link.classList.add('text-ap-silver');
    });
    const activeLink = document.getElementById(navId);
    if (activeLink) {
        activeLink.classList.add('bg-ap-accent', 'text-white');
        activeLink.classList.remove('text-ap-silver');
    }
}

// --- FONCTIONS DE GÉNÉRATION DE CARTES ---

function createProgressRing(percentage) {
    const r = 54;
    const c = r * 2 * Math.PI;
    const offset = c - (percentage / 100) * c;

    let progressColorClass = 'text-green-600';
    if (percentage < 80) progressColorClass = 'text-yellow-500';
    if (percentage < 60) progressColorClass = 'text-red-600';
    
    return `
        <svg class="w-32 h-32" viewBox="0 0 120 120">
            <circle class="text-gray-200" stroke-width="12" stroke="currentColor" fill="transparent" r="${r}" cx="60" cy="60" />
            <circle
                class="progress-circle ${progressColorClass} transition-all duration-500"
                stroke-width="12"
                stroke-dasharray="${c}"
                stroke-dashoffset="${offset}"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="${r}"
                cx="60"
                cy="60"
                transform="rotate(-90 60 60)"
                style="stroke-dashoffset: 283;"
            />
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="text-3xl font-bold fill-current text-slate-800">
                ${percentage}%
            </text>
        </svg>
    `;
}

function createCompletedCard(month, score) {
    // ✅ AVANTAGE PLUS: Cartes complétées en doré/vert
    const getScoreStyle = (score) => {
        if (score >= 90) return { 
            badgeText: '🏆 Excellent'
        };
        if (score >= 75) return { 
            badgeText: '⭐ Très bien'
        };
        if (score >= 60) return { 
            badgeText: '✓ Bien'
        };
        return { 
            badgeText: '✓ Passable'
        };
    };
    
    const style = getScoreStyle(score);
    // ✅ CORRECTION SECTION 4 : Protection XSS - Échapper les données utilisateur
    const safeMonth = escapeHtml(month);
    const safeScore = escapeHtml(score);
    
    return `
        <div class="module-card module-card--completed">
            <div class="module-card-header">
                <div class="module-card-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="module-card-badge">${style.badgeText}</div>
            </div>
            <h3 class="module-card-title">${safeMonth}</h3>
            <p class="module-card-subtitle">Quiz complété</p>
            <p class="module-card-progress-label">Score obtenu</p>
            <div class="module-card-progress-bar">
                <div class="module-card-progress-fill" style="width: ${safeScore}%"></div>
            </div>
            <span class="text-sm font-semibold text-ap-red-dark">Score: ${safeScore}%</span>
        </div>
    `;
}

function createLockedCard(month) {
    // ✅ AVANTAGE PLUS: Cartes verrouillées en gris
    const safeMonth = escapeHtml(month);
    
    return `
        <div class="module-card module-card--locked">
            <div class="module-card-header">
                <div class="module-card-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div class="module-card-badge">VERROUILLÉ</div>
            </div>
            <h3 class="module-card-title">${safeMonth}</h3>
            <p class="module-card-subtitle">Disponible le 1er du mois</p>
            <p class="module-card-progress-label">Progression</p>
            <div class="module-card-progress-bar">
                <div class="module-card-progress-fill" style="width: 0%"></div>
            </div>
            <span class="text-sm text-ap-gray-600">Pas encore accessible</span>
        </div>
    `;
}

function createIncompleteCard(month) {
    // ✅ AVANTAGE PLUS: Cartes incomplètes en argent/anthracite
    const safeMonth = escapeHtml(month);
    
    return `
        <div class="module-card module-card--incomplete">
            <div class="module-card-header">
                <div class="module-card-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="module-card-badge">À COMPLÉTER</div>
            </div>
            <h3 class="module-card-title">${safeMonth}</h3>
            <p class="module-card-subtitle">Mois manqué - Rattrapez-le !</p>
            <p class="module-card-progress-label">Progression</p>
            <div class="module-card-progress-bar">
                <div class="module-card-progress-fill" style="width: 0%"></div>
            </div>
            <span class="text-sm font-semibold text-ap-accent-medium">0% complété</span>
        </div>
    `;
}

function createActiveCard(month) {
    // ✅ AVANTAGE PLUS: Carte active en rouge/doré
    const safeMonth = escapeHtml(month);
    
    return `
        <div class="module-card module-card--active">
            <div class="module-card-header">
                <div class="module-card-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <div class="module-card-badge">EN COURS</div>
            </div>
            <h3 class="module-card-title">${safeMonth}</h3>
            <p class="module-card-subtitle">Prêt à être complété !</p>
            <p class="module-card-progress-label">Progression</p>
            <div class="module-card-progress-bar">
                <div class="module-card-progress-fill" style="width: 0%"></div>
            </div>
            <button class="start-quiz-button btn-primary w-full mt-2 flex items-center justify-center gap-2">
                <span>Démarrer</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </button>
        </div>
    `;
}

function createHeroCard(month, completedCount) {
    // ✅ HERO CARD: Carte principale avec progression annuelle intégrée
    const safeMonth = escapeHtml(month);
    const annualProgressPercent = (completedCount / 12) * 100;
    
    return `
        <div class="module-card module-card--active" style="grid-column: 1 / -1;">
            <div class="module-card-header">
                <div class="module-card-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <div class="module-card-badge">QUIZ MENSUEL DISPONIBLE</div>
            </div>
            <div style="display: flex; flex-direction: row; gap: 24px; align-items: flex-start;">
                <div style="flex: 1;">
                    <h3 class="module-card-title">Quiz de ${safeMonth}</h3>
                    <p class="module-card-subtitle">Votre module mensuel est prêt. Relevez le défi et améliorez vos compétences !</p>
                    <button class="start-quiz-button btn-primary w-full mt-4 flex items-center justify-center gap-2" style="max-width: 300px;">
                        <span>Démarrer le quiz</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </button>
                </div>
                <div style="min-width: 200px; text-align: center; background: rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 16px;">
                    <p style="color: #F9FAFB; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
                        Progression Annuelle
                    </p>
                    <div style="background: rgba(255, 255, 255, 0.2); border-radius: 9999px; height: 16px; margin-bottom: 12px; overflow: hidden;">
                        <div id="annual-progress-bar" style="background: #FFFFFF; height: 100%; border-radius: 9999px; transition: width 0.5s; width: ${annualProgressPercent}%;"></div>
                    </div>
                    <p id="annual-progress-text" style="color: #FFFFFF; font-size: 2rem; font-weight: 900; line-height: 1; margin-bottom: 4px;">${completedCount}/12</p>
                    <p style="color: #F9FAFB; font-size: 0.75rem; margin: 0;">modules complétés</p>
                </div>
            </div>
        </div>
    `;
}

// --- INITIALISATION DU DASHBOARD ---

function calculateStreak() {
    // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
    const monthsData = stateManager.get('monthsData');
    let streak = 0;
    for (let i = currentMonthIndex - 1; i >= 0; i--) {
        if (monthsData[i].score !== null && monthsData[i].score >= 60) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

// Charger les données Firebase pour le dashboard
async function loadDashboardData() {
    try {
        const user = getCurrentUserUnified();
        if (!user) {
            console.log('ℹ️ Aucun utilisateur - pas de données à charger');
            return;
        }
        
        console.log('📊 Chargement des données du dashboard...');
        
        // Charger le profil utilisateur
        const userProfile = await getUserProfile(user.uid);
        
        // Afficher l'interface admin si l'utilisateur est admin
        if (userProfile) {
            await showAdminUIIfAdmin(userProfile);
        }
        
        // Charger la progression annuelle
        const progress = await getAnnualProgress(user.uid);
        console.log('📊 Progression annuelle récupérée:', progress);
        
        // Mettre à jour monthsData avec les vraies données
        // ✅ CORRECTION SECTION 2 : Normaliser le format du mois pour garantir la correspondance
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        const currentYear = getCurrentYear();
        let monthsData = stateManager.get('monthsData');
        monthsData = monthsData.map((month, index) => {
            // Normaliser le format du mois pour garantir la correspondance
            const monthKey = normalizeMonthFormat(month.name, currentYear);
            if (progress[monthKey]) {
                console.log(`✅ Mois ${month.name} (${monthKey}): score = ${progress[monthKey].score}`);
                return {
                    name: month.name,
                    score: progress[monthKey].score
                };
            }
            return month;
        });
        stateManager.set('monthsData', monthsData); // ✅ Sauvegarder dans le StateManager
        
        // Mettre à jour le streak
        const streak = await updateStreak(user.uid);
        const streakCountElement = document.getElementById('streak-count');
        if (streakCountElement) {
            streakCountElement.textContent = streak;
        }
        
        console.log('✅ Données du dashboard chargées');
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
    }
}

// ✅ Exporter pour permettre le rechargement depuis d'autres modules
export async function initializeDashboard() {
    if (!elements.modulesGrid) {
        console.error("❌ L'élément 'modules-grid' est introuvable.");
        return;
    }
    
    // ✅ CORRECTION FOND BEIGE/JAUNE: Forcer le background blanc au chargement
    forceWhiteBackground();
    
        // Charger les données Firebase en premier
        await loadDashboardData();
        
        elements.modulesGrid.innerHTML = '';
        let completedCount = 0;

        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        // ✅ HERO CARD: Créer la Hero Card pour le mois actif en première position
        const { getMonthlyQuizStatus } = await import('./utils/quiz-scoring.js');
        
        const currentMonthsData = stateManager.get('monthsData');
        let heroCardInserted = false;
        let activeMonthName = '';
        
        // D'abord, compter les complétés et identifier le mois actuel
        currentMonthsData.forEach((month, index) => {
            const status = getMonthlyQuizStatus(index, currentMonthIndex, month.score);
            console.log(`📅 Mois ${month.name} (index=${index}): status=${status}, score=${month.score}`);
            if (status === 'completed') {
                completedCount++;
            }
            // ✅ FIX: Toujours afficher la Hero Card pour le mois ACTUEL (index === currentMonthIndex)
            if (index === currentMonthIndex && !heroCardInserted) {
                activeMonthName = month.name;
            }
        });
        
        // ✅ FIX: Insérer la Hero Card pour le mois actuel (même si complété)
        if (activeMonthName && !heroCardInserted) {
            const heroCardHtml = createHeroCard(activeMonthName, completedCount);
            elements.modulesGrid.innerHTML = heroCardHtml;
            heroCardInserted = true;
        } else {
            elements.modulesGrid.innerHTML = '';
        }
        
        // Générer toutes les 12 cartes mensuelles (incluant le mois actuel)
        currentMonthsData.forEach((month, index) => {
            let cardHtml = '';
            const status = getMonthlyQuizStatus(index, currentMonthIndex, month.score);
            
            // ✅ Afficher TOUTES les cartes (12 mois) incluant le mois actuel
            if (status === 'active') {
                cardHtml = createActiveCard(month.name);
            } else if (status === 'completed') {
                cardHtml = createCompletedCard(month.name, month.score);
            } else if (status === 'incomplete') {
                cardHtml = createIncompleteCard(month.name);
            } else if (status === 'locked') {
                cardHtml = createLockedCard(month.name);
            }
            if (cardHtml) {
                elements.modulesGrid.innerHTML += cardHtml;
            }
        });

    // La barre de progression annuelle est maintenant dans la Hero Card
    // Mise à jour via l'ID dans la Hero Card

    // Mettre à jour le badge de série
    const streak = calculateStreak();
    const streakCountElement = document.getElementById('streak-count');
    if (streakCountElement) {
        streakCountElement.textContent = streak;
    }
    const streakBadge = document.getElementById('streak-badge');
    if (streakBadge && streak === 0) {
        streakBadge.style.display = 'none';
    }

    // Attacher les événements via délégation (une seule fois)
    initializeDashboardEventDelegation();
    
    // Créer les graphiques
    setTimeout(() => {
        createSkillsRadarChart();
        createScoresTrendChart();
        createActivityHeatmap();
    }, 500);
}

// Créer le graphique radar des compétences
function createSkillsRadarChart() {
    const ctx = document.getElementById('skills-radar-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Procédures', 'Garanties', 'Documentation', 'Inspection', 'Entretien', 'Réglementation'],
            datasets: [{
                label: 'Vos Compétences',
                data: [92, 88, 85, 90, 87, 94],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Créer le graphique de tendance des scores
function createScoresTrendChart() {
    const ctx = document.getElementById('scores-trend-chart');
    if (!ctx) return;
    
    // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
    const monthsData = stateManager.get('monthsData');
    const completedMonths = monthsData.filter((m, i) => i < currentMonthIndex);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: completedMonths.map(m => m.name),
            datasets: [{
                label: 'Score (%)',
                data: completedMonths.map(m => m.score),
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Score: ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// Créer la heatmap d'activité (style GitHub)
function createActivityHeatmap() {
    const container = document.getElementById('activity-heatmap');
    if (!container) return;
    
    const weeksInYear = 52;
    const daysInWeek = 7;
    
    let heatmapHTML = '<div class="flex gap-1">';
    
    for (let week = 0; week < weeksInYear; week++) {
        heatmapHTML += '<div class="flex flex-col gap-1">';
        for (let day = 0; day < daysInWeek; day++) {
            const dayIndex = week * daysInWeek + day;
            let intensity = 0;
            
            // Simuler des données d'activité
            if (dayIndex % 30 < 28) {
                intensity = Math.floor(Math.random() * 4) + 1;
            }
            
            const colors = [
                'bg-slate-100',
                'bg-green-200',
                'bg-green-400',
                'bg-green-600',
                'bg-green-800'
            ];
            
            heatmapHTML += `<div class="w-3 h-3 rounded-sm ${colors[intensity]}" title="Activité"></div>`;
        }
        heatmapHTML += '</div>';
    }
    
    heatmapHTML += '</div>';
    // ✅ CORRECTION SECTION 4 : Protection XSS - Le HTML généré ici ne contient pas de données utilisateur, donc safe
    container.innerHTML = heatmapHTML;
}

// Variable pour empêcher l'attachement multiple des listeners
let navigationListenersAttached = false;

function attachNavigationListeners() {
    // Éviter d'attacher les listeners plusieurs fois
    if (navigationListenersAttached) {
        return;
    }
    navigationListenersAttached = true;

    console.log('🔧 Attachement des listeners de navigation (une seule fois)...');

    // Navigation - Dashboard
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('dashboard');
        updateActiveNavLink('nav-dashboard');
    });

    // Navigation - Quiz (ouvre la sélection de modules)
    document.getElementById('nav-quiz')?.addEventListener('click', (e) => {
        e.preventDefault();
        // ✅ CORRECTION SECTION 4 : Protection XSS - Utiliser textContent (échappement automatique)
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        const monthsData = stateManager.get('monthsData');
        const activeMonth = monthsData[currentMonthIndex]?.name || 'ce mois';
        elements.moduleSelectionTitle.textContent = `Quiz de ${activeMonth}`;
        showView('moduleSelection');
        updateActiveNavLink('nav-quiz');
    });

    // Navigation - Mes Résultats (demander confirmation si un quiz est en cours)
    document.getElementById('nav-results')?.addEventListener('click', (e) => {
        e.preventDefault(); // TOUJOURS empêcher la navigation par défaut
        const target = e.currentTarget;
        if (window.__QUIZ_ACTIVE) {
            const ok = confirm('Un quiz est en cours. Voulez-vous vraiment quitter ?');
            if (ok && target && target.href) {
                // ⚠️ NOTE PERFORMANCE: Full page reload nécessaire (MPA - fichier HTML séparé)
                // Optimisation: Les assets sont déjà en cache (Service Worker)
                window.location.href = target.href;
            }
        } else {
            // Navigation normale vers la page des résultats
            if (target && target.href) {
                // ⚠️ NOTE PERFORMANCE: Full page reload nécessaire (MPA - fichier HTML séparé)
                // Optimisation: Les assets sont déjà en cache (Service Worker)
                window.location.href = target.href;
            }
        }
    });

    // Navigation - Ressources (demander confirmation si un quiz est en cours)
    document.getElementById('nav-resources')?.addEventListener('click', (e) => {
        e.preventDefault(); // TOUJOURS empêcher la navigation par défaut
        const target = e.currentTarget;
        if (window.__QUIZ_ACTIVE) {
            const ok = confirm('Un quiz est en cours. Voulez-vous vraiment quitter ?');
            if (ok && target && target.href) {
                // ⚠️ NOTE PERFORMANCE: Full page reload nécessaire (MPA - fichier HTML séparé)
                // Optimisation: Les assets sont déjà en cache (Service Worker)
                window.location.href = target.href;
            }
        } else {
            // Navigation normale vers la page des ressources
            if (target && target.href) {
                // ⚠️ NOTE PERFORMANCE: Full page reload nécessaire (MPA - fichier HTML séparé)
                // Optimisation: Les assets sont déjà en cache (Service Worker)
                window.location.href = target.href;
            }
        }
    });
    
    console.log('✅ Listeners de navigation attachés');
}

function initializeDashboardEventDelegation() {
    // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour dashboardEventDelegationAttached
    if (stateManager.get('dashboardEventDelegationAttached')) {
        return;
    }

    document.addEventListener('click', (event) => {
        const startButton = event.target.closest('.start-quiz-button');
        if (startButton) {
            event.preventDefault();
            // ✅ CORRECTION SECTION 4 : Protection XSS - Utiliser textContent (échappement automatique)
            // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
            const monthsData = stateManager.get('monthsData');
            const activeMonth = monthsData[currentMonthIndex]?.name || 'ce mois';
            elements.moduleSelectionTitle.textContent = `Quiz de ${activeMonth}`;
            showView('moduleSelection');
            updateActiveNavLink('nav-quiz');
            return;
        }

        const backButton = event.target.closest('.back-to-dashboard');
        if (backButton) {
            event.preventDefault();
            showView('dashboard');
            updateActiveNavLink('nav-dashboard');
            return;
        }

        // ✅ CORRECTION: Support des nouvelles cartes module-card-professional ET module-card
        const moduleCard = event.target.closest('.module-card, .module-card-professional, [data-module]');
        if (moduleCard) {
            event.preventDefault();
            const module = moduleCard.getAttribute('data-module');
            if (module) {
                console.log('🎯 Module sélectionné:', module);
                startQuiz(module);
            }
        }
    });

    // ✅ CORRECTION SECTION 5 : StateManager - Sauvegarder dans StateManager
    stateManager.set('dashboardEventDelegationAttached', true);
}

// --- GESTION DE L'AUTHENTIFICATION ---

function updateUserProfile(user) {
    if (user) {
        // ✅ CORRECTION SECTION 4 : Protection XSS - Utiliser textContent (échappement automatique)
        elements.userName.textContent = user.displayName || 'Utilisateur';
        elements.userAvatar.src = user.photoURL || 'https://placehold.co/100x100/667eea/e0e7ff?text=' + (user.displayName?.[0] || 'U');
        
        // Message de bienvenue personnalisé - textContent échappe automatiquement
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        const monthsData = stateManager.get('monthsData');
        const firstName = user.displayName?.split(' ')[0] || 'Utilisateur';
        const monthName = monthsData[currentMonthIndex]?.name || 'ce mois';
        elements.welcomeMessage.textContent = `Bonjour ${firstName}, prêt à relever votre défi de ${monthName} ?`;
    }
}

// --- INITIALISATION PRINCIPALE ---

// Gestion du thème (dark/light mode)
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeButton(savedTheme);
}

function updateThemeButton(theme) {
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const themeText = document.getElementById('theme-text');
    
    if (theme === 'dark') {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
        if (themeText) themeText.textContent = 'Mode Clair';
    } else {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
        if (themeText) themeText.textContent = 'Mode Sombre';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
    
    // ✅ CORRECTION ACCESSIBILITÉ : Mettre à jour aria-pressed
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const isDark = newTheme === 'dark';
        themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeBtn.setAttribute('aria-label', isDark ? 'Désactiver le mode sombre' : 'Activer le mode sombre');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ✅ CORRECTION SECTION 9 : Tracker la page vue
    trackPageView('Dashboard', '/index.html');
    console.log('🚀 Initialisation de QuizPro...');

    // Initialiser le thème
    initializeTheme();
    
    // Attacher les listeners de navigation UNE SEULE FOIS
    attachNavigationListeners();
    
    // Bouton toggle thème
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Gestion de la connexion Google
    elements.googleSigninBtn?.addEventListener('click', signInWithGoogle);
    
    elements.signoutLink?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            signOutUser();
        }
    });

    // Mode normal - Afficher l'écran de connexion
    showView('login');
    
    // Écouter les changements d'authentification Firebase
    onAuthChange((user) => {
        if (user) {
            console.log('✅ Utilisateur connecté:', user.displayName);
            updateUserProfile(user);
            
            // ✅ CORRECTION NAVIGATION: Vérifier le hash dans l'URL pour afficher la bonne vue
            const hash = window.location.hash;
            if (hash === '#quiz') {
                // Utilisateur arrive depuis un autre page avec /#quiz → Afficher sélection modules
                showView('moduleSelection');
                updateActiveNavLink('nav-quiz');
                // Mettre à jour le titre avec le mois actif
                const monthsData = stateManager.get('monthsData') || [];
                const activeMonth = monthsData[currentMonthIndex]?.name || 'ce mois';
                elements.moduleSelectionTitle.textContent = `Quiz de ${activeMonth}`;
            } else {
                // Affichage normal du dashboard
                showView('dashboard');
                updateActiveNavLink('nav-dashboard');
            }
            
            initializeDashboard();
        } else {
            console.log('👤 Aucun utilisateur connecté');
            showView('login');
        }
    });

    // ✅ CORRECTION FOND BEIGE/JAUNE: Forcer le background blanc quand l'utilisateur revient sur l'onglet
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // L'utilisateur revient sur l'onglet
            forceWhiteBackground();
        }
    });

    // ✅ CORRECTION FOND BEIGE/JAUNE: Forcer aussi au focus de la fenêtre
    window.addEventListener('focus', () => {
        forceWhiteBackground();
    });

    // ✅ CORRECTION FOND BEIGE/JAUNE: Forcer aussi au pageshow (retour navigateur)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Page chargée depuis le cache
            forceWhiteBackground();
        }
    });

    console.log('✅ QuizPro initialisé avec succès');
});
