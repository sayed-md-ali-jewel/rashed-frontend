import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1),
  pin: z.string().min(4)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login details" }, { status: 422 });
  }

  const username = process.env.ADMIN_DEMO_USER ?? "admin";
  const pin = process.env.ADMIN_DEMO_PIN ?? "123456";

  if (parsed.data.username !== username || parsed.data.pin !== pin) {
    return NextResponse.json({ error: "Incorrect username or PIN" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "active", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
