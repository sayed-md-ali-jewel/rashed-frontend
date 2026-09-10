"use client";

import { useLanguage } from "@/context/language-context";

export function PatientLoginHero() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm mb-6">
        <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
        {t("auth.patientBadge")}
      </div>
      <h1 className="text-3xl font-extrabold leading-tight text-ink md:text-5xl">
        {t("auth.patientLoginTitle")}
      </h1>
      <p className="mt-4 text-xl font-semibold text-blue">
        {t("auth.patientSubtitle")}
      </p>
      <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[#3c3c3c]">
        {t("auth.patientDesc")}
      </p>
    </div>
  );
}
