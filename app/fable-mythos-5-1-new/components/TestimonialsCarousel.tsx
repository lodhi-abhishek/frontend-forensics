"use client";

import React, { useState, useEffect, useCallback } from "react";
import testimonialsData from "../data/testimonials.json";

interface Testimonial {
  id?: number;
  company: string;
  author: string;
  role?: string;
  quote: string;
  category?: string;
}

export function TestimonialsCarousel() {
  const testimonials: Testimonial[] = testimonialsData;
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-16 px-6 sm:px-8 bg-[#faf9f5] overflow-hidden select-none">
      {/* Top Pagination Controls */}
      <div className="max-w-[640px] mx-auto flex items-baseline justify-between mb-4 font-anthropic-sans text-[15px]">
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`font-medium transition-colors cursor-pointer ${
            currentIndex === 0
              ? "opacity-0 pointer-events-none"
              : "text-[#73726c] hover:text-[#141413]"
          }`}
          aria-label="Previous quote"
        >
          Previous
        </button>

        <p className="font-sans text-[14px] text-[#73726c] font-variant-numeric tabular-nums m-0">
          {currentIndex + 1} of {testimonials.length}
        </p>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentIndex === testimonials.length - 1}
          className={`font-medium transition-colors cursor-pointer ${
            currentIndex === testimonials.length - 1
              ? "opacity-0 pointer-events-none"
              : "text-[#73726c] hover:text-[#141413]"
          }`}
          aria-label="Next quote"
        >
          Next
        </button>
      </div>

      {/* Stage with Edge Fading Veils */}
      <div className="relative max-w-[800px] mx-auto">
        {/* Left Veil */}
        <div
          className="hidden sm:block absolute top-0 bottom-0 left-0 w-16 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #faf9f5, transparent)",
          }}
        />

        {/* Card Stage */}
        <div className="relative z-10 max-w-[640px] mx-auto">
          <div className="bg-[#ced6bf] text-[#141413] border border-[#141413] border-t-4 shadow-sm transition-all duration-300">
            {/* Card Body */}
            <div className="p-6 sm:p-8">
              <span className="font-anthropic-sans text-[10px] uppercase tracking-[0.14em] font-semibold text-[#141413]/70 block mb-3">
                Quote
              </span>
              <blockquote className="m-0">
                <p className="font-tiempos text-[17px] sm:text-[19px] leading-[1.6] italic text-[#141413]">
                  {activeTestimonial.quote}
                </p>
              </blockquote>
            </div>

            {/* Split Footer: Company & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#141413]">
              {/* Left Cell: Company */}
              <div className="p-4 sm:p-5 flex flex-col gap-1">
                <span className="font-anthropic-sans text-[10px] uppercase tracking-[0.14em] font-semibold text-[#141413]/70">
                  Company
                </span>
                <p className="font-anthropic-sans text-[14px] sm:text-[15px] font-semibold text-[#141413] m-0">
                  {activeTestimonial.company}
                </p>
              </div>

              {/* Right Cell: Author */}
              <div className="p-4 sm:p-5 flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-[#141413]">
                <span className="font-anthropic-sans text-[10px] uppercase tracking-[0.14em] font-semibold text-[#141413]/70">
                  Author
                </span>
                <p className="font-anthropic-sans text-[14px] sm:text-[15px] font-medium text-[#141413] m-0">
                  {activeTestimonial.author}
                  {activeTestimonial.role && (
                    <span className="block text-xs font-normal text-[#141413]/80 mt-0.5">
                      {activeTestimonial.role}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Veil */}
        <div
          className="hidden sm:block absolute top-0 bottom-0 right-0 w-16 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #faf9f5, transparent)",
          }}
        />
      </div>

      {/* Quick Navigation Slider Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-8 max-w-[640px] mx-auto overflow-x-auto py-2">
        {testimonials.map((t, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${t.company}`}
            className={`h-1.5 transition-all rounded-full cursor-pointer ${
              currentIndex === idx
                ? "w-6 bg-[#141413]"
                : "w-1.5 bg-[#87867f]/40 hover:bg-[#141413]/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
