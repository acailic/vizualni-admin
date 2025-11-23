export const timed = (fn, cb) => {
    const wrapped = async function (...args) {
        const start = Date.now();
        // @ts-ignore I do not know why TS complains here
        const self = this;
        const res = await fn.apply(self, args);
        const end = Date.now();
        cb({ start, end }, ...args);
        return res;
    };
    return wrapped;
};
