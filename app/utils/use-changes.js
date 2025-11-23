import { useMemo, useRef } from "react";
const empty = [];
export const useChanges = (currentValue, computeChanges) => {
    const prevRef = useRef();
    const prevValue = prevRef.current;
    if (!prevValue) {
        prevRef.current = currentValue;
    }
    const changes = useMemo(() => prevValue !== currentValue
        ? computeChanges(prevRef.current, currentValue)
        : empty, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [computeChanges, prevRef.current, currentValue]);
    prevRef.current = currentValue;
    return changes;
};
