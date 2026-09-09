import { DoctorHero } from "@/components/sections/doctor-hero";
import { ChambersSection } from "@/components/sections/chambers-section";
import { ProfileDetails } from "@/components/sections/profile-details";
import { ScheduleList } from "@/components/sections/schedule-list";
import { getLandingPageData } from "@/lib/cms-data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getLandingPageData();
  return buildMetadata(data.doctor.seo);
}

function phoneHref(phone?: string) {
  const value = phone?.replace(/[^\d+]/g, "");
  return value ? `tel:${value}` : undefined;
}

export default async function HomePage() {
  const data = await getLandingPageData();
  const clinics = Array.from(
    new Map(
      data.schedules.map((schedule) => [
        `${schedule.hospital.name}-${schedule.hospital.address}`,
        schedule.hospital
      ])
    ).values()
  );

  return (
    <main>
      <DoctorHero doctor={data.doctor} content={data.websiteSetting.content} />
      <ChambersSection hospitals={data.hospitals} content={data.websiteSetting.content} doctorPhone={data.doctor.phone} />
      <ScheduleList schedules={data.schedules} content={data.websiteSetting.content} />
      <ProfileDetails doctor={data.doctor} testimonials={data.testimonials} gallery={data.gallery} content={data.websiteSetting.content} />
      
      {/* Contact & Chambers Section */}
      <section id="contact" className="bg-cream py-16 lg:py-20 border-t border-line">
        <div className="mx-auto max-w-[1340px] px-6">
          <div className="rounded-3xl border border-line bg-white p-8 md:p-12 shadow-md">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-1 text-xs font-semibold text-ink">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              {data.websiteSetting.content.contactBadge || "Chamber Information"}
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-ink md:text-3xl">
              {data.websiteSetting.content.contactTitle || "Hospital Chambers & Contact Info"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Visit during scheduled hours or call directly for emergency assistance.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(clinics.length > 0 ? clinics : [{ name: data.websiteSetting.siteName, address: data.websiteSetting.contactAddress, phone: data.websiteSetting.contactPhone }]).map((clinic) => {
                const phone = clinic.phone ?? data.doctor.phone;
                const href = phoneHref(phone);

                return (
                  <div key={`${clinic.name}-${clinic.address}`} className="rounded-2xl border border-line bg-panel p-6 shadow-sm transition hover:bg-white hover:shadow-md duration-200">
                    <h3 className="text-lg font-bold text-ink">{clinic.name}</h3>
                    <div className="mt-3 space-y-2 text-sm text-[#474747]">
                      <p>{clinic.address}</p>
                      {href ? (
                        <a href={href} className="inline-block font-semibold text-blue transition hover:underline">
                          {phone}
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
