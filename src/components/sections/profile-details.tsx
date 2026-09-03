import Image from "next/image";
import {
  Activity,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  GraduationCap
} from "lucide-react";
import type { Doctor, GalleryItem, Testimonial, WebsiteSetting } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GalleryStrip, TestimonialSlider } from "@/components/sections/profile-media";

export function ProfileDetails({
  doctor,
  testimonials,
  gallery,
  content
}: {
  doctor: Doctor;
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  content: WebsiteSetting["content"];
}) {
  const expertiseIcons = [GraduationCap, BriefcaseBusiness, Award, BookOpen];
  const serviceIcons = [HeartPulse, Activity, Stethoscope, CalendarCheck, UserCheck, Pill, BriefcaseBusiness, ShieldCheck];
  const blocks = [
    ["Qualifications", doctor.qualifications],
    ["Specialisations", doctor.specialisations],
    ["Languages Spoken", doctor.languages ?? []],
    ["Certifications", doctor.certifications ?? []],
    ["Hospital Affiliations", doctor.hospitalAffiliations ?? []],
    ["Professional Experience", doctor.experience],
    ["Honors & Awards", doctor.awards]
  ] as const;
  const profileFacts = [
    ["Designation", doctor.designation],
    ["Specialization", doctor.specialization],
    ["BMDC Registration", doctor.medicalRegistrationNumber],
    ["Clinical Practice", doctor.yearsOfExperience ? `${doctor.yearsOfExperience}+ years` : undefined],
    ["Chamber Fee", doctor.consultationFee ? `BDT ${doctor.consultationFee}` : undefined],
    ["Online Fee", doctor.onlineConsultationFee ? `BDT ${doctor.onlineConsultationFee}` : undefined]
  ].filter(([, value]) => value);

  return (
    <>
      {/* Services Section */}
      <section id="services" className="bg-panel py-16 lg:py-20 border-b border-line">
        <div className="mx-auto max-w-[1340px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              Clinical Expertise
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
              {content.servicesTitle || "Specialized Medical Services"}
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">
              {content.servicesDescription || "Comprehensive treatments and consultations delivered with modern healthcare standards."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {doctor.medicalServices.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <div
                  key={service.title}
                  className="flex flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <div>
                    <span className="grid size-12 place-items-center rounded-full bg-band text-ink border border-line">
                      <Icon className="h-6 w-6 text-blue" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-ink">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
                  </div>
                  <ul className="mt-5 space-y-2 border-t border-line pt-4 text-xs font-medium text-[#474747]">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[7px] text-white shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Doctor Section */}
      <section className="bg-cream py-16 lg:py-20 border-b border-line">
        <div className="mx-auto max-w-[1340px] px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-md">
              <Image
                src={doctor.aboutImageUrl || doctor.image}
                alt={`${doctor.name} professional portrait`}
                width={880}
                height={760}
                className="aspect-[4/3] w-full object-cover object-top"
              />
              <div className="p-6 bg-white border-t border-line">
                <p className="text-base font-extrabold text-ink">{doctor.name}</p>
                <p className="text-xs text-muted mt-0.5">{doctor.designation} &middot; {doctor.specialization}</p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
                <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
                Doctor Profile
              </div>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
                {doctor.aboutHeading || "Dedicated to Excellence in Patient Care"}
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#3c3c3c] sm:text-[16px]">
                {doctor.aboutBio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {profileFacts.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
                    <p className="mt-1 text-sm font-bold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {doctor.expertiseCards.map((card, index) => {
              const Icon = expertiseIcons[index % expertiseIcons.length];
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg duration-300"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-band text-ink border border-line">
                    <Icon className="h-5 w-5 text-blue" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">{card.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-xs font-medium text-muted">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-0.5 grid size-3.5 place-items-center rounded-full bg-blue text-[7px] text-white shrink-0">✓</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Credentials Blocks */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {blocks.map(([title, items]) => (
              items.length > 0 ? (
                <div
                  key={title}
                  className="rounded-2xl border border-line bg-white/90 p-5 shadow-sm transition hover:bg-white hover:shadow-md duration-200"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide text-ink">{title}</h3>
                  <ul className="mt-3 space-y-2 text-xs text-muted">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Media Section */}
      <section id="reviews" className="bg-panel py-16 lg:py-20 border-b border-line">
        <div className="mx-auto max-w-[1340px] px-6 space-y-16">
          <div>
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
                <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
                Verified Feedback
              </div>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
                {content.testimonialsTitle || "What Patients Say"}
              </h2>
              <p className="mt-2 text-sm text-muted">Read genuine feedback from verified consultations</p>
            </div>
            <div className="mt-10">
              <TestimonialSlider testimonials={testimonials} />
            </div>
          </div>

          <div id="gallery" className="pt-8 border-t border-line">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink">
                  <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
                  Clinical Gallery
                </div>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
                  {content.galleryTitle || "Chamber & Practice Gallery"}
                </h2>
              </div>
              <p className="max-w-md text-sm text-muted">
                {content.galleryDescription || "Glimpse of state-of-the-art diagnostic facilities and chambers."}
              </p>
            </div>
            <div className="mt-8">
              <GalleryStrip gallery={gallery} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
