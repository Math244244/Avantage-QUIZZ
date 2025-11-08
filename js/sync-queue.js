/**
 * File d'attente globale pour synchronisation offline
 * 
 * ✅ CORRECTION SECTION 8 : Gestion Offline Complète
 * 
 * Gère toutes les opérations Firestore en file d'attente avec IndexedDB
 * pour la persistance et la synchronisation automatique à la reconnexion.
 */

const DB_NAME = 'avantage-quizz-sync';
const DB_VERSION = 1;
const STORE_NAME = 'sync-queue';

let db = null;

/**
 * Initialiser IndexedDB
 */
async function initDB() {
    if (db) return db;
    
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('type', 'type', { unique: false });
                store.createIndex('status', 'status', { unique: false });
            }
        };
    });
}

/**
 * Classe pour gérer la file d'attente de synchronisation
 */
class SyncQueue {
    constructor() {
        this.isProcessing = false;
        this.listeners = new Set();
    }
    
    /**
     * Ajouter une opération à la file d'attente
     * @param {string} type - Type d'opération (quizResult, userUpdate, etc.)
     * @param {Function} operation - Fonction async à exécuter
     * @param {Object} data - Données à sauvegarder
     * @returns {Promise<string>} ID de l'opération
     */
    async add(type, operation, data = {}) {
        await initDB();
        
        const queueItem = {
            type,
            operation: this.serializeOperation(operation),
            data,
            timestamp: Date.now(),
            status: 'pending',
            retries: 0,
            maxRetries: 3
        };
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(queueItem);
            
            request.onsuccess = () => {
                const id = request.result;
                console.log(`📥 Opération ajoutée à la file d'attente: ${type} (ID: ${id})`);
                this.notifyListeners('added', { id, type });
                resolve(id);
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * Sérialiser une fonction pour le stockage (limitation : on stocke seulement les données)
     * Note: Les fonctions ne peuvent pas être sérialisées, donc on stocke les données
     * et on reconstruit l'opération lors du traitement
     */
    serializeOperation(operation) {
        // On ne peut pas sérialiser une fonction, donc on stocke les métadonnées
        // L'opération sera reconstruite lors du traitement basé sur le type
        return {
            name: operation.name || 'anonymous',
            // On stocke les paramètres nécessaires pour reconstruire l'opération
        };
    }
    
    /**
     * Obtenir toutes les opérations en attente
     */
    async getAll() {
        await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('status');
            const request = index.getAll('pending');
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * Marquer une opération comme complétée
     */
    async markCompleted(id) {
        await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (item) {
                    item.status = 'completed';
                    const updateRequest = store.put(item);
                    updateRequest.onsuccess = () => {
                        console.log(`✅ Opération complétée: ${item.type} (ID: ${id})`);
                        this.notifyListeners('completed', { id, type: item.type });
                        resolve();
                    };
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    resolve();
                }
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
    }
    
    /**
     * Marquer une opération comme échouée
     */
    async markFailed(id, error) {
        await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (item) {
                    item.retries++;
                    if (item.retries >= item.maxRetries) {
                        item.status = 'failed';
                        item.error = error?.message || 'Unknown error';
                    } else {
                        item.status = 'pending'; // Réessayer
                    }
                    const updateRequest = store.put(item);
                    updateRequest.onsuccess = () => {
                        if (item.status === 'failed') {
                            console.error(`❌ Opération échouée définitivement: ${item.type} (ID: ${id})`);
                            this.notifyListeners('failed', { id, type: item.type, error });
                        } else {
                            console.warn(`⚠️ Opération échouée, réessai ${item.retries}/${item.maxRetries}: ${item.type} (ID: ${id})`);
                        }
                        resolve();
                    };
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    resolve();
                }
            };
            
            getRequest.onerror = () => reject(getRequest.error);
        });
    }
    
    /**
     * Supprimer une opération de la file
     */
    async remove(id) {
        await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            
            request.onsuccess = () => {
                console.log(`🗑️ Opération supprimée: ID ${id}`);
                resolve();
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * Traiter toutes les opérations en attente
     * @param {Object} operationHandlers - Map des handlers par type d'opération
     */
    async processQueue(operationHandlers = {}) {
        if (this.isProcessing) {
            console.log('⏳ Traitement déjà en cours...');
            return;
        }
        
        if (!navigator.onLine) {
            console.log('📴 Hors ligne, synchronisation reportée');
            return;
        }
        
        this.isProcessing = true;
        console.log('🔄 Début du traitement de la file d\'attente...');
        
        try {
            const pendingItems = await this.getAll();
            
            if (pendingItems.length === 0) {
                console.log('✅ Aucune opération en attente');
                this.isProcessing = false;
                return { success: 0, failed: 0 };
            }
            
            console.log(`📋 ${pendingItems.length} opération(s) en attente`);
            
            let successCount = 0;
            let failedCount = 0;
            
            for (const item of pendingItems) {
                try {
                    // Reconstruire l'opération basée sur le type
                    const handler = operationHandlers[item.type];
                    if (!handler) {
                        console.warn(`⚠️ Aucun handler pour le type: ${item.type}`);
                        await this.markFailed(item.id, new Error(`No handler for type: ${item.type}`));
                        failedCount++;
                        continue;
                    }
                    
                    // Exécuter l'opération
                    await handler(item.data);
                    
                    // Marquer comme complétée et supprimer
                    await this.markCompleted(item.id);
                    await this.remove(item.id);
                    successCount++;
                    
                } catch (error) {
                    console.error(`❌ Erreur traitement opération ${item.id}:`, error);
                    await this.markFailed(item.id, error);
                    failedCount++;
                }
            }
            
            console.log(`✅ Traitement terminé: ${successCount} réussies, ${failedCount} échouées`);
            this.notifyListeners('processed', { success: successCount, failed: failedCount });
            
            return { success: successCount, failed: failedCount };
            
        } catch (error) {
            console.error('❌ Erreur traitement file d\'attente:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }
    
    /**
     * Obtenir les statistiques de la file
     */
    async getStats() {
        await initDB();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                const items = request.result;
                const stats = {
                    total: items.length,
                    pending: items.filter(i => i.status === 'pending').length,
                    completed: items.filter(i => i.status === 'completed').length,
                    failed: items.filter(i => i.status === 'failed').length
                };
                resolve(stats);
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * Nettoyer les opérations complétées (plus de 7 jours)
     */
    async cleanCompleted() {
        await initDB();
        
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const request = index.openCursor();
            
            let deletedCount = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const item = cursor.value;
                    if (item.status === 'completed' && item.timestamp < sevenDaysAgo) {
                        cursor.delete();
                        deletedCount++;
                    }
                    cursor.continue();
                } else {
                    console.log(`🧹 ${deletedCount} opération(s) complétée(s) nettoyée(s)`);
                    resolve(deletedCount);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * S'abonner aux événements de la file
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    /**
     * Notifier les listeners
     */
    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('Erreur listener:', error);
            }
        });
    }
}

// Instance singleton
export const syncQueue = new SyncQueue();

// Initialiser au chargement
initDB().catch(error => {
    console.error('❌ Erreur initialisation IndexedDB:', error);
});

