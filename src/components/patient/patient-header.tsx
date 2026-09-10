"use client";

import { Phone } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { useLanguage } from "@/context/language-context";
import type { PatientSession } from "@/components/patient/patient-portal-view";

export function PatientHeader({ patient }: { patient: PatientSession }) {
  const { t, translate } = useLanguage();

  const patientName = translate(patient.fullName) || patient.fullName;

  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end mb-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm mb-3">
          <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
          {t("portal.badge")}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {t("portal.welcome", { name: patientName })}
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
          <Phone className="h-4 w-4 text-blue" />
          <span>{patient.mobileNumber || t("portal.mobileRegistered")}</span>
        </p>
      </div>
      <LogoutButton mode="patient" />
    </div>
  );
}
