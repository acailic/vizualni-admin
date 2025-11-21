import { Locale } from "@/locales/locales";

export type LocalizedString = Record<Locale, string>;

type LegacyLocaleKey = Locale | "de" | "fr" | "it";
type LocaleStringInput = Partial<Record<LegacyLocaleKey, string>>;

const resolveFallback = (input: LocaleStringInput): string => {
  return (
    input["sr-Latn"] ??
    input["sr-Cyrl"] ??
    input.en ??
    input.de ??
    input.fr ??
    input.it ??
    ""
  );
};

export const createLocalizedString = (
  input: LocaleStringInput = {}
): LocalizedString => {
  const fallback = resolveFallback(input);

  return {
    "sr-Latn": input["sr-Latn"] ?? fallback,
    "sr-Cyrl": input["sr-Cyrl"] ?? fallback,
    en: input.en ?? fallback,
  };
};

export type MetaInput = {
  title?: LocaleStringInput;
  description?: LocaleStringInput;
  label?: LocaleStringInput;
};

export const createMeta = (input: MetaInput = {}) => ({
  title: createLocalizedString(input.title),
  description: createLocalizedString(input.description),
  label: createLocalizedString(input.label),
});
