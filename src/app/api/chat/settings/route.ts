import { NextResponse, type NextRequest } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { WebsiteSettingModel, DoctorModel } from "@/lib/models";
import { broadcastSocketEvent } from "@/lib/socket-server";

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get("admin_session")?.value === "active";
}

export async function GET() {
  if (!hasMongoUri()) {
    return NextResponse.json({ enablePatientChat: true });
  }

  try {
    await connectMongo();
    const setting = await WebsiteSettingModel.findOne().lean<any>();
    const enablePatientChat = typeof setting?.enablePatientChat === "boolean" ? setting.enablePatientChat : true;
    return NextResponse.json({ enablePatientChat });
  } catch (error: any) {
    console.error("Error fetching chat settings:", error);
    return NextResponse.json({ enablePatientChat: true });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "Database not connected" }, { status: 503 });
  }

  try {
    await connectMongo();
    const body = await request.json();
    const enablePatientChat = typeof body.enablePatientChat === "boolean" ? body.enablePatientChat : true;

    // Update in WebsiteSettingModel
    await WebsiteSettingModel.updateOne(
      {},
      { $set: { enablePatientChat } },
      { upsert: true, strict: false }
    );

    // Also sync with DoctorModel if present
    await DoctorModel.updateMany({}, { $set: { enablePatientChat } }, { strict: false });

    // Broadcast change via Socket.IO to notify live clients
    broadcastSocketEvent("chat:settings", { enablePatientChat });

    return NextResponse.json({
      success: true,
      enablePatientChat
    });
  } catch (error: any) {
    console.error("Error updating chat settings:", error);
    return NextResponse.json({ error: error.message || "Failed to update chat settings" }, { status: 500 });
  }
}
