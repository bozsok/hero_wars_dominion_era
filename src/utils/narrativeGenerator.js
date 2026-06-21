import heroGameSpecs from '../data/heroGameSpecs.json' with { type: 'json' };
import heroRelations from '../data/heroRelations.json' with { type: 'json' };

/**
 * Dinamikus narratív jellemzést generál a játékos aktív csapata alapján.
 * 
 * @param {Array} allHeroes A Context-ből jövő hősök tömbje (statikus + dinamikus adatok egyesítve)
 * @param {Array} teamHeroIds Az aktív csapat hős azonosítóinak tömbje
 * @param {Object} playerProfile A játékos profil adatai
 * @returns {String} A legenerált magyar nyelvű leírás
 */
export const generateNarrativeProfile = (allHeroes, teamHeroIds, playerProfile) => {
  if (!allHeroes || !teamHeroIds || teamHeroIds.length === 0) {
    return "Üdvözlünk a Dominion Trackerben! Még nem állítottál be aktív csapatot a szinkronizált adatokban, vagy az importált HAR fájl nem tartalmazott csapatadatokat. Szinkronizálj új adatokat, vagy válassz egy másik fület!";
  }

  // Csak a hősöket vizsgáljuk (kiszűrjük a peteket, azaz a >= 6000 ID-jú elemeket)
  const activeHeroObjects = teamHeroIds
    .filter(id => parseInt(id, 10) < 6000)
    .map(id => allHeroes.find(h => h.id === id.toString() || h.id == id))
    .filter(Boolean);

  if (activeHeroObjects.length === 0) {
    return "A csapatod jelenleg nem tartalmaz hősöket, csak kísérőket. A teljes elemzéshez kérjük, állíts be hősöket is!";
  }

  const paragraphs = [];

  // --- 1. LÉPÉS: Bevezetés & Frakció vizsgálat ---
  const factionCounts = {};
  activeHeroObjects.forEach(hero => {
    const specs = heroGameSpecs[hero.id] || {};
    if (specs.special) {
      // Lehet több frakciója is vesszővel elválasztva (pl. "Chaos, Demon")
      const factions = specs.special.split(',').map(f => f.trim());
      factions.forEach(fac => {
        factionCounts[fac] = (factionCounts[fac] || 0) + 1;
      });
    }
  });

  // Megkeressük a legdominánsabb frakciót (legalább 3 hősnek kell tartoznia hozzá)
  let dominantFaction = null;
  let maxCount = 0;
  Object.keys(factionCounts).forEach(fac => {
    if (factionCounts[fac] >= 3 && factionCounts[fac] > maxCount) {
      dominantFaction = fac;
      maxCount = factionCounts[fac];
    }
  });

  let introText = "";
  if (dominantFaction && heroRelations.genericFactions[dominantFaction]) {
    introText = `A csapatsorod gerincét és erejét ${heroRelations.genericFactions[dominantFaction]} határozza meg, ami komoly stratégiai előnyt biztosít a szövetségi szinergiákon keresztül.`;
  } else {
    // Ha nincs domináns frakció, a szerepkörök szerinti stílust írjuk le
    const roles = activeHeroObjects.flatMap(h => h.roles || []);
    const mageCount = roles.filter(r => r === "Mage").length;
    const marksmanCount = roles.filter(r => r === "Marksman").length;
    
    if (mageCount >= 2) {
      introText = "Csapatod egy sokoldalú, mágiára és területre ható (AoE) varázssebzésre épülő összeállítás, amely képes gyorsan megsemmisíteni az ellenfél védelmi vonalait.";
    } else if (marksmanCount >= 2) {
      introText = "Összeállításod a precíz, távolsági fizikai sebzésre és kritikus csapásokra fókuszál, folyamatos és erős nyomás alatt tartva az ellenfél frontvonalát.";
    } else {
      introText = "Egy kiegyensúlyozott, több különböző szövetségből építkező vegyes formációval indulsz harcba, amely rugalmasságával képes alkalmazkodni a váratlan helyzetekhez.";
    }
  }
  paragraphs.push(introText);

  // --- 2. LÉPÉS: Specifikus Szinergiák keresése ---
  const foundSynergyTexts = [];
  const teamIdStrings = activeHeroObjects.map(h => h.id.toString());

  heroRelations.synergies.forEach(syn => {
    // Ellenőrizzük, hogy a szinergiában résztvevő összes hős benne van-e a csapatban
    const hasAll = syn.heroes.every(heroId => teamIdStrings.includes(heroId));
    if (hasAll) {
      foundSynergyTexts.push(syn.description);
    }
  });

  if (foundSynergyTexts.length > 0) {
    paragraphs.push(`A csatatéren azonnal szembetűnnek a hősök közötti szoros taktikai kapcsolatok: ${foundSynergyTexts.join(" Emellett ")}`);
  }

  // --- 3. LÉPÉS: Legerősebb hős kiemelése ---
  // Megkeressük a legnagyobb erejű hőst a csapatban
  let strongestHero = activeHeroObjects[0];
  let maxPower = activeHeroObjects[0]?.general?.power || 0;

  activeHeroObjects.forEach(hero => {
    const power = hero.general?.power || 0;
    if (power > maxPower) {
      strongestHero = hero;
      maxPower = power;
    }
  });

  if (strongestHero && maxPower > 0) {
    const summary = strongestHero.description?.summary || "a csapat meghatározó oszlopa.";
    // Megtisztítjuk a summary-t az esetleges ponttól a végén, hogy szebben illeszkedjen
    const cleanSummary = summary.endsWith('.') ? summary.slice(0, -1) : summary;
    paragraphs.push(`A formáció vitathatatlan vezéregyénisége és bástyája **${strongestHero.name}** (Erő: ${maxPower.toLocaleString('hu-HU')}), aki ${cleanSummary.charAt(0).toLowerCase() + cleanSummary.slice(1)}.`);
  }

  // --- 4. LÉPÉS: Szerepkörök és egyensúly elemzése ---
  const tankCount = activeHeroObjects.filter(h => (h.roles || []).includes("Tank")).length;
  const healerCount = activeHeroObjects.filter(h => (h.roles || []).includes("Healer")).length;
  const supportCount = activeHeroObjects.filter(h => (h.roles || []).includes("Support")).length;

  let balanceText = "";
  if (tankCount === 0) {
    balanceText = "Figyelemre méltó, hogy a csapatodból hiányzik a hagyományos, első vonalbeli Tank. Ez rendkívül sebezhetővé teszi a középső és hátsó sorokat, ugyanakkor maximális sebzés-potenciált biztosít a gyors rohamokhoz.";
  } else if (tankCount >= 2) {
    balanceText = "A kettős tank felállás rendkívül masszív és áttörhetetlen védelmi vonalat biztosít a csapatnak, de lassíthatja az ellenfél kisöprését a sebzők alacsonyabb száma miatt.";
  } else {
    // 1 tank van
    if (healerCount > 0) {
      balanceText = "Az 1 Tank és a mögötte álló Gyógyító stabil, klasszikus egyensúlyt teremtenek. Ez a felállás ideális a hosszan elhúzódó csatákhoz, ahol a túlélés és a fokozatos felőrlés a cél.";
    } else if (supportCount > 0) {
      balanceText = "A magányos tankot közvetlenül Támogató (Support) hősök segítik, ami gyors energiaszerzést, pajzsokat vagy hatásos gyengítéseket (debuffokat) biztosít a harc korai szakaszában.";
    } else {
      balanceText = "A csapatod egyetlen frontvonalbeli tankra támaszkodik, miközben a mögötte lévő sorok teljes mértékben a tiszta sebzésosztásra koncentrálnak.";
    }
  }
  paragraphs.push(balanceText);

  // Összefűzzük a bekezdéseket dupla sorközzel, hogy többsoros, szép elrendezést kapjunk
  return paragraphs.join("\n\n");
};
