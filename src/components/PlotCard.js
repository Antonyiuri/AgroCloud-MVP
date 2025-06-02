import React from 'react';
import './PlotCard.css';

function PlotCard({ plot }) {
  return (
    <div className="plot-card">
      <div className="plot-card-content">
        <h3>{plot.name}</h3>
        <p>Size: {plot.size}</p>
        <p>Crop: {plot.crop}</p>
        <p>Irrigation: {plot.irrigation ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

export default PlotCard;
