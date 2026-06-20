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
  const { heroes, playerProfile, playerTeams, isViewMode } = useContext(HeroContext);

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

  if (!playerProfile) {
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
  const maxStamina = 60 + playerProfile.level;
  let frameUrl = './ui/base_frame.webp';
  if (playerProfile.league === 1 || playerProfile.league === '1') {
    frameUrl = './ui/guild_war_gold_league_frame.webp';
  } else if (playerProfile.league === 2 || playerProfile.league === '2') {
    frameUrl = './ui/guild_war_silver_league_frame.webp';
  } else if (playerProfile.league === 3 || playerProfile.league === '3') {
    frameUrl = './ui/guild_war_bronze_league_frame.webp';
  }

  // Dinamikus avatar kiválasztása (hős portré vagy ID)
  const avatarIdNum = playerProfile.avatarId ? parseInt(playerProfile.avatarId, 10) : 0;
  const isHeroAvatar = avatarIdNum > 0 && avatarIdNum <= 73;
  const avatarUrl = isHeroAvatar ? `./heroes/${playerProfile.avatarId}.png` : null;

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
                  <div className="player-avatar-id-text">{playerProfile.avatarId}</div>
                )}
                <img src={frameUrl} alt="Frame" className="player-avatar-frame" />
                <div className="player-level-badge">{playerProfile.level}</div>
              </div>
              <div className="player-name-banner">
                <span>{playerProfile.name}</span>
              </div>
              {playerProfile.vipLevel > 0 && (
                <div className="player-vip-banner">
                  <span>VIP {playerProfile.vipLevel}</span>
                </div>
              )}
            </div>

            {/* Az összes erőforrás egy közös oszlopban, a profilkép mellett */}
            <div className="all-resources-wrapper">
              {/* Elsődleges erőforrások */}
              <div className="player-resources-bar">
                {/* Smaragd */}
                <div className="game-resource-pill emerald-pill">
                  <img src="./ui/emerald.webp" alt="Emerald" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.emeralds)}</span>
                </div>

                {/* Arany */}
                <div className="game-resource-pill gold-pill">
                  <img src="./ui/gold.webp" alt="Gold" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.gold)}</span>
                </div>

                {/* Energia */}
                <div className="game-resource-pill energy-pill">
                  <img src="./ui/energy.webp" alt="Energy" className="pill-icon" />
                  <span className="pill-value">
                    {playerProfile.stamina}
                  </span>
                </div>
              </div>

              {/* Másodlagos erőforrások (Érmék és Bőrkövek) - Pill stílusban */}
              <div className="header-secondary-resources-group">
                <div className="game-resource-pill">
                  <img src="./ui/coin_4.webp" alt="Outland Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.outland)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/skin_stone_101.png" alt="Intelligence Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.skinStoneInt)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/skin_stone_102.png" alt="Strength Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.skinStoneStr)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/skin_stone_103.png" alt="Agility Skin Stone" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.skinStoneAgi)}</span>
                </div>

                {/* Alsó sor (Új sor kezdete a gridben) */}
                <div className="game-resource-pill new-row-start">
                  <img src="./ui/coin_1.webp" alt="Arena Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.arena)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/coin_2.webp" alt="Grand Arena Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.grandArena)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/coin_3.webp" alt="Tower Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.tower)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/coin_18.png" alt="Tournament Coin" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.tournament)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/coin_38.webp" alt="Soul Crystal" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.soulCrystal)}</span>
                </div>
                <div className="game-resource-pill">
                  <img src="./ui/skin_stone_104.webp" alt="Skin Stone Chest" className="pill-icon" />
                  <span className="pill-value">{formatNum(playerProfile.coins?.skinStoneChest)}</span>
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
