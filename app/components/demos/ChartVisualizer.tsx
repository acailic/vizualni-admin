/**
 * Smart Chart Visualizer
 * Automatically selects appropriate visualization based on data and chart type
 */

import { useMemo } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { BarChart, LineChart, ColumnChart, PieChart } from './charts';

export interface ChartVisualizerProps {
  data: any[];
  chartType: 'line' | 'bar' | 'column' | 'area' | 'pie' | 'map' | 'scatterplot';
  title?: string;
}

/**
 * Automatically detect the best columns to visualize
 */
function detectVisualizationColumns(data: any[]): {
  categoryColumn: string | null;
  valueColumn: string | null;
  allNumericColumns: string[];
  allTextColumns: string[];
} {
  if (!data || data.length === 0) {
    return { categoryColumn: null, valueColumn: null, allNumericColumns: [], allTextColumns: [] };
  }

  const firstRow = data[0];
  const columns = Object.keys(firstRow);

  const numericColumns: string[] = [];
  const textColumns: string[] = [];

  // Classify columns
  columns.forEach(col => {
    const sampleValues = data.slice(0, 10).map(row => row[col]);
    const numericCount = sampleValues.filter(val =>
      val !== null && val !== undefined && !isNaN(Number(val))
    ).length;

    if (numericCount > sampleValues.length * 0.7) {
      numericColumns.push(col);
    } else {
      textColumns.push(col);
    }
  });

  // Select category column (first text column or first column)
  const categoryColumn = textColumns[0] || columns[0];

  // Select value column (first numeric column)
  const valueColumn = numericColumns[0] || columns[1] || columns[0];

  return {
    categoryColumn,
    valueColumn,
    allNumericColumns: numericColumns,
    allTextColumns: textColumns
  };
}

/**
 * Prepare data for visualization (limit rows if too many)
 */
function prepareDataForVisualization(data: any[], maxRows: number = 20): any[] {
  if (data.length <= maxRows) {
    return data;
  }

  // For large datasets, take a sample
  const step = Math.ceil(data.length / maxRows);
  return data.filter((_, index) => index % step === 0).slice(0, maxRows);
}

export const ChartVisualizer = ({ data, chartType, title }: ChartVisualizerProps) => {
  const { visualizationData, columns, preparedData } = useMemo(() => {
    const columns = detectVisualizationColumns(data);
    const preparedData = prepareDataForVisualization(data, 25);

    return {
      visualizationData: data,
      columns,
      preparedData
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Alert severity="info">
        Nema dostupnih podataka za vizualizaciju
      </Alert>
    );
  }

  if (!columns.categoryColumn || !columns.valueColumn) {
    return (
      <Alert severity="warning">
        Nije moguće automatski detektovati kolone za vizualizaciju.
        Podaci nisu u odgovarajućem formatu.
      </Alert>
    );
  }

  const commonProps = {
    xKey: columns.categoryColumn,
    yKey: columns.valueColumn,
    xLabel: columns.categoryColumn,
    yLabel: columns.valueColumn
  };

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {title}
        </Typography>
      )}

      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Prikazano:</strong> {preparedData.length} od {data.length} redova
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Kategorija:</strong> {columns.categoryColumn} | <strong>Vrednost:</strong> {columns.valueColumn}
        </Typography>
      </Box>

      <Box sx={{ minHeight: 400 }}>
        {chartType === 'line' && (
          <LineChart
            data={preparedData}
            {...commonProps}
            color="#4caf50"
          />
        )}

        {chartType === 'bar' && (
          <BarChart
            data={preparedData}
            {...commonProps}
            color="#2196f3"
          />
        )}

        {chartType === 'column' && (
          <ColumnChart
            data={preparedData}
            {...commonProps}
          />
        )}

        {chartType === 'pie' && (
          <PieChart
            data={preparedData.slice(0, 10)} // Limit pie chart to 10 slices
            labelKey={columns.categoryColumn}
            valueKey={columns.valueColumn}
            width={600}
            height={600}
          />
        )}

        {(chartType === 'area' || chartType === 'map' || chartType === 'scatterplot') && (
          <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              📊 {chartType === 'map' ? 'Mapa' : chartType === 'area' ? 'Area grafik' : 'Scatterplot'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ovaj tip vizualizacije je u razvoju.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Trenutno prikazujemo stubičasti grafik kao zamenu:
            </Typography>
            <Box sx={{ mt: 3 }}>
              <ColumnChart
                data={preparedData}
                {...commonProps}
              />
            </Box>
          </Box>
        )}
      </Box>

      {data.length > preparedData.length && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Dataset sadrži {data.length} redova. Prikazano je {preparedData.length} reprezentativnih uzoraka.
        </Alert>
      )}
    </Box>
  );
};
