export const assert = (condition, msg) => {
    if (!condition) {
        throw Error(`AssertionError: ${msg}`);
    }
};
