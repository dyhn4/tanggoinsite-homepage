"use client";

import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const solutions = [
  { label: "Tango Workflow",  href: "/solutions#tango-workflow" },
  { label: "Tango Image",     href: "/solutions#tango-image"   },
  { label: "MooN AI OCR",     href: "/solutions#moon-ai-ocr"   },
  { label: "MooN Editor",     href: "/solutions#moon-editor"   },
  { label: "Tango PDF",       href: "/solutions#tango-pdf"     },
  { label: "Tango XML(JSON)", href: "/solutions#tango-xml"     },
  { label: "Tango Batch",     href: "/solutions#tango-batch"   },
  { label: "MooN AI Explorer",href: "/solutions#moon-ai-explorer" },
  { label: "MooN Translator", href: "/solutions#moon-translator" },
];

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang].footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* 브랜드 */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)" }}
              >
                <div className="absolute inset-0 top-0 h-1/2 bg-white/[0.12] rounded-t-lg" />
                <span className="relative text-white font-black text-sm">T</span>
              </div>
              <span className="text-white font-bold text-lg">탱고인사이트</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">
              {t.tagline}
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-500" />
                서울 구로구 디지털로 26길 43 L-1211
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-slate-500" />
                <a
                  href="mailto:contact@tangoinsight.ai"
                  className="text-sky-400 hover:text-sky-300 transition-colors"
                >
                  contact@tangoinsight.ai
                </a>
              </li>
            </ul>
          </div>

          {/* 솔루션 */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t.solutionsTitle}</h4>
            <ul className="space-y-2 text-sm">
              {solutions.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="hover:text-white transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 바로가기 */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t.pagesTitle}</h4>
            <ul className="space-y-2 text-sm">
              {t.pages.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사 정보 */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t.companyTitle}</h4>
            <ul className="space-y-2 text-sm">
              <li>{t.nameLabel}: <span className="text-slate-300">{t.nameValue}</span></li>
              <li>{t.foundedLabel}: <span className="text-slate-300">{t.foundedValue}</span></li>
              <li className="leading-snug">
                {t.bizLabel}:
                <span className="text-slate-300 block mt-0.5">
                  603-87-02754
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {currentYear} {t.copyright}</p>
          <span>AI-powered document digitization</span>
        </div>

      </div>
    </footer>
  );
}
