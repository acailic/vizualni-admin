/**
 * Population Trends Chart component using D3
 * Shows historical data and future projections
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, area, curveMonotoneX } from 'd3-shape';
import { extent, max, min } from 'd3-array';
import { Box, useTheme } from '@mui/material';

export interface TrendDataPoint {
  year: number;
  total: number;
  type: 'historical' | 'projection';
}

export interface PopulationTrendsProps {
  data: TrendDataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  historicalColor?: string;
  projectionColor?: string;
  title?: string;
}

export const PopulationTrends = ({
  data,
  width = 900,
  height = 500,
  margin = { top: 50, right: 80, bottom: 70, left: 80 },
  historicalColor = '#2196f3',
  projectionColor = '#ff9800',
  title = 'Population Trends'
}: PopulationTrendsProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

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

    // Split data into historical and projection
    const historicalData = data.filter(d => d.type === 'historical');
    const projectionData = data.filter(d => d.type === 'projection');

    // Add the last historical point to projection for continuity
    if (historicalData.length > 0 && projectionData.length > 0) {
      projectionData.unshift(historicalData[historicalData.length - 1]);
    }

    // Create scales
    const xScale = scaleLinear()
      .domain(extent(data, d => d.year) as [number, number])
      .range([0, innerWidth])
      .nice();

    const yExtent = extent(data, d => d.total) as [number, number];
    const yScale = scaleLinear()
      .domain([yExtent[0] * 0.95, yExtent[1] * 1.05]) // Add padding
      .range([innerHeight, 0])
      .nice();

    // Create line generators
    const lineGenerator = line<TrendDataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.total))
      .curve(curveMonotoneX);

    // Create area generator for shading
    const areaGenerator = area<TrendDataPoint>()
      .x(d => xScale(d.year))
      .y0(innerHeight)
      .y1(d => yScale(d.total))
      .curve(curveMonotoneX);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(8))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', theme.palette.divider || '#e0e0e0')
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.5);

    // Add historical area with gradient
    const historicalGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'historical-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    historicalGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', historicalColor)
      .attr('stop-opacity', 0.3);

    historicalGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', historicalColor)
      .attr('stop-opacity', 0.05);

    g.append('path')
      .datum(historicalData)
      .attr('fill', 'url(#historical-gradient)')
      .attr('d', areaGenerator);

    // Add projection area with gradient
    const projectionGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'projection-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    projectionGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', projectionColor)
      .attr('stop-opacity', 0.2);

    projectionGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', projectionColor)
      .attr('stop-opacity', 0.05);

    g.append('path')
      .datum(projectionData)
      .attr('fill', 'url(#projection-gradient)')
      .attr('d', areaGenerator);

    // Add historical line
    const historicalPath = g.append('path')
      .datum(historicalData)
      .attr('fill', 'none')
      .attr('stroke', historicalColor)
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);

    // Animate historical line
    const historicalLength = (historicalPath.node() as SVGPathElement).getTotalLength();
    historicalPath
      .attr('stroke-dasharray', `${historicalLength} ${historicalLength}`)
      .attr('stroke-dashoffset', historicalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add projection line (dashed)
    const projectionPath = g.append('path')
      .datum(projectionData)
      .attr('fill', 'none')
      .attr('stroke', projectionColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '8,4')
      .attr('d', lineGenerator);

    // Animate projection line
    const projectionLength = (projectionPath.node() as SVGPathElement).getTotalLength();
    projectionPath
      .attr('stroke-dashoffset', projectionLength)
      .transition()
      .delay(1500)
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(xScale)
        .ticks(15)
        .tickFormat(d => d.toString()))
      .style('font-size', '11px')
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    g.append('g')
      .call(axisLeft(yScale).ticks(8))
      .style('font-size', '11px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('fill', theme.palette.text.primary)
      .text(title);

    // Add X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', theme.palette.text.secondary)
      .text('Година / Year');

    // Add Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', theme.palette.text.secondary)
      .text('Становништво (милиони) / Population (millions)');

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 180}, 10)`);

    // Historical legend item
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 30)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', historicalColor)
      .attr('stroke-width', 3);

    legend.append('text')
      .attr('x', 40)
      .attr('y', 5)
      .style('font-size', '12px')
      .style('fill', theme.palette.text.primary)
      .text('Историјски / Historical');

    // Projection legend item
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 30)
      .attr('y1', 25)
      .attr('y2', 25)
      .attr('stroke', projectionColor)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '8,4');

    legend.append('text')
      .attr('x', 40)
      .attr('y', 30)
      .style('font-size', '12px')
      .style('fill', theme.palette.text.primary)
      .text('Пројекција / Projection');

    // Add hover interaction
    const focus = g.append('g')
      .style('display', 'none');

    focus.append('circle')
      .attr('r', 5)
      .attr('fill', historicalColor)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    focus.append('rect')
      .attr('class', 'tooltip-bg')
      .attr('width', 140)
      .attr('height', 50)
      .attr('x', 10)
      .attr('y', -25)
      .attr('rx', 5)
      .attr('fill', 'white')
      .attr('stroke', historicalColor)
      .attr('stroke-width', 2)
      .attr('opacity', 0.95);

    const focusText = focus.append('text')
      .attr('x', 18)
      .attr('y', -5)
      .style('font-size', '12px')
      .style('font-weight', '600');

    focusText.append('tspan')
      .attr('class', 'tooltip-year')
      .attr('x', 18)
      .attr('dy', 0);

    focusText.append('tspan')
      .attr('class', 'tooltip-value')
      .attr('x', 18)
      .attr('dy', '1.2em');

    const overlay = g.append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const year = Math.round(xScale.invert(mouseX));
        const dataPoint = data.find(d => d.year === year);

        if (dataPoint) {
          const x = xScale(dataPoint.year);
          const y = yScale(dataPoint.total);

          focus.attr('transform', `translate(${x},${y})`);
          focus.select('circle')
            .attr('fill', dataPoint.type === 'historical' ? historicalColor : projectionColor);
          focus.select('.tooltip-bg')
            .attr('stroke', dataPoint.type === 'historical' ? historicalColor : projectionColor);
          focus.select('.tooltip-year')
            .text(`${dataPoint.year}`);
          focus.select('.tooltip-value')
            .text(`${dataPoint.total.toFixed(2)}M`);
        }
      });

    // Add vertical line at current year (2024)
    const currentYear = 2024;
    if (currentYear >= (extent(data, d => d.year)[0] || 0) &&
        currentYear <= (extent(data, d => d.year)[1] || 0)) {
      g.append('line')
        .attr('x1', xScale(currentYear))
        .attr('x2', xScale(currentYear))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0.5);

      g.append('text')
        .attr('x', xScale(currentYear))
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#666')
        .text('Данас / Today');
    }

  }, [data, width, height, margin, historicalColor, projectionColor, title, theme]);

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
