"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { GalleryItem, Testimonial } from "@/lib/types";

export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
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
        aria-label="Customer reviews"
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3"
      >
        {testimonials.map((testimonial) => (
          <blockquote
            key={testimonial.name}
            className="flex min-w-[92%] snap-start flex-col rounded-2xl border border-line bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:min-w-[60%] lg:min-w-[46%]"
          >
            <div className="text-lg tracking-[3px] text-gold">
              {"★".repeat(testimonial.rating || 5)}
            </div>
            <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#333]">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-6 pt-4 border-t border-line">
              <b className="block text-[17px] text-ink">{testimonial.name}</b>
              <span className="text-xs text-muted">Verified Patient Consultation</span>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          aria-label="Previous"
          onClick={() => scrollByCard("previous")}
          className="grid size-11 place-items-center rounded-full border border-line bg-white text-lg font-medium text-ink transition hover:bg-ink hover:text-white shadow-sm"
        >
          ←
        </button>
        <button
          aria-label="Next"
          onClick={() => scrollByCard("next")}
          className="grid size-11 place-items-center rounded-full border border-line bg-white text-lg font-medium text-ink transition hover:bg-ink hover:text-white shadow-sm"
        >
          →
        </button>
      </div>
    </div>
  );
}

export function GalleryStrip({ gallery }: { gallery: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : gallery[activeIndex];
  const hasMany = gallery.length > 1;

  const modalLabel = useMemo(() => activeItem?.title ?? "Gallery image", [activeItem]);

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === 0 ? gallery.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === gallery.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <>
      <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-3">
        {gallery.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="group min-w-[260px] snap-start overflow-hidden rounded-2xl border border-line bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-w-[320px] lg:min-w-[360px]"
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-panel">
              <Image
                src={item.image}
                alt={item.alt}
                width={620}
                height={420}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="inline-block rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold text-ink">
                Practice Facility
              </span>
              <h3 className="mt-2.5 text-[16px] font-semibold leading-snug text-ink">{item.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={modalLabel}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl">
            <div className="relative aspect-[16/10] bg-panel">
              <Image src={activeItem.image} alt={activeItem.alt} fill className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 p-5 bg-white border-t border-line">
              <p className="font-bold text-ink">{activeItem.title}</p>
              <button
                aria-label="Close gallery"
                onClick={() => setActiveIndex(null)}
                className="grid size-9 place-items-center rounded-full border border-line bg-panel text-ink hover:bg-ink hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {hasMany ? (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-lg transition hover:bg-ink hover:text-white"
                  aria-label="Previous image"
                  onClick={showPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-lg transition hover:bg-ink hover:text-white"
                  aria-label="Next image"
                  onClick={showNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
