import { IconButton } from "@mui/material";
import { TopBar } from "@interactivethings/swiss-federal-ci/dist/components";
import { Header as SwissFederalCiHeader } from "@interactivethings/swiss-federal-ci/dist/components/pages-router";
import { useRouter } from "next/router";

import { DataSourceMenu } from "@/components/data-source-menu";
import { Flex } from "@/components/flex";
import { Select } from "@/components/form";
import { __HEADER_HEIGHT_CSS_VAR } from "@/components/header-constants";
import contentRoutes from "@/content-routes.json";
import { SOURCE_OPTIONS } from "@/domain/data-source/constants";
import localeConfig from "@/locales/locales.json";
import { useLocale } from "@/locales/use-locale";
import { LoginMenu } from "@/login/components/login-menu";
import { useResizeObserver } from "@/utils/use-resize-observer";

export const Header = ({
  contentId,
  hideLogo,
  extendTopBar,
}: {
  contentId?: string;
  hideLogo?: boolean;
  extendTopBar?: boolean;
}) => {
  const currentLocale = useLocale();
  const { push, pathname, query } = useRouter();
  const [ref] = useResizeObserver<HTMLDivElement>(({ height }) => {
    if (height) {
      document.documentElement.style.setProperty(
        __HEADER_HEIGHT_CSS_VAR,
        `${height}px`
      );
    }
  });

  const alternates =
    contentId && contentId in contentRoutes
      ? (
          contentRoutes as {
            [k: string]: { [k: string]: { title: string; path: string } };
          }
        )[contentId]
      : undefined;

  return (
    <div ref={ref} style={{ zIndex: 1 }}>
      <TopBar
        ContentWrapperProps={{
          sx: {
            justifyContent: "space-between",
            ...(extendTopBar
              ? { maxWidth: "unset !important", px: "48px !important" }
              : {}),
          },
        }}
      >
        {SOURCE_OPTIONS.length > 1 && <DataSourceMenu />}
        <Flex alignItems="center" gap={3} marginLeft="auto">
          <IconButton
            component="a"
            href="https://github.com/acailic/vizualni-admin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            sx={{
              color: "white",
              "&:hover": {
                color: "cobalt.100",
              },
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </IconButton>
          <LoginMenu />
          <Select
            id="localeSwitcherSelect"
            variant="standard"
            value={currentLocale}
            onChange={(e) => {
              const locale = e.target.value as string;
              const alternate = alternates?.[locale];

              if (alternate) {
                push(alternate.path, undefined, { locale: false });
              } else {
                push({ pathname, query }, undefined, { locale });
              }
            }}
            options={localeConfig.locales.map((locale) => ({
              label: locale.toUpperCase(),
              value: locale,
            }))}
            sort={false}
            sx={{
              width: "fit-content",
              color: "white !important",

              "&:hover": {
                color: "cobalt.100",
              },

              "& .MuiSelect-select": {
                "&:hover, &[aria-expanded='true']": {
                  backgroundColor: "transparent !important",
                },
              },
            }}
          />
        </Flex>
      </TopBar>
      {hideLogo ? null : (
        <SwissFederalCiHeader
          longTitle="data.gov.rs"
          shortTitle="data"
          rootHref="/"
          sx={{ backgroundColor: "white" }}
        />
      )}
    </div>
  );
};
