"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";
import ImageUploader from "../components/ImageUploader";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSettings)
      .catch(() => router.push("/admin"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading || !settings) return <AdminLayout><div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900">Settings</h2>
        <p className="mt-1 text-sm text-zinc-500">Update site information, logos, and social links</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">General</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Company Name</label>
              <input value={settings.companyName || ""} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Website URL</label>
              <input value={settings.websiteUrl || ""} onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
              <input value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Phone</label>
              <input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Logos</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Light Mode Logo</label>
              {settings.logo && (
                <div className="relative mb-2 h-16 rounded-lg bg-white border border-zinc-100 p-2">
                  <Image src={settings.logo} alt="Logo" fill className="object-contain" sizes="200px" />
                </div>
              )}
              <ImageUploader folder="general" onUpload={(data) => setSettings({ ...settings, logo: data.url })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Dark Mode Logo</label>
              {settings.logoDark && (
                <div className="relative mb-2 h-16 rounded-lg bg-zinc-900 border border-zinc-700 p-2">
                  <Image src={settings.logoDark} alt="Logo Dark" fill className="object-contain" sizes="200px" />
                </div>
              )}
              <ImageUploader folder="general" onUpload={(data) => setSettings({ ...settings, logoDark: data.url })} />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">Social Links</h3>
          <div className="space-y-4">
            {["facebook", "instagram", "linkedin", "pinterest"].map((platform) => (
              <div key={platform}>
                <label className="mb-1 block text-sm font-medium capitalize text-zinc-700">{platform}</label>
                <input
                  value={settings.social?.[platform] || ""}
                  onChange={(e) => setSettings({ ...settings, social: { ...settings.social, [platform]: e.target.value } })}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={`https://${platform}.com/yourpage`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-emerald-600">Saved successfully!</span>}
        </div>
      </div>
    </AdminLayout>
  );
}
