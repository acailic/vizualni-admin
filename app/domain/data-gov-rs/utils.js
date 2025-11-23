/**
 * Utility functions for working with data.gov.rs data
 */
/**
 * Check if a resource is in a supported format for visualization
 */
export function isSupportedFormat(resource) {
    const supportedFormats = ['CSV', 'JSON', 'GEOJSON', 'XML', 'RDF'];
    return supportedFormats.includes(resource.format.toUpperCase());
}
/**
 * Get the best resource for visualization from a dataset
 */
export function getBestVisualizationResource(dataset) {
    // Priority: CSV > JSON > GeoJSON > XML > others
    const priorityFormats = ['CSV', 'JSON', 'GEOJSON', 'XML'];
    for (const format of priorityFormats) {
        const resource = dataset.resources.find(r => r.format.toUpperCase() === format);
        if (resource)
            return resource;
    }
    // Return first supported resource if no priority match
    return dataset.resources.find(isSupportedFormat) || null;
}
/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes) {
    if (!bytes)
        return 'N/A';
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
export function getDatasetTags(dataset) {
    return dataset.tags || [];
}
/**
 * Check if dataset has geographic data
 */
export function hasGeographicData(dataset) {
    return dataset.resources.some(r => r.format.toUpperCase() === 'GEOJSON' ||
        r.format.toUpperCase() === 'KML' ||
        r.format.toUpperCase() === 'SHP');
}
/**
 * Get dataset update frequency
 */
export function getUpdateFrequency(dataset) {
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
export function parseCSV(csvText) {
    // Normalize line endings to \n (handles \r\n, \r, and \n)
    const normalizedCsv = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Split into lines and filter out empty rows
    const lines = normalizedCsv.split('\n').filter(line => line.trim());
    if (lines.length < 2)
        return [];
    const headers = parseCSVLine(lines[0]);
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
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
 *
 * @example
 * ```ts
 * parseCSVLine('a,b,c')
 * // Returns: ["a", "b", "c"]
 *
 * parseCSVLine('a,"Belgrade, Serbia",c')
 * // Returns: ["a", "Belgrade, Serbia", "c"]
 *
 * parseCSVLine('a,"He said ""Hello""",c')
 * // Returns: ["a", "He said \"Hello\"", "c"]
 * ```
 */
export function parseCSVLine(line) {
    const result = [];
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
            }
            else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        }
        else if (char === ',' && !inQuotes) {
            // End of field (comma outside quotes)
            result.push(current.trim());
            current = '';
        }
        else {
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
export function buildPortalSearchUrl(query, filters) {
    const baseUrl = 'https://data.gov.rs/sr/datasets';
    const params = new URLSearchParams();
    if (query)
        params.set('q', query);
    if (filters === null || filters === void 0 ? void 0 : filters.organization)
        params.set('organization', filters.organization);
    if (filters === null || filters === void 0 ? void 0 : filters.tag)
        params.set('tag', filters.tag);
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
/**
 * Build direct link to dataset on data.gov.rs
 */
export function buildDatasetUrl(datasetId) {
    return `https://data.gov.rs/sr/datasets/${datasetId}`;
}
/**
 * Build direct link to organization on data.gov.rs
 */
export function buildOrganizationUrl(organizationId) {
    return `https://data.gov.rs/sr/organizations/${organizationId}`;
}
/**
 * Sanitize dataset title for use in URLs
 */
export function sanitizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
/**
 * Get language from locale code
 */
export function getLanguageFromLocale(locale) {
    const languageMap = {
        'sr': 'sr',
        'en': 'en',
        'de': 'en',
        'fr': 'en',
        'it': 'en',
    };
    return languageMap[locale] || 'sr';
}
/**
 * Check if a dataset was updated recently (within 30 days)
 */
export function isRecentlyUpdated(dataset) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const updatedAt = new Date(dataset.updated_at);
    return updatedAt > thirtyDaysAgo;
}
/**
 * Get dataset license information
 */
export function getLicenseInfo(dataset) {
    return {
        name: dataset.license || 'Not specified',
        url: dataset.license_url,
    };
}
