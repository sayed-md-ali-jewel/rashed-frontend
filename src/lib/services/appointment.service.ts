import { connectMongo } from "@/lib/mongodb";
import {
  AppointmentModel,
  NotificationModel,
  PatientModel,
  PaymentModel,
  ScheduleModel
} from "@/lib/models";
import { generateSlots, type Slot } from "@/lib/booking";

export type BookAppointmentInput = {
  patientName: string;
  mobileNumber: string;
  scheduleId: string;
  slotStart: string;
  address?: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  reason?: string;
  uploadedReports?: string[];
};

export class AppointmentService {
  /**
   * Book a new appointment with concurrency-safe slot allocation and automated payment/notification generation.
   */
  static async bookAppointment(input: BookAppointmentInput) {
    await connectMongo();

    // 1. Find schedule
    const schedule = await ScheduleModel.findById(input.scheduleId).lean();
    if (!schedule || schedule.scheduleStatus === "cancelled") {
      // Try by slug
      const scheduleBySlug = await ScheduleModel.findOne({ slug: input.scheduleId }).lean();
      if (!scheduleBySlug || scheduleBySlug.scheduleStatus === "cancelled") {
        throw new Error("Schedule not found or is cancelled");
      }
    }

    const activeSchedule = (await ScheduleModel.findById(input.scheduleId).lean()) ?? (await ScheduleModel.findOne({ slug: input.scheduleId }).lean());
    if (!activeSchedule) {
      throw new Error("Schedule not found");
    }

    // 2. Fetch existing active bookings for this schedule to verify slot availability
    const bookedAppointments = await AppointmentModel.find({
      scheduleId: String(activeSchedule._id),
      status: { $ne: "cancelled" }
    })
      .select("slotStart")
      .lean();

    const bookedTimes = new Set(
      bookedAppointments.map((a) => new Date(a.slotStart).getTime())
    );

    const targetTime = new Date(input.slotStart).getTime();
    if (isNaN(targetTime)) {
      throw new Error("Invalid slot start time");
    }

    const durationMinutes = Number(activeSchedule.slotDurationMinutes) || 10;
    const durationMs = durationMinutes * 60 * 1000;
    const slotEnd = new Date(targetTime + durationMs).toISOString();

    // Check if slot is available
    if (bookedTimes.has(targetTime)) {
      throw new Error("Slot is no longer available");
    }

    // Determine queue number
    const queueNumber = bookedTimes.size + 1;

    // 3. Upsert patient profile
    const patient = await PatientModel.findOneAndUpdate(
      { mobileNumber: input.mobileNumber },
      {
        fullName: input.patientName,
        mobileNumber: input.mobileNumber,
        email: input.email || undefined,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        age: input.age,
        gender: input.gender,
        address: input.address,
        emergencyContact: input.emergencyContact,
        medicalHistory: input.medicalHistory
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // 4. Create appointment
    const appointment = await AppointmentModel.create({
      patientId: patient._id,
      patientName: input.patientName,
      mobileNumber: input.mobileNumber,
      email: input.email || "",
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      age: input.age,
      gender: input.gender || "",
      address: input.address || "",
      emergencyContact: input.emergencyContact || "",
      medicalHistory: input.medicalHistory || "",
      reason: input.reason || "",
      uploadedReports: input.uploadedReports ?? [],
      hospitalName: activeSchedule.hospital?.name || "Clinic",
      scheduleObjectId: activeSchedule._id,
      scheduleId: String(activeSchedule._id),
      slotStart: new Date(targetTime),
      slotEnd: new Date(slotEnd),
      queueNumber,
      status: "pending",
      appointmentStatus: "pending",
      paymentStatus: "pending",
      paymentAmount: 0
    });

    // 5. Create Payment record & Notification
    await Promise.all([
      PaymentModel.create({
        appointmentId: appointment._id,
        patientId: patient._id,
        patientName: input.patientName,
        hospitalName: activeSchedule.hospital?.name || "Clinic",
        consultationFee: activeSchedule.fee ?? 1000,
        discount: 0,
        totalAmount: activeSchedule.fee ?? 1000,
        status: "pending"
      }),
      NotificationModel.create({
        recipientType: "admin",
        appointmentId: appointment._id,
        patientId: patient._id,
        channel: "in_app",
        event: "appointment_request",
        title: "New Appointment Request",
        message: `${input.patientName} requested Queue #${queueNumber} at ${activeSchedule.hospital?.name || "Clinic"}.`
      })
    ]);

    return {
      appointmentId: String(appointment._id),
      queueNumber: appointment.queueNumber,
      status: appointment.status,
      slotStart: appointment.slotStart,
      slotEnd: appointment.slotEnd
    };
  }

  /**
   * Update appointment status with side-effects (e.g. updating payment, issuing notification).
   */
  static async updateStatus(
    id: string,
    status: "pending" | "approved" | "cancelled" | "completed",
    options: { notes?: string; patientMessage?: string; paymentStatus?: "pending" | "paid" | "failed" | "refunded" } = {}
  ) {
    await connectMongo();

    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    appointment.status = status;
    appointment.appointmentStatus = status;
    if (options.notes !== undefined) appointment.notes = options.notes;
    if (options.patientMessage !== undefined) {
      appointment.patientMessage = options.patientMessage;
      appointment.patientMessageSentAt = new Date();
    }
    if (options.paymentStatus) {
      appointment.paymentStatus = options.paymentStatus;
    }

    await appointment.save();

    // Sync Payment record
    if (options.paymentStatus) {
      await PaymentModel.findOneAndUpdate(
        { appointmentId: appointment._id },
        { status: options.paymentStatus }
      );
    } else if (status === "approved" && appointment.paymentStatus === "pending") {
      // Keep pending or mark as paid depending on clinic workflow
    } else if (status === "cancelled") {
      await PaymentModel.findOneAndUpdate(
        { appointmentId: appointment._id },
        { status: "refunded" }
      );
    }

    // Create Notification for Patient / Admin
    let notificationEvent: any = "appointment_approved";
    let title = "Appointment Approved";
    if (status === "cancelled") {
      notificationEvent = "appointment_cancelled";
      title = "Appointment Cancelled";
    } else if (status === "completed") {
      notificationEvent = "appointment_completed";
      title = "Consultation Completed";
    }

    await NotificationModel.create({
      recipientType: "patient",
      patientId: appointment.patientId,
      appointmentId: appointment._id,
      channel: "sms",
      event: notificationEvent,
      title,
      message: `Appointment for ${appointment.patientName} at ${appointment.hospitalName} is now ${status}.`
    });

    return appointment;
  }
}
