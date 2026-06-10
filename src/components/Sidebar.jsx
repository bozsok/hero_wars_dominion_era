import React, { useState } from 'react';

const NAV_TEXTS = {
  Dashboard: 'Your progress at a glance.',
  Heroes: 'Heroes are the core of your team.',
  Titans: 'Titans rule the dungeon and guild wars.',
  Pets: 'Pets provide great help in battle.',
  Settings: 'Configure your application.'
};

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Heroes');

  return (
    <aside className="layout-sidebar">

      <nav className="sidebar-nav">
        <a href="#" className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Dashboard'); }}>
          <span className="material-symbols-outlined nav-icon">dashboard</span>
          <span className="nav-text">Dashboard</span>
        </a>
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
        <a href="#" className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Settings'); }}>
          <span className="material-symbols-outlined nav-icon">settings</span>
          <span className="nav-text">Settings</span>
        </a>

        <div style={{
          marginTop: 'auto',
          marginBottom: '30px',
          padding: '20px',
          color: '#fece86',
          fontSize: '26px',
          textAlign: 'left',
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: '700',
          textShadow: '0px 2px 2px rgba(0, 0, 0, 0.8)'
        }}>
          {NAV_TEXTS[activeTab]}
        </div>
      </nav>


    </aside>
  );
};

export default Sidebar;
