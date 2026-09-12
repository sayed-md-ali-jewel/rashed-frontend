import { Schema, model, models } from "mongoose";

const objectId = Schema.Types.ObjectId;

// 1. Shared Subschemas
export const SeoSchema = new Schema(
  {
    seoTitle: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    focusKeyword: { type: String, default: "" },
    keywords: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterTitle: { type: String, default: "" },
    twitterDescription: { type: String, default: "" },
    twitterImage: { type: String, default: "" },
    robots: { type: String, default: "index, follow" },
    noIndex: { type: Boolean, default: false },
    schema: { type: Schema.Types.Mixed, default: null }
  },
  { _id: false, strict: false }
);

export const EmbeddedHospitalSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" },
    embeddedMapUrl: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    latitude: { type: Number, default: 23.8103 },
    longitude: { type: Number, default: 90.4125 },
    image: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    visitingDays: [{ type: String }],
    visitingHours: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { _id: false }
);

// 2. Admin User Model (Authentication & Roles)
const AdminUserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, index: true },
    pin: { type: String, default: "123456" },
    passwordHash: { type: String, select: false },
    name: { type: String, default: "Super Admin" },
    role: {
      type: String,
      enum: ["super_admin", "admin", "doctor", "staff"],
      default: "super_admin"
    },
    permissions: [{ type: String }],
    avatar: { type: String, default: "" },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date }
  },
  { timestamps: true }
);

// 3. Hospital Model
const HospitalSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    address: { type: String, required: true },
    phone: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" },
    embeddedMapUrl: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    latitude: { type: Number, default: 23.8103 },
    longitude: { type: Number, default: 90.4125 },
    image: { type: String, default: "" },
    consultationFee: { type: Number, default: 1000 },
    visitingDays: [{ type: String }],
    visitingHours: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 4. Doctor Profile Model (Single Type)
const DoctorSchema = new Schema(
  {
    name: { type: String, required: true, default: "Dr. Md. Rashedul Alam" },
    title: { type: String, default: "Consultant Medicine Specialist" },
    designation: { type: String, default: "Senior Consultant" },
    specialization: { type: String, default: "Internal Medicine" },
    medicalRegistrationNumber: { type: String, default: "BMDC A-123456" },
    yearsOfExperience: { type: Number, default: 15 },
    onlineConsultationFee: { type: Number, default: 800 },
    languages: [{ type: String }],
    certifications: [{ type: String }],
    hospitalAffiliations: [{ type: String }],
    contactInformation: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      x: { type: String, default: "" },
      youtube: { type: String, default: "" }
    },
    biography: { type: String, default: "" },
    heroBadge: { type: String, default: "Board Certified Physician" },
    heroIntro: { type: String, default: "" },
    heroCareTitle: { type: String, default: "Patient-Centered Care" },
    heroCareDescription: { type: String, default: "" },
    heroStats: [{ label: String, value: String }],
    aboutHeading: { type: String, default: "A Personal Approach to Medicine" },
    aboutBio: [{ type: String }],
    aboutImageUrl: { type: String, default: "" },
    expertiseCards: [{ title: String, items: [String] }],
    medicalServices: [{ title: String, description: String, items: [String] }],
    consultationFee: { type: Number, default: 1000 },
    phone: { type: String, default: "+8801700000000" },
    whatsapp: { type: String, default: "+8801700000000" },
    address: { type: String, default: "Dhaka, Bangladesh" },
    image: { type: String, default: "" },
    qualifications: [{ type: String }],
    specialisations: [{ type: String }],
    experience: [{ type: String }],
    awards: [{ type: String }],
    services: [{ type: String }],
    enablePatientChat: { type: Boolean, default: true },
    seo: { type: Schema.Types.Mixed, default: () => ({}) }
  },
  { timestamps: true }
);

// 5. Schedule Model
const ScheduleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    hospitalId: { type: objectId, ref: "Hospital" },
    hospital: { type: EmbeddedHospitalSchema, required: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    slotDurationMinutes: { type: Number, required: true, default: 10 },
    fee: { type: Number, required: true, default: 1000 },
    maxAppointments: { type: Number, default: 20 },
    breakStart: { type: Date },
    breakEnd: { type: Date },
    scheduleStatus: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled"
    },
    ruleId: { type: objectId, ref: "ChamberScheduleRule", index: true },
    isRecurring: { type: Boolean, default: false },
    scheduleType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "specific_date", "custom"],
      default: "custom"
    },
    isCustomOverride: { type: Boolean, default: false },
    cancellationReason: { type: String, default: "" },
    rescheduleNotes: { type: String, default: "" },
    seo: { type: SeoSchema, default: () => ({}) }
  },
  { timestamps: true }
);

// 6. Testimonial Model
const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, default: 5, min: 1, max: 5 },
    designation: { type: String, default: "Verified Patient" },
    avatar: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 7. Gallery Item Model
const GalleryItemSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" },
    images: [{ type: String }],
    alt: { type: String, default: "" },
    altText: { type: String, default: "" },
    category: { type: String, default: "clinic" },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 8. Patient Model
const PatientSchema = new Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: "" },
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["female", "male", "other", "prefer_not_to_say", ""],
      default: ""
    },
    address: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    jwtSubject: { type: String, select: false }
  },
  { timestamps: true }
);

// 9. Appointment Model
const AppointmentSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", index: true },
    patientName: { type: String, required: true },
    mobileNumber: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    reason: { type: String, default: "" },
    uploadedReports: [{ type: String }],
    hospitalName: { type: String, default: "" },
    scheduleObjectId: { type: objectId, ref: "Schedule", index: true },
    scheduleId: { type: String, required: true, index: true },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    queueNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
      index: true
    },
    appointmentStatus: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "unpaid", "partial"],
      default: "pending",
      index: true
    },
    paymentAmount: { type: Number, default: 0 },
    patientMessage: { type: String, default: "" },
    patientMessageSentAt: { type: Date },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// Compound index for schedule slot unique booking
AppointmentSchema.index(
  { scheduleId: 1, slotStart: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } }
  }
);

// 10. Qualification Model
const QualificationSchema = new Schema(
  {
    title: { type: String, required: true },
    institution: { type: String, default: "" },
    year: { type: Number },
    degree: { type: String, default: "" }
  },
  { timestamps: true }
);

// 11. Specialisation Model
const SpecialisationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" }
  },
  { timestamps: true }
);

// 12. Award Model
const AwardSchema = new Schema(
  {
    title: { type: String, required: true },
    year: { type: Number },
    organisation: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

// 13. Service Model
const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: [{ type: String }],
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 14. Chamber Schedule Rule (Recurring Pattern Model)
const ChamberScheduleRuleSchema = new Schema(
  {
    hospitalId: { type: objectId, ref: "Hospital", required: true, index: true },
    hospital: { type: EmbeddedHospitalSchema },
    title: { type: String, required: true, default: "Chamber Consultation" },
    scheduleType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "specific_date"],
      required: true,
      default: "weekly",
      index: true
    },
    daysOfWeek: [{ type: String }],
    dayOfMonth: { type: Number, min: 1, max: 31 },
    specificDate: { type: Date },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDurationMinutes: { type: Number, required: true, default: 10 },
    fee: { type: Number, required: true, default: 1000 },
    maxAppointments: { type: Number, default: 20 },
    breakStartTime: { type: String, default: "" },
    breakEndTime: { type: String, default: "" },
    active: { type: Boolean, default: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
    seo: { type: SeoSchema, default: () => ({}) }
  },
  { timestamps: true }
);

// Backward compatibility alias
const HospitalScheduleSchema = ChamberScheduleRuleSchema;

// 15. Schedule Exception Model
const ScheduleExceptionSchema = new Schema(
  {
    hospitalId: { type: objectId, ref: "Hospital", index: true },
    hospitalName: { type: String, default: "" },
    date: { type: Date, required: true, index: true },
    type: {
      type: String,
      enum: ["unavailable", "holiday", "temporary_change"],
      default: "unavailable"
    },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    appointmentDurationMinutes: { type: Number },
    reason: { type: String, default: "" }
  },
  { timestamps: true }
);

// 16. Prescription Model
const PrescriptionSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    medicines: [
      {
        name: { type: String, required: true },
        dose: { type: String, default: "" },
        frequency: { type: String, default: "" },
        duration: { type: String, default: "" },
        instructions: { type: String, default: "" }
      }
    ],
    advice: { type: String, default: "" },
    followUpDate: { type: Date }
  },
  { timestamps: true }
);

// 17. Medical Report Model
const MedicalReportSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// 18. Medical Record Model
const MedicalRecordSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    hospitalName: { type: String, default: "" },
    visitDate: { type: Date, required: true },
    symptoms: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    prescription: { type: String, default: "" },
    doctorNotes: { type: String, default: "" },
    followUpDate: { type: Date },
    reportUrls: [{ type: String }]
  },
  { timestamps: true }
);

// 19. Payment Model
const PaymentSchema = new Schema(
  {
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    patientId: { type: objectId, ref: "Patient", index: true },
    patientName: { type: String, default: "" },
    hospitalName: { type: String, default: "" },
    consultationFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bkash", "nagad", "bank", "online", "other"],
      default: "cash"
    },
    transactionId: { type: String, default: "" },
    paymentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    }
  },
  { timestamps: true }
);

// 20. Invoice Model
const InvoiceSchema = new Schema(
  {
    paymentId: { type: objectId, ref: "Payment", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "issued", "paid", "void"],
      default: "issued"
    }
  },
  { timestamps: true }
);

// 21. Notification Model
const NotificationSchema = new Schema(
  {
    recipientType: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
      index: true
    },
    patientId: { type: objectId, ref: "Patient", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    channel: {
      type: String,
      enum: ["in_app", "email", "sms"],
      default: "in_app"
    },
    event: {
      type: String,
      enum: [
        "appointment_request",
        "appointment_approved",
        "appointment_rejected",
        "payment_successful",
        "appointment_cancelled",
        "appointment_rescheduled",
        "appointment_reminder",
        "appointment_completed"
      ],
      required: true
    },
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    readAt: { type: Date },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// 22. Page Model
const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, default: "" },
    published: { type: Boolean, default: false },
    seoTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" }
  },
  { timestamps: true }
);

// 23. Page Section Model
const PageSectionSchema = new Schema(
  {
    pageSlug: { type: String, required: true, index: true },
    sectionKey: { type: String, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: { type: Schema.Types.Mixed, default: null },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 24. Media Model
const MediaSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    mimeType: { type: String, default: "image/jpeg" },
    sizeBytes: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "uploads" },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// 25. Audit Log Model
const AuditLogSchema = new Schema(
  {
    actorRole: {
      type: String,
      enum: ["super_admin", "admin", "doctor", "patient", "system"],
      default: "system"
    },
    actorName: { type: String, default: "System" },
    action: { type: String, required: true },
    entity: { type: String, default: "" },
    entityId: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: "" }
  },
  { timestamps: true }
);

// 26. Income Model
const IncomeSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    incomeDate: { type: Date, required: true, default: Date.now },
    category: {
      type: String,
      enum: ["consultation", "procedure", "other"],
      default: "consultation"
    },
    appointmentId: { type: objectId, ref: "Appointment" },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bkash", "nagad", "bank", "other"],
      default: "cash"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// 27. Expense Model
const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, required: true, default: Date.now },
    category: {
      type: String,
      enum: ["rent", "salary", "utility", "equipment", "medicine", "marketing", "other"],
      default: "other"
    },
    receipt: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// 28. Blog Post Model
const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Dr. Md. Rashedul Alam" },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    },
    seo: { type: SeoSchema, default: () => ({}) },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// 29. FAQ Model
const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 30. Redirect Model
const RedirectSchema = new Schema(
  {
    fromPath: { type: String, required: true, unique: true, index: true },
    toPath: { type: String, required: true },
    statusCode: {
      type: String,
      enum: ["permanent301", "temporary302"],
      default: "permanent301"
    },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// 31. SEO Setting Model
const SeoSettingSchema = new Schema(
  {
    seoTitle: { type: String, required: true, maxlength: 70 },
    metaDescription: { type: String, required: true, maxlength: 170 },
    focusKeyword: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    slug: { type: String, index: true, default: "" },
    openGraphTitle: { type: String, default: "" },
    openGraphDescription: { type: String, default: "" },
    openGraphImage: { type: String, default: "" },
    twitterTitle: { type: String, default: "" },
    twitterDescription: { type: String, default: "" },
    twitterImage: { type: String, default: "" },
    jsonLdSchema: { type: Schema.Types.Mixed, default: null },
    breadcrumbs: { type: Schema.Types.Mixed, default: null },
    indexing: {
      type: String,
      enum: ["index", "noindex"],
      default: "index"
    },
    imageAltText: { type: String, default: "" },
    seoScore: { type: Number, min: 0, max: 100, default: 85 },
    readabilityScore: { type: Number, min: 0, max: 100, default: 90 },
    socialPreviewNotes: { type: String, default: "" }
  },
  { timestamps: true }
);

// 32. Website Setting Model (Single Type)
const WebsiteSettingSchema = new Schema(
  {
    siteName: { type: String, required: true, default: "Dr. Rashed" },
    siteUrl: { type: String, default: "https://drrashed.bd" },
    logo: { type: String, default: "" },
    logoDark: { type: String, default: "" },
    favicon: { type: String, default: "" },
    appleTouchIcon: { type: String, default: "" },
    defaultSeo: { type: Schema.Types.Mixed, default: () => ({}) },
    seo: { type: Schema.Types.Mixed, default: () => ({}) },
    // SEO & Webmasters
    googleSearchConsoleVerification: { type: String, default: "" },
    googleAnalyticsId: { type: String, default: "" },
    googleTagManagerId: { type: String, default: "" },
    bingVerification: { type: String, default: "" },
    yandexVerification: { type: String, default: "" },
    facebookDomainVerification: { type: String, default: "" },
    customHeadScript: { type: String, default: "" },
    // Robots & Sitemap controls
    allowIndexing: { type: Boolean, default: true },
    robotsTxtCustom: { type: String, default: "" },
    sitemapEnabled: { type: Boolean, default: true },
    disallowedPaths: [{ type: String }],
    enablePatientChat: { type: Boolean, default: true },
    facebookUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    xUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    telegramUrl: { type: String, default: "" },
    contactPhone: { type: String, default: "+8801700000000" },
    contactEmail: { type: String, default: "appointments@doctorcare.test" },
    contactAddress: { type: String, default: "Dhaka, Bangladesh" },
    footerDescription: { type: String, default: "A modern doctor portfolio and appointment management system." },
    heroPrimaryCta: { type: String, default: "Book Appointment" },
    heroSecondaryCta: { type: String, default: "Learn More" },
    scheduleBadge: { type: String, default: "Live availability" },
    scheduleTitle: { type: String, default: "Upcoming Schedules" },
    scheduleDescription: { type: String, default: "Book from automatically generated slots and receive a queue number." },
    content: { type: Schema.Types.Mixed, default: {} },
    googleMapsApiKey: { type: String, select: false, default: "" },
    smsProviderConfig: { type: Schema.Types.Mixed, select: false, default: {} }
  },
  { timestamps: true }
);

// 32. Conversation Model (Doctor-Patient WhatsApp-Style Messaging)
const ConversationSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", required: true, index: true },
    doctorId: { type: objectId, ref: "Doctor", index: true },
    status: {
      type: String,
      enum: ["pending", "active", "closed", "blocked", "rejected"],
      default: "pending",
      index: true
    },
    approvedAt: { type: Date },
    approvedBy: { type: objectId, ref: "AdminUser" },
    rejectedAt: { type: Date },
    closedAt: { type: Date },
    blockedAt: { type: Date },
    patientName: { type: String, default: "" },
    patientPhone: { type: String, default: "", index: true },
    patientAvatar: { type: String, default: "" },
    doctorName: { type: String, default: "Dr. Md. Rashedul Alam" },
    doctorAvatar: { type: String, default: "" },
    firstMessage: { type: String, default: "" },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    lastSenderType: { type: String, enum: ["patient", "doctor"], default: "patient" },
    unreadCountDoctor: { type: Number, default: 0 },
    unreadCountPatient: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ConversationSchema.index({ patientId: 1, doctorId: 1 });
ConversationSchema.index({ status: 1, lastMessageAt: -1 });
ConversationSchema.index({ patientPhone: 1, status: 1 });

// 33. Message Model (WhatsApp-Style Individual Messages)
const MessageSchema = new Schema(
  {
    conversationId: { type: objectId, ref: "Conversation", required: true, index: true },
    senderId: { type: String, required: true },
    senderType: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
      index: true
    },
    senderName: { type: String, default: "" },
    message: { type: String, required: true },
    attachments: [
      {
        url: { type: String, required: true },
        fileType: { type: String, default: "image" },
        fileName: { type: String, default: "" },
        fileSize: { type: Number, default: 0 }
      }
    ],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
      index: true
    },
    deliveredAt: { type: Date },
    readAt: { type: Date }
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });
MessageSchema.index({ conversationId: 1, status: 1 });

// Export Mongoose Models with Next.js HMR caching
export const AdminUserModel = models.AdminUser ?? model("AdminUser", AdminUserSchema);
export const DoctorModel = models.Doctor ?? model("Doctor", DoctorSchema);
export const HospitalModel = models.Hospital ?? model("Hospital", HospitalSchema);
export const ScheduleModel = models.Schedule ?? model("Schedule", ScheduleSchema);
export const ChamberScheduleRuleModel =
  models.ChamberScheduleRule ?? model("ChamberScheduleRule", ChamberScheduleRuleSchema);
export const HospitalScheduleModel =
  models.HospitalSchedule ?? models.ChamberScheduleRule ?? model("HospitalSchedule", HospitalScheduleSchema);
export const ScheduleExceptionModel = models.ScheduleException ?? model("ScheduleException", ScheduleExceptionSchema);
export const TestimonialModel = models.Testimonial ?? model("Testimonial", TestimonialSchema);
export const GalleryItemModel = models.GalleryItem ?? model("GalleryItem", GalleryItemSchema);
export const PatientModel = models.Patient ?? model("Patient", PatientSchema);
export const AppointmentModel = models.Appointment ?? model("Appointment", AppointmentSchema);
export const QualificationModel = models.Qualification ?? model("Qualification", QualificationSchema);
export const SpecialisationModel = models.Specialisation ?? model("Specialisation", SpecialisationSchema);
export const AwardModel = models.Award ?? model("Award", AwardSchema);
export const ServiceModel = models.Service ?? model("Service", ServiceSchema);
export const MedicalRecordModel = models.MedicalRecord ?? model("MedicalRecord", MedicalRecordSchema);
export const PrescriptionModel = models.Prescription ?? model("Prescription", PrescriptionSchema);
export const MedicalReportModel = models.MedicalReport ?? model("MedicalReport", MedicalReportSchema);
export const PaymentModel = models.Payment ?? model("Payment", PaymentSchema);
export const InvoiceModel = models.Invoice ?? model("Invoice", InvoiceSchema);
export const NotificationModel = models.Notification ?? model("Notification", NotificationSchema);
export const IncomeModel = models.Income ?? model("Income", IncomeSchema);
export const ExpenseModel = models.Expense ?? model("Expense", ExpenseSchema);
export const BlogPostModel = models.BlogPost ?? model("BlogPost", BlogPostSchema);
export const FaqModel = models.Faq ?? model("Faq", FaqSchema);
export const RedirectModel = models.Redirect ?? model("Redirect", RedirectSchema);
export const SeoSettingModel = models.SeoSetting ?? model("SeoSetting", SeoSettingSchema);
export const WebsiteSettingModel = models.WebsiteSetting ?? model("WebsiteSetting", WebsiteSettingSchema);
export const PageModel = models.Page ?? model("Page", PageSchema);
export const PageSectionModel = models.PageSection ?? model("PageSection", PageSectionSchema);
export const MediaModel = models.Media ?? model("Media", MediaSchema);
export const AuditLogModel = models.AuditLog ?? model("AuditLog", AuditLogSchema);
export const ConversationModel = models.Conversation ?? model("Conversation", ConversationSchema);
export const MessageModel = models.Message ?? model("Message", MessageSchema);
