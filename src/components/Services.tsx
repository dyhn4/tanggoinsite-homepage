"use client";

import Link from "next/link";
import { ScanLine, Edit3, Table, MessageSquare, Shield, Zap, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const serviceIcons = [ScanLine, Edit3, Table, MessageSquare, Shield, Zap];

export default function Services() {
  const { lang } = useLanguage();
  const t = translations[lang].services;
  const c = translations[lang].cta;

  const services = t.items.map((item, i) => ({
    ...item,
    icon: serviceIcons[i],
  }));

  return (
    <section
      id="services"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-white pt-24 pb-8"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-7">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            {t.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed whitespace-pre-line">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-300 cursor-default flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-700 to-sky-500 shadow-md shadow-blue-500/20 flex-shrink-0">
                <service.icon size={22} className="text-white" />
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
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

        <div className="mt-6 text-center">
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
