/**
 * Simple API Service
 *
 * Unified API client for vizualni-admin.
 * Routes through Cloudflare Worker proxy in production.
 */
import { API_CONFIG, getApiUrl } from './config';
export { API_CONFIG, getApiUrl } from './config';
/**
 * Simple fetch wrapper with timeout and error handling
 */
async function apiFetch(url, options = {}) {
    const { body, timeout = API_CONFIG.timeout, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...fetchOptions.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            let errorDetails;
            try {
                errorDetails = await response.json();
            }
            catch (_a) {
                errorDetails = await response.text();
            }
            const error = {
                message: `API error: ${response.status} ${response.statusText}`,
                status: response.status,
                details: errorDetails,
            };
            throw error;
        }
        const data = await response.json();
        return { data, status: response.status, ok: true };
    }
    catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw { message: 'Request timeout', status: 408 };
        }
        throw error;
    }
}
/**
 * Simple API client
 */
export const api = {
    /**
     * GET request
     */
    async get(service, path, options) {
        const baseUrl = getApiUrl(service);
        const url = `${baseUrl}${path}`;
        const { data } = await apiFetch(url, { ...options, method: 'GET' });
        return data;
    },
    /**
     * POST request
     */
    async post(service, path, body, options) {
        const baseUrl = getApiUrl(service);
        const url = `${baseUrl}${path}`;
        const { data } = await apiFetch(url, { ...options, method: 'POST', body });
        return data;
    },
    /**
     * Health check for proxy
     */
    async healthCheck() {
        const { data } = await apiFetch(`${API_CONFIG.proxy}/health`);
        return data;
    },
};
/**
 * Data.gov.rs specific helpers
 */
export const dataGovApi = {
    async searchDatasets(params) {
        const searchParams = new URLSearchParams();
        if (params.q)
            searchParams.set('q', params.q);
        if (params.page)
            searchParams.set('page', String(params.page));
        if (params.page_size)
            searchParams.set('page_size', String(params.page_size));
        if (params.organization)
            searchParams.set('organization', params.organization);
        const query = searchParams.toString();
        return api.get('data-gov', `/datasets/${query ? `?${query}` : ''}`);
    },
    async getDataset(id) {
        return api.get('data-gov', `/datasets/${id}/`);
    },
    async listOrganizations(page = 1, pageSize = 20) {
        return api.get('data-gov', `/organizations/?page=${page}&page_size=${pageSize}`);
    },
    async getOrganization(id) {
        return api.get('data-gov', `/organizations/${id}/`);
    },
};
/**
 * OpenAI API helpers (via proxy)
 */
export const openaiApi = {
    async chat(messages, model = 'gpt-4') {
        return api.post('openai', '/chat/completions', {
            model,
            messages,
        });
    },
    async complete(prompt, model = 'gpt-3.5-turbo-instruct') {
        return api.post('openai', '/completions', {
            model,
            prompt,
            max_tokens: 1000,
        });
    },
};
