import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataVizProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

const DataViz: React.FC<DataVizProps> = ({ data, color = 'currentColor', height = 40, width = 120 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 2, right: 2, bottom: 2, left: 2 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveStepAfter);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(3).tickSize(-innerWidth).tickFormat(() => ''))
      .attr('stroke-dasharray', '2,2')
      .style('stroke-opacity', 0.2);

    // Area
    const area = d3.area<number>()
        .x((_, i) => x(i))
        .y0(innerHeight)
        .y1(d => y(d))
        .curve(d3.curveStepAfter);
        
    g.append('path')
        .datum(data)
        .attr('fill', color)
        .attr('fill-opacity', 0.2)
        .attr('d', area);

    // Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Dots
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => x(i))
      .attr('cy', d => y(d))
      .attr('r', 1.5)
      .attr('fill', color);

  }, [data, color, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
  );
};

export default DataViz;