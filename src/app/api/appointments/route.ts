import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSlots } from "@/lib/booking";
import { getScheduleById } from "@/lib/cms-data";
import { AppointmentModel, NotificationModel, PatientModel, PaymentModel } from "@/lib/models";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { bookStrapiAppointment, hasStrapiConfig } from "@/lib/strapi";

const schema = z.object({
  patientName: z.string().trim().min(2),
  address: z.string().trim().optional().or(z.literal("")),
  mobileNumber: z.string().trim().regex(/^(\+?88)?01[3-9]\d{8}$/),
  scheduleId: z.string().min(1),
  slotStart: z.string().min(1),
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
    return NextResponse.json({ error: "Invalid appointment data" }, { status: 422 });
  }

  const schedule = await getScheduleById(parsed.data.scheduleId);
  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  const targetTime = new Date(parsed.data.slotStart).getTime();
  const allSlots = generateSlots(schedule);
  const slot = allSlots.find((item) => new Date(item.start).getTime() === targetTime);
  if (!slot || !slot.available) {
    return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });
  }

  if (hasStrapiConfig()) {
    try {
      const appointment = await bookStrapiAppointment({
        ...parsed.data,
        slotStart: slot.start
      });
      return NextResponse.json(appointment);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Slot is no longer available" },
        { status: 409 }
      );
    }
  }

  if (!hasMongoUri()) {
    return NextResponse.json({
      appointmentId: crypto.randomUUID(),
      queueNumber: slot.queueNumber,
      status: "pending",
      mode: "preview"
    });
  }

  await connectMongo();

  try {
    const patient = await PatientModel.findOneAndUpdate(
      { mobileNumber: parsed.data.mobileNumber },
      {
        fullName: parsed.data.patientName,
        mobileNumber: parsed.data.mobileNumber,
        email: parsed.data.email,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
        age: parsed.data.age,
        gender: parsed.data.gender,
        address: parsed.data.address,
        emergencyContact: parsed.data.emergencyContact,
        medicalHistory: parsed.data.medicalHistory
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const appointment = await AppointmentModel.create({
      patientId: patient._id,
      patientName: parsed.data.patientName,
      mobileNumber: parsed.data.mobileNumber,
      email: parsed.data.email,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
      age: parsed.data.age,
      gender: parsed.data.gender,
      address: parsed.data.address,
      emergencyContact: parsed.data.emergencyContact,
      medicalHistory: parsed.data.medicalHistory,
      reason: parsed.data.reason,
      uploadedReports: parsed.data.uploadedReports ?? [],
      hospitalName: schedule.hospital.name,
      scheduleId: schedule.id,
      slotStart: new Date(slot.start),
      slotEnd: new Date(slot.end),
      queueNumber: slot.queueNumber,
      status: "pending",
      paymentStatus: "pending",
      paymentAmount: 0
    });

    await Promise.all([
      PaymentModel.create({
        appointmentId: appointment._id,
        patientId: patient._id,
        patientName: parsed.data.patientName,
        hospitalName: schedule.hospital.name,
        consultationFee: schedule.fee,
        discount: 0,
        totalAmount: schedule.fee,
        status: "pending"
      }),
      NotificationModel.create({
        recipientType: "admin",
        appointmentId: appointment._id,
        patientId: patient._id,
        channel: "in_app",
        event: "appointment_request",
        title: "New appointment request",
        message: `${parsed.data.patientName} requested Queue ${slot.queueNumber} at ${schedule.hospital.name}.`
      })
    ]);

    return NextResponse.json({
      appointmentId: String(appointment._id),
      queueNumber: appointment.queueNumber,
      status: appointment.status
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });
    }

    throw error;
  }
}
