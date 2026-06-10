import React, { useContext, useState } from 'react';
import { HeroContext } from '../context/HeroContext';
import HeroCard from './HeroCard';
import HeroModal from './HeroModal';

const Dashboard = () => {
  const { heroes, isViewMode } = useContext(HeroContext);
  const [selectedHero, setSelectedHero] = useState(null);
  const [sortMode, setSortMode] = useState('default');

  const sortedHeroes = [...heroes].sort((a, b) => {
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
            <div className="stat-chip dashboard-action-bar-inner">
              <span className="material-symbols-outlined stat-icon dashboard-filter-group">sort</span>
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
            <div className="stat-chip">
              <img src="./ui/hero.png" alt="Heroes" className="dashboard-stat-icon" />
              <span className="stat-label dashboard-stat-value-inner">Összesen: {heroes.length}</span>
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
