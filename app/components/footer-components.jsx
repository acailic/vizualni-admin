import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";
export const Footer = ({ children, bottomLinks, nCols = 3, ContentWrapperProps, }) => {
    return (<Box component="footer" sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            py: 8,
            backgroundColor: "background.default",
        }}>
      <ContentWrapper sx={ContentWrapperProps === null || ContentWrapperProps === void 0 ? void 0 : ContentWrapperProps.sx}>
        <Box sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${nCols}, 1fr)`,
            gap: 6,
            width: "100%",
            mb: 6,
        }}>
          {children}
        </Box>
        {bottomLinks && bottomLinks.length > 0 && (<Box sx={{
                display: "flex",
                gap: 4,
                width: "100%",
                pt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
                flexWrap: "wrap",
            }}>
            {bottomLinks.map((link, i) => (<Link key={i} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} sx={{ fontSize: "0.875rem" }}>
                {link.title}
              </Link>))}
          </Box>)}
      </ContentWrapper>
    </Box>);
};
export const FooterSection = ({ children }) => {
    return (<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {children}
    </Box>);
};
export const FooterSectionTitle = ({ title }) => {
    return (<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
      {title}
    </Typography>);
};
export const FooterSectionText = ({ text }) => {
    return <Typography variant="body2">{text}</Typography>;
};
export const FooterSectionButton = ({ label, iconName, }) => {
    return (<Button variant="text" size="small" startIcon={iconName && <Icon name={iconName}/>} sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontWeight: 400,
        }}>
      {label}
    </Button>);
};
export const FooterSectionSocialMediaButtonGroup = ({ children, }) => {
    return (<Box sx={{ display: "flex", gap: 2 }}>
      {children}
    </Box>);
};
export const FooterSectionSocialMediaButton = ({ type, href, }) => {
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
    return (<IconButton component="a" href={href} target="_blank" rel="noopener noreferrer" size="small">
      <Icon name={getIcon()}/>
    </IconButton>);
};
