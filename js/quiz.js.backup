// Module Quiz - Interface de questions style professionnel
import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getCurrentUser } from './auth.js';
import { launchConfetti } from './confetti.js';
import { saveQuizResult } from './firestore-service.js';

// Configuration des modules (métadonnées uniquement)
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
                reference: "Section 5.1"
            }
        ]
    },
    'loisir': {
        name: 'Quiz Loisir - Janvier',
        module: 'VTT, Motoneige, etc.',
        color: 'cyan',
        questions: [
            {
                id: 1,
                question: "Quelle est la période de garantie standard pour un VTT neuf?",
                tags: ['garantie', 'VTT'],
                options: [
                    { id: 'A', text: '6 mois', correct: false },
                    { id: 'B', text: '1 an', correct: true },
                    { id: 'C', text: '2 ans', correct: false },
                    { id: 'D', text: '3 ans', correct: false }
                ],
                explanation: "La garantie standard pour un VTT neuf est de 1 an ou 1 000 km, selon la première éventualité.",
                reference: "Programme VTT 2024"
            }
        ]
    },
    'vr': {
        name: 'Quiz VR - Janvier',
        module: 'Véhicules Récréatifs',
        color: 'orange',
        questions: [
            {
                id: 1,
                question: "Quelle inspection est requise avant la livraison d'un VR?",
                tags: ['procédures', 'inspection'],
                options: [
                    { id: 'A', text: 'Inspection visuelle seulement', correct: false },
                    { id: 'B', text: 'Inspection complète PDI', correct: true },
                    { id: 'C', text: 'Test routier uniquement', correct: false },
                    { id: 'D', text: 'Aucune inspection requise', correct: false }
                ],
                explanation: "Une inspection PDI (Pre-Delivery Inspection) complète est obligatoire avant toute livraison de VR.",
                reference: "Manuel PDI VR"
            }
        ]
    },
    'tracteur': {
        name: 'Quiz Tracteur - Janvier',
        module: 'Équipement Agricole',
        color: 'green',
        questions: [
            {
                id: 1,
                question: "Quelle est la fréquence d'entretien recommandée pour un tracteur agricole?",
                tags: ['entretien', 'maintenance'],
                options: [
                    { id: 'A', text: 'Tous les 50 heures', correct: true },
                    { id: 'B', text: 'Tous les 100 heures', correct: false },
                    { id: 'C', text: 'Tous les 200 heures', correct: false },
                    { id: 'D', text: 'Une fois par an', correct: false }
                ],
                explanation: "L'entretien préventif est recommandé tous les 50 heures d'utilisation ou tous les 3 mois.",
                reference: "Guide d'entretien 2024"
            }
        ]
    }
};

// État du quiz
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let startTime = null;
let timerInterval = null;
let questionStartTime = null;
let currentStreak = 0; // Nombre de réponses correctes consécutives
let isPaused = false;
let pausedTime = 0;

// Couleurs par module
const moduleColors = {
    'indigo': { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600' },
    'cyan': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-600' },
    'orange': { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600' },
    'green': { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-600' }
};

// Initialiser le quiz
export function startQuiz(moduleId) {
    currentQuiz = quizData[moduleId];
    if (!currentQuiz) {
        console.error('Module de quiz non trouvé:', moduleId);
        return;
    }
    
    currentQuestionIndex = 0;
    userAnswers = [];
    startTime = Date.now();
    questionStartTime = Date.now();
    currentStreak = 0;
    
    showQuizView();
    renderQuestion();
    startTimer();
    updateScoreDisplay();
}

// Afficher la vue du quiz
function showQuizView() {
    document.getElementById('dashboard-view')?.classList.add('view-hidden');
    document.getElementById('module-selection-view')?.classList.add('view-hidden');
    document.getElementById('login-view')?.classList.add('view-hidden');
    
    let quizView = document.getElementById('quiz-view');
    if (!quizView) {
        quizView = document.createElement('div');
        quizView.id = 'quiz-view';
        document.querySelector('main').appendChild(quizView);
    }
    quizView.classList.remove('view-hidden');
}

// Rendre la question actuelle
function renderQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const quizView = document.getElementById('quiz-view');
    const colorScheme = moduleColors[currentQuiz.color];
    
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
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${question.tags.map(tag => `
                            <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                ${tag}
                            </span>
                        `).join('')}
                    </div>
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

    // Attacher les événements
    attachQuestionEvents();
    updateScoreDisplay();
}

// Mettre à jour l'affichage du score en temps réel
function updateScoreDisplay() {
    const correctAnswers = userAnswers.filter(a => a.correct).length;
    const answeredQuestions = userAnswers.length;
    const totalQuestions = currentQuiz.questions.length;
    
    let scoreText = 'Score: 0%';
    if (answeredQuestions > 0) {
        const currentScore = Math.round((correctAnswers / totalQuestions) * 100);
        scoreText = `Score: ${currentScore}%`;
    }
    
    const scoreElement = document.getElementById('quiz-score');
    if (scoreElement) {
        scoreElement.textContent = scoreText;
        
        // Animation de mise à jour
        scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Afficher l'indicateur de combo
function showComboIndicator() {
    if (currentStreak < 2) return; // Afficher seulement à partir de 2
    
    const multiplier = Math.min(currentStreak, 5); // Max x5
    const comboDiv = document.createElement('div');
    comboDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
    comboDiv.innerHTML = `
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
            <div class="text-6xl font-bold text-center mb-2">x${multiplier}</div>
            <div class="text-xl font-semibold text-center">COMBO!</div>
            <div class="text-sm text-center opacity-90 mt-1">${currentStreak} réponses d'affilée 🔥</div>
        </div>
    `;
    document.body.appendChild(comboDiv);
    
    setTimeout(() => {
        comboDiv.remove();
    }, 2000);
}

// Attacher les événements de la question
function attachQuestionEvents() {
    // Événements pour les options
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => handleAnswer(button));
    });

    // Bouton mode focus
    document.getElementById('focus-mode-btn')?.addEventListener('click', toggleFocusMode);
    
    // Bouton pause
    document.getElementById('pause-btn')?.addEventListener('click', togglePause);

    // Bouton quitter
    document.getElementById('quit-quiz-btn')?.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir quitter le quiz? Votre progression sera perdue.')) {
            stopTimer();
            returnToDashboard();
        }
    });

    // Bouton question suivante
    document.getElementById('next-question-btn')?.addEventListener('click', nextQuestion);
}

// Toggle mode focus (masquer la sidebar)
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    const btn = document.getElementById('focus-mode-btn');
    if (btn) {
        if (document.body.classList.contains('focus-mode')) {
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Quitter Focus
            `;
        } else {
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Focus
            `;
        }
    }
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');
    
    if (isPaused) {
        // Mettre en pause
        stopTimer();
        pausedTime = Date.now();
        
        // Afficher l'overlay de pause
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        pauseOverlay.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
                <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-3xl font-bold text-slate-900 mb-3">Quiz en Pause</h2>
                <p class="text-slate-600 mb-8">Prenez votre temps. Cliquez sur "Reprendre" quand vous êtes prêt.</p>
                <button id="resume-btn" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all">
                    Reprendre le Quiz
                </button>
            </div>
        `;
        document.body.appendChild(pauseOverlay);
        
        document.getElementById('resume-btn')?.addEventListener('click', () => {
            togglePause();
        });
        
        if (btn) {
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Reprendre
            `;
        }
    } else {
        // Reprendre
        const timeElapsed = Date.now() - pausedTime;
        questionStartTime += timeElapsed;
        startTime += timeElapsed;
        startTimer();
        
        document.getElementById('pause-overlay')?.remove();
        
        if (btn) {
            btn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Pause
            `;
        }
    }
}

// Gérer la réponse sélectionnée
function handleAnswer(button) {
    const optionId = button.getAttribute('data-option-id');
    const question = currentQuiz.questions[currentQuestionIndex];
    const selectedOption = question.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.correct;
    
    // Calculer le temps de réponse
    const responseTime = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Gestion du streak
    if (isCorrect) {
        currentStreak++;
        showComboIndicator();
    } else {
        currentStreak = 0;
    }
    
    // Sauvegarder la réponse
    userAnswers.push({
        questionId: question.id,
        selectedOption: optionId,
        correct: isCorrect,
        responseTime: responseTime
    });
    
    // Mettre à jour le score en temps réel
    updateScoreDisplay();

    // Désactiver tous les boutons
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:border-' + currentQuiz.color + '-400');
        btn.classList.remove('hover:bg-' + currentQuiz.color + '-50');
    });

    // Afficher le feedback visuel
    question.options.forEach(option => {
        const btn = document.querySelector(`[data-option-id="${option.id}"]`);
        if (option.correct) {
            // Réponse correcte en vert
            btn.classList.add('border-green-500', 'bg-green-50');
            btn.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-lg text-green-700 font-medium">${option.text}</span>
                </div>
            `;
        } else if (option.id === optionId && !isCorrect) {
            // Réponse incorrecte en rouge
            btn.classList.add('border-red-500', 'bg-red-50');
            btn.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <span class="text-lg text-red-700 font-medium">${option.text}</span>
                </div>
            `;
        }
    });

    // Afficher l'explication
    showExplanation(question, isCorrect);
    
    // Afficher le bouton suivant après un délai
    setTimeout(() => {
        document.getElementById('next-button-area')?.classList.remove('hidden');
    }, 1000);
}

// Afficher l'explication
function showExplanation(question, isCorrect) {
    const explanationArea = document.getElementById('explanation-area');
    if (!explanationArea) return;

    explanationArea.innerHTML = `
        <div class="flex gap-4">
            <div class="flex-shrink-0">
                ${isCorrect ? `
                    <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                ` : `
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                `}
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-semibold ${isCorrect ? 'text-green-900' : 'text-red-900'} mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Explication
                </h3>
                <p class="text-slate-700 leading-relaxed mb-3">
                    ${question.explanation}
                </p>
                <div class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    ${question.reference}
                </div>
            </div>
        </div>
    `;
    explanationArea.classList.remove('hidden');
}

// Question suivante
function nextQuestion() {
    currentQuestionIndex++;
    questionStartTime = Date.now();
    
    if (currentQuestionIndex < currentQuiz.questions.length) {
        renderQuestion();
        updateScoreDisplay();
    } else {
        showResults();
    }
}

// Messages de motivation personnalisés
function getMotivationMessage(score) {
    if (score === 100) return "🏆 Performance Parfaite!";
    if (score >= 90) return "🌟 Excellent Travail!";
    if (score >= 80) return "✨ Très Bien Réussi!";
    if (score >= 70) return "👍 Bon Travail!";
    if (score >= 60) return "💪 Passable - Vous Progressez!";
    return "📚 Continuez à Vous Former!";
}

function getMotivationDetails(score) {
    if (score === 100) {
        return "Incroyable! Vous maîtrisez parfaitement ce module. Vous êtes un véritable expert!";
    }
    if (score >= 90) {
        return "Votre expertise est impressionnante! Continuez sur cette lancée exceptionnelle.";
    }
    if (score >= 80) {
        return "Félicitations! Vous avez une excellente compréhension du sujet. Quelques révisions et vous serez au top!";
    }
    if (score >= 70) {
        return "Bon résultat! Avec un peu plus de pratique, vous atteindrez l'excellence.";
    }
    if (score >= 60) {
        return "C'est un bon début! Revoyez les concepts clés et tentez à nouveau le quiz pour améliorer votre score.";
    }
    return "Ne vous découragez pas! La formation continue est la clé du succès. Consultez les ressources et réessayez.";
}

// Afficher les résultats
async function showResults() {
    stopTimer();
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = userAnswers.filter(a => a.correct).length;
    const totalQuestions = currentQuiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Sauvegarder les résultats dans Firebase
    try {
        const user = getCurrentUser();
        if (user) {
            console.log('💾 Sauvegarde des résultats dans Firebase...');
            
            const quizResult = {
                moduleId: Object.keys(quizData).find(key => quizData[key] === currentQuiz),
                moduleName: currentQuiz.name,
                score: score,
                correctAnswers: correctAnswers,
                totalQuestions: totalQuestions,
                timeElapsed: totalTime,
                answers: userAnswers,
                month: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            };
            
            await saveQuizResult(quizResult);
            console.log('✅ Résultats sauvegardés avec succès');
        } else {
            console.log('ℹ️ Mode démo - résultats non sauvegardés');
        }
    } catch (error) {
        console.error('❌ Erreur sauvegarde résultats:', error);
        // Continuer même si la sauvegarde échoue
    }
    
    // Lancer les confettis pour un bon score
    if (score >= 80) {
        setTimeout(() => launchConfetti(), 500);
    }
    
    const quizView = document.getElementById('quiz-view');
    const colorScheme = moduleColors[currentQuiz.color];
    
    quizView.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
            <div class="max-w-2xl w-full">
                <!-- Carte de résultats -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <!-- En-tête -->
                    <div class="${colorScheme.bg} px-8 py-12 text-center text-white">
                        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white bg-opacity-20 mb-6">
                            ${score >= 80 ? `
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ` : `
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            `}
                        </div>
                        <h1 class="text-4xl font-bold mb-2">Quiz Terminé!</h1>
                        <p class="text-xl opacity-90">${currentQuiz.name}</p>
                    </div>

                    <!-- Score principal -->
                    <div class="px-8 py-12 text-center border-b border-gray-100">
                        <div class="inline-flex flex-col items-center">
                            <span class="text-7xl font-bold ${colorScheme.text}">${score}%</span>
                            <span class="text-lg text-slate-600 mt-2">${correctAnswers} sur ${totalQuestions} bonnes réponses</span>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div class="px-8 py-8 grid grid-cols-3 gap-6 border-b border-gray-100">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-slate-900">${totalQuestions}</div>
                            <div class="text-sm text-slate-500 mt-1">Questions</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-slate-900">${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}</div>
                            <div class="text-sm text-slate-500 mt-1">Temps total</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-slate-900">${Math.floor(totalTime / totalQuestions)}s</div>
                            <div class="text-sm text-slate-500 mt-1">Par question</div>
                        </div>
                    </div>

                    <!-- Message de motivation -->
                    <div class="px-8 py-8 bg-slate-50">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full ${score >= 80 ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center">
                                <svg class="w-5 h-5 ${score >= 80 ? 'text-green-600' : 'text-yellow-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-semibold text-slate-900 mb-1">${getMotivationMessage(score)}</h3>
                                <p class="text-sm text-slate-600">${getMotivationDetails(score)}</p>
                            </div>
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

    // Événements
    document.getElementById('retry-quiz-btn')?.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = [];
        startTime = Date.now();
        questionStartTime = Date.now();
        renderQuestion();
        startTimer();
    });

    document.getElementById('return-dashboard-btn')?.addEventListener('click', returnToDashboard);
}

// Timer du quiz
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
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
}

// Retour au dashboard
function returnToDashboard() {
    stopTimer();
    document.getElementById('quiz-view')?.classList.add('view-hidden');
    document.getElementById('dashboard-view')?.classList.remove('view-hidden');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-indigo-800', 'text-indigo-100');
        link.classList.add('text-indigo-300');
    });
    document.getElementById('nav-dashboard')?.classList.add('bg-indigo-800', 'text-indigo-100');
}

export { quizData };
