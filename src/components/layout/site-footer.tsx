"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import type { WebsiteSetting } from "@/lib/types";
import { safeImageSrc } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const navLinksConfig = [
  { key: "footer.home", href: "/" },
  { key: "footer.schedules", href: "/#schedules" },
  { key: "footer.about", href: "/#profile" },
  { key: "footer.services", href: "/#services" },
  { key: "footer.reviews", href: "/#reviews" },
  { key: "footer.gallery", href: "/#gallery" },
] as const;

export function SiteFooter({ setting }: { setting: WebsiteSetting }) {
  const pathname = usePathname();
  const { t, translate, formatNumber } = useLanguage();

  const socials = [
    { label: "Facebook", icon: Facebook, href: setting.facebookUrl },
    { label: "Twitter / X", icon: Twitter, href: setting.xUrl },
    { label: "LinkedIn", icon: Linkedin, href: setting.linkedinUrl },
    { label: "Telegram", icon: Send, href: setting.telegramUrl },
  ].filter((social) => social.href);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const siteTitle = translate(setting.siteName || "Dr. Rashed");
  const footerDesc =
    translate(setting.footerDescription) ||
    "Dedicated clinical healthcare and patient-first medical practice with modern scheduling and seamless serial appointment management.";

  return (
    <footer className="bg-black pt-16 pb-12 text-white">
      <div className="mx-auto max-w-[1340px] px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              {setting.logoDark || setting.logo ? (
                <img
                  src={safeImageSrc(setting.logoDark || setting.logo)}
                  alt={siteTitle}
                  className="h-10 w-auto max-w-[190px] object-contain brightness-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <>
                  <span className="grid size-11 place-items-center rounded-xl bg-blue text-white font-black text-xl shadow-sm">
                    R
                  </span>
                  <div>
                    <span className="block text-xl font-black tracking-tight text-white">
                      {siteTitle}
                    </span>
                    <span className="block text-xs text-[#bdbdbd]">
                      {t("footer.consultantSpecialist")}
                    </span>
                  </div>
                </>
              )}
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#bdbdbd]">
              {footerDesc}
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-11 place-items-center rounded-full border border-[#4a4a4a] text-white transition hover:border-white hover:bg-white/10"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white">
              {t("footer.quickNav")}
            </h4>
            <ul className="space-y-2.5 text-[15px] text-[#bdbdbd]">
              {navLinksConfig.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white">
              {t("footer.contactChambers")}
            </h4>
            <div className="space-y-3 text-sm text-[#bdbdbd]">
              {setting.contactPhone ? (
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue shrink-0" />
                  <span>{setting.contactPhone}</span>
                </p>
              ) : null}
              {setting.contactEmail ? (
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue shrink-0" />
                  <span>{setting.contactEmail}</span>
                </p>
              ) : null}
              {setting.contactAddress ? (
                <p className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue shrink-0 mt-0.5" />
                  <span>{translate(setting.contactAddress)}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2.5 rounded-full bg-gold px-6 py-3 text-xs font-semibold text-ink transition hover:bg-gold-dark"
              >
                {t("footer.bookOnline")}
                <span className="grid size-5 place-items-center rounded-full bg-ink text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="#fff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#242424] pt-6 text-xs text-[#bdbdbd]">
          <span>
            {t("footer.rightsReserved", {
              year: formatNumber(new Date().getFullYear()),
              siteName: siteTitle
            })}
          </span>
          <span>{t("footer.designedWith")}</span>
        </div>
      </div>
    </footer>
  );
}
