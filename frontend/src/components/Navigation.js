import React from 'react';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">AgroChat</div>
      <ul className="nav-links">
        <li><a href="/">Início</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Configurações</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;
