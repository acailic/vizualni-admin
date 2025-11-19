/**
 * Utility functions for building chart-related URLs
 *
 * This module consolidates URL building logic that was previously
 * duplicated across multiple components. These utilities help create
 * consistent URLs for chart operations like copying, sharing, and editing.
 */

/**
 * Get the base origin URL
 * In SSR context, this should be called on the client side only
 */
const getOrigin = (): string => {
  if (typeof window === "undefined") {
    // SSR context - return empty string or throw error
    return "";
  }
  return window.location.origin;
};

/**
 * Build URL for copying and editing a chart
 *
 * @param configKey - The chart configuration key
 * @param locale - The current locale (e.g., "en", "sr")
 * @returns URL for copying the chart (e.g., "/en/create/new?copy=abc123")
 *
 * @example
 * const url = buildCopyChartUrl("chart-123", "en");
 * // Returns: "https://example.com/en/create/new?copy=chart-123"
 */
export const buildCopyChartUrl = (configKey: string, locale: string): string => {
  return `${getOrigin()}/${locale}/create/new?copy=${configKey}`;
};

/**
 * Build URL for sharing a chart
 *
 * @param configKey - The chart configuration key
 * @param locale - The current locale (e.g., "en", "sr")
 * @returns URL for sharing the chart (e.g., "/en/v/abc123")
 *
 * @example
 * const url = buildShareChartUrl("chart-123", "en");
 * // Returns: "https://example.com/en/v/chart-123"
 */
export const buildShareChartUrl = (configKey: string, locale: string): string => {
  return `${getOrigin()}/${locale}/v/${configKey}`;
};

/**
 * Build URL for viewing a chart
 *
 * @param configKey - The chart configuration key
 * @param locale - The current locale (e.g., "en", "sr")
 * @returns URL for viewing the chart
 *
 * @example
 * const url = buildViewChartUrl("chart-123", "en");
 * // Returns: "https://example.com/en/v/chart-123"
 */
export const buildViewChartUrl = (configKey: string, locale: string): string => {
  return buildShareChartUrl(configKey, locale);
};

/**
 * Build URL for creating a new chart
 *
 * @param locale - The current locale (e.g., "en", "sr")
 * @returns URL for creating a new chart
 *
 * @example
 * const url = buildNewChartUrl("en");
 * // Returns: "https://example.com/en/create/new"
 */
export const buildNewChartUrl = (locale: string): string => {
  return `${getOrigin()}/${locale}/create/new`;
};

/**
 * Build URL for editing a chart
 *
 * @param configKey - The chart configuration key
 * @param locale - The current locale (e.g., "en", "sr")
 * @returns URL for editing the chart
 *
 * @example
 * const url = buildEditChartUrl("chart-123", "en");
 * // Returns: "https://example.com/en/create/new?edit=chart-123"
 */
export const buildEditChartUrl = (configKey: string, locale: string): string => {
  return `${getOrigin()}/${locale}/create/new?edit=${configKey}`;
};

/**
 * Hook for getting chart URL builders with current locale
 *
 * @param locale - The current locale
 * @returns Object with URL builder functions pre-configured with locale
 *
 * @example
 * const { getCopyUrl, getShareUrl } = useChartUrls(locale);
 * const copyUrl = getCopyUrl("chart-123");
 * const shareUrl = getShareUrl("chart-123");
 */
export const useChartUrls = (locale: string) => {
  return {
    /**
     * Get copy URL for a chart
     * @param configKey - The chart configuration key
     */
    getCopyUrl: (configKey: string) => buildCopyChartUrl(configKey, locale),

    /**
     * Get share URL for a chart
     * @param configKey - The chart configuration key
     */
    getShareUrl: (configKey: string) => buildShareChartUrl(configKey, locale),

    /**
     * Get view URL for a chart
     * @param configKey - The chart configuration key
     */
    getViewUrl: (configKey: string) => buildViewChartUrl(configKey, locale),

    /**
     * Get URL for creating a new chart
     */
    getNewChartUrl: () => buildNewChartUrl(locale),

    /**
     * Get edit URL for a chart
     * @param configKey - The chart configuration key
     */
    getEditUrl: (configKey: string) => buildEditChartUrl(configKey, locale),
  };
};
