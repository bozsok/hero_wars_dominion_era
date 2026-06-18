import React, { useContext, useState } from 'react';
import { HeroContext } from '../context/HeroContext';
import HeroCard from './HeroCard';
import HeroModal from './HeroModal';
import heroGameSpecs from '../data/heroGameSpecs.json' with { type: 'json' };

const Dashboard = () => {
  const { heroes, isViewMode, sortMode, setSortMode } = useContext(HeroContext);
  const [selectedHero, setSelectedHero] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [specialFilter, setSpecialFilter] = useState('all');

  const ownedCount = heroes.filter(h => (h.general?.level || 0) > 0).length;

  const filteredHeroes = heroes.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || (hero.roles || []).includes(roleFilter);
    const heroSpecs = heroGameSpecs[hero.id] || {};
    const matchesSpecial = specialFilter === 'all' || (heroSpecs.special && heroSpecs.special.includes(specialFilter));
    return matchesSearch && matchesRole && matchesSpecial;
  });

  const sortedHeroes = [...filteredHeroes].sort((a, b) => {
    if (sortMode === 'power_desc') {
      const pA = a.general?.power || 0;
      const pB = b.general?.power || 0;
      return pB - pA;
    }
    if (sortMode === 'power_asc') {
      const pA = a.general?.power || 0;
      const pB = b.general?.power || 0;
      return pA - pB;
    }
    if (sortMode === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortMode === 'name_desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  return (
    <main className="layout-main">
      <div className="container">

        {isViewMode && (
          <div className="view-mode-warning">
            <h2 className="view-mode-title">Megtekintés Mód Aktív</h2>
            <p>Jelenleg egy betöltött adatbázist látsz. A módosítások nem lesznek elmentve. Kattints a "VISSZA A SAJÁTHOZ" gombra a kilépéshez.</p>
          </div>
        )}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">HŐSÖK ÖSSZEÁLLÍTÁSA</h1>
            <p className="dashboard-subtitle">A hősök tulajdonságai kattintással módosíthatók</p>
          </div>
          <div className="dashboard-stats">
            <div className="dashboard-total">
              <span className="stat-label dashboard-stat-value-inner">Birtokolt: {ownedCount} / {heroes.length}</span>
            </div>

            {/* Gyorskereső */}
            <div className="stat-chip dashboard-action-bar-inner">
              <span className="material-symbols-outlined stat-icon">search</span>
              <input
                type="text"
                className="dashboard-search-input"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Szerepkör szűrő */}
            <div className="stat-chip dashboard-action-bar-inner">
              <span className="material-symbols-outlined stat-icon">shield</span>
              <select
                className="stat-label dashboard-filter-select"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="all" className="dashboard-select-option">Minden szerep</option>
                <option value="Tank" className="dashboard-select-option">Tank</option>
                <option value="Fighter" className="dashboard-select-option">Fighter</option>
                <option value="Marksman" className="dashboard-select-option">Marksman</option>
                <option value="Mage" className="dashboard-select-option">Mage</option>
                <option value="Healer" className="dashboard-select-option">Healer</option>
                <option value="Support" className="dashboard-select-option">Support</option>
                <option value="Control" className="dashboard-select-option">Control</option>
              </select>
            </div>

            {/* Frakció/Szövetség szűrő */}
            <div className="stat-chip dashboard-action-bar-inner">
              <span className="material-symbols-outlined stat-icon">groups</span>
              <select
                className="stat-label dashboard-filter-select"
                value={specialFilter}
                onChange={e => setSpecialFilter(e.target.value)}
              >
                <option value="all" className="dashboard-select-option">Minden szövetség</option>
                <option value="Undead" className="dashboard-select-option">Undead</option>
                <option value="Grove Keeper" className="dashboard-select-option">Grove Keeper</option>
                <option value="Demon" className="dashboard-select-option">Demon</option>
                <option value="Elf" className="dashboard-select-option">Elf</option>
                <option value="Blessed" className="dashboard-select-option">Blessed</option>
                <option value="Chaos" className="dashboard-select-option">Chaos</option>
                <option value="Engineer" className="dashboard-select-option">Engineer</option>
              </select>
            </div>

            <div className="stat-chip dashboard-action-bar-inner">
              <span className="material-symbols-outlined stat-icon">sort</span>
              <select
                className="stat-label dashboard-sort-select"
                value={sortMode}
                onChange={e => setSortMode(e.target.value)}
              >
                <option value="default" className="dashboard-select-option">Rendezés: Alap</option>
                <option value="name_asc" className="dashboard-select-option">Név (A-Z)</option>
                <option value="name_desc" className="dashboard-select-option">Név (Z-A)</option>
                <option value="power_desc" className="dashboard-select-option">Erő (Csökkenő)</option>
                <option value="power_asc" className="dashboard-select-option">Erő (Növekvő)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hero-grid">
          {sortedHeroes.map(hero => (
            <HeroCard key={hero.id} hero={hero} onClick={setSelectedHero} />
          ))}
        </div>

      </div>

      {selectedHero && (
        <HeroModal hero={selectedHero} onClose={() => setSelectedHero(null)} />
      )}
    </main>
  );
};

export default Dashboard;
