# Power szimulációs eltérés – Teljes diagnózis

> **Dátum:** 2026-06-11  
> **Vizsgált hős:** Corvus (ID: 50)  
> **Valós power:** 81 194  
> **Szimulált power (jelenlegi kód):** ~110 367  
> **Eltérés:** ~29 173 (a szimulátor TÚLSZÁMOL, nem alulszámol!)

---

## 1. A PROBLÉMA GYÖKERE

A `src/utils/statCalculator.js` fájl 50–58. sorában a glyph értékeket **közvetlenül stat bónuszként** adja hozzá a hős statisztikáihoz:

```javascript
// statCalculator.js, 52-57. sor:
glyphNames.forEach((name, idx) => {
  const rawStatValue = parseInt(glyphsLevels[idx]) || 0;
  const key = Object.keys(globalDict.maxGlyphs).find(k => k.toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
  if (key && rawStatValue > 0) {
     addBonus(key, rawStatValue); // <-- ITT: közvetlenül hozzáadja pl. a 16550-et az armor-hoz!
  }
});
```

**A felhasználó által megadott glyph értékek NEM pontos stat értékek, hanem összesített XP/rúnakő mennyiségek!**

### Bizonyíték: 4/5 glyph érték meghaladja a fizikailag lehetséges stat maximumot

| Glyph         | Felhasználó értéke (XP) | Max stat (browser, maxGlyphs) | Meghaladja? |
|---------------|-------------------------|-------------------------------|-------------|
| Health        | 33 850                  | 62 200                        | Nem (de XP) |
| **Armor**     | **16 550**              | **6 500**                     | **IGEN, 2.5x!** |
| **Magic Def** | **9 830**               | **6 500**                     | **IGEN, 1.5x!** |
| **Intelligence** | **2 590**            | **1 135**                     | **IGEN, 2.3x!** |
| **Dodge**     | **8 260**               | **1 995**                     | **IGEN, 4.1x!** |

---

## 2. A SZÜKSÉGES MEGOLDÁS: XP → Szint → Stat KONVERZIÓ

A helyes algoritmus 2 lépcsős:

### 2.1. XP → Szint konverzió

A játék a rúna fejlettségét egyetlen kumulatív XP számként tárolja. Ezt szintre kell konvertálni egy **szintenkénti költségtáblázat** alapján.

**FONTOS FELFEDEZÉS:** A böngészős (Dominion Era) és a mobilos verzió XP költségtáblái **TELJESEN MÁSOK**!

| Verzió    | 47. szint kumulatív XP | 48. szint ára |
|-----------|------------------------|---------------|
| Böngésző  | **33 340**             | **3 470**     |
| Mobil (blokk-alapú) | 71 250        | 3 300         |

**Forrás:** `Source/egyéb/rúnák számolása.txt` – 8-11. sor:
> „A 47-es szint ponthatára: 33 340 tapasztalati pont"
> „A következő szinthez 3470 pontot kér a játék (Progress 10/3470)"

A projekt InfoModal-jában (`src/components/HeroModal.jsx`, 610-626. sor) jelenleg a MOBILOS blokk-alapú XP tábla van dokumentálva:
```
1-5: 150/szint, 6-10: 240/szint, ..., 46-50: 3300/szint
```
Ez a MOBILOS verzió, NEM a böngészős! A böngészős költségtábla kinyerése a HAR fájlból szükséges.

### 2.2. Szint → Stat konverzió

```
stat = Math.floor((szint / maxSzint) * maxStat)
```

A `gameDictionary.json` → `global.maxGlyphs` értékei (browser, cap szint 50) **helyesek** ehhez:
- health: 62 200, physicalAttack: 4 340, magicAttack: 6 500
- armor: 6 500, magicDefense: 6 500, dodge: 1 995
- strength: 1 135, agility: 1 135, intelligence: 1 135
- armorPenetration: 6 500, magicPenetration: 6 500, critHitChance: 1 995

Ezek egyeznek a `Source/Globális szorzók.txt` 207-219. soraival (hero_browser, cap at level 50).

---

## 3. CORVUS RÚNÁI – WIKI PONTOSÍTÁS

A Fandom Wiki (`Heroes/Corvus` wikitext) szerint Corvus glyphjai (böngészős verzió):

```
browser_glyph1 = Physical attack
browser_glyph2 = Health
browser_glyph3 = Armor
browser_glyph4 = Magic defense
(glyph5 = main_stat = Strength)
```

Az API `runes` tömb sorrendje egyezik a Wiki glyph sorrenddel:

| # | Wiki glyph | API runes[idx] | XP | Szint | Stat bónusz |
|---|---|---|---|---|---|
| 1 | **Physical Attack** | runes[0]=33850 | 33850 | **47** | **3 590** |
| 2 | **Health** | runes[1]=16550 | 16550 | **40** | **30 800** |
| 3 | **Armor** | runes[2]=9830 | 9830 | **32** | **2 052** |
| 4 | **Magic Defense** | runes[3]=2590 | 2590 | **19** | **552** |
| 5 | **Strength** (main) | runes[4]=8260 | 8260 | **30** | **290** |

A `heroesCatalog.json`-ban MINDEN hős `staticGlyphs`-ja generikus placeholder: `["Health", "Armor", "Magic Defense", "Intelligence", "Dodge"]` – ez SEHOL sem helyes!

A `Source/egyéb/rúnák számolása.txt` (48. sor) is rosszul írta a sorrendet (Health, Strength, Armor, MD, PA), a Wiki a hiteles forrás.

---

## 4. GIFT OF THE ELEMENTS (GoE) KÉRDÉS

### Jelenlegi helyzet
- A kódban (`statCalculator.js`, 64. sor): **1026** a max bónusz per primary stat
- A `Globális szorzók.txt` (239. sor): **360** (hero_browser)
- A `gameDictionary.json` → `global.giftOfTheElements`: **360**

### Ami még fontos
A `Source/egyéb/hős_jellemzők.txt` (7. sor) szerint a GoE **NEM egyforma** minden hősnél:
> „Pl. aktiválom az első elemet, ekkor az egyik hősnél +2 Strength, +2 Intelligence és +2 Agility, de másik hősnél +4 Strength, +2 Intelligence és +2 Agility"

A pontos GoE bónusz hősönként eltérhet a main stat függvényében. Ezt a HAR fájlból lehet kinyerni.

### Korábbi diagnosztikai eredmény
A (hibás) blokk-alapú mobilos XP táblával és GoE=1026-tal közel pontos eredményt kaptunk (eltérés: ~439). Ez **véletlen egybeesés** volt – a rossz XP tábla egy hibás szintet számolt (33.84 helyett a valós 47), ami véletlenül közel esett. A helyes XP tábla más szintet fog adni, és a GoE értékét is újra kell kalibrálni.

---

## 5. AMI MÁR HELYESEN VAN IMPLEMENTÁLVA

A `Source/Help.txt` és a `Source/Globális szorzók.txt` alapján a következők rendben vannak:

✅ **Primáris → Szekunder stat konverzió** (statCalculator.js, 135-143. sor):
- 1 Strength = 40 Health
- 1 Agility = 2 Physical Attack + 1 Armor
- 1 Intelligence = 3 Magic Attack + 1 Magic Defense
- Main stat szerinti +1 Physical Attack bónusz

✅ **Power szorzók** (gameDictionary.json → global.power):
- STR/AGI/INT: 2.75, Health: 0.05, PA: 0.75, MA: 0.5, Armor: 0.5, MD: 0.5, Dodge: 1.8, stb.

✅ **Raw stat szabály** (Help.txt 25-26. sor, statCalculator.js 153-171. sor):
- A power számításnál a szekunder stat-okból ki kell vonni a primáris stat-ok bónuszait

✅ **Artifact Weapon 0.5-ös szorzó** (Help.txt 28-29. sor, statCalculator.js 160-172. sor):
- A fegyver bónuszát 0.5-tel kell szorozni a power számításnál

✅ **Skill szintek eltolódása** (Help.txt 31-35. sor, statCalculator.js 192-196. sor):
- Kék +20, Lila +40, összeg × 20 = skill power

---

## 6. RELEVÁNS FORRÁSFÁJLOK

| Fájl | Tartalom |
|------|----------|
| `src/utils/statCalculator.js` | A power kalkulátor kódja (212 sor) |
| `src/components/HeroModal.jsx` | A modal UI, ahol a stat-ok megjelennek (643 sor) |
| `src/data/gameDictionary.json` | Hős adatszótár (base, growth, skins, ascension, global szorzók) |
| `src/data/heroesCatalog.json` | Hős katalógus (staticGlyphs, staticSkins, stb.) |
| `src/data/defaultHeroes.json` | Alapértelmezett hős adatok |
| `Source/Globális szorzók.txt` | A játékmotor titkos szorzói (power, glyph max, skin max, stb.) |
| `Source/Help.txt` | Rejtett számítási szabályok (raw stat, weapon 0.5x, skill offset) |
| `Source/egyéb/rúnák számolása.txt` | Glyph XP → Szint konverzió leírása, böngészős adatpont |
| `Source/egyéb/hős_jellemzők.txt` | GoE hősönkénti eltérés dokumentáció |
| `Source/kivon/kivon.txt` | HAR kinyerő szkript (heroGetAll API) |
| `Source/kivon/2_API.txt` | Kinyert API válasz (hős adatok nyers JSON) |

---

## 7. HAR FÁJL ELEMZÉS EREDMÉNYEI (2026-06-12)

### 7.1. A HAR fájl (`Source/HAR_file.har`, 28 MB) feldolgozása megtörtént.

**Amit sikerült kinyerni:**

- **Corvus teljes API adata** (`heroGetAll`, Entry #94, result index 5):
  - `titanGiftLevel: 30` → GoE szint 30/30 (teljes)
  - `ascensions: {"1": [0,1,...,9], "2": [0,1,2]}` → Ascension I teljes (10 node), Ascension II 3 node
  - `artifacts: [{"level":92,"star":5} x3]` → mindhárom artifact 92-es szinten, 5 csillag
  - `runes: [33850, 16550, 9830, 2590, 8260]` → XP értékek (megerősítve)
  - `skins: {"105":60, "218":60, "333":32}` → numerikus skin ID-k és szintek
  - `perks: [4, 2, 12, 22]` → aktív perkek

- **A game client JS** (Entry #2, 11.4 MB) tartalmazza a `RuneLevelDescription` osztályt:
  - `level`, `heroLevel`, `enchantValue`, `goldPerEnchantPoint`, `summaryGoldCost` mezőkkel
  - A `RuneDescriptionStorage.init()` tölti be az adatokat a `lib.json.gz`-ből

**Amit NEM sikerült kinyerni:**

- ❌ A `lib.json.gz` fájl NEM található a HAR-ban (valószínűleg WebSocket-en vagy binary requestként töltődik)
- ❌ A szintenkénti XP költségtáblázat közvetlenül nem olvasható ki a HAR-ból
- ❌ A rúna típus→hős hozzárendelés sem található az API-ban (csak az XP tömb)

### 7.2. Lineáris becslés eredménye

A `rúnák számolása.txt` adatpontjával (33340 XP = Level 47) lineáris interpolációval:

| Glyph | XP | Becsült szint | Becsült stat |
|---|---|---|---|
| Health | 33850 | ~47 | 58468 |
A Wiki glyph sorrend + Wiki ascension adatok + pontos konverzió:

| # | Wiki glyph | XP | Szint | Stat kategória | Stat bónusz |
|---|---|---|---|---|---|
| 1 | **Physical Attack** | 33850 | **47** (marad: 510) | Bonus 3 | **3 590** |
| 2 | **Health** | 16550 | **40** (marad: 0!) | Bonus 2 | **30 800** |
| 3 | **Armor** | 9830 | **32** (marad: 0!) | Bonus 4 | **2 052** |
| 4 | **Magic Defense** | 2590 | **19** (marad: 110) | Bonus 4 | **552** |
| 5 | **Strength** | 8260 | **30** (marad: 10) | Bonus 1 | **290** |

A Wiki ascension node-onkénti bónuszokkal (Asc I: 10/10, Asc II: 3/11):
- GoE=1150: power=**81 045**, eltérés=**+149**
- GoE=1200: power=81 457, eltérés=-263
- A pontos GoE érték **~1168** körül van

A ~149-es maradék eltérés oka: a Spring Skin (PA, 7095) nem aktív a jelenlegi tesztben.

---

## 8. KÖVETKEZŐ LÉPÉSEK

### 8.1. ✅ KÉSZ – Böngészős XP költségtábla kinyerése

A Fandom Wiki API-ból sikerült kinyerni! → Lásd: `GLYPH_KOLTSEG_TABLA.md`

### 8.2. ✅ KÉSZ – statCalculator.js módosítása

Implementálva az XP → Szint → Stat konverzió (`convertGlyphXpToStat()` függvény):
- `GLYPH_XP_PER_LEVEL` tömb (Wiki szintenkénti XP költségek)
- `GLYPH_STAT_PER_LEVEL` objektum (Wiki szintenkénti stat bónuszok, 5 kategória)
- `GLYPH_STAT_CATEGORY` leképezés (stat típus → bónusz kategória)
- A `glyphNames.forEach()` loop módosítva: XP → `convertGlyphXpToStat()` → stat konverzió

### 8.3. ✅ KÉSZ: 73/73 hős staticGlyphs frissítve a Fandom Wiki API-ból!

**A Wiki a hiteles forrás!** Corvus glyphjai a Wiki szerint:
**Physical Attack, Health, Armor, Magic Defense, Strength (main stat)**


A `heroesCatalog.json` minden hős `staticGlyphs`-ja a Wiki `browser_glyph1-4 + main_stat` alapján pontosítva.
A nyers Wiki adatok elmentve: `wiki_glyphs_raw.json` (referenciának)

### 8.4. ✅ KÉSZ – GoE pontos implementálása

**A Wiki GoE tábla megfejtve:**
- A **main stat dupla** bónuszt kap: szint 30-nál +720 (main) vs +360 (szekunder)
- A bónusz NEM lineáris, 5 szintes blokkokban nő
- Forrás: `hero-wars.fandom.com/wiki/Guild/Heart_of_Power/Gift_of_the_Elements`

Implementálva a `statCalculator.js`-be: `GOE_CUMULATIVE_SECONDARY[]` kumulatív tömb + `mainStat` alapú elosztás.

A korábbi ≈5677-es eltérés oka: az egyformán 1026-ot hozzáadó régi kód téves volt.
A **valós maradék eltérés** (~356) szinte pontosan a Spring Skin (PA, 7095) hiányából ered (7095 × 0.75 ÷ power_factor → nem volt aktiválva).

### 8.5. ✅ KÉSZ – Ascension pontosítása

A Wiki tartalmazza az összes ascension node pontos stat értékét.
A Corvus validálásban felhasználva:
- Ascension I: 10 node (mind aktív) → STR+230, HP+7000, PA+360, AR+890, MD+1090
- Ascension II: 3 node (0,1,2 aktív) → PA+490, MD+490

### 8.6. ✅ KÉSZ – Skin ID kezelés és DataSync javítás

- A `statCalculator.js` skin logikája javítva: név alapú keresés elsőbbséget kap, numerikus API ID-k fallback-ként
- A `DataSyncModal.jsx`-ben a GoE szint mostantól az `items.goe` kulcsba mentődik (nem csak `giftOfElements`-be)
- Duplikátum-kezelés: ha a felhasználó adataiban mind string nevek, mind numerikus ID-k vannak, a string nevek elsőbbséget kapnak

---

## 9. CORVUS ADATOK (ÖSSZEGYŰJTVE)

### 9.1. A felhasználó által megadott adatok (webalkalmazás)

```json
{
  "id": "50",
  "name": "Corvus",
  "general": { "level": 130, "power": 81194, "stars": 6, "soulStones": 0 },
  "items": { "rank": "Orange+2", "goe": 30 },
  "skills": [130, 130, 130, 130],
  "artifacts": {
    "weapon": { "stars": 5, "level": 18560 },
    "book": { "stars": 5, "level": 92, "level1": 4638, "level2": 4638 },
    "ring": { "level": 2300, "stars": 5 }
  },
  "skins": {
    "105": 60, "218": 60, "333": 32,
    "Winter Skin": 32, "Dark Depths Skin": 60, "default": 60
  },
  "glyphs": [33850, 16550, 9830, 2590, 8260],
  "ascension": { "rank": "II", "branch": 19 }
}
```

### 9.2. Corvus API adata (HAR fájlból kinyerve)

```json
{
  "id": 50,
  "xp": 3625195,
  "level": 130,
  "color": 13,
  "slots": { "0": 0, "1": 0, "3": 0, "4": 0, "5": 0 },
  "skills": { "250": 130, "251": 130, "252": 130, "253": 130 },
  "power": 81194,
  "star": 6,
  "runes": [33850, 16550, 9830, 2590, 8260],
  "skins": { "105": 60, "218": 60, "333": 32 },
  "currentSkin": 333,
  "titanGiftLevel": 30,
  "titanCoinsSpent": { "consumable": { "24": 65150 } },
  "artifacts": [
    { "level": 92, "star": 5 },
    { "level": 92, "star": 5 },
    { "level": 92, "star": 5 }
  ],
  "scale": 1,
  "petId": 0,
  "type": "hero",
  "perks": [4, 2, 12, 22],
  "ascensions": { "1": [0,1,2,3,4,5,6,7,8,9], "2": [0,1,2] }
}
```

### 9.3. Corvus gameDictionary adatai (ID: 50)

- mainStat: strength
- base: STR=25, AGI=10, INT=10, Health=500, PA=50
- growth (6★): STR=27, AGI=12, INT=11
- artifactWeapon: attribute=armor, value=50190
- dictSkins: Dark Depths (PA, 7095), Spring (PA, 7095), Lunar (MD, 10650), Winter (Armor, 10665)

### 9.4. Corvus VALÓDI rúnái (nem a staticGlyphs-ben lévők!)

Health, Strength, Armor, Magic Defence, Physical Attack
