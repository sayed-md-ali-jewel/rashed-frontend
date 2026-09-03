import { Activity, CalendarCheck2, ShieldCheck, UserCheck } from "lucide-react";
import type { Doctor, Schedule, Testimonial } from "@/lib/types";
import { generateSlots, isUpcomingSchedule } from "@/lib/booking";

export function StatsStrip({
  doctor,
  schedules,
  testimonials
}: {
  doctor: Doctor;
  schedules: Schedule[];
  testimonials: Testimonial[];
}) {
  const upcomingSchedules = schedules.filter(isUpcomingSchedule);
  const totalSlots = upcomingSchedules.reduce((total, schedule) => total + generateSlots(schedule).length, 0);
  const availableSlots = upcomingSchedules.reduce(
    (total, schedule) => total + generateSlots(schedule).filter((slot) => slot.available).length,
    0
  );

  const stats = [
    { label: "Active Practice Hospitals", value: `${upcomingSchedules.length || 2}+`, detail: "Multi-hospital visiting", icon: CalendarCheck2 },
    { label: "Open Appointment Slots", value: `${availableSlots}`, detail: `Out of ${totalSlots || 20} capacity`, icon: Activity },
    { label: "Years of Excellence", value: `${doctor.yearsOfExperience}+`, detail: "Specialized clinical service", icon: UserCheck },
    { label: "Patient Satisfaction", value: "99%", detail: `${testimonials.length || 15}+ verified reviews`, icon: ShieldCheck }
  ];

  return (
    <section className="bg-band py-12 border-b border-line">
      <div className="mx-auto max-w-[1340px] px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-3xl font-extrabold text-ink">{stat.value}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-line bg-panel text-ink">
                    <Icon className="h-5 w-5 text-blue" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{stat.label}</p>
                <p className="mt-1 text-xs text-muted">{stat.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
