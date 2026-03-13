"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineViewGrid, HiOutlinePhotograph, HiOutlineCog, HiOutlineLogout, HiOutlineCollection, HiOutlineMenu, HiX } from "react-icons/hi";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { href: "/admin/categories", label: "Categories", icon: HiOutlineCollection },
  { href: "/admin/slider", label: "Slider", icon: HiOutlinePhotograph },
  { href: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-zinc-200 transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
            <h1 className="text-lg font-semibold text-zinc-900">Admin Panel</h1>
            <button className="lg:hidden text-zinc-500" onClick={() => setSidebarOpen(false)}>
              <HiX size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-200 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <HiOutlineLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center gap-4 border-b border-zinc-200 bg-white px-6 py-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-600">
            <HiOutlineMenu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-zinc-900">Admin Panel</h1>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
