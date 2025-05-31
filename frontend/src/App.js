import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
import IrrigationDashboard from './components/IrrigationDashboard';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <section className="hero-section">
          <h1>🌿 AgroChat</h1>
          <p>Seu assistente inteligente para agricultura de precisão</p>
        </section>

        <section className="dashboard-section">
          <header className="dashboard-header">
            <h2>Bem-vindo, Usuário</h2>
            <p>{new Date().toLocaleDateString('pt-BR')}</p>
          </header>
          <IrrigationDashboard />
        </section>


        <section className="chatbot-section">
          <Chatbot />
        </section>
      </main>
    </div>
  );
}

export default App;
