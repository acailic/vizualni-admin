# DebugView Component Usage Guide

## Overview
The `DebugView` component displays the raw JSON structure of your data, making it easy to map CSV headers to chart dimensions.

## Basic Usage

### 1. In a Chart Component

```tsx
import { DebugView } from '@/components/DebugView';

const ChartPie = memo((props: ChartProps<PieConfig>) => {
  const { observations, dimensions, chartConfig } = props;

  return (
    <>
      {/* Add DebugView at the top of your component */}
      <DebugView
        data={observations}
        title="Chart Data Debug View"
        maxRows={5}
      />

      {/* Your existing chart rendering */}
      <PieState {...props} />
    </>
  );
});
```

### 2. In ChartDataWrapper

```tsx
import { DebugView } from '@/components/DebugView';

export const ChartDataWrapper = (props: ChartDataWrapperProps) => {
  // ... existing code ...

  return (
    <>
      {observations && (
        <DebugView
          data={observations}
          title="Fetched Data Structure"
        />
      )}

      {/* Your existing chart rendering */}
      <Component {...chartProps} />
    </>
  );
};
```

### 3. Debug Specific Data Transformations

```tsx
import { DebugView } from '@/components/DebugView';

const MyComponent = () => {
  const transformedData = useMemo(() => {
    // Your data transformation logic
    return observations.map(obs => ({
      label: obs[dimensionId],
      value: obs[measureId]
    }));
  }, [observations]);

  return (
    <>
      <DebugView data={observations} title="Raw Observations" />
      <DebugView data={transformedData} title="Transformed Data" />

      {/* Your chart */}
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `unknown[]` | required | Array of data to display |
| `title` | `string` | `"Debug Data View"` | Title for the debug panel |
| `maxRows` | `number` | `5` | Maximum number of rows to display |

## Common Use Cases

### Map CSV Headers to Dimensions

1. Add `<DebugView data={observations} />` to your chart component
2. Look at the keys in each row object
3. These keys are your component IDs
4. Match them with the `dimensions` and `measures` props:

```tsx
// If DebugView shows: { "year": 2020, "temperature": 15.3 }
// Then your dimension/measure IDs are:
const yearDimension = dimensionsById["year"];
const temperatureMeasure = measuresById["temperature"];
```

### Debug Data Fetching Issues

```tsx
<DebugView
  data={observations}
  title={`Data from ${chartConfig.cubes[0].iri}`}
  maxRows={10}
/>
```

### Compare Multiple Data Sources

```tsx
<DebugView data={dataSource1} title="Source 1" maxRows={3} />
<DebugView data={dataSource2} title="Source 2" maxRows={3} />
```

## Tips

- **Always remove DebugView before production** - It's meant for development only
- Use it temporarily when mapping new data sources
- The component is styled with warning colors (yellow/red) to remind you to remove it
- Check browser console for the full data structure if the display is truncated

## Removing DebugView

Once you've finished debugging, simply remove or comment out the `<DebugView />` lines:

```tsx
{/* <DebugView data={observations} /> */}
```
