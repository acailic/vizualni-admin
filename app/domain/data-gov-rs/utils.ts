/**
 * Utility functions for working with data.gov.rs data
 */

import type { DatasetMetadata, Resource } from './types';

/**
 * Check if a resource is in a supported format for visualization
 */
export function isSupportedFormat(resource: Resource): boolean {
  const supportedFormats = ['CSV', 'JSON', 'GEOJSON', 'XML', 'RDF'];
  return supportedFormats.includes(resource.format.toUpperCase());
}

/**
 * Get the best resource for visualization from a dataset
 */
export function getBestVisualizationResource(
  dataset: DatasetMetadata
): Resource | null {
  // Priority: CSV > JSON > GeoJSON > XML > others
  const priorityFormats = ['CSV', 'JSON', 'GEOJSON', 'XML'];
  
  for (const format of priorityFormats) {
    const resource = dataset.resources.find(
      r => r.format.toUpperCase() === format
    );
    if (resource) return resource;
  }

  // Return first supported resource if no priority match
  return dataset.resources.find(isSupportedFormat) || null;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Extract dataset tags
 */
export function getDatasetTags(dataset: DatasetMetadata): string[] {
  return dataset.tags || [];
}

/**
 * Check if dataset has geographic data
 */
export function hasGeographicData(dataset: DatasetMetadata): boolean {
  return dataset.resources.some(
    r => r.format.toUpperCase() === 'GEOJSON' ||
         r.format.toUpperCase() === 'KML' ||
         r.format.toUpperCase() === 'SHP'
  );
}

/**
 * Get dataset update frequency
 */
export function getUpdateFrequency(dataset: DatasetMetadata): string {
  return dataset.frequency || 'N/A';
}

/**
 * Parse CSV data to array of objects
 * Handles quoted fields with commas, different line endings, and empty rows
 *
 * @example
 * ```ts
 * parseCSV('name,city\nJohn,"Belgrade, Serbia"\nJane,Novi Sad')
 * // Returns:
 * // [
 * //   { name: 'John', city: 'Belgrade, Serbia' },
 * //   { name: 'Jane', city: 'Novi Sad' }
 * // ]
 * ```
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  // Normalize line endings to \n (handles \r\n, \r, and \n)
  const normalizedCsv = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines and filter out empty rows
  const lines = normalizedCsv.split('\n').filter(line => line.trim());

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

/**
 * Parse a single CSV line
 * Handles quoted values with commas and escaped quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote (two consecutive quotes)
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field (comma outside quotes)
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Build search URL for data.gov.rs portal
 */
export function buildPortalSearchUrl(query?: string, filters?: {
  organization?: string;
  tag?: string;
}): string {
  const baseUrl = 'https://data.gov.rs/sr/datasets';
  const params = new URLSearchParams();

  if (query) params.set('q', query);
  if (filters?.organization) params.set('organization', filters.organization);
  if (filters?.tag) params.set('tag', filters.tag);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Build direct link to dataset on data.gov.rs
 */
export function buildDatasetUrl(datasetId: string): string {
  return `https://data.gov.rs/sr/datasets/${datasetId}`;
}

/**
 * Build direct link to organization on data.gov.rs
 */
export function buildOrganizationUrl(organizationId: string): string {
  return `https://data.gov.rs/sr/organizations/${organizationId}`;
}

/**
 * Sanitize dataset title for use in URLs
 */
export function sanitizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get language from locale code
 */
export function getLanguageFromLocale(locale: string): string {
  const languageMap: Record<string, string> = {
    'sr': 'sr',
    'en': 'en',
    'de': 'en', // fallback to English
    'fr': 'en',
    'it': 'en',
  };
  return languageMap[locale] || 'sr';
}

/**
 * Check if a dataset was updated recently (within 30 days)
 */
export function isRecentlyUpdated(dataset: DatasetMetadata): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const updatedAt = new Date(dataset.updated_at);
  return updatedAt > thirtyDaysAgo;
}

/**
 * Get dataset license information
 */
export function getLicenseInfo(dataset: DatasetMetadata): {
  name: string;
  url?: string;
} {
  return {
    name: dataset.license || 'Not specified',
    url: dataset.license_url,
  };
}
