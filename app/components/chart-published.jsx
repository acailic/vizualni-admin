import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { forwardRef, useCallback, useEffect, useMemo, useRef, } from "react";
import { useStore } from "zustand";
import { extractChartConfigsComponentIds } from "@/charts/shared/chart-helpers";
import { LoadingStateProvider } from "@/charts/shared/chart-loading-state";
import { isUsingImputation } from "@/charts/shared/imputation";
import { CHART_RESIZE_EVENT_TYPE } from "@/charts/shared/use-size";
import { ActionElementsContainer } from "@/components/action-elements-container";
import { ChartDataTablePreview } from "@/components/chart-data-table-preview/ui";
import { ChartErrorBoundary } from "@/components/chart-error-boundary";
import { ChartFootnotes, VisualizeLink } from "@/components/chart-footnotes";
import { ChartPanelLayout, ChartWrapper } from "@/components/chart-panel";
import { ChartControls, ChartMoreButton, useChartStyles, } from "@/components/chart-shared";
import { ChartTablePreviewProvider, ChartTablePreviewWrapper, useChartTablePreview, } from "@/components/chart-table-preview";
import { ChartWithFilters } from "@/components/chart-with-filters";
import { DashboardInteractiveFilters } from "@/components/dashboard-interactive-filters";
import { Flex } from "@/components/flex";
import { HintError, HintInfo, HintWarning } from "@/components/hint";
import { createMetadataPanelStore, MetadataPanelStoreContext, } from "@/components/metadata-panel-store";
import { renderBaseTextBlock } from "@/components/text-block";
import { getChartConfig } from "@/config-utils";
import { isPublished, useConfiguratorState, } from "@/configurator";
import { Description, Title } from "@/configurator/components/annotators";
import { DRAWER_WIDTH } from "@/configurator/components/drawers";
import { DEFAULT_DATA_SOURCE, useIsTrustedDataSource, } from "@/domain/data-source";
import { useDataCubesComponentsQuery, useDataCubesMetadataQuery, } from "@/graphql/hooks";
import { DataCubePublicationStatus } from "@/graphql/resolver-types";
import { useLocale } from "@/locales/use-locale";
import { InteractiveFiltersChartProvider, InteractiveFiltersProvider, } from "@/stores/interactive-filters";
import { useResizeObserver } from "@/utils/use-resize-observer";
const ChartPublishedIndividualChart = forwardRef(({ dataSource, state, chartConfig, configKey, children, embedParams, shouldShrink, ...rest }, ref) => {
    const metadataPanelStore = useMemo(() => createMetadataPanelStore(), []);
    return (<MetadataPanelStoreContext.Provider value={metadataPanelStore}>
        <ChartTablePreviewProvider key={chartConfig.key}>
          <ChartWrapper key={chartConfig.key} layout={state.layout} ref={ref} chartKey={chartConfig.key} {...rest}>
            <ChartPublishedInner key={chartConfig.key} dataSource={dataSource} state={state} chartConfig={chartConfig} configKey={configKey} metadataPanelStore={metadataPanelStore} embedParams={embedParams} shouldShrink={shouldShrink}>
              {children}
            </ChartPublishedInner>
          </ChartWrapper>
        </ChartTablePreviewProvider>
      </MetadataPanelStoreContext.Provider>);
});
export const ChartPublished = ({ configKey, embedParams, shouldShrink, isPreview, }) => {
    const [state] = useConfiguratorState(isPublished);
    const { dataSource } = state;
    const locale = useLocale();
    const metadataPanelStore = useMemo(() => createMetadataPanelStore(), []);
    const publishedChartClasses = usePublishedChartStyles({ shrink: true });
    const renderChart = useCallback((chartConfig) => (<ChartPublishedIndividualChart key={chartConfig.key} dataSource={dataSource} state={state} chartConfig={chartConfig} configKey={configKey} embedParams={embedParams}/>), [configKey, dataSource, embedParams, state]);
    const renderBlock = useCallback((block) => {
        switch (block.type) {
            case "chart":
                const chartConfig = state.chartConfigs.find((c) => c.key === block.key);
                return renderChart(chartConfig);
            case "text":
                return renderBaseTextBlock(block);
            default:
                const _exhaustiveCheck = block;
                return _exhaustiveCheck;
        }
    }, [state.chartConfigs, renderChart]);
    // Sends out the height of the chart, so the iframe can be resized accordingly.
    const handleHeightChange = useCallback(({ height }) => {
        window.parent.postMessage({ type: CHART_RESIZE_EVENT_TYPE, height }, "*");
    }, []);
    const [ref] = useResizeObserver(handleHeightChange);
    return (<MetadataPanelStoreContext.Provider value={metadataPanelStore}>
      <InteractiveFiltersProvider chartConfigs={state.chartConfigs}>
        <Box ref={ref}>
          {state.layout.type === "dashboard" ? (<Box className={publishedChartClasses.dashboardBoxWrapper}>
              {state.layout.meta.title[locale] ||
                state.layout.meta.description[locale] ? (<Flex flexDirection="column">
                  {state.layout.meta.title[locale] && (<Title text={state.layout.meta.title[locale]}/>)}
                  {state.layout.meta.description[locale] && (<Description text={state.layout.meta.description[locale]}/>)}
                </Flex>) : null}
              <ChartPanelLayout layoutType={state.layout.layout} renderBlock={renderBlock}/>
              {state.chartConfigs.length !== 1 && configKey && (<VisualizeLink configKey={configKey} createdWith={t({ id: "metadata.link.created.with" })}/>)}
            </Box>) : (<>
              <Flex sx={{
                flexDirection: "column",
                mb: state.layout.meta.title[locale] ||
                    state.layout.meta.description[locale]
                    ? 4
                    : 0,
            }}>
                {state.layout.meta.title[locale] && (<Title text={state.layout.meta.title[locale]}/>)}
                {state.layout.meta.description[locale] && (<Description text={state.layout.meta.description[locale]}/>)}
              </Flex>
              <ChartTablePreviewProvider>
                <DashboardInteractiveFilters />
                <ChartWrapper layout={state.layout} chartKey={state.activeChartKey}>
                  <ChartPublishedInner dataSource={dataSource} state={state} chartConfig={getChartConfig(state)} configKey={configKey} metadataPanelStore={metadataPanelStore} embedParams={embedParams} shouldShrink={shouldShrink} isPreview={isPreview}/>
                </ChartWrapper>
              </ChartTablePreviewProvider>
            </>)}
        </Box>
      </InteractiveFiltersProvider>
    </MetadataPanelStoreContext.Provider>);
};
const usePublishedChartStyles = makeStyles((theme) => ({
    root: {
        // Needed for the metadata panel to be contained inside the root.
        position: "relative",
        paddingLeft: ({ shrink }) => `calc(${theme.spacing(5)} + ${shrink ? DRAWER_WIDTH : 0}px)`,
        padding: ({ optimizeSpace }) => optimizeSpace ? theme.spacing(3) : theme.spacing(6),
        transition: "padding 0.25s ease",
    },
    dashboardBoxWrapper: {
        [theme.breakpoints.up("xs")]: {
            padding: theme.spacing(5, 4, 2, 4),
        },
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(5),
        },
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing(6),
        },
        gap: 16,
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.cobalt[50],
    },
}));
const ChartPublishedInnerImpl = ({ dataSource = DEFAULT_DATA_SOURCE, state, chartConfig, configKey, className, children, metadataPanelStore, embedParams, shouldShrink: _shouldShrink, isPreview, }) => {
    const { meta } = chartConfig;
    const rootRef = useRef(null);
    const { isTable, computeContainerHeight } = useChartTablePreview();
    const metadataPanelOpen = useStore(metadataPanelStore, (state) => state.open);
    const shouldShrink = useMemo(() => {
        var _a;
        const rootWidth = (_a = rootRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width;
        if (!rootWidth) {
            return false;
        }
        return _shouldShrink !== null && _shouldShrink !== void 0 ? _shouldShrink : (metadataPanelOpen && rootWidth > DRAWER_WIDTH * 2);
    }, [_shouldShrink, metadataPanelOpen]);
    useEffect(() => {
        const unsubscribe = metadataPanelStore.subscribe(() => {
            computeContainerHeight();
        });
        return () => unsubscribe();
    });
    const chartClasses = useChartStyles({
        removeBorder: embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeBorder,
    });
    const publishedChartClasses = usePublishedChartStyles({
        shrink: shouldShrink,
        optimizeSpace: embedParams === null || embedParams === void 0 ? void 0 : embedParams.optimizeSpace,
    });
    const locale = useLocale();
    const isTrustedDataSource = useIsTrustedDataSource(dataSource);
    const commonQueryVariables = {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        locale,
    };
    const [{ data: metadataData }] = useDataCubesMetadataQuery({
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: chartConfig.cubes.map((cube) => ({ iri: cube.iri })),
        },
    });
    const metadata = metadataData === null || metadataData === void 0 ? void 0 : metadataData.dataCubesMetadata;
    const componentIds = extractChartConfigsComponentIds(state.chartConfigs);
    const [{ data: componentsData }] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            ...commonQueryVariables,
            cubeFilters: chartConfig.cubes.map((cube) => ({
                iri: cube.iri,
                componentIds,
                joinBy: cube.joinBy,
            })),
        },
    });
    const components = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents;
    const dimensions = components === null || components === void 0 ? void 0 : components.dimensions;
    const measures = components === null || components === void 0 ? void 0 : components.measures;
    const allComponents = useMemo(() => {
        if (!dimensions || !measures) {
            return [];
        }
        return [...dimensions, ...measures];
    }, [dimensions, measures]);
    return (<Box ref={rootRef} className={clsx(chartClasses.root, chartClasses.pastEditing, publishedChartClasses.root, className)}>
      {children}
      <ChartErrorBoundary resetKeys={[chartConfig]}>
        <div>
          {(metadata === null || metadata === void 0 ? void 0 : metadata.some((d) => d.publicationStatus === DataCubePublicationStatus.Draft)) && (<Box sx={{ mb: 4 }}>
              <HintError>
                <Trans id="dataset.publicationStatus.draft.warning">
                  Careful, this dataset is only a draft.
                  <br />
                  <strong>Don&apos;t use for reporting!</strong>
                </Trans>
              </HintError>
            </Box>)}
          {(metadata === null || metadata === void 0 ? void 0 : metadata.some((d) => d.expires)) && (<Box sx={{ mb: 4 }}>
              <HintError>
                <Trans id="dataset.publicationStatus.expires.warning">
                  Careful, the data for this chart has expired.
                  <br />
                  <strong>Don&apos;t use for reporting!</strong>
                </Trans>
              </HintError>
            </Box>)}
          {!isTrustedDataSource && (<Box sx={{ mb: 4 }}>
              <HintWarning>
                <Trans id="data.source.notTrusted">
                  This chart is not using a trusted data source.
                </Trans>
              </HintWarning>
            </Box>)}
          {isUsingImputation(chartConfig) && (<Box sx={{ mb: 4 }}>
              <HintInfo>
                <Trans id="dataset.hasImputedValues">
                  Some data in this dataset is missing and has been interpolated
                  to fill the gaps.
                </Trans>
              </HintInfo>
            </Box>)}
        </div>
        <LoadingStateProvider>
          <InteractiveFiltersChartProvider chartConfigKey={chartConfig.key}>
            <Flex sx={{
            height: "fit-content",
            justifyContent: meta.title[locale]
                ? "space-between"
                : "flex-end",
            gap: 2,
        }}>
              {meta.title[locale] ? (<Title text={meta.title[locale]} smaller/>) : (
        // We need to have a span here to keep the space between the
        // title and the chart (subgrid layout)
        <span style={{ height: 1 }}/>)}
              {(embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeMoreOptionsButton) ? null : (<ActionElementsContainer>
                  <ChartMoreButton configKey={configKey} chartKey={chartConfig.key} chartWrapperNode={rootRef.current} components={allComponents} disableDatabaseRelatedActions={isPreview}/>
                </ActionElementsContainer>)}
            </Flex>
            {meta.description[locale] ? (<Description text={meta.description[locale]} smaller/>) : (
        // We need to have a span here to keep the space between the
        // title and the chart (subgrid layout)
        <span style={{ height: 1 }}/>)}
            <ChartControls dataSource={dataSource} chartConfig={chartConfig} dashboardFilters={state.dashboardFilters} metadataPanelProps={(embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeMoreOptionsButton)
            ? undefined
            : {
                components: allComponents,
                container: rootRef.current,
                allowMultipleOpen: true,
            }}/>
            <ChartTablePreviewWrapper>
              {isTable ? (<ChartDataTablePreview dataSource={dataSource} chartConfig={chartConfig} dashboardFilters={state.dashboardFilters} sx={{ maxHeight: "100%" }}/>) : (<ChartWithFilters dataSource={dataSource} componentIds={componentIds} chartConfig={chartConfig} dashboardFilters={state.dashboardFilters} embedParams={embedParams}/>)}
            </ChartTablePreviewWrapper>
            <ChartFootnotes configKey={configKey} dataSource={dataSource} chartConfig={chartConfig} dashboardFilters={state.dashboardFilters} components={allComponents} showVisualizeLink={state.layout.type !== "dashboard" ||
            (state.layout.type === "dashboard" &&
                state.chartConfigs.length === 1)} hideFilters={embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeFilters} hideMetadata={embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeFootnotes} metadataPanelProps={(embedParams === null || embedParams === void 0 ? void 0 : embedParams.removeMoreOptionsButton)
            ? {
                components: allComponents,
                container: rootRef.current,
                allowMultipleOpen: true,
            }
            : undefined}/>
          </InteractiveFiltersChartProvider>
        </LoadingStateProvider>
      </ChartErrorBoundary>
    </Box>);
};
const ChartPublishedInner = (props) => (
// Enforce re-mounting of the component when the chart config changes
// to ensure we do not use any out of date data.
<ChartPublishedInnerImpl {...props} key={props.chartConfig.key}/>);
