"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicMarketingShell } from "@/components/layout/PublicMarketingShell";
import { MarketingPageBackground } from "@/components/layout/MarketingPageBackground";
import { cn } from "@/lib/cn";
import { useTranslation } from "react-i18next";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
      <span className="w-4 h-px bg-current" />
      {children}
      <span className="w-4 h-px bg-current" />
    </span>
  );
}

function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const values = [
  {
    icon: Sparkles,
    title: { en: "Clarity over complexity", am: "ግልፅነት ከውስብስብነት ይበልጣል" },
    body: {
      en: "We strip away jargon so concepts land the first time—whether you read in Amharic or English.",
      am: "ከባባድ ቃላትን በማስወገድ በአማርኛም ሆነ በእንግሊዝኛ ሲያነቡ በቀላሉ እንዲረዱ እናደርጋለን።",
    },
  },
  {
    icon: Heart,
    title: { en: "Access for everyone", am: "ለሁሉም ተደራሽ" },
    body: {
      en: "Core lessons, the compiler, and the AI tutor stay free. No paywalls on the path to your first real program.",
      am: "ዋና ትምህርቶች፣ ኮምፓይለሩ እና የጀሚናይ AI አስጠኚ ምንጊዜም ነፃ ሆነው ይቆያሉ።",
    },
  },
  {
    icon: Users,
    title: { en: "Built with learners", am: "ከተማሪዎች ጋር የተገነባ" },
    body: {
      en: "Feedback from students and educators shapes what we ship next, from quizzes to certificates.",
      am: "ከትምህርት እስከ ሰርተፊኬት ያለው ሁሉ፣ ከተማሪዎች በሚገኝ አስተያየት ይሻሻላል።",
    },
  },
];

export default function AboutPageClient() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am" || i18n.language === "amh";

  return (
    <PublicMarketingShell>
      <main className="relative flex-1 pt-28 pb-20 px-6 sm:px-10 lg:px-16">
        <MarketingPageBackground />

        <div className="relative max-w-screen-xl mx-auto">
          {/* Hero */}
          <div className="max-w-3xl">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-sm text-xs font-medium text-gray-600 dark:text-gray-400 mb-8">
                {am ? "ስለ ACLP" : "About ACLP"}
              </div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.035em] leading-[1.08]">
                <span className="text-gray-900 dark:text-white">
                  {am ? "C++ን እሚያስተምረው መንገድ" : "Teaching C++ the way"}
                </span>
                <br />
                <span className="text-blue-600 dark:text-blue-500">
                  {am ? "ኢትዮጵያ በተሻለ በምትማርበት" : "Ethiopia learns best"}
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                {am
                  ? "ከፍተኛ ጥራት ያለውን የፕሮግራሚንግ ትምህርት ያለምንም የቋንቋ እንቅፋት ለኢትዮጵያውያን ተማሪዎች ለማድረስ እንተጋለን።"
                  : "We are a small team obsessed with one thing: removing the language barrier between Ethiopian students and serious programming skills—without compromising depth, rigor, or joy."}
              </p>
            </FadeUp>
          </div>

          {/* Mission band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 rounded-2xl border border-gray-200 dark:border-white/8 bg-gray-50/80 dark:bg-white/[0.02] p-8 sm:p-12 lg:p-14"
          >
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <SectionLabel>{am ? "ተልዕኮ" : "Mission"}</SectionLabel>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {am
                    ? "በዓለም ደረጃ ያለን የC++ ትምህርት የራስዎ እና የቅርብ ሆኖ እንዲሰማ ያድርጉ።"
                    : "Make world-class C++ education feel local, immediate, and yours."}
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed text-[15px] sm:text-base">
                <p>
                  {am
                    ? "ብዙ መድረኮች እንግሊዘኛን እንደ መጀመሪያ ቋንቋ ያስባሉ። እኛ ACLPን የገነባነው ያ እሳቤ በማሊዮን የሚቆጠሩ ተማሪዎችን ወደ ኋላ ስለሚያስቀር ነው - በተሰጥኦ እጦት ሳይሆን በመግባቢያ ቋንቋ ምክንያት።"
                    : "Most platforms assume you think in English first. We built ACLP because that assumption leaves millions of learners behind—not for lack of talent, but for lack of a bridge."}
                </p>
                <p>
                  {am
                    ? "እያንዳንዱ ገጽ የሁለት ቋንቋ ቅርፅ አለው። ትኩረትዎት ኮድ ላይ ብቻ ሊሆን ይችላል- ኮምፓይለሩ በበይነመረብ ላይ ስለሚሰራ በስልክ ብቻ መለማመድ ይቻላል። ግራ ሲገባዎት፣ AI አስጠኚው በመረጡት ቋንቋ እርዳታ ያደርግልዎታል።"
                    : "Every screen is bilingual by design. You can focus on C++—the compiler runs in the cloud so a phone is enough to practice. When you are stuck, the AI tutor meets you in the language you prefer—without dumbing down the material."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <div className="mt-24">
            <div className="mb-12">
              <SectionLabel>{am ? "መርሆዎች" : "Principles"}</SectionLabel>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {am
                  ? "ቀላል መልክ። ጠንካራ መሰረት።"
                  : "Simple surface. Serious underneath."}
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl">
                {am
                  ? "ዲዛይኑ ሆን ተብሎ የተረጋጋ ነው- ስለዚህም ትኩረትዎ ትምህርት ላይ ብቻ ሊሆን ይችላል።"
                  : "The product looks calm on purpose—so your attention stays on code, not noise."}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v, i) => (
                <motion.div
                  key={v.title.en}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "group rounded-2xl border p-7 flex flex-col gap-4",
                    "border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.02]",
                    "hover:border-gray-300 dark:hover:border-white/15 transition-colors",
                  )}
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100/80 dark:border-blue-500/20 flex items-center justify-center">
                    <v.icon
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {am ? v.title.am : v.title.en}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {am ? v.body.am : v.body.en}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Proof row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-24 rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden"
          >
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/8">
              {[
                {
                  k: "500+",
                  l: {
                    en: "Learners on the platform",
                    am: "በመድረክ ላይ ያሉ ተማሪዎች",
                  },
                },
                {
                  k: "50+",
                  l: { en: "Structured lessons", am: "የተደራጁ ትምህርቶች" },
                },
                {
                  k: "2",
                  l: { en: "Languages, one experience", am: "እኩል ተሞክሮ በ2 ቋንቋ" },
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="px-8 py-10 text-center sm:text-left bg-gray-50/50 dark:bg-white/[0.015]"
                >
                  <p className="text-3xl sm:text-4xl font-bold tabular-nums text-gray-900 dark:text-white">
                    {row.k}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {am ? row.l.am : row.l.en}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-24 relative rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/[0.02] px-8 sm:px-12 py-14 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {am
                    ? "የመጀመሪያ ኮድዎን ለመፃፍ ዝግጁ ነዎት?"
                    : "Ready to write your first line?"}
                </h2>
                <ul className="mt-5 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                  {[
                    { en: "C++ track", am: "የC++ ኮርስ" },
                    {
                      en: "Bilingual lessons & quizzes",
                      am: "ትምህርቶች እና ጥያቄዎች በ2 ቋንቋ",
                    },
                    {
                      en: "Live compiler in the browser",
                      am: "በብራውዘር ላይ የሚሰራ ኮምፓይለር",
                    },
                    {
                      en: "AI tutor when you need a nudge",
                      am: "ተጨማሪ እርዳታ ሲፈልጉ የAI አስጠኚ",
                    },
                  ].map((t) => (
                    <li key={t.en} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      {am ? t.am : t.en}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-md shadow-blue-500/15"
                >
                  {am ? "ነፃ አካውንት ይፍጠሩ" : "Create free account"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  {am ? "ወደ ዋና ገጽ ይመለሱ" : "Back to home"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </PublicMarketingShell>
  );
}
