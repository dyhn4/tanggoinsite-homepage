"use client";

import Link from "next/link";
import { ExternalLink, FileText, Table2, Image as ImageIcon, Camera, Megaphone, Type, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const SITE_URL = "https://nl.go.kr/aiocr/";
const statIcons = [FileText, Table2, ImageIcon, Camera, Megaphone, Type];

export default function CaseStudy() {
  const { lang } = useLanguage();
  const t = translations[lang].caseStudy;
  const c = translations[lang].cta;

  return (
    <section
      id="case-study"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-slate-50 py-8"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* 텍스트 영역 */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs mb-3">
              {t.badge}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
              {t.title[0]}
              <br />
              {t.title[1]}
            </h2>

            <p className="text-slate-600 leading-relaxed text-sm mb-6">
              {t.desc}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-700/20 w-fit"
              >
                {t.cta}
                <ExternalLink size={16} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-sm transition-all duration-200 w-fit"
              >
                {c.contactBtn}
              </Link>
              <span className="text-slate-400 text-xs">{t.orgLabel}</span>
            </div>
          </div>

          {/* 공유서재 홈페이지 재현 목업 */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-blue-200/50 via-sky-200/40 to-indigo-200/40 blur-2xl" />

            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* 브라우저 바 */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-slate-400 text-[11px] font-mono truncate">
                  nl.go.kr/aiocr
                </span>
              </div>

              <div className="p-5">
                {/* 사이트 로고 */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="px-1.5 py-1 rounded bg-orange-500 text-white text-[8px] font-bold leading-none text-center">
                    open<br />data<br />library
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{t.siteName}</span>
                </div>

                {/* 헤드라인 */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-4">
                  {t.siteTagline[0]}
                  <br />
                  {t.siteTagline[1]}
                </h3>

                {/* 통계 배너 */}
                <div className="rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 mb-3 text-center">
                  <div className="text-[10px] text-blue-100 mb-0.5">{t.statsLabel}</div>
                  <div className="text-sm font-bold">
                    {t.statsHeadline} {t.statsTotal}
                  </div>
                </div>

                {/* 통계 그리드 */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {t.stats.map((s, i) => {
                    const Icon = statIcons[i];
                    return (
                      <div
                        key={s.label}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <Icon size={13} className="text-blue-600 flex-shrink-0" />
                        <span className="text-slate-500 text-[11px] truncate">{s.label}</span>
                        <span className="text-slate-900 text-[11px] font-bold ml-auto">{s.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 검색바 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white">
                  <Search size={14} className="text-slate-300 flex-shrink-0" />
                  <span className="text-slate-300 text-xs truncate">{t.searchPlaceholder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
