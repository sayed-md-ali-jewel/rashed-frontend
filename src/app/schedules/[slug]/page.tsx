import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/booking/appointment-form";
import { ScheduleDetailsView } from "@/components/sections/schedule-details-view";
import { getScheduleBySlug, getWebsiteSetting } from "@/lib/cms-data";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parsePatientSession(value?: string) {
  if (!value) return undefined;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      fullName?: string;
      mobileNumber?: string;
      address?: string;
    };
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const schedule = await getScheduleBySlug(slug);
  if (!schedule) return {};

  const displayTitle = schedule.title || schedule.hospital?.name || "Consultation Schedule";
  const hospitalName = schedule.hospital?.name;
  const hospitalAddress = schedule.hospital?.address || "Clinic Chamber";
  const formattedDate = formatDateTime(schedule.startsAt);
  const fee = formatCurrency(schedule.fee);

  const title = `${displayTitle} | Doctor Appointment & Serial Booking`;
  const description = `Book consultation serial for ${displayTitle} (${hospitalName ? `${hospitalName}, ` : ""}${hospitalAddress}). Starts: ${formattedDate}. Slot duration: ${schedule.slotDurationMinutes || 10} mins. Consultation fee: ${fee}.`;

  return buildMetadata(schedule.seo, `/schedules/${slug}`, {
    title,
    description
  });
}

export default async function SchedulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const schedule = await getScheduleBySlug(slug);
  const websiteSetting = await getWebsiteSetting();
  if (!schedule) notFound();

  const cookieStore = await cookies();
  const patient = parsePatientSession(cookieStore.get("patient_session")?.value);

  return (
    <main className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_480px] xl:grid-cols-[1.15fr_520px]">
        <ScheduleDetailsView schedule={schedule} websiteSetting={websiteSetting} />
        <AppointmentForm schedule={schedule} content={websiteSetting.content} initialPatient={patient} />
      </div>
    </main>
  );
}
