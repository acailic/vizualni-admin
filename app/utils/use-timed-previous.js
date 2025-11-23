import { useEffect, useState } from "react";
export const useTimedPrevious = (value, duration) => {
    const [previousValue, setPreviousValue] = useState(value);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPreviousValue(value);
        }, duration);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, duration]);
    return previousValue;
};
