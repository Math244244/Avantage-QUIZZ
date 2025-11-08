/**
 * Script de Migration Multi-Tenant
 * 
 * Ce script ajoute le champ `clientId: 'default'` à tous les documents existants
 * qui n'ont pas encore ce champ, pour assurer la rétro-compatibilité.
 * 
 * ✅ CORRECTION SECTION 1 : Migration des données existantes
 * 
 * Usage:
 *   node scripts/migrate-multi-tenant.mjs
 * 
 * IMPORTANT: Faire un backup de la base de données avant d'exécuter ce script !
 */

import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    updateDoc, 
    doc,
    writeBatch,
    Timestamp
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lire la configuration Firebase depuis le fichier JSON
// Utiliser un fichier JSON séparé pour éviter les problèmes de parsing
const firebaseConfigPath = join(__dirname, 'firebase-config.json');
let firebaseConfig;
try {
    const firebaseConfigContent = readFileSync(firebaseConfigPath, 'utf-8');
    firebaseConfig = JSON.parse(firebaseConfigContent);
    console.log('✅ Configuration Firebase chargée depuis firebase-config.json');
} catch (error) {
    console.error('❌ Erreur lors de la lecture de la configuration:', error);
    console.error('💡 Le fichier scripts/firebase-config.json doit exister');
    process.exit(1);
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        const usersSnapshot = await getDocs(collection(db, 'users'));
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
            const batch = writeBatch(db);
            const batchUsers = usersToMigrate.slice(i, i + BATCH_SIZE);
            
            batchUsers.forEach(({ id }) => {
                const userRef = doc(db, 'users', id);
                batch.update(userRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: Timestamp.now()
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
        const resultsSnapshot = await getDocs(collection(db, 'quizResults'));
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
            const batch = writeBatch(db);
            const batchResults = resultsToMigrate.slice(i, i + BATCH_SIZE);
            
            batchResults.forEach(({ id }) => {
                const resultRef = doc(db, 'quizResults', id);
                batch.update(resultRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: Timestamp.now()
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
        const progressSnapshot = await getDocs(collection(db, 'monthlyProgress'));
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
            const batch = writeBatch(db);
            const batchProgress = progressToMigrate.slice(i, i + BATCH_SIZE);
            
            batchProgress.forEach(({ id }) => {
                const progressRef = doc(db, 'monthlyProgress', id);
                batch.update(progressRef, {
                    clientId: DEFAULT_CLIENT_ID,
                    updatedAt: Timestamp.now()
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

