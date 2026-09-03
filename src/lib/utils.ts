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
