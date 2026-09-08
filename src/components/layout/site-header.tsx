"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarDays,
  HeartPulse,
  Home,
  Menu,
  Star,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { WebsiteSetting } from "@/lib/types";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#schedules", label: "Schedules", icon: CalendarDays },
  { href: "/#profile", label: "About", icon: UserRound },
  { href: "/#services", label: "Services", icon: Activity },
  { href: "/#reviews", label: "Reviews", icon: Star },
  { href: "/#contact", label: "Contact", icon: HeartPulse },
] as const;

export function SiteHeader({ setting }: { setting: WebsiteSetting }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#f1efea] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            {setting.logo ? (
              <img
                src={setting.logo}
                alt={setting.siteName || "Dr. Rashed"}
                className="h-10 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue text-white font-black text-lg shadow-sm">
                  R
                </span>
                <div className="shrink-0">
                  <span className="block text-[18px] font-black tracking-tight text-ink whitespace-nowrap">
                    {setting.siteName || "Dr. Rashed"}
                  </span>
                  <span className="block text-[11px] font-medium text-muted whitespace-nowrap">
                    Specialist Physician
                  </span>
                </div>
              </>
            )}
          </Link>

          <ul className="hidden items-center gap-5 xl:gap-8 text-[15px] font-medium text-[#2a2a2a] lg:flex">
            {navItems.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="whitespace-nowrap transition hover:text-ink hover:font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <Link href="/patient" className="shrink-0">
              <button className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold xl:text-sm xl:px-5 border-[1.5px] border-ink text-ink transition hover:bg-ink hover:text-white cursor-pointer">
                <UserRound className="h-4 w-4 shrink-0" />
                Patient Portal
              </button>
            </Link>
            <Link href="/appointments" className="shrink-0">
              <button className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold xl:text-sm xl:px-5 bg-ink text-white transition hover:bg-ink/85 cursor-pointer">
                <CalendarDays className="h-4 w-4 shrink-0" />
                Book Appointment
              </button>
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-ink transition active:scale-95 hover:bg-slate-100 cursor-pointer lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="h-5 w-5 text-slate-900" />
            ) : (
              <Menu className="h-5 w-5 text-slate-900" />
            )}
          </button>
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
              <nav className="grid gap-1">
                {navItems.map((item) => {
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
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
                <Link
                  href="/patient"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  <button className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 font-extrabold text-sm text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                    <UserRound className="h-4 w-4" />
                    Patient Portal
                  </button>
                </Link>
                <Link
                  href="/appointments"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  <button className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white font-extrabold text-sm shadow-md hover:bg-slate-800 transition-all cursor-pointer">
                    <CalendarDays className="h-4 w-4" />
                    Book Appointment
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
