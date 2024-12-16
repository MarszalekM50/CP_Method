import React from 'react';
import { useNavigate } from 'react-router-dom';

const History_screen = () => {
  const navigate = useNavigate();

  const GoBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      <h2 className="center header-top">Ekran 2</h2>
      <p>To jest ekran 2</p>
      <div className="button-container">
        <button onClick={GoBack}>Powrót</button>
      </div>
    </div>
  );
};

export default History_screen;
