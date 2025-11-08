// Module Quiz - Interface de questions style professionnel (VERSION 2.0 - Firestore)
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getCurrentUserUnified, isDemoMode } from './auth.js';
import { launchConfetti } from './confetti.js';
import { saveQuizResult } from './firestore-service.js';
import { toast, showLoadingToast, updateLoadingToast } from './toast.js';

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

// État du quiz
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;
let timerInterval = null;
let questionStartTime = null;
let currentStreak = 0;
let isPaused = false;
let totalPausedDuration = 0;
let pauseStartedAt = null;
let currentModule = null;
let currentMonth = null;
let currentYear = null;
let hasCurrentQuestionBeenAnswered = false;
let quizEventDelegationInitialized = false;

// Couleurs par module
const moduleColors = {
    'indigo': { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600' },
    'cyan': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-600' },
    'orange': { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600' },
    'green': { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-600' }
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
        const now = new Date();
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthNumber = now.getMonth() + 1;
        currentMonth = monthNames[monthNumber - 1];
        currentYear = now.getFullYear();
        currentModule = moduleId;
        
    // Indiquer qu'un quiz est en cours (utilisé pour confirmations de navigation)
    try { window.__QUIZ_ACTIVE = true; } catch (e) {}

    // Charger les questions depuis Firestore (numérique/texte)
        let questions = await loadQuizFromFirestore(moduleId, monthNumber, currentYear);

        // En mode Démo, si aucune question en base, charger depuis JSON local
        if (questions.length === 0 && isDemoMode()) {
            console.log('ℹ️ Mode Démo: chargement des questions locales de test');
            questions = await loadDemoQuestions(moduleId, monthNumber, currentYear);
        }
        
        if (questions.length === 0) {
            hideLoadingScreen();
            updateLoadingToast(loadingToast, 'Aucune question disponible', 'error');
            toast.error(`Aucune question trouvée pour ${config.label} en ${currentMonth} ${currentYear}.\n\nContactez l'administrateur.`, 5000);
            return;
        }
        
        // Créer l'objet quiz
        currentQuiz = {
            name: `Quiz ${config.label} - ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
            module: config.name,
            color: config.color,
            questions: questions
        };
        
        // Réinitialiser l'état
    currentQuestionIndex = 0;
    userAnswers = [];
    startTime = Date.now();
    questionStartTime = Date.now();
    currentStreak = 0;
    isPaused = false;
    totalPausedDuration = 0;
    pauseStartedAt = null;
    hasCurrentQuestionBeenAnswered = false;
        
        // Cacher l'écran de chargement et démarrer
    hideLoadingScreen();
    showQuizView();
        renderQuestion();
        startTimer();
        updateScoreDisplay();
        
        // Toast de succès
        updateLoadingToast(loadingToast, `${questions.length} questions chargées !`, 'success');
        
    } catch (error) {
        hideLoadingScreen();
        console.error('❌ Erreur lors du démarrage du quiz:', error);
        updateLoadingToast(loadingToast, 'Erreur de chargement', 'error');
        toast.error('Erreur lors du chargement du quiz. Veuillez réessayer.', 4000);
    }
}

// Écran de chargement
function showLoadingScreen(moduleName) {
    const quizView = getOrCreateQuizView();
    quizView.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Chargement du quiz ${moduleName}</h2>
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
        document.querySelector('main').appendChild(quizView);
    }
    initializeQuizEventDelegation(quizView);
    return quizView;
}

function initializeQuizEventDelegation(quizView) {
    if (quizEventDelegationInitialized || !quizView) {
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

    quizEventDelegationInitialized = true;
}

// Rendre la question actuelle
function renderQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const quizView = document.getElementById('quiz-view');
    const colorScheme = moduleColors[currentQuiz.color];
    hasCurrentQuestionBeenAnswered = false;
    
    quizView.innerHTML = `
        <!-- En-tête du quiz -->
        <div class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">${currentQuiz.name}</h1>
                        <p class="text-sm text-slate-500">Question ${currentQuestionIndex + 1} sur ${currentQuiz.questions.length}</p>
                    </div>
                    <div class="flex items-center gap-6">
                        <button id="focus-mode-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Focus
                        </button>
                        <button id="pause-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pause
                        </button>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span id="quiz-score" class="text-sm font-bold text-indigo-600">Score: 0%</span>
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
                
                <!-- Barre de progression -->
                <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div class="${colorScheme.bg} h-2 rounded-full transition-all duration-300" style="width: ${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%"></div>
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
                        ${question.question}
                    </h2>
                    
                    <!-- Tags -->
                    ${question.tags && question.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${question.tags.map(tag => `
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Options de réponse -->
                <div class="p-8">
                    <div class="space-y-3">
                        ${question.options.map(option => `
                            <button data-option-id="${option.id}" 
                                    class="option-button w-full text-left px-6 py-5 rounded-xl border-2 border-gray-200 hover:border-${currentQuiz.color}-400 hover:bg-${currentQuiz.color}-50 transition-all duration-200 group">
                                <div class="flex items-center gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-lg ${colorScheme.bg} bg-opacity-10 flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
                                        <span class="text-lg font-bold ${colorScheme.text}">${option.id}</span>
                                    </div>
                                    <span class="text-lg text-slate-700 group-hover:text-slate-900 font-medium">
                                        ${option.text}
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
                        <button id="next-question-btn" class="${colorScheme.bg} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
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
}

// Gérer la réponse de l'utilisateur
function handleAnswer(optionId) {
    if (hasCurrentQuestionBeenAnswered) {
        return;
    }
    const question = currentQuiz.questions[currentQuestionIndex];
    const selectedOption = question.options.find(opt => opt.id === optionId);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    hasCurrentQuestionBeenAnswered = true;
    
    // Enregistrer la réponse
    userAnswers.push({
        questionId: question.id,
        question: question.question,
        selectedAnswer: optionId,
        correctAnswer: question.options.find(opt => opt.correct).id,
        isCorrect: selectedOption.correct,
        timeSpent: timeSpent
    });
    
    // Mettre à jour le streak
    if (selectedOption.correct) {
        currentStreak++;
    } else {
        currentStreak = 0;
    }
    
    // Désactiver tous les boutons
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:border-indigo-400', 'hover:bg-indigo-50');
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
                    <p class="text-slate-700 mb-2"><strong>Explication :</strong> ${question.explanation}</p>
                    ${question.reference ? `<p class="text-sm text-slate-500"><strong>Référence :</strong> ${question.reference}</p>` : ''}
                </div>
            </div>
        `;
        explanationArea.classList.remove('hidden');
    }
}

// Passer à la question suivante
function nextQuestion() {
    questionStartTime = Date.now();
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuiz.questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

// Afficher les résultats finaux
function showResults() {
    stopTimer();
    try { window.__QUIZ_ACTIVE = false; } catch (e) {}
    
    const score = Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100);
    let pausedOffset = totalPausedDuration;
    if (isPaused && pauseStartedAt) {
        pausedOffset += Date.now() - pauseStartedAt;
    }
    const totalTime = Math.max(0, Math.floor((Date.now() - startTime - pausedOffset) / 1000));
    isPaused = false;
    pauseStartedAt = null;
    totalPausedDuration = 0;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    // Sauvegarder dans Firestore
    saveQuizToFirestore(score, totalTime);
    
    const colorScheme = moduleColors[currentQuiz.color];
    const quizView = document.getElementById('quiz-view');
    
    quizView.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Carte de résultat principale -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
                    <!-- Header avec score -->
                    <div class="bg-gradient-to-r from-${currentQuiz.color}-500 to-${currentQuiz.color}-700 px-8 py-12 text-center text-white">
                        <h1 class="text-4xl font-bold mb-4">Quiz Terminé ! 🎉</h1>
                        <div class="text-8xl font-bold mb-4">${score}%</div>
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
                        <button id="retry-quiz-btn" class="flex-1 ${colorScheme.bg} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all">
                            Refaire le quiz
                        </button>
                        <button id="return-dashboard-btn" class="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
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
    
    // Événements
    document.getElementById('retry-quiz-btn')?.addEventListener('click', () => {
        startQuiz(currentModule);
    });
    
    document.getElementById('return-dashboard-btn')?.addEventListener('click', returnToDashboard);
}

// Sauvegarder le résultat dans Firestore
async function saveQuizToFirestore(score, totalTime) {
    try {
        const user = getCurrentUserUnified();
        if (!user) {
            console.log('Aucun utilisateur - résultat non sauvegardé');
            return;
        }
        
        // En mode démo, ne pas sauvegarder dans Firestore
        if (isDemoMode()) {
            console.log('Mode démo - résultat non sauvegardé dans Firestore');
            toast.info('Mode Démo : les résultats ne sont pas sauvegardés');
            return;
        }
        
        const moduleDetails = moduleConfig[currentModule] || {};
        await saveQuizResult({
            moduleId: currentModule,
            moduleName: moduleDetails.name || currentQuiz.module || currentModule,
            score,
            correctAnswers: userAnswers.filter(a => a.isCorrect).length,
            totalQuestions: currentQuiz.questions.length,
            timeElapsed: totalTime,
            answers: userAnswers,
            month: currentMonth,
            year: currentYear
        });
        
        console.log('✅ Résultat sauvegardé dans Firestore');
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
    }
}

// Timer du quiz
function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        if (startTime === null) {
            return;
        }

        let pausedOffset = totalPausedDuration;
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
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    pauseStartedAt = null;
}

// Mettre à jour l'affichage du score
function updateScoreDisplay() {
    if (userAnswers.length === 0) return;
    
    const score = Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100);
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
    const pauseBtn = document.getElementById('pause-btn');
    if (!pauseBtn) {
        return;
    }

    if (!isPaused) {
        isPaused = true;
        pauseStartedAt = Date.now();
        pauseBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Reprendre';
        toast.warning('Quiz en pause. Cliquez sur "Reprendre" pour continuer.', 3000);
    } else {
        isPaused = false;
        if (pauseStartedAt) {
            totalPausedDuration += Date.now() - pauseStartedAt;
        }
        pauseStartedAt = null;
        pauseBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pause';
        toast.success('Quiz repris !', 2000);
    }
}

// Retour au dashboard
function returnToDashboard() {
    stopTimer();
    try { window.__QUIZ_ACTIVE = false; } catch (e) {}
    isPaused = false;
    totalPausedDuration = 0;
    pauseStartedAt = null;
    hasCurrentQuestionBeenAnswered = false;
    document.getElementById('quiz-view')?.classList.add('view-hidden');
    document.getElementById('dashboard-view')?.classList.remove('view-hidden');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-indigo-800', 'text-indigo-100');
        link.classList.add('text-indigo-300');
    });
    document.getElementById('nav-dashboard')?.classList.add('bg-indigo-800', 'text-indigo-100');
    
    // Toast de confirmation
    toast.info('Retour au tableau de bord', 2000);
    
    // Recharger le dashboard pour mettre à jour les stats
    setTimeout(() => window.location.reload(), 500);
}
