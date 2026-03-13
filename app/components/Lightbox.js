"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
  const [loaded, setLoaded] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Reset loaded state on image change
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  const image = images[currentIndex];
  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;
  const fullSrc = image.fullSrc || image.src;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
        aria-label="Close"
      >
        <HiX size={20} />
      </button>

      {/* Counter */}
      <div className="absolute left-4 top-4 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
        aria-label="Previous image"
      >
        <HiChevronLeft size={24} />
      </button>

      {/* Current image — show thumbnail instantly, full-res loads on top */}
      <div className="relative mx-16 flex h-[80vh] w-full max-w-5xl items-center justify-center">
        {/* Blurred thumbnail as instant placeholder */}
        <Image
          key={`thumb-${currentIndex}`}
          src={image.src}
          alt={image.alt}
          fill
          className={`object-contain transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"}`}
          sizes="90vw"
          priority
          quality={40}
        />
        {/* Full resolution */}
        <Image
          key={`full-${currentIndex}`}
          src={fullSrc}
          alt={image.alt}
          fill
          className={`object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          sizes="90vw"
          quality={90}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Preload adjacent full images via link tags for true browser-level prefetch */}
      <PreloadLinks
        urls={[
          images[prevIndex].fullSrc || images[prevIndex].src,
          images[nextIndex].fullSrc || images[nextIndex].src,
        ]}
      />

      {/* Next button */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
        aria-label="Next image"
      >
        <HiChevronRight size={24} />
      </button>
    </div>
  );
}

// Browser-level prefetch for adjacent images — no DOM rendering overhead
function PreloadLinks({ urls }) {
  useEffect(() => {
    const links = urls.map((url) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((l) => l.remove());
  }, [urls]);

  return null;
}
