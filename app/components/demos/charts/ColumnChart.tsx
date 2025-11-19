/**
 * Column Chart (Vertical Bars) component using D3
 * Optimized for data.gov.rs demo visualizations
 */

import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
import { format } from 'd3-format';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3-selection';
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

export interface ColumnChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  xLabel?: string;
  yLabel?: string;
}

export const ColumnChart = ({
  data,
  xKey,
  yKey,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 60, left: 80 },
  colors = ['#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7'],
  xLabel = '',
  yLabel = ''
}: ColumnChartProps) => {
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
    const xScale = scaleBand()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = scaleLinear()
      .domain([0, max(yValues) || 0])
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
      .style('stroke-opacity', 0.3);

    // Add columns with animation
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(String(d[xKey])) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('opacity', 0.85)
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.85);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('y', (d) => yScale(Number(d[yKey]) || 0))
      .attr('height', (d) => innerHeight - yScale(Number(d[yKey]) || 0));

    // Add value labels on columns
    g.selectAll('.column-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'column-label')
      .attr('x', (d) => (xScale(String(d[xKey])) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(Number(d[yKey]) || 0) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', '#333')
      .text((d) => {
        const value = Number(d[yKey]);
        return value > 0 ? format(',.0f')(value) : '';
      })
      .style('opacity', 0)
      .transition()
      .delay((d, i) => 800 + i * 50)
      .duration(400)
      .style('opacity', 1);

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

  }, [data, xKey, yKey, width, height, margin, colors, xLabel, yLabel]);

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
