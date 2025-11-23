import { sum } from "d3-array";
import { useMemo } from "react";
import { useLocale } from "@/locales/use-locale";
import { BaseStatsCard } from "@/statistics/base-stats-card";
import { groupByYearMonth } from "@/statistics/utils";
export const StatsCard = ({ title, subtitle, countByDay, trendAverages, }) => {
    const locale = useLocale();
    const { countByYearMonth, total } = useMemo(() => {
        var _a;
        return {
            countByYearMonth: groupByYearMonth(countByDay, { locale }),
            total: (_a = sum(countByDay, (d) => d.count)) !== null && _a !== void 0 ? _a : 0,
        };
    }, [countByDay, locale]);
    const avgMonthlyCount = Math.round(total / countByYearMonth.length);
    const { lastMonthDailyAverage, previousThreeMonthsDailyAverage } = trendAverages;
    const direction = lastMonthDailyAverage > previousThreeMonthsDailyAverage ? "up" : "down";
    return (<BaseStatsCard title={title(total)} subtitle={subtitle(total, avgMonthlyCount)} data={countByYearMonth} trend={{
            direction,
            lastMonthDailyAverage,
            previousThreeMonthsDailyAverage,
        }}/>);
};
