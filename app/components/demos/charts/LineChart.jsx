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
export const LineChart = ({ data, xKey, yKey, width = 800, height = 400, margin = { top: 20, right: 30, bottom: 60, left: 80 }, color = '#4caf50', colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'], xLabel = '', yLabel = '', multiSeries = false, showZeroLine = false }) => {
    const svgRef = useRef(null);
    useEffect(() => {
        if (!svgRef.current || !data || data.length === 0)
            return;
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
        let seriesKeys;
        if (multiSeries) {
            // Auto-detect series keys (all keys except xKey)
            seriesKeys = Object.keys(data[0] || {}).filter(key => key !== xKey);
        }
        else {
            seriesKeys = [typeof yKey === 'string' ? yKey : yKey[0]];
        }
        // Extract values for scaling
        const xValues = data.map(d => String(d[xKey]));
        const allYValues = data.flatMap(d => seriesKeys.map(key => Number(d[key]) || 0));
        // Create scales
        const xScale = scalePoint()
            .domain(xValues)
            .range([0, innerWidth])
            .padding(0.5);
        const yMin = min(allYValues) || 0;
        const yMax = max(allYValues) || 0;
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
        // Add zero line if requested
        if (showZeroLine && yMin < 0) {
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
        // Draw lines for each series
        seriesKeys.forEach((key, index) => {
            var _a;
            const seriesColor = multiSeries ? colors[index % colors.length] : color;
            // Create line generator
            const lineGenerator = line()
                .x((d) => xScale(String(d[xKey])) || 0)
                .y((d) => yScale(Number(d[key]) || 0))
                .curve(curveMonotoneX);
            // Add the line path
            const path = g
                .append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', seriesColor)
                .attr('stroke-width', 2.5)
                .attr('d', lineGenerator);
            // Animate the line
            const totalLength = ((_a = path.node()) === null || _a === void 0 ? void 0 : _a.getTotalLength()) || 0;
            path
                .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(1500)
                .ease(easeLinear)
                .attr('stroke-dashoffset', 0);
            // Add dots
            g.selectAll(`.circle-${index}`)
                .data(data)
                .enter()
                .append('circle')
                .attr('class', `circle-${index}`)
                .attr('cx', (d) => xScale(String(d[xKey])) || 0)
                .attr('cy', (d) => yScale(Number(d[key]) || 0))
                .attr('r', 0)
                .attr('fill', seriesColor)
                .attr('stroke', '#fff')
                .attr('stroke-width', 2)
                .on('mouseover', function (_event, _d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 7);
            })
                .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4);
            })
                .transition()
                .delay((_, i) => i * 50)
                .duration(500)
                .attr('r', 4);
        });
        // Add legend for multi-series
        if (multiSeries && seriesKeys.length > 1) {
            const legend = g
                .append('g')
                .attr('transform', `translate(${innerWidth - 150}, 10)`);
            seriesKeys.forEach((key, i) => {
                const legendRow = legend
                    .append('g')
                    .attr('transform', `translate(0, ${i * 20})`);
                legendRow
                    .append('line')
                    .attr('x1', 0)
                    .attr('x2', 30)
                    .attr('y1', 0)
                    .attr('y2', 0)
                    .attr('stroke', colors[i % colors.length])
                    .attr('stroke-width', 2.5);
                legendRow
                    .append('text')
                    .attr('x', 35)
                    .attr('y', 4)
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
    }, [data, xKey, yKey, width, height, margin, color, colors, xLabel, yLabel, multiSeries, showZeroLine]);
    return (<Box sx={{ width: '100%', overflow: 'auto' }}>
      <svg ref={svgRef} width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }}/>
    </Box>);
};
