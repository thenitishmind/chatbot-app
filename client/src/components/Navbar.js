import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import './Navbar.css';

function Navbar({ onNewChat, onToggleHistory, onOpenSettings }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="nav-button menu-button" onClick={onToggleHistory}>
          <MenuIcon />
        </button>
        <h1 className="nav-title">Business Loan Assistant</h1>
      </div>
      <div className="navbar-right">
        <button className="nav-button new-chat" onClick={onNewChat}>
          <AddIcon />
          <span>New Chat</span>
        </button>
        <button className="nav-button" onClick={onOpenSettings}>
          <SettingsIcon />
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 