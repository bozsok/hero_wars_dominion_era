const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// Reguláris kifejezés, ami megkeresi az összes game-resource-pill div-et
// és ha van benne egy img alt attribútummal, azt kiemeli a div title-jébe.
const regex = /(<div className="game-resource-pill([^"]*)")>(\s*<img[^>]+alt="([^"]+)")/g;

content = content.replace(regex, '$1 title="$4">$3');

fs.writeFileSync('src/components/Dashboard.jsx', content, 'utf8');
console.log('Sikeresen hozzáadva a title attribútum!');
