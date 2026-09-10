import { AppointmentsHeader } from "@/components/sections/appointments-header";
import { ScheduleList } from "@/components/sections/schedule-list";
import { getLandingPageData } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const data = await getLandingPageData();
  return (
    <main className="min-h-screen bg-cream">
      <AppointmentsHeader content={data.websiteSetting.content} />
      <ScheduleList schedules={data.schedules} content={data.websiteSetting.content} />
    </main>
  );
}
