const fs = require('fs');
const path = require('path');

const wikiDataPath = path.join(__dirname, '../data/wikiHeroesData.json');
const moduleDataPath = path.join(__dirname, '../data/Module_Hero_Data.txt');
const outputPath = path.join(__dirname, '../data/gameDictionary.json');

const parseLuaTable = (text) => {
    const getBlock = (name) => {
        const regex = new RegExp(`${name}\\s*=\\s*{[\\s\\S]*?hero_browser\\s*=\\s*({[\\s\\S]*?})`, 'i');
        const match = text.match(regex);
        if (!match) return null;
        return match[1];
    };

    const extractMaxValues = (blockStr) => {
        if (!blockStr) return {};
        const values = {};
        const lines = blockStr.split('\n');
        lines.forEach(line => {
            const m = line.match(/\[(\d+)\]\s*=\s*([\d.]+)/);
            if (m) {
                values[m[1]] = parseFloat(m[2]);
            }
        });
        return values;
    };

    const glyphBlock = getBlock('glyph');
    const glyphValues = extractMaxValues(glyphBlock);

    // Parse power array: hero_browser = {2.75, 2.75, ...}
    let powerFactors = {};
    const powerRegex = /power\s*=\s*{[\s\S]*?hero_browser\s*=\s*{([\d.,\s]+)/;
    const powerMatch = text.match(powerRegex);
    if (powerMatch) {
        const parts = powerMatch[1].split(',').map(s => parseFloat(s.trim()));
        powerFactors = {
            intelligence: parts[0] || 2.75,
            agility: parts[1] || 2.75,
            strength: parts[2] || 2.75,
            health: parts[3] || 0.05,
            physicalAttack: parts[4] || 0.75,
            magicAttack: parts[5] || 0.5,
            armor: parts[6] || 0.5,
            magicDefense: parts[7] || 0.5,
            dodge: parts[8] || 1.8,
            armorPenetration: parts[9] || 0.5,
            magicPenetration: parts[10] || 0.5,
            vampirism: parts[11] || 14.5,
            critHitChance: parts[12] || 1.8
        };
    }

    return {
        power: powerFactors,
        giftOfTheElements: 360,
        maxGlyphs: {
            intelligence: glyphValues["1"] || 1135,
            agility: glyphValues["2"] || 1135,
            strength: glyphValues["3"] || 1135,
            health: glyphValues["4"] || 62200,
            physicalAttack: glyphValues["5"] || 4340,
            magicAttack: glyphValues["6"] || 6500,
            armor: glyphValues["7"] || 6500,
            magicDefense: glyphValues["8"] || 6500,
            dodge: glyphValues["9"] || 1995,
            armorPenetration: glyphValues["10"] || 6500,
            magicPenetration: glyphValues["11"] || 6500,
            critHitChance: glyphValues["13"] || 1995
        },
        maxArtifactBook: {
            health: 83649,
            physicalAttack: 5577,
            magicAttack: 16731,
            armor: 12546,
            magicDefense: 12546,
            dodge: 4647,
            armorPenetration: 16731,
            magicPenetration: 16731,
            critHitChance: 4647
        },
        maxArtifactRing: {
            intelligence: 6249,
            agility: 6249,
            strength: 6249
        }
    };
};

const run = () => {
    const wikiData = JSON.parse(fs.readFileSync(wikiDataPath, 'utf8'));
    const moduleText = fs.readFileSync(moduleDataPath, 'utf8');
    const globalData = parseLuaTable(moduleText);

    const dictionary = {
        global: globalData,
        heroes: {}
    };

    for (const [id, data] of Object.entries(wikiData)) {
        dictionary.heroes[id] = {
            id: parseInt(id),
            mainStat: data.mainStat,
            base: data.base,
            growth: data.growth,
            skins: data.skins,
            artifactWeapon: data.artifactWeapon,
            ascension: data.ascension
        };
    }

    fs.writeFileSync(outputPath, JSON.stringify(dictionary, null, 2));
    console.log(`Successfully generated gameDictionary.json with ${Object.keys(dictionary.heroes).length} heroes.`);
};

run();
