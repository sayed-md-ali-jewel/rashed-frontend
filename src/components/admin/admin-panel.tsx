"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  Database,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  HelpCircle,
  Hospital,
  Image as ImageIcon,
  Images,
  Info,
  KeyRound,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trash2,
  TrendingUp,
  Upload,
  UploadCloud,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileUploadInput,
  type MediaAsset,
} from "@/components/ui/file-upload-input";
import {
  SweetAlertModal,
  type SweetAlertConfig,
} from "@/components/ui/sweet-alert";
import { safeImageSrc } from "@/lib/utils";

function toLocalDatetimeInput(dateStr?: string | Date) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatSlotTimeRangeOnly(startStr?: string, endStr?: string) {
  if (!startStr) return "-";
  const start = new Date(startStr);
  if (isNaN(start.getTime())) return "-";

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (!endStr) return startTime;
  const end = new Date(endStr);
  if (isNaN(end.getTime())) return startTime;

  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${startTime} - ${endTime}`;
}

function formatSlotDateLong(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

function slugify(text: string) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type AdminTab =
  | "dashboard"
  | "appointments"
  | "hospitals"
  | "schedules"
  | "patients"
  | "cms-doctor"
  | "cms-expertise"
  | "cms-credentials"
  | "cms-website"
  | "cms-blog"
  | "cms-services"
  | "cms-testimonials"
  | "cms-gallery"
  | "cms-faqs"
  | "finance"
  | "media"
  | "seo"
  | "security"
  | "system";

type HospitalRecord = {
  _id?: string;
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  consultationFee?: number;
  googleMapsUrl?: string;
  embeddedMapUrl?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  visitingDays?: string[];
  visitingHours?: string;
  active?: boolean;
  createdAt?: string;
};

type ScheduleRecord = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  hospital?: any;
  hospitalId?: string;
  startsAt?: string;
  endsAt?: string;
  slotDurationMinutes?: number;
  fee?: number;
  maxAppointments?: number;
  scheduleStatus?: "scheduled" | "completed" | "cancelled";
  createdAt?: string;
  bookedSlots?: string[];
};

type PatientRecord = {
  _id?: string;
  id?: string;
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt?: string;
};

type AppointmentRecord = {
  _id?: string;
  id?: string;
  patientId?: any;
  patientName?: string;
  mobileNumber?: string;
  address?: string;
  schedule?: any;
  scheduleId?: string;
  hospitalName?: string;
  slotStart?: string;
  slotEnd?: string;
  queueNumber?: number;
  status?: "pending" | "approved" | "cancelled" | "completed";
  appointmentStatus?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded" | "unpaid";
  paymentAmount?: number;
  reason?: string;
  notes?: string;
  patientMessage?: string;
  uploadedReports?: string[];
  createdAt?: string;
};

type IncomeRecord = {
  _id?: string;
  id?: string;
  title?: string;
  amount?: number;
  incomeDate?: string;
  category?: string;
  paymentMethod?: string;
  notes?: string;
};

type ExpenseRecord = {
  _id?: string;
  id?: string;
  title?: string;
  amount?: number;
  expenseDate?: string;
  category?: string;
  receipt?: string;
  notes?: string;
};

type BlogPostRecord = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  status?: "draft" | "published";
  publishedAt?: string;
};

type ServiceRecord = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  fee?: number;
  image?: string;
  icon?: string;
  items?: string[];
  active?: boolean;
  order?: number;
};

type TestimonialRecord = {
  _id?: string;
  id?: string;
  name?: string;
  quote?: string;
  rating?: number;
  designation?: string;
  avatar?: string;
  active?: boolean;
};

type GalleryRecord = {
  _id?: string;
  id?: string;
  title?: string;
  image?: string;
  images?: string[];
  alt?: string;
  category?: string;
  description?: string;
  active?: boolean;
};

type FaqRecord = {
  _id?: string;
  id?: string;
  question?: string;
  answer?: string;
  category?: string;
  order?: number;
  active?: boolean;
};

type MediaRecord = MediaAsset;

function recordId(record?: { _id?: string; id?: string } | null | any): string {
  if (!record || typeof record !== "object") return "";
  return String(record._id ?? record.id ?? "");
}

const ALL_WEEK_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const VISITING_HOUR_PRESETS = [
  "05:00 PM - 09:00 PM",
  "06:00 PM - 10:00 PM",
  "10:00 AM - 01:00 PM",
  "09:00 AM - 01:00 PM & 05:00 PM - 09:00 PM",
  "04:00 PM - 08:00 PM",
  "07:00 PM - 11:00 PM",
];

function HospitalModalDialog({
  isOpen,
  onClose,
  editingHospital,
  mediaList,
  onSaved,
  triggerToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingHospital: HospitalRecord | null;
  mediaList: MediaAsset[];
  onSaved: () => void;
  triggerToast: (msg: string, isError?: boolean) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [visitingHours, setVisitingHours] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingHospital) {
      const days =
        Array.isArray(editingHospital.visitingDays) &&
        editingHospital.visitingDays.length > 0
          ? editingHospital.visitingDays
          : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
      setSelectedDays(days);
      setVisitingHours(editingHospital.visitingHours || "05:00 PM - 09:00 PM");
      setImage(editingHospital.image || "");
    } else {
      setSelectedDays([
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
      ]);
      setVisitingHours("05:00 PM - 09:00 PM");
      setImage("");
    }
  }, [editingHospital, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const selectAllDays = () => setSelectedDays([...ALL_WEEK_DAYS]);
  const selectSatThu = () =>
    setSelectedDays([
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ]);
  const selectMonFri = () =>
    setSelectedDays([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ]);
  const clearDays = () => setSelectedDays([]);

  const isEdit = Boolean(editingHospital && recordId(editingHospital));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const consultationFee =
      Number(
        (form.elements.namedItem("consultationFee") as HTMLInputElement).value,
      ) || 1000;
    const embeddedMapUrl = (
      form.elements.namedItem("embeddedMapUrl") as HTMLInputElement
    ).value;

    try {
      const url = isEdit
        ? `/api/admin/hospitals/${recordId(editingHospital)}`
        : "/api/admin/hospitals";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          phone,
          consultationFee,
          embeddedMapUrl,
          image,
          visitingDays: selectedDays,
          visitingHours,
          active: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Operation failed");
      }

      triggerToast(
        isEdit
          ? "Hospital updated successfully!"
          : "Hospital added successfully!",
      );
      onSaved();
      onClose();
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-lg">
              {isEdit ? "Edit Hospital & Chamber" : "Add New Hospital"}
            </h3>
            <p className="text-xs text-slate-400">
              Configure chamber name, address, visiting schedule & hours
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Hospital / Chamber Name <span className="text-rose-400">*</span>
            </label>
            <Input
              name="name"
              defaultValue={editingHospital?.name || ""}
              placeholder="e.g. City Care Hospital"
              required
              className="border-slate-800 bg-slate-950 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Full Address <span className="text-rose-400">*</span>
            </label>
            <Input
              name="address"
              defaultValue={editingHospital?.address || ""}
              placeholder="e.g. House 12, Road 8, Dhanmondi, Dhaka"
              required
              className="border-slate-800 bg-slate-950 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Phone Number
              </label>
              <Input
                name="phone"
                defaultValue={editingHospital?.phone || ""}
                placeholder="+8801700000000"
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Consultation Fee (৳)
              </label>
              <Input
                name="consultationFee"
                type="number"
                defaultValue={editingHospital?.consultationFee || 1000}
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
          </div>

          {/* Visiting Days Multi-Select */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-400" />
                <span>Visiting Days (Multiple Select)</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={selectAllDays}
                  className="rounded px-1.5 py-0.5 text-[10px] text-teal-400 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-800/40 font-medium"
                >
                  All Days
                </button>
                <button
                  type="button"
                  onClick={selectSatThu}
                  className="rounded px-1.5 py-0.5 text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium"
                >
                  Sat-Thu
                </button>
                <button
                  type="button"
                  onClick={selectMonFri}
                  className="rounded px-1.5 py-0.5 text-[10px] text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium"
                >
                  Mon-Fri
                </button>
                <button
                  type="button"
                  onClick={clearDays}
                  className="rounded px-1.5 py-0.5 text-[10px] text-rose-400 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Days toggle buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {ALL_WEEK_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                const shortDay = day.slice(0, 3);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-500/70 text-teal-300 shadow-sm shadow-teal-950"
                        : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-bold text-[11px]">{shortDay}</span>
                    <span className="text-[9px] opacity-80">
                      {isSelected ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedDays.length > 0 ? (
              <p className="text-[11px] text-teal-300/90 font-medium">
                Selected ({selectedDays.length} days): {selectedDays.join(", ")}
              </p>
            ) : (
              <p className="text-[11px] text-amber-400/90 font-medium">
                No visiting days selected.
              </p>
            )}
          </div>

          {/* Visiting Hours */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              <span>Visiting Hours</span>
            </label>
            <Input
              value={visitingHours}
              onChange={(e) => setVisitingHours(e.target.value)}
              placeholder="e.g. 05:00 PM - 09:00 PM"
              className="border-slate-800 bg-slate-950 text-slate-200"
            />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {VISITING_HOUR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setVisitingHours(preset)}
                    className={`rounded-md px-2 py-1 text-[10px] font-medium border transition-colors ${
                      visitingHours === preset
                        ? "bg-teal-500/20 text-teal-300 border-teal-500/60 font-semibold"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hospital Photo with File Upload Input */}
          <FileUploadInput
            label="Hospital Photo"
            value={image}
            onChange={(url) => setImage(url)}
            mediaList={mediaList}
            placeholder="Upload chamber photo or enter URL..."
          />

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Google Maps Embed URL
            </label>
            <Input
              name="embeddedMapUrl"
              defaultValue={editingHospital?.embeddedMapUrl || ""}
              placeholder="https://www.google.com/maps?q=...&output=embed"
              className="border-slate-800 bg-slate-950 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-800 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-500 text-white font-semibold gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              <span>{isEdit ? "Update Hospital" : "Save Hospital"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  const [swal, setSwal] = useState<SweetAlertConfig>({
    isOpen: false,
    title: "",
    type: "info",
  });

  // State collections
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryRecord[]>([]);
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [mediaList, setMediaList] = useState<MediaRecord[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<any>({});
  const [websiteSettings, setWebsiteSettings] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({
    name: "Super Admin",
    role: "super_admin",
  });

  // Super Admin Security & Credentials State
  const [securityForm, setSecurityForm] = useState({
    name: "Dr. Rashed Super Admin",
    username: "admin",
    email: "admin@doctorcare.test",
    currentPin: "",
    newPin: "",
    confirmNewPin: "",
  });
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Dedicated SEO Suite state
  const [seoScope, setSeoScope] = useState<"doctor" | "website">("doctor");
  const [seoForm, setSeoForm] = useState<any>({
    seoTitle: "",
    metaDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    noIndex: false,
  });

  // Filters & Search
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentHospitalFilter, setAppointmentHospitalFilter] =
    useState("all");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("all");

  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleHospitalFilter, setScheduleHospitalFilter] = useState("all");
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState("all");

  const [hospitalSearch, setHospitalSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  // Modals state
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalRecord | null>(
    null,
  );

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRecord | null>(
    null,
  );

  const [isPatientDrawerOpen, setIsPatientDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] =
    useState<Partial<PatientRecord> | null>(null);
  const [isEditingPatientHistory, setIsEditingPatientHistory] = useState(false);
  const [inlinePatientHistory, setInlinePatientHistory] = useState("");
  const [savingPatientHistory, setSavingPatientHistory] = useState(false);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostRecord | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(
    null,
  );

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryRecord | null>(
    null,
  );

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialRecord | null>(null);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqRecord | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsTargetAppointment, setSmsTargetAppointment] =
    useState<AppointmentRecord | null>(null);
  const [smsText, setSmsText] = useState("");

  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all initial data from MongoDB
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        hospitalsRes,
        schedulesRes,
        patientsRes,
        appointmentsRes,
        incomesRes,
        expensesRes,
        blogRes,
        servicesRes,
        testimonialsRes,
        galleryRes,
        faqsRes,
        mediaRes,
        doctorRes,
        websiteRes,
        analyticsRes,
        meRes,
      ] = await Promise.all([
        fetch("/api/admin/hospitals")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/schedules")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/patients")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/appointments")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/incomes")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/expenses")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/blog-posts")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/services")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/testimonials")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/gallery-items")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/faqs")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/media")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/admin/doctor")
          .then((r) => r.json())
          .catch(() => ({ data: {} })),
        fetch("/api/admin/website-setting")
          .then((r) => r.json())
          .catch(() => ({ data: {} })),
        fetch("/api/admin/analytics")
          .then((r) => r.json())
          .catch(() => null),
        fetch("/api/auth/admin/me")
          .then((r) => r.json())
          .catch(() => ({ user: null })),
      ]);

      setHospitals(hospitalsRes.data || []);
      setSchedules(schedulesRes.data || []);
      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setIncomes(incomesRes.data || []);
      setExpenses(expensesRes.data || []);
      setBlogPosts(blogRes.data || []);
      setServices(servicesRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setGalleryItems(galleryRes.data || []);
      setFaqs(faqsRes.data || []);
      setMediaList(mediaRes.data || []);
      setDoctorProfile(doctorRes.data || {});
      setWebsiteSettings(websiteRes.data || {});
      setAnalytics(analyticsRes);
      if (meRes?.user) setCurrentUser(meRes.user);

      // Initialize SEO Form from Doctor Profile
      if (doctorRes.data?.seo) {
        setSeoForm(doctorRes.data.seo);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync security form with loaded admin user profile
  useEffect(() => {
    if (currentUser) {
      setSecurityForm((prev) => ({
        ...prev,
        name: currentUser.name || "Dr. Rashed Super Admin",
        username: currentUser.username || "admin",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  // Update SEO form when changing scope
  useEffect(() => {
    if (seoScope === "doctor") {
      setSeoForm(doctorProfile.seo || {});
    } else {
      setSeoForm(websiteSettings.defaultSeo || {});
    }
  }, [seoScope, doctorProfile, websiteSettings]);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(""), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(""), 3000);
    }
  };

  // Appointment Actions
  const handleUpdateAppointmentStatus = async (
    id: string,
    status: "pending" | "approved" | "cancelled" | "completed",
    paymentStatus?: "pending" | "paid" | "failed" | "refunded",
  ) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      setAppointments((prev) =>
        prev.map((a) =>
          recordId(a) === id
            ? {
                ...a,
                status,
                appointmentStatus: status,
                ...(paymentStatus ? { paymentStatus } : {}),
              }
            : a,
        ),
      );
      triggerToast(`Appointment marked as ${status}`);
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleDeleteRecord = async (
    collection: string,
    id: string,
    name: string,
  ) => {
    setSwal({
      isOpen: true,
      title: `Delete ${name}?`,
      text: "This operation cannot be undone. Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/${collection}/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Delete failed");
          triggerToast(`${name} deleted successfully`);
          loadAllData();
        } catch (err: any) {
          triggerToast(err.message, true);
        }
      },
    });
  };

  // Patient Actions & Clinical Medical History
  const handleSavePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = (
      form.elements.namedItem("fullName") as HTMLInputElement
    ).value.trim();
    const mobileNumber = (
      form.elements.namedItem("mobileNumber") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const ageVal = (form.elements.namedItem("age") as HTMLInputElement).value;
    const age = ageVal ? Number(ageVal) : undefined;
    const gender = (form.elements.namedItem("gender") as HTMLSelectElement)
      .value;
    const address = (
      form.elements.namedItem("address") as HTMLInputElement
    ).value.trim();
    const emergencyContact = (
      form.elements.namedItem("emergencyContact") as HTMLInputElement
    ).value.trim();
    const medicalHistory = (
      form.elements.namedItem("medicalHistory") as HTMLTextAreaElement
    ).value.trim();

    if (!fullName || !mobileNumber) {
      triggerToast("Full Name and Mobile Number are required", true);
      return;
    }

    try {
      const isEdit = Boolean(editingPatient && recordId(editingPatient));
      const url = isEdit
        ? `/api/admin/patients/${recordId(editingPatient)}`
        : "/api/admin/patients";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          email,
          age,
          gender,
          address,
          emergencyContact,
          medicalHistory,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to save patient");
      }

      const { data: savedRecord } = await res.json();
      triggerToast(
        isEdit
          ? "Patient details & medical history updated!"
          : "New patient registered successfully!",
      );
      setIsPatientModalOpen(false);

      setPatients((prev) => {
        if (isEdit) {
          return prev.map((p) =>
            recordId(p) === recordId(savedRecord)
              ? { ...p, ...savedRecord }
              : p,
          );
        } else {
          return [savedRecord, ...prev];
        }
      });

      if (
        selectedPatient &&
        recordId(selectedPatient) === recordId(savedRecord)
      ) {
        setSelectedPatient(savedRecord);
        setInlinePatientHistory(savedRecord.medicalHistory || "");
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to save patient", true);
    }
  };

  const handleUpdatePatientHistoryDirect = async (
    patient: PatientRecord,
    newHistory: string,
  ) => {
    setSavingPatientHistory(true);
    try {
      const pid = recordId(patient);
      const res = await fetch(`/api/admin/patients/${pid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalHistory: newHistory }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update medical history");
      }

      triggerToast("Patient medical history updated successfully!");

      setPatients((prev) =>
        prev.map((p) =>
          recordId(p) === pid ? { ...p, medicalHistory: newHistory } : p,
        ),
      );

      if (selectedPatient && recordId(selectedPatient) === pid) {
        setSelectedPatient({ ...selectedPatient, medicalHistory: newHistory });
        setInlinePatientHistory(newHistory);
      }
      setIsEditingPatientHistory(false);
    } catch (err: any) {
      triggerToast(err.message || "Failed to update history", true);
    } finally {
      setSavingPatientHistory(false);
    }
  };

  const handleDeletePatient = (patient: PatientRecord) => {
    const pid = recordId(patient);
    setSwal({
      isOpen: true,
      title: `Delete patient "${patient.fullName}"?`,
      text: "This will remove the patient record from the directory. Are you sure?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/patients/${pid}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete patient");
          triggerToast("Patient record deleted successfully");
          setPatients((prev) => prev.filter((p) => recordId(p) !== pid));
          if (selectedPatient && recordId(selectedPatient) === pid) {
            setIsPatientDrawerOpen(false);
            setSelectedPatient(null);
          }
          setIsPatientModalOpen(false);
        } catch (err: any) {
          triggerToast(err.message || "Delete failed", true);
        }
      },
    });
  };

  // Save SEO Settings
  const handleSaveSeo = async () => {
    setSaving(true);
    try {
      if (seoScope === "doctor") {
        const updatedDoctor = { ...doctorProfile, seo: seoForm };
        const res = await fetch("/api/admin/doctor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDoctor),
        });
        if (!res.ok) throw new Error("Failed to save doctor SEO");
        setDoctorProfile(updatedDoctor);
        triggerToast("Doctor SEO settings saved successfully!");
      } else {
        const updatedWebsite = { ...websiteSettings, defaultSeo: seoForm };
        const res = await fetch("/api/admin/website-setting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedWebsite),
        });
        if (!res.ok) throw new Error("Failed to save website SEO");
        setWebsiteSettings(updatedWebsite);
        triggerToast("Website Global SEO settings saved successfully!");
      }
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setSaving(false);
    }
  };

  // Seed Database Handler
  const handleSeedDatabase = () => {
    setSwal({
      isOpen: true,
      title: "Seed / Reset Database?",
      text: "This will initialize MongoDB with complete clinical, doctor profile, schedules, and financial demo data.",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Seed Database",
      onConfirm: async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/admin/seed", { method: "POST" });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Seed failed");
          setSwal({
            isOpen: true,
            title: "Database Seeded!",
            text: "All collections and sample clinical data have been successfully populated into MongoDB.",
            type: "success",
          });
          await loadAllData();
        } catch (err: any) {
          triggerToast(err.message, true);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // File Upload Handler for Media Library
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    setUploadingFile(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setMediaList((prev) => [json.data, ...prev]);
      triggerToast("File uploaded successfully to Media Library!");
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Super Admin Credentials Update Handler
  const handleChangeAdminCredentials = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!securityForm.currentPin) {
      triggerToast("Current PIN is required to authorize changes", true);
      return;
    }

    if (securityForm.newPin && securityForm.newPin.length < 4) {
      triggerToast("New PIN must be at least 4 characters", true);
      return;
    }

    if (securityForm.newPin && securityForm.newPin !== securityForm.confirmNewPin) {
      triggerToast("New PIN and confirmation PIN do not match", true);
      return;
    }

    if (securityForm.username && securityForm.username.length < 3) {
      triggerToast("Username must be at least 3 characters", true);
      return;
    }

    setSavingSecurity(true);
    try {
      const res = await fetch("/api/auth/admin/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPin: securityForm.currentPin,
          newUsername: securityForm.username.trim(),
          newPin: securityForm.newPin ? securityForm.newPin.trim() : undefined,
          name: securityForm.name.trim(),
          email: securityForm.email ? securityForm.email.trim() : "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update admin credentials");
      }

      triggerToast(data.message || "Admin credentials updated successfully in MongoDB!");
      if (data.user) {
        setCurrentUser(data.user);
      }
      setSecurityForm((prev) => ({
        ...prev,
        currentPin: "",
        newPin: "",
        confirmNewPin: "",
      }));
    } catch (err: any) {
      triggerToast(err.message || "Failed to update admin credentials", true);
    } finally {
      setSavingSecurity(false);
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        !appointmentSearch ||
        (a.patientName || "")
          .toLowerCase()
          .includes(appointmentSearch.toLowerCase()) ||
        (a.mobileNumber || "").includes(appointmentSearch) ||
        (a.hospitalName || "")
          .toLowerCase()
          .includes(appointmentSearch.toLowerCase());

      const matchHospital =
        appointmentHospitalFilter === "all" ||
        (a.hospitalName || "") === appointmentHospitalFilter;

      const matchStatus =
        appointmentStatusFilter === "all" ||
        (a.status || a.appointmentStatus || "pending") ===
          appointmentStatusFilter;

      return matchSearch && matchHospital && matchStatus;
    });
  }, [
    appointments,
    appointmentSearch,
    appointmentHospitalFilter,
    appointmentStatusFilter,
  ]);

  // Filtered Schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const hospitalName = s.hospital?.name || "";
      const matchSearch =
        !scheduleSearch ||
        (s.title || "").toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        hospitalName.toLowerCase().includes(scheduleSearch.toLowerCase());

      const matchHospital =
        scheduleHospitalFilter === "all" ||
        hospitalName === scheduleHospitalFilter;

      const matchStatus =
        scheduleStatusFilter === "all" ||
        (s.scheduleStatus || "scheduled") === scheduleStatusFilter;

      return matchSearch && matchHospital && matchStatus;
    });
  }, [schedules, scheduleSearch, scheduleHospitalFilter, scheduleStatusFilter]);

  // Filtered Hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      return (
        !hospitalSearch ||
        (h.name || "").toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        (h.address || "").toLowerCase().includes(hospitalSearch.toLowerCase())
      );
    });
  }, [hospitals, hospitalSearch]);

  // Filtered Patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = (patientSearch || "").toLowerCase().trim();
      if (!q) return true;
      return (
        (p.fullName || "").toLowerCase().includes(q) ||
        (p.mobileNumber || "").includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.medicalHistory || "").toLowerCase().includes(q)
      );
    });
  }, [patients, patientSearch]);

  // Financial Stats
  const financialTotals = useMemo(() => {
    const totalInc = incomes.reduce(
      (sum, i) => sum + (Number(i.amount) || 0),
      0,
    );
    const totalExp = expenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    );
    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      netProfit: totalInc - totalExp,
    };
  }, [incomes, expenses]);

  return (
    <div className="flex min-h-screen bg-[#0d131f] text-slate-100 antialiased selection:bg-teal-500/30 selection:text-teal-200">
      {/* Sweet Alert Dialog */}
      <SweetAlertModal
        config={swal}
        onClose={() => setSwal((s) => ({ ...s, isOpen: false }))}
      />

      {/* Floating Notifications */}
      {actionSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-950/90 px-5 py-3.5 text-sm font-medium text-teal-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-950/90 px-5 py-3.5 text-sm font-medium text-rose-200 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800/80 bg-[#090d16] transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/30 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
                <span className="text-base">Dr. Rashed</span>
                <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/20">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                MongoDB Next.js Engine
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Main Dashboard */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Core Center
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "dashboard"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 shadow-inner"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-teal-400" />
                <span>Dashboard & Analytics</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "appointments"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-4 w-4 text-emerald-400" />
                  <span>Appointments</span>
                </div>
                {appointments.filter((a) => a.status === "pending").length >
                  0 && (
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-300">
                    {appointments.filter((a) => a.status === "pending").length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Clinical & Schedules */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Clinical Operations
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("schedules");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "schedules"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <CalendarClock className="h-4 w-4 text-cyan-400" />
                <span>Hospital Schedules</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("hospitals");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "hospitals"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Hospital className="h-4 w-4 text-indigo-400" />
                <span>Hospitals & Chambers</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("patients");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "patients"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Users className="h-4 w-4 text-blue-400" />
                <span>Patients Directory</span>
              </button>
            </div>
          </div>

          {/* CMS Content Management */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Content Management
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("cms-doctor");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-doctor"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <User className="h-4 w-4 text-violet-400" />
                <span>Doctor Profile</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-expertise");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-expertise"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Expertise & Highlights</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-credentials");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-credentials"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>Doctor Credentials</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-website");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-website"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Globe className="h-4 w-4 text-sky-400" />
                <span>Website Settings</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-blog");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-blog"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>Blog Articles</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-services");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-services"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Activity className="h-4 w-4 text-pink-400" />
                <span>Medical Services</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-testimonials");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-testimonials"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Star className="h-4 w-4 text-amber-400" />
                <span>Testimonials</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-gallery");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-gallery"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <ImageIcon className="h-4 w-4 text-teal-400" />
                <span>Gallery & Photos</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("cms-faqs");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "cms-faqs"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-orange-400" />
                <span>FAQs</span>
              </button>
            </div>
          </div>

          {/* Finance, Media & Growth */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Finance & Tools
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("finance");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "finance"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span>Finance & Ledger</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("media");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "media"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <UploadCloud className="h-4 w-4 text-cyan-400" />
                <span>Media Library</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("seo");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "seo"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>SEO Suite & Social</span>
              </button>
            </div>
          </div>

          {/* System & Administration */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              System & Security
            </p>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("security");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "security"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span>Admin Credentials</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("system");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "system"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Database className="h-4 w-4 text-emerald-400" />
                <span>MongoDB & Database</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Info & Quick Action Footer */}
        <div className="border-t border-slate-800/80 p-4 bg-[#070b12]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab("security");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-left group hover:opacity-90 transition-opacity"
              title="Click to edit admin credentials"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-bold text-sm group-hover:border-teal-500/60 group-hover:text-teal-300">
                {currentUser?.name
                  ? currentUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "SA"}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors">
                  {currentUser?.name || "Dr. Rashed Admin"}
                </p>
                <p className="truncate text-[10px] text-teal-400 font-medium capitalize flex items-center gap-1">
                  <span>{currentUser?.role || "super_admin"}</span>
                  <KeyRound className="h-2.5 w-2.5 opacity-60" />
                </p>
              </div>
            </button>
            <LogoutButton mode="admin" />
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top App Bar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800/80 bg-[#090d16]/80 px-6 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white capitalize flex items-center gap-2">
                {activeTab.replace("cms-", "CMS: ").replace("-", " ")}
              </h1>
              <p className="text-xs text-slate-400">
                Patient Management System.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={loadAllData}
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl gap-2 shadow-sm text-xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Link href="/" target="_blank" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl gap-2 shadow-sm text-xs"
              >
                <Eye className="h-3.5 w-3.5 text-teal-400" />
                <span>Live Site</span>
              </Button>
            </Link>

            <Button
              onClick={handleSeedDatabase}
              size="sm"
              className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-semibold rounded-xl text-xs gap-1.5 shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Seed DB</span>
            </Button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0a0f1a]">
          {loading && !analytics ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
                <p className="text-sm text-slate-400">
                  Connecting to MongoDB & loading dataset...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ================= 1. DASHBOARD & ANALYTICS TAB ================= */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Total Appointments
                          </p>
                          <h3 className="mt-1 text-2xl font-black text-white">
                            {appointments.length}
                          </h3>
                          <p className="mt-1 text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              {
                                appointments.filter(
                                  (a) => a.status === "approved",
                                ).length
                              }{" "}
                              Approved
                            </span>
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                          <CalendarCheck className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
                    </Card>

                    <Card className="border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Pending Requests
                          </p>
                          <h3 className="mt-1 text-2xl font-black text-amber-300">
                            {
                              appointments.filter((a) => a.status === "pending")
                                .length
                            }
                          </h3>
                          <p className="mt-1 text-xs text-amber-400/80 font-medium">
                            Requires approval
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                          <Clock className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
                    </Card>

                    <Card className="border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Registered Patients
                          </p>
                          <h3 className="mt-1 text-2xl font-black text-white">
                            {patients.length}
                          </h3>
                          <p className="mt-1 text-xs text-cyan-400 font-medium">
                            Unique mobile profiles
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-400" />
                    </Card>

                    <Card className="border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Net Profit (Ledger)
                          </p>
                          <h3 className="mt-1 text-2xl font-black text-emerald-400">
                            ৳{financialTotals.netProfit.toLocaleString()}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Income - Expenses
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                    </Card>
                  </div>

                  {/* Upcoming Consultations & Urgent Queue */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-teal-400" />
                            <span>Upcoming Schedules & Live Slots</span>
                          </h3>
                          <p className="text-xs text-slate-400">
                            Active consultation sessions across hospitals
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setEditingSchedule(null);
                            setIsScheduleModalOpen(true);
                          }}
                          size="sm"
                          className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/20 rounded-xl text-xs gap-1.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>New Schedule</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedules
                          .filter((s) => s.scheduleStatus !== "cancelled")
                          .slice(0, 4)
                          .map((sched) => (
                            <Card
                              key={recordId(sched)}
                              className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl hover:border-slate-700 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-[11px] mb-2 font-medium">
                                    {sched.hospital?.name || "Clinic"}
                                  </Badge>
                                  <h4 className="font-bold text-white text-base leading-snug">
                                    {sched.title}
                                  </h4>
                                </div>
                                <span className="text-sm font-bold text-emerald-400">
                                  ৳{sched.fee || 1000}
                                </span>
                              </div>

                              <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                  <span>
                                    {formatSlotDateLong(sched.startsAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                                  <span>
                                    {formatSlotTimeRangeOnly(
                                      sched.startsAt,
                                      sched.endsAt,
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-slate-400">
                                    Slot Duration:{" "}
                                    {sched.slotDurationMinutes || 10} min
                                  </span>
                                  <span className="text-teal-400 font-semibold">
                                    Max: {sched.maxAppointments || 20} slots
                                  </span>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Pending Urgent Queue */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                          <span>Pending Approval</span>
                        </h3>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                          {
                            appointments.filter((a) => a.status === "pending")
                              .length
                          }{" "}
                          Queue
                        </Badge>
                      </div>

                      <Card className="border-slate-800 bg-slate-900/80 p-4 rounded-2xl divide-y divide-slate-800/80 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                        {appointments.filter((a) => a.status === "pending")
                          .length === 0 ? (
                          <div className="py-12 text-center text-slate-500">
                            <CheckCircle2 className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                            <p className="text-sm">No pending appointments</p>
                            <p className="text-xs text-slate-600">
                              All bookings are confirmed
                            </p>
                          </div>
                        ) : (
                          appointments
                            .filter((a) => a.status === "pending")
                            .slice(0, 5)
                            .map((appt) => (
                              <div
                                key={recordId(appt)}
                                className="py-3.5 first:pt-0 last:pb-0 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-white text-sm">
                                      {appt.patientName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {appt.mobileNumber}
                                    </p>
                                  </div>
                                  <Badge className="bg-slate-800 text-teal-300 border-slate-700 font-mono text-xs">
                                    Queue #{appt.queueNumber}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400 truncate">
                                  {appt.hospitalName} •{" "}
                                  {formatSlotTimeRangeOnly(
                                    appt.slotStart,
                                    appt.slotEnd,
                                  )}
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                  <Button
                                    onClick={() =>
                                      handleUpdateAppointmentStatus(
                                        recordId(appt),
                                        "approved",
                                      )
                                    }
                                    size="sm"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg h-7 text-xs font-semibold"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleUpdateAppointmentStatus(
                                        recordId(appt),
                                        "cancelled",
                                      )
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-700 text-rose-300 hover:bg-rose-950/40 rounded-lg h-7 text-xs"
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            ))
                        )}
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 2. APPOINTMENTS MANAGER TAB ================= */}
              {activeTab === "appointments" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Appointment Bookings
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage patient reservations, queues, status, and notes
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <a
                        href="/api/admin/export?type=appointments&format=csv"
                        download
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-800 bg-slate-900 text-slate-300 rounded-xl text-xs gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Export CSV</span>
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <Card className="border-slate-800 bg-slate-900/60 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={appointmentSearch}
                        onChange={(e) => setAppointmentSearch(e.target.value)}
                        placeholder="Search by patient name, mobile, hospital, or reason..."
                        className="pl-10 border-slate-800 bg-slate-950/80 text-sm rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <select
                        value={appointmentHospitalFilter}
                        onChange={(e) =>
                          setAppointmentHospitalFilter(e.target.value)
                        }
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-teal-500"
                      >
                        <option value="all">All Hospitals</option>
                        {hospitals.map((h) => (
                          <option key={recordId(h)} value={h.name}>
                            {h.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={appointmentStatusFilter}
                        onChange={(e) =>
                          setAppointmentStatusFilter(e.target.value)
                        }
                        className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-teal-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </Card>

                  {/* Appointments Table */}
                  <Card className="border-slate-800 bg-slate-900/80 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          <tr>
                            <th className="px-5 py-4">Queue</th>
                            <th className="px-5 py-4">Patient Profile</th>
                            <th className="px-5 py-4">Hospital & Chamber</th>
                            <th className="px-5 py-4">Slot Date & Time</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Payment</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="py-12 text-center text-slate-500"
                              >
                                No appointments found matching criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((appt) => (
                              <tr
                                key={recordId(appt)}
                                className="hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="px-5 py-4">
                                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-teal-400 font-mono font-bold text-xs border border-slate-700">
                                    #{appt.queueNumber}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="font-bold text-white">
                                    {appt.patientName}
                                  </div>
                                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <Phone className="h-3 w-3 text-slate-500" />
                                    <span>{appt.mobileNumber}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="font-medium text-slate-200">
                                    {appt.hospitalName || "Clinic"}
                                  </div>
                                  {appt.reason && (
                                    <div className="text-xs text-slate-400 truncate max-w-xs">
                                      {appt.reason}
                                    </div>
                                  )}
                                </td>
                                <td className="px-5 py-4 text-xs">
                                  <div className="font-semibold text-slate-200">
                                    {formatSlotDateLong(appt.slotStart)}
                                  </div>
                                  <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Clock className="h-3 w-3 text-slate-500" />
                                    <span>
                                      {formatSlotTimeRangeOnly(
                                        appt.slotStart,
                                        appt.slotEnd,
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <Badge
                                    className={`capitalize font-semibold text-[11px] ${
                                      appt.status === "approved"
                                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                        : appt.status === "pending"
                                          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                          : appt.status === "completed"
                                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                    }`}
                                  >
                                    {appt.status || "pending"}
                                  </Badge>
                                </td>
                                <td className="px-5 py-4 text-xs">
                                  <Badge
                                    className={`capitalize text-[10px] ${
                                      appt.paymentStatus === "paid"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                    }`}
                                  >
                                    {appt.paymentStatus || "pending"}
                                  </Badge>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {appt.status === "pending" && (
                                      <Button
                                        onClick={() =>
                                          handleUpdateAppointmentStatus(
                                            recordId(appt),
                                            "approved",
                                          )
                                        }
                                        size="sm"
                                        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold px-2.5"
                                      >
                                        Approve
                                      </Button>
                                    )}
                                    {appt.status === "approved" && (
                                      <Button
                                        onClick={() =>
                                          handleUpdateAppointmentStatus(
                                            recordId(appt),
                                            "completed",
                                            "paid",
                                          )
                                        }
                                        size="sm"
                                        className="h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold px-2.5"
                                      >
                                        Complete
                                      </Button>
                                    )}
                                    <Button
                                      onClick={() => {
                                        setSmsTargetAppointment(appt);
                                        setSmsText(
                                          `Dear ${appt.patientName}, your appointment Queue #${appt.queueNumber} at ${appt.hospitalName} is confirmed.`,
                                        );
                                        setIsSmsModalOpen(true);
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="h-8 w-8 p-0 border-slate-700 bg-slate-800 text-slate-300 hover:text-white rounded-lg"
                                      title="Send SMS / Note"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDeleteRecord(
                                          "appointments",
                                          recordId(appt),
                                          `Appointment #${appt.queueNumber}`,
                                        )
                                      }
                                      size="sm"
                                      variant="outline"
                                      className="h-8 w-8 p-0 border-slate-700 hover:bg-rose-950/40 text-rose-400 rounded-lg"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ================= 3. HOSPITALS & CHAMBERS TAB ================= */}
              {activeTab === "hospitals" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Hospital Chambers & Clinics
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage consulting locations, Google Maps, fees, and
                        contact details
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingHospital(null);
                        setIsHospitalModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Hospital</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHospitals.map((hosp) => (
                      <Card
                        key={recordId(hosp)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge
                                className={
                                  hosp.active !== false
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20 text-[10px] mb-1.5"
                                    : "bg-slate-800 text-slate-400 border-slate-700 text-[10px] mb-1.5"
                                }
                              >
                                {hosp.active !== false
                                  ? "Active Location"
                                  : "Inactive"}
                              </Badge>
                              <h3 className="text-lg font-bold text-white">
                                {hosp.name}
                              </h3>
                            </div>
                            <span className="text-sm font-bold text-emerald-400">
                              ৳{hosp.consultationFee || 1000}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                            <span>{hosp.address}</span>
                          </p>

                          {hosp.phone && (
                            <p className="text-xs text-slate-300 flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              <span>{hosp.phone}</span>
                            </p>
                          )}

                          {/* Visiting Days & Hours */}
                          {((hosp.visitingDays && hosp.visitingDays.length > 0) || hosp.visitingHours) && (
                            <div className="space-y-1.5 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                              {hosp.visitingDays && hosp.visitingDays.length > 0 && (
                                <div className="flex items-start gap-1.5 text-xs text-slate-300">
                                  <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                                  <div className="flex flex-wrap gap-1">
                                    {hosp.visitingDays.map((d) => (
                                      <span
                                        key={d}
                                        className="rounded bg-teal-950/70 border border-teal-800/50 px-1.5 py-0.2 text-[10px] font-medium text-teal-300"
                                      >
                                        {d.slice(0, 3)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {hosp.visitingHours && (
                                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span className="font-medium text-emerald-300/90">{hosp.visitingHours}</span>
                                </p>
                              )}
                            </div>
                          )}

                          {hosp.image && (
                            <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl border border-slate-800">
                              <img
                                src={safeImageSrc(hosp.image)}
                                alt={hosp.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}

                          {hosp.embeddedMapUrl && (
                            <div className="mt-2 aspect-video w-full overflow-hidden rounded-xl border border-slate-800">
                              <iframe
                                src={hosp.embeddedMapUrl}
                                className="h-full w-full border-0"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>

                        <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            ID: {recordId(hosp).slice(-6)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setEditingHospital(hosp);
                                setIsHospitalModalOpen(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="h-8 border-slate-700 bg-slate-800 text-slate-200 text-xs rounded-lg gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteRecord(
                                  "hospitals",
                                  recordId(hosp),
                                  hosp.name || "Hospital",
                                )
                              }
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-slate-700 hover:bg-rose-950/40 text-rose-400 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 4. SCHEDULES TAB ================= */}
              {activeTab === "schedules" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Hospital Schedules & Slots
                      </h2>
                      <p className="text-xs text-slate-400">
                        Configure consultation schedules with automated slot
                        time calculations
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingSchedule(null);
                        setIsScheduleModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Schedule</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchedules.map((sched) => (
                      <Card
                        key={recordId(sched)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/20 text-[10px]">
                              {sched.hospital?.name || "Clinic"}
                            </Badge>
                            <Badge
                              className={
                                sched.scheduleStatus === "scheduled"
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20 text-[10px]"
                                  : "bg-rose-500/15 text-rose-300 text-[10px]"
                              }
                            >
                              {sched.scheduleStatus || "scheduled"}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-bold text-white">
                            {sched.title}
                          </h3>

                          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-500" />
                              <span className="font-medium text-slate-200">
                                {formatSlotDateLong(sched.startsAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-500" />
                              <span>
                                {formatSlotTimeRangeOnly(
                                  sched.startsAt,
                                  sched.endsAt,
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 pt-1">
                              <span>
                                Slot Duration: {sched.slotDurationMinutes || 10}{" "}
                                mins
                              </span>
                              <span className="text-emerald-400 font-bold">
                                ৳{sched.fee || 1000}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            Slug: {sched.slug}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setEditingSchedule(sched);
                                setIsScheduleModalOpen(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="h-8 border-slate-700 bg-slate-800 text-slate-200 text-xs rounded-lg gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteRecord(
                                  "schedules",
                                  recordId(sched),
                                  sched.title || "Schedule",
                                )
                              }
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-slate-700 hover:bg-rose-950/40 text-rose-400 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 5. PATIENTS DIRECTORY TAB ================= */}
              {activeTab === "patients" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Patients Directory
                      </h2>
                      <p className="text-xs text-slate-400">
                        Patient profiles, clinical history, prescriptions, and
                        report logs
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Button
                        onClick={() => {
                          setEditingPatient({
                            fullName: "",
                            mobileNumber: "",
                            email: "",
                            age: undefined,
                            gender: "",
                            address: "",
                            emergencyContact: "",
                            medicalHistory: "",
                          });
                          setIsPatientModalOpen(true);
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold shadow-sm"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Patient</span>
                      </Button>
                      <a
                        href="/api/admin/export?type=patients&format=csv"
                        download
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-800 bg-slate-900 text-slate-300 rounded-xl text-xs gap-1.5 hover:text-white"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Export CSV</span>
                        </Button>
                      </a>
                    </div>
                  </div>

                  <Card className="border-slate-800 bg-slate-900/60 p-4 rounded-2xl">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="Search patients by name, mobile, address, or medical history / diagnosis..."
                        className="pl-10 border-slate-800 bg-slate-950/80 text-sm rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-teal-500"
                      />
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.length === 0 ? (
                      <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                        <Users className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          No patient records found
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Try adjusting your search or add a new patient.
                        </p>
                      </div>
                    ) : (
                      filteredPatients.map((patient) => (
                        <Card
                          key={recordId(patient)}
                          className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20 text-base">
                                  {patient.fullName
                                    ? patient.fullName.charAt(0).toUpperCase()
                                    : "P"}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-white text-base leading-snug truncate">
                                    {patient.fullName}
                                  </h3>
                                  <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-slate-500" />
                                    <span>{patient.mobileNumber}</span>
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingPatient(patient);
                                  setIsPatientModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-lg shrink-0"
                                title="Edit Patient & Medical History"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span className="capitalize">
                                  Gender:{" "}
                                  <strong className="text-slate-200">
                                    {patient.gender || "Not specified"}
                                  </strong>
                                </span>
                                <span>
                                  Age:{" "}
                                  <strong className="text-slate-200">
                                    {patient.age ? `${patient.age} yrs` : "N/A"}
                                  </strong>
                                </span>
                              </div>
                              {patient.address && (
                                <p className="text-slate-400 truncate">
                                  Address: {patient.address}
                                </p>
                              )}
                              {patient.medicalHistory ? (
                                <div className="text-[11px] bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200/90 space-y-1">
                                  <div className="flex items-center justify-between font-semibold text-amber-300">
                                    <span className="flex items-center gap-1">
                                      <Activity className="h-3 w-3" />
                                      <span>Clinical History</span>
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPatient(patient);
                                        setInlinePatientHistory(
                                          patient.medicalHistory || "",
                                        );
                                        setIsEditingPatientHistory(true);
                                        setIsPatientDrawerOpen(true);
                                      }}
                                      className="text-[10px] text-amber-300 hover:text-white underline"
                                    >
                                      Change
                                    </button>
                                  </div>
                                  <p className="line-clamp-2 text-amber-100/80">
                                    {patient.medicalHistory}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-[11px] bg-slate-950/60 p-2 rounded-lg border border-dashed border-slate-800 text-slate-500 flex items-center justify-between">
                                  <span>No medical history recorded</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPatient(patient);
                                      setInlinePatientHistory("");
                                      setIsEditingPatientHistory(true);
                                      setIsPatientDrawerOpen(true);
                                    }}
                                    className="text-[10px] text-teal-400 hover:underline flex items-center gap-0.5"
                                  >
                                    <Plus className="h-2.5 w-2.5" />
                                    <span>Add History</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setInlinePatientHistory(
                                  patient.medicalHistory || "",
                                );
                                setIsEditingPatientHistory(false);
                                setIsPatientDrawerOpen(true);
                              }}
                              size="sm"
                              className="flex-1 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/20 rounded-xl text-xs font-semibold"
                            >
                              <span>View Medical Record</span>
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingPatient(patient);
                                setIsPatientModalOpen(true);
                              }}
                              size="sm"
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 border border-slate-700/80 rounded-xl text-xs font-semibold px-3"
                              title="Edit Patient Details & History"
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              <span>Edit</span>
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ================= 6. CMS: DOCTOR PROFILE TAB ================= */}
              {activeTab === "cms-doctor" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Doctor Profile CMS
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage physician identity, biography, credentials,
                        photos, and services
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          const res = await fetch("/api/admin/doctor", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(doctorProfile),
                          });
                          if (!res.ok) throw new Error("Save failed");
                          triggerToast(
                            "Doctor profile updated successfully in MongoDB!",
                          );
                        } catch (err: any) {
                          triggerToast(err.message, true);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Check className="h-4 w-4" />
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Looking for Highlight Cards & Credentials?</p>
                        <p className="text-[11px] text-slate-400">
                          Education, Experience, Publications cards & Qualifications, Specialisations, Languages, etc. now have dedicated menus in the sidebar.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("cms-expertise")}
                        className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-teal-300 text-xs gap-1.5 h-8 rounded-xl"
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>Expertise Cards</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("cms-credentials")}
                        className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs gap-1.5 h-8 rounded-xl"
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>Credentials</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* General Information */}
                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                        <User className="h-4 w-4 text-teal-400" />
                        <span>Basic Information</span>
                      </h3>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">
                            Full Name
                          </label>
                          <Input
                            value={doctorProfile.name || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                name: e.target.value,
                              })
                            }
                            placeholder="Dr. Md. Rashedul Alam"
                            className="border-slate-800 bg-slate-950 text-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Designation
                            </label>
                            <Input
                              value={doctorProfile.designation || ""}
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  designation: e.target.value,
                                })
                              }
                              placeholder="Senior Consultant"
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Specialization
                            </label>
                            <Input
                              value={doctorProfile.specialization || ""}
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  specialization: e.target.value,
                                })
                              }
                              placeholder="Internal Medicine"
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">
                            Title & Specialty Line
                          </label>
                          <Input
                            value={doctorProfile.title || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                title: e.target.value,
                              })
                            }
                            placeholder="Consultant Medicine Specialist"
                            className="border-slate-800 bg-slate-950 text-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Registration # (BMDC)
                            </label>
                            <Input
                              value={
                                doctorProfile.medicalRegistrationNumber || ""
                              }
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  medicalRegistrationNumber: e.target.value,
                                })
                              }
                              placeholder="BMDC A-123456"
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Years Experience
                            </label>
                            <Input
                              type="number"
                              value={doctorProfile.yearsOfExperience || 15}
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  yearsOfExperience: Number(e.target.value),
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                        </div>

                        {/* Profile Photo File Upload Input */}
                        <FileUploadInput
                          label="Doctor Profile Photo"
                          value={doctorProfile.image || ""}
                          onChange={(url) =>
                            setDoctorProfile({ ...doctorProfile, image: url })
                          }
                          mediaList={mediaList}
                          placeholder="Upload photo or enter URL..."
                        />

                        {/* About Image File Upload Input */}
                        <FileUploadInput
                          label="About Section Portrait"
                          value={doctorProfile.aboutImageUrl || ""}
                          onChange={(url) =>
                            setDoctorProfile({
                              ...doctorProfile,
                              aboutImageUrl: url,
                            })
                          }
                          mediaList={mediaList}
                          placeholder="Upload about photo or enter URL..."
                        />

                        <div>
                          <label className="block text-slate-400 mb-1">
                            Biography
                          </label>
                          <textarea
                            rows={4}
                            value={doctorProfile.biography || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                biography: e.target.value,
                              })
                            }
                            placeholder="A patient-focused clinician providing evidence-based care..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Hero & Contact Information */}
                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>Hero Section & Fees</span>
                      </h3>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">
                            Hero Badge Text
                          </label>
                          <Input
                            value={doctorProfile.heroBadge || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                heroBadge: e.target.value,
                              })
                            }
                            placeholder="Board Certified Physician"
                            className="border-slate-800 bg-slate-950 text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">
                            Hero Intro Text
                          </label>
                          <textarea
                            rows={3}
                            value={doctorProfile.heroIntro || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                heroIntro: e.target.value,
                              })
                            }
                            placeholder="Compassionate healthcare focused on your wellness..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        {/* Hero Statistics Counters (heroStats) */}
                        <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-slate-200 text-xs block">
                                Hero Statistics Counter Cards
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Displayed in the 4-column counter cards under CTA buttons
                              </span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const current = Array.isArray(doctorProfile.heroStats) && doctorProfile.heroStats.length > 0
                                  ? doctorProfile.heroStats
                                  : [
                                      { label: "Patients Served", value: "5000+" },
                                      { label: "Years Experience", value: "15+" },
                                      { label: "Success Rate", value: "98%" },
                                      { label: "Emergency Care", value: "24/7" },
                                    ];
                                setDoctorProfile({
                                  ...doctorProfile,
                                  heroStats: [...current, { label: "Happy Patients", value: "100%" }],
                                });
                              }}
                              className="h-6 px-2 text-[10px] border-slate-700 bg-slate-800 text-teal-300 hover:text-white rounded-lg gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Stat</span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(Array.isArray(doctorProfile.heroStats) && doctorProfile.heroStats.length > 0
                              ? doctorProfile.heroStats
                              : [
                                  { label: "Patients Served", value: "5000+" },
                                  { label: "Years Experience", value: "15+" },
                                  { label: "Success Rate", value: "98%" },
                                  { label: "Emergency Care", value: "24/7" },
                                ]
                            ).map((stat: { label: string; value: string }, idx: number) => {
                              const statsList = Array.isArray(doctorProfile.heroStats) && doctorProfile.heroStats.length > 0
                                ? doctorProfile.heroStats
                                : [
                                    { label: "Patients Served", value: "5000+" },
                                    { label: "Years Experience", value: "15+" },
                                    { label: "Success Rate", value: "98%" },
                                    { label: "Emergency Care", value: "24/7" },
                                  ];
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                                >
                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                                        Value (e.g. 5000+)
                                      </label>
                                      <Input
                                        value={stat.value || ""}
                                        onChange={(e) => {
                                          const updated = [...statsList];
                                          updated[idx] = {
                                            ...updated[idx],
                                            value: e.target.value,
                                          };
                                          setDoctorProfile({
                                            ...doctorProfile,
                                            heroStats: updated,
                                          });
                                        }}
                                        placeholder="5000+"
                                        className="h-7 text-xs border-slate-800 bg-slate-950 text-slate-200"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] text-slate-400 mb-0.5 font-medium">
                                        Label (e.g. Patients)
                                      </label>
                                      <Input
                                        value={stat.label || ""}
                                        onChange={(e) => {
                                          const updated = [...statsList];
                                          updated[idx] = {
                                            ...updated[idx],
                                            label: e.target.value,
                                          };
                                          setDoctorProfile({
                                            ...doctorProfile,
                                            heroStats: updated,
                                          });
                                        }}
                                        placeholder="Patients Served"
                                        className="h-7 text-xs border-slate-800 bg-slate-950 text-slate-200"
                                      />
                                    </div>
                                  </div>

                                  {statsList.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updated = statsList.filter(
                                          (_: any, i: number) => i !== idx,
                                        );
                                        setDoctorProfile({
                                          ...doctorProfile,
                                          heroStats: updated,
                                        });
                                      }}
                                      className="h-7 w-7 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg shrink-0 self-end mb-0.5"
                                      title="Delete stat card"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Floating Care Card */}
                        <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-2.5">
                          <span className="font-semibold text-slate-200 text-xs block">
                            Hero Floating Care Card
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-slate-400 mb-1">
                                Card Title
                              </label>
                              <Input
                                value={doctorProfile.heroCareTitle || ""}
                                onChange={(e) =>
                                  setDoctorProfile({
                                    ...doctorProfile,
                                    heroCareTitle: e.target.value,
                                  })
                                }
                                placeholder="Patient-Centered Care"
                                className="border-slate-800 bg-slate-950 text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">
                                Card Subtitle / Description
                              </label>
                              <Input
                                value={doctorProfile.heroCareDescription || ""}
                                onChange={(e) =>
                                  setDoctorProfile({
                                    ...doctorProfile,
                                    heroCareDescription: e.target.value,
                                  })
                                }
                                placeholder="Personalized treatment plans for every patient."
                                className="border-slate-800 bg-slate-950 text-slate-200"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Fees and Contact */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Chamber Fee (৳)
                            </label>
                            <Input
                              type="number"
                              value={doctorProfile.consultationFee || 1000}
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  consultationFee: Number(e.target.value),
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">
                              Online Fee (৳)
                            </label>
                            <Input
                              type="number"
                              value={doctorProfile.onlineConsultationFee || 800}
                              onChange={(e) =>
                                setDoctorProfile({
                                  ...doctorProfile,
                                  onlineConsultationFee: Number(e.target.value),
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">
                            Chamber Phone / WhatsApp
                          </label>
                          <Input
                            value={doctorProfile.phone || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                phone: e.target.value,
                                whatsapp: e.target.value,
                              })
                            }
                            className="border-slate-800 bg-slate-950 text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">
                            Chamber Address
                          </label>
                          <Input
                            value={doctorProfile.address || ""}
                            onChange={(e) =>
                              setDoctorProfile({
                                ...doctorProfile,
                                address: e.target.value,
                              })
                            }
                            className="border-slate-800 bg-slate-950 text-slate-200"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ================= 6B. CMS: EXPERTISE & HIGHLIGHTS TAB (Image 1) ================= */}
              {activeTab === "cms-expertise" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-emerald-400" />
                        <span>Expertise & Career Highlights (Cards)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage highlight cards displayed on the doctor profile (Education, Experience, Publications, etc.)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(doctorProfile.expertiseCards)
                            ? [...doctorProfile.expertiseCards]
                            : [];
                          setDoctorProfile({
                            ...doctorProfile,
                            expertiseCards: [
                              ...current,
                              {
                                title: "New Highlight Category",
                                items: ["Key accomplishment or detail point"],
                              },
                            ],
                          });
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-teal-300 hover:text-white rounded-xl text-xs gap-1.5 font-semibold"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Card</span>
                      </Button>

                      <Button
                        onClick={async () => {
                          setSaving(true);
                          try {
                            const res = await fetch("/api/admin/doctor", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(doctorProfile),
                            });
                            if (!res.ok) throw new Error("Save failed");
                            triggerToast(
                              "Expertise & Highlight cards saved successfully!",
                            );
                          } catch (err: any) {
                            triggerToast(err.message, true);
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold px-4 py-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Card Editors */}
                  {(!Array.isArray(doctorProfile.expertiseCards) ||
                    doctorProfile.expertiseCards.length === 0) ? (
                    <Card className="border-slate-800 bg-slate-900/80 p-8 rounded-2xl text-center space-y-4">
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          No Highlight Cards Found
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                          Highlight cards showcase Education, Clinical Experience, Publications, and Special Highlights.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setDoctorProfile({
                            ...doctorProfile,
                            expertiseCards: [
                              {
                                title: "Education",
                                items: [
                                  "MBBS - Dhaka Medical College",
                                  "FCPS Medicine - BCPS",
                                  "MD Internal Medicine - BSMMU",
                                ],
                              },
                              {
                                title: "Experience",
                                items: [
                                  "15+ years in Internal Medicine clinical practice",
                                  "Former Registrar at a Tertiary Hospital",
                                  "Clinical Professor and Mentor",
                                ],
                              },
                              {
                                title: "Publications",
                                items: [
                                  "50+ Articles in peer-reviewed clinical journals",
                                  "Author of patient education guides",
                                  "Keynote Speaker at National Medical Conferences",
                                ],
                              },
                            ],
                          });
                        }}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Load Default 3 Cards (Education, Experience, Publications)</span>
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctorProfile.expertiseCards.map(
                        (card: any, cardIdx: number) => (
                          <Card
                            key={cardIdx}
                            className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm"
                          >
                            <div className="space-y-4">
                              {/* Card Top / Title */}
                              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="grid size-7 place-items-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold text-xs shrink-0">
                                    #{cardIdx + 1}
                                  </span>
                                  <div className="flex-1">
                                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                                      Card Title
                                    </label>
                                    <Input
                                      value={card.title || ""}
                                      onChange={(e) => {
                                        const updated = [
                                          ...doctorProfile.expertiseCards,
                                        ];
                                        updated[cardIdx] = {
                                          ...updated[cardIdx],
                                          title: e.target.value,
                                        };
                                        setDoctorProfile({
                                          ...doctorProfile,
                                          expertiseCards: updated,
                                        });
                                      }}
                                      placeholder="e.g. Education, Experience..."
                                      className="border-slate-800 bg-slate-950 text-slate-100 font-semibold text-xs h-8"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 pt-3">
                                  {cardIdx > 0 && (
                                    <button
                                      type="button"
                                      title="Move Left/Up"
                                      onClick={() => {
                                        const updated = [
                                          ...doctorProfile.expertiseCards,
                                        ];
                                        const temp = updated[cardIdx - 1];
                                        updated[cardIdx - 1] = updated[cardIdx];
                                        updated[cardIdx] = temp;
                                        setDoctorProfile({
                                          ...doctorProfile,
                                          expertiseCards: updated,
                                        });
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    >
                                      <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                                    </button>
                                  )}
                                  {cardIdx <
                                    doctorProfile.expertiseCards.length - 1 && (
                                    <button
                                      type="button"
                                      title="Move Right/Down"
                                      onClick={() => {
                                        const updated = [
                                          ...doctorProfile.expertiseCards,
                                        ];
                                        const temp = updated[cardIdx + 1];
                                        updated[cardIdx + 1] = updated[cardIdx];
                                        updated[cardIdx] = temp;
                                        setDoctorProfile({
                                          ...doctorProfile,
                                          expertiseCards: updated,
                                        });
                                      }}
                                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                    >
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    title="Delete Card"
                                    onClick={() => {
                                      const updated =
                                        doctorProfile.expertiseCards.filter(
                                          (_: any, i: number) => i !== cardIdx,
                                        );
                                      setDoctorProfile({
                                        ...doctorProfile,
                                        expertiseCards: updated,
                                      });
                                    }}
                                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Bullet Points */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Bullet Points (
                                    {Array.isArray(card.items)
                                      ? card.items.length
                                      : 0}
                                    )
                                  </label>
                                </div>

                                <div className="flex gap-2">
                                  <Input
                                    id={`expertise-bullet-input-${cardIdx}`}
                                    placeholder="Type point and press Enter..."
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val = (
                                          e.target as HTMLInputElement
                                        ).value.trim();
                                        if (val) {
                                          const updated = [
                                            ...doctorProfile.expertiseCards,
                                          ];
                                          const items = Array.isArray(
                                            updated[cardIdx].items,
                                          )
                                            ? [...updated[cardIdx].items]
                                            : [];
                                          items.push(val);
                                          updated[cardIdx] = {
                                            ...updated[cardIdx],
                                            items,
                                          };
                                          setDoctorProfile({
                                            ...doctorProfile,
                                            expertiseCards: updated,
                                          });
                                          (
                                            e.target as HTMLInputElement
                                          ).value = "";
                                        }
                                      }
                                    }}
                                    className="border-slate-800 bg-slate-950 text-slate-200 text-xs h-8"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                      const input = document.getElementById(
                                        `expertise-bullet-input-${cardIdx}`,
                                      ) as HTMLInputElement;
                                      if (input && input.value.trim()) {
                                        const updated = [
                                          ...doctorProfile.expertiseCards,
                                        ];
                                        const items = Array.isArray(
                                          updated[cardIdx].items,
                                        )
                                          ? [...updated[cardIdx].items]
                                          : [];
                                        items.push(input.value.trim());
                                        updated[cardIdx] = {
                                          ...updated[cardIdx],
                                          items,
                                        };
                                        setDoctorProfile({
                                          ...doctorProfile,
                                          expertiseCards: updated,
                                        });
                                        input.value = "";
                                      }
                                    }}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 h-8 px-2.5 rounded-lg text-xs"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </Button>
                                </div>

                                <div className="space-y-1.5 pt-1 max-h-56 overflow-y-auto pr-1">
                                  {Array.isArray(card.items) &&
                                  card.items.length > 0 ? (
                                    card.items.map(
                                      (item: string, itemIdx: number) => (
                                        <div
                                          key={itemIdx}
                                          className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-200 group"
                                        >
                                          <span className="grid size-4 place-items-center rounded-full bg-blue-500/20 text-blue-400 shrink-0 text-[9px] font-bold">
                                            ✓
                                          </span>
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                              const updated = [
                                                ...doctorProfile.expertiseCards,
                                              ];
                                              const items = [
                                                ...updated[cardIdx].items,
                                              ];
                                              items[itemIdx] = e.target.value;
                                              updated[cardIdx] = {
                                                ...updated[cardIdx],
                                                items,
                                              };
                                              setDoctorProfile({
                                                ...doctorProfile,
                                                expertiseCards: updated,
                                              });
                                            }}
                                            className="flex-1 bg-transparent border-none text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500/50 rounded px-1"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = [
                                                ...doctorProfile.expertiseCards,
                                              ];
                                              const items = updated[
                                                cardIdx
                                              ].items.filter(
                                                (_: any, i: number) =>
                                                  i !== itemIdx,
                                              );
                                              updated[cardIdx] = {
                                                ...updated[cardIdx],
                                                items,
                                              };
                                              setDoctorProfile({
                                                ...doctorProfile,
                                                expertiseCards: updated,
                                              });
                                            }}
                                            className="opacity-60 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-400 transition"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </div>
                                      ),
                                    )
                                  ) : (
                                    <p className="text-[11px] text-slate-400 italic py-1">
                                      No bullet items yet. Add one above.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ),
                      )}
                    </div>
                  )}

                  {/* Live Visual Preview Section */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Eye className="h-4 w-4 text-teal-400" />
                          <span>Live Public Website Preview (Image 1)</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Real-time view matching public landing page styling
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-line bg-[#fbf9f4] p-6">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.isArray(doctorProfile.expertiseCards) &&
                          doctorProfile.expertiseCards.map(
                            (card: any, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-2xl border border-line bg-white p-6 shadow-sm"
                              >
                                <span className="grid size-11 place-items-center rounded-full bg-[#f4ede4] text-[#1c1c1c] border border-line">
                                  <GraduationCap className="h-5 w-5 text-blue" />
                                </span>
                                <h3 className="mt-4 text-lg font-bold text-ink">
                                  {card.title || "Category"}
                                </h3>
                                <ul className="mt-4 space-y-2.5 text-xs font-medium text-muted">
                                  {Array.isArray(card.items) &&
                                    card.items.map((item: string, i: number) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="mt-0.5 grid size-3.5 place-items-center rounded-full bg-blue text-[7px] text-white shrink-0">
                                          ✓
                                        </span>
                                        <span className="leading-snug">
                                          {item}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 6C. CMS: DOCTOR CREDENTIALS TAB (Image 2) ================= */}
              {activeTab === "cms-credentials" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-400" />
                        <span>Doctor Credentials & Background</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage all 7 clinical credential categories: Qualifications, Specialisations, Languages, Certifications, Hospital Affiliations, Experience, and Awards
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          const res = await fetch("/api/admin/doctor", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(doctorProfile),
                          });
                          if (!res.ok) throw new Error("Save failed");
                          triggerToast(
                            "Doctor credentials updated successfully in MongoDB!",
                          );
                        } catch (err: any) {
                          triggerToast(err.message, true);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold px-4 py-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </div>

                  {/* 7 Credential Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[
                      {
                        key: "qualifications",
                        title: "Qualifications",
                        icon: GraduationCap,
                        color: "text-blue-400",
                        desc: "Academic degrees, fellowships, and diplomas",
                        placeholder: "e.g. MBBS (DMC), FCPS (Medicine)...",
                      },
                      {
                        key: "specialisations",
                        title: "Specialisations",
                        icon: Stethoscope,
                        color: "text-teal-400",
                        desc: "Clinical specialties and focus areas",
                        placeholder: "e.g. Diabetes Management...",
                      },
                      {
                        key: "languages",
                        title: "Languages Spoken",
                        icon: Globe,
                        color: "text-sky-400",
                        desc: "Languages for patient consultations",
                        placeholder: "e.g. Bangla, English, Hindi...",
                      },
                      {
                        key: "certifications",
                        title: "Certifications",
                        icon: ShieldCheck,
                        color: "text-emerald-400",
                        desc: "Board certifications and medical licenses",
                        placeholder: "e.g. Board Certified - ACLS...",
                      },
                      {
                        key: "hospitalAffiliations",
                        title: "Hospital Affiliations",
                        icon: Hospital,
                        color: "text-indigo-400",
                        desc: "Associated hospitals and chambers",
                        placeholder: "e.g. City Care Hospital...",
                      },
                      {
                        key: "experience",
                        title: "Professional Experience",
                        icon: BriefcaseBusiness,
                        color: "text-violet-400",
                        desc: "Clinical tenures and medical roles",
                        placeholder: "e.g. 15+ Years Clinical Practice...",
                      },
                      {
                        key: "awards",
                        title: "Honors & Awards",
                        icon: Award,
                        color: "text-amber-400",
                        desc: "Recognitions and clinical honors",
                        placeholder: "e.g. Best Clinical Service Award 2022...",
                      },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const currentList: string[] = Array.isArray(
                        doctorProfile[cat.key],
                      )
                        ? doctorProfile[cat.key]
                        : [];

                      return (
                        <Card
                          key={cat.key}
                          className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Category Header */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                              <div className="flex items-center gap-2">
                                <div className="grid size-8 place-items-center rounded-lg bg-slate-800 text-slate-200">
                                  <Icon className={`h-4 w-4 ${cat.color}`} />
                                </div>
                                <div>
                                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                                    {cat.title}
                                  </h3>
                                  <p className="text-[10px] text-slate-400 leading-tight">
                                    {cat.desc}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-slate-700 text-slate-300 shrink-0"
                              >
                                {currentList.length}
                              </Badge>
                            </div>

                            {/* Add item input */}
                            <div className="flex gap-2">
                              <Input
                                id={`cred-input-${cat.key}`}
                                placeholder={cat.placeholder}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const val = (
                                      e.target as HTMLInputElement
                                    ).value.trim();
                                    if (val) {
                                      const updated = [...currentList, val];
                                      setDoctorProfile({
                                        ...doctorProfile,
                                        [cat.key]: updated,
                                      });
                                      (
                                        e.target as HTMLInputElement
                                      ).value = "";
                                    }
                                  }
                                }}
                                className="border-slate-800 bg-slate-950 text-slate-200 text-xs h-8"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  const input = document.getElementById(
                                    `cred-input-${cat.key}`,
                                  ) as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    const updated = [
                                      ...currentList,
                                      input.value.trim(),
                                    ];
                                    setDoctorProfile({
                                      ...doctorProfile,
                                      [cat.key]: updated,
                                    });
                                    input.value = "";
                                  }
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 h-8 px-2.5 rounded-lg text-xs"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            {/* Items List */}
                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                              {currentList.length > 0 ? (
                                currentList.map(
                                  (item: string, itemIdx: number) => (
                                    <div
                                      key={itemIdx}
                                      className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-200 group"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                                      <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const updated = [...currentList];
                                          updated[itemIdx] = e.target.value;
                                          setDoctorProfile({
                                            ...doctorProfile,
                                            [cat.key]: updated,
                                          });
                                        }}
                                        className="flex-1 bg-transparent border-none text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500/50 rounded px-1"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = currentList.filter(
                                            (_: string, i: number) =>
                                              i !== itemIdx,
                                          );
                                          setDoctorProfile({
                                            ...doctorProfile,
                                            [cat.key]: updated,
                                          });
                                        }}
                                        className="opacity-60 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-400 transition"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ),
                                )
                              ) : (
                                <p className="text-[11px] text-slate-400 italic py-1">
                                  No entries yet. Add one above.
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Live Visual Preview Section */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Eye className="h-4 w-4 text-teal-400" />
                          <span>Live Public Website Preview (Image 2)</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Real-time 7-category credentials layout as displayed on the live profile
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-line bg-[#fbf9f4] p-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                          [
                            "QUALIFICATIONS",
                            doctorProfile.qualifications || [],
                          ],
                          [
                            "SPECIALISATIONS",
                            doctorProfile.specialisations || [],
                          ],
                          ["LANGUAGES SPOKEN", doctorProfile.languages || []],
                          ["CERTIFICATIONS", doctorProfile.certifications || []],
                          [
                            "HOSPITAL AFFILIATIONS",
                            doctorProfile.hospitalAffiliations || [],
                          ],
                          [
                            "PROFESSIONAL EXPERIENCE",
                            doctorProfile.experience || [],
                          ],
                          ["HONORS & AWARDS", doctorProfile.awards || []],
                        ].map(([title, items]: any) =>
                          items.length > 0 ? (
                            <div
                              key={title}
                              className="rounded-2xl border border-line bg-white/90 p-5 shadow-sm"
                            >
                              <h3 className="text-xs font-bold uppercase tracking-wide text-ink">
                                {title}
                              </h3>
                              <ul className="mt-3 space-y-2 text-xs text-muted">
                                {items.map((item: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" />
                                    <span className="leading-snug">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 7. CMS: WEBSITE SETTINGS TAB ================= */}
              {activeTab === "cms-website" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Website & Branding Settings
                      </h2>
                      <p className="text-xs text-slate-400">
                        Configure global site identity, brand logos, browser
                        favicon, contact info, and social channels
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          const res = await fetch(
                            "/api/admin/website-setting",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(websiteSettings),
                            },
                          );
                          if (!res.ok) throw new Error("Save failed");
                          triggerToast(
                            "Website & branding settings updated successfully!",
                          );
                          loadAllData();
                        } catch (err: any) {
                          triggerToast(err.message, true);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold px-4 py-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{saving ? "Saving..." : "Save Settings"}</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Brand Assets & Live Visual Preview */}
                    <div className="lg:col-span-6 space-y-6">
                      {/* 1. Logos & Favicon Upload Card */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-5">
                        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-teal-400" />
                          <h3 className="text-sm font-semibold text-white">
                            Brand Media & Icons
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <FileUploadInput
                            label="Primary Website Logo (Light Background)"
                            value={websiteSettings.logo || ""}
                            onChange={(val) =>
                              setWebsiteSettings({
                                ...websiteSettings,
                                logo: val,
                              })
                            }
                            placeholder="/uploads/logo.png or upload brand logo"
                          />

                          <FileUploadInput
                            label="Dark / Footer Logo Variant (Dark Background)"
                            value={websiteSettings.logoDark || ""}
                            onChange={(val) =>
                              setWebsiteSettings({
                                ...websiteSettings,
                                logoDark: val,
                              })
                            }
                            placeholder="/uploads/logo-dark.png (optional for dark headers/footers)"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <FileUploadInput
                              label="Browser Favicon (.ico / .png)"
                              value={websiteSettings.favicon || ""}
                              onChange={(val) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  favicon: val,
                                })
                              }
                              placeholder="/favicon.ico or upload favicon"
                            />

                            <FileUploadInput
                              label="Apple Touch Icon (iOS / Mobile)"
                              value={websiteSettings.appleTouchIcon || ""}
                              onChange={(val) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  appleTouchIcon: val,
                                })
                              }
                              placeholder="/uploads/apple-touch-icon.png"
                            />
                          </div>
                        </div>
                      </Card>

                      {/* 2. Live Browser & Header Preview Card */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-cyan-400" />
                            <h3 className="text-sm font-semibold text-white">
                              Live Brand Preview
                            </h3>
                          </div>
                          <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 text-[10px]">
                            Real-Time Mockup
                          </Badge>
                        </div>

                        {/* Mock Browser Tab Bar */}
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-3">
                          <div className="text-[11px] font-medium text-slate-400">
                            Browser Tab Bar Preview
                          </div>
                          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 max-w-xs shadow-inner">
                            {websiteSettings.favicon ? (
                              <img
                                src={safeImageSrc(websiteSettings.favicon)}
                                alt="Favicon"
                                className="h-4 w-4 rounded-xs object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-4 w-4 rounded-xs bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">
                                R
                              </div>
                            )}
                            <span className="text-xs text-slate-200 truncate font-medium">
                              {websiteSettings.siteName || "Dr. Rashed"} |
                              Specialist Physician
                            </span>
                          </div>
                        </div>

                        {/* Mock Website Navbar */}
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-3">
                          <div className="text-[11px] font-medium text-slate-400">
                            Website Header Brand Preview
                          </div>
                          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2.5">
                              {websiteSettings.logo ? (
                                <img
                                  src={safeImageSrc(websiteSettings.logo)}
                                  alt="Brand Logo"
                                  className="h-8 w-auto max-w-[140px] object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="size-8 rounded-lg bg-blue-600 text-white font-black text-sm grid place-items-center shadow-xs">
                                    R
                                  </div>
                                  <div>
                                    <span className="block text-xs font-black text-slate-900 leading-tight">
                                      {websiteSettings.siteName || "Dr. Rashed"}
                                    </span>
                                    <span className="block text-[9px] font-medium text-slate-500 leading-none">
                                      Specialist Physician
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                Home
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                                Schedules
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-semibold">
                                Book
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Right Column: Brand General, Contact & Social Settings */}
                    <div className="lg:col-span-6 space-y-6">
                      {/* 3. General Information Card */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-emerald-400" />
                          <h3 className="text-sm font-semibold text-white">
                            General Brand Details
                          </h3>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-slate-400 mb-1 font-medium">
                              Website Brand Name
                            </label>
                            <Input
                              value={websiteSettings.siteName || ""}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  siteName: e.target.value,
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                              placeholder="e.g. Dr. Rashed"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                Contact Email
                              </label>
                              <Input
                                type="email"
                                value={websiteSettings.contactEmail || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    contactEmail: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="appointments@doctorcare.test"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                Contact Phone
                              </label>
                              <Input
                                value={websiteSettings.contactPhone || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    contactPhone: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="+8801700000000"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-medium">
                              Main Clinic / Chamber Address
                            </label>
                            <Input
                              value={websiteSettings.contactAddress || ""}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  contactAddress: e.target.value,
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                              placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka, Bangladesh"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-medium">
                              Footer Bio & Description
                            </label>
                            <textarea
                              rows={3}
                              value={websiteSettings.footerDescription || ""}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  footerDescription: e.target.value,
                                })
                              }
                              placeholder="Short brand overview displayed across footer and copyright areas..."
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                      </Card>

                      {/* 4. Social Media Channels Card */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                        <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-purple-400" />
                          <h3 className="text-sm font-semibold text-white">
                            Social Media Channels
                          </h3>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                Facebook Page URL
                              </label>
                              <Input
                                value={websiteSettings.facebookUrl || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    facebookUrl: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="https://facebook.com/..."
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                YouTube Channel URL
                              </label>
                              <Input
                                value={websiteSettings.youtubeUrl || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    youtubeUrl: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="https://youtube.com/@..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                LinkedIn Profile URL
                              </label>
                              <Input
                                value={websiteSettings.linkedinUrl || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    linkedinUrl: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="https://linkedin.com/in/..."
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                Telegram Channel / User
                              </label>
                              <Input
                                value={websiteSettings.telegramUrl || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    telegramUrl: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="https://t.me/..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 mb-1 font-medium">
                              Twitter / X URL
                            </label>
                            <Input
                              value={websiteSettings.xUrl || ""}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  xUrl: e.target.value,
                                })
                              }
                              className="border-slate-800 bg-slate-950 text-slate-200"
                              placeholder="https://x.com/..."
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 8. CMS: BLOG ARTICLES TAB ================= */}
              {activeTab === "cms-blog" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Health Blog & Articles
                      </h2>
                      <p className="text-xs text-slate-400">
                        Publish evidence-based patient guides and medical
                        insights
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingBlog(null);
                        setIsBlogModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Write Article</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map((post) => (
                      <Card
                        key={recordId(post)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-3">
                          {post.coverImage && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                              <img
                                src={safeImageSrc(post.coverImage)}
                                alt={post.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                post.status === "published"
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20 text-[10px]"
                                  : "bg-amber-500/15 text-amber-300 text-[10px]"
                              }
                            >
                              {post.status || "published"}
                            </Badge>
                            <span className="text-[11px] text-slate-400">
                              {post.author || "Dr. Rashed"}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-3">
                            {post.excerpt || post.content}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            /{post.slug}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setEditingBlog(post);
                                setIsBlogModalOpen(true);
                              }}
                              size="sm"
                              variant="outline"
                              className="h-8 border-slate-700 bg-slate-800 text-slate-200 text-xs rounded-lg gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              onClick={() =>
                                handleDeleteRecord(
                                  "blog-posts",
                                  recordId(post),
                                  post.title || "Article",
                                )
                              }
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-slate-700 hover:bg-rose-950/40 text-rose-400 rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 9. FINANCE & LEDGER TAB ================= */}
              {activeTab === "finance" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Clinic Accounting & Financial Ledger
                      </h2>
                      <p className="text-xs text-slate-400">
                        Track consultation income, clinic expenses, and net
                        profit
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setIsIncomeModalOpen(true)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs gap-1.5 font-semibold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Income</span>
                      </Button>
                      <Button
                        onClick={() => setIsExpenseModalOpen(true)}
                        size="sm"
                        className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs gap-1.5 font-semibold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Expense</span>
                      </Button>
                    </div>
                  </div>

                  {/* Financial Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Total Recorded Income
                      </p>
                      <h3 className="text-2xl font-black text-emerald-400 mt-1">
                        ৳{financialTotals.totalIncome.toLocaleString()}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {incomes.length} Entries
                      </p>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Total Clinic Expenses
                      </p>
                      <h3 className="text-2xl font-black text-rose-400 mt-1">
                        ৳{financialTotals.totalExpenses.toLocaleString()}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {expenses.length} Entries
                      </p>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Net Profit
                      </p>
                      <h3 className="text-2xl font-black text-teal-300 mt-1">
                        ৳{financialTotals.netProfit.toLocaleString()}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Profit margin ~
                        {financialTotals.totalIncome > 0
                          ? Math.round(
                              (financialTotals.netProfit /
                                financialTotals.totalIncome) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </Card>
                  </div>

                  {/* Recent Incomes & Expenses List */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Incomes */}
                    <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-4">
                      <h3 className="font-bold text-white text-base flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-400" />
                          <span>Income Ledger</span>
                        </span>
                        <span className="text-xs text-emerald-400 font-mono">
                          +{incomes.length} records
                        </span>
                      </h3>

                      <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                        {incomes.map((inc) => (
                          <div
                            key={recordId(inc)}
                            className="py-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {inc.title}
                              </p>
                              <p className="text-slate-400 capitalize">
                                {inc.category} • {inc.paymentMethod}
                              </p>
                            </div>
                            <span className="font-bold text-emerald-400 text-sm">
                              ৳{Number(inc.amount).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Expenses */}
                    <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-4">
                      <h3 className="font-bold text-white text-base flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-rose-400" />
                          <span>Expense Tracker</span>
                        </span>
                        <span className="text-xs text-rose-400 font-mono">
                          -{expenses.length} records
                        </span>
                      </h3>

                      <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                        {expenses.map((exp) => (
                          <div
                            key={recordId(exp)}
                            className="py-3 flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {exp.title}
                              </p>
                              <p className="text-slate-400 capitalize">
                                {exp.category}{" "}
                                {exp.notes ? `• ${exp.notes}` : ""}
                              </p>
                              {exp.receipt && (
                                <a
                                  href={exp.receipt}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-teal-400 underline text-[10px] mt-0.5 inline-block"
                                >
                                  View Receipt Attachment
                                </a>
                              )}
                            </div>
                            <span className="font-bold text-rose-400 text-sm">
                              -৳{Number(exp.amount).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* ================= 10. MEDIA LIBRARY TAB ================= */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Media Asset Library
                      </h2>
                      <p className="text-xs text-slate-400">
                        Upload and manage clinic photos, doctor portraits, and
                        report documents
                      </p>
                    </div>

                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                      >
                        <Upload
                          className={`h-4 w-4 ${uploadingFile ? "animate-spin" : ""}`}
                        />
                        <span>
                          {uploadingFile ? "Uploading..." : "Upload File"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaList.map((m) => (
                      <Card
                        key={recordId(m)}
                        className="border-slate-800 bg-slate-900/80 p-3 rounded-2xl flex flex-col justify-between group hover:border-teal-500/40 transition-all"
                      >
                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative">
                          {m.url?.endsWith(".pdf") ? (
                            <FileText className="h-10 w-10 text-slate-600" />
                          ) : (
                            <img
                              src={m.url}
                              alt={m.alt || m.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>

                        <div className="mt-2.5">
                          <p
                            className="text-xs font-semibold text-white truncate"
                            title={m.title}
                          >
                            {m.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {Math.round((m.sizeBytes || 0) / 1024)} KB
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <Button
                            onClick={() => {
                              if (m.url) {
                                const fullUrl = m.url.startsWith("http")
                                  ? m.url
                                  : `${typeof window !== "undefined" ? window.location.origin : ""}${m.url.startsWith("/") ? "" : "/"}${m.url}`;
                                navigator.clipboard.writeText(fullUrl);
                                triggerToast("Image URL copied to clipboard!");
                              }
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px] border-slate-700 bg-slate-800 text-slate-300 rounded-lg gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteRecord(
                                "media",
                                recordId(m),
                                m.title || "Media",
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-slate-700 hover:bg-rose-950/40 text-rose-400 rounded-lg"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 11. INTERACTIVE SEO SUITE & EDITOR TAB ================= */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        SEO Suite & Live Meta Editor
                      </h2>
                      <p className="text-xs text-slate-400">
                        Edit metadata, customize OpenGraph cards, and preview
                        search engine appearance
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Scope Toggle */}
                      <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
                        <button
                          type="button"
                          onClick={() => setSeoScope("doctor")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            seoScope === "doctor"
                              ? "bg-teal-500 text-slate-950 shadow-md"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Doctor Profile SEO
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeoScope("website")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            seoScope === "website"
                              ? "bg-teal-500 text-slate-950 shadow-md"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Website Global SEO
                        </button>
                      </div>

                      <Button
                        onClick={handleSaveSeo}
                        disabled={saving}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                      >
                        <Check className="h-4 w-4" />
                        <span>{saving ? "Saving..." : "Save SEO"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Interactive SEO Form */}
                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                          <Edit className="h-4 w-4 text-teal-400" />
                          <span>
                            Editing:{" "}
                            {seoScope === "doctor"
                              ? "Doctor Profile SEO"
                              : "Website Global SEO"}
                          </span>
                        </h3>
                        <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-[10px]">
                          Real-time Sync
                        </Badge>
                      </div>

                      <div className="space-y-4 text-xs">
                        {/* SEO Title */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-slate-300 font-medium">
                              SEO Title (Title Tag)
                            </label>
                            <span
                              className={`text-[10px] ${(seoForm.seoTitle || "").length > 60 ? "text-amber-400 font-bold" : "text-slate-500"}`}
                            >
                              {(seoForm.seoTitle || "").length}/65 chars
                            </span>
                          </div>
                          <Input
                            value={seoForm.seoTitle || ""}
                            onChange={(e) =>
                              setSeoForm({
                                ...seoForm,
                                seoTitle: e.target.value,
                              })
                            }
                            placeholder="e.g. Dr. Md. Rashedul Alam | Medicine Specialist in Dhaka"
                            className="border-slate-800 bg-slate-950 text-slate-200 rounded-xl"
                          />
                        </div>

                        {/* Meta Description */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-slate-300 font-medium">
                              Meta Description
                            </label>
                            <span
                              className={`text-[10px] ${(seoForm.metaDescription || "").length > 155 ? "text-amber-400 font-bold" : "text-slate-500"}`}
                            >
                              {(seoForm.metaDescription || "").length}/160 chars
                            </span>
                          </div>
                          <textarea
                            rows={3}
                            value={seoForm.metaDescription || ""}
                            onChange={(e) =>
                              setSeoForm({
                                ...seoForm,
                                metaDescription: e.target.value,
                              })
                            }
                            placeholder="e.g. Book appointments with Dr. Md. Rashedul Alam, a consultant medicine specialist in Dhaka..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-medium mb-1">
                              Focus Keyword
                            </label>
                            <Input
                              value={seoForm.focusKeyword || ""}
                              onChange={(e) =>
                                setSeoForm({
                                  ...seoForm,
                                  focusKeyword: e.target.value,
                                })
                              }
                              placeholder="e.g. medicine specialist Dhaka"
                              className="border-slate-800 bg-slate-950 text-slate-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-medium mb-1">
                              Canonical URL
                            </label>
                            <Input
                              value={seoForm.canonicalUrl || ""}
                              onChange={(e) =>
                                setSeoForm({
                                  ...seoForm,
                                  canonicalUrl: e.target.value,
                                })
                              }
                              placeholder="https://dr-rashed.com/..."
                              className="border-slate-800 bg-slate-950 text-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Social Share OG Image with File Upload */}
                        <div className="border-t border-slate-800/80 pt-3">
                          <FileUploadInput
                            label="OpenGraph / Social Card Image"
                            value={seoForm.ogImage || ""}
                            onChange={(url) =>
                              setSeoForm({
                                ...seoForm,
                                ogImage: url,
                                twitterImage: url,
                              })
                            }
                            mediaList={mediaList}
                            placeholder="Upload social share banner or enter URL..."
                          />
                        </div>

                        {/* OpenGraph Title & Description */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-300 font-medium mb-1">
                              Social Title (OG)
                            </label>
                            <Input
                              value={seoForm.ogTitle || ""}
                              onChange={(e) =>
                                setSeoForm({
                                  ...seoForm,
                                  ogTitle: e.target.value,
                                })
                              }
                              placeholder="Custom social title..."
                              className="border-slate-800 bg-slate-950 text-slate-200 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-300 font-medium mb-1">
                              Social Description (OG)
                            </label>
                            <Input
                              value={seoForm.ogDescription || ""}
                              onChange={(e) =>
                                setSeoForm({
                                  ...seoForm,
                                  ogDescription: e.target.value,
                                })
                              }
                              placeholder="Custom social excerpt..."
                              className="border-slate-800 bg-slate-950 text-slate-200 rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Robots Indexing Toggle */}
                        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                          <div>
                            <p className="font-semibold text-white">
                              Search Engine Indexing
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Allow Google and Bing to index this page
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSeoForm({
                                ...seoForm,
                                noIndex: !seoForm.noIndex,
                              })
                            }
                            className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                              !seoForm.noIndex ? "bg-teal-500" : "bg-slate-800"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                                !seoForm.noIndex
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </Card>

                    {/* Right: Live SERP & Social Previews */}
                    <div className="space-y-6">
                      {/* Google SERP Preview */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Globe className="h-4 w-4 text-cyan-400" />
                          <span>Google Search SERP Preview (Live)</span>
                        </h3>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5 font-sans">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="text-slate-300 font-semibold">
                              dr-rashed.com
                            </span>
                            <span>› appointment › internal-medicine</span>
                          </div>
                          <h4 className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer">
                            {seoForm.seoTitle ||
                              (seoScope === "doctor"
                                ? doctorProfile?.name
                                : websiteSettings?.siteName) ||
                              "Dr. Md. Rashedul Alam | Medicine Specialist"}
                          </h4>
                          <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                            {seoForm.metaDescription ||
                              (seoScope === "doctor"
                                ? doctorProfile?.biography
                                : websiteSettings?.footerDescription) ||
                              "Book appointments with Dr. Md. Rashedul Alam, senior consultant medicine specialist in Dhaka."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span>
                            SEO Optimization:{" "}
                            <strong className="text-emerald-400">High</strong>
                          </span>
                          <span>
                            Indexed:{" "}
                            <strong
                              className={
                                !seoForm.noIndex
                                  ? "text-teal-400"
                                  : "text-rose-400"
                              }
                            >
                              {!seoForm.noIndex
                                ? "Yes (Index)"
                                : "No (NoIndex)"}
                            </strong>
                          </span>
                        </div>
                      </Card>

                      {/* Social Share Card Preview */}
                      <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Share2 className="h-4 w-4 text-teal-400" />
                          <span>
                            OpenGraph / Social Media Card Preview (Live)
                          </span>
                        </h3>

                        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                          <div className="aspect-video w-full bg-slate-900 relative">
                            <img
                              src={
                                seoForm.ogImage ||
                                doctorProfile?.image ||
                                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                              }
                              alt="Social preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-3.5 space-y-1 bg-slate-900/95 border-t border-slate-800">
                            <p className="text-[10px] uppercase font-bold text-slate-400">
                              DR-RASHED.COM
                            </p>
                            <h4 className="text-sm font-bold text-white truncate">
                              {seoForm.ogTitle ||
                                seoForm.seoTitle ||
                                doctorProfile?.name ||
                                "Dr. Md. Rashedul Alam"}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {seoForm.ogDescription ||
                                seoForm.metaDescription ||
                                doctorProfile?.title ||
                                "Consultant Medicine Specialist"}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 12. SYSTEM & DATABASE TAB ================= */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      MongoDB Database & Architecture Status
                    </h2>
                    <p className="text-xs text-slate-400">
                      Real-time database connectivity and migration status
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Database Engine
                        </p>
                        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs">
                          Active
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Database className="h-5 w-5 text-emerald-400" />
                        <span>MongoDB Database</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Connected with Mongoose ORM & high-speed connection
                        pooling.
                      </p>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Strapi Status
                        </p>
                        <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-xs">
                          Removed
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-teal-400" />
                        <span>Zero Strapi Dependency</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Strapi backend and admin panel have been completely
                        replaced with pure Next.js.
                      </p>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          One-Click Setup
                        </p>
                        <Badge className="bg-cyan-500/15 text-cyan-300 border-cyan-500/30 text-xs">
                          Ready
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        <span>Quick Reset & Seed</span>
                      </h3>
                      <Button
                        onClick={handleSeedDatabase}
                        size="sm"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/20 text-xs rounded-xl"
                      >
                        Reset & Seed Database
                      </Button>
                    </Card>
                  </div>
                </div>
              )}

              {/* ================= 13. SUPER ADMIN SECURITY & CREDENTIALS TAB ================= */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Header & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-amber-400" />
                        <span>Super Admin Security & Credentials</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage login username, access PIN / password, display name, and emergency email stored directly in MongoDB.
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs w-fit flex items-center gap-1.5 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>MongoDB Persistent Auth</span>
                    </Badge>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Active Account
                        </span>
                        <ShieldCheck className="h-4 w-4 text-teal-400" />
                      </div>
                      <div className="text-lg font-bold text-white truncate">
                        {currentUser?.name || "Dr. Rashed Super Admin"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Username:</span>
                        <code className="bg-slate-800/80 px-2 py-0.5 rounded text-teal-300 font-mono text-xs">
                          {currentUser?.username || "admin"}
                        </code>
                      </div>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Assigned Role
                        </span>
                        <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] uppercase font-bold">
                          {currentUser?.role || "super_admin"}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">
                        Full Super Admin Access
                      </div>
                      <p className="text-xs text-slate-400">
                        Unrestricted access to all clinical, financial & CMS records.
                      </p>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Recovery Email
                        </span>
                        <Send className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div className="text-lg font-bold text-white truncate">
                        {currentUser?.email || "admin@doctorcare.test"}
                      </div>
                      <p className="text-xs text-slate-400">
                        Primary address for notifications & emergency alerts.
                      </p>
                    </Card>
                  </div>

                  {/* Main Form Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Credential Edit Form (2 cols) */}
                    <div className="lg:col-span-2">
                      <Card className="border-slate-800 bg-slate-900/80 p-6 md:p-7 rounded-2xl space-y-6">
                        <div className="border-b border-slate-800 pb-4">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Lock className="h-4 w-4 text-teal-400" />
                            <span>Change Credentials & PIN</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Update your login credentials. You must provide your <strong className="text-slate-300">Current PIN</strong> to authorize any modifications.
                          </p>
                        </div>

                        <form onSubmit={handleChangeAdminCredentials} className="space-y-6">
                          {/* Part 1: Profile & Username */}
                          <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/90 flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              <span>1. Administrator Profile</span>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">
                                  Full Display Name
                                </label>
                                <Input
                                  value={securityForm.name}
                                  onChange={(e) =>
                                    setSecurityForm({
                                      ...securityForm,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. Dr. Rashed Super Admin"
                                  className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-teal-500"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">
                                  Login Username <span className="text-rose-400">*</span>
                                </label>
                                <Input
                                  value={securityForm.username}
                                  onChange={(e) =>
                                    setSecurityForm({
                                      ...securityForm,
                                      username: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. admin or dr_rashed"
                                  className="bg-slate-950 border-slate-800 text-white rounded-xl font-mono focus:border-teal-500"
                                  required
                                />
                                <p className="text-[11px] text-slate-400">
                                  Used at <code className="text-slate-300">/admin/login</code>
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-300">
                                Contact & Recovery Email
                              </label>
                              <Input
                                type="email"
                                value={securityForm.email}
                                onChange={(e) =>
                                  setSecurityForm({
                                    ...securityForm,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="e.g. admin@doctorcare.test"
                                className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-teal-500"
                              />
                            </div>
                          </div>

                          {/* Part 2: Security & PIN Change */}
                          <div className="space-y-4 pt-4 border-t border-slate-800/80">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                                <KeyRound className="h-3.5 w-3.5" />
                                <span>2. Access PIN / Password Change</span>
                              </p>
                              <span className="text-[11px] text-slate-400">
                                (Leave New PIN blank to keep current PIN)
                              </span>
                            </div>

                            {/* Current PIN */}
                            <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                              <label className="text-xs font-medium text-slate-200 flex items-center justify-between">
                                <span>
                                  Current PIN <span className="text-rose-400">*</span>
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Required for authorization
                                </span>
                              </label>
                              <div className="relative">
                                <Input
                                  type={showCurrentPin ? "text" : "password"}
                                  value={securityForm.currentPin}
                                  onChange={(e) =>
                                    setSecurityForm({
                                      ...securityForm,
                                      currentPin: e.target.value,
                                    })
                                  }
                                  placeholder="Enter your current PIN (e.g. 123456)"
                                  className="bg-slate-950 border-slate-800 text-white rounded-xl pr-10 font-mono tracking-wider focus:border-teal-500"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                  {showCurrentPin ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* New PIN & Confirm New PIN */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">
                                  New PIN / Password
                                </label>
                                <div className="relative">
                                  <Input
                                    type={showNewPin ? "text" : "password"}
                                    value={securityForm.newPin}
                                    onChange={(e) =>
                                      setSecurityForm({
                                        ...securityForm,
                                        newPin: e.target.value,
                                      })
                                    }
                                    placeholder="Enter new PIN (min 4 digits)"
                                    className="bg-slate-950 border-slate-800 text-white rounded-xl pr-10 font-mono tracking-wider focus:border-teal-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPin(!showNewPin)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                  >
                                    {showNewPin ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">
                                  Confirm New PIN
                                </label>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPin ? "text" : "password"}
                                    value={securityForm.confirmNewPin}
                                    onChange={(e) =>
                                      setSecurityForm({
                                        ...securityForm,
                                        confirmNewPin: e.target.value,
                                      })
                                    }
                                    placeholder="Re-enter new PIN"
                                    className="bg-slate-950 border-slate-800 text-white rounded-xl pr-10 font-mono tracking-wider focus:border-teal-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowConfirmPin(!showConfirmPin)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                  >
                                    {showConfirmPin ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* PIN match indicator */}
                            {securityForm.newPin && securityForm.confirmNewPin && (
                              <div className="text-xs flex items-center gap-1.5">
                                {securityForm.newPin === securityForm.confirmNewPin ? (
                                  <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>New PINs match perfectly</span>
                                  </span>
                                ) : (
                                  <span className="text-rose-400 flex items-center gap-1">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    <span>PIN confirmation does not match</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Submit Actions */}
                          <div className="flex items-center gap-3 pt-2">
                            <Button
                              type="submit"
                              disabled={savingSecurity}
                              className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-semibold rounded-xl text-xs gap-2 shadow-lg shadow-teal-500/20 px-5 py-2.5"
                            >
                              {savingSecurity ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ShieldCheck className="h-4 w-4" />
                              )}
                              <span>
                                {savingSecurity
                                  ? "Saving to MongoDB..."
                                  : "Save Admin Credentials"}
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (currentUser) {
                                  setSecurityForm({
                                    name: currentUser.name || "Dr. Rashed Super Admin",
                                    username: currentUser.username || "admin",
                                    email: currentUser.email || "",
                                    currentPin: "",
                                    newPin: "",
                                    confirmNewPin: "",
                                  });
                                }
                              }}
                              className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
                            >
                              Reset
                            </Button>
                          </div>
                        </form>
                      </Card>
                    </div>

                    {/* Security Guidelines & Info Sidebar */}
                    <div className="space-y-5">
                      <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>Security Rules</span>
                        </div>
                        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                          <li>
                            Your <strong className="text-slate-200">Current PIN</strong> is verified before any database changes are committed.
                          </li>
                          <li>
                            New PIN must be at least <strong className="text-slate-200">4 characters / digits</strong>.
                          </li>
                          <li>
                            Username must be unique across all administrator accounts.
                          </li>
                          <li>
                            Changes take effect <strong className="text-slate-200">immediately</strong> in MongoDB.
                          </li>
                        </ul>
                      </Card>

                      <Card className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                          <Database className="h-4 w-4" />
                          <span>MongoDB Schema</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Admin credentials are persisted in the <code className="bg-slate-800 px-1.5 py-0.5 rounded text-teal-300">AdminUser</code> collection with active session management.
                        </p>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
                          <p><span className="text-teal-400">Collection:</span> adminusers</p>
                          <p><span className="text-cyan-400">Auth Method:</span> PIN / Hash</p>
                          <p><span className="text-amber-400">Session Cookie:</span> admin_session</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= OTHER CMS SUB-TABS (Services, Testimonials, FAQs, Gallery) ================= */}
              {activeTab === "cms-services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Medical Services Catalog
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage specialized clinical care, consultation
                        offerings, and fees
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingService(null);
                        setIsServiceModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Service</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((srv) => (
                      <Card
                        key={recordId(srv)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          {srv.image && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-2">
                              <img
                                src={safeImageSrc(srv.image)}
                                alt={srv.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-base">
                              {srv.name}
                            </h3>
                            <span className="text-emerald-400 font-bold text-sm">
                              ৳{srv.fee || 1000}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {srv.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-end gap-2">
                          <Button
                            onClick={() => {
                              setEditingService(srv);
                              setIsServiceModalOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteRecord(
                                "services",
                                recordId(srv),
                                srv.name || "Service",
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-slate-700 text-rose-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cms-testimonials" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Patient Testimonials & Reviews
                      </h2>
                      <p className="text-xs text-slate-400">
                        Verified reviews and star ratings from patients
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingTestimonial(null);
                        setIsTestimonialModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Review</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                      <Card
                        key={recordId(t)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: t.rating || 5 }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-amber-400 text-amber-400"
                                />
                              ),
                            )}
                          </div>
                          <p className="text-xs text-slate-300 italic">
                            "{t.quote}"
                          </p>
                          <div className="border-t border-slate-800 pt-2">
                            <p className="font-bold text-white text-xs">
                              {t.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {t.designation || "Patient"}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-end gap-2">
                          <Button
                            onClick={() => {
                              setEditingTestimonial(t);
                              setIsTestimonialModalOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteRecord(
                                "testimonials",
                                recordId(t),
                                t.name || "Testimonial",
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-slate-700 text-rose-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cms-faqs" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Frequently Asked Questions
                      </h2>
                      <p className="text-xs text-slate-400">
                        Helpful Q&A items for patients before and after booking
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingFaq(null);
                        setIsFaqModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add FAQ</span>
                    </Button>
                  </div>

                  <div className="space-y-3 max-w-3xl">
                    {faqs.map((faq) => (
                      <Card
                        key={recordId(faq)}
                        className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-teal-400 shrink-0" />
                            <span>{faq.question}</span>
                          </h3>
                          <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            onClick={() => {
                              setEditingFaq(faq);
                              setIsFaqModalOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-slate-700 bg-slate-800 text-slate-200"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleDeleteRecord("faqs", recordId(faq), "FAQ")
                            }
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0 border-slate-700 text-rose-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cms-gallery" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Images className="h-5 w-5 text-teal-400" />
                        <span>Clinical Gallery CMS</span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        Manage clinical chamber albums with multiple photos per clinic/facility
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        setEditingGallery({
                          title: "",
                          category: "Main Hospital",
                          description: "",
                          image: "",
                          images: [],
                          active: true,
                        });
                        setIsGalleryModalOpen(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Clinic Facility Gallery</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {galleryItems.map((item) => {
                      const photoList: string[] = Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
                      const photoCount = photoList.length;
                      const cover = item.image || photoList[0] || "";

                      return (
                        <Card
                          key={recordId(item)}
                          className="border-slate-800 bg-slate-900/80 overflow-hidden rounded-2xl flex flex-col justify-between group hover:border-teal-500/40 transition-all"
                        >
                          <div>
                            <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                              {cover ? (
                                <img
                                  src={safeImageSrc(cover)}
                                  alt={item.alt || item.title}
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-600">
                                  <Camera className="h-8 w-8" />
                                </div>
                              )}
                              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-teal-300 border border-slate-700">
                                <Camera className="h-3 w-3" />
                                <span>{photoCount} {photoCount === 1 ? "Photo" : "Photos"}</span>
                              </div>
                            </div>
                            <div className="p-4 space-y-1.5">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-400">
                                {item.category || "Clinic"}
                              </span>
                              <h4 className="font-bold text-white text-sm">
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-slate-400 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-500 font-medium">
                              {photoCount} gallery assets
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Button
                                onClick={() => {
                                  setEditingGallery({
                                    ...item,
                                    images: photoList,
                                  });
                                  setIsGalleryModalOpen(true);
                                }}
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200 gap-1 rounded-lg"
                              >
                                <Edit className="h-3 w-3" />
                                <span>Edit Gallery</span>
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteRecord(
                                    "gallery-items",
                                    recordId(item),
                                    item.title || "Facility Gallery",
                                  )
                                }
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 border-slate-700 text-rose-400 hover:bg-rose-950/30 rounded-lg"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. Add / Edit Hospital Modal */}
      <HospitalModalDialog
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
        editingHospital={editingHospital}
        mediaList={mediaList}
        onSaved={loadAllData}
        triggerToast={triggerToast}
      />

      {/* 2. Add / Edit Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-lg border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {Boolean(editingSchedule && recordId(editingSchedule))
                  ? "Edit Schedule"
                  : "Create New Schedule"}
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const hospitalId = (
                  form.elements.namedItem("hospitalId") as HTMLSelectElement
                ).value;
                const startsAt = (
                  form.elements.namedItem("startsAt") as HTMLInputElement
                ).value;
                const endsAt = (
                  form.elements.namedItem("endsAt") as HTMLInputElement
                ).value;
                const slotDurationMinutes =
                  Number(
                    (
                      form.elements.namedItem(
                        "slotDurationMinutes",
                      ) as HTMLInputElement
                    ).value,
                  ) || 10;
                const maxAppointments =
                  Number(
                    (
                      form.elements.namedItem(
                        "maxAppointments",
                      ) as HTMLInputElement
                    ).value,
                  ) || 20;
                const fee =
                  Number(
                    (form.elements.namedItem("fee") as HTMLInputElement).value,
                  ) || 1000;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value;

                try {
                  const isEdit = Boolean(
                    editingSchedule && recordId(editingSchedule),
                  );
                  const url = isEdit
                    ? `/api/admin/schedules/${recordId(editingSchedule)}`
                    : "/api/admin/schedules";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      hospitalId,
                      startsAt: new Date(startsAt).toISOString(),
                      endsAt: endsAt
                        ? new Date(endsAt).toISOString()
                        : undefined,
                      slotDurationMinutes,
                      maxAppointments,
                      fee,
                      title,
                      slug: editingSchedule?.slug || `schedule-${Date.now()}`,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "Schedule updated successfully!"
                      : "Schedule created successfully!",
                  );
                  setIsScheduleModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Select Hospital
                </label>
                <select
                  name="hospitalId"
                  defaultValue={
                    editingSchedule?.hospitalId || recordId(hospitals[0])
                  }
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                >
                  {hospitals.map((h) => (
                    <option key={recordId(h)} value={recordId(h)}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Schedule Title
                </label>
                <Input
                  name="title"
                  defaultValue={
                    editingSchedule?.title || "Specialist Consultation"
                  }
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Start Date & Time
                  </label>
                  <Input
                    name="startsAt"
                    type="datetime-local"
                    defaultValue={toLocalDatetimeInput(
                      editingSchedule?.startsAt,
                    )}
                    required
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    End Date & Time (Optional)
                  </label>
                  <Input
                    name="endsAt"
                    type="datetime-local"
                    defaultValue={toLocalDatetimeInput(editingSchedule?.endsAt)}
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Duration (Min)
                  </label>
                  <Input
                    name="slotDurationMinutes"
                    type="number"
                    defaultValue={editingSchedule?.slotDurationMinutes || 10}
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Slots</label>
                  <Input
                    name="maxAppointments"
                    type="number"
                    defaultValue={editingSchedule?.maxAppointments || 20}
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Fee (৳)</label>
                  <Input
                    name="fee"
                    type="number"
                    defaultValue={editingSchedule?.fee || 1000}
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Schedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 3. Add / Edit Blog Post Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-xl border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {Boolean(editingBlog && recordId(editingBlog))
                  ? "Edit Article"
                  : "Write New Article"}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value;
                const slug =
                  (form.elements.namedItem("slug") as HTMLInputElement).value ||
                  slugify(title);
                const excerpt = (
                  form.elements.namedItem("excerpt") as HTMLInputElement
                ).value;
                const content = (
                  form.elements.namedItem("content") as HTMLTextAreaElement
                ).value;
                const author =
                  (form.elements.namedItem("author") as HTMLInputElement)
                    .value || "Dr. Md. Rashedul Alam";
                const status = (
                  form.elements.namedItem("status") as HTMLSelectElement
                ).value;
                const coverImage = editingBlog?.coverImage || "";

                try {
                  const isEdit = Boolean(editingBlog && recordId(editingBlog));
                  const url = isEdit
                    ? `/api/admin/blog-posts/${recordId(editingBlog)}`
                    : "/api/admin/blog-posts";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title,
                      slug,
                      excerpt,
                      content,
                      author,
                      status,
                      coverImage,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "Article updated successfully!"
                      : "Article published successfully!",
                  );
                  setIsBlogModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Article Title
                </label>
                <Input
                  name="title"
                  defaultValue={editingBlog?.title || ""}
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">URL Slug</label>
                  <Input
                    name="slug"
                    defaultValue={editingBlog?.slug || ""}
                    placeholder="auto-generated-from-title"
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Author Name
                  </label>
                  <Input
                    name="author"
                    defaultValue={
                      editingBlog?.author || "Dr. Md. Rashedul Alam"
                    }
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
              </div>

              {/* Cover Image File Upload Input */}
              <FileUploadInput
                label="Article Cover Image"
                value={editingBlog?.coverImage || ""}
                onChange={(url) =>
                  setEditingBlog((prev) => ({
                    ...(prev || {}),
                    coverImage: url,
                  }))
                }
                mediaList={mediaList}
                placeholder="Upload cover image or enter URL..."
              />

              <div>
                <label className="block text-slate-400 mb-1">
                  Summary / Excerpt
                </label>
                <Input
                  name="excerpt"
                  defaultValue={editingBlog?.excerpt || ""}
                  placeholder="Short summary for preview cards..."
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Full Article Content (Markdown or Text)
                </label>
                <textarea
                  name="content"
                  rows={6}
                  defaultValue={editingBlog?.content || ""}
                  required
                  placeholder="Write full article here..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Publish Status
                </label>
                <select
                  name="status"
                  defaultValue={editingBlog?.status || "published"}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Article
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 4. Add / Edit Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {Boolean(editingService && recordId(editingService))
                  ? "Edit Service"
                  : "Add Medical Service"}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value;
                const description = (
                  form.elements.namedItem("description") as HTMLInputElement
                ).value;
                const fee =
                  Number(
                    (form.elements.namedItem("fee") as HTMLInputElement).value,
                  ) || 1000;
                const rawItems =
                  (form.elements.namedItem("items") as HTMLInputElement)?.value ||
                  "";
                const items = rawItems
                  .split(/,|\n/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                const image = editingService?.image || "";

                try {
                  const isEdit = Boolean(
                    editingService && recordId(editingService),
                  );
                  const url = isEdit
                    ? `/api/admin/services/${recordId(editingService)}`
                    : "/api/admin/services";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      description,
                      fee,
                      items,
                      image,
                      active: true,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "Service updated successfully!"
                      : "Service added successfully!",
                  );
                  setIsServiceModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Service Name
                </label>
                <Input
                  name="name"
                  defaultValue={editingService?.name || ""}
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <Input
                  name="description"
                  defaultValue={editingService?.description || ""}
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Fee (৳)</label>
                <Input
                  name="fee"
                  type="number"
                  defaultValue={editingService?.fee || 1000}
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Checklist / Features (comma separated)
                </label>
                <Input
                  name="items"
                  defaultValue={
                    Array.isArray(editingService?.items)
                      ? editingService.items.join(", ")
                      : ""
                  }
                  placeholder="e.g. Risk Assessments, Physical Exams, Wellness Counseling"
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <FileUploadInput
                label="Service Image / Icon"
                value={editingService?.image || ""}
                onChange={(url) =>
                  setEditingService((prev) => ({ ...(prev || {}), image: url }))
                }
                mediaList={mediaList}
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Service
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 5. Add / Edit Clinic Facility Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <Card className="w-full max-w-xl border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Images className="h-5 w-5 text-teal-400" />
                  <span>
                    {Boolean(editingGallery && recordId(editingGallery))
                      ? "Edit Clinic Facility Gallery"
                      : "Add Clinic Facility Gallery"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Configure the clinic name and attach multiple photos to this facility
                </p>
              </div>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value.trim();
                const category =
                  (
                    form.elements.namedItem("category") as HTMLInputElement
                  ).value.trim() || "Chamber";
                const description =
                  (
                    form.elements.namedItem("description") as HTMLTextAreaElement
                  )?.value.trim() || "";

                const images = (editingGallery?.images || []).filter(Boolean);
                const primaryImage = editingGallery?.image || images[0] || "";

                if (images.length === 0 && !primaryImage) {
                  triggerToast(
                    "Please upload at least one photo for this clinic",
                    true,
                  );
                  return;
                }

                if (!title) {
                  triggerToast("Please provide a clinic/facility title", true);
                  return;
                }

                const finalImages = images.length > 0 ? images : [primaryImage];
                const finalCover = primaryImage || finalImages[0];

                try {
                  const isEdit = Boolean(
                    editingGallery && recordId(editingGallery),
                  );
                  const url = isEdit
                    ? `/api/admin/gallery-items/${recordId(editingGallery)}`
                    : "/api/admin/gallery-items";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title,
                      image: finalCover,
                      images: finalImages,
                      alt: title,
                      altText: title,
                      category,
                      description,
                      active: true,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "Clinic gallery updated successfully!"
                      : "Clinic gallery created successfully with multiple photos!",
                  );
                  setIsGalleryModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Clinic / Facility Title *
                  </label>
                  <Input
                    name="title"
                    defaultValue={editingGallery?.title || ""}
                    placeholder="e.g. City Care Hospital Chamber"
                    required
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Facility Category
                  </label>
                  <Input
                    name="category"
                    defaultValue={editingGallery?.category || "Main Hospital"}
                    placeholder="Main Hospital, Chamber, Diagnostic Center..."
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Facility Description & Notes
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingGallery?.description || ""}
                  placeholder="e.g. Modern consultation suite with private examination room and diagnostic setup."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Multi-Photo Manager Section */}
              <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 text-xs block">
                      Clinic Photos ({(editingGallery?.images || []).length} attached)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Add multiple images (consultation room, waiting area, equipment, etc.)
                    </span>
                  </div>
                </div>

                {/* Upload or Choose Image to Add to Clinic Album */}
                <div className="pt-1">
                  <FileUploadInput
                    label="Upload / Add Image to Clinic Album"
                    value=""
                    onChange={(newUrl) => {
                      if (!newUrl) return;
                      const currentImages = [...(editingGallery?.images || [])];
                      if (!currentImages.includes(newUrl)) {
                        currentImages.push(newUrl);
                      }
                      const currentCover = editingGallery?.image || newUrl;
                      setEditingGallery((prev) => ({
                        ...(prev || {}),
                        image: currentCover,
                        images: currentImages,
                      }));
                      triggerToast("Photo added to clinic album!");
                    }}
                    mediaList={mediaList}
                    placeholder="Upload image or choose from library to add to this clinic..."
                  />
                </div>

                {/* Attached Clinic Photos Grid */}
                {(editingGallery?.images || []).length > 0 ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-medium text-slate-400 block">
                      Current Album Photos (Hover to set cover or delete)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                      {(editingGallery?.images || []).map((imgUrl, imgIdx) => {
                        const isCover = (editingGallery?.image === imgUrl) || (!editingGallery?.image && imgIdx === 0);
                        return (
                          <div
                            key={imgIdx}
                            className={`relative aspect-video rounded-xl overflow-hidden border bg-slate-900 group ${
                              isCover ? "border-amber-400 ring-2 ring-amber-400/40" : "border-slate-800"
                            }`}
                          >
                            <img
                              src={safeImageSrc(imgUrl)}
                              alt={`Clinic photo ${imgIdx + 1}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            
                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow">
                                ★ COVER
                              </div>
                            )}

                            {/* Action Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingGallery((prev) => ({
                                      ...(prev || {}),
                                      image: imgUrl,
                                    }));
                                    triggerToast("Cover photo updated!");
                                  }}
                                  className="h-6 px-1.5 bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg"
                                  title="Set as cover image"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingGallery?.images || []).filter((_, i) => i !== imgIdx);
                                  const newCover = editingGallery?.image === imgUrl ? (updated[0] || "") : editingGallery?.image;
                                  setEditingGallery((prev) => ({
                                    ...(prev || {}),
                                    image: newCover,
                                    images: updated,
                                  }));
                                }}
                                className="h-6 w-6 grid place-items-center bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg"
                                title="Remove from clinic album"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No photos added to this clinic yet. Use the upload button above to add photos.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Clinic Gallery
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 6. Add / Edit Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {Boolean(editingTestimonial && recordId(editingTestimonial))
                  ? "Edit Testimonial"
                  : "Add Patient Review"}
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value;
                const designation =
                  (form.elements.namedItem("designation") as HTMLInputElement)
                    .value || "Verified Patient";
                const rating =
                  Number(
                    (form.elements.namedItem("rating") as HTMLSelectElement)
                      .value,
                  ) || 5;
                const quote = (
                  form.elements.namedItem("quote") as HTMLTextAreaElement
                ).value;
                const avatar = editingTestimonial?.avatar || "";

                try {
                  const isEdit = Boolean(
                    editingTestimonial && recordId(editingTestimonial),
                  );
                  const url = isEdit
                    ? `/api/admin/testimonials/${recordId(editingTestimonial)}`
                    : "/api/admin/testimonials";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      designation,
                      rating,
                      quote,
                      avatar,
                      active: true,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "Testimonial updated successfully!"
                      : "Testimonial saved successfully!",
                  );
                  setIsTestimonialModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Patient Name
                </label>
                <Input
                  name="name"
                  defaultValue={editingTestimonial?.name || ""}
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <FileUploadInput
                label="Patient Photo / Avatar"
                value={editingTestimonial?.avatar || ""}
                onChange={(val) => {
                  setEditingTestimonial((prev: any) => ({
                    ...prev,
                    avatar: val,
                  }));
                }}
                placeholder="/uploads/patient.jpg or upload avatar"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Patient Note / Tag
                  </label>
                  <Input
                    name="designation"
                    defaultValue={
                      editingTestimonial?.designation || "Verified Patient"
                    }
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    name="rating"
                    defaultValue={editingTestimonial?.rating || 5}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                  >
                    <option value="5">★★★★★ 5 Stars</option>
                    <option value="4">★★★★☆ 4 Stars</option>
                    <option value="3">★★★☆☆ 3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Review Quote
                </label>
                <textarea
                  name="quote"
                  rows={3}
                  defaultValue={editingTestimonial?.quote || ""}
                  required
                  placeholder="Patient's experience..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Review
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 7. Add / Edit FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">
                {Boolean(editingFaq && recordId(editingFaq))
                  ? "Edit FAQ"
                  : "Add FAQ Question"}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const question = (
                  form.elements.namedItem("question") as HTMLInputElement
                ).value.trim();
                const answer = (
                  form.elements.namedItem("answer") as HTMLTextAreaElement
                ).value.trim();
                const category =
                  (
                    form.elements.namedItem("category") as HTMLInputElement
                  ).value.trim() || "general";

                try {
                  const isEdit = Boolean(editingFaq && recordId(editingFaq));
                  const url = isEdit
                    ? `/api/admin/faqs/${recordId(editingFaq)}`
                    : "/api/admin/faqs";
                  const method = isEdit ? "PATCH" : "POST";
                  const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      question,
                      answer,
                      category,
                      active: true,
                    }),
                  });
                  if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || "Operation failed");
                  }
                  triggerToast(
                    isEdit
                      ? "FAQ updated successfully!"
                      : "FAQ saved successfully!",
                  );
                  setIsFaqModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Question</label>
                <Input
                  name="question"
                  defaultValue={editingFaq?.question || ""}
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Answer</label>
                <textarea
                  name="answer"
                  rows={4}
                  defaultValue={editingFaq?.answer || ""}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <Input
                  name="category"
                  defaultValue={editingFaq?.category || "general"}
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save FAQ
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 8. Patient Clinical Record Drawer */}
      {isPatientDrawerOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="h-full w-full max-w-lg border-l border-slate-800 bg-slate-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 font-bold text-lg border border-teal-500/20">
                    {selectedPatient.fullName?.charAt(0) || "P"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg leading-snug truncate">
                      {selectedPatient.fullName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-500" />
                      <span>{selectedPatient.mobileNumber}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPatient(selectedPatient);
                      setIsPatientModalOpen(true);
                    }}
                    className="border-slate-800 bg-slate-950/80 text-teal-300 hover:text-white rounded-xl text-xs gap-1.5 h-8 px-2.5"
                    title="Edit Patient Details"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit Details</span>
                  </Button>
                  <button
                    onClick={() => setIsPatientDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Patient Basic Demographics */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-teal-400" />
                    <span>Patient Information</span>
                  </span>
                  <button
                    onClick={() => {
                      setEditingPatient(selectedPatient);
                      setIsPatientModalOpen(true);
                    }}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Age / Gender:</span>
                    <span className="text-slate-200 capitalize font-medium">
                      {selectedPatient.age
                        ? `${selectedPatient.age} yrs`
                        : "N/A"}{" "}
                      • {selectedPatient.gender || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email:</span>
                    <span className="text-slate-200 font-medium truncate block">
                      {selectedPatient.email || "None"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Address:</span>
                    <span className="text-slate-200 font-medium">
                      {selectedPatient.address || "Not provided"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">
                      Emergency Contact:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {selectedPatient.emergencyContact || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Clinical History Section (Editable) */}
              <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Activity className="h-4 w-4 text-amber-400" />
                    <span>Clinical Medical History & Conditions</span>
                  </div>
                  {!isEditingPatientHistory && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setInlinePatientHistory(
                          selectedPatient.medicalHistory || "",
                        );
                        setIsEditingPatientHistory(true);
                      }}
                      className="h-6 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Change History</span>
                    </Button>
                  )}
                </div>

                {!isEditingPatientHistory ? (
                  <div>
                    {selectedPatient.medicalHistory ? (
                      <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed whitespace-pre-wrap">
                        {selectedPatient.medicalHistory}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-slate-900/60 rounded-xl border border-dashed border-slate-800">
                        <p className="text-xs text-slate-500">
                          No medical history recorded yet.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            setInlinePatientHistory("");
                            setIsEditingPatientHistory(true);
                          }}
                          className="mt-2 h-7 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs rounded-lg gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Medical History</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <textarea
                      rows={4}
                      value={inlinePatientHistory}
                      onChange={(e) => setInlinePatientHistory(e.target.value)}
                      placeholder="e.g. Type 2 Diabetes (5 yrs), Mild Hypertension, Penicillin Allergy, Prior Appendectomy..."
                      className="w-full rounded-xl border border-amber-500/40 bg-slate-900 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />

                    {/* Quick Condition Tag Suggestions */}
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                        Quick Add Clinical Tags:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Type 2 Diabetes",
                          "Hypertension (HTN)",
                          "Asthma / COPD",
                          "Dyslipidemia",
                          "Penicillin Allergy",
                          "CKD",
                          "Ischemic Heart Disease",
                          "Gastritis / PUD",
                          "Hypothyroidism",
                          "Previous Surgery",
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const trimmed = inlinePatientHistory.trim();
                              if (!trimmed) {
                                setInlinePatientHistory(tag);
                              } else if (
                                !trimmed
                                  .toLowerCase()
                                  .includes(tag.toLowerCase())
                              ) {
                                setInlinePatientHistory(`${trimmed}, ${tag}`);
                              }
                            }}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-teal-500/20 text-[10px] text-slate-300 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInlinePatientHistory(
                            selectedPatient.medicalHistory || "",
                          );
                          setIsEditingPatientHistory(false);
                        }}
                        disabled={savingPatientHistory}
                        className="h-7 text-xs border-slate-800 text-slate-400"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdatePatientHistoryDirect(
                            selectedPatient,
                            inlinePatientHistory,
                          )
                        }
                        disabled={savingPatientHistory}
                        className="h-7 text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold gap-1"
                      >
                        {savingPatientHistory ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {savingPatientHistory ? "Saving..." : "Save History"}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Consultation History */}
              <div>
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-teal-400" />
                  <span>Past Consultations & Appointments</span>
                </h4>

                <div className="space-y-2">
                  {appointments.filter(
                    (a) => a.mobileNumber === selectedPatient.mobileNumber,
                  ).length === 0 ? (
                    <div className="py-6 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                      <p className="text-xs">
                        No consultation records on file.
                      </p>
                    </div>
                  ) : (
                    appointments
                      .filter(
                        (a) => a.mobileNumber === selectedPatient.mobileNumber,
                      )
                      .map((appt) => (
                        <div
                          key={recordId(appt)}
                          className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {appt.hospitalName}
                            </span>
                            <Badge className="bg-teal-500/15 text-teal-300 text-[10px]">
                              Queue #{appt.queueNumber}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            {formatSlotDateLong(appt.slotStart)} •{" "}
                            {formatSlotTimeRangeOnly(
                              appt.slotStart,
                              appt.slotEnd,
                            )}
                          </p>
                          {appt.reason && (
                            <p className="text-slate-300 text-[11px] pt-1">
                              Reason: {appt.reason}
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPatient(selectedPatient);
                  setIsPatientModalOpen(true);
                }}
                className="flex-1 border-slate-800 bg-slate-950 text-slate-200 text-xs"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                <span>Edit Full Profile</span>
              </Button>
              <Button
                onClick={() => setIsPatientDrawerOpen(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
              >
                Close Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8b. Add / Edit Patient & Medical History Modal */}
      {isPatientModalOpen && editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <Card className="w-full max-w-lg border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {recordId(editingPatient)
                      ? "Edit Patient & Clinical History"
                      : "Register New Patient"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Update personal profile, contact information, and medical
                    background
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPatientModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    name="fullName"
                    defaultValue={editingPatient.fullName || ""}
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    name="mobileNumber"
                    defaultValue={editingPatient.mobileNumber || ""}
                    required
                    placeholder="e.g. 01700000000"
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Age (Years)
                  </label>
                  <Input
                    name="age"
                    type="number"
                    defaultValue={editingPatient.age || ""}
                    placeholder="e.g. 45"
                    className="border-slate-800 bg-slate-950 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue={editingPatient.gender || ""}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Not Specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingPatient.email || ""}
                  placeholder="e.g. patient@example.com"
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Address / Location
                </label>
                <Input
                  name="address"
                  defaultValue={editingPatient.address || ""}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Emergency Contact Phone
                </label>
                <Input
                  name="emergencyContact"
                  defaultValue={editingPatient.emergencyContact || ""}
                  placeholder="e.g. 01800000000 (Spouse/Relative)"
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              {/* Medical History Section */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-amber-300 font-medium flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Clinical History, Diagnoses & Allergies</span>
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Visible to Doctor & Super Admin
                  </span>
                </div>
                <textarea
                  id="patient-modal-history-textarea"
                  name="medicalHistory"
                  rows={4}
                  defaultValue={editingPatient.medicalHistory || ""}
                  placeholder="e.g. Type 2 Diabetes Mellitus (5 yrs), Mild Hypertension, Allergy to Penicillin..."
                  className="w-full rounded-xl border border-amber-500/30 bg-slate-950 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />

                {/* Quick Condition Tag Suggestions in Modal */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                    Quick Insert Conditions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Type 2 Diabetes",
                      "Hypertension",
                      "Asthma",
                      "Dyslipidemia",
                      "Penicillin Allergy",
                      "CKD",
                      "IHD",
                      "Gastritis",
                      "Hypothyroidism",
                      "Previous Surgery",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById(
                            "patient-modal-history-textarea",
                          ) as HTMLTextAreaElement | null;
                          if (textarea) {
                            const val = textarea.value.trim();
                            if (!val) {
                              textarea.value = tag;
                            } else if (
                              !val.toLowerCase().includes(tag.toLowerCase())
                            ) {
                              textarea.value = `${val}, ${tag}`;
                            }
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-amber-500/20 text-[10px] text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                {recordId(editingPatient) ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      handleDeletePatient(editingPatient as PatientRecord)
                    }
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-xs gap-1 h-9 px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Patient</span>
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPatientModalOpen(false)}
                    className="border-slate-800 text-slate-300 h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-semibold h-9 px-4 gap-1.5"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Patient Record</span>
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 9. SMS / Patient Note Modal */}
      {isSmsModalOpen && smsTargetAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-400" />
                <span>Patient Message / SMS Note</span>
              </h3>
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-400">
                To:{" "}
                <strong className="text-white">
                  {smsTargetAppointment.patientName}
                </strong>{" "}
                ({smsTargetAppointment.mobileNumber})
              </p>

              <textarea
                rows={4}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => setIsSmsModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await fetch(
                        `/api/admin/appointments/${recordId(smsTargetAppointment)}/status`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            status: smsTargetAppointment.status,
                            patientMessage: smsText,
                          }),
                        },
                      );
                      triggerToast("Patient message dispatched successfully!");
                      setIsSmsModalOpen(false);
                    } catch (err: any) {
                      triggerToast(err.message, true);
                    }
                  }}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Notification</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 10. Income Modal */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Record Clinic Income
              </h3>
              <button
                onClick={() => setIsIncomeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value;
                const amount = Number(
                  (form.elements.namedItem("amount") as HTMLInputElement).value,
                );
                const category = (
                  form.elements.namedItem("category") as HTMLSelectElement
                ).value;
                const paymentMethod = (
                  form.elements.namedItem("paymentMethod") as HTMLSelectElement
                ).value;

                try {
                  const res = await fetch("/api/admin/incomes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title,
                      amount,
                      category,
                      paymentMethod,
                      incomeDate: new Date().toISOString(),
                    }),
                  });
                  if (!res.ok) throw new Error("Failed to record income");
                  triggerToast("Income recorded successfully!");
                  setIsIncomeModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Income Description
                </label>
                <Input
                  name="title"
                  placeholder="e.g. Consultations Session"
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Amount (৳)</label>
                <Input
                  name="amount"
                  type="number"
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                  >
                    <option value="cash">Cash</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="card">Card</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save Income
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 11. Expense Modal (with Receipt FileUploadInput) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <Card className="w-full max-w-md border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Record Clinic Expense
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value;
                const amount = Number(
                  (form.elements.namedItem("amount") as HTMLInputElement).value,
                );
                const category = (
                  form.elements.namedItem("category") as HTMLSelectElement
                ).value;
                const notes = (
                  form.elements.namedItem("notes") as HTMLInputElement
                ).value;
                const receipt =
                  (form.elements.namedItem("receipt") as HTMLInputElement)
                    ?.value || "";

                try {
                  const res = await fetch("/api/admin/expenses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title,
                      amount,
                      category,
                      notes,
                      receipt,
                      expenseDate: new Date().toISOString(),
                    }),
                  });
                  if (!res.ok) throw new Error("Failed to record expense");
                  triggerToast("Expense recorded successfully!");
                  setIsExpenseModalOpen(false);
                  loadAllData();
                } catch (err: any) {
                  triggerToast(err.message, true);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">
                  Expense Description
                </label>
                <Input
                  name="title"
                  placeholder="e.g. Utility Bills, Medical Supplies"
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Amount (৳)</label>
                <Input
                  name="amount"
                  type="number"
                  required
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                >
                  <option value="rent">Rent</option>
                  <option value="utility">Utility</option>
                  <option value="salary">Salary</option>
                  <option value="medicine">Medicine / Supplies</option>
                  <option value="equipment">Equipment</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Receipt File Upload Input */}
              <FileUploadInput
                label="Receipt / Voucher Attachment (PDF or Image)"
                value=""
                onChange={(url) => {
                  const input = document.querySelector(
                    'input[name="receipt"]',
                  ) as HTMLInputElement;
                  if (input) input.value = url;
                }}
                mediaList={mediaList}
                placeholder="Upload receipt voucher..."
              />
              <input type="hidden" name="receipt" defaultValue="" />

              <div>
                <label className="block text-slate-400 mb-1">
                  Notes / Voucher Ref
                </label>
                <Input
                  name="notes"
                  placeholder="Invoice # or voucher ref"
                  className="border-slate-800 bg-slate-950 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="border-slate-800 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Save Expense
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
