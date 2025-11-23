import { bisector } from "d3-array";
export function makeGetClosestDatesFromDateRange(sortedData, getDate) {
    return (from, to) => {
        var _a, _b;
        if (sortedData.length === 0) {
            return [from, to];
        }
        const fromTime = from.getTime();
        const toTime = to.getTime();
        const bisectDateLeft = bisector((d, date) => {
            return getDate(d).getTime() - date.getTime();
        }).left;
        const startIndex = bisectDateLeft(sortedData, from, 1);
        const dStartLeft = sortedData[startIndex - 1];
        const dStartRight = (_a = sortedData[startIndex]) !== null && _a !== void 0 ? _a : dStartLeft;
        const startClosestDatum = fromTime - getDate(dStartLeft).getTime() >
            getDate(dStartRight).getTime() - fromTime
            ? dStartRight
            : dStartLeft;
        const bisectDateRight = bisector((d, date) => {
            return getDate(d).getTime() - date.getTime();
        }).right;
        const endIndex = bisectDateRight(sortedData, to, 1);
        const dEndLeft = sortedData[endIndex - 1];
        const dEndRight = (_b = sortedData[endIndex]) !== null && _b !== void 0 ? _b : dEndLeft;
        const endClosestDatum = toTime - getDate(dEndLeft).getTime() >
            getDate(dEndRight).getTime() - toTime
            ? dEndRight
            : dEndLeft;
        return [getDate(startClosestDatum), getDate(endClosestDatum)];
    };
}
