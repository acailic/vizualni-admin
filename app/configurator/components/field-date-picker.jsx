import { t } from "@lingui/macro";
import { DatePicker, PickersDay } from "@mui/lab";
import { Box, IconButton, TextField } from "@mui/material";
import { timeFormat } from "d3-time-format";
import { useCallback } from "react";
import { Flex } from "@/components/flex";
import { Label } from "@/components/form";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { TimeUnit } from "@/graphql/resolver-types";
import { Icon } from "@/icons";
export const DatePickerField = ({ name, label, value, onChange, disabled, isDateDisabled, sideControls, timeUnit = TimeUnit.Day, dateFormat = timeFormat("%Y-%m-%d"), parseDate, showClearButton, ...rest }) => {
    const handleChange = useCallback((date) => {
        if (!date || isDateDisabled(date)) {
            return;
        }
        const e = {
            target: {
                value: dateFormat(date),
            },
        };
        onChange(e);
    }, [isDateDisabled, onChange, dateFormat]);
    const handleNoFilter = useCallback(() => {
        const e = {
            target: {
                value: FIELD_VALUE_NONE,
            },
        };
        onChange(e);
    }, [onChange]);
    const dateLimitProps = getDateRenderProps(timeUnit, isDateDisabled);
    return (<Flex sx={{ flexDirection: "column", gap: 1 }}>
      {label && name && <Label htmlFor={name}>{label}</Label>}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DatePicker {...rest} {...dateLimitProps} components={{
            OpenPickerIcon: (props) => <Icon name="calendar" {...props}/>,
        }} PaperProps={{
            elevation: 4,
        }} inputFormat={getInputFormat(timeUnit)} views={getViews(timeUnit)} value={value} onAccept={handleChange} onChange={(date, keyboardInputValue) => {
            if (keyboardInputValue) {
                handleChange(date);
            }
        }} 
    // We need to render the day picker ourselves to correctly highlight
    // the selected day. It's broken in the MUI date picker.
    renderDay={(day, _, dayPickerProps) => {
            return (<PickersDay {...dayPickerProps} selected={(value === null || value === void 0 ? void 0 : value.getTime()) === day.getTime()}/>);
        }} renderInput={(params) => {
            var _a;
            return (<TextField hiddenLabel size="small" {...params} inputProps={{
                    ...params.inputProps,
                    value: value
                        ? dateFormat(value)
                        : t({
                            id: "controls.dimensionvalue.select",
                            message: "Select filter",
                        }),
                }} onChange={(e) => {
                    handleChange(parseDate(e.target.value));
                }} sx={{
                    ...params.sx,
                    width: "100%",
                    "& input": {
                        height: 40,
                        typography: "h6",
                    },
                    "& .MuiIconButton-root": {
                        p: 1,
                    },
                    "& .MuiOutlinedInput-input": {
                        py: 0,
                        pl: 4,
                    },
                    "& svg": {
                        color: "text.primary",
                    },
                }} InputProps={{
                    ...params.InputProps,
                    endAdornment: (<Box sx={{ display: "flex", alignItems: "center" }}>
                    {showClearButton && value && (<IconButton size="small" onClick={handleNoFilter} sx={{
                                p: 1,
                                mr: -0.5,
                            }}>
                        <Icon name="close"/>
                      </IconButton>)}
                    {(_a = params.InputProps) === null || _a === void 0 ? void 0 : _a.endAdornment}
                  </Box>),
                }}/>);
        }} disabled={disabled}/>
        {sideControls}
      </Box>
    </Flex>);
};
export const canRenderDatePickerField = (timeUnit) => {
    return [TimeUnit.Day, TimeUnit.Week, TimeUnit.Month, TimeUnit.Year].includes(timeUnit);
};
const getDateRenderProps = (timeUnit, isDateDisabled) => {
    switch (timeUnit) {
        case TimeUnit.Day:
        case TimeUnit.Week:
        case TimeUnit.Month:
            return { shouldDisableDate: isDateDisabled };
        case TimeUnit.Year:
            return { shouldDisableYear: isDateDisabled };
        default:
            const _exhaustiveCheck = timeUnit;
            return _exhaustiveCheck;
    }
};
const getInputFormat = (timeUnit) => {
    switch (timeUnit) {
        case TimeUnit.Day:
        case TimeUnit.Week:
            return "dd.MM.yyyy";
        case TimeUnit.Month:
            return "MM.yyyy";
        case TimeUnit.Year:
            return "yyyy";
        default:
            const _exhaustiveCheck = timeUnit;
            return _exhaustiveCheck;
    }
};
const getViews = (timeUnit) => {
    switch (timeUnit) {
        case TimeUnit.Day:
        case TimeUnit.Week:
            return ["year", "month", "day"];
        case TimeUnit.Month:
            return ["year", "month"];
        case TimeUnit.Year:
            return ["year"];
        default:
            const _exhaustiveCheck = timeUnit;
            return _exhaustiveCheck;
    }
};
