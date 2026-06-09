import React from 'react';

const Sidebar = () => {

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


    </aside>
  );
};

export default Sidebar;
