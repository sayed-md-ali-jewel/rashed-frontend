"use client";

import Link from "next/link";
import { AlertCircle, CalendarClock, Clock3, MapPinned, Sparkles, Wallet } from "lucide-react";
import { SocialShare } from "@/components/seo/social-share";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { Schedule, WebsiteSetting } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { isScheduleActive, isScheduleExpired } from "@/lib/booking";
import { useLanguage } from "@/context/language-context";
import { formatLocalizedTime } from "@/lib/i18n/translations";

export function ScheduleDetailsView({
  schedule,
  websiteSetting
}: {
  schedule: Schedule;
  websiteSetting: WebsiteSetting;
}) {
  const { t, translate, formatCurrency, language } = useLanguage();

  const isExpired = isScheduleExpired(schedule);
  const isActive = isScheduleActive(schedule);

  const displayTitle = translate(schedule.title || schedule.hospital?.name) || "Consultation Schedule";
  const hospitalName = schedule.hospital?.name ? translate(schedule.hospital.name) : undefined;
  const hospitalAddress = translate(schedule.hospital?.address) || "Clinic Address";
  const badgeText = websiteSetting.content?.scheduleDetailBadge
    ? translate(websiteSetting.content.scheduleDetailBadge)
    : t("schedulePage.chamberDetailsBadge");
  const shareLabel = websiteSetting.content?.shareScheduleLabel
    ? translate(websiteSetting.content.shareScheduleLabel)
    : t("schedulePage.shareSchedule");

  const formattedDate = formatLocalizedTime(formatDateTime(schedule.startsAt), language);
  const formattedInterval = t("schedule.slotIntervalMinutes", { mins: schedule.slotDurationMinutes || 10 });
  const formattedFee = formatCurrency(schedule.fee);

  return (
    <section>
      <Breadcrumbs
        items={[
          { label: t("schedulePage.breadcrumbsSchedules"), href: "/#schedules" },
          { label: displayTitle }
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
          <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
          {badgeText}
        </div>

        {isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="h-3 w-3" />
            {t("schedule.activeNow")}
          </span>
        ) : null}

        {isExpired ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-700">
            <AlertCircle className="h-3 w-3" />
            {t("schedule.sessionExpired")}
          </span>
        ) : null}
      </div>

      {isExpired && (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-50/80 p-4 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <p className="font-bold">⚠️ {t("schedule.sessionExpired")}</p>
            <p className="text-xs text-amber-800 mt-0.5">
              This chamber consultation session has passed. Please browse our upcoming sessions to book a live serial.
            </p>
          </div>
          <Link
            href="/#schedules"
            className="inline-flex items-center gap-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl whitespace-nowrap"
          >
            <span>{t("schedule.bookNextSession")}</span>
            <span>&rarr;</span>
          </Link>
        </div>
      )}

      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[44px]">
        {displayTitle}
      </h1>

      {hospitalName && displayTitle !== hospitalName ? (
        <p className="mt-2 text-lg font-bold text-blue">{hospitalName}</p>
      ) : null}

      <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-muted">
        <MapPinned className="mt-1 h-5 w-5 shrink-0 text-ink" />
        <span>{hospitalAddress}</span>
      </p>

      <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        {[
          { icon: CalendarClock, label: t("schedulePage.sessionStarts"), value: formattedDate },
          { icon: Clock3, label: t("schedulePage.slotInterval"), value: formattedInterval },
          { icon: Wallet, label: t("schedulePage.consultationFee"), value: formattedFee }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
              <span className="grid size-10 place-items-center rounded-full bg-panel text-ink border border-line">
                <Icon className="h-5 w-5 text-blue" />
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{item.label}</p>
              <p className="mt-1 font-bold text-ink text-base">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
          {shareLabel}
        </p>
        <SocialShare title={schedule.seo?.seoTitle || displayTitle} path={`/schedules/${schedule.slug}`} />
      </div>

      {schedule.hospital?.mapUrl ? (
        <div className="mt-8 overflow-hidden rounded-3xl border border-line shadow-sm">
          <iframe
            title={`${hospitalName || "Clinic"} map`}
            src={schedule.hospital.mapUrl}
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
      ) : null}
    </section>
  );
}
