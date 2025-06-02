import React from 'react';
import './IrrigationDashboard.css';

function IrrigationDashboard() {
  const plots = [
    { id: 1, name: 'Área 01', humidity: 42, productivity: 75 },
    { id: 2, name: 'Área 02', humidity: 58, productivity: 89 },
    { id: 3, name: 'Área 03', humidity: 33, productivity: 65 },
    { id: 4, name: 'Área 04', humidity: 76, productivity: 92 },
  ];

  return (
    <div className="irrigation-dashboard">
      <h2 className="dashboard-title">📈 Painel de Irrigação & Produtividade</h2>
      <p className="dashboard-subtitle">Monitoramento das condições dos sensores em tempo real.</p>

      <div className="plots-container">
        {plots.map((plot) => (
          <div key={plot.id} className="dashboard-card">
            <h3>{plot.name}</h3>
            <p><strong>Umidade:</strong> {plot.humidity}%</p>
            <p><strong>Produtividade estimada:</strong> {plot.productivity}%</p>
            <div className="bar-wrapper">
              <div className="bar" style={{ width: `${plot.productivity}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IrrigationDashboard;
