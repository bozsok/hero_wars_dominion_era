const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

code = code.replace(/style=\{\{ padding: '0', overflow: 'hidden' \}\}/g, 'className="dashboard-action-bar-inner"');
code = code.replace(/style=\{\{ paddingLeft: 'var\(--md\)' \}\}/g, 'className="dashboard-filter-group"');
code = code.replace(/style=\{\{ background: '#1a1009' \}\}/g, 'className="dashboard-select-option"');
code = code.replace(/style=\{\{ width: '18px', height: '18px', marginRight: '4px', display: 'block' \}\}/g, 'className="dashboard-stat-icon"');
code = code.replace(/style=\{\{ position: 'relative', top: '2px' \}\}/g, 'className="dashboard-stat-value-inner"');

fs.writeFileSync('src/components/Dashboard.jsx', code, 'utf8');
