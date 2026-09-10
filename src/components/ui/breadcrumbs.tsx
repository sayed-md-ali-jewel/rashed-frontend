"use client";

import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: Route }> }) {
  const { t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-ink">
        <Home className="h-4 w-4" />
        {t("nav.home")}
      </Link>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <ChevronRight className="h-4 w-4 aria-hidden text-muted/60" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
