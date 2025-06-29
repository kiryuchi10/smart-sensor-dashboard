import React, { useEffect, useState } from 'react';
import BatteryModule from './BatteryModule';
import './BatteryModuleGroup.css';

const BatteryModuleGroup = () => {
  const [batteryTables, setBatteryTables] = useState([]);
  const [batteryData, setBatteryData] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/battery/tables')
      .then(res => res.json())
      .then(data => setBatteryTables(data.tables || []));
  }, []);

  useEffect(() => {
    batteryTables.forEach(table => {
      fetch(`http://localhost:5000/api/battery/cells?table=${table}`)
        .then(res => res.json())
        .then(data => {
          setBatteryData(prev => ({ ...prev, [table]: data.cells || [] }));
        });
    });
  }, [batteryTables]);

  return (
    <div className="battery-module-group">
      {batteryTables.map(table => (
        <BatteryModule
          key={table}
          batteryId={table}
          data={batteryData[table]}
        />
      ))}
    </div>
  );
};

export default BatteryModuleGroup;
