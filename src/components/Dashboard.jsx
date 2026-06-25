import React, { useState, useEffect, useContext } from 'react';
import md5 from 'md5';
import { HeroContext } from '../context/HeroContext';
import { generateNarrativeProfile } from '../utils/narrativeGenerator';
import consumablesDictionary from '../data/consumablesDictionary.json';
import coinsDictionary from '../data/coinsDictionary.json';
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

  const [activeTab, setActiveTab] = useState('overview');
  const [activeTeamCategory, setActiveTeamCategory] = useState('arena');
  const [identifyingItem, setIdentifyingItem] = useState(null);
  const [customConsumables, setCustomConsumables] = useState({});
  const [customCoins, setCustomCoins] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('customConsumablesMap');
    if (stored) {
      try {
        setCustomConsumables(JSON.parse(stored));
      } catch (e) {
        console.error('Hiba a localStorage parse közben:', e);
      }
    }
    const storedCoins = localStorage.getItem('customCoinsMap');
    if (storedCoins) {
      try {
        setCustomCoins(JSON.parse(storedCoins));
      } catch (e) {
        console.error('Hiba a localStorage parse közben (coins):', e);
      }
    }
  }, []);  const handleSaveIdentification = async (e) => {
    e.preventDefault();
    if (!identifyingItem) return;
    
    const rawName = identifyingItem.name ? identifyingItem.name.trim() : '';
    const isCoin = identifyingItem.type === 'coin';

    if (rawName === '') {
      if (isCoin) {
        const newMap = { ...customCoins };
        delete newMap[identifyingItem.id];
        setCustomCoins(newMap);
        localStorage.setItem('customCoinsMap', JSON.stringify(newMap));
      } else {
        const newMap = { ...customConsumables };
        delete newMap[identifyingItem.id];
        setCustomConsumables(newMap);
        localStorage.setItem('customConsumablesMap', JSON.stringify(newMap));
      }
      setIdentifyingItem(null);
      return;
    }
    
    if (isCoin) {
      const newMap = {
        ...customCoins,
        [identifyingItem.id]: {
          name: rawName
        }
      };
      setCustomCoins(newMap);
      localStorage.setItem('customCoinsMap', JSON.stringify(newMap));
    } else {
      const newMap = {
        ...customConsumables,
        [identifyingItem.id]: {
          name: rawName
        }
      };
      setCustomConsumables(newMap);
      localStorage.setItem('customConsumablesMap', JSON.stringify(newMap));
    }
    
    try {
      await fetch('/api/save-dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: identifyingItem.id, 
          name: rawName,
          type: identifyingItem.type 
        })
      });
      console.log(`Saved ${identifyingItem.id} to file via API.`);
    } catch (err) {
      console.error('Failed to save to backend API:', err);
    }
    
    setIdentifyingItem(null);
  };

  // Segédfüggvény a hős részleteinek kiderítésére ID alapján
  const getHeroDetails = (heroId) => {
    const idStr = heroId.toString();
    const hero = heroes.find(h => h.id === idStr || h.id == heroId);
    if (!hero) return null;
    return hero;
  };

  const getRankColorClass = (hero) => {
    const rankStr = hero?.items?.rank || 'White';
    if (rankStr.includes('Green')) return 'hero-rank-green';
    if (rankStr.includes('Blue')) return 'hero-rank-blue';
    if (rankStr.includes('Violet')) return 'hero-rank-violet';
    if (rankStr.includes('Orange')) return 'hero-rank-orange';
    if (rankStr.includes('Red')) return 'hero-rank-red';
    return 'hero-rank-gray';
  };

  // Segédfüggvény számok ezres csoportosítására
  const formatNum = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('hu-HU');
  };

  const renderResourceCard = (id, name, amount) => {
    const key = `coin_${id}`;
    let imgSrc = `./coins/${id}.png`;
    const customName = customCoins[id]?.name || coinsDictionary[id]?.name || name;

    return (
      <div 
        key={key} 
        className="consumable-item-card" 
        onClick={() => setIdentifyingItem({ id, name: customName, type: 'coin' })}
        style={{ cursor: 'pointer' }}
        title={`${customName} (#${id})`}
      >
        <div className="consumable-item-placeholder">
          <img 
            src={imgSrc} 
            alt={customName} 
            className="consumable-item-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
            onLoad={(e) => {
              e.target.style.display = 'block';
              e.target.nextElementSibling.style.display = 'none';
            }}
          />
          <span className="consumable-item-id" style={{ display: 'block' }}>#{id}</span>
        </div>
        <div className="consumable-item-amount-wrapper">
          <span className="consumable-item-amount">{formatNum(amount)}</span>
        </div>
      </div>
    );
  };

  const getActiveTeamForNarrative = () => {
    if (playerTeams?.arena && playerTeams.arena.length > 0) {
      return playerTeams.arena;
    }
    if (playerTeams?.mission && playerTeams.mission.length > 0) {
      return playerTeams.mission;
    }
    return [];
  };

  const renderNarrativeHTML = () => {
    const activeTeamForNarrative = getActiveTeamForNarrative();
    const narrativeText = generateNarrativeProfile(heroes, activeTeamForNarrative, displayProfile);
    
    return narrativeText.split('\n\n').map((paragraph, index) => {
      const parts = paragraph.split('**');
      return (
        <p key={`para-${index}`} className="narrative-paragraph">
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="narrative-highlight">{part}</strong> : part)}
        </p>
      );
    });
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
      <div className="container dashboard-page-wrapper" style={{ width: '100%', maxWidth: '1400px', display: 'flex', flexDirection: 'column' }}>

        {isViewMode && (
          <div className="view-mode-warning">
            <h2 className="view-mode-title">View Mode Active</h2>
            <p>You are currently viewing a loaded database. Changes will not be saved. Click the "BACK TO MINE" button to exit.</p>
          </div>
        )}

        <div className="dashboard-hero-modal-style-wrapper">
          <div className="modal-outside-tabs">
            <div className={`modal-flag ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</div>
            <div className={`modal-flag ${activeTab === 'consumables' ? 'active' : ''}`} onClick={() => setActiveTab('consumables')}>Consumables</div>
            <div className={`modal-flag ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Coins</div>
            <div className={`modal-flag ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>Teams</div>
          </div>

          <div className="modal-content gold-frame dashboard-content-frame">
            <div className="modal-title-banner">Dashboard</div>
            <div className="modal-body-landscape">
              <div className="modal-panel">
                <div className={`modal-scroll-container ${activeTab === 'resources' || activeTab === 'consumables' ? 'resources-scroll-active' : ''}`}>

                  {activeTab === 'overview' && (
                    <>
                      {/* Új Játékbeli Fejléc Sáv, benne minden erőforrással */}
                      <div className="dashboard-game-header">

                        {/* Bal oldali blokk: Profil és Alap Erőforrások (Egymás mellett) */}
                        <div className="header-profile-resources-group">
                          
                          {/* Bal oldali oszlop: Csak a profil widget */}
                          <div className="profile-left-column">
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
                          </div>

                          {/* Az összes erőforrás egy közös oszlopban, a profilkép mellett */}
                          <div className="all-resources-wrapper">
                            {/* Elsődleges erőforrások - Vízszintesen elrendezve */}
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

                            {/* Játékosi profil narratív jellemzése */}
                            <div className="dashboard-narrative-section" style={{ height: '100%', margin: 0, boxSizing: 'border-box' }}>
                              <div className="narrative-title-banner">DOMINION ELEMZÉS & SZINERGIA JELENTÉS</div>
                              <div className="narrative-body-text">
                                {renderNarrativeHTML()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Másodlagos erőforrások (Érmék és Bőrkövek) - Pill stílusban */}
                      <div className="header-secondary-resources-group">
                        {/* Hősök & Bőrkövek (Heroes & Skins) */}
                        <div className="resource-group-label heroes_skins">HEROES & SKINS</div>
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
                      </div>
                    </>
                  )}

                  {activeTab === 'resources' && (
                    <div className="dashboard-resources-tab">
                      <div className="coins-resources-grid">
                        {(() => {
                          const coinsList = [
                            { id: '1', name: 'Arena Coin', amount: displayProfile.coins?.arena || 0 },
                            { id: '2', name: 'Grand Arena Coin', amount: displayProfile.coins?.grandArena || 0 },
                            { id: '3', name: 'Tower Coin', amount: displayProfile.coins?.tower || 0 },
                            { id: '4', name: 'Outland Coin', amount: displayProfile.coins?.outland || 0 },
                            { id: '5', name: 'Soul Coin', amount: displayProfile.coins?.soulCoin || 0 },
                            { id: '6', name: 'Friendship Chip', amount: displayProfile.coins?.friendshipChip || 0 },
                            { id: '8', name: 'Intelligence Skin Stone', amount: displayProfile.coins?.skinStoneInt || 0 },
                            { id: '9', name: 'Strength Skin Stone', amount: displayProfile.coins?.skinStoneStr || 0 },
                            { id: '10', name: 'Agility Skin Stone', amount: displayProfile.coins?.skinStoneAgi || 0 },
                            { id: '13', name: 'Summoning Sphere', amount: displayProfile.coins?.summoningSphere || 0 },
                            { id: '14', name: 'Artifact Coin', amount: displayProfile.coins?.artifactCoin || 0 },
                            { id: '15', name: 'Titan Soul Coin', amount: displayProfile.coins?.titanSoulCoin || 0 },
                            { id: '18', name: 'Elemental Tournament Coin', amount: displayProfile.coins?.elementalTournamentCoin || 0 },
                            { id: '24', name: 'Titan Skin Stone', amount: displayProfile.coins?.titanSkinStone || 0 },
                            { id: '30', name: 'Valor Emblem', amount: displayProfile.coins?.valorEmblem || 0 },
                            { id: '38', name: 'Soul Crystal', amount: displayProfile.coins?.soulCrystal || 0 },
                            { id: '45', name: 'Golden Thread', amount: displayProfile.coins?.goldenThread || 0 },
                            { id: '101', name: 'Bronze Trophy', amount: displayProfile.coins?.bronzeTrophy || 0 },
                            { id: '102', name: 'Silver Trophy', amount: displayProfile.coins?.silverTrophy || 0 },
                            { id: '103', name: 'Gold Trophy', amount: displayProfile.coins?.goldTrophy || 0 },
                            { id: '104', name: 'Clash of Worlds Trophy', amount: displayProfile.coins?.clashOfWorldsTrophy || 0 },
                            { id: '1084', name: 'Elemental Catalyst', amount: displayProfile.coins?.elementalCatalyst || 0 },
                            { id: '1085', name: 'Primal Catalyst', amount: displayProfile.coins?.primalCatalyst || 0 },
                            { id: '2192001095', name: 'Exclusive Skin Coin', amount: displayProfile.coins?.exclusiveSkinCoin || 0 },
                            { id: '2266001091', name: 'Energy Crystal', amount: displayProfile.coins?.energyCrystal || 0 },
                            { id: '2266001092', name: 'Valor Coin', amount: displayProfile.coins?.valorCoin || 0 },
                            { id: '2266001093', name: 'Sapphire Medallion', amount: displayProfile.coins?.sapphireMedallion || 0 }
                          ];
                          coinsList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
                          return coinsList.map(coin => renderResourceCard(coin.id, coin.name, coin.amount));
                        })()}
                      </div>
                    </div>
                  )}

                  {activeTab === 'teams' && (
                    <div className="dashboard-teams-tab">

                      {/* Aktív csapatok bemutatása */}
                      {playerTeams && (
                        <div className="active-teams-section">
                          <div className="teams-top-bar">
                            <div className="teams-ranking-wrapper">
                              <span className="teams-ranking-label">
                                {activeTeamCategory === 'campaign' ? 'Campaign Stage:' : 'My ranking:'}
                              </span>
                              <div className="teams-ranking-info">
                                {activeTeamCategory === 'arena' && (displayProfile.arenaPlace || '-')}
                                {activeTeamCategory === 'grand_arena' && (displayProfile.grandPlace || '-')}
                                {activeTeamCategory === 'campaign' && (displayProfile.campaignLevel || '-')}
                              </div>
                            </div>
                            <div className="teams-category-buttons">
                              <button className={`team-cat-btn ${activeTeamCategory === 'arena' ? 'active' : ''}`} onClick={() => setActiveTeamCategory('arena')}>Arena</button>
                              <button className={`team-cat-btn ${activeTeamCategory === 'grand_arena' ? 'active' : ''}`} onClick={() => setActiveTeamCategory('grand_arena')}>Grand Arena</button>
                              <button className={`team-cat-btn ${activeTeamCategory === 'campaign' ? 'active' : ''}`} onClick={() => setActiveTeamCategory('campaign')}>Campaign</button>
                            </div>
                          </div>

                          <div className="teams-grid-container">
                            {/* Aréna csapat */}
                            {activeTeamCategory === 'arena' && playerTeams.arena && playerTeams.arena.length > 0 && (
                              <div className="team-row-showcase">
                                <div className="team-row-header">
                                  <span className="material-symbols-outlined team-header-icon">swords</span>
                                  <span className="team-header-title">Arena Team</span>
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
                                          <span className="team-member-rank-label">Pet</span>
                                        </div>
                                      );
                                    }

                                    const hero = getHeroDetails(id);
                                    if (!hero) return null;

                                    const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                                    const rankClass = getRankColorClass(hero);
                                    return (
                                      <div key={`hero-${id}`} className="team-member-card">
                                        <div className={`team-member-portrait-wrapper ${rankClass}`}>
                                          <div className="team-member-portrait-inner">
                                            <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                                          </div>
                                          <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                                          <span className="team-member-level-badge">{hero.general?.level || 0}</span>
                                        </div>
                                        <span className="team-member-name">{hero.name}</span>
                                        <span className="team-member-power-label">{formatNum(hero.general?.power)} Power</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Hadjárat csapat */}
                            {activeTeamCategory === 'campaign' && playerTeams.mission && playerTeams.mission.length > 0 && (
                              <div className="team-row-showcase">
                                <div className="team-row-header">
                                  <span className="material-symbols-outlined team-header-icon">map</span>
                                  <span className="team-header-title">Campaign Team</span>
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
                                          <span className="team-member-rank-label">Pet</span>
                                        </div>
                                      );
                                    }

                                    const hero = getHeroDetails(id);
                                    if (!hero) return null;

                                    const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                                    const rankClass = getRankColorClass(hero);
                                    return (
                                      <div key={`hero-mission-${id}`} className="team-member-card">
                                        <div className={`team-member-portrait-wrapper ${rankClass}`}>
                                          <div className="team-member-portrait-inner">
                                            <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                                          </div>
                                          <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                                          <span className="team-member-level-badge">{hero.general?.level || 0}</span>
                                        </div>
                                        <span className="team-member-name">{hero.name}</span>
                                        <span className="team-member-power-label">{formatNum(hero.general?.power)} Power</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Grand Aréna 3 csapata */}
                            {activeTeamCategory === 'grand_arena' && playerTeams.grand && playerTeams.grand.length > 0 && (
                              <div className="team-row-showcase">
                                <div className="team-row-header">
                                  <span className="material-symbols-outlined team-header-icon">workspace_premium</span>
                                  <span className="team-header-title">Grand Arena Teams</span>
                                </div>
                                <div className="grand-teams-vertical-list">
                                  {playerTeams.grand.map((gTeam, tIdx) => (
                                    <div key={`grand-team-${tIdx}`} className="grand-team-subrow">
                                      <div className="team-members-list">
                                        {gTeam.map((id, index) => {
                                          if (id >= 6000) {
                                            const petName = PET_NAMES[id] || `Pet #${id}`;
                                            return (
                                              <div key={`pet-grand-${tIdx}-${id}`} className="team-member-card pet-card">
                                                <div className="team-member-portrait-wrapper border-pet">
                                                  <img src="./ui/pet.png" alt={petName} className="team-member-img" />
                                                  <div className="grand-member-hover-overlay">
                                                    <span className="team-member-name">{petName}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }

                                          const hero = getHeroDetails(id);
                                          if (!hero) return null;

                                          const borderUrl = `./hero_borders/${(hero.items?.rank || 'White').toLowerCase()}.png`;
                                          const rankClass = getRankColorClass(hero);
                                          return (
                                            <div key={`hero-grand-${tIdx}-${id}`} className="team-member-card">
                                              <div className={`team-member-portrait-wrapper ${rankClass}`}>
                                                <div className="team-member-portrait-inner">
                                                  <img src={`./heroes/${id}.png`} alt={hero.name} className="team-member-img" />
                                                </div>
                                                <img src={borderUrl} alt="Rank Border" className="team-member-border" />
                                                <span className="team-member-level-badge">{hero.general?.level || 0}</span>
                                                <div className="grand-member-hover-overlay">
                                                  <span className="team-member-name">{hero.name}</span>
                                                </div>
                                              </div>
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
                  )}

                  {activeTab === 'consumables' && (
                    <div className="dashboard-consumables-tab">
                      <div className="consumables-grid">
                        {displayProfile.inventory && Object.entries(displayProfile.inventory).map(([id, amount]) => {
                          const customName = customConsumables[id]?.name || consumablesDictionary[id]?.name || '';
                          const imgSrc = `./consumables/${id}.png`;
                          
                          return (
                          <div key={id} className="consumable-item-card" onClick={() => setIdentifyingItem({ id, name: customName })} style={{ cursor: 'pointer' }} title={customName ? `${customName} (#${id})` : `Ismeretlen tárgy (#${id})`}>
                            <div className="consumable-item-placeholder">
                              <img 
                                src={imgSrc} 
                                alt={`Item ${id}`} 
                                className="consumable-item-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'block';
                                }}
                                onLoad={(e) => {
                                  e.target.style.display = 'block';
                                  e.target.nextElementSibling.style.display = 'none';
                                }}
                              />
                              <span className="consumable-item-id" style={{ display: 'block' }}>#{id}</span>
                            </div>
                            <div className="consumable-item-amount-wrapper">
                              <span className="consumable-item-amount">{formatNum(amount)}</span>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {identifyingItem && (
        <div className="hero-modal-overlay">
          <div className="hero-modal-content" style={{ maxWidth: '500px', height: 'auto', minHeight: 'auto' }}>
            <button className="hero-modal-close" onClick={() => setIdentifyingItem(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="hero-modal-header" style={{ padding: '20px 20px 0 20px', borderBottom: 'none' }}>
              <h2 className="hero-modal-name">Tárgy elnevezése (#{identifyingItem.id})</h2>
            </div>
            <form onSubmit={handleSaveIdentification} style={{ padding: '20px' }}>
              <p style={{ color: '#eaddc5', marginBottom: '15px', fontFamily: '"Roboto Condensed", sans-serif' }}>
                Add meg a tárgy pontos nevét (pl. "Small enchantment rune"). Ez a név el lesz mentve az ID mellé a memóriába.
              </p>
              <input 
                type="text" 
                value={identifyingItem.name || ''} 
                onChange={(e) => setIdentifyingItem({ ...identifyingItem, name: e.target.value })}
                placeholder="Pl: Small enchantment rune"
                style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#0a0a0a', border: '1px solid #d4af37', color: '#fff', fontSize: '16px', borderRadius: '4px' }}
                autoFocus
              />
              <button type="submit" className="hero-modal-tab active" style={{ width: '100%', textAlign: 'center', display: 'block', padding: '10px' }}>Név Mentése</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
