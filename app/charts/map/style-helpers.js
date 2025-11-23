import mapValues from "lodash/mapValues";
function hasUrl(obj) {
    return Object.prototype.hasOwnProperty.call(obj, "url");
}
export function hasLayout(obj) {
    return Object.prototype.hasOwnProperty.call(obj, "layout");
}
const replaceStringTokens = (s, tokens) => {
    if (!s) {
        return s;
    }
    let cur = s;
    for (const [src, dest] of Object.entries(tokens)) {
        cur = cur.replace(src, dest);
    }
    return cur;
};
export const replaceStyleTokens = (style, tokens) => {
    return {
        ...style,
        sources: mapValues(style.sources, (v) => {
            return {
                ...v,
                // @ts-ignore
                url: hasUrl(v) ? replaceStringTokens(v.url, tokens) : undefined,
            };
        }),
        glyphs: replaceStringTokens(style.glyphs, tokens),
        sprite: replaceStringTokens(style.sprite, tokens),
    };
};
export const mapLayers = (style, layerIterator) => {
    return {
        ...style,
        layers: style.layers.map((x) => (x ? layerIterator(x) : undefined)),
    };
};
