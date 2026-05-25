"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import engTranslations from "../public/locales/eng/translation.json";
import amhTranslations from "../public/locales/amh/translation.json";
import { getLanguage } from "./i18n";

// We tie the initial language to the legacy getLanguage() sync strategy
// or fallback to eng if none is found.
const defaultLanguage = getLanguage() === "am" ? "amh" : "eng";

i18n.use(initReactI18next).init({
  resources: {
    eng: { translation: engTranslations },
    amh: { translation: amhTranslations },
  },
  lng: defaultLanguage,
  fallbackLng: "eng",
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

// Setup a listener to sync the new language with the old legacy implementation storage.
i18n.on("languageChanged", (lng) => {
  const legacyLng = lng === "amh" ? "am" : "en";
  if (typeof window !== "undefined") {
    localStorage.setItem("lang_pref", legacyLng);
    // document.documentElement.lang = legacyLng; // Optional: change html lang attribute if needed
  }
});

export default i18n;
