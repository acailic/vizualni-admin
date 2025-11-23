import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { useEffect, useState } from "react";
const localeImportMap = {
    en: "en-GB",
    "sr-Latn": "sr-Latn",
    "sr-Cyrl": "sr",
};
export const AsyncLocalizationProvider = (props) => {
    const { locale, children } = props;
    const [dateFnsLocale, setDateFnsLocale] = useState();
    useEffect(() => {
        const run = async () => {
            const importKey = localeImportMap[locale];
            if (!importKey) {
                console.warn(`Missing date-fns locale for "${locale}", falling back to en-GB.`);
                const fallback = await import("date-fns/locale/en-GB");
                setDateFnsLocale(fallback.default);
                return;
            }
            const importedLocale = await import(`date-fns/locale/${importKey}/index.js`);
            setDateFnsLocale(importedLocale.default);
        };
        run();
    }, [locale]);
    if (!dateFnsLocale) {
        return null;
    }
    return (<LocalizationProvider dateAdapter={DateAdapter} locale={dateFnsLocale}>
      {children}
    </LocalizationProvider>);
};
