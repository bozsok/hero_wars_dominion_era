const fs = require('fs');
let text = fs.readFileSync('CHANGELOG.md', 'utf8');

const changedUpdates = `
- **Teljes CSS tisztítás:** Az összes beégetett (inline) \`style={{...}}\` tulajdonság eltávolításra került a projekt összes fájljából (\`Sidebar.jsx\`, \`Header.jsx\`, \`HeroModal.jsx\`, \`DataSyncModal.jsx\`, \`Dashboard.jsx\`). A formázások kizárólag dedikált, tiszta CSS osztályokba kerültek az \`index.css\`-ben.
- **Hős adatlap dizájn-szinkron:** Az Info panel CSS osztályokba lett kiszervezve, és az elválasztó vonal dizájnja szinkronba került a főképernyő fejlécének arany színátmenetes (\`linear-gradient\`) keretével.`;

text = text.replace(
  '### Megváltoztatva (Changed)',
  '### Megváltoztatva (Changed)' + changedUpdates
);

const removedUpdates = `
### Eltávolítva (Removed)
- **Ismertető alcím:** Az Info fülön lévő felesleges "Ismertető" címke (\`tab-section-title\`) véglegesen törlésre került a kódbázisból.
`;

text = text.replace(
  '## [0.3.8] - 2026-06-10',
  removedUpdates + '\n## [0.3.8] - 2026-06-10'
);

fs.writeFileSync('CHANGELOG.md', Buffer.from(text, 'utf8'));
