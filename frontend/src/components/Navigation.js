import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart2, Settings, Wifi } from 'lucide-react';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">
        <img src="/LOGO.jpg" alt="AgroChat Logo" className="logo-icon" />
        AgroNeural
      </div>
      <ul className="nav-links">
        <li><Link to="/"><Home size={20} /> AgroChat</Link></li>
        <li><Link to="/dashboard"><BarChart2 size={20} /> Irrigação inteligente</Link></li>
        <li><Link to="/settings"><Settings size={20} /> Configurações</Link></li>
        <li><Link to="/iot"><Wifi size={20} /> Status IoT</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
