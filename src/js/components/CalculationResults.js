import React from 'react';

const CalculationResults = ({ totalDuration, totalRange, criticalPath }) => {

  const criticalPathString = criticalPath.join(', ');
  return (
    <div style={{ textAlign: 'center', color: '#0f0f0f' }}>
      <h2><strong>Suma czasu:{totalDuration}h      Zakres:{totalRange.start}-{totalRange.end}</strong></h2>
      <h2><strong>Ścieżka Krytyczna: {criticalPathString}</strong></h2>
    </div>
  );
};

export default CalculationResults;
