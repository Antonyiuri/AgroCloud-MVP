import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
import IrrigationDashboard from './components/IrrigationDashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <div className="hero-section">
        <h1>AgroChat</h1>
        <p>Your smart agriculture assistant passei aqui</p>
      </div>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Bem-vindo, Usuário</h2>
          <p>{new Date().toLocaleDateString()}</p>
        </header>
        <IrrigationDashboard />
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
