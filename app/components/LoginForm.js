"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "./ThemeProvider";

export default function LoginForm({ siteConfig }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(() => {})
      .catch(() => {});
    // Fetch categories client-side for password matching
    fetch("/api/public/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/public/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.slug) {
      sessionStorage.setItem(`gallery_auth_${data.slug}`, "true");
      router.push(`/gallery/${data.slug}`);
    } else {
      setIsLoading(false);
      setError("Invalid access code. Please try again.");
      setPassword("");
    }
  };

  const socials = [
    { icon: FaFacebookF, href: siteConfig.social?.facebook, label: "Facebook" },
    { icon: FaInstagram, href: siteConfig.social?.instagram, label: "Instagram" },
    { icon: FaLinkedinIn, href: siteConfig.social?.linkedin, label: "LinkedIn" },
    { icon: FaPinterestP, href: siteConfig.social?.pinterest, label: "Pinterest" },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between bg-white px-8 py-8 transition-colors duration-500 dark:bg-zinc-950 md:px-12 lg:px-16">
      {/* Top - Logo, Theme Toggle & Visit Website */}
      <div className="flex items-center justify-between">
        <div className="relative h-10 w-36">
          <Image
            src={siteConfig.logo || "/images/general/logo-green.webp"}
            alt={siteConfig.companyName || ""}
            width={160}
            height={50}
            className="h-10 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src={siteConfig.logoDark || "/images/general/logo.png"}
            alt={siteConfig.companyName || ""}
            width={160}
            height={50}
            className="hidden h-10 w-auto object-contain dark:block"
            priority
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-100 text-primary transition-all duration-300 hover:bg-primary-50 hover:border-primary dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-primary-light dark:hover:text-primary-light"
            aria-label="Toggle theme"
          >
            {darkMode ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
          <a
            href={siteConfig.websiteUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-full border border-primary-100 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-primary-light dark:hover:bg-primary-light dark:hover:text-white"
          >
            Visit Website
            <HiArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Middle - Login Form */}
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
            <svg className="h-6 w-6 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Enter your private access code to view <br /> your photography gallery
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-primary-600/70 dark:text-primary-light/60">Access Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter your access code"
              className="w-full rounded-xl border border-zinc-200 bg-primary-50/30 px-4 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:placeholder-zinc-500 dark:focus:border-primary-light dark:focus:bg-zinc-800 dark:focus:ring-primary-900/30"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 dark:bg-red-900/20">
              <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="group w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none dark:bg-primary-light dark:shadow-primary-light/10 dark:hover:bg-primary dark:hover:shadow-primary/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Access Gallery
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Bottom - Contact & Social */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-primary-100 dark:bg-zinc-800" />
          <span className="text-xs font-medium uppercase tracking-wider text-primary-600/50 dark:text-zinc-500">Get in touch</span>
          <div className="h-px flex-1 bg-primary-100 dark:bg-zinc-800" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-zinc-500 transition-colors duration-300 hover:text-primary dark:text-zinc-400 dark:hover:text-primary-light">
              <HiOutlineMail size={16} />{siteConfig.email}
            </a>
          )}
          {siteConfig.phone && (
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-zinc-500 transition-colors duration-300 hover:text-primary dark:text-zinc-400 dark:hover:text-primary-light">
              <HiOutlinePhone size={16} />{siteConfig.phone}
            </a>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          {socials.map(({ icon: Icon, href, label }) => href && (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-100 text-primary-600/60 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:scale-110 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-primary-light dark:hover:bg-primary-light dark:hover:text-white">
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
