import type { HTMLAttributes, ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ModalShell({
  title,
  children,
  className
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <Card className={cn("w-full max-w-lg p-6 shadow-premium", className)}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}

export function DrawerShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-card p-6 shadow-premium" aria-label={title}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" size="icon" aria-label="Close drawer">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-6">{children}</div>
    </aside>
  );
}

export function Tabs({ tabs, active }: { tabs: string[]; active: string }) {
  return (
    <div className="flex overflow-x-auto rounded-2xl border border-border bg-card p-1 shadow-sm" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          role="tab"
          aria-selected={active === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function AccordionItem({ title, children, className }: HTMLAttributes<HTMLDetailsElement> & { title: string }) {
  return (
    <details className={cn("group rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-4 text-sm leading-6 text-muted-foreground">{children}</div>
    </details>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}
