import { useEffect, useMemo } from "react";
import { DataFilterGenericDimension, DataFilterHierarchyDimension, DataFilterTemporalDimension, getInteractiveQueryFilters, } from "@/charts/shared/chart-data-filters";
import { useLoadingState } from "@/charts/shared/chart-loading-state";
import { Flex } from "@/components/flex";
import { Loading } from "@/components/hint";
import { getChartConfigFilters } from "@/config-utils";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { isTemporalDimension } from "@/domain/data";
import { useDataCubesComponentsQuery } from "@/graphql/hooks";
import { useLocale } from "@/locales/use-locale";
import { useChartInteractiveFilters, } from "@/stores/interactive-filters";
import { useResolveMostRecentValue } from "@/utils/most-recent-value";
import { useEvent } from "@/utils/use-event";
export const ChartDataFilter = ({ dimensionId, dataSource, chartConfig, dataFilters, filters, disabled, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const locale = useLocale();
    const chartLoadingState = useLoadingState();
    const updateDataFilter = useChartInteractiveFilters((d) => d.updateDataFilter);
    const setMultiDataFilter = useChartInteractiveFilters((d) => d.setMultiDataFilter);
    const perCube = useMemo(() => {
        return filters.map((f) => {
            const cubeFilters = getChartConfigFilters(chartConfig.cubes, {
                cubeIri: f.cubeIri,
            });
            const interactiveFiltersResolved = Object.fromEntries(Object.entries(f.interactiveFilters).map(([k, v]) => {
                var _a;
                return [
                    (_a = f.componentIdResolution[k]) !== null && _a !== void 0 ? _a : k,
                    v,
                ];
            }));
            const interactiveQueryFilters = getInteractiveQueryFilters({
                filters: cubeFilters,
                interactiveFilters: interactiveFiltersResolved,
            });
            const resolvedQueryFilters = Object.fromEntries(Object.entries(interactiveQueryFilters).map(([k, v]) => {
                var _a;
                return [
                    (_a = f.componentIdResolution[k]) !== null && _a !== void 0 ? _a : k,
                    v,
                ];
            }));
            return {
                cubeIri: f.cubeIri,
                resolvedDimensionId: f.resolvedDimensionId,
                resolvedQueryFilters,
            };
        });
    }, [filters, chartConfig.cubes]);
    const filterKeys = useMemo(() => {
        return perCube
            .map((d) => {
            return Object.entries(d.resolvedQueryFilters)
                .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                .join(",");
        })
            .join(" | ");
    }, [perCube]);
    const [{ data, fetching }] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: perCube.map((d) => ({
                iri: d.cubeIri,
                componentIds: [d.resolvedDimensionId],
                filters: d.resolvedQueryFilters,
                loadValues: true,
            })),
            // This is important for urql not to think that filters
            // are the same  while the order of the keys has changed.
            // If this is not present, we'll have outdated dimension
            // values after we change the filter order.
            // @ts-ignore
            filterKeys,
        },
        keepPreviousData: true,
    });
    const dimension = data === null || data === void 0 ? void 0 : data.dataCubesComponents.dimensions[0];
    const hierarchy = dimension === null || dimension === void 0 ? void 0 : dimension.hierarchy;
    const setDataFilter = useEvent((e) => {
        const value = e.target.value;
        if (Array.isArray(value)) {
            setMultiDataFilter(dimensionId, value);
        }
        else {
            updateDataFilter(dimensionId, value);
        }
    });
    const handleMultiChange = useEvent((values) => {
        setMultiDataFilter(dimensionId, values);
    });
    const configFilter = useMemo(() => {
        if (!dimension) {
            return undefined;
        }
        const cubeFilters = getChartConfigFilters(chartConfig.cubes, {
            cubeIri: dimension.cubeIri,
            joined: true,
        });
        return cubeFilters[dimensionId];
    }, [dimension, chartConfig.cubes, dimensionId]);
    const configFilterValue = configFilter && configFilter.type === "single"
        ? configFilter.value
        : undefined;
    const dataFilterValue = dimension
        ? ((_a = dataFilters[dimensionId]) === null || _a === void 0 ? void 0 : _a.type) === "single"
            ? dataFilters[dimensionId].value
            : null
        : null;
    const dataFilterValues = dimension
        ? ((_b = dataFilters[dimensionId]) === null || _b === void 0 ? void 0 : _b.type) === "multi"
            ? Object.keys((_d = (_c = dataFilters[dimensionId]) === null || _c === void 0 ? void 0 : _c.values) !== null && _d !== void 0 ? _d : {})
            : ((_e = dataFilters[dimensionId]) === null || _e === void 0 ? void 0 : _e.type) === "single"
                ? [dataFilters[dimensionId].value]
                : []
        : [];
    const filterType = (_f = chartConfig.interactiveFiltersConfig.dataFilters.filterTypes[dimensionId]) !== null && _f !== void 0 ? _f : ((configFilter === null || configFilter === void 0 ? void 0 : configFilter.type) === "multi" ? "multi" : "single");
    const isMultiFilter = filterType === "multi";
    const resolvedDataFilterValue = useResolveMostRecentValue(dataFilterValue, dimension);
    const resolvedConfigFilterValue = useResolveMostRecentValue(configFilterValue, dimension);
    const value = (_g = resolvedDataFilterValue !== null && resolvedDataFilterValue !== void 0 ? resolvedDataFilterValue : resolvedConfigFilterValue) !== null && _g !== void 0 ? _g : FIELD_VALUE_NONE;
    const multiValue = isMultiFilter
        ? dataFilterValues
        : [value].filter((v) => v !== FIELD_VALUE_NONE).map((v) => String(v));
    useEffect(() => {
        var _a;
        const values = (_a = dimension === null || dimension === void 0 ? void 0 : dimension.values.map((d) => d.value)) !== null && _a !== void 0 ? _a : [];
        if (isMultiFilter) {
            chartLoadingState.set(`interactive-filter-${dimensionId}`, fetching);
            return;
        }
        // We only want to disable loading state when the filter is actually valid.
        // It can be invalid when the application is ensuring possible filters.
        if ((resolvedDataFilterValue && values.includes(resolvedDataFilterValue)) ||
            resolvedDataFilterValue === FIELD_VALUE_NONE ||
            !configFilter) {
            updateDataFilter(dimensionId, resolvedDataFilterValue ? resolvedDataFilterValue : FIELD_VALUE_NONE);
            chartLoadingState.set(`interactive-filter-${dimensionId}`, fetching);
        }
        else if (fetching || values.length === 0) {
            chartLoadingState.set(`interactive-filter-${dimensionId}`, fetching);
        }
    }, [
        chartLoadingState,
        dataFilterValue,
        dimension === null || dimension === void 0 ? void 0 : dimension.values,
        dimensionId,
        fetching,
        setDataFilter,
        configFilterValue,
        updateDataFilter,
        configFilter,
        resolvedDataFilterValue,
        isMultiFilter,
    ]);
    return dimension ? (<Flex sx={{
            mr: 3,
            width: "100%",
            flex: "1 1 100%",
            ":last-of-type": {
                mr: 0,
            },
            " > div": { width: "100%" },
        }}>
      {isTemporalDimension(dimension) ? (<DataFilterTemporalDimension configFilter={configFilter} value={value} dimension={dimension} onChange={setDataFilter} disabled={disabled}/>) : hierarchy ? (<DataFilterHierarchyDimension configFilter={configFilter} dimension={dimension} onChange={setDataFilter} onMultiChange={handleMultiChange} hierarchy={hierarchy} value={value} values={multiValue} isMulti={isMultiFilter} disabled={disabled}/>) : (<DataFilterGenericDimension configFilter={configFilter} dimension={dimension} onChange={setDataFilter} value={value} values={multiValue} isMulti={isMultiFilter} onMultiChange={handleMultiChange} disabled={disabled}/>)}
    </Flex>) : (<Loading />);
};
