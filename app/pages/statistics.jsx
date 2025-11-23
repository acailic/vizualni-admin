import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { AppLayout } from "@/components/layout";
export const getStaticProps = async () => {
    return {
        props: {},
    };
};
const Statistics = () => {
    return (<AppLayout>
      <Box px={4} py={8} sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          This page requires a backend database to display usage statistics.
          In demo mode, please use the{" "}
          <NextLink href="/browse" passHref legacyBehavior>
            <Link>browse</Link>
          </NextLink>{" "}
          page to explore datasets and create new visualizations.
        </Typography>
      </Box>
    </AppLayout>);
};
export default Statistics;
