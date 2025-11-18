import { Box, Link, Typography } from "@mui/material";
import { NextPage } from "next";
import NextLink from "next/link";

import { ContentLayout } from "@/components/layout";

const Page: NextPage = () => {
  // In static export mode, show message that this requires a backend
  return (
    <ContentLayout>
      <Box px={4} sx={{ backgroundColor: "muted.main" }} mb="auto">
        <Box sx={{ pt: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Chart Gallery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This page requires a backend database to display saved charts.
            In demo mode, please use the{" "}
            <NextLink href="/browse" passHref legacyBehavior>
              <Link>browse</Link>
            </NextLink>{" "}
            page to explore datasets and create new visualizations.
          </Typography>
        </Box>
      </Box>
    </ContentLayout>
  );
};

export default Page;
