"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function ImageSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = slides.length;

  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      goToSlide((current + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide, total]);

  const shouldRender = (index) => {
    if (index === current) return true;
    if (index === (current + 1) % total) return true;
    if (index === (current - 1 + total) % total) return true;
    return false;
  };

  if (total === 0) {
    return <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-white/40">No slides</div>;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {slides.map((slide, index) =>
        shouldRender(index) ? (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.category}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={75}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-white/60">Gallery</p>
              <h2 className="text-center text-3xl font-light tracking-wide text-white md:text-4xl lg:text-5xl">
                {slide.category}
              </h2>
              <div className="mt-4 h-px w-16 bg-white/40" />
            </div>
          </div>
        ) : null
      )}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === current ? "w-8 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
