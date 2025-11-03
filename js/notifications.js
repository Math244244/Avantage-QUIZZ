// Système de Notifications - Centre de notifications en temps réel
import { db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { toast } from './toast.js';

// État
let notificationsListener = null;
let unreadCount = 0;
let allNotifications = [];

/**
 * Initialiser le système de notifications
 */
export async function initNotifications(userId) {
    if (!userId) {
        console.log('Mode démo - notifications désactivées');
        return;
    }
    
    console.log('📬 Initialisation des notifications pour:', userId);
    
    // Écouter les nouvelles notifications en temps réel
    const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    notificationsListener = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const notification = { id: change.doc.id, ...change.doc.data() };
                
                // Ne pas afficher les notifications déjà lues au démarrage
                if (!notification.read && allNotifications.length > 0) {
                    showNotificationToast(notification);
                }
                
                allNotifications.unshift(notification);
            } else if (change.type === 'modified') {
                const index = allNotifications.findIndex(n => n.id === change.doc.id);
                if (index !== -1) {
                    allNotifications[index] = { id: change.doc.id, ...change.doc.data() };
                }
            } else if (change.type === 'removed') {
                allNotifications = allNotifications.filter(n => n.id !== change.doc.id);
            }
        });
        
        updateUnreadCount();
        updateNotificationBadge();
        renderNotificationsList();
    });
}

/**
 * Arrêter l'écoute des notifications
 */
export function stopNotifications() {
    if (notificationsListener) {
        notificationsListener();
        notificationsListener = null;
    }
}

/**
 * Créer une notification
 */
export async function createNotification(userId, data) {
    try {
        await addDoc(collection(db, 'notifications'), {
            userId: userId,
            type: data.type || 'info', // success, error, warning, info
            title: data.title,
            message: data.message,
            actionUrl: data.actionUrl || null,
            actionText: data.actionText || null,
            read: false,
            createdAt: serverTimestamp()
        });
        
        console.log('✅ Notification créée');
    } catch (error) {
        console.error('❌ Erreur création notification:', error);
    }
}

/**
 * Afficher une notification sous forme de toast
 */
function showNotificationToast(notification) {
    const message = `<strong>${notification.title}</strong><br>${notification.message}`;
    
    if (notification.actionUrl && notification.actionText) {
        toast.info(message, 5000);
    } else {
        toast.info(message, 4000);
    }
}

/**
 * Marquer une notification comme lue
 */
export async function markAsRead(notificationId) {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            read: true
        });
        console.log('✅ Notification marquée comme lue');
    } catch (error) {
        console.error('❌ Erreur marquage lecture:', error);
    }
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllAsRead(userId) {
    const unreadNotifications = allNotifications.filter(n => !n.read);
    
    try {
        const promises = unreadNotifications.map(n => 
            updateDoc(doc(db, 'notifications', n.id), { read: true })
        );
        
        await Promise.all(promises);
        console.log(`✅ ${unreadNotifications.length} notifications marquées comme lues`);
        toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
        console.error('❌ Erreur marquage toutes lues:', error);
        toast.error('Erreur lors du marquage des notifications');
    }
}

/**
 * Supprimer une notification
 */
export async function deleteNotification(notificationId) {
    try {
        await deleteDoc(doc(db, 'notifications', notificationId));
        console.log('✅ Notification supprimée');
    } catch (error) {
        console.error('❌ Erreur suppression notification:', error);
    }
}

/**
 * Supprimer toutes les notifications lues
 */
export async function deleteAllRead(userId) {
    const readNotifications = allNotifications.filter(n => n.read);
    
    if (readNotifications.length === 0) {
        toast.info('Aucune notification lue à supprimer');
        return;
    }
    
    try {
        const promises = readNotifications.map(n => 
            deleteDoc(doc(db, 'notifications', n.id))
        );
        
        await Promise.all(promises);
        console.log(`✅ ${readNotifications.length} notifications supprimées`);
        toast.success(`${readNotifications.length} notifications supprimées`);
    } catch (error) {
        console.error('❌ Erreur suppression notifications:', error);
        toast.error('Erreur lors de la suppression');
    }
}

/**
 * Mettre à jour le compteur non lues
 */
function updateUnreadCount() {
    unreadCount = allNotifications.filter(n => !n.read).length;
}

/**
 * Mettre à jour le badge de notifications
 */
function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

/**
 * Afficher/Cacher le panneau de notifications
 */
export function toggleNotificationsPanel() {
    const panel = getOrCreateNotificationsPanel();
    panel.classList.toggle('hidden');
}

/**
 * Créer ou récupérer le panneau de notifications
 */
function getOrCreateNotificationsPanel() {
    let panel = document.getElementById('notifications-panel');
    
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notifications-panel';
        panel.className = 'hidden fixed top-16 right-4 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-40 overflow-hidden';
        
        panel.innerHTML = `
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-bold">Notifications</h3>
                    <button id="close-notifications-btn" class="text-white hover:text-indigo-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="flex gap-2">
                    <button id="mark-all-read-btn" class="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                        Tout marquer comme lu
                    </button>
                    <button id="delete-all-read-btn" class="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                        Supprimer les lues
                    </button>
                </div>
            </div>
            
            <div id="notifications-list" class="overflow-y-auto max-h-[500px]">
                <!-- Liste des notifications -->
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Événements
        document.getElementById('close-notifications-btn').addEventListener('click', toggleNotificationsPanel);
        document.getElementById('mark-all-read-btn').addEventListener('click', () => markAllAsRead());
        document.getElementById('delete-all-read-btn').addEventListener('click', () => deleteAllRead());
        
        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !e.target.closest('#notification-bell-btn')) {
                panel.classList.add('hidden');
            }
        });
    }
    
    return panel;
}

/**
 * Rendre la liste des notifications
 */
function renderNotificationsList() {
    const container = document.getElementById('notifications-list');
    if (!container) return;
    
    if (allNotifications.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 px-6">
                <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <p class="text-slate-600 font-medium">Aucune notification</p>
                <p class="text-sm text-slate-500 mt-1">Vous êtes à jour !</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = allNotifications.map(notification => {
        const icon = getNotificationIcon(notification.type);
        const date = notification.createdAt?.toDate ? notification.createdAt.toDate() : new Date();
        const timeAgo = getTimeAgo(date);
        
        return `
            <div class="notification-item ${notification.read ? 'bg-slate-50' : 'bg-indigo-50'} border-b border-gray-200 p-4 hover:bg-slate-100 transition-colors cursor-pointer"
                 data-notification-id="${notification.id}"
                 data-read="${notification.read}">
                <div class="flex gap-3">
                    <div class="flex-shrink-0">
                        ${icon}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-slate-900 ${notification.read ? '' : 'text-indigo-900'}">
                            ${notification.title}
                        </p>
                        <p class="text-sm text-slate-600 mt-1">${notification.message}</p>
                        <p class="text-xs text-slate-500 mt-2">${timeAgo}</p>
                        ${notification.actionUrl ? `
                            <a href="${notification.actionUrl}" class="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                ${notification.actionText || 'Voir plus'} →
                            </a>
                        ` : ''}
                    </div>
                    <div class="flex flex-col gap-1">
                        ${!notification.read ? `
                            <button class="mark-read-btn text-indigo-600 hover:text-indigo-700" title="Marquer comme lu">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </button>
                        ` : ''}
                        <button class="delete-notification-btn text-red-500 hover:text-red-700" title="Supprimer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Attacher les événements
    container.querySelectorAll('.notification-item').forEach(item => {
        const notificationId = item.dataset.notificationId;
        const isRead = item.dataset.read === 'true';
        
        // Marquer comme lu au clic
        item.addEventListener('click', (e) => {
            if (!e.target.closest('button') && !isRead) {
                markAsRead(notificationId);
            }
        });
        
        // Bouton marquer comme lu
        const markReadBtn = item.querySelector('.mark-read-btn');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markAsRead(notificationId);
            });
        }
        
        // Bouton supprimer
        const deleteBtn = item.querySelector('.delete-notification-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNotification(notificationId);
            });
        }
    });
}

/**
 * Icône par type de notification
 */
function getNotificationIcon(type) {
    const icons = {
        success: `<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>`,
        error: `<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </div>`,
        warning: `<div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        </div>`,
        info: `<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>`
    };
    
    return icons[type] || icons.info;
}

/**
 * Temps relatif (il y a X minutes/heures)
 */
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
}

/**
 * Bouton de notification dans la navbar
 */
export function createNotificationButton() {
    const button = document.createElement('button');
    button.id = 'notification-bell-btn';
    button.className = 'relative p-2 text-indigo-300 hover:text-white transition-colors';
    button.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        <span id="notification-badge" class="hidden absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
    `;
    
    button.addEventListener('click', toggleNotificationsPanel);
    
    return button;
}

// Exporter le compteur pour utilisation externe
export { unreadCount, allNotifications };
