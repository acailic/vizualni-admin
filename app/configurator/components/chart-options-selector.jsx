import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import get from "lodash/get";
import { useCallback, useMemo } from "react";
import { getFieldComponentId } from "@/charts";
import { ANIMATION_FIELD_SPEC, getChartSpec, } from "@/charts/chart-config-ui-options";
import { useQueryFilters } from "@/charts/shared/chart-helpers";
import { Flex } from "@/components/flex";
import { InfoIconTooltip } from "@/components/info-icon-tooltip";
import { isAnimationInConfig, isComboChartConfig, isMapConfig, isTableConfig, } from "@/config-types";
import { getChartConfig } from "@/config-utils";
import { ControlSection, ControlSectionContent, ControlSectionSkeleton, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { Abbreviations } from "@/configurator/components/chart-options-selector/abbreviations";
import { AnimationField } from "@/configurator/components/chart-options-selector/animation-field";
import { BaseLayerField } from "@/configurator/components/chart-options-selector/base-layer-field";
import { CalculationField } from "@/configurator/components/chart-options-selector/calculation-field";
import { ColorComponentField } from "@/configurator/components/chart-options-selector/color-component-field";
import { ComboYField } from "@/configurator/components/chart-options-selector/combo-y-field";
import { ConversionUnitsField } from "@/configurator/components/chart-options-selector/conversion-units-field";
import { ImputationField } from "@/configurator/components/chart-options-selector/imputation-field";
import { LayoutField } from "@/configurator/components/chart-options-selector/layout-field";
import { LimitsField } from "@/configurator/components/chart-options-selector/limits-field";
import { MultiFilterField } from "@/configurator/components/chart-options-selector/multi-filter-field";
import { ScaleDomain } from "@/configurator/components/chart-options-selector/scale-domain";
import { ShowDotsField } from "@/configurator/components/chart-options-selector/show-dots-field";
import { SizeField } from "@/configurator/components/chart-options-selector/size-field";
import { SortingField } from "@/configurator/components/chart-options-selector/sorting-field";
import { makeGetFieldOptionGroups } from "@/configurator/components/chart-options-selector/utils";
import { CustomLayersSelector } from "@/configurator/components/custom-layers-selector";
import { ChartFieldField, ChartOptionCheckboxField, ChartOptionSwitchField, } from "@/configurator/components/field";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { getComponentLabel } from "@/configurator/components/ui-helpers";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { TableColumnOptions } from "@/configurator/table/table-chart-options";
import { CUSTOM_SORT_ENABLED_COMPONENTS, getComponentsFilteredByType, isMeasure, isStandardErrorDimension, } from "@/domain/data";
import { useFlag } from "@/flags";
import { useDataCubesComponentsQuery, useDataCubesMetadataQuery, useDataCubesObservationsQuery, } from "@/graphql/hooks";
import { useLocale } from "@/locales/use-locale";
export const ChartOptionsSelector = () => {
    var _a;
    const [state] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const { dataSource } = state;
    const { activeField } = chartConfig;
    const locale = useLocale();
    const [{ data: metadataData, fetching: fetchingMetadata }] = useDataCubesMetadataQuery({
        variables: {
            locale,
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            cubeFilters: chartConfig.cubes.map((cube) => ({ iri: cube.iri })),
        },
    });
    const cubesMetadata = metadataData === null || metadataData === void 0 ? void 0 : metadataData.dataCubesMetadata;
    const [{ data: componentsData, fetching: fetchingComponents }] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: chartConfig.cubes.map((cube) => ({
                iri: cube.iri,
                joinBy: cube.joinBy,
                loadValues: true,
            })),
        },
        keepPreviousData: true,
    });
    const dimensions = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents.dimensions;
    const measures = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents.measures;
    const queryFilters = useQueryFilters({
        chartConfig,
        dashboardFilters: state.dashboardFilters,
    });
    const [{ data: observationsData, fetching: fetchingObservations }] = useDataCubesObservationsQuery({
        chartConfig,
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: queryFilters,
        },
        pause: fetchingComponents,
        keepPreviousData: true,
    });
    const observations = (_a = observationsData === null || observationsData === void 0 ? void 0 : observationsData.dataCubesObservations) === null || _a === void 0 ? void 0 : _a.data;
    const fetching = fetchingMetadata || fetchingComponents || fetchingObservations;
    return cubesMetadata && dimensions && measures && observations ? (<Box sx={{
            // We need these overflow parameters to allow iOS scrolling.
            overflowX: "hidden",
            overflowY: "auto",
            pointerEvents: fetching ? "none" : "auto",
            opacity: fetching ? 0.7 : 1,
            transition: "opacity 0.2s",
        }}>
      {activeField ? (isTableConfig(chartConfig) ? (<TableColumnOptions state={state} dimensions={dimensions} measures={measures}/>) : (<ActiveFieldSwitch chartConfig={chartConfig} dimensions={dimensions} measures={measures} observations={observations} cubesMetadata={cubesMetadata}/>)) : null}
    </Box>) : (<>
      <ControlSectionSkeleton />
      <ControlSectionSkeleton />
    </>);
};
const ActiveFieldSwitch = ({ dimensions, measures, chartConfig, observations, cubesMetadata, }) => {
    const activeField = chartConfig.activeField;
    if (!activeField) {
        return null;
    }
    const chartSpec = getChartSpec(chartConfig);
    // Animation field is a special field that is not part of the encodings,
    // but rather is selected from interactive filters menu.
    const animatable = isAnimationInConfig(chartConfig) &&
        chartSpec.interactiveFilters.includes("animation");
    const baseEncodings = chartSpec.encodings;
    const encodings = animatable
        ? [...baseEncodings, ANIMATION_FIELD_SPEC]
        : baseEncodings;
    const encoding = encodings.find((e) => e.field === activeField);
    const activeFieldComponentId = getFieldComponentId(chartConfig.fields, activeField);
    const component = [...dimensions, ...measures].find((d) => d.id === activeFieldComponentId);
    return (<EncodingOptionsPanel encoding={encoding} chartConfig={chartConfig} field={activeField} component={component} dimensions={dimensions} measures={measures} observations={observations} cubesMetadata={cubesMetadata}/>);
};
const EncodingOptionsPanel = ({ encoding, field, chartConfig, component, dimensions, measures, observations, cubesMetadata, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { fields } = chartConfig;
    const fieldLabelHint = {
        animation: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        x: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        y: t({
            id: "controls.select.measure",
            message: "Select a measure",
        }),
        color: t({
            id: "controls.select.color",
            message: "Select a color",
        }),
        segment: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        baseLayer: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        areaLayer: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        symbolLayer: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
        customLayers: t({
            id: "controls.select.dimension",
            message: "Select a dimension",
        }),
    };
    const otherFields = Object.keys(fields).filter((f) => fields[f].hasOwnProperty("componentId") && field !== f);
    const otherFieldsIds = otherFields.map((f) => fields[f].componentId);
    const fieldComponents = useMemo(() => {
        return getComponentsFilteredByType({
            dimensionTypes: encoding.componentTypes,
            dimensions,
            measures,
        });
    }, [dimensions, encoding.componentTypes, measures]);
    const getFieldOptionGroups = useMemo(() => {
        return makeGetFieldOptionGroups({ cubesMetadata });
    }, [cubesMetadata]);
    const getOption = useCallback((c) => {
        return {
            value: c.id,
            label: getComponentLabel(c),
            disabled: ((encoding.exclusive === undefined || encoding.exclusive === true) &&
                otherFieldsIds.includes(c.id)) ||
                isStandardErrorDimension(c),
        };
    }, [encoding.exclusive, otherFieldsIds]);
    const options = useMemo(() => {
        return chartConfig.cubes.length === 1 ? fieldComponents.map(getOption) : [];
    }, [chartConfig.cubes.length, fieldComponents, getOption]);
    const optionGroups = useMemo(() => {
        return chartConfig.cubes.length > 1
            ? getFieldOptionGroups({ fieldComponents, getOption })
            : undefined;
    }, [
        chartConfig.cubes.length,
        fieldComponents,
        getFieldOptionGroups,
        getOption,
    ]);
    const components = useMemo(() => {
        return [...measures, ...dimensions];
    }, [measures, dimensions]);
    const fieldComponent = useMemo(() => {
        var _a;
        const encodingId = (_a = fields === null || fields === void 0 ? void 0 : fields[encoding.field]) === null || _a === void 0 ? void 0 : _a.componentId;
        return components.find((d) => d.id === encodingId);
    }, [components, fields, encoding.field]);
    const hasStandardError = useMemo(() => {
        return !!components.find((d) => {
            var _a;
            return (_a = d.related) === null || _a === void 0 ? void 0 : _a.some((r) => r.type === "StandardError" && r.id === (component === null || component === void 0 ? void 0 : component.id));
        });
    }, [components, component]);
    const hasConfidenceInterval = useMemo(() => {
        const upperBoundComponent = components.find((d) => {
            var _a;
            return (_a = d.related) === null || _a === void 0 ? void 0 : _a.some((r) => r.type === "ConfidenceUpperBound" && r.id === (component === null || component === void 0 ? void 0 : component.id));
        });
        const lowerBoundComponent = components.find((d) => {
            var _a;
            return (_a = d.related) === null || _a === void 0 ? void 0 : _a.some((r) => r.type === "ConfidenceLowerBound" && r.id === (component === null || component === void 0 ? void 0 : component.id));
        });
        return !!upperBoundComponent && !!lowerBoundComponent;
    }, [components, component]);
    const hasColorPalette = !!((_a = encoding.options) === null || _a === void 0 ? void 0 : _a.colorPalette);
    const hasSubType = !!((_b = encoding.options) === null || _b === void 0 ? void 0 : _b.chartSubType);
    const limitMeasure = isMapConfig(chartConfig) && chartConfig.activeField === "symbolLayer"
        ? measures.find((m) => { var _a; return m.id === ((_a = chartConfig.fields.symbolLayer) === null || _a === void 0 ? void 0 : _a.measureId); })
        : isMeasure(component)
            ? component
            : undefined;
    const chartScaleDomainEnabled = useFlag("custom-scale-domain");
    const unitConversionEnabled = useFlag("convert-units");
    return (<div key={`control-panel-${encoding.field}`} role="tabpanel" id={`control-panel-${encoding.field}`} aria-labelledby={`tab-${encoding.field}`} tabIndex={-1}>
      {/* Only show component select if necessary */}
      {encoding.componentTypes.length > 0 && (<ControlSection hideTopBorder>
          <SectionTitle closable>
            {getFieldLabel(`${chartConfig.chartType}.${encoding.field}`)}
          </SectionTitle>
          <ControlSectionContent gap="lg">
            {!encoding.customComponent && (<ChartFieldField field={encoding.field} label={fieldLabelHint[encoding.field]} optional={encoding.optional} options={options} optionGroups={optionGroups} components={components}/>)}
            {((_c = encoding.options) === null || _c === void 0 ? void 0 : _c.showValues) ? (<ChartOptionCheckboxField path="showValues" field={encoding.field} label={t({ id: "controls.section.show-total-values" })} disabled={(_e = (_d = encoding.options.showValues).getDisabledState) === null || _e === void 0 ? void 0 : _e.call(_d, chartConfig).disabled}/>) : null}
            {((_f = encoding.options) === null || _f === void 0 ? void 0 : _f.adjustScaleDomain) &&
                fieldComponent &&
                chartScaleDomainEnabled ? (<ScaleDomain chartConfig={chartConfig} field={field} observations={observations} getDefaultDomain={encoding.options.adjustScaleDomain.getDefaultDomain}/>) : null}
            {((_g = encoding.options) === null || _g === void 0 ? void 0 : _g.showStandardError) && hasStandardError && (<Flex alignItems="center" sx={{ gap: 1 }}>
                <ChartOptionSwitchField path="showStandardError" field={encoding.field} defaultValue label={t({ id: "controls.section.show-standard-error" })}/>
                <InfoIconTooltip enterDelay={600} PopperProps={{ sx: { maxWidth: 160 } }} title={<Trans id="controls.section.show-standard-error.explanation">
                      Show uncertainties extending from data points to represent
                      standard errors
                    </Trans>}/>
              </Flex>)}
            {((_h = encoding.options) === null || _h === void 0 ? void 0 : _h.showConfidenceInterval) &&
                hasConfidenceInterval && (<Box sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mt: 3,
                }}>
                  <ChartOptionSwitchField path="showConfidenceInterval" field={encoding.field} defaultValue label={t({
                    id: "controls.section.show-confidence-interval",
                })}/>
                  <InfoIconTooltip enterDelay={600} PopperProps={{ sx: { maxWidth: 160 } }} title={<Trans id="controls.section.show-confidence-interval.explanation">
                        Show uncertainties extending from data points to
                        represent confidence intervals
                      </Trans>}/>
                </Box>)}
            {((_j = encoding.options) === null || _j === void 0 ? void 0 : _j.useAbbreviations) && (<Abbreviations field={field} component={fieldComponent}/>)}
          </ControlSectionContent>
        </ControlSection>)}
      {((_k = encoding.options) === null || _k === void 0 ? void 0 : _k.showDots) && (<ShowDotsField fields={chartConfig.fields} field={field}/>)}
      {isComboChartConfig(chartConfig) && encoding.field === "y" && (<ComboYField chartConfig={chartConfig} measures={measures}/>)}
      {fieldComponent && (hasSubType || hasColorPalette) && (<LayoutField encoding={encoding} component={component} 
        // Combo charts use their own drawer.
        chartConfig={chartConfig} components={components} hasColorPalette={hasColorPalette} hasSubType={hasSubType} measures={measures}/>)}
      {((_m = (_l = encoding.options) === null || _l === void 0 ? void 0 : _l.imputation) === null || _m === void 0 ? void 0 : _m.shouldShow(chartConfig, observations)) && (<ImputationField chartConfig={chartConfig}/>)}
      {((_o = encoding.options) === null || _o === void 0 ? void 0 : _o.calculation) && get(fields, "segment") && (<CalculationField {...(_q = (_p = encoding.options.calculation).getDisabledState) === null || _q === void 0 ? void 0 : _q.call(_p, chartConfig)}/>)}
      {field === "baseLayer" && (<BaseLayerField chartConfig={chartConfig}/>)}
      {field === "customLayers" && <CustomLayersSelector />}
      {encoding.sorting &&
            component &&
            CUSTOM_SORT_ENABLED_COMPONENTS.includes(component.__typename) && (<SortingField chartConfig={chartConfig} field={field} encodingSortingOptions={encoding.sorting}/>)}
      {((_r = encoding.options) === null || _r === void 0 ? void 0 : _r.size) && component && (<SizeField chartConfig={chartConfig} field={field} componentTypes={encoding.options.size.componentTypes} optional={encoding.options.size.optional} dimensions={dimensions} measures={measures} getFieldOptionGroups={getFieldOptionGroups}/>)}
      {limitMeasure ? (<LimitsField chartConfig={chartConfig} dimensions={dimensions} measure={limitMeasure}/>) : null}
      {((_s = encoding.options) === null || _s === void 0 ? void 0 : _s.colorComponent) && component && (<ColorComponentField chartConfig={chartConfig} encoding={encoding} component={component} componentTypes={encoding.options.colorComponent.componentTypes} dimensions={dimensions} measures={measures} optional={encoding.options.colorComponent.optional} enableUseAbbreviations={encoding.options.colorComponent.enableUseAbbreviations} getFieldOptionGroups={getFieldOptionGroups}/>)}
      {unitConversionEnabled && ((_t = encoding.options) === null || _t === void 0 ? void 0 : _t.convertUnit) && (<ConversionUnitsField chartConfig={chartConfig} field={field} components={components}/>)}
      <MultiFilterField chartConfig={chartConfig} component={component} encoding={encoding} field={field} dimensions={dimensions} measures={measures}/>
      {fieldComponent &&
            field === "animation" &&
            isAnimationInConfig(chartConfig) &&
            chartConfig.fields.animation && (<AnimationField field={chartConfig.fields.animation}/>)}
    </div>);
};
