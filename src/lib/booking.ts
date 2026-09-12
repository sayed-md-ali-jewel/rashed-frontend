import type { Schedule } from "./types";

export type Slot = {
  start: string;
  end: string;
  available: boolean;
  queueNumber: number;
};

export function getScheduleEndTime(schedule?: { startsAt?: string; endsAt?: string } | null): number {
  if (!schedule) return NaN;
  if (schedule.endsAt) {
    const end = new Date(schedule.endsAt).getTime();
    if (!isNaN(end)) return end;
  }
  if (schedule.startsAt) {
    const start = new Date(schedule.startsAt).getTime();
    if (!isNaN(start)) {
      // Default to 3-hour duration if endsAt is omitted
      return start + 3 * 60 * 60 * 1000;
    }
  }
  return NaN;
}

export function getScheduleStartTime(schedule?: { startsAt?: string } | null): number {
  if (!schedule?.startsAt) return NaN;
  return new Date(schedule.startsAt).getTime();
}

/**
 * Returns true if the schedule is currently ongoing / active right now (between start and end time).
 */
export function isScheduleActive(
  schedule?: { startsAt?: string; endsAt?: string; scheduleStatus?: string } | null,
  now = Date.now()
): boolean {
  if (!schedule || schedule.scheduleStatus === "cancelled" || schedule.scheduleStatus === "completed") {
    return false;
  }
  const start = getScheduleStartTime(schedule);
  const end = getScheduleEndTime(schedule);
  if (isNaN(start) || isNaN(end)) return false;
  return now >= start && now <= end;
}

/**
 * Returns true if the schedule has passed its end time or is cancelled/completed.
 */
export function isScheduleExpired(
  schedule?: { startsAt?: string; endsAt?: string; scheduleStatus?: string } | null,
  now = Date.now()
): boolean {
  if (!schedule) return true;
  if (schedule.scheduleStatus === "cancelled" || schedule.scheduleStatus === "completed") {
    return true;
  }
  const end = getScheduleEndTime(schedule);
  if (isNaN(end)) return true;
  return now > end;
}

/**
 * Returns true if the schedule start time is in the future.
 */
export function isScheduleUpcoming(
  schedule?: { startsAt?: string; endsAt?: string; scheduleStatus?: string } | null,
  now = Date.now()
): boolean {
  if (!schedule || schedule.scheduleStatus === "cancelled" || schedule.scheduleStatus === "completed") {
    return false;
  }
  const start = getScheduleStartTime(schedule);
  if (isNaN(start)) return false;
  return start > now;
}

/**
 * Legacy compatibility alias: returns true if schedule is active or upcoming (not expired).
 */
export function isUpcomingSchedule(
  schedule?: { startsAt?: string; endsAt?: string; scheduleStatus?: string } | null,
  now = Date.now()
): boolean {
  return !isScheduleExpired(schedule, now);
}

/**
 * Given an array of schedules (e.g. for a single chamber), returns strictly ONE schedule:
 * 1. The currently active schedule if one is ongoing right now.
 * 2. If none is active, the nearest upcoming schedule.
 * 3. Returns null if all schedules are expired or cancelled.
 */
export function getActiveOrNextSchedule<T extends Schedule | { startsAt?: string; endsAt?: string; scheduleStatus?: string }>(
  schedules: T[],
  now = Date.now()
): T | null {
  if (!Array.isArray(schedules) || schedules.length === 0) return null;

  // 1. Filter out expired and cancelled schedules
  const validSchedules = schedules.filter((s) => !isScheduleExpired(s, now));
  if (validSchedules.length === 0) return null;

  // 2. Sort by startsAt ascending
  validSchedules.sort((a, b) => {
    const timeA = getScheduleStartTime(a) || 0;
    const timeB = getScheduleStartTime(b) || 0;
    return timeA - timeB;
  });

  // 3. Priority 1: Currently active schedule
  const activeSchedule = validSchedules.find((s) => isScheduleActive(s, now));
  if (activeSchedule) return activeSchedule;

  // 4. Priority 2: Nearest upcoming schedule
  return validSchedules[0] || null;
}

/**
 * Groups all schedules by chamber / hospital / rule, and returns strictly ONE schedule per chamber:
 * the active schedule (if ongoing) or the nearest upcoming schedule.
 * Automatically filters out all expired occurrences.
 */
export function getActiveOrNextSchedulesByChamber<T extends Schedule>(
  schedules: T[],
  now = Date.now()
): T[] {
  if (!Array.isArray(schedules) || schedules.length === 0) return [];

  // Group by chamber / hospital / rule identifier
  const chamberGroups = new Map<string, T[]>();

  for (const sched of schedules) {
    if (!sched || sched.scheduleStatus === "cancelled") continue;
    const chamberKey =
      sched.hospitalId ||
      (sched.hospital as any)?._id ||
      sched.hospital?.id ||
      sched.hospital?.name ||
      sched.ruleId ||
      sched.id;

    if (!chamberGroups.has(chamberKey)) {
      chamberGroups.set(chamberKey, []);
    }
    chamberGroups.get(chamberKey)!.push(sched);
  }

  const result: T[] = [];

  for (const group of chamberGroups.values()) {
    const single = getActiveOrNextSchedule(group, now);
    if (single) {
      result.push(single);
    }
  }

  // Sort results: Active sessions first, then sorted by startsAt ascending
  result.sort((a, b) => {
    const aActive = isScheduleActive(a, now);
    const bActive = isScheduleActive(b, now);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    const timeA = getScheduleStartTime(a) || 0;
    const timeB = getScheduleStartTime(b) || 0;
    return timeA - timeB;
  });

  return result;
}

export function generateSlots(schedule: Schedule): Slot[] {
  const slots: Slot[] = [];
  if (!schedule?.startsAt || !schedule?.endsAt) return slots;

  const start = new Date(schedule.startsAt);
  const end = new Date(schedule.endsAt);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
    return slots;
  }

  const durationMinutes = Math.max(5, Number(schedule.slotDurationMinutes || 10));
  const durationMs = durationMinutes * 60 * 1000;
  let queueNumber = 1;
  const maxSlots = schedule.maxAppointments && schedule.maxAppointments > 0 ? schedule.maxAppointments : 100;
  const bookedTimestamps = (schedule.bookedSlots ?? [])
    .map((s) => new Date(s).getTime())
    .filter((t) => !isNaN(t));

  for (let cursor = start.getTime(); cursor + durationMs <= end.getTime() && slots.length < maxSlots; cursor += durationMs) {
    const slotStart = new Date(cursor).toISOString();
    const isBooked = bookedTimestamps.some((t) => {
      return (t >= cursor && t < cursor + durationMs) || Math.abs(t - cursor) < 60000;
    });

    slots.push({
      start: slotStart,
      end: new Date(cursor + durationMs).toISOString(),
      available: !isBooked,
      queueNumber
    });
    queueNumber += 1;
  }

  return slots;
}

export function nextAvailableSlot(schedule: Schedule) {
  return generateSlots(schedule).find((slot) => slot.available);
}
