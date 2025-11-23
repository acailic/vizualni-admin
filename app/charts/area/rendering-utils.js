import { interpolatePath } from "d3-interpolate-path";
import { select } from "d3-selection";
import { maybeTransition, } from "@/charts/shared/rendering-utils";
export const renderAreas = (g, data, options) => {
    const { transition } = options;
    g.selectAll("path")
        .data(data, (d) => d.key)
        .join((enter) => enter
        .append("path")
        .attr("d", (d) => d.dEmpty)
        .attr("fill", (d) => d.color)
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g.attr("d", (d) => d.d),
        t: (g) => g.attrTween("d", (d) => interpolatePath(d.dEmpty, d.d)),
    })), (update) => maybeTransition(update, {
        transition,
        s: (g) => g.attr("d", (d) => d.d).attr("fill", (d) => d.color),
        t: (g) => g
            .attrTween("d", function (d) {
            return interpolatePath(select(this).attr("d"), d.d);
        })
            .attr("fill", (d) => d.color),
    }), (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g.attr("d", (d) => d.dEmpty).remove(),
        t: (g) => g.attrTween("d", (d) => interpolatePath(d.d, d.dEmpty)).remove(),
    }));
};
