# Dominion Tracker - Hero Wars Data Manager

Ez egy webalkalmazás, amelynek célja, hogy nyomon követhesd a "Hero Wars: Dominion Era" játékban a hősök fejlődését, és manuálisan rögzíthesd az adatokat egy saját adatbázisba.

## Funkciók
- **Saját csapat kezelése:** Válaszd ki a hőseidet, és adj meg róluk minden releváns információt és statisztikát a több fülre bontott, részletes hős-adatlapon.
- **CSV-adatok importálása:** A játékból kinyert CSV-listát automatikusan feldolgozza az alkalmazás, lefordítva a belső numerikus azonosítókat (színek, ereklyék, rúnák, ascension csomópontok) emberi formátumra.
- **Export/import:** A rögzített adatokat egy `.json` fájlba tudod exportálni. A barátaid fájljait pedig be tudod importálni (Guest View módban), így anélkül láthatod a csapataikat, hogy a saját adataid felülíródnának.
- **AI-támogatás:** Az exportált `.json` fájlt megoszthatod mesterséges intelligenciákkal, hogy tanácsokat kapj a csapatod jövőbeli fejlesztésével kapcsolatban.
- **Modern, játékhoz illő felület:** Egyedi, stílusos (Vanilla CSS-alapú) dizájn, amely sötét tónusú hátteret, finom elmosódásokat (blur), egyedi gombokat, hover effekteket és színátmenetes díszítéseket használ, Tailwind CSS nélkül.

## Használt technológiák
- **Frontend:** React + Vite
- **Stílusozás:** Tiszta, testreszabott Vanilla CSS (a Tailwind teljesen eltávolítva)
- **Betűtípusok:** Roboto Condensed (Címsorok, navigáció) és Noto Sans (Szöveges elemek)

## Lokális futtatás
1. A projekt mappájában futtasd le a `npm install` parancsot a függőségek telepítéséhez.
2. Indítsd el a fejlesztői szervert: `npm run dev`
3. Nyisd meg a böngészőben a kiírt (alapértelmezett: `http://localhost:3000`) címet.

---
*Készítette az Antigravity AI.*
