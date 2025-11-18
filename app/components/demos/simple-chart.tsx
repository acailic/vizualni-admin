/**
 * Simple chart component for data.gov.rs demos
 * Uses Recharts for easy integration with tabular data
 */

import { useMemo } from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface SimpleChartProps {
  data: any[];
  chartType: 'line' | 'bar' | 'column' | 'area' | 'pie' | 'map' | 'scatterplot';
  xKey?: string;
  yKey?: string;
  width?: number;
  height?: number;
}

/**
 * Simple chart component that works with raw data.gov.rs data
 * This is a lightweight wrapper that doesn't require complex configuration
 */
export function SimpleChart({
  data,
  chartType,
  xKey,
  yKey,
  width = 800,
  height = 400
}: SimpleChartProps) {
  // Auto-detect X and Y keys if not provided
  const keys = useMemo(() => {
    if (!data || data.length === 0) {
      return { x: null, y: null, allKeys: [] };
    }

    const allKeys = Object.keys(data[0]);
    const detectedX = xKey || allKeys[0];
    const detectedY = yKey || allKeys.find(key => {
      const value = data[0][key];
      return typeof value === 'number' || !isNaN(parseFloat(value));
    }) || allKeys[1];

    return { x: detectedX, y: detectedY, allKeys };
  }, [data, xKey, yKey]);

  if (!data || data.length === 0) {
    return (
      <Alert severity="info">
        Nema podataka za prikaz / No data to display
      </Alert>
    );
  }

  if (!keys.x || !keys.y) {
    return (
      <Alert severity="warning">
        Nije moguće detektovati kolone za vizualizaciju / Cannot detect columns for visualization
      </Alert>
    );
  }

  // Prepare data for visualization
  const chartData = useMemo(() => {
    return data.slice(0, 50).map(row => ({
      label: String(row[keys.x] || ''),
      value: parseFloat(row[keys.y]) || 0,
      ...row
    }));
  }, [data, keys]);

  // Calculate basic statistics
  const stats = useMemo(() => {
    const values = chartData.map(d => d.value).filter(v => !isNaN(v));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length
    };
  }, [chartData]);

  return (
    <Box>
      {/* Chart Info */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip grafikona:</strong> {chartType} |{' '}
          <strong>X osa:</strong> {keys.x} |{' '}
          <strong>Y osa:</strong> {keys.y}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Statistika:</strong> Min: {stats.min.toFixed(2)} | Max: {stats.max.toFixed(2)} | Prosek: {stats.avg.toFixed(2)} | Broj vrednosti: {stats.count}
        </Typography>
      </Box>

      {/* SVG Chart */}
      <svg width={width} height={height} style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        {chartType === 'bar' && <BarChart data={chartData} stats={stats} width={width} height={height} />}
        {chartType === 'column' && <ColumnChart data={chartData} stats={stats} width={width} height={height} />}
        {chartType === 'line' && <LineChart data={chartData} stats={stats} width={width} height={height} />}
        {chartType === 'area' && <AreaChart data={chartData} stats={stats} width={width} height={height} />}
        {chartType === 'pie' && <PieChart data={chartData} stats={stats} width={width} height={height} />}
        {(chartType === 'map' || chartType === 'scatterplot') && (
          <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
            {chartType} vizualizacija nije još implementirana
          </text>
        )}
      </svg>

      {/* Legend */}
      {data.length > 50 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Prikazano prvih 50 od {data.length} redova
        </Typography>
      )}
    </Box>
  );
}

// Bar Chart (Horizontal)
function BarChart({ data, stats, width, height }: any) {
  const margin = { top: 20, right: 20, bottom: 40, left: 120 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barHeight = Math.max(20, chartHeight / data.length - 5);
  const maxValue = stats.max;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Bars */}
      {data.map((d: any, i: number) => {
        const barWidth = (d.value / maxValue) * chartWidth;
        const y = i * (barHeight + 5);

        return (
          <g key={i}>
            <rect
              x={0}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#3f51b5"
              opacity={0.8}
            />
            <text
              x={-5}
              y={y + barHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="12"
              fill="#333"
            >
              {d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label}
            </text>
            <text
              x={barWidth + 5}
              y={y + barHeight / 2}
              alignmentBaseline="middle"
              fontSize="11"
              fill="#666"
            >
              {d.value.toFixed(1)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Column Chart (Vertical)
function ColumnChart({ data, stats, width, height }: any) {
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barWidth = Math.max(15, chartWidth / data.length - 10);
  const maxValue = stats.max;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Y Axis */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#999" />
      <text x={-40} y={chartHeight / 2} fontSize="12" fill="#666" transform={`rotate(-90, -40, ${chartHeight / 2})`}>
        Vrednost
      </text>

      {/* X Axis */}
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#999" />

      {/* Columns */}
      {data.map((d: any, i: number) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = i * (barWidth + 10);

        return (
          <g key={i}>
            <rect
              x={x}
              y={chartHeight - barHeight}
              width={barWidth}
              height={barHeight}
              fill="#3f51b5"
              opacity={0.8}
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
              transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 15})`}
            >
              {d.label.length > 10 ? d.label.substring(0, 10) + '...' : d.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={chartHeight - barHeight - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
            >
              {d.value.toFixed(1)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Line Chart
function LineChart({ data, stats, width, height }: any) {
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = stats.max;
  const minValue = stats.min;
  const range = maxValue - minValue;

  // Calculate points
  const points = data.map((d: any, i: number) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.map((p: any, i: number) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Axes */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#999" />
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#999" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#3f51b5"
        strokeWidth={2}
      />

      {/* Points */}
      {points.map((p: any, i: number) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#3f51b5" />
          {i % Math.ceil(data.length / 10) === 0 && (
            <text
              x={p.x}
              y={chartHeight + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {p.label.length > 8 ? p.label.substring(0, 8) + '...' : p.label}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

// Area Chart
function AreaChart({ data, stats, width, height }: any) {
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = stats.max;
  const minValue = stats.min;
  const range = maxValue - minValue;

  const points = data.map((d: any, i: number) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.map((p: any, i: number) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Axes */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#999" />
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#999" />

      {/* Area */}
      <path
        d={areaD}
        fill="#3f51b5"
        opacity={0.3}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#3f51b5"
        strokeWidth={2}
      />
    </g>
  );
}

// Pie Chart
function PieChart({ data, stats, width, height }: any) {
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;

  const total = data.reduce((sum: number, d: any) => sum + d.value, 0);
  let currentAngle = 0;

  const slices = data.slice(0, 8).map((d: any) => {
    const percentage = d.value / total;
    const angle = percentage * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...d,
      percentage,
      startAngle,
      endAngle
    };
  });

  const colors = ['#3f51b5', '#f50057', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ffeb3b', '#795548'];

  return (
    <g>
      {slices.map((slice: any, i: number) => {
        const x1 = centerX + radius * Math.cos(slice.startAngle - Math.PI / 2);
        const y1 = centerY + radius * Math.sin(slice.startAngle - Math.PI / 2);
        const x2 = centerX + radius * Math.cos(slice.endAngle - Math.PI / 2);
        const y2 = centerY + radius * Math.sin(slice.endAngle - Math.PI / 2);
        const largeArc = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;

        const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        // Label position
        const labelAngle = (slice.startAngle + slice.endAngle) / 2 - Math.PI / 2;
        const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
        const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);

        return (
          <g key={i}>
            <path
              d={pathD}
              fill={colors[i % colors.length]}
              opacity={0.8}
              stroke="white"
              strokeWidth={2}
            />
            {slice.percentage > 0.05 && (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="11"
                fill="white"
                fontWeight="bold"
              >
                {(slice.percentage * 100).toFixed(1)}%
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      {slices.map((slice: any, i: number) => (
        <g key={`legend-${i}`} transform={`translate(${width - 150}, ${20 + i * 25})`}>
          <rect width={15} height={15} fill={colors[i % colors.length]} opacity={0.8} />
          <text x={20} y={12} fontSize="11" fill="#333">
            {slice.label.length > 12 ? slice.label.substring(0, 12) + '...' : slice.label}
          </text>
        </g>
      ))}
    </g>
  );
}
