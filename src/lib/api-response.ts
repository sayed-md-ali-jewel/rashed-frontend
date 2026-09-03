import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "Request failed") {
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    return NextResponse.json({ error: "Duplicate value already exists" }, { status: 409 });
  }

  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}
