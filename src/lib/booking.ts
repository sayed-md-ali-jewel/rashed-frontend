import type { Schedule } from "./types";

export type Slot = {
  start: string;
  end: string;
  available: boolean;
  queueNumber: number;
};

export function isUpcomingSchedule(schedule?: { startsAt?: string; endsAt?: string } | null): boolean {
  if (!schedule) return false;
  const now = Date.now();
  const end = schedule.endsAt ? new Date(schedule.endsAt).getTime() : NaN;
  const start = schedule.startsAt ? new Date(schedule.startsAt).getTime() : NaN;
  if (!isNaN(end)) return end >= now;
  if (!isNaN(start)) return start >= now;
  return false;
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
