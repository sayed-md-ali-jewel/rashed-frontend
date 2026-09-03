import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "blue" | "gold" | "panel";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-tight transition-colors",
        variant === "default" && "border border-line bg-white text-ink",
        variant === "outline" && "border border-line bg-white text-ink",
        variant === "blue" && "bg-blue text-white shadow-sm",
        variant === "gold" && "bg-gold text-ink",
        variant === "panel" && "bg-panel text-ink border border-line",
        variant === "success" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
        variant === "warning" && "bg-amber-50 text-amber-800 border border-amber-200",
        variant === "danger" && "bg-rose-50 text-rose-700 border border-rose-200",
        className
      )}
      {...props}
    />
  );
}
