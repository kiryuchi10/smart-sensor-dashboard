import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function TempChart({ temps }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!temps || temps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 150;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    svg.attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);

    const chartArea = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, temps.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(temps) - 2, d3.max(temps) + 2])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX); // smooth line

    // Line path
    chartArea.append("path")
      .datum(temps)
      .attr("fill", "none")
      .attr("stroke", "#facc15") // Tailwind yellow-400
      .attr("stroke-width", 2)
      .attr("d", line);

    // Axes
    chartArea.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(temps.length));

    chartArea.append("g")
      .call(d3.axisLeft(y));
  }, [temps]);

  return <svg ref={svgRef} className="w-full h-48" />;
}
