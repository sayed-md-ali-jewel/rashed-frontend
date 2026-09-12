"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  CalendarDays,
  HeartPulse,
  Home,
  Menu,
  MessageSquare,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { WebsiteSetting } from "@/lib/types";
import { safeImageSrc } from "@/lib/utils";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { useLanguage } from "@/context/language-context";
import { useChat } from "@/context/chat-context";

const navConfig = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/#schedules", key: "nav.schedules", icon: CalendarDays },
  { href: "/#profile", key: "nav.about", icon: UserRound },
  { href: "/#services", key: "nav.services", icon: Activity },
  { href: "/blog", key: "nav.blog", icon: BookOpen },
  { href: "/#reviews", key: "nav.reviews", icon: Star },
  { href: "/#contact", key: "nav.contact", icon: HeartPulse },
] as const;

export function SiteHeader({ setting }: { setting: WebsiteSetting }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, translate } = useLanguage();
  const {
    isPatientLoggedIn,
    userName,
    userPhone,
    activeConversation,
    openChatWithDoctor,
    enablePatientChat
  } = useChat();

  const isEffectivePatientLoggedIn = Boolean(isPatientLoggedIn && userPhone && !pathname.startsWith("/patient/login"));
  const patientDisplayName = isEffectivePatientLoggedIn ? (userName || activeConversation?.patientName) : undefined;

  // Close menu when pathname changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const siteTitle = translate(setting.siteName || "Dr. Rashed");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#f1efea] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            {setting.logo ? (
              <img
                src={safeImageSrc(setting.logo)}
                alt={siteTitle}
                className="h-10 w-auto max-w-[180px] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue text-white font-black text-lg shadow-sm">
                  R
                </span>
                <div className="shrink-0">
                  <span className="block text-[18px] font-black tracking-tight text-ink whitespace-nowrap">
                    {siteTitle}
                  </span>
                  <span className="block text-[11px] font-medium text-muted whitespace-nowrap">
                    {t("nav.specialistPhysician")}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-4 lg:gap-5 xl:gap-7 text-[15px] font-medium text-[#2a2a2a] lg:flex">
            {navConfig.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="whitespace-nowrap transition hover:text-ink hover:font-semibold"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Actions: Language Toggle + Patient Actions + Book Appointment */}
          <div className="hidden shrink-0 items-center gap-2.5 xl:gap-3 lg:flex">
            <LanguageToggle variant="desktop" />

            {/* When Logged In: Show Patient Name + Chat with Doctor */}
            {isEffectivePatientLoggedIn ? (
              <>
                <Link href="/patient" className="shrink-0" title={patientDisplayName || "Patient Portal"}>
                  <button className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold xl:text-sm xl:px-4 border border-teal-600/30 bg-teal-50/90 text-teal-950 transition hover:bg-teal-100 hover:border-teal-600/50 cursor-pointer shadow-xs">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-700 to-emerald-500 font-bold text-xs text-white shadow-xs leading-none">
                      {patientDisplayName ? patientDisplayName.trim().charAt(0).toUpperCase() : <UserRound className="size-3.5 text-white" />}
                    </span>
                    <span className="max-w-[120px] xl:max-w-[160px] truncate capitalize">{patientDisplayName || t("nav.patientPortal")}</span>
                  </button>
                </Link>

                {enablePatientChat !== false && (
                  <button
                    type="button"
                    onClick={openChatWithDoctor}
                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-bold xl:text-sm xl:px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white transition hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    title={t("chat.withDoctor")}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 fill-white" />
                    <span>{t("chat.withDoctor")}</span>
                  </button>
                )}
              </>
            ) : (
              /* When Logged Out: Show ONLY Patient Portal (No user name, No Chat with Doctor) */
              <Link href="/patient" className="shrink-0">
                <button className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-semibold xl:text-sm xl:px-4.5 border-[1.5px] border-ink text-ink transition hover:bg-ink hover:text-white cursor-pointer">
                  <UserRound className="h-4 w-4 shrink-0" />
                  {t("nav.patientPortal")}
                </button>
              </Link>
            )}

            {/* Book Appointment CTA */}
            <Link href="/appointments" className="shrink-0">
              <button className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-semibold xl:text-sm xl:px-4.5 bg-ink text-white transition hover:bg-ink/85 cursor-pointer">
                <CalendarDays className="h-4 w-4 shrink-0" />
                {t("nav.bookAppointment")}
              </button>
            </Link>
          </div>

          {/* Mobile Right Bar: Language Switcher + Hamburger Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle variant="desktop" className="scale-90 origin-right" />

            <button
              type="button"
              aria-label={open ? t("nav.closeNav") : t("nav.openNav")}
              aria-expanded={open}
              className="grid size-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-ink transition active:scale-95 hover:bg-slate-100 cursor-pointer"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="h-5 w-5 text-slate-900" />
              ) : (
                <Menu className="h-5 w-5 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Drawer */}
        {open && (
          <div
            className="lg:hidden fixed inset-x-0 top-[76px] bottom-0 z-50 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white border-b border-slate-200/90 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Language Switcher */}
              <LanguageToggle variant="mobile" />

              <nav className="grid gap-1">
                {navConfig.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 hover:text-teal-700 active:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      <span className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-600">
                        <Icon className="size-4" />
                      </span>
                      <span>{t(item.key)}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
                {/* When Logged In: Show Patient Name + Chat with Doctor */}
                {isEffectivePatientLoggedIn ? (
                  <>
                    <Link
                      href="/patient"
                      onClick={() => setOpen(false)}
                      className="w-full"
                    >
                      <button className="w-full h-12 flex items-center justify-center gap-2.5 rounded-2xl border border-teal-600/30 bg-teal-50 font-bold text-sm text-teal-950 hover:bg-teal-100 transition-all cursor-pointer">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-700 to-emerald-500 font-bold text-xs text-white shadow-xs leading-none">
                          {patientDisplayName ? patientDisplayName.trim().charAt(0).toUpperCase() : <UserRound className="size-3.5 text-white" />}
                        </span>
                        <span className="truncate capitalize">{patientDisplayName || t("nav.patientPortal")}</span>
                      </button>
                    </Link>

                    {enablePatientChat !== false && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          openChatWithDoctor();
                        }}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
                      >
                        <MessageSquare className="h-4.5 w-4.5 fill-white" />
                        <span>{t("chat.withDoctor")}</span>
                      </button>
                    )}
                  </>
                ) : (
                  /* When Logged Out: Show ONLY Patient Portal (No user name, No Chat with Doctor) */
                  <Link
                    href="/patient"
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    <button className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 font-extrabold text-sm text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                      <UserRound className="h-4 w-4" />
                      {t("nav.patientPortal")}
                    </button>
                  </Link>
                )}

                {/* Book Appointment (Mobile) */}
                <Link
                  href="/appointments"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  <button className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white font-extrabold text-sm shadow-md hover:bg-slate-800 transition-all cursor-pointer">
                    <CalendarDays className="h-4 w-4" />
                    {t("nav.bookAppointment")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
