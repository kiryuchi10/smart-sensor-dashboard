// frontend/src/components/BatteryModuleGroup.jsx
import React, { useEffect, useState } from 'react';
import BatteryModule from './BatteryModule';
import './BatteryModuleGroup.css';

const BatteryModuleGroup = () => {
  const [batteryTables, setBatteryTables] = useState([]);
  const [batteryData, setBatteryData] = useState({});

  // Step 1: Fetch all battery tables
  useEffect(() => {
    fetch('http://localhost:5000/api/battery/tables')
      .then(res => res.json())
      .then(data => {
        if (data.tables) {
          setBatteryTables(data.tables);
        }
      })
      .catch(err => console.error('Error fetching tables:', err));
  }, []);

  // Step 2: For each table, fetch corresponding data
  useEffect(() => {
    batteryTables.forEach(table => {
      fetch(`http://localhost:5000/api/battery/data/${table}`)
        .then(res => res.json())
        .then(data => {
          if (data.cells) {
            setBatteryData(prev => ({ ...prev, [table]: data.cells[0] }));
          }
        })
        .catch(err => console.error(`Error fetching data for ${table}:`, err));
    });
  }, [batteryTables]);

  return (
    <div className="battery-module-group">
      {batteryTables.map(table => (
        <BatteryModule
          key={table}
          batteryId={table}
          data={batteryData[table]}
          temperatureData={[]} // optional for now
        />
      ))}
    </div>
  );
};

export default BatteryModuleGroup;
