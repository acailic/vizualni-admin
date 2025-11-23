export const uniqueMapBy = (arr, keyFn) => {
    const res = new Map();
    for (const item of arr) {
        const key = keyFn(item);
        if (!res.has(key)) {
            res.set(key, item);
        }
    }
    return res;
};
