import { Trans } from "@lingui/macro";
import { Typography } from "@mui/material";
import { Fragment, useMemo } from "react";
import { extractChartConfigComponentIds, useQueryFilters, } from "@/charts/shared/chart-helpers";
import { OpenMetadataPanelWrapper } from "@/components/metadata-panel";
import { getAnimationField, } from "@/configurator";
import { isTemporalDimension, isTemporalOrdinalDimension, } from "@/domain/data";
import { isMostRecentValue } from "@/domain/most-recent-value";
import { useTimeFormatUnit } from "@/formatters";
import { useDataCubesComponentsQuery } from "@/graphql/hooks";
import { useLocale } from "@/locales/use-locale";
import { useChartInteractiveFilters } from "@/stores/interactive-filters";
export const ChartFiltersList = ({ cubeIri, dataSource, chartConfig, dashboardFilters, components, }) => {
    const locale = useLocale();
    const timeFormatUnit = useTimeFormatUnit();
    const timeSlider = useChartInteractiveFilters((d) => d.timeSlider);
    const animationField = getAnimationField(chartConfig);
    const queryFilters = useQueryFilters({
        chartConfig,
        dashboardFilters,
        componentIds: extractChartConfigComponentIds({ chartConfig }),
    });
    const cubeQueryFilters = useMemo(() => {
        return queryFilters.filter((d) => d.iri === cubeIri);
    }, [queryFilters, cubeIri]);
    // TODO: Refactor to somehow access current filter labels instead of fetching them again
    const [{ data, fetching }] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: chartConfig.cubes.map((cube) => {
                var _a;
                const f = cubeQueryFilters.find((f) => f.iri === cube.iri);
                return {
                    iri: (_a = f === null || f === void 0 ? void 0 : f.iri) !== null && _a !== void 0 ? _a : cube.iri,
                    componentIds: f === null || f === void 0 ? void 0 : f.componentIds,
                    filters: f === null || f === void 0 ? void 0 : f.filters,
                    joinBy: f === null || f === void 0 ? void 0 : f.joinBy,
                    loadValues: true,
                };
            }),
        },
    });
    const allFilters = useMemo(() => {
        if (!(data === null || data === void 0 ? void 0 : data.dataCubesComponents) || components.length === 0) {
            return [];
        }
        return queryFilters.flatMap((filter) => {
            var _a;
            const namedFilters = Object.entries((_a = filter.filters) !== null && _a !== void 0 ? _a : {}).flatMap(([id, f]) => {
                if ((f === null || f === void 0 ? void 0 : f.type) !== "single") {
                    return [];
                }
                const dimension = data.dataCubesComponents.dimensions.find((d) => d.id === id && d.cubeIri === filter.iri && d.cubeIri === cubeIri);
                if (!dimension) {
                    return [];
                }
                const filterValue = isMostRecentValue(f.value)
                    ? dimension.values[dimension.values.length - 1].value
                    : f.value;
                const value = isTemporalDimension(dimension)
                    ? {
                        value: filterValue,
                        label: timeFormatUnit(`${filterValue}`, dimension.timeUnit),
                    }
                    : dimension.values.find((d) => d.value === filterValue);
                return [{ dimension, value }];
            });
            if (animationField) {
                const dimension = components.find((d) => d.id === animationField.componentId);
                if (timeSlider.value) {
                    if (timeSlider.type === "interval" &&
                        isTemporalDimension(dimension)) {
                        namedFilters.push({
                            dimension,
                            value: {
                                value: `${timeSlider.value}`,
                                label: timeFormatUnit(timeSlider.value, dimension.timeUnit),
                            },
                        });
                    }
                    if (timeSlider.type === "ordinal" &&
                        timeSlider.value &&
                        isTemporalOrdinalDimension(dimension)) {
                        namedFilters.push({
                            dimension,
                            value: {
                                value: timeSlider.value,
                                label: timeSlider.value,
                            },
                        });
                    }
                }
            }
            return namedFilters;
        });
    }, [
        data === null || data === void 0 ? void 0 : data.dataCubesComponents,
        components,
        queryFilters,
        animationField,
        timeFormatUnit,
        cubeIri,
        timeSlider.value,
        timeSlider.type,
    ]);
    return fetching ? (<Typography component="div" variant="caption">
      <Trans id="controls.section.data.filters">Filters</Trans>:{" "}
      <Trans id="hint.loading.data">Loading data...</Trans>
    </Typography>) : allFilters.length ? (<Typography component="div" variant="caption" data-testid="chart-filters-list">
      <Typography component="span" variant="inherit" sx={{ mr: 1 }}>
        <Trans id="controls.section.data.filters">Filters</Trans>:
      </Typography>
      {allFilters.map(({ dimension, value }, i) => (<Fragment key={dimension.id}>
          <span>
            <OpenMetadataPanelWrapper component={dimension}>
              <span>{dimension.label}</span>
            </OpenMetadataPanelWrapper>
            {": "}
          </span>
          <span>{value && value.label}</span>
          {i < allFilters.length - 1 && ", "}
        </Fragment>))}
    </Typography>) : null;
};
