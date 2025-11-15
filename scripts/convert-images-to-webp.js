/**
 * Script de Conversion d'Images en WebP
 * 
 * P1-4: Convertit les images PNG/JPG en WebP pour optimisation
 * 
 * Usage:
 *   node scripts/convert-images-to-webp.js
 * 
 * Prérequis:
 *   npm install sharp --save-dev
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Formats d'images supportés
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg'];

// Dossiers à traiter
const IMAGE_DIRS = [
    'assets/images/logos',
    'assets/images/favicons',
    'assets/images/branding'
];

/**
 * Convertir une image en WebP
 */
async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);
        
        const inputStats = await stat(inputPath);
        const outputStats = await stat(outputPath);
        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
        
        console.log(`✅ ${inputPath} → ${outputPath} (${reduction}% plus petit)`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur conversion ${inputPath}:`, error.message);
        return false;
    }
}

/**
 * Parcourir un dossier et convertir les images
 */
async function processDirectory(dirPath) {
    try {
        const files = await readdir(dirPath);
        let converted = 0;
        
        for (const file of files) {
            const filePath = join(dirPath, file);
            const ext = extname(file).toLowerCase();
            
            // Ignorer les fichiers déjà en WebP et les fichiers non-images
            if (ext === '.webp' || !SUPPORTED_FORMATS.includes(ext)) {
                continue;
            }
            
            // Vérifier si c'est un fichier
            const stats = await stat(filePath);
            if (!stats.isFile()) {
                continue;
            }
            
            // Générer le chemin WebP
            const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            
            // Convertir
            const success = await convertToWebP(filePath, webpPath);
            if (success) {
                converted++;
            }
        }
        
        return converted;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`⚠️  Dossier non trouvé: ${dirPath}`);
            return 0;
        }
        console.error(`❌ Erreur traitement ${dirPath}:`, error.message);
        return 0;
    }
}

/**
 * Fonction principale
 */
async function main() {
    console.log('🖼️  Conversion des images en WebP...\n');
    
    let totalConverted = 0;
    
    for (const dir of IMAGE_DIRS) {
        const fullPath = join(rootDir, dir);
        console.log(`📁 Traitement: ${dir}`);
        const converted = await processDirectory(fullPath);
        totalConverted += converted;
        console.log('');
    }
    
    console.log(`\n✅ Conversion terminée: ${totalConverted} image(s) convertie(s)`);
    
    if (totalConverted === 0) {
        console.log('\n💡 Astuce: Assurez-vous que les images PNG/JPG existent dans les dossiers:');
        IMAGE_DIRS.forEach(dir => console.log(`   - ${dir}`));
    }
}

// Exécuter
main().catch(console.error);



