// frontend/src/components/TempChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TempChart = ({ data, width = 400, height = 200 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data
    const chartData = data.map((d, i) => ({
      index: i,
      temperature: d.temperature || 25,
      time: d.time || i
    }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, chartData.length - 1])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.temperature))
      .nice()
      .range([chartHeight, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.index))
      .y(d => yScale(d.temperature))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('x', chartWidth / 2)
      .attr('y', 35)
      .attr('fill', 'white')
      .style('text-anchor', 'middle')
      .text('Time');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -chartHeight / 2)
      .attr('fill', 'white')
      .style('text-anchor', 'middle')
      .text('Temperature (°C)');

    // Add line
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(chartData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.index))
      .attr('cy', d => yScale(d.temperature))
      .attr('r', 3)
      .attr('fill', '#00d4ff');

  }, [data, width, height]);

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Temperature Trend</h3>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default TempChart;