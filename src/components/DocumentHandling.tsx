"use client";

import { ScanLine, BookOpenCheck, BookMarked, Wand2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import SampleBanner from "@/components/SampleBanner";

const handlingIcons = [ScanLine, BookOpenCheck, BookMarked, Wand2];

export default function DocumentHandling() {
  const { lang } = useLanguage();
  const t = translations[lang].handling;

  const items = t.items.map((item, i) => ({
    ...item,
    icon: handlingIcons[i],
  }));

  return (
    <section
      id="handling"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-slate-50 py-12"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="group bg-white rounded-2xl p-6 border border-slate-100 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-default flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-blue-700 to-sky-500 shadow-md shadow-blue-500/20 flex-shrink-0">
                <item.icon size={22} className="text-white" />
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                {item.desc}
              </p>
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

        <SampleBanner className="mt-8" />
      </div>
    </section>
  );
}
