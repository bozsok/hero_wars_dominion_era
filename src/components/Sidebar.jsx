import React, { useContext, useRef } from 'react';
import { HeroContext } from '../context/HeroContext';

const NAV_TEXTS = {
  Dashboard: 'Your progress at a glance.',
  Heroes: 'Heroes are the core of your team.',
  Titans: 'Titans rule the dungeon and guild wars.',
  Pets: 'Pets provide great help in battle.',
  Teams: 'Manage your arena and campaign teams.',
  Settings: 'Configure your application.'
};

const Sidebar = ({ activeTab, setActiveTab, onOpenImport }) => {
  const { loadViewData, isViewMode, exitViewMode } = useContext(HeroContext);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        loadViewData(event.target.result);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <aside className="layout-sidebar">

      {/* Logó – a korábbi header-logo-container átemelve */}
      <div className="sidebar-logo-container">
        <img src="./ui/logo.png" alt="Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        <a href="#" className={`nav-item ${activeTab === 'Overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Overview'); }}>
          <span className="material-symbols-outlined nav-icon">explore</span>
          <span className="nav-text">Overview</span>
        </a>
        {/* 
        <a href="#" className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Dashboard'); }}>
          <span className="material-symbols-outlined nav-icon">dashboard</span>
          <span className="nav-text">Dashboard</span>
        </a>
        */}
        <a href="#" className={`nav-item ${activeTab === 'Heroes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Heroes'); }}>
          <img src="./ui/hero.png" alt="Heroes" className="nav-icon" />
          <span className="nav-text">Heroes</span>
        </a>
        <a href="#" className={`nav-item ${activeTab === 'Titans' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Titans'); }}>
          <span className="material-symbols-outlined nav-icon">workspace_premium</span>
          <span className="nav-text">Titans</span>
        </a>
        <a href="#" className={`nav-item ${activeTab === 'Pets' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Pets'); }}>
          <img src="./ui/pet.png" alt="Pets" className="nav-icon" />
          <span className="nav-text">Pets</span>
        </a>
        <a href="#" className={`nav-item ${activeTab === 'Teams' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Teams'); }}>
          <span className="material-symbols-outlined nav-icon">groups</span>
          <span className="nav-text">Teams</span>
        </a>
        <a href="#" className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Settings'); }}>
          <span className="material-symbols-outlined nav-icon">settings</span>
          <span className="nav-text">Settings</span>
        </a>

        <div className="sidebar-footer-text">
          {NAV_TEXTS[activeTab]}
        </div>
      </nav>

      {/* Akciógombok – a korábbi header-actions átemelve, sidebar stílusban */}
      <div className="sidebar-actions">
        {isViewMode ? (
          <button
            className="sidebar-action-item return-btn"
            onClick={exitViewMode}
          >
            <span className="material-symbols-outlined nav-icon">undo</span>
            <span className="nav-text">Vissza a sajáthoz</span>
          </button>
        ) : (
          <>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden-file-input"
              onChange={handleFileChange}
            />
            <button
              className="sidebar-action-item"
              onClick={() => fileInputRef.current?.click()}
              title="Megtekintő mód (Más JSON fájljának betöltése)"
            >
              <span className="material-symbols-outlined nav-icon">visibility</span>
              <span className="nav-text">Megtekintés</span>
            </button>
            <button
              className="sidebar-action-item"
              onClick={onOpenImport}
              title="Adatkezelés"
            >
              <span className="material-symbols-outlined nav-icon">sync</span>
              <span className="nav-text">Adatszinkron</span>
            </button>
          </>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
