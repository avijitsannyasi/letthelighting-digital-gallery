"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import { HiOutlineCollection, HiOutlinePhotograph, HiOutlineCog } from "react-icons/hi";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ categories: 0, slides: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.ok ? r.json() : []),
      fetch("/api/admin/slider").then((r) => r.ok ? r.json() : []),
    ]).then(([cats, slides]) => {
      if (!Array.isArray(cats)) { router.push("/admin"); return; }
      setStats({ categories: cats.length, slides: slides.length });
      setLoading(false);
    }).catch(() => router.push("/admin"));
  }, [router]);

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div></AdminLayout>;

  const cards = [
    { label: "Categories", value: stats.categories, href: "/admin/categories", icon: HiOutlineCollection, color: "bg-blue-50 text-blue-600" },
    { label: "Slider Images", value: stats.slides, href: "/admin/slider", icon: HiOutlinePhotograph, color: "bg-amber-50 text-amber-600" },
    { label: "Settings", value: "Configure", href: "/admin/settings", icon: HiOutlineCog, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-900">Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-500">Manage your photography gallery</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-zinc-900">{card.value}</p>
            <p className="text-sm text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
