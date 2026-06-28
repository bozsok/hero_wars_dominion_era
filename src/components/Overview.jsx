import React, { useContext, useState } from 'react';
import { HeroContext } from '../context/HeroContext';
import { generateNarrativeProfile } from '../utils/narrativeGenerator';
import consumablesDictionary from '../data/consumablesDictionary.json';
import coinsDictionary from '../data/coinsDictionary.json';
import './Overview.css';

const Overview = () => {
  const {
    heroes,
    playerProfile,
    playerTeams,
    isViewMode,
    viewProfile,
    customConsumables,
    customCoins,
    saveCustomItem
  } = useContext(HeroContext);

  const displayProfile = (isViewMode && viewProfile) ? viewProfile : playerProfile;
  const [activeCategory, setActiveCategory] = useState('All');
  const [identifyingItem, setIdentifyingItem] = useState(null);

  const handleSaveIdentification = async (e) => {
    e.preventDefault();
    if (!identifyingItem) return;

    const rawName = identifyingItem.name ? identifyingItem.name.trim() : '';
    const selectedColor = identifyingItem.color || '';

    // Mentés a Contexten keresztül (state + localStorage)
    saveCustomItem(identifyingItem.id, rawName, identifyingItem.type, selectedColor);

    if (isViewMode) {
      setIdentifyingItem(null);
      return;
    }

    try {
      const payload = {
        id: identifyingItem.id,
        name: rawName,
        type: identifyingItem.type
      };
      if (identifyingItem.type !== 'coin' && selectedColor) {
        payload.color = selectedColor;
      }
      await fetch('/api/save-dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`Saved ${identifyingItem.id} to file via API.`);
    } catch (err) {
      console.error('Failed to save to backend API:', err);
    }

    setIdentifyingItem(null);
  };

  // Categories based on user request
  const categories = [
    'All', 'Equipment', 'Recipes', 'Consumables', 'Coins', 'Patterns', 'Fragments', 'Soul Stones'
  ];

  const formatNum = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('hu-HU');
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
              Kérjük, szinkronizáld az adataidat a játékból kinyert HAR fájl segítségével.
            </p>
          </div>
        </div>
      </main>
    );
  }

  let frameUrl = './ui/base_frame.webp';
  if (displayProfile.league === 1 || displayProfile.league === '1') {
    frameUrl = './ui/guild_war_gold_league_frame.webp';
  } else if (displayProfile.league === 2 || displayProfile.league === '2') {
    frameUrl = './ui/guild_war_silver_league_frame.webp';
  } else if (displayProfile.league === 3 || displayProfile.league === '3') {
    frameUrl = './ui/guild_war_bronze_league_frame.webp';
  }

  const avatarIdNum = displayProfile.avatarId ? parseInt(displayProfile.avatarId, 10) : 0;
  const isHeroAvatar = avatarIdNum > 0 && avatarIdNum <= 73;
  const avatarUrl = isHeroAvatar ? `./heroes/${displayProfile.avatarId}.png` : null;

  return (
    <main className="layout-main">
      {/* Header section with double background images */}
      <div className="overview-header-wrapper">
        <img src="./ui/fuggony.jpg" alt="Curtain Background" className="overview-bg-layer" />
        <div className="overview-yellow-line"></div>
        <img src="./ui/overview_title.png" alt="Title Background" className="overview-title-bg" />
        <div className="overview-title-banner">
          Overview
        </div>
      </div>

      <div className="container">

        {/* Content grid */}
        <div className="overview-content-grid">

          {/* Top Left: Profile */}
          <div className="overview-profile-cell">
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

          {/* Top Right: Narrative */}
          <div className="overview-narrative-cell dashboard-narrative-section">
            <div className="narrative-title-banner">DOMINION ELEMZÉS & SZINERGIA JELENTÉS</div>
            <div className="narrative-body-text">
              {renderNarrativeHTML()}
            </div>
          </div>

          {/* Middle Row: Resources */}
          <div className="overview-resources-cell">
            <div className="player-resources-bar">
              <div className="resource-group-label heroes_skins">GENERAL RESOURCES</div>
              <div className="game-resource-pill emerald-pill" title="Emerald">
                <img src="./ui/emerald.webp" alt="Emerald" className="pill-icon" />
                <span className="pill-value">{formatNum(displayProfile.emeralds)}</span>
              </div>
              <div className="game-resource-pill gold-pill" title="Gold">
                <img src="./ui/gold.webp" alt="Gold" className="pill-icon" />
                <span className="pill-value">{formatNum(displayProfile.gold)}</span>
              </div>
              <div className="game-resource-pill energy-pill" title="Energy">
                <img src="./ui/energy.webp" alt="Energy" className="pill-icon" />
                <span className="pill-value">{displayProfile.stamina}</span>
              </div>
            </div>

            <div className="player-resources-bar">
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
          </div>

          {/* Bottom Left: Navigation Buttons */}
          <div className="overview-nav-cell">
            <div className="overview-nav-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`team-cat-btn ${activeCategory === category ? 'active' : ''} overview-nav-btn`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Right: Resources Grid */}
          <div className="overview-grid-cell">
            <div className="modal-scroll-container resources-scroll-active overview-scroll-container">

              <div className="consumables-grid" key="all-resources">
                {(activeCategory === 'All' || activeCategory === 'Consumables') && displayProfile.inventory && Object.entries(displayProfile.inventory).map(([id, amount]) => {
                    const customName = customConsumables[id]?.name || consumablesDictionary[id]?.name || '';
                    const imgSrc = `./consumables/${id}.png`;
                    const borderColor = customConsumables[id]?.color || consumablesDictionary[id]?.color || 'white';
                    const borderSrc = `./hero_borders/${borderColor}.png`;

                    return (
                      <div key={id} className="consumable-item-card" onClick={(e) => {
                        if (e.detail === 3) {
                          setIdentifyingItem({ id, name: customName, color: borderColor, type: 'consumable' });
                        }
                      }} title={customName ? `${customName} (#${id})` : `Ismeretlen tárgy (#${id})`}>
                        <div className="consumable-item-placeholder">
                          <img
                            src={imgSrc}
                            alt={`Item ${id}`}
                            className="consumable-item-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'block';
                            }}
                          />
                          <span className="consumable-item-id overview-item-id" style={{ display: 'none' }}>#{id}</span>
                        </div>
                        <img src={borderSrc} alt="" className="consumable-item-border" />
                        <div className="consumable-item-amount-wrapper">
                          <span className="consumable-item-amount">{formatNum(amount)}</span>
                        </div>
                      </div>
                    );
                  })}
                {(activeCategory === 'All' || activeCategory === 'Coins') && (() => {
                    const mappedCoinKeys = [
                      'arena', 'grandArena', 'tower', 'outland', 'soulCoin', 'friendshipChip',
                      'skinStoneInt', 'skinStoneStr', 'skinStoneAgi', 'summoningSphere', 'artifactCoin',
                      'titanSoulCoin', 'elementalTournamentCoin', 'titanSkinStone', 'valorEmblem',
                      'soulCrystal', 'goldenThread', 'bronzeTrophy', 'silverTrophy', 'goldTrophy',
                      'clashOfWorldsTrophy', 'elementalCatalyst', 'primalCatalyst', 'exclusiveSkinCoin',
                      'energyCrystal', 'valorCoin', 'sapphireMedallion'
                    ];

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

                    if (displayProfile.coins) {
                      for (const [key, amount] of Object.entries(displayProfile.coins)) {
                        if (!mappedCoinKeys.includes(key) && amount > 0) {
                          const customName = customCoins[key]?.name || coinsDictionary[key]?.name || `Ismeretlen érme (#${key})`;
                          coinsList.push({
                            id: key,
                            name: customName,
                            amount: amount
                          });
                        }
                      }
                    }

                    coinsList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

                    return coinsList.map(coin => {
                      const key = `coin_${coin.id}`;
                      let imgSrc = `./coins/${coin.id}.png`;
                      const customName = customCoins[coin.id]?.name || coinsDictionary[coin.id]?.name || coin.name;

                      return (
                        <div key={coin.id} className="consumable-item-card" onClick={(e) => {
                          if (e.detail === 3) {
                            setIdentifyingItem({ id: coin.id, name: customName, color: 'orange', type: 'coin' });
                          }
                        }} title={customName ? `${customName} (#${coin.id})` : `Ismeretlen érme (#${coin.id})`}>
                          <div className="consumable-item-placeholder">
                            <img
                              src={imgSrc}
                              alt={customName}
                              className="consumable-item-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'block';
                              }}
                            />
                            <span className="consumable-item-id overview-item-id" style={{ display: 'none' }}>#{coin.id}</span>
                          </div>
                          <img src="./hero_borders/orange.png" alt="" className="consumable-item-border" />
                          <div className="consumable-item-amount-wrapper">
                            <span className="consumable-item-amount">{formatNum(coin.amount)}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
              </div>

              {/* TBD categories will show up here */}
              {categories.filter(c => c !== 'All' && c !== 'Consumables' && c !== 'Coins').includes(activeCategory) && (
                <div className="overview-tbd-message">
                  A(z) {activeCategory} kategória hamarosan érkezik!
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {identifyingItem && (
        <div className="modal-overlay naming-modal-overlay">
          <div className="modal-content gold-frame naming-modal">
            <button className="modal-close-icon naming-modal-close" onClick={() => setIdentifyingItem(null)}></button>

            <div className="modal-title-banner naming-modal-title">
              Tárgy elnevezése (#{identifyingItem.id})
            </div>
            <form onSubmit={handleSaveIdentification} className="naming-modal-form">
              <p className="naming-modal-desc">
                Add meg a tárgy pontos nevét (pl. "Small enchantment rune"). Ez a név el lesz mentve az ID mellé a memóriába.
              </p>
              <input
                type="text"
                value={identifyingItem.name || ''}
                onChange={(e) => setIdentifyingItem({ ...identifyingItem, name: e.target.value })}
                placeholder="Pl: Small enchantment rune"
                className="naming-modal-input naming-modal-input-margin"
                autoFocus
              />
              {identifyingItem.type !== 'coin' && (
                <div className="naming-modal-input-margin">
                  <label className="naming-modal-label">Keret színe</label>
                  <select
                    value={identifyingItem.color || 'white'}
                    onChange={(e) => setIdentifyingItem({ ...identifyingItem, color: e.target.value })}
                    className="naming-modal-input"
                  >
                    <option value="white">⚪ White (Normal)</option>
                    <option value="green">🟢 Green (Uncommon)</option>
                    <option value="blue">🔵 Blue (Rare)</option>
                    <option value="violet">🟣 Violet (Superior)</option>
                    <option value="orange">🟠 Orange (Flawless)</option>
                    <option value="red">🔴 Red (Absolute)</option>
                  </select>
                </div>
              )}
              <button type="submit" className="gold-gradient-btn naming-modal-btn">Mentés</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Overview;
