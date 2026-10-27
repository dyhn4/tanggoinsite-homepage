"use client";

import Link from "next/link";
import { ArrowRight, Check, Blocks, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const modelIcons = [Blocks, Truck];

export default function ModelCompare() {
  const { lang } = useLanguage();
  const t = translations[lang].modelCompare;

  return (
    <section
      id="models"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-slate-50 pt-24 pb-8"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{t.title}</h2>
          <p className="text-slate-500 text-sm sm:text-base">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.models.map((m, mi) => {
            const Icon = modelIcons[mi];
            const featured = mi === 1;
            return (
              <div
                key={m.name}
                className={`rounded-2xl p-6 flex flex-col border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  featured ? "bg-white border-blue-200 shadow-lg shadow-blue-500/10" : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{m.name}</h3>
                    <p className="text-slate-400 text-xs">{m.sub}</p>
                  </div>
                </div>

                <dl className="flex flex-col gap-3 flex-1">
                  {t.rowLabels.map((label, ri) => (
                    <div key={label} className="flex items-start gap-3">
                      <Check size={16} className="text-sky-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-[11px] font-bold tracking-wide text-slate-400">{label}</dt>
                        <dd className="text-sm text-slate-700 leading-snug">{m.cells[ri]}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <Link
                  href={m.href}
                  className={`mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    featured
                      ? "bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {m.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">{t.mixNote}</p>
      </div>
    </section>
  );
}
