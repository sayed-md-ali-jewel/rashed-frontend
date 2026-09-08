import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthService } from "@/lib/services/auth.service";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits")
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login details" }, { status: 422 });
  }

  const user = await AuthService.verifyAdmin(parsed.data.username, parsed.data.pin);

  if (!user) {
    return NextResponse.json({ error: "Incorrect username or PIN" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set("admin_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12 // 12 hours
  });

  return response;
}
