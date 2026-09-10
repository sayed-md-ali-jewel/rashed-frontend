"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import {
  type Language,
  type LocalizedString,
  translations,
  toBengaliNumerals,
  formatLocalizedNumber,
  formatLocalizedCurrency,
  resolveCMS,
  translateDynamicString
} from "@/lib/i18n/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: Record<string, string | number>, defaultText?: string) => string;
  translate: (field: LocalizedString | any, fallback?: string) => string;
  formatNumber: (val: number | string) => string;
  formatCurrency: (amount: number | string) => string;
  isBn: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "site_lang";

function applyDocumentLanguage(lang: Language) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = lang;
  root.setAttribute("data-lang", lang);
  if (lang === "bn") {
    root.classList.add("lang-bn");
    root.classList.remove("lang-en");
  } else {
    root.classList.add("lang-en");
    root.classList.remove("lang-bn");
  }
}

function persistLanguageCookie(lang: Language) {
  if (typeof document === "undefined") return;
  document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLanguage = "bn"
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "en" || stored === "bn") {
        setLanguageState(stored);
        applyDocumentLanguage(stored);
        persistLanguageCookie(stored);
      } else {
        setLanguageState(initialLanguage);
        applyDocumentLanguage(initialLanguage);
        persistLanguageCookie(initialLanguage);
      }
    } catch {
      applyDocumentLanguage(initialLanguage);
      persistLanguageCookie(initialLanguage);
    }
  }, [initialLanguage]);

  function setLanguage(lang: Language) {
    startTransition(() => {
      setLanguageState(lang);
    });
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    persistLanguageCookie(lang);
    applyDocumentLanguage(lang);
  }

  function toggleLanguage() {
    setLanguage(language === "en" ? "bn" : "en");
  }

  function t(
    key: string,
    replacements?: Record<string, string | number>,
    defaultText?: string
  ): string {
    const langDict = translations[language] as Record<string, string>;
    const fallbackDict = (language === "bn" ? translations.bn : translations.en) as Record<string, string>;
    let text = langDict[key] ?? fallbackDict[key] ?? defaultText ?? key;

    if (replacements && typeof text === "string") {
      Object.entries(replacements).forEach(([k, v]) => {
        const replacementVal =
          language === "bn" && typeof v === "number"
            ? toBengaliNumerals(v)
            : String(v);
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), replacementVal);
      });
    }

    return text;
  }

  function translate(field: LocalizedString | any, fallback = ""): string {
    if (field === null || field === undefined) return fallback;
    if (typeof field === "object" && ("en" in field || "bn" in field)) {
      return resolveCMS<string>(field, language, fallback);
    }
    if (typeof field === "string") {
      if (language === "bn") {
        return translateDynamicString(field, language);
      }
      return field;
    }
    return String(field);
  }

  function formatNumber(val: number | string): string {
    return formatLocalizedNumber(val, language);
  }

  function formatCurrency(amount: number | string): string {
    return formatLocalizedCurrency(amount, language);
  }

  const isBn = language === "bn";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translate,
        formatNumber,
        formatCurrency,
        isBn
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe dummy context if rendered outside provider
    return {
      language: "bn" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, _replacements?: any, defaultText?: string) => defaultText || key,
      translate: (field: any, fallback = "") => (typeof field === "string" ? field : fallback),
      formatNumber: (val: any) => toBengaliNumerals(val),
      formatCurrency: (amount: any) => `৳${toBengaliNumerals(amount)}`,
      isBn: true
    };
  }
  return context;
}
