import SuperJSON from "superjson";
export const apiFetch = async (relativeUrl, options) => {
    const res = await fetch(relativeUrl, (options === null || options === void 0 ? void 0 : options.data)
        ? {
            method: options.method || "POST",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            body: JSON.stringify(options.data),
        }
        : undefined);
    const json = await res.json();
    if (json.success) {
        return "data" in json &&
            typeof json.data === "object" &&
            json.data !== null &&
            "meta" in json.data
            ? SuperJSON.deserialize(json.data)
            : json.data;
    }
    else {
        throw Error(json.message);
    }
};
