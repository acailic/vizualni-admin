# Type System Documentation

This directory contains centralized type definitions and utilities for the application's UI components and data handling.

## Overview

The type system is organized into logical modules:

### 📊 Chart & Data Types (`/app/charts/shared/chart-props.tsx`)

Defines props for chart components and data visualization:

- **Data Props**: `ChartDataProps` - Props containing fetched data (observations, dimensions, measures)
- **Source Props**: `DataSourceProps` - Where data comes from (URL, type)
- **Config Props**: `ChartConfigProps` - How charts are configured and filtered
- **Combined Props**:
  - `BaseChartProps` - For rendering charts with fetched data
  - `ChartProps<T>` - Fully configured chart with typed config
  - `VisualizationProps<T>` - Top-level chart wrappers that fetch data
  - `ChartWithFiltersProps<T>` - Charts with dashboard-level filters

#### Usage Example

```typescript
import { ChartWithFiltersProps, VisualizationProps } from "@/charts/shared/chart-props";

// For a chart that fetches its own data:
function MyChart(props: VisualizationProps<MyChartConfig>) {
  const { dataSource, chartConfig, observationQueryFilters } = props;
  // ...
}

// For a chart with dashboard filters:
function DashboardChart(props: ChartWithFiltersProps<MyChartConfig>) {
  const { dataSource, chartConfig, dashboardFilters } = props;
  // ...
}
```

### 🎨 UI Component Types (`/app/types/ui-props.ts`)

Provides reusable prop patterns for UI components:

#### Base UI Props
- `WithClassName` - Components with custom CSS classes
- `WithSx` - Material-UI sx prop support
- `WithDisabled` - Disabled state
- `WithLoading` - Loading state
- `WithError` - Error handling

#### Interaction Props
- `WithOnClick` - Clickable components
- `WithOnChange<T>` - Value change handlers
- `ControlledInputProps<T>` - Controlled form inputs

#### API Props
- `ApiDataProps<T>` - Components displaying API data
- `WithRefresh` - Refresh/reload capability

#### Usage Example

```typescript
import { FormFieldProps, WithEditMode, ApiDataProps } from "@/types/ui-props";

// Reusable form field:
function TextField(props: FormFieldProps<string>) {
  const { value, onChange, label, error, disabled } = props;
  // ...
}

// Component with API data:
function UserList(props: ApiDataProps<User[]> & WithRefresh) {
  const { data, loading, error, onRefresh } = props;
  // ...
}
```

## Design Principles

### 1. **Semantic Grouping**
Props are grouped by their purpose:
- Data-related props together
- Configuration props together
- UI/interaction props together

### 2. **Composition over Duplication**
Use type composition to build complex props:
```typescript
type MyComponentProps = DataSourceProps & ChartConfigProps & WithLoading;
```

### 3. **Documentation First**
All exported types have JSDoc comments explaining:
- What the type represents
- When to use it
- Example usage (where helpful)

### 4. **Type Safety**
- Use generics for reusable patterns
- Leverage discriminated unions where appropriate
- Export type utilities for common transformations

## Common Patterns

### Pattern 1: Data Fetching Components

```typescript
import { DataSourceProps, WithLoading, WithError } from "@/types/ui-props";

type MyComponentProps = DataSourceProps & WithLoading & WithError & {
  onDataLoaded?: (data: MyData) => void;
};
```

### Pattern 2: Chart Visualization

```typescript
import { VisualizationProps } from "@/charts/shared/chart-props";

type MyChartProps = VisualizationProps<MyChartConfig> & {
  // Additional chart-specific props
  highlightValue?: string;
};
```

### Pattern 3: Form Fields

```typescript
import { FormFieldProps } from "@/types/ui-props";

type MyFieldProps = FormFieldProps<string> & {
  // Field-specific props
  maxLength?: number;
};
```

## Type Utilities

### `RequireKeys<T, K>`
Makes specified keys required:
```typescript
type Foo = { a?: string; b?: number; c?: boolean };
type Bar = RequireKeys<Foo, "a" | "b">;
// Result: { a: string; b: number; c?: boolean }
```

### `PartialKeys<T, K>`
Makes specified keys optional:
```typescript
type Foo = { a: string; b: number; c: boolean };
type Bar = PartialKeys<Foo, "a" | "b">;
// Result: { a?: string; b?: number; c: boolean }
```

### `PropsOf<T>`
Extracts props from a component:
```typescript
const MyComponent = (props: { name: string }) => <div>{props.name}</div>;
type MyProps = PropsOf<typeof MyComponent>; // { name: string }
```

## Migration Guide

### Before (Inline Props)
```typescript
function MyComponent({
  dataSource,
  componentIds,
  chartConfig,
  dashboardFilters,
  embedParams,
}: {
  dataSource: DataSource;
  componentIds: string[] | undefined;
  chartConfig: ChartConfig;
  dashboardFilters: DashboardFiltersConfig | undefined;
  embedParams?: EmbedQueryParams;
}) {
  // ...
}
```

### After (Using Shared Types)
```typescript
import { ChartWithFiltersProps } from "@/charts/shared/chart-props";

function MyComponent(props: ChartWithFiltersProps) {
  const { dataSource, componentIds, chartConfig, dashboardFilters, embedParams } = props;
  // ...
}
```

## Benefits

1. **🔍 Discoverability**: JSDoc comments provide inline documentation
2. **♻️ Reusability**: Common patterns defined once, used everywhere
3. **🛡️ Type Safety**: Strong typing catches errors at compile time
4. **📖 Consistency**: Standardized prop names and patterns
5. **🚀 Productivity**: Less time defining types, more time building features

## Best Practices

1. **Always use existing types** before creating new ones
2. **Add JSDoc comments** to new exported types
3. **Prefer composition** over complex inheritance
4. **Keep types focused** - one responsibility per type
5. **Export from a central location** for easy imports

## Contributing

When adding new types:

1. Check if a similar type exists
2. Add comprehensive JSDoc documentation
3. Group with related types
4. Export from the appropriate module
5. Update this README with examples
