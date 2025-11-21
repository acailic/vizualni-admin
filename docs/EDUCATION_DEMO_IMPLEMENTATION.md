# Education Statistics Demo - Implementation Guide

## Overview

This document explains how the Education Statistics demo is implemented in the vizualni-admin project, including configuration, data transformation, and bilingual support.

## 1. Demo Configuration

The education demo is configured in `app/lib/demos/config.ts`:

```typescript
education: {
  id: 'education',
  title: {
    sr: '🎓 Statistika obrazovanja',
    en: '🎓 Education Statistics'
  },
  description: {
    sr: 'Pregled broja učenika i studenata po nivoima obrazovanja - osnovno, srednje i visoko obrazovanje kroz godine',
    en: 'Overview of student enrollment by education level - elementary, secondary, and higher education over the years'
  },
  searchQuery: 'obrazovanje učenici studenti',
  chartType: 'column',
  tags: ['obrazovanje', 'skole', 'studenti', 'upis'],
  icon: '🎓'
}
```

### Key Configuration Properties:

- **id**: Unique identifier used in the URL (`/demos/education`)
- **title**: Bilingual object with Serbian (sr) and English (en) titles
- **description**: Bilingual descriptions explaining what the demo shows
- **searchQuery**: Keywords used to search data.gov.rs API for relevant datasets
- **chartType**: Initial chart type to use ('column', 'line', 'bar', 'pie', etc.)
- **tags**: Array of tags for categorization
- **icon**: Emoji icon displayed in the demo list

## 2. Data Transformation Functions

Data transformers are located in `app/lib/demos/transformers.ts`. These functions convert raw CSV data from data.gov.rs into formats optimized for chart components.

### 2.1 Main Transformer: `transformEducationData`

This transformer handles CSV data with the structure:
- "School Year" / "Školska godina" (e.g., "2020/2021")
- "Level of Education" / "Nivo obrazovanja" (e.g., "Osnovno", "Srednje", "Visoko")
- "Number of Students" / "Broj učenika" (numeric)

**Input:**
```csv
School Year,Level of Education,Number of Students
2020/2021,Osnovno,500000
2020/2021,Srednje,300000
2020/2021,Visoko,250000
2021/2022,Osnovno,495000
...
```

**Output:**
```typescript
[
  { year: "2020/2021", osnovno: 500000, srednje: 300000, visoko: 250000 },
  { year: "2021/2022", osnovno: 495000, srednje: 298000, visoko: 255000 },
  ...
]
```

**Usage:**
```typescript
import { transformEducationData } from '@/lib/demos/transformers';

const transformedData = transformEducationData(rawData, 'sr');
```

### 2.2 Simple Transformer: `transformEducationDataSimple`

Use this for a simple year-over-year comparison without grouping by education level.

**Output:**
```typescript
[
  { year: "2020/2021", students: 1050000 },
  { year: "2021/2022", students: 1048000 },
  ...
]
```

**Usage:**
```typescript
import { transformEducationDataSimple } from '@/lib/demos/transformers';

const simpleData = transformEducationDataSimple(rawData);
```

### 2.3 Distribution Transformer: `transformEducationLevelDistribution`

Creates a snapshot for a specific year, useful for pie charts or bar charts showing education level distribution.

**Output:**
```typescript
[
  { level: "osnovno", students: 500000 },
  { level: "srednje", students: 300000 },
  { level: "visoko", students: 250000 }
]
```

**Usage:**
```typescript
import { transformEducationLevelDistribution } from '@/lib/demos/transformers';

const distribution = transformEducationLevelDistribution(rawData, '2024', 'sr');
```

## 3. Using the Transformers in a Demo Page

### Option A: Dynamic Page (Automatic - Default)

The education demo automatically uses the dynamic page at `app/pages/demos/[category].tsx`. This page:

1. Uses the `useDataGovRs` hook to fetch data based on the `searchQuery`
2. Automatically parses CSV data
3. Passes data to `SimpleChart` or `ChartVisualizer` components
4. Auto-detects columns for visualization

**No additional code needed!** The demo will work out of the box by visiting `/demos/education`.

### Option B: Custom Page (Manual - For Advanced Use)

To create a custom education page with transformers:

```typescript
// app/pages/demos/education.tsx
import { useRouter } from 'next/router';
import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { useDataGovRs } from '@/hooks/use-data-gov-rs';
import { transformEducationData } from '@/lib/demos/transformers';

export default function EducationDemo() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Fetch data from data.gov.rs
  const { data, loading, error } = useDataGovRs({
    searchQuery: 'obrazovanje učenici studenti',
    autoFetch: true
  });

  // Transform data
  const transformedData = data ? transformEducationData(data, locale) : [];

  const title = locale === 'sr'
    ? '🎓 Statistika obrazovanja'
    : '🎓 Education Statistics';

  const description = locale === 'sr'
    ? 'Pregled broja učenika po nivoima obrazovanja'
    : 'Overview of student enrollment by education level';

  return (
    <DemoLayout title={title} description={description}>
      {loading && <p>Učitavanje...</p>}
      {error && <p>Greška: {error.message}</p>}
      {transformedData.length > 0 && (
        <ColumnChart
          data={transformedData}
          xKey="year"
          yKey={['osnovno', 'srednje', 'visoko']}
          multiSeries={true}
          stacked={false}
          width={1000}
          height={500}
          xLabel={locale === 'sr' ? 'Školska godina' : 'School Year'}
          yLabel={locale === 'sr' ? 'Broj učenika' : 'Number of Students'}
        />
      )}
    </DemoLayout>
  );
}
```

## 4. Chart Component Data Requirements

### ColumnChart Component

Located at: `app/components/demos/charts/ColumnChart.tsx`

**Props:**
```typescript
interface ColumnChartProps {
  data: Array<Record<string, any>>;  // Array of objects
  xKey: string;                       // Key for X-axis (e.g., 'year')
  yKey: string | string[];            // Key(s) for Y-axis values
  width?: number;                     // Default: 800
  height?: number;                    // Default: 400
  margin?: { top, right, bottom, left };
  colors?: string[];                  // Array of colors for multi-series
  xLabel?: string;                    // X-axis label
  yLabel?: string;                    // Y-axis label
  multiSeries?: boolean;              // Enable multi-series mode
  stacked?: boolean;                  // Stack bars instead of grouping
  showZeroLine?: boolean;             // Show zero reference line
}
```

**Example - Single Series:**
```typescript
<ColumnChart
  data={[
    { year: '2020', students: 1000000 },
    { year: '2021', students: 980000 },
  ]}
  xKey="year"
  yKey="students"
/>
```

**Example - Multi-Series (Grouped):**
```typescript
<ColumnChart
  data={[
    { year: '2020', osnovno: 500000, srednje: 300000, visoko: 200000 },
    { year: '2021', osnovno: 490000, srednje: 295000, visoko: 205000 },
  ]}
  xKey="year"
  yKey={['osnovno', 'srednje', 'visoko']}
  multiSeries={true}
  stacked={false}
/>
```

**Example - Multi-Series (Stacked):**
```typescript
<ColumnChart
  data={[
    { year: '2020', osnovno: 500000, srednje: 300000, visoko: 200000 },
    { year: '2021', osnovno: 490000, srednje: 295000, visoko: 205000 },
  ]}
  xKey="year"
  yKey={['osnovno', 'srednje', 'visoko']}
  multiSeries={true}
  stacked={true}
/>
```

## 5. Bilingual Title Handling

### Approach 1: Config-Based (Recommended)

Define bilingual titles in the demo config (`app/lib/demos/config.ts`):

```typescript
title: {
  sr: '🎓 Statistika obrazovanja',
  en: '🎓 Education Statistics'
}
```

Then access them in your component:

```typescript
import { useRouter } from 'next/router';
import { getDemoConfig } from '@/lib/demos/config';

const router = useRouter();
const locale = (router.locale || 'sr') as 'sr' | 'en';
const config = getDemoConfig('education');
const title = config?.title[locale];
```

### Approach 2: Helper Functions

Use the provided helper functions:

```typescript
import { getDemoTitle, getDemoDescription } from '@/lib/demos/config';

const title = getDemoTitle('education', 'sr');        // Returns Serbian title
const description = getDemoDescription('education', 'en');  // Returns English description
```

### Approach 3: Custom Translation Object

For page-specific translations:

```typescript
const translations = {
  sr: {
    title: 'Statistika obrazovanja',
    chartTitle: 'Broj učenika po nivoima',
    elementary: 'Osnovno',
    secondary: 'Srednje',
    higher: 'Visoko',
    year: 'Školska godina',
    students: 'Broj učenika'
  },
  en: {
    title: 'Education Statistics',
    chartTitle: 'Students by Education Level',
    elementary: 'Elementary',
    secondary: 'Secondary',
    higher: 'Higher',
    year: 'School Year',
    students: 'Number of Students'
  }
};

const t = translations[locale];
```

### Approach 4: Column Names in Data

The transformer functions handle bilingual column names automatically:

```typescript
// Detects both Serbian and English column names
const yearColumn = detectColumn(rawData[0], [
  'School Year', 'Školska godina', 'školska godina',
  'Year', 'Godina', 'godina'
]);
```

You can also normalize education level names based on locale:

```typescript
// Returns 'osnovno' for Serbian, 'elementary' for English
const level = normalizeEducationLevel('Osnovno obrazovanje', locale);
```

## 6. Complete Example: Custom Education Page

Here's a complete example with all features:

```typescript
// app/pages/demos/education-custom.tsx
import { Alert, Box, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { PieChart } from '@/components/demos/charts/PieChart';
import { DemoLayout, DemoLoading, DemoError } from '@/components/demos/demo-layout';
import { useDataGovRs } from '@/hooks/use-data-gov-rs';
import {
  transformEducationData,
  transformEducationLevelDistribution
} from '@/lib/demos/transformers';

export default function EducationDemoCustom() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Translations
  const t = {
    sr: {
      title: '🎓 Statistika obrazovanja',
      description: 'Analiza broja učenika i studenata po nivoima obrazovanja',
      trendTitle: 'Trendovi upisa po nivoima obrazovanja',
      distributionTitle: 'Distribucija učenika (najnoviji podaci)',
      elementary: 'Osnovno',
      secondary: 'Srednje',
      higher: 'Visoko',
      year: 'Školska godina',
      students: 'Broj učenika',
      loading: 'Učitavanje podataka...',
      error: 'Greška pri učitavanju podataka'
    },
    en: {
      title: '🎓 Education Statistics',
      description: 'Analysis of student enrollment by education level',
      trendTitle: 'Enrollment Trends by Education Level',
      distributionTitle: 'Student Distribution (Latest Data)',
      elementary: 'Elementary',
      secondary: 'Secondary',
      higher: 'Higher',
      year: 'School Year',
      students: 'Number of Students',
      loading: 'Loading data...',
      error: 'Error loading data'
    }
  }[locale];

  // Fetch data
  const { data, loading, error, refetch } = useDataGovRs({
    searchQuery: 'obrazovanje učenici studenti',
    autoFetch: true
  });

  // Transform data
  const trendData = useMemo(() => {
    return data ? transformEducationData(data, locale) : [];
  }, [data, locale]);

  const distributionData = useMemo(() => {
    return data ? transformEducationLevelDistribution(data, undefined, locale) : [];
  }, [data, locale]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (trendData.length === 0) return null;

    const latest = trendData[trendData.length - 1];
    const levelKey = locale === 'sr' ? 'osnovno' : 'elementary';
    const totalStudents = Object.keys(latest)
      .filter(key => key !== 'year')
      .reduce((sum, key) => sum + (latest[key] || 0), 0);

    return {
      totalStudents,
      latestYear: latest.year,
      elementary: latest[levelKey] || 0
    };
  }, [trendData, locale]);

  return (
    <DemoLayout
      title={t.title}
      description={t.description}
    >
      {loading && <DemoLoading />}
      {error && <DemoError error={error} onRetry={refetch} />}

      {!loading && !error && trendData.length > 0 && (
        <Box>
          {/* Statistics Cards */}
          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      {t.students} ({stats.latestYear})
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalStudents.toLocaleString('sr-RS')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Trend Chart */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              {t.trendTitle}
            </Typography>
            <ColumnChart
              data={trendData}
              xKey="year"
              yKey={
                locale === 'sr'
                  ? ['osnovno', 'srednje', 'visoko']
                  : ['elementary', 'secondary', 'higher']
              }
              multiSeries={true}
              stacked={false}
              width={1000}
              height={500}
              xLabel={t.year}
              yLabel={t.students}
              colors={['#4CAF50', '#2196F3', '#FF9800']}
            />
          </Paper>

          {/* Distribution Pie Chart */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              {t.distributionTitle}
            </Typography>
            <PieChart
              data={distributionData}
              labelKey="level"
              valueKey="students"
              width={800}
              height={600}
            />
          </Paper>
        </Box>
      )}
    </DemoLayout>
  );
}
```

## 7. Testing the Demo

### Test the automatic dynamic page:
```bash
# Development server
npm run dev

# Visit
http://localhost:3000/demos/education
```

### Test with custom transformers:
```typescript
// In browser console or test file
import { transformEducationData } from '@/lib/demos/transformers';

const sampleData = [
  { 'Školska godina': '2020/2021', 'Nivo obrazovanja': 'Osnovno', 'Broj učenika': 500000 },
  { 'Školska godina': '2020/2021', 'Nivo obrazovanja': 'Srednje', 'Broj učenika': 300000 },
  { 'Školska godina': '2021/2022', 'Nivo obrazovanja': 'Osnovno', 'Broj učenika': 495000 },
];

const result = transformEducationData(sampleData, 'sr');
console.log(result);
// Expected: [
//   { year: '2020/2021', osnovno: 500000, srednje: 300000 },
//   { year: '2021/2022', osnovno: 495000 }
// ]
```

## 8. Deployment

The demo works with static export for GitHub Pages:

```bash
# Build static export
npm run build:static

# The education demo will be pre-rendered at:
# out/demos/education.html
```

## 9. Troubleshooting

### Issue: Columns not detected
**Solution:** Check that your CSV column names match one of the patterns in the transformer. Add your specific column name to the detection array.

### Issue: Data not transforming correctly
**Solution:** Log the raw data structure and verify it matches expected format:
```typescript
console.log('Raw data sample:', data[0]);
console.log('Available columns:', Object.keys(data[0]));
```

### Issue: Chart not rendering
**Solution:** Verify data format matches chart requirements:
```typescript
console.log('Transformed data:', transformedData);
// Should be array of objects with xKey and yKey properties
```

## 10. Summary

✅ **Demo Configuration**: Updated in `app/lib/demos/config.ts` with enhanced bilingual titles and description

✅ **Data Transformers**: Created in `app/lib/demos/transformers.ts` with three transformer functions:
   - `transformEducationData()` - Multi-series data grouped by education level
   - `transformEducationDataSimple()` - Simple year-over-year totals
   - `transformEducationLevelDistribution()` - Distribution snapshot for a specific year

✅ **Chart Component**: `ColumnChart` supports single-series, multi-series grouped, and stacked modes

✅ **Bilingual Support**: Four approaches provided for handling Serbian/English translations

✅ **Usage**: Works automatically with dynamic page or can be customized with a dedicated page

The education demo is now ready to use! Visit `/demos/education` to see it in action.
