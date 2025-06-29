// frontend/src/components/CellGrid.jsx
import React from 'react';
import './CellGrid.css';

const CellGrid = ({ cells, onCellSelect }) => {
  return (
    <div className="cell-grid">
      {cells.map((cell) => (
        <div
          className={`cell-tile status-${cell.status}`}
          key={cell.id}
          onClick={() => onCellSelect(cell.id)}
        >
          <div className="cell-id">{cell.id}</div>
          <div className="cell-voltage">{cell.voltage}V</div>
          <div className="cell-soc">SoC {cell.soc}%</div>
        </div>
      ))}
    </div>
  );
};

export default CellGrid;