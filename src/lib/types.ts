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
  seo: SEOFields;
};

export type Hospital = {
  name: string;
  address: string;
  phone?: string;
  mapUrl: string;
  latitude: number;
  longitude: number;
  image?: string;
  consultationFee?: number;
  active?: boolean;
};

export type Schedule = {
  id: string;
  title?: string;
  slug: string;
  hospital: Hospital;
  startsAt: string;
  endsAt: string;
  slotDurationMinutes: number;
  maxAppointments?: number;
  fee: number;
  bookedSlots: string[];
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
  title: string;
  image: string;
  alt: string;
};

export type WebsiteSetting = {
  siteName: string;
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
