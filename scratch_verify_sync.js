import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('./src/data/gameDictionary.json', 'utf8'));
const heroSkins = dict.heroes["50"]?.skins || [];

console.log("=== Corvus skins in gameDictionary.json ===");
console.log(JSON.stringify(heroSkins, null, 2));
