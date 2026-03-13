"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

export default function MasonryGallery({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () =>
    setLightboxIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);

  // Split images into columns for masonry
  const columns = [[], [], [], []];
  images.forEach((img, i) => {
    columns[i % 4].push({ ...img, originalIndex: i });
  });

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {column.map((image) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(image.originalIndex)}
                  className="group relative overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg dark:shadow-none"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading={image.originalIndex < 8 ? "eager" : "lazy"}
                    quality={75}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}
