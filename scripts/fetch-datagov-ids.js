#!/usr/bin/env node

/**
 * Fetch Dataset IDs from data.gov.rs
 *
 * This script searches the data.gov.rs API for specific keywords and
 * finds datasets with CSV/JSON resources to populate DEMO_CONFIGS.
 *
 * Usage: node scripts/fetch-datagov-ids.js
 *
 * Note: This script requires Node.js 18+ for native fetch support.
 * If you encounter 403 errors, the API might be blocking requests.
 * Try running from your local machine or through a VPN.
 */

const API_BASE = 'https://data.gov.rs/api/action';
const SEARCH_KEYWORDS = ['budzet', 'vazduh', 'skole', 'saobracaj'];
const TARGET_FORMATS = ['CSV', 'JSON', 'XLSX', 'XLS'];

// Alternative API endpoints to try
const API_ENDPOINTS = [
  'https://data.gov.rs/api/action/package_search',
  'https://data.gov.rs/api/3/action/package_search',
  'https://data.gov.rs/api/1/datasets/'
];

/**
 * Search datasets by keyword using CKAN API
 */
async function searchDatasets(query) {
  // CKAN package_search endpoint
  const url = `${API_BASE}/package_search?q=${encodeURIComponent(query)}&rows=50`;

  console.log(`\n🔍 Searching for: "${query}"...`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'sr-RS,sr;q=0.9,en;q=0.8',
        'Referer': 'https://data.gov.rs/'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${text.substring(0, 200)}`);
    }

    const data = await response.json();

    // CKAN API returns data in result.results
    if (data.success && data.result && data.result.results) {
      return data.result.results;
    }

    // Fallback for other API structures
    return data.data || data.results || [];
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error.message);
    return [];
  }
}

/**
 * Filter resources by format
 */
function filterResources(dataset) {
  if (!dataset.resources || dataset.resources.length === 0) {
    return [];
  }

  return dataset.resources.filter(resource => {
    const format = (resource.format || '').toUpperCase();
    return TARGET_FORMATS.includes(format);
  });
}

/**
 * Format date string
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return dateString;
  }
}

/**
 * Print dataset info
 */
function printDatasetInfo(dataset, resources) {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 ${dataset.title || 'Untitled'}`);
  console.log('='.repeat(80));
  console.log(`Dataset ID:    ${dataset.id || 'N/A'}`);
  console.log(`Organization:  ${dataset.organization?.name || 'N/A'}`);
  console.log(`Created:       ${formatDate(dataset.metadata_created)}`);
  console.log(`Modified:      ${formatDate(dataset.metadata_modified)}`);
  console.log(`License:       ${dataset.license_title || 'N/A'}`);
  console.log(`URL:           https://data.gov.rs/sr/datasets/${dataset.id || ''}`);

  if (dataset.notes) {
    const notes = dataset.notes.substring(0, 150);
    console.log(`Description:   ${notes}${notes.length >= 150 ? '...' : ''}`);
  }

  console.log('\n📁 Resources:');
  resources.forEach((resource, idx) => {
    console.log(`\n  [${idx + 1}] ${resource.name || 'Unnamed Resource'}`);
    console.log(`      Resource ID:   ${resource.id || 'N/A'}`);
    console.log(`      Format:        ${resource.format || 'N/A'}`);
    console.log(`      Size:          ${resource.size || 'N/A'}`);
    console.log(`      Created:       ${formatDate(resource.created)}`);
    console.log(`      Modified:      ${formatDate(resource.last_modified)}`);
    console.log(`      URL:           ${resource.url || 'N/A'}`);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Fetching Dataset IDs from data.gov.rs');
  console.log('━'.repeat(80));

  const allResults = [];

  for (const keyword of SEARCH_KEYWORDS) {
    const datasets = await searchDatasets(keyword);

    if (datasets.length === 0) {
      console.log(`   No datasets found for "${keyword}"`);
      continue;
    }

    console.log(`   Found ${datasets.length} dataset(s)`);

    for (const dataset of datasets) {
      const resources = filterResources(dataset);

      if (resources.length > 0) {
        allResults.push({ dataset, resources, keyword });
      }
    }

    // Rate limiting - be nice to the API (only if datasets found)
  console.log('\nCopy these IDs into your DEMO_CONFIGS:\n');

  for (const { dataset, resources, keyword } of allResults) {
    console.log(`// Keyword: ${keyword}`);
    console.log(`defaultDatasetId: '${dataset.id}'`);

    if (resources.length > 0) {
      console.log(`// Resource ID: ${resources[0].id} (${resources[0].format})`);
    }

    console.log(`// Title: ${dataset.title}`);
    console.log('');
  }

  console.log('\n✨ Done!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
