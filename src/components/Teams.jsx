import React, { useState, useContext } from 'react';
import { HeroContext } from '../context/HeroContext';
import './Teams.css';

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

const Teams = () => {
  const { heroes, playerProfile, playerTeams, isViewMode, viewProfile } = useContext(HeroContext);
  const displayProfile = (isViewMode && viewProfile) ? viewProfile : playerProfile;

  const [activeTeamCategory, setActiveTeamCategory] = useState('arena');

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

  const formatNum = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('hu-HU');
  };

  return (
    <main className="layout-main">
      <div className="dashboard-page-wrapper">
        <div className="dashboard-hero-modal-style-wrapper">
          <div className="modal-content gold-frame dashboard-content-frame">
            <div className="modal-scroll-container resources-scroll-active">
              <div className="dashboard-teams-tab">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Teams;
