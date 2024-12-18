import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import GraphVisualization from './../moduls/GraphVisualization';

const History_screen = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Pobranie historii z localStorage
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  }, []);

  const GoBack = () => {
    navigate(-1);
  };

  const OpenGraphWindow = (graphData, totalDuration, totalRange, criticalPath) => {
    if (!graphData) return;

    // Otwórz nowe okno z wykresem
    const graphWindow = window.open('', '_blank', 'width=1600,height=900');
    graphWindow.document.write('<div id="graph-root"></div>');

    setTimeout(() => {
      graphWindow.document.title = 'Graf CPM';
      const graphRoot = graphWindow.document.getElementById('graph-root');

      import('./../moduls/GraphVisualization').then(({ default: GraphVisualization }) => {
        const root = createRoot(graphRoot);
        root.render(
          <GraphVisualization 
            graphData={graphData} 
            totalDuration={totalDuration}
            criticalPath={criticalPath}
            totalRange={totalRange}
            onExit={() => graphWindow.close()}
          />
        );
      });
    }, 0);
  };

  const deleteHistoryItem = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    localStorage.setItem('history', JSON.stringify(updatedHistory));
  };

  return (
    <div className="app-container">
      <h2 className="center header-top">Historia Wyników</h2>
      <div className="form-container">
        <div className="history-container">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <p><strong>Wynik z dnia: {item.timestamp}</strong></p>
              <p><strong>Suma czasu:</strong> {item.totalDuration} h</p>
              <p><strong>Zakres:</strong> {item.totalRange.start} - {item.totalRange.end}</p>
              <p><strong>Ścieżka Krytyczna:</strong> {item.criticalPath.join(', ')}</p>
              <div className="button-group">
                <button
                  className="center small-button"
                  onClick={() => OpenGraphWindow(item.graphData, item.totalDuration, item.totalRange, item.criticalPath)}>
                  Pokaż Graf
                </button>
                <button
                  className="delete center small-button"
                  onClick={() => deleteHistoryItem(index)}>
                  Usuń Zapis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        <div className="button-container">
          <button onClick={GoBack}>Powrót</button>
        </div>
    </div>
  );
};

export default History_screen;
