// Page Ressources - Gestion de la bibliothèque de documents
import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getCurrentUser, onAuthChange, signOutUser } from './auth.js';
import { toast } from './toast.js';
import {
    createResourceSkeleton,
    showSkeleton,
    hideSkeleton
} from './skeleton.js';

// État
let allResources = [];
let filteredResources = [];
let isAdmin = false;

// Configuration
const categoryNames = {
    'guides': { name: 'Guides', icon: '📖', color: 'blue' },
    'manuels': { name: 'Manuels', icon: '📋', color: 'green' },
    'reglements': { name: 'Règlements', icon: '🛡️', color: 'orange' },
    'formulaires': { name: 'Formulaires', icon: '📝', color: 'purple' },
    'videos': { name: 'Vidéos', icon: '🎥', color: 'red' }
};

const moduleNames = {
    'tous': 'Tous les modules',
    'auto': 'AT-AVE-AVEX',
    'loisir': 'VTT, Motoneige, etc.',
    'vr': 'Véhicules Récréatifs',
    'tracteur': 'Équipement Agricole'
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification Firebase
    onAuthChange(async (user) => {
        if (!user) {
            window.location.href = '/index.html';
            return;
        }
        
        updateUserInfo(user);
        await checkAdminStatus(user.uid);
        await loadResources();
    });
    
    // Événements
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('signout-link')?.addEventListener('click', handleLogout);
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
    document.getElementById('filter-category')?.addEventListener('change', applyFilters);
    document.getElementById('filter-module')?.addEventListener('change', applyFilters);
    document.getElementById('reset-filters-btn')?.addEventListener('click', resetFilters);
    document.getElementById('upload-btn')?.addEventListener('click', showUploadModal);
    document.getElementById('cancel-upload-btn')?.addEventListener('click', hideUploadModal);
    document.getElementById('upload-form')?.addEventListener('submit', handleUpload);
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

// Vérifier si l'utilisateur est admin
async function checkAdminStatus(userId) {
    try {
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
        if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            isAdmin = userData.role === 'admin';
            
            if (isAdmin) {
                document.getElementById('admin-section')?.classList.remove('hidden');
                document.getElementById('nav-admin-item')?.classList.remove('hidden');
                document.getElementById('admin-badge-nav')?.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
    }
}

// Charger les ressources depuis Firestore
async function loadResources() {
    console.log('📥 Chargement des ressources...');
    
    try {
        // Afficher skeleton pendant le chargement
        const container = document.getElementById('resources-container');
        if (container) {
            showSkeleton('resources-container', createResourceSkeleton(6));
        }
        
        const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        allResources = [];
        querySnapshot.forEach((doc) => {
            allResources.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            });
        });
        
        console.log(`✅ ${allResources.length} ressources chargées`);
        
        if (allResources.length === 0) {
            showNoResources();
        } else {
            filteredResources = [...allResources];
            renderResources();
        }
        
        document.getElementById('resources-loading')?.classList.add('hidden');
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des ressources:', error);
        toast.error('Erreur lors du chargement des ressources');
        // Si la collection n'existe pas encore, afficher le message
        showNoResources();
        document.getElementById('resources-loading')?.classList.add('hidden');
    }
}

// Afficher les ressources
function renderResources() {
    const container = document.getElementById('resources-container');
    container.classList.remove('hidden');
    
    if (filteredResources.length === 0) {
        showNoResources();
        return;
    }
    
    document.getElementById('no-resources')?.classList.add('hidden');
    
    container.innerHTML = filteredResources.map(resource => {
        const category = categoryNames[resource.category] || { name: resource.category, icon: '📄', color: 'gray' };
        const date = resource.createdAt 
            ? new Date(resource.createdAt).toLocaleDateString('fr-FR')
            : 'Date inconnue';
        
        return `
            <div class="file-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden fade-in">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="file-icon text-4xl">${category.icon}</div>
                        ${isAdmin ? `
                            <button onclick="deleteResource('${resource.id}')" class="text-red-600 hover:text-red-800 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    
                    <h3 class="text-lg font-bold text-slate-900 mb-2">${resource.title}</h3>
                    <p class="text-sm text-slate-600 mb-4 line-clamp-2">${resource.description || 'Aucune description'}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="px-3 py-1 bg-${category.color}-100 text-${category.color}-700 text-xs font-medium rounded-full">
                            ${category.name}
                        </span>
                        <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                            ${moduleNames[resource.module] || resource.module}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>📅 ${date}</span>
                        ${resource.downloads ? `<span>⬇️ ${resource.downloads} téléchargements</span>` : ''}
                    </div>
                    
                    <div class="flex gap-2">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" 
                           class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center text-sm">
                            📥 Télécharger
                        </a>
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" 
                           class="px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-center text-sm">
                            👁️
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Appliquer les filtres
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const moduleFilter = document.getElementById('filter-module').value;
    
    filteredResources = allResources.filter(resource => {
        const matchSearch = !searchTerm || 
            resource.title.toLowerCase().includes(searchTerm) || 
            (resource.description && resource.description.toLowerCase().includes(searchTerm));
        
        const matchCategory = !categoryFilter || resource.category === categoryFilter;
        const matchModule = !moduleFilter || resource.module === moduleFilter;
        
        return matchSearch && matchCategory && matchModule;
    });
    
    renderResources();
}

// Réinitialiser les filtres
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-module').value = '';
    filteredResources = [...allResources];
    renderResources();
}

// Filtrer par catégorie (boutons rapides)
window.filterByCategory = function(category) {
    document.getElementById('filter-category').value = category;
    applyFilters();
};

// Afficher la modal d'upload
function showUploadModal() {
    document.getElementById('upload-modal')?.classList.remove('hidden');
}

// Cacher la modal d'upload
function hideUploadModal() {
    document.getElementById('upload-modal')?.classList.add('hidden');
    document.getElementById('upload-form')?.reset();
}

// Gérer l'upload
async function handleUpload(e) {
    e.preventDefault();
    
    if (!isAdmin) {
        toast.error('Accès refusé : vous devez être administrateur');
        return;
    }
    
    const title = document.getElementById('doc-title').value;
    const description = document.getElementById('doc-description').value;
    const category = document.getElementById('doc-category').value;
    const module = document.getElementById('doc-module').value;
    const url = document.getElementById('doc-url').value;
    
    if (!title || !category || !module || !url) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const loadingToast = toast.showLoadingToast('Ajout du document...');
    
    try {
        console.log('📤 Ajout d\'une nouvelle ressource...');
        
        const user = getCurrentUser();
        await addDoc(collection(db, 'resources'), {
            title,
            description,
            category,
            module,
            url,
            downloads: 0,
            createdAt: new Date(),
            createdBy: user.uid
        });
        
        console.log('✅ Ressource ajoutée avec succès');
        toast.updateLoadingToast(loadingToast, 'Document ajouté avec succès !', 'success');
        
        hideUploadModal();
        await loadResources();
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout de la ressource:', error);
        toast.updateLoadingToast(loadingToast, 'Erreur d\'ajout', 'error');
        toast.error('Erreur lors de l\'ajout du document', 4000);
    }
}

// Supprimer une ressource
window.deleteResource = async function(resourceId) {
    if (!isAdmin) {
        toast.error('Accès refusé');
        return;
    }
    
    if (!confirm('Voulez-vous vraiment supprimer ce document ?')) {
        toast.info('Suppression annulée', 2000);
        return;
    }
    
    const loadingToast = toast.showLoadingToast('Suppression du document...');
    
    try {
        console.log('🗑️ Suppression de la ressource:', resourceId);
        await deleteDoc(doc(db, 'resources', resourceId));
        console.log('✅ Ressource supprimée');
        
        toast.updateLoadingToast(loadingToast, 'Document supprimé avec succès !', 'success');
        
        await loadResources();
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        toast.updateLoadingToast(loadingToast, 'Erreur de suppression', 'error');
        toast.error('Erreur lors de la suppression', 4000);
    }
};

// Afficher message si aucune ressource
function showNoResources() {
    document.getElementById('resources-container')?.classList.add('hidden');
    document.getElementById('no-resources')?.classList.remove('hidden');
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
