import React, { useContext, useRef } from 'react';
import { HeroContext } from '../context/HeroContext';

const Header = ({ onOpenImport }) => {
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
    <header className="layout-header">
      <div className="header-logo-container">
        <img src="./ui/logo.png" alt="Logo" className="header-logo" />
      </div>

      <div className="header-title-container">
        {isViewMode ? (
          <span className="header-title header-title-view-mode">MEGTEKINTŐ MÓD AKTÍV</span>
        ) : (
          <span className="header-title">Fejlődésmérő és összehasonlító</span>
        )}
      </div>

      <div className="header-actions">
        {isViewMode ? (
          <button 
            className="gold-gradient-btn return-btn" 
            onClick={exitViewMode}
          >
            VISSZA A SAJÁTHOZ
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
              className="import-icon-btn view-mode-btn" 
              onClick={() => fileInputRef.current?.click()} 
              title="Megtekintő mód (Más JSON fájljának betöltése)"
            >
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button className="import-icon-btn" onClick={onOpenImport} title="Adatkezelés">
              <span className="material-symbols-outlined">sync</span>
            </button>
          </>
        )}
        <span className={`material-symbols-outlined header-profile-icon ${isViewMode ? 'view-mode' : ''}`}>
          account_circle
        </span>
      </div>
    </header>
  );
};

export default Header;
