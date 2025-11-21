# 🔧 Correctif v2.0.13 - Persistance LocalStorage Mode Démo

## 📅 Date : 3 novembre 2025

## 🎯 Problème Résolu

### ❌ Avant
```
1. Admin créé une question en mode démo
2. Question apparaît dans la liste
3. User va sur le quiz → question N'APPARAIT PAS
4. User retourne à l'admin → question DISPARUE
```

**Cause** : Questions stockées en mémoire (variable JavaScript) uniquement
- Perdues au refresh de page
- Pas synchronisées entre admin et quiz

### ✅ Après
```
1. Admin créé une question en mode démo
2. Question sauvegardée dans localStorage
3. User va sur le quiz → question DISPONIBLE ✅
4. User retourne à l'admin → question TOUJOURS LÀ ✅
5. Refresh page → question PERSISTE ✅
```

## ✅ Modifications Apportées

### 1. **js/admin-questions.js** - Persistance localStorage

#### A) Clé de stockage
```javascript
const DEMO_STORAGE_KEY = 'avantage-quizz-demo-questions';
```

#### B) Fonction de chargement
```javascript
function loadDemoQuestions() {
    if (!isDemoMode()) return [];
    
    const saved = localStorage.getItem(DEMO_STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Reconvertir les dates ISO en objets Date
            return parsed.map(q => ({
                ...q,
                createdAt: new Date(q.createdAt)
            }));
        } catch (e) {
            console.warn('⚠️ Erreur lecture localStorage');
        }
    }
    
    // Questions par défaut si localStorage vide
    return [ /* 5 questions initiales */ ];
}
```

#### C) Fonction de sauvegarde
```javascript
function saveDemoQuestions(questions) {
    if (!isDemoMode()) return;
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(questions));
    console.log('💾 Questions démo sauvegardées:', questions.length);
}
```

#### D) Initialisation
```javascript
// Avant : const MOCK_QUESTIONS = [...]
// Après : let MOCK_QUESTIONS = loadDemoQuestions()
let MOCK_QUESTIONS = loadDemoQuestions();
```

#### E) Sauvegarde après CRUD

**Création**
```javascript
const newMockQuestion = {
    id: `demo-${Date.now()}`,
    ...questionData,
    createdAt: new Date()
};
MOCK_QUESTIONS.unshift(newMockQuestion);

// 💾 SAUVEGARDER
saveDemoQuestions(MOCK_QUESTIONS);
```

**Suppression**
```javascript
const index = MOCK_QUESTIONS.findIndex(q => q.id === questionId);
if (index > -1) {
    MOCK_QUESTIONS.splice(index, 1);
    
    // 💾 SAUVEGARDER
    saveDemoQuestions(MOCK_QUESTIONS);
}
```

**Import JSON**
```javascript
questionsToImport.forEach((q, idx) => {
    MOCK_QUESTIONS.unshift({ /* ... */ });
});

// 💾 SAUVEGARDER
saveDemoQuestions(MOCK_QUESTIONS);
```

### 2. **js/quiz.js** - Lecture localStorage synchronisée

#### Avant (questions hardcodées)
```javascript
if (isDemoMode()) {
    const DEMO_QUESTIONS = [ /* 5 questions fixes */ ];
    return DEMO_QUESTIONS;
}
```

#### Après (lecture localStorage)
```javascript
if (isDemoMode()) {
    const DEMO_STORAGE_KEY = 'avantage-quizz-demo-questions';
    const saved = localStorage.getItem(DEMO_STORAGE_KEY);
    
    let demoQuestions = [];
    
    if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`💾 ${parsed.length} questions chargées depuis localStorage`);
        
        // Convertir au format quiz
        demoQuestions = parsed.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options.map((opt, index) => ({
                id: String.fromCharCode(65 + index),
                text: opt,
                correct: index === q.correctAnswer
            })),
            explanation: q.explanation || 'Pas d\'explication',
            reference: q.reference || '',
            tags: q.tags || []
        }));
        
        // Filtrer par module/mois
        demoQuestions = demoQuestions.filter(q => {
            const originalQ = parsed.find(p => p.id === q.id);
            return originalQ.module === moduleId && 
                   originalQ.month === monthNumber;
        });
    }
    
    // Fallback : 5 questions par défaut
    if (demoQuestions.length === 0) {
        demoQuestions = [ /* 5 questions fixes */ ];
    }
    
    return demoQuestions;
}
```

## 📊 Flux de Données

### Architecture persistance

```
┌─────────────────────────────────────────────────────────┐
│                     ADMIN INTERFACE                     │
│  (admin-questions.js)                                   │
│                                                         │
│  Création → MOCK_QUESTIONS.unshift(newQ)               │
│             saveDemoQuestions(MOCK_QUESTIONS) ──────┐  │
│                                                      │  │
│  Suppression → MOCK_QUESTIONS.splice(index, 1)      │  │
│                saveDemoQuestions(MOCK_QUESTIONS) ───┤  │
│                                                      │  │
│  Import JSON → MOCK_QUESTIONS.unshift(importedQs)   │  │
│                saveDemoQuestions(MOCK_QUESTIONS) ───┤  │
│                                                      ▼  │
└──────────────────────────────────────────────────────┼──┘
                                                       │
                                ┌──────────────────────▼──────────────────────┐
                                │        localStorage                          │
                                │  Key: 'avantage-quizz-demo-questions'       │
                                │  Value: JSON array of questions             │
                                │  [{id, question, options, correctAnswer,    │
                                │    explanation, module, month, year}, ...]  │
                                └──────────────────────▲──────────────────────┘
                                                       │
┌──────────────────────────────────────────────────────┼──┘
│                     QUIZ INTERFACE                   │  │
│  (quiz.js)                                           │  │
│                                                      │  │
│  loadQuizFromFirestore() ──────────────────────────┘  │
│      ↓                                                 │
│  localStorage.getItem(DEMO_STORAGE_KEY)               │
│      ↓                                                 │
│  JSON.parse() → Convert to quiz format                │
│      ↓                                                 │
│  Filter by module + month                             │
│      ↓                                                 │
│  Return demoQuestions                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 🧪 Tests de Validation

### Test 1 : Persistance création
1. ✅ Admin → Créer question "Test 1"
2. ✅ Vérifier apparaît dans liste
3. ✅ Ouvrir DevTools → Application → Local Storage
4. ✅ Voir clé `avantage-quizz-demo-questions` avec JSON
5. ✅ Refresh page (`F5`)
6. ✅ **RÉSULTAT** : Question "Test 1" toujours présente

### Test 2 : Synchronisation admin → quiz
1. ✅ Admin → Créer question module "Auto", mois "Novembre"
2. ✅ Aller sur quiz (index.html)
3. ✅ Sélectionner Auto → Novembre → Commencer
4. ✅ **RÉSULTAT** : Question créée apparaît dans le quiz

### Test 3 : Persistance après navigation
1. ✅ Admin → Créer 3 questions
2. ✅ Aller sur quiz → faire le quiz
3. ✅ Revenir sur admin
4. ✅ **RÉSULTAT** : Les 3 questions sont toujours là

### Test 4 : Suppression persistante
1. ✅ Admin → Supprimer une question
2. ✅ Refresh page
3. ✅ **RÉSULTAT** : Question supprimée ne revient pas

### Test 5 : Import JSON persistant
1. ✅ Admin → Importer fichier JSON (5 questions)
2. ✅ Refresh page
3. ✅ **RÉSULTAT** : 5 questions importées persistent

## 📦 Structure localStorage

### Format JSON stocké
```json
[
  {
    "id": "demo-1730678912345",
    "module": "auto",
    "month": 11,
    "year": 2025,
    "question": "Quelle est la vitesse maximale...",
    "options": [
      "100 km/h",
      "110 km/h",
      "120 km/h",
      "100 km/h (conditions normales)"
    ],
    "correctAnswer": 3,
    "explanation": "La vitesse maximale sur autoroute...",
    "reference": "Code de la sécurité routière",
    "tags": ["vitesse", "autoroute"],
    "createdAt": "2025-11-03T15:35:12.345Z"
  },
  {
    "id": "demo-1730678923456",
    "module": "loisir",
    ...
  }
]
```

### Taille estimée
- **Question moyenne** : ~600 bytes
- **10 questions** : ~6 KB
- **100 questions** : ~60 KB
- **Limite localStorage** : 5-10 MB (largement suffisant)

## 🔄 Conversion Format Admin → Quiz

### Format Admin (localStorage)
```javascript
{
    id: 'demo-123',
    question: 'Question text',
    options: ['Opt1', 'Opt2', 'Opt3', 'Opt4'],  // Array strings
    correctAnswer: 2,                            // Index 0-3
    explanation: 'Explanation text',
    module: 'auto',
    month: 11,
    year: 2025
}
```

### Format Quiz (interface)
```javascript
{
    id: 'demo-123',
    question: 'Question text',
    options: [
        { id: 'A', text: 'Opt1', correct: false },
        { id: 'B', text: 'Opt2', correct: false },
        { id: 'C', text: 'Opt3', correct: true },  // correct selon correctAnswer
        { id: 'D', text: 'Opt4', correct: false }
    ],
    explanation: 'Explanation text',
    reference: '',
    tags: []
}
```

**Conversion automatique** dans `quiz.js` :
```javascript
options: q.options.map((opt, index) => ({
    id: String.fromCharCode(65 + index),  // A, B, C, D
    text: opt,
    correct: index === q.correctAnswer
}))
```

## 🛡️ Gestion Erreurs

### localStorage indisponible
```javascript
function saveDemoQuestions(questions) {
    try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {
        console.error('❌ Erreur sauvegarde localStorage:', e);
        toast.error('Impossible de sauvegarder (localStorage plein?)');
    }
}
```

### JSON corrompu
```javascript
try {
    const parsed = JSON.parse(saved);
    return parsed.map(q => ({ ...q, createdAt: new Date(q.createdAt) }));
} catch (e) {
    console.warn('⚠️ JSON corrompu, réinitialisation');
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return [ /* questions par défaut */ ];
}
```

## 📋 Checklist Validation

- [x] Questions créées persistent après refresh
- [x] Questions synchronisées admin ↔ quiz
- [x] Suppression persiste
- [x] Import JSON persiste
- [x] Filtres module/mois fonctionnels
- [x] Conversion format admin → quiz correcte
- [x] Gestion erreurs localStorage
- [x] Fallback questions par défaut si localStorage vide
- [x] Performance optimale (pas de lag)

## 🎯 Résultats

### Avant v2.0.13
```
❌ Questions perdues au refresh
❌ Admin et quiz désynchronisés
❌ UX frustrante (perte de données)
```

### Après v2.0.13
```
✅ Questions persistent indéfiniment
✅ Admin et quiz parfaitement synchronisés
✅ UX fluide (comme avec vraie base de données)
✅ Mode démo entièrement fonctionnel
```

## 🚀 Utilisation

### Réinitialiser questions démo
```javascript
// Dans la console navigateur
localStorage.removeItem('avantage-quizz-demo-questions');
location.reload();
```

### Exporter questions démo (futur)
```javascript
const questions = JSON.parse(
    localStorage.getItem('avantage-quizz-demo-questions')
);
const blob = new Blob([JSON.stringify(questions, null, 2)], 
    { type: 'application/json' }
);
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'demo-questions-export.json';
a.click();
```

## 🔜 Améliorations Futures

### 1. Bouton "Réinitialiser questions démo"
```javascript
function resetDemoQuestions() {
    if (confirm('Supprimer toutes les questions démo ?')) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        location.reload();
    }
}
```

### 2. Export/Import localStorage
- Bouton "Exporter questions démo" → JSON file
- Bouton "Importer questions démo" → Remplace localStorage

### 3. Statistiques localStorage
```javascript
function getDemoStorageStats() {
    const data = localStorage.getItem(DEMO_STORAGE_KEY);
    return {
        questions: JSON.parse(data || '[]').length,
        size: new Blob([data || '']).size,
        sizeFormatted: (new Blob([data || '']).size / 1024).toFixed(2) + ' KB'
    };
}
```

## 📖 Documentation Liée

- `CORRECTIF-V2.0.12-QUIZ-MODE-DEMO.md` - Support quiz mode démo
- `CORRECTIF-V2.0.11-GRAPHIQUES-DEMO.md` - Graphiques Chart.js
- `CORRECTIF-V2.0.10-MODE-DEMO.md` - Mock data admin

---

**Version** : v2.0.13  
**Status** : ✅ Testé et validé  
**Impact** : 🎯 Critique - Résout problème majeur UX mode démo  
**Next** : Bouton réinitialisation + Export JSON
