// frontend/src/components/SocChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SocChart = ({ data, width = 400, height = 200 }) => {
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
      id: d.id,
      soc: d.soc,
      index: i
    }));

    // Scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.id))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([chartHeight, 0]);

    // Color scale
    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 100]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', 'white');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('fill', 'white');

    // Add bars
    g.selectAll('.bar')
      .data(chartData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.id))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.soc))
      .attr('height', d => chartHeight - yScale(d.soc))
      .attr('fill', d => colorScale(d.soc))
      .attr('stroke', '#333')
      .attr('stroke-width', 1);

    // Add value labels
    g.selectAll('.label')
      .data(chartData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.id) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.soc) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text(d => `${d.soc.toFixed(1)}%`);

  }, [data, width, height]);

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">State of Charge</h3>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default SocChart;