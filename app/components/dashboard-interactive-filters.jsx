import { Box, Slider, sliderClasses, useEventCallback, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import uniq from "lodash/uniq";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataFilterGenericDimension, DataFilterHierarchyDimension, DataFilterTemporalDimension, } from "@/charts/shared/chart-data-filters";
import { groupPreparedFiltersByDimension, } from "@/charts/shared/chart-data-filters/group-filters";
import { useCombinedTemporalDimension } from "@/charts/shared/use-combined-temporal-dimension";
import { getFiltersByMappingStatus, hasChartConfigs, isLayouting, useConfiguratorState, } from "@/configurator";
import { parseDate, timeUnitToFormatter, timeUnitToParser, } from "@/configurator/components/ui-helpers";
import { isTemporalDimension } from "@/domain/data";
import { truthy } from "@/domain/types";
import { useDataCubesComponentsQuery } from "@/graphql/hooks";
import { getResolvedJoinById, isJoinById } from "@/graphql/join";
import { useLocale } from "@/locales/use-locale";
import { setDataFilter, useDashboardInteractiveFilters, } from "@/stores/interactive-filters";
import { useTransitionStore } from "@/stores/transition";
import { assert } from "@/utils/assert";
import { useEvent } from "@/utils/use-event";
import { useTimeout } from "@/utils/use-timeout";
export const DashboardInteractiveFilters = (props) => {
    const { sx, ...rest } = props;
    const ref = useRef(null);
    const [state] = useConfiguratorState(hasChartConfigs);
    const layouting = isLayouting(state);
    const { dashboardFilters } = state;
    const { timeRange, dataFilters } = dashboardFilters !== null && dashboardFilters !== void 0 ? dashboardFilters : {
        timeRange: undefined,
        dataFilters: undefined,
    };
    const showTimeRange = !!(timeRange === null || timeRange === void 0 ? void 0 : timeRange.active);
    const showDataFilters = !!(dataFilters === null || dataFilters === void 0 ? void 0 : dataFilters.componentIds.length);
    useEffect(() => {
        var _a;
        if (layouting && (showTimeRange || showDataFilters)) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [layouting, showDataFilters, showTimeRange]);
    return showTimeRange || showDataFilters ? (<Box ref={ref} {...rest} sx={{ ...sx, mb: 4 }}>
      {showTimeRange ? (<DashboardTimeRangeSlider filter={timeRange} mounted={timeRange.active}/>) : null}
      {showDataFilters ? (<DashboardDataFilters componentIds={dataFilters.componentIds}/>) : null}
    </Box>) : null;
};
const useTimeRangeRangeStyles = makeStyles((theme) => ({
    slider: {
        maxWidth: `calc(100% - ${theme.spacing(6)})`,
        margin: theme.spacing(6, 4, 2),
        [`& .${sliderClasses.track}`]: {
            height: 1,
        },
        [`& .${sliderClasses.rail}.${sliderClasses.rail}`]: {
            backgroundColor: theme.palette.grey[600],
        },
        [`& .${sliderClasses.valueLabel}`]: {
            padding: theme.spacing(1, 2),
        },
    },
}));
const valueToTimeRange = (value) => {
    const from = new Date(value[0] * 1000);
    const to = new Date(value[1] * 1000);
    if (!from || !to) {
        return;
    }
    return {
        type: "range",
        from: from,
        to: to,
    };
};
const presetToTimeRange = (presets, timeUnit) => {
    if (!timeUnit) {
        return;
    }
    const parser = timeUnitToParser[timeUnit];
    return [
        toUnixSeconds(parser(presets.from)),
        toUnixSeconds(parser(presets.to)),
    ];
};
const toUnixSeconds = (x) => {
    if (x) {
        return +x / 1000;
    }
    return 0;
};
const DashboardTimeRangeSlider = ({ filter, mounted, }) => {
    const classes = useTimeRangeRangeStyles();
    const dashboardInteractiveFilters = useDashboardInteractiveFilters();
    const setEnableTransition = useTransitionStore((state) => state.setEnable);
    const presets = filter.presets;
    assert(presets, "Filter presets should be defined when time range filter is rendered");
    const timeUnit = filter.timeUnit;
    const [timeRange, setTimeRange] = useState(() => 
    // timeUnit can still be an empty string
    timeUnit ? presetToTimeRange(presets, timeUnit) : undefined);
    const valueLabelFormat = useEventCallback((value) => {
        if (!timeUnit) {
            return "";
        }
        const date = new Date(value * 1000);
        return timeUnitToFormatter[timeUnit](date);
    });
    const handleChangeSlider = useEventCallback((value) => {
        assert(Array.isArray(value), "Value should be an array of two numbers");
        if (!timeUnit) {
            return;
        }
        const newTimeRange = valueToTimeRange(value);
        if (!newTimeRange) {
            return;
        }
        setEnableTransition(false);
        for (const [_getState, _useStore, store] of Object.values(dashboardInteractiveFilters.stores)) {
            store.setState({ timeRange: newTimeRange });
            setTimeRange([value[0], value[1]]);
        }
    });
    useEffect(function initTimeRangeAfterDataFetch() {
        if (timeRange || !timeUnit) {
            return;
        }
        const parser = timeUnitToParser[timeUnit];
        handleChangeSlider([
            toUnixSeconds(parser(presets.from)),
            toUnixSeconds(parser(presets.to)),
        ]);
    }, [timeRange, timeUnit, presets, handleChangeSlider]);
    useEffect(() => {
        if (presets.from && presets.to && timeUnit) {
            const parser = timeUnitToParser[timeUnit];
            setTimeRange([
                toUnixSeconds(parser(presets.from)),
                toUnixSeconds(parser(presets.to)),
            ]);
        }
    }, [presets.from, presets.to, timeUnit]);
    const mountedForSomeTime = useTimeout(500, mounted);
    const combinedTemporalDimension = useCombinedTemporalDimension();
    const sliderRange = useMemo(() => {
        var _a, _b;
        const { values } = combinedTemporalDimension;
        const min = (_a = values[0]) === null || _a === void 0 ? void 0 : _a.value;
        const max = (_b = values[values.length - 1]) === null || _b === void 0 ? void 0 : _b.value;
        if (!min || !max) {
            return;
        }
        return [
            toUnixSeconds(parseDate(min)),
            toUnixSeconds(parseDate(max)),
        ];
    }, [combinedTemporalDimension]);
    if (!timeRange || !filter.active || !sliderRange) {
        return null;
    }
    return (<Slider className={classes.slider} onChange={(_ev, value) => handleChangeSlider(value)} onChangeCommitted={() => setEnableTransition(true)} valueLabelFormat={valueLabelFormat} step={null} min={sliderRange[0]} max={sliderRange[1]} valueLabelDisplay={mountedForSomeTime ? "on" : "off"} value={timeRange} marks={combinedTemporalDimension.values.map(({ value }) => ({
            value: toUnixSeconds(parseDate(value)),
        }))}/>);
};
const useDataFilterStyles = makeStyles((theme) => ({
    wrapper: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: theme.spacing(2),
    },
    filter: {
        display: "flex",
        flex: "1 1 100%",
        width: "100%",
        marginRight: theme.spacing(3),
        "&:last-of-type": {
            marginRight: 0,
        },
        "& > div": {
            width: "100%",
        },
    },
}));
export const saveDataFiltersSnapshot = (chartConfigs, stores, componentId) => {
    const snapshot = Object.fromEntries(Object.entries(stores).map(([key, [_getState, _useStore, store]]) => {
        const state = store.getState();
        const filterValue = state.dataFilters[componentId];
        return [key, filterValue];
    }));
    return () => {
        for (const [chartKey, [_getState, _useStore, store]] of Object.entries(stores)) {
            if (chartConfigs.map((config) => config.key).includes(chartKey)) {
                const dataFilters = store.getState().dataFilters;
                const filterValue = snapshot[chartKey];
                if (filterValue) {
                    dataFilters[componentId] = filterValue;
                    store.setState({ dataFilters });
                }
                else {
                    delete dataFilters[componentId];
                    store.setState({ dataFilters });
                }
            }
        }
    };
};
const DashboardDataFilters = ({ componentIds }) => {
    const [state] = useConfiguratorState(hasChartConfigs);
    const { chartConfigs, dataSource } = state;
    const classes = useDataFilterStyles();
    const groupedPreparedFilters = useMemo(() => {
        const allPreparedFilters = [];
        chartConfigs.forEach((chartConfig) => {
            chartConfig.cubes.forEach((cube) => {
                const filtersByMappingStatus = getFiltersByMappingStatus(chartConfig, {
                    cubeIri: cube.iri,
                    joinByIds: componentIds.filter(isJoinById),
                });
                const { unmappedFilters, mappedFilters } = filtersByMappingStatus;
                const cubeComponentIds = [
                    ...Object.keys(cube.filters),
                    ...Object.keys(chartConfig.fields),
                    ...Object.values(chartConfig.fields).map((field) => field.componentId),
                ].filter(truthy);
                const componentIdPairs = componentIds
                    .map((originalId) => {
                    var _a;
                    const resolvedId = isJoinById(originalId)
                        ? ((_a = getResolvedJoinById(cube, originalId)) !== null && _a !== void 0 ? _a : originalId)
                        : originalId;
                    return { originalId, resolvedId };
                })
                    .filter(({ resolvedId, originalId }) => {
                    return resolvedId === originalId
                        ? cubeComponentIds.includes(resolvedId)
                        : true;
                });
                const componentIdResolution = Object.fromEntries(componentIdPairs.map(({ originalId, resolvedId }) => [
                    originalId,
                    resolvedId,
                ]));
                allPreparedFilters.push({
                    cubeIri: cube.iri,
                    interactiveFilters: {},
                    unmappedFilters: unmappedFilters,
                    mappedFilters,
                    componentIdResolution,
                });
            });
        });
        return groupPreparedFiltersByDimension(allPreparedFilters, componentIds);
    }, [chartConfigs, componentIds]);
    return (<div className={classes.wrapper}>
      {groupedPreparedFilters.map(({ dimensionId, entries }) => (<DataFilter key={dimensionId} dimensionId={dimensionId} entries={entries} dataSource={dataSource} chartConfigs={chartConfigs}/>))}
    </div>);
};
const DataFilter = ({ dimensionId, entries, dataSource, chartConfigs, }) => {
    const locale = useLocale();
    const classes = useDataFilterStyles();
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const dashboardInteractiveFilters = useDashboardInteractiveFilters();
    const cubeIris = uniq(entries.map((entry) => entry.cubeIri));
    const relevantChartConfigs = chartConfigs.filter((config) => config.cubes.some((cube) => cubeIris.includes(cube.iri)));
    const cubeFilters = useMemo(() => {
        return entries.map((entry) => ({
            iri: entry.cubeIri,
            componentIds: [entry.resolvedDimensionId],
            loadValues: true,
        }));
    }, [entries]);
    const [{ data }] = useDataCubesComponentsQuery({
        chartConfig: relevantChartConfigs[0],
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters,
        },
        keepPreviousData: true,
        pause: cubeFilters.length === 0,
    });
    const dimension = data === null || data === void 0 ? void 0 : data.dataCubesComponents.dimensions[0];
    const [value, setValue] = useState();
    const handleChange = useEvent((e) => {
        const newValue = e.target.value;
        setValue(newValue);
        for (const [chartKey, [_getState, _useStore, store]] of Object.entries(dashboardInteractiveFilters.stores)) {
            if (relevantChartConfigs.map((config) => config.key).includes(chartKey)) {
                setDataFilter(store, dimensionId, newValue);
            }
        }
    });
    // Syncs the interactive filter value with the config value
    useEffect(() => {
        const value = dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.filters[dimensionId].value;
        if (value) {
            handleChange({ target: { value } });
        }
    }, [dimensionId, handleChange, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.filters]);
    useEffect(() => {
        var _a;
        const restoreSnapshot = saveDataFiltersSnapshot(relevantChartConfigs, dashboardInteractiveFilters.stores, dimensionId);
        const value = (_a = dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.filters[dimensionId]) === null || _a === void 0 ? void 0 : _a.value;
        if (value) {
            handleChange({ target: { value } });
        }
        else if (dimension === null || dimension === void 0 ? void 0 : dimension.values.length) {
            handleChange({
                target: { value: dimension.values[0].value },
            });
        }
        return () => {
            restoreSnapshot();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dimension === null || dimension === void 0 ? void 0 : dimension.values]);
    const disabled = !(dimension === null || dimension === void 0 ? void 0 : dimension.values.length);
    const hierarchy = dimension === null || dimension === void 0 ? void 0 : dimension.hierarchy;
    return dimension && value ? (<div className={classes.filter}>
      {isTemporalDimension(dimension) ? (<DataFilterTemporalDimension value={value} dimension={dimension} onChange={handleChange} disabled={disabled}/>) : hierarchy ? (<DataFilterHierarchyDimension value={value} dimension={dimension} onChange={handleChange} hierarchy={hierarchy} disabled={disabled}/>) : (<DataFilterGenericDimension value={value} dimension={dimension} onChange={handleChange} disabled={disabled}/>)}
    </div>) : null;
};
