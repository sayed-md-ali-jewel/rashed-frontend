"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Check, ChevronDown, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { generateSlots } from "@/lib/booking";
import type { Schedule, WebsiteSetting } from "@/lib/types";
import { formatSlotRange12 } from "@/lib/utils";

const appointmentSchema = z.object({
  patientName: z.string().trim().min(2, "Please enter your full name"),
  address: z.string().trim().optional().or(z.literal("")),
  mobileNumber: z.string().trim().regex(/^(\+?88)?01[3-9]\d{8}$/, "Please enter a valid Bangladeshi mobile number"),
  slotStart: z.string().min(1, "Please select an appointment slot")
});

export function AppointmentForm({
  schedule,
  content,
  initialPatient
}: {
  schedule: Schedule;
  content: WebsiteSetting["content"];
  initialPatient?: { fullName?: string; mobileNumber?: string; address?: string };
}) {
  const slots = useMemo(() => generateSlots(schedule), [schedule]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const activeSlot = useMemo(() => slots.find((s) => s.start === selectedSlot), [slots, selectedSlot]);
  const availableSlotsCount = useMemo(() => slots.filter((s) => s.available).length, [slots]);
  const bookedSlotsCount = useMemo(() => slots.filter((s) => !s.available).length, [slots]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const parsed = appointmentSchema.safeParse({
      patientName: formData.get("patientName"),
      address: formData.get("address"),
      mobileNumber: formData.get("mobileNumber"),
      slotStart: formData.get("slotStart") || selectedSlot
    });

    if (!parsed.success) {
      setLoading(false);
      setState("error");
      setMessage(content.appointmentValidationMessage || "Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, scheduleId: schedule.id })
      });

      const result = await response.json();
      setState(response.ok ? "success" : "error");
      setMessage(
        response.ok
          ? content.appointmentSuccessMessage.replace("{queueNumber}", String(result.queueNumber ?? ""))
          : result.error ?? "Failed to book appointment"
      );
    } catch {
      setState("error");
      setMessage("Failed to connect to booking server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-24 rounded-3xl border border-line bg-white p-7 sm:p-9 lg:p-10 shadow-lg transition-all">
      <form action={onSubmit}>
        <div className="mb-7 pb-6 border-b border-line">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3.5 py-1 text-xs font-semibold text-ink">
            <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
            {content.appointmentFormBadge || "Instant Serial Booking"}
          </div>
          <h2 className="mt-3.5 text-2xl sm:text-3xl font-extrabold leading-tight text-ink">
            {content.appointmentFormTitle || "Book Your Serial Slot"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {content.appointmentFormDescription || "Select your preferred slot and enter patient details."}
          </p>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <span>
              {content.patientNameLabel || "Patient Name"} <span className="text-red-500">*</span>
            </span>
            <Input
              name="patientName"
              defaultValue={initialPatient?.fullName || ""}
              placeholder={content.patientNamePlaceholder || "Enter full name"}
              autoComplete="name"
              required
              className="h-12 px-4 rounded-2xl border border-line bg-panel text-sm font-normal text-ink focus:bg-white focus:ring-2 focus:ring-blue transition-all"
            />
          </label>

          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <span>
              {content.patientAddressLabel || "Address"} <span className="text-muted text-[11px] font-normal lowercase">(optional)</span>
            </span>
            <Input
              name="address"
              defaultValue={initialPatient?.address || ""}
              placeholder={content.patientAddressPlaceholder || "Patient village / area"}
              autoComplete="street-address"
              className="h-12 px-4 rounded-2xl border border-line bg-panel text-sm font-normal text-ink focus:bg-white focus:ring-2 focus:ring-blue transition-all"
            />
          </label>

          <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <span>
              {content.patientMobileLabel || "Mobile Number"} <span className="text-red-500">*</span>
            </span>
            <Input
              name="mobileNumber"
              defaultValue={initialPatient?.mobileNumber || ""}
              placeholder={content.patientMobilePlaceholder || "018XXXXXXXX"}
              autoComplete="tel"
              required
              className="h-12 px-4 rounded-2xl border border-line bg-panel text-sm font-normal text-ink focus:bg-white focus:ring-2 focus:ring-blue transition-all"
            />
          </label>

          {/* Modern Slot Selector */}
          <div className="grid gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <div className="flex items-center justify-between">
              <span>
                {content.patientSlotLabel || "Consultation Slot"} <span className="text-red-500">*</span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 normal-case bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {availableSlotsCount} available
              </span>
            </div>

            <input type="hidden" name="slotStart" value={selectedSlot} />

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-13 px-4 py-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 ${
                  isOpen
                    ? "border-blue ring-2 ring-blue/20 bg-white shadow-md"
                    : selectedSlot
                    ? "border-emerald-400 bg-emerald-50/30 hover:border-blue shadow-sm"
                    : "border-line bg-panel hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock3 className={`size-4.5 shrink-0 ${selectedSlot ? "text-emerald-600" : "text-muted"}`} />
                  {activeSlot ? (
                    <span className="text-sm font-bold text-ink truncate">
                      {formatSlotRange12(activeSlot.start, activeSlot.end)}
                    </span>
                  ) : (
                    <span className="text-sm font-normal text-muted truncate">
                      {content.patientSlotPlaceholder || "Choose an available slot"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeSlot ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                      <span className="size-1.5 rounded-full bg-emerald-600"></span>
                      Available
                    </span>
                  ) : null}
                  <ChevronDown className={`size-4.5 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-line bg-white shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 text-xs font-semibold text-muted">
                    <span>Select Time Slot</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="size-2 rounded-full bg-emerald-500"></span>
                        {availableSlotsCount} Available
                      </span>
                      {bookedSlotsCount > 0 && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <span className="size-1.5 rounded-full bg-zinc-300"></span>
                          {bookedSlotsCount} Booked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-2">
                    {slots.length === 0 ? (
                      <div className="p-8 text-center text-sm text-muted">No slots available for this session.</div>
                    ) : (
                      slots.map((slot) => {
                        const isSelected = selectedSlot === slot.start;
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedSlot(slot.start);
                                setIsOpen(false);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                              !slot.available
                                ? "opacity-40 cursor-not-allowed bg-zinc-50/70"
                                : isSelected
                                ? "bg-blue/10 border border-blue text-blue font-bold shadow-sm"
                                : "hover:bg-slate-50 cursor-pointer text-ink"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock3 className={`size-4 ${isSelected ? "text-blue" : slot.available ? "text-slate-400" : "text-zinc-300"}`} />
                              <span className={`text-sm ${isSelected ? "font-bold text-blue" : slot.available ? "font-medium text-ink" : "text-zinc-400 line-through"}`}>
                                {formatSlotRange12(slot.start, slot.end)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              {slot.available ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                  <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 border border-zinc-200">
                                  Booked
                                </span>
                              )}
                              {isSelected && <Check className="size-4.5 text-blue shrink-0" />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={loading || !selectedSlot}
            className="w-full mt-3 h-14 rounded-full py-4 text-base font-extrabold gap-2.5 shadow-md hover:shadow-xl transition-all"
          >
            {loading ? "Processing Booking..." : content.appointmentSubmitButton || "Confirm & Book Slot"}
            <span className="grid size-6 place-items-center rounded-full bg-ink text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Button>

          {message ? (
            <Alert variant={state === "success" ? "success" : "error"} className="rounded-2xl mt-3">
              {message}
            </Alert>
          ) : null}
        </div>
      </form>
    </div>
  );
}
