// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Mainscreen from './ekrany/Mainscreen';
import Calculation_screen from './ekrany/Calculation_screen';
import History_screen from './ekrany/History_screen';
import Creators_screen from './ekrany/Creators_screen';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainscreen />} />
      <Route path="/Calculation_screen" element={<Calculation_screen />} />
      <Route path="/History_screen" element={<History_screen />} />
      <Route path="/Creators_screen" element={<Creators_screen />} />
    </Routes>
  );
};

export default App;
