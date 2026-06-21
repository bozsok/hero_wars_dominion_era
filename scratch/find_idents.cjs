const fs = require('fs');
const path = require('path');

const harPath = 'Source/HAR_1808.har';
if (!fs.existsSync(harPath)) {
  console.log(`Fájl nem található: ${harPath}`);
  process.exit(1);
}

console.log(`Beolvasás: ${harPath}...`);
const harText = fs.readFileSync(harPath, 'utf8');
const har = JSON.parse(harText);

const idents = new Set();
const identDataSamples = {};

har.log.entries.forEach(e => {
  if (e.response && e.response.content && e.response.content.text) {
    try {
      const data = JSON.parse(e.response.content.text);
      if (data.results) {
        data.results.forEach(r => {
          if (r.ident) {
            idents.add(r.ident);
            if (r.result && r.result.response) {
              // Mentsünk el egy mintát az első 200 karakterből
              identDataSamples[r.ident] = JSON.stringify(r.result.response).substring(0, 300);
            }
          }
        });
      }
    } catch(err) {
      // Nem JSON
    }
  }
});

console.log('Talált ident-ek a HAR fájlban:');
const sortedIdents = Array.from(idents).sort();
console.log(sortedIdents.join(', '));
