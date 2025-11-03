// Skeleton Loaders - Composants de chargement animés avec shimmer effect
// Améliore l'UX pendant le chargement des données

/**
 * Créer un skeleton loader de type carte
 * @param {number} count - Nombre de cartes à afficher
 * @returns {string} HTML des skeleton loaders
 */
export function createCardSkeleton(count = 3) {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
        skeletons.push(`
            <div class="skeleton-card bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="skeleton-circle h-12 w-12 bg-slate-200 rounded-full"></div>
                    <div class="skeleton-text h-6 w-20 bg-slate-200 rounded"></div>
                </div>
                <div class="skeleton-text h-8 w-24 bg-slate-200 rounded mb-2"></div>
                <div class="skeleton-text h-4 w-32 bg-slate-200 rounded mb-4"></div>
                <div class="skeleton-text h-3 w-full bg-slate-200 rounded"></div>
            </div>
        `);
    }
    
    return skeletons.join('');
}

/**
 * Créer un skeleton loader de type liste
 * @param {number} count - Nombre d'items à afficher
 * @returns {string} HTML des skeleton loaders
 */
export function createListSkeleton(count = 5) {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
        skeletons.push(`
            <div class="skeleton-list-item bg-white rounded-lg border border-slate-200 p-4 mb-3 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="skeleton-circle h-10 w-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                    <div class="skeleton-text h-8 w-20 bg-slate-200 rounded"></div>
                </div>
            </div>
        `);
    }
    
    return skeletons.join('');
}

/**
 * Créer un skeleton loader de type tableau
 * @param {number} rows - Nombre de lignes
 * @param {number} cols - Nombre de colonnes
 * @returns {string} HTML du skeleton loader
 */
export function createTableSkeleton(rows = 5, cols = 4) {
    const headerCols = [];
    for (let i = 0; i < cols; i++) {
        headerCols.push(`
            <th class="px-6 py-3">
                <div class="skeleton-text h-4 bg-slate-200 rounded"></div>
            </th>
        `);
    }
    
    const bodyRows = [];
    for (let i = 0; i < rows; i++) {
        const rowCols = [];
        for (let j = 0; j < cols; j++) {
            rowCols.push(`
                <td class="px-6 py-4">
                    <div class="skeleton-text h-4 bg-slate-200 rounded"></div>
                </td>
            `);
        }
        bodyRows.push(`<tr class="animate-pulse">${rowCols.join('')}</tr>`);
    }
    
    return `
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>${headerCols.join('')}</tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    ${bodyRows.join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Créer un skeleton loader de type graphique
 * @returns {string} HTML du skeleton loader
 */
export function createChartSkeleton() {
    return `
        <div class="skeleton-chart bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div class="skeleton-text h-6 w-48 bg-slate-200 rounded mb-6"></div>
            <div class="h-64 bg-slate-100 rounded-lg flex items-end justify-around p-4">
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 60%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 80%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 45%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 90%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 70%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 55%"></div>
            </div>
        </div>
    `;
}

/**
 * Créer un skeleton loader de type grille de cartes
 * @param {number} count - Nombre de cartes
 * @param {number} columns - Nombre de colonnes (2, 3, ou 4)
 * @returns {string} HTML du skeleton loader
 */
export function createGridSkeleton(count = 6, columns = 3) {
    const colClass = columns === 2 ? 'md:grid-cols-2' : 
                    columns === 3 ? 'md:grid-cols-3' : 
                    'md:grid-cols-4';
    
    const cards = [];
    for (let i = 0; i < count; i++) {
        cards.push(`
            <div class="skeleton-grid-item bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div class="skeleton-image h-40 bg-slate-200 rounded-lg mb-4"></div>
                <div class="skeleton-text h-6 w-3/4 bg-slate-200 rounded mb-3"></div>
                <div class="skeleton-text h-4 w-full bg-slate-200 rounded mb-2"></div>
                <div class="skeleton-text h-4 w-5/6 bg-slate-200 rounded"></div>
            </div>
        `);
    }
    
    return `
        <div class="grid grid-cols-1 ${colClass} gap-6">
            ${cards.join('')}
        </div>
    `;
}

/**
 * Créer un skeleton loader de type formulaire
 * @param {number} fields - Nombre de champs
 * @returns {string} HTML du skeleton loader
 */
export function createFormSkeleton(fields = 4) {
    const formFields = [];
    
    for (let i = 0; i < fields; i++) {
        formFields.push(`
            <div class="mb-6 animate-pulse">
                <div class="skeleton-text h-4 w-32 bg-slate-200 rounded mb-2"></div>
                <div class="skeleton-input h-10 w-full bg-slate-200 rounded-lg"></div>
            </div>
        `);
    }
    
    return `
        <div class="bg-white rounded-xl shadow-md p-6">
            ${formFields.join('')}
            <div class="animate-pulse mt-6">
                <div class="skeleton-button h-10 w-32 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    `;
}

/**
 * Créer un skeleton loader personnalisé pour les questions admin
 * @param {number} count - Nombre de questions
 * @returns {string} HTML du skeleton loader
 */
export function createQuestionSkeleton(count = 5) {
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        questions.push(`
            <div class="skeleton-question bg-white rounded-lg border border-slate-200 p-6 mb-4 animate-pulse">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                        <div class="flex gap-2 mb-3">
                            <div class="skeleton-badge h-6 w-20 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-6 w-24 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-6 w-16 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="skeleton-icon h-8 w-8 bg-slate-200 rounded"></div>
                        <div class="skeleton-icon h-8 w-8 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-2/3 bg-slate-200 rounded"></div>
                </div>
            </div>
        `);
    }
    
    return questions.join('');
}

/**
 * Créer un skeleton loader pour les utilisateurs
 * @param {number} count - Nombre d'utilisateurs
 * @returns {string} HTML du skeleton loader
 */
export function createUserSkeleton(count = 10) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
        users.push(`
            <div class="skeleton-user bg-white rounded-lg border border-slate-200 p-4 mb-3 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                        <div class="skeleton-avatar h-12 w-12 bg-slate-200 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton-text h-5 w-48 bg-slate-200 rounded mb-2"></div>
                            <div class="skeleton-text h-4 w-64 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="skeleton-badge h-6 w-16 bg-slate-200 rounded-full"></div>
                        <div class="skeleton-button h-8 w-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        `);
    }
    
    return users.join('');
}

/**
 * Créer un skeleton loader pour les résultats de quiz
 * @param {number} count - Nombre de résultats
 * @returns {string} HTML du skeleton loader
 */
export function createResultSkeleton(count = 5) {
    const results = [];
    
    for (let i = 0; i < count; i++) {
        results.push(`
            <div class="skeleton-result bg-white rounded-lg border border-slate-200 p-5 mb-3 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="skeleton-icon h-10 w-10 bg-slate-200 rounded-lg"></div>
                            <div>
                                <div class="skeleton-text h-5 w-48 bg-slate-200 rounded mb-2"></div>
                                <div class="skeleton-text h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="skeleton-text h-4 w-24 bg-slate-200 rounded"></div>
                            <div class="skeleton-text h-4 w-32 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="skeleton-text h-8 w-16 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        `);
    }
    
    return results.join('');
}

/**
 * Créer un skeleton loader pour les ressources
 * @param {number} count - Nombre de ressources
 * @returns {string} HTML du skeleton loader
 */
export function createResourceSkeleton(count = 6) {
    const resources = [];
    
    for (let i = 0; i < count; i++) {
        resources.push(`
            <div class="skeleton-resource bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow animate-pulse">
                <div class="flex items-start gap-4">
                    <div class="skeleton-icon h-12 w-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-full bg-slate-200 rounded mb-3"></div>
                        <div class="flex gap-2 mb-3">
                            <div class="skeleton-badge h-5 w-20 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-5 w-16 bg-slate-200 rounded-full"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="skeleton-text h-4 w-24 bg-slate-200 rounded"></div>
                            <div class="skeleton-button h-8 w-24 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    
    return resources.join('');
}

/**
 * Créer un skeleton loader pour les statistiques (cartes)
 * @param {number} count - Nombre de cartes de stats
 * @returns {string} HTML du skeleton loader
 */
export function createStatsSkeleton(count = 4) {
    const stats = [];
    
    for (let i = 0; i < count; i++) {
        stats.push(`
            <div class="skeleton-stats bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl p-6 shadow-lg animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="skeleton-icon h-12 w-12 bg-white/30 rounded-lg"></div>
                    <div class="skeleton-badge h-6 w-16 bg-white/30 rounded-full"></div>
                </div>
                <div class="skeleton-text h-10 w-24 bg-white/30 rounded mb-2"></div>
                <div class="skeleton-text h-4 w-32 bg-white/30 rounded"></div>
            </div>
        `);
    }
    
    return stats.join('');
}

/**
 * Afficher un skeleton loader dans un conteneur
 * @param {string} containerId - ID du conteneur
 * @param {string} skeletonHTML - HTML du skeleton
 */
export function showSkeleton(containerId, skeletonHTML) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = skeletonHTML;
    }
}

/**
 * Cacher le skeleton et afficher le contenu réel
 * @param {string} containerId - ID du conteneur
 * @param {string} contentHTML - HTML du contenu réel
 */
export function hideSkeleton(containerId, contentHTML) {
    const container = document.getElementById(containerId);
    if (container) {
        // Fade out skeleton
        container.style.opacity = '0';
        container.style.transition = 'opacity 300ms ease-out';
        
        setTimeout(() => {
            container.innerHTML = contentHTML;
            container.style.opacity = '1';
        }, 300);
    }
}

/**
 * Créer un skeleton loader fullpage (pour le chargement initial)
 * @returns {string} HTML du skeleton loader
 */
export function createFullPageSkeleton() {
    return `
        <div class="min-h-screen bg-slate-100 p-8 animate-pulse">
            <!-- Header -->
            <div class="mb-8">
                <div class="skeleton-text h-10 w-64 bg-slate-200 rounded mb-2"></div>
                <div class="skeleton-text h-5 w-96 bg-slate-200 rounded"></div>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${createStatsSkeleton(4)}
            </div>
            
            <!-- Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${createChartSkeleton()}
                ${createChartSkeleton()}
            </div>
        </div>
    `;
}

// Exporter toutes les fonctions
export default {
    createCardSkeleton,
    createListSkeleton,
    createTableSkeleton,
    createChartSkeleton,
    createGridSkeleton,
    createFormSkeleton,
    createQuestionSkeleton,
    createUserSkeleton,
    createResultSkeleton,
    createResourceSkeleton,
    createStatsSkeleton,
    createFullPageSkeleton,
    showSkeleton,
    hideSkeleton
};
