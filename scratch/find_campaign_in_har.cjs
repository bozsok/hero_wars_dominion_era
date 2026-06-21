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
            if (r.ident.toLowerCase().includes('campaign') || r.ident.toLowerCase().includes('mission') || r.ident.toLowerCase().includes('user')) {
              // Keressünk valami relevánsat a Campaign haladásról
              if (resStr.includes('max') || resStr.includes('top') || resStr.includes('level') || resStr.includes('stage') || resStr.includes('mission')) {
                console.log(`Ident: ${r.ident}`);
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
