// Dashboard principal - Gestion de l'interface QuizPro
import { onAuthChange, signInWithGoogle, signOutUser, getCurrentUserUnified, showAdminUIIfAdmin, isDemoMode, deactivateDemoMode } from './auth.js';
import { startQuiz } from './quiz.js';
import { 
    getUserProfile, 
    getAnnualProgress, 
    getUserQuizResults,
    updateStreak
} from './firestore-service.js';

// --- CONSTANTES GLOBALES ---
const currentMonthIndex = 10; // 0 = Jan, 10 = Nov (Novembre 2025)
const MONTH_NAMES = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Données des mois (sera remplacé par les données Firebase)
let monthsData = MONTH_NAMES.map(name => ({ name, score: null }));

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
    return `
        <div class="card-hover bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center cursor-pointer">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">${month}</h3>
            ${createProgressRing(score)}
            <span class="mt-3 text-sm font-medium text-slate-500">Score: ${score}%</span>
            <a href="#" class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">Voir les détails</a>
        </div>
    `;
}

function createLockedCard(month) {
    return `
        <div class="bg-slate-50 p-5 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[260px] opacity-70">
            <svg class="h-12 w-12 text-slate-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <h3 class="text-lg font-semibold text-slate-500">${month}</h3>
            <span class="mt-1 text-sm text-slate-400 text-center">Disponible le 1er du mois</span>
        </div>
    `;
}

function createIncompleteCard(month) {
    return `
        <div class="card-hover bg-gradient-to-br from-slate-100 to-slate-200 p-5 rounded-xl shadow-md border border-slate-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer transition-all duration-300 hover:shadow-lg">
            <svg class="h-12 w-12 text-slate-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-slate-700">${month}</h3>
            <span class="mt-2 text-sm text-slate-500 text-center">Pas encore complété</span>
            <div class="mt-3 w-full bg-slate-300 rounded-full h-2">
                <div class="bg-slate-400 h-2 rounded-full" style="width: 0%"></div>
            </div>
            <span class="mt-2 text-xs text-slate-400">0% complété</span>
        </div>
    `;
}

function createActiveCard(month) {
    return `
        <div class="card-hover relative bg-white p-5 rounded-xl shadow-2xl border-2 border-indigo-500 flex flex-col items-center justify-center min-h-[260px] ring-4 ring-indigo-500/20 cursor-pointer">
            <span class="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">ACTIF</span>
            <svg class="h-12 w-12 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <h3 class="text-xl font-bold text-slate-900">${month}</h3>
            <p class="text-slate-500 text-sm mb-4">Prêt à être complété</p>
            <button class="start-quiz-button w-full bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all">
                Démarrer le quiz
            </button>
        </div>
    `;
}

// --- INITIALISATION DU DASHBOARD ---

function calculateStreak() {
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
        
        // En mode démo, ne pas charger depuis Firestore
        if (isDemoMode()) {
            console.log('ℹ️ Mode démo - affichage des données simulées');
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
        monthsData = monthsData.map((month, index) => {
            const monthKey = `${month.name} ${new Date().getFullYear()}`;
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

    monthsData.forEach((month, index) => {
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

    // Attacher les événements
    attachDashboardEvents();
    
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
    container.innerHTML = heatmapHTML;
}

function attachDashboardEvents() {
    // Boutons "Démarrer le quiz"
    document.querySelectorAll('.start-quiz-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const activeMonth = monthsData[currentMonthIndex].name;
            elements.moduleSelectionTitle.textContent = `Quiz de ${activeMonth}`;
            showView('moduleSelection');
        });
    });

    // Boutons "Retour au dashboard"
    document.querySelectorAll('.back-to-dashboard').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showView('dashboard');
            updateActiveNavLink('nav-dashboard');
        });
    });

    // Cartes de sélection de module
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const module = card.getAttribute('data-module');
            console.log('🎯 Module sélectionné:', module);
            // Lancer l'interface du quiz
            startQuiz(module);
        });
    });

    // Navigation
    document.getElementById('nav-dashboard')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('dashboard');
        updateActiveNavLink('nav-dashboard');
    });

    // Navigation vers Quiz (ouvre la sélection de modules)
    document.getElementById('nav-quiz')?.addEventListener('click', (e) => {
        e.preventDefault();
        const activeMonth = monthsData[currentMonthIndex].name;
        elements.moduleSelectionTitle.textContent = `Quiz de ${activeMonth}`;
        showView('moduleSelection');
        updateActiveNavLink('nav-quiz');
    });

    // Navigation vers Mes Résultats (demander confirmation si un quiz est en cours)
    document.getElementById('nav-results')?.addEventListener('click', (e) => {
        const target = e.currentTarget;
        if (window.__QUIZ_ACTIVE) {
            e.preventDefault();
            const ok = confirm('Un quiz est en cours. Voulez-vous vraiment quitter ?');
            if (ok && target && target.href) {
                window.location.href = target.href;
            }
        } else {
            console.log('Navigation vers Résultats...');
        }
    });

    // Navigation vers Ressources (demander confirmation si un quiz est en cours)
    document.getElementById('nav-resources')?.addEventListener('click', (e) => {
        const target = e.currentTarget;
        if (window.__QUIZ_ACTIVE) {
            e.preventDefault();
            const ok = confirm('Un quiz est en cours. Voulez-vous vraiment quitter ?');
            if (ok && target && target.href) {
                window.location.href = target.href;
            }
        } else {
            console.log('Navigation vers Ressources...');
        }
    });
}

// --- GESTION DE L'AUTHENTIFICATION ---

function updateUserProfile(user) {
    if (user) {
        elements.userName.textContent = user.displayName || 'Utilisateur';
        elements.userAvatar.src = user.photoURL || 'https://placehold.co/100x100/667eea/e0e7ff?text=' + (user.displayName?.[0] || 'U');
        
        // Message de bienvenue personnalisé
        const firstName = user.displayName?.split(' ')[0] || 'Utilisateur';
        elements.welcomeMessage.textContent = `Bonjour ${firstName}, prêt à relever votre défi de ${monthsData[currentMonthIndex].name} ?`;
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
    console.log('🚀 Initialisation de QuizPro...');

    // Initialiser le thème
    initializeTheme();
    
    // Bouton toggle thème
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Gestion de la connexion Google
    elements.googleSigninBtn?.addEventListener('click', signInWithGoogle);
    
    elements.signoutLink?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            // Désactiver le mode démo si actif
            if (isDemoMode()) {
                deactivateDemoMode();
                // Rester dans le SPA et afficher l'écran de connexion immédiatement
                showView('login');
                updateActiveNavLink('nav-dashboard');
            } else {
                signOutUser();
            }
        }
    });

    // Vérifier si le mode démo est actif
    const demoModeActive = isDemoMode();
    
    if (demoModeActive) {
        console.log('🎨 MODE DÉMO ACTIF - Chargement du dashboard...');
        const demoUser = getCurrentUserUnified();
        if (demoUser) {
            updateUserProfile(demoUser);
            // Afficher l'UI admin en mode démo (le user possède role: 'admin')
            try { showAdminUIIfAdmin(demoUser); } catch (e) { /* no-op */ }
            showView('dashboard');
            updateActiveNavLink('nav-dashboard');
            initializeDashboard();
        } else {
            console.error('❌ Mode démo actif mais pas d\'utilisateur trouvé');
            showView('login');
        }
    } else {
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
    }

    console.log('✅ QuizPro initialisé avec succès');
});
