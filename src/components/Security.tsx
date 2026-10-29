"use client";

import Link from "next/link";
import {
  ShieldCheck, Lock, Trash2, Video, ServerCog, ClipboardCheck, Usb, GraduationCap,
  ArrowRight, MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const measureIcons = [Trash2, ServerCog, Video, ClipboardCheck, Usb, GraduationCap];

export default function Security() {
  const { lang } = useLanguage();
  const t = translations[lang].report2026.security;

  return (
    <section
      id="security"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-white pt-24 pb-8"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {t.title[0]}
            <br />
            {t.title[1]}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div
            className="rounded-2xl p-6 text-white flex flex-col"
            style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #0ea5e9 100%)" }}
          >
            <div className="text-[11px] font-bold tracking-widest text-blue-200">{t.goalLabel}</div>
            <div className="mt-3 flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                <ShieldCheck size={24} />
              </span>
              <div className="text-2xl font-black tracking-tight">{t.goal}</div>
            </div>

            <div className="mt-6 text-[11px] font-bold tracking-widest text-blue-200">{t.layersLabel}</div>
            <ol className="mt-2 flex flex-col gap-2">
              {t.layers.map((l, i) => (
                <li key={l} className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 px-3.5 py-2.5">
                  <span className="text-[11px] font-black text-sky-200">{String(i + 1).padStart(2, "0")}</span>
                  <Lock size={14} className="text-sky-200" />
                  <span className="text-sm font-semibold">{l}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-3">{t.measuresLabel}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {t.measures.map((m, i) => {
                const Icon = measureIcons[i];
                return (
                  <div
                    key={m.title}
                    className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                      <Icon size={18} className="text-white" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{m.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">{t.note}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5"
          >
            {t.applyBtn}
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            <MessageCircle size={14} />
            {t.contactBtn}
          </Link>
        </div>
      </div>
    </section>
  );
}
