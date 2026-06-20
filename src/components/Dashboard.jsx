import React, { useContext } from 'react';
import { HeroContext } from '../context/HeroContext';
import './Dashboard.css';

const PET_NAMES = {
  '6001': 'Oliver',
  '6002': 'Albus',
  '6003': 'Mara',
  '6004': 'Patron',
  '6005': 'Biscuit',
  '6006': 'Merlin',
  '6007': 'Axel',
  '6008': 'Cain',
  '6009': 'Khorus',
  '6010': 'Fenris'
};

const Dashboard = () => {
  const { heroes, playerProfile, playerTeams, isViewMode, viewProfile } = useContext(HeroContext);
  const displayProfile = (isViewMode && viewProfile) ? viewProfile : playerProfile;

  // Segédfüggvény a hős részleteinek kiderítésére ID alapján
  const getHeroDetails = (heroId) => {
    const idStr = heroId.toString();
    const hero = heroes.find(h => h.id === idStr || h.id == heroId);
    if (!hero) return null;
    return hero;
  };

  // Segédfüggvény számok ezres csoportosítására
  const formatNum = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('hu-HU');
  };

  if (!displayProfile) {
    return (
      <main className="layout-main">
        <div className="container dashboard-empty-container">
          <div className="dashboard-welcome-card">
            <span className="material-symbols-outlined dashboard-welcome-icon">dashboard</span>
            <h1 className="dashboard-welcome-title">Üdvözöl a Dominion Tracker!</h1>
            <p className="dashboard-welcome-text">
              A Dashboard megtekintéséhez kérjük, szinkronizáld az adataidat a játékból kinyert HAR fájl segítségével.
            </p>
            <div className="dashboard-welcome-steps">
              <div className="welcome-step">
                <span className="step-num">1</span>
                <span>Kattints a jobb felső sarokban lévő <strong>Adatszinkronizáció</strong> gombra.</span>
              </div>
              <div className="welcome-step">
                <span className="step-num">2</span>
                <span>Kövesd az ott leírt lépéseket a hálózati HAR fájl mentéséhez.</span>
              </div>
              <div className="welcome-step">
                <span className="step-num">3</span>
                <span>Töltsd fel a fájlt, és a Dashboard azonnal életre kel a saját játékaid adataival!</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  const maxStamina = 60 + displayProfile.level;
  let frameUrl = './ui/base_frame.webp';
  if (displayProfile.league === 1 || displayProfile.league === '1') {
    frameUrl = './ui/guild_war_gold_league_frame.webp';
  } else if (displayProfile.league === 2 || displayProfile.league === '2') {
    frameUrl = './ui/guild_war_silver_league_frame.webp';
  } else if (displayProfile.league === 3 || displayProfile.league === '3') {
    frameUrl = './ui/guild_war_bronze_league_frame.webp';
  }

  // Dinamikus avatar kiválasztása (hős portré vagy ID)
  const avatarIdNum = displayProfile.avatarId ? parseInt(displayProfile.avatarId, 10) : 0;
  const isHeroAvatar = avatarIdNum > 0 && avatarIdNum <= 73;
  const avatarUrl = isHeroAvatar ? `./heroes/${displayProfile.avatarId}.png` : null;

  return (
    <main className="layout-main">
      <div className="container">

        {isViewMode && (
          <div className="view-mode-warning">
            <h2 className="view-mode-title">Megtekintés Mód Aktív</h2>
            <p>Jelenleg egy betöltött adatbázist látsz. A módosítások nem lesznek elmentve. Kattints a "VISSZA A SAJÁTHOZ" gombra a kilépéshez.</p>
          </div>
        )}

        {/* Új Játékbeli Fejléc Sáv, benne minden erőforrással */}
        <div className="dashboard-game-header">

          {/* Bal oldali blokk: Profil és Alap Erőforrások (Egymás mellett) */}
          <div className="header-profile-resources-group">
            {/* Avatár Widget */}
            <div className="player-profile-widget">
              <div className="avatar-circle-wrapper">
                {isHeroAvatar ? (
                  <img src={avatarUrl} alt="Avatar" className="player-avatar-img" />
                ) : (
                  <div className="player-avatar-id-text">{displayProfile.avatarId}</div>
                )}
                <img src={frameUrl} alt="Frame" className="player-avatar-frame" />
                <div className="player-level-badge">{displayProfile.level}</div>
              </div>
              <div className="player-name-banner">
                <span>{displayProfile.name}</span>
              </div>
              {displayProfile.vipLevel > 0 && (
                <div className="player-vip-banner">
                  <span>VIP {displayProfile.vipLevel}</span>
                </div>
              )}
            </div>

            {/* Az összes erőforrás egy közös oszlopban, a profilkép mellett */}
            <div className="all-resources-wrapper">
              {/* Elsődleges erőforrások */}
              <div className="player-resources-bar">
                {/* Smaragd */}
                <div className="game-resource-pill emerald-pill" title="Emerald">
                  <img src="./ui/emerald.webp" alt="Emerald" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.emeralds)}</span>
                </div>

                {/* Arany */}
                <div className="game-resource-pill gold-pill" title="Gold">
                  <img src="./ui/gold.webp" alt="Gold" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.gold)}</span>
                </div>

                {/* Energia */}
                <div className="game-resource-pill energy-pill" title="Energy">
                  <img src="./ui/energy.webp" alt="Energy" className="pill-icon" />
                  <span className="pill-value">
                    {displayProfile.stamina}
                  </span>
                </div>
              </div>

              {/* Másodlagos erőforrások (Érmék és Bőrkövek) - Pill stílusban */}
              <div className="header-secondary-resources-group">
                {/* Általános & Boltok (General & Shops) */}
                <div className="resource-group-label">Általános & Boltok</div>
                <div className="game-resource-pill" title="Arena Coin">
                  <img src="./ui/coin_1.png" alt="Arena Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.arena)}</span>
                </div>
                <div className="game-resource-pill" title="Grand Arena Coin">
                  <img src="./ui/coin_2.png" alt="Grand Arena Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.grandArena)}</span>
                </div>
                <div className="game-resource-pill" title="Tower Coin">
                  <img src="./ui/coin_3.png" alt="Tower Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.tower)}</span>
                </div>
                <div className="game-resource-pill" title="Outland Coin">
                  <img src="./ui/coin_4.png" alt="Outland Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.outland)}</span>
                </div>
                <div className="game-resource-pill" title="Soul Coin">
                  <img src="./ui/soulCoin.png" alt="Soul Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.soulCoin)}</span>
                </div>
                <div className="game-resource-pill" title="Friendship Chip">
                  <img src="./ui/friendshipChip.png" alt="Friendship Chip" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.friendshipChip)}</span>
                </div>
                <div className="game-resource-pill" title="Bottled Energy">
                  <img src="./ui/bottledEnergy.png" alt="Bottled Energy" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.bottledEnergy)}</span>
                </div>
                <div className="game-resource-pill" title="Spark of Power">
                  <img src="./ui/sparkOfPower.png" alt="Spark of Power" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.sparkOfPower)}</span>
                </div>

                {/* Hősök & Bőrkövek (Heroes & Skins) */}
                <div className="resource-group-label">Hősök & Bőrkövek</div>
                <div className="game-resource-pill" title="Intelligence Skin Stone">
                  <img src="./ui/skin_stone_101.png" alt="Intelligence Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.skinStoneInt)}</span>
                </div>
                <div className="game-resource-pill" title="Strength Skin Stone">
                  <img src="./ui/skin_stone_102.png" alt="Strength Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.skinStoneStr)}</span>
                </div>
                <div className="game-resource-pill" title="Agility Skin Stone">
                  <img src="./ui/skin_stone_103.png" alt="Agility Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.skinStoneAgi)}</span>
                </div>
                <div className="game-resource-pill" title="Soul Crystal">
                  <img src="./ui/coin_38.webp" alt="Soul Crystal" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.soulCrystal)}</span>
                </div>

                {/* Ereklyék (Artifacts) */}
                <div className="resource-group-label">Ereklyék (Artifacts)</div>
                <div className="game-resource-pill" title="Artifact Coin">
                  <img src="./ui/artifactCoin.png" alt="Artifact Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.artifactCoin)}</span>
                </div>
                <div className="game-resource-pill" title="Artifact Chest Key">
                  <img src="./ui/key.png" alt="Artifact Chest Key" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.artifactChestKey)}</span>
                </div>
                <div className="game-resource-pill" title="Chaos Core">
                  <img src="./ui/chaosCore.png" alt="Chaos Core" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.chaosCore)}</span>
                </div>

                {/* Háziállatok (Pets) */}
                <div className="resource-group-label">Háziállatok (Pets)</div>
                <div className="game-resource-pill" title="Summoning Egg">
                  <img src="./ui/egg.png" alt="Summoning Egg" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.petSummoningEgg)}</span>
                </div>
                <div className="game-resource-pill" title="Pet Potion">
                  <img src="./ui/petPotion.png" alt="Pet Potion" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.petPotion)}</span>
                </div>

                {/* Titánok (Titans) */}
                <div className="resource-group-label">Titánok (Titans)</div>
                <div className="game-resource-pill" title="Titan Potion">
                  <img src="./ui/titanPotion.png" alt="Titan Potion" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.titanPotion)}</span>
                </div>
                <div className="game-resource-pill" title="Titan Skin Stone">
                  <img src="./ui/titanSkinStone.png" alt="Titan Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.titanSkinStone)}</span>
                </div>
                <div className="game-resource-pill" title="Titan Soul Coin">
                  <img src="./ui/titanSoulCoin.png" alt="Titan Soul Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.titanSoulCoin)}</span>
                </div>
                <div className="game-resource-pill" title="Summoning Sphere">
                  <img src="./ui/summoningSphere.png" alt="Summoning Sphere" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.summoningSphere)}</span>
                </div>
                <div className="game-resource-pill" title="Titan Artifact Sphere">
                  <img src="./ui/titanArtifactSphere.png" alt="Titan Artifact Sphere" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.titanArtifactSphere)}</span>
                </div>
                <div className="game-resource-pill" title="Essence of the Elements">
                  <img src="./ui/essenceOfTheElements.png" alt="Essence of the Elements" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.essenceOfTheElements)}</span>
                </div>

                {/* Trófeák és Bajnokság (Trophies) */}
                <div className="resource-group-label">Trófeák & Bajnokság (Trophies)</div>
                <div className="game-resource-pill" title="Bronze Trophy">
                  <img src="./ui/bronzeTrophy.png" alt="Bronze Trophy" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.bronzeTrophy)}</span>
                </div>
                <div className="game-resource-pill" title="Silver Trophy">
                  <img src="./ui/silverTrophy.png" alt="Silver Trophy" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.silverTrophy)}</span>
                </div>
                <div className="game-resource-pill" title="Gold Trophy">
                  <img src="./ui/goldTrophy.png" alt="Gold Trophy" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.goldTrophy)}</span>
                </div>
                <div className="game-resource-pill" title="Clash of Worlds Trophy">
                  <img src="./ui/clashOfWorldsTrophy.png" alt="Clash of Worlds Trophy" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.clashOfWorldsTrophy)}</span>
                </div>
                <div className="game-resource-pill" title="Elemental Tournament Coin">
                  <img src="./ui/elementalTournamentCoin.png" alt="Elemental Tournament Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.elementalTournamentCoin)}</span>
                </div>
                <div className="game-resource-pill" title="Valor Emblem">
                  <img src="./ui/valorEmblem.png" alt="Valor Emblem" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.valorEmblem)}</span>
                </div>

                {/* Titán Völgy & Fa (Titan Valley & Tree) */}
                <div className="resource-group-label">Titán Völgy & Fa</div>
                <div className="game-resource-pill" title="Golden Thread">
                  <img src="./ui/goldenThread.png" alt="Golden Thread" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.goldenThread)}</span>
                </div>
                <div className="game-resource-pill" title="Eternal Seed">
                  <img src="./ui/eternalSeed.png" alt="Eternal Seed" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.eternalSeed)}</span>
                </div>
                <div className="game-resource-pill" title="Ancient Wisdom Crystal">
                  <img src="./ui/ancientWisdomCrystal.png" alt="Ancient Wisdom Crystal" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.consumables?.ancientWisdomCrystal)}</span>
                </div>
                <div className="game-resource-pill" title="Elemental Catalyst">
                  <img src="./ui/elemental.png" alt="Elemental Catalyst" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.elementalCatalyst)}</span>
                </div>
                <div className="game-resource-pill" title="Primal Catalyst">
                  <img src="./ui/primal.png" alt="Primal Catalyst" className="pill-icon" />
                  <span className="pill-value">{formatNum(displayProfile.coins?.primalCatalyst)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aktív csapatok bemutatása */}
        {playerTeams && (
          <div className="active-teams-section">
            <h2 className="active-teams-title">Aktív Csapatok Összeállítása</h2>

            <div className="teams-grid-container">
              {/* Aréna csapat */}
              {playerTeams.arena && playerTeams.arena.length > 0 && (
                <div className="team-row-showcase">
                  <div className="team-row-header">
                    <span className="material-symbols-outlined team-header-icon">swords</span>
                    <span className="team-header-title">Aréna Csapat</span>
                  </div>
                  <div className="team-members-list">
                    {playerTeams.arena.map((id, index) => {
                      if (id >= 6000) {
                        // Pet kártya renderelése
                        const petName = PET_NAMES[id] || `Pet #${id}`;
                        return (
                          <div key={`pet-${id}`} className="team-member-card pet-card">
                            <div className="team-member-portrait-wrapper border-pet">
                              <img src="./ui/pet.png" alt={petName} className="team-member-img" />
                            </div>
                            <span className="team-member-name">{petName}</span>
                            <span className="team-member-rank-label">Kísérő</span>
                          </div>
                        );
                      }

                      const hero = getHeroDetails(id);
                      if (!hero) return null;

                      const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                      return (
                        <div key={`hero-${id}`} className="team-member-card">
                          <div className="team-member-portrait-wrapper">
                            <div className="team-member-portrait-inner">
                              <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                            </div>
                            <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                            <span className="team-member-level-badge">{hero.general?.level || 0}</span>
                          </div>
                          <span className="team-member-name">{hero.name}</span>
                          <span className="team-member-power-label">{formatNum(hero.general?.power)} Erő</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hadjárat csapat */}
              {playerTeams.mission && playerTeams.mission.length > 0 && (
                <div className="team-row-showcase">
                  <div className="team-row-header">
                    <span className="material-symbols-outlined team-header-icon">map</span>
                    <span className="team-header-title">Hadjárat (Campaign) Csapat</span>
                  </div>
                  <div className="team-members-list">
                    {playerTeams.mission.map((id, index) => {
                      if (id >= 6000) {
                        const petName = PET_NAMES[id] || `Pet #${id}`;
                        return (
                          <div key={`pet-mission-${id}`} className="team-member-card pet-card">
                            <div className="team-member-portrait-wrapper border-pet">
                              <img src="./ui/pet.png" alt={petName} className="team-member-img" />
                            </div>
                            <span className="team-member-name">{petName}</span>
                            <span className="team-member-rank-label">Kísérő</span>
                          </div>
                        );
                      }

                      const hero = getHeroDetails(id);
                      if (!hero) return null;

                      const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                      return (
                        <div key={`hero-mission-${id}`} className="team-member-card">
                          <div className="team-member-portrait-wrapper">
                            <div className="team-member-portrait-inner">
                              <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                            </div>
                            <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                            <span className="team-member-level-badge">{hero.general?.level || 0}</span>
                          </div>
                          <span className="team-member-name">{hero.name}</span>
                          <span className="team-member-power-label">{formatNum(hero.general?.power)} Erő</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Grand Aréna 3 csapata */}
              {playerTeams.grand && playerTeams.grand.length > 0 && (
                <div className="team-row-showcase grand-arena-row">
                  <div className="team-row-header">
                    <span className="material-symbols-outlined team-header-icon">workspace_premium</span>
                    <span className="team-header-title">Grand Aréna Csapatok</span>
                  </div>
                  <div className="grand-teams-vertical-list">
                    {playerTeams.grand.map((gTeam, tIdx) => (
                      <div key={`grand-team-${tIdx}`} className="grand-team-subrow">
                        <div className="grand-team-label-number">#{tIdx + 1} csapat</div>
                        <div className="team-members-list small-portraits">
                          {gTeam.map((id, index) => {
                            if (id >= 6000) {
                              const petName = PET_NAMES[id] || `Pet #${id}`;
                              return (
                                <div key={`pet-grand-${tIdx}-${id}`} className="team-member-card pet-card">
                                  <div className="team-member-portrait-wrapper border-pet">
                                    <img src="./ui/pet.png" alt={petName} className="team-member-img" />
                                  </div>
                                  <span className="team-member-name">{petName}</span>
                                </div>
                              );
                            }

                            const hero = getHeroDetails(id);
                            if (!hero) return null;

                            const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                            return (
                              <div key={`hero-grand-${tIdx}-${id}`} className="team-member-card">
                                <div className="team-member-portrait-wrapper">
                                  <div className="team-member-portrait-inner">
                                    <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                                  </div>
                                  <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                                </div>
                                <span className="team-member-name">{hero.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default Dashboard;
