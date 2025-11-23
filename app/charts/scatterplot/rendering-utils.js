import { maybeTransition, } from "@/charts/shared/rendering-utils";
export const renderCircles = (g, renderData, options) => {
    const { transition } = options;
    g.selectAll("circle")
        .data(renderData, (d) => d.key)
        .join((enter) => enter
        .append("circle")
        .attr("data-index", (_, i) => i)
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", 4)
        .attr("fill", (d) => d.color)
        .attr("opacity", 0)
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g.attr("opacity", 1),
    })), (update) => maybeTransition(update, {
        transition,
        s: (g) => g
            .attr("cx", (d) => d.cx)
            .attr("cy", (d) => d.cy)
            .attr("fill", (d) => d.color)
            .attr("opacity", 1),
    }), (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g.attr("opacity", 0).remove(),
    }));
};
