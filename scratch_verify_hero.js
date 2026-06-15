import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('./src/data/gameDictionary.json', 'utf8'));
const hero = dict.heroes["50"];

console.log("=== Corvus in gameDictionary.json ===");
console.log(JSON.stringify(hero, null, 2));
