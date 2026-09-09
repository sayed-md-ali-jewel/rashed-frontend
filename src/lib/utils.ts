import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: string | Date | undefined | null) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true
  }).format(d);
}

export function formatTime12(value: string | Date | undefined | null) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(d);
}

export function formatDate12(value: string | Date | undefined | null) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(d);
}

export function formatSlotRange12(start: string | Date | undefined | null, end?: string | Date | undefined | null) {
  if (!start) return "";
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) return "";
  const dateStr = formatDate12(startDate);
  const startTime = formatTime12(startDate);
  if (!end) return `${dateStr}, ${startTime}`;
  const endDate = new Date(end);
  if (isNaN(endDate.getTime())) return `${dateStr}, ${startTime}`;
  const endTime = formatTime12(endDate);
  return `${dateStr} • ${startTime} - ${endTime}`;
}

export function formatCurrency(value: number, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function cleanRelativeUrl(val?: string | null): string {
  if (!val || typeof val !== "string") return "";
  const clean = val.trim();
  const uploadsIdx = clean.indexOf("/uploads/");
  if (uploadsIdx !== -1) {
    return clean.slice(uploadsIdx);
  }
  if (clean.startsWith("uploads/")) {
    return `/${clean}`;
  }
  return clean;
}

/**
 * Returns the base URL of the server (e.g. "https://drrashed.bd" or "http://localhost:3000")
 */
export function getServerBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (envUrl && typeof envUrl === "string") {
    return envUrl.trim().replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  return "";
}

/**
 * Connects the server / upload folder before the image relative path stored in MongoDB.
 * MongoDB stores: "/uploads/WhatsApp_Image_2026-09-09_at_8_58_39_AM_1788922800441.jpeg"
 * Result: "https://drrashed.bd/uploads/WhatsApp_Image_2026-09-09_at_8_58_39_AM_1788922800441.jpeg"
 */
export function connectServerUploadUrl(src?: string | null): string {
  if (!src || typeof src !== "string" || !src.trim()) {
    return "";
  }
  const clean = src.trim();

  // Data URLs or base64
  if (clean.startsWith("data:")) {
    return clean;
  }

  // External full URLs that are NOT our uploads
  const uploadsIdx = clean.indexOf("/uploads/");
  if (
    uploadsIdx === -1 &&
    !clean.startsWith("uploads/") &&
    (clean.startsWith("http://") || clean.startsWith("https://"))
  ) {
    return clean;
  }

  // Extract the relative upload path
  let relativeUploadPath = "";
  if (uploadsIdx !== -1) {
    relativeUploadPath = clean.slice(uploadsIdx);
  } else if (clean.startsWith("uploads/")) {
    relativeUploadPath = `/${clean}`;
  } else if (clean.startsWith("/")) {
    relativeUploadPath = clean.startsWith("/uploads/") ? clean : `/uploads${clean}`;
  } else {
    relativeUploadPath = `/uploads/${clean}`;
  }

  // Connect server base URL
  const serverBase = getServerBaseUrl();
  if (serverBase) {
    // Avoid double /uploads if serverBase already ends with /uploads
    if (serverBase.endsWith("/uploads") && relativeUploadPath.startsWith("/uploads/")) {
      return `${serverBase}${relativeUploadPath.slice(8)}`;
    }
    return `${serverBase}${relativeUploadPath}`;
  }

  return relativeUploadPath;
}

/**
 * Safe image resolver that connects server upload folder to relative MongoDB paths
 * and provides fallbacks for invalid or empty image sources.
 */
export function safeImageSrc(
  src?: string | null,
  fallback = "/placeholder.svg"
): string {
  if (!src || typeof src !== "string" || !src.trim()) {
    return fallback;
  }
  const resolved = connectServerUploadUrl(src);
  return resolved || fallback;
}

