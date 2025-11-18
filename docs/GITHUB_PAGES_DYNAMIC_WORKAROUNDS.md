# GitHub Pages Dynamic Content Workarounds

This document explains how to implement dynamic features on GitHub Pages using Next.js static export.

## The Challenge

GitHub Pages only serves static files, but we need dynamic features like:
- Loading datasets from data.gov.rs API
- Dynamic routes (e.g., `/demos/budget`, `/demos/environment`)
- User interactions and filters

## Solution: Client-Side Data Fetching

Instead of server-side rendering (SSR), we fetch data in the browser after the page loads.

## Pattern 1: Client-Side API Calls for Demos

### ✅ Works on GitHub Pages
```typescript
// pages/demos/[category].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { dataGovRsClient } from '@/domain/data-gov-rs';

export default function DemoPage() {
  const router = useRouter();
  const { category } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    async function fetchData() {
      try {
        setLoading(true);
        // Fetch from data.gov.rs API directly in browser
        const results = await dataGovRsClient.searchDatasets({
          q: category as string,
          page_size: 10
        });
        setData(results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Render visualization */}</div>;
}

// CRITICAL: Use getStaticPaths to pre-generate known routes
export async function getStaticPaths() {
  return {
    paths: [
      { params: { category: 'budget' } },
      { params: { category: 'environment' } },
      { params: { category: 'demographics' } },
      { params: { category: 'education' } },
      { params: { category: 'transport' } },
    ],
    fallback: false // strict mode for static export
  };
}

// CRITICAL: Use getStaticProps (not getServerSideProps)
export async function getStaticProps({ params }: { params: { category: string } }) {
  return {
    props: {
      category: params.category,
      // Don't fetch data here, do it client-side
    },
  };
}
```

### ❌ Does NOT work on GitHub Pages
```typescript
// This will fail during build
export async function getServerSideProps() {
  const data = await fetch('...');
  return { props: { data } };
}
```

## Pattern 2: Static Generation with Known Dataset IDs

If you know the dataset IDs at build time, you can pre-fetch and generate static pages:

```typescript
// pages/datasets/[id].tsx
export default function DatasetPage({ dataset, chartData }) {
  return (
    <div>
      <h1>{dataset.title}</h1>
      <ChartColumn data={chartData} />
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch popular dataset IDs at build time
  const datasets = await dataGovRsClient.searchDatasets({
    page_size: 50,
    sort: 'views',
    order: 'desc'
  });

  return {
    paths: datasets.data.map((d) => ({
      params: { id: d.id }
    })),
    fallback: false // Only generate pages for known IDs (required for next export)
  };
}

export async function getStaticProps({ params }) {
  const dataset = await dataGovRsClient.getDataset(params.id);
  const resource = getBestVisualizationResource(dataset);
  const rawData = await dataGovRsClient.getResourceJSON(resource);

  return {
    props: {
      dataset,
      chartData: transformData(rawData)
    },
    // NOTE: `revalidate` (ISR) does NOT work on GitHub Pages; this will be ignored in static export
  };
}
```

**Note**: With `fallback: 'blocking'`, Next.js will generate pages on-demand. However, on GitHub Pages, this won't work for new IDs after deployment. Set `fallback: false` for strict static generation.

## Pattern 3: Hybrid Approach (Recommended for Demos)

Combine static shell with client-side data:

```typescript
// pages/demos/index.tsx
import { useState, useEffect } from 'react';
import { DemoCard } from '@/components/DemoCard';

const DEMO_CONFIGS = {
  budget: {
    title: 'Budget Visualization',
    description: 'Explore Serbian public budgets',
    searchQuery: 'budzet',
    chartType: 'column'
  },
  environment: {
    title: 'Environment Dashboard',
    description: 'Air quality and environmental data',
    searchQuery: 'kvalitet vazduha',
    chartType: 'map'
  },
  // ... more demos
};

export default function DemosIndex() {
  const [demosWithData, setDemosWithData] = useState({});

  useEffect(() => {
    // Fetch preview data for each demo client-side
    async function fetchAllDemoData() {
      const entries = await Promise.all(
        Object.entries(DEMO_CONFIGS).map(async ([key, config]) => {
          const results = await dataGovRsClient.searchDatasets({
            q: config.searchQuery,
            page_size: 1
          });
          return [key, results.data[0]];
        })
      );
      const demosData = Object.fromEntries(entries);
      setDemosWithData(demosData);
    }
    fetchAllDemoData();
  }, []);

  return (
    <div>
      <h1>Data Visualization Demos</h1>
      {Object.entries(DEMO_CONFIGS).map(([key, config]) => (
        <DemoCard
          key={key}
          {...config}
          dataset={demosWithData[key]}
          href={`/demos/${key}`}
        />
      ))}
    </div>
  );
}

// Static generation - no data fetching needed
export async function getStaticProps() {
  return {
    props: {},
  };
}
```

## Pattern 4: Using SWR for Better UX

```typescript
import useSWR from 'swr';
import { dataGovRsClient } from '@/domain/data-gov-rs';

const fetcher = async (datasetId: string) => {
  const dataset = await dataGovRsClient.getDataset(datasetId);
  const resource = getBestVisualizationResource(dataset);
  return await dataGovRsClient.getResourceJSON(resource);
};

export default function BudgetDemo() {
  const { data, error, isLoading } = useSWR('budget-2024-id', fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ChartColumn data={data} />;
}
```

## Pattern 5: Pre-computed Data for Fast Loading

For demos, you can pre-fetch data during build and include it in the static bundle:

```typescript
// lib/demos/precomputed-data.ts
// This file is generated during build
export const BUDGET_2024_DATA = {
  // Pre-fetched data
};

// pages/demos/budget.tsx
import { BUDGET_2024_DATA } from '@/lib/demos/precomputed-data';

export default function BudgetDemo() {
  const [data, setData] = useState(BUDGET_2024_DATA);

  // Optionally refresh from API
  useEffect(() => {
    dataGovRsClient.getDataset('budget-2024').then(freshData => {
      setData(freshData);
    });
  }, []);

  return <ChartColumn data={data} />;
}
```

Build script:
```javascript
// scripts/prebuild-demos.js
const fs = require('fs');
const { dataGovRsClient } = require('../app/domain/data-gov-rs');

async function prebuildDemos() {
  const budgetData = await dataGovRsClient.getDataset('budget-2024-id');
  const resource = getBestVisualizationResource(budgetData);
  const data = await dataGovRsClient.getResourceJSON(resource);

  const output = `
export const BUDGET_2024_DATA = ${JSON.stringify(data, null, 2)};
  `;

  fs.writeFileSync('app/lib/demos/precomputed-data.ts', output);
}

prebuildDemos();
```

Update `package.json`:
```json
{
  "scripts": {
    "prebuild": "node scripts/prebuild-demos.js",
    "build:static": "yarn prebuild && NEXT_PUBLIC_BASE_PATH=/vizualni-admin next build"
  }
}
```

## CORS Considerations

When fetching from data.gov.rs API client-side, ensure CORS is allowed. If not:

### Option A: Use a CORS proxy (development only)
```typescript
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api/proxy'
  : 'https://data.gov.rs/api/1';
```

### Option B: Pre-fetch all data at build time
```typescript
// Generate static JSON files during build
// public/data/budget-2024.json
// public/data/environment-2024.json

// Then fetch from your own domain
const data = await fetch('/vizualni-admin/data/budget-2024.json');
```

## Complete Example: Budget Demo

```typescript
// pages/demos/budget.tsx
import { useState, useEffect } from 'react';
import { dataGovRsClient } from '@/domain/data-gov-rs';
import { ChartColumn } from '@/charts/column/chart-column';

interface BudgetData {
  ministry: string;
  amount: number;
  year: number;
}

export default function BudgetDemo() {
  const [data, setData] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        setLoading(true);
        setError(null);

        // Search for budget datasets
        const results = await dataGovRsClient.searchDatasets({
          q: `budzet ${selectedYear}`,
          page_size: 1
        });

        if (results.data.length === 0) {
          throw new Error('No budget data found');
        }

        const dataset = results.data[0];
        const resource = getBestVisualizationResource(dataset);

        if (!resource) {
          throw new Error('No suitable resource found');
        }

        const rawData = await dataGovRsClient.getResourceJSON(resource);

        // Transform to chart format
        const chartData = transformBudgetData(rawData);
        setData(chartData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBudgetData();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading budget data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="demo-container">
      <h1>Serbian Budget {selectedYear}</h1>

      <div className="year-selector">
        {[2020, 2021, 2022, 2023, 2024].map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={selectedYear === year ? 'active' : ''}
          >
            {year}
          </button>
        ))}
      </div>

      <ChartColumn
        data={data}
        config={{
          fields: {
            x: { componentIri: 'ministry' },
            y: { componentIri: 'amount' }
          }
        }}
      />
    </div>
  );
}

function transformBudgetData(rawData: any): BudgetData[] {
  // Transform API response to chart-ready format
  // This depends on the actual structure of data.gov.rs datasets
  return rawData.map((row: any) => ({
    ministry: row.ministry_name || row.naziv,
    amount: parseFloat(row.amount || row.iznos),
    year: parseInt(row.year || row.godina)
  }));
}

// REQUIRED for static export
export async function getStaticProps() {
  return {
    props: {},
  };
}
```

## Testing Locally

```bash
# Test static export locally
yarn build:static

# Serve the static files
npx serve out

# Or use Python
cd app/out && python3 -m http.server 8000
```

## Deployment Checklist

- [ ] All pages use `getStaticProps` or `getStaticPaths` (NOT `getServerSideProps`)
- [ ] Dynamic data is fetched client-side
- [ ] Known routes are pre-generated in `getStaticPaths`
- [ ] Loading states are implemented
- [ ] Error handling is in place
- [ ] CORS is configured or data is pre-fetched
- [ ] Build completes successfully: `yarn build:static`
- [ ] Local testing works: `npx serve out`

## Summary

| Feature | SSR (getServerSideProps) | SSG (getStaticProps) | Client-Side |
|---------|-------------------------|---------------------|-------------|
| Works on GitHub Pages | ❌ | ✅ | ✅ |
| Dynamic data | ✅ | Partial | ✅ |
| Fast initial load | ✅ | ✅ | ❌ |
| SEO friendly | ✅ | ✅ | Partial |
| Real-time data | ✅ | ❌ | ✅ |

**Recommendation for Demos**: Use **client-side fetching** with **static page shells** for maximum flexibility on GitHub Pages.
