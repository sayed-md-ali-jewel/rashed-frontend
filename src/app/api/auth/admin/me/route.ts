import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { AdminUserModel } from "@/lib/models";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "active") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const defaultUser = {
    username: process.env.ADMIN_DEMO_USER ?? "admin",
    name: "Dr. Rashed Super Admin",
    role: "super_admin",
    permissions: ["all"]
  };

  if (hasMongoUri()) {
    try {
      await connectMongo();
      const user = await AdminUserModel.findOne({ active: true }).lean();
      if (user) {
        return NextResponse.json({
          user: {
            id: String(user._id),
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role || "super_admin",
            permissions: user.permissions || ["all"]
          }
        });
      }
    } catch {
      // fallback
    }
  }

  return NextResponse.json({ user: defaultUser });
}
