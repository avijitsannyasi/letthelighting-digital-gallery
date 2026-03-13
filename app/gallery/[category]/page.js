import { getCategories, getGalleryImages, getSiteConfig } from "../../lib/galleryData";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage({ params }) {
  const { category: slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <p className="text-zinc-500">Gallery not found.</p>
      </div>
    );
  }

  const images = await getGalleryImages(slug);
  const siteConfig = await getSiteConfig();

  return <GalleryClient category={category} images={images} siteConfig={siteConfig} />;
}
