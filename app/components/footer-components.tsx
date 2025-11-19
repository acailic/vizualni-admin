import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import { ReactNode } from "react";

import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";

export const Footer = ({
  children,
  bottomLinks,
  nCols = 3,
  ContentWrapperProps,
}: {
  children?: ReactNode;
  bottomLinks?: Array<{ title: string; href: string; external: boolean }>;
  nCols?: number;
  ContentWrapperProps?: { sx?: any };
}) => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 8,
        backgroundColor: "background.default",
      }}
    >
      <ContentWrapper sx={ContentWrapperProps?.sx}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${nCols}, 1fr)`,
            gap: 6,
            width: "100%",
            mb: 6,
          }}
        >
          {children}
        </Box>
        {bottomLinks && bottomLinks.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 4,
              width: "100%",
              pt: 4,
              borderTop: "1px solid",
              borderColor: "divider",
              flexWrap: "wrap",
            }}
          >
            {bottomLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                sx={{ fontSize: "0.875rem" }}
              >
                {link.title}
              </Link>
            ))}
          </Box>
        )}
      </ContentWrapper>
    </Box>
  );
};

export const FooterSection = ({ children }: { children?: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {children}
    </Box>
  );
};

export const FooterSectionTitle = ({ title }: { title: string }) => {
  return (
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      {title}
    </Typography>
  );
};

export const FooterSectionText = ({ text }: { text: string }) => {
  return <Typography variant="body2">{text}</Typography>;
};

export const FooterSectionButton = ({
  label,
  iconName,
}: {
  label: string;
  iconName?: string;
}) => {
  return (
    <Button
      variant="text"
      size="small"
      startIcon={iconName && <Icon name={iconName as any} />}
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        fontWeight: 400,
      }}
    >
      {label}
    </Button>
  );
};

export const FooterSectionSocialMediaButtonGroup = ({
  children,
}: {
  children?: ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {children}
    </Box>
  );
};

export const FooterSectionSocialMediaButton = ({
  type,
  href,
}: {
  type: string;
  href: string;
}) => {
  const getIcon = () => {
    switch (type) {
      case "youtube":
        return "youtube";
      case "news":
        return "mail";
      default:
        return "link";
    }
  };

  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      size="small"
    >
      <Icon name={getIcon() as any} />
    </IconButton>
  );
};
