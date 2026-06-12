const fs = require('fs');
const https = require('https');
const path = require('path');

const heroesCatalogPath = path.join(__dirname, '../data/heroesCatalog.json');
const outputPath = path.join(__dirname, '../data/wikiHeroesData.json');

const fetchPage = (title) => {
    return new Promise((resolve, reject) => {
        const url = `https://hero-wars.fandom.com/api.php?action=query&prop=revisions&rvprop=content&titles=${encodeURIComponent(title)}&format=json`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId === '-1') {
                        resolve(null);
                    } else {
                        const content = pages[pageId].revisions[0]['*'];
                        if (content.startsWith('#REDIRECT')) {
                            const match = content.match(/\[\[(.*?)\]\]/);
                            if (match) resolve(fetchPage(match[1]));
                            else resolve(null);
                        } else {
                            resolve(content);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

const mapStatName = (name) => {
    const map = {
      'Health': 'health', 'Armor': 'armor', 'Magic defense': 'magicDefense', 
      'Physical attack': 'physicalAttack', 'Magic attack': 'magicAttack',
      'Dodge': 'dodge', 'Crit hit chance': 'critHitChance', 'Armor penetration': 'armorPenetration', 
      'Magic penetration': 'magicPenetration', 'Strength': 'strength', 'Agility': 'agility', 'Intelligence': 'intelligence'
    };
    return map[name] || name;
};

const parseWikitext = (text) => {
    const data = {
        base: {},
        growth: {},
        skins: [],
        artifactWeapon: null,
        ascension: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} }
    };
    
    let mainStat = 'strength';

    const lines = text.split('\n');
    
    // Helper to add ascension stats
    const addAscension = (rank, statName, value) => {
        const key = mapStatName(statName);
        if (!data.ascension[rank]) data.ascension[rank] = {};
        if (!data.ascension[rank][key]) data.ascension[rank][key] = 0;
        data.ascension[rank][key] += value;
    };

    let skinTemp = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('|browser_main_stat')) {
            const parts = line.split('=');
            if (parts.length >= 2) mainStat = parts[1].trim().toLowerCase();
        }
        else if (line.startsWith('|browser_base_')) {
            const m = line.match(/browser_base_([a-z_]+)\s*=\s*([\d.]+)/);
            if (m) {
                const statKey = m[1].replace('_', '').replace('physicalattack', 'physicalAttack').replace('magicattack', 'magicAttack').replace('magicdefense', 'magicDefense');
                data.base[statKey] = parseFloat(m[2]);
            }
        }
        else if (line.startsWith('|browser_star')) {
            const m = line.match(/browser_star(\d)_([a-z]+)\s*=\s*([\d.]+)/);
            if (m) {
                const star = m[1];
                const statKey = m[2];
                if (!data.growth[star]) data.growth[star] = {};
                data.growth[star][statKey] = parseFloat(m[3]);
            }
        }
        else if (line.startsWith('|browser_artifact_weapon_attribute')) {
            const val = line.split('=')[1].trim();
            if (!data.artifactWeapon) data.artifactWeapon = {};
            data.artifactWeapon.attribute = mapStatName(val);
        }
        else if (line.startsWith('|browser_artifact_weapon_value')) {
            const val = parseFloat(line.split('=')[1].trim());
            if (!data.artifactWeapon) data.artifactWeapon = {};
            data.artifactWeapon.value = val;
        }
        else if (line.match(/\|browser_skin(\d+)_(name|attribute|value)/)) {
            const m = line.match(/\|browser_skin(\d+)_(name|attribute|value)\s*=\s*(.+)/);
            if (m) {
                const idx = m[1];
                const prop = m[2];
                const val = m[3].trim();
                if (!skinTemp[idx]) skinTemp[idx] = {};
                
                if (prop === 'name') skinTemp[idx].name = val;
                else if (prop === 'attribute') skinTemp[idx].attribute = mapStatName(val);
                else if (prop === 'value') skinTemp[idx].value = parseFloat(val);
            }
        }
        else if (line.match(/\|browser_ascension_(\d+)_(\d+)_data/)) {
            const m = line.match(/\|browser_ascension_(\d+)_(\d+)_data\s*=\s*([^,]+),\s*([\d.]+)/);
            if (m) {
                const rank = parseInt(m[1]);
                const statName = m[3].trim();
                const value = parseFloat(m[4]);
                addAscension(rank, statName, value);
            }
        }
    });

    data.mainStat = mainStat;
    data.skins = Object.values(skinTemp).filter(s => s.name && s.attribute && s.value);

    // Make ascension cumulative!
    const cumulativeAscension = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    const allStatKeys = ['health', 'armor', 'magicDefense', 'physicalAttack', 'magicAttack', 'dodge', 'critHitChance', 'armorPenetration', 'magicPenetration', 'strength', 'agility', 'intelligence'];
    
    let runningTotals = {};
    for (let rank = 1; rank <= 5; rank++) {
        for (const [k, v] of Object.entries(data.ascension[rank] || {})) {
            runningTotals[k] = (runningTotals[k] || 0) + v;
        }
        cumulativeAscension[rank] = { ...runningTotals };
    }
    data.ascension = cumulativeAscension;

    return data;
};

const run = async () => {
    console.log("Starting full scrape...");
    const catalog = JSON.parse(fs.readFileSync(heroesCatalogPath, 'utf8'));
    const results = {};

    for (const hero of catalog) {
        console.log(`Fetching ${hero.name}...`);
        try {
            let text = await fetchPage(`Heroes/${hero.name}`);
            if (!text) text = await fetchPage(hero.name);
            if (text) {
                results[hero.id] = parseWikitext(text);
                console.log(`Success: ${hero.name}`);
            } else {
                console.log(`Failed: ${hero.name}`);
            }
        } catch (e) {
            console.error(`Error: ${hero.name}`, e);
        }
        await new Promise(r => setTimeout(r, 400));
    }

    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Saved results to ${outputPath}`);
};

run();
