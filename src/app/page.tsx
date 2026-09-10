import { DoctorHero } from "@/components/sections/doctor-hero";
import { ChambersSection } from "@/components/sections/chambers-section";
import { ProfileDetails } from "@/components/sections/profile-details";
import { ScheduleList } from "@/components/sections/schedule-list";
import { ContactSection } from "@/components/sections/contact-section";
import { getLandingPageData } from "@/lib/cms-data";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getLandingPageData();
  return buildMetadata(data.doctor.seo);
}

export default async function HomePage() {
  const data = await getLandingPageData();
  const schedules = Array.isArray(data.schedules) ? data.schedules : [];
  const hospitals = Array.isArray(data.hospitals) ? data.hospitals : [];
  const content = data.websiteSetting?.content || {};

  const clinics = Array.from(
    new Map(
      schedules
        .filter((schedule) => schedule && schedule.hospital && schedule.hospital.name)
        .map((schedule) => [
          `${schedule.hospital.name}-${schedule.hospital.address || ""}`,
          {
            name: schedule.hospital.name,
            address: schedule.hospital.address,
            phone: schedule.hospital.phone || data.doctor?.phone
          }
        ])
    ).values()
  );

  const defaultClinic = {
    name: data.websiteSetting?.siteName || "Medical Chamber",
    address: data.websiteSetting?.contactAddress || "Dhaka, Bangladesh",
    phone: data.websiteSetting?.contactPhone || data.doctor?.phone
  };

  return (
    <main>
      <DoctorHero doctor={data.doctor} content={content} />
      <ChambersSection hospitals={hospitals} content={content} doctorPhone={data.doctor?.phone} />
      <ScheduleList schedules={schedules} content={content} />
      <ProfileDetails doctor={data.doctor} testimonials={data.testimonials || []} gallery={data.gallery || []} content={content} />
      <ContactSection clinics={clinics} content={content} defaultClinic={defaultClinic} />
    </main>
  );
}
