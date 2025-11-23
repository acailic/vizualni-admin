import { Trans } from "@lingui/macro";
import { Box, Button, ListSubheader, MenuItem, Select, Typography, } from "@mui/material";
import get from "lodash/get";
import { useEffect, useMemo, useRef, useState, } from "react";
import { Label } from "@/components/form";
import { getChartConfig } from "@/config-utils";
import { isConfiguring, useConfiguratorState, } from "@/configurator";
import { ColorPaletteDrawerContent } from "@/configurator/components/chart-controls/drawer-color-palette-content";
import { ConfiguratorDrawer } from "@/configurator/components/drawers";
import { useLocale } from "@/locales/use-locale";
import { useUser } from "@/login/utils";
import { createDivergingInterpolator, createSequentialInterpolator, divergingPalettes, getColorInterpolator, sequentialPalettes, } from "@/palettes";
import { getFittingColorInterpolator } from "@/utils/color-palette-utils";
import { useEvent } from "@/utils/use-event";
import { useUserPalettes } from "@/utils/use-user-palettes";
export const ColorRamp = (props) => {
    const { colorInterpolator, nSteps: _nSteps = 512, width = 220, height = 28, disabled, rx = 2, } = props;
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas && canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            const [stepWidth, nSteps] = _nSteps > width ? [1, width] : [width / _nSteps, _nSteps];
            for (let i = 0; i < nSteps; ++i) {
                ctx.fillStyle = colorInterpolator(i / (nSteps - 1));
                ctx.fillRect(stepWidth * i, 0, stepWidth, height);
            }
        }
    }, [colorInterpolator, _nSteps, width, height, disabled, rx]);
    return (<canvas ref={ref} width={width} height={height} style={{
            borderRadius: `${rx}px`,
            imageRendering: "pixelated",
            opacity: disabled ? 0.5 : 1,
        }}/>);
};
export const ColorRampField = (props) => {
    const { field, path, disabled, nSteps } = props;
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const { data: customColorPalettes, invalidate } = useUserPalettes();
    const palettes = useMemo(() => {
        const palettes = [...sequentialPalettes, ...divergingPalettes];
        return palettes;
    }, []);
    const currentPaletteId = get(chartConfig, `fields["${field}"].${path}.paletteId`);
    const currentPalette = palettes.find((d) => d.value === currentPaletteId);
    const currentCustomPalette = customColorPalettes === null || customColorPalettes === void 0 ? void 0 : customColorPalettes.find((d) => d.paletteId === currentPaletteId);
    const onSelectedItemChange = useEvent((ev) => {
        const value = ev.target.value;
        const selectedPalette = customColorPalettes === null || customColorPalettes === void 0 ? void 0 : customColorPalettes.find((palette) => palette.paletteId === value);
        handleChartConfigUpdate(value, selectedPalette);
    });
    const handleChartConfigUpdate = (value, selectedPalette) => {
        var _a;
        if (value) {
            dispatch({
                type: "CHART_FIELD_UPDATED",
                value: {
                    locale,
                    field,
                    path,
                    value: {
                        ...get(chartConfig, `fields["${field}"].${path}`),
                        paletteId: value,
                        paletteType: selectedPalette === null || selectedPalette === void 0 ? void 0 : selectedPalette.type,
                        colors: (_a = selectedPalette === null || selectedPalette === void 0 ? void 0 : selectedPalette.colors) !== null && _a !== void 0 ? _a : [],
                    },
                },
            });
        }
    };
    const [type, setType] = useState();
    const [anchorEl, setAnchorEl] = useState();
    const handleOpenCreateColorPalette = useEvent((ev) => {
        setAnchorEl(ev.currentTarget);
    });
    const handleCloseCreateColorPalette = useEvent((palette) => {
        invalidate();
        setAnchorEl(undefined);
        if (palette) {
            handleChartConfigUpdate(palette.paletteId, palette);
        }
        anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.focus();
    });
    const selectedColorInterpolator = getFittingColorInterpolator({
        currentPalette,
        customPalette: currentCustomPalette,
        defaultPalette: palettes[0],
    }, getColorInterpolator);
    return (<Box pb={2} sx={{ pointerEvents: disabled ? "none" : "auto" }}>
      <Label htmlFor="color-palette">
        <Trans id="controls.color.palette">Color palette</Trans>
      </Label>
      <Select size="sm" value={currentPaletteId} disabled={disabled} displayEmpty onChange={onSelectedItemChange} renderValue={(selected) => {
            if (!selected) {
                return (<Typography color={"secondary.active"} variant="body2">
                <Trans id="controls.color.palette.select">
                  Select a color palette
                </Trans>
              </Typography>);
            }
            return (<ColorRamp colorInterpolator={selectedColorInterpolator} nSteps={nSteps} disabled={disabled}/>);
        }} sx={{ mt: 1, lineHeight: 0 }}>
        {[
            ...PaletteSection({
                type: "sequential",
                onTypeSelect: setType,
                nSteps: nSteps,
                customColorPalettes: customColorPalettes,
                colorPalettes: sequentialPalettes,
                handleAddColorPalette: handleOpenCreateColorPalette,
                customInterpolator: createSequentialInterpolator,
            }),
            ...PaletteSection({
                type: "diverging",
                onTypeSelect: setType,
                nSteps: nSteps,
                customColorPalettes: customColorPalettes,
                colorPalettes: divergingPalettes,
                handleAddColorPalette: handleOpenCreateColorPalette,
                customInterpolator: createDivergingInterpolator,
            }),
        ]}
      </Select>
      {type && (<ConfiguratorDrawer open={!!anchorEl} hideBackdrop>
          <ColorPaletteDrawerContent onClose={(palette) => handleCloseCreateColorPalette(palette)} type={type} customColorPalettes={customColorPalettes}/>
        </ConfiguratorDrawer>)}
    </Box>);
};
const PaletteSection = (props) => {
    const user = useUser();
    const { type, nSteps, customColorPalettes, colorPalettes, onTypeSelect, customInterpolator, handleAddColorPalette, } = props;
    return [
        type === "diverging" ? (<ListSubheader>
        <Trans id="controls.color.palette.diverging">Diverging</Trans>
      </ListSubheader>) : (<ListSubheader>
        <Trans id="controls.color.palette.sequential">Sequential</Trans>
      </ListSubheader>),
        user && (<Button onClick={(e) => {
                onTypeSelect(type);
                handleAddColorPalette(e);
            }} variant="text" sx={{
                width: "100%",
                paddingY: 3,
                paddingX: 4,
            }}>
        <Trans id="login.profile.my-color-palettes.add">
          Add color palette
        </Trans>
      </Button>),
        user && (<ListSubheader>
        <Typography variant="subtitle2" fontWeight={700} fontSize={10} align="left">
          <Trans id="controls.custom-color-palettes">
            Custom color palettes
          </Trans>
        </Typography>
      </ListSubheader>),
        user &&
            (customColorPalettes === null || customColorPalettes === void 0 ? void 0 : customColorPalettes.filter((palette) => palette.type === type).map((palette) => {
                var _a;
                return (<MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }} key={`${type}-${palette.paletteId}`} value={palette.paletteId}>
              <Typography variant="caption">{palette.name}</Typography>
              <ColorRamp colorInterpolator={customInterpolator({
                        endColorHex: palette.colors[0],
                        startColorHex: palette.colors[1],
                        options: {
                            midColorHex: (_a = palette.colors[2]) !== null && _a !== void 0 ? _a : undefined,
                        },
                    }).interpolator} nSteps={nSteps}/>
            </MenuItem>);
            })),
        user && (<ListSubheader>
        <Typography variant="subtitle2" fontWeight={700} fontSize={10} align="left">
          <Trans id="controls.visualize-color-palette">
            Visualize color palettes
          </Trans>
        </Typography>
      </ListSubheader>),
        colorPalettes.map(({ value, interpolator }, i) => (<MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }} key={`${type}-${i}`} value={value}>
        <ColorRamp colorInterpolator={interpolator} nSteps={nSteps}/>
      </MenuItem>)),
    ];
};
