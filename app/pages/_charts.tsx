import { Box, Link, Typography } from "@mui/material";
import { NextPage } from "next";
import NextLink from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

import { ChartPublished } from "@/components/chart-published";
import { Flex } from "@/components/flex";
import { ContentLayout } from "@/components/layout";
import {
  Config,
  ConfiguratorStateProvider,
  ConfiguratorStatePublished,
} from "@/configurator";

const useVisible = (
  initialVisible: boolean,
  intersectionRatio: number = 0.25,
  observerOptions?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(initialVisible);
  useEffect(() => {
    const current = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.intersectionRatio > intersectionRatio) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      },
      {
        threshold: 0.25,
        ...observerOptions,
      }
    );
    if (current) {
      observer.observe(current);
    }
    return () => {
      observer.disconnect();
    };
  }, [intersectionRatio, observerOptions]);
  return [ref, visible] as const;
};

const useHasBeenVisible = (...options: Parameters<typeof useVisible>) => {
  const [ref, visible] = useVisible(...options);
  const hasBeenVisible = useRef(visible);
  hasBeenVisible.current = hasBeenVisible.current || visible;
  return [ref, hasBeenVisible.current] as const;
};

export const HiddenUntilScrolledTo = ({
  children,
  initialVisible = false,
  fallback,
}: {
  children: ReactNode;
  initialVisible?: boolean;
  fallback: ReactNode;
}) => {
  const [ref, hasBeenVisible] = useHasBeenVisible(initialVisible);
  return <div ref={ref}>{hasBeenVisible ? children : fallback}</div>;
};

const Page: NextPage = () => {
  // In static export mode, show message that this requires a backend
  return (
    <ContentLayout>
      <Box px={4} sx={{ backgroundColor: "muted.main" }} mb="auto">
        <Box sx={{ pt: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Chart Gallery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This page requires a backend database to display saved charts.
            In demo mode, please use the{" "}
            <NextLink href="/browse" passHref legacyBehavior>
              <Link>browse</Link>
            </NextLink>{" "}
            page to explore datasets and create new visualizations.
          </Typography>
        </Box>
      </Box>
    </ContentLayout>
  );
};

export default Page;
