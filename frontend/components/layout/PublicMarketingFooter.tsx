"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SITE_LOGO_PATH } from "@/lib/siteAssets";

const footerGroups = [
  {
    title: { en: "Product", am: "ምርት" },
    links: [
      { href: "/", label: { en: "Home", am: "መነሻ" } },
      { href: "/pricing", label: { en: "Pricing", am: "ዋጋ" } },
      { href: "/resources", label: { en: "Resources", am: "ምንጮች" } },
      { href: "/faq", label: { en: "FAQ", am: "ጥያቄዎች" } },
      { href: "/status", label: { en: "Status", am: "ሁኔታ" } },
    ],
  },
  {
    title: { en: "Company", am: "ድርጅት" },
    links: [
      { href: "/about", label: { en: "About", am: "ስለ እኛ" } },
      { href: "/careers", label: { en: "Careers", am: "ስራ" } },
      { href: "/community", label: { en: "Community", am: "ማህበረሰብ" } },
      { href: "/press", label: { en: "Press", am: "ሚዲያ" } },
      { href: "/changelog", label: { en: "Changelog", am: "ለውጦች" } },
      { href: "/contact", label: { en: "Contact", am: "አድራሻ" } },
    ],
  },
  {
    title: { en: "Legal & trust", am: "ህግ እና እምነት" },
    links: [
      { href: "/privacy", label: { en: "Privacy", am: "ግላዊነት" } },
      { href: "/terms", label: { en: "Terms", am: "ደንቦች" } },
      { href: "/cookies", label: { en: "Cookies", am: "ኩኪዎች" } },
      { href: "/security", label: { en: "Security", am: "ደህንነት" } },
      { href: "/accessibility", label: { en: "Accessibility", am: "ተደራሽነት" } },
    ],
  },
  {
    title: { en: "Account", am: "አካውንት" },
    links: [
      { href: "/sign-up", label: { en: "Sign up", am: "ይመዝገቡ" } },
      { href: "/sign-in", label: { en: "Sign in", am: "ይግቡ" } },
      {
        href: "/verify",
        label: { en: "Verify certificate", am: "ሰርተፊኬት ያረጋግጡ" },
      },
    ],
  },
];

export function PublicMarketingFooter() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am" || i18n.language === "amh";

  return (
    <footer className="border-t border-gray-100 dark:border-white/5">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {footerGroups.map((group) => (
            <div key={group.title.en}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                {am ? group.title.am : group.title.en}
              </p>
              <ul className="space-y-3" role="list">
                {group.links.map(({ href, label }) => (
                  <li key={href + label.en}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {am ? label.am : label.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image
              src={SITE_LOGO_PATH}
              alt=""
              width={36}
              height={36}
              className="h-9 w-auto object-contain"
            />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              ACLP{" "}
              <span className="font-normal text-[11px] text-gray-500 ml-1 hidden sm:inline">
                (Amharic C++ Learning Platform)
              </span>
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center sm:text-right">
            © 2026 ACLP Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
