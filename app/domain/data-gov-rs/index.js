/**
 * data.gov.rs API integration module
 *
 * This module provides integration with the Serbian Open Data Portal API.
 *
 * @example
 * ```typescript
 * import { dataGovRsClient } from '@/domain/data-gov-rs';
 *
 * // Search for datasets
 * const results = await dataGovRsClient.searchDatasets({ q: 'population' });
 *
 * // Get a specific dataset
 * const dataset = await dataGovRsClient.getDataset('dataset-id');
 *
 * // List organizations
 * const orgs = await dataGovRsClient.listOrganizations();
 * ```
 */
export * from './types';
export * from './client';
export * from './utils';
