import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import GraphVisualization from './../moduls/GraphVisualization';
import { calculateResults, generateGraphData } from './../moduls/Calculation_module';
import './../basic.css';

const Calculation_screen = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(
    Array.from({ length: 8 }, (_, index) => ({
      name: index < 26 ? String.fromCharCode(65 + index) : '',
      duration: '',
      range: '',
    }))
  );
  const [message, setMessage] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [totalDuration, setTotalDuration] = useState(null);
  const [totalRange, setTotalRange] = useState(null);

  const InputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const AddRow = () => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const nextIndex = newRows.length;
      if (nextIndex < 26) {
        newRows.push({
          name: String.fromCharCode(65 + nextIndex),
          duration: '',
          range: '',
        });
      } else {
        newRows.push({
          name: '',
          duration: '',
          range: '',
        });
      }
      return newRows;
    });
  };

  const DeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const ClearRow = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = { name: '', duration: '', range: '' };
    setRows(updatedRows);
  };

  const Calculate = () => {
    const result = calculateResults(rows);

    if (result.error) {
      setMessage(`Błąd danych: ${result.error}`);
    } else {
      const { events, activities, totalDuration, totalRange } = result;
      setMessage(`Dane poprawne\nSuma czasu: ${totalDuration} h\nZakres: ${totalRange.start}-${totalRange.end}`);

      const graphData = generateGraphData(events, activities);
      setGraphData(graphData);
      setTotalDuration(totalDuration);
      setTotalRange(totalRange);
    }
  };

  const OpenGraphWindow = () => {
    if (!graphData || !totalDuration || !totalRange) return;

    // Otwórz nowe okno
    const graphWindow = window.open('', '_blank', 'width=1600,height=900');
    graphWindow.document.write(`
      <div id="graph-root"></div>
    `);

    setTimeout(() => {
      graphWindow.document.title = 'Graf CPM';
      const graphRoot = graphWindow.document.getElementById('graph-root');
  
      import('./../moduls/GraphVisualization').then(({ default: GraphVisualization }) => {
        const root = createRoot(graphRoot);
        root.render(
          <GraphVisualization 
            graphData={graphData} 
            totalDuration={totalDuration}
            totalRange={totalRange}
            onExit={() => graphWindow.close()}
        />
        );
      });
    }, 0);
  };

  return (
    <div className="app-container">
      <h2 className="center header-top">Obliczenia</h2>

      {message && (
        <div className="message-box">
          <p>{message}</p>
          <button className="small-button" onClick={OpenGraphWindow}>Pokaż Graf</button>
          <button className="small-button delete" onClick={() => setMessage(null)}>Zamknij</button>
        </div>
      )}

      <div className="form-container">
        <div className="left-container">
          <p className="section-title">Wprowadź dane: </p>
          {rows.map((row, index) => (
            <div className="row" key={index}>
              <div className="row-number-container">
                <span className="row-number">{index + 1}</span>
              </div>

              <input
                className="input-field"
                type="text"
                placeholder="Nazwa czynności"
                value={row.name || ''}
                onChange={(e) => InputChange(index, 'name', e.target.value)}
              />
              <input
                className="input-field"
                type="number"
                placeholder="Czas trwania [h]"
                value={row.duration}
                min="1"
                onChange={(e) => InputChange(index, 'duration', e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Zakres (np. x-y)"
                value={row.range}
                onChange={(e) => InputChange(index, 'range', e.target.value)}
              />

              <button className="small-button delete" onClick={() => DeleteRow(index)}>Usuń</button>
              <button className="small-button clean" onClick={() => ClearRow(index)}>Wyczyść</button>
            </div>
          ))}
        </div>

        <div className="right-container">
          <div style={{ marginTop: '20px' }}>
            <button onClick={AddRow}>Dodaj Czynność</button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={Calculate}>Oblicz Wynik</button>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => navigate(-1)}>Powrót</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculation_screen;
