"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { PublicMarketingShell } from "@/components/layout/PublicMarketingShell";
import { MarketingPageBackground } from "@/components/layout/MarketingPageBackground";
import { MARKETING_FAQ_ITEMS } from "@/lib/marketingFaq";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";

function FaqRow({
  q,
  a,
  q_am,
  a_am,
  am,
}: {
  q: string;
  a: string;
  q_am?: string;
  a_am?: string;
  am: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-4">
          {am && q_am ? q_am : q}
        </span>
        <span
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 text-lg leading-none transition-transform duration-200",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-12">
          {am && a_am ? a_am : a}
        </p>
      )}
    </div>
  );
}

export default function FaqPageClient() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am" || i18n.language === "amh";

  return (
    <PublicMarketingShell>
      <main className="relative flex-1 pt-28 pb-20 px-6 sm:px-10 lg:px-16">
        <MarketingPageBackground />
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-6">
              <HelpCircle
                className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                strokeWidth={2}
              />
              {am ? "የእርዳታ ማዕከል" : "Help center"}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {am ? "በየጊዜው የሚጠየቁ ጥያቄዎች" : "FAQ"}
            </h1>
            <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              {am
                ? "ስለ ትምህርት፣ አካውንቶች እና ACLP እንዴት እንደሚሰራ የሚነሱ ጥያቄዎች እና መልሶች።"
                : "Answers to common questions about learning, accounts, and how ACLP works."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-14 rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.02] px-6 sm:px-8"
          >
            {MARKETING_FAQ_ITEMS.map((item) => (
              <FaqRow
                key={item.q}
                q={item.q}
                a={item.a}
                q_am={(item as any).q_am}
                a_am={(item as any).a_am}
                am={am}
              />
            ))}
          </motion.div>

          <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            {am ? "አሁንም ጥያቄ አለዎት?" : "Still stuck?"}{" "}
            <Link
              href="/contact"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {am ? "ያነጋግሩን" : "Contact us"}
            </Link>{" "}
            {am ? "ወይም ይህንን ያንብቡ" : "or read our"}{" "}
            <Link
              href="/privacy"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {am ? "የግላዊነት መመሪያ" : "Privacy policy"}
            </Link>
            .
          </p>
        </div>
      </main>
    </PublicMarketingShell>
  );
}
