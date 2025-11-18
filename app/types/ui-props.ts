/**
 * Common UI component prop types and utilities.
 *
 * This file provides reusable prop type definitions and utilities
 * to ensure consistency across the application's UI components.
 *
 * @module ui-props
 */

import { ReactNode } from "react";
import { BoxProps, SxProps, Theme } from "@mui/material";

// ============================================================================
// BASE UI PROPS
// ============================================================================

/**
 * Standard props for components that accept custom CSS classes.
 */
export type WithClassName = {
  /** Optional CSS class name for custom styling */
  className?: string;
};

/**
 * Standard props for components that accept Material-UI sx prop.
 */
export type WithSx = {
  /** Material-UI sx prop for inline styles */
  sx?: SxProps<Theme>;
};

/**
 * Standard props for components with enabled/disabled state.
 */
export type WithDisabled = {
  /** Whether the component is disabled */
  disabled?: boolean;
};

/**
 * Standard props for components with loading state.
 */
export type WithLoading = {
  /** Whether the component is in loading state */
  loading?: boolean;
};

/**
 * Standard props for components with error state.
 */
export type WithError = {
  /** Error message to display, if any */
  error?: string | null;
};

// ============================================================================
// LAYOUT PROPS
// ============================================================================

/**
 * Props for components that can be shown/hidden.
 */
export type WithVisibility = {
  /** Whether the component is visible */
  visible?: boolean;
};

/**
 * Props for components with flexible positioning.
 */
export type PositionProps = {
  /** Top position */
  top?: string | number;
  /** Right position */
  right?: string | number;
  /** Bottom position */
  bottom?: string | number;
  /** Left position */
  left?: string | number;
};

/**
 * Common props for container components.
 */
export type ContainerProps = WithClassName &
  WithSx & {
    /** Child elements to render */
    children?: ReactNode;
  };

// ============================================================================
// DATA DISPLAY PROPS
// ============================================================================

/**
 * Props for components that display a title.
 */
export type WithTitle = {
  /** Title text */
  title: string;
};

/**
 * Props for components that display a description.
 */
export type WithDescription = {
  /** Description text */
  description?: string;
};

/**
 * Combined title and description props.
 */
export type WithTitleAndDescription = WithTitle & WithDescription;

// ============================================================================
// INTERACTION PROPS
// ============================================================================

/**
 * Props for clickable components.
 */
export type WithOnClick<T = void> = {
  /** Click handler function */
  onClick?: (event?: React.MouseEvent) => T;
};

/**
 * Props for components with change handlers.
 */
export type WithOnChange<T = any> = {
  /** Change handler function */
  onChange?: (value: T) => void;
};

/**
 * Props for components with value.
 */
export type WithValue<T = any> = {
  /** Current value */
  value: T;
};

/**
 * Props for controlled input components.
 */
export type ControlledInputProps<T = string> = WithValue<T> & WithOnChange<T>;

// ============================================================================
// API-RELATED PROPS
// ============================================================================

/**
 * Props for components that display API data.
 */
export type ApiDataProps<T = any> = {
  /** Data from API */
  data?: T;
  /** Whether data is currently loading */
  loading?: boolean;
  /** Error from API, if any */
  error?: Error | string | null;
};

/**
 * Props for components with refresh capability.
 */
export type WithRefresh = {
  /** Function to refresh/reload data */
  onRefresh?: () => void;
};

/**
 * Combined API data props with refresh capability.
 */
export type ApiDataWithRefreshProps<T = any> = ApiDataProps<T> & WithRefresh;

// ============================================================================
// RENDER PROPS
// ============================================================================

/**
 * Props for components using render prop pattern.
 */
export type WithRenderProp<T = any> = {
  /** Render function */
  render: (data: T) => ReactNode;
};

/**
 * Props for components with children as render function.
 */
export type WithChildrenRenderProp<T = any> = {
  /** Children as render function */
  children: (data: T) => ReactNode;
};

// ============================================================================
// FILTER & QUERY PROPS
// ============================================================================

/**
 * Props for filterable components.
 */
export type FilterProps<T = any> = {
  /** Current filter value */
  filter?: T;
  /** Filter change handler */
  onFilterChange?: (filter: T) => void;
};

/**
 * Props for searchable components.
 */
export type SearchProps = {
  /** Search query string */
  searchQuery?: string;
  /** Search handler */
  onSearch?: (query: string) => void;
};

/**
 * Props for sortable components.
 */
export type SortProps<T = string> = {
  /** Field to sort by */
  sortBy?: T;
  /** Sort direction */
  sortDirection?: "asc" | "desc";
  /** Sort change handler */
  onSortChange?: (sortBy: T, direction: "asc" | "desc") => void;
};

// ============================================================================
// PAGINATION PROPS
// ============================================================================

/**
 * Props for paginated components.
 */
export type PaginationProps = {
  /** Current page number (0-indexed) */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of items */
  totalItems?: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
};

// ============================================================================
// COMBINED UTILITY PROPS
// ============================================================================

/**
 * Common props for data tables.
 */
export type DataTableProps<T = any> = FilterProps<T> &
  SearchProps &
  SortProps &
  PaginationProps &
  ApiDataProps<T[]> &
  ContainerProps;

/**
 * Common props for form fields.
 */
export type FormFieldProps<T = string> = ControlledInputProps<T> &
  WithDisabled &
  WithError &
  WithClassName & {
    /** Field label */
    label?: string;
    /** Field name/id */
    name: string;
    /** Placeholder text */
    placeholder?: string;
  };

/**
 * Props for components that can be in editing mode.
 */
export type WithEditMode = {
  /** Whether component is in editing mode */
  editing?: boolean;
  /** Enter edit mode handler */
  onEdit?: () => void;
  /** Exit edit mode handler */
  onEditComplete?: () => void;
};

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Makes specified keys required in a type.
 * @example
 * type Foo = { a?: string; b?: number; c?: boolean };
 * type Bar = RequireKeys<Foo, "a" | "b">; // { a: string; b: number; c?: boolean }
 */
export type RequireKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Makes specified keys optional in a type.
 * @example
 * type Foo = { a: string; b: number; c: boolean };
 * type Bar = PartialKeys<Foo, "a" | "b">; // { a?: string; b?: number; c: boolean }
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Extracts props from a component type.
 */
export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never;

/**
 * Combines Box props with custom props for Material-UI components.
 * Common pattern for extending MUI components.
 */
export type BoxPropsWithCustom<T = {}> = BoxProps & T;
