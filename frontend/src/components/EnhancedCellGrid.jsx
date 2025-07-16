// src/components/EnhancedCellGrid.jsx
import React, { useEffect, useState } from 'react';
import './EnhancedCellGrid.css';

const EnhancedCellGrid = () => {
  const [cellData, setCellData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate 12 cells with realistic data based on your database structure
  const generateCellData = (apiCells) => {
    const baseCells = [
      { id: 'E1', voltage: 3.90, soc: 66.7, status: 'normal' },
      { id: 'E2', voltage: 3.91, soc: 67.9, status: 'normal' },
      { id: 'E3', voltage: 3.91, soc: 67.9, status: 'normal' },
      { id: 'E4', voltage: 3.92, soc: 69.0, status: 'normal' },
      { id: 'E5', voltage: 3.91, soc: 67.7, status: 'normal' },
      { id: 'E6', voltage: 3.91, soc: 67.3, status: 'normal' },
      { id: 'E7', voltage: 3.91, soc: 68.1, status: 'normal' },
      { id: 'E8', voltage: 3.91, soc: 67.7, status: 'normal' },
      { id: 'E9', voltage: 3.91, soc: 68.0, status: 'normal' },
      { id: 'E10', voltage: 3.91, soc: 67.1, status: 'normal' },
      { id: 'E11', voltage: 3.93, soc: 70.0, status: 'normal' },
      { id: 'E12', voltage: 3.99, soc: 79.8, status: 'warning' }
    ];

    // If we have API data, use it first, then fill remaining with defaults
    if (apiCells && apiCells.length > 0) {
      // Use API data for available cells
      apiCells.forEach((cell, index) => {
        if (index < baseCells.length) {
          baseCells[index] = {
            id: cell.id,
            voltage: cell.voltage,
            soc: cell.soc,
            status: cell.status,
            temperature: cell.temperature
          };
        }
      });
    }

    return baseCells;
  };

  const fetchCellData = async () => {
    try {
      setLoading(true);
      
      // Use the new enhanced-cells endpoint
      const response = await fetch('http://localhost:5000/api/battery/enhanced-cells');
      
      if (response.ok) {
        const data = await response.json();
        if (data.cells && data.cells.length > 0) {
          // Map API data to our cell format
          const apiCells = data.cells.map(cell => ({
            id: cell.cell_id,
            voltage: cell.voltage,
            soc: cell.soc,
            temperature: cell.temperature,
            status: getStatusFromData(cell.voltage, cell.soc)
          }));
          
          // Fill remaining cells with defaults if we have less than 12
          const enhancedCells = generateCellData(apiCells);
          setCellData(enhancedCells);
        } else {
          // Fallback to default data
          setCellData(generateCellData([]));
        }
      } else {
        console.warn('Enhanced cells API failed, using default data');
        setCellData(generateCellData([]));
      }
    } catch (error) {
      console.error('Error fetching cell data:', error);
      // Use default data if API fails
      setCellData(generateCellData([]));
    } finally {
      setLoading(false);
    }
  };

  const getStatusFromData = (voltage, soc) => {
    if (voltage > 3.95 || soc > 75) {
      return 'warning';
    } else if (voltage < 3.85 || soc < 60) {
      return 'low';
    } else {
      return 'normal';
    }
  };

  useEffect(() => {
    fetchCellData();
    // Update every 5 seconds for real-time data
    const interval = setInterval(fetchCellData, 5000);
    return () => clearInterval(interval);
  }, [fetchCellData]);

  const getCellClassName = (status) => {
    switch (status) {
      case 'warning':
        return 'cell-card warning';
      case 'low':
        return 'cell-card low';
      default:
        return 'cell-card normal';
    }
  };

  if (loading) {
    return (
      <div className="enhanced-cell-grid">
        <div className="loading">Loading cell data...</div>
      </div>
    );
  }

  return (
    <div className="enhanced-cell-grid">
      {cellData.map((cell) => (
        <div key={cell.id} className={getCellClassName(cell.status)}>
          <div className="cell-id">{cell.id}</div>
          <div className="cell-voltage">{cell.voltage.toFixed(2)}V</div>
          <div className="cell-soc">SoC {cell.soc.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedCellGrid;