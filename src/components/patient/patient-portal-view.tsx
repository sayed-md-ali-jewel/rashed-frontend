"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Edit2,
  FileText,
  MessageSquare,
  Phone,
  UserRound,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { formatDateTime } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { formatLocalizedTime } from "@/lib/i18n/translations";

export type PatientAppointment = {
  _id: string;
  status?: string;
  slotStart?: string;
  slotEnd?: string;
  queueNumber?: number;
  hospitalName?: string;
  patientMessage?: string;
  fee?: number;
  createdAt?: string;
};

export type PatientMedicalRecord = {
  _id: string;
  visitDate?: string;
  hospitalName?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  doctorNotes?: string;
  followUpDate?: string;
};

export type PatientPayment = {
  _id: string;
  hospitalName?: string;
  totalAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
  status?: string;
};

export type PatientSession = {
  fullName: string;
  mobileNumber: string;
  address?: string;
};

const ITEMS_PER_PAGE = 20;

export function PatientPortalView({
  initialPatient,
  appointments,
  records,
  payments
}: {
  initialPatient: PatientSession;
  appointments: PatientAppointment[];
  records: PatientMedicalRecord[];
  payments: PatientPayment[];
}) {
  const { t, translate, formatCurrency, formatNumber, language } = useLanguage();
  const [patient, setPatient] = useState<PatientSession>(initialPatient);
  const [activeTab, setActiveTab] = useState<"appointments" | "records" | "payments">("appointments");

  // Pagination states
  const [apptPage, setApptPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);

  // Edit number modal state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newName, setNewName] = useState(patient.fullName);
  const [newMobile, setNewMobile] = useState(patient.mobileNumber);
  const [newAddress, setNewAddress] = useState(patient.address || "");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    setPhoneSuccess("");
    setSavingPhone(true);

    try {
      const res = await fetch("/api/auth/patient/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newName,
          mobileNumber: newMobile,
          oldMobileNumber: patient.mobileNumber,
          address: newAddress
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPhoneError(data.error || "Failed to update profile");
      } else {
        setPatient({
          fullName: newName,
          mobileNumber: newMobile,
          address: newAddress
        });
        setPhoneSuccess(t("portal.profileUpdated"));
        setTimeout(() => {
          setIsEditingPhone(false);
          setPhoneSuccess("");
        }, 1500);
      }
    } catch {
      setPhoneError("Network error. Please try again.");
    } finally {
      setSavingPhone(false);
    }
  }

  // Pagination helper
  function paginateList<T>(list: T[], page: number) {
    const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    const items = list.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    return { items, totalPages, currentPage: safePage, totalItems: list.length };
  }

  const pagedAppts = paginateList(appointments, apptPage);
  const pagedRecords = paginateList(records, recordsPage);
  const pagedPayments = paginateList(payments, paymentsPage);

  return (
    <div className="space-y-8">
      {/* ROW 1: Patient Identity & Book New Consultation Side-by-Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Patient Identity */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-ink">
                <UserRound className="size-3.5 text-blue" />
                {t("portal.identityBadge")}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewName(patient.fullName);
                  setNewMobile(patient.mobileNumber);
                  setNewAddress(patient.address || "");
                  setIsEditingPhone(true);
                }}
                className="h-8 gap-1.5 text-xs font-semibold rounded-full border-blue/30 text-blue hover:bg-blue/5 hover:border-blue cursor-pointer"
              >
                <Edit2 className="size-3.5" />
                {t("portal.changeNumber")}
              </Button>
            </div>

            <h2 className="mt-4 text-2xl font-extrabold text-ink">
              {translate(patient.fullName) || t("portal.identityBadge")}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {t("portal.profileDetailsDesc")}
            </p>

            <div className="mt-5 grid gap-3 rounded-2xl border border-line bg-panel p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t("booking.mobileNumber")}</span>
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <Phone className="size-3.5 text-blue" />
                  {patient.mobileNumber || t("portal.notProvided")}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t("portal.registeredName")}</span>
                <span className="font-bold text-ink">{translate(patient.fullName)}</span>
              </div>
              {patient.address ? (
                <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t("booking.address")}</span>
                  <span className="font-medium text-ink truncate max-w-[200px]">{translate(patient.address)}</span>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-muted">
            {t("portal.smsTip")}
          </p>
        </div>

        {/* Card 2: Book New Consultation */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-sm transition hover:shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold text-ink">
              <CalendarDays className="size-3.5 text-blue" />
              {t("portal.scheduleVisitBadge")}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">{t("portal.bookNewConsultation")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t("portal.bookNewDesc")}
            </p>

            <div className="mt-5 rounded-2xl border border-blue/20 bg-blue/5 p-4 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-blue flex items-center gap-1.5">
                <Check className="size-4 text-blue" /> {t("portal.autoPopulatedTitle")}
              </p>
              <p className="text-[12px] leading-relaxed text-muted">
                {t("portal.autoPopulatedDesc")}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/appointments">
              <Button variant="gold" size="lg" className="w-full h-12 rounded-full font-bold gap-2 text-sm shadow-sm hover:shadow-md cursor-pointer">
                {t("portal.browseSchedules")}
                <span className="grid size-5 place-items-center rounded-full bg-ink text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Phone Number / Profile Modal */}
      {isEditingPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in-50">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <h3 className="text-xl font-bold text-ink">{t("portal.editModalTitle")}</h3>
              <button
                type="button"
                onClick={() => setIsEditingPhone(false)}
                className="grid size-8 place-items-center rounded-full text-muted hover:bg-slate-100 hover:text-ink cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                {t("booking.patientName")} <span className="text-red-500">*</span>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-panel"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                {t("booking.mobileNumber")} <span className="text-red-500">*</span>
                <Input
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="018XXXXXXXX"
                  required
                  className="h-11 rounded-xl bg-panel"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                {t("booking.address")} <span className="text-muted text-[10px] lowercase font-normal">{t("booking.addressOptional")}</span>
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder={t("booking.addressPlaceholder")}
                  className="h-11 rounded-xl bg-panel"
                />
              </label>

              {phoneError && <Alert variant="error">{phoneError}</Alert>}
              {phoneSuccess && <Alert variant="success">{phoneSuccess}</Alert>}

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsEditingPhone(false)}
                  disabled={savingPhone}
                  className="rounded-full cursor-pointer"
                >
                  {t("portal.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={savingPhone}
                  className="rounded-full font-bold min-w-28 cursor-pointer"
                >
                  {savingPhone ? t("portal.saving") : t("portal.saveChanges")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROW 2: Tabbed Section (Appointment History, Medical Records, Payment Records) */}
      <div className="rounded-3xl border border-line bg-white shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
        <div className="flex border-b border-line bg-panel/60 px-4 sm:px-6 pt-3 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "appointments"
                ? "border-blue text-blue bg-white rounded-t-xl shadow-xs"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <ClipboardList className="size-4" />
            {t("portal.tabAppointments")}
            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${activeTab === "appointments" ? "bg-blue/10 text-blue" : "bg-slate-200 text-slate-600"}`}>
              {formatNumber(appointments.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("records")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "records"
                ? "border-blue text-blue bg-white rounded-t-xl shadow-xs"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <FileText className="size-4" />
            {t("portal.tabRecords")}
            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${activeTab === "records" ? "bg-blue/10 text-blue" : "bg-slate-200 text-slate-600"}`}>
              {formatNumber(records.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "payments"
                ? "border-blue text-blue bg-white rounded-t-xl shadow-xs"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Banknote className="size-4" />
            {t("portal.tabPayments")}
            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${activeTab === "payments" ? "bg-blue/10 text-blue" : "bg-slate-200 text-slate-600"}`}>
              {formatNumber(payments.length)}
            </span>
          </button>
        </div>

        {/* Tab 1: Appointment History */}
        {activeTab === "appointments" && (
          <div className="p-6 sm:p-8 space-y-5">
            {pagedAppts.items.length === 0 ? (
              <div className="py-12 text-center text-muted">
                <ClipboardList className="mx-auto size-12 text-slate-300 mb-3" />
                <p className="font-bold text-ink">{t("portal.noAppointments")}</p>
                <p className="text-xs mt-1">{t("portal.noAppointmentsDesc")}</p>
                <Link href="/appointments" className="mt-4 inline-block">
                  <Button variant="gold" size="sm" className="rounded-full font-bold cursor-pointer">
                    {t("portal.bookFirstAppt")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pagedAppts.items.map((appointment) => {
                  const status = appointment.status || "pending";
                  const queueNum = appointment.queueNumber ? formatNumber(appointment.queueNumber) : "-";
                  return (
                    <div
                      key={appointment._id}
                      className="rounded-2xl border border-line bg-panel p-5 transition hover:bg-white hover:shadow-md space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Badge
                          variant={
                            status === "approved"
                              ? "success"
                              : status === "cancelled"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {status.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-bold text-blue bg-blue/10 px-2.5 py-1 rounded-full border border-blue/20">
                          {t("portal.queueNumber", { number: queueNum })}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-ink text-base">
                          {translate(appointment.hospitalName) || "Chamber Visit"}
                        </h4>
                        {appointment.slotStart && (
                          <p className="text-xs font-medium text-muted mt-1">
                            {t("portal.slot")}{" "}
                            <span className="text-ink font-semibold">
                              {formatLocalizedTime(formatDateTime(appointment.slotStart), language)}
                            </span>
                          </p>
                        )}
                      </div>

                      {appointment.patientMessage && (
                        <div className="flex items-start gap-2 rounded-xl bg-white p-3 border border-line text-xs text-muted">
                          <MessageSquare className="size-3.5 text-blue shrink-0 mt-0.5" />
                          <span>{translate(appointment.patientMessage)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {pagedAppts.totalPages > 1 && (
              <PaginationBar
                currentPage={pagedAppts.currentPage}
                totalPages={pagedAppts.totalPages}
                totalItems={pagedAppts.totalItems}
                onPageChange={setApptPage}
              />
            )}
          </div>
        )}

        {/* Tab 2: Medical Records */}
        {activeTab === "records" && (
          <div className="p-6 sm:p-8 space-y-5">
            {pagedRecords.items.length === 0 ? (
              <div className="py-12 text-center text-muted">
                <FileText className="mx-auto size-12 text-slate-300 mb-3" />
                <p className="font-bold text-ink">{t("portal.noRecords")}</p>
                <p className="text-xs mt-1">{t("portal.noRecordsDesc")}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pagedRecords.items.map((record) => (
                  <div key={record._id} className="rounded-2xl border border-line bg-panel p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue text-sm">{translate(record.hospitalName) || "Clinic Visit"}</span>
                      {record.visitDate && (
                        <span className="text-xs text-muted font-medium">
                          {formatLocalizedTime(formatDateTime(record.visitDate), language)}
                        </span>
                      )}
                    </div>
                    {record.diagnosis && (
                      <p className="text-sm font-semibold text-ink">
                        {t("portal.diagnosis")} <span className="font-normal text-[#444]">{translate(record.diagnosis)}</span>
                      </p>
                    )}
                    {record.prescription && (
                      <div className="rounded-xl bg-white p-3 border border-line text-xs font-mono text-ink">
                        {record.prescription}
                      </div>
                    )}
                    {record.doctorNotes && (
                      <p className="text-xs text-muted italic">{t("portal.notes")} {translate(record.doctorNotes)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagedRecords.totalPages > 1 && (
              <PaginationBar
                currentPage={pagedRecords.currentPage}
                totalPages={pagedRecords.totalPages}
                totalItems={pagedRecords.totalItems}
                onPageChange={setRecordsPage}
              />
            )}
          </div>
        )}

        {/* Tab 3: Payment Records */}
        {activeTab === "payments" && (
          <div className="p-6 sm:p-8 space-y-5">
            {pagedPayments.items.length === 0 ? (
              <div className="py-12 text-center text-muted">
                <Banknote className="mx-auto size-12 text-slate-300 mb-3" />
                <p className="font-bold text-ink">{t("portal.noPayments")}</p>
                <p className="text-xs mt-1">{t("portal.noPaymentsDesc")}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pagedPayments.items.map((payment) => (
                  <div key={payment._id} className="rounded-2xl border border-line bg-panel p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge variant={payment.status === "paid" ? "success" : payment.status === "failed" ? "danger" : "warning"}>
                        {(payment.status || "pending").toUpperCase()}
                      </Badge>
                      <span className="text-base font-extrabold text-ink">{formatCurrency(payment.totalAmount ?? 0)}</span>
                    </div>
                    <p className="text-xs font-bold text-ink">{translate(payment.hospitalName) || "Consultation Chamber"}</p>
                    <div className="flex items-center justify-between text-xs text-muted border-t border-line/60 pt-2">
                      <span>
                        {t("portal.method")}{" "}
                        {payment.paymentMethod === "cash" || payment.paymentMethod === "Cash" || !payment.paymentMethod
                          ? t("portal.cash")
                          : payment.paymentMethod}
                      </span>
                      <span>
                        {payment.paymentDate ? formatLocalizedTime(formatDateTime(payment.paymentDate), language) : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagedPayments.totalPages > 1 && (
              <PaginationBar
                currentPage={pagedPayments.currentPage}
                totalPages={pagedPayments.totalPages}
                totalItems={pagedPayments.totalItems}
                onPageChange={setPaymentsPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  const { t, formatNumber } = useLanguage();
  const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-4 text-xs text-muted">
      <span>
        {t("portal.showingPagination", {
          start: formatNumber(start),
          end: formatNumber(end),
          total: formatNumber(totalItems)
        })}
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 rounded-lg gap-1 text-xs cursor-pointer"
        >
          <ChevronLeft className="size-3.5" />
          {t("portal.prev")}
        </Button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`size-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive ? "bg-blue text-white shadow-xs" : "border border-line bg-panel text-ink hover:bg-slate-100"
              }`}
            >
              {formatNumber(page)}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 rounded-lg gap-1 text-xs cursor-pointer"
        >
          {t("portal.next")}
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
