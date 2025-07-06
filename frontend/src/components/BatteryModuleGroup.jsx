import React, { useEffect, useState } from 'react';
import BatteryModule from './BatteryModule';
import './BatteryModuleGroup.css';

const BatteryModuleGroup = () => {
  const [batteryTables, setBatteryTables] = useState([]);
  const [batteryData, setBatteryData] = useState({});

  // --- Step 1: Try to fetch backend tables ---
  useEffect(() => {
    fetch('http://localhost:5000/api/battery/tables')
      .then(res => res.json())
      .then(data => {
        if (data.tables) {
          setBatteryTables(data.tables);
        } else {
          // fallback mock if backend fails
          console.warn("No tables found, using fallback.");
          setBatteryTables(["battery_mock1", "battery_mock2"]);
        }
      })
      .catch(err => {
        console.error('Error fetching tables:', err);
        // fallback for offline dev
        setBatteryTables(["battery_mock1", "battery_mock2"]);
      });
  }, []);

  // --- Step 2: Try to fetch each table’s battery data ---
  useEffect(() => {
    batteryTables.forEach(table => {
      fetch(`http://localhost:5000/api/battery/data/${table}`)
        .then(res => res.json())
        .then(data => {
          if (data.cells) {
            setBatteryData(prev => ({ ...prev, [table]: data.cells[0] }));
          } else {
            // fallback mock battery data
            setBatteryData(prev => ({
              ...prev,
              [table]: {
                avg_voltage: 48.2,
                avg_soc: 65.5,
                avg_temperature: 19.3,
              }
            }));
          }
        })
        .catch(err => {
          console.error(`Failed to fetch data for ${table}:`, err);
          setBatteryData(prev => ({
            ...prev,
            [table]: {
              avg_voltage: 47.8,
              avg_soc: 72.1,
              avg_temperature: 20.2,
            }
          }));
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
          temperatureData={[]}  // optional or add mock sensors
        />
      ))}
    </div>
  );
};

export default BatteryModuleGroup;
