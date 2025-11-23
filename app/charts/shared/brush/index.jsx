import { useEventCallback } from "@mui/material";
import { bisector } from "d3-array";
import { brushX } from "d3-brush";
import { pointer, pointers, select } from "d3-selection";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeGetClosestDatesFromDateRange } from "@/charts/shared/brush/utils";
import { useChartState } from "@/charts/shared/chart-state";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { useTimeFormatUnit } from "@/formatters";
import { useChartInteractiveFilters, useInteractiveFiltersGetState, } from "@/stores/interactive-filters";
import { useTransitionStore } from "@/stores/transition";
import { getTextWidth } from "@/utils/get-text-width";
import { DISABLE_SCREENSHOT_ATTR } from "@/utils/use-screenshot";
const HANDLE_HEIGHT = 12;
const BRUSH_HEIGHT = 4;
const HEIGHT = HANDLE_HEIGHT + BRUSH_HEIGHT;
export const shouldShowBrush = (interactiveFiltersConfig, dashboardTimeRange) => {
    const chartTimeRange = interactiveFiltersConfig.timeRange;
    return !(dashboardTimeRange === null || dashboardTimeRange === void 0 ? void 0 : dashboardTimeRange.active) && (chartTimeRange === null || chartTimeRange === void 0 ? void 0 : chartTimeRange.active);
};
export const BrushTime = ({ yOffset }) => {
    var _a;
    const ref = useRef(null);
    const timeRange = useChartInteractiveFilters((d) => d.timeRange);
    const setTimeRange = useChartInteractiveFilters((d) => d.setTimeRange);
    const getInteractiveFiltersState = useInteractiveFiltersGetState();
    const setEnableTransition = useTransitionStore((d) => d.setEnable);
    const setBrushing = useTransitionStore((d) => d.setBrushing);
    const [brushedIsEnded, updateBrushEndedStatus] = useState(true);
    const [selectionExtent, setSelectionExtent] = useState(0);
    const updateSelectionExtent = (selection) => {
        if (selection) {
            setSelectionExtent(selection[1] - selection[0]);
        }
        else {
            setSelectionExtent(0);
        }
    };
    const { brushOverlayColor, brushSelectionColor, brushHandleStrokeColor, brushHandleFillColor, labelFontSize, } = useChartTheme();
    const { bounds, xScaleTimeRange, xDimension } = useChartState();
    const { chartType } = useChartState();
    const { yScaleTimeRange, yDimension } = useChartState();
    const formatDateUnit = useTimeFormatUnit();
    const formatDate = (date) => {
        if (chartType === "bar") {
            return formatDateUnit(date, yDimension.timeUnit);
        }
        return formatDateUnit(date, xDimension.timeUnit);
    };
    const { getX } = useChartState();
    const { getXAsDate, allData } = useChartState();
    const { getYAsDate } = useChartState();
    const getDate = (() => {
        if (chartType === "bar") {
            return getYAsDate;
        }
        if (chartType === "column" || chartType === "comboLineColumn") {
            return getXAsDate;
        }
        return getX;
    })();
    const fullData = allData;
    // Brush dimensions
    const { width, margins, chartHeight } = bounds;
    const scaleTimeRange = chartType === "bar" ? yScaleTimeRange : xScaleTimeRange;
    let { from, to } = timeRange;
    // FIXME: Should be fixed in useSyncInteractiveFilters where we try to parse
    // the date that can be a string (VISUALIZE_MOST_RECENT_VALUE).
    if (isNaN((_a = to === null || to === void 0 ? void 0 : to.getTime()) !== null && _a !== void 0 ? _a : 0)) {
        to = scaleTimeRange.domain()[1];
    }
    const brushLabelsWidth = getTextWidth(formatDate(scaleTimeRange.domain()[0]), {
        fontSize: labelFontSize,
    }) +
        getTextWidth(" - ", { fontSize: labelFontSize }) +
        getTextWidth(formatDate(scaleTimeRange.domain()[1]), {
            fontSize: labelFontSize,
        }) +
        HANDLE_HEIGHT;
    const brushWidth = width - brushLabelsWidth - margins.right;
    const brushWidthScale = scaleTimeRange.copy();
    brushWidthScale.range([0, brushWidth]);
    const [minBrushDomainValue, maxBrushDomainValue] = useMemo(() => brushWidthScale.domain().map((d) => d.getTime()), [brushWidthScale]);
    const getClosestObservationFromRangeDates = useCallback(([from, to]) => {
        const getClosestDatesFromDateRange = makeGetClosestDatesFromDateRange(fullData.sort((a, b) => getDate(a).getTime() - getDate(b).getTime()), getDate);
        return getClosestDatesFromDateRange(from, to);
    }, [fullData, getDate]);
    const [closestFrom, closestTo] = useMemo(() => {
        if (from && to) {
            return getClosestObservationFromRangeDates([from, to]);
        }
        else {
            return brushWidthScale.domain();
        }
    }, [from, getClosestObservationFromRangeDates, to, brushWidthScale]);
    const brushed = useEventCallback(({ selection }) => {
        updateBrushEndedStatus(false);
        if (selection) {
            const [xStart, xEnd] = selection.map((s) => brushWidthScale.invert(s));
            const [newFrom, newTo] = getClosestObservationFromRangeDates([
                xStart,
                xEnd,
            ]);
            // Need to use current state as the function is not updated during brushing
            // and the local state accessed here is not up to date. This leads to
            // making a dispatch on each brush move, which makes the animations laggy
            // and generally shouldn't happen.
            const { from, to } = getInteractiveFiltersState().timeRange;
            if ((from === null || from === void 0 ? void 0 : from.getTime()) !== newFrom.getTime() ||
                (to === null || to === void 0 ? void 0 : to.getTime()) !== newTo.getTime()) {
                setTimeRange(newFrom, newTo);
            }
        }
    });
    // Creates a 1-dimensional brush
    const brush = brushX()
        .extent([
        [0, 0],
        [brushWidth, BRUSH_HEIGHT],
    ])
        .on("start", (e) => {
        brushed(e);
        if (e.sourceEvent instanceof MouseEvent) {
            setEnableTransition(false);
            setBrushing(true);
        }
    })
        .on("brush", brushed)
        .on("end", function (e) {
        updateSelectionExtent(e.selection);
        // Happens when snapping to actual values.
        if (!e.sourceEvent) {
            updateBrushEndedStatus(false);
        }
        else {
            // End event fires twice on touchend (MouseEvent and TouchEvent),
            // we want to compute mx basing on MouseEvent.
            if (e.sourceEvent instanceof MouseEvent) {
                setEnableTransition(true);
                setBrushing(false);
                if (!e.selection && ref.current) {
                    const g = select(ref.current);
                    const [mx] = pointer(e, this);
                    const x = mx < 0 ? 0 : mx > brushWidth ? brushWidth : mx;
                    g.call(brush.move, [x, x]);
                }
            }
            updateBrushEndedStatus(true);
        }
    });
    /** Keyboard support */
    const moveBrushOnKeyPress = useCallback((event, handleDirection) => {
        if (from && to) {
            updateBrushEndedStatus(false);
            const bisectDateLeft = bisector((ds, date) => getDate(ds).getTime() - date.getTime()).left;
            const bisectDateRight = bisector((ds, date) => getDate(ds).getTime() - date.getTime()).right;
            if (event.keyCode === 37 && handleDirection === "w") {
                // west handle, moving left
                const index = bisectDateLeft(fullData, from, 1);
                const indexLeft = fullData[index - 1];
                if (getDate(indexLeft).getTime() < to.getTime()) {
                    // new lower than "to"
                    setTimeRange(getDate(indexLeft), to);
                }
                else {
                    // new too high, don't do anything
                    setTimeRange(from, to);
                }
            }
            else if (event.keyCode === 39 && handleDirection === "w") {
                // west handle, moving right
                const index = bisectDateRight(fullData, from, 1);
                const indexRight = fullData[index];
                if (getDate(indexRight).getTime() < to.getTime()) {
                    setTimeRange(getDate(indexRight), to);
                }
                else {
                    setTimeRange(from, to);
                }
            }
            else if (event.keyCode === 37 && handleDirection === "e") {
                // east handle, moving left
                const index = bisectDateLeft(fullData, to, 1);
                const indexLeft = fullData[index - 1];
                if (getDate(indexLeft).getTime() > from.getTime()) {
                    setTimeRange(from, getDate(indexLeft));
                }
                else {
                    setTimeRange(from, to);
                }
            }
            else if (event.keyCode === 39 && handleDirection === "e") {
                // east handle, moving right
                const index = bisectDateRight(fullData, to, 1);
                const indexLeft = fullData[index];
                if (indexLeft && getDate(indexLeft).getTime() > from.getTime()) {
                    setTimeRange(from, getDate(indexLeft));
                }
                else {
                    setTimeRange(from, to);
                }
            }
            updateBrushEndedStatus(true);
        }
    }, [fullData, setTimeRange, from, getDate, to]);
    useEffect(() => {
        if (ref.current) {
            const g = select(ref.current);
            const mkBrush = (g) => {
                g.call(brush);
                g.select(".overlay")
                    .datum({ type: "selection" })
                    .attr("fill-opacity", 0)
                    .style("y", `-${HANDLE_HEIGHT / 2 - 1}px`)
                    .style("height", HANDLE_HEIGHT)
                    .on("mousedown touchstart", (e) => {
                    const [[cx]] = pointers(e);
                    const x0 = cx - selectionExtent / 2;
                    const x1 = cx + selectionExtent / 2;
                    const overflowingLeft = x0 < 0;
                    const overflowingRight = x1 > brushWidth;
                    g.call(brush.move, overflowingLeft
                        ? [0, selectionExtent]
                        : overflowingRight
                            ? [brushWidth - selectionExtent, brushWidth]
                            : [x0, x1]);
                }, { passive: true });
                g.select(".selection")
                    .attr("fill", brushSelectionColor)
                    .attr("fill-opacity", 1)
                    .attr("stroke", "none");
                g.selectAll(".handle")
                    .attr("fill", brushHandleFillColor)
                    .attr("stroke", brushHandleStrokeColor)
                    .attr("stroke-width", 2)
                    .style("y", `-${BRUSH_HEIGHT}px`)
                    .style("width", `${HANDLE_HEIGHT}px`)
                    .style("height", `${HANDLE_HEIGHT}px`)
                    .attr("rx", `${HANDLE_HEIGHT}px`);
                g.select(".handle--w")
                    .attr("tabindex", 0)
                    .on("keydown", (e) => moveBrushOnKeyPress(e, "w"));
                g.select(".handle--e")
                    .attr("tabindex", 0)
                    .on("keydown", (e) => moveBrushOnKeyPress(e, "e"));
            };
            g.call(mkBrush);
        }
    }, [
        brush,
        brushWidth,
        brushHandleFillColor,
        brushHandleStrokeColor,
        brushOverlayColor,
        brushSelectionColor,
        moveBrushOnKeyPress,
        selectionExtent,
    ]);
    // This effect allows "snapping" to actual data points
    // after brush is ended and interactive-filters state is updated
    const closestFromStr = closestFrom === null || closestFrom === void 0 ? void 0 : closestFrom.toString(); // Local variables to prevent eslint-plugin-react-hooks bug
    const closestToStr = closestTo === null || closestTo === void 0 ? void 0 : closestTo.toString(); // leading to eslint crashing on this file
    useEffect(() => {
        const g = select(ref.current);
        if (closestFrom && closestTo && brushedIsEnded) {
            const coord = [brushWidthScale(closestFrom), brushWidthScale(closestTo)];
            g.transition().call(brush.move, coord);
            updateBrushEndedStatus(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        brushWidthScale,
        brushedIsEnded,
        setTimeRange,
        closestFromStr,
        closestToStr,
    ]);
    // This effect resets brush defaults to editor values
    // without transition
    useEffect(() => {
        const g = select(ref.current);
        const defaultSelection = [0, selectionExtent];
        g.call(brush.move, defaultSelection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minBrushDomainValue, maxBrushDomainValue]);
    // This effect makes the brush responsive
    useEffect(() => {
        if (ref.current) {
            const coord = [
                brushWidthScale(closestFrom),
                brushWidthScale(closestTo),
            ];
            select(ref.current).call(brush.move, coord);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brushWidth]);
    return fullData.length ? (<g {...DISABLE_SCREENSHOT_ATTR} transform={`translate(0, ${yOffset !== null && yOffset !== void 0 ? yOffset : chartHeight + margins.top + margins.bottom - HEIGHT * 1.5})`}>
      {/* Selected Dates */}
      <g>
        {closestFrom && closestTo && (<text fontSize={labelFontSize} textAnchor="start" x={0} y={0} dy={labelFontSize * 0.4}>
            {`${formatDate(closestFrom)} - ${formatDate(closestTo)}`}
          </text>)}
      </g>

      {/* Brush */}
      <g transform={`translate(${brushLabelsWidth}, 0)`}>
        {/* Visual overlay (functional overlay is managed by d3) */}
        <rect x={0} y={0} width={brushWidth} height={BRUSH_HEIGHT} fill={brushOverlayColor}/>
      </g>
      {/* actual Brush */}
      <g ref={ref} transform={`translate(${brushLabelsWidth}, 0)`}/>
    </g>) : null;
};
