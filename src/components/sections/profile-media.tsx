"use client";

import { Building2, Camera, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem, Testimonial } from "@/lib/types";
import { safeImageSrc } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const { t, translate } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "previous" | "next") {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = slider.firstElementChild?.clientWidth ?? 360;
    slider.scrollBy({ left: direction === "next" ? cardWidth + 20 : -(cardWidth + 20), behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={sliderRef}
        aria-label={t("reviews.title")}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3"
      >
        {testimonials.map((testimonial) => {
          const authorName = translate(testimonial.name);
          const quoteText = translate(testimonial.quote);
          return (
            <article
              key={testimonial.name}
              className="flex min-w-[280px] snap-start flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:shadow-md sm:min-w-[340px] lg:min-w-[380px]"
            >
              <div>
                <div className="flex items-center gap-1 text-gold" aria-label={`Rating: ${testimonial.rating} of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="text-base">
                      {index < testimonial.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#3c3c3c] italic">
                  &ldquo;{quoteText}&rdquo;
                </p>
              </div>
              <div className="mt-6 border-t border-line/60 pt-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-panel text-sm font-bold text-ink">
                  {authorName[0] || "P"}
                </span>
                <div>
                  <p className="font-bold text-ink text-sm">{authorName}</p>
                  <p className="text-xs text-muted">{t("reviews.verifiedPatient")}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <button
          aria-label={t("reviews.prev")}
          onClick={() => scrollByCard("previous")}
          className="grid size-11 place-items-center rounded-full border border-line bg-white text-lg font-medium text-ink transition hover:bg-ink hover:text-white shadow-sm cursor-pointer"
        >
          ←
        </button>
        <button
          aria-label={t("reviews.next")}
          onClick={() => scrollByCard("next")}
          className="grid size-11 place-items-center rounded-full border border-line bg-white text-lg font-medium text-ink transition hover:bg-ink hover:text-white shadow-sm cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function GalleryStrip({ gallery }: { gallery: GalleryItem[] }) {
  const { t, translate, formatNumber } = useLanguage();
  const [activeClinicIndex, setActiveClinicIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const activeClinic = activeClinicIndex === null ? null : gallery[activeClinicIndex];

  const clinicImages: string[] = useMemo(() => {
    if (!activeClinic) return [];
    if (Array.isArray(activeClinic.images) && activeClinic.images.length > 0) {
      return activeClinic.images.filter(Boolean);
    }
    return [activeClinic.image].filter(Boolean);
  }, [activeClinic]);

  const totalPhotos = clinicImages.length;
  const activeImage = clinicImages[activePhotoIndex] || activeClinic?.image || "";
  const hasMultiplePhotos = totalPhotos > 1;

  const openClinicGallery = (clinicIndex: number) => {
    setActiveClinicIndex(clinicIndex);
    setActivePhotoIndex(0);
  };

  const showPreviousPhoto = () => {
    if (totalPhotos <= 1) return;
    setActivePhotoIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  };

  const showNextPhoto = () => {
    if (totalPhotos <= 1) return;
    setActivePhotoIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (activeClinicIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveClinicIndex(null);
      if (e.key === "ArrowLeft") showPreviousPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeClinicIndex, totalPhotos]);

  return (
    <>
      <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
        {gallery.map((item, index) => {
          const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image].filter(Boolean);
          const photoCount = images.length;
          const coverImage = safeImageSrc(item.image || images[0], "/placeholder.svg");
          const itemTitle = translate(item.title);
          const itemCategory = translate(item.category) || t("gallery.practiceFacility");
          const itemDescription = translate(item.description);

          return (
            <button
              key={item.title + index}
              type="button"
              className="group min-w-[280px] snap-start overflow-hidden rounded-2xl border border-line bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-w-[340px] lg:min-w-[380px] flex flex-col justify-between cursor-pointer"
              onClick={() => openClinicGallery(index)}
            >
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-panel">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={item.alt || itemTitle || "Facility"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted">
                      <Building2 className="h-10 w-10 text-line" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                    <Camera className="h-3.5 w-3.5 text-gold" />
                    <span>
                      {formatNumber(photoCount)} {photoCount === 1 ? t("gallery.photo") : t("gallery.photos")}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 backdrop-blur-md border border-white/60 px-3 py-1 text-[11px] font-bold text-ink shadow-sm">
                      {itemCategory}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-[17px] font-extrabold leading-snug text-ink group-hover:text-blue transition-colors">
                    {itemTitle}
                  </h3>
                  {itemDescription && (
                    <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                      {itemDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs font-semibold text-blue border-t border-line/40 pt-3">
                <span className="flex items-center gap-1">
                  <Images className="h-3.5 w-3.5" />
                  {t("gallery.viewAllPhotos", { count: photoCount })}
                </span>
                <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>

      {activeClinic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={translate(activeClinic.title)}
        >
          <div className="relative flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/15 bg-[#141414] text-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3 min-w-0">
                <span className="rounded-full bg-gold/20 text-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider shrink-0">
                  {translate(activeClinic.category) || t("gallery.practiceFacility")}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg truncate">
                  {translate(activeClinic.title)}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-block text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {t("gallery.photoCountOf", { current: activePhotoIndex + 1, total: totalPhotos })}
                </span>
                <button
                  aria-label={t("gallery.close")}
                  onClick={() => setActiveClinicIndex(null)}
                  className="grid size-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[320px] sm:min-h-[440px] max-h-[58vh] bg-black/90 flex items-center justify-center p-2 sm:p-4">
              {activeImage ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  <img
                    src={safeImageSrc(activeImage, "/placeholder.svg")}
                    alt={translate(activeClinic.alt || activeClinic.title) || "Clinic image"}
                    className="max-h-[54vh] max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ) : (
                <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                  <Camera className="h-8 w-8 text-slate-600" />
                  <span>{t("gallery.noPhoto")}</span>
                </div>
              )}

              {hasMultiplePhotos && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full bg-black/60 border border-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white hover:text-ink cursor-pointer"
                    aria-label="Previous image"
                    onClick={showPreviousPhoto}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full bg-black/60 border border-white/20 text-white shadow-xl backdrop-blur-md transition hover:bg-white hover:text-ink cursor-pointer"
                    aria-label="Next image"
                    onClick={showNextPhoto}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-black/60 border-t border-white/10 space-y-3">
              {activeClinic.description && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {translate(activeClinic.description)}
                </p>
              )}

              {hasMultiplePhotos && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
                  {clinicImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative aspect-video h-14 sm:h-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                        idx === activePhotoIndex
                          ? "border-gold ring-2 ring-gold/40 scale-105"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={safeImageSrc(img, "/placeholder.svg")}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
