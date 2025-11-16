/**
 * Gestionnaire de détection offline/online
 * 
 * ✅ CORRECTION SECTION 8 : Gestion Offline Complète
 * 
 * Détecte l'état de connexion et affiche des notifications/indicateurs visuels
 */

import { toast } from './toast.js';
import { syncQueue } from './sync-queue.js';

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = new Set();
        this.indicatorElement = null;
        this.setupEventListeners();
        this.createIndicator();
    }
    
    /**
     * Configurer les event listeners pour online/offline
     */
    setupEventListeners() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Vérifier périodiquement (toutes les 30 secondes)
        setInterval(() => this.checkConnection(), 30000);
    }
    
    /**
     * Vérifier manuellement la connexion
     */
    async checkConnection() {
        try {
            // ✅ CORRECTION PERFORMANCE: Vérifier la connexion avec timeout et ressource légère
            // Utiliser une icône statique de l'app au lieu de l'API Firestore (plus fiable)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
            
            const response = await fetch('/manifest.json', { 
                method: 'HEAD',
                cache: 'no-cache',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Si la requête réussit et qu'on était offline, passer en ligne
            if (!this.isOnline && response.ok) {
                this.handleOnline();
            }
        } catch (error) {
            // En cas d'erreur (timeout, réseau), passer offline si on était online
            if (this.isOnline && (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
                this.handleOffline();
            }
        }
    }
    
    /**
     * Gérer le passage en ligne
     */
    async handleOnline() {
        if (this.isOnline) return; // Déjà en ligne
        
        this.isOnline = true;
        console.log('🌐 Connexion rétablie');
        
        this.updateIndicator();
        this.notifyListeners('online');
        
        // Afficher notification
        toast.success('Connexion rétablie. Synchronisation en cours...', 3000);
        
        // Synchroniser la file d'attente
        try {
            // Import dynamique pour éviter dépendance circulaire
            const { saveQuizResult } = await import('./firestore-service.js');
            
            const stats = await syncQueue.getStats();
            if (stats.pending > 0) {
                console.log(`📤 Synchronisation de ${stats.pending} opération(s) en attente...`);
                
                // Définir les handlers pour chaque type d'opération
                const operationHandlers = {
                    quizResult: async (data) => {
                        await saveQuizResult(data);
                    },
                    // Ajouter d'autres types si nécessaire
                };
                
                const result = await syncQueue.processQueue(operationHandlers);
                
                if (result.success > 0) {
                    toast.success(`${result.success} opération(s) synchronisée(s) avec succès`, 3000);
                }
                if (result.failed > 0) {
                    toast.warning(`${result.failed} opération(s) n'ont pas pu être synchronisées`, 3000);
                }
            }
        } catch (error) {
            console.error('❌ Erreur synchronisation:', error);
            toast.error('Erreur lors de la synchronisation', 3000);
        }
    }
    
    /**
     * Gérer le passage hors ligne
     */
    handleOffline() {
        if (!this.isOnline) return; // Déjà hors ligne
        
        this.isOnline = false;
        console.log('📴 Connexion perdue');
        
        this.updateIndicator();
        this.notifyListeners('offline');
        
        // Afficher notification
        toast.warning('Connexion perdue. Les données seront sauvegardées localement.', 5000);
    }
    
    /**
     * Créer l'indicateur visuel de connexion
     */
    createIndicator() {
        // Créer l'élément indicateur
        this.indicatorElement = document.createElement('div');
        this.indicatorElement.id = 'offline-indicator';
        this.indicatorElement.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300';
        this.indicatorElement.style.display = 'none';
        
        // Ajouter au body
        document.body.appendChild(this.indicatorElement);
        
        // Mettre à jour l'apparence initiale
        this.updateIndicator();
    }
    
    /**
     * Mettre à jour l'indicateur visuel
     */
    updateIndicator() {
        if (!this.indicatorElement) return;
        
        if (this.isOnline) {
            this.indicatorElement.style.display = 'none';
        } else {
            this.indicatorElement.style.display = 'flex';
            this.indicatorElement.className = 'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-yellow-500 text-white transition-all duration-300';
            this.indicatorElement.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
                </svg>
                <span class="text-sm font-medium">Mode hors ligne</span>
            `;
        }
    }
    
    /**
     * Obtenir l'état actuel
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            timestamp: Date.now()
        };
    }
    
    /**
     * S'abonner aux changements d'état
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    /**
     * Notifier les listeners
     */
    notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event, this.getStatus());
            } catch (error) {
                console.error('Erreur listener offline:', error);
            }
        });
    }
}

// Instance singleton
export const offlineManager = new OfflineManager();

// Exporter une fonction utilitaire pour vérifier l'état
export function isOnline() {
    return offlineManager.isOnline;
}

// Exporter une fonction pour attendre la reconnexion
export function waitForOnline() {
    return new Promise((resolve) => {
        if (offlineManager.isOnline) {
            resolve();
            return;
        }
        
        const unsubscribe = offlineManager.subscribe((event) => {
            if (event === 'online') {
                unsubscribe();
                resolve();
            }
        });
    });
}

