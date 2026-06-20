const fs = require('fs');

const harText = fs.readFileSync('Source/HAR_1808.har', 'utf8');

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
  1: 'bottled energy',
  50147: 'spark of power',
  31470: 'titan potion'
};

const regex = /"(?:coin|consumable)":\{[^\}]*\}/g;
const matches = harText.match(regex);

if (matches) {
  matches.forEach((m, idx) => {
    try {
      const data = JSON.parse('{' + m + '}');
      Object.keys(data).forEach(type => {
        Object.keys(data[type]).forEach(k => {
          const v = data[type][k];
          if (vals[v]) console.log(`[Block ${idx}]`, type, k, '->', v, '=>', vals[v]);
        });
      });
    } catch (e) {
      console.log('Error parsing block', idx);
    }
  });
} else {
  console.log('No matches');
}

// Check other keys like fragment, gear, etc. just in case
const regex2 = /"[a-zA-Z]+":\{[^\}]*\}/g;
const matches2 = harText.match(regex2);
if (matches2) {
    matches2.forEach((m, idx) => {
        try {
            const data = JSON.parse('{' + m + '}');
            Object.keys(data).forEach(type => {
                Object.keys(data[type]).forEach(k => {
                    const v = data[type][k];
                    if (vals[v]) console.log(`[Any Block]`, type, k, '->', v, '=>', vals[v]);
                });
            });
        } catch(e) {}
    });
}
