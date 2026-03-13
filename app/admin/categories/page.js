"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph } from "react-icons/hi";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", password: "", description: "", bannerImage: "" });

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (!res.ok) { router.push("/admin"); return; }
    setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setForm({ name: "", password: "", description: "", bannerImage: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category and all its gallery images?")) return;
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  const startEdit = (cat) => {
    setForm({ name: cat.name, password: cat.password, description: cat.description, bannerImage: cat.bannerImage });
    setEditing(cat);
    setShowForm(true);
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Categories</h2>
          <p className="mt-1 text-sm text-zinc-500">Manage gallery categories and access codes</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
          <HiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">{editing ? "Edit" : "Add"} Category</h3>
              <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600"><HiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. Wedding Photography" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Access Password</label>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Client access code" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Short description for the gallery banner" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Banner Image</label>
                {form.bannerImage && (
                  <div className="relative mb-2 h-32 overflow-hidden rounded-lg">
                    <Image src={form.bannerImage} alt="Banner" fill className="object-cover" sizes="400px" />
                  </div>
                )}
                <ImageUploader folder="banners" onUpload={(data) => setForm({ ...form, bannerImage: data.url })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Cancel</button>
                <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            {cat.bannerImage && (
              <div className="relative h-36">
                <Image src={cat.bannerImage} alt={cat.name} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-lg font-semibold text-white">{cat.name}</h3>
              </div>
            )}
            {!cat.bannerImage && (
              <div className="bg-zinc-100 px-4 py-4">
                <h3 className="text-lg font-semibold text-zinc-900">{cat.name}</h3>
              </div>
            )}
            <div className="p-4">
              <p className="mb-1 text-xs text-zinc-400">Password: <span className="font-mono text-zinc-600">{cat.password}</span></p>
              <p className="mb-3 text-xs text-zinc-400">Slug: <span className="font-mono text-zinc-600">/{cat.slug}</span></p>
              <p className="mb-4 text-sm text-zinc-500 line-clamp-2">{cat.description}</p>
              <div className="flex gap-2">
                <Link href={`/admin/gallery/${cat.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition hover:bg-primary/20">
                  <HiPhotograph size={14} /> Gallery
                </Link>
                <button onClick={() => startEdit(cat)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200">
                  <HiPencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)}
                  className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 transition hover:bg-red-100">
                  <HiTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-20 text-center text-sm text-zinc-400">No categories yet. Click "Add Category" to create one.</div>
      )}
    </AdminLayout>
  );
}
