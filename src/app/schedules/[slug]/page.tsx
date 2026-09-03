import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CalendarClock, Clock3, MapPinned, Wallet } from "lucide-react";
import { AppointmentForm } from "@/components/booking/appointment-form";
import { SocialShare } from "@/components/seo/social-share";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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

  const displayTitle = schedule.title || schedule.hospital?.name || "Consultation Schedule";
  const hospitalName = schedule.hospital?.name;
  const hospitalAddress = schedule.hospital?.address || "Clinic Address";

  return (
    <main className="bg-cream min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_480px] xl:grid-cols-[1.15fr_520px]">
        <section>
          <Breadcrumbs items={[{ label: "Schedules", href: "/appointments" }, { label: displayTitle }]} />
          
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
            <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
            {websiteSetting.content.scheduleDetailBadge || "Chamber Details"}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[44px]">
            {displayTitle}
          </h1>

          {hospitalName && displayTitle !== hospitalName ? (
            <p className="mt-2 text-lg font-bold text-blue">{hospitalName}</p>
          ) : null}

          <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-muted">
            <MapPinned className="mt-1 h-5 w-5 shrink-0 text-ink" />
            <span>{hospitalAddress}</span>
          </p>

          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
            {[
              { icon: CalendarClock, label: "Session Starts", value: formatDateTime(schedule.startsAt) },
              { icon: Clock3, label: "Slot Interval", value: `${schedule.slotDurationMinutes || 10} minutes` },
              { icon: Wallet, label: "Consultation Fee", value: formatCurrency(schedule.fee) }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
                  <span className="grid size-10 place-items-center rounded-full bg-panel text-ink border border-line">
                    <Icon className="h-5 w-5 text-blue" />
                  </span>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{item.label}</p>
                  <p className="mt-1 font-bold text-ink text-base">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
              {websiteSetting.content.shareScheduleLabel || "Share Schedule Link"}
            </p>
            <SocialShare title={schedule.seo?.seoTitle || displayTitle} path={`/schedules/${schedule.slug}`} />
          </div>

          {schedule.hospital?.mapUrl ? (
            <div className="mt-8 overflow-hidden rounded-3xl border border-line shadow-sm">
              <iframe
                title={`${hospitalName || "Clinic"} map`}
                src={schedule.hospital.mapUrl}
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
          ) : null}
        </section>

        <AppointmentForm schedule={schedule} content={websiteSetting.content} initialPatient={patient} />
      </div>
    </main>
  );
}
