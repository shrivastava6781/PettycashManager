import React, { useState } from 'react';

const TopBar = ({ handleSidebarToggle }) => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleProfileMenuToggle = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="top-bar">
      <div className="menu-icon" onClick={handleSidebarToggle}>
        ☰
      </div>
      <div className="app-name">Animate</div>
      <div className="profile-icon" onClick={handleProfileMenuToggle}>
        Profile
        {isProfileMenuOpen && (
          <div className="profile-menu">
            <div>Profile</div>
            <div>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
