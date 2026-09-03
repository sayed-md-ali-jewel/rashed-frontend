"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Clock3,
  Copy,
  DollarSign,
  Edit,
  Edit2,
  ExternalLink,
  Filter,
  Hash,
  Hospital,
  Info,
  Layers,
  LayoutGrid,
  Loader2,
  MapPin,
  MapPinned,
  Menu,
  MessageSquare,
  Phone,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SweetAlertModal, type SweetAlertConfig } from "@/components/ui/sweet-alert";
import {
  formatCurrency,
  formatDateTime,
  formatSlotRange12,
  formatTime12
} from "@/lib/utils";

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

function formatDisplayDatePreview(value?: string) {
  if (!value) return "Select date & time";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return value;
  }
}

function formatSlotTimeRangeOnly(startStr?: string, endStr?: string) {
  if (!startStr) return "-";
  const start = new Date(startStr);
  if (isNaN(start.getTime())) return "-";

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  if (!endStr) return startTime;
  const end = new Date(endStr);
  if (isNaN(end.getTime())) return startTime;

  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
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

type AdminTab = "hospitals" | "schedules" | "patients" | "appointments";

type HospitalRecord = {
  _id?: string;
  id?: string;
  documentId?: string;
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
  imageUrl?: string;
  active?: boolean;
  createdAt?: string;
};

type ScheduleRecord = {
  _id?: string;
  id?: string;
  documentId?: string;
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
  documentId?: string;
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
  documentId?: string;
  patientName?: string;
  mobileNumber?: string;
  address?: string;
  schedule?: any;
  scheduleId?: string;
  hospitalName?: string;
  slotStart?: string;
  slotEnd?: string;
  queueNumber?: number;
  appointmentStatus?: "pending" | "approved" | "cancelled";
  status?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "unpaid";
  paymentAmount?: number;
  reason?: string;
  notes?: string;
  patientMessage?: string;
  createdAt?: string;
};

type AdminData = {
  hospitals: HospitalRecord[];
  schedules: ScheduleRecord[];
  patients: PatientRecord[];
  appointments: AppointmentRecord[];
};

function recordId(record?: { _id?: string; id?: string; documentId?: string } | null | any): string {
  if (!record || typeof record !== "object") return "";
  return String(record.documentId ?? record._id ?? record.id ?? "");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveAppointmentSlotInterval(
  appointment: AppointmentRecord,
  schedules: ScheduleRecord[]
): { timeRange: string; dateFormatted: string; durationMins: number } {
  const schedId = String(
    appointment.scheduleId ||
    (appointment.schedule && typeof appointment.schedule === "object"
      ? recordId(appointment.schedule) || appointment.schedule.id || appointment.schedule.documentId
      : appointment.schedule || "")
  );
  const matchedSchedule = schedules.find(
    (s) => recordId(s) === schedId || String(s.id) === schedId || s.slug === schedId
  );

  const durationMinutes = Number(matchedSchedule?.slotDurationMinutes) || 15;
  const durationMs = durationMinutes * 60 * 1000;

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (appointment.slotStart) {
    const d = new Date(appointment.slotStart);
    if (!isNaN(d.getTime())) startDate = d;
  }

  if (appointment.slotEnd) {
    const d = new Date(appointment.slotEnd);
    if (!isNaN(d.getTime())) endDate = d;
  }

  if (!startDate && matchedSchedule?.startsAt) {
    const schedStart = new Date(matchedSchedule.startsAt);
    if (!isNaN(schedStart.getTime())) {
      const qNum = Math.max(1, appointment.queueNumber || 1);
      startDate = new Date(schedStart.getTime() + (qNum - 1) * durationMs);
    }
  }

  if (startDate && (!endDate || endDate.getTime() <= startDate.getTime())) {
    endDate = new Date(startDate.getTime() + durationMs);
  }

  if (!startDate) {
    return {
      timeRange: "Not scheduled",
      dateFormatted: "",
      durationMins: durationMinutes
    };
  }

  const startTimeStr = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  const endTimeStr = endDate
    ? endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      })
    : "";

  const timeRange = endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr;

  const day = startDate.getDate();
  const month = startDate.toLocaleDateString("en-US", { month: "long" });
  const year = startDate.getFullYear();
  const dateFormatted = `${day} ${month}, ${year}`;

  return {
    timeRange,
    dateFormatted,
    durationMins: durationMinutes
  };
}

function KpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-3xl p-5 bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-20 rounded-md bg-slate-200"></div>
            <div className="size-9 rounded-2xl bg-slate-100"></div>
          </div>
          <div className="h-8 w-16 rounded-xl bg-slate-200"></div>
          <div className="h-3 w-28 rounded-md bg-slate-100"></div>
        </div>
      ))}
    </div>
  );
}

function AdminPanelSkeleton({ activeTab }: { activeTab: AdminTab }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-[10px] border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="h-11 flex-1 min-w-[220px] rounded-2xl bg-slate-100"></div>
          <div className="h-11 w-56 rounded-2xl bg-slate-100"></div>
          <div className="h-11 w-48 rounded-2xl bg-slate-100"></div>
        </div>
        <div className="h-11 w-36 rounded-2xl bg-slate-200 shrink-0"></div>
      </div>

      {/* Main Tab Content Skeleton */}
      {activeTab === "appointments" ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-[10px] border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              {/* Card Header Skeleton */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[10px] bg-slate-200"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-40 rounded-md bg-slate-200"></div>
                    <div className="h-3 w-56 rounded-md bg-slate-100"></div>
                  </div>
                </div>
                <div className="h-6 w-24 rounded-full bg-slate-200"></div>
              </div>

              {/* Table Rows Skeleton */}
              <div className="divide-y divide-slate-100 p-2">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex items-center justify-between px-5 py-4 gap-4">
                    <div className="h-7 w-16 rounded-xl bg-slate-100"></div>
                    <div className="flex items-center gap-3 flex-1 max-w-xs">
                      <div className="size-9 rounded-xl bg-slate-100 shrink-0"></div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-24 rounded-md bg-slate-200"></div>
                        <div className="h-2.5 w-28 rounded-md bg-slate-100"></div>
                      </div>
                    </div>
                    <div className="space-y-1.5 w-40">
                      <div className="h-3.5 w-32 rounded-md bg-slate-200"></div>
                      <div className="h-2.5 w-24 rounded-md bg-slate-100"></div>
                    </div>
                    <div className="h-6 w-20 rounded-full bg-slate-100"></div>
                    <div className="h-6 w-16 rounded-lg bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-xl bg-slate-100"></div>
                      <div className="size-9 rounded-xl bg-slate-100"></div>
                      <div className="size-9 rounded-xl bg-slate-100"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "hospitals" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
              <div className="h-36 w-full rounded-2xl bg-slate-100"></div>
              <div className="space-y-2">
                <div className="h-5 w-48 rounded-md bg-slate-200"></div>
                <div className="h-3.5 w-64 rounded-md bg-slate-100"></div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="h-6 w-24 rounded-full bg-slate-100"></div>
                <div className="flex gap-2">
                  <div className="size-9 rounded-xl bg-slate-100"></div>
                  <div className="size-9 rounded-xl bg-slate-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "schedules" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 rounded-md bg-slate-200"></div>
                <div className="h-6 w-20 rounded-full bg-slate-100"></div>
              </div>
              <div className="h-5 w-44 rounded-md bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded-md bg-slate-100"></div>
                <div className="h-3.5 w-3/4 rounded-md bg-slate-100"></div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="h-6 w-20 rounded-lg bg-slate-100"></div>
                <div className="flex gap-2">
                  <div className="size-9 rounded-xl bg-slate-100"></div>
                  <div className="size-9 rounded-xl bg-slate-100"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
          <div className="h-10 w-full rounded-2xl bg-slate-100"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-slate-50"></div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("hospitals");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [swal, setSwal] = useState<SweetAlertConfig>({
    isOpen: false,
    title: ""
  });

  const [data, setData] = useState<AdminData>({
    hospitals: [],
    schedules: [],
    patients: [],
    appointments: []
  });

  // Filters & Search
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [hospitalStatusFilter, setHospitalStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleHospitalFilter, setScheduleHospitalFilter] = useState("all");
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<"all" | "upcoming" | "past" | "cancelled">("all");

  const [patientSearch, setPatientSearch] = useState("");

  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [appointmentHospitalFilter, setAppointmentHospitalFilter] = useState("all");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<"all" | "pending" | "approved" | "cancelled">("all");

  const [isHospitalFilterOpen, setIsHospitalFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isScheduleHospitalFilterOpen, setIsScheduleHospitalFilterOpen] = useState(false);
  const [isModalHospitalOpen, setIsModalHospitalOpen] = useState(false);
  const [isModalScheduleOpen, setIsModalScheduleOpen] = useState(false);

  const hospitalFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const scheduleHospitalFilterRef = useRef<HTMLDivElement>(null);
  const modalHospitalRef = useRef<HTMLDivElement>(null);
  const modalScheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (hospitalFilterRef.current && !hospitalFilterRef.current.contains(target)) {
        setIsHospitalFilterOpen(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(target)) {
        setIsStatusFilterOpen(false);
      }
      if (scheduleHospitalFilterRef.current && !scheduleHospitalFilterRef.current.contains(target)) {
        setIsScheduleHospitalFilterOpen(false);
      }
      if (modalHospitalRef.current && !modalHospitalRef.current.contains(target)) {
        setIsModalHospitalOpen(false);
      }
      if (modalScheduleRef.current && !modalScheduleRef.current.contains(target)) {
        setIsModalScheduleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modals
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<HospitalRecord | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRecord | null>(null);
  const [scheduleHospitalId, setScheduleHospitalId] = useState("");
  const [scheduleStartsAt, setScheduleStartsAt] = useState("");
  const [scheduleEndsAt, setScheduleEndsAt] = useState("");
  const [scheduleSlotDuration, setScheduleSlotDuration] = useState(15);
  const [scheduleMaxAppointments, setScheduleMaxAppointments] = useState(20);
  const [scheduleFee, setScheduleFee] = useState(1000);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState<"scheduled" | "completed" | "cancelled">("scheduled");

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentRecord | null>(null);
  const [appointmentPatientName, setAppointmentPatientName] = useState("");
  const [appointmentMobile, setAppointmentMobile] = useState("");
  const [appointmentAddress, setAppointmentAddress] = useState("");
  const [appointmentScheduleId, setAppointmentScheduleId] = useState("");
  const [appointmentSlotStart, setAppointmentSlotStart] = useState("");
  const [appointmentSlotEnd, setAppointmentSlotEnd] = useState("");
  const [appointmentQueue, setAppointmentQueue] = useState(1);
  const [appointmentStatusVal, setAppointmentStatusVal] = useState<"pending" | "approved" | "cancelled">("pending");
  const [appointmentPaymentStatusVal, setAppointmentPaymentStatusVal] = useState<"pending" | "paid" | "failed">("pending");
  const [appointmentReason, setAppointmentReason] = useState("");

  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<PatientRecord | null>(null);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState("");

  // Load all collections
  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [hospitalsRes, schedulesRes, patientsRes, appointmentsRes] = await Promise.all([
        fetch("/api/admin/hospitals", { cache: "no-store" }),
        fetch("/api/admin/schedules", { cache: "no-store" }),
        fetch("/api/admin/patients", { cache: "no-store" }),
        fetch("/api/admin/appointments", { cache: "no-store" })
      ]);

      const hospitalsJson = await hospitalsRes.json().catch(() => ({ data: [] }));
      const schedulesJson = await schedulesRes.json().catch(() => ({ data: [] }));
      const patientsJson = await patientsRes.json().catch(() => ({ data: [] }));
      const appointmentsJson = await appointmentsRes.json().catch(() => ({ data: [] }));

      setData({
        hospitals: Array.isArray(hospitalsJson.data) ? hospitalsJson.data : [],
        schedules: Array.isArray(schedulesJson.data) ? schedulesJson.data : [],
        patients: Array.isArray(patientsJson.data) ? patientsJson.data : [],
        appointments: Array.isArray(appointmentsJson.data) ? appointmentsJson.data : []
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load data from server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalHospitals = data.hospitals.length;
    const activeHospitals = data.hospitals.filter((h) => h.active !== false).length;

    const now = Date.now();
    const upcomingSchedules = data.schedules.filter((s) => {
      const end = s.endsAt ? new Date(s.endsAt).getTime() : 0;
      return end >= now && s.scheduleStatus !== "cancelled";
    }).length;

    const totalPatients = data.patients.length;

    const pendingAppointments = data.appointments.filter(
      (a) => (a.appointmentStatus || a.status || "pending") === "pending"
    ).length;

    const approvedAppointments = data.appointments.filter(
      (a) => (a.appointmentStatus || a.status) === "approved"
    ).length;

    return {
      totalHospitals,
      activeHospitals,
      upcomingSchedules,
      totalSchedules: data.schedules.length,
      totalPatients,
      pendingAppointments,
      approvedAppointments,
      totalAppointments: data.appointments.length
    };
  }, [data]);

  // Helper to resolve hospital name for an appointment or schedule
  function resolveHospitalName(hospital: any, hospitalId?: string): string {
    if (hospital && typeof hospital === "object" && hospital.name) {
      return String(hospital.name);
    }
    const id = String(hospitalId || (typeof hospital === "string" ? hospital : (hospital && typeof hospital === "object" ? recordId(hospital) : "")));
    const found = data.hospitals.find((h) => recordId(h) === id);
    return found?.name || "General Chamber";
  }

  function getAppointmentHospital(appointment: AppointmentRecord): { name: string; address: string } {
    const scheduleId = String(
      appointment.scheduleId ||
      (appointment.schedule && typeof appointment.schedule === "object"
        ? recordId(appointment.schedule)
        : appointment.schedule || "")
    );
    const schedule = data.schedules.find(
      (s) => recordId(s) === scheduleId || (scheduleId && s.slug === scheduleId)
    );

    if (schedule) {
      if (schedule.hospital && typeof schedule.hospital === "object") {
        return {
          name: schedule.hospital.name || schedule.title || "Clinic Chamber",
          address: schedule.hospital.address || ""
        };
      }
      const hosp = data.hospitals.find(
        (h) =>
          recordId(h) ===
          String(
            schedule.hospitalId ||
              (typeof schedule.hospital === "string"
                ? schedule.hospital
                : schedule.hospital && typeof schedule.hospital === "object"
                ? recordId(schedule.hospital)
                : "")
          )
      );
      if (hosp) {
        return { name: hosp.name || "Clinic Chamber", address: hosp.address || "" };
      }
      if (schedule.title) {
        return { name: schedule.title, address: "" };
      }
    }

    return {
      name: appointment.hospitalName || "General Consultation",
      address: ""
    };
  }

  // Hospital Actions
  async function handleSaveHospital(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const id = editingHospital ? recordId(editingHospital) : "";

    const embeddedMapUrl = String(formData.get("embeddedMapUrl") || "").trim();
    const googleMapsUrl = String(formData.get("googleMapsUrl") || "").trim();
    const mapUrl = embeddedMapUrl || googleMapsUrl || "";
    const image = String(formData.get("image") || "").trim();

    const payload: Record<string, any> = {
      name: String(formData.get("name") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      consultationFee: Number(formData.get("consultationFee") || 0),
      googleMapsUrl,
      embeddedMapUrl,
      mapUrl,
      image,
      imageUrl: image,
      active: formData.get("active") === "true"
    };

    const latStr = formData.get("latitude");
    const lngStr = formData.get("longitude");
    if (latStr && !isNaN(Number(latStr))) payload.latitude = Number(latStr);
    if (lngStr && !isNaN(Number(lngStr))) payload.longitude = Number(lngStr);

    try {
      const url = id ? `/api/admin/hospitals/${id}` : "/api/admin/hospitals";
      const res = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save hospital");

      // Auto-fetch/refresh clinic immediately
      await loadData();

      setIsHospitalModalOpen(false);
      setEditingHospital(null);

      // SweetAlert2 notification
      setSwal({
        isOpen: true,
        type: "success",
        title: id ? "Hospital Updated!" : "Hospital Created Successfully!",
        text: `"${payload.name}" has been ${id ? "updated" : "saved and published"} successfully.`,
        timer: 3000,
        confirmButtonText: "Great!"
      });
    } catch (err) {
      setSwal({
        isOpen: true,
        type: "error",
        title: "Save Failed",
        text: err instanceof Error ? err.message : "Failed to save hospital record.",
        confirmButtonText: "Try Again"
      });
    } finally {
      setSaving(false);
    }
  }

  function confirmDeleteHospital(id: string, name: string) {
    setSwal({
      isOpen: true,
      type: "warning",
      title: "Delete Hospital?",
      text: `Are you sure you want to delete "${name}"? This action cannot be reverted.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It!",
      cancelButtonText: "Cancel",
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/hospitals/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete hospital");
          await loadData();
          setSwal({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            text: `"${name}" was deleted successfully.`,
            timer: 2500,
            confirmButtonText: "OK"
          });
        } catch (err) {
          setSwal({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            text: err instanceof Error ? err.message : "Failed to delete hospital.",
            confirmButtonText: "Dismiss"
          });
        } finally {
          setSaving(false);
        }
      }
    });
  }

  // Schedule Helpers & Actions
  function openCreateScheduleModal() {
    setEditingSchedule(null);
    const firstHosp = data.hospitals[0];
    const defaultHospId = firstHosp ? recordId(firstHosp) : "";
    setScheduleHospitalId(defaultHospId);

    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    const startStr = toLocalDatetimeInput(now);

    const end = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const endStr = toLocalDatetimeInput(end);

    setScheduleStartsAt(startStr);
    setScheduleEndsAt(endStr);
    setScheduleSlotDuration(15);
    setScheduleMaxAppointments(20);
    setScheduleFee(firstHosp?.consultationFee || 1000);
    setScheduleTitle(firstHosp ? `${firstHosp.name} Consultation Session` : "");
    setScheduleStatus("scheduled");
    setIsScheduleModalOpen(true);
  }

  function openEditScheduleModal(schedule: ScheduleRecord) {
    setEditingSchedule(schedule);
    const hospId = String(
      schedule.hospitalId ||
      (schedule.hospital && typeof schedule.hospital === "object"
        ? recordId(schedule.hospital)
        : schedule.hospital || "")
    );
    setScheduleHospitalId(hospId);
    setScheduleStartsAt(toLocalDatetimeInput(schedule.startsAt));
    setScheduleEndsAt(toLocalDatetimeInput(schedule.endsAt));
    setScheduleSlotDuration(schedule.slotDurationMinutes || 15);
    setScheduleMaxAppointments(schedule.maxAppointments || 20);
    setScheduleFee(schedule.fee ?? 1000);
    setScheduleTitle(schedule.title || "");
    setScheduleStatus(schedule.scheduleStatus || "scheduled");
    setIsScheduleModalOpen(true);
  }

  function handleHospitalSelect(hospId: string) {
    setScheduleHospitalId(hospId);
    const found = data.hospitals.find((h) => recordId(h) === hospId);
    if (found) {
      if (!editingSchedule && (!scheduleTitle || data.hospitals.some((h) => scheduleTitle === `${h.name} Consultation Session`))) {
        setScheduleTitle(`${found.name} Consultation Session`);
      }
      if (typeof found.consultationFee === "number") {
        setScheduleFee(found.consultationFee);
      }
    }
  }

  function handleStartsAtChange(newStart: string) {
    setScheduleStartsAt(newStart);
    if (!newStart) return;
    const startMs = new Date(newStart).getTime();
    const endMs = scheduleEndsAt ? new Date(scheduleEndsAt).getTime() : 0;
    if (!scheduleEndsAt || endMs <= startMs) {
      const durationMs = ((scheduleMaxAppointments || 20) * (scheduleSlotDuration || 15) * 60 * 1000) || (3 * 3600000);
      const newEnd = new Date(startMs + durationMs);
      setScheduleEndsAt(toLocalDatetimeInput(newEnd));
    }
  }

  function applyQuickInterval(hours: number) {
    if (!scheduleStartsAt) return;
    const startMs = new Date(scheduleStartsAt).getTime();
    if (isNaN(startMs)) return;
    const newEnd = new Date(startMs + hours * 3600000);
    setScheduleEndsAt(toLocalDatetimeInput(newEnd));
  }

  function applyAutoFitSlots() {
    if (!scheduleStartsAt) return;
    const startMs = new Date(scheduleStartsAt).getTime();
    if (isNaN(startMs)) return;
    const durationMs = ((scheduleMaxAppointments || 20) * (scheduleSlotDuration || 15) * 60 * 1000) || (3 * 3600000);
    const newEnd = new Date(startMs + durationMs);
    setScheduleEndsAt(toLocalDatetimeInput(newEnd));
  }

  async function handleSaveSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const title = scheduleTitle.trim();
    const hospitalId = scheduleHospitalId;
    const startsAt = scheduleStartsAt;
    const endsAt = scheduleEndsAt;

    if (!startsAt || !endsAt) {
      setSwal({
        isOpen: true,
        type: "warning",
        title: "Missing Date & Time",
        text: "Please provide both Starts At and Ends At date and time for the schedule session.",
        confirmButtonText: "OK"
      });
      setSaving(false);
      return;
    }

    const startMs = new Date(startsAt).getTime();
    const endMs = new Date(endsAt).getTime();
    if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
      setSwal({
        isOpen: true,
        type: "warning",
        title: "Invalid Session Interval",
        text: "Ends At time must be later than Starts At time. Please select a valid end time.",
        confirmButtonText: "Fix Time"
      });
      setSaving(false);
      return;
    }

    const selectedHospital = data.hospitals.find((h) => recordId(h) === hospitalId);
    const id = editingSchedule ? recordId(editingSchedule) : "";

    const payload = {
      title: title || (selectedHospital ? `${selectedHospital.name} Consultation` : "Consultation Schedule"),
      slug: slugify(`${title || selectedHospital?.name || "schedule"}-${startsAt.slice(0, 10)}`),
      hospital: selectedHospital ? {
        name: selectedHospital.name,
        address: selectedHospital.address,
        phone: selectedHospital.phone,
        mapUrl: selectedHospital.embeddedMapUrl || selectedHospital.googleMapsUrl || selectedHospital.mapUrl
      } : hospitalId,
      hospitalId,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      slotDurationMinutes: Number(scheduleSlotDuration || 15),
      fee: Number(scheduleFee || 0),
      maxAppointments: Number(scheduleMaxAppointments || 20),
      scheduleStatus
    };

    try {
      const url = id ? `/api/admin/schedules/${id}` : "/api/admin/schedules";
      const res = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save schedule");

      await loadData();
      setIsScheduleModalOpen(false);
      setEditingSchedule(null);

      setSwal({
        isOpen: true,
        type: "success",
        title: id ? "Schedule Updated!" : "Schedule Created Successfully!",
        text: `Schedule "${payload.title}" has been saved.`,
        timer: 3000,
        confirmButtonText: "Great!"
      });
    } catch (err) {
      setSwal({
        isOpen: true,
        type: "error",
        title: "Save Failed",
        text: err instanceof Error ? err.message : "Failed to save schedule.",
        confirmButtonText: "Try Again"
      });
    } finally {
      setSaving(false);
    }
  }

  function confirmDeleteSchedule(id: string, title: string) {
    setSwal({
      isOpen: true,
      type: "warning",
      title: "Delete Schedule?",
      text: `Are you sure you want to delete session "${title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It!",
      cancelButtonText: "Cancel",
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete schedule");
          await loadData();
          setSwal({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            text: `Schedule was removed successfully.`,
            timer: 2500,
            confirmButtonText: "OK"
          });
        } catch (err) {
          setSwal({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            text: err instanceof Error ? err.message : "Failed to delete schedule.",
            confirmButtonText: "Dismiss"
          });
        } finally {
          setSaving(false);
        }
      }
    });
  }

  // Patient Actions
  async function handleSavePatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const id = editingPatient ? recordId(editingPatient) : "";

    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      mobileNumber: String(formData.get("mobileNumber") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") || ""),
      age: Number(formData.get("age") || 0) || undefined,
      gender: String(formData.get("gender") || ""),
      address: String(formData.get("address") || "").trim(),
      emergencyContact: String(formData.get("emergencyContact") || "").trim(),
      medicalHistory: String(formData.get("medicalHistory") || "").trim()
    };

    try {
      const url = id ? `/api/admin/patients/${id}` : "/api/admin/patients";
      const res = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save patient");

      await loadData();
      setIsPatientModalOpen(false);
      setEditingPatient(null);

      setSwal({
        isOpen: true,
        type: "success",
        title: id ? "Patient Updated!" : "Patient Profile Created!",
        text: `Patient "${payload.fullName}" saved successfully.`,
        timer: 3000,
        confirmButtonText: "OK"
      });
    } catch (err) {
      setSwal({
        isOpen: true,
        type: "error",
        title: "Save Failed",
        text: err instanceof Error ? err.message : "Failed to save patient profile.",
        confirmButtonText: "Try Again"
      });
    } finally {
      setSaving(false);
    }
  }

  function confirmDeletePatient(id: string, name: string) {
    setSwal({
      isOpen: true,
      type: "warning",
      title: "Delete Patient Record?",
      text: `Are you sure you want to delete patient "${name}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It!",
      cancelButtonText: "Cancel",
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/patients/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete patient");
          await loadData();
          setSwal({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            text: `Patient profile was removed.`,
            timer: 2500,
            confirmButtonText: "OK"
          });
        } catch (err) {
          setSwal({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            text: err instanceof Error ? err.message : "Failed to delete patient.",
            confirmButtonText: "Dismiss"
          });
        } finally {
          setSaving(false);
        }
      }
    });
  }

  // Appointment Actions
  async function handleUpdateAppointmentStatus(record: AppointmentRecord, newStatus: "approved" | "cancelled") {
    const id = recordId(record);
    if (!id) return;

    setUpdatingAppointmentId(id);

    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update appointment status");

      await loadData();
      setSwal({
        isOpen: true,
        type: "success",
        title: newStatus === "approved" ? "Appointment Approved!" : "Appointment Cancelled",
        text: `Queue #${record.queueNumber || 1} for ${record.patientName || "patient"} has been marked as ${newStatus.toUpperCase()}.`,
        timer: 2500,
        confirmButtonText: "OK"
      });
    } catch (err) {
      setSwal({
        isOpen: true,
        type: "error",
        title: "Status Update Failed",
        text: err instanceof Error ? err.message : "Failed to update appointment status.",
        confirmButtonText: "Dismiss"
      });
    } finally {
      setUpdatingAppointmentId("");
    }
  }

  function openCreateAppointmentModal() {
    setEditingAppointment(null);
    setAppointmentPatientName("");
    setAppointmentMobile("");
    setAppointmentAddress("");
    const defaultSchedule = data.schedules[0];
    const defaultSchedId = defaultSchedule ? recordId(defaultSchedule) : "";
    setAppointmentScheduleId(defaultSchedId);

    if (defaultSchedule?.startsAt) {
      setAppointmentSlotStart(toLocalDatetimeInput(defaultSchedule.startsAt));
      const end = new Date(new Date(defaultSchedule.startsAt).getTime() + (defaultSchedule.slotDurationMinutes || 15) * 60000);
      setAppointmentSlotEnd(toLocalDatetimeInput(end));
    } else {
      setAppointmentSlotStart("");
      setAppointmentSlotEnd("");
    }

    const count = data.appointments.filter(
      (a) => String(a.scheduleId || (a.schedule && typeof a.schedule === "object" ? recordId(a.schedule) : a.schedule || "")) === defaultSchedId
    ).length;
    setAppointmentQueue(count + 1);
    setAppointmentStatusVal("pending");
    setAppointmentPaymentStatusVal("pending");
    setAppointmentReason("");
    setIsAppointmentModalOpen(true);
  }

  function openEditAppointmentModal(appointment: AppointmentRecord) {
    setEditingAppointment(appointment);
    setAppointmentPatientName(appointment.patientName || "");
    setAppointmentMobile(appointment.mobileNumber || "");
    setAppointmentAddress(appointment.address || "");
    const schedId = String(
      appointment.scheduleId ||
      (appointment.schedule && typeof appointment.schedule === "object"
        ? recordId(appointment.schedule)
        : appointment.schedule || "")
    );
    setAppointmentScheduleId(schedId);
    setAppointmentSlotStart(toLocalDatetimeInput(appointment.slotStart));
    setAppointmentSlotEnd(toLocalDatetimeInput(appointment.slotEnd));
    setAppointmentQueue(appointment.queueNumber || 1);
    setAppointmentStatusVal((appointment.appointmentStatus || appointment.status || "pending") as any);
    setAppointmentPaymentStatusVal((appointment.paymentStatus || "pending") as any);
    setAppointmentReason(appointment.reason || appointment.notes || "");
    setIsAppointmentModalOpen(true);
  }

  function handleAppointmentScheduleChange(schedId: string) {
    setAppointmentScheduleId(schedId);
    const sched = data.schedules.find((s) => recordId(s) === schedId);
    if (sched?.startsAt) {
      setAppointmentSlotStart(toLocalDatetimeInput(sched.startsAt));
      const end = new Date(new Date(sched.startsAt).getTime() + (sched.slotDurationMinutes || 15) * 60000);
      setAppointmentSlotEnd(toLocalDatetimeInput(end));
    }
    const count = data.appointments.filter(
      (a) => String(a.scheduleId || (a.schedule && typeof a.schedule === "object" ? recordId(a.schedule) : a.schedule || "")) === schedId
    ).length;
    setAppointmentQueue(count + 1);
  }

  async function handleSaveAppointment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const scheduleId = appointmentScheduleId;
    const schedule = data.schedules.find((s) => recordId(s) === scheduleId);
    const id = editingAppointment ? recordId(editingAppointment) : "";

    const payload = {
      patientName: appointmentPatientName.trim(),
      mobileNumber: appointmentMobile.trim(),
      address: appointmentAddress.trim(),
      scheduleId,
      schedule: schedule ? { documentId: recordId(schedule), id: schedule.id, title: schedule.title } : scheduleId,
      hospitalName: schedule ? resolveHospitalName(schedule.hospital, schedule.hospitalId) : "",
      slotStart: appointmentSlotStart ? new Date(appointmentSlotStart).toISOString() : "",
      slotEnd: appointmentSlotEnd ? new Date(appointmentSlotEnd).toISOString() : "",
      queueNumber: Number(appointmentQueue || 1),
      appointmentStatus: appointmentStatusVal,
      paymentStatus: appointmentPaymentStatusVal,
      reason: appointmentReason.trim()
    };

    try {
      const url = id ? `/api/admin/appointments/${id}` : "/api/admin/appointments";
      const res = await fetch(url, {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save appointment");

      await loadData();
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);

      setSwal({
        isOpen: true,
        type: "success",
        title: id ? "Appointment Updated!" : "Appointment Created!",
        text: `Appointment for "${payload.patientName}" has been saved.`,
        timer: 3000,
        confirmButtonText: "OK"
      });
    } catch (err) {
      setSwal({
        isOpen: true,
        type: "error",
        title: "Save Failed",
        text: err instanceof Error ? err.message : "Failed to save appointment.",
        confirmButtonText: "Try Again"
      });
    } finally {
      setSaving(false);
    }
  }

  function confirmDeleteAppointment(id: string, name: string) {
    setSwal({
      isOpen: true,
      type: "warning",
      title: "Delete Appointment?",
      text: `Are you sure you want to delete appointment for "${name}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It!",
      cancelButtonText: "Cancel",
      onConfirm: async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete appointment");
          await loadData();
          setSwal({
            isOpen: true,
            type: "success",
            title: "Deleted!",
            text: `Appointment was removed successfully.`,
            timer: 2500,
            confirmButtonText: "OK"
          });
        } catch (err) {
          setSwal({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            text: err instanceof Error ? err.message : "Failed to delete appointment.",
            confirmButtonText: "Dismiss"
          });
        } finally {
          setSaving(false);
        }
      }
    });
  }

  // Filtered Lists
  const filteredHospitals = useMemo(() => {
    return data.hospitals.filter((h) => {
      const matchSearch =
        (h.name || "").toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        (h.address || "").toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        (h.phone || "").includes(hospitalSearch);

      const matchStatus =
        hospitalStatusFilter === "all" ||
        (hospitalStatusFilter === "active" ? h.active !== false : h.active === false);

      return matchSearch && matchStatus;
    });
  }, [data.hospitals, hospitalSearch, hospitalStatusFilter]);

  const filteredSchedules = useMemo(() => {
    const now = Date.now();
    return data.schedules.filter((s) => {
      const matchSearch =
        (s.title || "").toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        resolveHospitalName(s.hospital, s.hospitalId).toLowerCase().includes(scheduleSearch.toLowerCase());

      const matchHospital =
        scheduleHospitalFilter === "all" ||
        String(s.hospitalId || (s.hospital && typeof s.hospital === "object" ? recordId(s.hospital) : s.hospital || "")) === scheduleHospitalFilter ||
        resolveHospitalName(s.hospital, s.hospitalId) === scheduleHospitalFilter;

      const end = s.endsAt ? new Date(s.endsAt).getTime() : 0;
      const isUpcoming = end >= now && s.scheduleStatus !== "cancelled";
      const isPast = end < now && s.scheduleStatus !== "cancelled";
      const isCancelled = s.scheduleStatus === "cancelled";

      const matchStatus =
        scheduleStatusFilter === "all" ||
        (scheduleStatusFilter === "upcoming" && isUpcoming) ||
        (scheduleStatusFilter === "past" && isPast) ||
        (scheduleStatusFilter === "cancelled" && isCancelled);

      return matchSearch && matchHospital && matchStatus;
    });
  }, [data.schedules, data.hospitals, scheduleSearch, scheduleHospitalFilter, scheduleStatusFilter]);

  const filteredPatients = useMemo(() => {
    return data.patients.filter((p) => {
      return (
        (p.fullName || "").toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.mobileNumber || "").includes(patientSearch) ||
        (p.address || "").toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.email || "").toLowerCase().includes(patientSearch.toLowerCase())
      );
    });
  }, [data.patients, patientSearch]);

  const appointmentGroups = useMemo(() => {
    const map = new Map<string, { hospitalName: string; address: string; appointments: AppointmentRecord[] }>();

    for (const appt of data.appointments) {
      const status = (appt.appointmentStatus || appt.status || "pending").toLowerCase();
      const matchStatus =
        appointmentStatusFilter === "all" || status === appointmentStatusFilter;

      const matchSearch =
        (appt.patientName || "").toLowerCase().includes(appointmentSearch.toLowerCase()) ||
        (appt.mobileNumber || "").includes(appointmentSearch) ||
        String(appt.queueNumber || "").includes(appointmentSearch);

      if (!matchStatus || !matchSearch) continue;

      const { name, address } = getAppointmentHospital(appt);

      if (appointmentHospitalFilter !== "all" && name !== appointmentHospitalFilter) {
        continue;
      }

      if (!map.has(name)) {
        map.set(name, { hospitalName: name, address, appointments: [] });
      }
      map.get(name)!.appointments.push(appt);
    }

    return Array.from(map.values());
  }, [data.appointments, data.schedules, data.hospitals, appointmentSearch, appointmentHospitalFilter, appointmentStatusFilter]);

  const allHospitalNames = useMemo(() => {
    const names = new Set<string>();
    data.hospitals.forEach((h) => {
      if (h.name) names.add(h.name);
    });
    data.appointments.forEach((a) => {
      const { name } = getAppointmentHospital(a);
      if (name) names.add(name);
    });
    return Array.from(names);
  }, [data.hospitals, data.appointments, data.schedules]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-teal-500 selection:text-white font-sans antialiased">
      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d1527] text-white flex flex-col justify-between transition-transform duration-300 shadow-2xl lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/20">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white tracking-tight">Dr. Rashed</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Admin Portal</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* 4 PRIMARY NAVIGATION ITEMS */}
          <nav className="p-4 space-y-2">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">
              Management
            </p>

            {/* 1. Hospital */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("hospitals");
                setMobileMenuOpen(false);
              }}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                activeTab === "hospitals"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/40 ring-1 ring-teal-400/30"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`size-4.5 transition-transform group-hover:scale-110 ${activeTab === "hospitals" ? "text-teal-200" : "text-slate-400"}`} />
                <span className="text-sm">Hospital</span>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                activeTab === "hospitals" ? "bg-white/20 text-white" : "bg-slate-800/80 text-slate-400"
              }`}>
                {data.hospitals.length}
              </span>
            </button>

            {/* 2. Schedule */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("schedules");
                setMobileMenuOpen(false);
              }}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                activeTab === "schedules"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/40 ring-1 ring-teal-400/30"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className={`size-4.5 transition-transform group-hover:scale-110 ${activeTab === "schedules" ? "text-teal-200" : "text-slate-400"}`} />
                <span className="text-sm">Schedule</span>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                activeTab === "schedules" ? "bg-white/20 text-white" : "bg-slate-800/80 text-slate-400"
              }`}>
                {stats.upcomingSchedules}
              </span>
            </button>

            {/* 3. Patient */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("patients");
                setMobileMenuOpen(false);
              }}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                activeTab === "patients"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/40 ring-1 ring-teal-400/30"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`size-4.5 transition-transform group-hover:scale-110 ${activeTab === "patients" ? "text-teal-200" : "text-slate-400"}`} />
                <span className="text-sm">Patient</span>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                activeTab === "patients" ? "bg-white/20 text-white" : "bg-slate-800/80 text-slate-400"
              }`}>
                {data.patients.length}
              </span>
            </button>

            {/* 4. Appointments */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("appointments");
                setMobileMenuOpen(false);
              }}
              className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                activeTab === "appointments"
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-900/40 ring-1 ring-teal-400/30"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className={`size-4.5 transition-transform group-hover:scale-110 ${activeTab === "appointments" ? "text-teal-200" : "text-slate-400"}`} />
                <span className="text-sm">Appointments</span>
              </div>
              {stats.pendingAppointments > 0 ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                  {stats.pendingAppointments} new
                </span>
              ) : (
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === "appointments" ? "bg-white/20 text-white" : "bg-slate-800/80 text-slate-400"
                }`}>
                  {data.appointments.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="rounded-2xl bg-slate-900/90 p-3.5 text-xs text-slate-400 border border-slate-800/90 space-y-1">
            <p className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 inline-block"></span>
              Strapi Sync Active
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Live bidirectional synchronization enabled.</p>
          </div>
          <LogoutButton mode="admin" />
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight capitalize truncate">
                  {activeTab === "hospitals" && "Hospital Management"}
                  {activeTab === "schedules" && "Schedule Management"}
                  {activeTab === "patients" && "Patient Management"}
                  {activeTab === "appointments" && "Appointment Management"}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200/70 shadow-xs">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block truncate">
                Healthcare administration dashboard & live Strapi controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/" target="_blank" className="inline-block">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-900 hover:text-white border border-slate-200/90 hover:border-slate-900 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer"
              >
                <ExternalLink className="size-3.5 text-slate-400 group-hover:text-teal-300 transition-colors" />
                <span className="hidden sm:inline">View Live Site</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-xs font-bold text-teal-950 bg-teal-50 hover:bg-teal-700 hover:text-white border border-teal-200/80 hover:border-teal-700 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 group disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 text-teal-700 group-hover:text-white transition-all ${loading ? "animate-spin text-teal-700" : "group-hover:rotate-180"}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* TOP KPI OVERVIEW CARDS */}
        <div className="px-6 sm:px-8 pt-6 pb-2">
          {loading ? (
            <KpiCardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Total Hospitals */}
              <div
                onClick={() => setActiveTab("hospitals")}
                className={`group cursor-pointer rounded-3xl p-5 bg-white border transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-0.5 ${
                  activeTab === "hospitals"
                    ? "border-teal-500 bg-gradient-to-b from-white to-teal-50/20 ring-2 ring-teal-500/20"
                    : "border-slate-200/80 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Hospitals</span>
                  <span className="grid size-9 place-items-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 group-hover:scale-105 transition-transform">
                    <Building2 className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{stats.totalHospitals}</p>
                <p className="mt-1 text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                  {stats.activeHospitals} active chambers
                </p>
              </div>

              {/* Active Schedules */}
              <div
                onClick={() => setActiveTab("schedules")}
                className={`group cursor-pointer rounded-3xl p-5 bg-white border transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-0.5 ${
                  activeTab === "schedules"
                    ? "border-teal-500 bg-gradient-to-b from-white to-teal-50/20 ring-2 ring-teal-500/20"
                    : "border-slate-200/80 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Schedules</span>
                  <span className="grid size-9 place-items-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:scale-105 transition-transform">
                    <CalendarClock className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{stats.upcomingSchedules}</p>
                <p className="mt-1 text-xs text-blue-600 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-blue-500"></span>
                  Upcoming Sessions
                </p>
              </div>

              {/* Total Patients */}
              <div
                onClick={() => setActiveTab("patients")}
                className={`group cursor-pointer rounded-3xl p-5 bg-white border transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-0.5 ${
                  activeTab === "patients"
                    ? "border-teal-500 bg-gradient-to-b from-white to-teal-50/20 ring-2 ring-teal-500/20"
                    : "border-slate-200/80 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Patients</span>
                  <span className="grid size-9 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 group-hover:scale-105 transition-transform">
                    <Users className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{stats.totalPatients}</p>
                <p className="mt-1 text-xs text-indigo-600 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-indigo-500"></span>
                  Registered Profiles
                </p>
              </div>

              {/* Appointments */}
              <div
                onClick={() => setActiveTab("appointments")}
                className={`group cursor-pointer rounded-3xl p-5 bg-white border transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] hover:shadow-lg hover:-translate-y-0.5 ${
                  activeTab === "appointments"
                    ? "border-teal-500 bg-gradient-to-b from-white to-teal-50/20 ring-2 ring-teal-500/20"
                    : "border-slate-200/80 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Appointments</span>
                  <span className="grid size-9 place-items-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 group-hover:scale-105 transition-transform">
                    <ClipboardList className="size-4.5" />
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{stats.totalAppointments}</p>
                <p className="mt-1 text-xs font-bold text-amber-700 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-500"></span>
                  {stats.pendingAppointments} pending • {stats.approvedAppointments} approved
                </p>
              </div>
            </div>
          )}
        </div>

        {/* TAB CONTENTS */}
        <main className="p-6 sm:p-8 flex-1">
          {loading ? (
            <AdminPanelSkeleton activeTab={activeTab} />
          ) : (
            <>
              {/* ================= 1. HOSPITAL MANAGEMENT ================= */}
              {activeTab === "hospitals" && (
                <div className="space-y-6">
                  {/* Filter & Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.03)]">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[220px] max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      placeholder="Search hospitals by name, address, phone..."
                      className="pl-11 h-11 rounded-2xl bg-slate-50 border-slate-200/80 text-xs font-medium focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setHospitalStatusFilter("all")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        hospitalStatusFilter === "all" ? "bg-white shadow-xs text-slate-900" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All ({data.hospitals.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setHospitalStatusFilter("active")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        hospitalStatusFilter === "active" ? "bg-white shadow-xs text-emerald-700" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setHospitalStatusFilter("inactive")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        hospitalStatusFilter === "inactive" ? "bg-white shadow-xs text-slate-900" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    setEditingHospital(null);
                    setIsHospitalModalOpen(true);
                  }}
                  className="rounded-2xl font-bold gap-2 h-11 px-5 shadow-sm hover:shadow-md transition-all shrink-0"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  Add Hospital
                </Button>
              </div>

              {/* Hospital Cards Grid */}
              {filteredHospitals.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-14 text-center text-slate-500 shadow-sm">
                  <Building2 className="mx-auto size-12 text-slate-300 mb-3" />
                  <p className="font-bold text-slate-800 text-base">No hospitals found</p>
                  <p className="text-xs text-slate-500 mt-1">Add your first clinic chamber or adjust search filters.</p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredHospitals.map((hospital) => {
                    const id = recordId(hospital);
                    const scheduleCount = data.schedules.filter(
                      (s) => String(s.hospitalId || (s.hospital && typeof s.hospital === "object" ? recordId(s.hospital) : s.hospital || "")) === id
                    ).length;

                    return (
                      <div
                        key={id}
                        className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1"
                      >
                        <div>
                          {/* Header with Title and Active Badge */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 font-bold border border-teal-100 shadow-xs group-hover:scale-105 transition-transform">
                                <Building2 className="size-5.5" />
                              </span>
                              <div>
                                <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-teal-700 transition-colors">
                                  {hospital.name}
                                </h3>
                                <p className="text-xs text-teal-700 font-semibold mt-0.5 flex items-center gap-1">
                                  <span>{scheduleCount} linked schedule{scheduleCount === 1 ? "" : "s"}</span>
                                </p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              hospital.active !== false
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              <span className={`size-1.5 rounded-full ${hospital.active !== false ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                              {hospital.active !== false ? "Active" : "Inactive"}
                            </span>
                          </div>

                          {/* Details Specification */}
                          <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50/70 p-4 text-xs text-slate-600 border border-slate-100">
                            {hospital.address ? (
                              <p className="flex items-start gap-2.5">
                                <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
                                <span className="font-medium text-slate-800 leading-relaxed">{hospital.address}</span>
                              </p>
                            ) : null}
                            {hospital.phone ? (
                              <p className="flex items-center gap-2.5 font-semibold text-slate-800">
                                <Phone className="size-4 text-teal-600 shrink-0" />
                                <span>{hospital.phone}</span>
                              </p>
                            ) : null}
                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60">
                              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Consultation Fee</span>
                              <span className="font-extrabold text-slate-900 text-sm">
                                {formatCurrency(hospital.consultationFee ?? 0)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 gap-2">
                          {hospital.googleMapsUrl || hospital.embeddedMapUrl || hospital.mapUrl ? (
                            <a
                              href={hospital.googleMapsUrl || hospital.embeddedMapUrl || hospital.mapUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors flex items-center gap-1.5 truncate max-w-[150px]"
                            >
                              <MapPin className="size-3.5 shrink-0" /> <span className="truncate">Map Location</span> <ArrowUpRight className="size-3 shrink-0" />
                            </a>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-2.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingHospital(hospital);
                                setIsHospitalModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-all active:scale-95"
                            >
                              <Edit2 className="size-3.5 text-slate-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDeleteHospital(id, hospital.name || "this hospital")}
                              className="inline-flex items-center justify-center size-9 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 border border-rose-200/70 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-xs transition-all active:scale-95"
                              title="Delete Hospital"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 2. SCHEDULE MANAGEMENT ================= */}
          {activeTab === "schedules" && (
            <div className="space-y-6">
              {/* Filter & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.03)]">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      value={scheduleSearch}
                      onChange={(e) => setScheduleSearch(e.target.value)}
                      placeholder="Search schedules..."
                      className="pl-11 h-11 rounded-2xl bg-slate-50 border-slate-200/80 text-xs font-medium focus:bg-white"
                    />
                  </div>

                  {/* Modern Hospital Filter Dropdown */}
                  <div className="relative min-w-[200px] sm:w-56" ref={scheduleHospitalFilterRef}>
                    <button
                      type="button"
                      onClick={() => setIsScheduleHospitalFilterOpen(!isScheduleHospitalFilterOpen)}
                      className={`w-full h-11 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 transition-all shadow-2xs cursor-pointer ${
                        isScheduleHospitalFilterOpen
                          ? "border-teal-500 bg-white ring-2 ring-teal-500/20 text-slate-900"
                          : scheduleHospitalFilter !== "all"
                          ? "bg-teal-50/70 border-teal-300 text-teal-950 font-extrabold"
                          : "bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 truncate">
                        <Building2 className={`size-4 shrink-0 ${scheduleHospitalFilter !== "all" || isScheduleHospitalFilterOpen ? "text-teal-600" : "text-slate-400"}`} />
                        <span className="truncate">
                          {scheduleHospitalFilter === "all"
                            ? `All Hospitals (${data.schedules.length})`
                            : (data.hospitals.find((h) => recordId(h) === scheduleHospitalFilter)?.name || "Hospital")}
                        </span>
                      </div>
                      <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${isScheduleHospitalFilterOpen ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
                    </button>

                    {isScheduleHospitalFilterOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setScheduleHospitalFilter("all");
                            setIsScheduleHospitalFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            scheduleHospitalFilter === "all"
                              ? "bg-teal-50 text-teal-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className={`size-4 ${scheduleHospitalFilter === "all" ? "text-teal-600" : "text-slate-400"}`} />
                            <span>All Hospitals</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-600">
                              {data.schedules.length}
                            </span>
                            {scheduleHospitalFilter === "all" && <Check className="size-4 text-teal-600" />}
                          </div>
                        </button>

                        <div className="my-1 border-t border-slate-100"></div>

                        {data.hospitals.map((h) => {
                          const hid = recordId(h);
                          const count = data.schedules.filter((s) => recordId(s.hospital) === hid || s.hospitalId === hid).length;
                          const isSelected = scheduleHospitalFilter === hid;
                          return (
                            <button
                              key={hid}
                              type="button"
                              onClick={() => {
                                setScheduleHospitalFilter(hid);
                                setIsScheduleHospitalFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-50 text-teal-900 font-extrabold"
                                  : "text-slate-700 hover:bg-slate-50 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 truncate mr-2">
                                <Building2 className={`size-4 shrink-0 ${isSelected ? "text-teal-600" : "text-slate-400"}`} />
                                <span className="truncate">{h.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-600">
                                  {count}
                                </span>
                                {isSelected && <Check className="size-4 text-teal-600 shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setScheduleStatusFilter("all")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        scheduleStatusFilter === "all" ? "bg-white shadow-xs text-slate-900" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleStatusFilter("upcoming")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        scheduleStatusFilter === "upcoming" ? "bg-white shadow-xs text-emerald-700" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Upcoming
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleStatusFilter("past")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        scheduleStatusFilter === "past" ? "bg-white shadow-xs text-slate-700" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Past
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleStatusFilter("cancelled")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        scheduleStatusFilter === "cancelled" ? "bg-white shadow-xs text-rose-700" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                <Button
                  variant="gold"
                  size="md"
                  onClick={openCreateScheduleModal}
                  className="rounded-2xl font-bold gap-2 h-11 px-5 shadow-sm hover:shadow-md shrink-0"
                >
                  <Plus className="size-4 stroke-[2.5]" />
                  Create Schedule
                </Button>
              </div>

              {/* Schedule Cards Grid */}
              {filteredSchedules.length === 0 ? (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-14 text-center text-slate-500 shadow-sm">
                  <CalendarCheck className="mx-auto size-12 text-slate-300 mb-3" />
                  <p className="font-bold text-slate-800 text-base">No schedules found</p>
                  <p className="text-xs text-slate-500 mt-1">Create a schedule to enable patient appointments.</p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredSchedules.map((schedule) => {
                    const id = recordId(schedule);
                    const hospitalName = resolveHospitalName(schedule.hospital, schedule.hospitalId);
                    const now = Date.now();
                    const end = schedule.endsAt ? new Date(schedule.endsAt).getTime() : 0;
                    const isUpcoming = end >= now && schedule.scheduleStatus !== "cancelled";
                    const isPast = end < now && schedule.scheduleStatus !== "cancelled";
                    const isCancelled = schedule.scheduleStatus === "cancelled";

                    const apptCount = data.appointments.filter(
                      (a) =>
                        String(a.scheduleId || (a.schedule && typeof a.schedule === "object" ? recordId(a.schedule) : a.schedule || "")) === id ||
                        (Boolean(schedule.slug) && a.scheduleId === schedule.slug)
                    ).length;

                    const maxAppointments = schedule.maxAppointments || 20;
                    const capacityPercent = Math.min(100, Math.round((apptCount / maxAppointments) * 100));

                    return (
                      <div
                        key={id}
                        className={`group flex flex-col justify-between rounded-3xl border p-6 bg-white shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                          isCancelled ? "border-rose-200 bg-rose-50/20" : isPast ? "border-slate-200/80 opacity-80" : "border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                isCancelled
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : isUpcoming
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}>
                                <span className={`size-1.5 rounded-full ${isCancelled ? "bg-rose-500" : isUpcoming ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                                {isCancelled ? "CANCELLED" : isUpcoming ? "UPCOMING SESSION" : "PAST SESSION"}
                              </span>
                              <h3 className="mt-3 font-extrabold text-slate-900 text-lg leading-snug group-hover:text-teal-700 transition-colors">
                                {schedule.title || hospitalName}
                              </h3>
                              <p className="text-xs text-teal-700 font-bold flex items-center gap-1.5 mt-1">
                                <Building2 className="size-3.5" /> {hospitalName}
                              </p>
                            </div>
                          </div>

                          {/* Time & Capacity Details */}
                          <div className="mt-5 space-y-3 rounded-2xl bg-slate-50/70 p-4 text-xs border border-slate-100">
                            {schedule.startsAt && schedule.endsAt ? (
                              <div>
                                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">Session Interval (12h)</span>
                                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                                  {formatSlotRange12(schedule.startsAt, schedule.endsAt)}
                                </span>
                                <span className="text-slate-500 block mt-0.5 font-medium">{formatDateTime(schedule.startsAt)}</span>
                              </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/60">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Slot Interval</span>
                                <span className="font-extrabold text-slate-900">{schedule.slotDurationMinutes || 15} mins</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                                <span className="font-extrabold text-slate-900">{formatCurrency(schedule.fee ?? 0)}</span>
                              </div>
                            </div>

                            {/* Live Booking Capacity Bar */}
                            <div className="pt-2.5 border-t border-slate-200/60 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-500">Booking Capacity</span>
                                <span className="font-black text-teal-800">
                                  {apptCount} / {maxAppointments} Slots
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-teal-600 transition-all duration-300"
                                  style={{ width: `${capacityPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab("appointments");
                              setAppointmentHospitalFilter(hospitalName);
                            }}
                            className="h-8.5 px-3 rounded-xl text-xs font-bold text-teal-700 border-teal-200 hover:bg-teal-50"
                          >
                            Bookings ({apptCount})
                          </Button>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => openEditScheduleModal(schedule)}
                              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-all active:scale-95"
                            >
                              <Edit2 className="size-3.5 text-slate-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDeleteSchedule(id, schedule.title || "this schedule")}
                              className="inline-flex items-center justify-center size-9 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 border border-rose-200/70 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-xs transition-all active:scale-95"
                              title="Delete Schedule"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 3. PATIENT MANAGEMENT ================= */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              {/* Filter & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.03)]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Search patients by name, mobile, address, email..."
                    className="pl-9.5 h-11 rounded-2xl bg-slate-50 border-slate-200/80 text-xs font-medium focus:bg-white"
                  />
                </div>

                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    setEditingPatient(null);
                    setIsPatientModalOpen(true);
                  }}
                  className="rounded-2xl font-bold gap-2 h-11 px-5 shadow-sm hover:shadow-md"
                >
                  <UserPlus className="size-4 stroke-[2.5]" />
                  Register Patient
                </Button>
              </div>

              {/* Patients Data Table */}
              <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-4">Patient Profile</th>
                        <th className="px-6 py-4">Mobile Number</th>
                        <th className="px-6 py-4">Age / Gender</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4 text-center">Appointments</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-14 text-center text-slate-500">
                            <Users className="mx-auto size-12 text-slate-300 mb-3" />
                            <p className="font-bold text-slate-800 text-base">No registered patients found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient) => {
                          const id = recordId(patient);
                          const apptCount = data.appointments.filter(
                            (a) => a.mobileNumber === patient.mobileNumber
                          ).length;

                          return (
                            <tr key={id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="size-10 rounded-2xl bg-gradient-to-tr from-teal-50 to-emerald-100 text-teal-800 font-extrabold grid place-items-center text-sm border border-teal-200/60 shadow-xs">
                                    {(patient.fullName || "P").charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                                      {patient.fullName}
                                    </p>
                                    {patient.email && <p className="text-xs text-slate-400">{patient.email}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                  <Phone className="size-3.5 text-teal-600" />
                                  {patient.mobileNumber}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                                {patient.age ? `${patient.age} yrs` : "-"} {patient.gender ? `• ${patient.gender}` : ""}
                              </td>
                              <td className="px-6 py-4 text-slate-600 max-w-xs truncate text-xs font-medium">
                                {patient.address || "-"}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200/60">
                                  {apptCount}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPatientForDrawer(patient)}
                                    className="h-9 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200"
                                  >
                                    History
                                  </Button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingPatient(patient);
                                      setIsPatientModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all active:scale-95"
                                  >
                                    <Edit2 className="size-3.5 text-slate-400" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => confirmDeletePatient(id, patient.fullName || "Patient")}
                                    className="inline-flex items-center justify-center size-9 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 border border-rose-200/70 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-xs transition-all active:scale-95"
                                    title="Delete Patient"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. APPOINTMENT MANAGEMENT ================= */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              {/* Unified Modern Filter & Action Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-[10px] border border-slate-200/80 shadow-xs">
                <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* 1. Search Input */}
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      value={appointmentSearch}
                      onChange={(e) => setAppointmentSearch(e.target.value)}
                      placeholder="Search appointments by name, phone, serial..."
                      className="pl-10 pr-9 h-11 rounded-2xl bg-slate-50/90 hover:bg-slate-100/60 border-slate-200/80 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    />
                    {appointmentSearch && (
                      <button
                        type="button"
                        onClick={() => setAppointmentSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 2. Modern Custom Hospital / Chamber Dropdown */}
                  <div className="relative min-w-[210px] sm:w-60" ref={hospitalFilterRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsHospitalFilterOpen(!isHospitalFilterOpen);
                        setIsStatusFilterOpen(false);
                      }}
                      className={`w-full h-11 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 transition-all shadow-2xs cursor-pointer ${
                        isHospitalFilterOpen
                          ? "border-teal-500 bg-white ring-2 ring-teal-500/20 text-slate-900"
                          : appointmentHospitalFilter !== "all"
                          ? "bg-teal-50/70 border-teal-300 text-teal-950 font-extrabold"
                          : "bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 truncate">
                        <Building2 className={`size-4 shrink-0 ${appointmentHospitalFilter !== "all" || isHospitalFilterOpen ? "text-teal-600" : "text-slate-400"}`} />
                        <span className="truncate">
                          {appointmentHospitalFilter === "all"
                            ? `All Chambers (${data.appointments.length})`
                            : appointmentHospitalFilter}
                        </span>
                      </div>
                      <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${isHospitalFilterOpen ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
                    </button>

                    {isHospitalFilterOpen && (
                      <div className="absolute left-0 top-full mt-2 w-72 max-h-72 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentHospitalFilter("all");
                            setIsHospitalFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            appointmentHospitalFilter === "all"
                              ? "bg-teal-50 text-teal-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Building2 className={`size-4 ${appointmentHospitalFilter === "all" ? "text-teal-600" : "text-slate-400"}`} />
                            <span>All Chambers</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-600">
                              {data.appointments.length}
                            </span>
                            {appointmentHospitalFilter === "all" && <Check className="size-4 text-teal-600" />}
                          </div>
                        </button>

                        <div className="my-1 border-t border-slate-100"></div>

                        {allHospitalNames.map((name) => {
                          const count = data.appointments.filter((a) => getAppointmentHospital(a).name === name).length;
                          const isSelected = appointmentHospitalFilter === name;
                          return (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setAppointmentHospitalFilter(name);
                                setIsHospitalFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-50 text-teal-900 font-extrabold"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 truncate mr-2">
                                <Building2 className={`size-4 shrink-0 ${isSelected ? "text-teal-600" : "text-slate-400"}`} />
                                <span className="truncate">{name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-600">
                                  {count}
                                </span>
                                {isSelected && <Check className="size-4 text-teal-600 shrink-0" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. Modern Custom Appointment Status Dropdown */}
                  <div className="relative min-w-[190px] sm:w-52" ref={statusFilterRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStatusFilterOpen(!isStatusFilterOpen);
                        setIsHospitalFilterOpen(false);
                      }}
                      className={`w-full h-11 px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 transition-all shadow-2xs cursor-pointer ${
                        isStatusFilterOpen
                          ? "border-teal-500 bg-white ring-2 ring-teal-500/20 text-slate-900"
                          : appointmentStatusFilter !== "all"
                          ? "bg-teal-50/70 border-teal-300 text-teal-950 font-extrabold"
                          : "bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 truncate">
                        {appointmentStatusFilter === "pending" ? (
                          <span className="size-2 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                        ) : appointmentStatusFilter === "approved" ? (
                          <span className="size-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                        ) : appointmentStatusFilter === "cancelled" ? (
                          <span className="size-2 rounded-full bg-rose-500 shrink-0"></span>
                        ) : (
                          <Filter className="size-4 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate capitalize">
                          {appointmentStatusFilter === "all"
                            ? `All Status (${data.appointments.length})`
                            : `${appointmentStatusFilter} (${
                                appointmentStatusFilter === "pending"
                                  ? stats.pendingAppointments
                                  : appointmentStatusFilter === "approved"
                                  ? stats.approvedAppointments
                                  : data.appointments.filter((a) => (a.appointmentStatus || a.status) === "cancelled").length
                              })`}
                        </span>
                      </div>
                      <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${isStatusFilterOpen ? "rotate-180 text-teal-600" : "text-slate-400"}`} />
                    </button>

                    {isStatusFilterOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                        {/* Option: All */}
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentStatusFilter("all");
                            setIsStatusFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            appointmentStatusFilter === "all"
                              ? "bg-slate-100 text-slate-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Filter className="size-4 text-slate-400" />
                            <span>All Statuses</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-200/70 text-slate-700">
                              {data.appointments.length}
                            </span>
                            {appointmentStatusFilter === "all" && <Check className="size-4 text-slate-900" />}
                          </div>
                        </button>

                        {/* Option: Pending */}
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentStatusFilter("pending");
                            setIsStatusFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            appointmentStatusFilter === "pending"
                              ? "bg-amber-50 text-amber-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="size-2 rounded-full bg-amber-500"></span>
                            <span>Pending</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800">
                              {stats.pendingAppointments}
                            </span>
                            {appointmentStatusFilter === "pending" && <Check className="size-4 text-amber-700" />}
                          </div>
                        </button>

                        {/* Option: Approved */}
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentStatusFilter("approved");
                            setIsStatusFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            appointmentStatusFilter === "approved"
                              ? "bg-emerald-50 text-emerald-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="size-2 rounded-full bg-emerald-500"></span>
                            <span>Approved</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                              {stats.approvedAppointments}
                            </span>
                            {appointmentStatusFilter === "approved" && <Check className="size-4 text-emerald-700" />}
                          </div>
                        </button>

                        {/* Option: Cancelled */}
                        <button
                          type="button"
                          onClick={() => {
                            setAppointmentStatusFilter("cancelled");
                            setIsStatusFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                            appointmentStatusFilter === "cancelled"
                              ? "bg-rose-50 text-rose-900 font-extrabold"
                              : "text-slate-700 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="size-2 rounded-full bg-rose-500"></span>
                            <span>Cancelled</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800">
                              {data.appointments.filter((a) => (a.appointmentStatus || a.status) === "cancelled").length}
                            </span>
                            {appointmentStatusFilter === "cancelled" && <Check className="size-4 text-rose-700" />}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Manual Booking Button */}
                <Button
                  variant="gold"
                  size="md"
                  onClick={openCreateAppointmentModal}
                  className="rounded-2xl font-black text-xs gap-2 h-11 px-5 shadow-xs hover:shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="size-4 stroke-[3]" />
                  Manual Booking
                </Button>
              </div>

              {/* Grouped Hospital Appointments */}
              {appointmentGroups.length === 0 ? (
                <div className="rounded-[10px] border border-slate-200/80 bg-white p-14 text-center text-slate-500 shadow-sm">
                  <ClipboardList className="mx-auto size-12 text-slate-300 mb-3" />
                  <p className="font-bold text-slate-800 text-base">No appointments matching filters</p>
                  <p className="text-xs text-slate-500 mt-1">Book an appointment or reset search filters.</p>
                </div>
              ) : (
                appointmentGroups.map((group) => (
                  <div key={group.hospitalName} className="rounded-[10px] border border-slate-200/80 bg-white shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/80 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-[10px] bg-emerald-50 text-teal-700 border border-teal-200/60 font-bold shadow-2xs shrink-0">
                          <Building2 className="size-5" />
                        </span>
                        <div className="flex flex-col justify-center">
                          <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight tracking-tight">{group.hospitalName}</h3>
                          {group.address ? (
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium leading-none">
                              <MapPin className="size-3 text-slate-400 shrink-0" />
                              <span className="truncate">{group.address}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-0.5 text-xs font-black text-teal-800 border border-teal-200/60 shadow-2xs shrink-0">
                        {group.appointments.length} Appointment{group.appointments.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm table-auto">
                        <thead className="bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                          <tr>
                            <th className="px-6 py-3.5 w-24 text-center whitespace-nowrap">Queue #</th>
                            <th className="px-5 py-3.5 min-w-[200px] whitespace-nowrap">Patient Details</th>
                            <th className="px-5 py-3.5 w-56 whitespace-nowrap">Slot Interval</th>
                            <th className="px-4 py-3.5 w-32 text-center whitespace-nowrap">Status</th>
                            <th className="px-4 py-3.5 w-28 text-center whitespace-nowrap">Payment</th>
                            <th className="px-6 py-3.5 w-44 text-right whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.appointments.map((appointment) => {
                            const id = recordId(appointment);
                            const status = (appointment.appointmentStatus || appointment.status || "pending").toLowerCase();
                            const isBusy = updatingAppointmentId === id;

                            return (
                              <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                                  <span className="inline-flex items-center justify-center gap-1 min-w-[70px] px-2.5 py-1.5 rounded-xl bg-teal-50 text-teal-900 border border-teal-200/80 font-black text-xs shadow-xs tracking-tight whitespace-nowrap">
                                    <span className="text-teal-600 font-bold text-[11px]">#</span>
                                    <span>{String(appointment.queueNumber ?? 1).padStart(2, "0")}</span>
                                  </span>
                                </td>
                                <td className="px-5 py-4 align-middle">
                                  <div className="flex items-center gap-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 font-black text-xs border border-slate-200/60 shadow-xs">
                                      {(appointment.patientName || "P").charAt(0).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="font-extrabold text-slate-900 text-sm truncate">{appointment.patientName || "Patient"}</p>
                                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5 whitespace-nowrap">
                                        <Phone className="size-3 text-teal-600 shrink-0" />
                                        <span>{appointment.mobileNumber}</span>
                                      </p>
                                      {appointment.address ? (
                                        <p className="text-[11px] text-slate-400 truncate max-w-xs font-medium mt-0.5 flex items-center gap-1">
                                          <MapPin className="size-3 text-slate-400 shrink-0" />
                                          <span className="truncate">{appointment.address}</span>
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap align-middle">
                                  {(() => {
                                    const slotInfo = resolveAppointmentSlotInterval(appointment, data.schedules);
                                    if (slotInfo.timeRange === "Not scheduled") {
                                      return <span className="text-xs text-slate-400 italic">Not scheduled</span>;
                                    }
                                    return (
                                      <div className="space-y-0.5">
                                        <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                                          <Clock className="size-3.5 text-teal-600 shrink-0" />
                                          <span>{slotInfo.timeRange}</span>
                                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 ml-0.5">
                                            {slotInfo.durationMins}m
                                          </span>
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-semibold pl-5">
                                          {slotInfo.dateFormatted}
                                        </p>
                                      </div>
                                    );
                                  })()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs ${
                                    status === "approved"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : status === "cancelled"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                  }`}>
                                    <span className={`size-1.5 rounded-full ${
                                      status === "approved" ? "bg-emerald-500 animate-pulse" : status === "cancelled" ? "bg-rose-500" : "bg-amber-500 animate-pulse"
                                    }`}></span>
                                    {status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-center align-middle">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                                    appointment.paymentStatus === "paid"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                      : "bg-slate-100 text-slate-700 border border-slate-200/60"
                                  }`}>
                                    {appointment.paymentStatus || "pending"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap align-middle">
                                  <div className="inline-flex items-center justify-end gap-2">
                                    {status !== "approved" && (
                                      <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleUpdateAppointmentStatus(appointment, "approved")}
                                        className="inline-flex items-center justify-center size-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md shadow-xs transition-all active:scale-95 disabled:opacity-50"
                                        title="Approve Appointment"
                                        aria-label="Approve Appointment"
                                      >
                                        {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4 stroke-[2.5]" />}
                                      </button>
                                    )}
                                    {status !== "cancelled" && (
                                      <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleUpdateAppointmentStatus(appointment, "cancelled")}
                                        className="inline-flex items-center justify-center size-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md shadow-xs transition-all active:scale-95 disabled:opacity-50"
                                        title="Cancel Appointment"
                                        aria-label="Cancel Appointment"
                                      >
                                        {isBusy ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4 stroke-[2.5]" />}
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => openEditAppointmentModal(appointment)}
                                      className="inline-flex items-center justify-center size-9 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-md shadow-xs transition-all active:scale-95"
                                      title="Edit Appointment"
                                      aria-label="Edit Appointment"
                                    >
                                      <Edit2 className="size-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => confirmDeleteAppointment(id, appointment.patientName || "Appointment")}
                                      className="inline-flex items-center justify-center size-9 rounded-xl bg-rose-50/60 text-rose-600 border border-rose-200/70 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md shadow-xs transition-all active:scale-95"
                                      title="Delete Appointment"
                                      aria-label="Delete Appointment"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {/* ================= MODAL: HOSPITAL / CLINIC ================= */}
      {isHospitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 shadow-xs">
                  <Building2 className="size-5.5" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {editingHospital ? "Edit Hospital / Clinic" : "Add New Hospital / Clinic"}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-teal-500"></span>
                    Collection Type: <span className="text-teal-700 font-mono">hospital</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHospitalModalOpen(false)}
                className="grid size-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveHospital} className="mt-6 space-y-5">
              {/* SECTION: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">1. General Details</span>
                </div>

                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Hospital / Clinic Name <span className="text-rose-500">*</span>
                  <Input
                    name="name"
                    defaultValue={editingHospital?.name || ""}
                    placeholder="e.g. Central Health Clinic & Chamber"
                    required
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                  />
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Helpline / Phone
                    <Input
                      name="phone"
                      defaultValue={editingHospital?.phone || ""}
                      placeholder="+88017XXXXXXXX"
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Consultation Fee (BDT)
                    <Input
                      type="number"
                      name="consultationFee"
                      defaultValue={editingHospital?.consultationFee ?? 1000}
                      placeholder="1000"
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <input
                    type="checkbox"
                    id="hospital-active"
                    name="active"
                    value="true"
                    defaultChecked={editingHospital?.active !== false}
                    className="size-5 rounded-lg border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="hospital-active" className="text-xs font-extrabold text-slate-900 cursor-pointer block">
                      Active Chamber / Clinic Status
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      When enabled, this clinic is published and patients can book appointments.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: Location & Maps */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">2. Location & Map Coordinates</span>
                </div>

                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Full Chamber Address <span className="text-rose-500">*</span>
                  <textarea
                    name="address"
                    defaultValue={editingHospital?.address || ""}
                    placeholder="e.g. House 12, Road 8, Block D, Dhanmondi, Dhaka 1205"
                    required
                    rows={2}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Google Maps Direction Link
                    <Input
                      name="googleMapsUrl"
                      defaultValue={editingHospital?.googleMapsUrl || ""}
                      placeholder="https://maps.google.com/?q=..."
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium text-xs"
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Embedded Map URL / Iframe Link
                    <Input
                      name="embeddedMapUrl"
                      defaultValue={editingHospital?.embeddedMapUrl || editingHospital?.mapUrl || ""}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium text-xs"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Latitude Coordinate
                    <Input
                      type="number"
                      step="any"
                      name="latitude"
                      defaultValue={editingHospital?.latitude ?? ""}
                      placeholder="e.g. 23.7925"
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium text-xs"
                    />
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    Longitude Coordinate
                    <Input
                      type="number"
                      step="any"
                      name="longitude"
                      defaultValue={editingHospital?.longitude ?? ""}
                      placeholder="e.g. 90.4078"
                      className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium text-xs"
                    />
                  </label>
                </div>
              </div>

              {/* SECTION: Media & Photo */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">3. Media / Clinic Photo</span>
                </div>

                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Clinic Photo / Image URL
                  <Input
                    name="image"
                    defaultValue={editingHospital?.image || editingHospital?.imageUrl || ""}
                    placeholder="https://example.com/clinic-exterior.jpg"
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium text-xs"
                  />
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsHospitalModalOpen(false)}
                  disabled={saving}
                  className="rounded-2xl h-11 px-5 font-bold border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={saving}
                  className="rounded-2xl h-11 px-7 font-black min-w-32 shadow-sm"
                >
                  {saving ? "Saving Clinic..." : editingHospital ? "Update Hospital" : "Create Hospital"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SCHEDULE ================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/70 shadow-xs">
                  <CalendarClock className="size-5.5 text-teal-700" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingSchedule ? "Edit Schedule Session" : "Create Schedule Session"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Set consultation session timing, slot durations, appointment limits & fees
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="mt-5 space-y-5 overflow-y-auto pr-1">
              {/* Chamber / Hospital Selection Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Building2 className="size-4 text-teal-600" />
                    Chamber / Hospital <span className="text-rose-500">*</span>
                  </label>
                  {scheduleHospitalId && (
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/60">
                      {data.hospitals.find((h) => recordId(h) === scheduleHospitalId)?.name || "Selected"}
                    </span>
                  )}
                </div>

                <div className="relative" ref={modalHospitalRef}>
                  <button
                    type="button"
                    onClick={() => setIsModalHospitalOpen(!isModalHospitalOpen)}
                    className={`w-full h-12 px-4 rounded-2xl border text-sm font-bold flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer ${
                      isModalHospitalOpen
                        ? "border-teal-500 bg-white ring-2 ring-teal-500/20 text-slate-900"
                        : scheduleHospitalId
                        ? "border-teal-300 bg-teal-50/40 text-slate-900"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 truncate">
                      <Building2 className={`size-4.5 shrink-0 ${scheduleHospitalId ? "text-teal-600" : "text-slate-400"}`} />
                      <span className="truncate">
                        {data.hospitals.find((h) => recordId(h) === scheduleHospitalId)?.name || "Select Chamber / Hospital"}
                      </span>
                    </div>
                    <ChevronDown className={`size-4 text-slate-400 shrink-0 transition-transform duration-200 ${isModalHospitalOpen ? "rotate-180 text-teal-600" : ""}`} />
                  </button>

                  {isModalHospitalOpen && (
                    <div className="absolute left-0 top-full mt-2 w-full max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                      {data.hospitals.length === 0 ? (
                        <p className="text-xs text-slate-400 p-4 text-center">No hospitals registered yet.</p>
                      ) : (
                        data.hospitals.map((h) => {
                          const hid = recordId(h);
                          const isSelected = scheduleHospitalId === hid;
                          return (
                            <button
                              key={hid}
                              type="button"
                              onClick={() => {
                                handleHospitalSelect(hid);
                                setIsModalHospitalOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-50 text-teal-900 font-extrabold border border-teal-200/80 shadow-2xs"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="min-w-0 flex-1 mr-3">
                                <p className="font-extrabold text-sm text-slate-900 truncate">{h.name}</p>
                                {h.address && (
                                  <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5 font-medium">
                                    <MapPin className="size-3 text-slate-400 shrink-0" />
                                    <span>{h.address}</span>
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-extrabold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50">
                                  ৳{formatCurrency(h.consultationFee ?? 0)}
                                </span>
                                {isSelected && <Check className="size-4 text-teal-600 shrink-0" />}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Hospital Live Details Mini Banner */}
                {(() => {
                  const selectedHosp = data.hospitals.find((h) => recordId(h) === scheduleHospitalId);
                  if (!selectedHosp) return null;
                  return (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 min-w-0">
                        <MapPin className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-sm font-medium">{selectedHosp.address || "Address not provided"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedHosp.phone && (
                          <span className="text-slate-500 font-semibold flex items-center gap-1">
                            <Phone className="size-3 text-teal-600" />
                            {selectedHosp.phone}
                          </span>
                        )}
                        <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/50">
                          ৳ {formatCurrency(selectedHosp.consultationFee ?? 0)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Schedule Title */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <ClipboardList className="size-3.5 text-teal-600" />
                  Schedule Session Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  placeholder="e.g. City Care Evening Session"
                  required
                  className="h-12 rounded-2xl bg-white border-slate-200 text-sm font-semibold shadow-xs"
                />
              </div>

              {/* Starts At & Ends At Modern Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="size-4 text-teal-600" />
                    Session Timing & Duration <span className="text-rose-500">*</span>
                  </span>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Quick End Time:</span>
                    <button
                      type="button"
                      onClick={() => applyQuickInterval(2)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200/60 shadow-xs"
                    >
                      +2 Hrs
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickInterval(3)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200/60 shadow-xs"
                    >
                      +3 Hrs
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickInterval(4)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors border border-slate-200/60 shadow-xs"
                    >
                      +4 Hrs
                    </button>
                    <button
                      type="button"
                      onClick={applyAutoFitSlots}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors border border-teal-200/60 shadow-xs"
                      title="Calculate end time from Slot Duration × Max Patients"
                    >
                      Fit Slots
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Starts At Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 focus-within:border-teal-500 focus-within:bg-white transition-all shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-teal-600" />
                        Starts At
                      </label>
                      <span className="text-[11px] font-bold text-teal-700">Start Time</span>
                    </div>
                    <Input
                      type="datetime-local"
                      value={scheduleStartsAt}
                      onChange={(e) => handleStartsAtChange(e.target.value)}
                      required
                      className="h-11 rounded-xl bg-white border-slate-200 text-xs font-bold text-slate-900"
                    />
                    <p className="text-[11px] font-semibold text-slate-500 truncate flex items-center gap-1 pt-0.5">
                      <CalendarDays className="size-3 text-slate-400 shrink-0" />
                      <span>{formatDisplayDatePreview(scheduleStartsAt)}</span>
                    </p>
                  </div>

                  {/* Ends At Card */}
                  {(() => {
                    const isInvalid = scheduleStartsAt && scheduleEndsAt && new Date(scheduleEndsAt).getTime() <= new Date(scheduleStartsAt).getTime();
                    return (
                      <div className={`rounded-2xl border p-4 space-y-2 focus-within:bg-white transition-all shadow-xs ${
                        isInvalid
                          ? "border-rose-300 bg-rose-50/40 focus-within:border-rose-500"
                          : "border-slate-200 bg-slate-50/60 focus-within:border-teal-500"
                      }`}>
                        <div className="flex items-center justify-between text-xs">
                          <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                            <Clock className="size-3.5 text-teal-600" />
                            Ends At
                          </label>
                          {isInvalid ? (
                            <span className="text-[11px] font-black text-rose-600 flex items-center gap-1 animate-pulse">
                              <AlertCircle className="size-3" />
                              Must be after Start
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-teal-700">End Time</span>
                          )}
                        </div>
                        <Input
                          type="datetime-local"
                          value={scheduleEndsAt}
                          min={scheduleStartsAt || undefined}
                          onChange={(e) => setScheduleEndsAt(e.target.value)}
                          required
                          className={`h-11 rounded-xl bg-white text-xs font-bold ${
                            isInvalid ? "border-rose-300 text-rose-700" : "border-slate-200 text-slate-900"
                          }`}
                        />
                        <p className={`text-[11px] font-semibold truncate flex items-center gap-1 pt-0.5 ${
                          isInvalid ? "text-rose-600 font-bold" : "text-slate-500"
                        }`}>
                          <CalendarDays className="size-3 shrink-0" />
                          <span>{formatDisplayDatePreview(scheduleEndsAt)}</span>
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Calculated Session Duration & Slot Pill */}
                {(() => {
                  if (!scheduleStartsAt || !scheduleEndsAt) return null;
                  const start = new Date(scheduleStartsAt).getTime();
                  const end = new Date(scheduleEndsAt).getTime();
                  if (isNaN(start) || isNaN(end) || end <= start) return null;
                  const diffMinutes = Math.round((end - start) / 60000);
                  const hrs = Math.floor(diffMinutes / 60);
                  const mins = diffMinutes % 60;
                  const durationStr = hrs > 0 ? `${hrs} hr ${mins > 0 ? `${mins} min` : ""}`.trim() : `${diffMinutes} mins`;
                  const maxPossibleSlots = scheduleSlotDuration > 0 ? Math.floor(diffMinutes / scheduleSlotDuration) : 0;
                  return (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs">
                      <div className="flex items-center gap-2 font-bold text-teal-900">
                        <Sparkles className="size-4 text-teal-600 shrink-0" />
                        <span>Total Session Duration: <strong className="font-black text-teal-950">{durationStr}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-extrabold text-teal-800">
                        <span>Possible Slots: {maxPossibleSlots} ({scheduleSlotDuration}m each)</span>
                        <span>Fee: ৳{scheduleFee}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Slot Duration, Max Patients, Fee, Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Slot (Mins)
                  </label>
                  <Input
                    type="number"
                    min="5"
                    step="5"
                    value={scheduleSlotDuration}
                    onChange={(e) => setScheduleSlotDuration(Number(e.target.value) || 15)}
                    className="h-10 rounded-xl bg-white border-slate-200 font-extrabold text-sm"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Max Patients
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={scheduleMaxAppointments}
                    onChange={(e) => setScheduleMaxAppointments(Number(e.target.value) || 20)}
                    className="h-10 rounded-xl bg-white border-slate-200 font-extrabold text-sm"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Fee (BDT)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    value={scheduleFee}
                    onChange={(e) => setScheduleFee(Number(e.target.value) || 0)}
                    className="h-10 rounded-xl bg-white border-slate-200 font-extrabold text-sm text-teal-800"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Session Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                    {(["scheduled", "completed", "cancelled"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setScheduleStatus(st)}
                        className={`py-2 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                          scheduleStatus === st
                            ? st === "scheduled"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
                              : st === "completed"
                              ? "bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs"
                              : "bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsScheduleModalOpen(false)}
                  disabled={saving}
                  className="rounded-2xl h-11 px-5 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={saving}
                  className="rounded-2xl h-11 px-7 font-black min-w-36 shadow-sm gap-2"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  {saving ? "Saving..." : editingSchedule ? "Update Schedule" : "Create Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PATIENT ================= */}
      {isPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingPatient ? "Edit Patient Profile" : "Register New Patient"}
              </h3>
              <button
                type="button"
                onClick={() => setIsPatientModalOpen(false)}
                className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="mt-5 space-y-4">
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                Full Name <span className="text-rose-500">*</span>
                <Input
                  name="fullName"
                  defaultValue={editingPatient?.fullName || ""}
                  placeholder="e.g. Md. Karim"
                  required
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Mobile Number <span className="text-rose-500">*</span>
                  <Input
                    name="mobileNumber"
                    defaultValue={editingPatient?.mobileNumber || ""}
                    placeholder="018XXXXXXXX"
                    required
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Email
                  <Input
                    type="email"
                    name="email"
                    defaultValue={editingPatient?.email || ""}
                    placeholder="patient@gmail.com"
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Age
                  <Input
                    type="number"
                    name="age"
                    defaultValue={editingPatient?.age || ""}
                    placeholder="35"
                    className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                  Gender
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                    {(["male", "female", "other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("gender-input") as HTMLInputElement;
                          if (input) input.value = g;
                        }}
                        className="py-2.5 rounded-xl text-xs font-extrabold capitalize text-slate-700 hover:bg-white hover:shadow-xs transition-all focus:bg-white focus:shadow-xs focus:text-teal-900"
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="gender"
                    id="gender-input"
                    defaultValue={editingPatient?.gender || "male"}
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                Address
                <Input
                  name="address"
                  defaultValue={editingPatient?.address || ""}
                  placeholder="Village / Road / Area"
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                Emergency Contact
                <Input
                  name="emergencyContact"
                  defaultValue={editingPatient?.emergencyContact || ""}
                  placeholder="Relative phone number"
                  className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-medium"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsPatientModalOpen(false)}
                  disabled={saving}
                  className="rounded-2xl h-11 px-5 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={saving}
                  className="rounded-2xl h-11 px-6 font-black min-w-28 shadow-sm"
                >
                  {saving ? "Saving..." : "Save Patient"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: APPOINTMENT ================= */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/70 shadow-xs">
                  <ClipboardList className="size-5.5 text-teal-700" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingAppointment ? "Edit Appointment Record" : "Manual Appointment Booking"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Register or modify patient booking, consultation slot & serial number
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="mt-5 space-y-5 overflow-y-auto pr-1">
              {/* Patient Details Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="size-4 text-teal-600" />
                    Patient Information <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/60">
                    Serial #{String(appointmentQueue || 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={appointmentPatientName}
                      onChange={(e) => setAppointmentPatientName(e.target.value)}
                      placeholder="e.g. Md. Kabir"
                      required
                      className="h-11 rounded-xl bg-white border-slate-200 text-sm font-semibold shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={appointmentMobile}
                      onChange={(e) => setAppointmentMobile(e.target.value)}
                      placeholder="018XXXXXXXX"
                      required
                      className="h-11 rounded-xl bg-white border-slate-200 text-sm font-semibold shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                      Queue Serial #
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={appointmentQueue}
                      onChange={(e) => setAppointmentQueue(Number(e.target.value) || 1)}
                      className="h-11 rounded-xl bg-white border-slate-200 text-sm font-black text-teal-800 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Patient Address / Area
                  </label>
                  <Input
                    value={appointmentAddress}
                    onChange={(e) => setAppointmentAddress(e.target.value)}
                    placeholder="e.g. Dhanmondi 27, Dhaka"
                    className="h-11 rounded-xl bg-white border-slate-200 text-sm font-medium shadow-xs"
                  />
                </div>
              </div>

              {/* Schedule Session & Slot Timing */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CalendarClock className="size-4 text-teal-600" />
                  Consultation Schedule Session <span className="text-rose-500">*</span>
                </label>

                <div className="relative" ref={modalScheduleRef}>
                  <button
                    type="button"
                    onClick={() => setIsModalScheduleOpen(!isModalScheduleOpen)}
                    className={`w-full h-12 px-4 rounded-2xl border text-sm font-bold flex items-center justify-between gap-2 shadow-xs transition-all cursor-pointer ${
                      isModalScheduleOpen
                        ? "border-teal-500 bg-white ring-2 ring-teal-500/20 text-slate-900"
                        : appointmentScheduleId
                        ? "border-teal-300 bg-teal-50/40 text-slate-900"
                        : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 truncate">
                      <CalendarClock className={`size-4.5 shrink-0 ${appointmentScheduleId ? "text-teal-600" : "text-slate-400"}`} />
                      <span className="truncate">
                        {(() => {
                          const selectedSched = data.schedules.find((s) => recordId(s) === appointmentScheduleId);
                          if (!selectedSched) return "Select Consultation Schedule Session";
                          return `${selectedSched.title} (${resolveHospitalName(selectedSched.hospital, selectedSched.hospitalId)})`;
                        })()}
                      </span>
                    </div>
                    <ChevronDown className={`size-4 text-slate-400 shrink-0 transition-transform duration-200 ${isModalScheduleOpen ? "rotate-180 text-teal-600" : ""}`} />
                  </button>

                  {isModalScheduleOpen && (
                    <div className="absolute left-0 top-full mt-2 w-full max-h-64 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                      {data.schedules.length === 0 ? (
                        <p className="text-xs text-slate-400 p-4 text-center">No active schedules found.</p>
                      ) : (
                        data.schedules.map((s) => {
                          const sid = recordId(s);
                          const isSelected = appointmentScheduleId === sid;
                          const hospName = resolveHospitalName(s.hospital, s.hospitalId);
                          return (
                            <button
                              key={sid}
                              type="button"
                              onClick={() => {
                                handleAppointmentScheduleChange(sid);
                                setIsModalScheduleOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-teal-50 text-teal-900 font-extrabold border border-teal-200/80 shadow-2xs"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="min-w-0 flex-1 mr-3">
                                <p className="font-extrabold text-sm text-slate-900 truncate">{s.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                                  <span className="text-teal-700 font-semibold">{hospName}</span>
                                  {s.startsAt && <span>• {formatDateTime(s.startsAt)}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-extrabold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {s.slotDurationMinutes || 15}m
                                </span>
                                {isSelected && <Check className="size-4 text-teal-600 shrink-0" />}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-teal-600" />
                        Slot Start Time
                      </span>
                    </div>
                    <Input
                      type="datetime-local"
                      value={appointmentSlotStart}
                      onChange={(e) => setAppointmentSlotStart(e.target.value)}
                      className="h-10 rounded-lg bg-slate-50 border-slate-200 text-xs font-bold"
                    />
                    <p className="text-[10px] font-medium text-slate-400 truncate">
                      {formatDisplayDatePreview(appointmentSlotStart)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-teal-600" />
                        Slot End Time
                      </span>
                    </div>
                    <Input
                      type="datetime-local"
                      value={appointmentSlotEnd}
                      onChange={(e) => setAppointmentSlotEnd(e.target.value)}
                      className="h-10 rounded-lg bg-slate-50 border-slate-200 text-xs font-bold"
                    />
                    <p className="text-[10px] font-medium text-slate-400 truncate">
                      {formatDisplayDatePreview(appointmentSlotEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status, Payment, Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Appointment Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                    {(["pending", "approved", "cancelled"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setAppointmentStatusVal(st)}
                        className={`py-2 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                          appointmentStatusVal === st
                            ? st === "approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
                              : st === "cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs"
                              : "bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Payment Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                    {(["pending", "paid", "failed"] as const).map((pst) => (
                      <button
                        key={pst}
                        type="button"
                        onClick={() => setAppointmentPaymentStatusVal(pst)}
                        className={`py-2 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                          appointmentPaymentStatusVal === pst
                            ? pst === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
                              : pst === "failed"
                              ? "bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs"
                              : "bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                      >
                        {pst}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <MessageSquare className="size-3.5 text-teal-600" />
                  Symptoms / Doctor Notes
                </label>
                <Input
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="e.g. Follow-up consultation, fever, abdominal checkup"
                  className="h-12 rounded-2xl bg-white border-slate-200 text-sm font-medium shadow-xs"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  disabled={saving}
                  className="rounded-2xl h-11 px-5 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={saving}
                  className="rounded-2xl h-11 px-7 font-black min-w-36 shadow-sm gap-2"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  {saving ? "Saving..." : editingAppointment ? "Update Appointment" : "Confirm Booking"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DRAWER: PATIENT HISTORY ================= */}
      {selectedPatientForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-7 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-gradient-to-tr from-teal-50 to-emerald-100 text-teal-800 font-extrabold grid place-items-center text-base border border-teal-200/60 shadow-xs">
                    {(selectedPatientForDrawer.fullName || "P").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{selectedPatientForDrawer.fullName}</h3>
                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                      <Phone className="size-3 text-teal-600" />
                      {selectedPatientForDrawer.mobileNumber}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatientForDrawer(null)}
                  className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4 text-xs">
                <div className="rounded-3xl bg-slate-50/80 p-5 space-y-2.5 border border-slate-100 shadow-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">Age & Gender</span>
                    <span className="font-bold text-slate-900">
                      {selectedPatientForDrawer.age ? `${selectedPatientForDrawer.age} yrs` : "-"} • {selectedPatientForDrawer.gender || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">Address</span>
                    <span className="font-bold text-slate-900">{selectedPatientForDrawer.address || "N/A"}</span>
                  </div>
                  {selectedPatientForDrawer.emergencyContact ? (
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase font-extrabold text-[10px] tracking-wider">Emergency Contact</span>
                      <span className="font-bold text-slate-900">{selectedPatientForDrawer.emergencyContact}</span>
                    </div>
                  ) : null}
                </div>

                <h4 className="font-black text-slate-900 text-sm pt-4 flex items-center gap-2">
                  <ClipboardList className="size-4 text-teal-700" />
                  Appointment History
                </h4>

                {data.appointments.filter((a) => a.mobileNumber === selectedPatientForDrawer.mobileNumber).length === 0 ? (
                  <p className="text-slate-400 py-8 text-center italic text-xs font-medium">No appointments booked by this patient yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.appointments
                      .filter((a) => a.mobileNumber === selectedPatientForDrawer.mobileNumber)
                      .map((appt) => {
                        const { name } = getAppointmentHospital(appt);
                        const status = (appt.appointmentStatus || appt.status || "pending").toLowerCase();
                        return (
                          <div key={recordId(appt)} className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs">{name}</span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : status === "cancelled"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>
                                <span className={`size-1 rounded-full ${status === "approved" ? "bg-emerald-500" : status === "cancelled" ? "bg-rose-500" : "bg-amber-500"}`}></span>
                                {status.toUpperCase()}
                              </span>
                            </div>
                            {(() => {
                              const slotInfo = resolveAppointmentSlotInterval(appt, data.schedules);
                              if (slotInfo.timeRange === "Not scheduled") return null;
                              return (
                                <div className="text-[11px] text-slate-600 font-semibold flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3 text-teal-600" />
                                    {slotInfo.timeRange}
                                  </span>
                                  <span className="text-slate-400 font-medium">{slotInfo.dateFormatted}</span>
                                </div>
                              );
                            })()}
                            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                              <span className="font-extrabold text-teal-800">Queue #{appt.queueNumber || 1}</span>
                              <span className="text-slate-500 font-semibold">{appt.paymentStatus || "pending"}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => setSelectedPatientForDrawer(null)}
              className="w-full rounded-2xl h-11 mt-6 font-bold"
            >
              Close History Drawer
            </Button>
          </div>
        </div>
      )}

      {/* SweetAlert2 Popup Modal */}
      <SweetAlertModal
        config={swal}
        onClose={() => setSwal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
