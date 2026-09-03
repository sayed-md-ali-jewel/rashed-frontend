"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useState } from "react";
import { LockKeyhole, Phone } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginCardProps = {
  mode: "admin" | "patient";
};

export function LoginCard({ mode }: LoginCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const isAdmin = mode === "admin";

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    const payload = isAdmin
      ? {
          username: formData.get("username"),
          pin: formData.get("pin")
        }
      : {
          fullName: formData.get("fullName"),
          mobileNumber: formData.get("mobileNumber")
        };

    const response = await fetch(isAdmin ? "/api/auth/admin/login" : "/api/auth/patient/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(result.error ?? "Login failed");
      return;
    }

    const requestedNext = searchParams.get("next");
    const fallback = isAdmin ? "/admin" : "/patient";
    const nextPath = requestedNext?.startsWith(isAdmin ? "/admin" : "/patient") ? requestedNext : fallback;
    router.push(nextPath as Route);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-md">
      <div className="border-b border-line pb-5">
        <span className="grid size-12 place-items-center rounded-full bg-band text-ink border border-line">
          {isAdmin ? <LockKeyhole className="h-5 w-5 text-blue" /> : <Phone className="h-5 w-5 text-blue" />}
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-ink">{isAdmin ? "Admin Sign In" : "Patient Sign In"}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {isAdmin
            ? "Enter your secure admin username and PIN."
            : "Enter your full name and mobile number to access your portal."}
        </p>
      </div>

      <form action={onSubmit} className="mt-5 grid gap-4">
        {isAdmin ? (
          <>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3c3c3c]">
              Username
              <Input
                name="username"
                placeholder="admin"
                autoComplete="username"
                required
                className="h-11 rounded-xl border border-line bg-panel text-sm text-ink focus:bg-white focus:ring-2 focus:ring-blue"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3c3c3c]">
              PIN
              <Input
                name="pin"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                className="h-11 rounded-xl border border-line bg-panel text-sm text-ink focus:bg-white focus:ring-2 focus:ring-blue"
              />
            </label>
          </>
        ) : (
          <>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3c3c3c]">
              Full Name <span className="text-red-500">*</span>
              <Input
                name="fullName"
                placeholder="Your full name"
                autoComplete="name"
                required
                className="h-11 rounded-xl border border-line bg-panel text-sm text-ink focus:bg-white focus:ring-2 focus:ring-blue"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3c3c3c]">
              Mobile Number <span className="text-red-500">*</span>
              <Input
                name="mobileNumber"
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                required
                className="h-11 rounded-xl border border-line bg-panel text-sm text-ink focus:bg-white focus:ring-2 focus:ring-blue"
              />
            </label>
          </>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={pending}
          className="w-full mt-2 rounded-full py-4 text-sm font-bold gap-2.5"
        >
          {pending ? "Signing in..." : isAdmin ? "Access Admin Panel" : "Login to Patient Portal"}
          <span className="grid size-6 place-items-center rounded-full bg-ink text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Button>

        {message ? (
          <Alert variant="error" className="rounded-2xl mt-1">
            {message}
          </Alert>
        ) : null}
      </form>
    </div>
  );
}
