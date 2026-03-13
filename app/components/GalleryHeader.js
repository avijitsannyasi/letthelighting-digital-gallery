"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi2";
import { HiOutlineLogout, HiSun, HiMoon } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

export default function GalleryHeader({ categorySlug, siteConfig }) {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem(`gallery_auth_${categorySlug}`);
    router.push("/");
  };

  const socials = [
    { icon: FaFacebookF, href: siteConfig?.social?.facebook, label: "Facebook" },
    { icon: FaInstagram, href: siteConfig?.social?.instagram, label: "Instagram" },
    { icon: FaLinkedinIn, href: siteConfig?.social?.linkedin, label: "LinkedIn" },
    { icon: FaPinterestP, href: siteConfig?.social?.pinterest, label: "Pinterest" },
  ].filter((s) => s.href);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center">
          <Image src={siteConfig?.logo || "/images/general/logo-green.webp"} alt={siteConfig?.companyName || ""} width={120} height={40} className="h-8 w-auto object-contain dark:hidden" />
          <Image src={siteConfig?.logoDark || "/images/general/logo.png"} alt={siteConfig?.companyName || ""} width={120} height={40} className="hidden h-8 w-auto object-contain dark:block" />
        </a>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-100 text-primary-600/60 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:scale-110 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-primary-light dark:hover:bg-primary-light dark:hover:text-white">
                <Icon size={14} />
              </a>
            ))}
          </div>
          <a href={siteConfig?.websiteUrl || "#"} target="_blank" rel="noopener noreferrer"
            className="group hidden items-center gap-2 rounded-full border border-primary-100 px-4 py-1.5 text-sm text-primary transition-all hover:bg-primary hover:text-white sm:flex dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-primary-light dark:hover:bg-primary-light dark:hover:text-white">
            Website
            <HiArrowRight className="transition-transform group-hover:translate-x-0.5" size={12} />
          </a>
          <button onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-100 text-primary transition-all duration-300 hover:bg-primary-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-primary-light dark:hover:text-primary-light"
            aria-label="Toggle theme">
            {darkMode ? <HiSun size={16} /> : <HiMoon size={16} />}
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary transition-all hover:bg-primary hover:text-white dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20 dark:hover:text-white">
            <HiOutlineLogout size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
