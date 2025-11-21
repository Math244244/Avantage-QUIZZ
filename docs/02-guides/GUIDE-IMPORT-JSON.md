# 📥 Guide d'Import de Questions JSON

## 🎯 Structure du Fichier JSON

Le fichier JSON doit suivre **EXACTEMENT** cette structure :

```json
{
  "module": "auto",
  "month": 11,
  "year": 2025,
  "questions": [...]
}
```

### ⚙️ Métadonnées Globales

| Champ | Type | Valeurs Possibles | Exemple |
|-------|------|-------------------|---------|
| `module` | string | `"auto"`, `"loisir"`, `"vr"`, `"tracteur"` | `"auto"` |
| `month` | number | `1` à `12` (Janvier = 1, Décembre = 12) | `11` |
| `year` | number | Année (ex: 2025) | `2025` |

⚠️ **ATTENTION** : Le mois doit être un **numéro** (1-12), PAS un texte !

### 📝 Structure d'une Question

Chaque question dans le tableau `questions` doit avoir :

| Champ | Type | Contraintes | Exemple |
|-------|------|-------------|---------|
| `question` | string | Minimum 10 caractères | `"Quelle est la pression..."` |
| `options` | array[string] | Exactement 4 options | `["25 PSI", "32 PSI", ...]` |
| `correctAnswer` | number | 0, 1, 2 ou 3 (index de la bonne réponse) | `1` |
| `explanation` | string | Minimum 20 caractères | `"La pression recommandée..."` |

---

## 📋 Exemples Complets par Module

### 🚗 Module AUTO (Automobile)

```json
{
  "module": "auto",
  "month": 11,
  "year": 2025,
  "questions": [
    {
      "question": "Quelle est la durée standard d'une garantie prolongée automobile?",
      "options": ["1 an", "2 ans", "3 ans", "5 ans"],
      "correctAnswer": 2,
      "explanation": "La garantie prolongée standard est de 3 ans ou 60 000 km, selon la première éventualité."
    },
    {
      "question": "À quelle pression doit-on gonfler les pneus d'une voiture standard?",
      "options": ["25 PSI", "32 PSI", "40 PSI", "50 PSI"],
      "correctAnswer": 1,
      "explanation": "La pression recommandée pour la plupart des véhicules standards est de 32 PSI."
    }
  ]
}
```

### 🎣 Module LOISIR (VTT, Moto, Bateau)

```json
{
  "module": "loisir",
  "month": 12,
  "year": 2025,
  "questions": [
    {
      "question": "Quelle est l'inspection obligatoire avant la vente d'un VTT d'occasion?",
      "options": ["Inspection visuelle", "Inspection mécanique complète", "Test routier", "Aucune"],
      "correctAnswer": 1,
      "explanation": "Une inspection mécanique complète est obligatoire pour tout VTT d'occasion."
    },
    {
      "question": "Quel est le poids maximal recommandé pour un bateau remorqué par un véhicule standard?",
      "options": ["1500 kg", "2000 kg", "2500 kg", "3000 kg"],
      "correctAnswer": 2,
      "explanation": "Pour un véhicule standard, 2500 kg est généralement la limite recommandée."
    }
  ]
}
```

### 🚐 Module VR (Véhicule Récréatif)

```json
{
  "module": "vr",
  "month": 10,
  "year": 2025,
  "questions": [
    {
      "question": "Quelle est la capacité minimale recommandée pour une batterie de VR?",
      "options": ["75 Ah", "100 Ah", "125 Ah", "150 Ah"],
      "correctAnswer": 1,
      "explanation": "Une batterie de 100 Ah est le minimum recommandé pour alimenter les équipements de base d'un VR."
    },
    {
      "question": "Quelle est la capacité de remorquage minimale d'un véhicule pour tracter un VR de 5000 lb?",
      "options": ["5000 lb", "6000 lb", "7500 lb", "10000 lb"],
      "correctAnswer": 2,
      "explanation": "Il faut une capacité d'au moins 7500 lb pour remorquer un VR de 5000 lb (marge de sécurité de 50%)."
    }
  ]
}
```

### 🚜 Module TRACTEUR (Équipement Agricole)

```json
{
  "module": "tracteur",
  "month": 9,
  "year": 2025,
  "questions": [
    {
      "question": "À quelle profondeur doit-on labourer pour les cultures céréalières?",
      "options": ["10-15 cm", "20-25 cm", "30-35 cm", "40-45 cm"],
      "correctAnswer": 1,
      "explanation": "La profondeur idéale pour le labour des céréales est de 20-25 cm."
    },
    {
      "question": "À quelle fréquence faut-il vidanger l'huile d'un tracteur agricole?",
      "options": ["Tous les 25 heures", "Tous les 50 heures", "Tous les 100 heures", "Tous les 200 heures"],
      "correctAnswer": 1,
      "explanation": "La vidange d'huile est recommandée tous les 50 heures d'utilisation pour maintenir les performances."
    }
  ]
}
```

---

## 📅 Numéros de Mois

| Mois | Numéro | Mois | Numéro |
|------|--------|------|--------|
| Janvier | `1` | Juillet | `7` |
| Février | `2` | Août | `8` |
| Mars | `3` | Septembre | `9` |
| Avril | `4` | Octobre | `10` |
| Mai | `5` | Novembre | `11` |
| Juin | `6` | Décembre | `12` |

---

## ✅ Règles de Validation

### Métadonnées
- ✓ `module` doit être : `auto`, `loisir`, `vr` ou `tracteur`
- ✓ `month` doit être un nombre entre 1 et 12
- ✓ `year` doit être une année valide (2025+)
- ✓ Le fichier doit contenir au moins 1 question

### Questions
- ✓ `question` : Minimum 10 caractères
- ✓ `options` : Exactement 4 choix de réponse
- ✓ `correctAnswer` : Entre 0 et 3 (index dans `options`)
- ✓ `explanation` : Minimum 20 caractères

---

## 🤖 Prompt pour Intelligence Artificielle

Copiez-collez ce prompt à votre IA préférée (ChatGPT, Claude, etc.) :

```
Génère-moi un fichier JSON contenant 20 questions pour un quiz.

Structure EXACTE requise :
{
  "module": "auto",
  "month": 11,
  "year": 2025,
  "questions": [
    {
      "question": "Texte de la question (min 10 caractères)",
      "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
      "correctAnswer": 2,
      "explanation": "Explication détaillée de la bonne réponse (min 20 caractères)"
    }
  ]
}

Contraintes :
- module : "auto", "loisir", "vr" ou "tracteur"
- month : Numéro de 1 à 12 (pas de texte)
- year : 2025
- Exactement 4 options par question
- correctAnswer : index 0-3
- Questions pertinentes au domaine choisi

Retourne UNIQUEMENT le JSON valide, sans code markdown ni texte supplémentaire.
```

---

## 💾 Fichier Template

Un fichier template est disponible : **`template-import-questions.json`**

Vous pouvez le copier et le modifier selon vos besoins.

---

## 🚀 Procédure d'Import

1. **Créez** votre fichier JSON selon le format ci-dessus
2. **Validez** que tous les champs obligatoires sont présents
3. Allez dans **Gestion d'Administrateur** → **Gestion des Questions**
4. Cliquez sur **"Parcourir les fichiers"**
5. Sélectionnez votre fichier JSON
6. Vérifiez l'aperçu affiché
7. Cliquez sur **"Confirmer l'import"**

---

## ❌ Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Champs obligatoires manquants" | `module`, `month` ou `year` absent | Vérifiez la structure racine du JSON |
| "month doit être un nombre" | Mois en texte (`"novembre"`) | Utilisez un nombre : `11` |
| "4 options requises" | Moins ou plus de 4 choix | Ajustez le tableau `options` |
| "correctAnswer invalide" | Index hors de 0-3 | Vérifiez que la valeur est entre 0 et 3 |

---

## 📞 Support

En cas de problème, vérifiez :
1. ✓ Structure JSON valide (pas d'erreur de syntaxe)
2. ✓ Métadonnées complètes (module, month, year)
3. ✓ Month est un **nombre**, pas un texte
4. ✓ Toutes les questions ont 4 options
5. ✓ correctAnswer est entre 0 et 3
6. ✓ Textes respectent les longueurs minimales

---

**Dernière mise à jour** : 5 novembre 2025
**Version** : 2.0.19
