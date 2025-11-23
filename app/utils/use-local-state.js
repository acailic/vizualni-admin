import { useCallback, useEffect, useState } from "react";
export const useLocalState = (key, initialValue) => {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    const updateState = useCallback((value) => {
        setState(value);
    }, []);
    return [state, updateState];
};
