export const fields = {
    title: {
        weight: 5,
        fn: (d) => d.title,
    },
    description: {
        weight: 2,
        fn: (d) => d.description,
    },
    creatorLabel: {
        weight: 1,
        fn: (d) => { var _a, _b; return (_b = (_a = d.creator) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : ""; },
    },
    publisher: {
        weight: 1,
        fn: () => "",
    },
    themeLabels: {
        weight: 1,
        fn: (d) => d.themes.map((d) => d.label).join(" "),
    },
    subthemeLabels: {
        weight: 1,
        fn: (d) => d.subthemes.map((d) => d.label).join(" "),
    },
};
export const exactMatchPoints = fields.title.weight * 2;
const isStopword = (d) => {
    return d.length < 3 && d.toLowerCase() === d;
};
/**
 * From a list of cube rows containing weighted fields
 */
export const computeScores = (cubes, { query }) => {
    var _a;
    const infoPerCube = {};
    if (query) {
        for (const cube of cubes) {
            // If a cube has been found, it has at least a score of 1.
            let score = 1;
            for (const [_field, { weight, fn }] of Object.entries(fields)) {
                const value = (_a = fn(cube)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (!value) {
                    continue;
                }
                for (const token of query.split(" ").filter((d) => !isStopword(d))) {
                    if (value.includes(token.toLowerCase())) {
                        score += weight;
                    }
                }
                // Bonus points for exact match.
                if (value.includes(query.toLowerCase())) {
                    score += exactMatchPoints;
                }
            }
            if (infoPerCube[cube.iri] === undefined ||
                score > infoPerCube[cube.iri].score) {
                infoPerCube[cube.iri] = { score };
            }
        }
    }
    else {
        for (const cube of cubes) {
            infoPerCube[cube.iri] = { score: 1 };
        }
    }
    return infoPerCube;
};
/**
 * Escape HTML special characters to prevent XSS attacks
 */
const escapeHtml = (text) => {
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
};
/**
 * Highlight search query matches in text with proper HTML escaping
 */
export const highlight = (text, query) => {
    // First escape the entire text to prevent XSS
    const escapedText = escapeHtml(text);
    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create regex from query tokens
    const re = new RegExp(escapedQuery.toLowerCase().split(" ").join("|"), "gi");
    // Highlight matches in the escaped text
    return escapedText.replace(re, (m) => `<b>${m}</b>`);
};
