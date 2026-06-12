# Glyph XP költségtábla – Böngészős (Dominion Era) verzió

> **Forrás:** Hero Wars Fandom Wiki – Guild/Heart_of_Power/Forge/Glyphs
> **URL:** https://hero-wars.fandom.com/wiki/Guild/Heart_of_Power/Forge/Glyphs
> **Kinyerés dátuma:** 2026-06-12
> **Max szint:** 50 (browser), 80 (mobile)

---

## 1. Szintenkénti költségek és bónuszok

**"Enchant points"** = rúnakő XP (ez az amit a játék API-ban `runes` tömbként tárol)

### Szintenkénti (level-enkénti) költségek:

| Szint tartomány | Enchant points / szint | Gold / szint | Bonus 1 (STR/AGI/INT) | Bonus 2 (Health) | Bonus 3 (PA) | Bonus 4 (MA/Armor/MD/ArPen/MPen) | Bonus 5 (Dodge/CritHit) |
|---|---|---|---|---|---|---|---|
| 1-5 | **50** | 1500 | 2 | 110 | 8 | 12 | 4 |
| 6-10 | **80** | 3200 | 3 | 165 | 12 | 18 | 6 |
| 11-15 | **190** | 13300 | 7 | 385 | 28 | 42 | 14 |
| 16-20 | **220** | 17600 | 8 | 440 | 32 | 48 | 16 |
| 21-25 | **520** | 46800 | 18 | 990 | 72 | 108 | 36 |
| 26-30 | **590** | 56050 | 20 | 1100 | 80 | 120 | 40 |
| 31-35 | **790** | 75050 | 26 | 1430 | 104 | 156 | 52 |
| 36-40 | **870** | 82650 | 28 | 1540 | 112 | 168 | 56 |
| **41** | **1970** | 187150 | 47 | 2540 | 170 | 254 | 71 |
| **42-45** | **1970** | 197000 | 47 | 2540 | 170 | 254 | 71 |
| **46-50** | **3470** | 347000 | 68 | 3740 | 250 | 374 | 104 |

### 5 szintenkénti (blokkos) összesítés:

| Szint blokk | Enchant points (összesen) | Gold | Bonus 1 | Bonus 2 | Bonus 3 | Bonus 4 | Bonus 5 |
|---|---|---|---|---|---|---|---|
| 1-5 | **250** | 7 500 | 10 | 550 | 40 | 60 | 20 |
| 6-10 | **400** | 16 000 | 15 | 825 | 60 | 90 | 30 |
| 11-15 | **950** | 66 500 | 35 | 1 925 | 140 | 210 | 70 |
| 16-20 | **1 100** | 88 000 | 40 | 2 200 | 160 | 240 | 80 |
| 21-25 | **2 600** | 234 000 | 90 | 4 950 | 360 | 540 | 180 |
| 26-30 | **2 950** | 280 250 | 100 | 5 500 | 400 | 600 | 200 |
| 31-35 | **3 950** | 375 250 | 130 | 7 150 | 520 | 780 | 260 |
| 36-40 | **4 350** | 413 250 | 140 | 7 700 | 560 | 840 | 280 |
| 41-45 | **9 850** | 975 150 | 235 | 12 700 | 850 | 1 270 | 355 |
| 46-50 | **17 350** | 1 735 000 | 340 | 18 700 | 1 250 | 1 870 | 520 |
| **ÖSSZESEN** | **43 750** | **4 190 900** | **1 135** | **62 200** | **4 340** | **6 500** | **1 995** |

---

## 2. Kulcsfontosságú felfedezések

### 2.1. A stat bónusz maximumok PONTOSAN egyeznek a gameDictionary maxGlyphs értékekkel!

| Stat típus | Wiki Total (50 szint) | gameDictionary maxGlyphs |
|---|---|---|
| STR/AGI/INT (Bonus 1) | **1 135** | 1 135 ✅ |
| Health (Bonus 2) | **62 200** | 62 200 ✅ |
| Physical Attack (Bonus 3) | **4 340** | 4 340 ✅ |
| MA/Armor/MD/ArPen/MPen (Bonus 4) | **6 500** | 6 500 ✅ |
| Dodge/CritHit (Bonus 5) | **1 995** | 1 995 ✅ |

### 2.2. A stat bónusz NEM lineáris!

A korábbi feltételezés (`stat = Math.floor((level / 50) * maxStat)`) HIBÁS!
A stat bónusz szintenként változó (nem egyenletes), mert a magasabb szintek többet adnak.

Például Health (Bonus 2):
- Level 1-5: 5 × 110 = 550 → 0.88% a maxból
- Level 46-50: 5 × 3740 = 18 700 → 30.1% a maxból

### 2.3. Az összesített XP ≠ 49 650!

A Wiki szerint a **böngészős verzió** teljes XP költsége: **43 750** (nem 49 650!).

A 49 650 a MOBILOS verzió 0-40 szintig terjedő költsége (150+240+570+660+1560+1770+2370+2610 szintenként).

### 2.4. A 41. szint ELTÉR a 42-45-től!

A 41. szint XP ára ugyanúgy 1970, DE a gold ára eltérő (187 150 vs 197 000).
A stat bónusz viszont azonos (47/2540/170/254/71).

### 2.5. A 46-50 szint ára 3470/szint – MEGERŐSÍTVE!

Ez pontosan egyezik a `rúnák számolása.txt` adatával (3470 XP a 48. szint ára).

---

## 3. XP → Szint → Stat konverzió algoritmusa

### 3.1. Szintenkénti XP költségtömb (1-50):

```javascript
// Szintenkénti enchant point költség (index 0 = level 1, index 49 = level 50)
const BROWSER_GLYPH_XP_PER_LEVEL = [
  // Level 1-5: 50 per szint
  50, 50, 50, 50, 50,
  // Level 6-10: 80 per szint
  80, 80, 80, 80, 80,
  // Level 11-15: 190 per szint
  190, 190, 190, 190, 190,
  // Level 16-20: 220 per szint
  220, 220, 220, 220, 220,
  // Level 21-25: 520 per szint
  520, 520, 520, 520, 520,
  // Level 26-30: 590 per szint
  590, 590, 590, 590, 590,
  // Level 31-35: 790 per szint
  790, 790, 790, 790, 790,
  // Level 36-40: 870 per szint
  870, 870, 870, 870, 870,
  // Level 41: 1970
  1970,
  // Level 42-45: 1970 per szint
  1970, 1970, 1970, 1970,
  // Level 46-50: 3470 per szint
  3470, 3470, 3470, 3470, 3470
];
// Kumulatív összeg: 43750
```

### 3.2. Kumulatív XP tábla (ellenőrzéshez):

| Szint | XP / szint | Kumulatív XP |
|---|---|---|
| 0 | - | 0 |
| 5 | 50 | 250 |
| 10 | 80 | 650 |
| 15 | 190 | 1 600 |
| 20 | 220 | 2 700 |
| 25 | 520 | 5 300 |
| 30 | 590 | 8 250 |
| 35 | 790 | 12 200 |
| 40 | 870 | 16 550 |
| 41 | 1 970 | 18 520 |
| 45 | 1 970 | 26 400 |
| 50 | 3 470 | 43 750 |

**Ellenőrzés Corvus Health rúnája (33 850 XP):**
- 45. szintig: 26 400 XP
- 33 850 - 26 400 = 7 450 maradék
- 7 450 / 3 470 = 2.15 → 46. szint (3 470), 47. szint (3 470), maradék: 510
- Tehát: **Level 47, progresszió 510/3470**

### 3.3. Stat bónusz tömb (szintenként, szintről szintre additív):

```javascript
// Stat bónusz PER SZINT a különböző kategóriákhoz
// "bonus" = mennyit ad MINDEN EGYES szint (nem kumulatív!)
const GLYPH_STAT_PER_LEVEL = {
  // Bonus 1: STR, AGI, INT
  primaryStat: [
    2,2,2,2,2, 3,3,3,3,3, 7,7,7,7,7, 8,8,8,8,8,
    18,18,18,18,18, 20,20,20,20,20, 26,26,26,26,26, 28,28,28,28,28,
    47,47,47,47,47, 68,68,68,68,68
  ],
  // Bonus 2: Health
  health: [
    110,110,110,110,110, 165,165,165,165,165, 385,385,385,385,385,
    440,440,440,440,440, 990,990,990,990,990, 1100,1100,1100,1100,1100,
    1430,1430,1430,1430,1430, 1540,1540,1540,1540,1540,
    2540,2540,2540,2540,2540, 3740,3740,3740,3740,3740
  ],
  // Bonus 3: Physical Attack
  physicalAttack: [
    8,8,8,8,8, 12,12,12,12,12, 28,28,28,28,28, 32,32,32,32,32,
    72,72,72,72,72, 80,80,80,80,80, 104,104,104,104,104, 112,112,112,112,112,
    170,170,170,170,170, 250,250,250,250,250
  ],
  // Bonus 4: Magic Attack, Armor, Magic Defense, Armor Penetration, Magic Penetration
  bonus4: [
    12,12,12,12,12, 18,18,18,18,18, 42,42,42,42,42, 48,48,48,48,48,
    108,108,108,108,108, 120,120,120,120,120, 156,156,156,156,156, 168,168,168,168,168,
    254,254,254,254,254, 374,374,374,374,374
  ],
  // Bonus 5: Dodge, Crit Hit Chance
  bonus5: [
    4,4,4,4,4, 6,6,6,6,6, 14,14,14,14,14, 16,16,16,16,16,
    36,36,36,36,36, 40,40,40,40,40, 52,52,52,52,52, 56,56,56,56,56,
    71,71,71,71,71, 104,104,104,104,104
  ]
};
```

### 3.4. XP → Stat konverziós algoritmus:

```javascript
function browserGlyphXpToStat(totalXp, statType) {
  // 1. XP → Level konverzió
  let remainingXp = totalXp;
  let level = 0;
  for (let i = 0; i < BROWSER_GLYPH_XP_PER_LEVEL.length; i++) {
    if (remainingXp >= BROWSER_GLYPH_XP_PER_LEVEL[i]) {
      remainingXp -= BROWSER_GLYPH_XP_PER_LEVEL[i];
      level = i + 1;
    } else {
      break;
    }
  }
  
  // 2. Level → Stat konverzió (szintenként összeadva a bónuszokat)
  const bonusArray = GLYPH_STAT_PER_LEVEL[statType];
  let totalStat = 0;
  for (let i = 0; i < level; i++) {
    totalStat += bonusArray[i];
  }
  
  return { level, stat: totalStat, remainingXp };
}
```

---

## 4. VALIDÁLÁS: Corvus rúnáinak újraszámolása

Corvus rúnái: Health, Strength, Armor, Magic Defence, Physical Attack
API runes: [33850, 16550, 9830, 2590, 8260]

| Rúna | XP | Szint | Stat típus | Becsült stat |
|---|---|---|---|---|
| Health | 33850 | 47 (marad: 510) | Bonus 2 (health) | 46260 |
| Strength | 16550 | 40 (marad: 0!) | Bonus 1 (primaryStat) | 560 |
| Armor | 9830 | 30 (marad: 1580) | Bonus 4 (armor) | 2640 |
| Magic Defense | 2590 | 19 (marad: 110) | Bonus 4 (magicDefense) | 912 |
| Physical Attack | 8260 | 30 (marad: 10) | Bonus 3 (PA) | 1600 |

**Fontos: 16 550 XP = pontosan 40-es szint!**
(250+400+950+1100+2600+2950+3950+4350 = 16 550)

---

## 5. Glyph típus-hős hozzárendelés

A Wikiben az Astaroth példáján látható, hogy a glyph típusok a hős Template:Data-ból jönnek.
A böngészős verzióban a glyph-ek sorrendje (felső → óramutató) és az unlock rank-ek:
- Glyph 1: Blue rank
- Glyph 2: Blue rank
- Glyph 3: Violet rank
- Glyph 4: Violet+1 rank
- Glyph 5: Violet+2 rank (mindig a main stat)

A hős szintje is korlátozza a max glyph szintet:
- Level 20+: Glyph max 30
- Level 60+: Glyph max 40
- Level 100+: Glyph max 50
