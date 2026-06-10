const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'heroesCatalog.json');
let heroes = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const enrichedData = {
  "51": {
    roles: ["Healer", "Support"], mainStat: "Intelligence",
    description: {
      summary: "Morrigan Corvus lánya. Képes csontvázakat idézni, amik elöl tankolnak, és a legfontosabb: megakadályozza az ellenfél (pl. Astaroth) újraéledését.",
      strengths: ["Blokkolja a Resurrection (újraéledés) képességeket", "A csontvázak felfogják az egycélpontú lövéseket (pl. Jhu, K'arkh)", "Gyógyítja a csontvázakat és az Élőholt (Eternity) társait"],
      weaknesses: ["Ha nincs Eternity frakciós csapattársa, sokkal kevesebbet ér", "A csontvázak adhatnak energiát és vámpírizmust a sebző ellenfeleknek"]
    }
  },
  "52": {
    roles: ["Support", "Marksman"], mainStat: "Agility",
    description: {
      summary: "Isaac egy zseniális mérnök (Way of Progress), akit kifejezetten a varázsló-csapatok megsemmisítésére alkottak. Elnyeli a mágiát, majd rakéták formájában visszalövi.",
      strengths: ["Minden mágikus támadással egyre erősebb lesz", "Hatalmas Armor Penetration (Páncéltörés) buff a társaknak", "Az ultimate képessége elnémítja a mágusokat", "Progress csapatokban (pl. Julius, Ginger) megállíthatatlan"],
      weaknesses: ["Ha nincsenek mágusok az ellenséges csapatban, Isaac alig tud energiát tölteni és nagyon lassú lesz"]
    }
  },
  "53": {
    roles: ["Support", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Alvanor a Természet (Way of Nature) frakció védelmezője. Folyamatosan gyógyítja a társait, és egy rúnapajzzsal blokkolja az alapvető (Basic) támadásokat.",
      strengths: ["Rendkívüli szinergia Mushy-val és Aurorával", "Duplán gyógyítja a Nature frakció hőseit", "A rúnapajzs felfogja az egyszerű támadások sebzését"],
      weaknesses: ["Nature társak nélkül a képességei csak fele olyan erősek", "Lassú gyógyító, nem tud megvédeni a gyors, nagy sebzésektől (Burst)"]
    }
  },
  "54": {
    roles: ["Warrior", "Support"], mainStat: "Strength",
    description: {
      summary: "Tristan egy démonvadász pap, aki Armor Penetration (Páncéltörés) buffot ad minden mögötte állónak, és folyamatosan elszívja az ellenfél energiáját.",
      strengths: ["Kiváló szinergia Oya-val, Fafnirral, Yasmine-nal", "Folyamatos energiaelszívás (Energy drain)", "Nagyon gyorsan képes Ultimate-et használni, ha a tankja elöl sok sebzést kap"],
      weaknesses: ["Közelharcos létére meglehetősen kevés az életereje", "Kevés az önálló (nyers) sebzése"]
    }
  },
  "55": {
    roles: ["Mage", "Control"], mainStat: "Intelligence",
    description: {
      summary: "Iris a varázslók gyilkosa. Kitépi az ellenfél lelkét, amelynek nincsenek védelmei (Armor/Magic Defense), és ha azt sebzi, az ellenfél valódi teste sérül.",
      strengths: ["A lélek-kitépés (Expose Soul) miatt a tankok páncélja semmit sem ér ellene", "Tiszta (Pure) sebzést oszt az ellenség frontvonalára", "Mágikus sebzés-felfogó (Familiar) pajzs"],
      weaknesses: ["Nagyon sérülékeny hátulról jövő sebzésekre (pl. Jhu)", "Ha a lélek-állapot lejár mielőtt megölnék, az ellenfél túlélheti"]
    }
  },
  "56": {
    roles: ["Support", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Amira a sivatag dzsinnje (Mystery frakció). Hatalmas aranyesőt hullajt az ellenfélre, ami csökkenti a sebzésüket, majd felrobban.",
      strengths: ["Csökkenti a kritikus ütés (Critical) sebzését", "A mágusok (Intelligence hősök) ellenfele", "Extrém magas területi varázssebzés a harc végén (ha túléli)"],
      weaknesses: ["Borzasztóan lassú: nagyon sok idő kell neki, mire az illúziók felrobbannak", "A gyors burst csapatok hamarabb megölik, minthogy érvényesülne"]
    }
  },
  "57": {
    roles: ["Support"], mainStat: "Strength",
    description: {
      summary: "Fafnir egy törp kovács (Honor frakció), aki pajzsot kovácsol a csapat fő Agility-sebzőjének (pl. Artemis, Yasmine, Keira), és megakadályozza, hogy az meghaljon.",
      strengths: ["Gyakorlatilag halhatatlanná teszi a célpontját (ha a pajzs rajta van)", "Brutális fizikai sebzés buffot ad (Blacksmith's Art)", "Megbénítja (Stun) a pajzs támadóit"],
      weaknesses: ["Nem tud mindenkit megvédeni, csak egy (Agility) célpontot fókuszál", "Lassú tempója miatt sebzéstípusfüggő"]
    }
  },
  "58": {
    roles: ["Healer", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Aidan egy tüzes mágus (Kayla testvére). A saját életerejét áldozza fel, hogy a társait (elsősorban Kaylát) megvédje és gyógyítsa. A Kaos (Chaos) frakció motorja.",
      strengths: ["Képes túlélni a halálos sebzéseket, ha a kötött társa (Kayla) még él", "Brutális szinergia Kaylával", "Pajzsot ad az egész csapatnak"],
      weaknesses: ["Sok életerőt áldoz fel, így rossz szinergia esetén hamar meghalhat", "Csak Chaos csapattal vagy Kaylával igazán kiemelkedő"]
    }
  },
  "59": {
    roles: ["Warrior", "Assassin"], mainStat: "Agility",
    description: {
      summary: "Kayla egy tüzes bérgyilkos (Aidan testvére), aki a csata elején azonnal beugrik az ellenfél formációjába, és lángoló sebzést okoz.",
      strengths: ["Azonnal nyomást gyakorol a hátsó sorra (Mage/Healer)", "Aidan-nal együtt szinte halhatatlan párost alkotnak", "Hatalmas Magic Defense buffot ad a túléléshez"],
      weaknesses: ["Beugrása után könnyen fókuszba kerül", "Irányító (Control) hősök, kábítás (Stun) megállítják"]
    }
  },
  "60": {
    roles: ["Mage", "Tank"], mainStat: "Intelligence",
    description: {
      summary: "Mushy and Shroom a Természet (Way of Nature) tankja/mágusa. Egy élő gomba, amely gombaspórákat szaporít, amik gyógyítanak és sebeznek.",
      strengths: ["Alvanorral kiegészítve elpusztíthatatlan gombaerdőt hoz létre", "A klónok (kis gombák) felfogják a sebzést", "Brutális mágikus területi sebzés a harc elhúzódásával"],
      weaknesses: ["Jorgen, aki blokkolja az energiát, nagyon lelassítja a szaporodást", "Kevés a fizikai védelme a klónok megjelenése előtt"]
    }
  },
  "61": {
    roles: ["Tank", "Support"], mainStat: "Strength",
    description: {
      summary: "Julius egy kiborg macska, aki energiapajzsokat ad az egész csapatnak (különösen a Way of Progress tagjainak, mint Isaac és Judge), ami tisztítja a negatív effekteket.",
      strengths: ["Minden pajzs levételi kísérletnél lemos (Cleanse) egy debuffot", "Isaac-kel és Judge-dzsal áthatolhatatlan (Shield) csapatot alkotnak", "Gyorsítja a Progress társakat"],
      weaknesses: ["Iris, aki ignorálja a pajzsokat és páncélt, könnyen kivégzi", "A pajzstörő mechanikák ellen sebezhető"]
    }
  },
  "62": {
    roles: ["Control", "Mage"], mainStat: "Intelligence",
    description: {
      summary: "Polaris a sarkcsillag mágusa, aki megfagyasztja (Freeze) az időt és teret az ellenfelek számára, miközben folyamatos hideg sebzést oszt.",
      strengths: ["Többszörös fagyasztás, amely lelassítja az ellenfél teljes csapatát", "Extrém magas Control hatás", "A fagyasztott ellenfelek nem tudnak kitérni (Dodge)"],
      weaknesses: ["Sebastian pajzsa teljesen immunissá teszi a csapatot a fagyasztása ellen", "Viszonylag alacsony saját sebzés"]
    }
  },
  "63": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Lara Croft egy legendás vendéghős (Tomb Raider). Két pisztolyával és ősi ereklyékkel operál, hatalmas sebzést kiosztva, miközben kitér a támadások elől.",
      strengths: ["Erős kitérés (Dodge)", "Hatalmas fizikai sebzés és relikvia képességek", "Folyamatos nyomás a középső/hátsó soron"],
      weaknesses: ["A megszerzése (limitált esemény) miatt nehéz fejleszteni a csillagait", "Sérülékeny a célzott mágia (pl. Satori) ellen"]
    }
  },
  "64": {
    roles: ["Warrior", "Control"], mainStat: "Strength",
    description: {
      summary: "Augustus egy gladiátor harcos. A láncával magához tudja húzni az ellenfeleket, és a tömegbe csapva területi (AoE) kábítást (Stun) okoz.",
      strengths: ["Formáció megbontása a húzással (Pull)", "Területi (AoE) kábítás az első vonalban", "Kiváló túlélő képesség"],
      weaknesses: ["Egy okos ellenfél-pozicionálás (pl. Andavari) semlegesítheti a képességeit"]
    }
  },
  "65": {
    roles: ["Warrior"], mainStat: "Strength",
    description: {
      summary: "Ninja Turtles (Tini Nindzsa Teknőcök) egy különleges, több karaktert egybefogó egység, akik a pizzahatalommal és kombóikkal pusztítják a gonoszt.",
      strengths: ["Sokoldalú kombó képességek (védekezés és támadás egyszerre)", "Területi sebzések", "Kiváló szinergia"],
      weaknesses: ["Nagyon függnek az Ultimate beindításától", "Sebezhetőek az energiablokkoló hősök ellen (pl. Jorgen)"]
    }
  },
  "66": {
    roles: ["Mage", "Control"], mainStat: "Intelligence",
    description: {
      summary: "Folio egy lebegő varázskönyv, aki a szavak mágiájával operál. Képes elnémítani az ellenfelet és csökkenteni a varázserejüket.",
      strengths: ["Célzott Silence (Némítás)", "Mágia-csökkentés (Magic Attack debuff)", "Területi (AoE) sebzés a harc közepén"],
      weaknesses: ["Törékeny", "Fizikai csapatok (pl. Yasmine, Keira) ellen gyenge, mert ők nem használnak varázserejét"]
    }
  },
  "67": {
    roles: ["Healer"], mainStat: "Intelligence",
    description: {
      summary: "Lyria egy misztikus dalnok, akinek a hangja gyógyítja a társait és pajzzsal veszi körül őket, miközben az ellenfél pontosságát rontja.",
      strengths: ["Dalok (Songs) alapján buffolja a csapatot", "Gyógyítás és pajzs", "Csökkenti az ellenség sebzését"],
      weaknesses: ["Lassú gyógyítás a robbanékony (burst) sebzések ellen", "Nincs támadóereje"]
    }
  },
  "68": {
    roles: ["Control", "Tank"], mainStat: "Strength",
    description: {
      summary: "Guus egy varázslatos liba, ami/aki minden képzeletet felülmúló, idegesítő gágogásával elvonja az ellenfelek figyelmét (Taunt) és kábít.",
      strengths: ["Taunt (Figyelemelterelés): mindenki őt támadja, védve a csapatot", "Magas Armor és Dodge buffok", "Ijesztő Gágogás (Kábítás)"],
      weaknesses: ["A Taunt miatt hamar meghalhat, ha túl sok sebzést kap egyszerre", "Szigorúan védekező karakter"]
    }
  },
  "69": {
    roles: ["Warrior", "Control"], mainStat: "Agility",
    description: {
      summary: "Cascade egy víz-alapú harcos, akinek a vízsugarai mindenkit hátralöknek, miközben folyamatosan lassítja (Slow) a mozgásukat.",
      strengths: ["Folyamatos Knockback (Hátralökés)", "Lassítja az ellenfél támadási sebességét", "Víz alapú szinergiák"],
      weaknesses: ["Gyenge alapsebzés", "A hátralökés néha pont rosszkor mozdítja ki az ellenfelet egy területi sebzésből (pl. Orionéból)"]
    }
  },
  "70": {
    roles: ["Mage"], mainStat: "Intelligence",
    description: {
      summary: "Electra von Grave a viharok úrnője, aki folyamatos láncvillámokkal ritkítja az ellenfelek sorait.",
      strengths: ["A láncvillám átszalad a teljes csapaton", "Bénulást (Paralysis) okoz", "Kiváló sebzés osztó (DPS)"],
      weaknesses: ["Törékeny, védelemre szorul", "Ha csak egy ellenfél marad, a láncvillám sokat veszít az erejéből"]
    }
  },
  "71": {
    roles: ["Support", "Healer"], mainStat: "Intelligence",
    description: {
      summary: "Fluffy egy varázslatos házi kedvenc formájú hős, aki puha bundájával pajzsot biztosít, és dorombolásával gyógyít.",
      strengths: ["Védi és gyógyítja a legalacsonyabb életerejű társat", "Dorombolás (Regeneráció)"],
      weaknesses: ["Nagyon specifikus szerepkör", "Nincs érdemi sebzése"]
    }
  },
  "72": {
    roles: ["Marksman"], mainStat: "Agility",
    description: {
      summary: "Byrma egy robbanószer-szakértő (Demolitionist), aki aknákat telepít és gránátokat dobál a pályára.",
      strengths: ["Az aknák a lépések hatására felrobbannak", "Hatalmas területi (AoE) fizikai sebzés", "Armor Penetration (Páncéltörés)"],
      weaknesses: ["Ha az ellenfél nem mozog sokat (nem lépnek az aknára), a sebzése lassabban jön ki"]
    }
  },
  "73": {
    roles: ["Warrior", "Tank"], mainStat: "Strength",
    description: {
      summary: "Adam a teremtés erejével felruházott harcos, aki pajzsokkal és földrengéssel dominálja az első vonalat.",
      strengths: ["Földrengés (Earthquake) kábítás", "Magas Health és Armor", "Fizikai sebzés szinergiák"],
      weaknesses: ["Lassú mozgás és támadási sebesség", "Kiszolgáltatott a mágikus sebzéseknek"]
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
console.log('Heroes 51-73 updated!');
