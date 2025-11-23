/**
 * API Configuration
 *
 * Central configuration for API endpoints.
 * In production (GitHub Pages), routes through Cloudflare Worker proxy.
 * In development, can use direct APIs or local proxy.
 */

const isDev = process.env.NODE_ENV === 'development';

// Cloudflare Worker proxy URL
const PROXY_URL = process.env.NEXT_PUBLIC_API_PROXY_URL || 'https://serbian-open-data-proxy.alexilic92.workers.dev';

export const API_CONFIG = {
  // Use proxy in production, direct in development (or proxy if configured)
  useProxy: !isDev || !!process.env.NEXT_PUBLIC_USE_PROXY,

  // Base URLs
  proxy: PROXY_URL,

  // Direct API URLs (for development without proxy)
  direct: {
    dataGovRs: 'https://data.gov.rs/api/1',
    openai: 'https://api.openai.com/v1',
  },

  // Timeouts
  timeout: 30000,
} as const;

/**
 * Get the base URL for a service
 */
export function getApiUrl(service: 'data-gov' | 'openai' | 'custom'): string {
  if (API_CONFIG.useProxy) {
    return `${API_CONFIG.proxy}/api/${service}`;
  }

  // Direct URLs for development
  switch (service) {
    case 'data-gov':
      return API_CONFIG.direct.dataGovRs;
    case 'openai':
      return API_CONFIG.direct.openai;
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}
