"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ mode }: { mode: "admin" | "patient" }) {
  const router = useRouter();

  async function logout() {
    await fetch(mode === "admin" ? "/api/auth/admin/logout" : "/api/auth/patient/logout", {
      method: "POST"
    });
    router.push((mode === "admin" ? "/admin/login" : "/patient/login") as Route);
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={logout}>
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
