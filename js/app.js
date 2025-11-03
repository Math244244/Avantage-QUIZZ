// Main application logic
import { initAuthUI, onAuthChange } from './auth.js';
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize authentication UI
initAuthUI();

// Update UI based on authentication state
onAuthChange((user) => {
    const appDiv = document.getElementById('app');
    
    if (user) {
        // User is logged in
        appDiv.innerHTML = `
            <div class="card">
                <h2 class="text-2xl font-bold mb-4">Bienvenue, ${user.displayName}!</h2>
                <p class="text-gray-600 mb-4">Vous êtes connecté avec Firebase.</p>
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Vos informations:</h3>
                        <p class="text-sm text-gray-600">Email: ${user.email}</p>
                        <p class="text-sm text-gray-600">UID: ${user.uid}</p>
                    </div>
                    <button id="testFirestoreBtn" class="btn-primary">
                        Tester Firestore
                    </button>
                    <div id="firestoreResult" class="mt-4"></div>
                </div>
            </div>
        `;
        
        // Test Firestore button
        document.getElementById('testFirestoreBtn').addEventListener('click', async () => {
            const resultDiv = document.getElementById('firestoreResult');
            try {
                // Add a test document
                const docRef = await addDoc(collection(db, 'test'), {
                    message: 'Test de Firestore',
                    timestamp: new Date(),
                    userId: user.uid
                });
                resultDiv.innerHTML = `
                    <div class="p-4 bg-green-100 border border-green-400 rounded">
                        <p class="text-green-800">✅ Document ajouté avec succès!</p>
                        <p class="text-sm text-green-600">ID: ${docRef.id}</p>
                    </div>
                `;
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="p-4 bg-red-100 border border-red-400 rounded">
                        <p class="text-red-800">❌ Erreur: ${error.message}</p>
                    </div>
                `;
            }
        });
    } else {
        // User is not logged in
        appDiv.innerHTML = `
            <div class="card">
                <h2 class="text-2xl font-bold mb-4">Bienvenue sur Avantage QUIZZ</h2>
                <p class="text-gray-600 mb-4">Connectez-vous avec votre compte Google pour commencer.</p>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p class="text-blue-800">
                        <strong>Note:</strong> Cette application utilise Firebase Authentication et Firestore.
                    </p>
                </div>
            </div>
        `;
    }
});

console.log('Application initialisée');
