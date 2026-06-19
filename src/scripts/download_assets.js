import https from 'https';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { URL } from 'url';

const assets = [
  { name: 'emerald.webp', wikiFiles: ['Emerald.png'] },
  { name: 'gold.webp', wikiFiles: ['Gold_Coin.png', 'Gold.png'] },
  { name: 'energy.webp', wikiFiles: ['Energy.png'] },
  { name: 'vip.webp', wikiFiles: ['VIP.png'] },
  { name: 'coin_1.webp', wikiFiles: ['Arena_Coin.png'] },
  { name: 'coin_2.webp', wikiFiles: ['Grand_Arena_Coin.png'] },
  { name: 'coin_3.webp', wikiFiles: ['Tower_Coin.png'] },
  { name: 'coin_4.webp', wikiFiles: ['Outland_Coin.png'] },
  { name: 'coin_5.webp', wikiFiles: ['Guild_Coin.png'] },
  { name: 'coin_18.webp', wikiFiles: ['Titan_Valley_Coin.png', 'Elemental_Tournament_Coin.png'] },
  { name: 'coin_38.webp', wikiFiles: ['Soul_Crystal.png'] },
  { name: 'skin_stone_101.webp', wikiFiles: ['Intelligence_Skin_Stone.png'] },
  { name: 'skin_stone_102.webp', wikiFiles: ['Strength_Skin_Stone.png'] },
  { name: 'skin_stone_103.webp', wikiFiles: ['Agility_Skin_Stone.png'] },
  { name: 'skin_stone_104.webp', wikiFiles: ['Skin_Stone_Chest.png'] }
];

const destDir = path.resolve('public/ui');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function getWikiaUrl(fileName) {
  const formattedName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/ /g, '_');
  const hash = crypto.createHash('md5').update(formattedName).digest('hex');
  const pathPart = `${hash.charAt(0)}/${hash.substring(0, 2)}/${formattedName}`;
  return `https://static.wikia.nocookie.net/hero-wars/images/${pathPart}`;
}

async function downloadFile(urlStr, destPath) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(urlStr);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };

      https.get(options, (res) => {
        if (res.statusCode === 200) {
          const fileStream = fs.createWriteStream(destPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(true);
          });
        } else {
          resolve(false);
        }
      }).on('error', () => {
        resolve(false);
      });
    } catch (e) {
      resolve(false);
    }
  });
}

async function run() {
  console.log(`Starting dynamic Wikia asset downloads (.webp) to: ${destDir}\n`);
  
  // 1. Régi letöltött .png fájlok eltávolítása a public/ui könyvtárból
  console.log('Cleaning up old .png assets...');
  assets.forEach(asset => {
    const oldPngPath = path.join(destDir, asset.name.replace('.webp', '.png'));
    if (fs.existsSync(oldPngPath)) {
      try {
        fs.unlinkSync(oldPngPath);
        console.log(`Deleted old file: ${path.basename(oldPngPath)}`);
      } catch (e) {
        console.error(`Error deleting ${oldPngPath}:`, e.message);
      }
    }
  });
  console.log('');

  // 2. Letöltés .webp kiterjesztéssel
  for (const asset of assets) {
    const destPath = path.join(destDir, asset.name);
    let success = false;
    
    for (const wikiFile of asset.wikiFiles) {
      const url = getWikiaUrl(wikiFile);
      console.log(`Downloading ${asset.name} (Wiki source: ${wikiFile}) from ${url}...`);
      
      try {
        success = await downloadFile(url, destPath);
        if (success) {
          console.log(`SUCCESS: Saved ${asset.name}\n`);
          break;
        } else {
          console.log(`FAILED (404/403)`);
        }
      } catch (err) {
        console.error(`Error for ${asset.name}:`, err.message);
      }
    }
    
    if (!success) {
      console.warn(`WARNING: Could not download ${asset.name} from any sources!\n`);
    }
  }
  
  console.log('Finished downloading assets.');
}

run();
