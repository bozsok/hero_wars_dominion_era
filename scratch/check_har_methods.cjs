const fs = require('fs');

try {
    const harData = JSON.parse(fs.readFileSync('d:/dev/hero wars/Source/feco.har', 'utf8'));
    
    let methods = {};
    let postUrls = [];
    
    if (harData.log && harData.log.entries) {
        for (const entry of harData.log.entries) {
            const method = entry.request.method;
            methods[method] = (methods[method] || 0) + 1;
            
            if (method === 'POST') {
                postUrls.push(entry.request.url);
            }
        }
    }
    
    console.log('HTTP Methods count:', methods);
    console.log('POST URLs count:', postUrls.length);
    if (postUrls.length > 0) {
        console.log('Some POST URLs:', postUrls.slice(0, 5).join('\n'));
    }
    
} catch (error) {
    console.error("Hiba történt:", error.message);
}
