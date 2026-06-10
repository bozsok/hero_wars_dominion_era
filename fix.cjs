const fs = require('fs');
let content = fs.readFileSync('CHANGELOG.md', 'utf8');

// The file currently has double-encoded UTF-8 because PowerShell read it as ANSI and saved as UTF-8.
let b = Buffer.from(content, 'binary');
content = b.toString('utf8');

// Fix the backticks that were swallowed
content = content.replace(' rrow.png', '`arrow.png`');
content = content.replace(' rrow_green.png', '`arrow_green.png`');
content = content.replace('(HeroModal.jsx-ből)', '(`HeroModal.jsx`-ből)');
content = content.replace(/\.modal-save-container/g, '`.modal-save-container`');
content = content.replace(/\.btn-save/g, '`.btn-save`');
content = content.replace(/\.modal-title-banner /g, '`.modal-title-banner` ');
content = content.replace(/\transform /g, '`transform` ');
content = content.replace(/left: 50%/g, '`left: 50%`');
content = content.replace(/margin: 0 auto /g, '`margin: 0 auto` ');

fs.writeFileSync('CHANGELOG.md', content, 'utf8');
