// frontend/src/components/BatteryModule.jsx
import React from 'react';

const BatteryModule = ({ batteryId, data, temperatureData }) => {
  // Calculate derived values
  const voltage = data?.avg_voltage || 47.0;
  const soc = data?.avg_soc || 66.7;
  const temperature = data?.avg_temperature || 18.5;
  const imbalance = 13.12; // Mock data
  const current = 0; // Mock data
  const stringHealth = 100.0;
  const cellAvgVoltage = 3.92;

  // Get latest temperatures for sensor display
  const tempSensors = temperatureData.slice(-6).map((temp, index) => ({
    id: index + 1,
    value: temp.temperature || (27.8 + Math.random() * 2 - 1)
  }));

  return (
    <div className="battery-module">
      {/* Module Header */}
      <div className="module-header">
        <div className="module-id">{batteryId}</div>
        <div className="module-label">MOD_1</div>
      </div>

      {/* Main Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card voltage">
          <div className="metric-label">V</div>
          <div className="metric-value">{voltage}V</div>
        </div>

        <div className="metric-card soc">
          <div className="metric-label">SoC</div>
          <div className="metric-value">{soc}%</div>
        </div>

        <div className="metric-card temperature">
          <div className="metric-label">Temp</div>
          <div className="metric-value-small">
            <div>Min: {temperature}°C</div>
            <div>Max: {(temperature + 2).toFixed(1)}°C</div>
          </div>
        </div>

        <div className="metric-card imbalance">
          <div className="metric-label">Imbalance</div>
          <div className="metric-value">{imbalance}%</div>
        </div>

        <div className="metric-card charge-status">
          <div className="charge-indicator">
            <div className="charge-label">Charge Max</div>
            <div className="charge-value">-35A</div>
            <div className="charge-bar">
              <div className="charge-fill" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>

        <div className="metric-card current">
          <div className="metric-label">Current</div>
          <div className="metric-value">{current}A</div>
          <div className="discharge-info">
            <div className="discharge-label">Discharge Max</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="secondary-metrics">
        <div className="back-button">Back</div>
        <div className="alarm-screen-button">Alarm Screen</div>
        
        <div className="secondary-metric">
          <div className="metric-small-label">SoH</div>
          <div className="metric-small-label">STRING</div>
          <div className="metric-value-small">{stringHealth}%</div>
        </div>

        <div className="secondary-metric">
          <div className="metric-small-label">V</div>
          <div className="metric-small-value">
            <div>Min: 3.90V</div>
            <div>Max: 3.99V</div>
          </div>
          <div className="metric-small-label">CELL AVG</div>
          <div className="metric-value-small">{cellAvgVoltage}V</div>
        </div>

        {/* Temperature Sensors */}
        <div className="temperature-sensors">
          <div className="temp-sensors-label">Module Temperature Sensors</div>
          <div className="temp-sensors-grid">
            {tempSensors.map((sensor) => (
              <div key={sensor.id} className="temp-sensor">
                <span className="temp-value">{sensor.value.toFixed(1)}°C</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryModule;