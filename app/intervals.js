import { timeDay, timeHour, timeMinute, timeMonth, timeSecond, timeWeek, timeYear, } from "d3-time";
import { TimeUnit } from "@/graphql/query-hooks";
const timeIntervals = new Map([
    [TimeUnit.Year, timeYear],
    [TimeUnit.Month, timeMonth],
    [TimeUnit.Week, timeWeek],
    [TimeUnit.Day, timeDay],
    [TimeUnit.Hour, timeHour],
    [TimeUnit.Minute, timeMinute],
    [TimeUnit.Second, timeSecond],
]);
export const getTimeInterval = (timeUnit) => {
    var _a;
    return (_a = timeIntervals.get(timeUnit)) !== null && _a !== void 0 ? _a : timeDay;
};
