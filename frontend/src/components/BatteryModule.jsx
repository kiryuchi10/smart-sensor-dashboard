import React from 'react';
import './BatteryModule.css'; // Make sure this is styled correctly

const BatteryModule = ({ batteryId, data, temperatureData, onBackClick, onAlarmClick }) => {
  const voltage = data?.avg_voltage || 47.0;
  const soc = data?.avg_soc || 66.7;
  const temperature = data?.avg_temperature || 18.5;
  const imbalance = 13.12;
  const current = 0;
  const stringHealth = 100.0;
  const cellAvgVoltage = 3.92;
  const alarmStatus = 'Fault'; // This should come from your alarm system

  const tempSensors = temperatureData?.slice(-8) || [
    { id: 1, value: 27.8, status: 'warning' }, 
    { id: 2, value: 26.6, status: 'normal' },
    { id: 3, value: 26.1, status: 'normal' }, 
    { id: 4, value: 26.9, status: 'normal' },
    { id: 5, value: 27.4, status: 'normal' }, 
    { id: 6, value: 26.7, status: 'normal' },
    { id: 7, value: 25.9, status: 'normal' },
    { id: 8, value: 18.5, status: 'low' }
  ];

  return (
    <div className="battery-module">
      {/* === TOP HEADER SECTION === */}
      <div className="module-top">
        <span className="battery-id">{batteryId}</span>
        <span className="mod-label">MOD_1</span>
      </div>

      {/* === METRIC BLOCKS ROW === */}
      <div className="metric-row">
        <div className="metric-box">
          <div className="label">V</div>
          <div className="value">{voltage.toFixed(1)}V</div>
        </div>
        <div className="metric-box">
          <div className="label">SoC</div>
          <div className="value">{soc.toFixed(1)}%</div>
        </div>
        <div className="metric-box">
          <div className="label">Temp</div>
          <div className="value-small">
            Min: {temperature}°C<br />
            Max: {(temperature + 2).toFixed(1)}°C
          </div>
        </div>
        <div className="metric-box">
          <div className="label">Imbalance</div>
          <div className="value">{imbalance}%</div>
        </div>
        <div className="metric-box">
          <div className="label">Charge Max</div>
          <div className="value">-35A</div>
        </div>
        <div className="metric-box">
          <div className="label">Current</div>
          <div className="value">{current}A</div>
          <div className="sub-label">Discharge Max</div>
        </div>
        <div className="metric-box">
          <div className="label">Discharge Max</div>
          <div className="value">500A</div>
        </div>
        <div className="alarm-status-box">
          <div className="alarm-label">Alarm status</div>
          <div className={`alarm-value ${alarmStatus.toLowerCase()}`}>{alarmStatus}</div>
        </div>
      </div>

      {/* === SECONDARY BUTTONS AND STATUS === */}
      <div className="bottom-section">
        <div className="small-buttons">
          <button onClick={() => onBackClick?.(batteryId)}>Back</button>
          <button onClick={() => onAlarmClick?.(batteryId)}>Alarm Screen</button>
        </div>
        <div className="soh-box">
          <div className="label">SoH</div>
          <div className="sub-label">STRING</div>
          <div className="value">{stringHealth}%</div>
        </div>
        <div className="voltage-box">
          <div className="label">V</div>
          <div className="value-small">
            Min: 3.90V<br />
            Max: 3.99V
          </div>
          <div className="sub-label">CELL AVG</div>
          <div className="value">{cellAvgVoltage}V</div>
        </div>
        <div className="temperature-bar">
          <div className="temp-sensor-label">Module Temperature Sensors</div>
          <div className="temps">
            {tempSensors.map(sensor => (
              <div className="temp-box" key={sensor.id}>
                {sensor.value.toFixed(1)}°C
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryModule;
