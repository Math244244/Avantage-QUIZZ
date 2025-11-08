import { cpSync, mkdirSync, existsSync, statSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');

function ensureDir(targetPath) {
  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true });
  }
}

function copyFile(relativeSource, relativeDestination = relativeSource) {
  const source = resolve(projectRoot, relativeSource);
  const destination = resolve(distDir, relativeDestination);

  if (!existsSync(source)) {
    return;
  }

  ensureDir(resolve(destination, '..'));

  cpSync(source, destination, { recursive: true });
}

function copyDir(relativeSource, relativeDestination = relativeSource) {
  const source = resolve(projectRoot, relativeSource);
  if (!existsSync(source) || !statSync(source).isDirectory()) {
    return;
  }
  const destination = resolve(distDir, relativeDestination);
  ensureDir(destination);
  cpSync(source, destination, { recursive: true });
}

copyFile('service-worker.js');
copyFile('manifest.json');

copyDir('icons');
copyDir('css');
