import { useCallback, useEffect, useMemo, useRef } from "react";
import { AnnotationCircle } from "@/charts/shared/annotation-circle";
import { AnnotationTooltip } from "@/charts/shared/annotation-tooltip";
import { matchesAnnotationTarget, useIsEditingAnnotation, } from "@/charts/shared/annotation-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { getChartConfig } from "@/config-utils";
import { isAnnotationField } from "@/configurator/components/chart-annotations/utils";
import { useConfiguratorState } from "@/configurator/configurator-state";
import { truthy } from "@/domain/types";
import { useLocale } from "@/locales/use-locale";
import { useChartInteractiveFilters } from "@/stores/interactive-filters";
export const Annotations = () => {
    const locale = useLocale();
    const [state] = useConfiguratorState();
    const chartConfig = getChartConfig(state);
    const { activeField, annotations } = chartConfig;
    const { chartData, bounds: { width, height, margins }, segmentDimension, getSegment, getAnnotationInfo, } = useChartState();
    const isEditingAnnotation = useIsEditingAnnotation();
    const interactiveAnnotations = useChartInteractiveFilters((d) => d.annotations);
    const updateAnnotation = useChartInteractiveFilters((d) => d.updateAnnotation);
    const hasAutoOpened = useRef(null);
    const previousActiveField = useRef(activeField);
    const handleAnnotationClick = useCallback((annotation) => {
        updateAnnotation(annotation.key, !interactiveAnnotations[annotation.key]);
    }, [interactiveAnnotations, updateAnnotation]);
    const createRenderAnnotation = useCallback((annotation, x, y, color, focused) => ({
        annotation,
        x: x + margins.left,
        y: y + margins.top,
        color,
        focused,
    }), [margins.left, margins.top]);
    const findObservationForAnnotation = useCallback((annotation) => {
        return chartData.find((observation) => {
            return annotation.targets.some((target) => observation[`${target.componentId}/__iri__`] === target.value &&
                target.componentId !== (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id));
        });
    }, [chartData, segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id]);
    const processAnnotationWithoutSegmentFocus = useCallback((annotation) => {
        const observation = findObservationForAnnotation(annotation);
        if (!observation) {
            return;
        }
        const { x, y, color } = getAnnotationInfo(observation, {
            segment: "",
            focusingSegment: false,
        });
        const focused = isEditingAnnotation
            ? activeField === annotation.key
            : false;
        return createRenderAnnotation(annotation, x, y, color, focused);
    }, [
        findObservationForAnnotation,
        getAnnotationInfo,
        isEditingAnnotation,
        activeField,
        createRenderAnnotation,
    ]);
    const processAnnotationWithSegmentFocus = useCallback((annotation) => {
        const focused = isEditingAnnotation
            ? activeField === annotation.key
            : false;
        return chartData.map((observation) => {
            if (!matchesAnnotationTarget(observation, annotation.targets)) {
                return;
            }
            const segment = getSegment(observation);
            const { x, y, color } = getAnnotationInfo(observation, {
                segment,
                focusingSegment: true,
            });
            const finalColor = color !== null && color !== void 0 ? color : (annotation.highlightType === "filled"
                ? annotation.color
                : undefined);
            return createRenderAnnotation(annotation, x, y, finalColor, focused);
        });
    }, [
        isEditingAnnotation,
        activeField,
        chartData,
        getSegment,
        getAnnotationInfo,
        createRenderAnnotation,
    ]);
    const renderAnnotations = useMemo(() => {
        // A "hack" to prevent using // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // We need to re-compute the annotation positions when the chart width or height changes.
        width;
        height;
        if (annotations.length === 0) {
            return [];
        }
        return annotations
            .flatMap((annotation) => {
            const focusingSegment = !segmentDimension ||
                annotation.targets.some((target) => target.componentId === segmentDimension.id);
            if (focusingSegment) {
                return processAnnotationWithSegmentFocus(annotation);
            }
            return processAnnotationWithoutSegmentFocus(annotation);
        })
            .filter(truthy);
    }, [
        width,
        height,
        annotations,
        segmentDimension,
        processAnnotationWithSegmentFocus,
        processAnnotationWithoutSegmentFocus,
    ]);
    useEffect(() => {
        if (!isEditingAnnotation) {
            hasAutoOpened.current = null;
            return;
        }
        if (activeField &&
            !interactiveAnnotations[activeField] &&
            hasAutoOpened.current !== activeField) {
            updateAnnotation(activeField, true);
            hasAutoOpened.current = activeField;
        }
    }, [
        activeField,
        interactiveAnnotations,
        isEditingAnnotation,
        updateAnnotation,
    ]);
    useEffect(() => {
        const prevField = previousActiveField.current;
        if (prevField &&
            isAnnotationField(prevField) &&
            prevField !== activeField) {
            const prevAnnotation = annotations.find((a) => a.key === prevField);
            if (prevAnnotation && !prevAnnotation.defaultOpen) {
                updateAnnotation(prevField, false);
            }
        }
        previousActiveField.current = activeField;
    }, [activeField, annotations, updateAnnotation]);
    return (<>
      {renderAnnotations.map((renderAnnotation) => {
            const { annotation, x, y, color, focused } = renderAnnotation;
            return (<>
            {annotation.text[locale] || focused ? (<AnnotationCircle key={annotation.key} x={x} y={y} color={color} focused={focused} onClick={() => handleAnnotationClick(annotation)}/>) : null}
            <AnnotationTooltip renderAnnotation={renderAnnotation} closable={!isEditingAnnotation || annotation.key !== activeField}/>
          </>);
        })}
    </>);
};
export const ANNOTATION_SINGLE_SEGMENT_OFFSET = 12;
