import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">🌿 AgroChat</div>
      <ul className="nav-links">
        <li><Link to="/">🏠 Início</Link></li>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/settings">⚙️ Configurações</Link></li>
        <li><Link to="/iot">📶 IoT Status</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;