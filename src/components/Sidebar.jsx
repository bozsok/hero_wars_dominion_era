import React, { useContext, useRef, useState, useLayoutEffect } from 'react';
import { HeroContext } from '../context/HeroContext';

const NavItem = ({ tabId, currentActiveTab, onClick, children }) => {
  const isActive = currentActiveTab === tabId;
  const prevIsActive = useRef(isActive);
  const [isClosing, setIsClosing] = useState(false);

  useLayoutEffect(() => {
    if (!isActive && prevIsActive.current) {
      setIsClosing(true);
      const timer = setTimeout(() => setIsClosing(false), 100);
      return () => clearTimeout(timer);
    }
    prevIsActive.current = isActive;
  }, [isActive]);

  const className = `nav-item ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''}`.trim();

  return (
    <a href="#" className={className} onClick={(e) => { e.preventDefault(); onClick(tabId); }}>
      {children}
    </a>
  );
};

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
        <NavItem tabId="Overview" currentActiveTab={activeTab} onClick={setActiveTab}>
          <span className="material-symbols-outlined nav-icon">explore</span>
          <span className="nav-text">Overview</span>
        </NavItem>
        {/* 
        <NavItem tabId="Dashboard" currentActiveTab={activeTab} onClick={setActiveTab}>
          <span className="material-symbols-outlined nav-icon">dashboard</span>
          <span className="nav-text">Dashboard</span>
        </NavItem>
        */}
        <NavItem tabId="Heroes" currentActiveTab={activeTab} onClick={setActiveTab}>
          <img src="./ui/hero.png" alt="Heroes" className="nav-icon" />
          <span className="nav-text">Heroes</span>
        </NavItem>
        <NavItem tabId="Titans" currentActiveTab={activeTab} onClick={setActiveTab}>
          <span className="material-symbols-outlined nav-icon">workspace_premium</span>
          <span className="nav-text">Titans</span>
        </NavItem>
        <NavItem tabId="Pets" currentActiveTab={activeTab} onClick={setActiveTab}>
          <img src="./ui/pet.png" alt="Pets" className="nav-icon" />
          <span className="nav-text">Pets</span>
        </NavItem>
        <NavItem tabId="Teams" currentActiveTab={activeTab} onClick={setActiveTab}>
          <span className="material-symbols-outlined nav-icon">groups</span>
          <span className="nav-text">Teams</span>
        </NavItem>
        <NavItem tabId="Settings" currentActiveTab={activeTab} onClick={setActiveTab}>
          <span className="material-symbols-outlined nav-icon">settings</span>
          <span className="nav-text">Settings</span>
        </NavItem>

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
