const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'heroesCatalog.json');
let heroes = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const enrichedData = {
  "26": {
    roles: ["Tank", "Mage"], mainStat: "Strength",
    description: {
      summary: "Lilith egy démoni tank és mágia-sebző hős, aki folyamatosan növeli a saját maximális életerejét (Health) a harc során.",
      strengths: ["Folyamatosan növekvő maximális HP a harc végéig", "Hatalmas területi (AoE) mágikus sebzés elölről", "Jó szinergia a Kaos (Chaos) frakcióval (pl. Xesha, Dorian)"],
      weaknesses: ["Kezdetben nagyon alacsony az életereje, időre van szüksége", "Képességei a saját HP-jába kerülnek"]
    }
  },
  "27": {
    roles: ["Tank", "Control"], mainStat: "Strength",
    description: {
      summary: "Luther egy ugró tank, aki az Ultimate képességével egyből az ellenség formációjának a közepébe veti magát, hogy káoszt okozzon.",
      strengths: ["A beugrása teljesen megbontja az ellenfél védekezését", "Folyamatos területi kábítás (Stun) a hátsó sorban", "Elvonja a lövészek figyelmét az első vonalról"],
      weaknesses: ["Ha beugrik, a te első vonalad (pl. a lövészeid) védelem nélkül maradhat", "Egyedül hamar fókuszált sebzést kap és meghal"]
    }
  },
  "28": {
    roles: ["Warrior", "Marksman"], mainStat: "Agility",
    description: {
      summary: "Qing Mao egy fürge harcos, akinek a lándzsája az ellenfél maximális életereje (HP) arányában okoz sebzést, így a tankok réme.",
      strengths: ["Százalékos (%-os) sebzés, ami zúzza a magas HP-jú tankokat (pl. Chabba, Cleaver)", "Páncéltörő (Armor Penetration) buffot ad a csapatnak", "Hátralöki az ellenséges tankot"],
      weaknesses: ["Nagyon törékeny, hamar meghal az első vonalban", "A Dodge (kitérő) hősök ellen sokat hibázik"]
    }
  },
  "29": {
    roles: ["Support", "Healer"], mainStat: "Intelligence",
    description: {
      summary: "Dorian egy különleges gyógyító. A körülötte lévő csapattársaknak hatalmas Vámpírizmus (Vampirism) aurát ad, így azok a saját sebzésükkel gyógyítják magukat.",
      strengths: ["Brutális Vámpírizmus (Vampirism) aura a körülötte állóknak", "Még akkor is gyógyít (az aura megmarad), ha ő maga már meghalt!", "Démoni szinergia"],
      weaknesses: ["Csak a közvetlen közelében lévőket gyógyítja", "A csapat pozicionálása kulcsfontosságú (pl. nem jó olyanokkal, akik kiugranak az aurájából)"]
    }
  },
  "30": {
    roles: ["Mage", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Cornelius egy speciális varázsló, aki a játék legmagasabb intelligenciájú (Intelligence) hősére ejt egy hatalmas monolitot.",
      strengths: ["Képes egyetlen ütéssel megölni az ellenség legerősebb mágusát", "Csökkenti az ellenfél varázserejét", "Mágikus védelmet (Magic Defense) ad a csapatnak"],
      weaknesses: ["Nagyon szituációs hős (csak mágusok ellen hasznos)", "Fizikai csapatok ellen szinte teljesen haszontalan"]
    }
  },
  "31": {
    roles: ["Support", "Healer"], mainStat: "Intelligence",
    description: {
      summary: "Jet egy exkluzív (és drága) támogató hős, akinek a specialitása, hogy minden csapattársának megengedi, hogy kritikus sebzést (Critical Hit) okozzanak.",
      strengths: ["Bármelyik hőst kritikussá tudja tenni (pl. Keira, K'arkh)", "Gyorsítja és gyógyítja az első vonalat", "Megakadályozza az ellenfél gyógyulását"],
      weaknesses: ["Nehéz hozzájutni (csak Soul Coin boltban)", "Az életereje elenyésző, könnyen meghal"]
    }
  },
  "32": {
    roles: ["Mage", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Helios a nap mágusa, aki a kritikus (Critical Hit) sebzést okozó hősök legfőbb természetes ellensége (counter).",
      strengths: ["Valahányszor az ellenfél kritikus ütést mér, Helios egy lángoló gömböt lő ki rá büntetésül", "Jó területi varázssebzés", "Páncélt (Armor) ad a csapatnak"],
      weaknesses: ["Sebzése szóródik", "Olyan csapatok ellen, ahol nincs kritikus hős (pl. tiszta mágusok), sokkal kevésbé hatékony"]
    }
  },
  "33": {
    roles: ["Mage", "Control"], mainStat: "Intelligence",
    description: {
      summary: "Lars a híres 'Iker' (Twins) formáció férfi tagja (Krista testvére). Villámmal sebez, és egy hatalmas tornádóval összehúzza az ellenfél formációját.",
      strengths: ["Vízjelekkel (Water mark) megnöveli a villámsebzését", "A tornádója megszakítja az ellenfelek pozícióját", "Brutális szinergia Krista-val"],
      weaknesses: ["Krista nélkül a sebzése nagyon alacsony", "Sérülékeny a hátsó sorba célzó sebzések (pl. Jhu) ellen"]
    }
  },
  "34": {
    roles: ["Mage", "Tank"], mainStat: "Intelligence",
    description: {
      summary: "Krista a híres 'Iker' (Twins) formáció női tagja. Félig tank, félig mágus, aki jégcsapokat (Ice Spikes) idéz az ellenfél lába alá.",
      strengths: ["Ha Lars tornádója áthúzza az ellenfelet a jégcsapokon, a sebzés megsokszorozódik", "Pajzsot idéz magára, így képes tankolni", "Jégtömbbe fagyasztja magát, ha kevés az élete"],
      weaknesses: ["Lars nélkül a jégcsapjai szinte ártalmatlanok", "Lassú az elején"]
    }
  },
  "35": {
    roles: ["Control", "Support"], mainStat: "Strength",
    description: {
      summary: "Jorgen az egyik legjobb irányító hős, aki képes megakadályozni, hogy az ellenfél energiát (Energy) termeljen, így nem tudnak ultimate képességet használni.",
      strengths: ["Energia-blokkoló Ultimate (Leper's Curse)", "Képes ellopni a legelső hős energiáját", "A sebzést az ellenfél hátsó sorára irányítja át", "Kiváló pajzs a legsebezhetőbb csapattársnak"],
      weaknesses: ["A sebzése teljesen elhanyagolható", "Gyakran az ellenfelet segíti, ha a pajzsa nem a megfelelő hősre megy"]
    }
  },
  "36": {
    roles: ["Healer", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Maya egy varázslatos virágot ültet a pálya közepére, amely hatalmas területi gyógyítást ad a csapatnak és méreggel (Pure damage) öli az ellenfelet.",
      strengths: ["Hatalmas folyamatos gyógyítás, amíg a virág él", "Tiszta (Pure) sebzés az ellenfeleknek", "Összehúzza az ellenfeleket a pálya közepére"],
      weaknesses: ["A virága elpusztítható, és akkor a gyógyítás megszűnik", "A gyógyítás lassan pörög fel"]
    }
  },
  "37": {
    roles: ["Marksman"], mainStat: "Strength",
    description: {
      summary: "Jhu egy vadász, aki mindig az ellenfél leghátsó emberét (Support/Healer) támadja, miközben képes sebezhetetlenné válni (I will not die!).",
      strengths: ["Célzottan lövi a hátsó sort", "Az Ultimate képessége alatt nem tud meghalni (Sebezhetetlen)", "A Guild Raid (Hydra) legjobb sebzője"],
      weaknesses: ["Képes a saját életerejét elégetni a támadásaihoz", "Ha az ellenfél hátsó sora jól védett (pl. Martha), Jhu elakad"]
    }
  },
  "38": {
    roles: ["Warrior", "Marksman"], mainStat: "Agility",
    description: {
      summary: "Elmir egy mozgékony harcos, aki a harc elején elöl küzd, majd hátraszaltózik, és klónokat (Mirage) hoz létre maga elé.",
      strengths: ["A klónok elnyelik az ellenfél sebzését és becsapják a célzó rendszert", "Armor Penetration (Páncéltörő) buff a csapatnak", "Kiváló szinergia Daredevil-lel (E.D.D. csapat)"],
      weaknesses: ["Rendkívül törékeny, ha kábítást (Stun) kap mielőtt hátraszaltózna", "Klónjai hamar eltűnnek területre ható (AoE) sebzésnél"]
    }
  },
  "39": {
    roles: ["Tank"], mainStat: "Strength",
    description: {
      summary: "Ziri egy skorpió-királynő tank, aki elássa magát a föld alá, amikor az életereje alacsonyra csökken, hogy regenerálódjon.",
      strengths: ["A játék legmagasabb alappáncéljával (Armor) rendelkezik", "Hatalmas regeneráció, amikor elássa magát", "Kiváló túlélő (Survivor) képességek"],
      weaknesses: ["Amikor elássa magát, a csapat többi tagja védtelen marad az első vonalban", "Kevés hasznot hoz az ellenfél irányításában (Control)"]
    }
  },
  "40": {
    roles: ["Support"], mainStat: "Agility",
    description: {
      summary: "Nebula a játék legfontosabb támogatója. Egy varázslatos gömbbel extrém mértékben felerősíti (Buff) a mellette álló két hős sebzését.",
      strengths: ["Gigantikus bónusz a fizikai és mágikus sebzésre az előtte és mögötte állónak", "Képes gyógyítani és lemosni a negatív (Debuff) hatásokat", "Csökkenti az ellenfelek energiáját"],
      weaknesses: ["Nagyon függ a csapat pozíciójától, ha rossz helyen áll, haszontalan hőst erősít (pl. egy gyógyítót a sebző helyett)"]
    }
  },
  "41": {
    roles: ["Warrior"], mainStat: "Agility",
    description: {
      summary: "K'arkh az egyik legrettegettebb fizikai sebző. Felemeli a levegőbe az ellenfeleit (Knockup), majd csápjaival hatalmas sebzést oszt ki rajtuk.",
      strengths: ["Brutális, egy csapásból ölő (One-shot) fizikai sebzés a levegőben lévőkön", "Kiváló szinergia Faceless-szel vagy Kai-val", "Gyors energia-töltés blokkoláskor"],
      weaknesses: ["Andavari teljes mértékben blokkolja a fellökését, ezáltal a sebzését", "A Vakítás (Blind) hatástalanítja"]
    }
  },
  "42": {
    roles: ["Tank", "Support"], mainStat: "Strength",
    description: {
      summary: "Rufus a mágusok rémálma. A varázslatok sebzéséből nem meghal, hanem gyógyul, és mágikus pajzsokkal védi a csapatot.",
      strengths: ["Fizikailag lehetetlen varázssebzéssel vagy tiszta sebzéssel (Pure) megölni", "Pajzsa elnyeli a mágiát és gyógyítja a csapatot", "Rakhi buff a mágus-csapatok ellen"],
      weaknesses: ["Fizikai sebzéssel nagyon könnyen és gyorsan elpusztítható", "Nagyon specifikus hős (Niche)"]
    }
  },
  "43": {
    roles: ["Healer", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Celeste két formával (Fény és Sötétség) rendelkezik. Fény formában gyógyít és debuffokat mos le, Sötét formában brutális mágia sebzést oszt és megakadályozza az ellenfél gyógyulását.",
      strengths: ["Gyors formaváltás, extrém sokoldalúság", "Blokkolja a teljes ellenséges gyógyulást (Cursed Flame)", "Erős egyszemélyes gyógyítás és tiszta sebzés", "Folyamatosan tölti a Magic Attack artifact buffját"],
      weaknesses: ["Kézi vezérlés nélkül (Auto harcban) kevésbé hatékony, mert rosszkor válthat formát", "Rendkívül törékeny"]
    }
  },
  "44": {
    roles: ["Marksman", "Warrior"], mainStat: "Agility",
    description: {
      summary: "Astrid és Lucas egy egyedi páros. Astrid távolról lő, majd ha betelik az energiája, Lucas (a kedvence) átváltozik egy hatalmas dühös bestiává, és tankol/sebez elöl.",
      strengths: ["Lucas immunis a kábításra és sebzést nyel el az első vonalban", "Kiváló Armor Penetration buff a csapatnak", "Gyors támadások"],
      weaknesses: ["Amíg Lucas nincs dühöngő formában, a sebzésük alacsony", "Lassú tempójú harcot igényelnek"]
    }
  },
  "45": {
    roles: ["Mage"], mainStat: "Intelligence",
    description: {
      summary: "Satori egy rókaszellem, aki rókatüzeket (Fox Fire) helyez az ellenfelekre. Amikor elsüti az ultimate-jét, ezek a tüzek egyszerre robbannak fel hatalmas sebzéssel.",
      strengths: ["Képes egy pillanat alatt megölni az egész ellenséges csapatot", "Bünteti (Fox fire-t tesz) azokat, akik bónusz energiát kapnak (pl. Jorgen, Orion)", "Erős Armor buffot ad"],
      weaknesses: ["Lassú: sokáig tart, mire felrakja a tüzeket", "Ha meghal az ultimate előtt, a sebzése nulla", "Nebula le tudja tisztítani a tüzeket"]
    }
  },
  "46": {
    roles: ["Healer", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Martha a játék legjobb gyógyítója. A hátsó sorban ücsörögve teát főz, amivel extrém területi gyógyítást (Tea Party) biztosít, és felgyorsítja az egész csapatot.",
      strengths: ["A legerősebb és legmegbízhatóbb területi gyógyítás a játékban", "Hatalmas sebesség-bónuszt (Speed) ad a csapatnak", "Hihetetlenül szívós (Tanky) a hátsó sorban, ellenáll Jhu és Cleaver támadásainak"],
      weaknesses: ["Ha elpusztítják a teáskannáját (területi sebzéssel), a gyógyítás leáll", "Nem oszt ki sebzést"]
    }
  },
  "47": {
    roles: ["Support", "Control"], mainStat: "Strength",
    description: {
      summary: "Andavari a K'arkh- és Lars-formációk tökéletes ellenszere. Egy pajzzsal megvédi a legelső hőst minden fellökéstől és húzástól.",
      strengths: ["Tökéletesen blokkolja a helyváltoztató effekteket (Knockup, Pull)", "Masszív pajzsot ad magának vagy a tanknak", "Másodlagos tankként is kiválóan funkcionál"],
      weaknesses: ["Armor Penetration nélkül a saját sebzése nagyon alacsony", "Lövész-alapú csapatok (akik nem lökdösődnek) ellen kevesebb haszna van"]
    }
  },
  "48": {
    roles: ["Support"], mainStat: "Agility",
    description: {
      summary: "Sebastian a kritikus találatot (Critical Hit) okozó hősök legjobb barátja. Ezenkívül pajzsával megvédi a csapatot minden átoktól (Stun, Silence, Mind Control).",
      strengths: ["Extrém mértékben növeli a csapattársak kritikus sebzését (Extra pure damage)", "Lemos és megelőz minden negatív (Control) debuffot a csapatról", "Kiváló szinergia Jet-tel, Daredevil-lel, Yasmine-nal"],
      weaknesses: ["Kritikus sebző nélkül a sebzés-növelő képessége haszontalan", "Nem tud gyógyítani"]
    }
  },
  "49": {
    roles: ["Warrior", "Assassin"], mainStat: "Agility",
    description: {
      summary: "Yasmine egy bérgyilkos, aki az ellenfél legalacsonyabb páncélzatú hőséhez ugrik, megbénítja, és folyamatos kritikus ütéseivel mérgezi.",
      strengths: ["Egyedül képes kiiktatni az ellenfél hátul álló mágusait és gyógyítóit", "Extrém magas kitérési (Dodge) esély", "Kiváló kritikus és tiszta (Méreggel való) sebzés"],
      weaknesses: ["Corvus oltára (Altar) pillanatok alatt megöli", "Helios lánggömbjei a sok kritikus találat miatt azonnal elégetik Yasmine-t"]
    }
  },
  "50": {
    roles: ["Tank", "Support"], mainStat: "Strength",
    description: {
      summary: "Corvus az Élőholtak (Eternity) királya. Egy oltárt (Altar of Souls) idéz meg, amely minden ellenfelet tiszta sebzéssel (Pure damage) büntet, aki megüti a csapatát.",
      strengths: ["Az oltár brutálisan bünteti a területi (AoE) és gyors támadókat (pl. Keira, Yasmine)", "Csökkenti az ellenség Armor és Magic Defense értékét", "Kiváló szinergia lányával, Morrigan-nel"],
      weaknesses: ["Az oltár megsemmisül, ha Corvus sebzést kap", "A tankolási képessége (szívóssága) elmarad Astaroth-tól vagy Cleaver-től"]
    }
  }
};

Object.keys(enrichedData).forEach(id => {
  const heroIndex = heroes.findIndex(h => h.id === id);
  if (heroIndex !== -1) {
    heroes[heroIndex] = { ...heroes[heroIndex], ...enrichedData[id] };
  }
});

fs.writeFileSync(catalogPath, JSON.stringify(heroes, null, 2));
console.log('Heroes 26-50 updated!');
