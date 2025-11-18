import { Box, BoxProps, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { forwardRef, HTMLProps, PropsWithChildren } from "react";

import {
  ChartPanelLayoutCanvas,
  chartPanelLayoutGridClasses,
} from "@/components/chart-panel-layout-grid";
import { ChartPanelLayoutTall } from "@/components/chart-panel-layout-tall";
import { ChartPanelLayoutVertical } from "@/components/chart-panel-layout-vertical";
import { ChartSelectionTabs } from "@/components/chart-selection-tabs";
import { DashboardInteractiveFilters } from "@/components/dashboard-interactive-filters";
import { useSyncTextBlockHeight } from "@/components/text-block";
import { Layout, LayoutDashboard } from "@/config-types";
import { hasChartConfigs, LayoutBlock } from "@/configurator";
import { useConfiguratorState } from "@/src";

const useStyles = makeStyles<
  Theme,
  { freeCanvas?: boolean; isEditing?: boolean }
>((theme) => ({
  panelLayout: {
    containerType: "inline-size",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
  },
  chartWrapper: {
    display: ({ freeCanvas }) => (freeCanvas ? "flex" : "contents"),
    flexDirection: "column",
    overflow: "hidden",
    [`.${chartPanelLayoutGridClasses.root} &`]: {
      transition: theme.transitions.create(["box-shadow"], {
        duration: theme.transitions.duration.shortest,
      }),
    },
    [`.${chartPanelLayoutGridClasses.root} &:has(.${chartPanelLayoutGridClasses.dragHandle}:hover)`]:
      {
        boxShadow: theme.shadows[6],
      },
  },
  chartWrapperInner: {
    display: ({ freeCanvas, isEditing }) =>
      isEditing || !freeCanvas ? "contents" : "flex",
    flexDirection: "column",
    width: "auto",
    height: "100%",
  },
}));

export const getChartWrapperId = (chartKey: string) =>
  `chart-wrapper-${chartKey}`;

/**
 * Props for the ChartWrapper component.
 * Wraps a chart with editing controls and layout-specific behavior.
 */
export type ChartWrapperProps = BoxProps & {
  /** Whether the chart is in editing mode */
  editing?: boolean;
  /** Layout configuration for the chart */
  layout?: Layout;
  /** Unique identifier for the chart */
  chartKey: string;
};

export const ChartWrapper = forwardRef<HTMLDivElement, ChartWrapperProps>(
  (props, ref) => {
    const { children, editing, layout, ...rest } = props;
    const classes = useStyles({
      freeCanvas: layout?.type === "dashboard" && layout.layout === "canvas",
      isEditing: editing,
    });

    return (
      <Box
        ref={ref}
        {...rest}
        id={getChartWrapperId(props.chartKey)}
        className={clsx(classes.chartWrapper, props.className)}
      >
        {(editing || layout?.type === "tab") && <ChartSelectionTabs />}
        <Box
          className={classes.chartWrapperInner}
          sx={{ minHeight: [150, 300, 500] }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);

type ChartPanelLayoutProps = PropsWithChildren<{
  layoutType: LayoutDashboard["layout"];
  renderBlock: (block: LayoutBlock) => JSX.Element;
}> &
  HTMLProps<HTMLDivElement>;

/**
 * Props for different chart panel layout types (vertical, tall, canvas).
 */
export type ChartPanelLayoutTypeProps = {
  /** Layout blocks to render (charts or text blocks) */
  blocks: LayoutBlock[];
  /** Function to render each individual block */
  renderBlock: (block: LayoutBlock) => JSX.Element;
  /** Optional CSS class name */
  className?: string;
};

const Wrappers: Record<
  LayoutDashboard["layout"],
  (props: ChartPanelLayoutTypeProps) => JSX.Element
> = {
  vertical: ChartPanelLayoutVertical,
  tall: ChartPanelLayoutTall,
  canvas: ChartPanelLayoutCanvas,
};

export const ChartPanelLayout = ({
  children,
  renderBlock,
  className,
  layoutType,
  ...rest
}: ChartPanelLayoutProps) => {
  const [state] = useConfiguratorState(hasChartConfigs);
  const classes = useStyles({});
  const Wrapper = Wrappers[layoutType];
  const { layout } = state;
  const { blocks } = layout;
  useSyncTextBlockHeight();

  return (
    <div className={clsx(classes.panelLayout, className)} {...rest}>
      {state.layout.type === "dashboard" ? (
        <DashboardInteractiveFilters
          // We want to completely remount this component if chartConfigs change
          key={state.chartConfigs.map((x) => x.key).join(",")}
        />
      ) : null}
      <Wrapper blocks={blocks} renderBlock={renderBlock} />
    </div>
  );
};
