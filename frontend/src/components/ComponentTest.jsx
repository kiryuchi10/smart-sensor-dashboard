// Component test to verify enhanced components work
import React from 'react';
import EnhancedCellGrid from './EnhancedCellGrid';
import BatteryModule from './BatteryModule';

const ComponentTest = () => {
  // Mock data for testing
  const mockBatteryData = {
    avg_voltage: 47.0,
    avg_soc: 66.7,
    avg_temperature: 18.5
  };

  const mockTempData = [
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
    <div style={{ 
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)', 
      minHeight: '100vh', 
      padding: '20px',
      color: 'white'
    }}>
      <h1>Enhanced BMS Components Test</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Battery Module</h2>
        <BatteryModule 
          batteryId="M1"
          data={mockBatteryData}
          temperatureData={mockTempData}
        />
      </div>

      <div>
        <h2>Enhanced Cell Grid</h2>
        <EnhancedCellGrid />
      </div>
    </div>
  );
};

export default ComponentTest;