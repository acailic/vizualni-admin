import { Box, Link, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import NextLink from "next/link";

import { Footer } from "@/components/footer";
import { AppLayout } from "@/components/layout";
import { useRootStyles } from "@/login/utils";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

function ProfilePage() {
  useRootStyles();

  return (
    <AppLayout>
      <Box px={4} py={8} sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          This page requires authentication and a backend database.
          In demo mode, please use the{" "}
          <NextLink href="/browse" passHref legacyBehavior>
            <Link>browse</Link>
          </NextLink>{" "}
          page to explore datasets and create new visualizations.
        </Typography>
      </Box>
      <Footer />
    </AppLayout>
  );
}

export default ProfilePage;
