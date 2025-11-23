import { useCallback, useState } from "react";
export const useDisclosure = (initialState) => {
    const [isOpen, setOpen] = useState(initialState !== null && initialState !== void 0 ? initialState : false);
    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);
    return {
        isOpen,
        close,
        open,
        setOpen,
    };
};
