import React from 'react';
import styled from 'styled-components';
import { AreaChart, Wheat, Droplets, CheckCircle, XCircle } from 'lucide-react'; // Import icons
import aiTheme from '../styles/theme'; // Import theme

const StyledPlotCard = styled.div`
  background-color: ${aiTheme.colors.white || '#ffffff'};
  border: 1px solid ${aiTheme.colors.border};
  border-left: 6px solid ${aiTheme.colors.primary}; /* Highlight with primary color */
  border-radius: ${aiTheme.borderRadius};
  padding: ${aiTheme.spacing.medium};
  box-shadow: ${aiTheme.boxShadow};
  transition: ${aiTheme.transition};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  }

  h3 {
    font-size: 1.4em;
    color: ${aiTheme.colors.primary};
    margin-bottom: ${aiTheme.spacing.small};
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
  }

  p {
    font-size: 0.95em;
    color: ${aiTheme.colors.text};
    margin: ${aiTheme.spacing.small} 0;
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
  }

  .plot-status {
    display: flex;
    align-items: center;
    gap: ${aiTheme.spacing.small};
    font-weight: bold;
    color: ${props => props.isIrrigated ? aiTheme.colors.success : aiTheme.colors.error};
  }
`;

function PlotCard({ plot }) {
  return (
    <StyledPlotCard isIrrigated={plot.irrigation}>
      <div className="plot-card-content">
        <h3><AreaChart size={20} /> {plot.name}</h3>
        <p><Wheat size={16} /> Cultura: {plot.crop}</p>
        <p><Droplets size={16} /> Tamanho: {plot.size}</p>
        <p className="plot-status">
          {plot.irrigation ? <CheckCircle size={16} /> : <XCircle size={16} />}
          Irrigação: {plot.irrigation ? 'Ativa' : 'Inativa'}
        </p>
      </div>
    </StyledPlotCard>
  );
}

export default PlotCard;
