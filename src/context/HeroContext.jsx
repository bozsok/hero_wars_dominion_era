import React, { createContext, useState, useEffect } from 'react';
import heroesCatalog from '../data/heroesCatalog.json';
import gameDictionary from '../data/gameDictionary.json';
import coinsDictionary from '../data/coinsDictionary.json';
import consumablesDictionary from '../data/consumablesDictionary.json';

const defaultHeroState = {
  general: { level: 0, stars: 1, soulStones: 0, power: 0 },
  stats: { health: 0, armor: 0, magicAttack: 0, physicalAttack: 0, magicDefense: 0, dodge: 0 },
  items: { rank: 'White', goe: 0 },
  skills: [0, 0, 0, 0],
  artifacts: { weapon: { level: 0, stars: 0 }, book: { level: 0, stars: 0 }, ring: { level: 0, stars: 0 } },
  skins: {},
  glyphs: [0, 0, 0, 0, 0],
  giftOfElements: 0,
  ascension: { rank: 'I', branch: 0, nodes: [] }
};

const GLYPH_XP_PER_LEVEL = [
  50,50,50,50,50, 80,80,80,80,80, 190,190,190,190,190,
  220,220,220,220,220, 520,520,520,520,520, 590,590,590,590,590,
  790,790,790,790,790, 870,870,870,870,870,
  1970, 1970,1970,1970,1970, 3470,3470,3470,3470,3470
];

const PET_NAMES = {
  '6001': 'Oliver',
  '6002': 'Albus',
  '6003': 'Mara',
  '6004': 'Patron',
  '6005': 'Biscuit',
  '6006': 'Merlin',
  '6007': 'Axel',
  '6008': 'Cain',
  '6009': 'Khorus',
  '6010': 'Fenris'
};

const generateNarrativeSummary = (myHeroes, sortMode, playerProfile, playerTeams, customCoins, customConsumables) => {
  let output = "DOMINION NARRATÍV PROFIL ÖSSZEGZŐ\n";
  output += `Generálva: ${new Date().toLocaleString('hu-HU')}\n`;
  output += "================================================================================\n\n";

  if (playerProfile) {
    output += "JÁTÉKOS PROFIL\n";
    output += "================================================================================\n";
    output += `Játékos név: ${playerProfile.name || 'Ismeretlen'}\n`;
    output += `Szint: ${playerProfile.level || 1}\n`;
    output += `VIP szint: ${playerProfile.vipLevel || 0}\n`;
    output += `Arany: ${(playerProfile.gold || 0).toLocaleString('hu-HU')} Gold\n`;
    output += `Smaragd: ${(playerProfile.emeralds || 0).toLocaleString('hu-HU')} Emerald\n`;
    output += `Energia: ${playerProfile.stamina || 0}\n`;
    if (playerProfile.league) {
      const leagues = { '1': 'Gold League', '2': 'Silver League', '3': 'Bronze League' };
      output += `Liga: ${leagues[playerProfile.league] || playerProfile.league}\n`;
    }
    if (playerProfile.arenaPlace) output += `Arena helyezés: ${playerProfile.arenaPlace}\n`;
    if (playerProfile.grandPlace) output += `Grand Arena helyezés: ${playerProfile.grandPlace}\n`;
    if (playerProfile.campaignLevel) output += `Hadjárat (Campaign) szint: ${playerProfile.campaignLevel}\n`;
    output += "================================================================================\n\n";
  }

  const getHeroNameAndLevel = (heroId) => {
    const idStr = heroId.toString();
    const catalogHero = heroesCatalog.find(h => h.id === idStr || h.id == heroId);
    const name = catalogHero?.name || `Hős #${heroId}`;
    const level = myHeroes[idStr]?.general?.level || 0;
    const power = myHeroes[idStr]?.general?.power || 0;
    if (level > 0) {
      return `${name} (${level}. szint, ${power.toLocaleString('hu-HU')} Power)`;
    }
    return `${name} (Nincs aktiválva / 0. szint)`;
  };

  const renderTeamMember = (memberId) => {
    if (parseInt(memberId, 10) >= 6000) {
      const petName = PET_NAMES[memberId] || `Pet #${memberId}`;
      return `Kisállat (Pet): ${petName}`;
    }
    return getHeroNameAndLevel(memberId);
  };

  if (playerTeams) {
    output += "AKTÍV CSAPATOK (TEAMS)\n";
    output += "================================================================================\n";
    
    // Arena
    if (playerTeams.arena && playerTeams.arena.length > 0) {
      output += "* Arena Team:\n";
      playerTeams.arena.forEach(memberId => {
        output += `  - ${renderTeamMember(memberId)}\n`;
      });
      output += "\n";
    }

    // Grand Arena
    if (playerTeams.grand && playerTeams.grand.length > 0) {
      output += "* Grand Arena Teams:\n";
      playerTeams.grand.forEach((gTeam, tIdx) => {
        if (gTeam && gTeam.length > 0) {
          output += `  - ${tIdx + 1}. csapat:\n`;
          gTeam.forEach(memberId => {
            output += `    - ${renderTeamMember(memberId)}\n`;
          });
        }
      });
      output += "\n";
    }

    // Campaign
    if (playerTeams.mission && playerTeams.mission.length > 0) {
      output += "* Campaign Team:\n";
      playerTeams.mission.forEach(memberId => {
        output += `  - ${renderTeamMember(memberId)}\n`;
      });
      output += "\n";
    }

    // Clan Defence
    if (playerTeams.clanDefence && playerTeams.clanDefence.length > 0) {
      output += "* Clan Defence Team:\n";
      playerTeams.clanDefence.forEach(memberId => {
        output += `  - ${renderTeamMember(memberId)}\n`;
      });
      output += "\n";
    }
    
    output += "================================================================================\n\n";
  }

  if (playerProfile && playerProfile.coins) {
    output += "ÉRMEK ÉS ERŐFORRÁSOK (COINS)\n";
    output += "================================================================================\n";
    
    const coinsList = [
      { id: '1', name: 'Arena Coin', key: 'arena' },
      { id: '2', name: 'Grand Arena Coin', key: 'grandArena' },
      { id: '3', name: 'Tower Coin', key: 'tower' },
      { id: '4', name: 'Outland Coin', key: 'outland' },
      { id: '5', name: 'Soul Coin', key: 'soulCoin' },
      { id: '6', name: 'Friendship Chip', key: 'friendshipChip' },
      { id: '8', name: 'Intelligence Skin Stone', key: 'skinStoneInt' },
      { id: '9', name: 'Strength Skin Stone', key: 'skinStoneStr' },
      { id: '10', name: 'Agility Skin Stone', key: 'skinStoneAgi' },
      { id: '13', name: 'Summoning Sphere', key: 'summoningSphere' },
      { id: '14', name: 'Artifact Coin', key: 'artifactCoin' },
      { id: '15', name: 'Titan Soul Coin', key: 'titanSoulCoin' },
      { id: '18', name: 'Elemental Tournament Coin', key: 'elementalTournamentCoin' },
      { id: '24', name: 'Titan Skin Stone', key: 'titanSkinStone' },
      { id: '30', name: 'Valor Emblem', key: 'valorEmblem' },
      { id: '38', name: 'Soul Crystal', key: 'soulCrystal' },
      { id: '45', name: 'Golden Thread', key: 'goldenThread' },
      { id: '101', name: 'Bronze Trophy', key: 'bronzeTrophy' },
      { id: '102', name: 'Silver Trophy', key: 'silverTrophy' },
      { id: '103', name: 'Gold Trophy', key: 'goldTrophy' },
      { id: '104', name: 'Clash of Worlds Trophy', key: 'clashOfWorldsTrophy' },
      { id: '1084', name: 'Elemental Catalyst', key: 'elementalCatalyst' },
      { id: '1085', name: 'Primal Catalyst', key: 'primalCatalyst' },
      { id: '2192001095', name: 'Exclusive Skin Coin', key: 'exclusiveSkinCoin' },
      { id: '2266001091', name: 'Energy Crystal', key: 'energyCrystal' },
      { id: '2266001092', name: 'Valor Coin', key: 'valorCoin' },
      { id: '2266001093', name: 'Sapphire Medallion', key: 'sapphireMedallion' }
    ];

    coinsList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

    let hasCoins = false;
    coinsList.forEach(coin => {
      const amount = playerProfile.coins[coin.key] || 0;
      if (amount > 0) {
        const customName = customCoins?.[coin.id]?.name || coinsDictionary[coin.id]?.name || coin.name;
        output += `- ${customName} (#${coin.id}): ${amount.toLocaleString('hu-HU')} db\n`;
        hasCoins = true;
      }
    });

    if (!hasCoins) {
      output += "Nincsenek aktív érmék a mentésben.\n";
    }
    
    output += "================================================================================\n\n";
  }

  if (playerProfile && playerProfile.inventory) {
    output += "FOGYÓESZKÖZÖK (CONSUMABLES)\n";
    output += "================================================================================\n";
    
    const itemIds = Object.keys(playerProfile.inventory).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    let hasItems = false;
    
    itemIds.forEach(id => {
      const amount = playerProfile.inventory[id] || 0;
      if (amount > 0) {
        const customName = customConsumables?.[id]?.name || consumablesDictionary[id]?.name || `Tárgy #${id}`;
        output += `- ${customName} (#${id}): ${amount.toLocaleString('hu-HU')} db\n`;
        hasItems = true;
      }
    });

    if (!hasItems) {
      output += "Nincsenek aktív fogyóeszközök a mentésben.\n";
    }
    
    output += "================================================================================\n\n";
  }

  output += "RÉSZLETES HŐS FEJLETTSÉG\n";
  output += "================================================================================\n\n";

  const ownedHeroIds = Object.keys(myHeroes).filter(id => {
    const heroData = myHeroes[id];
    return heroData.general && heroData.general.level > 0;
  });

  // Rendezés a sortMode alapján
  ownedHeroIds.sort((idA, idB) => {
    const heroA = myHeroes[idA];
    const heroB = myHeroes[idB];
    const catalogHeroA = heroesCatalog.find(h => h.id === idA || h.id == idA);
    const catalogHeroB = heroesCatalog.find(h => h.id === idB || h.id == idB);
    const nameA = catalogHeroA?.name || '';
    const nameB = catalogHeroB?.name || '';

    if (sortMode === 'power_desc') {
      const pA = heroA.general?.power || 0;
      const pB = heroB.general?.power || 0;
      return pB - pA;
    }
    if (sortMode === 'power_asc') {
      const pA = heroA.general?.power || 0;
      const pB = heroB.general?.power || 0;
      return pA - pB;
    }
    if (sortMode === 'name_asc') {
      return nameA.localeCompare(nameB);
    }
    if (sortMode === 'name_desc') {
      return nameB.localeCompare(nameA);
    }
    return 0;
  });

  if (ownedHeroIds.length === 0) {
    output += "Nincsenek aktivált hősök a mentésben.\n";
    return output;
  }

  ownedHeroIds.forEach(id => {
    const heroUserData = myHeroes[id];
    const catalogHero = heroesCatalog.find(h => h.id === id || h.id == id);
    const dictHero = gameDictionary.heroes[id];

    if (!catalogHero) return;

    const name = catalogHero.name;
    const level = heroUserData.general?.level || 0;
    const stars = heroUserData.general?.stars || 1;
    const power = heroUserData.general?.power || 0;
    const rank = heroUserData.items?.rank || 'White';
    const mainStat = catalogHero.mainStat || 'Ismeretlen';
    const roles = (catalogHero.roles || []).join(', ');
    const goe = heroUserData.items?.goe || 0;

    output += `HŐS: ${name} (Azonosító ID: ${id})\n`;
    output += "================================================================================\n";
    output += "* Általános információk:\n";
    output += `  - Szint: ${level} / 130\n`;
    output += `  - Csillagszám: ${stars} / 6 csillag\n`;
    output += `  - Felszerelés rang: ${rank}\n`;
    output += `  - Fő statisztika: ${mainStat}\n`;
    output += `  - Szerepkörök: ${roles}\n`;
    output += `  - Játékbeli erő (Power): ${power.toLocaleString()} Power\n\n`;

    // Képességek
    output += "* Képességek (Skills):\n";
    const skillNames = ['1. Képesség (White)', '2. Képesség (Green)', '3. Képesség (Blue)', '4. Képesség (Violet)'];
    const maxSkills = [level, level, Math.max(0, level - 20), Math.max(0, level - 40)];
    
    skillNames.forEach((skillName, idx) => {
      const skillLevel = heroUserData.skills?.[idx] || 0;
      const maxLvl = maxSkills[idx];
      const isMax = maxLvl > 0 && skillLevel >= maxLvl;
      const maxText = isMax ? " (Maximális)" : "";
      if (maxLvl > 0) {
        output += `  - ${skillName}: ${skillLevel} / ${maxLvl} szint${maxText}\n`;
      } else {
        output += `  - ${skillName}: Még nincs feloldva\n`;
      }
    });
    output += "\n";

    // Ereklyék
    output += "* Ereklyék (Artifacts):\n";
    const weaponLvl = heroUserData.artifacts?.weapon?.level || 0;
    const weaponStars = heroUserData.artifacts?.weapon?.stars || 0;
    const weaponBuff = dictHero?.artifactWeapon?.attribute || 'Csapat buff';
    output += `  - 1. Ereklye (Weapon): Szint: ${weaponLvl} / 100, Csillagok: ${weaponStars} / 6. Buff: ${weaponBuff} a csapatnak\n`;

    const bookLvl = heroUserData.artifacts?.book?.level || 0;
    const bookStars = heroUserData.artifacts?.book?.stars || 0;
    const bookAttr1 = heroUserData.artifacts?.book?.attribute1 || 'Armor';
    const bookAttr2 = heroUserData.artifacts?.book?.attribute2 || 'Magic Defense';
    output += `  - 2. Ereklye (Book): Szint: ${bookLvl} / 100, Csillagok: ${bookStars} / 6. Bónuszok: ${bookAttr1}, ${bookAttr2}\n`;

    const ringLvl = heroUserData.artifacts?.ring?.level || 0;
    const ringStars = heroUserData.artifacts?.ring?.stars || 0;
    const ringAttr = heroUserData.artifacts?.ring?.attribute || mainStat || 'Strength';
    output += `  - 3. Ereklye (Ring): Szint: ${ringLvl} / 100, Csillagok: ${ringStars} / 6. Bónusz: +${ringAttr} a hősnek\n\n`;

    // Skinek
    output += "* Skinek (Skins):\n";
    const defaultSkinInput = heroUserData.skins?.['default'] || 0;
    const defaultSkinMax = defaultSkinInput === 60 ? " (Maximális)" : "";
    output += `  - Default Skin (Fő statisztika bónusz): ${defaultSkinInput} / 60 szint${defaultSkinMax}\n`;
    
    if (dictHero && dictHero.skins) {
      dictHero.skins.forEach(skin => {
        const skinVal = heroUserData.skins?.[skin.name] !== undefined 
          ? heroUserData.skins[skin.name] 
          : (skin.id !== undefined && heroUserData.skins?.[skin.id] !== undefined ? heroUserData.skins[skin.id] : 0);
        const isMax = skinVal === 60;
        const maxText = isMax ? " (Maximális)" : "";
        output += `  - ${skin.name} (${skin.attribute}): ${skinVal} / 60 szint${maxText}\n`;
      });
    }
    output += "\n";

    // Rúnák
    output += "* Rúnák (Glyphs):\n";
    const glyphNames = catalogHero.staticGlyphs || [];
    const glyphsXpValues = heroUserData.glyphs || [];

    const getGlyphLevel = (xp) => {
      let remainingXp = xp;
      let lvl = 0;
      for (let i = 0; i < GLYPH_XP_PER_LEVEL.length; i++) {
        if (remainingXp >= GLYPH_XP_PER_LEVEL[i]) {
          remainingXp -= GLYPH_XP_PER_LEVEL[i];
          lvl = i + 1;
        } else {
          break;
        }
      }
      return lvl;
    };

    glyphNames.forEach((glyphName, idx) => {
      const rawXp = parseInt(glyphsXpValues[idx]) || 0;
      const lvl = getGlyphLevel(rawXp);
      const isMax = lvl === 50;
      const maxText = isMax ? " (Maximális)" : "";
      output += `  - ${glyphName} rúna: ${lvl} / 50 szint (${rawXp.toLocaleString()} / 33,850 XP)${maxText}\n`;
    });
    output += "\n";

    // Felemelkedés (Ascension)
    output += "* Felemelkedés (Ascension):\n";
    const ascensionRank = heroUserData.ascension?.rank || '0';
    const branchLevel = parseInt(heroUserData.ascension?.branch) || 0;
    const activeNodes = heroUserData.ascension?.nodes || [];
    const maxNodesPerRank = { '0': 0, 'I': 10, 'II': 11, 'III': 10, 'IV': 10, 'V': 10 };
    const maxNodes = maxNodesPerRank[ascensionRank] || 0;
    
    output += `  - Ascension Rank: ${ascensionRank === '0' ? 'Nincs' : `Rank ${ascensionRank}`}\n`;
    if (ascensionRank !== '0') {
      output += `  - Feloldott csomópontok: ${activeNodes.length} / ${maxNodes}\n`;
    }
    const primaryRole = catalogHero.roles?.[0] || 'Ismeretlen';
    output += `  - Bölcsesség Fája (${primaryRole} ág): ${branchLevel} / 50 szint\n`;
    
    const goeMax = goe === 30 ? " (Maximális)" : "";
    output += `  - Elemek ajándéka (Gift of the Elements): ${goe} / 30 szint${goeMax}\n`;
    output += "================================================================================\n\n";
  });

  return output;
};

export const HeroContext = createContext();

export const HeroProvider = ({ children }) => {
  const [myHeroes, setMyHeroes] = useState({});
  const [viewHeroes, setViewHeroes] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);
  const [viewTeams, setViewTeams] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [sortMode, setSortMode] = useState('default');
  const [playerProfile, setPlayerProfile] = useState(null);
  const [playerTeams, setPlayerTeams] = useState(null);
  const [customConsumables, setCustomConsumables] = useState({});
  const [customCoins, setCustomCoins] = useState({});
  const [viewCustomConsumables, setViewCustomConsumables] = useState(null);
  const [viewCustomCoins, setViewCustomCoins] = useState(null);

  // Custom érmék és fogyóeszközök betöltése indításkor
  useEffect(() => {
    const stored = localStorage.getItem('customConsumablesMap');
    if (stored) {
      try { setCustomConsumables(JSON.parse(stored)); } catch(e) {}
    }
    const storedCoins = localStorage.getItem('customCoinsMap');
    if (storedCoins) {
      try { setCustomCoins(JSON.parse(storedCoins)); } catch(e) {}
    }
  }, []);

  const saveCustomItem = (id, name, type, color) => {
    if (isViewMode) return;
    const isCoin = type === 'coin';
    if (isCoin) {
      const newMap = { ...customCoins };
      if (name === '') {
        delete newMap[id];
      } else {
        newMap[id] = { name };
      }
      setCustomCoins(newMap);
      localStorage.setItem('customCoinsMap', JSON.stringify(newMap));
    } else {
      const newMap = { ...customConsumables };
      if (name === '') {
        delete newMap[id];
      } else {
        const entry = { name };
        if (color) entry.color = color;
        newMap[id] = entry;
      }
      setCustomConsumables(newMap);
      localStorage.setItem('customConsumablesMap', JSON.stringify(newMap));
    }
  };

  // Profil és csapatok inicializálása
  useEffect(() => {
    const storedProfile = localStorage.getItem('heroWarsTrackerProfile');
    if (storedProfile) {
      try { setPlayerProfile(JSON.parse(storedProfile)); } catch(e) {}
    }
    const storedTeams = localStorage.getItem('heroWarsTrackerTeams');
    if (storedTeams) {
      try { setPlayerTeams(JSON.parse(storedTeams)); } catch(e) {}
    }
  }, []);

  // Profil és csapatok mentése változáskor
  useEffect(() => {
    if (playerProfile) {
      localStorage.setItem('heroWarsTrackerProfile', JSON.stringify(playerProfile));
    }
  }, [playerProfile]);

  useEffect(() => {
    if (playerTeams) {
      localStorage.setItem('heroWarsTrackerTeams', JSON.stringify(playerTeams));
    }
  }, [playerTeams]);

  // Inicializálás Local Storage-ből és migráció
  useEffect(() => {
    const stored = localStorage.getItem('heroWarsTrackerData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // MIGRÁCIÓS LOGIKA: Array (régi) -> Object (új)
        if (Array.isArray(parsed)) {
          console.log("Migrálás a régi tömb formátumról az új objektum alapú adatbázisra...");
          const migratedData = {};
          parsed.forEach(oldHero => {
            migratedData[oldHero.id] = {
              ...defaultHeroState,
              stats: oldHero.stats ? { ...defaultHeroState.stats, ...oldHero.stats } : { ...defaultHeroState.stats }
            };
          });
          setMyHeroes(migratedData);
        } else {
          // Ha már az új formátum, akkor is gondoskodunk a default értékekről és a mezők konvertálásáról
          const safeData = {};
          for (const key in parsed) {
             const oldHero = parsed[key];
             const oldStars = oldHero.general?.stars || 1;
             const oldSoulStones = oldHero.general?.soulStones || 0;

             safeData[key] = { 
               ...defaultHeroState, 
               ...oldHero, 
               general: {
                 level: oldHero.general?.level || 0,
                 power: oldHero.general?.power || 0,
                 stars: oldStars,
                 soulStones: oldSoulStones
               },
               items: {
                 rank: oldHero.items?.rank || oldHero.general?.rank || 'White',
                 goe: oldHero.items?.goe || 0
               },
               stats: { ...defaultHeroState.stats, ...(oldHero.stats || {}) },
               skills: Array.isArray(oldHero.skills) ? oldHero.skills : [0, 0, 0, 0],
               skins: oldHero.skins && !Array.isArray(oldHero.skins) ? oldHero.skins : {},
               glyphs: Array.isArray(oldHero.glyphs) ? oldHero.glyphs : [0, 0, 0, 0, 0],
               ascension: {
                 rank: oldHero.ascension?.rank || 'I',
                 branch: oldHero.ascension?.branch || 0,
                 nodes: Array.isArray(oldHero.ascension?.nodes) ? oldHero.ascension.nodes : []
               }
             };
          }
          setMyHeroes(safeData);
        }
      } catch (e) {
        console.error("Hiba az adatok betöltésekor", e);
        setMyHeroes({});
      }
    } else {
      // Import the dynamically generated default catalog as the starting state
      import('../data/defaultHeroes.json')
        .then(module => {
          setMyHeroes(module.default);
        })
        .catch(err => {
          console.error("Nem sikerült betölteni a generált exportot", err);
          setMyHeroes({});
        });
    }
  }, []);

  // Mentés Local Storage-be változáskor
  useEffect(() => {
    if (Object.keys(myHeroes).length > 0) {
      localStorage.setItem('heroWarsTrackerData', JSON.stringify(myHeroes));
    }
  }, [myHeroes]);

  const updateHeroData = (heroId, newHeroData) => {
    if (isViewMode) return;
    setMyHeroes(prev => ({
      ...prev,
      [heroId]: {
        ...(prev[heroId] || defaultHeroState),
        ...newHeroData,
        // Make sure nested objects are deeply merged if necessary, 
        // but since we will pass the full updated hero object from the modal,
        // we can just overwrite the properties or spread them.
      }
    }));
  };

  const importBulkData = (data) => {
    if (isViewMode) return;
    
    if (data && data.heroes) {
      // Új HAR formátum
      setMyHeroes(prev => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = {
            ...updated[key],
            general: { ...(updated[key].general || {}), level: 0, stars: 1, power: 0, soulStones: 0 }
          };
        }
        for (const key in data.heroes) {
          updated[key] = {
             ...updated[key],
             ...data.heroes[key],
             general: {
               ...(updated[key]?.general || {}),
               ...(data.heroes[key]?.general || {})
             }
          };
        }
        return updated;
      });
      
      if (data.profile) setPlayerProfile(data.profile);
      if (data.teams) setPlayerTeams(data.teams);
      if (data.customConsumables) {
        setCustomConsumables(data.customConsumables);
        localStorage.setItem('customConsumablesMap', JSON.stringify(data.customConsumables));
      }
      if (data.customCoins) {
        setCustomCoins(data.customCoins);
        localStorage.setItem('customCoinsMap', JSON.stringify(data.customCoins));
      }
    } else {
      // Régi formátum
      const newHeroesObj = data;
      setMyHeroes(prev => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = {
            ...updated[key],
            general: { ...(updated[key].general || {}), level: 0, stars: 1, power: 0, soulStones: 0 }
          };
        }
        for (const key in newHeroesObj) {
          updated[key] = {
             ...updated[key],
             ...newHeroesObj[key],
             general: {
               ...(updated[key]?.general || {}),
               ...(newHeroesObj[key]?.general || {})
             }
          };
        }
        return updated;
      });
    }
  };

  const exportData = () => {
    // Rendezzük a JSON kulcsokat a sortMode alapján (új objektum létrehozásával)
    const sortedHeroesObj = {};
    const allHeroIds = Object.keys(myHeroes);
    allHeroIds.sort((idA, idB) => {
      const heroA = myHeroes[idA];
      const heroB = myHeroes[idB];
      const catalogHeroA = heroesCatalog.find(h => h.id === idA || h.id == idA);
      const catalogHeroB = heroesCatalog.find(h => h.id === idB || h.id == idB);
      const nameA = catalogHeroA?.name || '';
      const nameB = catalogHeroB?.name || '';

      if (sortMode === 'power_desc') {
        const pA = heroA.general?.power || 0;
        const pB = heroB.general?.power || 0;
        return pB - pA;
      }
      if (sortMode === 'power_asc') {
        const pA = heroA.general?.power || 0;
        const pB = heroB.general?.power || 0;
        return pA - pB;
      }
      if (sortMode === 'name_asc') {
        return nameA.localeCompare(nameB);
      }
      if (sortMode === 'name_desc') {
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
    
    allHeroIds.forEach(id => {
      const hero = myHeroes[id];
      // Csak a dinamikus, játékoshoz tartozó adatokat mentjük ki, a statikus katalógus adatokat (név, leírás stb.) nem
      sortedHeroesObj[id] = {
        general: hero.general,
        stats: hero.stats,
        items: hero.items,
        skills: hero.skills,
        artifacts: hero.artifacts,
        skins: hero.skins,
        glyphs: hero.glyphs,
        giftOfElements: hero.giftOfElements,
        ascension: hero.ascension
      };
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const filename = `${year}.${month}.${day}_${hours}${minutes}`;

    // 1. JSON export letöltése
    const exportObject = {
      formatVersion: 2,
      profile: playerProfile,
      teams: playerTeams,
      heroes: sortedHeroesObj,
      customConsumables,
      customCoins
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${filename}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // 2. Narratív TXT export letöltése
    try {
      const textSummary = generateNarrativeSummary(myHeroes, sortMode, playerProfile, playerTeams, customCoins, customConsumables);
      const textDataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textSummary);
      const textAnchorNode = document.createElement('a');
      textAnchorNode.setAttribute("href", textDataStr);
      textAnchorNode.setAttribute("download", `${filename}.txt`);
      document.body.appendChild(textAnchorNode);
      textAnchorNode.click();
      textAnchorNode.remove();
    } catch (e) {
      console.error("Hiba a szöveges export generálása közben: ", e);
    }
  };

  const loadViewData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      let viewData = {};
      
      // Kezeljük a formátumokat (új formatVersion: 2 és régi struktúrák)
      if (parsed.formatVersion === 2) {
        viewData = parsed.heroes || {};
        setViewProfile(parsed.profile || null);
        setViewTeams(parsed.teams || null);
        setViewCustomConsumables(parsed.customConsumables || {});
        setViewCustomCoins(parsed.customCoins || {});
      } else if (Array.isArray(parsed)) {
        parsed.forEach(oldHero => {
          viewData[oldHero.id] = {
            ...defaultHeroState,
            stats: oldHero.stats ? { ...defaultHeroState.stats, ...oldHero.stats } : { ...defaultHeroState.stats }
          };
        });
        setViewProfile(null);
        setViewTeams(null);
      } else if (typeof parsed === 'object' && parsed !== null) {
        viewData = parsed;
        setViewProfile(null);
        setViewTeams(null);
      } else {
        alert('Hibás fájlformátum!');
        return;
      }
      
      setViewHeroes(viewData);
      setIsViewMode(true);
    } catch (e) {
      alert('Hiba a fájl olvasásakor!');
    }
  };

  const exitViewMode = () => {
    setIsViewMode(false);
    setViewHeroes(null);
    setViewProfile(null);
    setViewTeams(null);
    setViewCustomConsumables(null);
    setViewCustomCoins(null);
  };

  // Aktuális felhasználói adatok (saját vagy nézeti)
  const activeData = isViewMode ? viewHeroes : myHeroes;
  
  // Egyesítjük a katalógust a felhasználói adatokkal a UI számára
  const activeHeroesArray = heroesCatalog.map(catalogHero => {
    const heroUserData = activeData[catalogHero.id] || defaultHeroState;
    return {
      ...catalogHero, // statikus adatok (név, kép, frakció, ikon)
      ...heroUserData // mentett adatok (stats, skinek, ereklyék)
    };
  });

  return (
    <HeroContext.Provider value={{
      heroes: activeHeroesArray,
      updateHeroData,
      importBulkData,
      exportData,
      loadViewData,
      isViewMode,
      exitViewMode,
      sortMode,
      setSortMode,
      playerProfile,
      viewProfile,
      playerTeams: isViewMode ? viewTeams : playerTeams,
      customConsumables: isViewMode ? (viewCustomConsumables || {}) : customConsumables,
      customCoins: isViewMode ? (viewCustomCoins || {}) : customCoins,
      saveCustomItem
    }}>
      {children}
    </HeroContext.Provider>
  );
};
