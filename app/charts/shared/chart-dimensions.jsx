import { max } from "d3-array";
import { useMemo } from "react";
import { TICK_PADDING } from "@/charts/shared/axis-height-linear";
import { BRUSH_BOTTOM_SPACE } from "@/charts/shared/brush/constants";
import { getTickNumber } from "@/charts/shared/ticks";
import { TICK_FONT_SIZE, useChartTheme } from "@/charts/shared/use-chart-theme";
import { CHART_GRID_MIN_HEIGHT } from "@/components/react-grid";
import { hasChartConfigs, isLayoutingFreeCanvas, useConfiguratorState, } from "@/configurator";
import { getTextSize } from "@/utils/get-text-size";
import { getTextWidth } from "@/utils/get-text-width";
const computeChartPadding = ({ xLabelPresent, yScale, height, interactiveFiltersConfig, formatNumber, bandDomain, normalize, dashboardFilters, isFlipped, }) => {
    var _a;
    // Fake ticks to compute maximum tick length as
    // we need to take into account n between [0, 1] where numbers
    // with decimals have greater text length than the extremes.
    const fakeTicks = yScale.ticks(getTickNumber(height));
    const minLeftTickWidth = interactiveFiltersConfig.calculation.active || normalize
        ? getTextWidth("100%", { fontSize: TICK_FONT_SIZE }) + TICK_PADDING
        : 0;
    const left = Math.max(...fakeTicks.map((x) => getTextWidth(formatNumber(x), { fontSize: TICK_FONT_SIZE }) +
        TICK_PADDING), minLeftTickWidth);
    const interactiveBottomElement = !(dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange.active) &&
        interactiveFiltersConfig.timeRange.active;
    let bottom = isFlipped
        ? 15 // Eyeballed value
        : 48;
    if (bandDomain === null || bandDomain === void 0 ? void 0 : bandDomain.length) {
        bottom +=
            (_a = max(bandDomain, (d) => getTextWidth(d, { fontSize: TICK_FONT_SIZE }))) !== null && _a !== void 0 ? _a : 70;
    }
    const top = interactiveFiltersConfig.calculation.active ? 24 : 0;
    return isFlipped
        ? {
            top,
            bottom: left +
                (xLabelPresent ? 20 : 0) +
                (interactiveBottomElement ? BRUSH_BOTTOM_SPACE : 0),
            left: bottom,
        }
        : {
            top,
            left,
            bottom: bottom +
                (xLabelPresent ? 20 : 0) +
                (interactiveBottomElement ? BRUSH_BOTTOM_SPACE : 0),
        };
};
export const useChartPadding = (props) => {
    const { xLabelPresent, yScale, width, height, interactiveFiltersConfig, formatNumber, bandDomain, normalize, isFlipped, } = props;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    return useMemo(() => {
        return computeChartPadding({
            xLabelPresent,
            yScale,
            width,
            height,
            interactiveFiltersConfig,
            formatNumber,
            bandDomain,
            normalize,
            dashboardFilters,
            isFlipped,
        });
    }, [
        xLabelPresent,
        yScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
        bandDomain,
        normalize,
        dashboardFilters,
        isFlipped,
    ]);
};
const ASPECT_RATIO = 2 / 5;
export const getChartWidth = ({ width, left, right, }) => {
    return (width - left - right);
};
export const useChartBounds = ({ width, chartWidth, height, margins, }) => {
    const [state] = useConfiguratorState(hasChartConfigs);
    const { top, bottom } = margins;
    const chartHeight = isLayoutingFreeCanvas(state)
        ? Math.max(Math.max(40, CHART_GRID_MIN_HEIGHT - top - bottom), height - top - bottom)
        : chartWidth * ASPECT_RATIO;
    return {
        width,
        height: chartHeight + top + bottom,
        aspectRatio: ASPECT_RATIO,
        margins,
        chartWidth,
        chartHeight,
    };
};
const LINE_HEIGHT = 1.25;
export const useAxisLabelSizeVariables = ({ label, width: _width, }) => {
    const { axisLabelFontSize: fontSize } = useChartTheme();
    const { width, height } = getTextSize(label, {
        width: _width,
        fontSize,
        fontWeight: 400,
    });
    return {
        width,
        height,
        offset: height - fontSize,
    };
};
const AXIS_TITLE_PADDING = 20;
export const useXAxisTitleOffset = (xScale, getXLabel, xTimeUnit, fontSize) => {
    const { axisLabelFontSize } = useChartTheme();
    return useMemo(() => {
        return ((xScale && getXLabel
            ? getLongestXLabel({
                xScale,
                getXLabel,
                xTimeUnit,
                fontSize: fontSize !== null && fontSize !== void 0 ? fontSize : axisLabelFontSize,
            })
            : axisLabelFontSize * LINE_HEIGHT) + AXIS_TITLE_PADDING);
    }, [xScale, getXLabel, xTimeUnit, fontSize, axisLabelFontSize]);
};
const getLongestXLabel = ({ xScale, getXLabel, xTimeUnit, formatDate, fontSize, }) => {
    const domain = xScale.domain();
    const formattedLabels = domain.map((d) => {
        if (xTimeUnit && formatDate) {
            return formatDate(d, xTimeUnit);
        }
        else {
            return getXLabel(d);
        }
    });
    const labelWidths = formattedLabels.map((text) => getTextWidth(text, { fontSize }));
    const longestLabel = Math.max(...labelWidths);
    return longestLabel;
};
