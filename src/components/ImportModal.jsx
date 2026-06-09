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
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleProcess = () => {
    setError(null);
    if (!csvData.trim()) {
      setError('Kérlek illeszd be a CSV adatokat!');
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      // Skip header if it exists
      const startIndex = lines[0].toLowerCase().includes('id,xp') ? 1 : 0;
      
      const newHeroesObj = {};

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        
        // Ez egy egyszerű CSV parser, ami figyelembe veszi az idézőjeleket
        // Mivel a CSV lehet pl: 1,116717,56,7,"56,56,56,56",14324,4,"110,0,0,0,0","1-10",0,"2-17,2-9,3-15","hero","4,1","0,1,2"
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        
        if (!matches || matches.length < 13) continue;

        // Eltávolítjuk az idézőjeleket a cellákról
        const parts = matches.map(m => m.replace(/^"|"$/g, '').trim());
        
        const id = parts[0];
        const level = parseInt(parts[2], 10) || 0;
        const color = parseInt(parts[3], 10) || 1;
        const skillsRaw = parts[4];
        const power = parseInt(parts[5], 10) || 0;
        const star = parseInt(parts[6], 10) || 1;
        const runesRaw = parts[7] || "";
        const skinsRaw = parts[8] || "";
        const titanGiftLevel = parseInt(parts[9], 10) || 0;
        const artifactsRaw = parts[10] || "";
        const ascensionsRaw = parts[13] || "";

        // Alapértelmezett hős struktúra az importáláshoz
        // Figyelem: A stats nem jön a CSV-ből, az megmarad az eredetiben vagy 0 lesz.
        const parsedHero = {
          general: {
            level: level,
            stars: star,
            soulStones: 0,
            power: power
          },
          items: {
            rank: RANKS[color] || 'White'
          },
          giftOfElements: titanGiftLevel,
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
            nodes: [] // Eltároljuk az eredeti raw node listát
          }
        };

        // Skills (pl: "56,56,56,56" vagy "56")
        if (skillsRaw) {
           const sArr = skillsRaw.split(',').map(s => parseInt(s, 10) || 0);
           for (let s = 0; s < Math.min(sArr.length, 4); s++) {
             parsedHero.skills[s] = sArr[s];
           }
        }

        // Runes (Glyphs) (pl: "110,0,0,0,0") - ezeket most nyers XP-ként tároljuk!
        if (runesRaw) {
          const gArr = runesRaw.split(',').map(g => parseInt(g, 10) || 0);
          for (let g = 0; g < Math.min(gArr.length, 5); g++) {
             parsedHero.glyphs[g] = gArr[g];
          }
        }

        // Skins (pl: "2-27, 3-60")
        if (skinsRaw) {
          const sArr = skinsRaw.split(',');
          sArr.forEach(skinStr => {
             const [skinId, skinLevel] = skinStr.split('-');
             if (skinId && skinLevel) {
               parsedHero.skins[skinId.trim()] = parseInt(skinLevel, 10) || 0;
             }
          });
        }

        // Artifacts (pl: "4-66,4-66,4-57")
        if (artifactsRaw) {
          const aArr = artifactsRaw.split(',');
          if (aArr[0]) {
             const [ast, alv] = aArr[0].split('-');
             parsedHero.artifacts.weapon = { stars: parseInt(ast,10)||0, level: parseInt(alv,10)||0 };
          }
          if (aArr[1]) {
             const [ast, alv] = aArr[1].split('-');
             parsedHero.artifacts.book = { stars: parseInt(ast,10)||0, level: parseInt(alv,10)||0 };
          }
          if (aArr[2]) {
             const [ast, alv] = aArr[2].split('-');
             parsedHero.artifacts.ring = { stars: parseInt(ast,10)||0, level: parseInt(alv,10)||0 };
          }
        }

        // Ascensions (pl: "0,1,2,3,4,5")
        if (ascensionsRaw) {
           const ascArr = ascensionsRaw.split(',').filter(x => x.trim() !== '').map(x => parseInt(x, 10));
           parsedHero.ascension.nodes = ascArr;
           
           // Megpróbáljuk megbecsülni a Rankot és Branch-et a node-ok hossza alapján
           // Ez csak vizuális célokra van, amíg nincs meg a pontos mapping
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
      onClose();
    } catch (err) {
      console.error(err);
      setError('Hiba történt a feldolgozás során! Ellenőrizd a formátumot.');
    }
  };

  return (
    <div className="import-modal-overlay">
      <div className="import-modal-content">
        <div className="import-modal-header">
          <h2>Adatok Importálása (CSV)</h2>
          <button className="import-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="import-modal-body">
          <p>Illeszd be ide a játékból kinyert szöveges/CSV adatokat! Az importálás felülírja a jelenlegi adataidat (a beillesztett hősöknél).</p>
          <textarea 
            className="import-textarea"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="id,xp,level,color,skills,power,star,runes,skins,titanGiftLevel,artifacts,type,perks,ascensions..."
          />
          {error && <div className="import-error">{error}</div>}
        </div>
        
        <div className="import-modal-footer">
          <button className="import-cancel-btn" onClick={onClose}>Mégsem</button>
          <button className="import-process-btn gold-gradient-btn" onClick={handleProcess}>Feldolgozás</button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
