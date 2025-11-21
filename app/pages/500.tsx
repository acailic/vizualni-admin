import { Box, Typography } from "@mui/material";

import {
  Actions,
  ErrorPageHint,
  HomeLink,
  ReloadButton,
} from "@/components/error-pages-components";
import { ContentLayout } from "@/components/layout";

const Page = () => {
  return (
    <ContentLayout>
      <Box sx={{ backgroundColor: "muted.main", my: "auto" }}>
        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            Došlo je do greške.{" "}
          </Typography>
          <Actions>
            <ReloadButton>Osveži stranicu</ReloadButton>&nbsp;ili&nbsp;
            <HomeLink locale="sr-Latn">vrati se na početnu stranu</HomeLink>.
          </Actions>
        </ErrorPageHint>

        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            Дошло је до грешке.{" "}
          </Typography>
          <Actions>
            <ReloadButton>Освежи страницу</ReloadButton>&nbsp;или&nbsp;
            <HomeLink locale="sr-Cyrl">врати се на почетну страну</HomeLink>.
          </Actions>
        </ErrorPageHint>

        <ErrorPageHint>
          <Typography component="div" variant="h2" sx={{ my: 3 }}>
            An error occurred.{" "}
          </Typography>
          <Actions>
            <ReloadButton>Reload the page</ReloadButton>&nbsp;or&nbsp;
            <HomeLink locale="en">go back to Homepage</HomeLink>.
          </Actions>
        </ErrorPageHint>
      </Box>
    </ContentLayout>
  );
};

export default Page;
