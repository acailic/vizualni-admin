import { useCallback } from "react";
import { useInteraction } from "@/charts/shared/use-interaction";
import { isSegmentInConfig, } from "@/config-types";
import { extractSingleFilters, getChartConfig } from "@/config-utils";
import { isAnnotationField } from "@/configurator/components/chart-annotations/utils";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
export const useIsEditingAnnotation = () => {
    const [state] = useConfiguratorState();
    const { activeField } = getChartConfig(state);
    return isAnnotationField(activeField) && isConfiguring(state);
};
export const useGetAnnotationRenderState = () => {
    const [interaction] = useInteraction();
    const [state] = useConfiguratorState();
    const chartConfig = getChartConfig(state);
    const { activeField } = chartConfig;
    const isEditing = useIsEditingAnnotation();
    const getAnnotationRenderState = useCallback((observation, { axisComponentId, axisValue, }) => {
        var _a;
        let annotation;
        for (const a of chartConfig.annotations) {
            const matches = matchesAnnotationTarget(observation, a.targets);
            if (matches) {
                annotation = a;
                break;
            }
        }
        let color;
        if ((annotation === null || annotation === void 0 ? void 0 : annotation.color) && annotation.highlightType === "filled") {
            color = annotation.color;
        }
        const currentInteraction = interaction;
        const interactionMatches = currentInteraction.type === "annotation" &&
            currentInteraction.visible &&
            ((_a = currentInteraction.observation) === null || _a === void 0 ? void 0 : _a[`${axisComponentId}/__iri__`]) ===
                axisValue;
        const targetsOtherAnnotations = chartConfig.annotations.some((a) => a.key !== activeField &&
            matchesAnnotationTarget(observation, a.targets));
        const isActive = (annotation === null || annotation === void 0 ? void 0 : annotation.key) === activeField;
        let focused = isEditing &&
            ((interactionMatches && !targetsOtherAnnotations) || isActive);
        return {
            color,
            focused,
            isActive,
        };
    }, [activeField, chartConfig.annotations, interaction, isEditing]);
    return getAnnotationRenderState;
};
export const getAnnotationTargetsFromObservation = (observation, { chartConfig, definitiveFilters, segment, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const singleFilters = extractSingleFilters(definitiveFilters);
    const targets = Object.entries(singleFilters)
        .filter(([, v]) => v.value !== FIELD_VALUE_NONE)
        .map(([componentId, value]) => ({
        componentId,
        value: `${value.value}`,
    }));
    switch (chartConfig.chartType) {
        case "column":
        case "line":
        case "area": {
            const xComponentId = chartConfig.fields.x.componentId;
            if (xComponentId) {
                targets.push({
                    componentId: xComponentId,
                    value: `${observation[`${xComponentId}/__iri__`]}`,
                });
            }
            const segmentComponentId = (_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.componentId;
            if (segmentComponentId && segment) {
                const value = (_b = segment !== null && segment !== void 0 ? segment : observation[`${segmentComponentId}/__iri__`]) !== null && _b !== void 0 ? _b : "";
                targets.push({
                    componentId: segmentComponentId,
                    value,
                });
            }
            break;
        }
        case "bar": {
            const yComponentId = chartConfig.fields.y.componentId;
            if (yComponentId) {
                targets.push({
                    componentId: yComponentId,
                    value: `${observation[`${yComponentId}/__iri__`]}`,
                });
            }
            const segmentComponentId = (_c = chartConfig.fields.segment) === null || _c === void 0 ? void 0 : _c.componentId;
            if (segmentComponentId && segment) {
                const value = (_d = segment !== null && segment !== void 0 ? segment : observation[`${segmentComponentId}/__iri__`]) !== null && _d !== void 0 ? _d : "";
                targets.push({
                    componentId: segmentComponentId,
                    value,
                });
            }
            break;
        }
        case "scatterplot": {
            const segmentComponentId = (_e = chartConfig.fields.segment) === null || _e === void 0 ? void 0 : _e.componentId;
            if (segmentComponentId && segment) {
                const value = (_f = segment !== null && segment !== void 0 ? segment : observation[`${segmentComponentId}/__iri__`]) !== null && _f !== void 0 ? _f : "";
                targets.push({
                    componentId: segmentComponentId,
                    value,
                });
            }
            break;
        }
        case "pie": {
            const segmentComponentId = (_g = chartConfig.fields.segment) === null || _g === void 0 ? void 0 : _g.componentId;
            if (segmentComponentId && segment) {
                const value = (_h = segment !== null && segment !== void 0 ? segment : observation[`${segmentComponentId}/__iri__`]) !== null && _h !== void 0 ? _h : "";
                targets.push({
                    componentId: segmentComponentId,
                    value,
                });
            }
            break;
        }
        case "comboLineColumn":
        case "comboLineDual":
        case "comboLineSingle":
        case "map":
        case "table":
            break;
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
    return targets;
};
export const matchesAnnotationTarget = (observation, targets) => {
    if (targets.length === 0) {
        return false;
    }
    for (const target of targets) {
        const observationValue = observation[`${target.componentId}/__iri__`];
        if (observationValue !== target.value) {
            return false;
        }
    }
    return true;
};
export const hasSegmentAnnotation = (observation, segment, chartConfig, definitiveFilters) => {
    var _a;
    if (!isSegmentInConfig(chartConfig)) {
        return false;
    }
    const segmentComponentId = (_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.componentId;
    if (!segmentComponentId) {
        return false;
    }
    return chartConfig.annotations.some((annotation) => {
        const observationTargets = getAnnotationTargetsFromObservation(observation, {
            chartConfig,
            definitiveFilters,
            segment,
        });
        if (annotation.targets.length === 0 || observationTargets.length === 0) {
            return false;
        }
        const relevantAnnotationTargets = annotation.targets.filter((annotationTarget) => {
            return observationTargets.some((observationTarget) => {
                return annotationTarget.componentId === observationTarget.componentId;
            });
        });
        if (relevantAnnotationTargets.length === 0) {
            return false;
        }
        return relevantAnnotationTargets.every((annotationTarget) => {
            return observationTargets.some((observationTarget) => {
                return (annotationTarget.componentId === observationTarget.componentId &&
                    annotationTarget.value === observationTarget.value);
            });
        });
    });
};
