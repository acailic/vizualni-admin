import { ascending, extent, max, min } from "d3-array";
import { scaleDiverging, scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import mapKeys from "lodash/mapKeys";
import mapValues from "lodash/mapValues";
import { useMemo } from "react";
import { getLabelWithUnit, getSlugifiedId, } from "@/charts/shared/chart-helpers";
import { ChartContext, } from "@/charts/shared/chart-state";
import { useSize } from "@/charts/shared/use-size";
import { BAR_CELL_PADDING, TABLE_HEIGHT } from "@/charts/table/constants";
import { getTableUIElementsOffset } from "@/charts/table/table";
import { useTableStateData, useTableStateVariables, } from "@/charts/table/table-state-props";
import { mkNumber, useOrderedTableColumns, } from "@/configurator/components/ui-helpers";
import { useDimensionFormatters, useFormatNumber } from "@/formatters";
import { getColorInterpolator } from "@/palettes";
import { getTextWidth } from "@/utils/get-text-width";
import { makeDimensionValueSorters } from "@/utils/sorting-values";
const useTableState = (chartProps, variables, data) => {
    const { chartConfig, dimensions, measures } = chartProps;
    const { getX } = variables;
    const { chartData, allData, timeRangeData } = data;
    const { fields, settings, links, sorting } = chartConfig;
    const formatNumber = useFormatNumber();
    const hasBar = Object.values(fields).some((fValue) => fValue.columnStyle.type === "bar");
    const rowHeight = hasBar ? 56 : 40;
    const { width } = useSize();
    const margins = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    };
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = Math.min(TABLE_HEIGHT, 
    // + 1 for the header row
    (chartData.length + 1) * rowHeight);
    const height = chartHeight +
        margins.top +
        margins.bottom +
        getTableUIElementsOffset({
            showSearch: settings.showSearch,
            width,
            showTimeRange: chartConfig.interactiveFiltersConfig.timeRange.active,
        });
    const bounds = {
        width,
        height,
        aspectRatio: height / width,
        margins,
        chartWidth,
        chartHeight,
    };
    const orderedTableColumns = useOrderedTableColumns(fields);
    /**
     * REACT-TABLE CONFIGURATION
     * React-table is a headless hook, the following code
     * is used to manage its internal state from the editor.
     */
    const types = [...dimensions, ...measures].reduce((obj, c) => ({ ...obj, [getSlugifiedId(c.id)]: c.__typename }), {});
    // Data used by react-table
    const memoizedData = useMemo(function replaceKeys() {
        var _a;
        // Only read keys once
        const keys = Object.keys((_a = chartData[0]) !== null && _a !== void 0 ? _a : []);
        const n = keys.length;
        const slugifiedKeys = keys.map(getSlugifiedId);
        return chartData.map((d, index) => {
            const o = { id: index };
            for (let i = 0; i < n; i++) {
                const slugifiedKey = slugifiedKeys[i];
                const key = keys[i];
                const value = d[key];
                o[slugifiedKey] =
                    types[slugifiedKey] !== "NumericalMeasure"
                        ? value
                        : value !== null && value !== undefined
                            ? +value
                            : null;
            }
            return o;
        });
    }, [chartData, types]);
    // Columns used by react-table
    const tableColumns = useMemo(() => {
        const allComponents = [...dimensions, ...measures];
        const columns = orderedTableColumns.map((c) => {
            const headerComponent = allComponents.find((d) => d.id === c.componentId);
            if (!headerComponent) {
                throw Error(`No dimension <${c.componentId}> in cube!`);
            }
            const sorters = makeDimensionValueSorters(headerComponent, {
                sorting: { sortingType: "byTableSortingType", sortingOrder: "asc" },
            });
            const headerLabel = getLabelWithUnit(headerComponent);
            // The column width depends on the estimated width of the
            // longest value in the column, with a minimum of 150px.
            const columnItems = [...new Set(chartData.map((d) => d[c.componentId]))];
            const columnItemSizes = [
                ...columnItems.map((item) => {
                    const itemAsString = c.componentType === "NumericalMeasure"
                        ? formatNumber(item)
                        : item;
                    return getTextWidth(`${itemAsString}`, { fontSize: 16 }) + 20;
                }),
            ];
            const width = Math.max(50, getTextWidth(headerLabel, { fontSize: 16 }) + 44, ...columnItemSizes);
            return {
                Header: headerLabel,
                // Slugify accessor to avoid id's "." to be parsed as JS object notation.
                accessor: getSlugifiedId(c.componentId),
                width,
                sortType: (rowA, rowB, colId) => {
                    for (const d of sorters) {
                        const result = ascending(d(rowA.values[colId]), d(rowB.values[colId]));
                        if (result) {
                            return result;
                        }
                    }
                    return 0;
                },
            };
        });
        return columns;
    }, [dimensions, measures, orderedTableColumns, chartData, formatNumber]);
    // Groupings used by react-table
    const groupingIds = useMemo(() => orderedTableColumns
        .filter((c) => c.isGroup)
        .map((c) => getSlugifiedId(c.componentId)), [orderedTableColumns]);
    // Sorting used by react-table
    const sortingIds = useMemo(() => {
        return [
            // Prioritize the configured sorting
            ...sorting.map((s) => ({
                id: getSlugifiedId(s.componentId),
                desc: s.sortingOrder === "desc",
            })),
            // Add the remaining table columns to the sorting
            ...orderedTableColumns.flatMap((c) => {
                return sorting.some((s) => s.componentId === c.componentId)
                    ? []
                    : [{ id: getSlugifiedId(c.componentId), desc: false }];
            }),
        ];
    }, [sorting, orderedTableColumns]);
    const formatters = useDimensionFormatters([...dimensions, ...measures]);
    const hiddenIds = useMemo(() => orderedTableColumns
        .filter((c) => c.isHidden)
        .map((c) => getSlugifiedId(c.componentId)), [orderedTableColumns]);
    /**
     * TABLE FORMATTING
     * tableColumnsMeta contains styles for columns/cell components.
     * It is not used by react-table, only for custom styling.
     */
    const tableColumnsMeta = useMemo(() => {
        const allColumnsById = Object.fromEntries([...dimensions, ...measures].map((x) => [x.id, x]));
        const meta = mapKeys(mapValues(fields, (columnMeta, id) => {
            var _a;
            const slugifiedId = getSlugifiedId(id);
            const columnStyle = columnMeta.columnStyle;
            const columnStyleType = columnStyle.type;
            const columnComponentType = columnMeta.componentType;
            const formatter = formatters[id];
            const cellFormatter = (x) => formatter(x.value);
            const common = {
                dim: allColumnsById[id],
                id,
                slugifiedId,
                columnComponentType,
                description: ((_a = allColumnsById[id]) === null || _a === void 0 ? void 0 : _a.description) || undefined,
                formatter: cellFormatter,
                ...columnStyle,
            };
            if (columnStyleType === "text") {
                return common;
            }
            else if (columnStyleType === "category") {
                const { colorMapping } = columnStyle;
                const dimension = allColumnsById[id];
                const colorScale = scaleOrdinal();
                const labelsAndColor = Object.keys(colorMapping).map((colorMappingIri) => {
                    var _a, _b;
                    const dvLabel = ((_a = dimension.values.find((s) => {
                        return s.value === colorMappingIri;
                    })) !== null && _a !== void 0 ? _a : { label: "unknown" }).label;
                    return {
                        label: dvLabel,
                        color: (_b = colorMapping[colorMappingIri]) !== null && _b !== void 0 ? _b : schemeCategory10[0],
                    };
                });
                colorScale.domain(labelsAndColor.map((s) => s.label));
                colorScale.range(labelsAndColor.map((s) => s.color));
                return {
                    ...common,
                    colorScale,
                };
            }
            else if (columnStyleType === "heatmap") {
                const absMinValue = min(chartData, (d) => d[id] !== null ? Math.abs(d[id]) : 0) || 0;
                const absMaxValue = max(chartData, (d) => d[id] !== null ? Math.abs(d[id]) : 1) || 1;
                const maxAbsoluteValue = Math.max(absMinValue, absMaxValue);
                const colorScale = scaleDiverging(getColorInterpolator(columnStyle.paletteId)).domain([-maxAbsoluteValue, 0, maxAbsoluteValue]);
                return {
                    ...common,
                    colorScale,
                };
            }
            else if (columnStyleType === "bar") {
                // The column width depends on the estimated width of the
                // longest value in the column, with a minimum of 150px.
                const columnItems = [
                    ...new Set(chartData.map((d) => d !== null && d[id] !== null ? mkNumber(d[id]) : NaN)),
                ];
                const columnItemSizes = columnItems.map((item) => {
                    const itemAsString = formatter(item);
                    return getTextWidth(`${itemAsString}`, { fontSize: 16 }) + 80;
                });
                const width = Math.max(max(columnItemSizes, (d) => d) || 150, 150) -
                    BAR_CELL_PADDING * 2;
                const domain = extent(columnItems, (d) => d);
                const widthScale = scaleLinear().domain(domain).range([0, width]);
                return { ...common, widthScale };
            }
            else {
                return null;
            }
        }), (v) => v.slugifiedId);
        return meta;
    }, [dimensions, measures, fields, formatters, chartData]);
    const xScaleTimeRange = useMemo(() => {
        const xScaleTimeRangeDomain = extent(timeRangeData, (d) => getX(d));
        return scaleTime().domain(xScaleTimeRangeDomain);
    }, [getX, timeRangeData]);
    xScaleTimeRange.range([0, chartWidth]);
    return {
        chartType: "table",
        chartData: memoizedData,
        allData,
        bounds,
        rowHeight,
        showSearch: settings.showSearch,
        tableColumns,
        tableColumnsMeta,
        groupingIds,
        hiddenIds,
        sortingIds,
        xScaleTimeRange,
        links,
        ...variables,
    };
};
const TableChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useTableStateVariables(chartProps);
    const data = useTableStateData(chartProps, variables);
    const state = useTableState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const TableChart = (props) => {
    return <TableChartProvider {...props}/>;
};
