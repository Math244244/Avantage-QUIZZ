// Page Mes Résultats - Gestion complète des résultats et statistiques
import { db } from './firebase-config.js';
import { collection, query, where, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getCurrentUser, onAuthChange, signOutUser, isDemoMode, getDemoUser } from './auth.js';
import { toast } from './toast.js';
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
    'auto': '#6366f1',
    'loisir': '#06b6d4',
    'vr': '#f97316',
    'tracteur': '#22c55e'
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // ✅ Mode démo : Afficher badge admin si nécessaire
    if (isDemoMode()) {
        const demoUser = getDemoUser();
        if (demoUser) {
            updateUserInfo(demoUser);
            if (demoUser.role === 'admin') {
                document.getElementById('nav-admin-item')?.classList.remove('hidden');
                document.getElementById('admin-badge-nav')?.classList.remove('hidden');
            }
            await loadResults(demoUser.uid || 'demo-user');
            return;
        }
    }
    
    // Vérifier l'authentification Firebase
    onAuthChange(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        
        updateUserInfo(user);
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
    console.log('📥 Chargement des résultats pour:', userId);
    
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
        
        const q = query(
            collection(db, 'quizResults'),
            where('userId', '==', userId),
            orderBy('completedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        allResults = [];
        querySnapshot.forEach((doc) => {
            allResults.push({
                id: doc.id,
                ...doc.data(),
                completedAt: doc.data().completedAt?.toDate()
            });
        });
        
        console.log(`✅ ${allResults.length} résultats chargés`);
        
        if (allResults.length === 0) {
            showNoResults();
        } else {
            filteredResults = [...allResults];
            updateUI();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des résultats:', error);
        toast.error('Erreur lors du chargement des résultats');
        document.getElementById('results-loading')?.classList.add('hidden');
    }
}

// Mettre à jour l'interface complète
function updateUI() {
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
    
    statsContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Quiz complétés</p>
                    <p class="text-3xl font-bold text-slate-900">${totalQuizzes}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Score moyen</p>
                    <p class="text-3xl font-bold text-slate-900">${avgScore}%</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Questions répondues</p>
                    <p class="text-3xl font-bold text-slate-900">${totalQuestions}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Temps moyen</p>
                    <p class="text-3xl font-bold text-slate-900">${formatTime(avgTime)}</p>
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
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
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
    const colors = Object.keys(moduleCounts).map(m => moduleColors[m] || '#6366f1');
    
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
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const pageResults = filteredResults.slice(start, end);
    
    container.innerHTML = pageResults.map(result => {
        const date = result.completedAt;
        const dateStr = date 
            ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
            : 'Date inconnue';
        
        const scoreColor = result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600';
        const scoreBg = result.score >= 80 ? 'bg-green-50' : result.score >= 60 ? 'bg-yellow-50' : 'bg-red-50';
        
        return `
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-lg font-bold text-slate-900">${moduleNames[result.module] || result.module}</h3>
                            <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                                ${result.month} ${result.year}
                            </span>
                        </div>
                        <p class="text-sm text-slate-500">${dateStr}</p>
                    </div>
                    
                    <div class="flex items-center gap-6">
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Score</p>
                            <p class="${scoreColor} text-3xl font-bold">${result.score}%</p>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Réponses</p>
                            <p class="text-slate-700 font-semibold">${result.correctAnswers}/${result.totalQuestions}</p>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Temps</p>
                            <p class="text-slate-700 font-semibold">${formatTime(result.timeSpent || 0)}</p>
                        </div>
                        
                        <button onclick="viewResultDetails('${result.id}')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            Détails
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    updatePagination();
}

// Mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} sur ${totalPages}`;
    
    document.getElementById('prev-page-btn').disabled = currentPage === 1;
    document.getElementById('next-page-btn').disabled = currentPage === totalPages;
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
        console.log('✅ Export CSV réussi');
    } catch (error) {
        toast.updateLoadingToast(loadingToast, 'Erreur d\'export', 'error');
        toast.error('Erreur lors de l\'export CSV', 4000);
        console.error('❌ Erreur export CSV:', error);
    }
}

// Afficher les détails d'un résultat (modal)
window.viewResultDetails = function(resultId) {
    const result = allResults.find(r => r.id === resultId);
    if (!result) return;
    
    // Créer une modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <h2 class="text-2xl font-bold">Détails du quiz</h2>
                <p class="text-indigo-100 mt-1">${moduleNames[result.module] || result.module} - ${result.month} ${result.year}</p>
            </div>
            
            <div class="p-8">
                <div class="grid grid-cols-3 gap-6 mb-8">
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Score</p>
                        <p class="text-3xl font-bold text-indigo-600">${result.score}%</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Bonnes réponses</p>
                        <p class="text-3xl font-bold text-slate-900">${result.correctAnswers}/${result.totalQuestions}</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Temps total</p>
                        <p class="text-3xl font-bold text-slate-900">${formatTime(result.timeSpent || 0)}</p>
                    </div>
                </div>
                
                ${result.answers && result.answers.length > 0 ? `
                    <h3 class="text-xl font-bold text-slate-900 mb-4">Réponses détaillées</h3>
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${result.answers.map((answer, index) => `
                            <div class="p-4 rounded-lg ${answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
                                <div class="flex items-start gap-3">
                                    <span class="text-2xl">${answer.isCorrect ? '✅' : '❌'}</span>
                                    <div class="flex-1">
                                        <p class="font-semibold text-slate-900 mb-1">Question ${index + 1}</p>
                                        <p class="text-sm text-slate-700 mb-2">${answer.question}</p>
                                        ${!answer.isCorrect ? `
                                            <div class="text-xs text-slate-600">
                                                <p><strong>Votre réponse :</strong> ${answer.selectedAnswer}</p>
                                                <p><strong>Bonne réponse :</strong> ${answer.correctAnswer}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <span class="text-sm text-slate-500">${answer.timeSpent}s</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-slate-500 text-center py-8">Détails des réponses non disponibles</p>'}
            </div>
            
            <div class="px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end">
                <button id="close-modal-btn" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
                    Fermer
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer la modal
    modal.querySelector('#close-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
};

// Afficher message si aucun résultat
function showNoResults() {
    document.getElementById('results-loading')?.classList.add('hidden');
    document.getElementById('no-results')?.classList.remove('hidden');
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

// Déconnexion
async function handleLogout() {
    try {
        await signOutUser();
        window.location.href = '/';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}
