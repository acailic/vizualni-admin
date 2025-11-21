import { Box } from '@mui/material';
import React from 'react';

interface DebugViewProps {
  data: unknown[];
  title?: string;
  maxRows?: number;
}

/**
 * DebugView component for displaying raw JSON structure of data
 * Useful for debugging and mapping CSV headers to chart dimensions
 */
export const DebugView: React.FC<DebugViewProps> = ({
  data,
  title = 'Debug Data View',
  maxRows = 5
}) => {
  const displayData = data.slice(0, maxRows);

  return (
    <Box sx={{
      margin: '20px',
      padding: '20px',
      border: '3px solid #ff6b6b',
      borderRadius: '8px',
      backgroundColor: '#fff3cd',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '100%',
      overflow: 'auto'
    }}>
      <Box sx={{
        marginBottom: '15px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#d32f2f',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>⚠️ {title}</span>
        <Box component="span" sx={{
          fontSize: '12px',
          fontWeight: 'normal',
          color: '#666'
        }}>
          (Showing {displayData.length} of {data.length} rows)
        </Box>
      </Box>

      {displayData.length === 0 ? (
        <Box sx={{ color: '#666', fontStyle: 'italic' }}>
          No data available
        </Box>
      ) : (
        <Box>
          {displayData.map((row, index) => (
            <Box
              key={`row-${index}-${JSON.stringify(row).substring(0, 20)}`}
              sx={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <Box sx={{
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#1976d2'
              }}>
                Row {index + 1}:
              </Box>
              <Box component="pre" sx={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(row, null, 2)}
              </Box>
            </Box>
          ))}

          {data.length > maxRows && (
            <Box sx={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: '4px',
              color: '#1565c0'
            }}>
              + {data.length - maxRows} more rows not shown
            </Box>
          )}
        </Box>
      )}

      <Box sx={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e8f5e9',
        border: '1px solid #81c784',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#2e7d32'
      }}>
        <strong>💡 Tip:</strong> Use the keys in these objects to map CSV headers
        to chart dimensions. Each key corresponds to a component ID in your data.
      </Box>
    </Box>
  );
};

export default DebugView;
