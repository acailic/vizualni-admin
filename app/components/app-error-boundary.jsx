import { Trans } from "@lingui/macro";
import { Alert, AlertTitle, Box, Button, Typography } from "@mui/material";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "react-error-boundary";
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (<Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: 4,
            textAlign: "center",
        }}>
      <Alert severity="error" sx={{ maxWidth: 600, mb: 3 }}>
        <AlertTitle>
          <Trans id="error.boundary.title">Something went wrong</Trans>
        </AlertTitle>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <Trans id="error.boundary.message">
            An unexpected error occurred. Please try refreshing the page.
          </Trans>
        </Typography>
        {process.env.NODE_ENV === "development" && (<Box sx={{
                mt: 2,
                p: 2,
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: 1,
                textAlign: "left",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                overflowX: "auto",
            }}>
            <Typography variant="caption" component="div">
              <strong>Error:</strong> {error.message}
            </Typography>
            {error.stack && (<Typography variant="caption" component="pre" sx={{ mt: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {error.stack}
              </Typography>)}
          </Box>)}
      </Alert>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary} sx={{ mt: 2 }}>
        <Trans id="error.boundary.retry">Try again</Trans>
      </Button>
    </Box>);
};
const logErrorToService = (error, errorInfo) => {
    // Log to Sentry if configured
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });
    }
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error caught by boundary:", error, errorInfo);
    }
};
export const AppErrorBoundary = ({ children }) => {
    return (<ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrorToService} onReset={() => {
            // Reset app state or navigate to home
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }}>
      {children}
    </ErrorBoundary>);
};
