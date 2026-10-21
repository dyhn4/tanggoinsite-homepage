"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import SampleBanner from "@/components/SampleBanner";

const gradients = [
  "from-blue-600 to-sky-400",
  "from-indigo-600 to-blue-400",
  "from-sky-500 to-cyan-400",
];

export default function Testimonials() {
  const { lang } = useLanguage();
  const t = translations[lang].testimonials;

  const testimonials = t.items.map((item, i) => ({
    ...item,
    gradient: gradients[i],
  }));

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-blue-100 text-blue-700 mb-4">
          {t.badge}
        </span>
        <h2
          className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3"
          style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
        >
          {t.title}
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100
                       hover:shadow-md hover:-translate-y-1 hover:border-blue-100
                       transition-all duration-300 flex flex-col gap-4"
          >
            <div
              className={`text-5xl font-black leading-none bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent select-none`}
              aria-hidden
            >
              &ldquo;
            </div>

            <p className="text-slate-600 text-sm leading-relaxed flex-1">
              {item.quote}
            </p>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}
              >
                {item.initial}
              </div>
              <div>
                <p className="text-slate-800 text-sm font-semibold leading-tight">
                  {item.name}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {item.org} · {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SampleBanner className="mt-10 w-full max-w-5xl" />

      <p className="mt-8 text-xs text-slate-400 tracking-wide">
        {t.footer}
      </p>
    </section>
  );
}
