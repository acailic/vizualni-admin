export const makeOpenDataLink = (lang, cube) => {
    const identifier = cube === null || cube === void 0 ? void 0 : cube.identifier;
    if (!identifier) {
        return;
    }
    // Link to Serbian Open Data Portal
    return `https://data.gov.rs/${lang}/datasets/${encodeURIComponent(identifier)}`;
};
