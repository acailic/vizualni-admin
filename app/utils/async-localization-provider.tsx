import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { PropsWithChildren, useEffect, useState } from "react";

import { Locale } from "@/locales/locales";

const localeImportMap: Record<Locale, string> = {
  en: "en-GB",
  "sr-Latn": "sr-Latn",
  "sr-Cyrl": "sr",
};

type AsyncLocalizationProviderProps = {
  locale: Locale;
};

export const AsyncLocalizationProvider = (
  props: PropsWithChildren<AsyncLocalizationProviderProps>
) => {
  const { locale, children } = props;
  const [dateFnsLocale, setDateFnsLocale] = useState<object>();

  useEffect(() => {
    const run = async () => {
      const importKey = localeImportMap[locale];

      if (!importKey) {
        console.warn(`Missing date-fns locale for "${locale}", falling back to en-GB.`);
        const fallback = await import("date-fns/locale/en-GB");
        setDateFnsLocale(fallback.default);
        return;
      }

      const importedLocale = await import(
        `date-fns/locale/${importKey}/index.js`
      );
      setDateFnsLocale(importedLocale.default);
    };

    run();
  }, [locale]);

  if (!dateFnsLocale) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter} locale={dateFnsLocale}>
      {children}
    </LocalizationProvider>
  );
};
