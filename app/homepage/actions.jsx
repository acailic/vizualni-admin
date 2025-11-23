import { Box, Button, Divider, Typography } from "@mui/material";
import { ContentWrapper } from "@/components/content-wrapper";
import { useIsMobile } from "@/utils/use-is-mobile";
export const Actions = ({ contribute, newsletter, bugReport, featureRequest, }) => {
    const isMobile = useIsMobile();
    return (<>
      <ContentWrapper sx={{
            alignItems: "unset !important",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            py: 15,
        }}>
        <Action {...contribute}/>
        <Divider flexItem orientation={isMobile ? "horizontal" : "vertical"}/>
        <Action {...newsletter}/>
      </ContentWrapper>
      <Box sx={{ backgroundColor: "background.paper" }}>
        <ContentWrapper sx={{
            alignItems: "unset !important",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            py: 15,
        }}>
          <Action {...bugReport}/>
          <Divider flexItem orientation={isMobile ? "horizontal" : "vertical"}/>
          <Action {...featureRequest}/>
        </ContentWrapper>
      </Box>
    </>);
};
const Action = ({ headline, description, buttonLabel, buttonUrl, }) => {
    return (<Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
        }}>
      <Box sx={{ mb: 8 }}>
        <Typography variant="h2">{headline}</Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          {description}
        </Typography>
      </Box>
      <Button href={buttonUrl} size="sm" target="_blank" rel="noopener noreferrer">
        {buttonLabel}
      </Button>
    </Box>);
};
