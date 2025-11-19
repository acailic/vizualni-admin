/**
 * Population Pyramid Chart component using D3
 * Visualizes age distribution by gender
 */

import { useEffect, useRef } from 'react';

import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear } from 'd3-scale';
import * as d3 from 'd3-selection';

import { Box, useTheme } from '@mui/material';

export interface PyramidDataPoint {
  ageRange: string;
  male: number;
  female: number;
}

export interface PopulationPyramidProps {
  data: PyramidDataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  maleColor?: string;
  femaleColor?: string;
  title?: string;
}

export const PopulationPyramid = ({
  data,
  width = 800,
  height = 600,
  margin = { top: 40, right: 60, bottom: 60, left: 60 },
  maleColor = '#2196f3',
  femaleColor = '#f50057',
  title = 'Population Pyramid'
}: PopulationPyramidProps) => {
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

    // Find max value for scale
    const maxMale = max(data, d => d.male) || 0;
    const maxFemale = max(data, d => d.female) || 0;
    const maxValue = Math.max(maxMale, maxFemale);

    // Create scales
    const yScale = scaleBand()
      .domain(data.map(d => d.ageRange).reverse()) // Reverse to show youngest at bottom
      .range([innerHeight, 0])
      .padding(0.1);

    const xScale = scaleLinear()
      .domain([maxValue, 0, maxValue]) // Symmetric scale
      .range([0, innerWidth / 2, innerWidth])
      .nice();

    // Add center line
    g.append('line')
      .attr('x1', innerWidth / 2)
      .attr('x2', innerWidth / 2)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', theme.palette.divider || '#ddd')
      .attr('stroke-width', 2);

    // Add Y axis (age groups)
    g.append('g')
      .attr('transform', `translate(${innerWidth / 2},0)`)
      .call(axisLeft(yScale).tickSize(0))
      .style('font-size', '11px')
      .select('.domain')
      .remove();

    // Add X axis labels for males (left side)
    const maleAxis = axisBottom(
      scaleLinear()
        .domain([maxValue, 0])
        .range([0, innerWidth / 2])
    ).ticks(5);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(maleAxis)
      .style('font-size', '10px');

    // Add X axis labels for females (right side)
    const femaleAxis = axisBottom(
      scaleLinear()
        .domain([0, maxValue])
        .range([0, innerWidth / 2])
    ).ticks(5);

    g.append('g')
      .attr('transform', `translate(${innerWidth / 2},${innerHeight})`)
      .call(femaleAxis)
      .style('font-size', '10px');

    // Add male bars (left side)
    g.selectAll('.male-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'male-bar')
      .attr('x', innerWidth / 2)
      .attr('y', d => yScale(d.ageRange) || 0)
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', maleColor)
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);

        // Show tooltip
        const tooltip = g.append('g')
          .attr('class', 'tooltip-male')
          .attr('transform', `translate(${innerWidth / 2 - 10}, ${(yScale(d.ageRange) || 0) + yScale.bandwidth() / 2})`);

        const text = tooltip.append('text')
          .attr('text-anchor', 'end')
          .style('font-size', '12px')
          .style('font-weight', '600')
          .style('fill', maleColor)
          .text(`${d.male.toLocaleString()}k`);

        const bbox = (text.node() as SVGTextElement).getBBox();
        tooltip.insert('rect', 'text')
          .attr('x', bbox.x - 5)
          .attr('y', bbox.y - 2)
          .attr('width', bbox.width + 10)
          .attr('height', bbox.height + 4)
          .attr('fill', 'white')
          .attr('stroke', maleColor)
          .attr('stroke-width', 1)
          .attr('rx', 3);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8);
        g.selectAll('.tooltip-male').remove();
      })
      .transition()
      .duration(800)
      .attr('x', d => xScale(d.male))
      .attr('width', d => innerWidth / 2 - xScale(d.male));

    // Add female bars (right side)
    g.selectAll('.female-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'female-bar')
      .attr('x', innerWidth / 2)
      .attr('y', d => yScale(d.ageRange) || 0)
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', femaleColor)
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);

        // Show tooltip
        const barEnd = xScale(0) + (innerWidth / 2 - xScale(0));
        const tooltip = g.append('g')
          .attr('class', 'tooltip-female')
          .attr('transform', `translate(${innerWidth / 2 + (innerWidth / 2 - xScale(0)) + 10}, ${(yScale(d.ageRange) || 0) + yScale.bandwidth() / 2})`);

        const text = tooltip.append('text')
          .attr('text-anchor', 'start')
          .style('font-size', '12px')
          .style('font-weight', '600')
          .style('fill', femaleColor)
          .text(`${d.female.toLocaleString()}k`);

        const bbox = (text.node() as SVGTextElement).getBBox();
        tooltip.insert('rect', 'text')
          .attr('x', bbox.x - 5)
          .attr('y', bbox.y - 2)
          .attr('width', bbox.width + 10)
          .attr('height', bbox.height + 4)
          .attr('fill', 'white')
          .attr('stroke', femaleColor)
          .attr('stroke-width', 1)
          .attr('rx', 3);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8);
        g.selectAll('.tooltip-female').remove();
      })
      .transition()
      .duration(800)
      .attr('width', d => innerWidth / 2 - xScale(d.female));

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', '700')
      .style('fill', theme.palette.text.primary)
      .text(title);

    // Add gender labels
    g.append('text')
      .attr('x', innerWidth / 4)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', maleColor)
      .text('Мушкарци / Males');

    g.append('text')
      .attr('x', (innerWidth / 4) * 3)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('font-weight', '600')
      .style('fill', femaleColor)
      .text('Жене / Females');

    // Add X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', theme.palette.text.secondary)
      .text('Становништво (хиљаде) / Population (thousands)');

    // Add Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', theme.palette.text.secondary)
      .text('Старосна група / Age Group');

  }, [data, width, height, margin, maleColor, femaleColor, title, theme]);

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
