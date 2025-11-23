import { Box, CircularProgress, Fade } from "@mui/material";
import { LoadingSkeleton } from "./loading-skeleton";
/**
 * Wrapper component to show loading state with optional skeleton
 * Provides smooth transitions between loading and loaded states
 */
export const LoadingWrapper = ({ loading, children, skeleton, fullPage = false, minHeight = 200, delay = 0, }) => {
    if (loading) {
        return (<Fade in timeout={delay}>
        <Box sx={{
                minHeight: fullPage ? "100vh" : minHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
          {skeleton || <LoadingSkeleton count={3}/>}
        </Box>
      </Fade>);
    }
    return <Fade in>{<>{children}</>}</Fade>;
};
/**
 * Simple centered spinner for loading states
 */
export const LoadingSpinner = ({ size = 40, fullPage = false }) => {
    return (<Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: fullPage ? "100vh" : 200,
            width: "100%",
        }}>
      <CircularProgress size={size}/>
    </Box>);
};
/**
 * Inline loading indicator for buttons or small spaces
 */
export const InlineLoader = ({ size = 20 }) => {
    return (<Box sx={{ display: "inline-flex", alignItems: "center", ml: 1 }}>
      <CircularProgress size={size}/>
    </Box>);
};
/**
 * Overlay loading state - shows spinner over content
 */
export const LoadingOverlay = ({ loading, children }) => {
    return (<Box sx={{ position: "relative" }}>
      {children}
      {loading && (<Box sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1000,
                backdropFilter: "blur(2px)",
            }}>
          <CircularProgress />
        </Box>)}
    </Box>);
};
