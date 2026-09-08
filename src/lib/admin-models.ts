import type { Model } from "mongoose";
import {
  AdminUserModel,
  AppointmentModel,
  AuditLogModel,
  AwardModel,
  BlogPostModel,
  DoctorModel,
  ExpenseModel,
  FaqModel,
  GalleryItemModel,
  HospitalScheduleModel,
  HospitalModel,
  IncomeModel,
  InvoiceModel,
  MediaModel,
  MedicalRecordModel,
  MedicalReportModel,
  NotificationModel,
  PageModel,
  PageSectionModel,
  PaymentModel,
  PatientModel,
  PrescriptionModel,
  QualificationModel,
  RedirectModel,
  ScheduleExceptionModel,
  ScheduleModel,
  SeoSettingModel,
  ServiceModel,
  SpecialisationModel,
  TestimonialModel,
  WebsiteSettingModel
} from "./models";

export type AdminCollection = {
  model: Model<unknown>;
  defaultSort: Record<string, 1 | -1>;
  single?: boolean;
  searchFields?: string[];
  title?: string;
  category?: "clinical" | "cms" | "finance" | "system";
};

export const adminCollections: Record<string, AdminCollection> = {
  "admin-users": {
    model: AdminUserModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["username", "email", "name", "role"],
    title: "Admin Users",
    category: "system"
  },
  appointments: {
    model: AppointmentModel,
    defaultSort: { slotStart: -1, createdAt: -1 },
    searchFields: ["patientName", "mobileNumber", "hospitalName", "reason", "notes"],
    title: "Appointments",
    category: "clinical"
  },
  "audit-logs": {
    model: AuditLogModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["actorName", "action", "entity", "entityId"],
    title: "Audit Logs",
    category: "system"
  },
  awards: {
    model: AwardModel,
    defaultSort: { year: -1, createdAt: -1 },
    searchFields: ["title", "organisation", "description"],
    title: "Awards",
    category: "cms"
  },
  "blog-posts": {
    model: BlogPostModel,
    defaultSort: { publishedAt: -1, createdAt: -1 },
    searchFields: ["title", "slug", "excerpt", "content", "author"],
    title: "Blog Posts",
    category: "cms"
  },
  doctor: {
    model: DoctorModel,
    defaultSort: { updatedAt: -1 },
    single: true,
    title: "Doctor Profile",
    category: "cms"
  },
  "doctor-profile": {
    model: DoctorModel,
    defaultSort: { updatedAt: -1 },
    single: true,
    title: "Doctor Profile",
    category: "cms"
  },
  expenses: {
    model: ExpenseModel,
    defaultSort: { expenseDate: -1, createdAt: -1 },
    searchFields: ["title", "category", "notes"],
    title: "Expenses",
    category: "finance"
  },
  faqs: {
    model: FaqModel,
    defaultSort: { order: 1, createdAt: -1 },
    searchFields: ["question", "answer", "category"],
    title: "FAQs",
    category: "cms"
  },
  "gallery-items": {
    model: GalleryItemModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["title", "alt", "altText", "category"],
    title: "Gallery Items",
    category: "cms"
  },
  gallery: {
    model: GalleryItemModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["title", "alt", "altText", "category"],
    title: "Gallery Items",
    category: "cms"
  },
  galleries: {
    model: GalleryItemModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["title", "alt", "altText", "category"],
    title: "Gallery Items",
    category: "cms"
  },
  hospitals: {
    model: HospitalModel,
    defaultSort: { name: 1 },
    searchFields: ["name", "address", "phone"],
    title: "Hospitals",
    category: "clinical"
  },
  "hospital-schedules": {
    model: HospitalScheduleModel,
    defaultSort: { dayOfWeek: 1, startTime: 1 },
    searchFields: ["hospitalName", "dayOfWeek"],
    title: "Hospital Weekly Schedules",
    category: "clinical"
  },
  incomes: {
    model: IncomeModel,
    defaultSort: { incomeDate: -1, createdAt: -1 },
    searchFields: ["title", "category", "notes"],
    title: "Income Ledger",
    category: "finance"
  },
  invoices: {
    model: InvoiceModel,
    defaultSort: { issuedAt: -1, createdAt: -1 },
    searchFields: ["invoiceNumber", "status"],
    title: "Invoices",
    category: "finance"
  },
  media: {
    model: MediaModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["title", "url", "alt", "mimeType"],
    title: "Media Library",
    category: "cms"
  },
  "medical-records": {
    model: MedicalRecordModel,
    defaultSort: { visitDate: -1, createdAt: -1 },
    searchFields: ["hospitalName", "symptoms", "diagnosis", "doctorNotes"],
    title: "Medical Records",
    category: "clinical"
  },
  "medical-reports": {
    model: MedicalReportModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["title", "uploadedBy", "notes"],
    title: "Medical Reports",
    category: "clinical"
  },
  notifications: {
    model: NotificationModel,
    defaultSort: { sentAt: -1, createdAt: -1 },
    searchFields: ["title", "message", "event", "recipientType"],
    title: "Notifications",
    category: "system"
  },
  pages: {
    model: PageModel,
    defaultSort: { title: 1 },
    searchFields: ["title", "slug", "content"],
    title: "Custom Pages",
    category: "cms"
  },
  "page-sections": {
    model: PageSectionModel,
    defaultSort: { pageSlug: 1, order: 1 },
    searchFields: ["pageSlug", "sectionKey", "title", "description"],
    title: "Page Sections",
    category: "cms"
  },
  payments: {
    model: PaymentModel,
    defaultSort: { paymentDate: -1, createdAt: -1 },
    searchFields: ["patientName", "hospitalName", "transactionId", "status", "paymentMethod"],
    title: "Payments",
    category: "finance"
  },
  patients: {
    model: PatientModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["fullName", "mobileNumber", "email", "address", "emergencyContact"],
    title: "Patients Directory",
    category: "clinical"
  },
  prescriptions: {
    model: PrescriptionModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["advice"],
    title: "Prescriptions",
    category: "clinical"
  },
  qualifications: {
    model: QualificationModel,
    defaultSort: { year: -1, createdAt: -1 },
    searchFields: ["title", "institution", "degree"],
    title: "Qualifications",
    category: "cms"
  },
  redirects: {
    model: RedirectModel,
    defaultSort: { fromPath: 1 },
    searchFields: ["fromPath", "toPath"],
    title: "URL Redirects",
    category: "cms"
  },
  "schedule-exceptions": {
    model: ScheduleExceptionModel,
    defaultSort: { date: -1 },
    searchFields: ["hospitalName", "reason", "type"],
    title: "Schedule Exceptions",
    category: "clinical"
  },
  schedules: {
    model: ScheduleModel,
    defaultSort: { startsAt: 1 },
    searchFields: ["title", "slug", "hospital.name"],
    title: "Schedules",
    category: "clinical"
  },
  "seo-settings": {
    model: SeoSettingModel,
    defaultSort: { updatedAt: -1 },
    searchFields: ["seoTitle", "metaDescription", "focusKeyword", "slug"],
    title: "SEO Settings",
    category: "cms"
  },
  "seo-setting": {
    model: SeoSettingModel,
    defaultSort: { updatedAt: -1 },
    searchFields: ["seoTitle", "metaDescription", "focusKeyword", "slug"],
    title: "SEO Settings",
    category: "cms"
  },
  services: {
    model: ServiceModel,
    defaultSort: { order: 1, name: 1 },
    searchFields: ["name", "description"],
    title: "Services",
    category: "cms"
  },
  specialisations: {
    model: SpecialisationModel,
    defaultSort: { name: 1 },
    searchFields: ["name", "description"],
    title: "Specialisations",
    category: "cms"
  },
  testimonials: {
    model: TestimonialModel,
    defaultSort: { createdAt: -1 },
    searchFields: ["name", "quote", "designation"],
    title: "Testimonials",
    category: "cms"
  },
  "website-setting": {
    model: WebsiteSettingModel,
    defaultSort: { updatedAt: -1 },
    single: true,
    title: "Website Settings",
    category: "cms"
  },
  "website-settings": {
    model: WebsiteSettingModel,
    defaultSort: { updatedAt: -1 },
    single: true,
    title: "Website Settings",
    category: "cms"
  }
};

export type AdminCollectionName = keyof typeof adminCollections;

export function getAdminCollection(name: string): AdminCollection | null {
  return adminCollections[name] ?? null;
}
