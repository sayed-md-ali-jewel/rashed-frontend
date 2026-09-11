import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("patient_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(Buffer.from(sessionCookie.value, "base64url").toString("utf8"));
    if (!user || !user.mobileNumber) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        fullName: user.fullName || "Patient",
        mobileNumber: user.mobileNumber
      }
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
