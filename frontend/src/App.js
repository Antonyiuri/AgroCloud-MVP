import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import aiTheme from './styles/theme';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import IrrigationDashboard from './components/IrrigationDashboard';
import Iot from './components/Iot';
import Settings from './components/Settings'; // Assumindo que você criará este componente
import ErrorBoundary from './components/ErrorBoundary'; // Componente para tratar erros
import './App.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts?.primary || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
    background-color: ${({ theme }) => theme.colors?.background || '#f0f4f8'};
    color: ${({ theme }) => theme.colors?.text || '#333'};
    line-height: 1.6;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    min-height: 100vh;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors?.primary || '#4a7c59'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors?.primaryDark || '#3a6249'};
  }

  /* Variáveis CSS para consistência */
  :root {
    --primary-color: ${({ theme }) => theme.colors?.primary || '#4a7c59'};
    --primary-color-dark: ${({ theme }) => theme.colors?.primaryDark || '#3a6249'};
    --background-color: ${({ theme }) => theme.colors?.background || '#f0f4f8'};
    --text-color: ${({ theme }) => theme.colors?.text || '#333'};
    --sidebar-width: 250px;
    --sidebar-collapsed-width: 60px;
  }
`;

// Componente de Loading
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

// Componente de Error Fallback
const ErrorFallback = ({ error, resetError }) => (
  <div className="error-container">
    <h2>Oops! Algo deu errado</h2>
    <div className="error-message">
      {error?.message || 'Erro desconhecido'}
    </div>
    <button className="retry-button" onClick={resetError}>
      Tentar Novamente
    </button>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handler para toggle da sidebar
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={aiTheme}>
        <GlobalStyle />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={aiTheme}>
      <GlobalStyle />
      <ErrorBoundary fallback={ErrorFallback}>
        <Router>
          <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Navigation 
              isCollapsed={isSidebarCollapsed}
              onToggle={handleSidebarToggle}
              isMobile={isMobile}
            />
            
            {/* Overlay para mobile */}
            {isMobile && !isSidebarCollapsed && (
              <div 
                className="sidebar-overlay active" 
                onClick={() => setIsSidebarCollapsed(true)}
              />
            )}
            
            <main className="main-content">
              <Routes>
                {/* Rota principal - Chatbot */}
                <Route path="/" element={<Chatbot />} />
                <Route path="/chatbot" element={<Navigate to="/" replace />} />
                
                {/* Dashboard de Irrigação */}
                <Route path="/dashboard" element={<IrrigationDashboard />} />
                <Route path="/irrigation" element={<Navigate to="/dashboard" replace />} />
                
                {/* IoT */}
                <Route path="/iot" element={<Iot />} />
                
                {/* Configurações */}
                <Route path="/settings" element={<Settings />} />
                
                {/* Rota 404 - Redireciona para home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
