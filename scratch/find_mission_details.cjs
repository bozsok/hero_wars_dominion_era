const fs = require('fs');
const harPath = 'Source/HAR_1808.har';
if (!fs.existsSync(harPath)) {
  console.log(`Fájl nem található: ${harPath}`);
  process.exit(1);
}

const harText = fs.readFileSync(harPath, 'utf8');
const har = JSON.parse(harText);

har.log.entries.forEach((e) => {
  if (e.response && e.response.content && e.response.content.text) {
    try {
      const data = JSON.parse(e.response.content.text);
      if (data.results) {
        data.results.forEach(r => {
          if (r.ident === 'missionGetAll' || r.ident === 'campaignStoryGetList') {
            console.log(`Ident: ${r.ident}`);
            if (r.result && r.result.response) {
              const resp = r.result.response;
              console.log(`- Kulcsok: ${Object.keys(resp).join(', ')}`);
              console.log(`- Response részlet: ${JSON.stringify(resp).substring(0, 800)}`);
              console.log('==================================================');
            }
          }
        });
      }
    } catch(err) {}
  }
});
