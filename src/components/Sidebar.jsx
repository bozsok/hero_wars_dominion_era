import React from 'react';

const NAV_TEXTS = {
  Dashboard: 'Your progress at a glance.',
  Heroes: 'Heroes are the core of your team.',
  Titans: 'Titans rule the dungeon and guild wars.',
  Pets: 'Pets provide great help in battle.',
  Settings: 'Configure your application.'
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="layout-sidebar">

      <nav className="sidebar-nav">
        <a href="#" className={`nav-item ${activeTab === 'Overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Overview'); }}>
          <span className="material-symbols-outlined nav-icon">explore</span>
          <span className="nav-text">Overview</span>
        </a>
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

        <div className="sidebar-footer-text">
          {NAV_TEXTS[activeTab]}
        </div>
      </nav>


    </aside>
  );
};

export default Sidebar;
