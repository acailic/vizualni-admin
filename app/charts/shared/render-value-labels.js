import { maybeTransition, } from "@/charts/shared/rendering-utils";
import { DISABLE_SCREENSHOT_COLOR_WIPE_KEY } from "@/components/chart-shared";
export const renderTotalValueLabels = (g, data, options) => {
    const { transition, rotate, textAnchor: _textAnchor, dx = 0, dy = -8, fontFamily, fontSize, strokeWidth = 3, } = options;
    const textAnchor = _textAnchor !== null && _textAnchor !== void 0 ? _textAnchor : getValueLabelTextAnchor(rotate);
    g.selectAll("text")
        .data(data, (d) => d.key)
        .join((enter) => enter
        .append("text")
        .attr("font-size", fontSize)
        .attr("font-family", fontFamily)
        .attr("text-anchor", textAnchor)
        .attr("paint-order", "stroke")
        .attr("stroke", "white")
        .attr("stroke-width", strokeWidth)
        .style("transform", (d) => getValueLabelTransform(d, {
        rotate,
        labelHeight: fontSize,
        dx,
        dy,
    }))
        .style("line-height", 1)
        .style("opacity", 0)
        .text((d) => d.valueLabel)
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g.style("opacity", 1),
    })), (update) => maybeTransition(update, {
        s: (g) => g
            .attr("text-anchor", textAnchor)
            .style("transform", (d) => getValueLabelTransform(d, {
            rotate,
            labelHeight: fontSize,
            dx,
            dy,
        }))
            .style("opacity", 1)
            .text((d) => d.valueLabel),
        transition,
    }), (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g.style("opacity", 0).remove(),
    }));
};
const getValueLabelTransform = (d, { rotate, labelHeight, dx, dy, }) => {
    if (rotate) {
        return `translate(${d.x + labelHeight / 3}px, ${d.y - (labelHeight * 2) / 3}px) rotate(-90deg)`;
    }
    return `translate(${d.x + dx}px, ${d.y + dy}px) rotate(0deg)`;
};
const getValueLabelTextAnchor = (rotate) => {
    return rotate ? "start" : "middle";
};
export const setSegmentWrapperValueLabelProps = (g) => {
    return g
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("width", "100%")
        .style("height", "100%")
        .style("padding", "2px");
};
export const setSegmentValueLabelProps = (g) => {
    return g
        .attr(DISABLE_SCREENSHOT_COLOR_WIPE_KEY, true)
        .style("overflow", "hidden")
        .style("font-size", "12px")
        .style("white-space", "nowrap")
        .style("text-overflow", "ellipsis");
};
