import { gallery, doctor, mockHospitals, schedules, testimonials, websiteSetting } from "./mock-data";
import { connectMongo, hasMongoUri } from "./mongodb";
import {
  AppointmentModel,
  DoctorModel,
  GalleryItemModel,
  HospitalModel,
  ScheduleModel,
  ServiceModel,
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
  hospitals: Hospital[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  websiteSetting: WebsiteSetting;
};

function asString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
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

function mapDoctor(item: MongoDocument | null, serviceItems: MongoDocument[] = []): Doctor {
  if (!item && (!serviceItems || serviceItems.length === 0)) return doctor;

  const doc = item || {};

  let resolvedServices = doctor.medicalServices;
  if (Array.isArray(serviceItems) && serviceItems.length > 0) {
    resolvedServices = serviceItems.map((s) => ({
      title: asString(s.name, asString(s.title, "Clinical Service")),
      description: asString(s.description, "Comprehensive clinical care and diagnostic consultations."),
      items: Array.isArray(s.items) && s.items.length > 0
        ? asStringArray(s.items, [])
        : [
            s.fee ? `Consultation Fee: ৳${s.fee}` : "Professional Care",
            "Personalized Diagnostic Assessment",
            "Continuous Follow-up Support"
          ]
    }));
  } else if (Array.isArray(doc.medicalServices) && doc.medicalServices.length > 0) {
    resolvedServices = doc.medicalServices.map((service: any) => ({
      title: asString(service.title, asString(service.name, "Clinical Service")),
      description: asString(service.description, "Comprehensive clinical care."),
      items: asStringArray(service.items, ["Personalized Care", "Diagnostic Assessment"])
    }));
  }

  return {
    name: asString(doc.name, doctor.name),
    title: asString(doc.title, doctor.title),
    designation: asString(doc.designation, doctor.designation),
    specialization: asString(doc.specialization, doctor.specialization),
    medicalRegistrationNumber: asString(doc.medicalRegistrationNumber, doctor.medicalRegistrationNumber),
    yearsOfExperience: asNumber(doc.yearsOfExperience, doctor.yearsOfExperience ?? 0),
    onlineConsultationFee: asNumber(doc.onlineConsultationFee, doctor.onlineConsultationFee ?? 0),
    languages: Array.isArray(doc.languages) ? asStringArray(doc.languages, doctor.languages ?? []) : (doctor.languages ?? []),
    certifications: Array.isArray(doc.certifications) ? asStringArray(doc.certifications, doctor.certifications ?? []) : (doctor.certifications ?? []),
    hospitalAffiliations: Array.isArray(doc.hospitalAffiliations) ? asStringArray(doc.hospitalAffiliations, doctor.hospitalAffiliations ?? []) : (doctor.hospitalAffiliations ?? []),
    contactInformation: asString(doc.contactInformation, doctor.contactInformation),
    socialLinks:
      typeof doc.socialLinks === "object" && doc.socialLinks !== null
        ? (doc.socialLinks as Doctor["socialLinks"])
        : doctor.socialLinks,
    biography: asString(doc.biography, doctor.biography),
    heroBadge: asString(doc.heroBadge, doctor.heroBadge),
    heroIntro: asString(doc.heroIntro, doctor.heroIntro),
    heroCareTitle: asString(doc.heroCareTitle, doctor.heroCareTitle),
    heroCareDescription: asString(doc.heroCareDescription, doctor.heroCareDescription),
    heroStats:
      Array.isArray(doc.heroStats) && doc.heroStats.length > 0
        ? doc.heroStats.map((stat) => stat as { label: string; value: string })
        : doctor.heroStats,
    aboutHeading: asString(doc.aboutHeading, doctor.aboutHeading),
    aboutBio: Array.isArray(doc.aboutBio) ? asStringArray(doc.aboutBio, doctor.aboutBio) : doctor.aboutBio,
    aboutImageUrl: asString(doc.aboutImageUrl, doctor.aboutImageUrl),
    expertiseCards:
      Array.isArray(doc.expertiseCards) && doc.expertiseCards.length > 0
        ? doc.expertiseCards.map((card) => {
            const c = typeof card === "object" && card !== null ? (card as Record<string, unknown>) : {};
            return {
              title: asString(c.title, "Specialization"),
              items: asStringArray(c.items, [])
            };
          })
        : doctor.expertiseCards,
    medicalServices: resolvedServices,
    consultationFee: asNumber(doc.consultationFee, doctor.consultationFee),
    phone: asString(doc.phone, doctor.phone),
    whatsapp: asString(doc.whatsapp, doctor.whatsapp),
    address: asString(doc.address, doctor.address),
    image: asString(doc.image, doctor.image),
    qualifications: Array.isArray(doc.qualifications) ? asStringArray(doc.qualifications, doctor.qualifications ?? []) : (doctor.qualifications ?? []),
    specialisations: Array.isArray(doc.specialisations) ? asStringArray(doc.specialisations, doctor.specialisations ?? []) : (doctor.specialisations ?? []),
    experience: Array.isArray(doc.experience) ? asStringArray(doc.experience, doctor.experience ?? []) : (doctor.experience ?? []),
    awards: Array.isArray(doc.awards) ? asStringArray(doc.awards, doctor.awards ?? []) : (doctor.awards ?? []),
    services: Array.isArray(doc.services) ? asStringArray(doc.services, doctor.services ?? []) : (doctor.services ?? []),
    seo: mapSeo(doc.seo, doctor.seo)
  };
}

function mapHospital(value: unknown): Hospital {
  const item = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  const name = asString(item.name, "Chamber Location");
  const address = asString(item.address, "Chamber address coming soon");
  const rawMapUrl = asString(item.mapUrl, asString(item.embeddedMapUrl, asString(item.googleMapsUrl)));
  const mapUrl =
    rawMapUrl && rawMapUrl.includes("output=embed")
      ? rawMapUrl
      : `https://www.google.com/maps?q=${encodeURIComponent(address || name)}&output=embed`;

  const rawVisitingDays = item.visitingDays;
  const visitingDays = Array.isArray(rawVisitingDays) && rawVisitingDays.length > 0
    ? asStringArray(rawVisitingDays, [])
    : (typeof rawVisitingDays === "string" && rawVisitingDays ? [rawVisitingDays] : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"]);

  return {
    _id: item._id ? String(item._id) : undefined,
    id: item._id ? String(item._id) : (item.id ? String(item.id) : undefined),
    name,
    address,
    phone: asString(item.phone, undefined),
    mapUrl,
    latitude: asNumber(item.latitude, 23.8103),
    longitude: asNumber(item.longitude, 90.4125),
    image: asString(item.image),
    consultationFee: asNumber(item.consultationFee, 1000),
    visitingDays,
    visitingHours: asString(item.visitingHours, "05:00 PM - 09:00 PM"),
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
    return { doctor, schedules: upcomingFallbackSchedules, hospitals: mockHospitals, testimonials, gallery, websiteSetting };
  }

  try {
    await connectMongo();

    const [doctorItem, scheduleItems, hospitalItems, testimonialItems, galleryItems, websiteSettingItem, serviceItems] = await Promise.all([
      DoctorModel.findOne().sort({ updatedAt: -1 }).lean<MongoDocument | null>(),
      ScheduleModel.find({ scheduleStatus: { $ne: "cancelled" } })
        .sort({ startsAt: 1 })
        .lean<MongoDocument[]>(),
      HospitalModel.find({ active: { $ne: false } })
        .sort({ createdAt: 1 })
        .lean<MongoDocument[]>(),
      TestimonialModel.find({ active: { $ne: false } })
        .sort({ createdAt: -1 })
        .lean<MongoDocument[]>(),
      GalleryItemModel.find({ active: { $ne: false } })
        .sort({ createdAt: -1 })
        .lean<MongoDocument[]>(),
      WebsiteSettingModel.findOne().sort({ updatedAt: -1 }).lean<MongoDocument | null>(),
      ServiceModel.find({ active: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean<MongoDocument[]>()
    ]);

    const mappedSchedules = scheduleItems.map((item) => mapSchedule(item)).filter(isUpcomingSchedule);
    const bookedSlots = await getBookedSlots(mappedSchedules.map((item) => item.id));

    const mappedHospitals = Array.isArray(hospitalItems) && hospitalItems.length > 0
      ? hospitalItems.map(mapHospital)
      : mappedSchedules.length > 0
        ? Array.from(new Map(mappedSchedules.filter((s) => s.hospital).map((s) => [s.hospital.name, s.hospital])).values())
        : mockHospitals;

    return {
      doctor: mapDoctor(doctorItem, serviceItems),
      schedules: mappedSchedules.map((item) => ({ ...item, bookedSlots: bookedSlots[item.id] ?? [] })),
      hospitals: mappedHospitals,
      testimonials: testimonialItems.length > 0 ? testimonialItems.map(mapTestimonial) : testimonials,
      gallery: galleryItems.length > 0 ? galleryItems.map(mapGalleryItem) : gallery,
      websiteSetting: mapWebsiteSetting(websiteSettingItem)
    };
  } catch {
    return { doctor, schedules: upcomingFallbackSchedules, hospitals: mockHospitals, testimonials, gallery, websiteSetting };
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
