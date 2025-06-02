import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import IrrigationDashboard from './components/IrrigationDashboard';
import Chatbot from './components/Chatbot';
import Iot from './components/Iot';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            {/* Rota para a página inicial */}
            <Route path="/" element={
              <>
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
              </>
            } />

            {/* Rota para a página IoT */}
            <Route path="/Iot" element={<Iot/>} />

            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;