// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import BatteryModule from './BatteryModule';
import CellGrid from './CellGrid';
import TempChart from './TempChart';
import SocChart from './SocChart';
import AlarmStatus from './AlarmStatus';
import TemperatureBar from './TemperatureBar';
import TimestampBar from './TimestampBar';
import LeftPanelButtons from './LeftPanelButtons';

const Dashboard = () => {
  const [batteryData, setBatteryData] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [systemOverview, setSystemOverview] = useState(null);
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [selectedBattery, setSelectedBattery] = useState('M1');
  const [currentView, setCurrentView] = useState('dashboard');

  // API base URL
  const API_BASE = 'http://localhost:5000/api';

  // Fetch battery cell data
  const fetchBatteryData = async () => {
    try {
      const response = await fetch(`${API_BASE}/battery/cells`);
      const data = await response.json();
      setBatteryData(data);
    } catch (error) {
      console.error('Error fetching battery data:', error);
    }
  };

  // Fetch temperature data for charts
  const fetchTemperatureData = async () => {
    try {
      const response = await fetch(`${API_BASE}/battery/temperature?limit=20`);
      const data = await response.json();
      setTemperatureData(data.temperature_data || []);
    } catch (error) {
      console.error('Error fetching temperature data:', error);
    }
  };

  // Fetch system overview
  const fetchSystemOverview = async () => {
    try {
      const response = await fetch(`${API_BASE}/battery/overview`);
      const data = await response.json();
      setSystemOverview(data);
    } catch (error) {
      console.error('Error fetching system overview:', error);
    }
  };

  // Fetch active alarms
  const fetchActiveAlarms = async () => {
    try {
      const response = await fetch(`${API_BASE}/battery/alarms`);
      const data = await response.json();
      setActiveAlarms(data.alarms || []);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    }
  };

  // Update data every 5 seconds
  useEffect(() => {
    const fetchAllData = () => {
      fetchBatteryData();
      fetchTemperatureData();
      fetchSystemOverview();
      fetchActiveAlarms();
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Left Panel */}
      <div className="left-panel">
        <LeftPanelButtons 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>

      {/* Main Dashboard */}
      <div className="main-dashboard">
        {/* Top Section */}
        <div className="top-section">
          {/* Battery Module Info */}
          <BatteryModule 
            batteryId={selectedBattery}
            data={systemOverview}
            temperatureData={temperatureData}
          />

          {/* Right Side Charts and Info */}
          <div className="right-info-panel">
            <AlarmStatus alarms={activeAlarms} />
            <TemperatureBar 
              temperatureData={temperatureData}
              minTemp={13.5}
              maxTemp={27.8}
            />
          </div>
        </div>

        {/* Cell Grid */}
      <div className="cell-grid-section">
        <CellGrid />
      </div>


        {/* Bottom Charts */}
        <div className="charts-section">
          <div className="chart-container">
            <TempChart 
              data={temperatureData}
              width={400}
              height={200}
            />
          </div>
          <div className="chart-container">
            <SocChart 
              data={batteryData?.cells || []}
              width={400}
              height={200}
            />
          </div>
        </div>

        {/* Timestamp Bar */}
        <TimestampBar timestamp={batteryData?.timestamp} />
      </div>
    </div>
  );
};

export default Dashboard;