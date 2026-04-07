import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from './ThemeToggleButton';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, tabs }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo">P</div>
        <div>
          <span className="nav-title">PagarBook <b>CRM</b></span>
          <span className="nav-role-badge">{user?.role === 'admin' ? 'Admin' : 'RE'}</span>
        </div>
      </div>

      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Relationship Executive'}</span>
        </div>
        <ThemeToggleButton />
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          ⏻
        </button>
      </div>
    </nav>
  );
}
