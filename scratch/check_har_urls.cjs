const fs = require('fs');

try {
    const harData = JSON.parse(fs.readFileSync('d:/dev/hero wars/Source/feco.har', 'utf8'));
    
    let apiUrls = new Set();
    let sampleContent = null;
    let base64Count = 0;
    
    if (harData.log && harData.log.entries) {
        for (const entry of harData.log.entries) {
            if (entry.request && entry.request.url) {
                // Csak azokat, amik hős háborúkhoz, hero-wars-hoz, vagy api-hoz köthetők
                if (entry.request.url.includes('api') || entry.request.url.includes('hero') || entry.request.url.includes('nexters')) {
                    apiUrls.add(entry.request.url.substring(0, 80) + '...');
                    if (entry.response && entry.response.content) {
                        if (entry.response.content.encoding === 'base64') {
                            base64Count++;
                        }
                        if (!sampleContent && entry.response.content.text) {
                            sampleContent = entry.response.content.text.substring(0, 100);
                        }
                    }
                }
            }
        }
    }
    
    console.log('--- API URLs Found ---');
    console.log(Array.from(apiUrls).slice(0, 10).join('\n'));
    console.log('Total URLs matching api/hero/nexters:', apiUrls.size);
    console.log('Base64 encoded contents count:', base64Count);
    console.log('Sample content snippet:', sampleContent);
    
} catch (error) {
    console.error("Hiba történt:", error.message);
}
