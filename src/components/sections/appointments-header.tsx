"use client";

import { useLanguage } from "@/context/language-context";
import type { WebsiteSetting } from "@/lib/types";

export function AppointmentsHeader({ content }: { content?: WebsiteSetting["content"] }) {
  const { t, translate } = useLanguage();

  const badgeText = content?.appointmentsBadge ? translate(content.appointmentsBadge) : t("appointmentsPage.badge");
  const titleText = content?.appointmentsTitle ? translate(content.appointmentsTitle) : t("appointmentsPage.title");
  const descText = content?.appointmentsDescription ? translate(content.appointmentsDescription) : t("appointmentsPage.description");

  return (
    <section className="mx-auto max-w-[1340px] px-6 pt-14 pb-4">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
        <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
        {badgeText}
      </div>
      <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[48px]">
        {titleText}
      </h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
        {descText}
      </p>
    </section>
  );
}
