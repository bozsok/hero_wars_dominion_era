import fs from 'fs';
import https from 'https';
import path from 'path';

const itemsMapping = [
  { id: 'petSummoningEgg',    name: 'Summoning Egg' }, // Fandom name is "Summoning Egg" or "Pet Summoning Egg"
  { id: 'petPotion',          name: 'Pet Potion' },
  { id: 'summoningSphere',    name: 'Summoning Sphere' }, // Titan
  { id: 'titanPotion',        name: 'Titan Potion' },
  { id: 'titanSkinStone',     name: 'Titan Skin Stone' },
  { id: 'titanSoulCoin',      name: 'Titan Soul Coin' },
  { id: 'titanArtifactSphere',name: 'Titan Artifact Sphere' },
  { id: 'essenceOfTheElements',name: 'Essence of the Elements' },
  { id: 'artifactChestKey',   name: 'Artifact Chest Key' },
  { id: 'chaosCore',          name: 'Chaos Core' },
  { id: 'artifactCoin',       name: 'Artifact Coin' },
  { id: 'bronzeTrophy',       name: 'Bronze Guild War Trophy' },
  { id: 'silverTrophy',       name: 'Silver Guild War Trophy' },
  { id: 'goldTrophy',         name: 'Gold Guild War Trophy' },
  { id: 'clashOfWorldsTrophy',name: 'Clash of Worlds Trophy' },
  { id: 'elementalTournamentCoin', name: 'Elemental Tournament Coin' },
  { id: 'valorEmblem',        name: 'Valor Emblem' },
  { id: 'goldenThread',       name: 'Golden Thread' },
  { id: 'eternalSeed',        name: 'Eternal Seed' },
  { id: 'ancientWisdomCrystal',name: 'Ancient Wisdom Crystal' },
  { id: 'elementalCatalyst',  name: 'Elemental Catalyst' },
  { id: 'primalCatalyst',     name: 'Primal Catalyst' },
  { id: 'bottledEnergy',      name: 'Bottled Energy' },
  { id: 'soulCoin',           name: 'Soul Coin' },
  { id: 'friendshipChip',     name: 'Friendship Chip' },
  { id: 'sparkOfPower',       name: 'Spark of Power' }
];

const destDir = path.join('public', 'ui');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function queryFandom(name) {
  return new Promise((resolve) => {
    // try exact match with _ and spaces
    const queryName = name.replace(/ /g, '_');
    const url = `https://hero-wars.fandom.com/api.php?action=query&list=allimages&aiprefix=${encodeURIComponent(name.split(' ')[0])}&ailimit=500&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let bestUrl = null;
          if (parsed.query && parsed.query.allimages) {
            const exactMatch = parsed.query.allimages.find(img => img.name.toLowerCase() === `${name.toLowerCase()}.png` || img.name.toLowerCase() === `${queryName.toLowerCase()}.png` || img.name.toLowerCase().includes(name.toLowerCase()));
            if (exactMatch) bestUrl = exactMatch.url;
            else if (parsed.query.allimages.length > 0) {
                // fall back to first that contains first two words
                const words = name.toLowerCase().split(' ');
                const partialMatch = parsed.query.allimages.find(img => img.name.toLowerCase().includes(words[0]) && (words[1] ? img.name.toLowerCase().includes(words[1]) : true));
                if (partialMatch) bestUrl = partialMatch.url;
            }
          }
          resolve(bestUrl);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        file.close();
        fs.unlinkSync(dest);
        resolve();
      }
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  for (const item of itemsMapping) {
    const dest = path.join(destDir, `${item.id}.png`);
    if (fs.existsSync(dest)) {
        console.log(`Already exists: ${item.id}.png`);
        continue;
    }
    console.log(`Querying Fandom for ${item.name}...`);
    const url = await queryFandom(item.name);
    if (url) {
      console.log(`Found URL: ${url}. Downloading...`);
      await download(url, dest);
      console.log(`Success: ${item.id}.png`);
    } else {
      console.log(`Failed to find ${item.name} on Fandom`);
    }
    // wait a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }
}

main().catch(console.error);
