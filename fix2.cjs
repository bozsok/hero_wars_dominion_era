const fs = require('fs');

const newEntry = `## [0.4.0] - 2026-06-11

### Hozzáadva (Added)
- **Modális navigáció (Zászlók):** Az eredeti játékfelülethez igazodó, nyílvégű zászlós navigációs panel a bal oldalon, a kereten kívül (\`arrow.png\` és \`arrow_green.png\` felhasználásával).
- **Zászlók rétegzése:** A kiválasztott, zöld színű zászló a keret fölé lóg, míg a passzív barna zászlók éle rejtve marad az aranykeret alatt.
- **Angol zászlófeliratok:** A zászlók szövege az eredeti játék alapján került meghatározásra (Info, Stats, Skills, Skins, Artifacts, Gift of the Elements, Glyphs, Ascension).

### Megváltoztatva (Changed)
- **Karakter információk mozgatása:** A hős képe, azonosítója (ID), neve és frakciója lekerült a bal oldali sávból, és most már a belső "Info" (Leírás és értékelés) fül szerves részét képezi.
- **CSS architektúra optimalizálása:** Számos beégetett (inline) CSS tulajdonság (\`HeroModal.jsx\`-ből) átszervezésre került különálló, dedikált osztályokba (pl. \`.modal-save-container\`, \`.btn-save\` finomhangolása).
- **Címszalag javítása:** A \`.modal-title-banner\` esetében a kerekítési hibát okozó \`transform\` és \`left: 50%\` alapú középre igazítás lecserélődött \`margin: 0 auto\` pozicionálásra a képi folytonossági hiba megszüntetése érdekében.

`;

let content = fs.readFileSync('CHANGELOG.md', 'utf8');
content = content.replace('## [0.3.8] - 2026-06-10', newEntry + '## [0.3.8] - 2026-06-10');
fs.writeFileSync('CHANGELOG.md', content, 'utf8');
