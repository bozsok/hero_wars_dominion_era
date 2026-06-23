# Dominion Era (Browser) Tudástár – Játékmechanika és Képletek

Ez a dokumentum a *Hero Wars: Dominion Era* (böngészős verzió) visszafejtett matematikai modelljeit, képleteit, szintlépési költségeit és statisztikai szorzóit gyűjti össze egy egységes és strukturált formában.

---

## I. Ereklye (Artifact) Szintlépési Költségek
Az ereklyék fejlesztéséhez szükséges nyersanyagok pontos darabszámai a kezdetektől a maximumig (130-as szintig), minőségi kategóriák szerint lebontva.

### 1. Kategóriánkénti részletezés
*   **Fehér / Normal (1–25. szint):** Összesen **624 darab** szükséglet.
    *   *Szintek költsége:*
        *   1. szint: 0 | 2. szint: 3 | 3. szint: 5 | 4. szint: 7 | 5. szint: 9
        *   6. szint: 11 | 7. szint: 13 | 8. szint: 15 | 9. szint: 17 | 10. szint: 19
        *   11. szint: 21 | 12. szint: 23 | 13. szint: 25 | 14. szint: 27 | 15. szint: 29
        *   16. szint: 31 | 17. szint: 33 | 18. szint: 35 | 19. szint: 37 | 20. szint: 39
        *   21. szint: 41 | 22. szint: 43 | 23. szint: 45 | 24. szint: 47 | 25. szint: 49
*   **Zöld / Uncommon (26–50. szint):** Összesen **1 050 darab** szükséglet.
    *   *Szintek költsége:*
        *   26. szint: 30 | 27. szint: 31 | 28. szint: 32 | 29. szint: 33 | 30. szint: 34
        *   31. szint: 35 | 32. szint: 36 | 33. szint: 37 | 34. szint: 38 | 35. szint: 39
        *   36. szint: 40 | 37. szint: 41 | 38. szint: 42 | 39. szint: 43 | 40. szint: 44
        *   41. szint: 45 | 42. szint: 46 | 43. szint: 47 | 44. szint: 48 | 45. szint: 49
        *   46. szint: 50 | 47. szint: 51 | 48. szint: 52 | 49. szint: 53 | 50. szint: 54
*   **Kék / Rare (51–70. szint):** Összesen **790 darab** szükséglet.
    *   *Szintek költsége:*
        *   51. szint: 30 | 52. szint: 31 | 53. szint: 32 | 54. szint: 33 | 55. szint: 34
        *   56. szint: 35 | 57. szint: 36 | 58. szint: 37 | 59. szint: 38 | 60. szint: 39
        *   61. szint: 40 | 62. szint: 41 | 63. szint: 42 | 64. szint: 43 | 65. szint: 44
        *   66. szint: 45 | 67. szint: 46 | 68. szint: 47 | 69. szint: 48 | 70. szint: 49
*   **Lila / Superior (71–85. szint):** Összesen **555 darab** szükséglet.
    *   *Szintek költsége:*
        *   71. szint: 30 | 72. szint: 31 | 73. szint: 32 | 74. szint: 33 | 75. szint: 34
        *   76. szint: 35 | 77. szint: 36 | 78. szint: 37 | 79. szint: 38 | 80. szint: 39
        *   81. szint: 40 | 82. szint: 41 | 83. szint: 42 | 84. szint: 43 | 85. szint: 44
*   **Narancs / Flawless (86–100. szint):** Összesen **555 darab** szükséglet.
    *   *Szintek költsége:*
        *   86. szint: 30 | 87. szint: 31 | 88. szint: 32 | 89. szint: 33 | 90. szint: 34
        *   91. szint: 35 | 92. szint: 36 | 93. szint: 37 | 94. szint: 38 | 95. szint: 39
        *   96. szint: 40 | 97. szint: 41 | 98. szint: 42 | 99. szint: 43 | 100. szint: 44
*   **Piros / Absolute (101–130. szint):** Összesen **1 635 darab** szükséglet.
    *   *Szintek költsége:*
        *   101. szint: 40 | 102. szint: 41 | 103. szint: 42 | 104. szint: 43 | 105. szint: 44
        *   106. szint: 45 | 107. szint: 46 | 108. szint: 47 | 109. szint: 48 | 110. szint: 49
        *   111. szint: 50 | 112. szint: 51 | 113. szint: 52 | 114. szint: 53 | 115. szint: 54
        *   116. szint: 55 | 117. szint: 56 | 118. szint: 57 | 119. szint: 58 | 120. szint: 59
        *   121. szint: 60 | 122. szint: 61 | 123. szint: 62 | 124. szint: 63 | 125. szint: 64
        *   126. szint: 65 | 127. szint: 66 | 128. szint: 67 | 129. szint: 68 | 130. szint: 69

### 2. Összesített Ereklye Költség
Egy ereklye teljes kifejlesztése (1-ről 130. szintre) összesen **4 209 darab** nyersanyagot igényel.

---

## II. Rúna (Glyph) Fejlesztési Költségek (1–50. szint)
A rúnák fejlesztési pontjainak (Enchant points / XP) és aranyigényének táblázata a böngészős verzióban.

### 1. Szintenkénti bontás
*   **1–5. szint:** 50 XP / 1 500 Gold szintenként
*   **6–10. szint:** 80 XP / 3 200 Gold szintenként
*   **11–15. szint:** 190 XP / 13 300 Gold szintenként
*   **16–20. szint:** 220 XP / 17 600 Gold szintenként
*   **21–25. szint:** 520 XP / 46 800 Gold szintenként
*   **26–30. szint:** 590 XP / 56 050 Gold szintenként
*   **31–35. szint:** 790 XP / 75 050 Gold szintenként
*   **36–40. szint:** 870 XP / 82 650 Gold szintenként
*   **41. szint:** 1 970 XP / 187 150 Gold
*   **42–45. szint:** 1 970 XP / 197 000 Gold szintenként
*   **46–50. szint:** 3 470 XP / 347 000 Gold szintenként

### 2. Összesített Rúna Költség
Egy rúna teljes kifejlesztése (1-ről 50. szintre):
*   **Összesen szükséges XP:** 43 750 pont
*   **Összesen szükséges Arany:** 4 190 900 Gold

---

## III. Tulajdonságok (Stats) és Harci Erő (Power) Összefüggései

### 1. Statisztikai konverziók (Elsődleges → Másodlagos stat)
A primáris tulajdonságok közvetlenül növelik a másodlagos értékeket a játékmotor globális képletei alapján:
*   **1 Strength (Erő) = 40 Health (Életerő)**
*   **1 Agility (Ügyesség) = 2 Physical Attack (Fizikai Támadás) + 1 Armor (Páncél)**
*   **1 Intelligence (Intelligencia) = 3 Magic Attack (Mágikus Támadás) + 1 Magic Defense (Mágikus Védelem)**
*   **Fő tulajdonság (Main Stat) bónusz:** A hős elsődleges tulajdonsága plusz **1 Physical Attack** bónuszt ad.

### 2. Harci Erő (Power) szörzők
A hősök harci erejét a tulajdonságok alábbi szorzókkal történő súlyozása határozza meg:
*   **Strength / Agility / Intelligence:** 2.75
*   **Health:** 0.05
*   **Physical Attack:** 0.75
*   **Magic Attack:** 0.50
*   **Armor / Magic Defense:** 0.50
*   **Dodge (Kitérés) / Crit Hit Chance (Kritikus csapás):** 1.80
*   **Armor / Magic Penetration (Átütések):** 0.50
*   **Vampirism (Életszívás):** 14.50
*   **Skill szintek:** 4.00 (valamint egy fix 20.00-as eltolási szorzó)

---

## IV. Speciális Számítási Szabályok

### 1. Nyers Tulajdonság (Raw Stat) szabálya
A Harci Erő (Power) kiszámításakor a másodlagos statisztikákból le kell vonni az elsődleges statisztikák által biztosított bónuszokat (pl. az életerőből a Strength × 40-et), hogy elkerüljük a duplán számolást.

### 2. Első Ereklye (Artifact Weapon) szabálya
Az első ereklye (fegyver) által biztosított bónuszt a Power szimulációnál **0.5-ös szorzóval** kell figyelembe venni.

### 3. Képességek (Skills) szinteltolódása
A képességek belső szintje a hős rangjától (színétől) függően eltolódik (Vite API szinten):
*   Kék rangnál (Blue) a 3. képesség: **szint - 20**
*   Lila rangnál (Violet) a 4. képesség: **szint - 40**

### 4. Gift of the Elements (GoE) nem-lineáris eloszlása
A GoE bónusz hősönként a fő tulajdonságnak (Main Stat) megfelelően van súlyozva:
*   A fő tulajdonság **dupla bónuszt** kap (pl. 30. szinten a main stat +720, míg a szekunder statok +360 bónuszt kapnak).
*   A bónusz nem lineáris, 5 szintes blokkonként lépcsőzetesen növekszik.
