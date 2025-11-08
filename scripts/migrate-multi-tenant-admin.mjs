/**
 * Script de Migration Multi-Tenant (Version Admin SDK)
 * 
 * Cette version utilise firebase-admin pour bypass les règles Firestore
 * et permettre la migration même sans authentification utilisateur.
 * 
 * ✅ CORRECTION SECTION 1 : Migration des données existantes
 * 
 * Usage:
 *   node scripts/migrate-multi-tenant-admin.mjs
 * 
 * IMPORTANT: 
 * - Faire un backup de la base de données avant d'exécuter ce script !
 * - Ce script nécessite des credentials de service account Firebase
 *   OU peut être exécuté via Firebase CLI (firebase use)
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialiser Firebase Admin
// Option 1 : Utiliser les credentials par défaut (si firebase use est configuré)
// Option 2 : Utiliser un fichier de credentials de service account
let app;
try {
    // Essayer d'initialiser avec les credentials par défaut
    app = admin.initializeApp({
        projectId: 'avantage-quizz'
    });
    console.log('✅ Firebase Admin initialisé avec credentials par défaut');
} catch (error) {
    console.error('❌ Erreur initialisation Firebase Admin:', error.message);
    console.error('💡 Options:');
    console.error('   1. Exécuter: firebase login');
    console.error('   2. Ou créer un fichier serviceAccountKey.json');
    process.exit(1);
}

const db = admin.firestore();

// Client ID par défaut pour les données existantes
const DEFAULT_CLIENT_ID = 'default';

// Taille des batches pour les mises à jour (limite Firestore: 500)
const BATCH_SIZE = 500;

/**
 * Migrer les utilisateurs
 */
async function migrateUsers() {
    console.log('📋 Migration des utilisateurs...');
    
    try {
        const usersSnapshot = await db.collection('users').get();
        const usersToMigrate = [];
        
        usersSnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            if (!userData.clientId) {
                usersToMigrate.push({
                    id: userDoc.id,
                    data: userData
                });
            }
        });
        
        console.log(`   ${usersToMigrate.length} utilisateurs à migrer`);
        
        if (usersToMigrate.length === 0) {
            console.log('   ✅ Aucun utilisateur à migrer');
            return 0;
        }
        
        // Migrer par batches
        let migrated = 0;
        for (let i = 0; i < usersToMigrate.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchUsers = usersToMigrate.slice(i, i + BATCH_SIZE);
            
            batchUsers.forEach(({ id }) => {
                const userRef = db.collection('users').doc(id);
                batch.update(userRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            migrated += batchUsers.length;
            console.log(`   ✅ ${migrated}/${usersToMigrate.length} utilisateurs migrés`);
        }
        
        return migrated;
    } catch (error) {
        console.error('❌ Erreur migration utilisateurs:', error);
        throw error;
    }
}

/**
 * Migrer les résultats de quiz
 */
async function migrateQuizResults() {
    console.log('📋 Migration des résultats de quiz...');
    
    try {
        const resultsSnapshot = await db.collection('quizResults').get();
        const resultsToMigrate = [];
        
        resultsSnapshot.forEach((resultDoc) => {
            const resultData = resultDoc.data();
            if (!resultData.clientId) {
                resultsToMigrate.push({
                    id: resultDoc.id,
                    data: resultData
                });
            }
        });
        
        console.log(`   ${resultsToMigrate.length} résultats à migrer`);
        
        if (resultsToMigrate.length === 0) {
            console.log('   ✅ Aucun résultat à migrer');
            return 0;
        }
        
        // Migrer par batches
        let migrated = 0;
        for (let i = 0; i < resultsToMigrate.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchResults = resultsToMigrate.slice(i, i + BATCH_SIZE);
            
            batchResults.forEach(({ id }) => {
                const resultRef = db.collection('quizResults').doc(id);
                batch.update(resultRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            migrated += batchResults.length;
            console.log(`   ✅ ${migrated}/${resultsToMigrate.length} résultats migrés`);
        }
        
        return migrated;
    } catch (error) {
        console.error('❌ Erreur migration résultats:', error);
        throw error;
    }
}

/**
 * Migrer la progression mensuelle
 */
async function migrateMonthlyProgress() {
    console.log('📋 Migration de la progression mensuelle...');
    
    try {
        const progressSnapshot = await db.collection('monthlyProgress').get();
        const progressToMigrate = [];
        
        progressSnapshot.forEach((progressDoc) => {
            const progressData = progressDoc.data();
            if (!progressData.clientId) {
                progressToMigrate.push({
                    id: progressDoc.id,
                    data: progressData
                });
            }
        });
        
        console.log(`   ${progressToMigrate.length} progressions à migrer`);
        
        if (progressToMigrate.length === 0) {
            console.log('   ✅ Aucune progression à migrer');
            return 0;
        }
        
        // Migrer par batches
        let migrated = 0;
        for (let i = 0; i < progressToMigrate.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const batchProgress = progressToMigrate.slice(i, i + BATCH_SIZE);
            
            batchProgress.forEach(({ id }) => {
                const progressRef = db.collection('monthlyProgress').doc(id);
                batch.update(progressRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            migrated += batchProgress.length;
            console.log(`   ✅ ${migrated}/${progressToMigrate.length} progressions migrées`);
        }
        
        return migrated;
    } catch (error) {
        console.error('❌ Erreur migration progression:', error);
        throw error;
    }
}

/**
 * Fonction principale de migration
 */
async function migrateToMultiTenant() {
    console.log('🚀 Début de la migration multi-tenant...\n');
    console.log('⚠️  ATTENTION: Assurez-vous d\'avoir fait un backup de la base de données !\n');
    
    const startTime = Date.now();
    const stats = {
        users: 0,
        quizResults: 0,
        monthlyProgress: 0
    };
    
    try {
        // 1. Migrer les utilisateurs
        stats.users = await migrateUsers();
        console.log('');
        
        // 2. Migrer les résultats de quiz
        stats.quizResults = await migrateQuizResults();
        console.log('');
        
        // 3. Migrer la progression mensuelle
        stats.monthlyProgress = await migrateMonthlyProgress();
        console.log('');
        
        const totalMigrated = stats.users + stats.quizResults + stats.monthlyProgress;
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log('✅ Migration terminée !\n');
        console.log('📊 Statistiques:');
        console.log(`   - Utilisateurs: ${stats.users}`);
        console.log(`   - Résultats de quiz: ${stats.quizResults}`);
        console.log(`   - Progressions mensuelles: ${stats.monthlyProgress}`);
        console.log(`   - Total: ${totalMigrated} documents migrés`);
        console.log(`   - Durée: ${duration}s`);
        
        if (totalMigrated === 0) {
            console.log('\n✅ Tous les documents ont déjà un clientId !');
        } else {
            console.log(`\n✅ Tous les documents ont maintenant clientId: '${DEFAULT_CLIENT_ID}'`);
        }
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la migration:', error);
        console.error('⚠️  La migration a été interrompue. Vérifiez l\'état de la base de données.');
        process.exit(1);
    } finally {
        // Nettoyer Firebase Admin
        await app.delete();
    }
}

// Exécuter la migration
migrateToMultiTenant()
    .then(() => {
        console.log('\n✅ Script terminé avec succès');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erreur fatale:', error);
        process.exit(1);
    });

