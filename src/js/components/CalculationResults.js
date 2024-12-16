import React from 'react';

const CalculationResults = ({ totalDuration, totalRange }) => {
  return (
    <div style={{ textAlign: 'center', color: '#0f0f0f' }}>
      <h2><strong>Suma czasu: {totalDuration} h</strong></h2>
      <h2><strong>Zakres: {totalRange.start} - {totalRange.end}</strong></h2>
    </div>
  );
};

export default CalculationResults;
