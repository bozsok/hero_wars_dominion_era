import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('./src/data/gameDictionary.json', 'utf8'));

for (const id of ["7", "13", "50", "55"]) {
  console.log(`=== Hero ${id} skins ===`);
  console.log(JSON.stringify(dict.heroes[id]?.skins || [], null, 2));
}
