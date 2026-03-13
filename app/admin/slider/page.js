"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";
import { HiTrash, HiPencil, HiX } from "react-icons/hi";

export default function SliderPage() {
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState("");

  const fetchSlides = async () => {
    const res = await fetch("/api/admin/slider");
    if (!res.ok) { router.push("/admin"); return; }
    setSlides(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleUpload = async (data) => {
    const category = prompt("Enter category label for this slide:", "Photography");
    if (!category) return;

    await fetch("/api/admin/slider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src: data.url, category }),
    });
    fetchSlides();
  };

  const handleDelete = async (_id) => {
    if (!confirm("Remove this slide?")) return;
    await fetch("/api/admin/slider", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    fetchSlides();
  };

  const handleUpdateCategory = async (_id) => {
    const updated = slides.map((s) => s._id === _id ? { ...s, category: editCategory } : s);
    await fetch("/api/admin/slider", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setEditId(null);
    fetchSlides();
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Slider Images</h2>
        <p className="mt-1 text-sm text-zinc-500">Manage homepage slider images and category labels</p>
      </div>

      <div className="mb-8">
        <ImageUploader folder="slider" onUpload={handleUpload} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="relative h-44">
              <Image src={slide.src} alt={slide.category} fill className="object-cover" sizes="400px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm font-medium text-white">{slide.category}</p>
            </div>
            <div className="flex items-center gap-2 p-3">
              {editId === slide.id ? (
                <>
                  <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                    className="flex-1 rounded border border-zinc-200 px-2 py-1.5 text-sm outline-none focus:border-primary" />
                  <button onClick={() => handleUpdateCategory(slide.id)} className="rounded bg-primary px-3 py-1.5 text-xs text-white">Save</button>
                  <button onClick={() => setEditId(null)} className="text-zinc-400"><HiX size={16} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-zinc-600 truncate">{slide.category}</span>
                  <button onClick={() => { setEditId(slide.id); setEditCategory(slide.category); }} className="text-zinc-400 hover:text-zinc-600"><HiPencil size={14} /></button>
                  <button onClick={() => handleDelete(slide.id)} className="text-zinc-400 hover:text-red-500"><HiTrash size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="py-10 text-center text-sm text-zinc-400">No slider images. Upload one above.</div>
      )}
    </AdminLayout>
  );
}
