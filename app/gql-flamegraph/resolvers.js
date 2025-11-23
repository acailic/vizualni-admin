import { timed } from "@/utils/timed";
const getPathFromInfo = (info) => {
    const path = [];
    let cur = info.path;
    while (cur) {
        path.push(cur);
        cur = cur.prev;
    }
    path.reverse();
    return path;
};
const setTimingInContext = (ctx, path, timing) => {
    ctx.timings = ctx.timings || { children: {} };
    let cur = ctx.timings;
    for (let i = 0; i < path.length; i++) {
        const item = path[i];
        cur.children[item.key] = cur.children[item.key] || { children: {} };
        cur = cur.children[item.key];
    }
    Object.assign(cur, timing);
};
/**
 * Modifies in place the resolvers so that they console log their
 * duration if it exceeds threshold.
 */
export const setupFlamegraph = (resolvers) => {
    for (const [, typeResolvers] of Object.entries(resolvers)) {
        if (typeof typeResolvers === "object") {
            for (const [field, fieldResolver] of Object.entries(typeResolvers)) {
                if (typeof fieldResolver === "function" &&
                    fieldResolver.constructor.name === "AsyncFunction") {
                    typeResolvers[field] = timed(fieldResolver, (timing, ...resolverArgs) => {
                        const [, , context, info] = resolverArgs;
                        const path = info
                            ? getPathFromInfo(info)
                            : [];
                        setTimingInContext(context, path, timing);
                    });
                }
            }
        }
    }
};
