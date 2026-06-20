const fs = require('fs');
const dict = JSON.parse(fs.readFileSync('scratch_en.json', 'utf8'));
const items = ['pet summoning egg', 'eternal seed', 'ancient wisdom crystal', 'pet potion', 'titan artifact sphere', 'essence of the elements', 'artifact chest key', 'chaos core', 'spark of power', 'titan potion', 'bottled energy', 'soul coin', 'friendship chip', 'summoning sphere', 'artifact coin', 'titan soul coin', 'elemental tournament coin', 'titan skin stone', 'valor emblem', 'golden thread', 'bronze guild war trophy', 'silver guild war trophy', 'gold guild war trophy', 'clash of worlds trophy', 'elemental catalyst', 'primal catalyst'];
items.forEach(item => {
  let found = false;
  for (const [k, v] of Object.entries(dict)) {
    if ((k.startsWith('LIB_COIN_NAME_') || k.startsWith('LIB_CONSUMABLE_NAME_')) && typeof v === 'string' && v.toLowerCase() === item.toLowerCase()) {
      console.log(item, '->', k);
      found = true;
    }
  }
  if (!found) {
    for (const [k, v] of Object.entries(dict)) {
      if ((k.startsWith('LIB_COIN_NAME_') || k.startsWith('LIB_CONSUMABLE_NAME_')) && typeof v === 'string' && v.toLowerCase().includes(item.toLowerCase())) {
        console.log(item, '->', k, '(', v, ')');
        found = true;
      }
    }
  }
  if (!found) console.log(item, 'NOT FOUND');
});
