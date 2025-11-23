/**
 * API client for data.gov.rs
 *
 * This client provides access to the Serbian Open Data Portal API
 * See: https://data.gov.rs/apidoc/
 *
 * In production (GitHub Pages), routes through Cloudflare Worker proxy.
 * Set NEXT_PUBLIC_API_PROXY_URL to your deployed worker URL.
 */

import type {
  DatasetMetadata,
  Organization,
  Resource,
  PaginatedResponse,
  SearchParams,
  DataGovRsConfig,
  ApiError,
} from './types';

const DIRECT_API_URL = 'https://data.gov.rs/api/1';

function getDefaultApiUrl(): string {
  const proxyUrl = process.env.NEXT_PUBLIC_API_PROXY_URL;
  const useProxy = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_PROXY === 'true';

  if (useProxy && proxyUrl) {
    return `${proxyUrl}/api/data-gov`;
  }

  return process.env.DATA_GOV_RS_API_URL || DIRECT_API_URL;
}

export class DataGovRsClient {
  private config: {
    apiUrl: string;
    apiKey?: string;
    defaultPageSize: number;
    timeout: number;
  };

  constructor(config: DataGovRsConfig) {
    this.config = {
      apiUrl: config.apiUrl || getDefaultApiUrl(),
      apiKey: config.apiKey || process.env.DATA_GOV_RS_API_KEY,
      defaultPageSize: config.defaultPageSize || 20,
      timeout: config.timeout || 10000,
    };
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'sr', // Default to Serbian
      ...(options.headers as Record<string, string>),
    };

    // Add API key if available
    if (this.config.apiKey) {
      headers['X-API-KEY'] = this.config.apiKey;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        };

        try {
          const errorData = await response.json();
          error.details = errorData;
        } catch {
          // Ignore JSON parse errors for error responses
        }

        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Search datasets
   */
  async searchDatasets(
    params: SearchParams = {}
  ): Promise<PaginatedResponse<DatasetMetadata>> {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.set('q', params.q);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.page_size) searchParams.set('page_size', params.page_size.toString());
    else searchParams.set('page_size', this.config.defaultPageSize.toString());
    if (params.organization) searchParams.set('organization', params.organization);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.order) searchParams.set('order', params.order);

    const query = searchParams.toString();
    const endpoint = `/datasets/${query ? `?${query}` : ''}`;

    return this.request<PaginatedResponse<DatasetMetadata>>(endpoint);
  }

  /**
   * Get a specific dataset by ID
   */
  async getDataset(id: string): Promise<DatasetMetadata> {
    return this.request<DatasetMetadata>(`/datasets/${id}/`);
  }

  /**
   * List all organizations
   */
  async listOrganizations(
    page: number = 1,
    pageSize: number = this.config.defaultPageSize
  ): Promise<PaginatedResponse<Organization>> {
    return this.request<PaginatedResponse<Organization>>(
      `/organizations/?page=${page}&page_size=${pageSize}`
    );
  }

  /**
   * Get a specific organization by ID
   */
  async getOrganization(id: string): Promise<Organization> {
    return this.request<Organization>(`/organizations/${id}/`);
  }

  /**
   * Get datasets for a specific organization
   */
  async getOrganizationDatasets(
    organizationId: string,
    page: number = 1,
    pageSize: number = this.config.defaultPageSize
  ): Promise<PaginatedResponse<DatasetMetadata>> {
    return this.searchDatasets({
      organization: organizationId,
      page,
      page_size: pageSize,
    });
  }

  /**
   * Get a specific resource by ID
   */
  async getResource(id: string): Promise<Resource> {
    return this.request<Resource>(`/resources/${id}/`);
  }

  /**
   * Download resource data
   */
  async downloadResource(url: string): Promise<Response> {
    return fetch(url);
  }

  /**
   * Get resource data as text
   */
  async getResourceData(resource: Resource): Promise<string> {
    const response = await this.downloadResource(resource.url);
    return response.text();
  }

  /**
   * Get resource data as JSON
   */
  async getResourceJSON<T = any>(resource: Resource): Promise<T> {
    const response = await this.downloadResource(resource.url);
    return response.json();
  }

  /**
   * Get all pages of a paginated response
   */
  async *getAllPages<T>(
    firstPage: PaginatedResponse<T>,
    fetcher: (page: number) => Promise<PaginatedResponse<T>>
  ): AsyncGenerator<T[], void, unknown> {
    yield firstPage.data;
    
    let currentPage = firstPage.page;
    const totalPages = Math.ceil(firstPage.total / firstPage.page_size);

    while (currentPage < totalPages) {
      currentPage++;
      const nextPage = await fetcher(currentPage);
      yield nextPage.data;
    }
  }
}

/**
 * Create a default client instance
 */
export function createDataGovRsClient(config?: Partial<DataGovRsConfig>): DataGovRsClient {
  return new DataGovRsClient({
    apiUrl: config?.apiUrl || process.env.DATA_GOV_RS_API_URL || 'https://data.gov.rs/api/1',
    apiKey: config?.apiKey || process.env.DATA_GOV_RS_API_KEY,
    defaultPageSize: config?.defaultPageSize || 20,
    timeout: config?.timeout || 10000,
  });
}

/**
 * Default client instance
 */
export const dataGovRsClient = createDataGovRsClient();
