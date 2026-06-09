# Changelog

Minden említésre méltó változtatás a projektben ebben a fájlban lesz rögzítve.

## [0.3.4] - 2026-06-09

### Hozzáadva (Added)
- **Új hősök a katalógusban:** 10 új hős került felvételre az adatbázisba hivatalos ID alapján: Amira (56), Augustus (64), Chabba (11), Cleaver (24), Guus (68), Jet (31), Lara Croft (63), Ninja Turtles (65), Polaris (62) és Tristan (54).
- **Inaktív ("Meg nem idézett") hős állapot:** A program mostantól automatikusan megkülönbözteti a még nem birtokolt hősöket (0-s szintűek vagy nincsenek benne a saját importban). Ezek a kártyák a játékhoz hűen inaktív állapotba kerülnek: kattinthatatlanok, vizuálisan elsötétülnek (grayscale filter), eltűnik róluk a szint-jelvény és a csillagozás, a keretük pedig automatikusan a legelső "White" szintű alapkeretre vált.

## [0.3.3] - 2026-06-07

### Hozzáadva (Added)
- **Tiszta alapértelmezett állapot:** Generáltunk egy új, független adatbázist (`defaultHeroes.json`), amely az összes hőst 1-es szintre, 1 csillagra és alap (White) felszerelésre állítja vissza. A program indításkor mostantól automatikusan ezt tölti be az ideiglenes export fájl (`User_Export.json`) helyett, így a program tiszta lappal indul, de azonnal látszik benne az összes elérhető hős. A projekt gyökerében lévő `User_Export.json` most már biztonságosan törölhető.

## [0.3.2] - 2026-06-07

### Hozzáadva (Added)
- **Hiányzó hős (Elmir):** Elmir (ID: 38) felvéve a belső `heroesCatalog.json` adatbázisba, így most már a program automatikusan felismeri és betölti az importált fájlokból.

### Megváltoztatva (Changed)
- **Képalapú Gombok:** A CSS alapú gombok helyett az egyedi, játékstílusú `button.png` és `sort.png` grafikákat használja a program az Export/Import és a statisztikai panelek (`stat-chip`) háttereként.
- **Interaktív Hover effektek:** Az új grafikus gombok finom `:hover` és `:active` effekteket kaptak (nagyítás, fényerő változás és arany ragyogás) a reszponzív, tapintható élmény érdekében.
- **Szint Jelvény (Level Badge):** A hősök szintjét mutató számok doboza kapott egy minimum szélességet (`44px`), a szövegük pedig egy masszív, 3D-s fekete körvonalat (text-shadow) a jobb olvashatóságért.
- **Oldalsáv keret:** Az oldalsáv (Sidebar) kapott egy felülről lefelé futó, átlátszóból aranyba áttűnő függőleges elválasztó keretet, ami tökéletesen megegyezik a fejléc alatti csíkkal.

### Javítva (Fixed)
- **Hibás szöveges ID-k az adatbázisban:** Két hős (Electra von Grave és Qing Mao) azonosítója véletlenül szöveges formátumban (pl. "electra") szerepelt a katalógusban. Ezeket visszajavítottuk a hivatalos numerikus azonosítóikra (70, illetve 28).

## [0.3.1] - 2026-06-07

### Hozzáadva (Added)
- **Képalapú csillagok a hőskártyákon:** Az 1-5 csillagos hősök kártyáján lecseréltük a korábbi beépített font ikonokat tiszta, játékból származó `star.png` képekre, amik 24px-es méretben, tökéletes térhatású (drop-shadow) kitöltéssel jelennek meg a kártya alján.
- **Abszolút szint grafikája:** A maximum (6) csillagot elért hősök egy dedikált `6stars.png` ikonográfiát kapnak az egyes csillagok helyett, ami 28px-es méretben büszkén ül a keret alján.

### Megváltoztatva (Changed)
- **Relatív útvonalak és Build:** A projekt összes abszolút fájl- és képhivatkozása (pl. `/ui/...`) relatív útvonalra lett cserélve (`./ui/...`). Emellett a Vite konfigurációja is megkapta a `base: './'` paramétert, amivel az alkalmazás most már szabadon futtatható bármilyen almappából (pl. webtárhelyek, GitHub Pages).
- **Finomhangolt színek:** A hős rangok (szürke, zöld, kék, lila, narancs) HEX színkódjai finomítva lettek, hogy picit még jobban illeszkedjenek a hivatalos színvilághoz (pl. narancs: `#cfab59`, lila: `#c761df`).
- **Pontosított szövegezés:** A Dashboard fejlécének alcíme rövidebb, letisztultabb formát kapott ("A hősök tulajdonságai kattintással módosíthatók").

## [0.3.0] - 2026-06-07

### Hozzáadva (Added)
- **Képalapú hőskeretek:** A korábbi CSS-alapú eljárás helyett a hősök körüli keretek mostantól dedikált, a rangnak megfelelő PNG képeket töltenek be (pl. `orange+2.png`, `violet.png`) a `public/hero_borders/` mappából. Ezzel a hősök kártyái pontosan tükrözik a játék vizuális stílusát.

### Megváltoztatva (Changed)
- **Hőskártya méretezése és pozicionálása:** A hős profilképe fix 124x124 pixel méretűre lett csökkentve, míg az új ráillesztett keret-kép 132x132 pixelre lett felhúzva. A keret abszolút pozicionálással (`top: 50%`, `left: 50%`) tökéletesen középre lett igazítva, így pontosan ráfekszik a profilképre anélkül, hogy levágná azt.
- **Háttérszín átlátszóság javítása:** A hőskártya burkoló div-jeiről (`hero-card-image-wrapper`, `hero-card-image-inner`) teljesen eltávolításra került a rangszín-alapú háttér. Ezzel elkerültük, hogy a hősök profilképének átlátszó széleinél a szürke (vagy egyéb) háttérszín átüssön, fals keret illúzióját keltve.

### Eltávolítva (Removed)
- **Generált CSS szegélyek és promóciós szöveg:** Teljesen eltávolítottuk a korábbi vastag CSS kereteket, és kikerült a kódrendszerből a kis méretű "+1, +2" szöveg kiíratása is a kártya bal felső sarkából, mivel az új képkeretek eleve vizuálisan kifejezik a promóciós szintet.
- **Használaton kívüli (holt) CSS osztályok tisztítása:** Több mint 80 sornyi használaton kívüli CSS (régi statisztikai ikonok, Tailwind maradványok, felesleges effektek, progress bar sávok) lett véglegesen kigyomlálva az `index.css`-ből.

## [0.2.0] - 2026-06-07

### Hozzáadva (Added)
- **CSV-adatok importálása:** Új felugró ablak (ImportModal) és funkció, amellyel a játékból kinyert CSV-listát automatikusan be lehet olvasni. A rendszer egyből lefordítja a játék belső kódjait (színek -> Rank, skin azonosítók, rúna XP, Ascension Node ID-k).
- **Részletes hős-adatlap (HeroModal):** A modal ablak több fülre (Tabs) lett bontva: General & Stats, Skills & Skins, Artifacts & GoE, Glyphs & Ascension, hogy kényelmesen elférjen a megszámlálhatatlan mennyiségű adat.
- **Információs ablakok (InfoModal):** Kérdőjel ikonok kerültek a bonyolult matematikai számításokhoz (Rúna XP-pontszám, Ascension-becslés), amelyekre kattintva felugró ablak magyarázza el a pontos hátteret a felhasználónak.
- **Egyedi rúnakiosztás (Custom Glyphs):** A hősök adatlapján a rúnák (Glyphs) fülön immár nem csak fix szöveges elemek, hanem legördülő menük találhatók. Ezekből a felhasználó szabadon beállíthatja, hogy az adott hős melyik 5 statisztikát használja a 12 lehetséges rúnatípus közül, így megszüntetve a statikus helykitöltőket.
- **Hősök rendezése:** A főoldalon (Dashboard) megjelent egy új legördülő menü (a korábbi fix "MYTHIC" számláló helyett). A felhasználó valós időben rendezheti a hősöket név szerint (A-Z, Z-A) és erő, azaz Power alapján (növekvő vagy csökkenő sorrendben).

### Megváltoztatva (Changed)
- **Dinamikus hőskeret és kártyaméret:** A hőskártyákon a hős aktuális rangja (Rank) szerinti színes keret jelenik meg. A rendszer automatikusan kiolvassa az alapszínt és a promóciós szintet (+1, +2 stb.). A túldíszített CSS-effektek helyett a kártyák letisztult formát kaptak: egységes 4px-es színes keret, a kép széleinél sötétedő belső árnyékkal (térhatás), valamint a kártya háttere a png képek mögött felveszi az aktuális rang színét. A promóciós szint egy kis szöveges jelzésként jelenik meg a bal felső sarokban. A kártyák profilképe fix 126x126px méretre lett optimalizálva az új lokális képek fogadására.
- **Szintjelző jelvény (Level Badge):** A hős szintje (Level) a profilkép felső közepére került. A jelvény kerete megkapja az aktuális rang színét, míg a háttere `color-mix()` segítségével ugyanennek a színnek az 50%-kal sötétített, mélyebb árnyalata lesz. A lekerekítések precíz matematikai (külső mínusz belső sugár) igazítást kaptak, így nincsenek hegyes belső sarkok.
- **Reszponzív Grid elrendezés (Auto-fill):** A hősök listázása (Dashboard) kódja modernizálva lett. A korábbi, felbontáshoz kötött fix oszlopszámok helyett egy natív `auto-fill` alapú CSS Grid felel az elrendezésért. Ezzel megszűntek az indokolatlanul nagy távolságok (gap) a kártyák között a FullHD vagy nagyobb felbontású monitorokon, a rendszer tökéletesen kitölti a rendelkezésre álló helyet.
- **Főoldali statisztikák megjelenése:** A statisztikai sáv („Összesen") feliratai kisbetűs, Roboto Condensed betűtípusra lettek lecserélve a jobb olvashatóság érdekében. Az ikon szintén egyedire lett cserélve (`hero.png`), tökéletes, pixelpontos függőleges középre igazítással (flex-box baseline javítás).
- **Belső azonosítók (ID-k):** A rendszer teljesen átállt a sztring-alapú nevek használatáról (pl. „corvus") a valós játékbeli numerikus azonosítók (pl. „50") használatára, lehetővé téve a kinyert adatok pontos összekötését.
- **Csillagok és lélekkövek szétválasztása:** A hősök csillagszintje (Stars) immár függetlenül állítható a következő szinthez szükséges lélekkövek (Soul Stones) számától a pontos játékélmény leképezése érdekében. A hőskártyákon a csillagok közvetlenül ezen beállítás szerint jelennek meg.
- **Adatbázis-struktúra:** A `heroesCatalog.json` és a `User_Export.json` fájlok teljesen át lettek alakítva az új, kibővített adatmodellnek megfelelően (8 fő kategória).

### Eltávolítva (Removed)
- **Hőskártya sötétítő réteg és kaszt ikon:** A profilkép alján megjelenő gradient overlay és a rajta lévő szerepkör-ikon (pajzs, kereszt stb.) eltávolításra került, mivel feleslegesen zsúfolta a kártyákat.
- **Tailwind CSS-gyomlálás:** Az összes Tailwind-es maradványosztály (class) teljesen eltávolításra került a projektből, a formázás (styling) immár 100%-ban tiszta, saját CSS-változókkal működik.

## [0.1.0] - 2026-06-07

### Hozzáadva (Added)
- **Projekt inicializálása:** Alap React + Vite környezet létrehozása egyedi Hero Wars koncepció alapján.
- **Export/import funkció:** JSON-alapú adatbázis-kezelés.
- **Megtekintő mód (Guest View):** Lehetőség külső adatbázisok (pl. egy barát .json fájlja) betöltésére, hogy megnézhessük a hősöket és a statisztikáikat anélkül, hogy a saját adatainkat felülírnánk.
- **Háttér (Background):** A `public/ui/hatter.jpg` teljes képernyős beállítása rögzített (fixed) pozícióval.
- **Elmosódott réteg (Blur Overlay):** Egy sejtelmes réteg létrehozása a háttérkép és az alkalmazás között, amely 85%-os átlátszóságú #1a1009 színű, és 4px-es elmosást (blur) használ.
- **Színátmenetes szegély (Gradient Border):** A felső fejléc (Header) alja egy színátmenetes szegélyt kapott, ami a sárgás #fcef5f színben erősödik fel.

### Megváltoztatva (Changed)
- **Színkezelés:** Az oldalsó menü (Sidebar) és a fejléc (Header) háttérszíne az eredeti beállításokról a sötét #1a1009 színkódra lett módosítva.
- **Menü (Sidebar) interakciók:**
  - A kijelölt és a lebegtetett (hover) menüpontok egyszínű zöld háttere le lett cserélve egy elegáns színátmenetre (`#205e1b` -> `#50ba34`).
  - Az animáció hibái ki lettek javítva, így a színátmenet 0.4-es opacitással lágyan tűnik fel a lebegtetés során.
  - A kijelölt menüpont ferdén, 24 pixelnyit kinyúlik az oldalsó menüből, rálógva a tartalomra.
  - Eltávolításra került a felesleges jobb oldali szegély.
- **Tipográfia:** Az alap betűtípusok módosításra kerültek Roboto Condensed-re (címek és feliratok) és Noto Sans-ra. Ezen kívül az árnyékolások fixen (minden menüállapotban) alkalmazva lettek a `nav-text` osztályokon.
- **Szerkezeti tisztítás:** Az eredeti "User Profile" (Archmage / Level 130) doboz teljesen el lett távolítva a Sidebar-ból.

### Eltávolítva (Removed)
- **Tailwind CSS és Utility osztályok teljes eltávolítása:** A teljes React kód (beleértve a `Header.jsx`, `Dashboard.jsx`, `HeroCard.jsx`, `HeroModal.jsx` és `Sidebar.jsx` fájlokat) meg lett tisztítva a Tailwind jellegű utility osztályoktól (pl. `flex`, `items-center`, `gap-md`) és a tipográfiai/szín utility osztályoktól (pl. `text-headline-lg`, `text-primary-fixed`). Ezek helyett kizárólag szigorú, komponens-szintű szemantikus BEM-szerű osztályok (pl. `.dashboard-title`, `.hero-card-name`, `.stat-icon-health`) kerültek bevezetésre az `index.css`-ben.
- A CSS-ből kigyomláltuk a `!important` kulcsszót és tiszta CSS hierarchiát építettünk.

