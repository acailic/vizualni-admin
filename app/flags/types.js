const TYPE_PRIORITY = {
    boolean: 0,
    text: 1,
};
export const FLAGS = [
    {
        name: "debug",
        description: "Shows debug elements such as ConfiguratorState viewer and debug panel.",
        priority: 1,
        type: "boolean",
    },
    {
        name: "server-side-cache.disable",
        description: "Disables server-side cache functionality.",
        type: "boolean",
    },
    {
        name: "easter-eggs",
        description: "Enables hidden easter egg features.",
        type: "boolean",
    },
    {
        name: "wmts-show-extra-info",
        description: "Displays additional debug information in WMTS provider autocomplete.",
        type: "boolean",
    },
    {
        name: "custom-scale-domain",
        description: "Enables setting custom numerical scale domains.",
        type: "boolean",
    },
    {
        name: "convert-units",
        description: "Enables unit conversion functionality.",
        type: "boolean",
    },
].sort((a, b) => {
    var _a, _b;
    return ((_a = b.priority) !== null && _a !== void 0 ? _a : 0) - ((_b = a.priority) !== null && _b !== void 0 ? _b : 0) ||
        TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type] ||
        a.name.localeCompare(b.name);
});
export const FLAG_NAMES = FLAGS.map((flag) => flag.name);
