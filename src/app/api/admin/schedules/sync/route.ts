import { NextResponse } from "next/server";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { ScheduleService } from "@/lib/services/schedule.service";

export async function POST(request: Request) {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  try {
    await connectMongo();
    const body = await request.json().catch(() => ({}));
    const daysAhead = Number(body.daysAhead) || 60;

    const results = await ScheduleService.ensureUpcomingSchedules(daysAhead);
    const totalGenerated = results.reduce((acc, curr) => acc + (curr.generated || 0), 0);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${results.length} recurring rules and generated ${totalGenerated} schedule occurrences.`,
      data: {
        rulesProcessed: results.length,
        totalGenerated,
        details: results
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync schedules" },
      { status: 500 }
    );
  }
}
