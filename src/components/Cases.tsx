"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const logos = ["/logos/nanet.png", "/logos/nl.png", "/logos/nld.png", "/logos/mois.png"];

function OrgLogo({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
      {error ? (
        <span className="text-blue-700 text-xs font-black">{name.slice(0, 2)}</span>
      ) : (
        <Image src={src} alt={name} width={40} height={40} className="object-contain" onError={() => setError(true)} />
      )}
    </div>
  );
}

export default function Cases() {
  const { lang } = useLanguage();
  const t = translations[lang].cases;
  const c = translations[lang].cta;

  return (
    <section
      id="cases"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-white py-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.items.map((item, i) => (
            <div
              key={item.org}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <OrgLogo src={logos[i]} name={item.org} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{item.org}</h3>
                  <p className="text-slate-400 text-xs">{item.eng}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                  <CalendarDays size={12} />
                  {item.period}
                </span>
              </div>

              <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                {item.projects.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600 leading-snug">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sky-500" />
                    {p}
                  </li>
                ))}
              </ul>

              {item.metrics.length > 0 && (
                <div className="mb-3 rounded-xl bg-gradient-to-br from-blue-700 to-sky-600 px-4 py-2.5 text-white">
                  <div className="grid grid-cols-3 gap-3">
                    {item.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-sm sm:text-base font-black leading-tight tabular-nums">{m.value}</div>
                        <div className="text-[10px] text-blue-100 leading-snug mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  {item.metricsNote && <p className="mt-2 text-[10px] text-blue-200/80">{item.metricsNote}</p>}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-blue-700/20"
          >
            {c.contactBtn}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
