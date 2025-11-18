# Data.gov.rs API Integration

This module provides a TypeScript client for interacting with the Serbian Open Data Portal API.

## Features

- **Type-safe API client** - Full TypeScript support with comprehensive types
- **Pagination support** - Easy navigation through large datasets
- **Error handling** - Robust error handling with detailed error messages
- **Resource utilities** - Helper functions for working with datasets and resources
- **Format detection** - Automatic detection of supported data formats
- **Timeout control** - Configurable request timeouts
- **API key support** - Optional authentication for write operations

## Usage

### Basic Example

```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';

// Search for datasets
const results = await dataGovRsClient.searchDatasets({
  q: 'population',
  page_size: 10
});

console.log(`Found ${results.total} datasets`);
results.data.forEach(dataset => {
  console.log(`- ${dataset.title}`);
});
```

### Get a Specific Dataset

```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';

const dataset = await dataGovRsClient.getDataset('dataset-id');
console.log(dataset.title);
console.log(dataset.description);
console.log(`Resources: ${dataset.resources.length}`);
```

### List Organizations

```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';

const orgs = await dataGovRsClient.listOrganizations();
orgs.data.forEach(org => {
  console.log(`- ${org.name}`);
});
```

### Download Resource Data

```typescript
import { dataGovRsClient, getBestVisualizationResource } from '@/domain/data-gov-rs';

const dataset = await dataGovRsClient.getDataset('dataset-id');
const resource = getBestVisualizationResource(dataset);

if (resource) {
  if (resource.format === 'CSV') {
    const data = await dataGovRsClient.getResourceData(resource);
    // Process CSV data
  } else if (resource.format === 'JSON') {
    const data = await dataGovRsClient.getResourceJSON(resource);
    // Process JSON data
  }
}
```

### Iterate Through All Pages

```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';

const firstPage = await dataGovRsClient.searchDatasets({ page_size: 20 });

for await (const datasets of dataGovRsClient.getAllPages(
  firstPage,
  (page) => dataGovRsClient.searchDatasets({ page, page_size: 20 })
)) {
  datasets.forEach(dataset => {
    console.log(dataset.title);
  });
}
```

### Custom Client Configuration

```typescript
import { createDataGovRsClient } from '@/domain/data-gov-rs';

const client = createDataGovRsClient({
  apiUrl: 'https://data.gov.rs/api/1',
  apiKey: 'your-api-key',
  defaultPageSize: 50,
  timeout: 30000 // 30 seconds
});

const results = await client.searchDatasets({ q: 'budget' });
```

## Utility Functions

### Check Supported Format

```typescript
import { isSupportedFormat } from '@/domain/data-gov-rs';

const resource = { format: 'CSV', /* ... */ };
if (isSupportedFormat(resource)) {
  // Process the resource
}
```

### Get Best Visualization Resource

```typescript
import { getBestVisualizationResource } from '@/domain/data-gov-rs';

const dataset = await dataGovRsClient.getDataset('dataset-id');
const resource = getBestVisualizationResource(dataset);
// Returns the most suitable resource for visualization (CSV, JSON, etc.)
```

### Format File Size

```typescript
import { formatFileSize } from '@/domain/data-gov-rs';

console.log(formatFileSize(1024)); // "1.00 KB"
console.log(formatFileSize(1048576)); // "1.00 MB"
```

### Build Portal URLs

```typescript
import { buildDatasetUrl, buildOrganizationUrl } from '@/domain/data-gov-rs';

const datasetUrl = buildDatasetUrl('dataset-id');
// https://data.gov.rs/sr/datasets/dataset-id

const orgUrl = buildOrganizationUrl('org-id');
// https://data.gov.rs/sr/organizations/org-id
```

## Error Handling

```typescript
import { dataGovRsClient } from '@/domain/data-gov-rs';
import type { ApiError } from '@/domain/data-gov-rs';

try {
  const dataset = await dataGovRsClient.getDataset('invalid-id');
} catch (error) {
  const apiError = error as ApiError;
  console.error(`Error ${apiError.status}: ${apiError.message}`);
  if (apiError.details) {
    console.error('Details:', apiError.details);
  }
}
```

## Environment Variables

Configure the client using environment variables:

```env
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=your-api-key-here
```

## Types

### DatasetMetadata

```typescript
interface DatasetMetadata {
  id: string;
  title: string;
  description: string;
  organization: Organization;
  resources: Resource[];
  tags: string[];
  created_at: string;
  updated_at: string;
  frequency?: string;
  spatial?: string;
  temporal_start?: string;
  temporal_end?: string;
  license?: string;
  license_url?: string;
}
```

### Organization

```typescript
interface Organization {
  id: string;
  name: string;
  title?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}
```

### Resource

```typescript
interface Resource {
  id: string;
  title: string;
  description?: string;
  format: string;
  url: string;
  created_at: string;
  updated_at?: string;
  filesize?: number;
  mimetype?: string;
}
```

## API Documentation

For complete API documentation, visit:
https://data.gov.rs/apidoc/

## Contributing

When adding new features:
1. Add types to `types.ts`
2. Add methods to `client.ts`
3. Add utilities to `utils.ts`
4. Update this README
5. Add tests

## Testing

```typescript
// Example test
import { dataGovRsClient } from '@/domain/data-gov-rs';

describe('DataGovRsClient', () => {
  it('should search datasets', async () => {
    const results = await dataGovRsClient.searchDatasets({ q: 'test' });
    expect(results.data).toBeInstanceOf(Array);
  });
});
```
