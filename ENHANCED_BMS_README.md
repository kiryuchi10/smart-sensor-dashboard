# Enhanced Battery Management System Dashboard

## Overview
This enhanced BMS dashboard provides a modern, colorful UI that matches your target design with real-time data integration from your MySQL database.

## Key Features

### 🎨 Enhanced UI Components
- **Colorful Cell Grid**: 12 individual battery cells (E1-E12) with color-coded status
  - Green: Normal operation
  - Red: Warning/Fault (with pulsing animation)
  - Blue: Low voltage/SoC
- **Modern Battery Module Display**: Enhanced with gradients and better styling
- **Real-time Temperature Sensors**: Color-coded temperature readings
- **Alarm Status Integration**: Visual fault indicators

### 🔄 Real-time Data Integration
- Updates every 5 seconds
- Uses timestamp-based data from your MySQL tables
- Supports multiple battery tables (battery_b0005, battery_b0006, battery_b0007)

## New API Endpoints

### `/api/battery/enhanced-cells`
Returns structured cell data for the enhanced UI:
```json
{
  "cells": [
    {
      "cell_id": "E1",
      "battery_id": "B0005",
      "voltage": 4.213,
      "soc": 0.0,
      "temperature": 23.4,
      "cycle": 615,
      "timestamp": "2025-07-16T23:35:36.448437"
    }
  ],
  "total_cells": 12,
  "timestamp": "2025-07-16T23:35:36.448437"
}
```

## How to Run

### 1. Start the Backend
```bash
cd smart-sensor-dashboard/backend
python app.py
```

### 2. Test the Backend APIs
```bash
cd smart-sensor-dashboard/backend
python test_backend.py
```

### 3. Start the Frontend
```bash
cd smart-sensor-dashboard/frontend
npm start
```

The dashboard will be available at `http://localhost:3000`

## New Components

### EnhancedCellGrid.jsx
- Displays 12 battery cells in a 6x2 grid
- Color-coded based on voltage and SoC thresholds
- Real-time updates every 5 seconds
- Hover effects and animations

### Enhanced BatteryModule
- Modern gradient styling
- Alarm status integration
- Color-coded temperature sensors
- Improved button styling

## Data Flow

1. **Database** → MySQL tables (battery_b0005, battery_b0006, battery_b0007)
2. **Backend API** → Flask endpoints process and serve data
3. **Frontend** → React components fetch and display real-time data
4. **UI Updates** → Automatic refresh every 5 seconds

## Customization

### Voltage/SoC Thresholds
Edit `EnhancedCellGrid.jsx` to adjust warning thresholds:
```javascript
const getStatusFromData = (voltage, soc) => {
  if (voltage > 3.95 || soc > 75) {
    return 'warning';  // Red
  } else if (voltage < 3.85 || soc < 60) {
    return 'low';      // Blue
  } else {
    return 'normal';   // Green
  }
};
```

### Temperature Sensor Colors
Edit `BatteryModule.jsx` to adjust temperature thresholds:
```javascript
const tempSensors = [
  { id: 1, value: 27.8, status: 'warning' }, // Red > 27°C
  { id: 2, value: 26.6, status: 'normal' },  // Green 20-27°C
  { id: 8, value: 18.5, status: 'low' }      // Blue < 20°C
];
```

## Troubleshooting

### Backend Issues
- Ensure MySQL is running and accessible
- Check database connection in `.env` file
- Verify table names match your database

### Frontend Issues
- Run `npm install` if dependencies are missing
- Check console for API connection errors
- Ensure backend is running on port 5000

### API Testing
Use the test script to verify all endpoints:
```bash
python test_backend.py
```

## Next Steps

1. **Real-time Alarms**: Integrate with your alarm system
2. **Historical Data**: Add time-series charts
3. **Cell Balancing**: Add balancing status indicators
4. **Export Features**: Add data export functionality
5. **Mobile Responsive**: Optimize for mobile devices

The enhanced dashboard now provides a professional, modern interface that matches your target design while maintaining real-time data integration with your existing MySQL database structure.