import { i18n } from "@lingui/core";
import { defineMessage, Trans } from "@lingui/macro";
import { headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, thematicBreakPlugin, toolbarPlugin, } from "@mdxeditor/editor";
import { Box, ButtonBase, Checkbox as MUICheckbox, CircularProgress, Divider, FormControlLabel as MUIFormControlLabel, Input as MUIInput, ListSubheader, MenuItem, Radio as MUIRadio, Select as MUISelect, Slider as MUISlider, sliderClasses, Stack, Switch as MUISwitch, Tooltip, Typography, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useId } from "@reach/auto-id";
import clsx from "clsx";
import flatten from "lodash/flatten";
import { useCallback, useMemo, useRef, useState, } from "react";
import { useBrowseContext } from "@/browse/model/context";
import { Flex } from "@/components/flex";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { BlockTypeMenu } from "@/components/mdx-editor/block-type-menu";
import { BoldItalicUnderlineToggles } from "@/components/mdx-editor/bold-italic-underline-toggles";
import { linkDialogPlugin } from "@/components/mdx-editor/link-dialog";
import { LinkDialogToggle } from "@/components/mdx-editor/link-dialog-toggle";
import { ListToggles } from "@/components/mdx-editor/list-toggles";
import { maxLengthPlugin } from "@/components/mdx-editor/max-length-plugin";
import { VisuallyHidden } from "@/components/visually-hidden";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { valueComparator } from "@/utils/sorting-values";
import { useEvent } from "@/utils/use-event";
import "@mdxeditor/editor/style.css";
const sizeToVariant = {
    sm: "caption",
    md: "body3",
    lg: "h5",
};
export const FormControlLabel = (props) => {
    const { size = "md", ...rest } = props;
    return (<MUIFormControlLabel {...rest} componentsProps={{
            typography: {
                variant: sizeToVariant[size],
            },
        }}/>);
};
export const Label = ({ htmlFor, children, sx, }) => {
    return (<Typography variant="caption" component="label" htmlFor={htmlFor} sx={sx}>
      {children}
    </Typography>);
};
export const RadioGroup = ({ children }) => {
    return <Flex sx={{ gap: 6, wrap: "wrap" }}>{children}</Flex>;
};
export const Radio = ({ label, size, name, value, checked, disabled, onChange, warnMessage, }) => {
    return (<MaybeTooltip title={warnMessage}>
      <FormControlLabel label={label} size={size} htmlFor={`${name}-${value}`} disabled={disabled} control={<MUIRadio name={name} id={`${name}-${value}`} value={value} onChange={onChange} checked={!!checked} disabled={disabled}/>}/>
    </MaybeTooltip>);
};
export const Slider = ({ label, name, value, marks, disabled, renderTextInput = true, onChange, sx, ...rest }) => {
    return (<Box sx={sx}>
      {label && <Label htmlFor={`${name}-${value}`}>{label}</Label>}
      <Stack direction="row" gap={4} justifyContent="center" alignItems="center">
        <MUISlider name={name} id={`${name}-${value}`} size="small" value={value} disabled={disabled} 
    // @ts-ignore
    onChange={onChange} marks={marks} {...rest} sx={{
            mb: 0,
            [`& .${sliderClasses.mark}`]: {
                [`&[data-index='0'], &[data-index='${Array.isArray(marks) ? marks.length - 1 : 0}']`]: { display: "none" },
            },
        }}/>
        {renderTextInput && (<MUIInput size="sm" value={`${value}`} disabled={disabled} onChange={onChange} sx={{
                width: 64,
                height: 30,
                ".MuiInput-input": {
                    p: 0,
                    textAlign: "center",
                },
            }}/>)}
      </Stack>
    </Box>);
};
export const Checkbox = ({ label, size, name, value, checked, disabled, onChange, color, indeterminate, className, }) => (<FormControlLabel label={label} size={size} htmlFor={name} disabled={disabled} className={className} control={<MUICheckbox id={name} name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} indeterminate={indeterminate} sx={{ svg: { color } }}/>} sx={{ whiteSpace: "nowrap" }}/>);
export const getSelectOptions = (options, { sort, locale, }) => {
    const noneOptions = options.filter((o) => o.isNoneValue);
    const restOptions = options.filter((o) => !o.isNoneValue);
    if (sort) {
        restOptions.sort(valueComparator(locale));
    }
    return [...noneOptions, ...restOptions];
};
export const Select = ({ label, id, variant, size = "md", value, defaultValue, disabled, options, optionGroups, onChange, sort = true, sideControls, open, onClose, onOpen, loading, hint, sx, }) => {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const locale = useLocale();
    const sortedOptions = useMemo(() => {
        if (optionGroups) {
            return flatten(optionGroups.map(([group, values]) => [
                { isGroupHeader: !!group, ...group },
                ...getSelectOptions(values, { sort, locale }),
            ]));
        }
        else {
            return getSelectOptions(options, { sort, locale });
        }
    }, [optionGroups, sort, locale, options]);
    const handleOpen = useEvent((e) => {
        var _a, _b;
        setWidth((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width) !== null && _b !== void 0 ? _b : 0);
        onOpen === null || onOpen === void 0 ? void 0 : onOpen(e);
    });
    return (<Box ref={ref} sx={{ width: "100%", ...sx }}>
      {label && (<Label htmlFor={id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {label}
          {loading && (<CircularProgress size={12} sx={{ display: "inline-block", marginLeft: 2 }}/>)}
        </Label>)}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MUISelect variant={variant} size={size} id={id} name={id} onChange={onChange} value={value} defaultValue={defaultValue} disabled={disabled} open={open} onOpen={handleOpen} onClose={onClose} renderValue={(value) => {
            const selectedOption = sortedOptions.find((opt) => opt.value === value);
            if (!selectedOption) {
                return "";
            }
            return (<>
                {selectedOption.label}
                {hint && <DisabledMessageIcon message={hint}/>}
              </>);
        }} MenuProps={selectMenuProps} sx={{ maxWidth: sideControls ? "calc(100% - 28px)" : "100%" }}>
          {sortedOptions.map((opt) => {
            var _a;
            if (!opt.value && !opt.isGroupHeader) {
                return null;
            }
            const isSelected = value === opt.value;
            return opt.isGroupHeader ? (opt.label && (<ListSubheader key={opt.label}>
                  <Typography variant="caption" component="p" style={{ maxWidth: width }}>
                    {opt.label}
                  </Typography>
                </ListSubheader>)) : (<MenuItem key={opt.value} disabled={opt.disabled} value={(_a = opt.value) !== null && _a !== void 0 ? _a : undefined} sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    typography: selectSizeToTypography[size],
                }}>
                {opt.label}
                <Flex sx={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 24,
                    minHeight: 20,
                }}>
                  {opt.disabledMessage ? (<DisabledMessageIcon message={opt.disabledMessage}/>) : null}
                  {isSelected ? <Icon name="checkmark" size={20}/> : null}
                </Flex>
              </MenuItem>);
        })}
        </MUISelect>
        {sideControls}
      </Box>
    </Box>);
};
export const selectMenuProps = {
    slotProps: {
        paper: {
            elevation: 0,
            sx: {
                "& .MuiList-root": {
                    width: "auto",
                    padding: "4px 0",
                    boxShadow: 3,
                    cursor: "default",
                    "& .MuiMenuItem-root": {
                        color: "monochrome.600",
                        "&:hover": {
                            backgroundColor: "cobalt.50",
                            color: "monochrome.800",
                        },
                        "&.Mui-selected": {
                            backgroundColor: "transparent",
                            color: "monochrome.800",
                            "&:hover": {
                                backgroundColor: "cobalt.50",
                            },
                        },
                    },
                },
            },
        },
    },
};
export const selectSizeToTypography = {
    xs: "caption",
    sm: "h6",
    md: "h5",
    lg: "h4",
    xl: "h4",
};
export const DisabledMessageIcon = (props) => {
    const { message } = props;
    return (<Tooltip arrow title={<Typography variant="caption" color="secondary">
          {message}
        </Typography>} placement="top" componentsProps={{
            tooltip: { sx: { width: 140, px: 2, py: 1 } },
        }} sx={{ opacity: 1, pointerEvents: "auto", ml: 1 }}>
      <Typography color="orange.main" style={{ lineHeight: 0 }}>
        <Icon name="warningCircle" size={20}/>
      </Typography>
    </Tooltip>);
};
export const Input = ({ type, label, name, value, defaultValue, endAdornment, placeholder, onBlur, onKeyDown, disabled, onChange, error, errorMessage, sx, }) => (<Box sx={{ fontSize: "1rem", pb: 2 }}>
    {label && name && <Label htmlFor={name}>{label}</Label>}
    <MUIInput type={type} id={name} size="sm" color="secondary" name={name} value={value} defaultValue={defaultValue} disabled={disabled} onBlur={onBlur} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} endAdornment={endAdornment} sx={error ? { ...sx, borderColor: "error.main" } : sx}/>
    {error && errorMessage ? (<Typography variant="caption" color="error.main" sx={{ lineHeight: "1 !important" }}>
        {errorMessage}
      </Typography>) : null}
  </Box>);
export const MarkdownInput = ({ label, name, value, onChange, disablePlugins, disableToolbar, characterLimit, }) => {
    const classes = useMarkdownInputStyles();
    const [characterLimitReached, setCharacterLimitReached] = useState(false);
    const { headings: disableHeadings } = disablePlugins !== null && disablePlugins !== void 0 ? disablePlugins : {};
    const handleMaxLengthReached = useEvent(({ reachedMaxLength }) => {
        setCharacterLimitReached(reachedMaxLength);
    });
    return (<div>
      <MDXEditor className={clsx(classes.root, disableHeadings && classes.withoutHeadings)} markdown={value ? `${value}` : ""} plugins={[
            toolbarPlugin({
                toolbarClassName: classes.toolbar,
                toolbarContents: () => (<div>
                <Flex gap={2}>
                  {(disableToolbar === null || disableToolbar === void 0 ? void 0 : disableToolbar.textStyles) ? null : (<BoldItalicUnderlineToggles />)}
                  {(disableToolbar === null || disableToolbar === void 0 ? void 0 : disableToolbar.blockType) ? null : <BlockTypeMenu />}
                  {(disableToolbar === null || disableToolbar === void 0 ? void 0 : disableToolbar.listToggles) ? null : (<>
                      <Divider flexItem orientation="vertical"/>
                      <ListToggles />
                    </>)}
                  {(disableToolbar === null || disableToolbar === void 0 ? void 0 : disableToolbar.link) ? null : (<>
                      <Divider flexItem orientation="vertical"/>
                      <LinkDialogToggle />
                    </>)}
                </Flex>
                {label && name ? <Label htmlFor={name}>{label}</Label> : null}
              </div>),
            }),
            ...(disableHeadings ? [] : [headingsPlugin()]),
            listsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            quotePlugin(),
            markdownShortcutPlugin(),
            thematicBreakPlugin(),
            maxLengthPlugin({
                maxLength: characterLimit,
                onChange: handleMaxLengthReached,
            }),
        ]} onChange={(newValue) => {
            onChange === null || onChange === void 0 ? void 0 : onChange({
                currentTarget: {
                    value: newValue
                        // Remove backslashes from the string, as they are not supported in react-markdown
                        .replaceAll("\\", "")
                        // <u> is not supported in react-markdown we use for rendering.
                        .replaceAll("<u>", "<ins>")
                        .replace("</u>", "</ins>"),
                },
            });
        }}/>
      {characterLimitReached && (<Typography variant="caption" color="error">
          {i18n._(defineMessage({
                id: "controls.form.max-length-reached",
                message: "Character limit ({limit}) reached",
            }), { limit: characterLimit })}
        </Typography>)}
    </div>);
};
const useMarkdownInputStyles = makeStyles((theme) => ({
    root: {
        "& [data-lexical-editor='true']": {
            padding: "0.5rem 0.75rem",
            border: `1px solid ${theme.palette.monochrome[300]}`,
            borderRadius: 3,
            "&:focus": {
                border: `1px solid ${theme.palette.monochrome[500]}`,
            },
            "& *": {
                margin: "1em 0",
                lineHeight: 1.2,
            },
            "& :first-child": {
                marginTop: 0,
            },
            "& :last-child": {
                marginBottom: 0,
            },
        },
    },
    withoutHeadings: {
        "& [data-lexical-editor='true']": {
            ...theme.typography.body3,
        },
    },
    toolbar: {
        borderRadius: 0,
        backgroundColor: theme.palette.background.paper,
    },
}));
export const SearchField = ({ id, label, value, defaultValue, placeholder, sx, inputRef, InputProps, className, }) => {
    const { search, onSubmitSearch } = useBrowseContext();
    const onReset = InputProps === null || InputProps === void 0 ? void 0 : InputProps.onReset;
    const handleReset = useCallback((e) => {
        if (inputRef === null || inputRef === void 0 ? void 0 : inputRef.current) {
            inputRef.current.value = "";
        }
        onReset === null || onReset === void 0 ? void 0 : onReset(e);
    }, [inputRef, onReset]);
    const handleSubmit = useCallback(() => {
        var _a;
        const newSearch = (_a = inputRef === null || inputRef === void 0 ? void 0 : inputRef.current) === null || _a === void 0 ? void 0 : _a.value;
        if (!newSearch) {
            return;
        }
        onSubmitSearch(newSearch);
    }, [inputRef, onSubmitSearch]);
    return (<Box className={className} sx={sx}>
      {label && id && (<label htmlFor={id}>
          <VisuallyHidden>{label}</VisuallyHidden>
        </label>)}
      <MUIInput id={id} value={value} defaultValue={defaultValue} {...InputProps} inputRef={inputRef} placeholder={placeholder} autoComplete="off" size="xl" endAdornment={onReset && search && search !== "" ? (<ButtonBase data-testid="clearSearch" onClick={handleReset}>
              <VisuallyHidden>
                <Trans id="controls.search.clear">Clear search field</Trans>
              </VisuallyHidden>
              <Icon name="close"/>
            </ButtonBase>) : (<ButtonBase data-testid="submitSearch" onClick={handleSubmit}>
              <VisuallyHidden>
                <Trans id="dataset.search.label">Search</Trans>
              </VisuallyHidden>
              <Icon name="search"/>
            </ButtonBase>)}/>
    </Box>);
};
export const Switch = ({ id, size, label, name, checked, disabled, onChange, }) => {
    const genId = `switch-${useId(id)}`;
    return (<FormControlLabel size={size} htmlFor={genId} label={label} control={<MUISwitch id={genId} name={name} checked={checked} disabled={disabled} onChange={onChange}/>}/>);
};
