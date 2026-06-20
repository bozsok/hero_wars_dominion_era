import fs from 'fs';
import https from 'https';
import path from 'path';

const itemsMapping = [
  { id: 'petSummoningEgg',    type: 'consumable', numId: 11 },
  { id: 'petPotion',          type: 'consumable', numId: 20 },
  { id: 'summoningSphere',    type: 'consumable', numId: 10 },
  { id: 'titanPotion',        type: 'coin',       numId: 39 },
  { id: 'titanSkinStone',     type: 'coin',       numId: 37 },
  { id: 'titanSoulCoin',      type: 'coin',       numId: 28 },
  { id: 'titanArtifactSphere',type: 'consumable', numId: 44 },
  { id: 'essenceOfTheElements',type: 'coin',      numId: 13 },
  { id: 'artifactChestKey',   type: 'consumable', numId: 9 },
  { id: 'chaosCore',          type: 'consumable', numId: 12 },
  { id: 'artifactCoin',       type: 'coin',       numId: 24 },
  { id: 'bronzeTrophy',       type: 'coin',       numId: 13 },
  { id: 'silverTrophy',       type: 'coin',       numId: 14 },
  { id: 'goldTrophy',         type: 'coin',       numId: 15 },
  { id: 'clashOfWorldsTrophy',type: 'coin',       numId: 45 },
  { id: 'elementalTournamentCoin', type: 'coin',  numId: 30 },
  { id: 'valorEmblem',        type: 'coin',       numId: 46 },
  { id: 'goldenThread',       type: 'coin',       numId: 43 },
  { id: 'eternalSeed',        type: 'consumable', numId: 85 },
  { id: 'ancientWisdomCrystal',type: 'consumable',numId: 86 },
  { id: 'elementalCatalyst',  type: 'consumable', numId: 88 },
  { id: 'primalCatalyst',     type: 'consumable', numId: 89 },
  { id: 'bottledEnergy',      type: 'consumable', numId: 1 },
  { id: 'soulCoin',           type: 'coin',       numId: 6 },
  { id: 'friendshipChip',     type: 'coin',       numId: 9 },
  { id: 'sparkOfPower',       type: 'coin',       numId: 10 }
];

const destDir = path.join('public', 'ui');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${path.basename(dest)}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        file.close();
        fs.unlinkSync(dest);
        resolve(); // resolve anyway to continue
      }
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  for (const item of itemsMapping) {
    const url = `https://hw-assets.nextersglobal.com/ui/${item.type}_${item.numId}.webp`;
    const dest = path.join(destDir, `${item.type}_${item.numId}.webp`);
    await download(url, dest);
    console.log(`Downloaded ${item.type}_${item.numId}.webp for ${item.id}`);
  }
}

main().catch(console.error);
