import type { Model } from "mongoose";
import {
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

type AdminCollection = {
  model: Model<unknown>;
  defaultSort: Record<string, 1 | -1>;
  single?: boolean;
};

export const adminCollections: Record<string, AdminCollection> = {
  appointments: { model: AppointmentModel, defaultSort: { createdAt: -1 } },
  "audit-logs": { model: AuditLogModel, defaultSort: { createdAt: -1 } },
  awards: { model: AwardModel, defaultSort: { year: -1, createdAt: -1 } },
  "blog-posts": { model: BlogPostModel, defaultSort: { createdAt: -1 } },
  doctor: { model: DoctorModel, defaultSort: { updatedAt: -1 }, single: true },
  expenses: { model: ExpenseModel, defaultSort: { expenseDate: -1 } },
  faqs: { model: FaqModel, defaultSort: { order: 1, createdAt: -1 } },
  "gallery-items": { model: GalleryItemModel, defaultSort: { createdAt: -1 } },
  hospitals: { model: HospitalModel, defaultSort: { name: 1 } },
  "hospital-schedules": { model: HospitalScheduleModel, defaultSort: { dayOfWeek: 1, startTime: 1 } },
  incomes: { model: IncomeModel, defaultSort: { incomeDate: -1 } },
  invoices: { model: InvoiceModel, defaultSort: { issuedAt: -1 } },
  media: { model: MediaModel, defaultSort: { createdAt: -1 } },
  "medical-records": { model: MedicalRecordModel, defaultSort: { visitDate: -1 } },
  "medical-reports": { model: MedicalReportModel, defaultSort: { createdAt: -1 } },
  notifications: { model: NotificationModel, defaultSort: { createdAt: -1 } },
  pages: { model: PageModel, defaultSort: { title: 1 } },
  "page-sections": { model: PageSectionModel, defaultSort: { pageSlug: 1, order: 1 } },
  payments: { model: PaymentModel, defaultSort: { paymentDate: -1, createdAt: -1 } },
  patients: { model: PatientModel, defaultSort: { createdAt: -1 } },
  prescriptions: { model: PrescriptionModel, defaultSort: { createdAt: -1 } },
  qualifications: { model: QualificationModel, defaultSort: { year: -1, createdAt: -1 } },
  redirects: { model: RedirectModel, defaultSort: { fromPath: 1 } },
  "schedule-exceptions": { model: ScheduleExceptionModel, defaultSort: { date: -1 } },
  schedules: { model: ScheduleModel, defaultSort: { startsAt: 1 } },
  "seo-settings": { model: SeoSettingModel, defaultSort: { updatedAt: -1 } },
  services: { model: ServiceModel, defaultSort: { name: 1 } },
  specialisations: { model: SpecialisationModel, defaultSort: { name: 1 } },
  testimonials: { model: TestimonialModel, defaultSort: { createdAt: -1 } },
  "website-setting": { model: WebsiteSettingModel, defaultSort: { updatedAt: -1 }, single: true }
};

export type AdminCollectionName = keyof typeof adminCollections;

export function getAdminCollection(name: string) {
  return adminCollections[name] ?? null;
}
