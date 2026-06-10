const fs = require('fs');
let code = fs.readFileSync('src/components/DataSyncModal.jsx', 'utf8');

code = code.replace(/style=\{\{ padding: '20px', borderRadius: '8px', textAlign: 'center' \}\}/g, 'className="sync-success-container"');
code = code.replace(/style=\{\{ backgroundColor: '#059669', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', fontSize: '1\.2em' \}\}/g, 'className="sync-success-message"');
code = code.replace(/style=\{\{ fontSize: '2em', display: 'block', marginBottom: '10px' \}\}/g, 'className="sync-success-icon"');
code = code.replace(/style=\{\{ color: '#cbd5e1', marginBottom: '20px' \}\}/g, 'className="sync-success-prompt"');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', gap: '10px' \}\}/g, 'className="sync-success-actions"');
code = code.replace(/style=\{\{ width: '100%', padding: '12px' \}\}/g, 'className="sync-action-btn"');
code = code.replace(/style=\{\{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' \}\}/g, 'className="sync-import-box"');
code = code.replace(/style=\{\{ margin: '0 0 15px 0', color: '#10b981' \}\}/g, 'className="sync-import-title"');
code = code.replace(/style=\{\{ display: 'block', marginBottom: '8px', color: '#f59e0b' \}\}/g, 'className="sync-instruction-title"');
code = code.replace(/style=\{\{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' \}\}/g, 'className="sync-instruction-list"');
code = code.replace(/style=\{\{ margin: '0 0 15px 0', fontSize: '0\.9em', color: '#94a3b8' \}\}/g, 'className="sync-import-desc"');
code = code.replace(/style=\{\{ color: '#fff', width: '100%' \}\}/g, 'className="sync-file-input"');
code = code.replace(/style=\{\{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #334155', textAlign: 'center' \}\}/g, 'className="sync-export-box"');
code = code.replace(/style=\{\{ margin: '0 0 10px 0', fontSize: '0\.9em', color: '#94a3b8' \}\}/g, 'className="sync-export-desc"');
code = code.replace(/style=\{\{ padding: '10px 20px', fontSize: '0\.9em' \}\}/g, 'className="sync-export-btn"');

code = code.replace(/style=\{\{\s+marginBottom: '20px',\s+fontSize: '0\.9em',\s+color: '#cbd5e1',\s+backgroundColor: '#0f172a',\s+padding: '10px',\s+borderRadius: '5px',\s+borderLeft: '4px solid #f59e0b'\s+\}\}/g, 'className="sync-instruction-box"');

fs.writeFileSync('src/components/DataSyncModal.jsx', code, 'utf8');
