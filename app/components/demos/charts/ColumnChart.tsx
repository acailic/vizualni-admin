/**
 * Column Chart (Vertical Bars) component using D3
 * Optimized for data.gov.rs demo visualizations
 */

import { Box } from '@mui/material';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3-selection';
import { useEffect, useRef } from 'react';
 
export interface ColumnChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string | string[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
  description?: string;
  multiSeries?: boolean;
  stacked?: boolean;
  showZeroLine?: boolean;
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
  yLabel = '',
  multiSeries = false,
  stacked = false,
  showZeroLine = false
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

    // Determine series keys
    let seriesKeys: string[];
    const allKeys = Object.keys(data[0] || {}).filter(key => key !== xKey);
    const hasMultipleSeries = allKeys.length > 1;

    // Auto-enable multiSeries if stacked is explicitly set or if explicitly enabled
    const isMultiSeries = multiSeries || (stacked !== undefined && hasMultipleSeries);

    if (isMultiSeries) {
      // Auto-detect series keys (all keys except xKey)
      seriesKeys = allKeys;
    } else {
      seriesKeys = [typeof yKey === 'string' ? yKey : yKey[0]];
    }

    // Extract values
    const xValues = data.map(d => String(d[xKey]));

    // Calculate max Y value based on stacked or grouped
    let maxY: number;
    if (stacked && isMultiSeries) {
      // For stacked, sum all series values
      maxY = max(data.map(d =>
        seriesKeys.reduce((sum, key) => sum + (Number(d[key]) || 0), 0)
      )) || 0;
    } else {
      // For grouped or single, use individual max
      const allYValues = data.flatMap(d =>
        seriesKeys.map(key => Number(d[key]) || 0)
      );
      maxY = max(allYValues) || 0;
    }

    // Create scales
    const xScale = scaleBand()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = scaleLinear()
      .domain([0, maxY])
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

    // Add zero line if requested
    if (showZeroLine) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#666')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.6);
    }

    if (isMultiSeries && !stacked) {
      // Grouped bars
      const xSubScale = scaleBand()
        .domain(seriesKeys)
        .range([0, xScale.bandwidth()])
        .padding(0.05);

      seriesKeys.forEach((key, index) => {
        g.selectAll(`.bar-${index}`)
          .data(data)
          .enter()
          .append('rect')
          .attr('class', `bar-${index}`)
          .attr('x', (d) => (xScale(String(d[xKey])) || 0) + (xSubScale(key) || 0))
          .attr('y', innerHeight)
          .attr('width', xSubScale.bandwidth())
          .attr('height', 0)
          .attr('fill', colors[index % colors.length])
          .attr('opacity', 0.85)
          .on('mouseover', function() {
            d3.select(this).attr('opacity', 1);
          })
          .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.85);
          })
          .transition()
          .duration(800)
          .delay((_, i) => i * 50 + index * 20)
          .attr('y', (d) => yScale(Number(d[key]) || 0))
          .attr('height', (d) => innerHeight - yScale(Number(d[key]) || 0));
      });
    } else if (isMultiSeries && stacked) {
      // Stacked bars
      data.forEach((d, i) => {
        let cumulativeY = 0;
        seriesKeys.forEach((key, index) => {
          const value = Number(d[key]) || 0;
          const barHeight = innerHeight - yScale(value);

          g.append('rect')
            .attr('x', xScale(String(d[xKey])) || 0)
            .attr('y', innerHeight)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .attr('fill', colors[index % colors.length])
            .attr('opacity', 0.85)
            .on('mouseover', function() {
              d3.select(this).attr('opacity', 1);
            })
            .on('mouseout', function() {
              d3.select(this).attr('opacity', 0.85);
            })
            .transition()
            .duration(800)
            .delay(i * 50)
            .attr('y', yScale(cumulativeY + value))
            .attr('height', barHeight);

          cumulativeY += value;
        });
      });
    } else {
      // Single series
      const singleKey = seriesKeys[0];
      g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(String(d[xKey])) || 0)
        .attr('y', innerHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', (_, i) => colors[i % colors.length])
        .attr('opacity', 0.85)
        .on('mouseover', function() {
          d3.select(this).attr('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0.85);
        })
        .transition()
        .duration(800)
        .delay((_, i) => i * 50)
        .attr('y', (d) => yScale(Number(d[singleKey]) || 0))
        .attr('height', (d) => innerHeight - yScale(Number(d[singleKey]) || 0));

      // Add value labels for single series only
      g.selectAll('.column-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'column-label')
        .attr('x', (d) => (xScale(String(d[xKey])) || 0) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(Number(d[singleKey]) || 0) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#333')
        .text((d) => {
          const value = Number(d[singleKey]);
          return value > 0 ? format(',.0f')(value) : '';
        })
        .style('opacity', 0)
        .transition()
        .delay((_, i) => 800 + i * 50)
        .duration(400)
        .style('opacity', 1);
    }

    // Add legend for multi-series
    if (isMultiSeries && seriesKeys.length > 1) {
      const legend = g
        .append('g')
        .attr('transform', `translate(${innerWidth - 150}, 10)`);

      seriesKeys.forEach((key, i) => {
        const legendRow = legend
          .append('g')
          .attr('transform', `translate(0, ${i * 20})`);

        legendRow
          .append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', colors[i % colors.length])
          .attr('opacity', 0.85);

        legendRow
          .append('text')
          .attr('x', 20)
          .attr('y', 12)
          .style('font-size', '11px')
          .style('fill', '#333')
          .text(key);
      });
    }

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

  }, [data, xKey, yKey, width, height, margin, colors, xLabel, yLabel, multiSeries, stacked, showZeroLine]);

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
