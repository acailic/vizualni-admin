import { Box, Link } from "@mui/material";

import { Trans } from "@lingui/macro";

/**
 * Skip to content link for keyboard navigation accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 */
export const SkipToContent = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "-9999px",
        zIndex: 9999,
        "&:focus": {
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: 2,
          borderRadius: 1,
          textDecoration: "none",
          boxShadow: 2,
        },
      }}
    >
      <Link
        href="#main-content"
        sx={{
          color: "inherit",
          "&:focus": {
            outline: "2px solid",
            outlineColor: "primary.contrastText",
            outlineOffset: 2,
          },
        }}
      >
        <Trans id="a11y.skip.to.content">Skip to main content</Trans>
      </Link>
    </Box>
  );
};

/**
 * Wrapper for main content that provides the skip target
 */
export const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
  );
};
