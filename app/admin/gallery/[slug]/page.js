"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "../../components/AdminLayout";
import ImageUploader from "../../components/ImageUploader";
import { HiTrash, HiArrowLeft, HiPencil, HiX, HiSwitchHorizontal, HiArrowUp, HiArrowDown } from "react-icons/hi";

export default function GalleryManagePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editImage, setEditImage] = useState(null);
  const [editAlt, setEditAlt] = useState("");
  const replaceRef = useRef(null);
  const [replacingId, setReplacingId] = useState(null);

  const fetchImages = async () => {
    const res = await fetch(`/api/admin/gallery?slug=${slug}`);
    if (!res.ok) { router.push("/admin"); return; }
    setImages(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, [slug]);

  const handleUpload = async (data) => {
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        image: { src: data.url, publicId: data.publicId, alt: data.fileName, width: data.width || 400, height: data.height || 300 },
      }),
    });
    fetchImages();
  };

  const handleDelete = async (imageId) => {
    if (!confirm("Remove this image?")) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, imageId }),
    });
    fetchImages();
  };

  const saveImages = async (updated) => {
    setImages(updated);
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, images: updated }),
    });
  };

  // Edit alt text
  const handleEditSave = async () => {
    const updated = images.map((img) =>
      img.id === editImage.id ? { ...img, alt: editAlt } : img
    );
    await saveImages(updated);
    setEditImage(null);
  };

  // Replace image
  const handleReplace = (id) => {
    setReplacingId(id);
    replaceRef.current?.click();
  };

  const uploadToCloudinary = async (file) => {
    const sigRes = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: slug }),
    });
    const { signature, timestamp, folder: cloudFolder, apiKey, cloudName } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("folder", cloudFolder);
    formData.append("api_key", apiKey);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    return await uploadRes.json();
  };

  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !replacingId) return;

    const result = await uploadToCloudinary(file);

    if (result.secure_url) {
      const updated = images.map((img) =>
        img.id === replacingId ? { ...img, src: result.secure_url } : img
      );
      await saveImages(updated);
    }

    setReplacingId(null);
    e.target.value = "";
  };

  // Reorder
  const moveImage = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    await saveImages(updated);
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <button onClick={() => router.push("/admin/categories")} className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700">
          <HiArrowLeft size={14} /> Back to Categories
        </button>
        <h2 className="text-2xl font-semibold text-zinc-900 capitalize">{slug.replace(/-/g, " ")}</h2>
        <p className="mt-1 text-sm text-zinc-500">{images.length} images in gallery</p>
      </div>

      {/* Upload */}
      <div className="mb-8">
        <ImageUploader folder={slug} onUpload={handleUpload} />
      </div>

      {/* Hidden replace input */}
      <input ref={replaceRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFile} />

      {/* Edit Modal */}
      {editImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Edit Image</h3>
              <button onClick={() => setEditImage(null)} className="text-zinc-400 hover:text-zinc-600"><HiX size={20} /></button>
            </div>
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
              <Image src={editImage.src} alt={editImage.alt || ""} fill className="object-cover" sizes="400px" />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Alt Text</label>
              <input
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Describe this image"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditImage(null)} className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Cancel</button>
              <button onClick={handleEditSave} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, index) => (
          <div key={img.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="relative aspect-square">
              <Image src={img.src} alt={img.alt || ""} fill className="object-cover" sizes="200px" />
            </div>

            {/* Action buttons - visible on hover */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex w-full items-center justify-between p-2">
                <div className="flex gap-1">
                  {/* Move up */}
                  <button
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 disabled:opacity-30"
                    title="Move left"
                  >
                    <HiArrowUp size={12} />
                  </button>
                  {/* Move down */}
                  <button
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 disabled:opacity-30"
                    title="Move right"
                  >
                    <HiArrowDown size={12} />
                  </button>
                </div>
                <div className="flex gap-1">
                  {/* Edit */}
                  <button
                    onClick={() => { setEditImage(img); setEditAlt(img.alt || ""); }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
                    title="Edit alt text"
                  >
                    <HiPencil size={12} />
                  </button>
                  {/* Replace */}
                  <button
                    onClick={() => handleReplace(img.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
                    title="Replace image"
                  >
                    <HiSwitchHorizontal size={12} />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 text-white backdrop-blur-sm transition hover:bg-red-600"
                    title="Delete"
                  >
                    <HiTrash size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Alt text badge */}
            {img.alt && (
              <div className="absolute left-2 top-2 max-w-[80%] truncate rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.alt}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-10 text-center text-sm text-zinc-400">No images yet. Upload some above.</div>
      )}
    </AdminLayout>
  );
}
