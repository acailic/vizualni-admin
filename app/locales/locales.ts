// If translations get too big, we should load them dynamically. But for now it's fine.
// Use the same number format in each language
import { i18n } from "@lingui/core";
import {
  formatLocale,
  FormatLocaleDefinition,
  FormatLocaleObject,
} from "d3-format";
import {
  timeFormatLocale,
  TimeLocaleDefinition,
  TimeLocaleObject,
} from "d3-time-format";
import {
  en as pluralsEn,
  sr as pluralsSr,
} from "make-plural/plurals";

import { defaultLocale, locales } from "@/locales/constants";

import { messages as catalogSr } from "./sr/messages";
import { messages as catalogEn } from "./en/messages";

export type Locale = (typeof locales)[number];

export { defaultLocale, locales };
export { i18n };

i18n.loadLocaleData({
  sr: { plurals: pluralsSr },
  en: { plurals: pluralsEn },
});
i18n.load({
  sr: catalogSr,
  en: catalogEn,
});
i18n.activate(defaultLocale);

/**
 * Parses a valid app locale from a locale string (e.g. a Accept-Language header).
 * If unparseable, returns default locale.
 * @param localeString locale string, e.g. sr,en-US;q=0.7,en;q=0.3
 */
export const parseLocaleString = (
  localeString: string | null | undefined
): Locale => {
  if (localeString == null) {
    return defaultLocale;
  }
  const result = /^(sr|en)/.exec(localeString);
  return result ? (result[1] as Locale) : defaultLocale;
};

// Below constants are extracted from d3-time-format/locale.
const timeFormatSr = {
  dateTime: "%A, %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Nedelja",
    "Ponedeljak",
    "Utorak",
    "Sreda",
    "Četvrtak",
    "Petak",
    "Subota",
  ],
  shortDays: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
  months: [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "Avgust",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Maj",
    "Jun",
    "Jul",
    "Avg",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ],
};

const timeFormatEn = {
  dateTime: "%a %e %b %X %Y",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const d3TimeFormatLocales: { [locale: string]: TimeLocaleObject } = {
  sr: timeFormatLocale(timeFormatSr as TimeLocaleDefinition),
  en: timeFormatLocale(timeFormatEn as TimeLocaleDefinition),
};

export const getD3TimeFormatLocale = (locale: string): TimeLocaleObject =>
  d3TimeFormatLocales[locale] ?? d3TimeFormatLocales.sr;

const numberFormatRs = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\u00a0RSD"],
};

const d3FormatLocales: { [locale: string]: FormatLocaleObject } = {
  sr: formatLocale(numberFormatRs as FormatLocaleDefinition),
  en: formatLocale(numberFormatRs as FormatLocaleDefinition),
};

export const getD3FormatLocale = (): FormatLocaleObject => d3FormatLocales.sr;
