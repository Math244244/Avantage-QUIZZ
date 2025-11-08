/**
 * Service d'Audit et de Logs
 * 
 * ✅ CORRECTION SECTION 5 : Refactorisation - Extraction des fonctions d'audit
 */

import { db } from '../firebase-config.js';
import { collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { safeFirestoreWrite } from '../rate-limiter.js';

/**
 * ADMIN: Créer un log d'import
 */
export async function createImportLog(logData) {
    try {
        const log = {
            ...logData,
            importedAt: Timestamp.now()
        };
        
        // ✅ CORRECTION SECTION 4 : Rate limiting pour les écritures
        await safeFirestoreWrite(() => addDoc(collection(db, 'importLogs'), log));
        console.log('Log import cree');
    } catch (error) {
        console.error('Erreur creation log import:', error);
    }
}

/**
 * ADMIN: Créer un log d'audit
 */
export async function createAuditLog(logData) {
    try {
        const log = {
            ...logData,
            timestamp: Timestamp.now()
        };
        
        // ✅ CORRECTION SECTION 4 : Rate limiting pour les écritures
        await safeFirestoreWrite(() => addDoc(collection(db, 'auditLogs'), log));
        console.log('Log audit cree');
    } catch (error) {
        console.error('Erreur creation log audit:', error);
    }
}

