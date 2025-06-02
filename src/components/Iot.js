import React, { useState, useEffect } from 'react';
import './Iot.css';

function Iot() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleString('pt-BR'));
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://35.247.240.31:3001/api/dados/');
        if (!response.ok) throw new Error('Erro ao carregar dados');

        const data = await response.json();
        const lastPressure = data.find(item => item.sensor === 'pressao_agua_01');
        const lastTempHumidity = data.find(item => item.temperatura !== undefined);

        setSensorData({
          pressure: lastPressure,
          temperature: lastTempHumidity?.temperatura,
          humidity: lastTempHumidity?.umidade,
          timestamp: lastTempHumidity?.timestamp
        });

        setIsOnline(true);
        setError(null);
      } catch (err) {
        setError(err.message);
        setIsOnline(false);
      } finally {
        setLoading(false);
      }
    };

    updateDateTime();
    fetchData();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return currentDate;
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? currentDate : date.toLocaleString('pt-BR');
    } catch {
      return currentDate;
    }
  };

  if (loading) return <div className="iot-loading">Carregando dados...</div>;

  return (
    <div className="iot-container">
      {/* Painel de Status Ampliado */}
      <div className="status-panel">
        <div className="status-header">
          <h1>📶 Status de IoT</h1>
          <div className="system-status">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢 Sensores Online' : '🔴 Sensores OFFLINE'}
            </div>
            <div className="last-update">
              Última atualização: {currentDate}
            </div>
          </div>
        </div>
        
        {error && <div className="iot-error">Erro: {error}</div>}
      </div>

      <div className="sensor-cards">
        <div className="sensor-card">
          <h2>Pressão da Água</h2>
          {sensorData?.pressure ? (
            <>
              <p className="sensor-value">
                {sensorData.pressure.valor} <span>bar</span>
              </p>
              <p className="sensor-timestamp">
                {formatDate(sensorData.pressure.timestamp)}
              </p>
            </>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </div>

        <div className="sensor-card">
          <h2>Temperatura e Umidade</h2>
          {sensorData?.temperature !== undefined ? (
            <>
              <div className="temp-humidity-group">
                <div>
                  <p className="sensor-value">
                    {sensorData.temperature} <span>°C</span>
                  </p>
                  <p>Temperatura</p>
                </div>
                <div>
                  <p className="sensor-value">
                    {sensorData.humidity} <span>%</span>
                  </p>
                  <p>Umidade</p>
                </div>
              </div>
              <p className="sensor-timestamp">
                {formatDate(sensorData.timestamp)}
              </p>
            </>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Iot;