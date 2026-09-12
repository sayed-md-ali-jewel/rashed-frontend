"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Code,
  Copy,
  Database,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
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
  SearchCheck,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sliders,
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
import { AdminMessagesPanel } from "@/components/admin/admin-messages-panel";

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

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type AdminTab =
  | "dashboard"
  | "messages"
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

type ChamberScheduleRuleRecord = {
  _id?: string;
  id?: string;
  hospitalId?: string;
  hospital?: any;
  title?: string;
  scheduleType?: "daily" | "weekly" | "monthly" | "specific_date";
  daysOfWeek?: string[];
  dayOfMonth?: number;
  specificDate?: string;
  startTime?: string;
  endTime?: string;
  slotDurationMinutes?: number;
  fee?: number;
  maxAppointments?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
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
  ruleId?: string;
  isRecurring?: boolean;
  scheduleType?: "daily" | "weekly" | "monthly" | "specific_date" | "custom";
  isCustomOverride?: boolean;
  cancellationReason?: string;
  rescheduleNotes?: string;
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

function format12Hour(timeStr?: string): string {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return timeStr;
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function calculatePreviewDates(
  scheduleType: string,
  daysOfWeek: string[] = [],
  dayOfMonth: number = 13,
  specificDate: string = "",
  startTime: string = "16:00",
  endTime: string = "19:00",
  count = 5
): Array<{ formattedDate: string; dayName: string; timeRange: string }> {
  const dates: Array<{ formattedDate: string; dayName: string; timeRange: string }> = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeRange = `${format12Hour(startTime)} – ${format12Hour(endTime)}`;

  if (scheduleType === "specific_date") {
    if (specificDate) {
      const d = new Date(specificDate);
      if (!isNaN(d.getTime())) {
        dates.push({
          formattedDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
          timeRange,
        });
      }
    }
    return dates;
  }

  if (scheduleType === "daily") {
    const cursor = new Date(today);
    while (dates.length < count) {
      dates.push({
        formattedDate: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayName: cursor.toLocaleDateString("en-US", { weekday: "long" }),
        timeRange,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  if (scheduleType === "weekly") {
    const normalizedDays = (daysOfWeek || []).map((d) => d.toLowerCase().trim());
    if (normalizedDays.length === 0) return dates;
    const cursor = new Date(today);
    let iterations = 0;
    while (dates.length < count && iterations < 90) {
      const dayNameLower = cursor.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      if (normalizedDays.includes(dayNameLower)) {
        dates.push({
          formattedDate: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dayName: cursor.toLocaleDateString("en-US", { weekday: "long" }),
          timeRange,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
      iterations++;
    }
    return dates;
  }

  if (scheduleType === "monthly") {
    const targetDay = Math.min(31, Math.max(1, Number(dayOfMonth) || 1));
    let year = today.getFullYear();
    let month = today.getMonth();

    for (let i = 0; i < count + 6 && dates.length < count; i++) {
      const maxDaysInMonth = new Date(year, month + 1, 0).getDate();
      const actualDay = Math.min(targetDay, maxDaysInMonth);
      const occurrence = new Date(year, month, actualDay);
      if (occurrence >= today) {
        dates.push({
          formattedDate: occurrence.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          dayName: occurrence.toLocaleDateString("en-US", { weekday: "long" }),
          timeRange,
        });
      }
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
    return dates;
  }

  return dates;
}

function ScheduleRuleModalDialog({
  isOpen,
  onClose,
  editingRule,
  hospitals,
  onSaved,
  triggerToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingRule: ChamberScheduleRuleRecord | null;
  hospitals: HospitalRecord[];
  onSaved: () => void;
  triggerToast: (msg: string, isError?: boolean) => void;
}) {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [scheduleType, setScheduleType] = useState<"daily" | "weekly" | "monthly" | "specific_date">("weekly");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(["saturday", "monday", "wednesday"]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(13);
  const [specificDate, setSpecificDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("16:00");
  const [endTime, setEndTime] = useState<string>("19:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(10);
  const [maxAppointments, setMaxAppointments] = useState<number>(20);
  const [fee, setFee] = useState<number>(1000);
  const [active, setActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editingRule) {
      setSelectedHospitalId(editingRule.hospitalId || recordId(hospitals[0]));
      setTitle(editingRule.title || "");
      setScheduleType(editingRule.scheduleType || "weekly");
      setDaysOfWeek(editingRule.daysOfWeek?.map((d) => d.toLowerCase()) || ["saturday", "monday", "wednesday"]);
      setDayOfMonth(editingRule.dayOfMonth || 13);
      setSpecificDate(editingRule.specificDate ? editingRule.specificDate.slice(0, 10) : "");
      setStartTime(editingRule.startTime || "16:00");
      setEndTime(editingRule.endTime || "19:00");
      setSlotDurationMinutes(editingRule.slotDurationMinutes || 10);
      setMaxAppointments(editingRule.maxAppointments || 20);
      setFee(editingRule.fee || 1000);
      setActive(editingRule.active !== false);
    } else {
      const defaultHosp = hospitals[0];
      setSelectedHospitalId(recordId(defaultHosp));
      setTitle(defaultHosp?.name ? `${defaultHosp.name} Consultation` : "Chamber Consultation");
      setScheduleType("weekly");
      setDaysOfWeek(["saturday", "monday", "wednesday"]);
      setDayOfMonth(13);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSpecificDate(nextWeek.toISOString().slice(0, 10));
      setStartTime("16:00");
      setEndTime("19:00");
      setSlotDurationMinutes(10);
      setMaxAppointments(20);
      setFee(defaultHosp?.consultationFee || 1000);
      setActive(true);
    }
  }, [editingRule, hospitals, isOpen]);

  const toggleDayOfWeek = (day: string) => {
    const dayLower = day.toLowerCase();
    setDaysOfWeek((prev) =>
      prev.includes(dayLower)
        ? prev.filter((d) => d !== dayLower)
        : [...prev, dayLower]
    );
  };

  const previewDates = useMemo(() => {
    return calculatePreviewDates(
      scheduleType,
      daysOfWeek,
      dayOfMonth,
      specificDate,
      startTime,
      endTime,
      5
    );
  }, [scheduleType, daysOfWeek, dayOfMonth, specificDate, startTime, endTime]);

  if (!isOpen) return null;
  const isEdit = Boolean(editingRule && recordId(editingRule));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleType === "weekly" && daysOfWeek.length === 0) {
      triggerToast("Please select at least one day of the week for weekly recurring schedule", true);
      return;
    }
    setIsSubmitting(true);
    try {
      const url = isEdit
        ? `/api/admin/schedule-rules/${recordId(editingRule)}`
        : "/api/admin/schedule-rules";
      const method = isEdit ? "PATCH" : "POST";

      const selectedHospital = hospitals.find((h) => recordId(h) === selectedHospitalId);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: selectedHospitalId,
          hospital: selectedHospital,
          title,
          scheduleType,
          daysOfWeek: scheduleType === "weekly" ? daysOfWeek : undefined,
          dayOfMonth: scheduleType === "monthly" ? Number(dayOfMonth) : undefined,
          specificDate: scheduleType === "specific_date" ? specificDate : undefined,
          startTime,
          endTime,
          slotDurationMinutes: Number(slotDurationMinutes),
          maxAppointments: Number(maxAppointments),
          fee: Number(fee),
          active,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save schedule rule");
      }

      triggerToast(
        isEdit
          ? "Recurring schedule rule updated & occurrences synchronized!"
          : "Recurring schedule rule created & upcoming dates generated!"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-teal-400" />
              <span>{isEdit ? "Edit Recurring Schedule Rule" : "Create Recurring Schedule Rule"}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set the schedule once and the system will automatically generate all upcoming chamber dates
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Chamber / Hospital */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Hospital className="h-3.5 w-3.5 text-teal-400" />
              <span>Chamber / Hospital <span className="text-rose-400">*</span></span>
            </label>
            <select
              value={selectedHospitalId}
              onChange={(e) => {
                const hId = e.target.value;
                setSelectedHospitalId(hId);
                const h = hospitals.find((item) => recordId(item) === hId);
                if (h) {
                  if (!isEdit) setTitle(`${h.name} Consultation`);
                  if (h.consultationFee) setFee(h.consultationFee);
                }
              }}
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              {hospitals.map((h) => (
                <option key={recordId(h)} value={recordId(h)}>
                  {h.name} {h.address ? `(${h.address})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Schedule Title <span className="text-rose-400">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. City Care Evening Consultation"
              required
              className="border-slate-800 bg-slate-950 text-slate-200 focus:border-teal-500"
            />
          </div>

          {/* Schedule Type Selection Tabs */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-400" />
                <span>Schedule Type <span className="text-rose-400">*</span></span>
              </span>
              <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider">
                {scheduleType.replace("_", " ")}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setScheduleType("weekly")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  scheduleType === "weekly"
                    ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-950/50"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Calendar className="h-4 w-4 mb-1 text-teal-400" />
                <span>Weekly</span>
                <span className="text-[10px] font-normal opacity-70">Specific Days/Week</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType("monthly")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  scheduleType === "monthly"
                    ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-950/50"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <CalendarCheck className="h-4 w-4 mb-1 text-emerald-400" />
                <span>Monthly</span>
                <span className="text-[10px] font-normal opacity-70">Specific Day of Month</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType("daily")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  scheduleType === "daily"
                    ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-950/50"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Clock className="h-4 w-4 mb-1 text-sky-400" />
                <span>Daily</span>
                <span className="text-[10px] font-normal opacity-70">Every Single Day</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType("specific_date")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  scheduleType === "specific_date"
                    ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-950/50"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <CalendarClock className="h-4 w-4 mb-1 text-amber-400" />
                <span>Specific Date</span>
                <span className="text-[10px] font-normal opacity-70">One-off session</span>
              </button>
            </div>
          </div>

          {/* Conditional Type Configs */}
          {scheduleType === "weekly" && (
            <div className="rounded-xl border border-teal-900/40 bg-teal-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-300 block">
                    Days of the Week (Shown for Weekly)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Select the days this chamber operates each week (e.g. Saturday, Monday, Wednesday)
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDaysOfWeek(["saturday", "monday", "wednesday"])}
                    className="rounded px-2 py-0.5 text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 font-medium hover:bg-teal-500/30"
                  >
                    Sat, Mon, Wed
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaysOfWeek(["sunday", "tuesday", "thursday"])}
                    className="rounded px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium hover:bg-slate-700"
                  >
                    Sun, Tue, Thu
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaysOfWeek(["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"])}
                    className="rounded px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium hover:bg-slate-700"
                  >
                    Sat - Thu
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {[
                  { key: "saturday", label: "Saturday", short: "Sat" },
                  { key: "sunday", label: "Sunday", short: "Sun" },
                  { key: "monday", label: "Monday", short: "Mon" },
                  { key: "tuesday", label: "Tuesday", short: "Tue" },
                  { key: "wednesday", label: "Wednesday", short: "Wed" },
                  { key: "thursday", label: "Thursday", short: "Thu" },
                  { key: "friday", label: "Friday", short: "Fri" },
                ].map((d) => {
                  const isSelected = daysOfWeek.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => toggleDayOfWeek(d.key)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-teal-500 border-teal-400 text-slate-950 shadow-md shadow-teal-950 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span>{d.short}</span>
                      <span className="text-[9px] opacity-80 mt-0.5">{isSelected ? "✓ Active" : "+ Add"}</span>
                    </button>
                  );
                })}
              </div>

              {daysOfWeek.length > 0 ? (
                <p className="text-[11px] text-teal-300 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-teal-400" />
                  <span>
                    Chamber will automatically run every:{" "}
                    <strong>
                      {daysOfWeek.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}
                    </strong>
                  </span>
                </p>
              ) : (
                <p className="text-[11px] text-rose-400 font-semibold">
                  ⚠️ Please select at least one day of the week.
                </p>
              )}
            </div>
          )}

          {scheduleType === "monthly" && (
            <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 space-y-3">
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  Day of the Month (Shown for Monthly)
                </span>
                <span className="text-[11px] text-slate-400">
                  Select the specific date number of each month (e.g., 13 for 13th day of every month)
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-36">
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                    required
                    className="border-slate-800 bg-slate-950 text-slate-200 text-center font-bold text-sm focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 5, 10, 13, 15, 20, 25, 28].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDayOfMonth(num)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                        dayOfMonth === num
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow"
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {num}{num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  Chamber will automatically run on the <strong>{dayOfMonth}{dayOfMonth === 1 ? "st" : dayOfMonth === 2 ? "nd" : dayOfMonth === 3 ? "rd" : "th"} day of every month</strong>.
                </span>
              </p>
            </div>
          )}

          {scheduleType === "daily" && (
            <div className="rounded-xl border border-sky-900/40 bg-sky-950/20 p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-sky-300 block">Daily Recurring Schedule</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  The system will automatically generate active consultation sessions for <strong>every single day</strong> of the week at the configured hours.
                </p>
              </div>
            </div>
          )}

          {scheduleType === "specific_date" && (
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-3">
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  Specific Date (Shown for Specific Date)
                </span>
                <span className="text-[11px] text-slate-400">
                  Select the exact date for this one-off consultation session
                </span>
              </div>
              <Input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-slate-200 w-full sm:w-64 focus:border-amber-500"
              />
            </div>
          )}

          {/* Start Time & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
              <label className="block text-slate-300 font-medium flex items-center justify-between">
                <span>Start Time <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-teal-400 font-bold">{format12Hour(startTime)}</span>
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-sm"
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
              <label className="block text-slate-300 font-medium flex items-center justify-between">
                <span>End Time <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-teal-400 font-bold">{format12Hour(endTime)}</span>
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-sm"
              />
            </div>
          </div>

          {/* Slot Duration, Max Slots, Fee */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Slot Duration (Min)</label>
              <Input
                type="number"
                min={5}
                max={120}
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                required
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Slots/Appointments</label>
              <Input
                type="number"
                min={1}
                max={200}
                value={maxAppointments}
                onChange={(e) => setMaxAppointments(Number(e.target.value))}
                required
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Consultation Fee (৳)</label>
              <Input
                type="number"
                min={0}
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                required
                className="border-slate-800 bg-slate-950 text-slate-200 font-semibold text-emerald-400"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div>
              <span className="text-xs font-bold text-white block">Rule Status</span>
              <span className="text-[11px] text-slate-400">
                {active ? "Active — system will auto-generate upcoming dates" : "Inactive — no new occurrences generated"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? "bg-teal-500" : "bg-slate-800"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Live Preview of Generated Dates */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Live Date Preview (Next 5 Generated Occurrences)</span>
              </span>
              <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px]">
                {format12Hour(startTime)} – {format12Hour(endTime)}
              </Badge>
            </div>

            {previewDates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {previewDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-800/80 bg-slate-900/60 text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-xs block">{item.formattedDate}</span>
                        <span className="text-[10px] text-slate-400">{item.dayName}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {item.timeRange}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic py-1">
                Select valid days / dates above to preview upcoming occurrences.
              </p>
            )}
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
              className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-semibold gap-1.5 px-5"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SaveIcon className="h-3.5 w-3.5" />}
              <span>{isEdit ? "Save Rule Changes" : "Save & Generate Occurrences"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function RescheduleOccurrenceModalDialog({
  isOpen,
  onClose,
  schedule,
  onSaved,
  triggerToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleRecord | null;
  onSaved: () => void;
  triggerToast: (msg: string, isError?: boolean) => void;
}) {
  const [startsAt, setStartsAt] = useState<string>("");
  const [endsAt, setEndsAt] = useState<string>("");
  const [fee, setFee] = useState<number>(1000);
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(10);
  const [maxAppointments, setMaxAppointments] = useState<number>(20);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (schedule) {
      setStartsAt(toLocalDatetimeInput(schedule.startsAt));
      setEndsAt(toLocalDatetimeInput(schedule.endsAt));
      setFee(schedule.fee || 1000);
      setSlotDurationMinutes(schedule.slotDurationMinutes || 10);
      setMaxAppointments(schedule.maxAppointments || 20);
      setNotes(schedule.rescheduleNotes || "");
    }
  }, [schedule, isOpen]);

  if (!isOpen || !schedule) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/schedules/${recordId(schedule)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          startsAt: new Date(startsAt).toISOString(),
          endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
          fee: Number(fee),
          slotDurationMinutes: Number(slotDurationMinutes),
          maxAppointments: Number(maxAppointments),
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to reschedule session");
      }
      triggerToast("Specific day's schedule updated! Recurring master rule remains untouched.");
      onSaved();
      onClose();
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <Card className="w-full max-w-lg border-slate-800 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-400" />
              <span>Reschedule / Customize Single Day</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {schedule.hospital?.name || "Chamber"} &bull; {formatSlotDateLong(schedule.startsAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
          💡 <strong>Single Day Override</strong>: Changing times or fees here only affects this single date. The master recurring rule and other dates will remain unchanged.
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Start Date & Time <span className="text-rose-400">*</span>
              </label>
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                End Date & Time
              </label>
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Duration (Min)</label>
              <Input
                type="number"
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Slots</label>
              <Input
                type="number"
                value={maxAppointments}
                onChange={(e) => setMaxAppointments(Number(e.target.value))}
                className="border-slate-800 bg-slate-950 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Fee (৳)</label>
              <Input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="border-slate-800 bg-slate-950 text-slate-200 font-semibold text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Override Reason / Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extended evening session due to high demand"
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
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold gap-1.5"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SaveIcon className="h-3.5 w-3.5" />}
              <span>Save Day Override</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function CancelOccurrenceModalDialog({
  isOpen,
  onClose,
  schedule,
  onSaved,
  triggerToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleRecord | null;
  onSaved: () => void;
  triggerToast: (msg: string, isError?: boolean) => void;
}) {
  const [reason, setReason] = useState<string>("Doctor unavailable / Emergency holiday");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !schedule) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/schedules/${recordId(schedule)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          cancellationReason: reason,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to cancel date");
      }
      triggerToast("Session cancelled for this specific day. Recurring master rule remains active.");
      onSaved();
      onClose();
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <Card className="w-full max-w-md border-rose-900/40 bg-slate-900 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="font-bold text-white text-lg">Cancel Single Day Schedule</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <p className="text-slate-300">
            You are cancelling the consultation session on{" "}
            <strong className="text-white">{formatSlotDateLong(schedule.startsAt)}</strong> at{" "}
            <strong className="text-teal-400">{schedule.hospital?.name || "Clinic"}</strong>.
          </p>
          <p className="text-slate-400 text-[11px]">
            ⚠️ This will cancel all booked appointments for this date and close serial booking. Other scheduled days and the recurring master rule will remain unaffected.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Reason for Cancellation</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="e.g. Doctor is out of station"
              className="border-slate-800 bg-slate-950 text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-800 text-slate-300"
            >
              Keep Active
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold gap-1.5"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>Confirm Cancellation</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
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
  const [scheduleRules, setScheduleRules] = useState<ChamberScheduleRuleRecord[]>([]);
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

  // Schedule Rules & Occurrences View State
  const [scheduleSubTab, setScheduleSubTab] = useState<"rules" | "occurrences">("rules");
  const [isScheduleRuleModalOpen, setIsScheduleRuleModalOpen] = useState(false);
  const [editingScheduleRule, setEditingScheduleRule] = useState<ChamberScheduleRuleRecord | null>(null);
  const [isSyncingSchedules, setIsSyncingSchedules] = useState(false);
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState("all");
  const [ruleSearch, setRuleSearch] = useState("");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("all");
  const [ruleHospitalFilter, setRuleHospitalFilter] = useState("all");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingSchedule, setReschedulingSchedule] = useState<ScheduleRecord | null>(null);
  const [isCancelOccurrenceModalOpen, setIsCancelOccurrenceModalOpen] = useState(false);
  const [cancellingSchedule, setCancellingSchedule] = useState<ScheduleRecord | null>(null);

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
  const [seoSubTab, setSeoSubTab] = useState<
    "meta" | "gsc" | "analytics" | "sitemap" | "robots"
  >("meta");
  const [newDisallowPath, setNewDisallowPath] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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
        scheduleRulesRes,
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
        fetch("/api/admin/schedule-rules")
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
      setScheduleRules(scheduleRulesRes.data || []);
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

  const handleSyncSchedules = async () => {
    setIsSyncingSchedules(true);
    try {
      const res = await fetch("/api/admin/schedules/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysAhead: 60 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      triggerToast(data.message || "Schedules synchronized successfully!");
      await loadAllData();
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setIsSyncingSchedules(false);
    }
  };

  const handleToggleRuleActive = async (rule: ChamberScheduleRuleRecord) => {
    try {
      const newActive = !rule.active;
      const res = await fetch(`/api/admin/schedule-rules/${recordId(rule)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newActive }),
      });
      if (!res.ok) throw new Error("Failed to update rule status");
      triggerToast(`Schedule rule is now ${newActive ? "Active" : "Inactive"}`);
      loadAllData();
    } catch (err: any) {
      triggerToast(err.message, true);
    }
  };

  const handleReactivateScheduleOccurrence = async (schedule: ScheduleRecord) => {
    try {
      const res = await fetch(`/api/admin/schedules/${recordId(schedule)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });
      if (!res.ok) throw new Error("Failed to reactivate schedule");
      triggerToast("Schedule session reactivated successfully!");
      loadAllData();
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

  // Save SEO & Webmaster Suite Settings
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
      }

      const updatedWebsite = {
        ...websiteSettings,
        ...(seoScope === "website" ? { defaultSeo: seoForm } : {}),
      };
      const webRes = await fetch("/api/admin/website-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWebsite),
      });
      if (!webRes.ok) throw new Error("Failed to save website SEO & Webmaster settings");
      setWebsiteSettings(updatedWebsite);

      triggerToast("SEO & Webmaster settings saved successfully!");
      loadAllData();
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

  // Filtered Schedule Rules
  const filteredScheduleRules = useMemo(() => {
    return scheduleRules.filter((r) => {
      const hospitalName = r.hospital?.name || "";
      const matchSearch =
        !ruleSearch ||
        (r.title || "").toLowerCase().includes(ruleSearch.toLowerCase()) ||
        hospitalName.toLowerCase().includes(ruleSearch.toLowerCase());

      const matchType =
        ruleTypeFilter === "all" || r.scheduleType === ruleTypeFilter;

      const matchHospital =
        ruleHospitalFilter === "all" || hospitalName === ruleHospitalFilter;

      return matchSearch && matchType && matchHospital;
    });
  }, [scheduleRules, ruleSearch, ruleTypeFilter, ruleHospitalFilter]);

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

      const matchType =
        scheduleTypeFilter === "all" ||
        (s.scheduleType || (s.isRecurring ? "weekly" : "custom")) ===
          scheduleTypeFilter;

      return matchSearch && matchHospital && matchStatus && matchType;
    });
  }, [
    schedules,
    scheduleSearch,
    scheduleHospitalFilter,
    scheduleStatusFilter,
    scheduleTypeFilter,
  ]);

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
    <div
      className="admin-portal font-sans flex min-h-screen bg-[#0d131f] text-slate-100 antialiased selection:bg-teal-500/30 selection:text-teal-200"
      data-admin-root="true"
      lang="en"
    >
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
              <button
                onClick={() => {
                  setActiveTab("messages");
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  activeTab === "messages"
                    ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 shadow-inner"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-teal-400" />
                  <span>Messages & Requests</span>
                </div>
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

              {/* ================= MESSAGES & REQUESTS TAB ================= */}
              {activeTab === "messages" && (
                <AdminMessagesPanel
                  onViewPatient={(phone) => {
                    setActiveTab("patients");
                    setPatientSearch(phone);
                  }}
                />
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

              {/* ================= 4. SCHEDULES & RECURRING RULES TAB ================= */}
              {activeTab === "schedules" && (
                <div className="space-y-6">
                  {/* Tab Header & Action Bar */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <CalendarClock className="h-6 w-6 text-teal-400" />
                        <span>Chamber Schedules & Recurring Rules</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Configure recurring weekly/monthly/daily chamber schedule patterns or manage single-day session overrides
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={handleSyncSchedules}
                        disabled={isSyncingSchedules}
                        size="sm"
                        variant="outline"
                        className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs rounded-xl gap-1.5 font-medium"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSchedules ? "animate-spin text-teal-400" : "text-slate-400"}`} />
                        <span>{isSyncingSchedules ? "Syncing..." : "Sync & Generate Occurrences"}</span>
                      </Button>

                      <Button
                        onClick={() => {
                          setEditingSchedule(null);
                          setIsScheduleModalOpen(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs rounded-xl gap-1.5 font-medium"
                      >
                        <Plus className="h-3.5 w-3.5 text-slate-400" />
                        <span>Manual Single Date</span>
                      </Button>

                      <Button
                        onClick={() => {
                          setEditingScheduleRule(null);
                          setIsScheduleRuleModalOpen(true);
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold shadow-lg shadow-teal-950/50"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Create Recurring Rule</span>
                      </Button>
                    </div>
                  </div>

                  {/* Sub-tabs Navigation */}
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                    <button
                      onClick={() => setScheduleSubTab("rules")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        scheduleSubTab === "rules"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <CalendarClock className="h-4 w-4" />
                      <span>Recurring Schedule Rules</span>
                      <Badge className="bg-teal-500/30 text-teal-200 border-0 text-[10px] ml-1">
                        {scheduleRules.length}
                      </Badge>
                    </button>

                    <button
                      onClick={() => setScheduleSubTab("occurrences")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        scheduleSubTab === "occurrences"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Upcoming Chamber Schedules & Live Slots</span>
                      <Badge className="bg-slate-800 text-slate-300 border-0 text-[10px] ml-1">
                        {filteredSchedules.length}
                      </Badge>
                    </button>
                  </div>

                  {/* ================= VIEW A: RECURRING SCHEDULE RULES ================= */}
                  {scheduleSubTab === "rules" && (
                    <div className="space-y-5">
                      {/* Rules Filters & Search */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Search recurring rules by chamber or title..."
                            value={ruleSearch}
                            onChange={(e) => setRuleSearch(e.target.value)}
                            className="pl-9 border-slate-800 bg-slate-950 text-xs text-slate-200 w-full"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <select
                            value={ruleTypeFilter}
                            onChange={(e) => setRuleTypeFilter(e.target.value)}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="all">All Rule Types</option>
                            <option value="weekly">Weekly Recurring</option>
                            <option value="monthly">Monthly Recurring</option>
                            <option value="daily">Daily Recurring</option>
                            <option value="specific_date">Specific Date</option>
                          </select>

                          <select
                            value={ruleHospitalFilter}
                            onChange={(e) => setRuleHospitalFilter(e.target.value)}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="all">All Chambers</option>
                            {hospitals.map((h) => (
                              <option key={recordId(h)} value={h.name}>
                                {h.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Rules Grid */}
                      {filteredScheduleRules.length === 0 ? (
                        <Card className="border-slate-800 bg-slate-900/60 p-12 text-center rounded-2xl">
                          <CalendarClock className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                          <h3 className="text-lg font-bold text-white">No Recurring Rules Found</h3>
                          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                            Create your weekly, monthly, or daily recurring schedule rules to automatically generate upcoming chamber sessions.
                          </p>
                          <Button
                            onClick={() => {
                              setEditingScheduleRule(null);
                              setIsScheduleRuleModalOpen(true);
                            }}
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs gap-1.5 font-semibold"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Create First Recurring Rule</span>
                          </Button>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredScheduleRules.map((rule) => {
                            const occurrencesForThisRule = schedules.filter(
                              (s) => s.ruleId === recordId(rule)
                            );
                            const activeOccurrences = occurrencesForThisRule.filter(
                              (s) => s.scheduleStatus !== "cancelled"
                            );

                            return (
                              <Card
                                key={recordId(rule)}
                                className="border-slate-800 bg-slate-900/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
                              >
                                <div className="space-y-3.5">
                                  {/* Header: Hospital + Status Switch */}
                                  <div className="flex items-start justify-between gap-2">
                                    <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px] truncate max-w-[200px]">
                                      {rule.hospital?.name || "Chamber"}
                                    </Badge>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleRuleActive(rule)}
                                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-all ${
                                        rule.active
                                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                                      }`}
                                    >
                                      <span className={`size-1.5 rounded-full ${rule.active ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                                      <span>{rule.active ? "Active Rule" : "Inactive"}</span>
                                    </button>
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-base font-bold text-white leading-snug">
                                    {rule.title}
                                  </h3>

                                  {/* Rule Type Banner & Pattern Details */}
                                  <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-semibold text-slate-400">Rule Pattern:</span>
                                      <Badge
                                        className={
                                          rule.scheduleType === "weekly"
                                            ? "bg-teal-500/20 text-teal-300 border-teal-500/40 text-[10px] font-bold"
                                            : rule.scheduleType === "monthly"
                                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-bold"
                                            : rule.scheduleType === "daily"
                                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40 text-[10px] font-bold"
                                            : "bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-bold"
                                        }
                                      >
                                        {rule.scheduleType === "weekly"
                                          ? "Weekly Recurring"
                                          : rule.scheduleType === "monthly"
                                          ? "Monthly Recurring"
                                          : rule.scheduleType === "daily"
                                          ? "Daily Recurring"
                                          : "Specific Date"}
                                      </Badge>
                                    </div>

                                    {/* Pattern specifics */}
                                    {rule.scheduleType === "weekly" && (
                                      <div className="space-y-1">
                                        <div className="flex flex-wrap gap-1 pt-0.5">
                                          {(rule.daysOfWeek || []).map((day) => (
                                            <span
                                              key={day}
                                              className="rounded-md bg-teal-500/20 border border-teal-500/40 px-2 py-0.5 text-[10px] font-bold text-teal-300 uppercase tracking-wide"
                                            >
                                              {day.slice(0, 3)}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {rule.scheduleType === "monthly" && (
                                      <p className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                                        <CalendarCheck className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>
                                          Every month on the <strong>{rule.dayOfMonth}{rule.dayOfMonth === 1 ? "st" : rule.dayOfMonth === 2 ? "nd" : rule.dayOfMonth === 3 ? "rd" : "th"} day</strong>
                                        </span>
                                      </p>
                                    )}

                                    {rule.scheduleType === "daily" && (
                                      <p className="text-xs text-sky-300 font-semibold flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-sky-400" />
                                        <span>Operates every day of the week</span>
                                      </p>
                                    )}

                                    {rule.scheduleType === "specific_date" && (
                                      <p className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                                        <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
                                        <span>Date: {formatSlotDateLong(rule.specificDate)}</span>
                                      </p>
                                    )}

                                    {/* Time Range */}
                                    <div className="flex items-center gap-1.5 text-xs text-slate-200 pt-1 border-t border-slate-800">
                                      <Clock className="h-3.5 w-3.5 text-teal-400" />
                                      <span className="font-bold text-white">
                                        {format12Hour(rule.startTime)} – {format12Hour(rule.endTime)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Stats row */}
                                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2">
                                      <span className="block text-[10px] text-slate-500">Slot Time</span>
                                      <span className="font-bold text-slate-300">{rule.slotDurationMinutes || 10}m</span>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2">
                                      <span className="block text-[10px] text-slate-500">Max Slots</span>
                                      <span className="font-bold text-slate-300">{rule.maxAppointments || 20}</span>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2">
                                      <span className="block text-[10px] text-slate-500">Fee</span>
                                      <span className="font-bold text-emerald-400">৳{rule.fee || 1000}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer Card Actions */}
                                <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScheduleHospitalFilter(rule.hospital?.name || "all");
                                      setScheduleSubTab("occurrences");
                                    }}
                                    className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold underline flex items-center gap-1"
                                  >
                                    <span>{activeOccurrences.length} upcoming dates</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </button>

                                  <div className="flex items-center gap-1.5">
                                    <Button
                                      onClick={() => {
                                        setEditingScheduleRule(rule);
                                        setIsScheduleRuleModalOpen(true);
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
                                          "schedule-rules",
                                          recordId(rule),
                                          rule.title || "Recurring Rule"
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
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================= VIEW B: UPCOMING GENERATED OCCURRENCES ================= */}
                  {scheduleSubTab === "occurrences" && (
                    <div className="space-y-5">
                      {/* Occurrence Filters */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="Search generated chamber dates..."
                            value={scheduleSearch}
                            onChange={(e) => setScheduleSearch(e.target.value)}
                            className="pl-9 border-slate-800 bg-slate-950 text-xs text-slate-200 w-full"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <select
                            value={scheduleHospitalFilter}
                            onChange={(e) => setScheduleHospitalFilter(e.target.value)}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="all">All Chambers</option>
                            {hospitals.map((h) => (
                              <option key={recordId(h)} value={h.name}>
                                {h.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={scheduleStatusFilter}
                            onChange={(e) => setScheduleStatusFilter(e.target.value)}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="all">All Statuses</option>
                            <option value="scheduled">Scheduled (Active)</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>

                          <select
                            value={scheduleTypeFilter}
                            onChange={(e) => setScheduleTypeFilter(e.target.value)}
                            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                          >
                            <option value="all">All Types</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                            <option value="specific_date">Specific Date</option>
                            <option value="custom">Custom Single Date</option>
                          </select>
                        </div>
                      </div>

                      {/* Occurrences Grid */}
                      {filteredSchedules.length === 0 ? (
                        <Card className="border-slate-800 bg-slate-900/60 p-12 text-center rounded-2xl">
                          <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                          <h3 className="text-lg font-bold text-white">No Upcoming Schedules Found</h3>
                          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                            Click &ldquo;Sync & Generate Occurrences&rdquo; to automatically populate upcoming dates from active recurring rules.
                          </p>
                          <Button
                            onClick={handleSyncSchedules}
                            disabled={isSyncingSchedules}
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs gap-1.5 font-semibold"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSchedules ? "animate-spin" : ""}`} />
                            <span>Generate Upcoming Dates</span>
                          </Button>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {filteredSchedules.map((sched) => {
                            const isCancelled = sched.scheduleStatus === "cancelled";
                            const isOverridden = sched.isCustomOverride;
                            const startsDate = sched.startsAt ? new Date(sched.startsAt) : null;
                            const dayName = startsDate
                              ? startsDate.toLocaleDateString("en-US", { weekday: "long" })
                              : "";

                            return (
                              <Card
                                key={recordId(sched)}
                                className={`border p-5 rounded-2xl flex flex-col justify-between transition-all ${
                                  isCancelled
                                    ? "border-rose-900/40 bg-rose-950/10 opacity-80"
                                    : "border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-md"
                                }`}
                              >
                                <div className="space-y-3">
                                  {/* Badges row */}
                                  <div className="flex items-start justify-between gap-1 flex-wrap">
                                    <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/20 text-[10px] truncate max-w-[180px]">
                                      {sched.hospital?.name || "Clinic"}
                                    </Badge>

                                    <div className="flex items-center gap-1">
                                      {isOverridden && (
                                        <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[9px]">
                                          Custom Override
                                        </Badge>
                                      )}
                                      <Badge
                                        className={
                                          isCancelled
                                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-bold"
                                            : sched.scheduleStatus === "completed"
                                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40 text-[10px] font-bold"
                                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px] font-bold"
                                        }
                                      >
                                        {sched.scheduleStatus || "scheduled"}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Title & Origin Pattern */}
                                  <div>
                                    <h3 className={`text-base font-bold leading-snug ${isCancelled ? "line-through text-slate-400" : "text-white"}`}>
                                      {sched.title}
                                    </h3>
                                    {sched.scheduleType && (
                                      <span className="text-[10px] text-teal-400 font-medium capitalize">
                                        Pattern: {sched.scheduleType.replace("_", " ")}
                                      </span>
                                    )}
                                  </div>

                                  {/* Date and Time info */}
                                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-teal-400" />
                                        <span className="font-bold text-slate-100">
                                          {formatSlotDateLong(sched.startsAt)}
                                        </span>
                                      </div>
                                      <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                                        {dayName}
                                      </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                                      <span className="font-semibold text-white">
                                        {formatSlotTimeRangeOnly(sched.startsAt, sched.endsAt)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between text-slate-400 pt-1">
                                      <span>Slot: {sched.slotDurationMinutes || 10}m &bull; Max: {sched.maxAppointments || 20}</span>
                                      <span className="text-emerald-400 font-bold">৳{sched.fee || 1000}</span>
                                    </div>
                                  </div>

                                  {/* Cancellation reason banner if cancelled */}
                                  {isCancelled && (
                                    <div className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-2.5 text-[11px] text-rose-300 space-y-0.5">
                                      <span className="font-bold block">🚫 Cancelled Day Override</span>
                                      <p>{sched.cancellationReason || "Session cancelled for this specific date."}</p>
                                    </div>
                                  )}

                                  {/* Reschedule notes */}
                                  {sched.rescheduleNotes && !isCancelled && (
                                    <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 p-2 text-[11px] text-amber-200">
                                      📝 {sched.rescheduleNotes}
                                    </div>
                                  )}
                                </div>

                                {/* Actions per Occurrence */}
                                <div className="mt-5 border-t border-slate-800/80 pt-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    {sched.slug ? (
                                      <Link
                                        href={`/schedules/${sched.slug}`}
                                        target="_blank"
                                        className="text-[11px] text-slate-400 hover:text-teal-300 flex items-center gap-1 font-mono transition-colors"
                                      >
                                        <span>/schedules/{sched.slug.slice(0, 16)}...</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </Link>
                                    ) : (
                                      <span className="text-[11px] text-slate-500 font-mono">
                                        /schedules/{recordId(sched).slice(0, 8)}...
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500">
                                      Booked: {sched.bookedSlots?.length || 0}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between gap-1.5 pt-1">
                                    {/* Cancel or Reactivate specific day */}
                                    {isCancelled ? (
                                      <Button
                                        onClick={() => handleReactivateScheduleOccurrence(sched)}
                                        size="sm"
                                        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg gap-1 font-semibold"
                                      >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Re-activate</span>
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => {
                                          setCancellingSchedule(sched);
                                          setIsCancelOccurrenceModalOpen(true);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-rose-900/50 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs rounded-lg gap-1"
                                      >
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <span>Cancel Day</span>
                                      </Button>
                                    )}

                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        onClick={() => {
                                          setReschedulingSchedule(sched);
                                          setIsRescheduleModalOpen(true);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-slate-700 bg-slate-800 text-slate-200 text-xs rounded-lg gap-1"
                                      >
                                        <CalendarClock className="h-3.5 w-3.5 text-amber-400" />
                                        <span>Reschedule</span>
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          handleDeleteRecord(
                                            "schedules",
                                            recordId(sched),
                                            sched.title || "Schedule"
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
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium">
                                Canonical Website URL
                              </label>
                              <Input
                                value={websiteSettings.siteUrl || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    siteUrl: e.target.value,
                                  })
                                }
                                className="border-slate-800 bg-slate-950 text-slate-200"
                                placeholder="e.g. https://drrashed.bd"
                              />
                            </div>
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

              {/* ================= 11. INTERACTIVE SEO SUITE & WEBMASTER CONTROL CENTER ================= */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  {/* Top Header & Save Action */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-6 w-6 text-teal-400" />
                        <h2 className="text-xl font-bold text-white">
                          SEO & Webmaster Suite
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Manage Google Search Console, Google Analytics (GA4/GTM), XML Sitemap, Robots.txt, and live search engine previews
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleSaveSeo}
                        disabled={saving}
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white rounded-xl text-xs gap-1.5 font-semibold px-4 py-2 shadow-lg shadow-teal-500/20"
                      >
                        <Check className="h-4 w-4" />
                        <span>{saving ? "Saving All Settings..." : "Save SEO Settings"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Sub-Navigation Tabs */}
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5">
                    <button
                      type="button"
                      onClick={() => setSeoSubTab("meta")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        seoSubTab === "meta"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Metadata & Social Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeoSubTab("gsc")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        seoSubTab === "gsc"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <SearchCheck className="h-3.5 w-3.5" />
                      <span>Google Search Console</span>
                      {websiteSettings.googleSearchConsoleVerification && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeoSubTab("analytics")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        seoSubTab === "analytics"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Google Analytics & GTM</span>
                      {websiteSettings.googleAnalyticsId && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeoSubTab("sitemap")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        seoSubTab === "sitemap"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>XML Sitemap.xml</span>
                      <Badge className="bg-teal-500/20 text-teal-300 border-none text-[9px] px-1.5 py-0">
                        Live
                      </Badge>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSeoSubTab("robots")}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                        seoSubTab === "robots"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>Robots.txt & Crawling</span>
                      <Badge
                        className={`text-[9px] px-1.5 py-0 border-none ${
                          websiteSettings.allowIndexing !== false
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {websiteSettings.allowIndexing !== false ? "Indexable" : "NoIndex"}
                      </Badge>
                    </button>
                  </div>

                  {/* ================= SUB-TAB 1: METADATA & SOCIAL CARDS ================= */}
                  {seoSubTab === "meta" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
                          <button
                            type="button"
                            onClick={() => setSeoScope("doctor")}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
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
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                              seoScope === "website"
                                ? "bg-teal-500 text-slate-950 shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Website Global SEO
                          </button>
                        </div>

                        <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-[10px]">
                          Editing {seoScope === "doctor" ? "Doctor Profile" : "Website Global"} Meta
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Interactive SEO Form */}
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="font-bold text-white text-base flex items-center gap-2">
                              <Edit className="h-4 w-4 text-teal-400" />
                              <span>
                                {seoScope === "doctor"
                                  ? "Doctor Profile Metadata"
                                  : "Website Global Metadata"}
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
                                  placeholder="https://drrashed.bd/..."
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
                                  Allow Google, Bing and other crawlers to index this page
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
                                  {websiteSettings.siteUrl ? websiteSettings.siteUrl.replace(/^https?:\/\//, "") : "drrashed.bd"}
                                </span>
                                <span>› appointment › specialist</span>
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
                                    "/placeholder.svg"
                                  }
                                  alt="Social preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-3.5 space-y-1 bg-slate-900/95 border-t border-slate-800">
                                <p className="text-[10px] uppercase font-bold text-slate-400">
                                  {websiteSettings.siteName || "DRRASHED.BD"}
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

                  {/* ================= SUB-TAB 2: GOOGLE SEARCH CONSOLE & WEBMASTERS ================= */}
                  {seoSubTab === "gsc" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Google Search Console Setup Card */}
                      <div className="lg:col-span-7 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-5">
                          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <SearchCheck className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base">
                                  Google Search Console Verification
                                </h3>
                                <p className="text-xs text-slate-400">
                                  Verify domain ownership to track impressions, clicks, keywords & indexing
                                </p>
                              </div>
                            </div>

                            <Badge
                              className={
                                websiteSettings.googleSearchConsoleVerification
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs"
                                  : "bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs"
                              }
                            >
                              {websiteSettings.googleSearchConsoleVerification
                                ? "Verification Tag Active"
                                : "Not Configured"}
                            </Badge>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                                  <span>Google Verification Meta Code / Tag</span>
                                </label>
                                {websiteSettings.googleSearchConsoleVerification && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const tag = `<meta name="google-site-verification" content="${websiteSettings.googleSearchConsoleVerification}" />`;
                                      navigator.clipboard.writeText(tag);
                                      setCopiedKey("gsc");
                                      setTimeout(() => setCopiedKey(null), 2000);
                                    }}
                                    className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
                                  >
                                    <Copy className="h-3 w-3" />
                                    <span>{copiedKey === "gsc" ? "Copied Tag!" : "Copy HTML Tag"}</span>
                                  </button>
                                )}
                              </div>
                              <Input
                                value={websiteSettings.googleSearchConsoleVerification || ""}
                                onChange={(e) => {
                                  // Clean input if full tag pasted
                                  let val = e.target.value.trim();
                                  const contentMatch = val.match(/content=["']([^"']+)["']/);
                                  if (contentMatch) {
                                    val = contentMatch[1];
                                  }
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    googleSearchConsoleVerification: val,
                                  });
                                }}
                                placeholder="e.g. dB8uK19X... or paste entire <meta name='google-site-verification' content='...' />"
                                className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs"
                              />
                              <p className="text-[11px] text-slate-500 mt-1.5">
                                Enter your Google HTML verification content code. Next.js will automatically inject the verification tag into the HTML <code className="text-teal-400">&lt;head&gt;</code>.
                              </p>
                            </div>

                            {/* Live Verification Snippet Preview */}
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 font-mono text-[11px]">
                              <p className="text-slate-500 font-sans font-semibold text-[10px] uppercase">
                                Generated HTML Output:
                              </p>
                              <div className="text-slate-300 overflow-x-auto whitespace-pre">
                                {websiteSettings.googleSearchConsoleVerification ? (
                                  <span className="text-emerald-400">{`<meta name="google-site-verification" content="${websiteSettings.googleSearchConsoleVerification}" />`}</span>
                                ) : (
                                  <span className="text-slate-600">&lt;!-- Google site verification tag will appear here --&gt;</span>
                                )}
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-3">
                              <a
                                href="https://search.google.com/search-console"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-semibold transition-colors"
                              >
                                <span>Open Google Search Console</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>

                              <a
                                href="https://search.google.com/search-console/inspect"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-3.5 py-2 text-xs font-medium transition-colors"
                              >
                                <span>URL Inspection Tool</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        </Card>

                        {/* Other Webmaster Tools */}
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-purple-400" />
                            <h3 className="font-bold text-white text-sm">
                              Other Search Engine & Domain Verification
                            </h3>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                  Bing Webmaster Tools (msvalidate.01)
                                </label>
                                <Input
                                  value={websiteSettings.bingVerification || ""}
                                  onChange={(e) =>
                                    setWebsiteSettings({
                                      ...websiteSettings,
                                      bingVerification: e.target.value.trim(),
                                    })
                                  }
                                  placeholder="e.g. 7E2B4B8A91C2..."
                                  className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                  Facebook Domain Verification
                                </label>
                                <Input
                                  value={websiteSettings.facebookDomainVerification || ""}
                                  onChange={(e) =>
                                    setWebsiteSettings({
                                      ...websiteSettings,
                                      facebookDomainVerification: e.target.value.trim(),
                                    })
                                  }
                                  placeholder="e.g. abcdef123456..."
                                  className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-slate-300 font-medium mb-1">
                                Yandex Webmaster Verification
                              </label>
                              <Input
                                value={websiteSettings.yandexVerification || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    yandexVerification: e.target.value.trim(),
                                  })
                                }
                                placeholder="e.g. yandex-verification code"
                                className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs"
                              />
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Right: How to Verify Guide & Checklist */}
                      <div className="lg:col-span-5 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Info className="h-4 w-4 text-teal-400" />
                            <span>Step-by-Step Google Verification</span>
                          </h4>

                          <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                            <li className="pl-1">
                              Visit <strong className="text-white">Google Search Console</strong> and click <strong className="text-teal-400">+ Add Property</strong>.
                            </li>
                            <li className="pl-1">
                              Enter your domain URL (e.g. <code className="text-teal-300 font-mono bg-slate-950 px-1 py-0.5 rounded">{websiteSettings.siteUrl || "https://drrashed.bd"}</code>).
                            </li>
                            <li className="pl-1">
                              Under <em>Other verification methods</em>, choose <strong className="text-white">HTML Tag</strong>.
                            </li>
                            <li className="pl-1">
                              Copy the string inside <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">content="..."</code> and paste it in the field on the left.
                            </li>
                            <li className="pl-1">
                              Click <strong className="text-emerald-400">Save SEO Settings</strong> above.
                            </li>
                            <li className="pl-1">
                              Return to Google Search Console and click <strong className="text-white">Verify</strong>!
                            </li>
                          </ol>

                          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-3 text-xs text-teal-300/90 space-y-1">
                            <p className="font-semibold text-teal-200 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-teal-400" />
                              <span>Instant Verification Live</span>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Once saved, our server-side metadata generator immediately outputs the verification header for Google bots without needing code redeployment.
                            </p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* ================= SUB-TAB 3: GOOGLE ANALYTICS & GTM ================= */}
                  {seoSubTab === "analytics" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Google Analytics 4 & GTM */}
                      <div className="lg:col-span-7 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-5">
                          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <BarChart3 className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base">
                                  Google Analytics 4 (GA4) Integration
                                </h3>
                                <p className="text-xs text-slate-400">
                                  Real-time traffic analytics, patient visits, conversions & booking tracking
                                </p>
                              </div>
                            </div>

                            <Badge
                              className={
                                websiteSettings.googleAnalyticsId && websiteSettings.googleAnalyticsId.startsWith("G-")
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs"
                                  : "bg-slate-800 text-slate-400 text-xs"
                              }
                            >
                              {websiteSettings.googleAnalyticsId && websiteSettings.googleAnalyticsId.startsWith("G-") ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>GA4 Active</span>
                                </span>
                              ) : (
                                "Disabled"
                              )}
                            </Badge>
                          </div>

                          <div className="space-y-4 text-xs">
                            <div>
                              <label className="block text-slate-300 font-medium mb-1.5">
                                GA4 Measurement ID (Stream ID)
                              </label>
                              <Input
                                value={websiteSettings.googleAnalyticsId || ""}
                                onChange={(e) =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    googleAnalyticsId: e.target.value.trim().toUpperCase(),
                                  })
                                }
                                placeholder="G-XXXXXXXXXX"
                                className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs tracking-wider"
                              />
                              <p className="text-[11px] text-slate-500 mt-1.5">
                                Found in Google Analytics &gt; Admin &gt; Data Streams &gt; Measurement ID (starts with <code className="text-teal-400">G-</code>).
                              </p>
                            </div>

                            <div className="border-t border-slate-800/80 pt-4 space-y-4">
                              <div className="flex items-center gap-2 text-white font-semibold">
                                <Layers className="h-4 w-4 text-blue-400" />
                                <span>Google Tag Manager (Optional)</span>
                              </div>

                              <div>
                                <label className="block text-slate-300 font-medium mb-1.5">
                                  GTM Container ID
                                </label>
                                <Input
                                  value={websiteSettings.googleTagManagerId || ""}
                                  onChange={(e) =>
                                    setWebsiteSettings({
                                      ...websiteSettings,
                                      googleTagManagerId: e.target.value.trim().toUpperCase(),
                                    })
                                  }
                                  placeholder="GTM-XXXXXXX"
                                  className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs tracking-wider"
                                />
                                <p className="text-[11px] text-slate-500 mt-1.5">
                                  Loads custom tracking tags, Facebook Pixels, or conversion events through Google Tag Manager.
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-3">
                              <a
                                href="https://analytics.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-semibold transition-colors"
                              >
                                <span>Open Google Analytics</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>
                              <a
                                href="https://tagmanager.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-3.5 py-2 text-xs font-medium transition-colors"
                              >
                                <span>Open Tag Manager</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        </Card>

                        {/* Custom Head Tracking Script */}
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-cyan-400" />
                              <h3 className="font-bold text-white text-sm">
                                Custom Head Script Snippet (Advanced)
                              </h3>
                            </div>
                            <Badge className="bg-slate-800 text-slate-400 text-[10px]">
                              Header Injector
                            </Badge>
                          </div>

                          <div className="space-y-2 text-xs">
                            <label className="block text-slate-300 font-medium">
                              Custom Tracking Code / Pixel Scripts
                            </label>
                            <textarea
                              rows={4}
                              value={websiteSettings.customHeadScript || ""}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  customHeadScript: e.target.value,
                                })
                              }
                              placeholder="<!-- Paste custom Microsoft Clarity, Meta Pixel or Hotjar scripts here -->"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                            />
                            <p className="text-[11px] text-slate-500">
                              Injected securely inside the document <code className="text-teal-400">&lt;head&gt;</code> tag on every page.
                            </p>
                          </div>
                        </Card>
                      </div>

                      {/* Right: GA4 Performance Architecture Guide */}
                      <div className="lg:col-span-5 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                            <Activity className="h-4 w-4 text-emerald-400" />
                            <span>High-Performance Analytics Architecture</span>
                          </h4>

                          <div className="space-y-3 text-xs text-slate-300">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                              <p className="font-semibold text-white">⚡ Zero Blocking Next.js Scripts</p>
                              <p className="text-slate-400 text-[11px]">
                                Analytics scripts load with <code className="text-teal-300">afterInteractive</code> strategy, preserving 100/100 Core Web Vitals and lightning-fast page loading speeds.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                              <p className="font-semibold text-white">📈 Automatic Page Views</p>
                              <p className="text-slate-400 text-[11px]">
                                SPA navigation events are recorded with real-time pathname sync for patient appointments and schedule booking flows.
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                              <p className="font-semibold text-white">🔒 Privacy & Compliance</p>
                              <p className="text-slate-400 text-[11px]">
                                Tracking runs client-side without storing patient medical records or PHI in analytics payloads.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* ================= SUB-TAB 4: XML SITEMAP MANAGER ================= */}
                  {seoSubTab === "sitemap" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Sitemap Controller & Quick Copy */}
                      <div className="lg:col-span-7 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-5">
                          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                <Layers className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base">
                                  Dynamic XML Sitemap (sitemap.xml)
                                </h3>
                                <p className="text-xs text-slate-400">
                                  Auto-generated sitemap including home, appointments, doctor chamber schedules & articles
                                </p>
                              </div>
                            </div>

                            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs">
                              Auto-Synced
                            </Badge>
                          </div>

                          <div className="space-y-4 text-xs">
                            {/* Sitemap Enable Switch */}
                            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                              <div>
                                <p className="font-semibold text-white">
                                  Enable XML Sitemap Generation
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Serves dynamic <code className="text-teal-400 font-mono">/sitemap.xml</code> for search engines
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    sitemapEnabled: websiteSettings.sitemapEnabled === false ? true : false,
                                  })
                                }
                                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                                  websiteSettings.sitemapEnabled !== false ? "bg-teal-500" : "bg-slate-800"
                                }`}
                              >
                                <span
                                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                                    websiteSettings.sitemapEnabled !== false
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Sitemap URL Field */}
                            <div>
                              <label className="block text-slate-300 font-medium mb-1.5">
                                Live Sitemap URL (For Google Search Console)
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  readOnly
                                  value={`${(websiteSettings.siteUrl || "https://drrashed.bd").replace(/\/+$/, "")}/sitemap.xml`}
                                  className="border-slate-800 bg-slate-950 text-teal-300 font-mono text-xs cursor-pointer select-all"
                                  onClick={(e) => (e.target as HTMLInputElement).select()}
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const sitemapUrl = `${(websiteSettings.siteUrl || "https://drrashed.bd").replace(/\/+$/, "")}/sitemap.xml`;
                                    navigator.clipboard.writeText(sitemapUrl);
                                    setCopiedKey("sitemap");
                                    setTimeout(() => setCopiedKey(null), 2000);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs gap-1 px-3.5 shrink-0"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>{copiedKey === "sitemap" ? "Copied!" : "Copy"}</span>
                                </Button>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-3">
                              <a
                                href="/sitemap.xml"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-2 text-xs font-semibold transition-colors"
                              >
                                <span>Inspect Live /sitemap.xml</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>

                              <a
                                href="https://search.google.com/search-console/sitemaps"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 text-xs font-medium transition-colors"
                              >
                                <span>Submit Sitemap to Google</span>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Right: Dynamic Included Routes Breakdown */}
                      <div className="lg:col-span-5 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <FileText className="h-4 w-4 text-cyan-400" />
                              <span>Dynamic Sitemap Structure</span>
                            </h4>
                            <Badge className="bg-slate-800 text-slate-300 text-[10px]">
                              Priority & Frequency
                            </Badge>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            {/* Route 1: Home */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div>
                                <p className="font-mono font-semibold text-white text-xs">/</p>
                                <p className="text-[10px] text-slate-400">Doctor Portfolio Homepage</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-emerald-500/15 text-emerald-300 border-none text-[9px]">
                                  Priority 1.0
                                </Badge>
                                <p className="text-[9px] text-slate-500 mt-0.5">Daily</p>
                              </div>
                            </div>

                            {/* Route 2: Appointments */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div>
                                <p className="font-mono font-semibold text-white text-xs">/appointments</p>
                                <p className="text-[10px] text-slate-400">Hospital Chambers & Booking</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-teal-500/15 text-teal-300 border-none text-[9px]">
                                  Priority 0.9
                                </Badge>
                                <p className="text-[9px] text-slate-500 mt-0.5">Daily</p>
                              </div>
                            </div>

                            {/* Route 3: Schedules */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div>
                                <p className="font-mono font-semibold text-white text-xs">/schedules/[slug]</p>
                                <p className="text-[10px] text-slate-400">All Active Consultation Schedules ({schedules.length})</p>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-blue-500/15 text-blue-300 border-none text-[9px]">
                                  Priority 0.8
                                </Badge>
                                <p className="text-[9px] text-slate-500 mt-0.5">Weekly</p>
                              </div>
                            </div>

                            {/* Route 4: Health Articles */}
                            {blogPosts.length > 0 && (
                              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                <div>
                                  <p className="font-mono font-semibold text-white text-xs">/blog/[slug]</p>
                                  <p className="text-[10px] text-slate-400">Published Health Articles ({blogPosts.length})</p>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-purple-500/15 text-purple-300 border-none text-[9px]">
                                    Priority 0.7
                                  </Badge>
                                  <p className="text-[9px] text-slate-500 mt-0.5">Weekly</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* ================= SUB-TAB 5: ROBOTS.TXT & INDEXING ================= */}
                  {seoSubTab === "robots" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Crawling Controls & Disallowed Paths */}
                      <div className="lg:col-span-7 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-5">
                          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                <Bot className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-base">
                                  Robots.txt & Search Engine Directives
                                </h3>
                                <p className="text-xs text-slate-400">
                                  Control Googlebot, Bingbot, and web crawlers access to paths and directories
                                </p>
                              </div>
                            </div>

                            <Badge
                              className={
                                websiteSettings.allowIndexing !== false
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs"
                                  : "bg-rose-500/15 text-rose-300 border-rose-500/30 text-xs"
                              }
                            >
                              {websiteSettings.allowIndexing !== false ? "Allow Index" : "Disallow All"}
                            </Badge>
                          </div>

                          <div className="space-y-4 text-xs">
                            {/* Master Crawling Policy */}
                            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                              <div>
                                <p className="font-semibold text-white">
                                  Allow Search Engines to Index Website
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  When disabled, crawlers will receive <code className="text-rose-400 font-mono">Disallow: /</code> and meta robots <code className="text-rose-400 font-mono">noindex</code>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setWebsiteSettings({
                                    ...websiteSettings,
                                    allowIndexing: websiteSettings.allowIndexing === false ? true : false,
                                  })
                                }
                                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                                  websiteSettings.allowIndexing !== false ? "bg-teal-500" : "bg-slate-800"
                                }`}
                              >
                                <span
                                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                                    websiteSettings.allowIndexing !== false
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Disallowed Paths Tag Manager */}
                            <div className="space-y-2.5">
                              <label className="block text-slate-300 font-medium">
                                Blocked / Disallowed Paths (Hidden from Search Engines)
                              </label>

                              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950 min-h-[48px] items-center">
                                {(websiteSettings.disallowedPaths || ["/admin", "/api"]).map(
                                  (path: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-mono text-slate-200"
                                    >
                                      <span>Disallow: {path}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const current = websiteSettings.disallowedPaths || ["/admin", "/api"];
                                          const updated = current.filter((_: any, i: number) => i !== idx);
                                          setWebsiteSettings({
                                            ...websiteSettings,
                                            disallowedPaths: updated,
                                          });
                                        }}
                                        className="text-slate-400 hover:text-rose-400 transition-colors"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  )
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Input
                                  value={newDisallowPath}
                                  onChange={(e) => setNewDisallowPath(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && newDisallowPath.trim()) {
                                      e.preventDefault();
                                      const path = newDisallowPath.trim().startsWith("/")
                                        ? newDisallowPath.trim()
                                        : `/${newDisallowPath.trim()}`;
                                      const current = websiteSettings.disallowedPaths || ["/admin", "/api"];
                                      if (!current.includes(path)) {
                                        setWebsiteSettings({
                                          ...websiteSettings,
                                          disallowedPaths: [...current, path],
                                        });
                                      }
                                      setNewDisallowPath("");
                                    }
                                  }}
                                  placeholder="e.g. /patient or /private-folder"
                                  className="border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs"
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    if (newDisallowPath.trim()) {
                                      const path = newDisallowPath.trim().startsWith("/")
                                        ? newDisallowPath.trim()
                                        : `/${newDisallowPath.trim()}`;
                                      const current = websiteSettings.disallowedPaths || ["/admin", "/api"];
                                      if (!current.includes(path)) {
                                        setWebsiteSettings({
                                          ...websiteSettings,
                                          disallowedPaths: [...current, path],
                                        });
                                      }
                                      setNewDisallowPath("");
                                    }
                                  }}
                                  className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs px-4 shrink-0 font-semibold"
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  <span>Add Path</span>
                                </Button>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap gap-3">
                              <a
                                href="/robots.txt"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3.5 py-2 text-xs font-semibold transition-colors"
                              >
                                <span>Inspect Live /robots.txt</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Right: Live Generated robots.txt Preview */}
                      <div className="lg:col-span-5 space-y-6">
                        <Card className="border-slate-800 bg-slate-900/80 p-6 rounded-2xl space-y-4">
                          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-emerald-400" />
                              <span>Live Generated robots.txt Preview</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                const siteUrl = (websiteSettings.siteUrl || "https://drrashed.bd").replace(/\/+$/, "");
                                const isAllowed = websiteSettings.allowIndexing !== false;
                                const disallowed = websiteSettings.disallowedPaths || ["/admin", "/api"];
                                const text = isAllowed
                                  ? `User-agent: *\nAllow: /\n${disallowed.map((p: string) => `Disallow: ${p}`).join("\n")}\n\nSitemap: ${siteUrl}/sitemap.xml`
                                  : `User-agent: *\nDisallow: /\n\nSitemap: ${siteUrl}/sitemap.xml`;
                                navigator.clipboard.writeText(text);
                                setCopiedKey("robots");
                                setTimeout(() => setCopiedKey(null), 2000);
                              }}
                              className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              <span>{copiedKey === "robots" ? "Copied!" : "Copy"}</span>
                            </button>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
                            <p className="text-slate-500"># Generated dynamically by Next.js SEO engine</p>
                            <p className="text-purple-400 font-bold">User-agent: *</p>
                            {websiteSettings.allowIndexing !== false ? (
                              <>
                                <p className="text-emerald-400">Allow: /</p>
                                {(websiteSettings.disallowedPaths || ["/admin", "/api"]).map(
                                  (p: string, i: number) => (
                                    <p key={i} className="text-amber-400">
                                      Disallow: {p}
                                    </p>
                                  )
                                )}
                              </>
                            ) : (
                              <p className="text-rose-400 font-bold">Disallow: /</p>
                            )}
                            {websiteSettings.sitemapEnabled !== false && (
                              <p className="text-cyan-400 pt-2">
                                Sitemap: {(websiteSettings.siteUrl || "https://drrashed.bd").replace(/\/+$/, "")}/sitemap.xml
                              </p>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 leading-relaxed">
                            Crawlers such as Googlebot, Bingbot, and DuckDuckBot read these directives before indexing. Sensitive administrative and API paths are automatically shielded.
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
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

      {/* 1.5. Recurring Chamber Schedule Rule Modal */}
      <ScheduleRuleModalDialog
        isOpen={isScheduleRuleModalOpen}
        onClose={() => {
          setIsScheduleRuleModalOpen(false);
          setEditingScheduleRule(null);
        }}
        editingRule={editingScheduleRule}
        hospitals={hospitals}
        onSaved={loadAllData}
        triggerToast={triggerToast}
      />

      {/* 1.6. Reschedule / Override Single Day Occurrence Modal */}
      <RescheduleOccurrenceModalDialog
        isOpen={Boolean(reschedulingSchedule)}
        onClose={() => setReschedulingSchedule(null)}
        schedule={reschedulingSchedule}
        onSaved={loadAllData}
        triggerToast={triggerToast}
      />

      {/* 1.7. Cancel Single Day Occurrence Modal */}
      <CancelOccurrenceModalDialog
        isOpen={Boolean(cancellingSchedule)}
        onClose={() => setCancellingSchedule(null)}
        schedule={cancellingSchedule}
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
