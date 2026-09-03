import { doctor, gallery, schedules, testimonials, websiteSetting } from "./mock-data";
import type { Doctor, GalleryItem, Hospital, Schedule, SEOFields, Testimonial, WebsiteSetting } from "./types";

function getStrapiUrl(): string {
  return (
    process.env.STRAPI_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://127.0.0.1:1337"
  ).replace(/\/$/, "");
}

function getStrapiToken(): string {
  return process.env.STRAPI_API_TOKEN ?? "";
}

type AnyRecord = Record<string, unknown>;

const doctorProfilePopulate =
  "/doctor-profile" +
  "?populate[heroSection][populate][heroStats]=true" +
  "&populate[heroSection][populate][image]=true" +
  "&populate[aboutSection][populate][aboutBio]=true" +
  "&populate[aboutSection][populate][aboutImage]=true" +
  "&populate[servicesSection][populate][medicalServices]=true" +
  "&populate[servicesSection][populate][services]=true" +
  "&populate[profileDetailsSection][populate][languages]=true" +
  "&populate[profileDetailsSection][populate][certifications]=true" +
  "&populate[profileDetailsSection][populate][hospitalAffiliations]=true" +
  "&populate[profileDetailsSection][populate][expertiseCards]=true" +
  "&populate[profileDetailsSection][populate][qualifications]=true" +
  "&populate[profileDetailsSection][populate][specialisations]=true" +
  "&populate[profileDetailsSection][populate][experience]=true" +
  "&populate[profileDetailsSection][populate][awards]=true" +
  "&populate[contactSection][populate][socialLinks]=true" +
  "&populate[seo][populate]=*";

const websiteSettingPopulate =
  "/website-setting" +
  "?populate[brandSection]=true" +
  "&populate[socialLinksSection]=true" +
  "&populate[contactSection]=true" +
  "&populate[heroSection]=true" +
  "&populate[schedulesSection]=true" +
  "&populate[appointmentSection]=true" +
  "&populate[profileSection]=true" +
  "&populate[mediaSection]=true" +
  "&populate[contactCtaSection]=true" +
  "&populate[defaultSeo][populate]=*";

export function hasStrapiConfig() {
  const url = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  return Boolean(url && url.length > 0);
}

function apiUrl(path: string) {
  const base = getStrapiUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${cleanPath}`;
}

function assetUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = getStrapiUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function strapiFetch<T>(path: string): Promise<T> {
  const token = getStrapiToken();
  const response = await fetch(apiUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function unwrap(item: unknown): AnyRecord {
  const value = typeof item === "object" && item !== null ? item as AnyRecord : {};
  const attributes = typeof value.attributes === "object" && value.attributes !== null ? value.attributes as AnyRecord : {};
  return { ...value, ...attributes };
}

function unwrapData(payload: unknown): AnyRecord[] {
  const root = typeof payload === "object" && payload !== null ? payload as AnyRecord : {};
  const data = root.data;
  if (Array.isArray(data)) return data.map(unwrap);
  if (data) return [unwrap(data)];
  return [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return typeof numeric === "number" && Number.isFinite(numeric) ? numeric : fallback;
}

function asArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;

  const items = value.map((item) => {
    if (typeof item === "string") return item;

    const record = unwrap(item);
    return asString(record.title, asString(record.value, asString(record.label)));
  }).filter((item) => item.length > 0);

  return items.length > 0 ? items : fallback;
}

function asRecords(value: unknown): AnyRecord[] {
  return Array.isArray(value) ? value.map(unwrap) : [];
}

function mapSocialLinks(value: unknown, fallback: Doctor["socialLinks"]): Doctor["socialLinks"] {
  if (Array.isArray(value)) {
    return value.reduce<NonNullable<Doctor["socialLinks"]>>((links, item) => {
      const record = unwrap(item);
      const label = asString(record.label).toLowerCase();
      const url = asString(record.value);

      if (!url) return links;
      if (label === "facebook") links.facebook = url;
      if (label === "linkedin") links.linkedin = url;
      if (label === "x" || label === "twitter") links.x = url;
      if (label === "youtube") links.youtube = url;

      return links;
    }, { ...fallback });
  }

  return typeof value === "object" && value !== null ? value as Doctor["socialLinks"] : fallback;
}

function mediaUrl(value: unknown, fallback = "") {
  const item = unwrap(value);
  const data = "data" in item ? unwrap(item.data) : item;
  const formats = typeof data.formats === "object" && data.formats !== null ? data.formats as AnyRecord : {};
  const large = typeof formats.large === "object" && formats.large !== null ? formats.large as AnyRecord : {};
  return assetUrl(asString(large.url, asString(data.url, fallback)));
}

function mapSeo(value: unknown, fallback: SEOFields): SEOFields {
  const seo = unwrap(value);
  return {
    seoTitle: asString(seo.seoTitle, fallback.seoTitle),
    metaDescription: asString(seo.metaDescription, fallback.metaDescription),
    focusKeyword: asString(seo.focusKeyword, fallback.focusKeyword),
    canonicalUrl: asString(seo.canonicalUrl, fallback.canonicalUrl),
    ogTitle: asString(seo.ogTitle, fallback.ogTitle),
    ogDescription: asString(seo.ogDescription, fallback.ogDescription),
    ogImage: mediaUrl(seo.ogImage, fallback.ogImage),
    twitterTitle: asString(seo.twitterTitle, fallback.twitterTitle),
    twitterDescription: asString(seo.twitterDescription, fallback.twitterDescription),
    twitterImage: mediaUrl(seo.twitterImage, fallback.twitterImage),
    noIndex: seo.indexing === "noindex" || seo.noIndex === true,
    schema: typeof seo.jsonLdSchema === "object" && seo.jsonLdSchema !== null
      ? seo.jsonLdSchema as Record<string, unknown>
      : fallback.schema
  };
}

function mapDoctor(item: AnyRecord): Doctor {
  const heroSection = unwrap(item.heroSection);
  const aboutSection = unwrap(item.aboutSection);
  const servicesSection = unwrap(item.servicesSection);
  const profileDetailsSection = unwrap(item.profileDetailsSection);
  const contactSection = unwrap(item.contactSection);

  const image = mediaUrl(heroSection.image ?? item.image, asString(heroSection.imageUrl, asString(item.imageUrl, doctor.image)));
  const aboutImageUrl = mediaUrl(
    aboutSection.aboutImage ?? item.aboutImage,
    asString(aboutSection.aboutImageUrl, asString(item.aboutImageUrl, doctor.aboutImageUrl))
  );

  return {
    ...doctor,
    name: asString(heroSection.name, asString(item.name, doctor.name)),
    title: asString(heroSection.title, asString(item.title, doctor.title)),
    designation: asString(profileDetailsSection.designation, asString(item.designation, doctor.designation)),
    specialization: asString(profileDetailsSection.specialization, asString(item.specialization, doctor.specialization)),
    medicalRegistrationNumber: asString(profileDetailsSection.medicalRegistrationNumber, asString(item.medicalRegistrationNumber, doctor.medicalRegistrationNumber)),
    yearsOfExperience: asNumber(profileDetailsSection.yearsOfExperience, asNumber(item.yearsOfExperience, doctor.yearsOfExperience)),
    onlineConsultationFee: asNumber(profileDetailsSection.onlineConsultationFee, asNumber(item.onlineConsultationFee, doctor.onlineConsultationFee)),
    languages: asArray(profileDetailsSection.languages ?? item.languages, doctor.languages),
    certifications: asArray(profileDetailsSection.certifications ?? item.certifications, doctor.certifications),
    hospitalAffiliations: asArray(profileDetailsSection.hospitalAffiliations ?? item.hospitalAffiliations, doctor.hospitalAffiliations),
    contactInformation: asString(contactSection.contactInformation, asString(item.contactInformation, doctor.contactInformation)),
    socialLinks: mapSocialLinks(contactSection.socialLinks ?? item.socialLinks, doctor.socialLinks),
    biography: asString(profileDetailsSection.biography, asString(item.biography, doctor.biography)),
    heroBadge: asString(heroSection.heroBadge, asString(item.heroBadge, doctor.heroBadge)),
    heroIntro: asString(heroSection.heroIntro, asString(item.heroIntro, doctor.heroIntro)),
    heroCareTitle: asString(heroSection.heroCareTitle, asString(item.heroCareTitle, doctor.heroCareTitle)),
    heroCareDescription: asString(heroSection.heroCareDescription, asString(item.heroCareDescription, doctor.heroCareDescription)),
    heroStats: Array.isArray(heroSection.heroStats ?? item.heroStats)
      ? asRecords(heroSection.heroStats ?? item.heroStats).map((stat) => ({ label: asString(stat.label), value: asString(stat.value) }))
      : doctor.heroStats,
    aboutHeading: asString(aboutSection.aboutHeading, asString(item.aboutHeading, doctor.aboutHeading)),
    aboutBio: asArray(aboutSection.aboutBio ?? item.aboutBio, doctor.aboutBio),
    aboutImageUrl,
    expertiseCards: Array.isArray(profileDetailsSection.expertiseCards ?? item.expertiseCards) ? asRecords(profileDetailsSection.expertiseCards ?? item.expertiseCards).map((card) => {
      const value = unwrap(card);
      return { title: asString(value.title), items: asArray(value.items) };
    }) : doctor.expertiseCards,
    medicalServices: Array.isArray(servicesSection.medicalServices ?? item.medicalServices) ? asRecords(servicesSection.medicalServices ?? item.medicalServices).map((service) => {
      const value = unwrap(service);
      return { title: asString(value.title), description: asString(value.description), items: asArray(value.items) };
    }) : doctor.medicalServices,
    consultationFee: asNumber(servicesSection.consultationFee, asNumber(item.consultationFee, doctor.consultationFee)),
    phone: asString(contactSection.phone, asString(item.phone, doctor.phone)),
    whatsapp: asString(contactSection.whatsapp, asString(item.whatsapp, doctor.whatsapp)),
    address: asString(contactSection.address, asString(item.address, doctor.address)),
    image,
    qualifications: asArray(profileDetailsSection.qualifications ?? item.qualifications, doctor.qualifications),
    specialisations: asArray(profileDetailsSection.specialisations ?? item.specialisations, doctor.specialisations),
    experience: asArray(profileDetailsSection.experience ?? item.experience, doctor.experience),
    awards: asArray(profileDetailsSection.awards ?? item.awards, doctor.awards),
    services: asArray(servicesSection.services ?? item.services, doctor.services),
    seo: mapSeo(item.seo, doctor.seo)
  };
}

function mapHospital(value: unknown): Hospital {
  const item = unwrap(value);
  const name = asString(item.name, "Clinic");
  const address = asString(item.address, "Address coming soon");
  const embeddedMap = asString(item.embeddedMapUrl);
  const explicitMap = asString(item.mapUrl);
  const googleMap = asString(item.googleMapsUrl);
  const mapUrl =
    explicitMap ||
    embeddedMap ||
    (googleMap && googleMap.includes("output=embed")
      ? googleMap
      : `https://www.google.com/maps?q=${encodeURIComponent(address || name)}&output=embed`);
  const image = mediaUrl(item.image, asString(item.imageUrl));

  return {
    name,
    address,
    phone: asString(item.phone),
    mapUrl,
    latitude: asNumber(item.latitude, 23.8103),
    longitude: asNumber(item.longitude, 90.4125),
    image,
    consultationFee: asNumber(item.consultationFee),
    active: typeof item.active === "boolean" ? item.active : true
  };
}

function mapSchedule(item: AnyRecord, bookedSlots: string[] = []): Schedule {
  const id = String(item.id ?? item.documentId ?? item.slug ?? crypto.randomUUID());
  const hospital = mapHospital(item.hospital);
  const title = asString(item.title, `${hospital.name} Consultation`);
  const startsAt = asString(item.startsAt, new Date().toISOString());
  const endsAt = asString(item.endsAt, new Date(new Date(startsAt).getTime() + 3 * 60 * 60 * 1000).toISOString());
  const slotDurationMinutes = asNumber(item.slotDurationMinutes, 10);
  const maxAppointments = typeof item.maxAppointments === "number" && item.maxAppointments > 0 ? item.maxAppointments : undefined;

  return {
    id,
    title,
    slug: asString(item.slug, id),
    hospital,
    startsAt,
    endsAt,
    slotDurationMinutes,
    maxAppointments,
    fee: asNumber(item.fee, hospital.consultationFee ?? doctor.consultationFee),
    bookedSlots,
    seo: mapSeo(item.seo, {
      seoTitle: `${title || hospital.name} Appointment | ${doctor.name}`,
      metaDescription: `Book an upcoming appointment schedule at ${hospital.name}.`
    })
  };
}

function mapWebsiteSetting(item: AnyRecord): WebsiteSetting {
  const content = typeof item.content === "object" && item.content !== null ? item.content as Record<string, string> : {};
  const brandSection = unwrap(item.brandSection);
  const socialLinksSection = unwrap(item.socialLinksSection);
  const contactSection = unwrap(item.contactSection);
  const heroSection = unwrap(item.heroSection);
  const schedulesSection = unwrap(item.schedulesSection);
  const appointmentSection = unwrap(item.appointmentSection);
  const profileSection = unwrap(item.profileSection);
  const mediaSection = unwrap(item.mediaSection);
  const contactCtaSection = unwrap(item.contactCtaSection);

  const rawSiteName = asString(brandSection.siteName, asString(item.siteName, websiteSetting.siteName));
  const siteName = (!rawSiteName || rawSiteName === "DoctorCare") ? "Dr. Rashed" : rawSiteName;

  return {
    ...websiteSetting,
    siteName,
    footerDescription: asString(brandSection.footerDescription, asString(item.footerDescription, websiteSetting.footerDescription)),
    contactPhone: asString(contactSection.contactPhone, asString(item.contactPhone, websiteSetting.contactPhone)),
    contactEmail: asString(contactSection.contactEmail, asString(item.contactEmail, websiteSetting.contactEmail)),
    contactAddress: asString(contactSection.contactAddress, asString(item.contactAddress, websiteSetting.contactAddress)),
    facebookUrl: asString(socialLinksSection.facebookUrl, asString(item.facebookUrl, websiteSetting.facebookUrl)),
    linkedinUrl: asString(socialLinksSection.linkedinUrl, asString(item.linkedinUrl, websiteSetting.linkedinUrl)),
    xUrl: asString(socialLinksSection.xUrl, asString(item.xUrl, websiteSetting.xUrl)),
    youtubeUrl: asString(socialLinksSection.youtubeUrl, asString(item.youtubeUrl, websiteSetting.youtubeUrl)),
    telegramUrl: asString(socialLinksSection.telegramUrl, asString(item.telegramUrl, websiteSetting.telegramUrl)),
    defaultSeo: mapSeo(item.defaultSeo, websiteSetting.defaultSeo ?? doctor.seo),
    content: {
      ...websiteSetting.content,
      ...content,
      heroPrimaryCta: asString(heroSection.heroPrimaryCta, asString(content.heroPrimaryCta, websiteSetting.content.heroPrimaryCta)),
      heroSecondaryCta: asString(heroSection.heroSecondaryCta, asString(content.heroSecondaryCta, websiteSetting.content.heroSecondaryCta)),
      scheduleBadge: asString(schedulesSection.scheduleBadge, asString(content.scheduleBadge, websiteSetting.content.scheduleBadge)),
      scheduleTitle: asString(schedulesSection.scheduleTitle, asString(content.scheduleTitle, websiteSetting.content.scheduleTitle)),
      scheduleDescription: asString(schedulesSection.scheduleDescription, asString(content.scheduleDescription, websiteSetting.content.scheduleDescription)),
      scheduleEmptyTitle: asString(schedulesSection.scheduleEmptyTitle, asString(content.scheduleEmptyTitle, websiteSetting.content.scheduleEmptyTitle)),
      scheduleEmptyDescription: asString(schedulesSection.scheduleEmptyDescription, asString(content.scheduleEmptyDescription, websiteSetting.content.scheduleEmptyDescription)),
      scheduleBookButton: asString(schedulesSection.scheduleBookButton, asString(content.scheduleBookButton, websiteSetting.content.scheduleBookButton)),
      scheduleDetailBadge: asString(schedulesSection.scheduleDetailBadge, asString(content.scheduleDetailBadge, websiteSetting.content.scheduleDetailBadge)),
      shareScheduleLabel: asString(schedulesSection.shareScheduleLabel, asString(content.shareScheduleLabel, websiteSetting.content.shareScheduleLabel)),
      appointmentsBadge: asString(appointmentSection.appointmentsBadge, asString(content.appointmentsBadge, websiteSetting.content.appointmentsBadge)),
      appointmentsTitle: asString(appointmentSection.appointmentsTitle, asString(content.appointmentsTitle, websiteSetting.content.appointmentsTitle)),
      appointmentsDescription: asString(appointmentSection.appointmentsDescription, asString(content.appointmentsDescription, websiteSetting.content.appointmentsDescription)),
      appointmentFormBadge: asString(appointmentSection.appointmentFormBadge, asString(content.appointmentFormBadge, websiteSetting.content.appointmentFormBadge)),
      appointmentFormTitle: asString(appointmentSection.appointmentFormTitle, asString(content.appointmentFormTitle, websiteSetting.content.appointmentFormTitle)),
      appointmentFormDescription: asString(appointmentSection.appointmentFormDescription, asString(content.appointmentFormDescription, websiteSetting.content.appointmentFormDescription)),
      patientNameLabel: asString(appointmentSection.patientNameLabel, asString(content.patientNameLabel, websiteSetting.content.patientNameLabel)),
      patientNamePlaceholder: asString(appointmentSection.patientNamePlaceholder, asString(content.patientNamePlaceholder, websiteSetting.content.patientNamePlaceholder)),
      patientAddressLabel: asString(appointmentSection.patientAddressLabel, asString(content.patientAddressLabel, websiteSetting.content.patientAddressLabel ?? "Address")),
      patientAddressPlaceholder: asString(appointmentSection.patientAddressPlaceholder, asString(content.patientAddressPlaceholder, websiteSetting.content.patientAddressPlaceholder ?? "Patient address")),
      patientMobileLabel: asString(appointmentSection.patientMobileLabel, asString(content.patientMobileLabel, websiteSetting.content.patientMobileLabel)),
      patientMobilePlaceholder: asString(appointmentSection.patientMobilePlaceholder, asString(content.patientMobilePlaceholder, websiteSetting.content.patientMobilePlaceholder)),
      patientSlotLabel: asString(appointmentSection.patientSlotLabel, asString(content.patientSlotLabel, websiteSetting.content.patientSlotLabel)),
      patientSlotPlaceholder: asString(appointmentSection.patientSlotPlaceholder, asString(content.patientSlotPlaceholder, websiteSetting.content.patientSlotPlaceholder)),
      appointmentSubmitButton: asString(appointmentSection.appointmentSubmitButton, asString(content.appointmentSubmitButton, websiteSetting.content.appointmentSubmitButton)),
      appointmentValidationMessage: asString(appointmentSection.appointmentValidationMessage, asString(content.appointmentValidationMessage, websiteSetting.content.appointmentValidationMessage)),
      appointmentSuccessMessage: asString(appointmentSection.appointmentSuccessMessage, asString(content.appointmentSuccessMessage, websiteSetting.content.appointmentSuccessMessage)),
      appointmentApprovedMessage: asString(appointmentSection.appointmentApprovedMessage, asString(content.appointmentApprovedMessage, websiteSetting.content.appointmentApprovedMessage)),
      appointmentCancelledMessage: asString(appointmentSection.appointmentCancelledMessage, asString(content.appointmentCancelledMessage, websiteSetting.content.appointmentCancelledMessage)),
      servicesTitle: asString(profileSection.servicesTitle, asString(content.servicesTitle, websiteSetting.content.servicesTitle)),
      servicesDescription: asString(profileSection.servicesDescription, asString(content.servicesDescription, websiteSetting.content.servicesDescription)),
      profileBadge: asString(profileSection.profileBadge, asString(content.profileBadge, websiteSetting.content.profileBadge)),
      profileTitle: asString(profileSection.profileTitle, asString(content.profileTitle, websiteSetting.content.profileTitle)),
      testimonialsBadge: asString(mediaSection.testimonialsBadge, asString(content.testimonialsBadge, websiteSetting.content.testimonialsBadge)),
      testimonialsTitle: asString(mediaSection.testimonialsTitle, asString(content.testimonialsTitle, websiteSetting.content.testimonialsTitle)),
      galleryBadge: asString(mediaSection.galleryBadge, asString(content.galleryBadge, websiteSetting.content.galleryBadge)),
      galleryTitle: asString(mediaSection.galleryTitle, asString(content.galleryTitle, websiteSetting.content.galleryTitle)),
      galleryDescription: asString(mediaSection.galleryDescription, asString(content.galleryDescription, websiteSetting.content.galleryDescription)),
      contactBadge: asString(contactCtaSection.contactBadge, asString(content.contactBadge, websiteSetting.content.contactBadge)),
      contactTitle: asString(contactCtaSection.contactTitle, asString(content.contactTitle, websiteSetting.content.contactTitle))
    }
  };
}

async function getBookedSlots(scheduleIds: string[]) {
  if (scheduleIds.length === 0) return {};
  try {
    const payload = await strapiFetch<unknown>("/appointments?pagination[pageSize]=200&populate=*");
    const appointments = unwrapData(payload);

    const groups: Record<string, string[]> = {};

    for (const appointment of appointments) {
      const scheduleRaw = appointment.schedule;
      const schedule = unwrap(scheduleRaw);
      const scheduleDocId = asString(schedule.documentId, typeof scheduleRaw === "string" ? scheduleRaw : "");
      const scheduleNumId = schedule.id !== undefined && schedule.id !== null ? String(schedule.id) : "";
      const scheduleSlug = asString(schedule.slug);
      const directScheduleId = asString(appointment.scheduleId);
      const slotStart = asString(appointment.slotStart);
      const status = asString(appointment.appointmentStatus, asString(appointment.status, "pending")).toLowerCase();

      // Only cancelled appointments do NOT reserve slots
      if (status === "cancelled" || !slotStart) continue;

      const slotIso = new Date(slotStart).toISOString();

      const candidateKeys = new Set<string>(
        [scheduleDocId, scheduleNumId, scheduleSlug, directScheduleId].filter(Boolean)
      );

      for (const key of candidateKeys) {
        groups[key] = [...(groups[key] ?? []), slotIso];
      }

      for (const reqId of scheduleIds) {
        if (candidateKeys.has(reqId)) {
          groups[reqId] = [...(groups[reqId] ?? []), slotIso];
        }
      }
    }

    return groups;
  } catch {
    return {};
  }
}

export async function getStrapiLandingPageData() {
  const [doctorPayload, schedulesPayload, testimonialPayload, galleryPayload, settingsPayload] = await Promise.all([
    strapiFetch<unknown>(doctorProfilePopulate),
    strapiFetch<unknown>("/schedules?filters[scheduleStatus][$ne]=cancelled&sort[0]=startsAt:asc&populate=*"),
    strapiFetch<unknown>("/testimonials?sort[0]=createdAt:desc"),
    strapiFetch<unknown>("/gallery-items?sort[0]=createdAt:desc&populate=image"),
    strapiFetch<unknown>(websiteSettingPopulate)
  ]);

  const rawSchedules = unwrapData(schedulesPayload);
  const mappedSchedules = rawSchedules.map((item) => mapSchedule(item));
  const upcomingSchedules = mappedSchedules.filter((schedule) => {
    const end = new Date(schedule.endsAt).getTime();
    const start = new Date(schedule.startsAt).getTime();
    const now = Date.now();
    return (!isNaN(end) && end >= now) || (!isNaN(start) && start >= now);
  });
  const schedulesToDisplay = upcomingSchedules.length > 0 ? upcomingSchedules : mappedSchedules;

  const allScheduleKeys = new Set<string>();
  rawSchedules.forEach((item: any) => {
    if (item.id !== undefined) allScheduleKeys.add(String(item.id));
    if (item.documentId) allScheduleKeys.add(String(item.documentId));
    if (item.slug) allScheduleKeys.add(String(item.slug));
  });

  const bookedSlots = allScheduleKeys.size > 0 ? await getBookedSlots(Array.from(allScheduleKeys)) : {};

  return {
    doctor: mapDoctor(unwrapData(doctorPayload)[0] ?? {}),
    schedules: schedulesToDisplay.map((schedule, index) => {
      const rawItem = rawSchedules[index] as any;
      const docId = rawItem ? asString(rawItem.documentId) : "";
      const numId = rawItem && rawItem.id !== undefined ? String(rawItem.id) : "";
      const combined = Array.from(
        new Set([
          ...(bookedSlots[schedule.id] ?? []),
          ...(docId ? bookedSlots[docId] ?? [] : []),
          ...(numId ? bookedSlots[numId] ?? [] : []),
          ...(schedule.slug ? bookedSlots[schedule.slug] ?? [] : [])
        ])
      );
      return { ...schedule, bookedSlots: combined };
    }),
    testimonials: unwrapData(testimonialPayload).map((item): Testimonial => ({
      name: asString(item.name, "Patient"),
      quote: asString(item.quote, "Excellent consultation experience."),
      rating: asNumber(item.rating, 5)
    })),
    gallery: unwrapData(galleryPayload).map((item): GalleryItem => ({
      title: asString(item.title, "Clinic photo"),
      image: mediaUrl(item.image, gallery[0]?.image),
      alt: asString(item.alt, asString(item.title, "Clinic gallery image"))
    })),
    websiteSetting: mapWebsiteSetting(unwrapData(settingsPayload)[0] ?? {})
  };
}

export async function getStrapiScheduleBySlug(slug: string) {
  const query = new URLSearchParams({
    "filters[$or][0][slug][$eq]": String(slug),
    "filters[$or][1][documentId][$eq]": String(slug),
    "populate": "*"
  });
  const idNum = Number(slug);
  if (!isNaN(idNum) && Number.isInteger(idNum)) {
    query.set("filters[$or][2][id][$eq]", String(idNum));
  }
  const payload = await strapiFetch<unknown>(`/schedules?${query.toString()}`);
  const item = unwrapData(payload)[0];
  if (!item) return null;
  const schedule = mapSchedule(item);

  const docId = asString((item as any).documentId);
  const numId = item.id !== undefined ? String(item.id) : "";
  const scheduleSlug = asString(schedule.slug);

  const keysToQuery = Array.from(new Set([schedule.id, docId, numId, scheduleSlug].filter(Boolean)));
  const bookedSlotsMap = await getBookedSlots(keysToQuery);

  const allBooked = Array.from(
    new Set([
      ...(bookedSlotsMap[schedule.id] ?? []),
      ...(docId ? bookedSlotsMap[docId] ?? [] : []),
      ...(numId ? bookedSlotsMap[numId] ?? [] : []),
      ...(scheduleSlug ? bookedSlotsMap[scheduleSlug] ?? [] : [])
    ])
  );

  return { ...schedule, bookedSlots: allBooked };
}

export async function getStrapiScheduleById(scheduleId: string) {
  const query = new URLSearchParams({
    "filters[$or][0][documentId][$eq]": String(scheduleId),
    "filters[$or][1][slug][$eq]": String(scheduleId),
    "populate": "*"
  });
  const idNum = Number(scheduleId);
  if (!isNaN(idNum) && Number.isInteger(idNum)) {
    query.set("filters[$or][2][id][$eq]", String(idNum));
  }
  const payload = await strapiFetch<unknown>(`/schedules?${query.toString()}`);
  const item = unwrapData(payload)[0];
  if (!item) return null;
  const schedule = mapSchedule(item);

  const docId = asString((item as any).documentId);
  const numId = item.id !== undefined ? String(item.id) : "";
  const scheduleSlug = asString(schedule.slug);

  const keysToQuery = Array.from(new Set([schedule.id, docId, numId, scheduleSlug, String(scheduleId)].filter(Boolean)));
  const bookedSlotsMap = await getBookedSlots(keysToQuery);

  const allBooked = Array.from(
    new Set([
      ...(bookedSlotsMap[schedule.id] ?? []),
      ...(docId ? bookedSlotsMap[docId] ?? [] : []),
      ...(numId ? bookedSlotsMap[numId] ?? [] : []),
      ...(scheduleSlug ? bookedSlotsMap[scheduleSlug] ?? [] : []),
      ...(bookedSlotsMap[String(scheduleId)] ?? [])
    ])
  );

  return { ...schedule, bookedSlots: allBooked };
}

export async function bookStrapiAppointment(payload: unknown) {
  const token = getStrapiToken();
  const response = await fetch(apiUrl("/appointments/book"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Slot is no longer available");
  }

  return data as { appointmentId: string; queueNumber: number; status: string };
}

export async function getStrapiPatientData(mobileNumber: string) {
  if (!mobileNumber) return { appointments: [], records: [], payments: [] };

  try {
    const appointmentsQuery = `/appointments?filters[mobileNumber][$eq]=${encodeURIComponent(mobileNumber)}&sort[0]=createdAt:desc&populate=*`;
    const paymentsQuery = `/payments?sort[0]=createdAt:desc&populate=*`;

    const [appointmentsPayload, paymentsPayload] = await Promise.all([
      strapiFetch<unknown>(appointmentsQuery).catch(() => ({ data: [] })),
      strapiFetch<unknown>(paymentsQuery).catch(() => ({ data: [] }))
    ]);

    const appointments = unwrapData(appointmentsPayload).map((item: any) => {
      const schedule = unwrap(item.schedule);
      const hospital = unwrap(schedule.hospital);
      return {
        _id: String(item.documentId ?? item.id),
        status: asString(item.appointmentStatus, asString(item.status, "pending")),
        slotStart: asString(item.slotStart),
        slotEnd: asString(item.slotEnd),
        queueNumber: asNumber(item.queueNumber, 0),
        hospitalName: asString(hospital.name, asString(schedule.title, "Chamber Visit")),
        patientMessage: asString(item.reason, asString(item.notes, "")),
        fee: asNumber(schedule.fee, 0),
        createdAt: asString(item.createdAt)
      };
    });

    const payments = unwrapData(paymentsPayload)
      .filter((item: any) => {
        const appointment = unwrap(item.appointment);
        const patient = unwrap(item.patient);
        return (
          asString(patient.mobileNumber) === mobileNumber ||
          asString(appointment.mobileNumber) === mobileNumber
        );
      })
      .map((item: any) => ({
        _id: String(item.documentId ?? item.id),
        hospitalName: asString(item.hospitalName, "Clinic Visit"),
        totalAmount: asNumber(item.totalAmount, 0),
        paymentMethod: asString(item.paymentMethod, "Cash / Online"),
        paymentDate: asString(item.createdAt),
        status: asString(item.status, "pending")
      }));

    return {
      appointments,
      records: [],
      payments
    };
  } catch {
    return { appointments: [], records: [], payments: [] };
  }
}

export async function getStrapiAdminCollection(collection: string) {
  let endpoint = `/${collection}?populate=*&sort[0]=createdAt:desc`;
  if (collection === "schedules") {
    endpoint = `/schedules?populate=*&sort[0]=startsAt:asc`;
  }
  const token = getStrapiToken();
  const response = await fetch(apiUrl(endpoint), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection} from Strapi: ${response.status}`);
  }
  const payload = await response.json();
  const rawList = unwrapData(payload);
  return rawList.map((item) => ({
    _id: String(item.documentId ?? item.id),
    id: String(item.documentId ?? item.id),
    documentId: String(item.documentId ?? item.id),
    ...item
  }));
}

export function sanitizeStrapiPayload(collection: string, payload: any) {
  if (!payload || typeof payload !== "object") return payload;

  const clean: Record<string, any> = { ...payload };

  // Strip Mongo-specific / internal metadata
  delete clean._id;
  delete clean.id;
  delete clean.documentId;
  delete clean.__v;
  delete clean.createdAt;
  delete clean.updatedAt;

  if (collection === "hospitals") {
    const rawEmbedded = typeof clean.embeddedMapUrl === "string" ? clean.embeddedMapUrl.trim() : "";
    const rawGoogle = typeof clean.googleMapsUrl === "string" ? clean.googleMapsUrl.trim() : "";
    const rawMap = typeof clean.mapUrl === "string" ? clean.mapUrl.trim() : "";

    clean.embeddedMapUrl =
      rawEmbedded || (rawMap && rawMap.includes("output=embed") ? rawMap : rawEmbedded) || undefined;
    clean.googleMapsUrl = rawGoogle || undefined;
    clean.mapUrl = rawMap || rawEmbedded || rawGoogle || undefined;

    if (typeof clean.image === "string") {
      const imgStr = clean.image.trim();
      if (imgStr) {
        clean.imageUrl = imgStr;
      }
      delete clean.image;
    } else if (clean.image && typeof clean.image === "object") {
      if (clean.image.id) {
        clean.image = clean.image.id;
      }
    }

    if (typeof clean.imageUrl === "string") {
      clean.imageUrl = clean.imageUrl.trim() || undefined;
    }

    if (clean.latitude !== undefined && clean.latitude !== "" && !isNaN(Number(clean.latitude))) {
      clean.latitude = Number(clean.latitude);
    } else {
      delete clean.latitude;
    }

    if (clean.longitude !== undefined && clean.longitude !== "" && !isNaN(Number(clean.longitude))) {
      clean.longitude = Number(clean.longitude);
    } else {
      delete clean.longitude;
    }

    if (clean.consultationFee !== undefined && !isNaN(Number(clean.consultationFee))) {
      clean.consultationFee = Number(clean.consultationFee);
    }

    clean.active = clean.active !== false;

    // Automatically set publishedAt timestamp so created records are published in Strapi
    if (clean.active && !clean.publishedAt) {
      clean.publishedAt = new Date().toISOString();
    }
  } else if (collection === "schedules") {
    delete clean.hospitalId;
    if (clean.hospital && typeof clean.hospital === "object") {
      const docId = clean.hospital.documentId || clean.hospital.id || clean.hospital._id;
      if (docId) {
        clean.hospital = String(docId);
      } else {
        delete clean.hospital;
      }
    } else if (typeof clean.hospital === "string" && clean.hospital.trim()) {
      clean.hospital = clean.hospital.trim();
    }

    if (typeof clean.slotDurationMinutes !== "undefined") {
      clean.slotDurationMinutes = Number(clean.slotDurationMinutes) || 10;
    }
    if (typeof clean.fee !== "undefined") {
      clean.fee = Number(clean.fee) || 0;
    }
    if (typeof clean.maxAppointments !== "undefined") {
      clean.maxAppointments = Number(clean.maxAppointments) || undefined;
    }
    if (!clean.publishedAt) {
      clean.publishedAt = new Date().toISOString();
    }
  } else if (collection === "patients") {
    if (clean.age !== undefined && clean.age !== "" && !isNaN(Number(clean.age))) {
      clean.age = Number(clean.age);
    } else {
      delete clean.age;
    }
    if (!clean.dateOfBirth) {
      delete clean.dateOfBirth;
    }
  } else if (collection === "appointments") {
    delete clean.scheduleId;
    delete clean.patientId;
    if (clean.schedule && typeof clean.schedule === "object") {
      const docId = clean.schedule.documentId || clean.schedule.id || clean.schedule._id;
      if (docId) {
        clean.schedule = String(docId);
      } else {
        delete clean.schedule;
      }
    }
    if (clean.patient && typeof clean.patient === "object") {
      const docId = clean.patient.documentId || clean.patient.id || clean.patient._id;
      if (docId) {
        clean.patient = String(docId);
      } else {
        delete clean.patient;
      }
    }
  }

  // Remove undefined values
  for (const key of Object.keys(clean)) {
    if (clean[key] === undefined) {
      delete clean[key];
    }
  }

  return clean;
}

export async function createStrapiAdminRecord(collection: string, payload: any) {
  const token = getStrapiToken();
  const cleanData = sanitizeStrapiPayload(collection, payload);
  const response = await fetch(apiUrl(`/${collection}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ data: cleanData })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      data.error?.message ||
      (typeof data.error === "string"
        ? data.error
        : `Failed to create record in ${collection} (status ${response.status})`);
    throw new Error(msg);
  }
  return unwrap(data.data);
}

export async function updateStrapiAdminRecord(collection: string, id: string, payload: any) {
  const token = getStrapiToken();
  const cleanData = sanitizeStrapiPayload(collection, payload);
  const response = await fetch(apiUrl(`/${collection}/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ data: cleanData })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      data.error?.message ||
      (typeof data.error === "string"
        ? data.error
        : `Failed to update record in ${collection} (status ${response.status})`);
    throw new Error(msg);
  }
  return unwrap(data.data);
}

export async function deleteStrapiAdminRecord(collection: string, id: string) {
  const token = getStrapiToken();
  const response = await fetch(apiUrl(`/${collection}/${id}`), {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ${collection} with ID ${id}`);
  }
  return true;
}
