import React, { useContext, useRef } from 'react';
import { HeroContext } from '../context/HeroContext';

const Sidebar = () => {
  const { exportData, loadViewData, isViewMode, exitViewMode } = useContext(HeroContext);
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
  };

  return (
    <aside className="layout-sidebar">

      <nav className="sidebar-nav">
        <a href="#" className="nav-item">
          <span className="material-symbols-outlined nav-icon">dashboard</span>
          <span className="nav-text">Dashboard</span>
        </a>
        <a href="#" className="nav-item active">
          <img src="./ui/hero.png" alt="Heroes" className="nav-icon" />
          <span className="nav-text">Heroes</span>
        </a>
        <a href="#" className="nav-item">
          <span className="material-symbols-outlined nav-icon">workspace_premium</span>
          <span className="nav-text">Titans</span>
        </a>
        <a href="#" className="nav-item">
          <img src="./ui/pet.png" alt="Pets" className="nav-icon" />
          <span className="nav-text">Pets</span>
        </a>
        <a href="#" className="nav-item">
          <span className="material-symbols-outlined nav-icon">settings</span>
          <span className="nav-text">Settings</span>
        </a>
      </nav>

      <div className="sidebar-actions">
        {isViewMode ? (
          <button
            className="gold-gradient-btn return-btn"
            onClick={exitViewMode}
          >
            VISSZA A SAJÁTHOZ
          </button>
        ) : (
          <>
            <button
              className="image-btn"
              onClick={exportData}
            >
              Exportálás
            </button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              className="image-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Megtekintő mód
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
