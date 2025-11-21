# Finding Dataset IDs from data.gov.rs

This guide helps you find actual dataset IDs to populate `DEMO_CONFIGS` in `app/lib/demos/config.ts`.

## Automated Script

Run the automated script:

```bash
node scripts/fetch-datagov-ids.js
```

**Requirements:**
- Node.js 18+ (for native `fetch` support)
- Internet connection
- The script might be blocked by data.gov.rs in some environments (403 errors)

If you encounter 403 errors, try:
1. Running from your local machine (not in a server/container environment)
2. Using a VPN
3. Manual search (see below)

## Manual Search Instructions

If the automated script doesn't work, follow these steps:

### 1. Visit data.gov.rs

Open your browser and go to: https://data.gov.rs/

### 2. Search for Keywords

Search for these keywords one by one:
- **budzet** (budget)
- **vazduh** (air)
- **skole** (schools)
- **saobracaj** (traffic)

### 3. Find Dataset ID

For each dataset:

1. Click on the dataset title
2. The URL will look like: `https://data.gov.rs/sr/datasets/{DATASET_ID}/`
3. Copy the `DATASET_ID` from the URL

### 4. Find Resource ID

On the dataset page:

1. Scroll to "Ресурси" (Resources) section
2. Look for resources with formats: **CSV**, **JSON**, **XLSX**, or **XLS**
3. Click "Преузми" (Download) or inspect the download link
4. The resource ID is in the URL: `https://data.gov.rs/sr/resources/{RESOURCE_ID}/`

### 5. Copy Information

For each dataset, note:
- ✅ Dataset Title
- ✅ Dataset ID
- ✅ Resource ID
- ✅ Resource Format (CSV, JSON, XLSX, XLS)
- ✅ Last Updated Date

## Using Browser DevTools (Advanced)

If you want to use the API directly from your browser:

1. Open data.gov.rs in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this JavaScript:

```javascript
// Search for "budzet"
fetch('https://data.gov.rs/api/action/package_search?q=budzet&rows=50')
  .then(r => r.json())
  .then(data => {
    console.log('Results:', data.result.results);
    data.result.results.forEach(ds => {
      console.log(`\nDataset: ${ds.title}`);
      console.log(`ID: ${ds.id}`);
      console.log(`Resources:`, ds.resources.map(r => ({
        id: r.id,
        name: r.name,
        format: r.format
      })));
    });
  });
```

5. Repeat for other keywords: `vazduh`, `skole`, `saobracaj`

## Updating config.ts

Once you have the Dataset IDs, update `app/lib/demos/config.ts`:

```typescript
export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  budget: {
    id: 'budget',
    title: { sr: 'Budžet', en: 'Budget' },
    // ... other fields
    defaultDatasetId: 'YOUR_DATASET_ID_HERE', // ← Add this
  },
  // ... other configs
};
```

## Example Dataset Structure

When you find a dataset, the data structure looks like:

```json
{
  "id": "abc123-def456-ghi789",
  "name": "budzet-republike-srbije-2024",
  "title": "Budžet Republike Srbije 2024",
  "resources": [
    {
      "id": "res123-456-789",
      "name": "Budžet 2024",
      "format": "CSV",
      "url": "https://data.gov.rs/download/...",
      "last_modified": "2024-01-15"
    }
  ]
}
```

## Troubleshooting

### 403 Forbidden Errors

If you get 403 errors:
- ✅ The API might be blocking automated requests
- ✅ Try from your local machine instead of a server
- ✅ Use manual search or browser DevTools method

### No Results Found

If searches return no results:
- ✅ Try alternative keywords (in Serbian): "budžet", "vazdušno", "školama"
- ✅ Check if the portal is accessible: https://data.gov.rs/
- ✅ Browse categories directly on the website

### Invalid Dataset IDs

If dataset IDs don't work:
- ✅ Verify the ID format (usually UUID-like strings)
- ✅ Check if the dataset is still published
- ✅ Ensure resources are in CSV/JSON format

## Need Help?

- 📚 CKAN API Documentation: https://docs.ckan.org/en/latest/api/
- 🌐 Data.gov.rs: https://data.gov.rs/
- 💬 Check if data.gov.rs has API documentation in their footer/about section
