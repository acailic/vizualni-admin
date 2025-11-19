import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const SimpleHeader = ({
  longTitle,
  shortTitle,
  rootHref,
  sx,
}: {
  longTitle: string;
  shortTitle: string;
  rootHref: string;
  sx?: object;
}) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px 48px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E0E0E0",
        ...sx,
      }}
    >
      <Box
        component="a"
        href={rootHref}
        onClick={(e) => {
          e.preventDefault();
          router.push(rootHref);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#0C4076",
            fontWeight: 700,
            display: { xs: "none", sm: "block" },
          }}
        >
          {longTitle}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: "#0C4076",
            fontWeight: 700,
            display: { xs: "block", sm: "none" },
          }}
        >
          {shortTitle}
        </Typography>
      </Box>
    </Box>
  );
};
