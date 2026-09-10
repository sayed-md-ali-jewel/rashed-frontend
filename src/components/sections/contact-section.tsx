"use client";

import { useLanguage } from "@/context/language-context";
import type { WebsiteSetting } from "@/lib/types";

function phoneHref(phone?: string) {
  const value = phone?.replace(/[^\d+]/g, "");
  return value ? `tel:${value}` : undefined;
}

export function ContactSection({
  clinics,
  content,
  defaultClinic
}: {
  clinics: Array<{ name: string; address?: string; phone?: string }>;
  content?: WebsiteSetting["content"];
  defaultClinic?: { name: string; address?: string; phone?: string };
}) {
  const { t, translate } = useLanguage();

  const displayClinics = clinics.length > 0 ? clinics : [defaultClinic || { name: "Medical Chamber", address: "Dhaka, Bangladesh" }];
  const badgeText = content?.contactBadge ? translate(content.contactBadge) : t("contact.badge");
  const titleText = content?.contactTitle ? translate(content.contactTitle) : t("contact.title");
  const descText = t("contact.description");

  return (
    <section id="contact" className="bg-cream py-16 lg:py-20 border-t border-line">
      <div className="mx-auto max-w-[1340px] px-6">
        <div className="rounded-3xl border border-line bg-white p-8 md:p-12 shadow-md">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-1 text-xs font-semibold text-ink">
            <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
            {badgeText}
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-ink md:text-3xl">
            {titleText}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {descText}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayClinics.map((clinic, cIdx) => {
              const phone = clinic.phone;
              const href = phoneHref(phone);

              return (
                <div
                  key={`${clinic.name}-${clinic.address || cIdx}`}
                  className="rounded-2xl border border-line bg-panel p-6 shadow-sm transition hover:bg-white hover:shadow-md duration-200"
                >
                  <h3 className="text-lg font-bold text-ink">{translate(clinic.name)}</h3>
                  <div className="mt-3 space-y-2 text-sm text-[#474747]">
                    <p>{translate(clinic.address)}</p>
                    {href ? (
                      <a href={href} className="inline-block font-semibold text-blue transition hover:underline">
                        {phone}
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
