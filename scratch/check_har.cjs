const fs = require('fs');

try {
    console.log("Olvasás indítása...");
    const harData = JSON.parse(fs.readFileSync('d:/dev/hero wars/Source/feco.har', 'utf8'));
    console.log("Fájl beolvasva és parse-olva. Keresés...");
    
    let hasHeroGetAll = false;
    let allIdents = new Set();
    
    if (harData.log && harData.log.entries) {
        for (const entry of harData.log.entries) {
            if (entry.response && entry.response.content && entry.response.content.text) {
                const text = entry.response.content.text;
                if (text.includes('"ident"')) {
                    try {
                        const parsed = JSON.parse(text);
                        if (parsed.results && Array.isArray(parsed.results)) {
                            for (const r of parsed.results) {
                                if (r.ident) {
                                    allIdents.add(r.ident);
                                    if (r.ident === 'heroGetAll') {
                                        hasHeroGetAll = true;
                                    }
                                }
                            }
                        }
                    } catch(e) {
                        // Nem JSON vagy rossz formátum
                    }
                }
            }
        }
    }
    
    console.log('Szerepel a heroGetAll hívás a fájlban?', hasHeroGetAll ? 'IGEN' : 'NEM');
    console.log('Az alábbi API hívások (ident) lettek megtalálva (összesen ' + allIdents.size + ' darab):');
    console.log(Array.from(allIdents).join(', '));
    
} catch (error) {
    console.error("Hiba történt:", error.message);
}
