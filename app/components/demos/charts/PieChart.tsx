/**
 * Pie Chart component using D3
 * Optimized for data.gov.rs demo visualizations
 */

import { useEffect, useRef } from 'react';
import { sum } from 'd3-array';
import { format } from 'd3-format';
import { interpolate } from 'd3-interpolate';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import * as d3 from 'd3-selection';
import { arc, pie } from 'd3-shape';
import { Box } from '@mui/material'; 
 

export interface PieChartProps {
  data: Array<Record<string, any>>;
  labelKey: string;
  valueKey: string;
  width?: number;
  height?: number;
  colors?: string[];
  showPercentages?: boolean;
}

export const PieChart = ({
  data,
  labelKey,
  valueKey,
  width = 500,
  height = 500,
  colors = schemeCategory10,
  showPercentages = true
}: PieChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const radius = Math.min(width, height) / 2 - 40;

    // Create chart group centered
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Color scale
    const colorScale = scaleOrdinal<string>()
      .domain(data.map(d => String(d[labelKey])))
      .range(colors);

    // Create pie layout
    const pieGenerator = pie<any>()
      .value(d => Number(d[valueKey]) || 0)
      .sort(null);

    // Create arc generator
    const arcGenerator = arc<any>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create arc for labels (slightly outside)
    const labelArc = arc<any>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    // Bind data and create slices
    const slices = g
      .selectAll('path')
      .data(pieGenerator(data))
      .enter()
      .append('path')
      .attr('fill', d => colorScale(String(d.data[labelKey])))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1.05)');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.9)
          .attr('transform', 'scale(1)');
      });

    // Animate slices
    slices
      .transition()
      .duration(1000)
      .attrTween('d', function(d: any) {
        const interp = interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t: number) {
          return arcGenerator(interp(t)) || '';
        };
      });

    // Calculate total for percentages
    const total = sum(data, d => Number(d[valueKey]) || 0);

    // Add labels
    const labels = g
      .selectAll('text')
      .data(pieGenerator(data))
      .enter()
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#333')
      .style('opacity', 0);

    // Show percentages or values
    labels
      .append('tspan')
      .attr('x', 0)
      .attr('dy', '-0.2em')
      .text(d => {
        const percentage = ((Number(d.data[valueKey]) || 0) / total) * 100;
        return showPercentages
          ? `${percentage.toFixed(1)}%`
          : format(',.0f')(Number(d.data[valueKey]) || 0);
      });

    // Animate labels
    labels
      .transition()
      .delay(1000)
      .duration(400)
      .style('opacity', 1);

    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 120}, 20)`);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorScale(String(d[labelKey])))
      .attr('opacity', 0.9);

    legendItems
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => {
        const label = String(d[labelKey]);
        return label.length > 15 ? label.substring(0, 12) + '...' : label;
      });

  }, [data, labelKey, valueKey, width, height, colors, showPercentages]);

  return (
    <Box sx={{ width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};
