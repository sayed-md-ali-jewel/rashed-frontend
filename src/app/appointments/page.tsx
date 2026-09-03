import { ScheduleList } from "@/components/sections/schedule-list";
import { getLandingPageData } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const data = await getLandingPageData();
  return (
    <main className="min-h-screen bg-cream">
      <section className="mx-auto max-w-[1340px] px-6 pt-14 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
          <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
          {data.websiteSetting.content.appointmentsBadge || "Available Sessions"}
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[48px]">
          {data.websiteSetting.content.appointmentsTitle || "Doctor Consultation Chambers"}
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
          {data.websiteSetting.content.appointmentsDescription || "Browse all upcoming consultation sessions across clinics and select your convenient serial slot."}
        </p>
      </section>
      <ScheduleList schedules={data.schedules} content={data.websiteSetting.content} />
    </main>
  );
}
