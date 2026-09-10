"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function LanguageToggle({
  variant = "desktop",
  className = ""
}: {
  variant?: "desktop" | "mobile";
  className?: string;
}) {
  const { language, setLanguage } = useLanguage();

  if (variant === "mobile") {
    return (
      <div
        className={`flex items-center justify-between rounded-2xl border border-slate-200/90 bg-slate-50/90 p-2 ${className}`}
        role="group"
        aria-label="Language Selector"
      >
        <div className="flex items-center gap-2 pl-2 text-xs font-bold text-slate-700">
          <Globe className="size-4 text-blue" />
          <span>Language / ভাষা</span>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/60 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              language === "en"
                ? "bg-ink text-white shadow-xs scale-100"
                : "text-slate-600 hover:text-ink hover:bg-slate-100"
            }`}
          >
            English
          </button>
          <span className="text-slate-300 text-xs select-none">|</span>
          <button
            type="button"
            onClick={() => setLanguage("bn")}
            aria-pressed={language === "bn"}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              language === "bn"
                ? "bg-ink text-white shadow-xs scale-100"
                : "text-slate-600 hover:text-ink hover:bg-slate-100"
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-[#e4dfd5] bg-[#faf8f5] p-1 shadow-2xs transition-colors hover:border-[#d6cebf] ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        className={`relative inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
          language === "en"
            ? "bg-ink text-white shadow-xs scale-100"
            : "text-[#5b5b5b] hover:text-ink hover:bg-black/5"
        }`}
      >
        English
      </button>

      <span className="px-0.5 text-xs text-[#b8b2a7] select-none font-light">|</span>

      <button
        type="button"
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        aria-label="Switch to Bangla"
        className={`relative inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
          language === "bn"
            ? "bg-ink text-white shadow-xs scale-100"
            : "text-[#5b5b5b] hover:text-ink hover:bg-black/5"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
