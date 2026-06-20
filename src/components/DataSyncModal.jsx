import React, { useState, useContext } from 'react';
import { HeroContext } from '../context/HeroContext';
import './ImportModal.css';
import { calculateHeroStats } from '../utils/statCalculator.js';
import heroesCatalog from '../data/heroesCatalog.json';
import skinMapping from '../data/skinMapping.json';

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

const DataSyncModal = ({ isOpen, onClose, onImport, heroes }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { exportData } = useContext(HeroContext);

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
        let roleAscensionData = null;
        let userData = null;
        let inventoryData = null;
        let teamData = null;
        let clanData = null;
        
        if (harData.log && harData.log.entries) {
          for (const entry of harData.log.entries) {
            if (entry.response && entry.response.content && entry.response.content.text) {
              const text = entry.response.content.text;
              if (text.includes('"ident":')) {
                try {
                  const parsed = JSON.parse(text);
                  if (parsed.results) {
                    const heroResult = parsed.results.find(r => r.ident === 'heroGetAll');
                    if (heroResult && heroResult.result && heroResult.result.response) {
                      heroData = heroResult.result.response;
                    }
                    const roleAscensionResult = parsed.results.find(r => r.ident === 'roleAscension_getAll');
                    if (roleAscensionResult && roleAscensionResult.result && roleAscensionResult.result.response) {
                      roleAscensionData = roleAscensionResult.result.response;
                    }
                    const userResult = parsed.results.find(r => r.ident === 'userGetInfo');
                    if (userResult && userResult.result && userResult.result.response) {
                      userData = userResult.result.response;
                    }
                    const inventoryResult = parsed.results.find(r => r.ident === 'inventoryGet');
                    if (inventoryResult && inventoryResult.result && inventoryResult.result.response) {
                      inventoryData = inventoryResult.result.response;
                    }
                    const teamResult = parsed.results.find(r => r.ident === 'teamGetAll');
                    if (teamResult && teamResult.result && teamResult.result.response) {
                      teamData = teamResult.result.response;
                    }
                    const clanResult = parsed.results.find(r => r.ident === 'clanGetInfo');
                    if (clanResult && clanResult.result && clanResult.result.response) {
                      clanData = clanResult.result.response;
                    }
                  }
                } catch (e) {
                  // JSON parse error
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
                const rawVal = parseInt(sVals[s], 10) || 0;
                let val = rawVal;
                if (s === 2) val = Math.max(0, rawVal - 20);      // Blue szint korrekció (-20)
                else if (s === 3) val = Math.max(0, rawVal - 40); // Violet szint korrekció (-40)
                parsedHero.skills[s] = val;
              }
            }

            if (hero.runes) {
              const rVals = Object.values(hero.runes);
              for (let g = 0; g < Math.min(rVals.length, 5); g++) {
                parsedHero.glyphs[g] = parseInt(rVals[g], 10) || 0;
              }
            }

            if (hero.skins) {
              // A default skin ID a legkisebb skin ID a feloldottak közül
              const skinIds = Object.keys(hero.skins).map(k => parseInt(k, 10)).sort((a, b) => a - b);
              const defaultSkinId = skinIds.length > 0 ? skinIds[0].toString() : null;

              for (const [skinId, skinLevel] of Object.entries(hero.skins)) {
                const levelVal = parseInt(skinLevel, 10) || 0;
                if (skinId === defaultSkinId) {
                  parsedHero.skins['default'] = levelVal;
                } else {
                  const mapped = skinMapping[skinId];
                  if (mapped && mapped.name) {
                    parsedHero.skins[mapped.name] = levelVal;
                  } else {
                    parsedHero.skins[skinId] = levelVal;
                  }
                }
              }
            }

            // GoE szint mentése (az items.goe kulcsba, amit a statCalculator vár)
            parsedHero.items = parsedHero.items || {};
            parsedHero.items.goe = hero.titanGiftLevel || 0;

            if (hero.artifacts) {
              if (hero.artifacts[0]) {
                parsedHero.artifacts.weapon = { stars: hero.artifacts[0].star || 0, level: hero.artifacts[0].level || 0 };
              }
              if (hero.artifacts[1]) {
                parsedHero.artifacts.book = { stars: hero.artifacts[1].star || 0, level: hero.artifacts[1].level || 0 };
              }
              if (hero.artifacts[2]) {
                parsedHero.artifacts.ring = { stars: hero.artifacts[2].star || 0, level: hero.artifacts[2].level || 0 };
              }
            }

            if (hero.ascensions && typeof hero.ascensions === 'object') {
              const rankKeys = Object.keys(hero.ascensions).map(k => parseInt(k, 10));
              if (rankKeys.length > 0) {
                const maxRank = Math.max(...rankKeys);
                const rankMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
                parsedHero.ascension.rank = rankMap[maxRank] || '0';
                parsedHero.ascension.nodes = hero.ascensions[maxRank] || [];
              } else {
                parsedHero.ascension.rank = '0';
                parsedHero.ascension.nodes = [];
              }
            }

            // Szerepkör fa (Bölcsesség Fája) automatikus importálása
            const roleIdMap = {
              'mage': '1',
              'tank': '2',
              'marksman': '3',
              'healer': '4',
              'support': '5',
              'warrior': '6',
              'control': '7'
            };
            const catalogHero = heroesCatalog.find(h => h.id === id || h.id == id);
            const primaryRole = catalogHero?.roles?.[0];
            let branchLevel = 0;
            if (primaryRole && roleAscensionData) {
              const roleKey = primaryRole.toLowerCase();
              const roleId = roleIdMap[roleKey];
              if (roleId && roleAscensionData[roleId]) {
                branchLevel = parseInt(roleAscensionData[roleId].level, 10) || 0;
              }
            }
            parsedHero.ascension.branch = branchLevel;

            newHeroesObj[id] = parsedHero;
          }

          // Játékos profil adatainak kigyűjtése
          let profile = null;
          if (userData) {
            const vipPoints = parseInt(userData.vipPoints, 10) || 0;
            let vipLevel = 0;
            const vipThresholds = [
              { lvl: 15, pts: 150000 },
              { lvl: 14, pts: 80000 },
              { lvl: 13, pts: 40000 },
              { lvl: 12, pts: 20000 },
              { lvl: 11, pts: 15000 },
              { lvl: 10, pts: 10000 },
              { lvl: 9, pts: 7000 },
              { lvl: 8, pts: 5000 },
              { lvl: 7, pts: 3000 },
              { lvl: 6, pts: 2000 },
              { lvl: 5, pts: 1000 },
              { lvl: 4, pts: 500 },
              { lvl: 3, pts: 300 },
              { lvl: 2, pts: 100 },
              { lvl: 1, pts: 10 }
            ];
            for (const t of vipThresholds) {
              if (vipPoints >= t.pts) {
                vipLevel = t.lvl;
                break;
              }
            }

            const staminaRefill = userData.refillable?.find(r => r.id === 1);
            const currentStamina = staminaRefill ? staminaRefill.amount : 0;

            profile = {
              name: userData.name || 'Ismeretlen',
              level: parseInt(userData.level, 10) || 1,
              gold: parseInt(userData.gold, 10) || 0,
              emeralds: parseInt(userData.starMoney, 10) || 0,
              vipPoints,
              vipLevel,
              stamina: currentStamina,
              league: (clanData && clanData.clan) ? clanData.clan.league : null,
              avatarId: userData.avatarId || null,
              coins: {
                arena: inventoryData?.coin?.['1'] || 0,
                grandArena: inventoryData?.coin?.['2'] || 0,
                tower: inventoryData?.coin?.['3'] || 0,
                outland: inventoryData?.coin?.['4'] || 0,
                soulCoin: inventoryData?.coin?.['5'] || 0,
                friendshipChip: inventoryData?.coin?.['6'] || 0,
                skinStoneInt: inventoryData?.coin?.['8'] || 0,
                skinStoneStr: inventoryData?.coin?.['9'] || 0,
                skinStoneAgi: inventoryData?.coin?.['10'] || 0,
                summoningSphere: inventoryData?.coin?.['13'] || 0,
                artifactCoin: inventoryData?.coin?.['14'] || 0,
                titanSoulCoin: inventoryData?.coin?.['15'] || 0,
                elementalTournamentCoin: inventoryData?.coin?.['18'] || 0,
                titanSkinStone: inventoryData?.coin?.['24'] || 0,
                valorEmblem: inventoryData?.coin?.['30'] || 0,
                soulCrystal: inventoryData?.coin?.['38'] || 0,
                goldenThread: inventoryData?.coin?.['45'] || 0,
                bronzeTrophy: inventoryData?.coin?.['101'] || 0,
                silverTrophy: inventoryData?.coin?.['102'] || 0,
                goldTrophy: inventoryData?.coin?.['103'] || 0,
                clashOfWorldsTrophy: inventoryData?.coin?.['104'] || 0,
                elementalCatalyst: inventoryData?.coin?.['1084'] || 0,
                primalCatalyst: inventoryData?.coin?.['1085'] || 0
              },
              consumables: {
                bottledEnergy: inventoryData?.consumable?.['88'] || inventoryData?.consumable?.['42'] || 0,
                artifactChestKey: inventoryData?.consumable?.['45'] || 0,
                titanArtifactSphere: inventoryData?.consumable?.['55'] || 0,
                petSummoningEgg: inventoryData?.consumable?.['90'] || 0,
                chaosCore: inventoryData?.consumable?.['38'] || 0,
                petPotion: inventoryData?.consumable?.['85'] || 0,
                titanPotion: inventoryData?.consumable?.['20'] || 0,
                sparkOfPower: inventoryData?.consumable?.['24'] || 0,
                eternalSeed: inventoryData?.consumable?.['164'] || 0,
                ancientWisdomCrystal: inventoryData?.consumable?.['163'] || 0,
                essenceOfTheElements: inventoryData?.consumable?.['53'] || 0
              }
            };
          }

          // Játékos csapatok kigyűjtése
          let teams = null;
          if (teamData) {
            teams = {
              mission: teamData.mission || [],
              arena: teamData.arena || [],
              grand: teamData.grand || [],
              clanDefence: teamData.clanDefence_heroes || []
            };
          }

          onImport({
            heroes: newHeroesObj,
            profile,
            teams
          });
          setSuccessMessage("Sikeres frissítés! Az adataid betöltődtek.");
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
          <h2>Adatkezelés (Szinkronizáció)</h2>
          <button className="import-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="import-modal-body">
          {successMessage ? (
            <div className="sync-success-container">
              <div className="sync-success-message">
                <span className="material-symbols-outlined sync-success-icon">check_circle</span>
                {successMessage}
              </div>
              <p className="sync-success-prompt">Szeretnéd kimenteni az új állapotot egy JSON fájlba, hogy megoszd másokkal?</p>
              <div className="sync-success-actions">
                <button 
                  className="import-process-btn gold-gradient-btn sync-action-btn" 
                  onClick={() => { exportData(); setSuccessMessage(''); onClose(); }}
                >
                  Új állapot kimentése (JSON Export)
                </button>
                <button 
                  className="import-cancel-btn sync-action-btn" 
                  onClick={() => { setSuccessMessage(''); onClose(); }}
                >
                  Bezárás (Csak a saját gépemen használom)
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="sync-import-box">
                <h4 className="sync-import-title">Importálás HAR-fájlból</h4>
                
                <div className="sync-instruction-box">
                  <strong className="sync-instruction-title">Hogyan készíts HAR-fájlt?</strong>
                  <ul className="sync-instruction-list">
                    <li>Nyisd meg a játékot (várd meg amíg betölt).</li>
                    <li>Nyomj <strong>F12</strong>-t a billentyűzeteden, és válaszd a <strong>Network (Hálózat)</strong> fület.</li>
                    <li>Nyomj egy <strong>F5</strong>-öt (Újratöltés), és várd meg amíg újra betölt a játék.</li>
                    <li>Kattints a hálózati sáv tetején (a 'No throttling' mellett) a kis lefelé mutató nyílra (<strong>Export HAR...</strong>).</li>
                  </ul>
                </div>
                
                <p className="sync-import-desc">Válaszd ki a böngészőből lementett <code>hero-wars.com.har</code> fájlt az azonnali betöltéshez.</p>
                <input 
                  type="file" 
                  accept=".har" 
                  onChange={handleFileUpload}
                  className="sync-file-input"
                />
              </div>

              {error && <div className="import-error">{error}</div>}

              <div className="sync-export-box">
                <p className="sync-export-desc">Ha csak le szeretnéd menteni a jelenlegi állásodat:</p>
                <button 
                  className="import-process-btn gold-gradient-btn sync-export-btn" 
                  onClick={() => { exportData(); onClose(); }}
                >
                  Jelenlegi adatok mentése (Export)
                </button>
              </div>
            </>
          )}
        </div>
        
        {!successMessage && (
          <div className="import-modal-footer">
            <button className="import-cancel-btn" onClick={onClose}>Bezárás</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSyncModal;
