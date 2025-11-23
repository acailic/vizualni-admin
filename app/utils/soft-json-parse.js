export const softJSONParse = (v) => {
    try {
        return JSON.parse(v);
    }
    catch (e) {
        return null;
    }
};
