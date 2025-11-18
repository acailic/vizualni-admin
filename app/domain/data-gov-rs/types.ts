/**
 * Types for data.gov.rs API integration
 */

export interface DatasetMetadata {
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

export interface Organization {
  id: string;
  name: string;
  title?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Resource {
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

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  next_page: string | null;
  previous_page: string | null;
}

export interface SearchParams {
  q?: string;
  page?: number;
  page_size?: number;
  organization?: string;
  tag?: string;
  sort?: 'created' | 'updated' | 'title';
  order?: 'asc' | 'desc';
}

export interface DataGovRsConfig {
  apiUrl: string;
  apiKey?: string;
  defaultPageSize?: number;
  timeout?: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
