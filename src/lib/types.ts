export type SEOFields = {
  seoTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown>;
};

export type Doctor = {
  name: string;
  title: string;
  designation?: string;
  specialization?: string;
  medicalRegistrationNumber?: string;
  yearsOfExperience?: number;
  onlineConsultationFee?: number;
  languages?: string[];
  certifications?: string[];
  hospitalAffiliations?: string[];
  contactInformation?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
  biography: string;
  heroBadge: string;
  heroIntro: string;
  heroCareTitle: string;
  heroCareDescription: string;
  heroStats: Array<{
    label: string;
    value: string;
  }>;
  aboutHeading: string;
  aboutBio: string[];
  aboutImageUrl: string;
  expertiseCards: Array<{
    title: string;
    items: string[];
  }>;
  medicalServices: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
  consultationFee: number;
  phone: string;
  whatsapp: string;
  address: string;
  image: string;
  qualifications: string[];
  specialisations: string[];
  experience: string[];
  awards: string[];
  services: string[];
  enablePatientChat?: boolean;
  seo: SEOFields;
};

export type Hospital = {
  _id?: string;
  id?: string;
  name: string;
  address: string;
  phone?: string;
  mapUrl: string;
  latitude: number;
  longitude: number;
  image?: string;
  consultationFee?: number;
  visitingDays?: string[];
  visitingHours?: string;
  active?: boolean;
};

export type ScheduleType = "daily" | "weekly" | "monthly" | "specific_date";

export type DayOfWeek =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type ChamberScheduleRule = {
  _id?: string;
  id?: string;
  hospitalId: string;
  hospital?: Hospital;
  title: string;
  scheduleType: ScheduleType;
  daysOfWeek?: string[]; // e.g. ["saturday", "monday", "wednesday"]
  dayOfMonth?: number; // 1 to 31 for monthly
  specificDate?: string; // YYYY-MM-DD for specific date
  startTime: string; // e.g. "16:00" or "04:00 PM"
  endTime: string; // e.g. "19:00" or "07:00 PM"
  slotDurationMinutes: number;
  fee: number;
  maxAppointments: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  seo?: SEOFields;
  createdAt?: string;
  updatedAt?: string;
};

export type Schedule = {
  id: string;
  _id?: string;
  title?: string;
  slug: string;
  hospital: Hospital;
  hospitalId?: string;
  startsAt: string;
  endsAt: string;
  slotDurationMinutes: number;
  maxAppointments?: number;
  fee: number;
  bookedSlots: string[];
  scheduleStatus?: "scheduled" | "cancelled" | "completed";
  ruleId?: string;
  isRecurring?: boolean;
  scheduleType?: ScheduleType | "custom";
  isCustomOverride?: boolean;
  cancellationReason?: string;
  seo: SEOFields;
};

export type Appointment = {
  id: string;
  patientName: string;
  mobileNumber: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  reason?: string;
  uploadedReports?: string[];
  scheduleId: string;
  slotStart: string;
  slotEnd?: string;
  queueNumber: number;
  status: "pending" | "approved" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "unpaid" | "partial";
};

export type Testimonial = {
  name: string;
  quote: string;
  rating: number;
};

export type GalleryItem = {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  images?: string[];
  alt?: string;
  altText?: string;
  category?: string;
  description?: string;
  active?: boolean;
};

export type WebsiteSetting = {
  siteName: string;
  siteUrl?: string;
  logo?: string;
  logoDark?: string;
  favicon?: string;
  appleTouchIcon?: string;
  footerDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  // SEO & Webmasters
  googleSearchConsoleVerification?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  bingVerification?: string;
  yandexVerification?: string;
  facebookDomainVerification?: string;
  customHeadScript?: string;
  // Robots & Sitemap controls
  allowIndexing?: boolean;
  robotsTxtCustom?: string;
  sitemapEnabled?: boolean;
  disallowedPaths?: string[];
  enablePatientChat?: boolean;
  defaultSeo?: SEOFields;
  content: {
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    scheduleBadge: string;
    scheduleTitle: string;
    scheduleDescription: string;
    scheduleEmptyTitle: string;
    scheduleEmptyDescription: string;
    scheduleBookButton: string;
    appointmentsBadge: string;
    appointmentsTitle: string;
    appointmentsDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    profileBadge: string;
    profileTitle: string;
    testimonialsBadge: string;
    testimonialsTitle: string;
    galleryBadge: string;
    galleryTitle: string;
    galleryDescription: string;
    contactBadge: string;
    contactTitle: string;
    scheduleDetailBadge: string;
    shareScheduleLabel: string;
    appointmentFormBadge: string;
    appointmentFormTitle: string;
    appointmentFormDescription: string;
    patientNameLabel: string;
    patientNamePlaceholder: string;
    patientAddressLabel?: string;
    patientAddressPlaceholder?: string;
    patientMobileLabel: string;
    patientMobilePlaceholder: string;
    patientSlotLabel: string;
    patientSlotPlaceholder: string;
    appointmentSubmitButton: string;
    appointmentValidationMessage: string;
    appointmentSuccessMessage: string;
    appointmentApprovedMessage: string;
    appointmentCancelledMessage: string;
  };
};

export type BlogBlockType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "paragraph"
  | "unordered_list"
  | "ordered_list"
  | "quote"
  | "note"
  | "image"
  | "link"
  | "divider"
  | "cta"
  | "before_after"
  | "faq"
  | "table"
  | "custom_spacing";

export type BlogBlock = {
  id: string;
  type: BlogBlockType;
  content: string;
  anchorId?: string;
  data?: Record<string, any>;
  order?: number;
};

export type BlogTOCItem = {
  id: string;
  text: string;
  level: 2 | 3;
  indexNumber: string; // e.g. "01", "02"
  children?: BlogTOCItem[];
};

export type BlogPost = {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Legacy HTML fallback
  contentBlocks: BlogBlock[];
  coverImage?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category?: string;
  tags?: string[];
  status: "draft" | "published";
  publishedAt?: string;
  readingTimeMinutes?: number;
  views?: number;
  seo?: SEOFields & {
    focusKeyword?: string;
    metaRobots?: "index, follow" | "noindex, follow" | "noindex, nofollow";
  };
  createdAt?: string;
  updatedAt?: string;
};
