import { EmbedQueryParams } from "@/components/embed-params";
import { ChartConfig, DataSource, DashboardFiltersConfig } from "@/config-types";
import { Dimension, Measure, Observation } from "@/domain/data";
import { DataCubeObservationFilter } from "@/graphql/query-hooks";

// ============================================================================
// LOOKUP TYPES
// ============================================================================

/**
 * Index of dimensions by their ID for quick lookups.
 * Eliminates the need for repeated array.find() operations.
 */
export type DimensionsById = Record<string, Dimension>;

/**
 * Index of measures by their ID for quick lookups.
 * Eliminates the need for repeated array.find() operations.
 */
export type MeasuresById = Record<string, Measure>;

// ============================================================================
// DATA PROPS
// ============================================================================

/**
 * Props containing the actual data to be visualized.
 * These are typically provided after data has been fetched from the API.
 */
export type ChartDataProps = {
  /** Array of observation data points */
  observations: Observation[];
  /** All dimensions available in the dataset */
  dimensions: Dimension[];
  /** Indexed dimensions for quick lookups */
  dimensionsById: DimensionsById;
  /** All measures available in the dataset */
  measures: Measure[];
  /** Indexed measures for quick lookups */
  measuresById: MeasuresById;
};

// ============================================================================
// SOURCE & CONFIGURATION PROPS
// ============================================================================

/**
 * Props that define where data comes from and how to query it.
 */
export type DataSourceProps = {
  /** Data source configuration (URL and type) */
  dataSource: DataSource;
  /** Optional specific component IDs to fetch */
  componentIds?: string[];
};

/**
 * Props that define how the chart should be configured and filtered.
 */
export type ChartConfigProps<TChartConfig extends ChartConfig = ChartConfig> = {
  /** Chart configuration including type, fields, and display options */
  chartConfig: TChartConfig;
  /** Dashboard-level filters that apply across multiple charts */
  dashboardFilters?: DashboardFiltersConfig;
};

/**
 * Props for query filtering.
 */
export type QueryFilterProps = {
  /** Filters to apply when fetching observations */
  observationQueryFilters: DataCubeObservationFilter[];
};

// ============================================================================
// COMBINED PROPS (for common patterns)
// ============================================================================

/**
 * Base props for rendering a chart with fetched data.
 * Use this for components that receive already-fetched data.
 */
export type BaseChartProps = ChartDataProps & {
  /** Optional embed parameters (e.g., for iframe embedding) */
  embedParams?: EmbedQueryParams;
};

/**
 * Props for a fully configured chart with data.
 * Extends BaseChartProps with typed chart configuration.
 */
export type ChartProps<TChartConfig extends ChartConfig> = BaseChartProps & {
  /** Chart configuration with specific chart type */
  chartConfig: TChartConfig;
};

/**
 * Props for chart visualization components that need to fetch their own data.
 * Use this for top-level chart wrappers that handle data fetching.
 */
export type VisualizationProps<TChartConfig extends ChartConfig> =
  DataSourceProps &
  ChartConfigProps<TChartConfig> &
  QueryFilterProps & {
    /** Optional embed parameters */
    embedParams?: EmbedQueryParams;
  };

/**
 * Props for chart components integrated with dashboard filters.
 * Common pattern for charts that can be filtered at dashboard level.
 */
export type ChartWithFiltersProps<TChartConfig extends ChartConfig = ChartConfig> =
  DataSourceProps &
  ChartConfigProps<TChartConfig> & {
    /** Optional embed parameters */
    embedParams?: EmbedQueryParams;
  };
