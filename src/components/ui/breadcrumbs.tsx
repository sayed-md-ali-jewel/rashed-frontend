import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: Route }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
        <Home className="h-4 w-4" />
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <ChevronRight className="h-4 w-4" aria-hidden />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
