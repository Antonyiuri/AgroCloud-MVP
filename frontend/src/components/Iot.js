import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wifi, Thermometer, Droplets, Gauge, Clock, AlertCircle } from 'lucide-react'; // Import icons
import aiTheme from '../styles/theme'; // Import theme

const IotContainer = styled.div`
  padding: ${aiTheme.spacing.large};
  background-color: ${aiTheme.colors.background};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${aiTheme.spacing.large};
`;

const StatusPanel = styled.div`
  background-color: ${aiTheme.colors.white};
  border-radius: ${aiTheme.borderRadius};
  box-shadow: ${aiTheme.boxShadow};
  padding: ${aiTheme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${aiTheme.spacing.medium};
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${aiTheme.spacing.medium};

  h1 {
    font-size: 2em;
    color: ${aiTheme.colors.primary};
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
  }
`;

const SystemStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StatusIndicator = styled.div`
  padding: ${aiTheme.spacing.small} ${aiTheme.spacing.medium};
  border-radius: 20px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: ${aiTheme.spacing.small};
  color: white;
  background-color: ${props => props.isOnline ? aiTheme.colors.success : aiTheme.colors.error};
  margin-bottom: ${aiTheme.spacing.small};
`;

const LastUpdate = styled.div`
  font-size: 0.9em;
  color: ${aiTheme.colors.lightText};
  display: flex;
  align-items: center;
  gap: ${aiTheme.spacing.small};
`;

const ErrorMessage = styled.div`
  background-color: ${aiTheme.colors.error};
  color: white;
  padding: ${aiTheme.spacing.small};
  border-radius: ${aiTheme.borderRadius};
  display: flex;
  align-items: center;
  gap: ${aiTheme.spacing.small};
`;

const SensorCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${aiTheme.spacing.large};
`;

const SensorCard = styled.div`
  background-color: ${aiTheme.colors.white};
  border-radius: ${aiTheme.borderRadius};
  box-shadow: ${aiTheme.boxShadow};
  padding: ${aiTheme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${aiTheme.spacing.medium};
  transition: ${aiTheme.transition};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }

  h2 {
    font-size: 1.5em;
    color: ${aiTheme.colors.primary};
    margin-bottom: ${aiTheme.spacing.small};
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
  }

  .sensor-value {
    font-size: 2.5em;
    font-weight: bold;
    color: ${aiTheme.colors.secondary};
    display: flex;
    align-items: baseline;
    gap: ${aiTheme.spacing.small};

    span {
      font-size: 0.5em;
      color: ${aiTheme.colors.lightText};
    }
  }

  .sensor-timestamp {
    font-size: 0.85em;
    color: ${aiTheme.colors.lightText};
    margin-top: ${aiTheme.spacing.small};
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
  }

  .no-data {
    color: ${aiTheme.colors.lightText};
    font-style: italic;
  }

  .temp-humidity-group {
    display: flex;
    justify-content: space-around;
    gap: ${aiTheme.spacing.medium};

    div {
      text-align: center;
    }
  }
`;

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

  if (loading) return <IotContainer>Carregando dados...</IotContainer>;

  return (
    <IotContainer>
      <StatusPanel>
        <StatusHeader>
          <h1><Wifi size={32} /> Status de IoT</h1>
          <SystemStatus>
            <StatusIndicator isOnline={isOnline}>
              {isOnline ? '🟢 Sensores Online' : '🔴 Sensores OFFLINE'}
            </StatusIndicator>
            <LastUpdate>
              <Clock size={16} /> Última atualização: {currentDate}
            </LastUpdate>
          </SystemStatus>
        </StatusHeader>
        
        {error && <ErrorMessage><AlertCircle size={20} /> Erro: {error}</ErrorMessage>}
      </StatusPanel>

      <SensorCardsContainer>
        <SensorCard>
          <h2><Gauge size={24} /> Pressão da Água</h2>
          {sensorData?.pressure ? (
            <>
              <p className="sensor-value">
                {sensorData.pressure.valor} <span>bar</span>
              </p>
              <p className="sensor-timestamp">
                <Clock size={16} /> {formatDate(sensorData.pressure.timestamp)}
              </p>
            </>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </SensorCard>

        <SensorCard>
          <h2><Thermometer size={24} /> Temperatura e Umidade</h2>
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
                <Clock size={16} /> {formatDate(sensorData.timestamp)}
              </p>
            </>
          ) : (
            <p className="no-data">Nenhum dado disponível</p>
          )}
        </SensorCard>
      </SensorCardsContainer>
    </IotContainer>
  );
}

export default Iot;
