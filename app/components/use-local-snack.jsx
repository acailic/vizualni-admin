import { useCallback, useEffect, useRef, useState } from "react";
/**
 * Holds a temporary snack state
 */
export const useLocalSnack = () => {
    const timeoutRef = useRef();
    const [snack, setSnack] = useState(undefined);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return [
        snack,
        useCallback(function enqueue(snack) {
            setSnack(snack);
            if (snack) {
                timeoutRef.current = setTimeout(() => {
                    setSnack(undefined);
                }, snack.duration || 5000);
            }
        }, []),
        useCallback(function dismiss() {
            setSnack(undefined);
        }, []),
    ];
};
