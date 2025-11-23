import { interpolate } from "d3-interpolate";
import { maybeTransition, } from "@/charts/shared/rendering-utils";
export const renderPies = (g, renderData, options) => {
    const { arcGenerator, transition, onClick, onHover, onHoverOut } = options;
    g.selectAll("path")
        .data(renderData, (d) => d.key)
        .join((enter) => enter
        .append("path")
        .attr("data-index", (_, i) => i)
        .attr("fill", (d) => d.color)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .on("click", (_, d) => {
        onClick(d.arcDatum.data, { segment: d.segment });
    })
        .on("mouseenter", function (_, d) {
        onHover(this, d.arcDatum.data, { segment: d.segment });
    })
        .on("mouseleave", function () {
        onHoverOut(this);
    })
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g.attr("d", (d) => arcGenerator(d.arcDatum)),
        t: (g) => g.call(animatePath, arcGenerator),
    })), (update) => update.call((update) => maybeTransition(update, {
        transition,
        s: (g) => g
            .attr("d", (d) => arcGenerator(d.arcDatum))
            .attr("fill", (d) => d.color),
        t: (g) => g.call(animatePath, arcGenerator).attr("fill", (d) => d.color),
    })), (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g.attr("d", (d) => arcGenerator(d.arcDatum)).remove(),
        t: (g) => g.call(animatePath, arcGenerator).remove(),
    }));
};
const animatePath = (g, arcGenerator) => {
    return g.attrTween("d", function (d) {
        const that = this;
        // Previous arcDatum.
        const _d = that.__d__;
        const i = interpolate(_d !== null && _d !== void 0 ? _d : d.arcDatum, d.arcDatum);
        return (t) => {
            that.__d__ = i(t);
            return arcGenerator(that.__d__);
        };
    });
};
