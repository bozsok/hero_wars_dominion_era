# Changelog

Minden említésre méltó változtatás a projektben ebben a fájlban lesz rögzítve.

## [0.5.28] - 2026-06-28

### Hozzáadva (Added)
- **Erőforrás összesítő nézet az Overview-n**: A navigációs sáv 'All' kategóriája lett az alapértelmezett. Kiválasztásakor az összes eddigi erőforrás (jelenleg Fogyóeszközök és Érmék, később felszerelések, receptek stb.) ömlesztve, egyetlen megszakítás nélküli, folyamatos rácskonténerben (`consumables-grid`) jelenik meg a maximális áttekinthetőség érdekében.
- **Központi erőforrás-sáv az Overview fülön**: A profil panel alatt és a navigációs gombok felett egy új, teljes szélességű sor került kialakításra (a grid ezáltal 3 sorosra bővült). Ebbe a sorba lettek vizuálisan átemelve a játékoshoz köthető elsődleges és másodlagos erőforrás statisztikák.
- **Alsó eltartás az Overview nézeten**: A Grid konténer teljes szélességében, a kártyák alatt egy letisztult, vizuális sallangok (sárga csík) nélküli eltartás (`overview-footer-wrapper`) kapott helyet, biztosítva, hogy a böngészőgörgető legalján kényelmes tér maradjon a tartalom alatt.

### Megváltoztatva (Changed)
- **Erőforrás sávok dizájnjának egységesítése**: Az elsődleges ("GENERAL RESOURCES") és másodlagos ("HEROES & SKINS") erőforrásokat tartalmazó csoportok megkapták ugyanazt a CSS osztályt (`player-resources-bar`). Ezzel megszüntettük a másodlagos csoport indokolatlanul elcsúszott bal oldali belső margóját (padding), így az ikonok csonkulás nélkül, tökéletesen szimmetrikus és letisztult elrendezésben jelennek meg.
- **Profil Widget térköz elosztása**: A `player-profile-widget` a "beégetett" fix távolságok (`gap`) helyett flexibilis elosztásra (`justify-content: space-evenly`) váltott. Mivel a cella megkapta a 100%-os magasságot, az avatar, a névszalag és a VIP felirat mostantól automatikusan, matematikailag egyenletesen oszlanak el a rendelkezésre álló térben mindenféle manuális korrekció nélkül.
- **Kezdőlap alapértelmezett átirányítása**: Az alkalmazás indulásakor az alapértelmezett, aktív menüpont a megszokott `Dashboard` helyett az `Overview` lett az átmeneti átszervezés miatt (`App.jsx`).
- **Overview üdvözlőképernyőjének kibővítése**: Mivel az `Overview` lett az új kezdőlap, a korábbi csonka "üres állapot" üzenetet lecseréltük a Dashboardon megszokott, 3 lépéses, ikonokkal ellátott részletes útmutatóra, hogy az új felhasználókat azonnal segítse az adatszinkronizálásban.
- **HAR-import instrukciók finomítása**: Az 'Adatkezelés' ablakban található HAR-fájl készítési segédlet kibővült a megfelelő hálózati szűrő (Mind / Fetch/XHR) kiválasztására vonatkozó instrukcióval, így elkerülhetők a hiányos fájlmentések. Emellett a betöltendő fájl elnevezése is általánosításra került, megszüntetve a kizárólagos `hero-wars.com.har` hivatkozást.

### Javítva (Fixed)
- **HTML nyelv és fordítási bug**: Az `index.html` dokumentumban a nyelv deklarációját (`lang="en"`) magyarra (`lang="hu"`) cseréltük. Ezzel megszüntettük azt a zavaró böngészőviselkedést (főleg Chrome esetén), ahol a böngésző automatikusan felajánlotta a magyar nyelvű tartalom lefordítását, mivel tévesen angol oldalnak érzékelte azt.
- **Böngészőfül címe (Title)**: A projekt `index.html` fájljában a sablonos és nyers `hero-wars` alapértelmezett cím helyett a beszédesebb, végleges `Dominion Tracker` nevet kapta meg az alkalmazás.
- **Overview rács túlcsordulásának javítása**: Kijavítottuk azt a vizuális hibát, aminek következtében a nagy mennyiségű kategóriagomb "kifolyt" az alsó peremen túlra. A Grid fix magasságát (`height`) rugalmas értékre (`min-height`) cseréltük, így a rács immár maradéktalanul, kifolyás nélkül képes magába foglalni a tartalmát, szükség esetén dinamikusan növelve a teljes oldal méretét.

### Eltávolítva (Removed)
- **Dashboard menüpont elrejtése**: A `Sidebar.jsx`-ből ideiglenesen eltávolítottuk (kommentbe helyeztük) a `Dashboard` nézet navigációs gombját, hogy a fejlesztés alatt álló funkció egyelőre ne zavarja a felhasználói élményt.

## [0.5.27] - 2026-06-28

### Megváltoztatva (Changed)
- **DataSyncModal vizuális egységesítése**: A szinkronizációs ablak (`DataSyncModal`) a projekt általános fantasy stílusához igazodott. Arany keretet kapott, és a régi modern zöld/szürke dizájnját sötét, pergamen/arany (`#eaddc5`, `#d4af37`) színkódok és a 'Roboto Condensed' betűtípus váltotta fel.
- **CSS fájlok szervezése**: Az `ImportModal.css` fájl átnevezésre került `DataSyncModal.css`-re, és az `index.css`-ből ide lettek átemelve az összes ehhez a modálhoz tartozó stílusok. Ezzel megszüntettük a projektben a szétszórt, duplikált CSS szerkezetet ezen a téren.
- **Inline CSS kivezetése a modalokból**: Kigyomlálásra került a projektben tiltott inline CSS a "Tárgy elnevezése" (`Dashboard.jsx`, `Overview.jsx`), valamint a `DataSyncModal` ablakok konténereiből, gombjaiból, mezőiből és a `.dashboard-page-wrapper` elemből. Helyettük dedikált CSS osztályok (`.naming-modal`, `.naming-modal-form` stb.) kerültek definiálásra és bekötésre, jelentősen javítva a kód átláthatóságát.
- **CSS specifikusság javítása és takarítás**: Eltávolításra került egy felesleges `.datasync-modal-body p` CSS szabály, ami korábban agresszíven felülírta a specifikus modal elemek (pl. `.sync-import-desc`) betűméretét.
- **Overview címsor dizájnrétegeinek szétválasztása**: Az `Overview` fejlécében az egyetlen, összevont háttérkép (`overview_bg.png`) helyét két különálló, flexibilisen pozícionálható elem vette át. A fejlécen végigfutó díszes sárga csíkot ezentúl egy végtelenített (`repeat-x`) miniatűr kép (`yellow_line.jpg`) biztosítja, amelyre az új, kifejezetten a címszöveg számára kialakított helyőrző kép (`overview_title.png`) rétegződik.

### Javítva (Fixed)
- **Overview fejléc vizuális hibája**: Az `Overview.jsx` fejléc bannerének reszponzív viselkedése javításra került. Eltávolítottuk az `object-fit: cover` szabályt a háttérképről, így ablakátméretezéskor és görgetéskor a kép többé nem vágódik le (megszüntetve a "Sidebar alá becsúszó" optikai csalódást), hanem folyamatosan, teljes szélességében látható marad. Továbbá a wrapper doboz szélességét pontos matematikai számítással (`width: calc(100% + 2 * var(--md))`) láttuk el, így a banner mindig tökéletesen és stabilan kitölti a rendelkezésre álló teret.

## [0.5.26] - 2026-06-28

### Megváltoztatva (Changed)
- **Layout átszervezés – Header megszüntetése**: A teljes felső fejlécsáv (`layout-header`) eltávolításra került. A benne lévő elemek a bal oldali menüsávba (`layout-sidebar`) költöztek, így a fő tartalomterület jelentősen magasabb lett (a korábbi `padding-top: 112px` értékről `32px`-re csökkent).
- **Logó áthelyezése a sidebar tetejére**: A korábban a fejlécben megjelenő logó (`header-logo-container`) átkerült a bal oldali menüsáv tetejére (`sidebar-logo-container`), saját elválasztó vonallal a navigációs menüpontoktól.
- **Akciógombok áthelyezése a sidebar aljára**: A fejlécben elhelyezett akciógombok (Megtekintő mód, Adatszinkronizáció) a menüsáv aljára költöztek, a navigációs menüpontokhoz hasonló ikon + szöveges címke formátumban: 👁 „Megtekintés", 🔄 „Adatszinkron". Megtekintő módban a „Vissza a sajáthoz" gomb jelenik meg helyettük.
- **Sidebar komponens bővítése**: A `Sidebar.jsx` átvette a megszüntetett `Header.jsx` teljes logikáját (fájlbetöltés, megtekintő mód kezelése, `useContext`, `useRef`). A komponens új `onOpenImport` propot kapott az adatszinkronizálós modal megnyitásához.
- **Új `sidebar-action-item` CSS osztály**: A sidebar aljára került akciógombok saját, a `nav-item` mintáját követő stílust kaptak (zöld háttér-gradiens hover effekttel, a visszatérő gomb piros változattal).
- **Dashboard üdvözlő szöveg frissítése**: A kezdőképernyő lépésenkénti útmutatójában a „jobb felső sarokban lévő Adatszinkronizáció" hivatkozás frissült a „bal oldali menüsorban lévő Adatszinkron" megfogalmazásra, az új elrendezésnek megfelelően.
- **Dashboard megtekintő mód figyelmeztetés magyarítása**: A `Dashboard.jsx` „View Mode Active" angol nyelvű figyelmeztetése magyar szövegre cserélődött („Megtekintő mód aktív").

### Eltávolítva (Removed)
- **`Header.jsx` komponens**: A teljes fájl törlésre került, mivel minden funkciója a `Sidebar.jsx`-be olvadt.
- **Fejléc CSS osztályok**: Eltávolításra kerültek a `.layout-header`, `.header-logo-container`, `.header-logo`, `.header-title-container`, `.header-title`, `.header-actions`, `.header-profile-icon`, `.header-title-view-mode`, `.view-mode-btn`, valamint a kapcsolódó `.header-profile-icon:not(.view-mode)` és `.header-profile-icon.view-mode` szelektorok.
- **Profil ikon eltávolítása**: Az `account_circle` Material Icon (`header-profile-icon`) véglegesen törlésre került a felületről.

## [0.5.25] - 2026-06-26

### Hozzáadva (Added)
- **Önálló Teams fül**: A korábban a `Dashboard` alatt megbújó csapatinformációk (Aréna, Grand Aréna, Campaign csapatok és petek) saját, dedikált menüpontot kaptak a bal oldali sávban (`Teams`). Elkészült a `Teams.jsx` és `Teams.css` fájl, így az alkalmazás szerkezete tisztább és átláthatóbb lett.

### Megváltoztatva (Changed)
- **Tárgyazonosító modál javítása**: Az `Overview` fülön is elérhetővé vált a tripla kattintásos tárgyelnevező és színező modálablak, amely onnan korábban lemaradt.
- **Tárgyazonosító modál stílusainak helyreállítása**: A `Dashboard` és `Overview` füleken megjelenő modálablak hiányzó stílusait lecseréltük a meglévő globális CSS osztályokra (`modal-overlay`, `modal-content gold-frame`, `gold-gradient-btn`). Ennek köszönhetően a felugró ablak ismét tökéletesen középre igazítva, a megszokott arany kerettel jelenik meg, megszüntetve a bal alsó sarokba történő elcsúszást.

## [0.5.24] - 2026-06-26

### Hozzáadva (Added)
- **Új `Overview` fül bevezetése**: Elkészült az `Overview.jsx` komponens, amely a jövőben a Dashboard feladatát fogja átvenni. Hozzáadtuk a bal oldali menüsávhoz (`Sidebar.jsx`). 
- **Új `Overview.css` stíluslap**: Különálló, lokális stílusfájl az új fülhöz, amely mentes az inline stílusoktól.

### Megváltoztatva (Changed)
- **Képbetöltési villogás javítása**: A `Dashboard` és `Overview` füleken a `Consumables` és `Coins` kártyáknál eltávolítottuk az `onLoad` eseménykezelőt a képekről (`img` tagek). Így megszüntettük a "balról jobbra beúszó" optikai csalódást, amelyet a JavaScript DOM-manipulációs mikrokésleltetése okozott.
- **Okos `onError` eseménykezelés**: A képeknél (a letört kép ikon elrejtésére szánt) szöveges fallback (a `#{id}`) mostantól alapértelmezetten rejtett (`display: none`), és csak akkor jelenik meg, ha az `onError` esemény lefut (pl. ha a képfájl 404-es hibát ad).
- **Scrollbar elcsúszás javítása**: A `Dashboard` és `Overview` fülek fix görgetősávot (`overflow-y: scroll`) kaptak a kategóriaváltások (pl. Consumables -> Coins) okozta szélességugrálás elkerülésére.

## [0.5.23] - 2026-06-26

### Hozzáadva (Added)
- **Ritkasági keretek a Consumables fülön**: A Consumables fülön megjelenő tárgyak kártyáira rákerül a ritkasági szintjüknek megfelelő színű PNG keret a `public/hero_borders` mappából (fehér, zöld, kék, lila, narancs, piros). A szín a `consumablesDictionary.json` fájl `color` mezőjéből származik.
- **Egységes narancs keret a Coins fülön**: A Coins fülön minden érmekártya egységesen narancsszínű (`orange.png`) kerettel jelenik meg.
- **Keretszín-választó a tárgyazonosító modálban**: A tárgy elnevezésére szolgáló felugró ablakban (Consumables fül) a név beviteli mező alatt megjelent egy „Keret színe" feliratú lenyíló lista, amellyel a felhasználó manuálisan kiválaszthatja a keret színét (White, Green, Blue, Violet, Orange, Red). A mentés gombra kattintva a választott szín a `consumablesDictionary.json` fájlba is elmentődik.
- **`color` mező a `consumablesDictionary.json` szótárban**: Minden meglévő tárgyhoz hozzáadtuk a `"color"` mezőt a ritkasági szintjének megfelelő értékkel (white/green/blue/violet/orange/red).

### Megváltoztatva (Changed)
- **Tárgyazonosító modál megnyitása**: A tárgyakra és érmékre történő szimpla kattintás helyett mostantól csak tripla kattintásra (`e.detail === 3`) nyílik meg a név- és színválasztó modál. Ezzel elkerülhető a véletlen megnyitás, ezért a `cursor: pointer` stílust is eltávolítottuk a kártyákról.
- **Kártyakeret vizuális megoldása**: A korábbi CSS-alapú keretet (`border: 2px solid #54462a`) lecseréltük PNG képalapú keretre (`.consumable-item-border` CSS osztály), amely abszolút pozícióval, `z-index: 3` rétegen, `pointer-events: none` beállítással jelenik meg a kártya fölött.
- **Backend API bővítése**: A `vite.config.js` szótármentő végpontja (`/api/save-dictionary`) mostantól a `color` mezőt is fogadja és menti a szótárfájlba. Ha nem érkezik új szín, a meglévő `color` értéket megőrzi.
- **`saveCustomItem` kontextus bővítése**: A `HeroContext.jsx` `saveCustomItem` függvénye mostantól fogadja a negyedik `color` paramétert, és a Consumables típusú tárgyaknál a localStorage-ba is elmenti.
- **Görgetőkonténer finomhangolása**: A `.dashboard-content-frame .modal-scroll-container.resources-scroll-active` osztályhoz `padding: 5px` került, hogy a kinyúló keretek ne vágjanak bele a konténer szélébe.


## [0.5.22] - 2026-06-25

### Hozzáadva (Added)
- **Átnevezett tárgyak és érmék exportálása/importálása**: Kibővítettük a JSON export és import logikáját a `HeroContext.jsx` fájlban, így a felhasználó által egyedileg elnevezett érmék (`customCoins`) és fogyóeszközök (`customConsumables`) is mentésre kerülnek a kiexportált JSON fájlba. Importáláskor vagy Megtekintő módban (Viewer mode) ezek az elnevezések is automatikusan visszatöltődnek a felületre és a localStorage-ba.
- **Kibővített szöveges narratív profilösszegző (.txt export)**: A `.txt` exportfunkciót jelentősen továbbfejlesztettük a `HeroContext.jsx` fájlban. Az exportált fájl immár tartalmazza a játékos profiljának főbb adatait (név, szint, VIP-szint, arany, smaragd, energia, helyezések és liga), az aktív csapatok felállítását (Arena, Grand Arena, Campaign, Clan Defence) a hősök szintjével, erejével és a kisállatok (Pet) neveivel, valamint a 0-nál nagyobb egyenlegű érmék (Coins) és fogyóeszközök (Consumables) tételes listáját a megfelelő nevekkel.
- **Dinamikus coin beolvasás**: A `DataSyncModal.jsx` fájlban a korábbi fix listás coin beolvasást hibrid megoldásra cseréltük. Az ismert coin kulcsok (`coinIdToKey`) mellett a program mostantól automatikusan beolvassa a HAR fájl `inventoryGet` válaszának `coin` szekciójában található összes további, ismeretlen ID-jú érmét is, és `coin_<ID>` formátumú dinamikus kulccsal tárolja el őket.
- **Ismeretlen érmék figyelmeztetés**: Az import után a program figyelmeztetést jelenít meg, ha olyan coin ID-kat talált a HAR fájlban, amelyek nem szerepelnek a `coinDictionary.json` szótárban, feltüntetve az érintett ID-kat és mennyiségeket.
- **Coins fül dinamikus elemkészlete**: A `Dashboard.jsx` Coins fülét kiterjesztettük a dinamikus kulcsok megjelenítésére, így az ismeretlen érmék is megjelennek a rácsban és a felhasználó elnevezheti őket.

### Megváltoztatva (Changed)
- **Fülek sorrendjének átrendezése**: A Dashboard oldalsó füleinek sorrendjét megváltoztattuk (Overview -> Consumables -> Coins -> Teams), így a Consumables fül közvetlenül az Overview alatt és a Coins fül felett kapott helyet.
- **Coins fül átnevezése és letisztítása**: A korábbi „Coins & Source” fül nevét átneveztük **Coins**-ra. Eltávolítottuk az összes kategória-csoportosítást és a hozzájuk tartozó `resource-group-label` elemeket a felületről a letisztultabb megjelenés érdekében.
- **Érmék ID szerinti rácsos elrendezése**: Az érméket egyetlen közös, dinamikusan tördelő rácsba (`coins-resources-grid`) rendeztük, amely a „Consumables” fülhöz teljesen hasonlóan `display: grid` alapú lett, így ott is pontosan 9 kártya jelenik meg egymás mellett, ID szerint numerikusan növekvő sorrendben.
- **Coins és Consumables fülek margóinak egységesítése**: Bitre pontosan megegyezővé tettük a két fül stílusait a `Dashboard.css` fájlban. A `.dashboard-resources-tab` osztályról eltávolítottuk a `display: flex` és a `gap: 2rem` tulajdonságokat (így a Consumables-hez hasonlóan sima block elemként viselkedik `width: 100%` mellett), valamint a `.coins-resources-grid` paddingjeit is szinkronizáltuk a `.consumables-grid`-ével (`padding-bottom: 2rem;`), teljesen megszüntetve a felső 0.5rem eltolódást.
- **HAR beolvasás felülírás-védelem**: A `DataSyncModal.jsx` HAR-feldolgozó ciklusában minden ident beolvasásához (`heroGetAll`, `inventoryGet`, `userGetInfo` stb.) hozzáadtunk egy `if (!változó)` őrzőfeltételt. Így ha a HAR fájlban több entry is tartalmazza ugyanazt az ident-et (pl. a játék betöltése után a felhasználó jutalmat szedett be), a program mindig az első — tehát a betöltéskori — állapotot fogadja el, és a későbbi válaszok nem írják felül az adatokat.

### Javítva (Fixed)
- **Consumables képútvonalak javítása**: A Consumables fülön a képek elérési útját abszolútról relatívra (`./consumables/...`) változtattuk, hogy a projekt alkönyvtárból történő kiszolgálása esetén is helyesen töltődjenek be a képek az éles szerveren.
- **Tárgyszótár pontosítása (88-as ID)**: A `consumablesDictionary.json` állományban a 88-as ID-hez társított téves „Bottled Energy” elnevezést a valós **„Lesser Hero Soul Stone Chest”**-re javítottuk a felhasználó visszajelzése alapján.
- **DataSyncModal beolvasási logika korrekciója**: A `DataSyncModal.jsx` fájlban javítottuk a `bottledEnergy` beolvasási logikáját, teljesen eltávolítva a korábbi hibás 88-as és 42-es ID-kat (mivel a 88 a Lesser Hero Soul Stone Chest, a 42 pedig a Superior Artifact Metal).

## [0.5.21] - 2026-06-24

### Hozzáadva (Added)
- **Új Consumables (Fogyóeszközök) fül a Dashboardon:** Létrehoztunk egy teljesen új, dedikált fület a Dashboardon, amely a játékos raktárában (inventory) lévő fogyóeszközöket jeleníti meg. A felület egy elegáns CSS rács (Grid) elrendezést használ, négyzet alakú kártyákkal és a játékhoz hű, sötét, lekerekített kapszulás sárga mennyiségjelzőkkel. A fül megkapta a `Coins & Sources` füllel megegyező egységes függőleges görgetősávot (`.resources-scroll-active`).
- **Consumables Backend API:** Megírtunk egy egyedi Vite middleware plugint (`dictionarySaverPlugin` a `vite.config.js`-ben), amely a `/api/save-dictionary` végponton keresztül biztosítja a böngészőből érkező POST kérések azonnali fájlba írását a `consumablesDictionary.json` állományba, átlépve a kliens-oldali localStorage korlátait.
- **Interaktív Fogyóeszköz-azonosító (UI):** A Dashboard "Consumables" fülén a hiányzó és a felismert tárgyakra egyaránt kattintva megjelenik egy új modális ablak ("Tárgy elnevezése"). Itt a felhasználó közvetlenül elnevezheti a `#ID` alapján azonosítatlan tárgyait. A mentés gomb a háttérben azonnal felülírja a helyi JSON adatbázist, az UI pedig tooltip formájában megjeleníti az új nevet.
- **Bővített Consumables szótár:** A `consumablesDictionary.json` kibővült közel 20 darab új fogyóeszközzel (rúnák, tapasztalati italok, nyersanyagok), miután lehetővé tettük a felületből történő közvetlen azonosításukat.

### Megváltoztatva (Changed)
- **Helyi Képbetöltés (Fallback mentesítés):** Teljesen kivezettük a Hero Wars Wiki külső elérését a fogyóeszközök dinamikus betöltésénél. Mostantól a Dashboard fixen és kizárólag a lokális `/consumables/{id}.png` képekre támaszkodik. A szótárból kiolvasott egyedi nevek immár csak vizuális azonosításra szolgálnak, nem generálnak kifelé irányuló MD5 hálózati kéréseket.

## [0.5.20] - 2026-06-23

### Javítva (Fixed)
- **Üdvözlő felirat levágásának javítása:** A Dashboard `.dashboard-welcome-title` osztályának `padding-top` és `line-height` értékeinek megnövelésével orvosoltuk a "ÜDVÖZÖL" szó levágását, amit a maszkolás (`background-clip: text`) okozott.
- **Vite build képútvonalak feloldása:** Az összes CSS (`Dashboard.css` és `index.css`) fájlban az eszköz-elérési útvonalakat szigorúan abszolútra (perrel kezdődőre, pl. `/ui/name.png`) cseréltük, ezzel kiküszöbölve az `npm run build` során fellépő "didn't resolve at build time" hibákat.
- **Modális háttér görgetésének (Overscroll) megakadályozása:** A `HeroModal.jsx`-ben a modal megnyitásakor immár nem csak a `document.body`, hanem a `document.documentElement` görgetése is tiltásra kerül (`overflow: hidden`), így kiküszöbölve a háttér zavaró görgetődését és ugrálását.

## [0.5.19] - 2026-06-23### Megváltoztatva (Changed)
- **Függőleges görgetés engedélyezése kizárólag a Coins & Sources fülön:** Bevezettünk egy dinamikus `.resources-scroll-active` CSS osztályt, amely csak a **Coins & Sources** fül (`activeTab === 'resources'`) kiválasztásakor kerül rá a `.modal-scroll-container` tárolóra. Ezzel az osztály segítségével felülírtuk a Dashboard globális görgetés-tiltását (`overflow-y: auto`), így a megnövekedett mennyiségű kategória (köztük az alul lévő Titan Valley is) elérhetővé vált a görgetősáv segítségével. A többi fülön (Overview, Teams) a függőleges görgetés továbbra is szigorúan tiltott marad az elrendezés stabilitásának megőrzése érdekében.

## [0.5.18] - 2026-06-23

### Megváltoztatva (Changed)
- **GENERAL & SHOPS csoport átköltöztetése:** A `GENERAL & SHOPS` erőforráscsoportot eltávolítottuk az Overview fül fejlécéből. A csoport átkerült a **Coins & Sources** fül ablakába, a többi erőforrásblokk elé (legfelső pozíció). Ennek köszönhetően a fejlécben kizárólag a `HEROES & SKINS` csoport maradt meg.
- **Térközök javítása a fejlécben:** A `HEROES & SKINS` csoporton korábban lévő `margin-top: 3rem` felső margót eltávolítottuk a `.heroes_skins` osztálynál, mivel a fejlécben ez lett a legelső és egyetlen csoport, így a felesleges felső térköz megszűnt.
- **Erőforrás-kapszulák lekicsinyítése a Coins & Sources fülön:** A **Coins & Sources** fülön megjelenő összes erőforrás-pill (kapszula) és azok belső elemeinek (ikon, betűméret, border-width) méretét lecsökkentettük a függőleges erőforrás-pillek mintájára (magasság: `38px`, szélesség: `130px`, border: `10px`, betűméret: `19px`, ikon: `52px`). Az elemek közötti távolságot is szorosabbra vettük a fülön, így az összes érme és nyersanyag kényelmesen elfér a fix magasságú ablakban görgetés vagy túlfolyás nélkül.

## [0.5.17] - 2026-06-23

### Hozzáadva (Added)
- **Tudástár (TUDAS_TAR.md) létrehozása:** Létrehoztunk egy központosított játékmechanikai és matematikai segédletet a projekt gyökerében. A dokumentum összegyűjti és strukturálja a böngészős *Hero Wars: Dominion Era* verzió visszafejtett formuláit: az ereklye szintlépési költségeit (130-as szintig), a rúnák (glyphs) fejlesztési és aranytáblázatát (50-es szintig), az elsődleges-másodlagos statisztikai átszámítási képleteket, a harci erő (power) súlyozási szorzóit, valamint az olyan speciális szabályokat, mint a Gift of the Elements (GoE) nem-lineáris eloszlása, az első ereklye-fegyver 0.5-ös szorzója és a képességszintek rangalapú eltolódásai.

### Megváltoztatva (Changed)
- **Erőforrás sáv visszahelyezése a szinergia jelentés fölé:** A smaragd, arany és energia kapszulákat tartalmazó sávot (`.player-resources-bar`) kivettük a bal oldali profil alól, és visszahelyeztük a jobb oldali `.all-resources-wrapper` konténerbe, közvetlenül a Dominion Elemzés (szinergia jelentés) fölé. Ezzel párhuzamosan eltávolítottuk a `.vertical-resources` osztályt, visszaállítva a kapszulák klasszikus vízszintes elrendezését és normál méretét.

## [0.5.16] - 2026-06-21

### Megváltoztatva (Changed)
- **Helyezés és kampányszint dizájn igazítása:** A Dashboard **Teams** fülén a helyezést ("My ranking:") és a kampányszintet ("Campaign Stage:") ábrázoló kijelzőt a játékbeli stílushoz igazítottuk. A feliratot a badge fölé helyeztük, magát a számértéket pedig a `public/ui/rank.png` kép alapú, szárnyas kapszula-jelvény közepébe írtuk be, a nem aktív fülek (pl. Overview) színét követő `#a09fa4` betűszínnel. A betűméret növelése után a számérték függőleges igazítását `line-height: 1` és `padding-bottom: 3px` hozzáadásával finomhangoltuk, hogy a gomb vizuális közepére kerüljön, kompenzálva a böngésző alapértelmezett betűmetrikáit.
- **Kategóriaválasztó gombok átméretezése:** A Teams fülön lévő kategóriagombokat (Arena, Grand Arena, Campaign) megnöveltük a Hősök menüpont akciósávjának méretére. A gombok mostantól egységesen `190px` szélesek és `48px` magasak, a betűméretük pedig `16px`-re módosult a felesleges belső paddingek egyidejű eltávolításával.
- **Grand Aréna nevek elrejtése és lebegő (hover) overlay bevezetése:** A Grand Aréna három csapatsorának függőleges helytakarékossága érdekében a portrék alatt megjelenő hős- és kisérőneveket kivettük az alap elrendezésből. Helyette hover (egérmutató ráhúzása) eseményre megjelenő, enyhén sötétített, lekerekített (`rgba(10, 8, 14, 0.85)`) overlay réteget vezettünk be a képek felett, amelyen a nevek fehér betűkkel, középre igazítva olvashatók. Ez a megoldás jelentős függőleges helyet szabadított fel, így a harmadik sor is teljes egészében láthatóvá vált.
- **Személyre szabott szinergia- és kapcsolatalapú játékosjellemzés az Overview lapon:** Bevezettünk egy teljesen dinamikus, szabályalapú szöveggeneráló motort (`src/utils/narrativeGenerator.js`), amely a játékos HAR fájlból szinkronizált aktív csapata (Arena vagy Campaign) alapján többsoros, egybefüggő magyar nyelvű elemzést készít. A szöveg elemzi a csapat domináns frakcióját, megkeresi a hősök közötti specifikus szinergia-kapcsolatokat egy új relációs adatbázisból (`src/data/heroRelations.json`), kiemeli a csapat legerősebb hősének tulajdonságait és elemzi a szerepkörök (Tank, Healer, Support stb.) taktikai egyensúlyát. A szöveg közvetlenül a profil fejléc alatt, szép sorközökkel és kiemelésekkel stílusozva jelenik meg.
- **Függőleges profil és erőforrás sáv elrendezése, valamint Layout Swap:** Az Overview fül fejlécében a fő erőforrások sávját (`.player-resources-bar`) a játékos profil widgete (`.player-profile-widget`) alá helyeztük át egy közös függőleges oszlopba (`.profile-left-column`), ahol a smaragd, arany és energia egymás alatt jelennek meg. Ezzel a jobb oldalon lévő szinergia-jelentés (Dominion Elemzés) feljebb került, közvetlenül a profil widget mellé egy vonalba, és kitölti a teljes magasságot. A nagyszámú másodlagos érme és kő kijelzője (`header-secondary-resources-group`) lekerült a fejléc alá a tágasabb alsó területre.
- **Fő erőforrás kapszulák (pillek) lekicsinyítése:** Hogy a smaragd, arany és energia kapszulák esztétikusan elférjenek a 180px széles bal oldali profil oszlopban, lekicsinyítettük őket: magasságukat `38px`-re, szélességüket `130px`-re csökkentettük, a 9-szeletes (9-slice) szegélyvastagságot pedig `10px`-re állítottuk. Az ikonokat `52px`-re méreteztük át, balra tolásukat `-28px`-re csökkentettük, a betűméretet pedig `19px`-re vettük vissza a tökéletes, túlfolyás-mentes illeszkedés érdekében.
- **Csapatok mentése és visszatöltése a JSON exportban:** Kibővítettük a JSON export logikáját (`exportData` a `HeroContext.jsx`-ben), így a HAR szinkronizációból származó csapatösszeállítások (Arena, Grand Arena, Campaign csapatok) is bekerülnek a kiexportált `.json` állományba a `"teams"` kulcs alá. A visszatöltéskor (`loadViewData`) beolvassuk a mentett csapatokat a `viewTeams` állapotba. A kontextus provider a `playerTeams` lekérésekor dinamikusan a megfelelő (saját vagy betöltött nézeti) csapatot adja vissza a komponenseknek. Ezzel megtekintő módban (Viewer mode) is láthatóvá válnak a barátok csapatfelállásai, és a Dominion Elemzés is az ő specifikus csapatszinergiáikat mutatja be.
- **Statikus képútvonalak javítása a CSS-ben:** A `.player-name-banner`, `.player-vip-banner`, `.game-resource-pill`, `.teams-ranking-info` és `.team-cat-btn` osztályok háttérkép-hivatkozásait relatívról (`./ui/...`) abszolútra (`/ui/...`) javítottuk. Ez megszüntette a Vite buildeléskor jelentkező "didn't resolve at build time" figyelmeztetéseket a statikus public mappában lévő assetekre vonatkozóan, miközben a képek futási időben továbbra is hibátlanul betöltődnek.
- **Üdvözlő kártya cím-levágásának javítása:** A `.dashboard-welcome-title` osztályhoz `line-height: 1.3` és `padding-top: 8px` értékeket adtunk hozzá. Ez megoldotta a cím felső részének levágását, ami a `-webkit-background-clip: text` maszkolás miatt jelentkezett, így a nagybetűs magyar ékezetek (pl. Ü, Ö) ismét teljes egészükben és hibátlanul megjelennek a felületen.

## [0.5.15] - 2026-06-21

### Megváltoztatva (Changed)
- **Csapattagok bélyegképeinek átméretezése és Grand Aréna elrendezés:** A Dashboard **Teams** fülén megjelenő hős- és háziállat-bélyegképek méretét a Hősök lap stílusához igazítottuk, de a 6 tagú csapatok sorban történő törésmentes megjelenése érdekében a standard méretnél 10%-kal kisebbre (`135px` kártyaszélesség, `112px` portré) méreteztük át. A szintjelvények és a rangszegélyek is megkapták a hősök lapján megszokott látványvilágot (lebegő elhelyezkedés és rangnak megfelelő színű keretek). A Grand Aréna felületén a felesleges `grand-arena-row` wrapper konténer és a csapatszámozások (`Team #1-3`) eltávolításával, a többi füllel megegyező `.team-row-showcase` szülő wrapper bevezetésével, valamint az első csapatsor felső paddingjének nullázásával (`.grand-team-subrow:first-child { padding-top: 0; }`) tökéletesen konzisztenssé és pixelpontossá tettük az elrendezést az Aréna és Campaign csapatokéval.

### Javítva (Fixed)
- **Aréna helyezések és kampányszint importálásának javítása:** Korrigáltuk a [DataSyncModal.jsx](file:///d:/dev/hero%20wars/src/components/DataSyncModal.jsx) fájlban a HAR-alapú adatimportálást. A rendszer mostantól sikeresen kiolvassa az `arenaGetAll` és a `missionGetAll` API-válaszokból a játékos aktuális aréna (`arenaPlace`) és grand aréna (`grandPlace`) helyezéseit, valamint a teljesített küldetésekből a legmagasabb szintet (`campaignLevel`), majd ezeket elmenti a játékos profiljába. Ennek eredményeképpen a Dashboard **Teams** ablakában a "My ranking:" és a "Campaign Stage:" feliratok mellett helyesen megjelennek a valós értékek a korábbi hiányjelek (`-`) helyett.


## [0.5.14] - 2026-06-21

### Hozzáadva (Added)
- **Kiterjesztett nyersanyag-nyomonkövetés:** A korábbi erőforrások mellé sikeresen integráltunk 26 új, esszenciális játékelemet a rendszerbe, beleértve a titán és háziállat (pet) fejlesztési tárgyakat, trófeákat, valamint a katalizátorokat és varázsmagvakat.
- **Tematikus erőforrás-csoportosítás:** Az áttekinthetőség érdekében az erőforrásokat logikai kategóriákba rendeztük (Általános & Boltok, Hősök & Bőrkövek, Ereklyék, Háziállatok, Titánok, Trófeák, Titán Völgy & Fa). A kategóriákat stílusos, vékony arany alsó szegéllyel ellátott címsorok (`resource-group-label`) választják el.
- **Interaktív eszközleírások (Tooltipek):** Minden erőforrás-kapszula megkapta a játékbeli, pontos angol megnevezését (pl. *Artifact Chest Key*, *Clash of Worlds Trophy*) natív tooltipként, amely az egér rámutatásakor (hover) automatikusan megjelenik.
- **Teljes Fiók-Pillanatkép (JSON Export):** A JSON export és a Megtekintő mód (Viewer mode) logikáját teljesen újraírtuk. A funkció immár nemcsak a hősöket, hanem a teljes profilt, az érméket, energiát és minden nyersanyagot kiment egy intelligens (formatVersion: 2) struktúrába, amit betöltéskor azonnal és maradéktalanul megjelenít a Dashboard felületén is.


### Megváltoztatva (Changed)
- **Fejléc vizuális szeparációja:** A profil fejlécének hátterét és keretét leválasztottuk a fő konténerről. Ennek köszönhetően a profil-kártya (`player-profile-widget`) mostantól különálló "szigetként" emelkedik ki a bal felső sarokban a prémium kártyákhoz hasonló dizájnnal, míg az erőforrás-csoportok átlátszó alapon sorakoznak mellette.
- **Függőleges igazítás javítása:** A megnövekedett erőforrás-lista miatti profil-lecsúszást orvosoltuk az igazítás (`align-items: flex-start`) módosításával, így a profil "sziget" fixen a bal felső sarokhoz van horgonyozva.

### Javítva (Fixed)
- **Nyersanyag ID-k mélyreható javítása:** Számos erőforrás (különösen a bőrkövek és a trófeák) értékének felcserélődését javítottuk. Egy speciális diagnosztikai szkripttel a teljes HAR adatszerkezetet rekurzívan elemeztük, és 100%-os pontossággal dekódoltuk a játék belső azonosítóit (pl. a bőrkövek nem a 101-103, hanem a 8-10-es azonosítókon szerepelnek). A `DataSyncModal` most már ezeket a hajszálpontos azonosítókat használja az adatok kinyerésére.
- **"Soul Crystal" ikon-hiba (onError) eltávolítása:** Eltávolítottuk azt a megtévesztő hibakezelőt a `Dashboard.jsx`-ből, amely minden hiányzó vagy hibás nevű képfájl esetén egy Soul Crystal (Lélekkristály) ikont jelenített meg helyettesítőként. Az ikonok neveit szintén korrigáltuk a `public/ui` mappában ténylegesen megtalálható fájlokhoz (pl. `egg.webp`, `elemental.png`, `primal.png`, `key.png`).
- **JSON Export felesleges adatainak eltávolítása:** Az adatok exportálása során (a memóriában esetlegesen beragadt történelmi maradványok miatt) bekerültek a statikus katalógusadatok (pl. hős leírása, szerepköre, képe) is az exportált fájlba. Ezt javítottuk: mostantól a JSON export szigorúan csak a dinamikus, játékoshoz tartozó adatokat menti el, így a fájl mérete és tartalma letisztultabb lett.

## [0.5.13] - 2026-06-20
### Megváltoztatva (Changed)
- **Dinamikus 9-slice erőforrás-kapszulák:** A fő erőforrások (smaragd, arany, energia), valamint az összes érme és bőrkő megkapta az egyedi `sources.png` alapú 9-szeletes (`border-image`) hátteret. Ezzel a kapszulák szélessége dinamikusan, a bennük lévő számok hosszához igazodva tud növekedni, miközben a sarkok lekerekítése torzításmentes marad.
- **Kompakt erőforrás-elrendezés:** A másodlagos erőforrásokat (érmék és bőrkövek) áthelyeztük közvetlenül az elsődleges erőforrás-sáv alá, egy közös függőleges konténerbe (`all-resources-wrapper`). Az elsődleges sáv vízszintes elrendezést kapott.
- **Tökéletes oszlopos igazítás CSS Griddel:** A másodlagos erőforrások két sorát egy közös CSS Grid rácsba helyeztük (`header-secondary-resources-group`), így a különböző szélességű kapszulák ellenére a felső és az alsó sor ikonjai mértani pontossággal, tökéletesen egymás alatt helyezkednek el.
- **Egységes fehér tipográfia:** Eltávolítottuk az értékek színkódolását (zöld, arany, kék, és a bőrkövek egyedi színei). Mostantól minden erőforrás értéke hófehér színben, erős fekete árnyékolással (`text-shadow`) jelenik meg az egységes és letisztult megjelenés érdekében.
- **Ikonok pixelpontos igazítása:** Az erőforrás-ikonok méretét visszaállítottuk az eredeti (100%-os) 75x75 pixeles natív felbontásukra. Emellett az ikonokat függőlegesen középre zártuk, és erősen balra toltuk (`left: -55px`), az egyes ikonoknál egyedi vertikális finomhangolásokkal kiegészítve, hogy tökéletesen elfedjék a kapszula bal oldali peremét.
- **Felesleges elemek törlése:** Eltávolítottuk a használaton kívüli `+` gombokat az elsődleges erőforrások végéről, valamint a "Játékbeli Érmék" és "Bőrkövek (Skin Stones)" feliratokat a másodlagos sávok fölül.

## [0.5.12] - 2026-06-19

### Megváltoztatva (Changed)
- **Profilkép helyett Avatar ID megjelenítése:** A nem hős azonosítójú (egyedi vagy előfizetéses) profilképek helyett a program mostantól közvetlenül az `avatarId` számot (pl. `1294`) jeleníti meg a keret alatt egy stílusos, lekerekített, arany-barna radiális átmenettel rendelkező háttérben. Ezzel teljesen kiküszöböltük a nem támogatott vagy egyedi profilképek hibás/eltérő megjelenítését.

## [0.5.11] - 2026-06-19

### Javítva (Fixed)
- **Klán liga szinkronizáció javítása:** Kijavítottuk a HAR importáló (`DataSyncModal.jsx`) hibáját, ahol a ligainformációt hibásan közvetlenül a `clanData.league` helyről kísérelte meg beolvasni a program. A helyes elérés a `clanData.clan.league`, amelynek átírásával az Arany Liga tagjai most már sikeresen megkapják a hozzájuk tartozó díszes liga-avatárkeretet a Dashboardon.
- **Profil fejléc és képek méretezésének javítása:**
  - A névszalag (`name.png`) és a VIP-szalag (`vip.png`) stílusát fixáltuk a natív méretükre (175x44px, illetve 159x44px), megszüntetve a korábbi csúnya torzulást és átméretezést.
  - A szintjelző badge-et az eddigi kör alakú formáról a játékhoz hű, 3 számjegynek is elegendő helyet biztosító, fekvő kapszula (ellipszis) formájúvá alakítottuk (`border-radius: 12px; width: 46px; height: 24px;`).
  - Az avatar keretet és a benne lévő profilképet összehangoltuk a keret valódi képarányával (96x101px), és az avatar képet maszkolva, tökéletesen a keret nyílása alatt, középre rendezve helyeztük el.
  - A profil widget elemei között bevezettük a megfelelő függőleges eltartásokat (flex gap: 8px), valamint a widget szélességét 180px-re növeltük a túlcsordulások megelőzésére.

## [0.5.10] - 2026-06-19

### Hozzáadva (Added)
- **Céh liga alapú dinamikus avatar keret:** A HAR fájl `clanGetInfo` válaszából kiolvassuk a játékos céhének ligáját (`league`), és ennek megfelelően dinamikusan a megfelelő keretet jelenítjük meg (`guild_war_gold_league_frame.webp`, `silver_league_frame`, `bronze_league_frame` vagy az alap `base_frame.webp`).
- **Valós, játékon belüli grafikák alkalmazása:** Beépítettük a felhasználó által biztosított `name.png` (barna/arany névszalag) és `vip.png` (arany VIP sáv) képeket a profil widget háttereként.
- **Helyes Valkűr avatar letöltése:** Letöltöttük a valódi, játékbeli `Browser Valkyrie Avatar.png` fájlt `avatar_default.webp` néven a Wikia CDN-ről, így a logó helyett a felhasználó saját Valkűr profilképe jelenik meg.

### Megváltoztatva (Changed)
- **Szintjelző badge stílusának finomhangolása:** A korábbi téglalap alakú szintbadge helyett egy szabályos kerek, fekete hátterű, vastag arany kerettel (`3.5px solid #d4af37`) és nagyobb betűmérettel rendelkező ellipszist alakítottunk ki, amely pontosan a játékbeli stílust követi, és élethűen ráfekszik az avatár keret aljára.

## [0.5.9] - 2026-06-19

### Hozzáadva (Added)
- **Kompakt, játékbeli stílusú profil widget:** Bevezettük az avatar widgetet, amely egy kerek, díszes keretben (`avatar_frame.webp`) ábrázolja a felhasználó avatárját, az aljára rálógó szintjelzővel (`130`), alatta a név barna/arany szalagjával (`Fenrile`), legalul pedig a VIP szint arany szalagjával (`VIP 8`), pontosan megegyezve a játékbeli elrendezéssel.
- **Kapszula stílusú erőforrás-kijelzés:** A smaragd, arany és energia értékeket a játékban látható, arany szegéllyel díszített sötét kapszulákba (pill) rendeztük el, bal oldalon kilógó ikonokkal és jobb oldalon egyedi plusz gombokkal.

### Megváltoztatva (Changed)
- **Dashboard fejléc elrendezése:** Összevontuk a korábbi különálló profil kártyát és erőforrás rácsot egyetlen kompakt, vízszintes fejléc sávba (`.dashboard-game-header`), amivel jelentős helyet spóroltunk meg a képernyőn, és sokkal élethűbbé tettük a Dashboard megjelenését.

## [0.5.8] - 2026-06-19

### Hozzáadva (Added)
- **Megújult játékbeli stílusú Dashboard:** Létrehoztuk a *Hero Wars* sötét-arany vizuális világához hű új Dashboard felületet, amely tartalmazza a játékos profiladatatlapját (név, szint, VIP szint és pontok), a fő erőforrásokat (smaragd, arany, energia) és a játékon belüli egyéb fizetőeszközöket, bőrköveket.
- **Aktív csapatok vizuális összeállítása:** A Dashboardon megjelenítettük a Hadjárat, az Aréna és a Grand Aréna (3 csapat) aktív felállásait a hősök és petek egyedi portréival, a hősök szintjének megfelelő rang-keretekkel.
- **Kiterjesztett HAR adatimportálás:** A `DataSyncModal.jsx` importáló logikáját felkészítettük a `userGetInfo`, `inventoryGet` és `teamGetAll` válaszok beolvasására, így a HAR fájlból az összes profil, erőforrás, érme és csapatadat automatikusan szinkronizálódik és a Local Storage-ben perzisztálódik.
- **Automatizált Wikia CDN ikonletöltő szkript:** Elkészült a `download_assets.js` segédszkript, amely a Wikia szervereiről MD5 hash alapú URL-generálással automatikusan letölti a szükséges 13 db játékbeli ikont WebP formátumban a `public/ui` könyvtárba.
- **Többfüles navigációs struktúra:** Bevezettük az `activeTab` állapotot az `App.jsx` szintjén, így a megújult oldalsávval (`Sidebar.jsx`) zökkenőmentes váltást biztosítottunk a Dashboard és a Hősök listája (`Heroes`) fülek között.

### Megváltoztatva (Changed)
- **Erőforrás- és érmeikonok hivatkozásainak frissítése:** A `Dashboard.jsx` fájlban az összes `public/ui` könyvtárra hivatkozó ikon kiterjesztését `.png`-ről `.webp`-re módosítottuk, összhangban a Wikia CDN automatikusan optimalizált és letöltött WebP formátumú képeivel. Ezáltal az összes játékon belüli érme és alapanyag helyesen megjelenik a felületen.

### Javítva (Fixed)
- **Hős portrék keretből való kilógása a csapatoknál:** A `Dashboard.jsx` csapat-összeállítási szekciójában bevezettünk egy belső, `.team-member-portrait-inner` osztályú maszkoló konténert a hős portrék köré. A `Dashboard.css`-ben ezt a konténert `overflow: hidden` és `border-radius: 6px` tulajdonságokkal láttuk el, miközben a hős képét 100%-ra növeltük ezen belül. Ezáltal a hős képének sarkai a díszes rang-keret mögé vágódnak le, teljesen megszüntetve a kép sarkainak kilógását a keret átlátszó részei alatt.

## [0.5.7] - 2026-06-18

### Hozzáadva (Added)
- **Gyorskereső a hősök listáján:** Új, nagyító ikonnal ellátott, stílusos keresőmezőt helyeztünk el a fejlécben, amely gépelés közben valós időben szűri a hősöket név szerint.
- **Szerepkör és Szövetség szűrők:** Két új legördülő menü került beépítésre, amelyek segítségével szerepkör (pl. Tank, Mage) és a játékbeli szövetség/frakció (pl. Undead, Grove Keeper) alapján szűrhetők a hősök. A szűrők egymással és a névkeresővel is kumulatív módon együttműködnek.
- **Dinamikus birtokolt hősök számlálója:** A korábbi statikus hősösszesítő helyett most a megidézett hősök és a teljes létszám aránya jelenik meg (pl. `Birtokolt: 45 / 73` formában).

### Megváltoztatva (Changed)
- **Kereső és szűrők stílusának igazítása:** Az akciósáv gombjai (Search, Role, Faction, Sort) egységes szélességet (190px) és tiszta balra igazítást kaptak. A gombkonténerek paddingjának nullázásával és az ikonok bal oldali margójának (16px) beállításával biztosítottuk, hogy az ikonok és a feliratok elkerüljék a 3D-s arany keretet és közvetlenül egymást követve, szorosan elrendezve jelenjenek meg.
- **Oldalugrás megakadályozása szűréskor:** Kényszerítettük a függőleges görgetősáv állandó megjelenítését (`html { overflow-y: scroll; }`), így a szűrések miatti találatszám-csökkenés (és a görgetősáv eltűnése) nem okoz kellemetlen oldalirányú rángatózást/ugrálást a felületen.

### Javítva (Fixed)
- **Többes szövetségű hősök szűrési hibája:** Javítottuk a szövetség (Faction) szerinti szűrést, hogy szigorú egyezés helyett részleges egyezést (`includes`) vizsgáljon, így a több szövetséghez is tartozó hősök (pl. Astaroth: Chaos, Demon; Alvanor: Grove Keeper, Elf) is helyesen és hiánytalanul megjelennek a szűrt eredmények között.

## [0.5.6] - 2026-06-18

### Megváltoztatva (Changed)
- **Hősútmutatók struktúrájának és fordításának javítása:** Átalakítottuk a `scrape_heroes.js` scrapelőt, hogy a `H1` címsorokat is szekcióként ismerje fel (pl. Képességek, Hős tippek, Kisállatok, Összegzés), elkerülve a leírások elcsúszását. Beépítettük az első TOC elem előtti bevezető szövegek (beleértve a hős előnyeit és hátrányait) automatikus kinyerését „Általános áttekintés” néven, miközben az inline Yandex reklámokat és scripteket kiszűrjük. Beépítettük a táblázatok (`figure`/`table`) részletes beolvasását és formázását is, így a skinek, rúnák és műtárgyak prioritási táblázatai is megjelennek szöveges formában. Emellett a meglévő JSON útmutatókat egy helyi tisztító szkripttel refaktoráltuk (eltávolítottuk a reklámkód-maradványokat, javítottuk az „Előnyök”/„Hátrányok” fordítását, és a listaelemeket bullet pontok nélkül külön sorokba tördeltük) anélkül, hogy azokat újra le kellett volna tölteni a szerverről.
- **Képességnevek angolul tartása és behelyettesítése:** A képességnevek fordítását külön angol nyelvű batch-csel végezzük, így a magyar magyarázatok mellett a képességek és a fejlesztési megjegyzések címei egységesen az angol játékelnevezéseket mutatják (pl. Strike of the Damned, Unity of the Damned) a korábbi részben magyarított kifejezések helyett.
- **Kategóriák vizuális hierarchiája az Útmutató fülön:** A `HeroModal.jsx`-ben a szekciók szintje (level 1 vs. 2 és 3) alapján dinamikusan formázzuk a címeket: a fő kategóriák (H1) nagyobb betűméretet és border-bottom nélküli megjelenést kaptak, míg az al-kategóriák (H2 és H3) aláhúzott stílusban jelennek meg. Emellett az „Útmutató és gyakorlati tapasztalatok” főcím kiemelt stílust kapott (28px-es méret, arany szín és finom elválasztó vonal) a vizuális hierarchia tisztázása érdekében, valamint elhelyeztem mellette egy interaktív infó ikont és tooltipet, amely megjelöli a `moon-hero.site` forrást.

## [0.5.5] - 2026-06-18

### Megváltoztatva (Changed)
- **Kalkulációk magyarázatának összevonása és pontosítása:** A hősök adatlapján a Statisztikák (Stats) lap alján lévő korábbi két különálló magyarázó kártyát egyetlen, teljes szélességű vízszintes infóboxszá vontuk össze. A szövegben egyértelműen tisztáztuk, hogy a játékbeli **Harci erő (Power)** pontos (mert a HAR-fájlból közvetlenül kiolvasható), míg a többi statisztika (köztük a magyar fordításban szintén „erő”-nek nevezett **Strength** tulajdonság) számított érték, amely a Céhfejlesztések és Kisállat-bónuszok hiánya miatt tér el a játéktól.

## [0.5.4] - 2026-06-18

### Megváltoztatva (Changed)
- **Zászló-fülek sorrendjének frissítése:** A hősök adatlapján (HeroModal.jsx) elhelyezkedő zászlós navigációs fülek sorrendje a játékosok igényeihez igazítva módosult: Info, Útmutató, Skills, Skins, Stats, Glyphs, Gift of the Elements, Artifacts, Ascension.

## [0.5.3] - 2026-06-18

### Hozzáadva (Added)
- **Hős játékbeli specifikációk szótára (heroGameSpecs.json):** Új adatfájl hozzáadása, amely mind a 73 hős valós, játékbeli harcvonal-pozícióját (front/middle/back line) és szövetségi/faji különlegességét (Special: pl. Undead, Grove Keeper, Demon, Elf, Blessed, Chaos, Engineer) tartalmazza.

### Megváltoztatva (Changed)
- **Részletes játékbeli besorolások megjelenítése:** A hősök adatlapján (HeroModal.jsx) az Info fül alján elhelyezkedő statisztikai rész átalakításra került. Az elavult és hiányos dobozok helyett a játékhoz hű, részletes és strukturált bontásban jelenik meg a Harcvonal (Line), a Fő szerepkör (Main role), a Kiegészítő szerepkör (Additional role), a Szövetség (Special) és a Fő hős statisztika (Main hero stat). A kiegészítő szerepkör és a szövetség doboza dinamikusan jelenik meg: ha a hős nem rendelkezik ilyen tulajdonsággal a játékban, a megfelelő doboz nem renderelődik.

## [0.5.2] - 2026-06-18

### Megváltoztatva (Changed)
- **Optimalizált és áthelyezett adatmásolás:** A hősök adatlapján található „Adatok másolása” gomb átkerült a bal oldali zászlók alól az „Info” lap jobb felső sarkába, a hős nevével és azonosítójával egy sorba, letisztultabbá téve az oldalsávot. A gomb mellé elhelyeztem egy stílusos arany infó ikont és egy részletes magyarázó tooltipet az AI-tanácsadás megkönnyítésére. A másolt JSON-adatokból eltávolítottam a sallangokat (például a hibás Google Drive kép-URL-eket és leírásokat), viszont kiegészítettem az aktuális szinten számított valós statisztikai értékekkel (`calculatedStats`).

## [0.5.1] - 2026-06-18

### Megváltoztatva (Changed)
- **Dinamikus export fájlnevek:** Az exportált JSON-adatfájl és a narratív összefoglaló szövegfájl (summary) elnevezései a korábbi fix `dominion_heroes_export` és `dominion_heroes_summary` helyett dinamikusan, az exportálás pillanatában érvényes dátum és időpont alapján generálódnak `ÉÉÉÉ.HH.NN_ÓÓPP` formátumban (például `2026.06.18_2029.json` és `2026.06.18_2029.txt`).

## [0.5.0] - 2026-06-15

### Hozzáadva (Added)
- **Narratív szöveges exportálás:** A szinkronizációs panelen elvégzett Exportálás funkció mostantól a `dominion_heroes_export.json` mellett egy `dominion_heroes_summary.txt` fájlt is legenerál és letölt. A szöveges riport narratív formában, érthető megnevezésekkel írja le a birtokolt hősök fejlődési szintjeit, erejét, képességeit, skineit, rúnáit, felemelkedését és a Gift of the Elements szintjét, elősegítve a külső AI rendszerekkel való megosztást és elemzést.
- **Rendezett export tartalom:** Az exportált JSON és szöveges riport fájlok tartalma pontosan követi a főoldalon aktívan kiválasztott rendezési sorrendet (pl. Erő csökkenő, Név A-Z).
- **Skin ID leképezés (skinMapping.json):** Új adatfájl hozzáadása, amely 170 hős kinézet (skin) numerikus azonosítóját képezi le a hozzá tartozó hősre és a skin szemantikus angol nevére.

### Megváltoztatva (Changed)
- **Globális rendezési állapot:** A hősök listájának rendezési állapota (`sortMode`) a Dashboard-ról a globális `HeroContext`-be került áthelyezésre, hogy az exportáló logika közvetlenül el tudja érni az aktív szűrési/rendezési szempontot.
- **Passzív, prémium hősadatlap (Read-Only):** A hősök részletes adatlapja (`HeroModal.jsx`) teljesen beviteli mezőktől mentessé, passzív vizuális felületté vált. A korábbi inputok helyét stílusos folyamatjelzők (progress bar), arany csillagok, római számok és rendezett kártyák vették át, amelyek a HAR-fájlból kinyert adatokat jelenítik meg a játékhoz hű sötét-arany stílusban. A felesleges mentési logikát és a mentés gombot eltávolítottuk, az "Adatok Másolása" gomb megmaradt és megújult dizájnt kapott.

### Javítva (Fixed)
- **HAR-fájl skin importálás és megjelenítés:** Kijavításra került a kinézetek (skins) hibás szinkronizációja a HAR-fájlból. A default skin azonosítása mostantól dinamikusan, a feloldott skinek legkisebb ID-ja alapján történik. A nem-default skinek az új `skinMapping.json` segítségével közvetlenül a megnevezésük szerint mentődnek el a hős adatlapjára. Javításra került a mentett kinézetek megjelenítési és exportálási logikája is a `HeroModal.jsx`, `HeroContext.jsx` és `statCalculator.js` fájlokban: a program mostantól a név alapú leképezést részesíti előnyben, de ha az nem található, visszalép (fallback) az ID-alapú kulcsra. Ez megoldotta a Corvus és más hősök egyedi kinézeteinek (pl. Dark Depths Skin, Winter Skin) 0/60-as hibás kijelzését, mind a felületen (Skins fül), mind a letölthető szöveges riportban (TXT export).

## [0.4.1] - 2026-06-11

### Hozzáadva (Added)
- **Hősútmutatók:** Egy Node.js-alapú adatkinyerő szkript (`scrape_heroes.js`) került a projektbe, amely automatikusan lementi, feldolgozza és a Google Translate API segítségével oroszról magyarra fordítja a hősök részletes útmutatóit a `moon-hero.site` oldalról. A generált adatok az `src/data/guides/` mappában tárolódnak független JSON-fájlokként.
- **Útmutató fül a hősadatlapon:** A `HeroModal.jsx` kibővült egy dinamikus „Útmutató” füllel, amely megnyitáskor automatikusan betölti a hős azonosítója (ID) alapján a kinyert és magyarított gyakorlati tapasztalatokat, kinézeteket és műtárgyleírásokat. Nem minden hőshöz tartozik Útmutató, mert a weboldalon mindössze 65 hőst találunk a jelenlegi 73-ból.

### Megváltoztatva (Changed)
- **Fejléc szövege:** A fejléc (Header) címe "Fejlődésmérő és összehasonlító"-ról "Fejlődésmérő"-re rövidült.
- **Hősavatár javítása:** Az `index.css`-ben lévő `.hero-card-image-wrapper` és a keretek igazítása javításra került. A korábbi fix `min-width` és `min-height` értékek eltávolításával és a dimenziók szinkronizálásával megszűnt a képkeret levágása a hősadatlapon.

### Eltávolítva (Removed)
- **Felesleges munka- és tesztfájlok:** A gyökérmappából és az `src/scripts` mappából törlésre került több mint 15 darab korábbi ideiglenes, egyszer használatos és tesztelésre szánt `.cjs` és `.js` szkript a kódbázis tisztán tartása érdekében.

## [0.4.0] - 2026-06-11

### Hozzáadva (Added)
- **Modális navigáció (Zászlók):** Az eredeti játékfelülethez igazodó, nyílvégű zászlós navigációs panel a bal oldalon, a kereten kívül (`arrow.png` és `arrow_green.png` felhasználásával).
- **Zászlók rétegzése:** A kiválasztott, zöld színű zászló a keret fölé lóg, míg a passzív barna zászlók éle rejtve marad az aranykeret alatt.
- **Angol zászlófeliratok:** A zászlók szövege az eredeti játék alapján került meghatározásra (Info, Stats, Skills, Skins, Artifacts, Gift of the Elements, Glyphs, Ascension).

### Megváltoztatva (Changed)
- **Teljes CSS tisztítás:** Az összes beégetett (inline) `style={{...}}` tulajdonság eltávolításra került a projekt összes fájljából (`Sidebar.jsx`, `Header.jsx`, `HeroModal.jsx`, `DataSyncModal.jsx`, `Dashboard.jsx`). A formázások kizárólag dedikált, tiszta CSS osztályokba kerültek az `index.css`-ben.
- **Hős adatlap dizájn-szinkron:** Az Info panel CSS osztályokba lett kiszervezve, és az elválasztó vonal dizájnja szinkronba került a főképernyő fejlécének arany színátmenetes (`linear-gradient`) keretével.
- **Karakter információk mozgatása:** A hős képe, azonosítója (ID), neve és frakciója lekerült a bal oldali sávból, és most már a belső "Info" (Leírás és értékelés) fül szerves részét képezi.
- **CSS architektúra optimalizálása:** Számos beégetett (inline) CSS tulajdonság (`HeroModal.jsx`-ből) átszervezésre került különálló, dedikált osztályokba (pl. `.modal-save-container`, `.btn-save` finomhangolása).
- **Címszalag javítása:** A `.modal-title-banner` esetében a kerekítési hibát okozó `transform` és `left: 50%` alapú középre igazítás lecserélődött `margin: 0 auto` pozicionálásra a képi folytonossági hiba megszüntetése érdekében.


### Eltávolítva (Removed)
- **Ismertető alcím:** Az Info fülön lévő felesleges "Ismertető" címke (`tab-section-title`) véglegesen törlésre került a kódbázisból.

## [0.3.8] - 2026-06-10

### Hozzáadva (Added)
- **Képalapú aranykeret (9-slice):** A modális ablak megkapta a hivatalos, játékhoz hű aranykeretet a `modal_frame.png` felhasználásával, amely dinamikusan, nyújtás és torzulás nélkül öleli körbe a tartalmat.
- **Grafikus címszalag (banner):** A modal címe ("Hős adatlap") mostantól egy felső, grafikusan ráillesztett címszalagon (`modal_title.png`) jelenik meg, tökéletesen megegyezve a bal oldali menü tipográfiájával.
- **Frakciók magyarítása és megjelenítése:** A hős neve mellett a bal oldali panelen helyet kapott a hős frakciója is, amelyet az alkalmazás automatikusan lefordít a hivatalos angol frakciónevek alapján (pl. "A természet útja").

### Megváltoztatva (Changed)
- **Modális ablak elrendezése (fekvő nézet):** A korábbi keskeny, egyoszlopos HeroModal egy széles, fekvő (landscape) 1200x700 pixeles elrendezéssé alakult át. A felület egy 30%-os bal oldali (profil és menü) és egy 70%-os jobb oldali (görgethető tartalom) részre bomlott, halványabb, elkülönített háttérpanelekkel.
- **Navigációs fülek (tabs) és helyesírás:** A fülek balra igazítottak lettek, fixen `#f7e1b6` színnel, hover alatti színváltás nélkül. A felirataik az MTA 12. kiadásának megfelelő, magyaros helyesírást (csak az első szó nagybetűs, kötőszók rendbe rakva, pl. "Képességek és kinézetek") kaptak.
- **Gombok és interakciók (fehér fátyol):** A gombok a játék eredeti grafikáit használják. Kifejlesztésre került egy egyedi, tejszerű "fehér fátyol" hover-effekt (`brightness` és `contrast` együttes CSS manipulációja), amely anélkül emeli ki a gombot, hogy elrontaná a PNG-k átlátszóságát. A "Mentés" gomb szövege fixen `#e4ff59` színkódot kapott és átkerült a bal oszlop aljára.

### Eltávolítva (Removed)
- **"Mégse" gomb:** A dupla gombos rendszerből kikerült a "Mégse" gomb. A kilépés ezentúl a jobb felső sarokban elhelyezett, egyedi grafikájú `close.png` "X" ikonnal lehetséges.

## [0.3.7] - 2026-06-10

### Hozzáadva (Added)
- **Hősismertető és -értékelés:** A `HeroModal`-ba bekerült egy vadonatúj, magyar nyelvű „Leírás & Értékelés” fül, amely mostantól az alapértelmezett nézet. Itt olvasható a hősök részletes története, valamint vizuálisan (✅ és ❌ ikonokkal) kiemelve láthatók az erősségek, a gyengeségek, a fő statisztika és a szerepkör. Ez mind a 73 hős számára legenerált, magas minőségű szövegekre épül.
- **Részletes hőskártyafejléc a modális ablakban:** A `HeroModal` fejléce kibővült. A hősök képe körül immár pontosan ugyanaz a minőségi keret, szintjelvény és csillagozás jelenik meg, mint a főoldalon lévő hőskártyákon.

### Megváltoztatva (Changed)
- **Magyar nyelvű fülek:** A `HeroModal`-ban az összes fül neve (pl. *General & Stats* -> *Általános & Statisztikák*) teljesen magyarosítva lett.
- **Szerepkörök megjelenítése a frakciók helyett:** A főoldali hőskártyákon a hősök neve alatt eddig látható, sokszor zavaró angol nyelvű frakciók (pl. „Way of Nature”) helyére a frissen legenerált és hasznosabb szerepkörök (pl. Tank, Marksman) kerültek.
- **Lokális képbetöltés:** Az alkalmazás mostantól teljesen függetlenedett a külső Google Drive-képlinkektől (`hero.img`). A `HeroModal` és a `HeroCard` kizárólag a `public/heroes/` mappában lévő, azonosító alapján hivatkozott lokális képeket (`./heroes/{id}.png`) használja, a hiba esetén lefutó felesleges fallback-logikák pedig eltávolításra kerültek.

### Eltávolítva (Removed)
- **Frakciók a modális ablak fejlécéből:** A `HeroModal` fejlécéből kikerült a frakciónév és az ikon, mivel az angol nyelvű szöveg zavaró volt, és a fontos információk (szerepkör, statisztika) már az új „Leírás & Értékelés” fülön kaptak helyet.

## [0.3.6] - 2026-06-10

### Hozzáadva (Added)
- **Gyors és pontos HAR-importálás:** Egy új, villámgyors megoldás került bevezetésre a hősök frissítésére. A böngésző hálózati forgalmának (HAR-fájl) betöltésével az alkalmazás azonnal kinyeri az adatokat a szerver hívása és bonyolult aláírási (signature) kódok generálása nélkül.
- **Inaktív hősök automatikus nullázása:** Adatimportáláskor az alkalmazás mostantól minden, az importfájlban nem szereplő hőst inaktív (0-s) szintre állít vissza ahelyett, hogy megtartaná a korábbi állapotukat.

### Megváltoztatva (Changed)
- **Egységesített adatkezelés (Data Sync):** Az "Importálás" és "Exportálás" funkciók egyetlen letisztult felületen, egy varázslószerű "Adatkezelés" ablakban kaptak helyet. A HAR-fájl betöltése után a rendszer azonnal felkínálja az új állapot lementését JSON-formátumban.
- **Megtekintő mód és fejléc (Header):** A "Megtekintő mód" a bal oldali menüből a fejlécbe költözött. Amikor egy idegen adat van betöltve, a fejléc piros figyelmeztetéssel jelzi ezt ("MEGTEKINTŐ MÓD AKTÍV"), az Adatkezelés gomb pedig eltűnik, nehogy a felhasználó véletlenül felülírja a sajátját. A kilépés egy hatalmas piros/arany "VISSZA A SAJÁTHOZ" gombbal lehetséges.
- **Interaktív és letisztult navigáció (Sidebar):** Az oldalsáv mentesült az adatkezelési funkcióktól, a menüpontok (Dashboard, Heroes, Titans stb.) pedig kattinthatóvá váltak, vizuálisan is jelezve az aktív fület. Ezen felül az oldalsáv alján egy új, dinamikusan változó felirat jelent meg, amely a kiválasztott menüponthoz illeszkedő rövid ismertetőt ad (pl. "Pets provide great help in battle.").

### Eltávolítva (Removed)
- **Manuális CSV-bekérés és régi szerver-letöltés:** A "Letöltés a szerverről" funkció (SyncModal), a régi proxy-API megoldások (`proxy.php`, `HeroKinyero.bat`), valamint a kézi CSV-kimásolás lehetősége az importálásból eltávolításra került az új, megbízhatóbb HAR-fájl importálásának javára.

## [0.3.5] - 2026-06-09

### Megváltoztatva (Changed)
- **ID-alapú hősazonosítás és képbetöltés:** Jelentős szoftverarchitekturális fejlesztés, amelynek köszönhetően a program a hősök képeit immár nem a nevük (ami tartalmazhat speciális és szóközzel tagolt karaktereket, pl. "K'arkh"), hanem a biztonságos és egyedi numerikus ID-juk alapján azonosítja és tölti be (pl. `Corvus.png` helyett `50.png`). Ehhez a mappában lévő összes hős kép fájlneve le lett cserélve az azonosítójára.
- **Relatív elérési utak (subdirectory támogatása):** Kijavítottunk egy komoly konfigurációs és útvonalkezelési hibát, amely miatt az éles Linux-szerver almappájában (subdirectory) a képek és CSS fájlok "404 Not Found" hibára futottak. A React kód és az adatbázis mostantól szigorú relatív útvonalakat (`./ui/hero.png`), az `index.css` pedig natív Vite által feldolgozott gyökérútvonalakat használ, így az alkalmazás és a teljes `dist` mappa bárhova bemásolható, teljesen hordozhatóvá vált.

## [0.3.4] - 2026-06-09

### Hozzáadva (Added)
- **Új hősök a katalógusban:** 10 új hős került felvételre az adatbázisba hivatalos ID alapján: Amira (56), Augustus (64), Chabba (11), Cleaver (24), Guus (68), Jet (31), Lara Croft (63), Ninja Turtles (65), Polaris (62) és Tristan (54).
- **Inaktív („Meg nem idézett”) hősállapot:** A program mostantól automatikusan megkülönbözteti a még nem birtokolt hősöket (0-s szintűek vagy nincsenek benne a saját importban). Ezek a kártyák a játékhoz hűen inaktív állapotba kerülnek: kattinthatatlanok, vizuálisan elsötétülnek (grayscale filter), eltűnik róluk a szintjelvény és a csillagozás, a keretük pedig automatikusan a legelső "White" szintű alapkeretre vált.

## [0.3.3] - 2026-06-07

### Hozzáadva (Added)
- **Tiszta alapértelmezett állapot:** Generáltunk egy új, független adatbázist (`defaultHeroes.json`), amely az összes hőst 1-es szintre, 1 csillagra és alap (White) felszerelésre állítja vissza. A program indításkor mostantól automatikusan ezt tölti be az ideiglenes export fájl (`User_Export.json`) helyett, így a program tiszta lappal indul, de azonnal látszik benne az összes elérhető hős. A projekt gyökerében lévő `User_Export.json` most már biztonságosan törölhető.

## [0.3.2] - 2026-06-07

### Hozzáadva (Added)
- **Hiányzó hős (Elmir):** Elmir (ID: 38) felvéve a belső `heroesCatalog.json` adatbázisba, így most már a program automatikusan felismeri és betölti az importált fájlokból.

### Megváltoztatva (Changed)
- **Képalapú gombok:** A CSS alapú gombok helyett az egyedi, játékstílusú `button.png` és `sort.png` grafikákat használja a program az Export/Import és a statisztikai panelek (`stat-chip`) háttereként.
- **Interaktív hover-effektek:** Az új grafikus gombok finom `:hover` és `:active` effekteket kaptak (nagyítás, fényerő változás és arany ragyogás) a reszponzív, tapintható élmény érdekében.
- **Szintjelvény (level badge):** A hősök szintjét mutató számok doboza kapott egy minimum szélességet (`44px`), a szövegük pedig egy masszív, 3D-s fekete körvonalat (text-shadow) a jobb olvashatóságért.
- **Oldalsáv keret:** Az oldalsáv (Sidebar) kapott egy felülről lefelé futó, átlátszóból aranyba áttűnő függőleges elválasztó keretet, ami tökéletesen megegyezik a fejléc alatti csíkkal.

### Javítva (Fixed)
- **Hibás szöveges ID-k az adatbázisban:** Két hős (Electra von Grave és Qing Mao) azonosítója véletlenül szöveges formátumban (pl. "electra") szerepelt a katalógusban. Ezeket visszajavítottuk a hivatalos numerikus azonosítóikra (70, illetve 28).

## [0.3.1] - 2026-06-07

### Hozzáadva (Added)
- **Képalapú csillagok a hőskártyákon:** Az 1-5 csillagos hősök kártyáján lecseréltük a korábbi beépített font ikonokat tiszta, játékból származó `star.png` képekre, amik 24px-es méretben, tökéletes térhatású (drop-shadow) kitöltéssel jelennek meg a kártya alján.
- **Abszolút szint grafikája:** A maximum (6) csillagot elért hősök egy dedikált `6stars.png` ikonográfiát kapnak az egyes csillagok helyett, ami 28px-es méretben büszkén ül a keret alján.

### Megváltoztatva (Changed)
- **Relatív útvonalak és build:** A projekt összes abszolút fájl- és képhivatkozása (pl. `/ui/...`) relatív útvonalra lett cserélve (`./ui/...`). Emellett a Vite konfigurációja is megkapta a `base: './'` paramétert, amivel az alkalmazás most már szabadon futtatható bármilyen almappából (pl. webtárhelyek, GitHub Pages).
- **Finomhangolt színek:** A hős rangok (szürke, zöld, kék, lila, narancs) HEX színkódjai finomítva lettek, hogy picit még jobban illeszkedjenek a hivatalos színvilághoz (pl. narancs: `#cfab59`, lila: `#c761df`).
- **Pontosított szövegezés:** A Dashboard fejlécének alcíme rövidebb, letisztultabb formát kapott ("A hősök tulajdonságai kattintással módosíthatók").

## [0.3.0] - 2026-06-07

### Hozzáadva (Added)
- **Képalapú hőskeretek:** A korábbi CSS-alapú eljárás helyett a hősök körüli keretek mostantól dedikált, a rangnak megfelelő PNG képeket töltenek be (pl. `orange+2.png`, `violet.png`) a `public/hero_borders/` mappából. Ezzel a hősök kártyái pontosan tükrözik a játék vizuális stílusát.

### Megváltoztatva (Changed)
- **Hőskártya méretezése és pozicionálása:** A hős profilképe fix 124x124 pixel méretűre lett csökkentve, míg az új ráillesztett keret-kép 132x132 pixelre lett felhúzva. A keret abszolút pozicionálással (`top: 50%`, `left: 50%`) tökéletesen középre lett igazítva, így pontosan ráfekszik a profilképre anélkül, hogy levágná azt.
- **Háttérszín átlátszóságának javítása:** A hőskártya burkoló div-jeiről (`hero-card-image-wrapper`, `hero-card-image-inner`) teljesen eltávolításra került a rangszín-alapú háttér. Ezzel elkerültük, hogy a hősök profilképének átlátszó széleinél a szürke (vagy egyéb) háttérszín átüssön, fals keret illúzióját keltve.

### Eltávolítva (Removed)
- **Generált CSS szegélyek és promóciós szöveg:** Teljesen eltávolítottuk a korábbi vastag CSS kereteket, és kikerült a kódrendszerből a kis méretű "+1, +2" szöveg kiíratása is a kártya bal felső sarkából, mivel az új képkeretek eleve vizuálisan kifejezik a promóciós szintet.
- **Használaton kívüli (holt) CSS-osztályok tisztítása:** Több mint 80 sornyi használaton kívüli CSS (régi statisztikai ikonok, Tailwind maradványok, felesleges effektek, progress bar sávok) lett véglegesen kigyomlálva az `index.css`-ből.

## [0.2.0] - 2026-06-07

### Hozzáadva (Added)
- **CSV-adatok importálása:** Új felugró ablak (ImportModal) és funkció, amellyel a játékból kinyert CSV-listát automatikusan be lehet olvasni. A rendszer egyből lefordítja a játék belső kódjait (színek -> Rank, skin azonosítók, rúna XP, Ascension Node ID-k).
- **Részletes hősadatlap (HeroModal):** A modal ablak több fülre (Tabs) lett bontva: General & Stats, Skills & Skins, Artifacts & GoE, Glyphs & Ascension, hogy kényelmesen elférjen a megszámlálhatatlan mennyiségű adat.
- **Információs ablakok (InfoModal):** Kérdőjel ikonok kerültek a bonyolult matematikai számításokhoz (Rúna XP-pontszám, Ascension-becslés), amelyekre kattintva felugró ablak magyarázza el a pontos hátteret a felhasználónak.
- **Egyedi rúnakiosztás (Custom Glyphs):** A hősök adatlapján a rúnák (Glyphs) fülön immár nem csak fix szöveges elemek, hanem legördülő menük találhatók. Ezekből a felhasználó szabadon beállíthatja, hogy az adott hős melyik 5 statisztikát használja a 12 lehetséges rúnatípus közül, így megszüntetve a statikus helykitöltőket.
- **Hősök rendezése:** A főoldalon (Dashboard) megjelent egy új legördülő menü (a korábbi fix "MYTHIC" számláló helyett). A felhasználó valós időben rendezheti a hősöket név szerint (A-Z, Z-A) és erő, azaz Power alapján (növekvő vagy csökkenő sorrendben).

### Megváltoztatva (Changed)
- **Dinamikus hőskeret és kártyaméret:** A hőskártyákon a hős aktuális rangja (Rank) szerinti színes keret jelenik meg. A rendszer automatikusan kiolvassa az alapszínt és a promóciós szintet (+1, +2 stb.). A túldíszített CSS-effektek helyett a kártyák letisztult formát kaptak: egységes 4px-es színes keret, a kép széleinél sötétedő belső árnyékkal (térhatás), valamint a kártya háttere a png képek mögött felveszi az aktuális rang színét. A promóciós szint egy kis szöveges jelzésként jelenik meg a bal felső sarokban. A kártyák profilképe fix 126x126px méretre lett optimalizálva az új lokális képek fogadására.
- **Szintjelző jelvény (Level Badge):** A hős szintje (Level) a profilkép felső közepére került. A jelvény kerete megkapja az aktuális rang színét, míg a háttere `color-mix()` segítségével ugyanennek a színnek az 50%-kal sötétített, mélyebb árnyalata lesz. A lekerekítések precíz matematikai (külső mínusz belső sugár) igazítást kaptak, így nincsenek hegyes belső sarkok.
- **Reszponzív grid elrendezés (auto-fill):** A hősök listázása (Dashboard) kódja modernizálva lett. A korábbi, felbontáshoz kötött fix oszlopszámok helyett egy natív `auto-fill` alapú CSS Grid felel az elrendezésért. Ezzel megszűntek az indokolatlanul nagy távolságok (gap) a kártyák között a FullHD vagy nagyobb felbontású monitorokon, a rendszer tökéletesen kitölti a rendelkezésre álló helyet.
- **Főoldali statisztikák megjelenése:** A statisztikai sáv („Összesen") feliratai kisbetűs, Roboto Condensed betűtípusra lettek lecserélve a jobb olvashatóság érdekében. Az ikon szintén egyedire lett cserélve (`hero.png`), tökéletes, pixelpontos függőleges középre igazítással (flex-box baseline javítás).
- **Belső azonosítók (ID-k):** A rendszer teljesen átállt a sztring-alapú nevek használatáról (pl. „corvus") a valós játékbeli numerikus azonosítók (pl. „50") használatára, lehetővé téve a kinyert adatok pontos összekötését.
- **Csillagok és lélekkövek szétválasztása:** A hősök csillagszintje (Stars) immár függetlenül állítható a következő szinthez szükséges lélekkövek (Soul Stones) számától a pontos játékélmény leképezése érdekében. A hőskártyákon a csillagok közvetlenül ezen beállítás szerint jelennek meg.
- **Adatbázis-struktúra:** A `heroesCatalog.json` és a `User_Export.json` fájlok teljesen át lettek alakítva az új, kibővített adatmodellnek megfelelően (8 fő kategória).

### Eltávolítva (Removed)
- **Hőskártya-sötétítő réteg és kasztikon:** A profilkép alján megjelenő gradient overlay és a rajta lévő szerepkör-ikon (pajzs, kereszt stb.) eltávolításra került, mivel feleslegesen zsúfolta a kártyákat.
- **Tailwind CSS-gyomlálás:** Az összes Tailwind-es maradványosztály (class) teljesen eltávolításra került a projektből, a formázás (styling) immár 100%-ban tiszta, saját CSS-változókkal működik.

## [0.1.0] - 2026-06-07

### Hozzáadva (Added)
- **Projekt inicializálása:** Alap React + Vite környezet létrehozása egyedi Hero Wars koncepció alapján.
- **Export/import funkció:** JSON-alapú adatbázis-kezelés.
- **Megtekintő mód (guest view):** Lehetőség külső adatbázisok (pl. egy barát .json fájlja) betöltésére, hogy megnézhessük a hősöket és a statisztikáikat anélkül, hogy a saját adatainkat felülírnánk.
- **Háttér (background):** A `public/ui/hatter.jpg` teljes képernyős beállítása rögzített (fixed) pozícióval.
- **Elmosódott réteg (blur overlay):** Egy sejtelmes réteg létrehozása a háttérkép és az alkalmazás között, amely 85%-os átlátszóságú #1a1009 színű, és 4px-es elmosást (blur) használ.
- **Színátmenetes szegély (gradient border):** A felső fejléc (Header) alja egy színátmenetes szegélyt kapott, ami a sárgás #fcef5f színben erősödik fel.

### Megváltoztatva (Changed)
- **Színkezelés:** Az oldalsó menü (Sidebar) és a fejléc (Header) háttérszíne az eredeti beállításokról a sötét #1a1009 színkódra lett módosítva.
- **Menü (Sidebar) interakciói:**
  - A kijelölt és a lebegtetett (hover) menüpontok egyszínű zöld háttere le lett cserélve egy elegáns színátmenetre (`#205e1b` -> `#50ba34`).
  - Az animáció hibái ki lettek javítva, így a színátmenet 0.4-es opacitással lágyan tűnik fel a lebegtetés során.
  - A kijelölt menüpont ferdén, 24 pixelnyit kinyúlik az oldalsó menüből, rálógva a tartalomra.
  - Eltávolításra került a felesleges jobb oldali szegély.
- **Tipográfia:** Az alap betűtípusok módosításra kerültek Roboto Condensed-re (címek és feliratok) és Noto Sans-ra. Ezen kívül az árnyékolások fixen (minden menüállapotban) alkalmazva lettek a `nav-text` osztályokon.
- **Szerkezeti tisztítás:** Az eredeti "User Profile" (Archmage / Level 130) doboz teljesen el lett távolítva a Sidebar-ból.

### Eltávolítva (Removed)
- **Tailwind CSS és utility-osztályok teljes eltávolítása:** A teljes React kód (beleértve a `Header.jsx`, `Dashboard.jsx`, `HeroCard.jsx`, `HeroModal.jsx` és `Sidebar.jsx` fájlokat) meg lett tisztítva a Tailwind jellegű utility osztályoktól (pl. `flex`, `items-center`, `gap-md`) és a tipográfiai/szín utility osztályoktól (pl. `text-headline-lg`, `text-primary-fixed`). Ezek helyett kizárólag szigorú, komponens-szintű szemantikus BEM-szerű osztályok (pl. `.dashboard-title`, `.hero-card-name`, `.stat-icon-health`) kerültek bevezetésre az `index.css`-ben.
- A CSS-ből kigyomláltuk a `!important` kulcsszót és tiszta CSS hierarchiát építettünk.

