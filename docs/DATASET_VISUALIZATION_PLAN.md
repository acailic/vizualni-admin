# Dataset Visualization Plan - data.gov.rs

This document outlines ideas for creating interesting visualizations and demos using datasets from the Serbian Open Data Portal (data.gov.rs).

## Current State of data.gov.rs

- **93 organizations** actively publishing data
- **6,162 resources** available (as of 2024)
- **3,000+ open datasets** covering various social areas
- **Categories**: public finance, mobility, education, energy, administration, policing, health, environment, judiciary

## Available Visualization Types

The vizualni-admin tool supports:
- **Line charts** - Time series, trends
- **Bar charts** - Comparisons, rankings
- **Column charts** - Grouped and stacked data
- **Area charts** - Cumulative data over time
- **Pie charts** - Proportions and distributions
- **Scatterplot** - Correlations and patterns
- **Maps** - Geographical data
- **Combo charts** - Multiple metrics (line + column, dual axes)

## Proposed Demo Visualizations

### 1. Public Finance & Budget

**Dataset Ideas:**
- National budget breakdown by ministry
- Municipal budgets across Serbian cities
- Government spending trends over time
- Tax revenue by category

**Visualization Ideas:**
- **Stacked column chart**: Annual budget allocation by category (2020-2024)
- **Pie chart**: Current year budget distribution across ministries
- **Line chart**: Budget execution rate over time
- **Combo chart**: Budget planned vs. actual spending (columns + line for variance)

**Technical Approach:**
```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';

// Search for budget datasets
const budgetDatasets = await dataGovRsClient.searchDatasets({
  q: 'budzet',
  tag: 'finansije',
  page_size: 20
});

// Get CSV/JSON resource and visualize
const dataset = await dataGovRsClient.getDataset('budget-dataset-id');
const resource = getBestVisualizationResource(dataset);
const data = await dataGovRsClient.getResourceJSON(resource);
```

**Demo Page:** `/demos/budgets` - Interactive budget explorer

---

### 2. Environmental Data

**Dataset Ideas:**
- Air quality measurements (PM2.5, PM10) across cities
- Pollen levels (xEko Pollen dataset)
- Temperature and precipitation trends
- Waste management statistics

**Visualization Ideas:**
- **Map visualization**: Air quality index by city with color coding
- **Line chart**: Air quality trends over the year
- **Area chart**: Pollen concentration by type over seasons
- **Scatterplot**: Correlation between traffic density and air pollution

**Demo Page:** `/demos/environment` - Environmental dashboard

---

### 3. Demographics & Population

**Dataset Ideas:**
- Population by age group and gender
- Population density by region
- Migration statistics
- Birth and death rates

**Visualization Ideas:**
- **Population pyramid**: Age and gender distribution
- **Map**: Population density heat map of Serbia
- **Line chart**: Population trends 2000-2024
- **Bar chart**: Top 10 cities by population

**Demo Page:** `/demos/demographics` - Serbia demographics explorer

---

### 4. Education Statistics

**Dataset Ideas:**
- Number of students by education level
- Schools by region
- Teacher-to-student ratios
- University enrollment trends

**Visualization Ideas:**
- **Column chart**: Students enrolled by education level
- **Map**: Distribution of schools across Serbia
- **Line chart**: University enrollment trends over time
- **Combo chart**: Number of schools vs. enrollment rate

**Demo Page:** `/demos/education` - Education statistics dashboard

---

### 5. Transportation & Mobility

**Dataset Ideas:**
- Traffic accident statistics
- Public transport usage
- Road infrastructure data
- Vehicle registration statistics

**Visualization Ideas:**
- **Map**: Traffic accidents by location with severity indicators
- **Bar chart**: Accident types and frequencies
- **Line chart**: Public transport ridership trends
- **Pie chart**: Vehicle registrations by type (cars, trucks, motorcycles)

**Demo Page:** `/demos/transport` - Transportation safety dashboard

---

### 6. Healthcare

**Dataset Ideas:**
- Hospital capacity by region
- Disease incidence rates
- Vaccination coverage
- Healthcare spending

**Visualization Ideas:**
- **Map**: Hospital locations and bed capacity
- **Line chart**: Disease trends over time
- **Column chart**: Vaccination rates by age group
- **Bar chart**: Healthcare spending per capita by region

**Demo Page:** `/demos/healthcare` - Healthcare overview

---

### 7. Energy & Utilities

**Dataset Ideas:**
- Energy production by source (hydro, thermal, renewable)
- Electricity consumption trends
- Energy prices
- Renewable energy capacity

**Visualization Ideas:**
- **Stacked area chart**: Energy mix over time
- **Line chart**: Electricity consumption trends
- **Pie chart**: Current energy production by source
- **Map**: Renewable energy installations locations

**Demo Page:** `/demos/energy` - Energy dashboard

---

### 8. Comparative Multi-City Dashboard

**Concept:** Compare multiple Serbian cities across various metrics

**Visualization Ideas:**
- **Grouped bar chart**: Population, budget, schools across top 5 cities
- **Scatterplot**: Budget per capita vs. population
- **Small multiples**: Mini line charts showing trends for each city
- **Map**: Interactive city selector with drill-down

**Demo Page:** `/demos/cities` - City comparison tool

---

## Implementation Strategy

### Phase 1: Research & Data Discovery (Week 1)
1. Browse data.gov.rs API to identify high-quality datasets
2. Test API endpoints with the existing `dataGovRsClient`
3. Document dataset IDs and resource formats
4. Validate data quality and completeness

### Phase 2: Build Foundation (Week 2)
1. Create a `/demos` route in the Next.js app
2. Build reusable data fetching hooks:
   ```typescript
   // hooks/useDataGovRsDataset.ts
   export function useDataGovRsDataset(datasetId: string) {
     // Fetch and cache dataset
   }
   ```
3. Create demo layout component with navigation
4. Set up example data transformers

### Phase 3: Build Individual Demos (Week 3-5)
1. Start with budget visualization (easiest, proven data exists)
2. Build environment dashboard (air quality + maps)
3. Add demographics explorer
4. Implement 2-3 additional demos based on data availability

### Phase 4: Polish & Documentation (Week 6)
1. Add Serbian and English translations for all demos
2. Create user guide for each visualization
3. Add export functionality (PNG, SVG, CSV)
4. Performance optimization
5. Add error handling and loading states

## Technical Components Needed

### 1. Data Fetching Layer
```typescript
// lib/demos/data-fetchers.ts
export async function fetchBudgetData(year: number) {
  const dataset = await dataGovRsClient.getDataset('budget-id');
  const resource = getBestVisualizationResource(dataset);
  const rawData = await dataGovRsClient.getResourceJSON(resource);
  return transformBudgetData(rawData);
}
```

### 2. Data Transformers
```typescript
// lib/demos/transformers.ts
export function transformBudgetData(raw: any) {
  // Transform API data to chart-ready format
  return {
    dimensions: [...],
    measures: [...],
    observations: [...]
  };
}
```

### 3. Demo Components
```typescript
// pages/demos/[category].tsx
export default function DemoPage({ category }: { category: string }) {
  const data = useDemoData(category);
  return (
    <DemoLayout title={...}>
      <ChartArea config={...} />
      <DataTable data={data} />
      <ExportControls />
    </DemoLayout>
  );
}
```

### 4. Demo Configuration
```typescript
// config/demos.ts
export const DEMO_CONFIGS = {
  budgets: {
    title: { sr: 'Budžeti', en: 'Budgets' },
    description: { sr: '...', en: '...' },
    datasets: ['budget-2024', 'budget-2023'],
    defaultChart: 'column',
    availableCharts: ['column', 'pie', 'line']
  },
  // ... other demos
};
```

## Data Quality Considerations

1. **Missing data handling**: Implement graceful fallbacks
2. **Data validation**: Check for required fields before visualization
3. **Date parsing**: Handle multiple date formats (Serbian locale)
4. **Number formatting**: Use Serbian number format (decimal comma)
5. **Caching**: Cache dataset metadata to reduce API calls

## Localization

All demos should support:
- **Serbian (Cyrillic)**: Primary language
- **Serbian (Latin)**: Alternative script
- **English**: International users

Example:
```typescript
const t = {
  sr: 'Budžet Republike Srbije 2024',
  en: 'Republic of Serbia Budget 2024'
};
```

## User Experience Features

1. **Interactive filters**: Date range, category, region
2. **Drill-down**: Click to see detailed data
3. **Tooltips**: Show exact values on hover
4. **Export**: Download charts as PNG/SVG, data as CSV
5. **Share**: Generate shareable URLs
6. **Embed**: Provide embed code for external websites
7. **Responsive**: Works on mobile, tablet, desktop
8. **Accessibility**: Screen reader support, keyboard navigation

## Success Metrics

1. **Coverage**: At least 5 diverse demo categories
2. **Performance**: Page load < 3s, chart render < 1s
3. **Data freshness**: Auto-update when new data available
4. **Usage**: Track which demos are most popular
5. **Quality**: Zero console errors, 90+ Lighthouse score

## Examples from Similar Projects

Reference the budget visualization at https://budzeti.data.gov.rs/ as inspiration for:
- Clean, professional design
- Serbian language localization
- Interactive filtering
- Multi-year comparisons

## Next Steps

1. **Immediate**: Explore data.gov.rs API to find specific dataset IDs
2. **This week**: Build first demo (budget or environment)
3. **Ongoing**: Add one new demo per week
4. **Long-term**: Build a demo gallery landing page

## Resources

- **API Documentation**: https://data.gov.rs/apidoc/
- **Portal**: https://data.gov.rs/sr/datasets/
- **Dashboard**: https://data.gov.rs/sr/dashboard/
- **Budget Example**: https://budzeti.data.gov.rs/
- **Open Data Hub**: https://hub.data.gov.rs/en/home/

---

## Quick Start: Building Your First Demo

```bash
# 1. Find interesting datasets
curl https://data.gov.rs/api/1/datasets/?q=budget&page_size=5

# 2. Create a demo page
touch app/pages/demos/budget.tsx

# 3. Add data fetching
# (Use the existing dataGovRsClient)

# 4. Add visualization
# (Use existing chart components)

# 5. Test locally
yarn dev

# 6. Deploy to GitHub Pages
yarn build:static
```

## Questions to Research

1. Which datasets have the best data quality?
2. Which datasets are updated most frequently?
3. Are there datasets with historical data (5+ years)?
4. Which datasets have geographic coordinates for mapping?
5. Are there APIs for real-time data (e.g., air quality)?

## Collaboration Opportunities

- Contact data.gov.rs administrators for featured datasets
- Reach out to organizations publishing high-quality data
- Showcase demos to encourage more data publication
- Contribute back improvements to the open data ecosystem
