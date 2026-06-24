import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dictionaryPath = path.resolve(__dirname, '../data/consumablesDictionary.json');
const destDir = path.resolve(process.cwd(), 'public/consumables');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Olvassuk be a szótárat
const dictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));

function getWikiaUrl(fileName) {
  // A Wikia MD5 hash alapú útválasztást használ
  const hash = crypto.createHash('md5').update(fileName.replace(/ /g, '_')).digest('hex');
  const part1 = hash.substring(0, 1);
  const part2 = hash.substring(0, 2);
  return `https://static.wikia.nocookie.net/hero-wars/images/${part1}/${part2}/${fileName.replace(/ /g, '_')}`;
}

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
         // Handle redirects if needed (Wikia sometimes redirects to revision urls)
         downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}. Status code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Downloading consumable images to ${destDir}...`);
  const entries = Object.entries(dictionary);
  
  for (const [id, item] of entries) {
    if (!item.wikiFile) continue;
    
    const url = getWikiaUrl(item.wikiFile);
    // Változtattuk .webp-ről .png-re, mert a wikin png-k
    const destPath = path.join(destDir, `${id}.png`);
    
    try {
      await downloadImage(url, destPath);
      console.log(`[\u2713] Letöltve: ${item.name} -> ${id}.png`);
    } catch (err) {
      console.error(`[X] Hiba a letöltésnél: ${item.name} (${item.wikiFile}) - ${err.message}`);
    }
  }
  
  console.log('Kész!');
}

downloadAll();
