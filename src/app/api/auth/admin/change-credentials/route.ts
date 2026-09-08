import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { AdminUserModel } from "@/lib/models";

const changeCredentialsSchema = z.object({
  currentPin: z.string().min(1, "Current PIN is required"),
  newUsername: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  newPin: z
    .string()
    .trim()
    .min(4, "New PIN must be at least 4 characters")
    .optional()
    .or(z.literal("")),
  name: z.string().trim().min(1, "Name is required").optional(),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal(""))
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || sessionCookie.value !== "active") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parseResult = changeCredentialsSchema.safeParse(body);
  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "Invalid input data" },
      { status: 422 }
    );
  }

  const { currentPin, newUsername, newPin, name, email } = parseResult.data;

  if (!hasMongoUri()) {
    return NextResponse.json(
      { error: "Database is not connected. Credentials cannot be persisted." },
      { status: 503 }
    );
  }

  try {
    await connectMongo();

    const envUser = process.env.ADMIN_DEMO_USER ?? "admin";
    const envPin = process.env.ADMIN_DEMO_PIN ?? "123456";

    // 1. Locate current admin user
    let user = await AdminUserModel.findOne({ active: true });

    if (!user) {
      // If no admin user exists in DB yet, check against env PIN
      if (currentPin !== envPin) {
        return NextResponse.json({ error: "Current PIN is incorrect" }, { status: 400 });
      }

      // If newUsername requested, check collision
      const targetUsername = newUsername || envUser;

      user = await AdminUserModel.create({
        username: targetUsername,
        pin: newPin && newPin.length >= 4 ? newPin : envPin,
        name: name || "Dr. Rashed Super Admin",
        email: email || "admin@doctorcare.test",
        role: "super_admin",
        permissions: ["all"],
        active: true,
        lastLogin: new Date()
      });

      return NextResponse.json({
        ok: true,
        message: "Admin credentials successfully created and updated in MongoDB!",
        user: {
          id: String(user._id),
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // 2. Validate current PIN against MongoDB user record
    if (user.pin !== currentPin && currentPin !== envPin) {
      return NextResponse.json({ error: "Current PIN is incorrect" }, { status: 400 });
    }

    // 3. If username is changing, check if another admin user has it
    if (newUsername && newUsername !== user.username) {
      const existing = await AdminUserModel.findOne({
        username: newUsername,
        _id: { $ne: user._id }
      });
      if (existing) {
        return NextResponse.json(
          { error: `Username "${newUsername}" is already taken by another account` },
          { status: 409 }
        );
      }
    }

    // 4. Update the user
    if (newUsername) user.username = newUsername;
    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (newPin && newPin.length >= 4) user.pin = newPin;
    user.active = true;

    await user.save();

    return NextResponse.json({
      ok: true,
      message: "Admin credentials successfully updated in MongoDB!",
      user: {
        id: String(user._id),
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update admin credentials" },
      { status: 500 }
    );
  }
}
