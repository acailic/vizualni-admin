# 🚀 Vizualni Admin - Top 7 Improvements Implementation Plan

**Created:** 2025-11-19
**Status:** Planning Phase
**Priority:** P0-P1 (Critical to High Impact)

---

## Table of Contents
1. [Dark Mode Support](#1-dark-mode-support)
2. [Loading Skeletons](#2-loading-skeletons)
3. [Chart Templates Library](#3-chart-templates-library)
4. [Command Palette (Keyboard Shortcuts)](#4-command-palette-keyboard-shortcuts)
5. [Data Freshness Indicators](#5-data-freshness-indicators)
6. [Accessibility Improvements (WCAG 2.1 AA)](#6-accessibility-improvements-wcag-21-aa)
7. [Bundle Size Optimization](#7-bundle-size-optimization)

---

## 1. Dark Mode Support

### 📋 Overview
Implement a system-wide dark mode theme with user preference persistence and automatic system theme detection.

### 🎯 Goals
- Reduce eye strain for users working in low-light environments
- Meet modern user expectations for theme customization
- Support automatic theme switching based on system preferences
- Persist user theme preference across sessions

### 🔧 Technical Approach

#### Architecture
```typescript
// Theme architecture
User Preference (localStorage)
  ↓
Theme Provider (MUI)
  ↓
Components (automatic theme application)
```

#### Technology Stack
- **Material-UI Theme System** - Already integrated, provides dark theme out-of-box
- **next-themes** - Theme management with SSR support
- **localStorage** - Theme preference persistence
- **matchMedia API** - System theme detection

### 📝 Implementation Steps

#### Phase 1: Theme Infrastructure (2-3 days)
1. **Install Dependencies**
   ```bash
   yarn add next-themes
   ```

2. **Create Theme Configuration**
   - File: `app/themes/dark-theme.ts`
   ```typescript
   import { createTheme } from '@mui/material/styles';

   export const darkTheme = createTheme({
     palette: {
       mode: 'dark',
       primary: {
         main: '#90caf9', // Lighter blue for dark mode
       },
       secondary: {
         main: '#f48fb1',
       },
       background: {
         default: '#121212',
         paper: '#1e1e1e',
       },
       text: {
         primary: '#ffffff',
         secondary: 'rgba(255, 255, 255, 0.7)',
       },
     },
     components: {
       MuiPaper: {
         styleOverrides: {
           root: {
             backgroundImage: 'none', // Remove MUI default gradient
           },
         },
       },
     },
   });
   ```

3. **Create Theme Provider Wrapper**
   - File: `app/components/theme-provider.tsx`
   ```typescript
   'use client';

   import { ThemeProvider as NextThemeProvider } from 'next-themes';
   import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
   import CssBaseline from '@mui/material/CssBaseline';
   import { useTheme } from 'next-themes';
   import { lightTheme } from '@/themes/light-theme';
   import { darkTheme } from '@/themes/dark-theme';

   export function AppThemeProvider({ children }) {
     return (
       <NextThemeProvider attribute="class" defaultTheme="system">
         <MuiThemeWrapper>{children}</MuiThemeWrapper>
       </NextThemeProvider>
     );
   }

   function MuiThemeWrapper({ children }) {
     const { resolvedTheme } = useTheme();
     const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

     return (
       <MuiThemeProvider theme={theme}>
         <CssBaseline />
         {children}
       </MuiThemeProvider>
     );
   }
   ```

4. **Update Root Layout**
   - File: `app/layout.tsx`
   - Wrap app with new `AppThemeProvider`

#### Phase 2: Theme Toggle UI (1-2 days)
1. **Create Theme Toggle Component**
   - File: `app/components/theme-toggle.tsx`
   ```typescript
   import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
   import { Brightness4, Brightness7, SettingsBrightness } from '@mui/icons-material';
   import { useTheme } from 'next-themes';

   export function ThemeToggle() {
     const { theme, setTheme } = useTheme();
     const [anchorEl, setAnchorEl] = useState(null);

     return (
       <>
         <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
           {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
         </IconButton>
         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
           <MenuItem onClick={() => setTheme('light')}>
             <ListItemIcon><Brightness7 /></ListItemIcon>
             Light
           </MenuItem>
           <MenuItem onClick={() => setTheme('dark')}>
             <ListItemIcon><Brightness4 /></ListItemIcon>
             Dark
           </MenuItem>
           <MenuItem onClick={() => setTheme('system')}>
             <ListItemIcon><SettingsBrightness /></ListItemIcon>
             System
           </MenuItem>
         </Menu>
       </>
     );
   }
   ```

2. **Add to Header/Navigation**
   - File: `app/components/header.tsx` or `app/components/navigation.tsx`
   - Add `<ThemeToggle />` component

#### Phase 3: Chart & Visualization Theming (2-3 days)
1. **Update Chart Color Schemes**
   - File: `app/charts/shared/use-chart-theme.ts`
   ```typescript
   import { useTheme } from '@mui/material/styles';

   export function useChartTheme() {
     const theme = useTheme();
     const isDark = theme.palette.mode === 'dark';

     return {
       backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
       gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
       textColor: isDark ? '#ffffff' : '#000000',
       colors: isDark
         ? ['#90caf9', '#f48fb1', '#a5d6a7', '#fff59d', '#ce93d8']
         : ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2'],
     };
   }
   ```

2. **Update D3 Chart Components**
   - Files: `app/charts/*/*.tsx`
   - Apply theme colors to axes, grids, text elements

3. **Update Map Styles**
   - File: `app/maps/map-styles.ts`
   - Create dark mode map style

#### Phase 4: Testing & Refinement (2 days)
1. **Test all pages** in both themes
2. **Check color contrast** ratios (WCAG AA: 4.5:1 for text)
3. **Test theme persistence** across page reloads
4. **Test system theme switching**
5. **Verify embedded charts** respect theme

### 📂 Files to Create/Modify

**Create:**
- `app/themes/dark-theme.ts` - Dark theme configuration
- `app/themes/light-theme.ts` - Refactored light theme
- `app/components/theme-provider.tsx` - Theme provider wrapper
- `app/components/theme-toggle.tsx` - Theme toggle UI
- `app/charts/shared/use-chart-theme.ts` - Chart theming hook
- `app/maps/map-styles.ts` - Map theme styles

**Modify:**
- `app/layout.tsx` - Add theme provider
- `app/components/header.tsx` - Add theme toggle
- `app/charts/*/*.tsx` - Apply theme to charts (10-15 files)
- `app/configurator/config-form.tsx` - Apply theme to forms

### 🧪 Testing Strategy

#### Unit Tests
```typescript
// app/components/__tests__/theme-toggle.test.tsx
describe('ThemeToggle', () => {
  it('should toggle between light and dark themes', () => {
    // Test theme switching
  });

  it('should persist theme preference to localStorage', () => {
    // Test persistence
  });

  it('should respect system theme preference', () => {
    // Test system theme
  });
});
```

#### Visual Tests
- Screenshot comparison in Storybook (light vs dark)
- Manual testing of all major pages

#### Accessibility Tests
- Color contrast validation (use axe DevTools)
- Ensure theme toggle is keyboard accessible

### ⏱️ Estimated Effort
- **Development:** 7-10 days
- **Testing:** 2 days
- **Documentation:** 1 day
- **Total:** ~2 weeks

### 📊 Success Metrics
- [ ] All pages render correctly in both themes
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] Theme preference persists across sessions
- [ ] System theme detection works
- [ ] Charts and visualizations look good in dark mode
- [ ] No performance degradation from theme switching
- [ ] User preference analytics show >20% dark mode adoption

### 🚀 Rollout Plan
1. **Alpha:** Test internally with team
2. **Beta:** Release to 10% of users with opt-in flag
3. **GA:** Full rollout with announcement

---

## 2. Loading Skeletons

### 📋 Overview
Replace basic loading spinners with skeleton screens that match the layout of loaded content, improving perceived performance.

### 🎯 Goals
- Reduce perceived loading time by 20-30%
- Provide visual feedback on what content is loading
- Improve user experience during data fetching
- Maintain layout stability (no layout shift)

### 🔧 Technical Approach

#### Architecture
```typescript
// Skeleton loading pattern
Component
  ↓
Loading State Check
  ↓
Skeleton UI (loading) OR Actual Content (loaded)
```

#### Technology Stack
- **MUI Skeleton Component** - Already available in Material-UI
- **React Suspense** - For component-level loading states
- **Custom Skeleton Components** - Match actual component layouts

### 📝 Implementation Steps

#### Phase 1: Core Skeleton Components (2-3 days)

1. **Create Chart Skeleton Component**
   - File: `app/components/skeletons/chart-skeleton.tsx`
   ```typescript
   import { Box, Skeleton, Stack } from '@mui/material';

   export function ChartSkeleton({ variant = 'rectangular' }) {
     return (
       <Stack spacing={2} sx={{ p: 3 }}>
         {/* Chart Title */}
         <Skeleton variant="text" width="40%" height={32} />

         {/* Chart Legend */}
         <Stack direction="row" spacing={2}>
           <Skeleton variant="rectangular" width={80} height={20} />
           <Skeleton variant="rectangular" width={80} height={20} />
           <Skeleton variant="rectangular" width={80} height={20} />
         </Stack>

         {/* Chart Area */}
         <Skeleton
           variant={variant}
           width="100%"
           height={400}
           sx={{ borderRadius: 1 }}
         />

         {/* Chart Footer/Metadata */}
         <Stack direction="row" spacing={2} justifyContent="space-between">
           <Skeleton variant="text" width="30%" height={20} />
           <Skeleton variant="text" width="20%" height={20} />
         </Stack>
       </Stack>
     );
   }

   // Variants for different chart types
   export function BarChartSkeleton() {
     return (
       <Stack spacing={1} sx={{ p: 3 }}>
         <Skeleton variant="text" width="40%" height={32} />
         {[...Array(5)].map((_, i) => (
           <Stack key={i} direction="row" spacing={1} alignItems="center">
             <Skeleton variant="text" width={100} height={30} />
             <Skeleton
               variant="rectangular"
               width={`${Math.random() * 60 + 40}%`}
               height={30}
             />
           </Stack>
         ))}
       </Stack>
     );
   }
   ```

2. **Create Data Table Skeleton**
   - File: `app/components/skeletons/table-skeleton.tsx`
   ```typescript
   import { Table, TableBody, TableCell, TableHead, TableRow, Skeleton } from '@mui/material';

   export function TableSkeleton({ rows = 10, columns = 5 }) {
     return (
       <Table>
         <TableHead>
           <TableRow>
             {[...Array(columns)].map((_, i) => (
               <TableCell key={i}>
                 <Skeleton variant="text" width="80%" />
               </TableCell>
             ))}
           </TableRow>
         </TableHead>
         <TableBody>
           {[...Array(rows)].map((_, rowIndex) => (
             <TableRow key={rowIndex}>
               {[...Array(columns)].map((_, colIndex) => (
                 <TableCell key={colIndex}>
                   <Skeleton variant="text" width={`${Math.random() * 40 + 60}%`} />
                 </TableCell>
               ))}
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   }
   ```

3. **Create Dashboard Skeleton**
   - File: `app/components/skeletons/dashboard-skeleton.tsx`
   ```typescript
   import { Grid, Skeleton, Box } from '@mui/material';

   export function DashboardSkeleton() {
     return (
       <Grid container spacing={3}>
         {/* Summary Cards */}
         {[...Array(4)].map((_, i) => (
           <Grid item xs={12} sm={6} md={3} key={i}>
             <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
               <Skeleton variant="text" width="60%" height={20} />
               <Skeleton variant="text" width="40%" height={40} />
             </Box>
           </Grid>
         ))}

         {/* Main Charts */}
         {[...Array(2)].map((_, i) => (
           <Grid item xs={12} md={6} key={i}>
             <ChartSkeleton />
           </Grid>
         ))}
       </Grid>
     );
   }
   ```

4. **Create List/Grid Skeleton**
   - File: `app/components/skeletons/list-skeleton.tsx`
   ```typescript
   import { Stack, Card, CardContent, Skeleton } from '@mui/material';

   export function ListSkeleton({ items = 6 }) {
     return (
       <Stack spacing={2}>
         {[...Array(items)].map((_, i) => (
           <Card key={i}>
             <CardContent>
               <Stack direction="row" spacing={2}>
                 <Skeleton variant="rectangular" width={60} height={60} />
                 <Stack flex={1} spacing={1}>
                   <Skeleton variant="text" width="70%" height={24} />
                   <Skeleton variant="text" width="50%" height={20} />
                   <Skeleton variant="text" width="30%" height={16} />
                 </Stack>
               </Stack>
             </CardContent>
           </Card>
         ))}
       </Stack>
     );
   }
   ```

#### Phase 2: Integration with Components (3-4 days)

1. **Update Chart Components**
   - File: `app/components/chart-preview.tsx`
   ```typescript
   import { ChartSkeleton } from '@/components/skeletons/chart-skeleton';

   export function ChartPreview({ chartId }) {
     const { data, loading } = useChartData(chartId);

     if (loading) {
       return <ChartSkeleton variant="rectangular" />;
     }

     return <Chart data={data} />;
   }
   ```

2. **Update Data Table Components**
   - File: `app/components/chart-data-table-preview.tsx`
   ```typescript
   import { TableSkeleton } from '@/components/skeletons/table-skeleton';

   export function ChartDataTablePreview({ data, loading }) {
     if (loading) {
       return <TableSkeleton rows={10} columns={5} />;
     }

     return <DataTable data={data} />;
   }
   ```

3. **Update Dashboard Components**
   - File: `app/components/dashboard-*.tsx`
   - Replace loading spinners with `<DashboardSkeleton />`

4. **Update Browse/Search Pages**
   - Files: `app/browse/*.tsx`, `app/__test/search.tsx`
   - Replace loading states with `<ListSkeleton />`

#### Phase 3: Progressive Enhancement (2 days)

1. **Add Shimmer Animation**
   ```typescript
   // app/components/skeletons/animated-skeleton.tsx
   import { Skeleton, styled } from '@mui/material';

   export const AnimatedSkeleton = styled(Skeleton)(({ theme }) => ({
     '&::after': {
       animation: 'shimmer 2s infinite',
     },
     '@keyframes shimmer': {
       '0%': {
         transform: 'translateX(-100%)',
       },
       '100%': {
         transform: 'translateX(100%)',
       },
     },
   }));
   ```

2. **Add Staggered Loading**
   ```typescript
   // Stagger skeleton appearance for better UX
   export function StaggeredListSkeleton({ items = 6 }) {
     return (
       <Stack spacing={2}>
         {[...Array(items)].map((_, i) => (
           <Box
             key={i}
             sx={{
               animation: 'fadeIn 0.3s ease-in',
               animationDelay: `${i * 0.05}s`,
               animationFillMode: 'backwards',
             }}
           >
             <ListItemSkeleton />
           </Box>
         ))}
       </Stack>
     );
   }
   ```

3. **Content Placeholder Text**
   - Add descriptive text like "Loading chart data..." for screen readers

### 📂 Files to Create/Modify

**Create:**
- `app/components/skeletons/chart-skeleton.tsx`
- `app/components/skeletons/table-skeleton.tsx`
- `app/components/skeletons/dashboard-skeleton.tsx`
- `app/components/skeletons/list-skeleton.tsx`
- `app/components/skeletons/animated-skeleton.tsx`
- `app/components/skeletons/index.ts` - Barrel export

**Modify:**
- `app/components/chart-preview.tsx`
- `app/components/chart-published.tsx`
- `app/components/chart-data-table-preview.tsx`
- `app/components/dashboard-*.tsx` (3-4 files)
- `app/browse/*.tsx` (2-3 files)
- `app/__test/search.tsx`

### 🧪 Testing Strategy

#### Visual Tests
- Storybook stories for all skeleton variants
- Compare skeleton layout to actual content layout
- Test animation smoothness

#### Performance Tests
```typescript
// Measure perceived performance improvement
describe('Loading Performance', () => {
  it('should show skeleton within 100ms', () => {
    const start = performance.now();
    render(<ChartPreview loading={true} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});
```

#### Accessibility Tests
- Ensure skeletons have proper ARIA labels
- Test with screen readers (should announce "Loading...")

### ⏱️ Estimated Effort
- **Development:** 7-9 days
- **Testing:** 2 days
- **Documentation:** 0.5 days
- **Total:** ~2 weeks

### 📊 Success Metrics
- [ ] All major components have skeleton states
- [ ] Skeleton layout matches actual content layout (no layout shift)
- [ ] Perceived load time reduced by 20-30% (user surveys)
- [ ] No accessibility regressions
- [ ] Animations are smooth (60fps)
- [ ] Skeleton components documented in Storybook

---

## 3. Chart Templates Library

### 📋 Overview
Create a library of pre-configured chart templates for common use cases, allowing users to quickly start with best-practice visualizations.

### 🎯 Goals
- Reduce time-to-first-chart from 10+ minutes to <2 minutes
- Educate users on data visualization best practices
- Increase chart creation rate by 40%
- Provide starting points for complex visualizations

### 🔧 Technical Approach

#### Architecture
```typescript
// Template system architecture
Template Gallery (UI)
  ↓
Template Selection
  ↓
Template Application (clone config + apply to dataset)
  ↓
Chart Configurator (user can customize)
```

#### Data Model
```typescript
interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'time-series' | 'comparison' | 'distribution' | 'relationship' | 'geographic';
  chartType: ChartType;
  preview: string; // SVG or image URL
  config: ChartConfig; // Chart configuration
  dataRequirements: {
    dimensions: number; // Required number of dimensions
    measures: number; // Required number of measures
    temporalDimension?: boolean; // Requires date/time field
    geographicDimension?: boolean; // Requires geographic field
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

### 📝 Implementation Steps

#### Phase 1: Template Data & Infrastructure (3-4 days)

1. **Create Template Definitions**
   - File: `app/templates/template-library.ts`
   ```typescript
   export const CHART_TEMPLATES: ChartTemplate[] = [
     {
       id: 'trend-over-time',
       name: 'Trend Over Time',
       description: 'Show how values change over time with a line chart',
       category: 'time-series',
       chartType: 'line',
       preview: '/templates/previews/trend-over-time.svg',
       config: {
         version: '4.0',
         chartType: 'line',
         fields: {
           x: { componentIri: '' }, // Will be mapped to user data
           y: { componentIri: '' },
         },
         interactiveFiltersConfig: {
           legend: { active: true },
           timeRange: { active: true },
         },
       },
       dataRequirements: {
         dimensions: 1,
         measures: 1,
         temporalDimension: true,
       },
       tags: ['time-series', 'trends', 'beginner'],
       difficulty: 'beginner',
     },
     {
       id: 'category-comparison',
       name: 'Compare Categories',
       description: 'Compare values across different categories with a bar chart',
       category: 'comparison',
       chartType: 'bar',
       config: {
         // Bar chart configuration
       },
       dataRequirements: {
         dimensions: 1,
         measures: 1,
       },
       tags: ['comparison', 'categories', 'beginner'],
       difficulty: 'beginner',
     },
     {
       id: 'geographic-distribution',
       name: 'Geographic Distribution',
       description: 'Show data on a map with color-coded regions',
       category: 'geographic',
       chartType: 'map',
       config: {
         // Map configuration
       },
       dataRequirements: {
         dimensions: 1,
         measures: 1,
         geographicDimension: true,
       },
       tags: ['map', 'geography', 'intermediate'],
       difficulty: 'intermediate',
     },
     {
       id: 'multi-metric-dashboard',
       name: 'Multi-Metric Dashboard',
       description: 'Display multiple KPIs in a combo chart',
       category: 'comparison',
       chartType: 'combo',
       config: {
         // Combo chart configuration
       },
       dataRequirements: {
         dimensions: 1,
         measures: 3,
       },
       tags: ['dashboard', 'kpi', 'advanced'],
       difficulty: 'advanced',
     },
     {
       id: 'population-pyramid',
       name: 'Population Pyramid',
       description: 'Age and gender distribution visualization',
       category: 'distribution',
       chartType: 'bar',
       config: {
         // Specialized bar chart for demographics
       },
       dataRequirements: {
         dimensions: 2, // Age group + Gender
         measures: 1,
       },
       tags: ['demographics', 'population', 'intermediate'],
       difficulty: 'intermediate',
     },
     {
       id: 'year-over-year-comparison',
       name: 'Year-over-Year Comparison',
       description: 'Compare current year with previous years',
       category: 'time-series',
       chartType: 'column',
       config: {
         // Column chart with grouped years
       },
       dataRequirements: {
         dimensions: 2, // Category + Year
         measures: 1,
       },
       tags: ['time-series', 'comparison', 'intermediate'],
       difficulty: 'intermediate',
     },
     {
       id: 'correlation-scatter',
       name: 'Correlation Analysis',
       description: 'Explore relationship between two variables',
       category: 'relationship',
       chartType: 'scatterplot',
       config: {
         // Scatterplot configuration
       },
       dataRequirements: {
         dimensions: 0,
         measures: 2,
       },
       tags: ['correlation', 'analysis', 'advanced'],
       difficulty: 'advanced',
     },
   ];
   ```

2. **Create Template Service**
   - File: `app/templates/template-service.ts`
   ```typescript
   export class TemplateService {
     /**
      * Get all templates, optionally filtered
      */
     static getTemplates(filters?: {
       category?: string;
       difficulty?: string;
       tags?: string[];
     }): ChartTemplate[] {
       let templates = CHART_TEMPLATES;

       if (filters?.category) {
         templates = templates.filter(t => t.category === filters.category);
       }

       if (filters?.difficulty) {
         templates = templates.filter(t => t.difficulty === filters.difficulty);
       }

       if (filters?.tags?.length) {
         templates = templates.filter(t =>
           filters.tags.some(tag => t.tags.includes(tag))
         );
       }

       return templates;
     }

     /**
      * Check if dataset is compatible with template
      */
     static isCompatible(
       template: ChartTemplate,
       dataset: Dataset
     ): boolean {
       const { dimensions, measures, temporalDimension, geographicDimension } =
         template.dataRequirements;

       const datasetDimensions = dataset.dimensions.length;
       const datasetMeasures = dataset.measures.length;
       const hasTemporalDim = dataset.dimensions.some(d => d.isTemporalDimension);
       const hasGeoDim = dataset.dimensions.some(d => d.isGeoDimension);

       return (
         datasetDimensions >= dimensions &&
         datasetMeasures >= measures &&
         (!temporalDimension || hasTemporalDim) &&
         (!geographicDimension || hasGeoDim)
       );
     }

     /**
      * Apply template to dataset
      */
     static applyTemplate(
       template: ChartTemplate,
       dataset: Dataset
     ): ChartConfig {
       const config = { ...template.config };

       // Auto-map dataset fields to template config
       if (template.dataRequirements.temporalDimension) {
         const temporalDim = dataset.dimensions.find(d => d.isTemporalDimension);
         if (temporalDim) {
           config.fields.x = { componentIri: temporalDim.iri };
         }
       }

       // Map first measure to y-axis
       if (dataset.measures.length > 0) {
         config.fields.y = { componentIri: dataset.measures[0].iri };
       }

       return config;
     }
   }
   ```

#### Phase 2: Template Gallery UI (4-5 days)

1. **Create Template Gallery Page**
   - File: `app/templates/page.tsx`
   ```typescript
   'use client';

   import { useState } from 'react';
   import { Grid, Card, CardContent, CardMedia, Chip, Typography, Box } from '@mui/material';
   import { TemplateService } from './template-service';

   export default function TemplateGalleryPage() {
     const [category, setCategory] = useState<string | null>(null);
     const [difficulty, setDifficulty] = useState<string | null>(null);

     const templates = TemplateService.getTemplates({ category, difficulty });

     return (
       <Box sx={{ p: 4 }}>
         <Typography variant="h3" gutterBottom>
           Chart Templates
         </Typography>
         <Typography variant="body1" color="text.secondary" paragraph>
           Start with a pre-configured chart template and customize it for your data
         </Typography>

         {/* Filters */}
         <Box sx={{ mb: 4 }}>
           <Typography variant="subtitle2" gutterBottom>Category</Typography>
           <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
             {['time-series', 'comparison', 'distribution', 'relationship', 'geographic'].map(cat => (
               <Chip
                 key={cat}
                 label={cat}
                 onClick={() => setCategory(cat === category ? null : cat)}
                 color={category === cat ? 'primary' : 'default'}
               />
             ))}
           </Box>

           <Typography variant="subtitle2" gutterBottom>Difficulty</Typography>
           <Box sx={{ display: 'flex', gap: 1 }}>
             {['beginner', 'intermediate', 'advanced'].map(diff => (
               <Chip
                 key={diff}
                 label={diff}
                 onClick={() => setDifficulty(diff === difficulty ? null : diff)}
                 color={difficulty === diff ? 'primary' : 'default'}
               />
             ))}
           </Box>
         </Box>

         {/* Template Grid */}
         <Grid container spacing={3}>
           {templates.map(template => (
             <Grid item xs={12} sm={6} md={4} key={template.id}>
               <TemplateCard template={template} />
             </Grid>
           ))}
         </Grid>
       </Box>
     );
   }
   ```

2. **Create Template Card Component**
   - File: `app/templates/template-card.tsx`
   ```typescript
   import { Card, CardContent, CardMedia, CardActions, Button, Chip, Stack, Typography } from '@mui/material';
   import { useRouter } from 'next/navigation';

   export function TemplateCard({ template }: { template: ChartTemplate }) {
     const router = useRouter();

     const handleUseTemplate = () => {
       // Navigate to chart creation with template ID
       router.push(`/create?templateId=${template.id}`);
     };

     return (
       <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
         <CardMedia
           component="img"
           height="200"
           image={template.preview}
           alt={template.name}
         />
         <CardContent sx={{ flexGrow: 1 }}>
           <Typography variant="h6" gutterBottom>
             {template.name}
           </Typography>
           <Typography variant="body2" color="text.secondary" paragraph>
             {template.description}
           </Typography>

           <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
             <Chip
               label={template.difficulty}
               size="small"
               color={
                 template.difficulty === 'beginner' ? 'success' :
                 template.difficulty === 'intermediate' ? 'warning' : 'error'
               }
             />
             <Chip label={template.category} size="small" variant="outlined" />
           </Stack>
         </CardContent>

         <CardActions>
           <Button size="small" onClick={handleUseTemplate}>
             Use Template
           </Button>
           <Button size="small" href={`/templates/${template.id}/preview`}>
             Preview
           </Button>
         </CardActions>
       </Card>
     );
   }
   ```

3. **Create Template Preview Modal**
   - File: `app/templates/template-preview-modal.tsx`
   ```typescript
   import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

   export function TemplatePreviewModal({
     template,
     open,
     onClose,
     onUse
   }: {
     template: ChartTemplate;
     open: boolean;
     onClose: () => void;
     onUse: () => void;
   }) {
     return (
       <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
         <DialogTitle>{template.name}</DialogTitle>
         <DialogContent>
           {/* Show larger preview with sample data */}
           <img
             src={template.preview}
             alt={template.name}
             style={{ width: '100%' }}
           />

           <Typography variant="body1" sx={{ mt: 2 }}>
             {template.description}
           </Typography>

           <Typography variant="subtitle2" sx={{ mt: 2 }}>
             Data Requirements:
           </Typography>
           <ul>
             <li>{template.dataRequirements.dimensions} dimension(s)</li>
             <li>{template.dataRequirements.measures} measure(s)</li>
             {template.dataRequirements.temporalDimension && (
               <li>Requires time/date field</li>
             )}
             {template.dataRequirements.geographicDimension && (
               <li>Requires geographic field</li>
             )}
           </ul>
         </DialogContent>
         <DialogActions>
           <Button onClick={onClose}>Cancel</Button>
           <Button onClick={onUse} variant="contained">
             Use This Template
           </Button>
         </DialogActions>
       </Dialog>
     );
   }
   ```

#### Phase 3: Integration with Chart Creation (2-3 days)

1. **Update Chart Creation Flow**
   - File: `app/create/page.tsx`
   ```typescript
   'use client';

   import { useSearchParams } from 'next/navigation';
   import { useEffect } from 'react';
   import { TemplateService } from '@/templates/template-service';

   export default function CreateChartPage() {
     const searchParams = useSearchParams();
     const templateId = searchParams.get('templateId');

     useEffect(() => {
       if (templateId) {
         const template = CHART_TEMPLATES.find(t => t.id === templateId);
         if (template) {
           // Apply template to chart config
           applyTemplateToChart(template);
         }
       }
     }, [templateId]);

     // Rest of chart creation logic
   }
   ```

2. **Add Template Suggestion in Chart Configurator**
   - File: `app/configurator/config-form.tsx`
   ```typescript
   // Add "Start from template" button at top of configurator
   <Button
     startIcon={<TemplateIcon />}
     onClick={() => setShowTemplates(true)}
   >
     Start from Template
   </Button>
   ```

3. **Create "Template Picker" for Datasets**
   - File: `app/components/dataset-template-picker.tsx`
   ```typescript
   export function DatasetTemplatePicker({ dataset }: { dataset: Dataset }) {
     const compatibleTemplates = CHART_TEMPLATES.filter(template =>
       TemplateService.isCompatible(template, dataset)
     );

     return (
       <Box>
         <Typography variant="h6">
           Suggested Templates for This Dataset
         </Typography>
         <Grid container spacing={2}>
           {compatibleTemplates.map(template => (
             <Grid item xs={12} sm={6} md={4} key={template.id}>
               <TemplateCard template={template} dataset={dataset} />
             </Grid>
           ))}
         </Grid>
       </Box>
     );
   }
   ```

#### Phase 4: Template Previews & Assets (2-3 days)

1. **Generate Template Preview Images**
   - Create sample visualizations for each template
   - Export as SVG/PNG
   - Store in `public/templates/previews/`

2. **Create Interactive Template Demos**
   - File: `app/templates/[id]/demo/page.tsx`
   - Live, interactive demo with sample data

3. **Add Sample Datasets**
   - File: `app/templates/sample-data.ts`
   - Sample data for each template

### 📂 Files to Create/Modify

**Create:**
- `app/templates/template-library.ts` - Template definitions
- `app/templates/template-service.ts` - Template logic
- `app/templates/page.tsx` - Template gallery page
- `app/templates/template-card.tsx` - Template card component
- `app/templates/template-preview-modal.tsx` - Preview modal
- `app/templates/[id]/demo/page.tsx` - Interactive demo
- `app/templates/sample-data.ts` - Sample datasets
- `app/components/dataset-template-picker.tsx` - Template suggestions
- `public/templates/previews/*.svg` - Template preview images (7+ files)

**Modify:**
- `app/create/page.tsx` - Add template support
- `app/configurator/config-form.tsx` - Add template picker button
- `app/components/navigation.tsx` - Add "Templates" link

### 🧪 Testing Strategy

#### Unit Tests
```typescript
describe('TemplateService', () => {
  it('should filter templates by category', () => {
    const templates = TemplateService.getTemplates({ category: 'time-series' });
    expect(templates.every(t => t.category === 'time-series')).toBe(true);
  });

  it('should check dataset compatibility', () => {
    const template = CHART_TEMPLATES[0];
    const compatibleDataset = { /* ... */ };
    expect(TemplateService.isCompatible(template, compatibleDataset)).toBe(true);
  });

  it('should apply template to dataset', () => {
    const template = CHART_TEMPLATES[0];
    const dataset = { /* ... */ };
    const config = TemplateService.applyTemplate(template, dataset);
    expect(config.chartType).toBe(template.chartType);
  });
});
```

#### Integration Tests
- Test template application creates valid chart config
- Test template gallery filters work correctly
- Test template preview modal

#### User Testing
- Observe 5-10 users creating charts with templates
- Measure time-to-first-chart
- Gather feedback on template usefulness

### ⏱️ Estimated Effort
- **Development:** 11-15 days
- **Design/Assets:** 2-3 days (preview images)
- **Testing:** 2 days
- **Documentation:** 1 day
- **Total:** ~3 weeks

### 📊 Success Metrics
- [ ] 7+ templates available at launch
- [ ] Template gallery has good UX (filters, search work well)
- [ ] Users can apply template in <30 seconds
- [ ] 30%+ of new charts use templates
- [ ] Time-to-first-chart reduced by 50%
- [ ] User satisfaction score >4/5 for template feature

---

## 4. Command Palette (Keyboard Shortcuts)

### 📋 Overview
Implement a Cmd+K command palette for quick navigation and actions, similar to modern tools like VS Code, Linear, and Slack.

### 🎯 Goals
- Improve power user efficiency by 30-40%
- Provide keyboard-first navigation
- Discoverability of features and shortcuts
- Reduce mouse dependency

### 🔧 Technical Approach

#### Architecture
```typescript
// Command palette system
Keyboard Listener (Cmd/Ctrl + K)
  ↓
Command Palette Modal
  ↓
Fuzzy Search Engine
  ↓
Command Execution
```

#### Technology Stack
- **kbar** or **cmdk** - Command palette library
- **Fuse.js** - Fuzzy search
- **React Hooks** - Keyboard event listeners

### 📝 Implementation Steps

#### Phase 1: Core Command Palette (3-4 days)

1. **Install Dependencies**
   ```bash
   yarn add cmdk fuse.js
   ```

2. **Create Command Registry**
   - File: `app/commands/command-registry.ts`
   ```typescript
   export interface Command {
     id: string;
     name: string;
     description?: string;
     icon?: React.ComponentType;
     keywords: string[]; // For search
     shortcut?: string[]; // e.g., ['Cmd', 'N']
     section: 'navigation' | 'actions' | 'help';
     action: () => void | Promise<void>;
     when?: () => boolean; // Conditional availability
   }

   export const COMMANDS: Command[] = [
     // Navigation
     {
       id: 'go-home',
       name: 'Go to Home',
       icon: HomeIcon,
       keywords: ['home', 'dashboard'],
       section: 'navigation',
       action: () => router.push('/'),
     },
     {
       id: 'go-create',
       name: 'Create New Chart',
       icon: AddChartIcon,
       keywords: ['create', 'new', 'chart'],
       shortcut: ['Cmd', 'N'],
       section: 'navigation',
       action: () => router.push('/create'),
     },
     {
       id: 'go-templates',
       name: 'Browse Templates',
       icon: TemplateIcon,
       keywords: ['templates', 'browse'],
       section: 'navigation',
       action: () => router.push('/templates'),
     },
     {
       id: 'go-profile',
       name: 'Go to Profile',
       icon: PersonIcon,
       keywords: ['profile', 'settings', 'account'],
       section: 'navigation',
       action: () => router.push('/profile'),
     },

     // Actions
     {
       id: 'save-chart',
       name: 'Save Chart',
       icon: SaveIcon,
       keywords: ['save'],
       shortcut: ['Cmd', 'S'],
       section: 'actions',
       action: async () => await saveCurrentChart(),
       when: () => isChartEditorActive(),
     },
     {
       id: 'export-chart',
       name: 'Export Chart',
       icon: DownloadIcon,
       keywords: ['export', 'download'],
       shortcut: ['Cmd', 'E'],
       section: 'actions',
       action: () => openExportDialog(),
       when: () => isChartViewActive(),
     },
     {
       id: 'share-chart',
       name: 'Share Chart',
       icon: ShareIcon,
       keywords: ['share'],
       shortcut: ['Cmd', 'Shift', 'S'],
       section: 'actions',
       action: () => openShareDialog(),
       when: () => isChartViewActive(),
     },
     {
       id: 'toggle-theme',
       name: 'Toggle Dark Mode',
       icon: DarkModeIcon,
       keywords: ['theme', 'dark', 'light'],
       shortcut: ['Cmd', 'D'],
       section: 'actions',
       action: () => toggleTheme(),
     },
     {
       id: 'search',
       name: 'Search Charts',
       icon: SearchIcon,
       keywords: ['search', 'find'],
       shortcut: ['Cmd', 'F'],
       section: 'navigation',
       action: () => router.push('/__test/search'),
     },

     // Help
     {
       id: 'help-docs',
       name: 'View Documentation',
       icon: HelpIcon,
       keywords: ['help', 'docs', 'documentation'],
       shortcut: ['Shift', '?'],
       section: 'help',
       action: () => router.push('/docs'),
     },
     {
       id: 'help-shortcuts',
       name: 'View Keyboard Shortcuts',
       icon: KeyboardIcon,
       keywords: ['shortcuts', 'keyboard'],
       section: 'help',
       action: () => setShowShortcutsDialog(true),
     },
   ];
   ```

3. **Create Command Palette Component**
   - File: `app/components/command-palette.tsx`
   ```typescript
   'use client';

   import { useEffect, useState } from 'react';
   import { Command } from 'cmdk';
   import { Dialog, DialogContent } from '@mui/material';
   import { COMMANDS } from '@/commands/command-registry';
   import Fuse from 'fuse.js';

   export function CommandPalette() {
     const [open, setOpen] = useState(false);
     const [search, setSearch] = useState('');

     // Listen for Cmd+K
     useEffect(() => {
       const down = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
           e.preventDefault();
           setOpen(true);
         }
       };

       document.addEventListener('keydown', down);
       return () => document.removeEventListener('keydown', down);
     }, []);

     // Filter commands
     const fuse = new Fuse(COMMANDS, {
       keys: ['name', 'keywords'],
       threshold: 0.3,
     });

     const filteredCommands = search
       ? fuse.search(search).map(result => result.item)
       : COMMANDS;

     // Filter by availability
     const availableCommands = filteredCommands.filter(cmd =>
       cmd.when ? cmd.when() : true
     );

     const handleSelect = (command: Command) => {
       command.action();
       setOpen(false);
       setSearch('');
     };

     return (
       <Dialog
         open={open}
         onClose={() => setOpen(false)}
         maxWidth="sm"
         fullWidth
       >
         <DialogContent sx={{ p: 0 }}>
           <Command>
             <Command.Input
               placeholder="Type a command or search..."
               value={search}
               onValueChange={setSearch}
             />
             <Command.List>
               <Command.Empty>No results found.</Command.Empty>

               {['navigation', 'actions', 'help'].map(section => (
                 <Command.Group key={section} heading={section.toUpperCase()}>
                   {availableCommands
                     .filter(cmd => cmd.section === section)
                     .map(command => (
                       <Command.Item
                         key={command.id}
                         onSelect={() => handleSelect(command)}
                       >
                         {command.icon && <command.icon />}
                         <span>{command.name}</span>
                         {command.shortcut && (
                           <kbd>{command.shortcut.join(' + ')}</kbd>
                         )}
                       </Command.Item>
                     ))
                   }
                 </Command.Group>
               ))}
             </Command.List>
           </Command>
         </DialogContent>
       </Dialog>
     );
   }
   ```

4. **Add Command Palette to App**
   - File: `app/layout.tsx`
   ```typescript
   import { CommandPalette } from '@/components/command-palette';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <CommandPalette />
           {children}
         </body>
       </html>
     );
   }
   ```

#### Phase 2: Keyboard Shortcuts (2-3 days)

1. **Create Keyboard Shortcut Hook**
   - File: `app/hooks/use-keyboard-shortcut.ts`
   ```typescript
   import { useEffect } from 'react';

   export function useKeyboardShortcut(
     keys: string[],
     callback: () => void,
     options?: { enabled?: boolean }
   ) {
     useEffect(() => {
       if (options?.enabled === false) return;

       const handleKeyDown = (e: KeyboardEvent) => {
         const matchesShortcut = keys.every(key => {
           switch (key) {
             case 'Cmd':
             case 'Meta':
               return e.metaKey || e.ctrlKey;
             case 'Shift':
               return e.shiftKey;
             case 'Alt':
               return e.altKey;
             default:
               return e.key.toLowerCase() === key.toLowerCase();
           }
         });

         if (matchesShortcut) {
           e.preventDefault();
           callback();
         }
       };

       document.addEventListener('keydown', handleKeyDown);
       return () => document.removeEventListener('keydown', handleKeyDown);
     }, [keys, callback, options?.enabled]);
   }
   ```

2. **Implement Global Shortcuts**
   - File: `app/components/keyboard-shortcuts-provider.tsx`
   ```typescript
   'use client';

   import { useRouter } from 'next/navigation';
   import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

   export function KeyboardShortcutsProvider({ children }) {
     const router = useRouter();

     // Global shortcuts
     useKeyboardShortcut(['Cmd', 'N'], () => router.push('/create'));
     useKeyboardShortcut(['Cmd', 'F'], () => router.push('/__test/search'));
     useKeyboardShortcut(['Cmd', 'H'], () => router.push('/'));
     useKeyboardShortcut(['Shift', '?'], () => setShowHelp(true));

     return <>{children}</>;
   }
   ```

3. **Create Keyboard Shortcuts Dialog**
   - File: `app/components/keyboard-shortcuts-dialog.tsx`
   ```typescript
   import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell } from '@mui/material';
   import { COMMANDS } from '@/commands/command-registry';

   export function KeyboardShortcutsDialog({ open, onClose }) {
     const commandsWithShortcuts = COMMANDS.filter(cmd => cmd.shortcut);

     return (
       <Dialog open={open} onClose={onClose} maxWidth="md">
         <DialogTitle>Keyboard Shortcuts</DialogTitle>
         <DialogContent>
           <Table>
             <TableBody>
               {commandsWithShortcuts.map(command => (
                 <TableRow key={command.id}>
                   <TableCell>{command.name}</TableCell>
                   <TableCell align="right">
                     <kbd>{command.shortcut.join(' + ')}</kbd>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </DialogContent>
       </Dialog>
     );
   }
   ```

#### Phase 3: Context-Aware Commands (2 days)

1. **Add Chart-Specific Commands**
   ```typescript
   // Add to command registry
   {
     id: 'change-chart-type',
     name: 'Change Chart Type',
     keywords: ['chart', 'type', 'change'],
     section: 'actions',
     action: () => openChartTypePicker(),
     when: () => isChartEditorActive(),
   },
   {
     id: 'add-filter',
     name: 'Add Filter',
     keywords: ['filter', 'add'],
     shortcut: ['Cmd', 'Shift', 'F'],
     section: 'actions',
     action: () => openFilterDialog(),
     when: () => isChartEditorActive(),
   },
   ```

2. **Recent Items in Command Palette**
   ```typescript
   // Add recent charts to command palette
   const recentCharts = useRecentCharts();

   const recentCommands = recentCharts.map(chart => ({
     id: `open-${chart.id}`,
     name: `Open "${chart.title}"`,
     section: 'recent',
     action: () => router.push(`/v/${chart.id}`),
   }));
   ```

### 📂 Files to Create/Modify

**Create:**
- `app/commands/command-registry.ts`
- `app/components/command-palette.tsx`
- `app/components/keyboard-shortcuts-provider.tsx`
- `app/components/keyboard-shortcuts-dialog.tsx`
- `app/hooks/use-keyboard-shortcut.ts`

**Modify:**
- `app/layout.tsx` - Add command palette and shortcuts provider
- `app/components/header.tsx` - Add keyboard shortcuts button

### 🧪 Testing Strategy

#### Unit Tests
```typescript
describe('CommandPalette', () => {
  it('should open on Cmd+K', () => {
    render(<CommandPalette />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByPlaceholderText(/type a command/i)).toBeInTheDocument();
  });

  it('should filter commands by search', () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/type a command/i);
    fireEvent.change(input, { target: { value: 'create' } });
    expect(screen.getByText('Create New Chart')).toBeInTheDocument();
  });

  it('should execute command on select', () => {
    const mockAction = jest.fn();
    // Test command execution
  });
});
```

#### E2E Tests
```typescript
test('keyboard shortcuts work end-to-end', async ({ page }) => {
  await page.goto('/');

  // Test Cmd+K opens command palette
  await page.keyboard.press('Meta+K');
  await expect(page.locator('[placeholder*="command"]')).toBeVisible();

  // Test Cmd+N creates new chart
  await page.keyboard.press('Meta+N');
  await expect(page).toHaveURL('/create');
});
```

### ⏱️ Estimated Effort
- **Development:** 7-9 days
- **Testing:** 2 days
- **Documentation:** 1 day
- **Total:** ~2 weeks

### 📊 Success Metrics
- [ ] Command palette opens in <100ms
- [ ] All major actions accessible via commands
- [ ] 15+ commands available at launch
- [ ] Fuzzy search works accurately
- [ ] 20%+ of power users adopt shortcuts
- [ ] Keyboard navigation works throughout app

---

## 5. Data Freshness Indicators

### 📋 Overview
Display when datasets were last updated to help users trust the data and make informed decisions about chart accuracy.

### 🎯 Goals
- Increase user trust in data accuracy
- Help users identify stale data
- Comply with data transparency best practices
- Surface data update frequency

### 🔧 Technical Approach

#### Architecture
```typescript
// Data freshness system
Dataset Metadata
  ↓
Freshness Calculator (relative time)
  ↓
Visual Indicator (badge, tooltip)
```

#### Technology Stack
- **date-fns** - Already available, for date formatting
- **Dataset Metadata API** - Existing data.gov.rs API

### 📝 Implementation Steps

#### Phase 1: Freshness Calculation (1-2 days)

1. **Create Freshness Utility**
   - File: `app/utils/data-freshness.ts`
   ```typescript
   import { formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
   import { sr } from 'date-fns/locale';

   export type FreshnessLevel = 'fresh' | 'recent' | 'stale' | 'very-stale' | 'unknown';

   export interface DataFreshness {
     lastUpdated: Date | null;
     relativeTime: string; // "2 hours ago"
     absoluteTime: string; // "2025-11-19 14:30"
     level: FreshnessLevel;
     color: string;
     icon: string;
   }

   export function calculateFreshness(lastUpdatedIso: string | null): DataFreshness {
     if (!lastUpdatedIso) {
       return {
         lastUpdated: null,
         relativeTime: 'Unknown',
         absoluteTime: 'Unknown',
         level: 'unknown',
         color: 'grey',
         icon: '❓',
       };
     }

     const lastUpdated = parseISO(lastUpdatedIso);
     const daysDiff = differenceInDays(new Date(), lastUpdated);

     let level: FreshnessLevel;
     let color: string;
     let icon: string;

     if (daysDiff < 1) {
       level = 'fresh';
       color = 'success';
       icon = '🟢';
     } else if (daysDiff < 7) {
       level = 'recent';
       color = 'info';
       icon = '🔵';
     } else if (daysDiff < 30) {
       level = 'stale';
       color = 'warning';
       icon = '🟡';
     } else {
       level = 'very-stale';
       color = 'error';
       icon = '🔴';
     }

     return {
       lastUpdated,
       relativeTime: formatDistanceToNow(lastUpdated, {
         addSuffix: true,
         locale: sr, // Support Serbian locale
       }),
       absoluteTime: lastUpdated.toLocaleString(),
       level,
       color,
       icon,
     };
   }

   export function getFreshnessMessage(level: FreshnessLevel): string {
     switch (level) {
       case 'fresh':
         return 'Data is up-to-date';
       case 'recent':
         return 'Data is recent';
       case 'stale':
         return 'Data may be outdated';
       case 'very-stale':
         return 'Data is outdated';
       case 'unknown':
         return 'Data freshness unknown';
     }
   }
   ```

2. **Extend Dataset Type**
   - File: `app/domain/data.ts` (or wherever Dataset type is defined)
   ```typescript
   export interface Dataset {
     // ... existing fields
     metadata: {
       lastUpdated?: string; // ISO date string
       updateFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'irregular';
       source?: string;
     };
   }
   ```

#### Phase 2: UI Components (2-3 days)

1. **Create Freshness Badge Component**
   - File: `app/components/data-freshness-badge.tsx`
   ```typescript
   import { Chip, Tooltip } from '@mui/material';
   import { AccessTime, Info } from '@mui/icons-material';
   import { calculateFreshness, getFreshnessMessage } from '@/utils/data-freshness';

   export function DataFreshnessBadge({
     lastUpdated,
     showIcon = true,
     size = 'small',
   }: {
     lastUpdated: string | null;
     showIcon?: boolean;
     size?: 'small' | 'medium';
   }) {
     const freshness = calculateFreshness(lastUpdated);

     return (
       <Tooltip
         title={
           <div>
             <div><strong>Last updated:</strong> {freshness.absoluteTime}</div>
             <div>{getFreshnessMessage(freshness.level)}</div>
           </div>
         }
       >
         <Chip
           icon={showIcon ? <AccessTime /> : undefined}
           label={freshness.relativeTime}
           size={size}
           color={freshness.color as any}
           variant="outlined"
         />
       </Tooltip>
     );
   }
   ```

2. **Create Detailed Freshness Info Component**
   - File: `app/components/data-freshness-info.tsx`
   ```typescript
   import { Box, Typography, Alert } from '@mui/material';
   import { calculateFreshness, getFreshnessMessage } from '@/utils/data-freshness';

   export function DataFreshnessInfo({
     lastUpdated,
     updateFrequency,
     source,
   }: {
     lastUpdated: string | null;
     updateFrequency?: string;
     source?: string;
   }) {
     const freshness = calculateFreshness(lastUpdated);

     // Show warning for stale data
     const showWarning = freshness.level === 'stale' || freshness.level === 'very-stale';

     return (
       <Box>
         {showWarning && (
           <Alert severity="warning" sx={{ mb: 2 }}>
             {getFreshnessMessage(freshness.level)}
           </Alert>
         )}

         <Typography variant="body2" color="text.secondary">
           <strong>Last updated:</strong> {freshness.relativeTime}
         </Typography>

         {updateFrequency && (
           <Typography variant="body2" color="text.secondary">
             <strong>Update frequency:</strong> {updateFrequency}
           </Typography>
         )}

         {source && (
           <Typography variant="body2" color="text.secondary">
             <strong>Source:</strong> {source}
           </Typography>
         )}
       </Box>
     );
   }
   ```

#### Phase 3: Integration (2-3 days)

1. **Add to Chart Metadata/Footnotes**
   - File: `app/components/chart-footnotes.tsx`
   ```typescript
   import { DataFreshnessBadge } from './data-freshness-badge';

   export function ChartFootnotes({ chart }) {
     return (
       <Box>
         {/* Existing footnotes */}

         {/* Add freshness badge */}
         <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
           <DataFreshnessBadge lastUpdated={chart.dataset.metadata.lastUpdated} />
           {chart.dataset.metadata.source && (
             <Typography variant="caption" color="text.secondary">
               Source: {chart.dataset.metadata.source}
             </Typography>
           )}
         </Box>
       </Box>
     );
   }
   ```

2. **Add to Dataset Browse/Search**
   - File: `app/browse/dataset-card.tsx` (or similar)
   ```typescript
   export function DatasetCard({ dataset }) {
     return (
       <Card>
         <CardContent>
           <Typography variant="h6">{dataset.title}</Typography>

           {/* Add freshness badge */}
           <Box sx={{ mt: 1 }}>
             <DataFreshnessBadge lastUpdated={dataset.metadata.lastUpdated} />
           </Box>

           {/* Rest of card content */}
         </CardContent>
       </Card>
     );
   }
   ```

3. **Add to Chart Configuration Panel**
   - File: `app/configurator/dataset-selector.tsx` (or similar)
   ```typescript
   export function DatasetSelector({ selectedDataset }) {
     return (
       <Box>
         <Typography variant="subtitle1">Selected Dataset</Typography>

         {selectedDataset && (
           <Box>
             <Typography>{selectedDataset.title}</Typography>

             {/* Show detailed freshness info */}
             <DataFreshnessInfo
               lastUpdated={selectedDataset.metadata.lastUpdated}
               updateFrequency={selectedDataset.metadata.updateFrequency}
               source={selectedDataset.metadata.source}
             />
           </Box>
         )}
       </Box>
     );
   }
   ```

4. **Update data.gov.rs API Client**
   - File: `app/domain/data-gov-rs/*.ts`
   ```typescript
   // Ensure we fetch and parse metadata.lastUpdated from API
   export async function fetchDataset(id: string): Promise<Dataset> {
     const response = await fetch(`${API_URL}/datasets/${id}`);
     const data = await response.json();

     return {
       id: data.id,
       title: data.title,
       // ... other fields
       metadata: {
         lastUpdated: data.metadata?.modified || data.updated_at,
         updateFrequency: data.accrual_periodicity,
         source: data.source,
       },
     };
   }
   ```

#### Phase 4: Auto-Refresh (Optional, 1-2 days)

1. **Add Refresh Notification**
   - File: `app/components/data-refresh-notification.tsx`
   ```typescript
   export function DataRefreshNotification({ chartId }) {
     const { data: chart } = useChart(chartId);
     const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);

     useEffect(() => {
       // Check if data has been updated since chart was created
       if (chart && chart.dataset.metadata.lastUpdated) {
         const dataUpdated = parseISO(chart.dataset.metadata.lastUpdated);
         const chartCreated = parseISO(chart.createdAt);

         if (dataUpdated > chartCreated) {
           setShowRefreshPrompt(true);
         }
       }
     }, [chart]);

     if (!showRefreshPrompt) return null;

     return (
       <Alert severity="info" onClose={() => setShowRefreshPrompt(false)}>
         New data is available. <Button onClick={refreshChart}>Refresh chart</Button>
       </Alert>
     );
   }
   ```

### 📂 Files to Create/Modify

**Create:**
- `app/utils/data-freshness.ts`
- `app/components/data-freshness-badge.tsx`
- `app/components/data-freshness-info.tsx`
- `app/components/data-refresh-notification.tsx`

**Modify:**
- `app/components/chart-footnotes.tsx`
- `app/browse/dataset-card.tsx` (or equivalent)
- `app/configurator/dataset-selector.tsx`
- `app/domain/data-gov-rs/*.ts` - API client updates
- `app/domain/data.ts` - Type definitions

### 🧪 Testing Strategy

#### Unit Tests
```typescript
describe('calculateFreshness', () => {
  it('should return fresh for data updated today', () => {
    const result = calculateFreshness(new Date().toISOString());
    expect(result.level).toBe('fresh');
  });

  it('should return stale for data updated 15 days ago', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 15);
    const result = calculateFreshness(pastDate.toISOString());
    expect(result.level).toBe('stale');
  });

  it('should return unknown for null date', () => {
    const result = calculateFreshness(null);
    expect(result.level).toBe('unknown');
  });
});
```

#### Integration Tests
- Test badge renders correctly with different freshness levels
- Test tooltip shows correct information
- Test warning shows for stale data

### ⏱️ Estimated Effort
- **Development:** 5-7 days
- **API Integration:** 1-2 days
- **Testing:** 1 day
- **Documentation:** 0.5 days
- **Total:** ~1.5 weeks

### 📊 Success Metrics
- [ ] Freshness indicator shows on all charts
- [ ] Freshness calculation is accurate
- [ ] Users can see when data was last updated
- [ ] Warnings show for stale data
- [ ] Localization works for Serbian/English
- [ ] Performance impact <10ms per chart

---

## 6. Accessibility Improvements (WCAG 2.1 AA)

### 📋 Overview
Audit and improve accessibility to meet WCAG 2.1 Level AA standards, making the application usable for people with disabilities.

### 🎯 Goals
- Achieve WCAG 2.1 AA compliance
- Support keyboard navigation throughout the app
- Ensure screen reader compatibility
- Meet color contrast requirements (4.5:1 for text)
- Support assistive technologies

### 🔧 Technical Approach

#### Architecture
```typescript
// Accessibility improvement process
Audit (axe DevTools, Lighthouse)
  ↓
Prioritize Issues
  ↓
Fix Issues (ARIA, keyboard, contrast, etc.)
  ↓
Test with Assistive Tech
  ↓
Document & Monitor
```

#### Technology Stack
- **axe-core** - Automated accessibility testing
- **@axe-core/react** - React integration
- **eslint-plugin-jsx-a11y** - ESLint rules for a11y
- **NVDA/JAWS** - Screen reader testing (manual)

### 📝 Implementation Steps

#### Phase 1: Audit & Setup (2-3 days)

1. **Install Accessibility Tools**
   ```bash
   yarn add -D @axe-core/react eslint-plugin-jsx-a11y
   ```

2. **Configure ESLint**
   - File: `.eslintrc.json`
   ```json
   {
     "extends": [
       "next/core-web-vitals",
       "plugin:jsx-a11y/recommended"
     ],
     "plugins": ["jsx-a11y"],
     "rules": {
       "jsx-a11y/anchor-is-valid": "error",
       "jsx-a11y/aria-props": "error",
       "jsx-a11y/aria-proptypes": "error",
       "jsx-a11y/aria-unsupported-elements": "error",
       "jsx-a11y/role-has-required-aria-props": "error",
       "jsx-a11y/role-supports-aria-props": "error"
     }
   }
   ```

3. **Add Axe to Dev Mode**
   - File: `app/components/axe-provider.tsx`
   ```typescript
   'use client';

   import { useEffect } from 'react';

   export function AxeProvider({ children }) {
     useEffect(() => {
       if (process.env.NODE_ENV !== 'production') {
         const axe = require('@axe-core/react');
         const React = require('react');
         const ReactDOM = require('react-dom');
         axe(React, ReactDOM, 1000);
       }
     }, []);

     return <>{children}</>;
   }
   ```

4. **Run Initial Audit**
   ```bash
   # Use Lighthouse CI or manual audit
   lighthouse http://localhost:3000 --only-categories=accessibility --output=json --output-path=./audit-report.json
   ```

5. **Document Issues**
   - Create spreadsheet tracking all accessibility issues
   - Categorize by severity (Critical, High, Medium, Low)
   - Assign priorities

#### Phase 2: Keyboard Navigation (3-4 days)

1. **Add Skip Links**
   - File: `app/components/skip-links.tsx`
   ```typescript
   export function SkipLinks() {
     return (
       <Box
         sx={{
           position: 'absolute',
           left: '-999px',
           '&:focus': {
             left: 0,
             top: 0,
             zIndex: 9999,
             p: 2,
             bgcolor: 'primary.main',
             color: 'primary.contrastText',
           },
         }}
       >
         <a href="#main-content">Skip to main content</a>
         <a href="#navigation">Skip to navigation</a>
       </Box>
     );
   }
   ```

2. **Fix Focus Management**
   - File: `app/components/focus-trap.tsx`
   ```typescript
   import { useEffect, useRef } from 'react';

   export function useFocusTrap(isActive: boolean) {
     const containerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
       if (!isActive || !containerRef.current) return;

       const container = containerRef.current;
       const focusableElements = container.querySelectorAll(
         'a[href], button:not([disabled]), textarea, input, select'
       );

       const firstElement = focusableElements[0] as HTMLElement;
       const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

       const handleTab = (e: KeyboardEvent) => {
         if (e.key !== 'Tab') return;

         if (e.shiftKey) {
           if (document.activeElement === firstElement) {
             e.preventDefault();
             lastElement.focus();
           }
         } else {
           if (document.activeElement === lastElement) {
             e.preventDefault();
             firstElement.focus();
           }
         }
       };

       container.addEventListener('keydown', handleTab);
       firstElement?.focus();

       return () => container.removeEventListener('keydown', handleTab);
     }, [isActive]);

     return containerRef;
   }
   ```

3. **Implement Focus Visible Styles**
   - File: `app/themes/light-theme.ts` and `dark-theme.ts`
   ```typescript
   export const lightTheme = createTheme({
     // ... other config
     components: {
       MuiButton: {
         styleOverrides: {
           root: {
             '&:focus-visible': {
               outline: '2px solid',
               outlineColor: 'primary.main',
               outlineOffset: '2px',
             },
           },
         },
       },
       // Apply to all interactive components
     },
   });
   ```

4. **Add Keyboard Event Handlers**
   - Ensure all clickable elements respond to Enter/Space keys
   ```typescript
   <div
     role="button"
     tabIndex={0}
     onClick={handleClick}
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         handleClick();
       }
     }}
   >
     Clickable div
   </div>
   ```

#### Phase 3: ARIA Labels & Semantic HTML (3-4 days)

1. **Add Landmark Roles**
   - File: `app/layout.tsx`
   ```typescript
   <body>
     <SkipLinks />

     <header role="banner">
       <Navigation />
     </header>

     <main id="main-content" role="main">
       {children}
     </main>

     <footer role="contentinfo">
       <Footer />
     </footer>
   </body>
   ```

2. **Fix Chart Accessibility**
   - File: `app/charts/shared/accessible-chart.tsx`
   ```typescript
   export function AccessibleChart({
     chart,
     data,
     ariaLabel,
   }: {
     chart: React.ReactNode;
     data: any[];
     ariaLabel: string;
   }) {
     return (
       <div role="img" aria-label={ariaLabel}>
         {chart}

         {/* Hidden data table for screen readers */}
         <table className="sr-only">
           <caption>{ariaLabel}</caption>
           <thead>
             <tr>
               {Object.keys(data[0] || {}).map(key => (
                 <th key={key}>{key}</th>
               ))}
             </tr>
           </thead>
           <tbody>
             {data.map((row, i) => (
               <tr key={i}>
                 {Object.values(row).map((value, j) => (
                   <td key={j}>{String(value)}</td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }
   ```

3. **Add ARIA Live Regions**
   - File: `app/components/status-announcer.tsx`
   ```typescript
   export function StatusAnnouncer({ message }: { message: string }) {
     return (
       <div
         role="status"
         aria-live="polite"
         aria-atomic="true"
         className="sr-only"
       >
         {message}
       </div>
     );
   }

   // Usage in chart updates
   <StatusAnnouncer message={`Chart updated with ${data.length} data points`} />
   ```

4. **Fix Form Accessibility**
   ```typescript
   <TextField
     id="chart-title"
     label="Chart Title"
     required
     aria-required="true"
     aria-describedby="chart-title-help"
     error={!!error}
     aria-invalid={!!error}
   />
   <FormHelperText id="chart-title-help">
     Enter a descriptive title for your chart
   </FormHelperText>
   {error && (
     <FormHelperText error id="chart-title-error">
       {error}
     </FormHelperText>
   )}
   ```

#### Phase 4: Color Contrast (2-3 days)

1. **Audit Color Contrast**
   ```bash
   # Use axe DevTools or manual checking
   # All text must meet 4.5:1 ratio (7:1 for AAA)
   ```

2. **Create Accessible Color Palette**
   - File: `app/themes/accessible-colors.ts`
   ```typescript
   export const accessibleColors = {
     // WCAG AA compliant colors
     primary: {
       main: '#1976d2', // 4.5:1 on white
       dark: '#004ba0', // 7:1 on white
       contrastText: '#ffffff',
     },
     error: {
       main: '#d32f2f', // 4.5:1 on white
       contrastText: '#ffffff',
     },
     warning: {
       main: '#ed6c02', // 4.5:1 on white
       contrastText: '#ffffff',
     },
     // Chart colors (colorblind-friendly)
     chartColors: [
       '#1f77b4', // Blue
       '#ff7f0e', // Orange
       '#2ca02c', // Green
       '#d62728', // Red
       '#9467bd', // Purple
       '#8c564b', // Brown
       '#e377c2', // Pink
       '#7f7f7f', // Gray
       '#bcbd22', // Olive
       '#17becf', // Cyan
     ],
   };
   ```

3. **Update Theme Colors**
   - Apply accessible colors to themes
   - Test all color combinations

4. **Add Pattern/Texture to Charts** (for colorblind users)
   - File: `app/charts/shared/patterns.ts`
   ```typescript
   export const chartPatterns = [
     'solid',
     'stripe-horizontal',
     'stripe-vertical',
     'dots',
     'grid',
   ];

   // Apply patterns in addition to colors for better differentiation
   ```

#### Phase 5: Testing & Documentation (3-4 days)

1. **Screen Reader Testing**
   - Test with NVDA (Windows, free)
   - Test with VoiceOver (macOS, built-in)
   - Test with JAWS (Windows, trial)
   - Document findings and fixes

2. **Keyboard Navigation Testing**
   - Navigate entire app using only keyboard
   - Ensure all functionality is accessible
   - Test focus order makes sense

3. **Create Accessibility Statement**
   - File: `app/accessibility/page.tsx`
   ```typescript
   export default function AccessibilityPage() {
     return (
       <Container>
         <Typography variant="h2">Accessibility Statement</Typography>

         <Typography variant="body1">
           Vizualni Admin is committed to ensuring digital accessibility for people with disabilities.
         </Typography>

         <Typography variant="h4">Conformance Status</Typography>
         <Typography variant="body1">
           This website is partially conformant with WCAG 2.1 Level AA.
           We are actively working to achieve full compliance.
         </Typography>

         <Typography variant="h4">Feedback</Typography>
         <Typography variant="body1">
           If you encounter any accessibility barriers, please contact us at [email].
         </Typography>
       </Container>
     );
   }
   ```

4. **Add Automated A11y Tests**
   - File: `app/__tests__/accessibility.test.tsx`
   ```typescript
   import { axe } from 'jest-axe';

   describe('Accessibility', () => {
     it('should not have accessibility violations on homepage', async () => {
       const { container } = render(<HomePage />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });

     it('should not have violations on chart page', async () => {
       const { container } = render(<ChartPage />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });
   ```

### 📂 Files to Create/Modify

**Create:**
- `app/components/skip-links.tsx`
- `app/components/axe-provider.tsx`
- `app/components/focus-trap.tsx`
- `app/components/status-announcer.tsx`
- `app/charts/shared/accessible-chart.tsx`
- `app/themes/accessible-colors.ts`
- `app/accessibility/page.tsx`
- `app/__tests__/accessibility.test.tsx`

**Modify:**
- `.eslintrc.json` - Add jsx-a11y plugin
- `app/layout.tsx` - Add skip links, landmarks
- `app/themes/light-theme.ts` - Focus visible styles
- `app/themes/dark-theme.ts` - Focus visible styles
- All chart components - Add ARIA labels
- All form components - Add ARIA attributes
- All interactive components - Add keyboard handlers (50+ files)

### 🧪 Testing Strategy

#### Automated Tests
- axe-core integration tests
- ESLint jsx-a11y checks
- Lighthouse CI in GitHub Actions

#### Manual Tests
- Screen reader testing (NVDA, VoiceOver, JAWS)
- Keyboard navigation testing
- Color contrast checking
- Focus management verification

#### User Testing
- Test with users who have disabilities
- Gather feedback and iterate

### ⏱️ Estimated Effort
- **Audit & Setup:** 2-3 days
- **Keyboard Navigation:** 3-4 days
- **ARIA & Semantics:** 3-4 days
- **Color Contrast:** 2-3 days
- **Testing & Documentation:** 3-4 days
- **Fixes & Iteration:** 3-5 days
- **Total:** ~4 weeks

### 📊 Success Metrics
- [ ] WCAG 2.1 AA compliance (100% of criteria)
- [ ] 0 critical accessibility violations in axe
- [ ] Lighthouse accessibility score >95
- [ ] All pages keyboard navigable
- [ ] All charts have text alternatives
- [ ] Color contrast ratios meet 4.5:1
- [ ] Screen reader compatibility verified
- [ ] Accessibility statement published

---

## 7. Bundle Size Optimization

### 📋 Overview
Analyze and reduce the JavaScript bundle size to improve page load performance, especially for users on slow connections.

### 🎯 Goals
- Reduce initial bundle size by 30%
- Improve First Contentful Paint (FCP) by 20%
- Reduce Time to Interactive (TTI) by 25%
- Improve Lighthouse performance score to >90

### 🔧 Technical Approach

#### Architecture
```typescript
// Bundle optimization strategy
Analyze Bundle
  ↓
Code Splitting (route-based, component-based)
  ↓
Tree Shaking (remove unused code)
  ↓
Dynamic Imports (lazy load)
  ↓
External Dependencies Optimization
  ↓
Monitor & Iterate
```

#### Technology Stack
- **@next/bundle-analyzer** - Visualize bundle size
- **webpack-bundle-analyzer** - Detailed bundle analysis
- **next/dynamic** - Dynamic imports

### 📝 Implementation Steps

#### Phase 1: Analysis (1-2 days)

1. **Install Bundle Analyzer**
   ```bash
   yarn add -D @next/bundle-analyzer
   ```

2. **Configure Bundle Analyzer**
   - File: `next.config.js`
   ```javascript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer({
     // ... existing config
   });
   ```

3. **Generate Bundle Report**
   ```bash
   ANALYZE=true yarn build
   ```

4. **Identify Large Dependencies**
   - Document all dependencies >100KB
   - Identify unused code
   - Find duplicate dependencies

5. **Create Baseline Metrics**
   ```bash
   # Measure current performance
   lighthouse http://localhost:3000 --output=json --output-path=./baseline-perf.json
   ```

#### Phase 2: Code Splitting (3-4 days)

1. **Implement Route-Based Code Splitting**
   - Next.js already does this, but verify all routes are split

2. **Lazy Load Heavy Components**
   - File: `app/components/lazy-components.tsx`
   ```typescript
   import dynamic from 'next/dynamic';

   // Lazy load chart components (only load when chart type is selected)
   export const BarChart = dynamic(() => import('@/charts/bar/bar-chart'), {
     loading: () => <ChartSkeleton />,
     ssr: false, // Disable SSR for charts if not needed
   });

   export const LineChart = dynamic(() => import('@/charts/line/line-chart'), {
     loading: () => <ChartSkeleton />,
     ssr: false,
   });

   export const MapChart = dynamic(() => import('@/charts/map/map-chart'), {
     loading: () => <ChartSkeleton />,
     ssr: false,
   });

   // Lazy load other heavy components
   export const Dashboard = dynamic(() => import('@/components/dashboard'), {
     loading: () => <DashboardSkeleton />,
   });

   export const CodeEditor = dynamic(() => import('@/components/code-editor'), {
     loading: () => <Skeleton height={400} />,
   });
   ```

3. **Implement Component-Level Code Splitting**
   - File: `app/configurator/config-form.tsx`
   ```typescript
   // Only load configurator panels when needed
   const ChartTypeConfigurator = dynamic(
     () => import('./chart-type-configurator'),
     { loading: () => <Skeleton height={300} /> }
   );

   const FilterConfigurator = dynamic(
     () => import('./filter-configurator'),
     { loading: () => <Skeleton height={200} /> }
   );
   ```

4. **Split Vendor Bundles**
   - File: `next.config.js`
   ```javascript
   module.exports = {
     webpack: (config, { isServer }) => {
       if (!isServer) {
         config.optimization.splitChunks = {
           chunks: 'all',
           cacheGroups: {
             // Split D3 into separate chunk
             d3: {
               test: /[\\/]node_modules[\\/]d3/,
               name: 'd3',
               priority: 10,
             },
             // Split Material-UI into separate chunk
             mui: {
               test: /[\\/]node_modules[\\/]@mui/,
               name: 'mui',
               priority: 10,
             },
             // Split deck.gl/mapbox into separate chunk
             maps: {
               test: /[\\/]node_modules[\\/](deck\.gl|maplibre-gl|react-map-gl)/,
               name: 'maps',
               priority: 10,
             },
             // Other vendor code
             vendor: {
               test: /[\\/]node_modules[\\/]/,
               name: 'vendor',
               priority: 5,
             },
           },
         };
       }
       return config;
     },
   };
   ```

#### Phase 3: Dependency Optimization (3-4 days)

1. **Optimize D3.js Imports**
   - **Problem:** Currently importing multiple D3 modules
   - **Solution:** Import only what's needed

   **Before:**
   ```typescript
   import * as d3 from 'd3';
   ```

   **After:**
   ```typescript
   import { scaleLinear } from 'd3-scale';
   import { axisBottom } from 'd3-axis';
   import { line } from 'd3-shape';
   ```

2. **Replace Heavy Dependencies**
   - File: `package.json` analysis

   **Consider replacing:**
   - `moment` → `date-fns` (already using date-fns, ensure moment is not used)
   - `lodash` → `lodash-es` (tree-shakeable) or native methods
   - Large icon libraries → selective imports

3. **Tree Shaking Configuration**
   - File: `next.config.js`
   ```javascript
   module.exports = {
     experimental: {
       optimizePackageImports: [
         '@mui/material',
         '@mui/icons-material',
         'lodash-es',
       ],
     },
   };
   ```

4. **Optimize Material-UI Imports**
   **Before:**
   ```typescript
   import { Button, TextField, Box } from '@mui/material';
   ```

   **After:**
   ```typescript
   // Tree-shakeable imports (Next.js 13+ handles this automatically)
   // But verify with bundle analyzer
   import Button from '@mui/material/Button';
   import TextField from '@mui/material/TextField';
   import Box from '@mui/material/Box';
   ```

#### Phase 4: Map/Geospatial Optimization (2-3 days)

1. **Lazy Load Map Components**
   ```typescript
   const MapChart = dynamic(
     () => import('@/charts/map/map-chart'),
     {
       loading: () => <ChartSkeleton />,
       ssr: false, // Maps don't need SSR
     }
   );
   ```

2. **Optimize Map Styles**
   - Reduce map style JSON size
   - Use custom minimal map styles instead of full Mapbox styles

3. **Use Map CDN**
   ```typescript
   // Load map libraries from CDN instead of bundling
   <Script
     src="https://unpkg.com/maplibre-gl@3.6.0/dist/maplibre-gl.js"
     strategy="lazyOnload"
   />
   ```

#### Phase 5: Image & Asset Optimization (1-2 days)

1. **Use Next.js Image Component**
   ```typescript
   import Image from 'next/image';

   <Image
     src="/logo.png"
     alt="Logo"
     width={200}
     height={50}
     priority // For above-fold images
   />
   ```

2. **Optimize Chart Preview Images**
   - Convert PNGs to WebP
   - Use responsive images
   - Lazy load preview images

3. **Font Optimization**
   - Use `next/font` for automatic font optimization
   ```typescript
   import { Inter } from 'next/font/google';

   const inter = Inter({ subsets: ['latin'] });
   ```

#### Phase 6: Monitoring & CI Integration (2-3 days)

1. **Add Bundle Size Check to CI**
   - File: `.github/workflows/bundle-size.yml`
   ```yaml
   name: Bundle Size Check

   on: [pull_request]

   jobs:
     bundle-size:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Install dependencies
           run: yarn install
         - name: Build
           run: yarn build
         - name: Analyze bundle
           run: npx @next/bundle-analyzer
         - name: Compare bundle size
           uses: andresz1/size-limit-action@v1
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
   ```

2. **Set Budget Limits**
   - File: `next.config.js`
   ```javascript
   module.exports = {
     performance: {
       budgets: [
         {
           path: '/_app',
           maxSize: '300kb', // Main bundle
         },
         {
           path: '/create',
           maxSize: '500kb', // Chart editor
         },
       ],
     },
   };
   ```

3. **Add Performance Monitoring**
   - Integrate with Sentry Performance Monitoring
   - Track Core Web Vitals

### 📂 Files to Create/Modify

**Create:**
- `app/components/lazy-components.tsx`
- `.github/workflows/bundle-size.yml`
- `scripts/analyze-bundle.js`

**Modify:**
- `next.config.js` - Bundle analyzer, code splitting
- `package.json` - Remove/replace heavy dependencies
- All chart components - Optimize D3 imports (10-15 files)
- All pages - Add dynamic imports where appropriate

### 🧪 Testing Strategy

#### Performance Tests
```bash
# Before optimization
lighthouse http://localhost:3000 --output=json --output-path=./before.json

# After optimization
lighthouse http://localhost:3000 --output=json --output-path=./after.json

# Compare
node scripts/compare-performance.js before.json after.json
```

#### Bundle Analysis
- Generate bundle report before and after
- Compare bundle sizes
- Ensure no regressions

#### Functional Tests
- Run full test suite to ensure no breakage
- Manual testing of lazy-loaded components

### ⏱️ Estimated Effort
- **Analysis:** 1-2 days
- **Code Splitting:** 3-4 days
- **Dependency Optimization:** 3-4 days
- **Map Optimization:** 2-3 days
- **Asset Optimization:** 1-2 days
- **Monitoring Setup:** 2-3 days
- **Testing & Verification:** 2 days
- **Total:** ~3 weeks

### 📊 Success Metrics
- [ ] Initial bundle size reduced by 30%
- [ ] First Contentful Paint (FCP) <1.5s
- [ ] Time to Interactive (TTI) <3.5s
- [ ] Lighthouse performance score >90
- [ ] No increase in bundle size in CI (enforced)
- [ ] All lazy-loaded components work correctly
- [ ] D3.js bundle size reduced by 50%
- [ ] Map bundle only loaded when needed

---

## Summary: Implementation Roadmap

### Timeline Overview

| Week | Improvements |
|------|-------------|
| **Week 1-2** | Dark Mode Support |
| **Week 3-4** | Loading Skeletons |
| **Week 5-7** | Chart Templates Library |
| **Week 8-9** | Command Palette |
| **Week 10-11** | Data Freshness Indicators |
| **Week 12-15** | Accessibility Improvements |
| **Week 16-18** | Bundle Size Optimization |

**Total Duration:** ~18 weeks (~4.5 months)

### Recommended Parallel Execution

Some improvements can be worked on in parallel:

**Sprint 1 (Weeks 1-4):**
- Dark Mode (2 weeks)
- Loading Skeletons (2 weeks)

**Sprint 2 (Weeks 5-9):**
- Chart Templates (3 weeks)
- Command Palette (2 weeks)

**Sprint 3 (Weeks 10-15):**
- Data Freshness (1.5 weeks)
- Accessibility (4 weeks)

**Sprint 4 (Weeks 16-18):**
- Bundle Size Optimization (3 weeks)

### Priority Order (If doing sequentially)

1. **P0 - Accessibility** - Legal/ethical requirement
2. **P1 - Loading Skeletons** - Quick UX win
3. **P1 - Dark Mode** - High user demand
4. **P1 - Chart Templates** - Reduces friction for new users
5. **P2 - Data Freshness** - Trust & transparency
6. **P2 - Command Palette** - Power user efficiency
7. **P2 - Bundle Size** - Performance improvement

---

## Next Steps

1. **Review this plan** with the development team
2. **Adjust timelines** based on team capacity
3. **Break down into smaller tickets** in your project management tool
4. **Set up tracking** for success metrics
5. **Begin with Sprint 1** (Dark Mode + Loading Skeletons)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-19
**Owner:** Development Team
