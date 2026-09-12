import { connectMongo } from "@/lib/mongodb";
import {
  AppointmentModel,
  ChamberScheduleRuleModel,
  HospitalModel,
  ScheduleModel
} from "@/lib/models";
import type { ScheduleType, DayOfWeek } from "@/lib/types";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTimeString(timeStr?: string): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 9, minutes: 0 };
  const trimmed = timeStr.trim().toLowerCase();

  // Check 12-hour format e.g. "4:00 PM", "04:30 pm", "11:00 am"
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toLowerCase();
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // Check 24-hour format e.g. "16:00", "09:30"
  const h24Match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (h24Match) {
    return {
      hours: parseInt(h24Match[1], 10),
      minutes: parseInt(h24Match[2], 10)
    };
  }

  return { hours: 9, minutes: 0 };
}

export function formatTime12H(hours: number, minutes: number): string {
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const minStr = String(minutes).padStart(2, "0");
  return `${h12}:${minStr} ${period}`;
}

export function getDayOfWeekName(date: Date): DayOfWeek {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  return days[date.getDay()];
}

export function buildOccurrenceDates(
  rule: {
    scheduleType: ScheduleType;
    daysOfWeek?: string[];
    dayOfMonth?: number;
    specificDate?: string | Date;
    startDate?: string | Date;
    endDate?: string | Date;
  },
  daysAhead = 60
): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const startLimit = rule.startDate ? new Date(rule.startDate) : today;
  const effectiveStart = startLimit > today ? startLimit : today;
  const effectiveEnd = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  if (rule.endDate) {
    const endLimit = new Date(rule.endDate);
    if (endLimit < effectiveEnd) {
      effectiveEnd.setTime(endLimit.getTime());
    }
  }

  if (rule.scheduleType === "specific_date") {
    if (rule.specificDate) {
      const target = new Date(rule.specificDate);
      if (!isNaN(target.getTime())) {
        const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
        if (targetDate >= effectiveStart) {
          dates.push(targetDate);
        }
      }
    }
    return dates;
  }

  if (rule.scheduleType === "daily") {
    const cursor = new Date(effectiveStart);
    while (cursor <= effectiveEnd) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  if (rule.scheduleType === "weekly") {
    const selectedDays = (rule.daysOfWeek || []).map((d) => d.toLowerCase().trim());
    if (selectedDays.length === 0) return dates;

    const cursor = new Date(effectiveStart);
    while (cursor <= effectiveEnd) {
      const currentDay = getDayOfWeekName(cursor);
      if (selectedDays.includes(currentDay)) {
        dates.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  if (rule.scheduleType === "monthly") {
    const targetDay = Number(rule.dayOfMonth) || 1;
    const clampedDay = Math.min(31, Math.max(1, targetDay));

    let year = effectiveStart.getFullYear();
    let month = effectiveStart.getMonth();

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const actualDay = Math.min(clampedDay, daysInMonth);
      const occurrence = new Date(year, month, actualDay);

      if (occurrence >= effectiveStart && occurrence <= effectiveEnd) {
        dates.push(occurrence);
      }

      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      if (new Date(year, month, 1) > effectiveEnd) break;
    }
    return dates;
  }

  return dates;
}

export class ScheduleService {
  static buildOccurrenceDates = buildOccurrenceDates;
  static parseTimeString = parseTimeString;
  static formatTime12H = formatTime12H;
  static getDayOfWeekName = getDayOfWeekName;

  /**
   * Upsert a ChamberScheduleRule and immediately sync upcoming occurrences.
   */
  static async upsertScheduleRule(data: any, id?: string) {
    await connectMongo();

    // Resolve hospital details
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

    const payload: any = {
      hospitalId: data.hospitalId,
      hospital: hospital || { name: "Clinic", address: "Dhaka" },
      title: data.title || `${hospital?.name || "Clinic"} Consultation`,
      scheduleType: data.scheduleType || "weekly",
      daysOfWeek: Array.isArray(data.daysOfWeek) ? data.daysOfWeek.map((d: string) => d.toLowerCase().trim()) : [],
      dayOfMonth: data.dayOfMonth ? Number(data.dayOfMonth) : undefined,
      specificDate: data.specificDate ? new Date(data.specificDate) : undefined,
      startTime: data.startTime || "16:00",
      endTime: data.endTime || "19:00",
      slotDurationMinutes: Number(data.slotDurationMinutes) || 10,
      fee: Number(data.fee) || (hospital?.consultationFee ?? 1000),
      maxAppointments: Number(data.maxAppointments) || 20,
      breakStartTime: data.breakStartTime || "",
      breakEndTime: data.breakEndTime || "",
      active: typeof data.active === "boolean" ? data.active : true,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      seo: data.seo || {}
    };

    let savedRule;
    if (id) {
      savedRule = await ChamberScheduleRuleModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
    } else {
      savedRule = await ChamberScheduleRuleModel.create(payload);
    }

    if (savedRule) {
      await this.syncRuleOccurrences(savedRule);
    }

    return savedRule;
  }

  /**
   * Automatically generate and sync schedule occurrences for a specific rule.
   */
  static async syncRuleOccurrences(ruleDoc: any, daysAhead = 60) {
    await connectMongo();
    const rule = typeof ruleDoc.toObject === "function" ? ruleDoc.toObject() : ruleDoc;
    const ruleId = String(rule._id || rule.id);

    if (!rule.active) {
      const now = new Date();
      const upcoming = await ScheduleModel.find({
        ruleId,
        startsAt: { $gte: now },
        isCustomOverride: { $ne: true }
      }).select("_id");

      const candidateIds = upcoming.map((s) => String(s._id));
      if (candidateIds.length > 0) {
        const booked = await AppointmentModel.distinct("scheduleId", {
          scheduleId: { $in: candidateIds },
          status: { $ne: "cancelled" }
        });
        const bookedSet = new Set(booked.map(String));
        const safeToDelete = candidateIds.filter((id) => !bookedSet.has(id));
        if (safeToDelete.length > 0) {
          await ScheduleModel.deleteMany({ _id: { $in: safeToDelete } });
        }
      }
      return { generated: 0, ruleId };
    }

    const occurrenceDates = buildOccurrenceDates(rule, daysAhead);
    const { hours: startH, minutes: startM } = parseTimeString(rule.startTime);
    const { hours: endH, minutes: endM } = parseTimeString(rule.endTime);

    let generatedCount = 0;

    for (const d of occurrenceDates) {
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      const startsAt = new Date(year, month, day, startH, startM, 0, 0);
      let endsAt = new Date(year, month, day, endH, endM, 0, 0);

      if (endsAt.getTime() <= startsAt.getTime()) {
        const durationMin = Number(rule.slotDurationMinutes) || 10;
        const maxSlots = Number(rule.maxAppointments) || 20;
        endsAt = new Date(startsAt.getTime() + durationMin * maxSlots * 60 * 1000);
      }

      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const timeStr = `${String(startH).padStart(2, "0")}${String(startM).padStart(2, "0")}`;
      const hospitalSlug = slugify(rule.hospital?.name || "chamber");
      const baseSlug = `${hospitalSlug}-${dateStr}-${timeStr}`;

      const dayStart = new Date(year, month, day, 0, 0, 0, 0);
      const dayEnd = new Date(year, month, day, 23, 59, 59, 999);

      const existing = await ScheduleModel.findOne({
        $or: [
          { ruleId, startsAt: { $gte: dayStart, $lte: dayEnd } },
          { slug: baseSlug }
        ]
      });

      if (existing) {
        if (existing.isCustomOverride || existing.scheduleStatus === "cancelled") {
          continue;
        }

        const hasAppointments = await AppointmentModel.exists({
          scheduleId: String(existing._id),
          status: { $ne: "cancelled" }
        });

        if (!hasAppointments) {
          existing.title = rule.title || `${rule.hospital?.name || "Clinic"} Consultation`;
          existing.hospitalId = rule.hospitalId;
          existing.hospital = rule.hospital;
          existing.startsAt = startsAt;
          existing.endsAt = endsAt;
          existing.slotDurationMinutes = rule.slotDurationMinutes;
          existing.fee = rule.fee;
          existing.maxAppointments = rule.maxAppointments;
          existing.ruleId = rule._id;
          existing.isRecurring = true;
          existing.scheduleType = rule.scheduleType;
          await existing.save();
        }
      } else {
        await ScheduleModel.create({
          title: rule.title || `${rule.hospital?.name || "Clinic"} Consultation`,
          slug: baseSlug,
          hospitalId: rule.hospitalId,
          hospital: rule.hospital || { name: "Clinic", address: "Dhaka" },
          startsAt,
          endsAt,
          slotDurationMinutes: rule.slotDurationMinutes || 10,
          fee: rule.fee || 1000,
          maxAppointments: rule.maxAppointments || 20,
          scheduleStatus: "scheduled",
          ruleId: rule._id,
          isRecurring: true,
          scheduleType: rule.scheduleType,
          isCustomOverride: false,
          seo: rule.seo || {}
        });
        generatedCount++;
      }
    }

    return { generated: generatedCount, ruleId };
  }

  /**
   * Ensure all active recurring rules have their occurrences generated for the upcoming window.
   */
  static async ensureUpcomingSchedules(daysAhead = 60) {
    await connectMongo();
    const activeRules = await ChamberScheduleRuleModel.find({ active: { $ne: false } }).lean();

    const results = [];
    for (const rule of activeRules) {
      const res = await this.syncRuleOccurrences(rule, daysAhead);
      results.push(res);
    }
    return results;
  }

  /**
   * Cancel a specific day's schedule occurrence without affecting the master rule.
   */
  static async cancelOccurrence(scheduleId: string, reason = "Cancelled by admin") {
    await connectMongo();
    const schedule = await ScheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    schedule.scheduleStatus = "cancelled";
    schedule.isCustomOverride = true;
    schedule.cancellationReason = reason;
    await schedule.save();

    await AppointmentModel.updateMany(
      { scheduleId: String(schedule._id), status: { $in: ["pending", "approved"] } },
      {
        status: "cancelled",
        appointmentStatus: "cancelled",
        notes: `Schedule cancelled: ${reason}`
      }
    );

    return schedule;
  }

  /**
   * Reschedule or customize a specific single day's occurrence.
   */
  static async rescheduleOccurrence(
    scheduleId: string,
    updates: {
      startsAt?: string | Date;
      endsAt?: string | Date;
      fee?: number;
      slotDurationMinutes?: number;
      maxAppointments?: number;
      notes?: string;
    }
  ) {
    await connectMongo();
    const schedule = await ScheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    if (updates.startsAt) schedule.startsAt = new Date(updates.startsAt);
    if (updates.endsAt) schedule.endsAt = new Date(updates.endsAt);
    if (updates.fee !== undefined) schedule.fee = Number(updates.fee);
    if (updates.slotDurationMinutes !== undefined) {
      schedule.slotDurationMinutes = Number(updates.slotDurationMinutes);
    }
    if (updates.maxAppointments !== undefined) {
      schedule.maxAppointments = Number(updates.maxAppointments);
    }
    if (updates.notes) schedule.rescheduleNotes = updates.notes;

    schedule.isCustomOverride = true;
    schedule.scheduleStatus = "scheduled";
    await schedule.save();

    return schedule;
  }

  /**
   * Restore/reactivate a cancelled occurrence.
   */
  static async reactivateOccurrence(scheduleId: string) {
    await connectMongo();
    const schedule = await ScheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    schedule.scheduleStatus = "scheduled";
    schedule.isCustomOverride = true;
    schedule.cancellationReason = "";
    await schedule.save();

    return schedule;
  }

  /**
   * Create or update a schedule manually (individual date).
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

    const schedulePayload: any = {
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
      isCustomOverride: data.isCustomOverride ?? true,
      seo: data.seo || {}
    };

    if (data.ruleId) schedulePayload.ruleId = data.ruleId;
    if (data.scheduleType) schedulePayload.scheduleType = data.scheduleType;

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
