import React from 'react';

const Header = ({ onOpenImport }) => {
  return (
    <header className="layout-header">
      <div className="header-logo-container">
        <img src="./ui/logo.png" alt="Logo" className="header-logo" />
      </div>

      <div className="header-title-container">
        <span className="header-title">Fejlődésmérő és összehasonlító</span>
      </div>

      <div className="header-actions">
        <div className="search-container" style={{ display: 'none' }}>
          {/* Search would go here */}
        </div>
        <button className="import-icon-btn" onClick={onOpenImport} title="Adatok importálása">
          <span className="material-symbols-outlined">upload_file</span>
        </button>
        <span className="material-symbols-outlined header-profile-icon">
          account_circle
        </span>
      </div>
    </header>
  );
};

export default Header;
