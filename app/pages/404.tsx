import { Box, Container, Typography } from "@mui/material";

import {
  Actions,
  ErrorPageHint,
  HomeLink,
} from "@/components/error-pages-components";
import { ContentLayout } from "@/components/layout";

const Page = () => (
  <ContentLayout>
    <Box
      sx={{
        background: "linear-gradient(135deg, #0C4076 0%, #C6363C 100%)",
        my: "auto",
        py: 8,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md">
        <ErrorPageHint>
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "6rem", md: "10rem" },
                fontWeight: 900,
                color: "white",
                textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
                mb: 2,
              }}
            >
              404
            </Typography>
            <Typography
              component="div"
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 700,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                mb: 1,
              }}
            >
              Страница није пронађена 🇷🇸
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                fontWeight: 400,
              }}
            >
              Упс! Изгледа да сте залутали. Ова страница не постоји.
            </Typography>
            <Actions>
              <HomeLink
                locale="sr"
                sx={{
                  backgroundColor: "white",
                  color: "#0C4076",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                  },
                }}
              >
                🏠 Повратак на почетну страну
              </HomeLink>
            </Actions>
          </Box>
        </ErrorPageHint>
      </Container>
    </Box>
  </ContentLayout>
);

export default Page;
