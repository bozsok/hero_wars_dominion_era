import React, { createContext, useState, useEffect } from 'react';
import heroesCatalog from '../data/heroesCatalog.json';

const defaultHeroState = {
  general: { level: 0, stars: 1, soulStones: 0, power: 0 },
  stats: { health: 0, armor: 0, magicAttack: 0, physicalAttack: 0, magicDefense: 0, dodge: 0 },
  items: { rank: 'White' },
  skills: [0, 0, 0, 0],
  artifacts: { weapon: { level: 0, stars: 0 }, book: { level: 0, stars: 0 }, ring: { level: 0, stars: 0 } },
  skins: {},
  glyphs: [0, 0, 0, 0, 0],
  giftOfElements: 0,
  ascension: { rank: 'I', branch: 0 }
};

export const HeroContext = createContext();

export const HeroProvider = ({ children }) => {
  const [myHeroes, setMyHeroes] = useState({});
  const [viewHeroes, setViewHeroes] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

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
                 rank: oldHero.items?.rank || oldHero.general?.rank || 'White'
               },
               stats: { ...defaultHeroState.stats, ...(oldHero.stats || {}) },
               skills: Array.isArray(oldHero.skills) ? oldHero.skills : [0, 0, 0, 0],
               skins: oldHero.skins && !Array.isArray(oldHero.skins) ? oldHero.skins : {},
               glyphs: Array.isArray(oldHero.glyphs) ? oldHero.glyphs : [0, 0, 0, 0, 0],
               ascension: {
                 rank: oldHero.ascension?.rank || 'I',
                 branch: oldHero.ascension?.branch || oldHero.ascension?.nodes?.length || 0
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

  const importBulkData = (newHeroesObj) => {
    if (isViewMode) return;
    setMyHeroes(prev => {
      const updated = { ...prev };
      
      // 1. Minden létező hőst inaktívra állítunk (szint=0, csillag=1, erő=0)
      for (const key in updated) {
        updated[key] = {
          ...updated[key],
          general: { 
            ...(updated[key].general || {}), 
            level: 0, 
            stars: 1, 
            power: 0, 
            soulStones: 0 
          }
        };
      }
      
      // 2. Rátöltjük a beimportált, ténylegesen birtokolt hősöket
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
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myHeroes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dominion_heroes_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadViewData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      let viewData = {};
      
      // Kezeljük, ha egy régi struktúrájú exportot töltene be
      if (Array.isArray(parsed)) {
        parsed.forEach(oldHero => {
          viewData[oldHero.id] = {
            ...defaultHeroState,
            stats: oldHero.stats ? { ...defaultHeroState.stats, ...oldHero.stats } : { ...defaultHeroState.stats }
          };
        });
      } else if (typeof parsed === 'object' && parsed !== null) {
        viewData = parsed;
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
      exitViewMode
    }}>
      {children}
    </HeroContext.Provider>
  );
};
