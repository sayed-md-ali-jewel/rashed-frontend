"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RELOAD_KEY = "chunk_reload_attempts";
const LAST_RELOAD_TIME_KEY = "chunk_last_reload_time";
const MAX_RELOAD_ATTEMPTS = 2;
const COOLDOWN_MS = 15000;

function isChunkError(errorLike: unknown): boolean {
  if (!errorLike) return false;

  const str =
    (typeof errorLike === "string" ? errorLike : "") ||
    (errorLike instanceof Error ? errorLike.message || errorLike.name : "") ||
    (typeof (errorLike as any)?.reason === "string"
      ? (errorLike as any).reason
      : (errorLike as any)?.reason?.message || (errorLike as any)?.reason?.name) ||
    "";

  return (
    str.includes("ChunkLoadError") ||
    str.includes("Loading chunk") ||
    str.includes("Failed to fetch dynamically imported module") ||
    str.includes("error loading dynamically imported module") ||
    str.includes("failed to load module script") ||
    str.includes("CSS chunk load failed") ||
    str.includes("dynamically imported module")
  );
}

function triggerRecoveryReload() {
  if (typeof window === "undefined" || !window.sessionStorage) return;

  try {
    const now = Date.now();
    const lastTime = parseInt(sessionStorage.getItem(LAST_RELOAD_TIME_KEY) || "0", 10);
    const attempts = parseInt(sessionStorage.getItem(RELOAD_KEY) || "0", 10);

    // Prevent rapid infinite loops
    if (now - lastTime < 3000) {
      return;
    }

    if (attempts < MAX_RELOAD_ATTEMPTS || now - lastTime > COOLDOWN_MS) {
      const nextCount = now - lastTime > COOLDOWN_MS ? 1 : attempts + 1;
      sessionStorage.setItem(RELOAD_KEY, nextCount.toString());
      sessionStorage.setItem(LAST_RELOAD_TIME_KEY, now.toString());

      // Force cache-busting reload
      window.location.reload();
    }
  } catch {
    // If sessionStorage is disabled (e.g. strict private browsing), do single fallback reload
    window.location.reload();
  }
}

export function ChunkErrorHandler() {
  const pathname = usePathname();

  // Reset reload count on successful navigation
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        sessionStorage.removeItem(RELOAD_KEY);
      }, 2000);
      return () => clearTimeout(timer);
    } catch {
      // Ignore
    }
  }, [pathname]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (isChunkError(event.error) || isChunkError(event.message)) {
        event.preventDefault();
        triggerRecoveryReload();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isChunkError(event.reason)) {
        event.preventDefault();
        triggerRecoveryReload();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
