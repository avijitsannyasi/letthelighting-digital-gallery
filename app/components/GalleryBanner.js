"use client";

import Image from "next/image";
import { HiChevronDown } from "react-icons/hi";

export default function GalleryBanner({ category }) {
  const scrollToGallery = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={category.bannerImage}
        alt={category.name}
        fill
        className="object-cover"
        priority
        quality={75}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzI3MjcyYSIvPjwvc3ZnPg=="
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Decorative line */}
        <div className="mb-6 h-16 w-px bg-white/30" />

        <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/60 md:text-sm">
          Client Gallery
        </p>

        <h1 className="mb-5 max-w-3xl text-4xl font-light leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          {category.name}
        </h1>

        <div className="mx-auto mb-6 h-px w-20 bg-white/30" />

        <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60 md:text-base lg:text-lg">
          {category.description}
        </p>

        {/* Scroll indicator */}
        <button
          onClick={scrollToGallery}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-white/50 transition-colors duration-300 hover:text-white"
          aria-label="Scroll to gallery"
        >
          <span className="text-xs uppercase tracking-[0.3em]">View Gallery</span>
          <HiChevronDown size={20} className="animate-bounce" />
        </button>
      </div>
    </div>
  );
}
