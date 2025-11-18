import { Box, Link, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import NextLink from "next/link";

import { AppLayout } from "@/components/layout";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const PreviewPost = () => {
  return (
    <AppLayout>
      <Box px={4} py={8} sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Preview POST Endpoint
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          This page is a server-side endpoint for previewing charts via POST requests.
          It is not available in static demo mode. Please use the{" "}
          <NextLink href="/browse" passHref legacyBehavior>
            <Link>browse</Link>
          </NextLink>{" "}
          page to explore datasets and create new visualizations.
        </Typography>
      </Box>
    </AppLayout>
  );
};

export default PreviewPost;
