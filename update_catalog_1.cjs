const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'heroesCatalog.json');
let heroes = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const enrichedData = {
  "1": {
    roles: ["Tank", "Dodge"], mainStat: "Strength",
    description: {
      summary: "Aurora az egyik legjobb kitérő (Dodge) tank a játékban, aki a varázssebzést is kiválóan elnyeli a pajzsával. A 'Way of Nature' frakció alapköve.",
      strengths: ["Extrém magas kitérési (Dodge) esély", "Képes elnyelni és visszaverni a mágikus sebzést", "Kiváló szinergia más 'Way of Nature' hősökkel (pl. Mushy, Alvanor)"],
      weaknesses: ["Nagyon alacsony alap páncél (Armor)", "Kezdetben gyenge, hatalmas nyersanyag-befektetést igényel (Late-game hős)"]
    }
  },
  "2": {
    roles: ["Tank", "Fighter"], mainStat: "Strength",
    description: {
      summary: "Galahad egy agresszív, sebzésre fókuszáló tank, aki hatalmas területre ható (AoE) fizikai sebzést oszt ki, miközben az első vonalban harcol.",
      strengths: ["Magas területi (AoE) fizikai sebzés", "Vámpírizmus (Vampirism) révén képes gyógyítani magát sebzésből", "Kiváló Armor Penetration támogatással nagyon veszélyes"],
      weaknesses: ["Nincs olyan képessége, amivel a csapatát védené", "Nem a legszívósabb tank a játékban"]
    }
  },
  "3": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Keira egy pusztító, gyors lövész, akinek a támadásai átpattannak a célpontokon, így hatalmas területi (AoE) sebzést okoz.",
      strengths: ["Folyamatos és hatalmas területi (AoE) fizikai sebzés", "Képességeivel elnémítja (Silence) az ellenfeleket", "Nagyon gyors támadási sebesség (Armor Penetration buffal pusztító)"],
      weaknesses: ["Nagyon törékeny (squishy), könnyen meghal", "Sok energiát ad az ellenfél csapatának a területi támadásaival"]
    }
  },
  "4": {
    roles: ["Tank", "Support"], mainStat: "Strength",
    description: {
      summary: "Astaroth az egyik legnépszerűbb és legsokoldalúbb tank. Pajzzsal védi a csapatot, és képes feltámasztani egy elesett társát (vagy önmagát).",
      strengths: ["Újraéledés (Resurrection) képesség", "Csapattársak fizikai sebzésének átvállalása", "Démoni szinergia, energia-égetés az ellenféltől", "Páncél (Armor) buffot ad a csapatnak"],
      weaknesses: ["Morrigan megakadályozhatja a feltámasztását", "A sebzés-átvállalás miatt gyorsan meghalhat, ha a hátsó sor nagy sebzést kap"]
    }
  },
  "5": {
    roles: ["Mage"], mainStat: "Intelligence",
    description: {
      summary: "Kai egy mágus, aki fellöki az ellenfeleket a levegőbe, hatalmas varázssebzést okozva. Kiváló szinergiája van K'arkh-hal.",
      strengths: ["Területi fellökés (Knockup) és mágia sebzés", "Vámpírizmus (Vampirism) varázssebzésből", "Kiváló kombó K'arkh-hal"],
      weaknesses: ["Nagyon lassú energia-töltődés", "Önmagában (szinergia nélkül) kevés a sebzése a modern meta mágusokhoz képest"]
    }
  },
  "6": {
    roles: ["Control", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Phobos egy irányító mágus, aki az ellenfél legnagyobb varázssebzésű hősére (Magic Attack) fókuszál, megbénítja és elszívja az energiáját.",
      strengths: ["Célzottan blokkolja az ellenfél legerősebb mágusát", "Energia és életerő elszívása", "Nagy mágikus védelem (Magic Defense) bónuszt ad"],
      weaknesses: ["Fizikai (Physical) sebzők ellen sokkal kevésbé hatékony", "Kevés területi sebzés"]
    }
  },
  "7": {
    roles: ["Healer", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Thea a játék alap gyógyítója, aki területi gyógyítást és csendesítést (Silence) biztosít a csapatának, valamint felgyorsítja az alacsony életerejű társakat.",
      strengths: ["Csendesíti (Silence) a varázslókat", "Megnöveli a sebességét a haldokló csapattársaknak", "Jó területi és egyéni gyógyítás"],
      weaknesses: ["Gyógyítása gyengébb, mint a prémium gyógyítóké (Martha, Celeste)", "Nagyon törékeny"]
    }
  },
  "8": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Daredevil egy robbanékony sebzésű (Crit) lövész. Minél többször támadnak a csapattársai mögötte, annál többet lő ő is.",
      strengths: ["Hatalmas kritikus (Critical) sebzés", "Kiváló szinergia gyorsan támadó hősökkel (pl. Elmir, Dark Star)", "Gyorsan kiiktatja az első vonalat"],
      weaknesses: ["Nagyon függ a csapatösszeállítástól", "Törékeny, védelemre szorul"]
    }
  },
  "9": {
    roles: ["Mage", "Dodge"], mainStat: "Intelligence",
    description: {
      summary: "Heidi egy kitérő varázsló, aki tiszta (Pure) sebzést okoz méreggel. Mivel tiszta sebzést oszt, a páncél és a varázsvédelem sem véd ellene.",
      strengths: ["Területi Tiszta sebzés (Pure damage)", "Nagyon magas kitérés (Dodge)", "Vakítja (Blind) az ellenfeleket"],
      weaknesses: ["Rendkívül alacsony életerő", "Ha eltalálják egy mágia támadással (ami nem tud kitérni), azonnal meghal"]
    }
  },
  "10": {
    roles: ["Control", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Faceless egy sokoldalú irányító, aki képes lemásolni bárki (akár ellenfél) utolsó ultimétjét (Ultimate). Szinergiája K'arkh-hal legendás.",
      strengths: ["Képes lemásolni a legerősebb Ultimate képességeket", "Fellöki (Knockup) az első vonalat", "Hatalmas Magic Penetration buffot ad a csapatnak"],
      weaknesses: ["Kiszámíthatatlan lehet automatikus harcban (rossz képességet másol)"]
    }
  },
  "11": {
    roles: ["Tank", "Control"], mainStat: "Strength",
    description: {
      summary: "Chabba egy masszív tank, akinek a különlegessége, hogy szó szerint lenyeli az ellenfél első vonalbeli hősét, kivonva őt a harcból pár másodpercre.",
      strengths: ["Az ellenfél tankjának 'lenyelése', így az 1. vonal megnyílik", "Nagyon magas alappáncél (Armor)", "Tiszta sebzés (Pure) okozása"],
      weaknesses: ["Lenyelés alatt nem tud mozogni", "Nincs csapatot védő képessége (mint Astaroth)"]
    }
  },
  "12": {
    roles: ["Control", "Warrior"], mainStat: "Agility",
    description: {
      summary: "Arachne egy irányító (Control) hős, aki folyamatos kábítás (Stun) alatt tartja az ellenfelet, és képes a legalacsonyabb életerejű célponthoz ugrani.",
      strengths: ["Folyamatos területi kábítás (Stun)", "Képességeivel varázssebzést oszt (bár Agility hős)", "Vámpírizmus a túléléshez"],
      weaknesses: ["Nehéz pozicionálni a csapatban", "Sebzése végjátékra (Late-game) elmarad a tiszta sebzőkétől"]
    }
  },
  "13": {
    roles: ["Mage"], mainStat: "Intelligence",
    description: {
      summary: "Orion egy tüzérségi mágus, aki rendkívül gyorsan tölti az energiáját, és másodpercenként rakétákat zúdít az ellenfélre.",
      strengths: ["Extrém gyors energia-visszatöltés", "Gyakori területi (AoE) mágikus sebzés", "Kiváló Magic Penetration buffot ad a teljes csapatnak"],
      weaknesses: ["Sebzése szóródik (sok célpont között oszlik el)", "Könnyen 'tölti' az ellenfél csapatának energiáját a kis sebzésű területi csapásaival"]
    }
  },
  "14": {
    roles: ["Marksman", "Control"], mainStat: "Agility",
    description: {
      summary: "Fox egy lövész, aki az ellenfél hátralökésével (Knockback) és megvakításával (Blind) operál. Erős fizikai sebzést biztosít a frontvonalra.",
      strengths: ["Képes hátralökni az ellenséges tankot", "Vakítás (Blind) a fizikai sebzők ellen", "Páncéltörés (Armor Penetration) buff"],
      weaknesses: ["Alacsony túlélési esély (squishy)", "Támadása lassabb a többi lövésznél"]
    }
  },
  "15": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Ginger egy pusztító területi (AoE) sebző, aki az egész ellenséges csapatot ólomzáporral (Lead Storm) szórja meg.",
      strengths: ["Hatalmas területi (AoE) fizikai sebzés", "Kiváló szinergia páncéltörő hősökkel és Isaac-kel"],
      weaknesses: ["Folyamatos sebzése hamar felölti az ellenfelek energiáját (ha nem halnak meg)", "Armor Penetration nélkül sebzése jelentősen visszaesik"]
    }
  },
  "16": {
    roles: ["Marksman", "Dodge"], mainStat: "Agility",
    description: {
      summary: "Dante egy kitérő (Dodge) lövész, akinek lándzsái átütnek az ellenséges csapaton, miközben folyamatosan csökkentik azok fő statisztikáját.",
      strengths: ["Hatalmas kitérési (Dodge) képesség és buff a csapatnak", "A lándzsák ellökik (Push back) az első vonalat", "Csökkenti az ellenfél fő statisztikáját"],
      weaknesses: ["Fizikai sebzést oszt, de sok ellenfél páncélja felfoghatja", "Varázslók ellen sérülékeny"]
    }
  },
  "17": {
    roles: ["Mage", "Healer"], mainStat: "Intelligence",
    description: {
      summary: "Mojo egy támadó mágus, aki Voodoo varázslattal és Hex-szel bűvöli el az ellenfeleket, másolva az elszenvedett sebzésüket.",
      strengths: ["A Hex képessége megsokszorozza a csapat sebzését", "Folyamatos területi sebzés", "Kisebb gyógyítás a csapatnak"],
      weaknesses: ["Lassú animációk", "Nem kiemelkedő sem gyógyításban, sem nyers sebzésben"]
    }
  },
  "18": {
    roles: ["Support", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Judge egy támogató hős, aki pajzsokat ad a csapattársainak, és területre ható mágikus sebzést, valamint lassítást oszt.",
      strengths: ["Erős védőpajzsok a csapattársaknak", "Lassítja az ellenfél csapatát", "Jó szinergia Julius-szal és Isaac-kel (Way of Progress)"],
      weaknesses: ["Sebzése nagyon alacsony", "A pajzsai varázssebzésen alapulnak, amit könnyű törni"]
    }
  },
  "19": {
    roles: ["Marksman", "Control"], mainStat: "Agility",
    description: {
      summary: "Dark Star egy íjász, aki a sötét mágiát ötvözi a fizikális sebzéssel. Képes átvenni az irányítást (Mind Control) egy ellenfél felett.",
      strengths: ["Ellenfelek elméjének irányítása (Mind Control)", "Illúziót (klónt) hoz létre, amely sebzést okoz", "Jó szinergia Daredevil-lel"],
      weaknesses: ["Rendkívül alacsony életerő és páncél", "Az elmeirányítás (Mind Control) nagyon esetleges lehet"]
    }
  },
  "20": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Artemis egy nyílzáport szóró lövész, akinek a sebzése drasztikusan nő, ha a Fafnir nevű hőssel használják (F.A.R.T. csapat).",
      strengths: ["Brutális területi (AoE) kritikus sebzés", "Képes megtisztítani magát a debuffoktól", "A játék egyik legnagyobb DPS-e a megfelelő buffokkal"],
      weaknesses: ["Lassú az elején, fel kell töltenie az energiáját", "Vakítás (Blind) és kitérés (Dodge) ellen hatástalan"]
    }
  },
  "21": {
    roles: ["Healer", "Tank"], mainStat: "Intelligence",
    description: {
      summary: "Markus egy szent lovag, aki a frontvonalból gyógyít, és halála esetén egy áttetsző szellemként továbbra is a pályán marad és gyógyítja a csapatot.",
      strengths: ["Halála után is tovább gyógyítja a csapatot (Szellemként)", "Célzott immunitás (Invulnerability) pajzs", "Támogató tank funkciót is betölt"],
      weaknesses: ["Gyógyítóként nagyon előre áll, így hamar meghal", "Kevés hasznot hoz támadó összeállításokban"]
    }
  },
  "22": {
    roles: ["Mage", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Peppy egy kaotikus mágus, aki pajzsokat ad az első vonalnak. Híres a Cleaver-rel alkotott 'Cleppy' kombójáról.",
      strengths: ["Boldness (Pajzs) képessége folyamatos sebzést ad a tanknak", "Kiváló szinergia Cleaver-rel", "Területi kábítás és mágikus sebzés"],
      weaknesses: ["Nagyon függ a szerencsétől (RNG) a sebzése", "Kiszámíthatatlan automatikus harcban"]
    }
  },
  "23": {
    roles: ["Mage", "Control"], mainStat: "Intelligence",
    description: {
      summary: "Lian egy varázsló, akinek a specialitása, hogy mindenkit elaltat (Sleep), aki sebzést okoz neki. A területi (AoE) hősök rémálma.",
      strengths: ["Automatikus altatás (Sleep) minden sebző ellenfelére", "Kiváló védekezés Keira vagy K'arkh ellen", "Tiszta (Pure) sebzés az altatott ellenfeleken"],
      weaknesses: ["Ha csapattárs sebzi meg az altatott célt, felébred", "Csak védekező stratégiában igazán hatékony"]
    }
  },
  "24": {
    roles: ["Tank", "Control"], mainStat: "Strength",
    description: {
      summary: "Cleaver a játék egyik legritkább tankja. Egy hatalmas horgonnyal maga elé húzza az ellenfél leghátsó hősét.",
      strengths: ["Húskampó (Hook) megszakítja az ellenfél formációját", "Tiszta (Pure) területi sebzés önmaga körül", "Kiváló szinergia Peppy-vel (Cleppy)"],
      weaknesses: ["Nincs csapatot védő képessége", "Bizonyos hátsó soros hősöket (pl. Dorian) pont, hogy segít, ha előre húzza"]
    }
  },
  "25": {
    roles: ["Warrior"], mainStat: "Agility",
    description: {
      summary: "Ishmael egy rendkívül gyorsan támadó harcos, aki démoni formát (Demon Form) öltve megnöveli a kritikus találatát és vámpírizmusát.",
      strengths: ["Hatalmas egyéni (Single-target) kritikus sebzés", "Extrém magas vámpírizmus (Vampirism) túléli a harcokat", "Gyorsan bontja az első vonalat"],
      weaknesses: ["Nagyon sebezhető kábítás (Stun) és vakítás (Blind) ellen", "Armor Penetration támogatás nélkül gyenge a tankok ellen"]
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
console.log('Heroes 1-25 updated!');
