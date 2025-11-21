/**
 * Export Controls Component
 * Provides functionality to export charts as PNG or SVG
 */

import { Box, Button, CircularProgress, Stack } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { useState } from 'react';

export interface ExportControlsProps {
  /**
   * ID of the element to export (must be a valid DOM element ID)
   */
  targetElementId: string;

  /**
   * Optional filename prefix for downloaded files
   * @default "chart"
   */
  fileNamePrefix?: string;

  /**
   * Optional style customization
   */
  sx?: any;
}

/**
 * ExportControls Component
 *
 * Provides buttons to download chart visualizations as PNG or SVG files.
 * Uses html-to-image library to capture the chart container.
 *
 * @example
 * ```tsx
 * <Box id="chart-container">
 *   <MyChart data={data} />
 * </Box>
 * <ExportControls
 *   targetElementId="chart-container"
 *   fileNamePrefix="my-chart"
 * />
 * ```
 */
export const ExportControls = ({
  targetElementId,
  fileNamePrefix = 'chart',
  sx
}: ExportControlsProps) => {
  const [exporting, setExporting] = useState<'png' | 'svg' | null>(null);

  /**
   * Download chart as PNG
   */
  const handleExportPNG = async () => {
    const element = document.getElementById(targetElementId);

    if (!element) {
      console.error(`Element with id "${targetElementId}" not found`);
      alert(`Greška: Nije pronađen element za eksport.`);
      return;
    }

    try {
      setExporting('png');

      // Generate PNG with high quality
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2, // Higher resolution
        backgroundColor: '#ffffff'
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${fileNamePrefix}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Greška pri eksportovanju PNG-a. Pokušajte ponovo.');
    } finally {
      setExporting(null);
    }
  };

  /**
   * Download chart as SVG
   */
  const handleExportSVG = async () => {
    const element = document.getElementById(targetElementId);

    if (!element) {
      console.error(`Element with id "${targetElementId}" not found`);
      alert(`Greška: Nije pronađen element za eksport.`);
      return;
    }

    try {
      setExporting('svg');

      // Check if element contains SVG
      const svgElement = element.querySelector('svg');

      if (svgElement) {
        // Direct SVG export (better quality for SVG charts)
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.download = `${fileNamePrefix}-${Date.now()}.svg`;
        link.href = svgUrl;
        link.click();

        // Clean up
        URL.revokeObjectURL(svgUrl);
      } else {
        // Fallback: Convert entire element to SVG
        const dataUrl = await htmlToImage.toSvg(element, {
          backgroundColor: '#ffffff'
        });

        const link = document.createElement('a');
        link.download = `${fileNamePrefix}-${Date.now()}.svg`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Error exporting SVG:', error);
      alert('Greška pri eksportovanju SVG-a. Pokušajte ponovo.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportPNG}
          disabled={!!exporting}
          startIcon={exporting === 'png' ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none' }}
        >
          {exporting === 'png' ? 'Eksportovanje...' : '📥 Preuzmi PNG'}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleExportSVG}
          disabled={!!exporting}
          startIcon={exporting === 'svg' ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ textTransform: 'none' }}
        >
          {exporting === 'svg' ? 'Eksportovanje...' : '📥 Preuzmi SVG'}
        </Button>
      </Stack>
    </Box>
  );
};
