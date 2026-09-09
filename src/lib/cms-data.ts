import { gallery, doctor, schedules, testimonials, websiteSetting } from "./mock-data";
import { connectMongo, hasMongoUri } from "./mongodb";
import {
  AppointmentModel,
  DoctorModel,
  GalleryItemModel,
  ScheduleModel,
  TestimonialModel,
  WebsiteSettingModel
} from "./models";
import type { Doctor, GalleryItem, Hospital, Schedule, SEOFields, Testimonial, WebsiteSetting } from "./types";

type MongoDocument = {
  _id?: unknown;
  id?: unknown;
  [key: string]: unknown;
};

export type LandingPageData = {
  doctor: Doctor;
  schedules: Schedule[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  websiteSetting: WebsiteSetting;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      const record = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
      return asString(record.value, asString(record.label));
    })
    .filter((item) => item.length > 0);
}

function asDateString(value: unknown, fallback = new Date().toISOString()) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return fallback;
}

function documentId(item: MongoDocument) {
  return String(item._id ?? item.id ?? crypto.randomUUID());
}

function mapSeo(value: unknown, fallback: SEOFields): SEOFields {
  const seo = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  return {
    seoTitle: asString(seo.seoTitle, fallback.seoTitle),
    metaDescription: asString(seo.metaDescription, fallback.metaDescription),
    focusKeyword: asString(seo.focusKeyword, fallback.focusKeyword),
    canonicalUrl: asString(seo.canonicalUrl, fallback.canonicalUrl),
    ogTitle: asString(seo.ogTitle, fallback.ogTitle),
    ogDescription: asString(seo.ogDescription, fallback.ogDescription),
    ogImage: asString(seo.ogImage, fallback.ogImage),
    twitterTitle: asString(seo.twitterTitle, fallback.twitterTitle),
    twitterDescription: asString(seo.twitterDescription, fallback.twitterDescription),
    twitterImage: asString(seo.twitterImage, fallback.twitterImage),
    noIndex: typeof seo.noIndex === "boolean" ? seo.noIndex : fallback.noIndex,
    schema: typeof seo.schema === "object" && seo.schema !== null ? (seo.schema as Record<string, unknown>) : fallback.schema
  };
}

function mapDoctor(item: MongoDocument | null): Doctor {
  if (!item) return doctor;

  return {
    name: asString(item.name, doctor.name),
    title: asString(item.title, doctor.title),
    designation: asString(item.designation, doctor.designation),
    specialization: asString(item.specialization, doctor.specialization),
    medicalRegistrationNumber: asString(item.medicalRegistrationNumber, doctor.medicalRegistrationNumber),
    yearsOfExperience: asNumber(item.yearsOfExperience, doctor.yearsOfExperience ?? 0),
    onlineConsultationFee: asNumber(item.onlineConsultationFee, doctor.onlineConsultationFee ?? 0),
    languages: Array.isArray(item.languages) ? asStringArray(item.languages, doctor.languages ?? []) : (doctor.languages ?? []),
    certifications: Array.isArray(item.certifications) ? asStringArray(item.certifications, doctor.certifications ?? []) : (doctor.certifications ?? []),
    hospitalAffiliations: Array.isArray(item.hospitalAffiliations) ? asStringArray(item.hospitalAffiliations, doctor.hospitalAffiliations ?? []) : (doctor.hospitalAffiliations ?? []),
    contactInformation: asString(item.contactInformation, doctor.contactInformation),
    socialLinks:
      typeof item.socialLinks === "object" && item.socialLinks !== null
        ? (item.socialLinks as Doctor["socialLinks"])
        : doctor.socialLinks,
    biography: asString(item.biography, doctor.biography),
    heroBadge: asString(item.heroBadge, doctor.heroBadge),
    heroIntro: asString(item.heroIntro, doctor.heroIntro),
    heroCareTitle: asString(item.heroCareTitle, doctor.heroCareTitle),
    heroCareDescription: asString(item.heroCareDescription, doctor.heroCareDescription),
    heroStats:
      Array.isArray(item.heroStats) && item.heroStats.length > 0
        ? item.heroStats.map((stat) => stat as { label: string; value: string })
        : doctor.heroStats,
    aboutHeading: asString(item.aboutHeading, doctor.aboutHeading),
    aboutBio: Array.isArray(item.aboutBio) ? asStringArray(item.aboutBio, doctor.aboutBio) : doctor.aboutBio,
    aboutImageUrl: asString(item.aboutImageUrl, doctor.aboutImageUrl),
    expertiseCards:
      Array.isArray(item.expertiseCards) && item.expertiseCards.length > 0
        ? item.expertiseCards.map((card) => {
            const c = typeof card === "object" && card !== null ? (card as Record<string, unknown>) : {};
            return {
              title: asString(c.title, "Specialization"),
              items: asStringArray(c.items, [])
            };
          })
        : doctor.expertiseCards,
    medicalServices:
      Array.isArray(item.medicalServices) && item.medicalServices.length > 0
        ? item.medicalServices.map((service) => service as { title: string; description: string; items: string[] })
        : doctor.medicalServices,
    consultationFee: asNumber(item.consultationFee, doctor.consultationFee),
    phone: asString(item.phone, doctor.phone),
    whatsapp: asString(item.whatsapp, doctor.whatsapp),
    address: asString(item.address, doctor.address),
    image: asString(item.image, doctor.image),
    qualifications: Array.isArray(item.qualifications) ? asStringArray(item.qualifications, doctor.qualifications ?? []) : (doctor.qualifications ?? []),
    specialisations: Array.isArray(item.specialisations) ? asStringArray(item.specialisations, doctor.specialisations ?? []) : (doctor.specialisations ?? []),
    experience: Array.isArray(item.experience) ? asStringArray(item.experience, doctor.experience ?? []) : (doctor.experience ?? []),
    awards: Array.isArray(item.awards) ? asStringArray(item.awards, doctor.awards ?? []) : (doctor.awards ?? []),
    services: Array.isArray(item.services) ? asStringArray(item.services, doctor.services ?? []) : (doctor.services ?? []),
    seo: mapSeo(item.seo, doctor.seo)
  };
}

function mapHospital(value: unknown): Hospital {
  const item = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  const name = asString(item.name, "Clinic");
  const address = asString(item.address, "Address coming soon");
  const rawMapUrl = asString(item.mapUrl, asString(item.embeddedMapUrl, asString(item.googleMapsUrl)));
  const mapUrl =
    rawMapUrl && rawMapUrl.includes("output=embed")
      ? rawMapUrl
      : `https://www.google.com/maps?q=${encodeURIComponent(address || name)}&output=embed`;

  return {
    name,
    address,
    phone: asString(item.phone, undefined),
    mapUrl,
    latitude: asNumber(item.latitude, 23.8103),
    longitude: asNumber(item.longitude, 90.4125),
    image: asString(item.image),
    consultationFee: asNumber(item.consultationFee),
    active: typeof item.active === "boolean" ? item.active : true
  };
}

function mapSchedule(item: MongoDocument, bookedSlots: string[] = []): Schedule {
  const id = documentId(item);
  const hospital = mapHospital(item.hospital);
  const title = asString(item.title, `${hospital.name} Consultation`);
  const startsAt = asDateString(item.startsAt);
  const endsAt = asDateString(item.endsAt, new Date(new Date(startsAt).getTime() + 3 * 60 * 60 * 1000).toISOString());
  const maxAppointments =
    typeof item.maxAppointments === "number" && item.maxAppointments > 0 ? item.maxAppointments : undefined;

  const fallbackSeo = {
    seoTitle: `${title || hospital.name} Appointment | ${doctor.name}`,
    metaDescription: `Book an upcoming appointment schedule at ${hospital.name}.`
  };

  return {
    id,
    title,
    slug: asString(item.slug, id),
    hospital,
    startsAt,
    endsAt,
    slotDurationMinutes: asNumber(item.slotDurationMinutes, 10),
    maxAppointments,
    fee: asNumber(item.fee, doctor.consultationFee),
    bookedSlots,
    seo: mapSeo(item.seo, fallbackSeo)
  };
}

function mapTestimonial(item: MongoDocument): Testimonial {
  return {
    name: asString(item.name, "Patient"),
    quote: asString(item.quote, "Excellent consultation experience."),
    rating: asNumber(item.rating, 5)
  };
}

function mapGalleryItem(item: MongoDocument): GalleryItem {
  const images = asStringArray(item.images, []);
  const primaryImage = asString(item.image, images[0] || gallery[0]?.image);
  const resolvedImages = images.length > 0 ? images : [primaryImage].filter(Boolean);

  return {
    _id: item._id ? String(item._id) : undefined,
    id: item._id ? String(item._id) : undefined,
    title: asString(item.title, "Clinic Facility"),
    image: primaryImage,
    images: resolvedImages,
    alt: asString(item.alt, asString(item.altText, asString(item.title, "Clinic gallery image"))),
    altText: asString(item.altText, asString(item.alt, asString(item.title, "Clinic gallery image"))),
    category: asString(item.category, "Chamber"),
    description: asString(item.description, ""),
    active: item.active !== false
  };
}

function mapWebsiteSetting(item: MongoDocument | null): WebsiteSetting {
  if (!item) return websiteSetting;

  const content = typeof item.content === "object" && item.content !== null ? (item.content as Record<string, unknown>) : {};

  return {
    siteName: asString(item.siteName, websiteSetting.siteName),
    logo: asString(item.logo, websiteSetting.logo || ""),
    logoDark: asString(item.logoDark, websiteSetting.logoDark || ""),
    favicon: asString(item.favicon, websiteSetting.favicon || ""),
    appleTouchIcon: asString(item.appleTouchIcon, websiteSetting.appleTouchIcon || ""),
    footerDescription: asString(item.footerDescription, websiteSetting.footerDescription),
    contactPhone: asString(item.contactPhone, websiteSetting.contactPhone),
    contactEmail: asString(item.contactEmail, websiteSetting.contactEmail),
    contactAddress: asString(item.contactAddress, websiteSetting.contactAddress),
    facebookUrl: asString(item.facebookUrl, websiteSetting.facebookUrl),
    linkedinUrl: asString(item.linkedinUrl, websiteSetting.linkedinUrl),
    xUrl: asString(item.xUrl, websiteSetting.xUrl),
    youtubeUrl: asString(item.youtubeUrl, websiteSetting.youtubeUrl),
    telegramUrl: asString(item.telegramUrl, websiteSetting.telegramUrl),
    defaultSeo: mapSeo(
      item.defaultSeo,
      websiteSetting.defaultSeo ?? {
        seoTitle: websiteSetting.siteName,
        metaDescription: websiteSetting.footerDescription
      }
    ),
    content: Object.fromEntries(
      Object.entries(websiteSetting.content).map(([key, fallback]) => [key, asString(content[key], fallback)])
    ) as WebsiteSetting["content"]
  };
}

async function getBookedSlots(scheduleIds: string[]) {
  const appointments = await AppointmentModel.find({
    $or: [{ scheduleId: { $in: scheduleIds } }, { schedule: { $in: scheduleIds } }],
    status: { $ne: "cancelled" }
  })
    .select("scheduleId schedule slotStart")
    .lean<MongoDocument[]>();

  return appointments.reduce<Record<string, string[]>>((groups, item) => {
    const scheduleId = asString(item.scheduleId, asString(item.schedule));
    const slotStart = asDateString(item.slotStart);
    if (!scheduleId || !slotStart) return groups;
    groups[scheduleId] = [...(groups[scheduleId] ?? []), slotStart];
    return groups;
  }, {});
}

export function isUpcomingSchedule(schedule?: { startsAt?: string; endsAt?: string } | null): boolean {
  if (!schedule) return false;
  const now = Date.now();
  const end = schedule.endsAt ? new Date(schedule.endsAt).getTime() : NaN;
  const start = schedule.startsAt ? new Date(schedule.startsAt).getTime() : NaN;
  if (!isNaN(end)) return end >= now;
  if (!isNaN(start)) return start >= now;
  return false;
}

export async function getLandingPageData(): Promise<LandingPageData> {
  const upcomingFallbackSchedules = schedules.filter(isUpcomingSchedule);

  if (!hasMongoUri()) {
    return { doctor, schedules: upcomingFallbackSchedules, testimonials, gallery, websiteSetting };
  }

  try {
    await connectMongo();

    const [doctorItem, scheduleItems, testimonialItems, galleryItems, websiteSettingItem] = await Promise.all([
      DoctorModel.findOne().sort({ updatedAt: -1 }).lean<MongoDocument | null>(),
      ScheduleModel.find({ scheduleStatus: { $ne: "cancelled" } })
        .sort({ startsAt: 1 })
        .lean<MongoDocument[]>(),
      TestimonialModel.find({ active: { $ne: false } })
        .sort({ createdAt: -1 })
        .lean<MongoDocument[]>(),
      GalleryItemModel.find({ active: { $ne: false } })
        .sort({ createdAt: -1 })
        .lean<MongoDocument[]>(),
      WebsiteSettingModel.findOne().sort({ updatedAt: -1 }).lean<MongoDocument | null>()
    ]);

    const mappedSchedules = scheduleItems.map((item) => mapSchedule(item)).filter(isUpcomingSchedule);
    const bookedSlots = await getBookedSlots(mappedSchedules.map((item) => item.id));

    return {
      doctor: mapDoctor(doctorItem),
      schedules: mappedSchedules.map((item) => ({ ...item, bookedSlots: bookedSlots[item.id] ?? [] })),
      testimonials: testimonialItems.length > 0 ? testimonialItems.map(mapTestimonial) : testimonials,
      gallery: galleryItems.length > 0 ? galleryItems.map(mapGalleryItem) : gallery,
      websiteSetting: mapWebsiteSetting(websiteSettingItem)
    };
  } catch {
    return { doctor, schedules: upcomingFallbackSchedules, testimonials, gallery, websiteSetting };
  }
}

export async function getWebsiteSetting(): Promise<WebsiteSetting> {
  if (!hasMongoUri()) return websiteSetting;

  try {
    await connectMongo();
    const item = await WebsiteSettingModel.findOne().sort({ updatedAt: -1 }).lean<MongoDocument | null>();
    return mapWebsiteSetting(item);
  } catch {
    return websiteSetting;
  }
}

export async function getScheduleBySlug(slug: string): Promise<Schedule | null> {
  const fallback = schedules.find((schedule) => schedule.slug === slug) ?? null;

  if (!hasMongoUri()) {
    return fallback;
  }

  try {
    await connectMongo();

    const item = await ScheduleModel.findOne({ slug }).lean<MongoDocument | null>();
    if (!item) return fallback;

    const schedule = mapSchedule(item);
    const bookedSlots = await getBookedSlots([schedule.id]);
    return { ...schedule, bookedSlots: bookedSlots[schedule.id] ?? [] };
  } catch {
    return fallback;
  }
}

export async function getScheduleById(scheduleId: string): Promise<Schedule | null> {
  const fallback = schedules.find((schedule) => schedule.id === scheduleId) ?? null;

  if (!hasMongoUri()) {
    return fallback;
  }

  try {
    await connectMongo();

    const item = await ScheduleModel.findById(scheduleId).lean<MongoDocument | null>();
    if (!item) return fallback;

    const schedule = mapSchedule(item);
    const bookedSlots = await getBookedSlots([schedule.id]);
    return { ...schedule, bookedSlots: bookedSlots[schedule.id] ?? [] };
  } catch {
    return fallback;
  }
}
