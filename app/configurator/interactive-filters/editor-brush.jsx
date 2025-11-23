import { Box, Typography } from "@mui/material";
import { brushX } from "d3-brush";
import { scaleTime } from "d3-scale";
import { pointer, select } from "d3-selection";
import { useCallback, useEffect, useRef } from "react";
import { Flex } from "@/components/flex";
import { useTimeFormatUnit } from "@/formatters";
import { useTheme } from "@/themes";
import { useResizeObserver } from "@/utils/use-resize-observer";
const HANDLE_SIZE = 16;
const HANDLE_OFFSET = HANDLE_SIZE / 8;
const BRUSH_HEIGHT = 1;
const MARGIN = HANDLE_SIZE / 2;
export const EditorBrush = ({ timeExtent, timeRange, timeInterval, timeUnit, onChange, disabled = false, hideEndHandle = false, }) => {
    const [resizeRef, width] = useResizeObserver();
    const brushRef = useRef(null);
    const { palette } = useTheme();
    const timeFormatUnit = useTimeFormatUnit();
    const brushWidth = width - (MARGIN + HANDLE_OFFSET) * 2;
    const timeScale = scaleTime().domain(timeExtent).range([0, brushWidth]);
    const getClosestDimensionValue = useCallback((date) => timeInterval.round(date), [timeInterval]);
    function brushed(e) {
        const selection = e.selection;
        if (selection) {
            const [xStart, xEnd] = selection.map((s) => getClosestDimensionValue(timeScale.invert(s)));
            onChange([xStart, xEnd]);
        }
        else {
            const g = select(brushRef.current);
            //@ts-ignore
            const [mx] = pointer(e, this);
            const x = mx < 0 ? 0 : mx > brushWidth ? brushWidth : mx;
            g.call(brush.move, [x, x]);
        }
    }
    const brush = brushX()
        .extent([
        [0, 0],
        [brushWidth, BRUSH_HEIGHT],
    ])
        .on("end", brushed);
    useEffect(() => {
        const g = select(brushRef.current);
        const fill = disabled ? palette.grey[300] : palette.primary.main;
        const pointerEvents = disabled ? "none" : "auto";
        const mkBrush = (g) => {
            g.select(".overlay")
                .attr("pointer-events", pointerEvents)
                .attr("fill", palette.grey[300])
                .attr("fill-opacity", 0.9);
            g.select(".selection")
                .attr("pointer-events", pointerEvents)
                .attr("fill", fill)
                .attr("fill-opacity", 1)
                .attr("stroke", "none");
            g.selectAll(".handle")
                .attr("pointer-events", pointerEvents)
                .attr("fill", fill)
                .style("y", `-${HANDLE_SIZE / 2 - 1}px`)
                .style("width", `${HANDLE_SIZE}px`)
                .style("height", `${HANDLE_SIZE}px`)
                .attr("rx", `${HANDLE_SIZE}px`);
            if (hideEndHandle) {
                g.select(".handle--e").remove();
            }
            g.call(brush);
        };
        mkBrush(g);
    }, [brush, disabled, hideEndHandle, palette.grey, palette.primary.main]);
    // Set default selection to full extent
    const [fromPx, toPx] = timeRange.map(timeScale);
    // FIXME: fix dependency array but don't include brush.move!
    useEffect(() => {
        const g = select(brushRef.current);
        g.call(brush.move, [fromPx, toPx]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromPx, toPx]);
    return (<Box sx={{ mt: 4 }}>
      <div ref={resizeRef} id="editor-brush">
        {width > 0 && (<svg width={width} height={BRUSH_HEIGHT + MARGIN * 2}>
            <g ref={brushRef} transform={`translate(${HANDLE_OFFSET * 2}, ${MARGIN})`}/>
          </svg>)}
      </div>
      <Flex justifyContent="space-between" mt={1} sx={{ px: `${HANDLE_OFFSET}px` }}>
        <Typography component="div" variant="caption">
          {timeFormatUnit(timeExtent[0], timeUnit)}
        </Typography>
        <Typography component="div" variant="caption">
          {timeFormatUnit(timeExtent[1], timeUnit)}
        </Typography>
      </Flex>
    </Box>);
};
