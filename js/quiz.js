// Module Quiz - Interface de questions style professionnel (VERSION 2.0 - Firestore)
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getCurrentUserUnified, isDemoMode } from './auth.js';
import { launchConfetti } from './confetti.js';
import { saveQuizResult } from './firestore-service.js';
import { toast, showLoadingToast, updateLoadingToast } from './toast.js';
// ✅ CORRECTION SECTION 9 : Analytics
import { trackQuizStart, trackQuizComplete } from './analytics.js';
// Import du gestionnaire de retry (Section 1 - Architecture)
import { withFirestoreRetry } from './retry-handler.js';
// Import des fonctions de sécurité (Section 4 - Sécurité)
import { escapeHtml } from './security.js';
// Import du rate limiter (Section 4 - Sécurité)
import { safeFirestoreRead } from './rate-limiter.js';
// ✅ CORRECTION SECTION 5 : Import du gestionnaire d'état centralisé
import { stateManager } from './state-manager.js';

// Configuration des modules (métadonnées uniquement - pas de questions hardcodées)
const moduleConfig = {
    'auto': {
        name: 'AT-AVE-AVEX',
        color: 'indigo',
        label: 'Auto'
    },
    'loisir': {
        name: 'VTT, Motoneige, etc.',
        color: 'cyan',
        label: 'Loisir'
    },
    'vr': {
        name: 'Véhicules Récréatifs',
        color: 'orange',
        label: 'VR'
    },
    'tracteur': {
        name: 'Équipement Agricole',
        color: 'green',
        label: 'Tracteur'
    }
};

// ✅ CORRECTION SECTION 5 : État du quiz géré par StateManager
// Helper functions pour faciliter la migration (utilisent StateManager en arrière-plan)
const getCurrentQuiz = () => stateManager.get('currentQuiz');
const setCurrentQuiz = (value) => stateManager.set('currentQuiz', value);
const getCurrentQuestionIndex = () => stateManager.get('currentQuestionIndex');
const setCurrentQuestionIndex = (value) => stateManager.set('currentQuestionIndex', value);
const getUserAnswers = () => stateManager.get('userAnswers');
const setUserAnswers = (value) => stateManager.set('userAnswers', value);
const getStartTime = () => stateManager.get('startTime');
const setStartTime = (value) => stateManager.set('startTime', value);
const getTimerInterval = () => stateManager.get('timerInterval');
const setTimerInterval = (value) => stateManager.set('timerInterval', value);
const getQuestionStartTime = () => stateManager.get('questionStartTime');
const setQuestionStartTime = (value) => stateManager.set('questionStartTime', value);
const getCurrentStreak = () => stateManager.get('currentStreak');
const setCurrentStreak = (value) => stateManager.set('currentStreak', value);
const getIsPaused = () => stateManager.get('isPaused');
const setIsPaused = (value) => stateManager.set('isPaused', value);
const getPausedDuration = () => stateManager.get('pausedDuration');
const setPausedDuration = (value) => stateManager.set('pausedDuration', value);
const getPauseStartedAt = () => stateManager.get('pauseStartedAt');
const setPauseStartedAt = (value) => stateManager.set('pauseStartedAt', value);
const getCurrentModule = () => stateManager.get('currentModule');
const setCurrentModule = (value) => stateManager.set('currentModule', value);
const getCurrentMonth = () => stateManager.get('currentMonth');
const setCurrentMonth = (value) => stateManager.set('currentMonth', value);
const getCurrentYear = () => stateManager.get('currentYear');
const setCurrentYear = (value) => stateManager.set('currentYear', value);
const getHasCurrentQuestionBeenAnswered = () => stateManager.get('hasCurrentQuestionBeenAnswered');
const setHasCurrentQuestionBeenAnswered = (value) => stateManager.set('hasCurrentQuestionBeenAnswered', value);
const getQuizEventDelegationInitialized = () => stateManager.get('quizEventDelegationInitialized');
const setQuizEventDelegationInitialized = (value) => stateManager.set('quizEventDelegationInitialized', value);

// Couleurs par module - AVANTAGE PLUS
const moduleColors = {
    'indigo': { bg: 'bg-ap-red-primary', text: 'text-ap-red-primary', border: 'border-ap-red-primary' }, // Auto -> Rouge AP
    'cyan': { bg: 'bg-ap-gold', text: 'text-ap-gold', border: 'border-ap-gold' }, // Loisir -> Doré AP
    'orange': { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600' }, // VR -> Orange (OK)
    'green': { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-600' } // Tracteur -> Vert (OK)
};

// Charger les questions depuis Firestore, compatible mois numérique ou texte (rétro-compatibilité)
async function loadQuizFromFirestore(moduleId, monthNumber, year) {
    console.log(`📥 Chargement des questions: module=${moduleId}, mois=${monthNumber}, année=${year}`);

    const toQuestionObjects = (doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            question: data.question,
            options: data.options.map((opt, index) => ({
                id: String.fromCharCode(65 + index), // A, B, C, D
                text: opt,
                correct: index === data.correctAnswer
            })),
            explanation: data.explanation || 'Pas d\'explication disponible',
            reference: data.reference || '',
            tags: data.tags || []
        };
    };

    // ✅ MODE DÉMO : Utiliser les questions mockées de localStorage OU défauts
    if (isDemoMode()) {
        console.log('📝 Mode démo : Chargement des questions simulées pour le quiz...');
        
        // 💾 Charger depuis localStorage (synchronisé avec admin)
        const DEMO_STORAGE_KEY = 'avantage-quizz-demo-questions';
        const saved = localStorage.getItem(DEMO_STORAGE_KEY);
        
        let demoQuestions = [];
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                console.log(`💾 ${parsed.length} questions chargées depuis localStorage`);
                
                // Convertir au format attendu par le quiz
                demoQuestions = parsed.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options.map((opt, index) => ({
                        id: String.fromCharCode(65 + index), // A, B, C, D
                        text: opt,
                        correct: index === q.correctAnswer
                    })),
                    explanation: q.explanation || 'Pas d\'explication disponible',
                    reference: q.reference || '',
                    tags: q.tags || []
                }));
                
                // Filtrer par module et mois si nécessaire
                demoQuestions = demoQuestions.filter(q => {
                    const matchModule = !moduleId || parsed.find(p => p.id === q.id)?.module === moduleId;
                    const matchMonth = !monthNumber || parsed.find(p => p.id === q.id)?.month === monthNumber;
                    return matchModule && matchMonth;
                });
                
            } catch (e) {
                console.warn('⚠️ Erreur lecture localStorage, utilisation questions par défaut');
            }
        }
        
        // Si pas de questions en localStorage, utiliser les 5 par défaut
        if (demoQuestions.length === 0) {
            console.log('📦 Utilisation questions par défaut (aucune en localStorage)');
            demoQuestions = [
                {
                    id: 'demo-1',
                    question: 'Quelle est la vitesse maximale autorisée sur une autoroute au Québec ?',
                    options: [
                        { id: 'A', text: '100 km/h', correct: false },
                        { id: 'B', text: '110 km/h', correct: false },
                        { id: 'C', text: '120 km/h', correct: false },
                        { id: 'D', text: '100 km/h (conditions normales)', correct: true }
                    ],
                    explanation: 'La vitesse maximale sur autoroute au Québec est de 100 km/h, sauf indication contraire.',
                    reference: 'Code de la sécurité routière du Québec',
                    tags: ['vitesse', 'autoroute']
                },
                {
                    id: 'demo-2',
                    question: 'À quelle distance minimale devez-vous vous arrêter derrière un autobus scolaire dont les feux clignotent ?',
                    options: [
                        { id: 'A', text: '3 mètres', correct: false },
                        { id: 'B', text: '5 mètres', correct: true },
                        { id: 'C', text: '10 mètres', correct: false },
                        { id: 'D', text: '15 mètres', correct: false }
                    ],
                    explanation: 'Vous devez vous arrêter à au moins 5 mètres d\'un autobus scolaire.',
                    reference: 'Article 460 CSR',
                    tags: ['autobus', 'sécurité']
                },
                {
                    id: 'demo-3',
                    question: 'Quel est le taux d\'alcoolémie maximal pour conduire au Québec ?',
                    options: [
                        { id: 'A', text: '0.05', correct: false },
                        { id: 'B', text: '0.08', correct: true },
                        { id: 'C', text: '0.10', correct: false },
                        { id: 'D', text: '0.00', correct: false }
                    ],
                    explanation: 'Le taux maximal est de 0.08 pour conducteurs expérimentés.',
                    reference: 'Code criminel du Canada',
                    tags: ['alcool', 'sécurité']
                },
                {
                    id: 'demo-4',
                    question: 'Combien de points d\'inaptitude entraîne un excès de vitesse de 30 km/h ?',
                    options: [
                        { id: 'A', text: '2 points', correct: false },
                        { id: 'B', text: '3 points', correct: true },
                        { id: 'C', text: '4 points', correct: false },
                        { id: 'D', text: '5 points', correct: false }
                    ],
                    explanation: 'Un excès de 21 à 30 km/h entraîne 3 points.',
                    reference: 'SAAQ',
                    tags: ['vitesse', 'points']
                },
                {
                    id: 'demo-5',
                    question: 'Quelle est la distance de sécurité recommandée entre véhicules ?',
                    options: [
                        { id: 'A', text: '1 seconde', correct: false },
                        { id: 'B', text: '2 secondes', correct: true },
                        { id: 'C', text: '3 secondes', correct: false },
                        { id: 'D', text: '5 secondes', correct: false }
                    ],
                    explanation: 'La règle des 2 secondes est recommandée.',
                    reference: 'Guide SAAQ',
                    tags: ['distance', 'sécurité']
                }
            ];
        }
        
        console.log(`✅ ${demoQuestions.length} questions démo chargées pour le quiz`);
        return demoQuestions;
    }

    try {
        // 1) Essayer avec mois numérique (schéma actuel de l'admin)
        let q1 = query(
            collection(db, 'questions'),
            where('module', '==', moduleId),
            where('month', '==', monthNumber),
            where('year', '==', year)
        );
        let snap = await getDocs(q1);
        if (!snap.empty) {
            const res = [];
            snap.forEach((d) => res.push(toQuestionObjects(d)));
            console.log(`✅ ${res.length} questions (mois numérique)`);
            return res;
        }

        // 2) Rétro-compatibilité: essayer avec mois texte (ex: "Novembre")
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthText = monthNames[monthNumber - 1];
        const normalizedMonth = monthText.charAt(0).toUpperCase() + monthText.slice(1).toLowerCase();

        let q2 = query(
            collection(db, 'questions'),
            where('module', '==', moduleId),
            where('month', '==', normalizedMonth),
            where('year', '==', year)
        );
        snap = await getDocs(q2);
        if (!snap.empty) {
            const res = [];
            snap.forEach((d) => res.push(toQuestionObjects(d)));
            console.log(`✅ ${res.length} questions (mois texte)`);
            return res;
        }

        console.warn('⚠️ Aucune question trouvée pour ces critères (numérique/texte)');
        return [];
    } catch (error) {
        console.error('❌ Erreur lors du chargement des questions:', error);
        throw error;
    }
}

// Fallback Demo: charger depuis un JSON local lorsque le Mode Démo est actif
async function loadDemoQuestions(moduleId, monthNumber, year) {
    try {
        const resp = await fetch('/test-questions-valides.json');
        if (!resp.ok) return [];
        const data = await resp.json();
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthText = monthNames[monthNumber - 1];

        const filtered = data.filter(q => q.module === moduleId && q.year === year && (q.month === monthText || q.month === monthNumber));
        return filtered.map((q, idx) => ({
            id: `demo-${moduleId}-${idx}`,
            question: q.question,
            options: q.options.map((opt, index) => ({
                id: String.fromCharCode(65 + index),
                text: opt,
                correct: index === q.correctAnswer
            })),
            explanation: q.explanation || 'Pas d\'explication disponible',
            reference: q.reference || '',
            tags: q.tags || []
        }));
    } catch (e) {
        console.warn('Demo questions fallback error:', e);
        return [];
    }
}

// **FONCTION MODIFIÉE** : Initialiser le quiz avec chargement Firestore
export async function startQuiz(moduleId) {
    const config = moduleConfig[moduleId];
    if (!config) {
        console.error('Module de quiz non trouvé:', moduleId);
        toast.error('Module non trouvé. Veuillez réessayer.');
        return;
    }
    
    // Afficher un écran de chargement avec toast
    const loadingToast = showLoadingToast(`Chargement du quiz ${config.label}...`);
    showLoadingScreen(config.label);
    
    try {
        // Déterminer le mois (numérique) et l'année actuels
        // ✅ CORRECTION SECTION 2 : Utiliser les utilitaires de mois pour normalisation
        const { getCurrentMonthNumber, getCurrentYear, normalizeMonthFormat } = await import('./month-utils.js');
        const monthNumber = getCurrentMonthNumber();
        const year = getCurrentYear();
        // Normaliser le format du mois pour garantir la cohérence avec le dashboard
        // ✅ CORRECTION SECTION 5 : Utiliser StateManager
        const normalizedMonth = normalizeMonthFormat(monthNumber, year);
        setCurrentMonth(normalizedMonth);
        setCurrentYear(year);
        setCurrentModule(moduleId);
        
    // Indiquer qu'un quiz est en cours (utilisé pour confirmations de navigation)
    try { window.__QUIZ_ACTIVE = true; } catch (e) {}

    // Charger les questions depuis Firestore (numérique/texte)
        let questions = await loadQuizFromFirestore(moduleId, monthNumber, year);

        // En mode Démo, si aucune question en base, charger depuis JSON local
        if (questions.length === 0 && isDemoMode()) {
            console.log('ℹ️ Mode Démo: chargement des questions locales de test');
            questions = await loadDemoQuestions(moduleId, monthNumber, year);
        }
        
        if (questions.length === 0) {
            hideLoadingScreen();
            updateLoadingToast(loadingToast, 'Aucune question disponible', 'error');
            // ✅ CORRECTION SECTION 2 : currentMonth est déjà normalisé (format "Novembre 2025")
            const currentMonth = getCurrentMonth();
            toast.error(`Aucune question trouvée pour ${config.label} en ${currentMonth}.\n\nContactez l'administrateur.`, 5000);
            return;
        }
        
        // Créer l'objet quiz
        // ✅ CORRECTION SECTION 5 : Utiliser StateManager
        const currentMonth = getCurrentMonth();
        setCurrentQuiz({
            // ✅ CORRECTION SECTION 2 : currentMonth est déjà normalisé (format "Novembre 2025")
            name: `Quiz ${config.label} - ${currentMonth}`,
            module: config.name,
            color: config.color,
            questions: questions
        });
        
        // Réinitialiser l'état
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
        
        // ✅ CORRECTION SECTION 9 : Tracker le début du quiz
        trackQuizStart(moduleId, getCurrentMonth());
        setCurrentStreak(0);
        setIsPaused(false);
        setPausedDuration(0);
        setPauseStartedAt(null);
        setHasCurrentQuestionBeenAnswered(false);
        
        // Cacher l'écran de chargement et démarrer
    hideLoadingScreen();
    showQuizView();
        renderQuestion();
        startTimer();
        updateScoreDisplay();
        updateProgressBar(); // ✅ CORRECTION: Mettre à jour la barre de progression au démarrage
        
        // Toast de succès
        updateLoadingToast(loadingToast, `${questions.length} questions chargées !`, 'success');
        
    } catch (error) {
        stopTimer(); // ✅ CORRECTION SECTION 3 : Nettoyer le timer en cas d'erreur
        hideLoadingScreen();
        console.error('❌ Erreur lors du démarrage du quiz:', error);
        updateLoadingToast(loadingToast, 'Erreur de chargement', 'error');
        toast.error('Erreur lors du chargement du quiz. Veuillez réessayer.', 4000);
    }
}

// Écran de chargement
function showLoadingScreen(moduleName) {
    const quizView = getOrCreateQuizView();
    // ✅ FIX: Préserver le bandeau en l'ajoutant avant le contenu
    quizView.innerHTML = `
        <!-- Bannière de Marque Avantage Plus -->
        <div class="brand-banner">
            <img src="assets/images/logos/Bandeau AVEX.png" alt="Protection Mécanique Exceptionnelle - Avantage Plus" class="banner-image">
        </div>
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-ap-red-primary mx-auto mb-6"></div>
                        <h2 class="text-2xl font-bold text-slate-900 mb-2">Chargement du quiz ${escapeHtml(moduleName)}</h2>
                <p class="text-slate-600">Récupération des questions...</p>
            </div>
        </div>
    `;
    quizView.classList.remove('view-hidden');
}

function hideLoadingScreen() {
    // L'écran sera remplacé par le contenu du quiz
}

// Afficher la vue du quiz
function showQuizView() {
    document.getElementById('dashboard-view')?.classList.add('view-hidden');
    document.getElementById('module-selection-view')?.classList.add('view-hidden');
    document.getElementById('login-view')?.classList.add('view-hidden');
    
    const quizView = getOrCreateQuizView();
    quizView.classList.remove('view-hidden');
}

function getOrCreateQuizView() {
    let quizView = document.getElementById('quiz-view');
    if (!quizView) {
        quizView = document.createElement('div');
        quizView.id = 'quiz-view';
        quizView.style.cssText = 'margin: 0; padding: 0; width: 100%; height: 100%;';
        
        // ✅ Ajouter la bannière de marque Avantage Plus au début de la vue quiz
        const banner = document.createElement('div');
        banner.className = 'brand-banner';
        banner.innerHTML = `<img src="assets/images/logos/Bandeau AVEX.png" alt="Protection Mécanique Exceptionnelle - Avantage Plus" class="banner-image">`;
        quizView.appendChild(banner);
        
        document.querySelector('main').appendChild(quizView);
    }
    initializeQuizEventDelegation(quizView);
    return quizView;
}

function initializeQuizEventDelegation(quizView) {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    if (getQuizEventDelegationInitialized() || !quizView) {
        return;
    }

    quizView.addEventListener('click', (event) => {
        const optionButton = event.target.closest('.option-button');
        if (optionButton && !optionButton.disabled) {
            const optionId = optionButton.dataset.optionId;
            if (optionId) {
                handleAnswer(optionId);
            }
            return;
        }

        const nextButton = event.target.closest('#next-question-btn');
        if (nextButton) {
            event.preventDefault();
            nextQuestion();
            return;
        }

        const quitButton = event.target.closest('#quit-quiz-btn');
        if (quitButton) {
            event.preventDefault();
            if (confirm('Voulez-vous vraiment quitter le quiz ? Votre progression sera perdue.')) {
                returnToDashboard();
            }
            return;
        }

        const focusButton = event.target.closest('#focus-mode-btn');
        if (focusButton) {
            event.preventDefault();
            toggleFocusMode();
            return;
        }

        const pauseButton = event.target.closest('#pause-btn');
        if (pauseButton) {
            event.preventDefault();
            togglePause();
            return;
        }
    });

    setQuizEventDelegationInitialized(true);
}

// Rendre la question actuelle
function renderQuestion() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    const currentQuiz = getCurrentQuiz();
    const currentQuestionIndex = getCurrentQuestionIndex();
    const question = currentQuiz.questions[currentQuestionIndex];
    const quizView = document.getElementById('quiz-view');
    const colorScheme = moduleColors[currentQuiz.color];
    setHasCurrentQuestionBeenAnswered(false);
    
    quizView.innerHTML = `
        <!-- Bannière de Marque Avantage Plus -->
        <div class="brand-banner">
            <img src="assets/images/logos/Bandeau AVEX.png" alt="Protection Mécanique Exceptionnelle - Avantage Plus" class="banner-image">
        </div>
        <!-- En-tête du quiz -->
        <div class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">${escapeHtml(currentQuiz.name)}</h1>
                        <p class="text-sm text-slate-500">Question ${currentQuestionIndex + 1} sur ${currentQuiz.questions.length}</p>
                    </div>
                    <div class="flex items-center gap-6">
                        <button id="focus-mode-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1" aria-pressed="false" aria-label="Activer le mode focus">
                            <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Focus
                        </button>
                        <button id="pause-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1" aria-pressed="false" aria-label="Mettre le quiz en pause">
                            <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pause
                        </button>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-ap-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span id="quiz-score" class="text-sm font-bold text-ap-red-primary">Score: 0%</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span id="quiz-timer" class="text-sm font-medium text-slate-600">0:00</span>
                        </div>
                        <button id="quit-quiz-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Quitter
                        </button>
                    </div>
                </div>
                
                <!-- Barre de progression - ROUGE AVANTAGE PLUS PROFESSIONNEL AVEC ANIMATIONS -->
                <div class="mt-4 w-full bg-gray-300 rounded-full h-5 overflow-hidden border-2 border-gray-700 shadow-lg relative" style="background-color: #D1D5DB !important; border-color: #374151 !important; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <div id="quiz-progress-bar" class="h-full rounded-full transition-all duration-600 ease-out relative overflow-hidden" style="background: linear-gradient(135deg, #C41E3A 0%, #A01A2E 50%, #8B1429 100%) !important; width: ${Math.max(0, Math.min(100, ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100))}%; box-shadow: 0 2px 8px rgba(196, 30, 58, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);">
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style="animation: shimmer 2s infinite; transform: translateX(-100%);"></div>
                    </div>
                    <div id="quiz-progress-percent" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 pointer-events-none" style="z-index: 10;">${Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</div>
                </div>
            </div>
        </div>

        <!-- Contenu de la question -->
        <div class="max-w-5xl mx-auto px-6 py-8">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                <!-- En-tête de question -->
                <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                    <div class="mb-4">
                        <span class="text-sm font-medium ${colorScheme.text}">Question ${currentQuestionIndex + 1} sur ${currentQuiz.questions.length}</span>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-slate-900 leading-relaxed">
                        ${escapeHtml(question.question)}
                    </h2>
                    
                    <!-- Tags -->
                    ${question.tags && question.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${question.tags.map(tag => `
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                    ${escapeHtml(tag)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Options de réponse -->
                <div class="p-8">
                    <div class="space-y-3">
                        ${question.options.map(option => `
                            <button data-option-id="${escapeHtml(option.id)}" 
                                    class="option-button w-full text-left px-6 py-5 rounded-xl border-2 border-gray-200 hover:border-ap-red-primary hover:bg-ap-red-50 transition-all duration-200 group">
                                <div class="flex items-center gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-ap-red-100 flex items-center justify-center group-hover:bg-ap-red-primary group-hover:text-white transition-all">
                                        <span class="text-lg font-bold text-ap-red-primary group-hover:text-white">${escapeHtml(option.id)}</span>
                                    </div>
                                    <span class="text-lg text-slate-700 group-hover:text-slate-900 font-medium">
                                        ${escapeHtml(option.text)}
                                    </span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Zone d'explication (cachée initialement) -->
                <div id="explanation-area" class="hidden px-8 py-6 bg-slate-50 border-t border-gray-200">
                    <!-- Sera rempli après la réponse -->
                </div>

                <!-- Bouton suivant (caché initialement) -->
                <div id="next-button-area" class="hidden px-8 py-6 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <p class="text-sm text-slate-500">Question suivante dans quelques secondes...</p>
                        <button id="next-question-btn" class="bg-ap-red-primary hover:bg-ap-red-dark text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-ap-md hover:shadow-ap-lg transform hover:-translate-y-1">
                            Question suivante
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    updateScoreDisplay();
    updateProgressBar();
}

// Mettre à jour la barre de progression
function updateProgressBar() {
    const currentQuiz = getCurrentQuiz();
    if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        return;
    }
    
    const currentQuestionIndex = getCurrentQuestionIndex();
    const totalQuestions = currentQuiz.questions.length;
    
    // Calculer le pourcentage (sécurisé)
    const progressPercent = Math.max(0, Math.min(100, ((currentQuestionIndex + 1) / totalQuestions) * 100));
    
    const progressBar = document.getElementById('quiz-progress-bar');
    const progressPercentElement = document.getElementById('quiz-progress-percent');
    
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
        // ✅ CORRECTION: Forcer le style rouge pour garantir la visibilité
        progressBar.style.background = 'linear-gradient(135deg, #C41E3A 0%, #A01A2E 50%, #8B1429 100%)';
        progressBar.style.setProperty('background', 'linear-gradient(135deg, #C41E3A 0%, #A01A2E 50%, #8B1429 100%)', 'important');
        
        // Mettre à jour le pourcentage affiché
        if (progressPercentElement) {
            progressPercentElement.textContent = `${Math.round(progressPercent)}%`;
        }
        
        console.log(`📊 Barre de progression mise à jour: ${progressPercent.toFixed(1)}% (Question ${currentQuestionIndex + 1}/${totalQuestions})`);
    }
}

// Gérer la réponse de l'utilisateur
function handleAnswer(optionId) {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    if (getHasCurrentQuestionBeenAnswered()) {
        return;
    }
    const currentQuiz = getCurrentQuiz();
    const currentQuestionIndex = getCurrentQuestionIndex();
    const questionStartTime = getQuestionStartTime();
    const question = currentQuiz.questions[currentQuestionIndex];
    const selectedOption = question.options.find(opt => opt.id === optionId);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    setHasCurrentQuestionBeenAnswered(true);
    
    // Enregistrer la réponse
    const userAnswers = getUserAnswers();
    userAnswers.push({
        questionId: question.id,
        question: question.question,
        selectedAnswer: optionId,
        correctAnswer: question.options.find(opt => opt.correct).id,
        isCorrect: selectedOption.correct,
        timeSpent: timeSpent
    });
    setUserAnswers(userAnswers);
    
    // Mettre à jour le streak
    let currentStreak = getCurrentStreak();
    if (selectedOption.correct) {
        currentStreak++;
    } else {
        currentStreak = 0;
    }
    setCurrentStreak(currentStreak);
    
    // Désactiver tous les boutons
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:border-ap-red-primary', 'hover:bg-ap-red-50');
    });
    
    // Afficher le résultat
    showAnswerFeedback(optionId, selectedOption.correct, question);
    
    // Mettre à jour le score
    updateScoreDisplay();
    
    // Passer à la question suivante après un délai
    setTimeout(() => {
        document.getElementById('next-button-area')?.classList.remove('hidden');
    }, 1000);
}

// Afficher le feedback de la réponse
function showAnswerFeedback(selectedId, isCorrect, question) {
    // ✅ CORRECTION : Utiliser StateManager pour currentQuiz
    const currentQuiz = getCurrentQuiz();
    const colorScheme = moduleColors[currentQuiz.color];
    const correctOption = question.options.find(opt => opt.correct);
    
    // Colorier les options
    document.querySelectorAll('.option-button').forEach(btn => {
        const optId = btn.dataset.optionId;
        
        if (optId === correctOption.id) {
            // Bonne réponse en vert
            btn.classList.add('border-green-500', 'bg-green-50');
            btn.classList.remove('border-gray-200');
        } else if (optId === selectedId && !isCorrect) {
            // Mauvaise réponse en rouge
            btn.classList.add('border-red-500', 'bg-red-50');
            btn.classList.remove('border-gray-200');
        }
    });
    
    // Afficher l'explication
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) {
        explanationArea.innerHTML = `
            <div class="flex items-start gap-4">
                ${isCorrect ? 
                    '<div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>' :
                    '<div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>'
                }
                <div class="flex-1">
                    <h3 class="text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2">
                        ${isCorrect ? '✅ Bonne réponse !' : '❌ Réponse incorrecte'}
                    </h3>
                    <p class="text-slate-700 mb-2"><strong>Explication :</strong> ${escapeHtml(question.explanation)}</p>
                    ${question.reference ? `<p class="text-sm text-slate-500"><strong>Référence :</strong> ${escapeHtml(question.reference)}</p>` : ''}
                </div>
            </div>
        `;
        explanationArea.classList.remove('hidden');
    }
}

// Passer à la question suivante
function nextQuestion() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    setQuestionStartTime(Date.now());
    const currentQuestionIndex = getCurrentQuestionIndex();
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    
    const currentQuiz = getCurrentQuiz();
    const newIndex = getCurrentQuestionIndex();
    if (newIndex < currentQuiz.questions.length) {
        renderQuestion();
        // ✅ CORRECTION: Mettre à jour la barre de progression explicitement
        updateProgressBar();
    } else {
        showResults();
    }
}

// Afficher les résultats finaux
async function showResults() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    stopTimer();
    try { window.__QUIZ_ACTIVE = false; } catch (e) {}
    
    const userAnswers = getUserAnswers();
    // ✅ CORRECTION SECTION 2 : Validation avant calcul du score pour éviter division par zéro
    if (userAnswers.length === 0) {
        console.error('❌ Aucune réponse enregistrée - quiz invalide');
        toast.error('Aucune réponse enregistrée. Le quiz ne peut pas être complété.');
        return;
    }
    
    // ✅ P0 CRITIQUE: Utiliser la fonction de calcul de score testable
    const { calculateScore: calculateQuizScore } = await import('./utils/quiz-scoring.js');
    const score = calculateQuizScore(userAnswers);
    
    // ✅ CORRECTION SECTION 2 : Validation du score calculé
    if (isNaN(score) || score < 0 || score > 100) {
        console.error('❌ Score invalide calculé:', score);
        toast.error('Erreur de calcul du score. Contactez le support.');
        return;
    }
    const pausedDuration = getPausedDuration();
    const isPaused = getIsPaused();
    const pauseStartedAt = getPauseStartedAt();
    let pausedOffset = pausedDuration;
    if (isPaused && pauseStartedAt) {
        pausedOffset += Date.now() - pauseStartedAt;
    }
    const startTime = getStartTime();
    const totalTime = Math.max(0, Math.floor((Date.now() - startTime - pausedOffset) / 1000));
    setIsPaused(false);
    setPauseStartedAt(null);
    setPausedDuration(0);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    // Sauvegarder dans Firestore
    saveQuizToFirestore(score, totalTime);
    
    // ✅ CORRECTION : Utiliser StateManager pour currentQuiz
    const currentQuiz = getCurrentQuiz();
    if (!currentQuiz) {
        console.error('❌ currentQuiz non défini dans showResults');
        toast.error('Erreur: Impossible d\'afficher les résultats. Veuillez réessayer.');
        return;
    }
    
    const colorScheme = moduleColors[currentQuiz.color];
    const quizView = document.getElementById('quiz-view');
    
    quizView.innerHTML = `
        <!-- Bannière de Marque Avantage Plus -->
        <div class="brand-banner">
            <img src="assets/images/logos/Bandeau AVEX.png" alt="Protection Mécanique Exceptionnelle - Avantage Plus" class="banner-image">
        </div>
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Carte de résultat principale -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border-t-4 border-ap-gold">
                    <!-- Header avec score - GRADIENT AVANTAGE PLUS -->
                    <div class="px-8 py-12 text-center text-white" style="background: ${score >= 80 ? 'linear-gradient(135deg, #28A745 0%, #D4AF37 100%)' : 'var(--ap-gradient-primary)'};">
                        <h1 class="text-4xl font-bold mb-4">Quiz Terminé ! 🎉</h1>
                        <div class="text-8xl font-bold mb-4" style="text-shadow: 0 4px 20px rgba(0,0,0,0.2);">${score}%</div>
                        <p class="text-xl opacity-90">${userAnswers.filter(a => a.isCorrect).length} / ${userAnswers.length} bonnes réponses</p>
                        <p class="text-lg opacity-75 mt-2">Temps total : ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                    </div>
                    
                    <!-- Message de feedback -->
                    <div class="px-8 py-8 text-center border-b border-gray-200">
                        ${score >= 90 ? 
                            '<h2 class="text-3xl font-bold text-green-600 mb-2">🏆 Excellent !</h2><p class="text-slate-600 text-lg">Performance exceptionnelle ! Vous maîtrisez parfaitement ce module.</p>' :
                        score >= 75 ?
                            '<h2 class="text-3xl font-bold text-blue-600 mb-2">👏 Très bien !</h2><p class="text-slate-600 text-lg">Bon travail ! Quelques révisions et vous serez au top.</p>' :
                        score >= 60 ?
                            '<h2 class="text-3xl font-bold text-yellow-600 mb-2">📚 Pas mal !</h2><p class="text-slate-600 text-lg">C\'est un bon début. Continuez à réviser pour améliorer votre score.</p>' :
                            '<h2 class="text-3xl font-bold text-red-600 mb-2">💪 Continuez !</h2><p class="text-slate-600 text-lg">Ne vous découragez pas. Révisez les points faibles et réessayez !</p>'
                        }
                    </div>
                    
                    <!-- Détails des réponses -->
                    <div class="px-8 py-6">
                        <h3 class="text-xl font-bold text-slate-900 mb-4">Détails de vos réponses :</h3>
                        <div class="space-y-3 max-h-96 overflow-y-auto">
                            ${userAnswers.map((answer, index) => `
                                <div class="flex items-center justify-between p-4 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}">
                                    <div class="flex items-center gap-3 flex-1">
                                        <span class="${answer.isCorrect ? 'text-green-600' : 'text-red-600'} text-2xl">
                                            ${answer.isCorrect ? '✅' : '❌'}
                                        </span>
                                        <div class="flex-1">
                                            <p class="font-medium text-slate-900">Question ${index + 1}</p>
                                            <p class="text-sm text-slate-600">${answer.question}</p>
                                            ${!answer.isCorrect ? `<p class="text-xs text-slate-500 mt-1">Votre réponse : ${answer.selectedAnswer} | Correcte : ${answer.correctAnswer}</p>` : ''}
                                        </div>
                                    </div>
                                    <span class="text-sm text-slate-500">${answer.timeSpent}s</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Boutons d'action -->
                    <div class="px-8 py-6 flex gap-4">
                        <button id="retry-quiz-btn" class="flex-1 bg-ap-red-primary hover:bg-ap-red-dark text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-1 shadow-ap-md hover:shadow-ap-lg">
                            Refaire le quiz
                        </button>
                        <button id="return-dashboard-btn" class="flex-1 border-2 border-ap-red-primary text-ap-red-primary px-6 py-3 rounded-xl font-semibold hover:bg-ap-red-50 transition-all">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Confettis si bon score
    if (score >= 80) {
        setTimeout(() => launchConfetti(), 500);
    }
    
    // ✅ CORRECTION SECTION 9 : Tracker la fin du quiz
    // currentQuiz est déjà défini plus haut dans la fonction
    const quizTotalTime = Math.floor((Date.now() - getStartTime()) / 1000);
    trackQuizComplete(
        getCurrentModule(),
        score,
        quizTotalTime,
        currentQuiz?.questions?.length || 0
    );
    
    // Événements
    document.getElementById('retry-quiz-btn')?.addEventListener('click', () => {
        const currentModule = getCurrentModule();
        if (currentModule) {
            startQuiz(currentModule);
        } else {
            toast.error('Erreur: Impossible de redémarrer le quiz.');
        }
    });
    
    document.getElementById('return-dashboard-btn')?.addEventListener('click', returnToDashboard);
}

// Sauvegarder le résultat dans Firestore
async function saveQuizToFirestore(score, totalTime) {
    // ✅ CORRECTION SECTION 3 : Nettoyer le timer en cas d'erreur
    try {
        const user = getCurrentUserUnified();
        if (!user) {
            console.log('Aucun utilisateur - résultat non sauvegardé');
            stopTimer(); // Nettoyer le timer
            return;
        }
        
        // En mode démo, ne pas sauvegarder dans Firestore
        if (isDemoMode()) {
            console.log('Mode démo - résultat non sauvegardé dans Firestore');
            toast.info('Mode Démo : les résultats ne sont pas sauvegardés');
            stopTimer(); // Nettoyer le timer
            return;
        }
        
        // ✅ CORRECTION SECTION 5 : Utiliser StateManager
        const currentModule = getCurrentModule();
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();
        const currentQuiz = getCurrentQuiz();
        const userAnswers = getUserAnswers();
        const moduleDetails = moduleConfig[currentModule] || {};
        const quizData = {
            moduleId: currentModule,
            moduleName: moduleDetails.name || currentQuiz.module || currentModule,
            score,
            correctAnswers: userAnswers.filter(a => a.isCorrect).length,
            totalQuestions: currentQuiz.questions.length,
            timeElapsed: totalTime,
            answers: userAnswers,
            month: currentMonth,
            year: currentYear
        };
        
        // ✅ CORRECTION SECTION 3 : Utiliser retry automatique avec notification utilisateur
        await withFirestoreRetry(
            () => saveQuizResult(quizData),
            {
                maxRetries: 3,
                onRetry: (attempt, delay) => {
                    toast.info(`Nouvelle tentative de sauvegarde ${attempt}/3...`, 3000);
                }
            }
        );
        
        toast.success('Résultat sauvegardé avec succès !', 3000);
        console.log('✅ Résultat sauvegardé dans Firestore');
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        stopTimer(); // ✅ CORRECTION SECTION 3 : Nettoyer le timer en cas d'erreur
        
        // ✅ CORRECTION SECTION 3 : Informer l'utilisateur de l'erreur
        toast.error('Erreur lors de la sauvegarde. Le résultat sera sauvegardé localement et synchronisé plus tard.', 8000);
        
        // ✅ CORRECTION SECTION 8 : Utiliser la file d'attente globale
        try {
            // ✅ CORRECTION SECTION 5 : Utiliser StateManager
            const currentModule = getCurrentModule();
            const currentMonth = getCurrentMonth();
            const currentYear = getCurrentYear();
            const userAnswers = getUserAnswers();
            
            const resultData = {
                moduleId: currentModule,
                moduleName: moduleConfig[currentModule]?.name || currentModule,
                score: score,
                correctAnswers: userAnswers.filter(a => a.isCorrect).length,
                totalQuestions: userAnswers.length,
                timeElapsed: totalTime,
                answers: userAnswers,
                month: currentMonth,
                year: currentYear
            };
            
            // ✅ CORRECTION SECTION 8 : Ajouter à la file d'attente globale
            const { syncQueue } = await import('./sync-queue.js');
            await syncQueue.add('quizResult', async (data) => {
                await saveQuizResult(data);
            }, resultData);
            
            console.log('✅ Résultat ajouté à la file d\'attente de synchronisation');
        } catch (queueError) {
            console.error('❌ Erreur ajout à la file d\'attente:', queueError);
            // Fallback sur localStorage si IndexedDB n'est pas disponible
            try {
                const queueKey = `quiz_result_${Date.now()}`;
                localStorage.setItem(queueKey, JSON.stringify({
                    score,
                    totalTime,
                    moduleId: getCurrentModule(),
                    month: getCurrentMonth(),
                    year: getCurrentYear(),
                    userAnswers: getUserAnswers(),
                    timestamp: Date.now()
                }));
            } catch (localError) {
                console.error('❌ Erreur sauvegarde locale de secours:', localError);
            }
        }
    }
}

// Timer du quiz
function startTimer() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    stopTimer();
    const interval = setInterval(() => {
        const startTime = getStartTime();
        if (startTime === null) {
            return;
        }

        const pausedDuration = getPausedDuration();
        const isPaused = getIsPaused();
        const pauseStartedAt = getPauseStartedAt();
        let pausedOffset = pausedDuration;
        if (isPaused && pauseStartedAt) {
            pausedOffset += Date.now() - pauseStartedAt;
        }

        const elapsedMs = Date.now() - startTime - pausedOffset;
        const elapsed = Math.max(0, Math.floor(elapsedMs / 1000));
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
    setTimerInterval(interval);
}

function stopTimer() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    const timerInterval = getTimerInterval();
    if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
    }
    setPauseStartedAt(null);
}

// ✅ CORRECTION SECTION 3 : Nettoyer le timer sur toutes les sorties (beforeunload, erreurs)
// Nettoyer le timer quand l'utilisateur quitte la page
window.addEventListener('beforeunload', () => {
    stopTimer();
});

// Nettoyer le timer quand la page est cachée (onglet inactif)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Optionnel : on peut aussi nettoyer ici si nécessaire
    }
});

// Mettre à jour l'affichage du score
async function updateScoreDisplay() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    const userAnswers = getUserAnswers();
    if (userAnswers.length === 0) return;
    
    // ✅ P0 CRITIQUE: Utiliser la fonction de calcul de score testable
    const { calculateScore } = await import('./utils/quiz-scoring.js');
    const score = calculateScore(userAnswers);
    
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}%`;
    }
}

// Mode focus
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
}

// Pause
function togglePause() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    const pauseBtn = document.getElementById('pause-btn');
    if (!pauseBtn) {
        return;
    }

    const isPaused = getIsPaused();
    if (!isPaused) {
        setIsPaused(true);
        setPauseStartedAt(Date.now());
        // ✅ CORRECTION ACCESSIBILITÉ : Mettre à jour aria-pressed
        pauseBtn.setAttribute('aria-pressed', 'true');
        pauseBtn.setAttribute('aria-label', 'Reprendre le quiz');
        pauseBtn.innerHTML = '<svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Reprendre';
        toast.warning('Quiz en pause. Cliquez sur "Reprendre" pour continuer.', 3000);
    } else {
        // ✅ CORRECTION SECTION 5 : Utiliser StateManager
        setIsPaused(false);
        const pauseStartedAt = getPauseStartedAt();
        if (pauseStartedAt) {
            const pausedDuration = getPausedDuration();
            setPausedDuration(pausedDuration + (Date.now() - pauseStartedAt));
        }
        setPauseStartedAt(null);
        // ✅ CORRECTION ACCESSIBILITÉ : Mettre à jour aria-pressed
        pauseBtn.setAttribute('aria-pressed', 'false');
        pauseBtn.setAttribute('aria-label', 'Mettre le quiz en pause');
        pauseBtn.innerHTML = '<svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pause';
        toast.success('Quiz repris !', 2000);
    }
}

// Retour au dashboard
function returnToDashboard() {
    // ✅ CORRECTION SECTION 5 : Utiliser StateManager
    stopTimer();
    try { window.__QUIZ_ACTIVE = false; } catch (e) {}
    setIsPaused(false);
    setPausedDuration(0);
    setPauseStartedAt(null);
    setHasCurrentQuestionBeenAnswered(false);
    document.getElementById('quiz-view')?.classList.add('view-hidden');
    document.getElementById('dashboard-view')?.classList.remove('view-hidden');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-ap-red-dark', 'text-white');
        link.classList.add('text-white');
    });
    document.getElementById('nav-dashboard')?.classList.add('bg-ap-red-dark', 'text-white');
    
    // Toast de confirmation
    toast.info('Retour au tableau de bord', 2000);
    
    // ✅ FIX: Recharger les données du dashboard (sans reload) pour afficher la progression à jour
    setTimeout(async () => {
        try {
            console.log('🔄 Début rechargement dashboard après quiz...');
            
            // ✅ CRITIQUE: Invalider TOUT le cache avant de recharger pour forcer la lecture depuis Firestore
            const { invalidateByDataType } = await import('./services/cache-service.js');
            invalidateByDataType('annualProgress');
            invalidateByDataType('monthlyProgress');
            invalidateByDataType('quizResults');
            console.log('🗑️ Cache invalidé');
            
            // ✅ Recharger le dashboard avec les nouvelles données
            const { initializeDashboard } = await import('./dashboard.js');
            if (typeof initializeDashboard === 'function') {
                await initializeDashboard();
                console.log('✅ Dashboard rechargé après quiz');
            }
        } catch (error) {
            console.error('❌ Erreur rechargement dashboard:', error);
            // Fallback: recharger la page si l'import échoue
            window.location.reload();
        }
    }, 1500); // ✅ Augmenté de 500ms à 1500ms pour laisser le temps à Firestore d'écrire
}
