// frontend/src/components/TempChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './TempChart.css';

const TempChart = ({ data, width = 400, height = 200 }) => {
  const chartData = data.map((entry, idx) => ({
    index: idx,
    temperature: entry.temperature,
  }));

  return (
    <div className="temp-chart-container">
      <h4 className="chart-title">Temperature Trend</h4>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="index" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TempChart;