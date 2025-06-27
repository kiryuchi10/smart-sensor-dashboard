// frontend/src/components/CellGrid.jsx
import React from 'react';

const CellGrid = ({ cells, onCellSelect }) => {
  const getCellStatusClass = (cell) => {
    if (cell.status === 'fault' || cell.voltage < 3.5) return 'cell-fault';
    if (cell.status === 'low' || cell.soc < 30) return 'cell-warning';
    if (cell.status === 'high' || cell.soc > 90) return 'cell-high';
    return 'cell-normal';
  };

  return (
    <div className="cell-grid">
      {cells.map((cell, index) => (
        <div 
          key={cell.id}
          className={`cell-item ${getCellStatusClass(cell)}`}
          onClick={() => onCellSelect(cell.id)}
        >
          <div className="cell-header">
            <span className="cell-id">{cell.id}</span>
            <span className="cell-voltage">{cell.voltage}V</span>
          </div>
          <div className="cell-soc">
            <span className="soc-label">SoC</span>
            <span className="soc-value">{cell.soc}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CellGrid;