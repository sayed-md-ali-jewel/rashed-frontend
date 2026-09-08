import { NextResponse } from "next/server";
import { z } from "zod";
import { AppointmentService } from "@/lib/services/appointment.service";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";

const schema = z.object({
  status: z.enum(["pending", "approved", "cancelled", "completed"]),
  notes: z.string().optional(),
  patientMessage: z.string().optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!hasMongoUri()) {
    return NextResponse.json({ error: "MONGODB_URI is not configured" }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status update data" }, { status: 422 });
  }

  try {
    const data = await AppointmentService.updateStatus(id, parsed.data.status, {
      notes: parsed.data.notes,
      patientMessage: parsed.data.patientMessage,
      paymentStatus: parsed.data.paymentStatus
    });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update appointment status" },
      { status: 500 }
    );
  }
}
