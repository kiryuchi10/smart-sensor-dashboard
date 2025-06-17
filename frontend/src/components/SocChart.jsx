import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function SocChart({ socData }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!socData || socData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = 300;
    const height = 150;
    const margin = { top: 10, right: 10, bottom: 30, left: 30 };

    svg.attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);

    const chartArea = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(socData.map(d => d.id))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Axis
    chartArea.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chartArea.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Bars
    chartArea.selectAll("rect")
      .data(socData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.id))
      .attr("y", d => y(d.soc))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.soc))
      .attr("fill", d => d.soc > 70 ? "#4ade80" : "#f87171"); // green or red
  }, [socData]);

  return <svg ref={svgRef} className="w-full h-48" />;
}
