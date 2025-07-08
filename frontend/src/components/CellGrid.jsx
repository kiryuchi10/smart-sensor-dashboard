// src/components/CellGrid.jsx
import React, { useEffect, useState } from 'react';
import BatteryCard from './BatteryCard';
import './CellGrid.css';

const CellGrid = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/battery/cards')
      .then(res => res.json())
      .then(data => setCards(data.cards || []));
  }, []);

  return (
    <div className="cell-grid">
      {cards.map((cell, idx) => (
        <BatteryCard key={idx} id={cell.id} voltage={cell.voltage} soc={cell.soc} />
      ))}
    </div>
  );
};

export default CellGrid;
