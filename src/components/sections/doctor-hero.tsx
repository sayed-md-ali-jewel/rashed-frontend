"use client";

import Link from "next/link";
import { Award, Clock3, Heart, Medal, UsersRound } from "lucide-react";
import type { Doctor, WebsiteSetting } from "@/lib/types";
import { safeImageSrc } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const statKeyMap: Record<string, string> = {
  "Patients Served": "hero.stat.patientsServed",
  "Years Experience": "hero.stat.yearsExperience",
  "Success Rate": "hero.stat.successRate",
  "Emergency Care": "hero.stat.emergencyCare"
};

export function DoctorHero({
  doctor,
  content
}: {
  doctor: Doctor;
  content: WebsiteSetting["content"];
}) {
  const { t, translate, formatNumber } = useLanguage();
  const statIcons = [UsersRound, Medal, Heart, Clock3];
  const heroImage = safeImageSrc(doctor.image);

  const doctorName = translate(doctor.name) || "Dr. Md. Rashedul Alam";
  const designation = translate(doctor.designation) || "Senior Consultant";
  const specialization = translate(doctor.specialization) || "Internal Medicine";
  const heroBadge = doctor.heroBadge ? translate(doctor.heroBadge) : t("hero.badge");
  const heroIntro = translate(doctor.heroIntro);
  const heroPrimaryCta = content?.heroPrimaryCta ? translate(content.heroPrimaryCta) : t("hero.primaryCta");
  const heroSecondaryCta = content?.heroSecondaryCta ? translate(content.heroSecondaryCta) : t("hero.secondaryCta");
  const careTitle = doctor.heroCareTitle ? translate(doctor.heroCareTitle) : t("hero.careTitle");
  const careDescription = doctor.heroCareDescription ? translate(doctor.heroCareDescription) : t("hero.careDescription");

  const heroStats = Array.isArray(doctor.heroStats) && doctor.heroStats.length > 0
    ? doctor.heroStats
    : [
        { label: "Patients Served", value: "5000+" },
        { label: "Years Experience", value: "15+" },
        { label: "Success Rate", value: "98%" },
        { label: "Emergency Care", value: "24/7" }
      ];

  return (
    <section id="profile" className="bg-cream py-10 sm:py-14 lg:py-20 border-b border-line">
      <div className="mx-auto grid max-w-[1340px] items-center gap-10 sm:gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Text and Actions Section (Below Image on Mobile, Left on Desktop) */}
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <span className="grid size-4 place-items-center rounded-full bg-blue text-[9px] text-white">✓</span>
            {heroBadge}
          </div>

          <h1 className="mt-4 sm:mt-5 text-[30px] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[42px] lg:text-[52px]">
            {doctorName}
          </h1>

          <p className="mt-2.5 sm:mt-3 text-base sm:text-lg font-semibold text-blue">
            {designation} &middot; {specialization}
          </p>

          <p className="mt-4 sm:mt-5 max-w-xl text-[15px] leading-relaxed text-[#3c3c3c] sm:text-[17px]">
            {heroIntro}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-ink shadow-sm transition hover:bg-gold-dark hover:-translate-y-0.5"
            >
              {heroPrimaryCta}
              <span className="grid size-6 place-items-center rounded-full bg-ink">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-6 py-4 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
            >
              {heroSecondaryCta}
            </Link>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            {heroStats.map((stat, index) => {
              const Icon = statIcons[index % statIcons.length] ?? Award;
              const translatedLabel = statKeyMap[stat.label] ? t(statKeyMap[stat.label]) : translate(stat.label);
              return (
                <div key={stat.label || index} className="rounded-2xl border border-line bg-white p-4 shadow-sm text-center transition hover:-translate-y-0.5">
                  <span className="mx-auto grid size-9 place-items-center rounded-full bg-panel text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-lg sm:text-xl font-extrabold text-ink">{formatNumber(stat.value)}</p>
                  <p className="mt-0.5 text-xs font-medium text-muted">{translatedLabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Image Section (First on Mobile, Right on Desktop) */}
        <div className="relative mx-auto w-full max-w-[460px] order-1 lg:order-2 mb-6 sm:mb-8 lg:mb-0">
          <div className="relative aspect-[0.9] overflow-hidden rounded-3xl border border-line bg-white shadow-md">
            <img
              src={heroImage}
              alt={doctorName}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-line bg-white/95 p-5 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue text-white shadow-sm">
                <Heart className="h-6 w-6 fill-current" />
              </span>
              <div>
                <p className="text-base font-extrabold text-ink">{careTitle}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{careDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
