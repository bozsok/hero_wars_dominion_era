import React, { createContext, useState, useEffect } from 'react';
import heroesCatalog from '../data/heroesCatalog.json';
import gameDictionary from '../data/gameDictionary.json';

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

const generateNarrativeSummary = (myHeroes, sortMode) => {
  let output = "DOMINION HŐSÖK FEJLETTSÉGI ÖSSZEGZŐ\n";
  output += `Generálva: ${new Date().toLocaleString('hu-HU')}\n`;
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
      heroes: sortedHeroesObj
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
      const textSummary = generateNarrativeSummary(myHeroes, sortMode);
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
      playerTeams: isViewMode ? viewTeams : playerTeams
    }}>
      {children}
    </HeroContext.Provider>
  );
};
