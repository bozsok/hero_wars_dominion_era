const fs = require('fs');
const harText = fs.readFileSync('Source/HAR_1808.har', 'utf8');
const har = JSON.parse(harText);

const vals = {
  6391: 'int skin stone',
  308: 'str skin stone',
  754: 'agi skin stone',
  34950: 'outland coin',
  24998: 'emeralds',
  5719: 'arena coin',
  4126: 'grand arena coin',
  5821: 'tower coin',
  54515: 'soul coin',
  6282: 'friendship chip',
  235: 'summoning sphere',
  18725: 'artifact coin',
  30: 'titan soul coin',
  57670: 'elemental tournament coin',
  33885: 'titan skin stone',
  32: 'valor emblem',
  15: 'soul crystal',
  18070: 'golden thread',
  3533: 'bronze trophy',
  585: 'silver trophy',
  160: 'gold trophy',
  1043: 'clash of worlds trophy',
  55: 'elemental catalyst',
  211: 'primal catalyst',
  // 1: 'bottled energy', // 1 is too common to search for!
  50147: 'spark of power',
  31470: 'titan potion'
};

function searchObj(obj, path = '') {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => searchObj(v, path + '[' + i + ']'));
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(k => {
      searchObj(obj[k], path + '.' + k);
    });
  } else if (typeof obj === 'number' || typeof obj === 'string') {
    const num = Number(obj);
    if (vals[num]) {
      console.log(`Found ${vals[num]} (${num}) at path: ${path}`);
    }
  }
}

console.log('Searching HAR structure...');
har.log.entries.forEach((e, i) => {
  if (e.response && e.response.content && e.response.content.text) {
    try {
      const data = JSON.parse(e.response.content.text);
      searchObj(data, `entries[${i}].response.content`);
    } catch(err) {
      // Not JSON
    }
  }
});
console.log('Done searching!');
