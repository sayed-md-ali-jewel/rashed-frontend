import Link from "next/link";
import { CalendarClock, Clock3, MapPinned, Share2, Wallet } from "lucide-react";
import type { Schedule, WebsiteSetting } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { generateSlots, isUpcomingSchedule } from "@/lib/booking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ScheduleList({ schedules, content }: { schedules: Schedule[]; content: WebsiteSetting["content"] }) {
  const upcomingSchedules = schedules.filter(isUpcomingSchedule);
  const displaySchedules = upcomingSchedules.length > 0 ? upcomingSchedules : schedules;

  return (
    <section id="schedules" className="py-16 bg-white border-b border-line">
      <div className="mx-auto max-w-[1340px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              {content.scheduleBadge || "Available Sessions"}
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
              {content.scheduleTitle || "Consultation Schedules"}
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
              {content.scheduleDescription || "View upcoming chamber timings, locations, and book your verified serial slot directly."}
            </p>
          </div>
        </div>

        {displaySchedules.length === 0 ? (
          <Card className="mt-10 p-12 text-center rounded-2xl border border-line bg-panel">
            <CalendarClock className="mx-auto h-12 w-12 text-muted" />
            <h3 className="mt-4 text-xl font-bold text-ink">{content.scheduleEmptyTitle || "No active schedules"}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              {content.scheduleEmptyDescription || "Check back soon for new consultation chamber timings."}
            </p>
          </Card>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displaySchedules.map((schedule) => {
            const slots = generateSlots(schedule);
            const available = slots.filter((slot) => slot.available).length;
            const displayTitle = schedule.title || schedule.hospital?.name || "Consultation Schedule";
            const hospitalName = schedule.hospital?.name;
            const hospitalAddress = schedule.hospital?.address || "Address details at clinic";

            return (
              <div
                key={schedule.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant={available > 0 ? "success" : "warning"}>
                      {slots.length === 0 ? "Open for Visit" : available > 0 ? `${available} Slots Available` : "Session Full"}
                    </Badge>
                    <span className="text-xs font-semibold text-blue">
                      {schedule.slotDurationMinutes || 10}m intervals
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-snug text-ink">{displayTitle}</h3>
                  {hospitalName && displayTitle !== hospitalName ? (
                    <p className="mt-1 text-sm font-semibold text-blue">{hospitalName}</p>
                  ) : null}

                  <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
                    <MapPinned className="mt-1 h-4 w-4 shrink-0 text-ink" />
                    <span>{hospitalAddress}</span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-line bg-panel p-3">
                      <span className="block text-[11px] font-semibold text-muted">Session Date</span>
                      <span className="mt-1 block text-sm font-bold text-ink">{formatDateTime(schedule.startsAt)}</span>
                    </div>
                    <div className="rounded-xl border border-line bg-panel p-3">
                      <span className="block text-[11px] font-semibold text-muted">Consultation Fee</span>
                      <span className="mt-1 block text-sm font-bold text-ink">{formatCurrency(schedule.fee)}</span>
                    </div>
                  </div>
                </div>

                {schedule.hospital?.mapUrl ? (
                  <iframe
                    title={`${hospitalName || "Clinic"} map`}
                    src={schedule.hospital.mapUrl}
                    className="h-36 w-full border-y border-line"
                    loading="lazy"
                  />
                ) : null}

                <div className="flex items-center justify-between border-t border-line bg-cream p-5">
                  <span className="text-xs font-medium text-muted">
                    {slots.length > 0 ? `${available} of ${slots.length} available` : "Open queue"}
                  </span>
                  <Link href={`/schedules/${schedule.slug}`}>
                    <Button variant="gold" size="sm" className="gap-2">
                      {content.scheduleBookButton || "Select Slot"}
                      <span className="grid size-5 place-items-center rounded-full bg-ink">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
