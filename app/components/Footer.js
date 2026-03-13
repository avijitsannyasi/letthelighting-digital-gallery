"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";

export default function Footer({ siteConfig }) {
  const socials = [
    { icon: FaFacebookF, href: siteConfig?.social?.facebook, label: "Facebook" },
    { icon: FaInstagram, href: siteConfig?.social?.instagram, label: "Instagram" },
    { icon: FaLinkedinIn, href: siteConfig?.social?.linkedin, label: "LinkedIn" },
    { icon: FaPinterestP, href: siteConfig?.social?.pinterest, label: "Pinterest" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-zinc-200 bg-white transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} {siteConfig?.companyName || ""}
        </p>
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="text-zinc-300 transition-colors duration-300 hover:text-primary dark:text-zinc-600 dark:hover:text-primary-light">
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
