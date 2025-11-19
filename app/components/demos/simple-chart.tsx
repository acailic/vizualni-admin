/**
 * Premium chart component for data.gov.rs demos
 * Features: Modern gradients, smooth animations, interactive tooltips, professional styling
 */

import { useMemo, useState } from 'react';

import { Alert, Box, Paper, Typography } from '@mui/material';

interface SimpleChartProps {
  data: any[];
  chartType: 'line' | 'bar' | 'column' | 'area' | 'pie' | 'map' | 'scatterplot';
  xKey?: string;
  yKey?: string;
  width?: number;
  height?: number;
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: number;
  visible: boolean;
}

/**
 * Premium chart component with top 0.01% visual quality
 */
export function SimpleChart({
  data,
  chartType,
  xKey,
  yKey,
  width = 800,
  height = 400
}: SimpleChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    label: '',
    value: 0,
    visible: false
  });

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
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Nema podataka za prikaz / No data to display
      </Alert>
    );
  }

  if (!keys.x || !keys.y) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('sr-RS', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Chart Info - Enhanced with modern card design */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>
              Tip grafikona
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
              {chartType.toUpperCase()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>
              X osa
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {keys.x}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 }}>
              Y osa
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {keys.y}
            </Typography>
          </Box>
        </Box>

        {/* Statistics Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2, mt: 3 }}>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: 2, backdropFilter: 'blur(10px)' }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>Minimum</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatNumber(stats.min)}</Typography>
          </Box>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: 2, backdropFilter: 'blur(10px)' }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>Maksimum</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatNumber(stats.max)}</Typography>
          </Box>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: 2, backdropFilter: 'blur(10px)' }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>Prosek</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatNumber(stats.avg)}</Typography>
          </Box>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: 2, backdropFilter: 'blur(10px)' }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>Broj vrednosti</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{stats.count}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* SVG Chart with premium styling */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <svg
          width={width}
          height={height}
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}
        >
          {/* Define gradients and filters */}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#667eea', stopOpacity: 0.1 }} />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {chartType === 'bar' && <BarChart data={chartData} stats={stats} width={width} height={height} setTooltip={setTooltip} />}
          {chartType === 'column' && <ColumnChart data={chartData} stats={stats} width={width} height={height} setTooltip={setTooltip} />}
          {chartType === 'line' && <LineChart data={chartData} stats={stats} width={width} height={height} setTooltip={setTooltip} />}
          {chartType === 'area' && <AreaChart data={chartData} stats={stats} width={width} height={height} setTooltip={setTooltip} />}
          {chartType === 'pie' && <PieChart data={chartData} stats={stats} width={width} height={height} setTooltip={setTooltip} />}
          {(chartType === 'map' || chartType === 'scatterplot') && (
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999" fontSize="16">
              {chartType} vizualizacija u razvoju
            </text>
          )}
        </svg>

        {/* Interactive Tooltip */}
        {tooltip.visible && (
          <Box
            sx={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translate(-50%, -90%)' },
                to: { opacity: 1, transform: 'translate(-50%, -100%)' }
              }
            }}
          >
            <Paper
              elevation={8}
              sx={{
                p: 2,
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: 2,
                minWidth: 150,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid rgba(30, 30, 30, 0.95)'
                }
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>
                {tooltip.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                {formatNumber(tooltip.value)}
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Legend */}
      {data.length > 50 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          Prikazano prvih 50 od {data.length} redova
        </Typography>
      )}
    </Box>
  );
}

// Enhanced Bar Chart (Horizontal) with animations and interactions
function BarChart({ data, stats, width, height, setTooltip }: any) {
  const margin = { top: 20, right: 60, bottom: 40, left: 150 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barHeight = Math.max(20, Math.min(40, chartHeight / data.length - 5));
  const maxValue = stats.max;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
        <g key={i}>
          <line
            x1={tick * chartWidth}
            y1={0}
            x2={tick * chartWidth}
            y2={data.length * (barHeight + 5)}
            stroke="#f0f0f0"
            strokeWidth={1}
          />
          <text
            x={tick * chartWidth}
            y={data.length * (barHeight + 5) + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#999"
          >
            {formatNumber(tick * maxValue)}
          </text>
        </g>
      ))}

      {/* Bars with gradient and animation */}
      {data.map((d: any, i: number) => {
        const barWidth = (d.value / maxValue) * chartWidth;
        const y = i * (barHeight + 5);

        return (
          <g key={i}>
            {/* Bar background */}
            <rect
              x={0}
              y={y}
              width={chartWidth}
              height={barHeight}
              fill="#f8f9fa"
              rx={4}
            />
            {/* Animated bar */}
            <rect
              x={0}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="url(#barGradient)"
              rx={4}
              filter="url(#shadow)"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `slideIn 0.6s ease-out ${i * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.right - 20,
                  y: rect.top + rect.height / 2,
                  label: d.label,
                  value: d.value,
                  visible: true
                });
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                setTooltip({ x: 0, y: 0, label: '', value: 0, visible: false });
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            />
            <text
              x={-10}
              y={y + barHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="13"
              fill="#333"
              fontWeight="500"
            >
              {d.label.length > 20 ? d.label.substring(0, 20) + '...' : d.label}
            </text>
            <text
              x={barWidth + 10}
              y={y + barHeight / 2}
              alignmentBaseline="middle"
              fontSize="12"
              fill="#667eea"
              fontWeight="700"
            >
              {formatNumber(d.value)}
            </text>
          </g>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from { width: 0; opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </g>
  );
}

// Enhanced Column Chart (Vertical)
function ColumnChart({ data, stats, width, height, setTooltip }: any) {
  const margin = { top: 40, right: 40, bottom: 80, left: 70 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barWidth = Math.max(20, Math.min(60, chartWidth / data.length - 15));
  const maxValue = stats.max;

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
        <g key={i}>
          <line
            x1={0}
            y1={chartHeight - tick * chartHeight}
            x2={chartWidth}
            y2={chartHeight - tick * chartHeight}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray={tick === 0 ? "0" : "4,4"}
          />
          <text
            x={-15}
            y={chartHeight - tick * chartHeight}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize="11"
            fill="#999"
          >
            {formatNumber(tick * maxValue)}
          </text>
        </g>
      ))}

      {/* Y Axis */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#ddd" strokeWidth={2} />

      {/* X Axis */}
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#ddd" strokeWidth={2} />

      {/* Axis Labels */}
      <text
        x={-50}
        y={chartHeight / 2}
        fontSize="13"
        fill="#666"
        fontWeight="600"
        textAnchor="middle"
        transform={`rotate(-90, -50, ${chartHeight / 2})`}
      >
        Vrednost
      </text>

      {/* Columns with gradient */}
      {data.map((d: any, i: number) => {
        const columnHeight = (d.value / maxValue) * chartHeight;
        const x = (i + 0.5) * (chartWidth / data.length) - barWidth / 2;

        return (
          <g key={i}>
            <rect
              x={x}
              y={chartHeight - columnHeight}
              width={barWidth}
              height={columnHeight}
              fill="url(#barGradient)"
              rx={6}
              filter="url(#shadow)"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `growUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s both`
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  label: d.label,
                  value: d.value,
                  visible: true
                });
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                setTooltip({ x: 0, y: 0, label: '', value: 0, visible: false });
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 20}
              textAnchor="end"
              fontSize="11"
              fill="#666"
              fontWeight="500"
              transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 20})`}
            >
              {d.label.length > 12 ? d.label.substring(0, 12) + '...' : d.label}
            </text>
          </g>
        );
      })}

      <style>{`
        @keyframes growUp {
          from { height: 0; y: ${chartHeight}; opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </g>
  );
}

// Enhanced Line Chart with smooth curves
function LineChart({ data, stats, width, height, setTooltip }: any) {
  const margin = { top: 40, right: 40, bottom: 80, left: 70 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = stats.max;
  const minValue = Math.min(0, stats.min);
  const range = maxValue - minValue;

  const points = data.map((d: any, i: number) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return { x, y, ...d };
  });

  // Create smooth curve path using Catmull-Rom spline
  const createSmoothPath = (points: any[]) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      path += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
    }
    const last = points[points.length - 1];
    path += ` L ${last.x} ${last.y}`;
    return path;
  };

  const pathD = createSmoothPath(points);

  return (
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
        <g key={i}>
          <line
            x1={0}
            y1={chartHeight - tick * chartHeight}
            x2={chartWidth}
            y2={chartHeight - tick * chartHeight}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={-15}
            y={chartHeight - tick * chartHeight}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize="11"
            fill="#999"
          >
            {formatNumber(minValue + tick * range)}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#ddd" strokeWidth={2} />
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#ddd" strokeWidth={2} />

      {/* Gradient area under line */}
      <path
        d={`${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
        fill="url(#areaGradient)"
        style={{
          animation: 'fadeIn 1s ease-out'
        }}
      />

      {/* Line with gradient stroke */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#barGradient)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: 'drawLine 1.5s ease-out',
          strokeDasharray: 2000,
          strokeDashoffset: 2000
        }}
      />

      {/* Points */}
      {points.map((p: any, i: number) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={6}
            fill="#ffffff"
            stroke="url(#barGradient)"
            strokeWidth={3}
            filter="url(#shadow)"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: `pop 0.5s ease-out ${i * 0.05}s both`
            }}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.getBoundingClientRect();
              setTooltip({
                x: circle.left + circle.width / 2,
                y: circle.top,
                label: p.label,
                value: p.value,
                visible: true
              });
              e.currentTarget.setAttribute('r', '8');
            }}
            onMouseLeave={(e) => {
              setTooltip({ x: 0, y: 0, label: '', value: 0, visible: false });
              e.currentTarget.setAttribute('r', '6');
            }}
          />
          {i % Math.max(1, Math.ceil(data.length / 8)) === 0 && (
            <text
              x={p.x}
              y={chartHeight + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#666"
              fontWeight="500"
              transform={`rotate(-45, ${p.x}, ${chartHeight + 20})`}
            >
              {p.label.length > 10 ? p.label.substring(0, 10) + '...' : p.label}
            </text>
          )}
        </g>
      ))}

      <style>{`
        @keyframes drawLine {
          to { strokeDashoffset: 0; }
        }
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </g>
  );
}

// Enhanced Area Chart
function AreaChart({ data, stats, width, height, setTooltip }: any) {
  const margin = { top: 40, right: 40, bottom: 80, left: 70 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = stats.max;
  const minValue = Math.min(0, stats.min);
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
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
        <g key={i}>
          <line
            x1={0}
            y1={chartHeight - tick * chartHeight}
            x2={chartWidth}
            y2={chartHeight - tick * chartHeight}
            stroke="#f0f0f0"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={-15}
            y={chartHeight - tick * chartHeight}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize="11"
            fill="#999"
          >
            {formatNumber(minValue + tick * range)}
          </text>
        </g>
      ))}

      {/* Axes */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#ddd" strokeWidth={2} />
      <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#ddd" strokeWidth={2} />

      {/* Area with gradient */}
      <path
        d={areaD}
        fill="url(#areaGradient)"
        style={{
          animation: 'fillArea 1.5s ease-out'
        }}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#667eea"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Interactive points */}
      {points.map((p: any, i: number) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          fill="#ffffff"
          stroke="#667eea"
          strokeWidth={2}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: `pop 0.5s ease-out ${i * 0.05}s both`
          }}
          onMouseEnter={(e) => {
            const circle = e.currentTarget.getBoundingClientRect();
            setTooltip({
              x: circle.left + circle.width / 2,
              y: circle.top,
              label: p.label,
              value: p.value,
              visible: true
            });
            e.currentTarget.setAttribute('r', '7');
          }}
          onMouseLeave={(e) => {
            setTooltip({ x: 0, y: 0, label: '', value: 0, visible: false });
            e.currentTarget.setAttribute('r', '5');
          }}
        />
      ))}

      <style>{`
        @keyframes fillArea {
          from { opacity: 0; transform: scaleY(0); transformOrigin: bottom; }
          to { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </g>
  );
}

// Enhanced Pie Chart with modern design
function PieChart({ data, stats, width, height, setTooltip }: any) {
  const radius = Math.min(width, height) / 2 - 80;
  const centerX = width / 2 - 60;
  const centerY = height / 2;

  const total = data.reduce((sum: number, d: any) => sum + d.value, 0);
  let currentAngle = -Math.PI / 2; // Start from top

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

  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

  const solidColors = ['#667eea', '#f5576c', '#00f2fe', '#38f9d7', '#fa709a', '#330867', '#a8edea', '#ff9a9e'];

  return (
    <g>
      {/* Define gradients for each slice */}
      {slices.map((_, i) => (
        <defs key={`grad-${i}`}>
          <linearGradient id={`pieGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: solidColors[i], stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: solidColors[i], stopOpacity: 0.7 }} />
          </linearGradient>
        </defs>
      ))}

      {/* Pie slices */}
      {slices.map((slice: any, i: number) => {
        const x1 = centerX + radius * Math.cos(slice.startAngle);
        const y1 = centerY + radius * Math.sin(slice.startAngle);
        const x2 = centerX + radius * Math.cos(slice.endAngle);
        const y2 = centerY + radius * Math.sin(slice.endAngle);
        const largeArc = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;

        const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        const labelAngle = (slice.startAngle + slice.endAngle) / 2;
        const labelX = centerX + (radius * 0.65) * Math.cos(labelAngle);
        const labelY = centerY + (radius * 0.65) * Math.sin(labelAngle);

        return (
          <g key={i}>
            <path
              d={pathD}
              fill={`url(#pieGradient${i})`}
              stroke="white"
              strokeWidth={3}
              filter="url(#shadow)"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: `${centerX}px ${centerY}px`,
                animation: `rotate 1s ease-out ${i * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                const path = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: path.left + path.width / 2,
                  y: path.top + path.height / 3,
                  label: slice.label,
                  value: slice.value,
                  visible: true
                });
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.filter = 'url(#shadow) brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                setTooltip({ x: 0, y: 0, label: '', value: 0, visible: false });
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'url(#shadow)';
              }}
            />
            {slice.percentage > 0.05 && (
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="14"
                fill="white"
                fontWeight="700"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  pointerEvents: 'none'
                }}
              >
                {(slice.percentage * 100).toFixed(1)}%
              </text>
            )}
          </g>
        );
      })}

      {/* Enhanced Legend */}
      <g transform={`translate(${width - 200}, 40)`}>
        <rect
          width={180}
          height={slices.length * 32 + 20}
          fill="white"
          rx={8}
          filter="url(#shadow)"
        />
        {slices.map((slice: any, i: number) => (
          <g key={`legend-${i}`} transform={`translate(15, ${15 + i * 32})`}>
            <rect
              width={20}
              height={20}
              fill={`url(#pieGradient${i})`}
              rx={4}
            />
            <text x={28} y={15} fontSize="12" fill="#333" fontWeight="500">
              {slice.label.length > 15 ? slice.label.substring(0, 15) + '...' : slice.label}
            </text>
          </g>
        ))}
      </g>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
      `}</style>
    </g>
  );
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('sr-RS', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);
}
