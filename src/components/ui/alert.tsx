import type { HTMLAttributes } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "success" | "error" | "info";
};

export function Alert({ className, variant = "info", children, ...props }: AlertProps) {
  const Icon = variant === "error" ? TriangleAlert : CheckCircle2;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-sm shadow-sm",
        variant === "success" && "border-success/25 bg-success/10 text-success",
        variant === "error" && "border-destructive/25 bg-destructive/10 text-destructive",
        variant === "info" && "border-primary/20 bg-primary/10 text-primary",
        className
      )}
      role={variant === "error" ? "alert" : "status"}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
