import { Icons } from "@/icons/components";
export { Icons } from "./components";
export const Icon = ({ size = 24, color, name, ...props }) => {
    const { style, ...otherProps } = props;
    const IconComponent = Icons[name];
    if (!IconComponent) {
        console.warn("No icon", name);
        return null;
    }
    return (<IconComponent width={size} height={size} color={color} style={{ minWidth: size, minHeight: size, ...style }} {...otherProps}/>);
};
export const getChartIcon = (chartType) => {
    switch (chartType) {
        case "area":
            return "areasChart";
        case "column":
            return "chartColumn";
        case "bar":
            return "chartBar";
        case "line":
            return "lineChart";
        case "map":
            return "mapChart";
        case "pie":
            return "pieChart";
        case "scatterplot":
            return "scatterplotChart";
        case "table":
            return "tableChart";
        case "comboLineSingle":
            return "multilineChart";
        case "comboLineDual":
            return "dualAxisChart";
        case "comboLineColumn":
            return "columnLineChart";
        default:
            const _exhaustiveCheck = chartType;
            return _exhaustiveCheck;
    }
};
