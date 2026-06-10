const fs = require('fs');
let code = fs.readFileSync('src/components/HeroModal.jsx', 'utf8');

code = code.replace(/<div className="modal-stat-column" style=\{\{ maxWidth: '50%' \}\}>/g, '<div className="modal-stat-column modal-stat-column-half">');
code = code.replace(/<div style=\{\{ display: 'flex', gap: '8px' \}\}>/g, '<div className="artifact-input-row">');
code = code.replace(/<div style=\{\{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' \}\}>/g, '<div className="glyph-row-header">');
code = code.replace(/style=\{\{ width: '60%', padding: '2px', fontSize: '12px' \}\}/g, 'className="glyph-select"');
code = code.replace(/<label style=\{\{ margin: 0, alignSelf: 'center' \}\}>/g, '<label className="glyph-label-center">');

const prosConsTarget = `<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="modal-stat-column">
            <h4 style={{ color: '#4caf50', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              <span className="material-symbols-outlined">check_circle</span> Erősségek
            </h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {(desc.strengths || []).map((s, idx) => (
                <li key={idx} style={{ color: '#ccc', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                  <span style={{ color: '#4caf50', marginTop: '2px' }}>✅</span> <span>{s}</span>
                </li>
              ))}
              {(!desc.strengths || desc.strengths.length === 0) && <li style={{ color: '#777' }}>Nincs adat</li>}
            </ul>
          </div>

          <div className="modal-stat-column">
            <h4 style={{ color: '#f44336', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              <span className="material-symbols-outlined">cancel</span> Gyengeségek
            </h4>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {(desc.weaknesses || []).map((w, idx) => (
                <li key={idx} style={{ color: '#ccc', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                  <span style={{ color: '#f44336', marginTop: '2px' }}>❌</span> <span>{w}</span>
                </li>
              ))}
              {(!desc.weaknesses || desc.weaknesses.length === 0) && <li style={{ color: '#777' }}>Nincs adat</li>}
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', borderTop: '1px solid #3a3f58', paddingTop: '20px' }}>
          <div style={{ backgroundColor: '#1e2130', padding: '10px 15px', borderRadius: '5px', border: '1px solid #3a3f58' }}>
            <strong style={{ color: '#fece86', display: 'block', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase' }}>Fő Statisztika</strong>
            <span style={{ color: '#ccc', fontSize: '16px' }}>{hero.mainStat || 'Ismeretlen'}</span>
          </div>
          <div style={{ backgroundColor: '#1e2130', padding: '10px 15px', borderRadius: '5px', border: '1px solid #3a3f58' }}>
            <strong style={{ color: '#fece86', display: 'block', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase' }}>Szerepkörök</strong>
            <span style={{ color: '#ccc', fontSize: '16px' }}>{(hero.roles || []).join(', ') || 'Ismeretlen'}</span>
          </div>
        </div>`;

const prosConsReplacement = `<div className="modal-hero-pros-cons">
          <div className="modal-stat-column">
            <h4 className="pros-title">
              <span className="material-symbols-outlined">check_circle</span> Erősségek
            </h4>
            <ul className="pros-cons-list">
              {(desc.strengths || []).map((s, idx) => (
                <li key={idx} className="pros-cons-item">
                  <span className="pros-icon">✅</span> <span>{s}</span>
                </li>
              ))}
              {(!desc.strengths || desc.strengths.length === 0) && <li className="pros-cons-empty">Nincs adat</li>}
            </ul>
          </div>

          <div className="modal-stat-column">
            <h4 className="cons-title">
              <span className="material-symbols-outlined">cancel</span> Gyengeségek
            </h4>
            <ul className="pros-cons-list">
              {(desc.weaknesses || []).map((w, idx) => (
                <li key={idx} className="pros-cons-item">
                  <span className="cons-icon">❌</span> <span>{w}</span>
                </li>
              ))}
              {(!desc.weaknesses || desc.weaknesses.length === 0) && <li className="pros-cons-empty">Nincs adat</li>}
            </ul>
          </div>
        </div>
        
        <div className="modal-hero-bottom-stats">
          <div className="bottom-stat-box">
            <strong className="bottom-stat-title">Fő Statisztika</strong>
            <span className="bottom-stat-value">{hero.mainStat || 'Ismeretlen'}</span>
          </div>
          <div className="bottom-stat-box">
            <strong className="bottom-stat-title">Szerepkörök</strong>
            <span className="bottom-stat-value">{(hero.roles || []).join(', ') || 'Ismeretlen'}</span>
          </div>
        </div>`;

code = code.replace(prosConsTarget, prosConsReplacement);

fs.writeFileSync('src/components/HeroModal.jsx', code, 'utf8');
