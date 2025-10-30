import type { SupportedLanguage, Translation } from "./types";
import { de } from "./translations/de";
import { en } from "./translations/en";
import { es } from "./translations/es";
import { fr } from "./translations/fr";

export const translations: Record<SupportedLanguage, Translation> = {
  en,
  es,
  fr,
  de,
};

export const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export * from "./types";
