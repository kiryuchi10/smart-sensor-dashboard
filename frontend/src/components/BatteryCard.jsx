// src/components/BatteryCard.jsx
import React from 'react';
import './BatteryCard.css';

const BatteryCard = ({ id, voltage, soc }) => {
  const isFault = voltage < 3.7 || soc < 70;

  return (
    <div className={`battery-card ${isFault ? 'fault' : ''}`}>
      <div className="card-id">E{id}</div>
      <div className="voltage">{voltage}V</div>
      <div className="soc">SoC {soc}%</div>
    </div>
  );
};

export default BatteryCard;
