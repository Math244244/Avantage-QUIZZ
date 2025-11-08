// Page Mes Résultats - Gestion complète des résultats et statistiques
import { db } from './firebase-config.js';
import { collection, query, where, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthChange, signOutUser } from './auth.js';
import { getUserProfile } from './firestore-service.js';
import { toast } from './toast.js';
import { logger } from './logger.js';
// ✅ CORRECTION SECTION 4 : Protection XSS - Utiliser escapeHtml centralisé
import { escapeHtml } from './security.js';
import {
    createResultSkeleton,
    createStatsSkeleton,
    createChartSkeleton,
    showSkeleton,
    hideSkeleton
} from './skeleton.js';

// État
let allResults = [];
let filteredResults = [];
let currentPage = 1;
const resultsPerPage = 10;
let progressChart = null;
let moduleChart = null;

// Configuration des modules
const moduleNames = {
    'auto': 'AT-AVE-AVEX',
    'loisir': 'VTT, Motoneige, etc.',
    'vr': 'Véhicules Récréatifs',
    'tracteur': 'Équipement Agricole'
};

const moduleColors = {
    'auto': '#C41E3A',       // Rouge Avantage Plus
    'loisir': '#D4AF37',     // Doré Avantage Plus
    'vr': '#FF9F43',         // Orange pêche
    'tracteur': '#28A745'    // Vert succès
};

const MONTH_LABELS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification Firebase
    onAuthChange(async (user) => {
        if (!user) {
            window.location.href = '/index.html';
            return;
        }
        
        updateUserInfo(user);
        
        // Vérifier si l'utilisateur est admin
        const userProfile = await getUserProfile(user.uid);
        if (userProfile && userProfile.role === 'admin') {
            document.getElementById('nav-admin-item')?.classList.remove('hidden');
            document.getElementById('admin-badge-nav')?.classList.remove('hidden');
        }
        
        await loadResults(user.uid);
    });
    
    // Événements
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('signout-link')?.addEventListener('click', handleLogout);
    document.getElementById('filter-module')?.addEventListener('change', applyFilters);
    document.getElementById('filter-period')?.addEventListener('change', applyFilters);
    document.getElementById('filter-sort')?.addEventListener('change', applyFilters);
    document.getElementById('reset-filters-btn')?.addEventListener('click', resetFilters);
    document.getElementById('prev-page-btn')?.addEventListener('click', () => changePage(-1));
    document.getElementById('next-page-btn')?.addEventListener('click', () => changePage(1));
    document.getElementById('export-results-btn')?.addEventListener('click', exportToCSV);

    const resultsList = document.getElementById('results-list');
    if (resultsList && !resultsList.dataset.eventsBound) {
        resultsList.addEventListener('click', handleResultsListClick);
        resultsList.dataset.eventsBound = 'true';
    }
});

// Mettre à jour les infos utilisateur
function updateUserInfo(user) {
    // Anciens IDs (top nav - supprimer si présents)
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').textContent = user.displayName || user.email;
    }
    if (document.getElementById('user-photo')) {
        document.getElementById('user-photo').src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}`;
    }
    
    // Nouveaux IDs (sidebar)
    if (document.getElementById('user-display-name')) {
        document.getElementById('user-display-name').textContent = user.displayName || user.email;
    }
    if (document.getElementById('user-avatar')) {
        document.getElementById('user-avatar').src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}`;
    }
}

// Charger les résultats depuis Firestore
async function loadResults(userId) {
    logger.info('📥 Chargement des résultats pour:', userId);
    
    try {
        // Afficher les skeletons pendant le chargement
        const statsContainer = document.getElementById('global-stats');
        const resultsListContainer = document.getElementById('results-list');
        const progressChartContainer = document.getElementById('progress-chart-container');
        
        if (statsContainer) {
            showSkeleton('global-stats', createStatsSkeleton(4));
        }
        if (resultsListContainer) {
            showSkeleton('results-list', createResultSkeleton(5));
        }
        if (progressChartContainer) {
            progressChartContainer.innerHTML = createChartSkeleton();
        }
        
        // 1) Requête principale sur le champ normalisé 'completedAt'
        let q = query(
            collection(db, 'quizResults'),
            where('userId', '==', userId),
            orderBy('completedAt', 'desc')
        );
        
        let querySnapshot = await getDocs(q);
        
        // 2) Fallback rétro-compatibilité: certains anciens documents n'ont que 'date'
        if (querySnapshot.empty) {
            q = query(
                collection(db, 'quizResults'),
                where('userId', '==', userId),
                orderBy('date', 'desc')
            );
            querySnapshot = await getDocs(q);
        }
        
        allResults = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            let completedAt = null;
            // Nouveau format (Timestamp Firestore)
            if (data.completedAt && typeof data.completedAt.toDate === 'function') {
                completedAt = data.completedAt.toDate();
            } else if (data.date && typeof data.date.toDate === 'function') {
                // Ancien champ 'date'
                completedAt = data.date.toDate();
            } else if (data.date && typeof data.date === 'string') {
                // Si 'date' est une string (sécurité)
                const parsed = new Date(data.date);
                if (!isNaN(parsed.getTime())) completedAt = parsed;
            }

            allResults.push({
                id: doc.id,
                ...data,
                completedAt
            });
        });
        
        logger.info(`✅ ${allResults.length} résultats chargés`);
        
        if (allResults.length === 0) {
            showNoResults();
        } else {
            filteredResults = [...allResults];
            updateUI();
        }
        
    } catch (error) {
        logger.error('❌ Erreur lors du chargement des résultats:', error);

        if (error.code === 'permission-denied') {
            toast.error('Permissions insuffisantes pour consulter vos résultats. Contactez un administrateur.');
        } else {
            toast.error('Erreur lors du chargement des résultats');
        }
        showNoResults();
    }
}

// Mettre à jour l'interface complète
function updateUI() {
    if (filteredResults.length === 0) {
        document.getElementById('results-container')?.classList.add('hidden');
        showNoResults();
        return;
    }

    document.getElementById('no-results')?.classList.add('hidden');
    updateGlobalStats();
    updateCharts();
    renderResults();
    document.getElementById('results-loading')?.classList.add('hidden');
    document.getElementById('results-container')?.classList.remove('hidden');
}

// Calculer et afficher les statistiques globales
function updateGlobalStats() {
    const statsContainer = document.getElementById('global-stats');
    
    const totalQuizzes = filteredResults.length;
    const avgScore = totalQuizzes > 0 
        ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / totalQuizzes) 
        : 0;
    const totalQuestions = filteredResults.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = filteredResults.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalTime = filteredResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
    const avgTime = totalQuizzes > 0 
        ? Math.round(totalTime / totalQuizzes) 
        : 0;
    
    // ✅ CORRECTION SECTION 4 : Protection XSS - Les valeurs numériques sont safe, mais formatTime() peut retourner du texte
    const safeAvgTime = escapeHtml(formatTime(avgTime));
    
    statsContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6 fade-in hover:shadow-lg transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-ap-red-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-ap-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500 font-medium">Quiz complétés</p>
                    <p class="text-3xl font-bold text-ap-red-primary">${totalQuizzes}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in hover:shadow-lg transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-ap-success-light flex items-center justify-center">
                    <svg class="w-6 h-6 text-ap-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500 font-medium">Score moyen</p>
                    <p class="text-3xl font-bold text-ap-success">${avgScore}%</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in hover:shadow-lg transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-ap-gold-light flex items-center justify-center">
                    <svg class="w-6 h-6 text-ap-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500 font-medium">Questions répondues</p>
                    <p class="text-3xl font-bold text-ap-gold-dark">${totalCorrect}/${totalQuestions}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in hover:shadow-lg transition-all">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-ap-warning-light flex items-center justify-center">
                    <svg class="w-6 h-6 text-ap-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500 font-medium">Temps moyen</p>
                    <p class="text-3xl font-bold text-ap-warning-dark">${safeAvgTime}</p>
                </div>
            </div>
        </div>
    `;
}

// Mettre à jour les graphiques
function updateCharts() {
    updateProgressChart();
    updateModuleChart();
}

// Graphique d'évolution des scores
function updateProgressChart() {
    const ctx = document.getElementById('progress-chart');
    if (!ctx) return;
    
    // Prendre les 10 derniers résultats
    const recentResults = [...filteredResults].reverse().slice(-10);
    
    const labels = recentResults.map((r, i) => {
        const date = r.completedAt;
        return date ? `${date.getDate()}/${date.getMonth() + 1}` : `Quiz ${i + 1}`;
    });
    
    const scores = recentResults.map(r => r.score);
    
    if (progressChart) {
        progressChart.destroy();
    }
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (%)',
                data: scores,
                borderColor: '#C41E3A',               // Rouge Avantage Plus
                backgroundColor: 'rgba(196, 30, 58, 0.1)',  // Rouge AP transparent
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#C41E3A',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: (value) => value + '%'
                    }
                }
            }
        }
    });
}

// Graphique de répartition par module
function updateModuleChart() {
    const ctx = document.getElementById('module-chart');
    if (!ctx) return;
    
    // Compter les quiz par module
    const moduleCounts = {};
    filteredResults.forEach(r => {
        moduleCounts[r.module] = (moduleCounts[r.module] || 0) + 1;
    });
    
    const labels = Object.keys(moduleCounts).map(m => moduleNames[m] || m);
    const data = Object.values(moduleCounts);
    const colors = Object.keys(moduleCounts).map(m => moduleColors[m] || '#C41E3A');
    
    if (moduleChart) {
        moduleChart.destroy();
    }
    
    moduleChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Afficher les résultats avec pagination
function renderResults() {
    const container = document.getElementById('results-list');
    if (!container) return;

    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const pageResults = filteredResults.slice(start, end);
    
    if (pageResults.length === 0) {
        container.replaceChildren();
        return;
    }

    const fragment = document.createDocumentFragment();
    pageResults.forEach(result => {
        fragment.appendChild(createResultCardElement(result));
    });
    
    container.replaceChildren(fragment);
    
    updatePagination();
}

function createResultCardElement(result) {
    const card = document.createElement('article');
    card.className = 'p-6 hover:bg-slate-50 transition-colors';
    card.dataset.resultId = result.id;

    const date = result.completedAt instanceof Date ? result.completedAt : null;
    const dateStr = date
        ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        : 'Date inconnue';

    const scoreColor = result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600';
    // ✅ CORRECTION SECTION 4 : Protection XSS - Échapper toutes les données utilisateur
    const moduleLabel = escapeHtml(moduleNames[result.module] || result.module || 'Module');
    const monthLabelRaw = result.month ? String(result.month).trim() : '';
    const yearLabelRaw = result.year ? String(result.year).trim() : '';
    const periodLabel = escapeHtml([monthLabelRaw, yearLabelRaw].filter(Boolean).join(' ').trim());
    const scoreValue = Number.isFinite(result.score) ? result.score : 0;
    const correctAnswersValue = Number.isFinite(result.correctAnswers) ? result.correctAnswers : 0;
    const totalQuestionsValue = Number.isFinite(result.totalQuestions) ? result.totalQuestions : 0;
    const scoreDisplay = escapeHtml(`${scoreValue}%`);
    const answersDisplay = escapeHtml(`${correctAnswersValue}/${totalQuestionsValue}`);
    const timeDisplay = escapeHtml(formatTime(result.timeSpent || 0));
    const dateDisplay = escapeHtml(dateStr);

    card.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-slate-900">${moduleLabel}</h3>
                    <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        ${periodLabel}
                    </span>
                </div>
                <p class="text-sm text-slate-500">${dateDisplay}</p>
            </div>
            <div class="flex items-center gap-6">
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Score</p>
                    <p class="${scoreColor} text-3xl font-bold">${scoreDisplay}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Réponses</p>
                    <p class="text-slate-700 font-semibold">${answersDisplay}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Temps</p>
                    <p class="text-slate-700 font-semibold">${timeDisplay}</p>
                </div>
                <button class="result-details-btn px-4 py-2 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all transform hover:-translate-y-0.5 font-medium shadow-sm hover:shadow-md" data-result-id="${result.id}">
                    Détails
                </button>
            </div>
        </div>
    `;

    return card;
}

function handleResultsListClick(event) {
    const button = event.target.closest('.result-details-btn');
    if (!button) {
        return;
    }

    const { resultId } = button.dataset;
    if (!resultId) {
        return;
    }

    openResultDetails(resultId);
}

// Mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages || 1}`;
    }

    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Changer de page
function changePage(direction) {
    currentPage += direction;
    renderResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Appliquer les filtres
function applyFilters() {
    const moduleFilter = document.getElementById('filter-module').value;
    const periodFilter = document.getElementById('filter-period').value;
    const sortFilter = document.getElementById('filter-sort').value;
    
    // Filtrer par module
    filteredResults = moduleFilter 
        ? allResults.filter(r => r.module === moduleFilter)
        : [...allResults];
    
    // Filtrer par période
    if (periodFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        if (periodFilter === 'week') {
            filterDate.setDate(now.getDate() - 7);
        } else if (periodFilter === 'month') {
            filterDate.setDate(now.getDate() - 30);
        } else if (periodFilter === 'year') {
            filterDate.setFullYear(now.getFullYear());
            filterDate.setMonth(0);
            filterDate.setDate(1);
        }
        
        filteredResults = filteredResults.filter(r => r.completedAt >= filterDate);
    }
    
    // Trier
    filteredResults.sort((a, b) => {
        if (sortFilter === 'date-desc') {
            return b.completedAt - a.completedAt;
        } else if (sortFilter === 'date-asc') {
            return a.completedAt - b.completedAt;
        } else if (sortFilter === 'score-desc') {
            return b.score - a.score;
        } else if (sortFilter === 'score-asc') {
            return a.score - b.score;
        }
        return 0;
    });
    
    currentPage = 1;
    updateUI();
}

// Réinitialiser les filtres
function resetFilters() {
    document.getElementById('filter-module').value = '';
    document.getElementById('filter-period').value = 'all';
    document.getElementById('filter-sort').value = 'date-desc';
    applyFilters();
}

// Exporter en CSV
function exportToCSV() {
    if (filteredResults.length === 0) {
        toast.warning('Aucun résultat à exporter');
        return;
    }
    
    const loadingToast = toast.showLoadingToast('Génération du fichier CSV...');
    
    try {
        const headers = ['Date', 'Module', 'Mois', 'Année', 'Score (%)', 'Bonnes réponses', 'Total questions', 'Temps (s)'];
        const rows = filteredResults.map(r => {
            const date = r.completedAt ? r.completedAt.toLocaleString('fr-FR') : 'N/A';
            return [
                date,
                moduleNames[r.module] || r.module,
                r.month,
                r.year,
                r.score,
                r.correctAnswers,
                r.totalQuestions,
                r.timeSpent || 0
            ];
        });
        
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mes-resultats-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        toast.updateLoadingToast(loadingToast, 'Export CSV réussi !', 'success');
        logger.info('✅ Export CSV réussi');
    } catch (error) {
        toast.updateLoadingToast(loadingToast, 'Erreur d\'export', 'error');
        toast.error('Erreur lors de l\'export CSV', 4000);
        logger.error('❌ Erreur export CSV:', error);
    }
}

// Afficher les détails d'un résultat (modal)
function openResultDetails(resultId) {
    const result = allResults.find(r => r.id === resultId);
    if (!result) {
        return;
    }

    // ✅ CORRECTION SECTION 4 : Protection XSS - Échapper toutes les données utilisateur
    const moduleLabel = escapeHtml(moduleNames[result.module] || result.module || 'Module');
    const periodLabel = escapeHtml([result.month, result.year].filter(Boolean).join(' '));
    const scoreValue = Number.isFinite(result.score) ? result.score : 0;
    const correctAnswersValue = Number.isFinite(result.correctAnswers) ? result.correctAnswers : 0;
    const totalQuestionsValue = Number.isFinite(result.totalQuestions) ? result.totalQuestions : 0;
    const timeDisplay = escapeHtml(formatTime(result.timeSpent || 0));
    const answers = Array.isArray(result.answers) ? result.answers : [];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';

    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col';
    modal.appendChild(dialog);

    const header = document.createElement('div');
    header.className = 'px-8 py-6 text-white';
    header.style.background = 'var(--ap-gradient-primary)';
    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold';
    title.textContent = 'Détails du quiz';
    const subtitle = document.createElement('p');
    subtitle.className = 'text-white opacity-90 mt-1';
    // ✅ CORRECTION SECTION 4 : Protection XSS - textContent échappe automatiquement
    subtitle.textContent = periodLabel ? `${moduleLabel} - ${periodLabel}` : moduleLabel;
    header.append(title, subtitle);
    dialog.appendChild(header);

    const body = document.createElement('div');
    body.className = 'p-8';
    dialog.appendChild(body);

    const metricsGrid = document.createElement('div');
    metricsGrid.className = 'grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8';
    body.appendChild(metricsGrid);

    const createMetricCard = (label, value, valueClass = '') => {
        const card = document.createElement('div');
        card.className = 'text-center p-4 bg-slate-50 rounded-lg';
        const labelEl = document.createElement('p');
        labelEl.className = 'text-sm text-slate-500 mb-1';
        labelEl.textContent = label;
        const valueEl = document.createElement('p');
        valueEl.className = `text-3xl font-bold ${valueClass}`.trim();
        valueEl.textContent = value;
        card.append(labelEl, valueEl);
        return card;
    };

    metricsGrid.append(
        createMetricCard('Score', `${scoreValue}%`, 'text-ap-red-primary'),
        createMetricCard('Bonnes réponses', `${correctAnswersValue}/${totalQuestionsValue}`, 'text-slate-900'),
        createMetricCard('Temps total', timeDisplay, 'text-slate-900')
    );

    if (answers.length > 0) {
        const detailTitle = document.createElement('h3');
        detailTitle.className = 'text-xl font-bold text-slate-900 mb-4';
        detailTitle.textContent = 'Réponses détaillées';
        body.appendChild(detailTitle);

        const answersContainer = document.createElement('div');
        answersContainer.className = 'space-y-3 max-h-96 overflow-y-auto';
        body.appendChild(answersContainer);

        answers.forEach((answer, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = `p-4 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`;

            const row = document.createElement('div');
            row.className = 'flex items-start gap-3';
            wrapper.appendChild(row);

            const icon = document.createElement('span');
            icon.className = 'text-2xl';
            icon.textContent = answer.isCorrect ? '✅' : '❌';
            row.appendChild(icon);

            const content = document.createElement('div');
            content.className = 'flex-1';
            row.appendChild(content);

            const questionTitle = document.createElement('p');
            questionTitle.className = 'font-semibold text-slate-900 mb-1';
            questionTitle.textContent = `Question ${index + 1}`;
            content.appendChild(questionTitle);

            const questionText = document.createElement('p');
            questionText.className = 'text-sm text-slate-700 mb-2';
            // ✅ CORRECTION SECTION 4 : Protection XSS - textContent échappe automatiquement
            questionText.textContent = answer.question || 'Question indisponible';
            content.appendChild(questionText);

            if (!answer.isCorrect) {
                const diff = document.createElement('div');
                diff.className = 'text-xs text-slate-600 space-y-1';

                const userAnswer = document.createElement('p');
                const userLabel = document.createElement('strong');
                userLabel.textContent = 'Votre réponse :';
                // ✅ CORRECTION SECTION 4 : Protection XSS - textContent échappe automatiquement
                userAnswer.append(userLabel, document.createTextNode(` ${answer.selectedAnswer || 'N/A'}`));

                const correctAnswer = document.createElement('p');
                const correctLabel = document.createElement('strong');
                correctLabel.textContent = 'Bonne réponse :';
                // ✅ CORRECTION SECTION 4 : Protection XSS - textContent échappe automatiquement
                correctAnswer.append(correctLabel, document.createTextNode(` ${answer.correctAnswer || 'N/A'}`));

                diff.append(userAnswer, correctAnswer);
                content.appendChild(diff);
            }

            const duration = document.createElement('span');
            duration.className = 'text-sm text-slate-500';
            duration.textContent = `${Number.isFinite(answer.timeSpent) ? answer.timeSpent : 0}s`;
            row.appendChild(duration);

            answersContainer.appendChild(wrapper);
        });
    } else {
        const emptyState = document.createElement('p');
        emptyState.className = 'text-slate-500 text-center py-8';
        emptyState.textContent = 'Détails des réponses non disponibles';
        body.appendChild(emptyState);
    }

    const footer = document.createElement('div');
    footer.className = 'px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end';
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-modal-btn';
    closeBtn.className = 'px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium';
    closeBtn.textContent = 'Fermer';
    footer.appendChild(closeBtn);
    dialog.appendChild(footer);

    document.body.appendChild(modal);

    const removeModal = () => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    };

    closeBtn.addEventListener('click', removeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            removeModal();
        }
    });
}

// Afficher message si aucun résultat
function showNoResults() {
    document.getElementById('results-loading')?.classList.add('hidden');
    document.getElementById('no-results')?.classList.remove('hidden');
    document.getElementById('results-container')?.classList.add('hidden');
}

// Afficher erreur
function showError(message) {
    alert(message);
    document.getElementById('results-loading')?.classList.add('hidden');
}

// Formater le temps
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ✅ CORRECTION SECTION 4 : Fonction escapeHtml() supprimée - Utiliser celle de security.js

// Déconnexion
async function handleLogout() {
    try {
        await signOutUser();
        window.location.href = '/';
    } catch (error) {
        logger.error('Erreur lors de la déconnexion:', error);
    }
}
