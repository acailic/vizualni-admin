# Chart Export Feature

This document describes how to use the chart export functionality in the vizualni-admin application.

## Overview

The `ExportControls` component provides users with the ability to download chart visualizations as PNG or SVG files. This feature is now integrated into all demo pages.

## Components

### ExportControls

Located at: `app/components/demos/ExportControls.tsx`

The `ExportControls` component provides two export buttons:
- **Download PNG**: Exports the chart as a high-quality PNG image (2x resolution)
- **Download SVG**: Exports the chart as a scalable SVG image

## Usage

### Basic Usage

```tsx
import { ExportControls } from '@/components/demos/ExportControls';

// 1. Give your chart container a unique ID
<Box id="my-chart-container">
  <MyChart data={data} />
</Box>

// 2. Add the ExportControls component
<ExportControls
  targetElementId="my-chart-container"
  fileNamePrefix="my-chart"
/>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `targetElementId` | `string` | Yes | - | ID of the DOM element to export |
| `fileNamePrefix` | `string` | No | `"chart"` | Prefix for the downloaded filename |
| `sx` | `SxProps<Theme>` | No | - | MUI style overrides |

### Example: Integration in Demo Pages

The component is already integrated into the `[category].tsx` demo page:

```tsx
{/* Export Controls */}
{Array.isArray(data) && data.length > 0 && (
  <Box sx={{ mb: 3 }}>
    <ExportControls
      targetElementId="main-chart-container"
      fileNamePrefix={`${category}-chart`}
    />
  </Box>
)}

{/* Chart Visualization */}
<Paper id="main-chart-container" sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
  <SimpleChart
    data={data}
    chartType={config.chartType}
    width={1000}
    height={450}
  />
</Paper>
```

## Implementation Details

### Library

The export functionality uses the `html-to-image` library (already installed in the project):
- **PNG Export**: Uses `htmlToImage.toPng()` with 2x pixel ratio for high quality
- **SVG Export**: First tries to find and serialize native SVG elements, falls back to `htmlToImage.toSvg()`

### Export Quality

- **PNG**: 2x pixel ratio (retina quality), white background
- **SVG**: Vector graphics, maintains scalability

### Error Handling

The component includes:
- Console error logging for debugging
- User-friendly alert messages in Serbian
- Loading states during export
- Validation that target element exists

### File Naming

Downloaded files are named using the pattern:
```
{fileNamePrefix}-{timestamp}.{extension}
```

Example: `demographics-chart-1732200000000.png`

## Features

1. **High-Quality PNG Export**
   - 2x resolution for retina displays
   - White background
   - Suitable for presentations and documents

2. **Scalable SVG Export**
   - Vector graphics format
   - Infinite scalability
   - Small file sizes for simple charts
   - Preferred for web use

3. **User Experience**
   - Loading indicators during export
   - Disabled state to prevent double-clicks
   - Serbian localization
   - Download icons for clarity

## Browser Compatibility

The export functionality works in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

## Limitations

1. Some complex CSS styles may not export perfectly in SVG mode
2. External fonts may need to be embedded for proper rendering
3. Large charts may take a few seconds to export

## Future Enhancements

Potential improvements mentioned in `DATASET_VISUALIZATION_PLAN.md`:
- CSV data export
- PDF export
- Batch export of multiple charts
- Export with custom dimensions
- Email/share functionality

## Troubleshooting

### Chart not exporting?

1. Verify the `targetElementId` matches the container's `id` attribute
2. Check browser console for error messages
3. Ensure the chart has finished rendering before exporting
4. Try refreshing the page

### Poor quality exports?

1. For PNG: The component already uses 2x resolution
2. For vector graphics: Use SVG export instead of PNG
3. Check if the chart uses web fonts (may need embedding)

### Export button not appearing?

1. Verify data is loaded (`data.length > 0`)
2. Check that the component is imported correctly
3. Ensure the demo page is using the latest version

## Related Files

- `app/components/demos/ExportControls.tsx` - Main component
- `app/pages/demos/[category].tsx` - Demo page integration
- `app/components/demos/index.ts` - Component exports
- `docs/DATASET_VISUALIZATION_PLAN.md` - Feature planning

## References

- [html-to-image library](https://github.com/bubkoo/html-to-image)
- [Data Gov RS Portal](https://data.gov.rs)
