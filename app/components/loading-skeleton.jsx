import { Box, Skeleton, Stack } from "@mui/material";
/**
 * Generic skeleton loader
 */
export const LoadingSkeleton = ({ count = 1, height = 40, width = "100%" }) => {
    return (<Stack spacing={1}>
      {Array.from({ length: count }).map((_, index) => (<Skeleton key={index} variant="rectangular" height={height} width={width}/>))}
    </Stack>);
};
/**
 * Chart skeleton - mimics a chart loading state
 */
export const ChartSkeleton = ({ height = 400 }) => {
    return (<Box sx={{ width: "100%", p: 2 }}>
      {/* Chart title */}
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }}/>

      {/* Chart area */}
      <Skeleton variant="rectangular" width="100%" height={height} sx={{ mb: 2 }}/>

      {/* Legend */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Skeleton variant="rectangular" width={80} height={20}/>
        <Skeleton variant="rectangular" width={80} height={20}/>
        <Skeleton variant="rectangular" width={80} height={20}/>
      </Stack>
    </Box>);
};
/**
 * Table skeleton - mimics a data table loading state
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (<Box sx={{ width: "100%", p: 2 }}>
      {/* Table header */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (<Skeleton key={`header-${index}`} variant="rectangular" height={40} sx={{ flex: 1 }}/>))}
      </Stack>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (<Stack key={`row-${rowIndex}`} direction="row" spacing={2} sx={{ mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (<Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="rectangular" height={32} sx={{ flex: 1 }}/>))}
        </Stack>))}
    </Box>);
};
/**
 * Card skeleton - for card-based layouts
 */
export const CardSkeleton = ({ count = 3 }) => {
    return (<Stack spacing={2}>
      {Array.from({ length: count }).map((_, index) => (<Box key={index} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }}/>
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 1 }}/>
          <Skeleton variant="text" width="80%" height={16}/>
          <Skeleton variant="text" width="70%" height={16}/>
        </Box>))}
    </Stack>);
};
/**
 * List skeleton - for list views
 */
export const ListSkeleton = ({ items = 5 }) => {
    return (<Stack spacing={1}>
      {Array.from({ length: items }).map((_, index) => (<Stack key={index} direction="row" spacing={2} alignItems="center" sx={{ p: 1 }}>
          <Skeleton variant="circular" width={40} height={40}/>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20}/>
            <Skeleton variant="text" width="40%" height={16}/>
          </Box>
        </Stack>))}
    </Stack>);
};
/**
 * Form skeleton - for form loading states
 */
export const FormSkeleton = ({ fields = 4 }) => {
    return (<Stack spacing={3} sx={{ p: 2 }}>
      {Array.from({ length: fields }).map((_, index) => (<Box key={index}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }}/>
          <Skeleton variant="rectangular" width="100%" height={56}/>
        </Box>))}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" width={120} height={40}/>
        <Skeleton variant="rectangular" width={120} height={40}/>
      </Stack>
    </Stack>);
};
/**
 * Text content skeleton - for text-heavy content
 */
export const TextSkeleton = ({ lines = 5 }) => {
    return (<Stack spacing={1}>
      {Array.from({ length: lines }).map((_, index) => (<Skeleton key={index} variant="text" width={index === lines - 1 ? "70%" : "100%"} height={20}/>))}
    </Stack>);
};
/**
 * Dashboard skeleton - for dashboard layouts
 */
export const DashboardSkeleton = () => {
    return (<Box sx={{ p: 3 }}>
      {/* Header */}
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }}/>

      {/* Stats cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (<Box key={i} sx={{ flex: 1, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }}/>
            <Skeleton variant="text" width="40%" height={32}/>
          </Box>))}
      </Stack>

      {/* Main content */}
      <Stack spacing={3}>
        <Skeleton variant="rectangular" width="100%" height={300}/>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" sx={{ flex: 1 }} height={200}/>
          <Skeleton variant="rectangular" sx={{ flex: 1 }} height={200}/>
        </Stack>
      </Stack>
    </Box>);
};
/**
 * Page skeleton - for full page loading
 */
export const PageSkeleton = () => {
    return (<Box sx={{ width: "100%", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={48} sx={{ mb: 2 }}/>
        <Skeleton variant="text" width="60%" height={24}/>
      </Box>

      {/* Content */}
      <Stack spacing={3}>
        <Skeleton variant="rectangular" width="100%" height={400}/>
        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }}/>
            <TextSkeleton lines={3}/>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }}/>
            <TextSkeleton lines={3}/>
          </Box>
        </Stack>
      </Stack>
    </Box>);
};
