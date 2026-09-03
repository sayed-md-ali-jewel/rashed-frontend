import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { apiError } from "@/lib/api-response";
import { getWebsiteSetting } from "@/lib/cms-data";
import { AppointmentModel, NotificationModel, PaymentModel } from "@/lib/models";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { hasStrapiConfig, updateStrapiAdminRecord } from "@/lib/strapi";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const statusSchema = z.object({
  status: z.enum(["pending", "approved", "cancelled"])
});

function buildPatientMessage(appointment: {
  patientName?: string;
  queueNumber?: number;
  slotStart?: Date;
}, action: string, templates: { approved: string; cancelled: string }) {
  const patientName = appointment.patientName || "Patient";
  const queueText = appointment.queueNumber ? ` Queue number: ${appointment.queueNumber}.` : "";
  const dateText = appointment.slotStart ? ` for ${appointment.slotStart.toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}` : "";
  const template = action === "approved" ? templates.approved : templates.cancelled;

  return template
    .replaceAll("{patientName}", patientName)
    .replaceAll("{dateText}", dateText)
    .replaceAll("{queueText}", queueText)
    .replaceAll("{queueNumber}", String(appointment.queueNumber ?? ""));
}

import { revalidatePath } from "next/cache";

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Unsupported appointment status" }, { status: 422 });
  }

  if (hasStrapiConfig()) {
    try {
      const data = await updateStrapiAdminRecord("appointments", id, {
        appointmentStatus: parsed.data.status
      });

      try {
        revalidatePath("/", "layout");
        revalidatePath("/schedules");
        revalidatePath("/appointments");
      } catch {
        // ignore cache revalidation errors
      }

      return NextResponse.json({ data, message: `Appointment marked as ${parsed.data.status}` });
    } catch (error) {
      if (!hasMongoUri() || !isValidObjectId(id)) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to update appointment in Strapi" },
          { status: 422 }
        );
      }
    }
  }

  if (!hasMongoUri() || !isValidObjectId(id)) {
    return NextResponse.json({ error: "No database configured or invalid ID" }, { status: 400 });
  }

  await connectMongo();

  try {
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const websiteSetting = await getWebsiteSetting();

    appointment.status = parsed.data.status;
    if (parsed.data.status === "approved") {
      appointment.paymentStatus = "pending";
    }
    appointment.patientMessage = buildPatientMessage(appointment, parsed.data.status, {
      approved: websiteSetting.content.appointmentApprovedMessage,
      cancelled: websiteSetting.content.appointmentCancelledMessage
    });
    appointment.patientMessageSentAt = new Date();

    const data = await appointment.save();

    if (parsed.data.status === "approved") {
      await PaymentModel.findOneAndUpdate(
        { appointmentId: appointment._id },
        {
          appointmentId: appointment._id,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          hospitalName: appointment.hospitalName,
          consultationFee: appointment.paymentAmount || 0,
          totalAmount: appointment.paymentAmount || 0,
          status: "pending"
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await NotificationModel.create({
      recipientType: "patient",
      patientId: appointment.patientId,
      appointmentId: appointment._id,
      channel: "in_app",
      event: parsed.data.status === "approved"
        ? "appointment_approved"
        : "appointment_cancelled",
      title: `Appointment ${parsed.data.status}`,
      message: appointment.patientMessage
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/schedules");
      revalidatePath("/appointments");
    } catch {
      // ignore
    }

    return NextResponse.json({
      data,
      message: appointment.patientMessage
    });
  } catch (error) {
    return apiError(error, "Appointment status could not be updated");
  }
}
