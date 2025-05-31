import React from 'react';
import PlotCard from './PlotCard';
import './IrrigationDashboard.css';

function IrrigationDashboard() {
  // Dummy data for plots
  const plots = [
    { id: 1, name: 'Plot A', size: '1000 sq ft', crop: 'Tomatoes', irrigation: true },
    { id: 2, name: 'Plot B', size: '1500 sq ft', crop: 'Peppers', irrigation: false },
    { id: 3, name: 'Plot C', size: '1200 sq ft', crop: 'Cucumbers', irrigation: true },
    { id: 4, name: 'Plot D', size: '800 sq ft', crop: 'Lettuce', irrigation: true }
  ];

  return (
    <div className="irrigation-dashboard">
      <h2>Irrigation Dashboard</h2>
      <div className="plots-container">
        {plots.map(plot => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>
    </div>
  );
}

export default IrrigationDashboard;
