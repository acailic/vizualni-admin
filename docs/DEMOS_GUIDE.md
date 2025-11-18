# Demo Visualizations Guide

## Overview

The Vizualni Admin demo gallery showcases real-time data visualizations using datasets from the Serbian Open Data Portal (data.gov.rs). Each demo automatically fetches and visualizes real government data, demonstrating different visualization techniques and use cases.

## Live Demos

Access the demos at: [https://acailic.github.io/vizualni-admin/demos](https://acailic.github.io/vizualni-admin/demos)

## Available Demos

### 1. 💰 Budget (Budžet Republike Srbije)
- **Type**: Column Chart
- **Data**: State budget and public finance data
- **Use Case**: Financial tracking and budget analysis
- **Tags**: finances, public-finance, budget

### 2. 🌍 Air Quality (Kvalitet vazduha)
- **Type**: Line Chart
- **Data**: Air quality monitoring from Serbian cities
- **Use Case**: Environmental monitoring and pollution tracking
- **Tags**: environment, ecology, air-quality

### 3. 👥 Demographics (Demografija i stanovništvo)
- **Type**: Bar Chart
- **Data**: Population statistics by region
- **Use Case**: Demographic analysis and population trends
- **Tags**: population, statistics, demographics

### 4. 🎓 Education (Obrazovanje)
- **Type**: Column Chart
- **Data**: Student enrollment and school statistics
- **Use Case**: Educational planning and resource allocation
- **Tags**: education, schools, students

### 5. 🚗 Traffic & Safety (Saobraćaj i bezbednost)
- **Type**: Column Chart
- **Data**: Traffic accidents and road safety statistics
- **Use Case**: Safety analysis and traffic planning
- **Tags**: traffic, safety, accidents

### 6. 🏥 Healthcare (Zdravstvo)
- **Type**: Bar Chart
- **Data**: Hospital data, patients, medical services
- **Use Case**: Healthcare resource planning
- **Tags**: healthcare, medicine, hospitals

### 7. 💼 Employment (Zaposlenost i tržište rada)
- **Type**: Line Chart
- **Data**: Employment, unemployment, job vacancies
- **Use Case**: Labor market analysis
- **Tags**: employment, labor, economy

### 8. ⚡ Energy (Energetika)
- **Type**: Column Chart
- **Data**: Energy production and consumption
- **Use Case**: Energy planning and sustainability analysis
- **Tags**: energy, electricity, renewable

### 9. 🌾 Agriculture (Poljoprivreda)
- **Type**: Bar Chart
- **Data**: Agricultural production, crops, livestock
- **Use Case**: Agricultural planning and food security
- **Tags**: agriculture, food-industry, rural-development

### 10. ✈️ Tourism (Turizam)
- **Type**: Line Chart
- **Data**: Tourist arrivals, overnight stays, spending
- **Use Case**: Tourism industry analysis
- **Tags**: tourism, hospitality, culture

### 11. 🎭 Culture & Arts (Kultura i umetnost)
- **Type**: Pie Chart
- **Data**: Cultural institutions, events, heritage sites
- **Use Case**: Cultural resource management
- **Tags**: culture, arts, museums

### 12. 🏗️ Infrastructure (Infrastruktura)
- **Type**: Column Chart
- **Data**: Public infrastructure - roads, water, sewerage
- **Use Case**: Infrastructure planning and maintenance
- **Tags**: infrastructure, public-works, construction

## Technical Architecture

### Data Flow

```
data.gov.rs API → Client Fetch → Data Processing → D3 Visualization → Interactive Chart
```

### Components

#### Chart Components
Located in `/app/components/demos/charts/`:
- `BarChart.tsx` - Horizontal bar charts
- `LineChart.tsx` - Time series and trend lines
- `ColumnChart.tsx` - Vertical column charts
- `PieChart.tsx` - Proportional data visualization

#### Smart Visualizer
`ChartVisualizer.tsx` - Automatically detects data structure and selects appropriate columns for visualization

#### Data Fetching Hook
`useDataGovRs.ts` - Custom React hook for fetching and parsing data from data.gov.rs

### Features

1. **Real-Time Data**: Fetches live data from data.gov.rs API
2. **Automatic Column Detection**: Intelligently selects best columns for visualization
3. **Interactive Charts**: Hover effects, animations, responsive design
4. **Data Sampling**: Automatically samples large datasets for performance
5. **Dual View**: Toggle between chart and table views
6. **Responsive**: Works on all device sizes
7. **Static Export**: Fully compatible with GitHub Pages deployment

## Adding New Demos

To add a new demo category:

### 1. Update Demo Config

Edit `/app/lib/demos/config.ts`:

```typescript
export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  // ... existing demos
  myNewDemo: {
    id: 'myNewDemo',
    title: {
      sr: 'Moj novi demo',
      en: 'My New Demo'
    },
    description: {
      sr: 'Opis na srpskom',
      en: 'English description'
    },
    searchQuery: 'search terms for data.gov.rs',
    chartType: 'column', // or 'line', 'bar', 'pie'
    tags: ['tag1', 'tag2'],
    icon: '🎯'
  }
};
```

### 2. Build Static Pages

The new demo will automatically be included when you run:

```bash
yarn build:static
```

This generates static HTML for all demos defined in `DEMO_CONFIGS`.

### 3. Test Locally

```bash
yarn dev
# Visit http://localhost:3000/demos/myNewDemo
```

## Chart Type Selection Guide

Choose chart types based on your data:

| Chart Type | Best For | Example |
|------------|----------|---------|
| **Line** | Trends over time | Temperature, stock prices, employment rates |
| **Bar** | Comparing categories (horizontal) | Regional comparisons, rankings |
| **Column** | Comparing categories (vertical) | Budget allocations, enrollment numbers |
| **Pie** | Part-to-whole relationships | Budget distribution, market share |

## Data Requirements

### Optimal Data Format

For best results, datasets should have:
- **CSV or JSON format**: Automatically parsed
- **Clear headers**: Column names should be descriptive
- **Numeric values**: At least one numeric column for charts
- **Category labels**: At least one text column for labels
- **Reasonable size**: 10-10,000 rows (larger datasets are sampled)

### Example Data Structure

```csv
Region,Population,Year
Beograd,1680000,2023
Novi Sad,350000,2023
Niš,250000,2023
```

## Customization

### Changing Colors

Edit chart component props:

```typescript
<BarChart
  data={data}
  color="#custom-color"
  // ... other props
/>
```

### Adjusting Chart Size

```typescript
<LineChart
  width={1000}
  height={500}
  margin={{ top: 30, right: 40, bottom: 70, left: 90 }}
/>
```

### Custom Data Processing

Override column detection in `ChartVisualizer.tsx` or pass specific columns to chart components.

## Performance Considerations

1. **Data Sampling**: Large datasets (>25 rows) are automatically sampled
2. **Lazy Loading**: Charts only render when tab is active
3. **Static Export**: All pages pre-generated for fast loading
4. **Client-Side Fetching**: API calls happen in browser (works with static hosting)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## Troubleshooting

### Demo Shows "No Data"

1. Check if data.gov.rs API is accessible
2. Verify search query returns results
3. Check browser console for errors
4. Try a different demo to isolate issue

### Chart Not Rendering

1. Ensure data is in correct format (array of objects)
2. Check that data has both numeric and text columns
3. Verify browser supports SVG rendering
4. Check for JavaScript errors in console

### Slow Loading

1. Dataset may be very large - sampling is automatic
2. Network connection to data.gov.rs may be slow
3. Try refreshing the page
4. Check browser network tab for slow requests

## API Reference

### useDataGovRs Hook

```typescript
const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
  searchQuery: 'your search term',
  autoFetch: true,
  parseCSV: true
});
```

### ChartVisualizer Component

```typescript
<ChartVisualizer
  data={arrayOfObjects}
  chartType="column"
  title="Optional Chart Title"
/>
```

## Contributing

To contribute new chart types or improvements:

1. Add chart component to `/app/components/demos/charts/`
2. Export from `index.ts`
3. Add to ChartVisualizer switch statement
4. Update this documentation
5. Submit pull request

## License

BSD-3-Clause - See LICENSE file

## Resources

- [data.gov.rs](https://data.gov.rs) - Serbian Open Data Portal
- [data.gov.rs API Docs](https://data.gov.rs/apidoc/) - API Documentation
- [D3.js](https://d3js.org/) - Visualization library
- [Next.js](https://nextjs.org/) - React framework
- [GitHub Repository](https://github.com/acailic/vizualni-admin)

## Support

For issues or questions:
- [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- [data.gov.rs Support](https://data.gov.rs)
