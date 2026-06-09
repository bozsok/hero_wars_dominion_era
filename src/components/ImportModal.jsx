import React, { useState } from 'react';
import './ImportModal.css';

const RANKS = [
  'Ismeretlen', // 0 (nem használt)
  'White',      // 1
  'Green',      // 2
  'Green+1',    // 3
  'Blue',       // 4
  'Blue+1',     // 5
  'Blue+2',     // 6
  'Violet',     // 7
  'Violet+1',   // 8
  'Violet+2',   // 9
  'Violet+3',   // 10
  'Orange',     // 11
  'Orange+1',   // 12
  'Orange+2',   // 13
  'Orange+3',   // 14
  'Orange+4',   // 15
  'Red',        // 16
  'Red+1',      // 17
  'Red+2'       // 18
];

const ImportModal = ({ isOpen, onClose, onImport, heroes }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;


  const handleFileUpload = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const harData = JSON.parse(e.target.result);
        
        let heroData = null;
        if (harData.log && harData.log.entries) {
          for (const entry of harData.log.entries) {
            if (entry.response && entry.response.content && entry.response.content.text) {
              const text = entry.response.content.text;
              if (text.includes('"ident":"heroGetAll"') || text.includes('"ident": "heroGetAll"')) {
                const parsed = JSON.parse(text);
                if (parsed.results) {
                  const heroResult = parsed.results.find(r => r.ident === 'heroGetAll');
                  if (heroResult && heroResult.result && heroResult.result.response) {
                    heroData = heroResult.result.response;
                    break;
                  }
                }
              }
            }
          }
        }

        if (heroData) {
          const newHeroesObj = {};
          for (const [id, hero] of Object.entries(heroData)) {
            const color = hero.color || 1;
            const parsedHero = {
              general: {
                level: hero.level || 0,
                stars: hero.star || 1,
                soulStones: 0,
                power: hero.power || 0
              },
              items: {
                rank: RANKS[color] || 'White'
              },
              giftOfElements: hero.titanGiftLevel || 0,
              skills: [0, 0, 0, 0],
              glyphs: [0, 0, 0, 0, 0],
              skins: {},
              artifacts: {
                weapon: { level: 0, stars: 0 },
                book: { level: 0, stars: 0 },
                ring: { level: 0, stars: 0 }
              },
              ascension: {
                rank: 'I',
                branch: 0,
                nodes: []
              }
            };

            if (hero.skills) {
              const sVals = Object.values(hero.skills);
              for (let s = 0; s < Math.min(sVals.length, 4); s++) {
                parsedHero.skills[s] = parseInt(sVals[s], 10) || 0;
              }
            }

            if (hero.runes) {
              const rVals = Object.values(hero.runes);
              for (let g = 0; g < Math.min(rVals.length, 5); g++) {
                parsedHero.glyphs[g] = parseInt(rVals[g], 10) || 0;
              }
            }

            if (hero.skins) {
              for (const [skinId, skinLevel] of Object.entries(hero.skins)) {
                parsedHero.skins[skinId] = parseInt(skinLevel, 10) || 0;
              }
            }

            if (hero.artifacts) {
              if (hero.artifacts["1"]) {
                parsedHero.artifacts.weapon = { stars: hero.artifacts["1"].star || 0, level: hero.artifacts["1"].level || 0 };
              }
              if (hero.artifacts["2"]) {
                parsedHero.artifacts.book = { stars: hero.artifacts["2"].star || 0, level: hero.artifacts["2"].level || 0 };
              }
              if (hero.artifacts["3"]) {
                parsedHero.artifacts.ring = { stars: hero.artifacts["3"].star || 0, level: hero.artifacts["3"].level || 0 };
              }
            }

            if (hero.ascensions) {
              const ascArr = Object.values(hero.ascensions).map(x => parseInt(x, 10));
              parsedHero.ascension.nodes = ascArr;
              
              const nodeCount = ascArr.length;
              if (nodeCount >= 25) parsedHero.ascension.rank = 'V';
              else if (nodeCount >= 20) parsedHero.ascension.rank = 'IV';
              else if (nodeCount >= 15) parsedHero.ascension.rank = 'III';
              else if (nodeCount >= 10) parsedHero.ascension.rank = 'II';
              else parsedHero.ascension.rank = 'I';
              
              parsedHero.ascension.branch = nodeCount % 5;
            }

            newHeroesObj[id] = parsedHero;
          }

          onImport(newHeroesObj);
          setSuccessMessage("Sikeres importálás! Az ablak hamarosan bezárul...");
          setTimeout(() => {
            setSuccessMessage("");
            onClose();
          }, 1500);
        } else {
          setError("Nem találtam hős adatokat (heroGetAll) a HAR fájlban! Biztosan újratöltötted a játékot a mentés előtt?");
        }
      } catch (err) {
        console.error(err);
        setError("Hiba a HAR fájl beolvasásakor! Nem érvényes JSON formátum.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="import-modal-overlay">
      <div className="import-modal-content">
        <div className="import-modal-header">
          <h2>Adatok Importálása</h2>
          <button className="import-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="import-modal-body">
          {successMessage ? (
            <div style={{ backgroundColor: '#059669', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', fontSize: '1.2em' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}>check_circle</span>
              {successMessage}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Importálás HAR fájlból</h4>
                
                <div style={{ 
                  backgroundColor: '#334155', color: '#f8fafc',
                  padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85em', border: '1px solid #475569'
                }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: '#f59e0b' }}>Hogyan készíts HAR fájlt?</strong>
                  <ul style={{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <li>Nyisd meg a játékot (várd meg amíg betölt).</li>
                    <li>Nyomj <strong>F12</strong>-t a billentyűzeteden, és válaszd a <strong>Network (Hálózat)</strong> fület.</li>
                    <li>Nyomj egy <strong>F5</strong>-öt (Újratöltés), és várd meg amíg újra betölt a játék.</li>
                    <li>Kattints a hálózati sáv tetején (a 'No throttling' mellett) a kis lefelé mutató nyílra (<strong>Export HAR...</strong>).</li>
                  </ul>
                </div>
                
                <p style={{ margin: '0 0 15px 0', fontSize: '0.9em', color: '#94a3b8' }}>Válaszd ki a böngészőből lementett <code>hero-wars.com.har</code> fájlt az azonnali betöltéshez.</p>
                <input 
                  type="file" 
                  accept=".har" 
                  onChange={handleFileUpload}
                  style={{ color: '#fff', width: '100%' }}
                />
              </div>

              {error && <div className="import-error">{error}</div>}
            </>
          )}
        </div>
        
        <div className="import-modal-footer">
          <button className="import-cancel-btn" onClick={onClose}>Bezárás</button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
