"use client";

import Link from "next/link";
import { Building2, Calendar, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import type { Hospital, WebsiteSetting } from "@/lib/types";
import { formatCurrency, safeImageSrc } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function phoneHref(phone?: string) {
  const value = phone?.replace(/[^\d+]/g, "");
  return value ? `tel:${value}` : undefined;
}

export function ChambersSection({
  hospitals,
  content,
  doctorPhone
}: {
  hospitals: Hospital[];
  content?: WebsiteSetting["content"];
  doctorPhone?: string;
}) {
  const activeHospitals = hospitals.filter((h) => h.active !== false);
  const displayHospitals = activeHospitals.length > 0 ? activeHospitals : hospitals;

  if (displayHospitals.length === 0) {
    return null;
  }

  return (
    <section id="chambers" className="py-16 lg:py-20 bg-[#f9fafb] border-b border-line">
      <div className="mx-auto max-w-[1340px] px-6">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
              <span className="grid size-3.5 place-items-center rounded-full bg-blue text-[8px] text-white">✓</span>
              {content?.contactBadge || "Consultation Chambers"}
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[38px]">
              Chamber List
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
              Choose your preferred hospital or clinic chamber location. View consulting days, visiting hours, and book appointments easily.
            </p>
          </div>
        </div>

        {/* Chambers Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayHospitals.map((hospital, idx) => {
            const phone = hospital.phone || doctorPhone;
            const href = phoneHref(phone);
            const fee = hospital.consultationFee || 1000;
            const days =
              Array.isArray(hospital.visitingDays) && hospital.visitingDays.length > 0
                ? hospital.visitingDays
                : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
            const hours = hospital.visitingHours || "05:00 PM - 09:00 PM";
            const mapDirectionsUrl =
              hospital.mapUrl && !hospital.mapUrl.includes("output=embed")
                ? hospital.mapUrl
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`;

            return (
              <div
                key={hospital._id || hospital.id || `${hospital.name}-${idx}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl duration-300"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-line">
                    {hospital.image ? (
                      <img
                        src={safeImageSrc(hospital.image, "/placeholder.svg")}
                        alt={hospital.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue/5 via-sky-50 to-slate-100 text-muted">
                        <Building2 className="h-12 w-12 text-blue/40" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/95 text-ink border-line font-bold shadow-sm backdrop-blur-sm">
                        {formatCurrency(fee)} Fee
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                        <span className="size-1.5 rounded-full bg-emerald-200 animate-pulse" />
                        Chamber
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-ink leading-snug group-hover:text-blue transition-colors">
                        {hospital.name}
                      </h3>
                      <p className="mt-2 flex items-start gap-2 text-sm text-muted leading-relaxed">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                        <span>{hospital.address}</span>
                      </p>
                    </div>

                    {/* Phone */}
                    {phone && (
                      <div className="flex items-center gap-2 text-sm text-ink font-medium">
                        <Phone className="h-4 w-4 shrink-0 text-blue" />
                        {href ? (
                          <a
                            href={href}
                            className="font-semibold text-ink hover:text-blue hover:underline transition-colors"
                          >
                            {phone}
                          </a>
                        ) : (
                          <span>{phone}</span>
                        )}
                      </div>
                    )}

                    {/* Visiting Days */}
                    <div className="rounded-xl border border-line bg-panel p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <Calendar className="h-3.5 w-3.5 text-blue" />
                        <span>Visiting Days</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {days.map((day) => (
                          <span
                            key={day}
                            className="rounded-md bg-white border border-line px-2 py-0.5 text-xs font-medium text-ink shadow-2xs"
                          >
                            {day.length > 3 ? day.slice(0, 3) : day}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Visiting Hours */}
                    <div className="rounded-xl border border-line bg-panel p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <Clock className="h-3.5 w-3.5 text-blue" />
                        <span>Visiting Hours</span>
                      </div>
                      <p className="text-sm font-bold text-ink">
                        {hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-3 border-t border-line bg-cream/70 p-4">
                  <a
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-blue transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View on Map</span>
                  </a>
                  <Link
                    href="#schedules"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue hover:bg-blue/90 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
