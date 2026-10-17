"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { PublicMarketingShell } from "@/components/layout/PublicMarketingShell";
import { MarketingPageBackground } from "@/components/layout/MarketingPageBackground";

import { useTranslation } from "react-i18next";

const included = [
  { en: "Full curriculum: Beginner → Advanced", am: "ሙሉ ትምህርት፡ ጀማሪ → ከፍተኛ" },
  {
    en: "Bilingual lessons & quizzes (Amharic / English)",
    am: "ትምህርቶች እና ጥያቄዎች በ2 ቋንቋ (አማርኛ/እንግሊዝኛ)",
  },
  { en: "Cloud C++ compiler with instant runs", am: "በክላውድ የሚሰራ C++ ኮምፓይለር" },
  { en: "AI tutor in context (Gemini)", am: "AI አስጠኚ (Gemini)" },
  {
    en: "XP, streaks, leaderboard & coins",
    am: "XP፣ ተከታታይ ቀናት፣ መሪዎች ሰሌዳ እና ሽልማቶች",
  },
  {
    en: "Verified PDF certificates per level",
    am: "የተረጋገጡ የPDF ሰርተፊኬቶች ለእያንዳንዱ ደረጃ",
  },
  {
    en: "Works on mobile and desktop browsers",
    am: "በሞባይል እና ኮምፒውተር ብራውዘሮች ይሠራል",
  },
];

const compare = [
  {
    label: { en: "Lessons & quizzes", am: "ትምህርቶች እና ጥያቄዎች" },
    free: { en: "Chapter 1 only", am: "ምዕራፍ አንድ ብቻ" },
    premium: { en: "Full curriculum", am: "ሙሉ ትምህርት" },
  },
  {
    label: { en: "Live compiler", am: "ላይቭ ኮምፓይለር" },
    free: { en: "No", am: "የለም" },
    premium: { en: "Unlimited runs", am: "ያልተገደበ" },
  },
  {
    label: { en: "AI tutor", am: "AI አስጠኚ" },
    free: { en: "No", am: "የለም" },
    premium: { en: "Unlimited", am: "ያልተገደበ" },
  },
  {
    label: { en: "Certificates", am: "ሰርተፊኬቶች" },
    free: { en: "No", am: "የለም" },
    premium: { en: "Verified PDF", am: "የተረጋገጠ PDF" },
  },
  {
    label: { en: "Account & progress sync", am: "አካውንት እና የትምህርት ደህንነት" },
    free: { en: "Included", am: "ተካቷል" },
    premium: { en: "Included", am: "ተካቷል" },
  },
];

export default function PricingPageClient() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am" || i18n.language === "amh";

  return (
    <PublicMarketingShell>
      <main className="relative flex-1 pt-28 pb-24 px-6 sm:px-10 lg:px-16">
        <MarketingPageBackground />
        <div className="relative max-w-screen-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-500/25 bg-blue-50 dark:bg-blue-500/8 px-4 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {am
                ? "የአንድ ጊዜ ክፍያ · ለዘላለም ተደራሽነት"
                : "One-time payment · Lifetime access"}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {am ? "ለሙያዎ " : "Invest in "}
              <span className="text-blue-600 dark:text-blue-500">
                {am ? "ኢንቨስት ያድርጉ።" : "your future."}
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              {am
                ? "እውነተኛ የፕሮግራሚንግ ክህሎቶችን ይማሩ። በአንድ ጊዜ ክፍያ ሙሉ ትምህርቱን፣ ላይቭ ኮምፓይለሩን፣ እና የ AI አስጠኚውን ለዘለአለም ያግኙ።"
                : "Master real programming skills. Unlock the full curriculum, live compiler, and AI tutor for life with a single payment."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-14 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 sm:p-12 shadow-xl shadow-gray-200/40 dark:shadow-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-gray-100 dark:border-white/8 pb-8">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {am ? "ሙሉ የመድረኩ ተደራሽነት" : "Lifetime Premium"}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
                    999.9
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {am ? "ብር" : "ETB"}
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-gray-400 dark:text-gray-500 ml-1">
                    {am ? "/ የአንድ ጊዜ ክፍያ" : "/ one-time"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {am
                    ? "ያለ ምንም ወርሃዊ ክፍያ። ለዘላለም የእርስዎ።"
                    : "No recurring fees. Yours forever."}
                </p>
              </div>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                {am ? "መማር ይጀምሩ" : "Get Premium Access"}
              </Link>
            </div>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {included.map((item) => (
                <li
                  key={item.en}
                  className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Check
                    className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  {am ? item.am : item.en}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-12 rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden"
          >
            <div className="grid grid-cols-3 px-6 py-4 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/8 text-sm font-semibold text-gray-900 dark:text-white">
              <div>{am ? "ባህሪያት" : "Features"}</div>
              <div className="text-center">
                {am ? "ነጻ አካውንት" : "Free Account"}
              </div>
              <div className="text-right text-blue-600 dark:text-blue-400">
                {am ? "ፕሪሚየም" : "Premium"}
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/8">
              {compare.map((row) => (
                <div
                  key={row.label.en}
                  className="grid grid-cols-3 items-center px-6 py-4 text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {am ? row.label.am : row.label.en}
                  </span>
                  <span className="text-center text-gray-500 dark:text-gray-400">
                    {am ? row.free.am : row.free.en}
                  </span>
                  <span className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {am ? row.premium.am : row.premium.en}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            {am ? "ጥያቄዎች?" : "Questions?"}{" "}
            {am ? "በተደጋጋሚ የሚጠየቁ ጥያቄዎችን ይመልከቱ" : "See the"}{" "}
            <Link
              href="/faq"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {am ? "(FAQ)" : "FAQ"}
            </Link>{" "}
            {am ? "ወይንም" : "or"}{" "}
            <Link
              href="/contact"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {am ? "ያነጋግሩን" : "contact us"}
            </Link>
            .
          </p>
        </div>
      </main>
    </PublicMarketingShell>
  );
}
