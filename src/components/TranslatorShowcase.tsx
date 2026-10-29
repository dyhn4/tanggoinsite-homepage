"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight, Check, MessageCircle, ArrowDown,
  FileInput, Layers, Plug, UserCheck, BarChart3, Save,
  ListChecks, Sparkles, PenLine, SearchCheck, Database, Scale, ShieldCheck, Gauge,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { TranslatorCase } from "@/components/ReportProof";

const flowIcons = [ListChecks, Sparkles, PenLine, SearchCheck, Database];
const featureIcons = [FileInput, Layers, Plug, UserCheck, BarChart3, Save];
const principleIcons = [Scale, ShieldCheck, Gauge];

function Label({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{children}</h2>
    </div>
  );
}

export default function TranslatorShowcase({ accent }: { accent: string }) {
  const { lang } = useLanguage();
  const t = translations[lang].translatorPage;
  const demoCta = translations[lang].solutionShowcase.common.demoCta;
  const [shot, setShot] = useState(0);

  return (
    <div className="flex flex-col gap-12">
      {/* 개선 루프 */}
      <div>
        <Label accent={accent}>{t.flowLabel}</Label>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {t.flowSteps.map((st, i) => {
            const Icon = flowIcons[i];
            return (
              <div key={st.title} className="relative rounded-xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-[10px] font-bold tracking-widest" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-2 mt-1.5 mb-1.5">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}25` }}>
                    <Icon size={14} style={{ color: accent }} />
                  </span>
                  <h3 className="text-sm font-bold text-white">{st.title}</h3>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{st.desc}</p>
                {i < 4 && <ArrowRight size={14} className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30" />}
                {i < 4 && <ArrowDown size={14} className="sm:hidden absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-10 text-white/30" />}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/40 leading-relaxed">{t.flowNote}</p>
      </div>

      {/* 핵심 기능 */}
      <div>
        <Label accent={accent}>{t.featuresLabel}</Label>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <div key={f.title} className="rounded-xl border border-white/8 p-4 hover:border-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}22` }}>
                    <Icon size={15} style={{ color: accent }} />
                  </span>
                  <h3 className="font-bold text-white text-sm">{f.title}</h3>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/35">{t.versionNote}</p>
      </div>

      {/* 실제 화면 */}
      <div>
        <Label accent={accent}>{t.screensLabel}</Label>
        <div className="mt-5 flex flex-wrap gap-2">
          {t.screens.map((sc, i) => (
            <button
              key={sc.src}
              onClick={() => setShot(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                shot === i ? "text-slate-900" : "border-white/12 text-white/55 hover:text-white hover:border-white/30"
              }`}
              style={shot === i ? { background: accent, borderColor: accent } : {}}
            >
              {sc.title}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl overflow-hidden border border-white/12 shadow-2xl shadow-black/40" style={{ background: "rgba(8,12,30,0.85)" }}>
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.04]">
            <span className="w-2 h-2 rounded-full bg-rose-400/80" />
            <span className="w-2 h-2 rounded-full bg-amber-400/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-[11px] text-white/35">Mo文oNTranslator · {t.screens[shot].title}</span>
          </div>
          <Image
            key={t.screens[shot].src}
            src={t.screens[shot].src}
            alt={t.screens[shot].title}
            width={1600}
            height={900}
            className="w-full h-auto"
            unoptimized
          />
        </div>
        <p className="mt-2 text-sm text-white/50">{t.screens[shot].desc}</p>
      </div>

      {/* 평가 결과 */}
      <div>
        <Label accent={accent}>{t.resultsLabel}</Label>
        <div className="mt-5 rounded-2xl border border-white/10 overflow-x-auto" style={{ background: "rgba(255,255,255,0.03)" }}>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-xs text-white/45">
                {t.resultsHead.map((h, i) => (
                  <th key={h} className={`px-4 py-3 font-bold ${i === 0 ? "text-left" : "text-center"}`} style={i === 3 ? { color: accent, background: `${accent}12` } : {}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.resultsRows.map((r) => (
                <tr key={r.label} className="border-t border-white/8">
                  <td className="px-4 py-3 text-white/70">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-4 py-3 text-center tabular-nums ${i === r.best ? "font-black text-white" : "text-white/45"}`}
                      style={i === 2 ? { background: `${accent}0d` } : {}}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm font-semibold" style={{ color: accent }}>{t.resultsSummary}</p>
        <ul className="mt-2 flex flex-col gap-1">
          {t.resultsNotes.map((n) => (
            <li key={n} className="flex items-start gap-1.5 text-xs text-white/40 leading-relaxed">
              <Check size={11} className="mt-0.5 flex-shrink-0" />
              {n}
            </li>
          ))}
        </ul>
      </div>

      {/* 국가기관 수행 사례 */}
      <TranslatorCase accent={accent} />

      {/* 번역 기준 */}
      <div>
        <Label accent={accent}>{t.principleLabel}</Label>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {t.principles.map((p, i) => {
            const Icon = principleIcons[i];
            return (
              <div key={p.title} className="rounded-xl border border-white/8 p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${accent}22` }}>
                  <Icon size={17} style={{ color: accent }} />
                </span>
                <h3 className="font-bold text-white text-sm mb-1.5">{p.title}</h3>
                <p className="text-xs text-white/55 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
          style={{ background: accent }}
        >
          <MessageCircle size={14} />
          {demoCta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
