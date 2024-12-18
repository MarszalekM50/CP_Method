import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatorsScreen = () => {
  const navigate = useNavigate();

  const GoBack = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      <h2 className="center header-top">Twórcy</h2>
      <div className="form-container">
        <div className="creators">
          <h3 className="creators-title">Aplikacje wykonali:</h3>
          <div className="creators-list">
            <div className="creator">Mateusz Marszałek</div>
            <div className="creator">Olaf Jurek</div>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button onClick={GoBack}>Powrót</button>
      </div>
    </div>
  );
};

export default CreatorsScreen;
