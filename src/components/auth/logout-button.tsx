"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { useChat } from "@/context/chat-context";

export function LogoutButton({ mode }: { mode: "admin" | "patient" }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { logoutPatient } = useChat();

  async function logout() {
    if (mode === "patient") {
      await logoutPatient();
      return;
    }
    await fetch("/api/auth/admin/logout", {
      method: "POST"
    });
    router.push("/admin/login" as Route);
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={logout} className="cursor-pointer gap-2">
      <LogOut className="h-4 w-4" />
      {t("auth.logout")}
    </Button>
  );
}
