import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import MyButton from '../components/Button';
import CalculationResults from '../components/CalculationResults';

const GraphVisualization = ({ graphData, onExit, totalDuration, totalRange, criticalPath }) => {
  const containerRef = useRef(null);

  useEffect(() => {

    if (!graphData || !Array.isArray(graphData.nodes)) {
      console.error('Błąd: graphData.nodes nie istnieje lub nie jest tablicą');
      return;
    }
  
    if (!Array.isArray(criticalPath)) {
      console.error('Błąd: criticalPath nie jest tablicą');
      return;
    }

    const options = {
      layout: {
        hierarchical: {
          direction: 'LR', // Układ: od lewej do prawej
          sortMethod: 'directed',
          levelSeparation: 1000,
          nodeSpacing: 1000,
        },
      },
      nodes: {
        shape: 'circle',
        font: {size: 50, color: '#ffffff'},
        size: 30,
        color: {background: '#007bff', border: '#0056b3'},
        margin: 10, 
        fixed: { x: true, y: true },
      },
      edges: {
        arrows: {to: { enabled: true, scaleFactor: 3 }},
        color: '#848484',
        width: 3,
        length: 500,
        font: {align: 'middle', size: 50, color: '#000000',},
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        zoomView: true,
      },
      physics: {
        enabled: false,
      },
    };

    const coloredNodes = graphData.nodes.map((node) => {
      const ctr = criticalPath.includes(node.id);
      const backgroundColor = ctr ? '#ff0000' : '#007bff';
      return {
        ...node,
        color: { background: backgroundColor },
      };
    });

    const updatedGraphData = { ...graphData, nodes: coloredNodes };
    const network = new Network(containerRef.current, updatedGraphData, options);

    return () => network.destroy(); // Czyszczenie instancji
  }, [graphData, criticalPath]);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div 
        style={{ 
          top: 0,
          width: '100%',
          height: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e0f7fa'
        }}>
        {/* Wyniki obliczeń */}
        <CalculationResults totalDuration={totalDuration} totalRange={totalRange} criticalPath={criticalPath}/>
      </div>

      {/* Kontener na grafikę */}
      <div ref={containerRef} style={{ height: '80%', width: '100%', backgroundColor: '#e0f7fa' }} />

      {/* Kontener na przycisk */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '10%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e0f7fa',
        }}
      >
        <MyButton onClick={onExit}>Zamknij</MyButton>
      </div>
    </div>
  );
};

export default GraphVisualization;
