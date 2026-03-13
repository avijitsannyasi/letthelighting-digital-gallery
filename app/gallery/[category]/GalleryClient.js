"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GalleryHeader from "../../components/GalleryHeader";
import GalleryBanner from "../../components/GalleryBanner";
import MasonryGallery from "../../components/MasonryGallery";
import Footer from "../../components/Footer";

export default function GalleryClient({ category, images, siteConfig }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem(`gallery_auth_${category.slug}`);
    if (auth !== "true") {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [category.slug, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-100 border-t-primary dark:border-zinc-700 dark:border-t-primary-light" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <GalleryBanner category={category} />
      <GalleryHeader categorySlug={category.slug} siteConfig={siteConfig} />
      <MasonryGallery images={images} />
      <Footer siteConfig={siteConfig} />
    </div>
  );
}
