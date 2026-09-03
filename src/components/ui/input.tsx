import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive/10";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(inputClasses, className)} {...props} />
);
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => <select ref={ref} className={cn(inputClasses, className)} {...props} />
);
Select.displayName = "Select";
