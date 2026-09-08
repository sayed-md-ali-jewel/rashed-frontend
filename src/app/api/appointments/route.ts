import { NextResponse } from "next/server";
import { z } from "zod";
import { AppointmentService } from "@/lib/services/appointment.service";
import { hasMongoUri } from "@/lib/mongodb";

const schema = z.object({
  patientName: z.string().trim().min(2, "Patient name must be at least 2 characters"),
  address: z.string().trim().optional().or(z.literal("")),
  mobileNumber: z.string().trim().regex(/^(\+?88)?01[3-9]\d{8}$/, "Please enter a valid Bangladeshi mobile number"),
  scheduleId: z.string().min(1, "Schedule is required"),
  slotStart: z.string().min(1, "Slot time is required"),
  email: z.string().email().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  age: z.coerce.number().min(0).max(130).optional(),
  gender: z.string().optional().or(z.literal("")),
  emergencyContact: z.string().optional().or(z.literal("")),
  medicalHistory: z.string().optional().or(z.literal("")),
  reason: z.string().optional().or(z.literal("")),
  uploadedReports: z.array(z.string()).optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid appointment data" }, { status: 422 });
  }

  if (!hasMongoUri()) {
    // Preview mode fallback
    return NextResponse.json({
      appointmentId: crypto.randomUUID(),
      queueNumber: 1,
      status: "pending",
      mode: "preview"
    });
  }

  try {
    const appointment = await AppointmentService.bookAppointment(parsed.data);
    return NextResponse.json(appointment);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to book appointment";
    if (message.includes("available") || message.includes("duplicate") || message.includes("E11000")) {
      return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });
    }
    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
