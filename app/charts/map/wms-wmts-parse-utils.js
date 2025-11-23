export const maybeArray = (x) => {
    if (x === undefined) {
        return undefined;
    }
    else if (Array.isArray(x)) {
        return x;
    }
    else {
        return [x];
    }
};
export const parseCrs = (crs) => {
    var _a;
    // parses the label (CRS:84) or URL style (urn:ogc:def:crs:EPSG::3857) of CRS
    // into namespace:number format
    const urn = /urn:ogc:def:crs:(?<namespace>.*):(?<version>[^:]*)?:(?<id>\d+)/;
    const label = /(?<namespace>.*):(?<id>\d+)/;
    const match = (_a = crs.match(urn)) !== null && _a !== void 0 ? _a : crs.match(label);
    if (match === null || match === void 0 ? void 0 : match.groups) {
        const { namespace, id } = match.groups;
        return `${namespace}:${id}`;
    }
    return crs;
};
