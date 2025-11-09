/**
 * Script pour ajouter aria-hidden="true" aux SVG décoratifs
 * 
 * Usage: node scripts/add-aria-hidden-to-svgs.cjs
 */

const fs = require('fs');
const path = require('path');

// Fichiers à traiter
const files = [
    'index.html',
    'results.html',
    'resources.html',
    'admin.html'
];

// Pattern regex pour trouver les SVG sans aria-hidden
const svgPattern = /<svg(?![^>]*aria-hidden)([^>]*)>/g;

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Fichier non trouvé: ${file}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;
    
    // Remplacer tous les <svg sans aria-hidden par <svg aria-hidden="true"
    content = content.replace(svgPattern, (match, attributes) => {
        count++;
        return `<svg aria-hidden="true"${attributes}>`;
    });
    
    if (count > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file}: ${count} SVG mis à jour avec aria-hidden`);
    } else {
        console.log(`✓  ${file}: Aucun SVG à mettre à jour`);
    }
});

console.log('\n🎉 Terminé!');

