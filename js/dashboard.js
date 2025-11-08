// Dashboard principal - Gestion de l'interface QuizPro
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
    } else {
        console.error('❌ Vue non trouvée:', viewId);
    }
}

function updateActiveNavLink(navId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-indigo-800', 'text-indigo-100');
        link.classList.add('text-indigo-300');
    });
    const activeLink = document.getElementById(navId);
    if (activeLink) {
        activeLink.classList.add('bg-indigo-800', 'text-indigo-100');
        activeLink.classList.remove('text-indigo-300');
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
                <div class="module-card-badge">🔒 Verrouillé</div>
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
    // ✅ CORRECTION SECTION 4 : Protection XSS - Échapper les données utilisateur
    const safeMonth = escapeHtml(month);
    
    return `
        <div class="card-hover relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-sm hover:shadow-md border border-amber-200 flex flex-col items-center justify-center min-h-[260px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
            <!-- Badge à compléter -->
            <div class="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                À compléter
            </div>
            
            <!-- Icône horloge -->
            <div class="relative mb-4">
                <div class="relative bg-white p-3.5 rounded-xl shadow-md border-2 border-amber-100">
                    <svg class="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-slate-700 mb-2">${safeMonth}</h3>
            <span class="text-sm text-amber-600 text-center font-medium mb-3">Mois manqué - Rattrapez-le !</span>
            
            <!-- Barre de progression -->
            <div class="mt-3 w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full" style="width: 0%"></div>
            </div>
            <span class="mt-2 text-xs text-amber-600 font-medium">0% complété</span>
            
            <!-- Bouton au hover -->
            <button class="mt-4 opacity-0 group-hover:opacity-100 transition-all bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Compléter maintenant
            </button>
        </div>
    `;
}

function createActiveCard(month) {
    // ✅ CORRECTION SECTION 4 : Protection XSS - Échapper les données utilisateur
    const safeMonth = escapeHtml(month);
    
    return `
        <div class="card-hover relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-indigo-400/30 flex flex-col items-center justify-center min-h-[260px] ring-2 ring-indigo-400/20 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
            <!-- Effet de brillance subtil -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <!-- Badge ACTIF -->
            <span class="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
                ⚡ Actif
            </span>
            
            <!-- Icône stylo -->
            <div class="relative mb-4">
                <div class="relative bg-white/15 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                    <svg class="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-md">${safeMonth}</h3>
            <p class="text-white/90 text-sm font-medium mb-4 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">🎯 Prêt à être complété</p>
            
            <!-- Bouton CTA -->
            <button class="start-quiz-button w-full bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group/btn">
                <span class="flex items-center justify-center gap-2">
                    Démarrer le quiz
                    <svg class="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </span>
            </button>
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
        
        // Mettre à jour monthsData avec les vraies données
        // ✅ CORRECTION SECTION 2 : Normaliser le format du mois pour garantir la correspondance
        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        const currentYear = getCurrentYear();
        let monthsData = stateManager.get('monthsData');
        monthsData = monthsData.map((month, index) => {
            // Normaliser le format du mois pour garantir la correspondance
            const monthKey = normalizeMonthFormat(month.name, currentYear);
            if (progress[monthKey]) {
                return {
                    name: month.name,
                    score: progress[monthKey].score
                };
            }
            return month;
        });
        
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

async function initializeDashboard() {
    if (!elements.modulesGrid) {
        console.error("❌ L'élément 'modules-grid' est introuvable.");
        return;
    }
    
        // Charger les données Firebase en premier
        await loadDashboardData();
        
        elements.modulesGrid.innerHTML = '';
        let completedCount = 0;

        // ✅ CORRECTION SECTION 5 : StateManager - Utiliser StateManager pour monthsData
        const currentMonthsData = stateManager.get('monthsData');
        currentMonthsData.forEach((month, index) => {
        let cardHtml = '';
        if (index < currentMonthIndex) {
            // Mois passés : vérifier s'ils sont complétés ou non
            if (month.score !== null) {
                cardHtml = createCompletedCard(month.name, month.score);
                completedCount++;
            } else {
                // Mois passé mais non complété - afficher comme "à compléter"
                cardHtml = createIncompleteCard(month.name);
            }
        } else if (index === currentMonthIndex) {
            cardHtml = createActiveCard(month.name);
        } else {
            cardHtml = createLockedCard(month.name);
        }
        elements.modulesGrid.innerHTML += cardHtml;
    });

    // Mettre à jour la barre de progression annuelle
    const annualProgressPercent = (completedCount / 12) * 100;
    elements.annualProgressBar.style.width = `${annualProgressPercent}%`;
    elements.annualProgressText.textContent = `${completedCount}/12`;

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
                window.location.href = target.href;
            }
        } else {
            // Navigation normale vers la page des résultats
            if (target && target.href) {
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
                window.location.href = target.href;
            }
        } else {
            // Navigation normale vers la page des ressources
            if (target && target.href) {
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

        const moduleCard = event.target.closest('.module-card');
        if (moduleCard) {
            event.preventDefault();
            const module = moduleCard.getAttribute('data-module');
            if (module) {
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
            showView('dashboard');
            updateActiveNavLink('nav-dashboard');
            initializeDashboard();
        } else {
            console.log('👤 Aucun utilisateur connecté');
            showView('login');
        }
    });

    console.log('✅ QuizPro initialisé avec succès');
});
