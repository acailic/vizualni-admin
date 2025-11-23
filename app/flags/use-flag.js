import { useEffect, useState } from "react";
import { flag } from "@/flags/flag";
export const useFlag = (name) => {
    const [flagValue, setFlag] = useState(() => flag(name));
    useEffect(() => {
        const handleChange = (changed) => {
            if (changed === name) {
                setFlag(flag(name));
            }
        };
        flag.store.ee.on("change", handleChange);
        return () => {
            flag.store.removeListener("change", handleChange);
        };
    }, [setFlag, name]);
    return flagValue;
};
export const useFlags = () => {
    const [flags, setFlags] = useState(() => {
        flag.removeDeprecated();
        return flag.list();
    });
    useEffect(() => {
        const handleChange = () => {
            setFlags(flag.list());
        };
        flag.store.ee.on("change", handleChange);
        return () => {
            flag.store.removeListener("change", handleChange);
        };
    }, [setFlags]);
    return flags;
};
