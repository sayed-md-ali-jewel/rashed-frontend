import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { AdminUserModel } from "@/lib/models";

export type AdminUserPayload = {
  username: string;
  pin: string;
  name?: string;
  email?: string;
  role?: "super_admin" | "admin" | "doctor" | "staff";
};

export class AuthService {
  /**
   * Verify admin credentials.
   */
  static async verifyAdmin(username: string, pin: string) {
    const envUser = process.env.ADMIN_DEMO_USER ?? "admin";
    const envPin = process.env.ADMIN_DEMO_PIN ?? "123456";

    // 1. Check MongoDB AdminUser collection if available
    if (hasMongoUri()) {
      try {
        await connectMongo();
        const user = await AdminUserModel.findOne({ username, active: true }).lean();
        if (user) {
          if (user.pin === pin) {
            await AdminUserModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            return {
              id: String(user._id),
              username: user.username,
              name: user.name,
              role: user.role || "super_admin",
              permissions: user.permissions || []
            };
          }
        }
      } catch {
        // Fallback to env
      }
    }

    // 2. Fallback to env credentials
    if (username === envUser && pin === envPin) {
      return {
        id: "env-super-admin",
        username: envUser,
        name: "Dr. Rashed Admin",
        role: "super_admin",
        permissions: ["all"]
      };
    }

    return null;
  }
}
