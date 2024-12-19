import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../basic.css';

const Mainscreen = () => {
  const navigate = useNavigate();

  const Calculation_screen = () => {
    navigate('/Calculation_screen');
  };

  const History_screen = () => {
    navigate('/History_screen');
  };

  const Creators_screen = () => {
    navigate('/Creators_screen');
  };

  const Exit = () => {
    window.close();
  };

  return (
    <div className="app-container">
      <h2 className="center header-top">Optymalizacja wydajności metodą CPM</h2>
      <div className="button-container">
        <button onClick={Calculation_screen}>Obliczenia</button>
        <button onClick={History_screen}>Historia Wyników</button>
        <button onClick={Creators_screen}>Twórcy</button>
        <button className="exit-button" onClick={Exit}>Wyjdź</button>
      </div>
    </div>
  );
};

export default Mainscreen;
