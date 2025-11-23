import { createId } from "@/utils/create-id";
const ANNOTATION_FIELD_PREFIX = "annotation";
const getAnnotationKey = (type) => {
    const key = createId();
    return `${ANNOTATION_FIELD_PREFIX}:${type}:${key}`;
};
export const isAnnotationField = (field) => {
    return !!(field === null || field === void 0 ? void 0 : field.startsWith(ANNOTATION_FIELD_PREFIX));
};
export const getDefaultHighlightAnnotation = () => {
    return {
        key: getAnnotationKey("highlight"),
        type: "highlight",
        targets: [],
        text: {
            "sr-Latn": "",
            "sr-Cyrl": "",
            en: "",
        },
        highlightType: "none",
        color: undefined,
        defaultOpen: true,
    };
};
