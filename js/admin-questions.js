// Admin Questions Manager - Gestion des questions de quiz
import { 
    getQuestions, 
    getQuestionsPaginated, // ✅ CORRECTION SECTION 7 : Pagination
    createQuestion, 
    updateQuestion, 
    deleteQuestion,
    importQuestionsFromJSON,
    getQuestionsStats
} from './firestore-service.js';
import { isDemoMode } from './auth.js';
import { 
    createQuestionSkeleton,
    createStatsSkeleton,
    showSkeleton,
    hideSkeleton
} from './skeleton.js';
import { logger } from './logger.js';
import { 
    sanitizeHTML, 
    validateQuestionData, 
    sanitizeQuestionData 
} from './security.js';

// ✅ Clé localStorage pour persistance mode démo
const DEMO_STORAGE_KEY = 'avantage-quizz-demo-questions';

// ✅ Charger les questions démo depuis localStorage OU utiliser défauts
function loadDemoQuestions() {
    if (!isDemoMode()) return [];
    
    const saved = localStorage.getItem(DEMO_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Reconvertir les dates ISO en objets Date
            return parsed.map(q => ({
                ...q,
                createdAt: new Date(q.createdAt)
            }));
        } catch (e) {
            console.warn('⚠️ Erreur lecture questions démo:', e);
        }
    }
    
    // Questions par défaut
    return [
        { id: '1', module: 'auto', month: 11, year: 2025, question: 'Quelle est la pression recommandée pour les pneus d\'une voiture standard ?', options: ['32 PSI', '25 PSI', '40 PSI', '50 PSI'], correctAnswer: 0, explanation: 'La pression recommandée est généralement de 32 PSI pour un véhicule standard.', createdAt: new Date() },
        { id: '2', module: 'auto', month: 11, year: 2025, question: 'À quelle fréquence doit-on changer l\'huile moteur ?', options: ['Tous les 5000 km', 'Tous les 10000 km', 'Tous les 15000 km', 'Tous les 20000 km'], correctAnswer: 1, explanation: 'Il est recommandé de changer l\'huile tous les 10000 km ou selon les recommandations du fabricant.', createdAt: new Date() },
        { id: '3', module: 'loisir', month: 11, year: 2025, question: 'Quel est le poids maximal recommandé pour un bateau remorqué ?', options: ['1500 kg', '2000 kg', '2500 kg', '3000 kg'], correctAnswer: 2, explanation: 'Pour un véhicule standard, 2500 kg est souvent la limite recommandée.', createdAt: new Date() },
        { id: '4', module: 'vr', month: 10, year: 2025, question: 'Quelle est la capacité minimale recommandée pour une batterie de VR ?', options: ['75 Ah', '100 Ah', '125 Ah', '150 Ah'], correctAnswer: 1, explanation: 'Une batterie de 100 Ah est le minimum recommandé pour un VR.', createdAt: new Date() },
        { id: '5', module: 'tracteur', month: 10, year: 2025, question: 'À quelle profondeur doit-on labourer pour les cultures céréalières ?', options: ['10-15 cm', '20-25 cm', '30-35 cm', '40-45 cm'], correctAnswer: 1, explanation: 'La profondeur idéale est de 20-25 cm pour les céréales.', createdAt: new Date() }
    ];
}

// ✅ Sauvegarder les questions démo dans localStorage
function saveDemoQuestions(questions) {
    if (!isDemoMode()) return;
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(questions));
    console.log('💾 Questions démo sauvegardées:', questions.length);
}

// ✅ Données simulées pour le mode démo
let MOCK_QUESTIONS = loadDemoQuestions();

const MOCK_STATS = {
    total: 240,
    byModule: { auto: 85, loisir: 62, vr: 54, tracteur: 39 },
    recent: 12
};

// État de l'application
let currentQuestions = [];
let currentFilters = {
    module: '',
    month: '',
    year: new Date().getFullYear()
};
let currentPage = 1;
const questionsPerPage = 20;

/**
 * Initialiser la gestion des questions
 */
export async function initQuestionsManager() {
    console.log('Initialisation du gestionnaire de questions');
    
    // Charger les questions
    await loadQuestions();
    
    // Charger les statistiques
    await loadStats();
    
    // Initialiser les event listeners
    initEventListeners();
}

/**
 * Initialiser les event listeners
 */
function initEventListeners() {
    // Formulaire de création
    const createForm = document.getElementById('create-question-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateQuestion);
    }
    
    // Upload JSON
    const jsonInput = document.getElementById('json-file-input');
    if (jsonInput) {
        jsonInput.addEventListener('change', handleJSONUpload);
    }
    
    // Bouton parcourir
    const browseBtn = document.getElementById('browse-json-btn');
    if (browseBtn) {
        browseBtn.addEventListener('click', () => jsonInput?.click());
    }
    
    // Filtres
    const moduleFilter = document.getElementById('filter-module');
    const monthFilter = document.getElementById('filter-month');
    const yearFilter = document.getElementById('filter-year');
    const searchInput = document.getElementById('search-questions');
    const questionsList = document.getElementById('questions-list');
    
    if (moduleFilter) moduleFilter.addEventListener('change', handleFilterChange);
    if (monthFilter) monthFilter.addEventListener('change', handleFilterChange);
    if (yearFilter) yearFilter.addEventListener('change', handleFilterChange);
    if (searchInput) searchInput.addEventListener('input', handleSearch);

    if (questionsList && !questionsList.dataset.eventsBound) {
        questionsList.addEventListener('click', handleQuestionsListClick);
        questionsList.dataset.eventsBound = 'true';
    }
    
    // Pagination
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    
    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));
}

function handleQuestionsListClick(event) {
    const actionButton = event.target.closest('.edit-question-btn, .delete-question-btn');
    if (!actionButton) {
        return;
    }

    const questionId = actionButton.dataset.questionId;
    if (!questionId) {
        return;
    }

    if (actionButton.classList.contains('edit-question-btn')) {
        openEditModal(questionId);
        return;
    }

    if (actionButton.classList.contains('delete-question-btn')) {
        handleDeleteQuestion(questionId);
    }
}

/**
 * Charger les questions avec filtres
 */
async function loadQuestions() {
    try {
        // Afficher skeleton pendant le chargement
        const container = document.getElementById('questions-list');
        if (container) {
            showSkeleton('questions-list', createQuestionSkeleton(5));
        }
        
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            console.log('📝 Mode démo : Chargement des questions simulées...');
            
            // Simuler un délai de chargement
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Appliquer les filtres sur les données mockées
            currentQuestions = MOCK_QUESTIONS.filter(q => {
                if (currentFilters.module && q.module !== currentFilters.module) return false;
                if (currentFilters.month && q.month !== parseInt(currentFilters.month)) return false;
                if (currentFilters.year && q.year !== parseInt(currentFilters.year)) return false;
                return true;
            });
            
            console.log(`✅ ${currentQuestions.length} questions simulées chargées`);
            renderQuestionsList();
            return;
        }
        
        // Mode Firebase normal
        const filters = {};
        if (currentFilters.module) filters.module = currentFilters.module;
        if (currentFilters.month) filters.month = parseInt(currentFilters.month);
        if (currentFilters.year) filters.year = parseInt(currentFilters.year);
        
        currentQuestions = await getQuestions(filters);
        console.log(`Questions chargees: ${currentQuestions.length}`);
        
        renderQuestionsList();
    } catch (error) {
        console.error('Erreur chargement questions:', error);
        const container = document.getElementById('questions-list');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Afficher la liste des questions
 */
function renderQuestionsList() {
    const container = document.getElementById('questions-list');
    if (!container) return;
    
    if (currentQuestions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-12 text-slate-500';
        emptyState.innerHTML = `
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg font-medium">Aucune question trouvee</p>
            <p class="text-sm">Creez votre premiere question ou importez un fichier JSON</p>
        `;
        container.replaceChildren(emptyState);
        return;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const paginatedQuestions = currentQuestions.slice(startIndex, endIndex);

    const fragment = document.createDocumentFragment();
    paginatedQuestions.forEach(question => {
        fragment.appendChild(createQuestionCardElement(question));
    });

    container.replaceChildren(fragment);

    // Mettre à jour la pagination
    updatePaginationControls();
}

/**
 * Créer une carte de question sous forme de noeud DOM
 */
function createQuestionCardElement(question) {
    const moduleColors = {
        auto: 'red',
        loisir: 'cyan',
        vr: 'orange',
        tracteur: 'green'
    };
    
    const moduleIcons = {
        auto: '🚗',
        loisir: '🏔️',
        vr: '🚐',
        tracteur: '🚜'
    };
    
    const color = moduleColors[question.module] || 'gray';
    const icon = moduleIcons[question.module] || '📝';
    
    const monthNames = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[question.month - 1] || question.month;
    const createdAt = question.createdAt?.seconds
        ? new Date(question.createdAt.seconds * 1000)
        : question.createdAt instanceof Date
            ? question.createdAt
            : null;
    const createdAtDisplay = createdAt ? createdAt.toLocaleDateString('fr-FR') : 'N/A';
    
    const template = document.createElement('template');
    template.innerHTML = `
        <article class="question-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-question-id="${question.id}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${icon}</span>
                    <div>
                        <span class="inline-block bg-${color}-100 text-${color}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${escapeHtml(question.module.toUpperCase())}
                        </span>
                        <span class="ml-2 text-sm text-slate-500">${escapeHtml(`${monthName} ${question.year}`)}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="edit-question-btn text-ap-red-primary hover:text-ap-red-dark p-2 rounded hover:bg-ap-red-50 transition" data-question-id="${question.id}" title="Modifier">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="delete-question-btn text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition" data-question-id="${question.id}" title="Supprimer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <h4 class="text-lg font-semibold text-slate-900 mb-4">${escapeHtml(question.question)}</h4>
            <div class="space-y-2 mb-4">
                ${question.options.map((opt, idx) => `
                    <div class="flex items-start gap-2 text-sm ${idx === question.correctAnswer ? 'font-semibold text-green-700 bg-green-50 p-2 rounded' : 'text-slate-600'}">
                        <span class="font-bold">${String.fromCharCode(65 + idx)})</span>
                        <span>${escapeHtml(opt)}</span>
                        ${idx === question.correctAnswer ? '<svg class="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' : ''}
                    </div>
                `).join('')}
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p class="text-xs font-semibold text-blue-700 mb-1">💡 Explication</p>
                <p class="text-sm text-blue-900">${escapeHtml(question.explanation)}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                Creee le: ${escapeHtml(createdAtDisplay)}${question.createdBy ? escapeHtml(` | Par: ${question.createdBy}`) : ''}
            </div>
        </article>
    `;

    return template.content.firstElementChild;
}

/**
 * Gérer la création d'une question
 */
async function handleCreateQuestion(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creation...';
        
        const questionData = {
            question: form.querySelector('[name="question"]').value,
            options: [
                form.querySelector('[name="option1"]').value,
                form.querySelector('[name="option2"]').value,
                form.querySelector('[name="option3"]').value,
                form.querySelector('[name="option4"]').value
            ],
            correctAnswer: parseInt(form.querySelector('[name="correctAnswer"]:checked').value),
            explanation: form.querySelector('[name="explanation"]').value,
            module: form.querySelector('[name="module"]').value,
            month: parseInt(form.querySelector('[name="month"]').value),
            year: parseInt(form.querySelector('[name="year"]').value)
        };
        
        // ✅ Mode démo : Simuler la création
        if (isDemoMode()) {
            console.log('📝 Mode démo : Simulation création question...');
            await new Promise(resolve => setTimeout(resolve, 500)); // Délai réaliste
            
            // Ajouter la question aux données mockées
            const newMockQuestion = {
                id: `demo-${Date.now()}`,
                ...questionData,
                explanation: questionData.explanation || 'Explication non fournie',
                createdAt: new Date()
            };
            MOCK_QUESTIONS.unshift(newMockQuestion);
            
            // 💾 SAUVEGARDER dans localStorage
            saveDemoQuestions(MOCK_QUESTIONS);
            
            showSuccess('✅ Question créée avec succès (mode démo) !');
            form.reset();
            
            await loadQuestions();
            await loadStats();
            return;
        }
        
        await createQuestion(questionData);
        
        showSuccess('Question creee avec succes!');
        form.reset();
        await loadQuestions();
        await loadStats();
    } catch (error) {
        console.error('Erreur creation question:', error);
        showError('create-question-error', error.message || 'Erreur lors de la creation');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

/**
 * Gérer l'upload JSON
 */
async function handleJSONUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        showLoading('json-preview');
        
        const text = await file.text();
        const jsonData = JSON.parse(text);
        
        // Valider le format
        validateJSONFormat(jsonData);
        
        // Afficher l'aperçu
        showJSONPreview(jsonData, file.name);
    } catch (error) {
        console.error('Erreur lecture JSON:', error);
        showError('json-preview', error.message || 'Fichier JSON invalide');
    }
}

/**
 * Valider le format JSON
 */
function validateJSONFormat(data) {
    if (!data.module || !data.month || !data.year) {
        throw new Error('Champs obligatoires manquants: module, month, year');
    }
    
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Le fichier doit contenir au moins une question');
    }
    
    // Valider chaque question
    data.questions.forEach((q, idx) => {
        if (!q.question || q.question.length < 10) {
            throw new Error(`Question ${idx + 1}: texte trop court (min 10 caracteres)`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
            throw new Error(`Question ${idx + 1}: doit avoir exactement 4 options`);
        }
        if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
            throw new Error(`Question ${idx + 1}: correctAnswer invalide (doit etre 0-3)`);
        }
        if (!q.explanation || q.explanation.length < 20) {
            throw new Error(`Question ${idx + 1}: explication trop courte (min 20 caracteres)`);
        }
    });
    
    return true;
}

/**
 * Afficher l'aperçu du JSON
 */
function showJSONPreview(data, fileName) {
    const container = document.getElementById('json-preview');
    if (!container) return;
    
    const moduleNames = {
        auto: 'Auto',
        loisir: 'Loisir',
        vr: 'VR',
        tracteur: 'Tracteur'
    };
    
    const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
    
    container.innerHTML = `
        <div class="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h4 class="text-lg font-bold text-green-900 mb-2">📄 ${fileName}</h4>
                    <div class="space-y-1 text-sm">
                        <p class="text-green-800">✓ Format valide</p>
                        <p class="text-green-800">✓ ${data.questions.length} question(s) detectee(s)</p>
                        <p class="text-green-800">✓ Module: ${moduleNames[data.module] || data.module}</p>
                        <p class="text-green-800">✓ Periode: ${monthNames[data.month - 1]} ${data.year}</p>
                    </div>
                </div>
                <button id="cancel-import-btn" class="text-slate-500 hover:text-slate-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="bg-white rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
                <p class="font-semibold text-slate-900 mb-2">Apercu des premieres questions:</p>
                <ol class="space-y-2 text-sm text-slate-700">
                    ${data.questions.slice(0, 5).map((q, idx) => `
                        <li><strong>${idx + 1}.</strong> ${escapeHtml(q.question.substring(0, 80))}${q.question.length > 80 ? '...' : ''}</li>
                    `).join('')}
                    ${data.questions.length > 5 ? `<li class="text-slate-500 italic">... et ${data.questions.length - 5} autre(s)</li>` : ''}
                </ol>
            </div>
            
            <div class="flex gap-3">
                <button id="confirm-import-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Importer les ${data.questions.length} questions →
                </button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('confirm-import-btn')?.addEventListener('click', () => handleConfirmImport(data));
    document.getElementById('cancel-import-btn')?.addEventListener('click', () => {
        container.innerHTML = '';
        document.getElementById('json-file-input').value = '';
    });
}

/**
 * Confirmer l'import JSON
 */
async function handleConfirmImport(data) {
    const container = document.getElementById('json-preview');
    const confirmBtn = document.getElementById('confirm-import-btn');
    
    try {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Import en cours...';
        
        // ✅ Mode démo : Simuler l'import
        if (isDemoMode()) {
            console.log('📝 Mode démo : Simulation import JSON...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const questionsToImport = data.questions || [];
            questionsToImport.forEach((q, idx) => {
                MOCK_QUESTIONS.unshift({
                    id: `demo-imported-${Date.now()}-${idx}`,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || 'Pas d\'explication fournie',
                    module: data.module,
                    month: data.month,
                    year: data.year,
                    createdAt: new Date()
                });
            });
            
            // 💾 SAUVEGARDER dans localStorage
            saveDemoQuestions(MOCK_QUESTIONS);
            
            showSuccess(`✅ Import terminé (mode démo): ${questionsToImport.length} questions importées`);
            
            container.innerHTML = '';
            document.getElementById('json-file-input').value = '';
            
            await loadQuestions();
            await loadStats();
            return;
        }
        
        const result = await importQuestionsFromJSON(data);
        
        showSuccess(`Import termine: ${result.success}/${result.total} questions importees`);
        
        if (result.errors.length > 0) {
            console.warn('Erreurs import:', result.errors);
        }
        
        container.innerHTML = '';
        document.getElementById('json-file-input').value = '';
        
        await loadQuestions();
        await loadStats();
    } catch (error) {
        console.error('Erreur import:', error);
        showError('json-preview', error.message || 'Erreur lors de l import');
    }
}

/**
 * Ouvrir le modal d'édition
 */
function openEditModal(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // TODO: Implementer le modal d'edition
    // Pour l'instant, on affiche une alerte
    alert(`Edition de la question ${questionId}\nA implementer: modal d'edition`);
}

/**
 * Gérer la suppression d'une question
 */
async function handleDeleteQuestion(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const confirmDelete = confirm(
        `Voulez-vous vraiment supprimer cette question?\n\n"${question.question.substring(0, 100)}..."\n\nCette action est irreversible.`
    );
    
    if (!confirmDelete) return;
    
    try {
        // ✅ Mode démo : Simuler la suppression
        if (isDemoMode()) {
            console.log('📝 Mode démo : Simulation suppression question...');
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const index = MOCK_QUESTIONS.findIndex(q => q.id === questionId);
            if (index > -1) {
                MOCK_QUESTIONS.splice(index, 1);
                
                // 💾 SAUVEGARDER dans localStorage
                saveDemoQuestions(MOCK_QUESTIONS);
            }
            
            showSuccess('✅ Question supprimée avec succès (mode démo)');
            await loadQuestions();
            await loadStats();
            return;
        }
        
        await deleteQuestion(questionId);
        showSuccess('Question supprimee avec succes');
        await loadQuestions();
        await loadStats();
    } catch (error) {
        console.error('Erreur suppression:', error);
        showError('questions-list', error.message || 'Erreur lors de la suppression');
    }
}

/**
 * Gérer le changement de filtres
 */
async function handleFilterChange(e) {
    const filterName = e.target.id.replace('filter-', '');
    currentFilters[filterName] = e.target.value;
    currentPage = 1; // Reset pagination
    await loadQuestions();
}

/**
 * Gérer la recherche
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        renderQuestionsList();
        return;
    }
    
    const filtered = currentQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm)) ||
        q.explanation.toLowerCase().includes(searchTerm)
    );
    
    // Afficher les résultats filtrés
    const container = document.getElementById('questions-list');
    if (!container) return;
    
    if (filtered.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-12 text-slate-500';
        emptyState.innerHTML = `
            <p class="text-lg">Aucun resultat pour "${escapeHtml(searchTerm)}"</p>
        `;
        container.replaceChildren(emptyState);
        return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach(question => {
        fragment.appendChild(createQuestionCardElement(question));
    });
    container.replaceChildren(fragment);
}

/**
 * Changer de page
 */
function changePage(direction) {
    const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    renderQuestionsList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Mettre à jour les contrôles de pagination
 */
function updatePaginationControls() {
    const totalPages = Math.ceil(currentQuestions.length / questionsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage}/${totalPages || 1}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

/**
 * Charger les statistiques des questions
 */
async function loadStats() {
    try {
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            console.log('📊 Mode démo : Chargement des stats simulées...');
            renderStats(MOCK_STATS);
            return;
        }
        
        // Mode Firebase normal
        const stats = await getQuestionsStats();
        renderStats(stats);
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

/**
 * Afficher les statistiques
 */
function renderStats(stats) {
    const container = document.getElementById('questions-stats');
    if (!container) return;
    
    const moduleNames = {
        auto: 'Auto',
        loisir: 'Loisir',
        vr: 'VR',
        tracteur: 'Tracteur'
    };
    
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">📊 Statistiques des Questions</h3>
            
            <div class="mb-6">
                <p class="text-3xl font-bold text-ap-red-primary mb-1">${stats.total}</p>
                <p class="text-sm text-slate-600">questions au total</p>
            </div>
            
            <div class="space-y-3">
                <p class="text-sm font-semibold text-slate-700 mb-2">Par module:</p>
                ${Object.entries(stats.byModule).map(([module, count]) => {
                    const percentage = ((count / stats.total) * 100).toFixed(0);
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate-700">${moduleNames[module] || module}</span>
                                <span class="font-semibold">${count} (${percentage}%)</span>
                            </div>
                            <div class="bg-slate-200 rounded-full h-2">
                                <div class="bg-ap-red-primary rounded-full h-2 transition-all" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Afficher un loader
 */
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-12">
            <svg class="animate-spin h-12 w-12 mx-auto text-ap-red-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600 mt-4">Chargement...</p>
        </div>
    `;
}

/**
 * Afficher une erreur
 */
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) {
        alert(`Erreur: ${message}`);
        return;
    }
    
    container.innerHTML = `
        <div class="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-900 font-semibold">${message}</p>
        </div>
    `;
}

/**
 * Afficher un message de succès
 */
function showSuccess(message) {
    // Créer une notification toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Échapper le HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
