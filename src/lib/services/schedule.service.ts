import { connectMongo } from "@/lib/mongodb";
import { AppointmentModel, HospitalModel, ScheduleModel } from "@/lib/models";
import { generateSlots, type Slot } from "@/lib/booking";

export class ScheduleService {
  /**
   * Create or update a schedule with automatic duration & endsAt calculations.
   */
  static async upsertSchedule(data: any, id?: string) {
    await connectMongo();

    const startsAt = new Date(data.startsAt);
    if (isNaN(startsAt.getTime())) {
      throw new Error("Invalid schedule start time");
    }

    const durationMinutes = Number(data.slotDurationMinutes) || 10;
    const maxAppointments = Number(data.maxAppointments) || 20;

    let endsAt = data.endsAt ? new Date(data.endsAt) : null;
    if (!endsAt || isNaN(endsAt.getTime())) {
      const totalMinutes = maxAppointments > 0 ? maxAppointments * durationMinutes : 180;
      endsAt = new Date(startsAt.getTime() + totalMinutes * 60 * 1000);
    }

    // Resolve hospital details if hospitalId is given
    let hospital = data.hospital;
    if (data.hospitalId) {
      const hospitalDoc = await HospitalModel.findById(data.hospitalId).lean();
      if (hospitalDoc) {
        hospital = {
          name: hospitalDoc.name,
          address: hospitalDoc.address,
          phone: hospitalDoc.phone,
          googleMapsUrl: hospitalDoc.googleMapsUrl,
          embeddedMapUrl: hospitalDoc.embeddedMapUrl,
          mapUrl: hospitalDoc.mapUrl,
          latitude: hospitalDoc.latitude,
          longitude: hospitalDoc.longitude,
          image: hospitalDoc.image,
          consultationFee: hospitalDoc.consultationFee,
          active: hospitalDoc.active
        };
      }
    }

    const schedulePayload = {
      title: data.title || `${hospital?.name || "Clinic"} Consultation`,
      slug: data.slug || `schedule-${Date.now()}`,
      hospitalId: data.hospitalId,
      hospital: hospital || { name: "Clinic", address: "Dhaka" },
      startsAt,
      endsAt,
      slotDurationMinutes: durationMinutes,
      fee: Number(data.fee) || 1000,
      maxAppointments,
      scheduleStatus: data.scheduleStatus || "scheduled",
      seo: data.seo || {}
    };

    if (id) {
      return ScheduleModel.findByIdAndUpdate(id, schedulePayload, { new: true, runValidators: true });
    }

    return ScheduleModel.create(schedulePayload);
  }

  /**
   * Get schedule by ID or slug with real-time booked slots.
   */
  static async getScheduleWithSlots(identifier: string) {
    await connectMongo();

    let schedule = await ScheduleModel.findById(identifier).lean();
    if (!schedule) {
      schedule = await ScheduleModel.findOne({ slug: identifier }).lean();
    }
    if (!schedule) return null;

    const bookedAppointments = await AppointmentModel.find({
      scheduleId: String(schedule._id),
      status: { $ne: "cancelled" }
    })
      .select("slotStart")
      .lean();

    const bookedSlots = bookedAppointments.map((a) => new Date(a.slotStart).toISOString());

    return {
      ...schedule,
      id: String(schedule._id),
      bookedSlots
    };
  }
}
