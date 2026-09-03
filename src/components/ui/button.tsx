import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "gold" | "blue" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" && "h-9 px-4 text-xs",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-13 px-8 text-base py-3.5",
        size === "icon" && "h-10 w-10 p-0 rounded-full",
        (variant === "primary" || variant === "gold") &&
          "bg-gold text-ink hover:bg-gold-dark shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        variant === "secondary" &&
          "bg-ink text-white hover:bg-ink/85 shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        variant === "blue" &&
          "bg-blue text-white hover:bg-blue-dark shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        variant === "outline" &&
          "border-[1.5px] border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
        variant === "ghost" && "text-ink hover:bg-panel",
        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
