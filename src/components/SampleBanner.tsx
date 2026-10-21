"use client";

import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function SampleBanner({ className = "" }: { className?: string }) {
  const { lang } = useLanguage();
  const t = translations[lang].cta;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 px-6 py-5 text-white shadow-lg shadow-blue-700/20 ${className}`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
        <Gift size={22} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <span className="text-[10px] font-bold tracking-widest text-sky-200">{t.sampleBadge}</span>
        <p className="font-bold text-base sm:text-lg leading-snug">{t.sampleTitle}</p>
        <p className="text-blue-100 text-sm mt-0.5">{t.sampleDesc}</p>
      </div>
      <Link
        href="/apply"
        className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        {t.sampleBtn}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
