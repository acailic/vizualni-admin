/**
 * Custom React hook for fetching data from data.gov.rs API
 * Works with static export on GitHub Pages via client-side fetching
 */

import { useState, useEffect } from 'react';
import { dataGovRsClient, getBestVisualizationResource } from '@/domain/data-gov-rs';
import type { DatasetMetadata, Resource } from '@/domain/data-gov-rs/types';

interface UseDataGovRsOptions {
  /**
   * Specific dataset ID to fetch
   */
  datasetId?: string;

  /**
   * Search query to find datasets
   */
  searchQuery?: string;

  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Parse CSV data automatically
   * @default true
   */
  parseCSV?: boolean;
}

interface UseDataGovRsReturn {
  /**
   * Fetched dataset metadata
   */
  dataset: DatasetMetadata | null;

  /**
   * Best resource for visualization
   */
  resource: Resource | null;

  /**
   * Parsed resource data
   */
  data: any;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error if fetch failed
   */
  error: Error | null;

  /**
   * Manually trigger a refetch
   */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and parse datasets from data.gov.rs
 *
 * @example
 * ```tsx
 * const { dataset, data, loading, error } = useDataGovRs({
 *   searchQuery: 'budzet',
 *   autoFetch: true
 * });
 * ```
 */
export function useDataGovRs(options: UseDataGovRsOptions): UseDataGovRsReturn {
  const {
    datasetId,
    searchQuery,
    autoFetch = true,
    parseCSV = true
  } = options;

  const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
  const [resource, setResource] = useState<Resource | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedDataset: DatasetMetadata;

      if (datasetId) {
        // Fetch by specific ID
        fetchedDataset = await dataGovRsClient.getDataset(datasetId);
      } else if (searchQuery) {
        // Search for datasets
        const results = await dataGovRsClient.searchDatasets({
          q: searchQuery,
          page_size: 1
        });

        if (results.data.length === 0) {
          throw new Error(`No datasets found for query: "${searchQuery}"`);
        }

        fetchedDataset = results.data[0];
      } else {
        throw new Error('Either datasetId or searchQuery must be provided');
      }

      setDataset(fetchedDataset);

      // Get best resource for visualization
      const bestResource = getBestVisualizationResource(fetchedDataset);

      if (!bestResource) {
        throw new Error('No suitable resource found for visualization');
      }

      setResource(bestResource);

      // Fetch resource data based on format
      let resourceData: any;

      if (bestResource.format.toUpperCase() === 'JSON') {
        resourceData = await dataGovRsClient.getResourceJSON(bestResource);
      } else if (bestResource.format.toUpperCase() === 'CSV' && parseCSV) {
        const csvText = await dataGovRsClient.getResourceData(bestResource);
        resourceData = parseCSVData(csvText);
      } else {
        // Return raw text for other formats
        resourceData = await dataGovRsClient.getResourceData(bestResource);
      }

      setData(resourceData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorMessage);
      console.error('useDataGovRs error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && (datasetId || searchQuery)) {
      fetchData();
    }
  }, [datasetId, searchQuery, autoFetch]);

  return {
    dataset,
    resource,
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Simple CSV parser
 * For production, consider using a library like papaparse
 */
function parseCSVData(csv: string): any[] {
  const lines = csv.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);

  // Parse rows
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj: Record<string, any> = {};

    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to parse numbers
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) ? value : numValue;
    });

    return obj;
  });

  return rows;
}

/**
 * Parse a single CSV line (handles quoted values)
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
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
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
 * Hook to search datasets from data.gov.rs
 *
 * @example
 * ```tsx
 * const { datasets, loading, error, search } = useDataGovRsSearch();
 *
 * // Trigger search
 * search('budzet');
 * ```
 */
export function useDataGovRsSearch() {
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const search = async (query: string, page: number = 1, pageSize: number = 20) => {
    try {
      setLoading(true);
      setError(null);

      const results = await dataGovRsClient.searchDatasets({
        q: query,
        page,
        page_size: pageSize
      });

      setDatasets(results.data);
      setTotal(results.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Search failed');
      setError(errorMessage);
      console.error('useDataGovRsSearch error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    datasets,
    total,
    loading,
    error,
    search
  };
}
