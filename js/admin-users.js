// Admin Users Manager - Gestion des utilisateurs
import { 
    getAllUsers, 
    updateUserRole,
    getUsersStats
} from './firestore-service.js';
import { toast } from './toast.js';
import { isDemoMode } from './auth.js';
import {
    createUserSkeleton,
    createStatsSkeleton,
    showSkeleton,
    hideSkeleton
} from './skeleton.js';

// ✅ Données simulées pour le mode démo
const MOCK_USERS = [
    { id: '1', email: 'admin@avantage-quizz.com', displayName: 'Administrateur Principal', role: 'admin', totalQuizzes: 0, averageScore: 0, createdAt: new Date('2025-01-15'), lastLogin: new Date() },
    { id: '2', email: 'alice.dupont@example.com', displayName: 'Alice Dupont', role: 'user', totalQuizzes: 24, averageScore: 92, createdAt: new Date('2025-02-20'), lastLogin: new Date() },
    { id: '3', email: 'bob.martin@example.com', displayName: 'Bob Martin', role: 'user', totalQuizzes: 21, averageScore: 88, createdAt: new Date('2025-03-10'), lastLogin: new Date(Date.now() - 86400000) },
    { id: '4', email: 'claire.bernard@example.com', displayName: 'Claire Bernard', role: 'user', totalQuizzes: 19, averageScore: 85, createdAt: new Date('2025-03-25'), lastLogin: new Date(Date.now() - 172800000) },
    { id: '5', email: 'david.dubois@example.com', displayName: 'David Dubois', role: 'user', totalQuizzes: 18, averageScore: 83, createdAt: new Date('2025-04-05'), lastLogin: new Date(Date.now() - 259200000) }
];

const MOCK_STATS = {
    total: 42,
    admins: 2,
    regularUsers: 40,
    activeToday: 8,
    activeWeek: 23
};

// État
let currentUsers = [];
let currentFilters = {
    role: '',
    status: 'all'
};

/**
 * Initialiser la gestion des utilisateurs
 */
export async function initUsersManager() {
    console.log('Initialisation du gestionnaire utilisateurs');
    
    // Charger les utilisateurs
    await loadUsers();
    
    // Charger les statistiques
    await loadStats();
    
    // Initialiser les event listeners
    initEventListeners();
}

/**
 * Initialiser les event listeners
 */
function initEventListeners() {
    // Formulaire de création d'utilisateur
    const createUserForm = document.getElementById('create-user-form');
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleCreateUser);
    }
    
    // Bouton génération de mot de passe
    const generatePasswordBtn = document.getElementById('generate-password-btn');
    if (generatePasswordBtn) {
        generatePasswordBtn.addEventListener('click', generateRandomPassword);
    }
    
    // Filtres
    const roleFilter = document.getElementById('filter-user-role');
    const statusFilter = document.getElementById('filter-user-status');
    const searchInput = document.getElementById('search-users');
    
    if (roleFilter) roleFilter.addEventListener('change', handleFilterChange);
    if (statusFilter) statusFilter.addEventListener('change', handleFilterChange);
    if (searchInput) searchInput.addEventListener('input', handleSearch);
}

/**
 * Créer un nouvel utilisateur
 */
async function handleCreateUser(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('create-user-error');
    const successDiv = document.getElementById('create-user-success');
    const submitBtn = document.getElementById('create-user-btn');
    
    // Masquer les messages
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    
    // Récupérer les données
    const formData = new FormData(e.target);
    const userData = {
        displayName: formData.get('displayName'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    // Validation
    if (!userData.displayName || !userData.email || !userData.password || !userData.role) {
        showFormError(errorDiv, 'Tous les champs sont obligatoires');
        toast.error('Veuillez remplir tous les champs');
        return;
    }
    
    if (userData.password.length < 6) {
        showFormError(errorDiv, 'Le mot de passe doit contenir au moins 6 caractères');
        toast.error('Mot de passe trop court (minimum 6 caractères)');
        return;
    }
    
    // Désactiver le bouton et afficher loading toast
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Création en cours...';
    const loadingToast = toast.showLoadingToast('Création de l\'utilisateur...');
    
    try {
        console.log('Création d\'un nouvel utilisateur:', userData.email);
        
        // Appeler la Cloud Function (à créer)
        // Pour l'instant, on simule avec un message d'erreur explicite
        toast.updateLoadingToast(loadingToast, 'Cloud Function requise', 'error');
        throw new Error('⚠️ CLOUD FUNCTION REQUISE: Cette fonctionnalité nécessite une Cloud Function Firebase pour créer des utilisateurs avec mot de passe. Actuellement, seule l\'authentification Google est supportée. Pour activer cette fonctionnalité:\n\n1. Activer Email/Password dans Firebase Auth\n2. Créer une Cloud Function createUser\n3. Déployer la fonction sur Firebase');
        
        // Code à utiliser une fois la Cloud Function créée:
        /*
        const createUserFunction = httpsCallable(functions, 'createUser');
        const result = await createUserFunction(userData);
        
        console.log('✅ Utilisateur créé avec succès:', result.data);
        
        // Afficher le message de succès
        successDiv.textContent = `✅ Utilisateur créé avec succès ! Email: ${userData.email}`;
        successDiv.classList.remove('hidden');
        
        // Toast de succès
        toast.updateLoadingToast(loadingToast, 'Utilisateur créé avec succès !', 'success');
        toast.success(`Utilisateur ${userData.email} créé !`, 4000);
        
        // Réinitialiser le formulaire
        e.target.reset();
        
        // Recharger la liste des utilisateurs
        await loadUsers();
        */
        
    } catch (error) {
        console.error('❌ Erreur création utilisateur:', error);
        showFormError(errorDiv, error.message);
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = '➕ Créer l\'utilisateur';
    }
}

/**
 * Générer un mot de passe aléatoire
 */
function generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&';
    const length = 12;
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Remplir le champ
    const passwordInput = document.querySelector('input[name="password"]');
    if (passwordInput) {
        passwordInput.value = password;
        passwordInput.type = 'text'; // Afficher le mot de passe généré
        
        // Copier dans le presse-papier
        navigator.clipboard.writeText(password).then(() => {
            toast.success('Mot de passe généré et copié ! Sauvegardez-le en lieu sûr.', 5000);
        }).catch(() => {
            toast.warning(`Mot de passe généré: ${password}\n\nCopiez-le manuellement.`, 7000);
        });
    }
}

/**
 * Afficher une erreur de formulaire
 */
function showFormError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Charger tous les utilisateurs
 */
async function loadUsers() {
    try {
        // Afficher skeleton pendant le chargement
        const container = document.getElementById('users-list');
        if (container) {
            showSkeleton('users-list', createUserSkeleton(10));
        }
        
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            console.log('👥 Mode démo : Chargement des utilisateurs simulés...');
            
            // Simuler un délai de chargement
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Appliquer les filtres sur les données mockées
            currentUsers = MOCK_USERS.filter(user => {
                if (currentFilters.role && user.role !== currentFilters.role) return false;
                
                if (currentFilters.status !== 'all') {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    const lastLoginDate = user.lastLogin;
                    const isActive = lastLoginDate > oneWeekAgo;
                    
                    if (currentFilters.status === 'active' && !isActive) return false;
                    if (currentFilters.status === 'inactive' && isActive) return false;
                }
                
                return true;
            });
            
            console.log(`✅ ${currentUsers.length} utilisateurs simulés chargés`);
            renderUsersList();
            return;
        }
        
        // Mode Firebase normal
        const filters = {};
        if (currentFilters.role) {
            filters.role = currentFilters.role;
        }
        
        currentUsers = await getAllUsers(filters);
        
        // Filtrer par statut actif/inactif côté client
        if (currentFilters.status !== 'all') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            currentUsers = currentUsers.filter(user => {
                if (!user.lastLogin) return currentFilters.status === 'inactive';
                
                const lastLoginDate = user.lastLogin.toDate ? user.lastLogin.toDate() : new Date(user.lastLogin);
                const isActive = lastLoginDate > oneWeekAgo;
                
                return currentFilters.status === 'active' ? isActive : !isActive;
            });
        }
        
        console.log(`Utilisateurs charges: ${currentUsers.length}`);
        renderUsersList();
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
        const container = document.getElementById('users-list');
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
 * Afficher la liste des utilisateurs
 */
function renderUsersList() {
    const container = document.getElementById('users-list');
    if (!container) return;
    
    if (currentUsers.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-500">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-lg font-medium">Aucun utilisateur trouve</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = currentUsers.map(user => renderUserCard(user)).join('');
    
    // Ajouter les event listeners
    addUserActionListeners();
}

/**
 * Rendu d'une carte utilisateur
 */
function renderUserCard(user) {
    const isAdmin = user.role === 'admin';
    const roleColor = isAdmin ? 'yellow' : 'blue';
    const roleIcon = isAdmin ? '🔰' : '👤';
    
    const lastLogin = user.lastLogin ? 
        (user.lastLogin.toDate ? user.lastLogin.toDate() : new Date(user.lastLogin)) : 
        null;
    
    const createdAt = user.createdAt ? 
        (user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt)) : 
        null;
    
    const isActive = lastLogin && (new Date() - lastLogin) < (7 * 24 * 60 * 60 * 1000);
    
    const lastLoginText = lastLogin ? formatRelativeTime(lastLogin) : 'Jamais connecte';
    
    const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=667eea&color=fff&size=128`;
    
    return `
        <div class="user-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-user-id="${user.uid}">
            <div class="flex items-start gap-4">
                <img src="${avatarUrl}" alt="${user.displayName || 'User'}" class="w-16 h-16 rounded-full object-cover flex-shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=U&background=667eea&color=fff&size=128'">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-lg font-bold text-slate-900 truncate">${escapeHtml(user.displayName || 'Sans nom')}</h4>
                            <p class="text-sm text-slate-600 truncate">${escapeHtml(user.email)}</p>
                        </div>
                        <div class="flex gap-2 flex-shrink-0 ml-4">
                            <button class="edit-user-btn text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 transition" data-user-id="${user.uid}" data-user-email="${user.email}" data-user-role="${user.role || 'user'}" title="Modifier">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 mb-3">
                        <span class="inline-flex items-center gap-1 bg-${roleColor}-100 text-${roleColor}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${roleIcon} ${isAdmin ? 'Admin' : 'User'}
                        </span>
                        <span class="inline-flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} text-xs px-3 py-1 rounded-full">
                            <span class="w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-400'}"></span>
                            ${isActive ? 'Actif' : 'Inactif'}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <p class="text-slate-500">Inscrit le:</p>
                            <p class="font-medium text-slate-900">${createdAt ? createdAt.toLocaleDateString('fr-FR') : 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-slate-500">Derniere connexion:</p>
                            <p class="font-medium text-slate-900">${lastLoginText}</p>
                        </div>
                    </div>
                    
                    ${!isAdmin ? renderUserStats(user) : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Rendu des statistiques utilisateur
 */
function renderUserStats(user) {
    const totalQuizzes = user.totalQuizzes || 0;
    const averageScore = user.averageScore || 0;
    const currentStreak = user.currentStreak || 0;
    
    return `
        <div class="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div>
                <p class="text-2xl font-bold text-indigo-600">${averageScore}%</p>
                <p class="text-xs text-slate-600">Score moyen</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-purple-600">${totalQuizzes}</p>
                <p class="text-xs text-slate-600">Quiz completes</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-orange-600">🔥 ${currentStreak}</p>
                <p class="text-xs text-slate-600">Serie active</p>
            </div>
        </div>
    `;
}

/**
 * Ajouter les event listeners
 */
function addUserActionListeners() {
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.currentTarget.dataset.userId;
            const userEmail = e.currentTarget.dataset.userEmail;
            const userRole = e.currentTarget.dataset.userRole;
            openEditRoleModal(userId, userEmail, userRole);
        });
    });
}

/**
 * Ouvrir le modal d'édition du rôle
 */
function openEditRoleModal(userId, userEmail, currentRole) {
    // Créer le modal
    const modal = document.createElement('div');
    modal.id = 'edit-role-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Modifier le role</h3>
                <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="mb-6">
                <p class="text-slate-600 mb-1">Utilisateur:</p>
                <p class="font-semibold text-slate-900">${escapeHtml(userEmail)}</p>
            </div>
            
            <div class="mb-6">
                <p class="text-slate-700 font-medium mb-3">Role actuel: <span class="text-indigo-600">${currentRole === 'admin' ? 'Admin' : 'User'}</span></p>
                
                <p class="text-sm font-semibold text-slate-700 mb-2">Modifier le role:</p>
                <div class="space-y-3">
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-500 transition ${currentRole !== 'admin' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}">
                        <input type="radio" name="role" value="user" ${currentRole !== 'admin' ? 'checked' : ''} class="mt-1">
                        <div>
                            <p class="font-semibold text-slate-900">👤 User (Utilisateur standard)</p>
                            <p class="text-sm text-slate-600">Acces uniquement au tableau de bord et aux quiz</p>
                        </div>
                    </label>
                    
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-yellow-500 transition ${currentRole === 'admin' ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200'}">
                        <input type="radio" name="role" value="admin" ${currentRole === 'admin' ? 'checked' : ''} class="mt-1">
                        <div>
                            <p class="font-semibold text-slate-900">🔰 Admin (Administrateur)</p>
                            <p class="text-sm text-slate-600">Acces total: gestion questions et utilisateurs</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p class="text-sm text-amber-900">
                    <strong>Attention:</strong> En passant User → Admin, cette personne aura acces a toutes les fonctions d administration.
                </p>
            </div>
            
            <div class="flex gap-3">
                <button id="cancel-role-btn" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition">
                    Annuler
                </button>
                <button id="save-role-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Enregistrer
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('close-modal-btn')?.addEventListener('click', () => modal.remove());
    document.getElementById('cancel-role-btn')?.addEventListener('click', () => modal.remove());
    document.getElementById('save-role-btn')?.addEventListener('click', async () => {
        const newRole = modal.querySelector('input[name="role"]:checked')?.value;
        if (newRole) {
            await handleUpdateRole(userId, userEmail, newRole);
            modal.remove();
        }
    });
    
    // Fermer en cliquant sur le backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

/**
 * Gérer la mise à jour du rôle
 */
async function handleUpdateRole(userId, userEmail, newRole) {
    const saveBtn = document.getElementById('save-role-btn');
    if (!saveBtn) return;
    
    const originalText = saveBtn.innerHTML;
    const loadingToast = toast.showLoadingToast('Mise à jour du rôle...');
    
    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Mise a jour...';
        
        await updateUserRole(userId, newRole);
        
        toast.updateLoadingToast(loadingToast, `Rôle mis à jour pour ${userEmail}`, 'success');
        showSuccess(`Role mis a jour pour ${userEmail}: ${newRole === 'admin' ? 'Admin' : 'User'}`);
        
        await loadUsers();
        await loadStats();
    } catch (error) {
        console.error('Erreur mise a jour role:', error);
        toast.updateLoadingToast(loadingToast, 'Erreur de mise à jour', 'error');
        toast.error(`Erreur: ${error.message || 'Impossible de mettre a jour le role'}`, 4000);
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

/**
 * Gérer le changement de filtres
 */
async function handleFilterChange(e) {
    const filterName = e.target.id.replace('filter-user-', '').replace('-', '');
    currentFilters[filterName] = e.target.value;
    await loadUsers();
}

/**
 * Gérer la recherche
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        renderUsersList();
        return;
    }
    
    const filtered = currentUsers.filter(u => 
        (u.displayName && u.displayName.toLowerCase().includes(searchTerm)) ||
        (u.email && u.email.toLowerCase().includes(searchTerm))
    );
    
    const container = document.getElementById('users-list');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-500">
                <p class="text-lg">Aucun resultat pour "${searchTerm}"</p>
            </div>
        `;
        return;
    }
    
    // Afficher temporairement les résultats filtrés
    const temp = currentUsers;
    currentUsers = filtered;
    renderUsersList();
    currentUsers = temp;
}

/**
 * Charger les statistiques
 */
async function loadStats() {
    try {
        // ✅ Mode démo : Utiliser données simulées
        if (isDemoMode()) {
            console.log('📊 Mode démo : Chargement des stats utilisateurs simulées...');
            renderStats(MOCK_STATS);
            return;
        }
        
        // Mode Firebase normal
        const stats = await getUsersStats();
        renderStats(stats);
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

/**
 * Afficher les statistiques
 */
function renderStats(stats) {
    const container = document.getElementById('users-stats');
    if (!container) return;
    
    const activePercentage = stats.total > 0 ? Math.round((stats.activeLastWeek / stats.total) * 100) : 0;
    
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-6">📊 Statistiques Globales</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center p-4 bg-indigo-50 rounded-lg">
                    <p class="text-3xl font-bold text-indigo-600 mb-1">${stats.total}</p>
                    <p class="text-sm text-indigo-700 font-medium">Utilisateurs</p>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                    <p class="text-3xl font-bold text-yellow-600 mb-1">${stats.admins}</p>
                    <p class="text-sm text-yellow-700 font-medium">Admins</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-slate-700">Actifs (7 derniers jours)</span>
                        <span class="font-semibold">${stats.activeLastWeek} (${activePercentage}%)</span>
                    </div>
                    <div class="bg-slate-200 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2 transition-all" style="width: ${activePercentage}%"></div>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-slate-200">
                    <p class="text-sm text-slate-600 mb-1">Score moyen global:</p>
                    <p class="text-2xl font-bold text-purple-600">${stats.averageScore}%</p>
                </div>
                
                <div>
                    <p class="text-sm text-slate-600 mb-1">Total quiz completes:</p>
                    <p class="text-2xl font-bold text-indigo-600">${stats.totalQuizzes}</p>
                </div>
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
            <svg class="animate-spin h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24">
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
 * Formater le temps relatif
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'A l instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
}

/**
 * Échapper le HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
