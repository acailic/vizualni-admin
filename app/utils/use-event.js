import { useLayoutEffect, useMemo, useRef } from "react";
/**
 * Used for event handlers.
 * Like useCallback but no need to specify dependencies.
 * The result is stable.
 * Can be replaced by React's own useEvent if/when it gets implemented.
 *
 * @see https://github.com/reactjs/rfcs/pull/220
 */
export const useEvent = (fn) => {
    const ref = useRef(fn);
    useLayoutEffect(() => {
        ref.current = fn;
    });
    return useMemo(() => (...args) => {
        const { current } = ref;
        return current(...args);
    }, []);
};
