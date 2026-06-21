const fs = require('fs');
const path = require('path');

const harPath = 'Source/HAR_1808.har';
if (!fs.existsSync(harPath)) {
  console.log(`Fájl nem található: ${harPath}`);
  process.exit(1);
}

const harText = fs.readFileSync(harPath, 'utf8');
const har = JSON.parse(harText);

har.log.entries.forEach((e, idx) => {
  if (e.response && e.response.content && e.response.content.text) {
    const text = e.response.content.text;
    if (text.includes('"ident":')) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.results) {
          parsed.results.forEach(r => {
            const resStr = JSON.stringify(r.result);
            // Keresünk aréna, grand aréna helyezésre utaló kulcsokat
            if (r.ident.toLowerCase().includes('arena') || r.ident.toLowerCase().includes('team') || r.ident.toLowerCase().includes('user') || r.ident.toLowerCase().includes('mission')) {
              // Ha a válaszban van pl. "place", "rank", "arena", "rating"
              if (resStr.includes('place') || resStr.includes('Place') || resStr.includes('rank') || resStr.includes('Rank') || resStr.includes('rating') || resStr.includes('Rating')) {
                console.log(`Ident: ${r.ident}`);
                console.log(`- Kulcsok: ${Object.keys(r.result?.response || {}).join(', ')}`);
                // Ha van response.user vagy response.info vagy valami
                if (r.result?.response) {
                  const resp = r.result.response;
                  console.log(`- Response részlet: ${JSON.stringify(resp).substring(0, 500)}`);
                }
                console.log('--------------------------------------------------');
              }
            }
          });
        }
      } catch(err) {
        // Not JSON
      }
    }
  }
});
