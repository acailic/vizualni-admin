import { Box, Typography } from "@mui/material";
import { hcl } from "d3-color";
import { createContext, useContext, useMemo, useState, } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { rgbArrayToHex } from "@/charts/shared/colors";
import { TooltipBox } from "@/charts/shared/interaction/tooltip-box";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { useInteraction } from "@/charts/shared/use-interaction";
import { truthy } from "@/domain/types";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
const MapTooltipStateContext = createContext(undefined);
export const useMapTooltip = () => {
    const ctx = useContext(MapTooltipStateContext);
    if (ctx === undefined) {
        throw Error("You need to wrap your component in <MapTooltipProvider /> to useMapTooltip()");
    }
    return ctx;
};
export const MapTooltipProvider = ({ children }) => {
    const [state, dispatch] = useState("area");
    return (<MapTooltipStateContext.Provider value={[state, dispatch]}>
      {children}
    </MapTooltipStateContext.Provider>);
};
const isTooltipValueValid = (v) => {
    return v !== null && (typeof v === "number" ? !isNaN(v) : true);
};
export const MapTooltip = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const [hoverObjectType] = useMapTooltip();
    const [interaction] = useInteraction();
    const { identicalLayerComponentIds, areaLayer, symbolLayer } = useChartState();
    const formatNumber = useFormatNumber();
    const { getFormattedError: formatSymbolError } = symbolLayer !== null && symbolLayer !== void 0 ? symbolLayer : {};
    const formatters = useChartFormatters({
        dimensions: [
            (areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors.type) === "continuous"
                ? null
                : areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors.component,
        ].filter(truthy),
        measures: [
            (areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors.type) === "continuous"
                ? areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors.component
                : null,
            symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.measureDimension,
        ].filter(truthy),
    });
    const areaTooltipState = useMemo(() => {
        var _a;
        if (areaLayer && interaction.observation) {
            const { colors } = areaLayer;
            const value = colors.getValue(interaction.observation);
            if (isTooltipValueValid(value)) {
                const show = identicalLayerComponentIds || hoverObjectType === "area";
                const color = rgbArrayToHex(colors.getColor(interaction.observation));
                const textColor = getTooltipTextColor(color);
                const valueFormatter = (d) => {
                    var _a;
                    return formatNumberWithUnit(d, (_a = formatters[colors.component.id]) !== null && _a !== void 0 ? _a : formatNumber, colors.component.unit);
                };
                return {
                    show,
                    value: typeof value === "number" ? valueFormatter(value) : value,
                    error: colors.type === "continuous"
                        ? (_a = colors.getFormattedError) === null || _a === void 0 ? void 0 : _a.call(colors, interaction.observation)
                        : null,
                    componentId: colors.component.id,
                    label: colors.component.label,
                    color,
                    textColor,
                };
            }
        }
    }, [
        interaction.observation,
        areaLayer,
        identicalLayerComponentIds,
        hoverObjectType,
        formatters,
        formatNumber,
    ]);
    const symbolTooltipState = useMemo(() => {
        var _a, _b;
        const { observation } = interaction;
        if (symbolLayer && observation) {
            const { colors } = symbolLayer;
            const value = symbolLayer.getValue(observation);
            if (isTooltipValueValid(value)) {
                const show = identicalLayerComponentIds || hoverObjectType === "symbol";
                const color = rgbArrayToHex(colors.getColor(observation));
                const textColor = getTooltipTextColor(color);
                const valueFormatter = (d) => {
                    var _a, _b, _c;
                    return formatNumberWithUnit(d, ((_a = symbolLayer.measureDimension) === null || _a === void 0 ? void 0 : _a.id)
                        ? ((_b = formatters[symbolLayer.measureDimension.id]) !== null && _b !== void 0 ? _b : formatNumber)
                        : formatNumber, (_c = symbolLayer.measureDimension) === null || _c === void 0 ? void 0 : _c.unit);
                };
                let preparedColors;
                if (colors.type === "fixed") {
                    preparedColors = {
                        type: "fixed",
                        color,
                        textColor,
                        sameAsValue: false,
                        error: null,
                    };
                }
                else if (colors.type === "categorical") {
                    preparedColors = {
                        type: "categorical",
                        component: colors.component,
                        value: colors.getValue(observation),
                        error: null,
                        color,
                        textColor,
                        sameAsValue: false,
                    };
                }
                else {
                    const rawValue = observation[colors.component.id];
                    const formattedError = (_a = colors.getFormattedError) === null || _a === void 0 ? void 0 : _a.call(colors, observation);
                    preparedColors = {
                        type: "continuous",
                        component: colors.component,
                        value: formatNumberWithUnit(rawValue, formatNumber, colors.component.unit),
                        error: formattedError,
                        color,
                        textColor,
                        sameAsValue: colors.component.id === ((_b = symbolLayer.measureDimension) === null || _b === void 0 ? void 0 : _b.id),
                    };
                }
                return {
                    value: valueFormatter(value),
                    error: formatSymbolError === null || formatSymbolError === void 0 ? void 0 : formatSymbolError(observation),
                    measureDimension: symbolLayer.measureDimension,
                    show,
                    color,
                    textColor,
                    colors: preparedColors,
                };
            }
        }
    }, [
        interaction,
        symbolLayer,
        identicalLayerComponentIds,
        hoverObjectType,
        formatSymbolError,
        formatters,
        formatNumber,
    ]);
    const showAreaColorTooltip = areaTooltipState === null || areaTooltipState === void 0 ? void 0 : areaTooltipState.show;
    const showSymbolMeasureTooltip = (symbolTooltipState === null || symbolTooltipState === void 0 ? void 0 : symbolTooltipState.show) &&
        (showAreaColorTooltip
            ? areaTooltipState.componentId !==
                ((_a = symbolTooltipState.measureDimension) === null || _a === void 0 ? void 0 : _a.id)
            : true);
    const showSymbolColorTooltip = symbolTooltipState &&
        symbolTooltipState.colors.type !== "fixed" &&
        (showSymbolMeasureTooltip
            ? ((_b = symbolTooltipState.measureDimension) === null || _b === void 0 ? void 0 : _b.id) !==
                ((_c = symbolTooltipState.colors.component) === null || _c === void 0 ? void 0 : _c.id)
            : showAreaColorTooltip &&
                areaTooltipState.componentId !==
                    ((_d = symbolTooltipState.colors.component) === null || _d === void 0 ? void 0 : _d.id));
    return (<>
      {interaction.type === "tooltip" &&
            interaction.mouse &&
            interaction.observation && (<TooltipBox x={interaction.mouse.x} y={interaction.mouse.y - 20} placement={{ x: "center", y: "top" }} margins={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <Box sx={{ minWidth: 200 }}>
              <Typography component="div" variant="caption" sx={{ fontWeight: "bold" }}>
                {hoverObjectType === "area"
                ? areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.getLabel(interaction.observation)
                : symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.getLabel(interaction.observation)}
              </Typography>
              <Box display="grid" sx={{
                mt: 1,
                width: "100%",
                gridTemplateColumns: "1fr auto",
                gap: 1,
                alignItems: "center",
            }}>
                {<>
                    {areaTooltipState && showAreaColorTooltip && (<TooltipRow title={areaTooltipState.label} background={areaTooltipState.color} color={areaTooltipState.textColor} value={areaTooltipState.value} error={areaTooltipState.error}/>)}

                    {symbolTooltipState && showSymbolMeasureTooltip && (<TooltipRow title={((_e = symbolTooltipState.measureDimension) === null || _e === void 0 ? void 0 : _e.label) || ""} {...(symbolTooltipState.colors.type === "fixed"
                    ? {
                        background: symbolTooltipState.color,
                        border: undefined,
                        color: symbolTooltipState.textColor,
                    }
                    : {
                        background: "#fff",
                        border: "1px solid #ccc",
                        color: "#000",
                    })} value={symbolTooltipState.value} error={symbolTooltipState.error}/>)}

                    {symbolTooltipState && showSymbolColorTooltip && (<TooltipRow title={((_f = symbolTooltipState.colors.component) === null || _f === void 0 ? void 0 : _f.label) || ""} background={symbolTooltipState.color} color={symbolTooltipState.textColor} value={(_g = symbolTooltipState.colors.value) !== null && _g !== void 0 ? _g : ""} error={symbolTooltipState.colors.error}/>)}
                  </>}
              </Box>
            </Box>
          </TooltipBox>)}
    </>);
};
const TooltipRow = ({ title, background, color, value, error, border = "none", }) => {
    return (<>
      <Typography component="div" variant="caption">
        {title}
      </Typography>
      <Box style={{
            display: "inline-block",
            border,
            borderRadius: 9999,
            background,
            color,
            textAlign: "center",
        }} sx={{ px: 2 }}>
        <Typography component="div" variant="caption">
          {value}
          {error}
        </Typography>
      </Box>
    </>);
};
const getTooltipTextColor = (color) => {
    return hcl(color).l < 55 ? "#fff" : "#000";
};
