import gameDictionary from '../data/gameDictionary.json' with { type: 'json' };
import heroesCatalog from '../data/heroesCatalog.json' with { type: 'json' };

// === BROWSER GLYPH XP KÖLTSÉGTÁBLA (Fandom Wiki-ből) ===
// Szintenkénti enchant point költség (index 0 = level 1, index 49 = level 50)
const GLYPH_XP_PER_LEVEL = [
  50,50,50,50,50, 80,80,80,80,80, 190,190,190,190,190,
  220,220,220,220,220, 520,520,520,520,520, 590,590,590,590,590,
  790,790,790,790,790, 870,870,870,870,870,
  1970, 1970,1970,1970,1970, 3470,3470,3470,3470,3470
];

// Stat bónusz szintenként a különböző típusokhoz (Fandom Wiki)
// Kategóriák: primaryStat(STR/AGI/INT), health, physicalAttack, bonus4(MA/AR/MD/ArPen/MPen), bonus5(Dodge/CritHit)
const GLYPH_STAT_PER_LEVEL = {
  primaryStat: [2,2,2,2,2, 3,3,3,3,3, 7,7,7,7,7, 8,8,8,8,8, 18,18,18,18,18, 20,20,20,20,20, 26,26,26,26,26, 28,28,28,28,28, 47,47,47,47,47, 68,68,68,68,68],
  health:      [110,110,110,110,110, 165,165,165,165,165, 385,385,385,385,385, 440,440,440,440,440, 990,990,990,990,990, 1100,1100,1100,1100,1100, 1430,1430,1430,1430,1430, 1540,1540,1540,1540,1540, 2540,2540,2540,2540,2540, 3740,3740,3740,3740,3740],
  physicalAttack: [8,8,8,8,8, 12,12,12,12,12, 28,28,28,28,28, 32,32,32,32,32, 72,72,72,72,72, 80,80,80,80,80, 104,104,104,104,104, 112,112,112,112,112, 170,170,170,170,170, 250,250,250,250,250],
  bonus4:      [12,12,12,12,12, 18,18,18,18,18, 42,42,42,42,42, 48,48,48,48,48, 108,108,108,108,108, 120,120,120,120,120, 156,156,156,156,156, 168,168,168,168,168, 254,254,254,254,254, 374,374,374,374,374],
  bonus5:      [4,4,4,4,4, 6,6,6,6,6, 14,14,14,14,14, 16,16,16,16,16, 36,36,36,36,36, 40,40,40,40,40, 52,52,52,52,52, 56,56,56,56,56, 71,71,71,71,71, 104,104,104,104,104]
};

// Stat típus → bónusz kategória leképezés
const GLYPH_STAT_CATEGORY = {
  strength: 'primaryStat', agility: 'primaryStat', intelligence: 'primaryStat',
  health: 'health',
  physicalAttack: 'physicalAttack',
  magicAttack: 'bonus4', armor: 'bonus4', magicDefense: 'bonus4',
  armorPenetration: 'bonus4', magicPenetration: 'bonus4',
  dodge: 'bonus5', critHitChance: 'bonus5'
};

/**
 * Konvertálja a glyph nyers XP-t (enchant points) stat bónusszá.
 * 1. XP → Szint: a szintenkénti költségtáblából kivonjuk az XP-ket
 * 2. Szint → Stat: az elért szintek stat bónuszait összeadjuk
 * @param {number} totalXp - A glyph összesített XP-je
 * @param {string} statKey - A stat típus kulcsa (pl. 'health', 'armor', 'strength')
 * @returns {number} A kiszámolt stat bónusz
 */
function convertGlyphXpToStat(totalXp, statKey) {
  // 1. XP → Szint konverzió
  let remainingXp = totalXp;
  let level = 0;
  for (let i = 0; i < GLYPH_XP_PER_LEVEL.length; i++) {
    if (remainingXp >= GLYPH_XP_PER_LEVEL[i]) {
      remainingXp -= GLYPH_XP_PER_LEVEL[i];
      level = i + 1;
    } else {
      break;
    }
  }

  // 2. Szint → Stat konverzió
  const category = GLYPH_STAT_CATEGORY[statKey];
  if (!category) return 0;
  const bonusArray = GLYPH_STAT_PER_LEVEL[category];
  let totalStat = 0;
  for (let i = 0; i < level; i++) {
    totalStat += bonusArray[i];
  }
  return totalStat;
}

/**
 * Calculates the final simulated stats for a hero based on all their parameters, including Power.
 * @param {object} heroData - The user's inputted hero data
 * @returns {object} The calculated stats, or null if the hero is not found in the dictionary
 */
export const calculateHeroStats = (heroId, userHeroData) => {
  const dictData = gameDictionary.heroes[heroId];
  const globalDict = gameDictionary.global;
  
  if (!dictData) return null;

  const { base, growth, mainStat, skins: dictSkins, artifactWeapon, ascension: dictAscension } = dictData;
  const level = userHeroData.general?.level || 1;
  const stars = userHeroData.general?.stars || 1;
  const lvlMultiplier = Math.max(0, level - 1);

  let activeGrowth = growth[stars];
  if (!activeGrowth || (activeGrowth.strength === 0 && activeGrowth.agility === 0 && activeGrowth.intelligence === 0)) {
     for (let i = stars + 1; i <= 6; i++) {
        if (growth[i] && (growth[i].strength > 0 || growth[i].agility > 0 || growth[i].intelligence > 0)) {
           activeGrowth = growth[i];
           break;
        }
     }
  }
  if (!activeGrowth) activeGrowth = { strength: 0, agility: 0, intelligence: 0 };

  // 1. Calculate Base Primary Stats + Growth
  let strength = Math.floor((base.strength || 0) + (lvlMultiplier * (activeGrowth.strength || 0)));
  let agility = Math.floor((base.agility || 0) + (lvlMultiplier * (activeGrowth.agility || 0)));
  let intelligence = Math.floor((base.intelligence || 0) + (lvlMultiplier * (activeGrowth.intelligence || 0)));

  // Flat bonuses accumulator
  const flatBonuses = {
    health: 0, physicalAttack: 0, magicAttack: 0, armor: 0, magicDefense: 0, 
    dodge: 0, critHitChance: 0, armorPenetration: 0, magicPenetration: 0, vampirism: 0
  };

  const addBonus = (key, val) => {
    if (!key || isNaN(val)) return;
    if (key === 'strength') strength += val;
    else if (key === 'agility') agility += val;
    else if (key === 'intelligence') intelligence += val;
    else if (flatBonuses[key] !== undefined) flatBonuses[key] += val;
  };

  // --- GLYPHS (XP → Szint → Stat konverzió) ---
  // A rúnák típusait a staticGlyphs-ből vesszük a heroesCatalog-ból.
  const catalogHero = heroesCatalog.find(h => h.id === heroId || h.id == heroId);
  const glyphNames = catalogHero?.staticGlyphs || userHeroData.glyphNames || [];
  const glyphsXpValues = userHeroData.glyphs || [];
  glyphNames.forEach((name, idx) => {
    const rawXp = parseInt(glyphsXpValues[idx]) || 0;
    const key = Object.keys(globalDict.maxGlyphs).find(k => k.toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
    if (key && rawXp > 0) {
       const statValue = convertGlyphXpToStat(rawXp, key);
       addBonus(key, statValue);
    }
  });

  // --- GIFT OF THE ELEMENTS (Wiki tábla alapján) ---
  // A main stat dupla bónuszt kap. A bónusz NEM lineáris, blokkonként emelkedik.
  // Forrás: hero-wars.fandom.com/wiki/Guild/Heart_of_Power/Gift_of_the_Elements
  // Kumulatív szekunder stat bónuszok szintenként (main stat = dupla):
  const GOE_CUMULATIVE_SECONDARY = [
    0,  2,  4,  6,  8, 10,  // 0-5
    16, 22, 28, 34, 40,     // 6-10
    50, 60, 70, 80, 90,     // 11-15
    104,118,132,146,160,    // 16-20
    178,196,214,232,250,    // 21-25
    272,294,316,338,360     // 26-30
  ];
  const goeLevel = parseInt(userHeroData.items?.goe || 0);
  if (goeLevel > 0) {
     const lvl = Math.min(30, Math.max(0, goeLevel));
     const secondaryBonus = GOE_CUMULATIVE_SECONDARY[lvl] || 0;
     const mainBonus = secondaryBonus * 2;
     if (mainStat === 'strength') {
        strength += mainBonus;
        agility += secondaryBonus;
        intelligence += secondaryBonus;
     } else if (mainStat === 'agility') {
        strength += secondaryBonus;
        agility += mainBonus;
        intelligence += secondaryBonus;
     } else if (mainStat === 'intelligence') {
        strength += secondaryBonus;
        agility += secondaryBonus;
        intelligence += mainBonus;
     }
  }

  // --- SKINS ---
  const userSkins = userHeroData.skins || {};
  
  // Default Skin gives the Main Stat (Max 1365 at lvl 60)
  // A default skin kulcsa lehet 'default', a hős saját ID-ja, vagy Corvus esetén a 105-ös ID
  const defaultSkinId = (heroId === '50' || heroId == 50) ? 105 : heroId;
  const defaultSkinInput = parseInt(userSkins['default']) || parseInt(userSkins[defaultSkinId]) || 0;
  const defaultSkinStat = defaultSkinInput <= 60 ? Math.floor((defaultSkinInput / 60) * 1365) : defaultSkinInput;
  if (defaultSkinStat > 0) {
      if (mainStat === 'strength') strength += defaultSkinStat;
      else if (mainStat === 'agility') agility += defaultSkinStat;
      else if (mainStat === 'intelligence') intelligence += defaultSkinStat;
  }

  if (dictSkins) {
    dictSkins.forEach((skin) => {
      // Megpróbáljuk a skin szintjét lekérni:
      // 1. skin.id alapján a userSkins-ben (pl. "105")
      // 2. skin.name alapján a userSkins-ben (pl. "Dark Depths Skin")
      let rawInput = 0;
      if (userSkins[skin.name] !== undefined) {
        rawInput = parseInt(userSkins[skin.name]) || 0;
      } else if (skin.id !== undefined && userSkins[skin.id] !== undefined) {
        rawInput = parseInt(userSkins[skin.id]) || 0;
      }
      
      // Ha 60 vagy alatti, akkor az szint, tehát arányosítjuk a maximum (skin.value) alapján
      const rawStatValue = rawInput <= 60 ? Math.floor((rawInput / 60) * (skin.value || 0)) : rawInput;
      if (rawStatValue > 0) {
        addBonus(skin.attribute, rawStatValue);
      }
    });
  }

  // --- ARTIFACTS (Szint és Csillag alapú számítás) ---
  // A szorzók a 6 csillagos maximumhoz (1.0) képest vannak megadva a Dominion Era-ban.
  const STAR_MULTIPLIERS = [0, 0.05, 0.1, 0.15, 0.25, 0.4, 1.0]; // csillagszorzók (0-6 csillag)

  // Ring (Primary stats)
  const ringLvl = parseInt(userHeroData.artifacts?.ring?.level) || 0;
  const ringStars = parseInt(userHeroData.artifacts?.ring?.stars) || 0;
  const ringAttr = userHeroData.artifacts?.ring?.attribute || mainStat || 'strength';
  if (ringLvl > 0 && ringStars > 0) {
     const ringBonus = Math.floor((ringLvl / 100) * STAR_MULTIPLIERS[ringStars] * 6249);
     if (ringAttr === 'strength') strength += ringBonus;
     else if (ringAttr === 'agility') agility += ringBonus;
     else if (ringAttr === 'intelligence') intelligence += ringBonus;
  }

  // Book (Secondary stats - 2 types)
  const bookLvl = parseInt(userHeroData.artifacts?.book?.level) || 0;
  const bookStars = parseInt(userHeroData.artifacts?.book?.stars) || 0;
  
  if (bookLvl > 0 && bookStars > 0) {
     const bookAttr1 = userHeroData.artifacts?.book?.attribute1 || 'armor';
     const maxVal1 = globalDict.maxArtifactBook[bookAttr1] || 12546;
     const bookBonus1 = Math.floor((bookLvl / 100) * STAR_MULTIPLIERS[bookStars] * maxVal1);
     addBonus(bookAttr1, bookBonus1);

     const bookAttr2 = userHeroData.artifacts?.book?.attribute2 || 'magicDefense';
     const maxVal2 = globalDict.maxArtifactBook[bookAttr2] || 12546;
     const bookBonus2 = Math.floor((bookLvl / 100) * STAR_MULTIPLIERS[bookStars] * maxVal2);
     addBonus(bookAttr2, bookBonus2);
  }

  // Weapon
  const weaponLvl = parseInt(userHeroData.artifacts?.weapon?.level) || 0;
  const weaponStars = parseInt(userHeroData.artifacts?.weapon?.stars) || 0;
  let artifactWeaponBonus = 0;
  let artifactWeaponAttr = userHeroData.artifacts?.weapon?.attribute || (artifactWeapon && artifactWeapon.attribute) || null;
  if (weaponLvl > 0 && weaponStars > 0 && artifactWeaponAttr) {
     const maxWeaponVal = artifactWeapon?.value || 33459;
     artifactWeaponBonus = Math.floor((weaponLvl / 100) * STAR_MULTIPLIERS[weaponStars] * maxWeaponVal);
     // A fegyver (Weapon) ideiglenes harci buffot ad, nem állandó passzív statot, így a statokhoz nem adjuk hozzá
  }

  // --- ASCENSION (Csomópontok arányosítása) ---
  const ascensionRankStr = userHeroData.ascension?.rank || userHeroData.general?.ascension || '0';
  const rankMap = { '0':0, 'I':1, 'II':2, 'III':3, 'IV':4, 'V':5 };
  const rankLvl = rankMap[ascensionRankStr] || 0;
  const maxNodesPerRank = { 1: 10, 2: 11, 3: 10, 4: 10, 5: 10 };

  for (let r = 1; r <= rankLvl; r++) {
      if (dictAscension && dictAscension[r]) {
          // Ha ez a legmagasabb elért rank, megnézzük, hány csomópont (node) aktív
          let nodeRatio = 1.0;
          if (r === rankLvl) {
              const activeNodesCount = userHeroData.ascension?.nodes?.length || 0;
              if (activeNodesCount > 0) {
                  nodeRatio = Math.min(1.0, activeNodesCount / maxNodesPerRank[r]);
              } else if (userHeroData.ascension?.nodes) {
                  // Ha a nodes tömb létezik, de üres, az azt jelenti, hogy 0 node aktív ebben a rankben
                  nodeRatio = 0.0;
              }
          }
          
          Object.entries(dictAscension[r]).forEach(([key, val]) => {
              const adjustedVal = Math.floor(val * nodeRatio);
              addBonus(key, adjustedVal);
          });
      }
  }

  // --- ROLE BRANCH (szerepkör fa bónusz) ---
  const ROLE_BRANCH_MAX_STATS = {
    mage: { health: 39000, magicAttack: 10534, armor: 3168, magicDefense: 4014, magicPenetration: 3490 },
    tank: { health: 81160, physicalAttack: 5001, magicAttack: 1550, armor: 3808, magicDefense: 4132 },
    marksman: { health: 35280, physicalAttack: 8215, armor: 3378, magicDefense: 2416, armorPenetration: 3460 },
    healer: { health: 78620, magicAttack: 8350, armor: 4290, magicDefense: 4604 },
    support: { health: 83240, physicalAttack: 5034, magicAttack: 3024, armor: 3392, magicDefense: 2816 },
    warrior: { health: 40440, physicalAttack: 5411, armor: 3396, magicDefense: 3810, armorPenetration: 5740 },
    control: { health: 80840, magicAttack: 8568, physicalAttack: 1395, armor: 3732, magicDefense: 2630 }
  };

  const branchLevel = parseInt(userHeroData.ascension?.branch) || 0;
  if (branchLevel > 0 && catalogHero?.roles?.[0]) {
      const primaryRole = catalogHero.roles[0].toLowerCase(); // pl. "Tank" -> "tank"
      const maxBranchStats = ROLE_BRANCH_MAX_STATS[primaryRole];
      if (maxBranchStats) {
          const ratio = Math.min(1.0, branchLevel / 50);
          Object.entries(maxBranchStats).forEach(([key, maxVal]) => {
              const branchBonus = Math.floor(maxVal * ratio);
              addBonus(key, branchBonus);
          });
      }
  }

  // 2. Calculate Secondary Stats from Primary Stats
  let bonusHealth = strength * 40;
  let bonusArmor = agility * 1; 
  let bonusPhysicalAttack = agility * 2; 
  let bonusMagicAttack = intelligence * 3;
  let bonusMagicDefense = intelligence * 1;

  if (mainStat === 'strength') bonusPhysicalAttack += strength;
  if (mainStat === 'agility') bonusPhysicalAttack += agility;
  if (mainStat === 'intelligence') bonusPhysicalAttack += intelligence;

  // 3. Add Base Secondary Stats + Flat Bonuses
  const health = Math.floor((base.health || 0) + bonusHealth + flatBonuses.health);
  const physicalAttack = Math.floor((base.physicalAttack || 0) + bonusPhysicalAttack + flatBonuses.physicalAttack);
  const magicAttack = Math.floor((base.magicAttack || 0) + bonusMagicAttack + flatBonuses.magicAttack);
  const armor = Math.floor((base.armor || 0) + bonusArmor + flatBonuses.armor);
  const magicDefense = Math.floor((base.magicDefense || 0) + bonusMagicDefense + flatBonuses.magicDefense);

  // --- POWER (ERŐ) CALCULATION ---
  // The raw stats without primary stat derivation
  let rawHealth = (base.health || 0) + flatBonuses.health;
  let rawPA = (base.physicalAttack || 0) + flatBonuses.physicalAttack;
  let rawMA = (base.magicAttack || 0) + flatBonuses.magicAttack;
  let rawArmor = (base.armor || 0) + flatBonuses.armor;
  let rawMD = (base.magicDefense || 0) + flatBonuses.magicDefense;

  const pF = globalDict.power;
  let power = 
    (strength * pF.strength) + 
    (agility * pF.agility) + 
    (intelligence * pF.intelligence) +
    (rawHealth * pF.health) + 
    (rawPA * pF.physicalAttack) + 
    (rawMA * pF.magicAttack) + 
    (rawArmor * pF.armor) + 
    (rawMD * pF.magicDefense) + 
    (flatBonuses.dodge * pF.dodge) + 
    (flatBonuses.armorPenetration * pF.armorPenetration) + 
    (flatBonuses.magicPenetration * pF.magicPenetration) + 
    (flatBonuses.critHitChance * pF.critHitChance);

  // Weapon (1. ereklye) buff bónusz hozzáadása a Powerhez (0.5-ös szorzóval)
  if (artifactWeaponAttr && artifactWeaponBonus > 0) {
      const pFactor = pF[artifactWeaponAttr] || 0;
      power += (artifactWeaponBonus * 0.5 * pFactor);
  }

  // Skills Power Cost
  const skills = userHeroData.skills || [];
  let totalSkillCost = 0;
  if (skills[0]) totalSkillCost += parseInt(skills[0]); // White
  if (skills[1]) totalSkillCost += parseInt(skills[1]); // Green
  if (skills[2]) totalSkillCost += (parseInt(skills[2]) + 20); // Blue
  if (skills[3]) totalSkillCost += (parseInt(skills[3]) + 40); // Violet
  power += (totalSkillCost * 20);

  power = Math.floor(power);

  return {
    power,
    primary: { strength, agility, intelligence, mainStat },
    secondary: { 
      health, physicalAttack, magicAttack, armor, magicDefense,
      dodge: flatBonuses.dodge,
      critHitChance: flatBonuses.critHitChance,
      armorPenetration: flatBonuses.armorPenetration,
      magicPenetration: flatBonuses.magicPenetration
    }
  };
};
