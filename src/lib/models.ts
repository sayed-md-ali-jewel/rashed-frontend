import { Schema, model, models } from "mongoose";

const objectId = Schema.Types.ObjectId;

const SeoSchema = new Schema(
  {
    seoTitle: String,
    metaDescription: String,
    focusKeyword: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    noIndex: Boolean,
    schema: Schema.Types.Mixed
  },
  { _id: false }
);

const HospitalSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    googleMapsUrl: String,
    embeddedMapUrl: String,
    mapUrl: String,
    latitude: Number,
    longitude: Number,
    image: String,
    consultationFee: Number,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const EmbeddedHospitalSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    googleMapsUrl: String,
    embeddedMapUrl: String,
    mapUrl: String,
    latitude: Number,
    longitude: Number,
    image: String,
    consultationFee: Number,
    active: Boolean
  },
  { _id: false }
);

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true },
    title: String,
    designation: String,
    specialization: String,
    medicalRegistrationNumber: String,
    yearsOfExperience: Number,
    onlineConsultationFee: Number,
    languages: [String],
    certifications: [String],
    hospitalAffiliations: [String],
    contactInformation: String,
    socialLinks: {
      facebook: String,
      linkedin: String,
      x: String,
      youtube: String
    },
    biography: String,
    heroBadge: String,
    heroIntro: String,
    heroCareTitle: String,
    heroCareDescription: String,
    heroStats: [{ label: String, value: String }],
    aboutHeading: String,
    aboutBio: [String],
    aboutImageUrl: String,
    expertiseCards: [{ title: String, items: [String] }],
    medicalServices: [{ title: String, description: String, items: [String] }],
    consultationFee: Number,
    phone: String,
    whatsapp: String,
    address: String,
    image: String,
    qualifications: [String],
    specialisations: [String],
    experience: [String],
    awards: [String],
    services: [String],
    seo: SeoSchema
  },
  { timestamps: true }
);

const ScheduleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    hospitalId: { type: objectId, ref: "Hospital" },
    hospital: { type: EmbeddedHospitalSchema, required: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    slotDurationMinutes: { type: Number, required: true, default: 10 },
    fee: { type: Number, required: true, default: 0 },
    maxAppointments: Number,
    breakStart: Date,
    breakEnd: Date,
    scheduleStatus: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled"
    },
    seo: SeoSchema
  },
  { timestamps: true }
);

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, required: true, default: 5 }
  },
  { timestamps: true }
);

const GalleryItemSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    alt: String,
    altText: String
  },
  { timestamps: true }
);

const PatientSchema = new Schema(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true, index: true },
    email: String,
    dateOfBirth: Date,
    age: Number,
    gender: {
      type: String,
      enum: ["female", "male", "other", "prefer_not_to_say", ""],
      default: ""
    },
    address: String,
    emergencyContact: String,
    medicalHistory: String,
    jwtSubject: { type: String, select: false }
  },
  { timestamps: true }
);

const AppointmentSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", index: true },
    patientName: { type: String, required: true },
    mobileNumber: { type: String, required: true, index: true },
    email: String,
    dateOfBirth: Date,
    age: Number,
    gender: String,
    address: String,
    emergencyContact: String,
    medicalHistory: String,
    reason: String,
    uploadedReports: [String],
    hospitalName: String,
    scheduleObjectId: { type: objectId, ref: "Schedule", index: true },
    scheduleId: { type: String, required: true, index: true },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    queueNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "unpaid", "partial"],
      default: "pending"
    },
    paymentAmount: { type: Number, default: 0 },
    patientMessage: String,
    patientMessageSentAt: Date,
    notes: String
  },
  { timestamps: true }
);

AppointmentSchema.index({ scheduleId: 1, slotStart: 1 }, { unique: true });

const QualificationSchema = new Schema(
  {
    title: { type: String, required: true },
    institution: String,
    year: Number
  },
  { timestamps: true }
);

const SpecialisationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String
  },
  { timestamps: true }
);

const AwardSchema = new Schema(
  {
    title: { type: String, required: true },
    year: Number,
    description: String
  },
  { timestamps: true }
);

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    fee: Number,
    image: String,
    icon: String,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const HospitalScheduleSchema = new Schema(
  {
    hospitalId: { type: objectId, ref: "Hospital", required: true, index: true },
    hospitalName: String,
    dayOfWeek: {
      type: String,
      enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      required: true
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    appointmentDurationMinutes: { type: Number, default: 15 },
    breakStartTime: String,
    breakEndTime: String,
    maxAppointments: Number,
    recurringWeekly: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ScheduleExceptionSchema = new Schema(
  {
    hospitalId: { type: objectId, ref: "Hospital", index: true },
    hospitalName: String,
    date: { type: Date, required: true, index: true },
    type: {
      type: String,
      enum: ["unavailable", "holiday", "temporary_change"],
      default: "unavailable"
    },
    startTime: String,
    endTime: String,
    appointmentDurationMinutes: Number,
    reason: String
  },
  { timestamps: true }
);

const PrescriptionSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    medicines: [{ name: String, dose: String, frequency: String, duration: String, instructions: String }],
    advice: String,
    followUpDate: Date
  },
  { timestamps: true }
);

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
    notes: String
  },
  { timestamps: true }
);

const MedicalRecordSchema = new Schema(
  {
    patientId: { type: objectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    hospitalName: String,
    visitDate: { type: Date, required: true },
    symptoms: String,
    diagnosis: String,
    prescription: String,
    doctorNotes: String,
    followUpDate: Date,
    reportUrls: [String]
  },
  { timestamps: true }
);

const PaymentSchema = new Schema(
  {
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    patientId: { type: objectId, ref: "Patient", index: true },
    patientName: String,
    hospitalName: String,
    consultationFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bkash", "nagad", "bank", "online", "other"],
      default: "cash"
    },
    transactionId: String,
    paymentDate: Date,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const InvoiceSchema = new Schema(
  {
    paymentId: { type: objectId, ref: "Payment", index: true },
    appointmentId: { type: objectId, ref: "Appointment", index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    issuedAt: { type: Date, default: Date.now },
    subtotal: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: ["draft", "issued", "paid", "void"],
      default: "issued"
    }
  },
  { timestamps: true }
);

const NotificationSchema = new Schema(
  {
    recipientType: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true
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
    title: String,
    message: String,
    readAt: Date,
    sentAt: Date
  },
  { timestamps: true }
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: String,
    published: { type: Boolean, default: false },
    seoTitle: String,
    metaDescription: String,
    ogImage: String
  },
  { timestamps: true }
);

const PageSectionSchema = new Schema(
  {
    pageSlug: { type: String, required: true, index: true },
    sectionKey: { type: String, required: true },
    title: String,
    description: String,
    image: String,
    icon: String,
    items: Schema.Types.Mixed,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const MediaSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    alt: String,
    mimeType: String,
    sizeBytes: Number
  },
  { timestamps: true }
);

const AuditLogSchema = new Schema(
  {
    actorRole: {
      type: String,
      enum: ["admin", "doctor", "patient", "system"],
      default: "system"
    },
    action: { type: String, required: true },
    entity: String,
    entityId: String,
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

const IncomeSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    incomeDate: { type: Date, required: true },
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
    }
  },
  { timestamps: true }
);

const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ["rent", "salary", "utility", "equipment", "medicine", "marketing", "other"],
      default: "other"
    },
    receipt: String,
    notes: String
  },
  { timestamps: true }
);

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: { type: String, required: true },
    coverImage: String,
    seo: SeoSchema,
    publishedAt: Date
  },
  { timestamps: true }
);

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

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

const SeoSettingSchema = new Schema(
  {
    seoTitle: { type: String, required: true, maxlength: 65 },
    metaDescription: { type: String, required: true, maxlength: 160 },
    focusKeyword: String,
    canonicalUrl: String,
    slug: { type: String, index: true },
    openGraphTitle: String,
    openGraphDescription: String,
    openGraphImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    jsonLdSchema: Schema.Types.Mixed,
    breadcrumbs: Schema.Types.Mixed,
    indexing: {
      type: String,
      enum: ["index", "noindex"],
      default: "index"
    },
    imageAltText: String,
    seoScore: { type: Number, min: 0, max: 100 },
    readabilityScore: { type: Number, min: 0, max: 100 },
    socialPreviewNotes: String
  },
  { timestamps: true }
);

const WebsiteSettingSchema = new Schema(
  {
    siteName: { type: String, required: true },
    defaultSeo: SeoSchema,
    facebookUrl: String,
    linkedinUrl: String,
    xUrl: String,
    youtubeUrl: String,
    telegramUrl: String,
    contactPhone: String,
    contactEmail: String,
    contactAddress: String,
    footerDescription: String,
    content: Schema.Types.Mixed,
    googleMapsApiKey: { type: String, select: false },
    smsProviderConfig: { type: Schema.Types.Mixed, select: false }
  },
  { timestamps: true }
);

export const DoctorModel = models.Doctor ?? model("Doctor", DoctorSchema);
export const HospitalModel = models.Hospital ?? model("Hospital", HospitalSchema);
export const ScheduleModel = models.Schedule ?? model("Schedule", ScheduleSchema);
export const HospitalScheduleModel = models.HospitalSchedule ?? model("HospitalSchedule", HospitalScheduleSchema);
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
