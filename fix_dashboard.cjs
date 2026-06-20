const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// 1. Remove skinStoneChest
dash = dash.replace(/\s*<div className="game-resource-pill" title="Skin Stone Chest">[\s\S]*?<\/div>/g, '');

// 2. Remove tournamentCoin
dash = dash.replace(/\s*<div className="game-resource-pill" title="Tournament Coin">[\s\S]*?<\/div>/g, '');

// 3. Fix titanPotion -> playerProfile.consumables?.titanPotion
dash = dash.replace(/playerProfile\.coins\?\.titanPotion/g, 'playerProfile.consumables?.titanPotion');

// 4. Fix sparkOfPower -> playerProfile.consumables?.sparkOfPower
dash = dash.replace(/playerProfile\.coins\?\.sparkOfPower/g, 'playerProfile.consumables?.sparkOfPower');

// 5. Fix essenceOfTheElements -> playerProfile.consumables?.essenceOfTheElements
dash = dash.replace(/playerProfile\.coins\?\.essenceOfTheElements/g, 'playerProfile.consumables?.essenceOfTheElements');

// 6. Fix summoningSphere -> playerProfile.coins?.summoningSphere
dash = dash.replace(/playerProfile\.consumables\?\.summoningSphere/g, 'playerProfile.coins?.summoningSphere');

// 7. Fix elementalCatalyst -> playerProfile.coins?.elementalCatalyst
dash = dash.replace(/playerProfile\.consumables\?\.elementalCatalyst/g, 'playerProfile.coins?.elementalCatalyst');

// 8. Fix primalCatalyst -> playerProfile.coins?.primalCatalyst
dash = dash.replace(/playerProfile\.consumables\?\.primalCatalyst/g, 'playerProfile.coins?.primalCatalyst');

// 9. Remove all onError handlers
dash = dash.replace(/onError=\{\(e\) => \{ e\.target\.src = '\.\/ui\/coin_38\.webp'; \}\}/g, '');

fs.writeFileSync('src/components/Dashboard.jsx', dash, 'utf8');
console.log('Dashboard.jsx fixed!');
