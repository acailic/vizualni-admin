/**
 * Simple Line Chart component using D3
 * Optimized for data.gov.rs demo visualizations
 */

import { Box } from '@mui/material';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeLinear } from 'd3-ease';
import { scaleLinear, scalePoint } from 'd3-scale';
import * as d3 from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';
import { useEffect, useRef } from 'react';

export interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  color?: string;
  xLabel?: string;
  yLabel?: string;
}

export const LineChart = ({
  data,
  xKey,
  yKey,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 60, left: 80 },
  color = '#4caf50',
  xLabel = '',
  yLabel = ''
}: LineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create chart group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract values
    const xValues = data.map(d => String(d[xKey]));
    const yValues = data.map(d => Number(d[yKey]) || 0);

    // Create scales
    const xScale = scalePoint()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.5);

    const yMin = min(yValues) || 0;
    const yMax = max(yValues) || 0;
    const yScale = scaleLinear()
      .domain([Math.min(0, yMin), yMax])
      .range([innerHeight, 0])
      .nice();

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '11px');

    // Add Y axis
    g.append('g')
      .call(axisLeft(yScale))
      .style('font-size', '11px');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
      .style('stroke', '#e0e0e0')
      .style('stroke-opacity', 0.5);

    // Create line generator
    const lineGenerator = line<any>()
      .x((d) => xScale(String(d[xKey])) || 0)
      .y((d) => yScale(Number(d[yKey]) || 0))
      .curve(curveMonotoneX);

    // Add the line path
    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2.5)
      .attr('d', lineGenerator);

    // Animate the line
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add dots
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(String(d[xKey])) || 0)
      .attr('cy', (d) => yScale(Number(d[yKey]) || 0))
      .attr('r', 0)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 7);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attr('r', 4);

    // Add X axis label
    if (xLabel) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + margin.bottom - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text(xLabel);
    }

    // Add Y axis label
    if (yLabel) {
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left + 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text(yLabel);
    }

  }, [data, xKey, yKey, width, height, margin, color, xLabel, yLabel]);

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};
