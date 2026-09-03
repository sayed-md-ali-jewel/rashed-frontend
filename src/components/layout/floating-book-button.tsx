"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarPlus } from "lucide-react";

export function FloatingBookButton() {
  const pathname = usePathname();

  // Hide on admin routes or when already on the appointments page
  if (pathname.startsWith("/admin") || pathname === "/appointments") {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 lg:hidden animate-in fade-in duration-300">
      <Link
        href="/appointments"
        className="group relative flex items-center justify-center size-14 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Book Appointment"
      >
        {/* Blue Animated Wave (Sonar Ping) */}
        <span className="absolute -inset-1.5 rounded-full border-2 border-sky-400 animate-ping opacity-60 pointer-events-none"></span>
        <span className="absolute -inset-1 rounded-full bg-sky-400/25 animate-pulse pointer-events-none"></span>

        {/* Circular Blue Gradient Button Core */}
        <div className="relative flex items-center justify-center size-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-sky-400 text-white border-2 border-white">
          {/* Crisp Center Icon */}
          <CalendarPlus className="size-6 text-white stroke-[2.4]" />

          {/* Glowing Yellow Beacon Dot with Wave */}
          <span className="absolute top-1 right-1 flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full size-3 bg-yellow-400 border border-white"></span>
          </span>
        </div>
      </Link>
    </div>
  );
}
