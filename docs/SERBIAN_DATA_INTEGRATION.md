# Serbian Open Data Integration

This document describes how Vizualni Admin integrates with the Serbian Open Data Portal (data.gov.rs).

## Overview

The Serbian Open Data Portal provides a RESTful API for accessing datasets, organizations, and resources published by Serbian public institutions.

## API Endpoints

Base URL: `https://data.gov.rs/api/1/`

### Main Endpoints

- **Datasets**: `/api/1/datasets/` - List and manage datasets
- **Organizations**: `/api/1/organizations/` - List publishing organizations
- **Resources**: `/api/1/resources/` - Access data resources and files

## Authentication

For read-only operations, authentication is optional. For write operations (creating/updating datasets), you need an API key.

### Getting an API Key

1. Register at https://data.gov.rs
2. Go to your profile settings
3. Generate an API key
4. Add it to your `.env.local` file:
   ```
   DATA_GOV_RS_API_KEY=your_api_key_here
   ```

### Using the API Key

Include the API key in the `X-API-KEY` HTTP header:
```javascript
headers: {
  'X-API-KEY': process.env.DATA_GOV_RS_API_KEY
}
```

## Data Structure

### Dataset Object

```json
{
  "id": "dataset-id",
  "title": "Dataset Title",
  "description": "Dataset description",
  "organization": {
    "id": "org-id",
    "name": "Organization Name"
  },
  "resources": [
    {
      "id": "resource-id",
      "title": "Resource Title",
      "format": "CSV",
      "url": "https://data.gov.rs/..."
    }
  ],
  "tags": ["tag1", "tag2"],
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

## Pagination

API responses use pagination:

```json
{
  "data": [...],
  "page": 1,
  "page_size": 20,
  "total": 100,
  "next_page": "https://data.gov.rs/api/1/datasets/?page=2",
  "previous_page": null
}
```

## Supported Data Formats

The portal supports various data formats:
- CSV
- JSON
- XML
- XLS/XLSX
- GeoJSON (for geographic data)
- RDF (for linked data)

## Language Support

The API supports multiple languages:
- Serbian (Cyrillic): `sr`
- Serbian (Latin): `sr-Latn`
- English: `en`

Set the language using the `Accept-Language` header:
```
Accept-Language: sr
```

## Example API Calls

### List Datasets

```bash
curl https://data.gov.rs/api/1/datasets/?page_size=10
```

### Get a Specific Dataset

```bash
curl https://data.gov.rs/api/1/datasets/{dataset-id}/
```

### Search Datasets

```bash
curl https://data.gov.rs/api/1/datasets/?q=query&page_size=10
```

### Filter by Organization

```bash
curl https://data.gov.rs/api/1/datasets/?organization={org-id}
```

## Integration in Vizualni Admin

### Configuration

The data source is configured in the environment variables:

```env
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=your_api_key
```

### Data Fetching

Data is fetched using the API client located in:
- `app/domain/data-gov-rs/` - API client implementation
- `app/graphql/` - GraphQL resolvers for data.gov.rs

### Caching

To improve performance, API responses are cached:
- Server-side caching with Redis (optional)
- Client-side caching with React Query
- Static generation for public datasets

### Error Handling

The integration includes comprehensive error handling:
- Network errors
- API rate limits
- Invalid data formats
- Missing resources

## Rate Limiting

The API may have rate limits. Best practices:
- Cache responses when possible
- Use pagination efficiently
- Implement exponential backoff for retries
- Monitor API usage

## Security

- Never commit API keys to version control
- Use environment variables for sensitive data
- Validate all data from the API
- Sanitize user inputs
- Use HTTPS for all API calls

## Resources

- API Documentation: https://data.gov.rs/apidoc/
- Data Portal: https://data.gov.rs
- Open Data Hub: https://hub.data.gov.rs/en/resources/

## Contributing

When adding new features related to data.gov.rs integration:
1. Follow the existing patterns in `app/domain/data-gov-rs/`
2. Add tests for new API endpoints
3. Update this documentation
4. Test with real data from the portal
