// frontend/src/components/SocChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './SocChart.css';

const SocChart = ({ data, width = 400, height = 200 }) => {
  const chartData = data.map((cell) => ({
    name: cell.id,
    soc: cell.soc,
  }));

  return (
    <div className="soc-chart-container">
      <h4 className="chart-title">State of Charge</h4>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="soc" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SocChart;