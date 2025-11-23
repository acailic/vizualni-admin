import { t, Trans } from "@lingui/macro";
import { Box, CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import pick from "lodash/pick";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState, } from "react";
import { LegendItem } from "@/charts/shared/legend-color";
import { Flex } from "@/components/flex";
import { Checkbox, Input, MarkdownInput, Radio, Select, Slider, Switch, } from "@/components/form";
import { SelectTree } from "@/components/select-tree";
import { useDisclosure } from "@/components/use-disclosure";
import { isColorInConfig, } from "@/config-types";
import { getChartConfig, useChartConfigFilters } from "@/config-utils";
import { ControlTab, ControlTabFieldInner, OnOffControlTab, } from "@/configurator/components/chart-controls/control-tab";
import { DatePickerField, } from "@/configurator/components/field-date-picker";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { isMultiFilterFieldChecked, useActiveChartField, useActiveLayoutField, useChartFieldField, useChartOptionBooleanField, useChartOptionRadioField, useChartOptionSelectField, useChartOptionSliderField, useMetaField, useMultiFilterContext, useSingleFilterField, useSingleFilterSelect, } from "@/configurator/config-form";
import { isConfiguring, isLayouting, useConfiguratorState, } from "@/configurator/configurator-state";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { isJoinByComponent, isTemporalOrdinalDimension, } from "@/domain/data";
import { isMostRecentValue, VISUALIZE_MOST_RECENT_VALUE, } from "@/domain/most-recent-value";
import { useTimeFormatLocale } from "@/formatters";
import { useLocale } from "@/locales/use-locale";
import { getPalette } from "@/palettes";
import { assert } from "@/utils/assert";
import { hierarchyToOptions } from "@/utils/hierarchy";
import { makeDimensionValueSorters } from "@/utils/sorting-values";
import { useEvent } from "@/utils/use-event";
import { useUserPalettes } from "@/utils/use-user-palettes";
const ColorPickerMenu = dynamic(() => import("./chart-controls/color-picker").then((mod) => mod.ColorPickerMenu), { ssr: false });
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        gap: theme.spacing(1),
        textAlign: "left",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
    },
    loadingIndicator: {
        display: "inline-block",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
}));
export const ControlTabField = ({ chartConfig, fieldComponents, value, labelId, disabled, warnMessage, }) => {
    const field = useActiveChartField({ value });
    return (<ControlTabFieldInner chartConfig={chartConfig} fieldComponents={fieldComponents} value={`${field.value}`} labelId={labelId} checked={field.checked} onClick={field.onClick} disabled={disabled} warnMessage={warnMessage}/>);
};
export const OnOffControlTabField = ({ value, label, icon, active, }) => {
    const { checked, onClick } = useActiveChartField({ value });
    return (<OnOffControlTab value={value} label={label} icon={icon} checked={checked} active={active} onClick={onClick}/>);
};
export const DataFilterSelect = ({ dimension, label, id, disabled, optional, sideControls, hierarchy, onOpen, loading, }) => {
    var _a;
    const fieldProps = useSingleFilterSelect(dimensionToFieldProps(dimension));
    const noneLabel = t({
        id: "controls.dimensionvalue.select",
        message: "Select filter",
    });
    const sortedValues = useMemo(() => {
        const sorters = makeDimensionValueSorters(dimension);
        return orderBy(dimension.values, sorters.map((s) => (dv) => s(dv.label)));
    }, [dimension]);
    const allValues = useMemo(() => {
        return optional
            ? [
                {
                    value: FIELD_VALUE_NONE,
                    label: noneLabel,
                    isNoneValue: true,
                },
                ...sortedValues,
            ]
            : sortedValues;
    }, [optional, sortedValues, noneLabel]);
    const hierarchyOptions = useMemo(() => {
        if (!hierarchy) {
            return;
        }
        return hierarchyToOptions(hierarchy, dimension.values.map((v) => v.value));
    }, [hierarchy, dimension.values]);
    const { open, close, isOpen } = useDisclosure();
    const handleOpen = useEvent(() => {
        open();
        onOpen === null || onOpen === void 0 ? void 0 : onOpen();
    });
    const handleClose = useEvent(() => {
        close();
    });
    if (hierarchy && hierarchyOptions) {
        return (<SelectTree label={<FieldLabel label={label}/>} id={id} options={hierarchyOptions} onClose={handleClose} onOpen={handleOpen} open={isOpen} disabled={disabled} sideControls={sideControls} value={fieldProps.value} onChange={(e) => {
                fieldProps.onChange({ target: { value: e.target.value } });
            }}/>);
    }
    const canUseMostRecentValue = isTemporalOrdinalDimension(dimension);
    const usesMostRecentValue = isMostRecentValue(fieldProps.value);
    // Dimension values can be empty just before a filter is reloaded through
    // ensurePossibleFilters
    const maxValue = (_a = sortedValues[sortedValues.length - 1]) === null || _a === void 0 ? void 0 : _a.value;
    return (<Select id={id} size="sm" label={canUseMostRecentValue ? (<div style={{ width: "100%" }}>
            <Flex justifyContent="flex-end" sx={{ mb: 0.5, mr: 7 }}>
              <Switch label={t({
                id: "controls.filter.use-most-recent",
                message: "Use most recent",
            })} size="sm" checked={usesMostRecentValue} onChange={() => fieldProps.onChange({
                target: {
                    value: usesMostRecentValue
                        ? `${maxValue}`
                        : VISUALIZE_MOST_RECENT_VALUE,
                },
            })}/>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" gap={1} width="100%">
              {label}
            </Flex>
          </div>) : (<FieldLabel label={label}/>)} disabled={disabled || usesMostRecentValue} options={allValues} sort={false} sideControls={sideControls} open={isOpen} onClose={handleClose} onOpen={handleOpen} loading={loading} {...fieldProps} value={usesMostRecentValue ? maxValue : fieldProps.value}/>);
};
export const dimensionToFieldProps = (dim) => {
    return isJoinByComponent(dim)
        ? dim.originalIds.map((o) => pick(o, ["cubeIri", "dimensionId"]))
        : [{ dimensionId: dim.id, cubeIri: dim.cubeIri }];
};
export const DataFilterTemporal = ({ label: _label, dimension, timeUnit, disabled, isOptional, sideControls, }) => {
    const { values, timeFormat } = dimension;
    const formatLocale = useTimeFormatLocale();
    const formatDate = formatLocale.format(timeFormat);
    const parseDate = formatLocale.parse(timeFormat);
    const fieldProps = useSingleFilterSelect(dimensionToFieldProps(dimension));
    const usesMostRecentDate = isMostRecentValue(fieldProps.value);
    const label = isOptional ? (<span>
      {_label}{" "}
      <span style={{ marginLeft: "0.25rem" }}>
        (<Trans id="controls.select.optional">optional</Trans>)
      </span>
    </span>) : (_label);
    const { minDate, maxDate, optionValues } = useMemo(() => {
        if (values.length) {
            const options = values.map((d) => {
                return {
                    label: `${d.value}`,
                    value: `${d.value}`,
                };
            });
            return {
                minDate: parseDate(`${values[0].value}`),
                maxDate: parseDate(`${values[values.length - 1].value}`),
                optionValues: options.map((d) => d.value),
            };
        }
        else {
            const date = new Date();
            return {
                minDate: date,
                maxDate: date,
                optionValues: [],
            };
        }
    }, [values, parseDate]);
    const isDateDisabled = useCallback((date) => {
        return !optionValues.includes(formatDate(date));
    }, [optionValues, formatDate]);
    return (<>
      <DatePickerField name={`date-picker-${dimension.id}`} label={<FieldLabel label={label}/>} value={usesMostRecentDate ? maxDate : parseDate(fieldProps.value)} onChange={fieldProps.onChange} isDateDisabled={isDateDisabled} timeUnit={timeUnit} dateFormat={formatDate} minDate={minDate} maxDate={maxDate} disabled={disabled || usesMostRecentDate} sideControls={sideControls} parseDate={parseDate}/>
      <Box sx={{ mt: 3 }}>
        <Switch label={t({
            id: "controls.filter.use-most-recent",
            message: "Use most recent",
        })} size="sm" checked={usesMostRecentDate} onChange={() => fieldProps.onChange({
            target: {
                value: usesMostRecentDate
                    ? formatDate(maxDate)
                    : VISUALIZE_MOST_RECENT_VALUE,
            },
        })}/>
      </Box>
    </>);
};
export const TimeInput = ({ id, label, value, timeFormat, formatLocale, isOptional, onChange, }) => {
    const [inputValue, setInputValue] = useState(value === FIELD_VALUE_NONE ? undefined : value);
    const [parseDateValue, formatDateValue] = useMemo(() => [formatLocale.parse(timeFormat), formatLocale.format(timeFormat)], [timeFormat, formatLocale]);
    const onInputChange = useCallback((e) => {
        setInputValue(e.currentTarget.value);
        if (e.currentTarget.value === "") {
            if (isOptional) {
                onChange(e);
            }
            else {
                setInputValue(value);
            }
        }
        else {
            const parsed = parseDateValue(e.currentTarget.value);
            const isValidDate = parsed !== null && formatDateValue(parsed) === e.currentTarget.value;
            if (isValidDate) {
                onChange(e);
            }
        }
    }, [formatDateValue, onChange, parseDateValue, value, isOptional]);
    return (<Input name={id} label={label} value={inputValue} onChange={onInputChange}/>);
};
export const ChartAnnotatorTabField = (props) => {
    var _a;
    const { value, emptyValueWarning, ...tabProps } = props;
    const fieldProps = useActiveChartField({ value });
    const [state] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const locale = useLocale();
    return (<ControlTab {...tabProps} lowerLabel={((_a = chartConfig.meta[value]) === null || _a === void 0 ? void 0 : _a[locale]) ? null : (<Typography variant="caption" color="orange.main">
            {emptyValueWarning}
          </Typography>)} value={`${fieldProps.value}`} checked={fieldProps.checked} onClick={fieldProps.onClick}/>);
};
export const LayoutAnnotatorTabField = (props) => {
    const { value, emptyValueWarning, ...tabProps } = props;
    const fieldProps = useActiveLayoutField({ value });
    const [state] = useConfiguratorState(isLayouting);
    const locale = useLocale();
    return (<ControlTab {...tabProps} lowerLabel={state.layout.meta[value][locale] ? null : (<Typography variant="caption" color="orange.main">
            {emptyValueWarning}
          </Typography>)} value={`${fieldProps.value}`} checked={fieldProps.checked} onClick={fieldProps.onClick}/>);
};
export const MetaInputField = ({ type, inputType, label, metaKey, locale, value, disableToolbar, }) => {
    const field = useMetaField({ type, metaKey, locale, value });
    switch (inputType) {
        case "text":
            return <Input label={label} {...field}/>;
        case "markdown":
            return (<MarkdownInput label={label} {...field} disableToolbar={disableToolbar}/>);
        default:
            const _exhaustiveCheck = inputType;
            return _exhaustiveCheck;
    }
};
export const TextBlockInputField = ({ locale }) => {
    const [state, dispatch] = useConfiguratorState(isLayouting);
    const { layout } = state;
    const { blocks } = layout;
    const activeBlock = useMemo(() => {
        const activeBlock = blocks.find((block) => block.key === layout.activeField);
        assert((activeBlock === null || activeBlock === void 0 ? void 0 : activeBlock.type) === "text", "We can only edit text blocks from TextBlockInputField");
        return activeBlock;
    }, [blocks, layout.activeField]);
    const handleChanged = useCallback((e) => {
        const text = e.currentTarget.value;
        dispatch({
            type: "LAYOUT_CHANGED",
            value: {
                ...layout,
                blocks: blocks.map((b) => b.key === activeBlock.key
                    ? {
                        ...b,
                        text: {
                            ...activeBlock.text,
                            [locale]: text,
                        },
                    }
                    : b),
            },
        });
    }, [dispatch, layout, blocks, activeBlock.key, activeBlock.text, locale]);
    const label = getFieldLabel(locale);
    return (<MarkdownInput name={label} label={label} value={activeBlock.text[locale]} onChange={handleChanged}/>);
};
const useMultiFilterColorPicker = (value, customColorPalettes) => {
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const filters = useChartConfigFilters(chartConfig);
    const { dimensionId, colorConfigPath } = useMultiFilterContext();
    const { activeField } = chartConfig;
    const hasColorField = isColorInConfig(chartConfig);
    const colorField = hasColorField ? "color" : activeField;
    const onChange = useCallback((color) => {
        if (colorField) {
            dispatch({
                type: "CHART_COLOR_CHANGED",
                value: {
                    field: colorField,
                    colorConfigPath: hasColorField ? "" : "color",
                    color,
                    value,
                },
            });
        }
    }, [dispatch, colorField, value, hasColorField]);
    const path = colorConfigPath ? `color.${colorConfigPath}` : "";
    const color = get(chartConfig, `fields["${colorField}"].${path}${hasColorField ? "colorMapping" : ""}["${value}"]`);
    const palette = useMemo(() => {
        var _a;
        const paletteId = get(chartConfig, `fields["${colorField}"].paletteId`);
        return getPalette({
            paletteId,
            fallbackPalette: (_a = customColorPalettes === null || customColorPalettes === void 0 ? void 0 : customColorPalettes.find((palette) => palette.paletteId === paletteId)) === null || _a === void 0 ? void 0 : _a.colors,
        });
    }, [chartConfig, colorField, customColorPalettes]);
    const checked = dimensionId
        ? isMultiFilterFieldChecked(filters, dimensionId, value)
        : null;
    return useMemo(() => {
        return {
            color,
            palette,
            onChange,
            checked,
        };
    }, [color, palette, onChange, checked]);
};
export const MultiFilterField = ({ value, label, symbol, enableShowValue, }) => {
    const { data: customColorPalettes } = useUserPalettes();
    const { color, checked, palette, onChange } = useMultiFilterColorPicker(value, customColorPalettes);
    return color && checked ? (<Flex sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            width: "100%",
        }}>
      <LegendItem symbol={symbol} label={label} color={color}/>
      <Flex sx={{ alignItems: "center", gap: 1 }}>
        {enableShowValue ? <ShowValuesMappingField value={value}/> : null}
        <ColorPickerMenu colors={palette} selectedHexColor={color} onChange={onChange}/>
      </Flex>
    </Flex>) : null;
};
export const ShowValuesMappingField = ({ value }) => {
    return (<ChartOptionCheckboxField label={t({ id: "controls.filter.show-values", message: "Show value" })} size="sm" field="segment" path={`showValuesMapping["${value}"]`}/>);
};
export const SingleFilterField = ({ filters, label, value, disabled, }) => {
    const field = useSingleFilterField({ filters, value });
    return <Radio label={label} disabled={disabled} {...field}/>;
};
export const ColorPicker = ({ label, color, symbol, colors, onChange, disabled, }) => {
    return (<Flex justifyContent="space-between" alignItems="center" gap={2} width="100%">
      <LegendItem label={label} color={color} symbol={symbol}/>
      <ColorPickerMenu colors={colors} selectedHexColor={color} onChange={onChange} disabled={disabled}/>
    </Flex>);
};
export const ColorPickerField = ({ symbol = "square", field, path, label, disabled, }) => {
    var _a;
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const updateColor = useCallback((value) => dispatch({
        type: "CHART_FIELD_UPDATED",
        value: {
            locale,
            field,
            path,
            value,
        },
    }), [locale, dispatch, field, path]);
    const { data: customColorPalettes } = useUserPalettes();
    const paletteId = get(chartConfig, `fields["${field}"].paletteId`);
    const color = get(chartConfig, `fields["${field}"].${path}`);
    const palette = getPalette({
        paletteId,
        fallbackPalette: (_a = customColorPalettes === null || customColorPalettes === void 0 ? void 0 : customColorPalettes.find((palette) => palette.paletteId === paletteId)) === null || _a === void 0 ? void 0 : _a.colors,
    });
    return (<ColorPicker label={label} color={color} symbol={symbol} colors={palette} onChange={updateColor} disabled={disabled}/>);
};
export const LoadingIndicator = () => {
    const classes = useStyles();
    return <CircularProgress size={16} className={classes.loadingIndicator}/>;
};
export const FieldLabel = ({ label, isFetching, }) => {
    const classes = useStyles();
    return (<Typography className={classes.root} variant="caption">
      {label}
      {isFetching ? <LoadingIndicator /> : null}
    </Typography>);
};
const getOptionsWithMaybeOptional = (options, optional) => {
    return optional
        ? [
            {
                value: FIELD_VALUE_NONE,
                label: t({
                    id: "controls.none",
                    message: "None",
                }),
                isNoneValue: true,
            },
            ...options,
        ]
        : options;
};
const getOptionGroupsWithMaybeOptional = (optionGroups, optional) => {
    return optional
        ? [
            [
                undefined,
                [
                    {
                        value: FIELD_VALUE_NONE,
                        label: t({
                            id: "controls.none",
                            message: "None",
                        }),
                        isNoneValue: true,
                    },
                ],
            ],
            ...optionGroups,
        ]
        : optionGroups;
};
export const ChartFieldField = ({ label = "", field, options, optionGroups, optional, disabled, components, }) => {
    const props = useChartFieldField({ field, components });
    const allOptions = useMemo(() => {
        return getOptionsWithMaybeOptional(options, !!optional);
    }, [options, optional]);
    const allOptionGroups = useMemo(() => {
        return optionGroups
            ? getOptionGroupsWithMaybeOptional(optionGroups, !!optional)
            : undefined;
    }, [optionGroups, optional]);
    return (<Select key={`select-${field}-dimension`} id={field} label={<FieldLabel label={label}/>} size="sm" disabled={disabled} options={allOptions} optionGroups={allOptionGroups} {...props}/>);
};
export const ChartOptionRadioField = ({ label, field, path, value, defaultChecked, disabled = false, warnMessage, }) => {
    var _a;
    const fieldProps = useChartOptionRadioField({
        path,
        field,
        value,
    });
    return (<Radio disabled={disabled} label={label} {...fieldProps} checked={(_a = fieldProps.checked) !== null && _a !== void 0 ? _a : defaultChecked} warnMessage={warnMessage}/>);
};
export const ChartOptionSliderField = ({ label, field, path, disabled = false, min = 0, max = 1, step = 0.1, defaultValue, }) => {
    const fieldProps = useChartOptionSliderField({
        path,
        field,
        min,
        max,
        defaultValue,
    });
    return (<Slider disabled={disabled} label={label} min={min} max={max} step={step} {...fieldProps}/>);
};
export const ChartOptionCheckboxField = ({ label, size, field, path, defaultValue = false, disabled = false, }) => {
    var _a;
    const fieldProps = useChartOptionBooleanField({
        field,
        path,
        defaultValue,
    });
    return (<Checkbox disabled={disabled} label={label} size={size} {...fieldProps} checked={(_a = fieldProps.checked) !== null && _a !== void 0 ? _a : defaultValue}/>);
};
export const ChartOptionSelectField = (props) => {
    const { id, label, field, path, disabled = false, options, optionGroups, getValue, getKey, optional, } = props;
    const fieldProps = useChartOptionSelectField({
        field,
        path,
        getValue,
        getKey,
    });
    const allOptions = useMemo(() => {
        return getOptionsWithMaybeOptional(options, !!optional);
    }, [optional, options]);
    const allOptionGroups = useMemo(() => {
        return optionGroups
            ? getOptionGroupsWithMaybeOptional(optionGroups, !!optional)
            : undefined;
    }, [optional, optionGroups]);
    return (<Select id={id} disabled={disabled} size="sm" label={<FieldLabel isFetching={false} label={label}/>} options={allOptions} optionGroups={allOptionGroups} {...fieldProps}/>);
};
export const ChartOptionSwitchField = ({ label, size, field, path, defaultValue = false, disabled = false, ...props }) => {
    var _a;
    const fieldProps = useChartOptionBooleanField({
        field,
        path,
        defaultValue,
    });
    return (<Switch disabled={disabled} label={label} size={size} {...fieldProps} {...props} checked={(_a = fieldProps.checked) !== null && _a !== void 0 ? _a : defaultValue}/>);
};
