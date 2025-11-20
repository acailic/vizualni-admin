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

import { messages as catalogEn } from "./en/messages";
import { messages as catalogSrCyrl } from "./sr-Cyrl/messages";
import { messages as catalogSrLatn } from "./sr-Latn/messages";

export type Locale = (typeof locales)[number];

export { defaultLocale, locales };
export { i18n };

i18n.loadLocaleData({
  "sr-Latn": { plurals: pluralsSr },
  "sr-Cyrl": { plurals: pluralsSr },
  en: { plurals: pluralsEn },
});
i18n.load({
  "sr-Latn": catalogSrLatn,
  "sr-Cyrl": catalogSrCyrl,
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
  const result = /^(sr-Latn|sr-Cyrl|en)/.exec(localeString);
  return result ? (result[1] as Locale) : defaultLocale;
};

// Below constants are extracted from d3-time-format/locale.
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

// Serbian Latin time format
const timeFormatSrLatn = {
  dateTime: "%A, %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "nedelja",
    "ponedeljak",
    "utorak",
    "sreda",
    "četvrtak",
    "petak",
    "subota",
  ],
  shortDays: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"],
  months: [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ],
  shortMonths: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "avg",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
};

// Serbian Cyrillic time format
const timeFormatSrCyrl = {
  dateTime: "%A, %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "недеља",
    "понедељак",
    "уторак",
    "среда",
    "четвртак",
    "петак",
    "субота",
  ],
  shortDays: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
  months: [
    "јануар",
    "фебруар",
    "март",
    "април",
    "мај",
    "јун",
    "јул",
    "август",
    "септембар",
    "октобар",
    "новембар",
    "децембар",
  ],
  shortMonths: [
    "јан",
    "феб",
    "мар",
    "апр",
    "мај",
    "јун",
    "јул",
    "авг",
    "сеп",
    "окт",
    "нов",
    "дец",
  ],
};

const d3TimeFormatLocales: { [locale: string]: TimeLocaleObject } = {
  "sr-Latn": timeFormatLocale(timeFormatSrLatn as TimeLocaleDefinition),
  "sr-Cyrl": timeFormatLocale(timeFormatSrCyrl as TimeLocaleDefinition),
  en: timeFormatLocale(timeFormatEn as TimeLocaleDefinition),
};

export const getD3TimeFormatLocale = (locale: string): TimeLocaleObject =>
  d3TimeFormatLocales[locale] ?? d3TimeFormatLocales["sr-Latn"];

const numberFormatSr = {
  decimal: ",",
  thousands: ".",
  grouping: [3],
  currency: ["", "\u00a0RSD"],
};

const numberFormatEn = {
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
};

const d3FormatLocales: { [locale: string]: FormatLocaleObject } = {
  "sr-Latn": formatLocale(numberFormatSr as FormatLocaleDefinition),
  "sr-Cyrl": formatLocale(numberFormatSr as FormatLocaleDefinition),
  en: formatLocale(numberFormatEn as FormatLocaleDefinition),
};

export const getD3FormatLocale = (): FormatLocaleObject => d3FormatLocales["sr-Latn"];
