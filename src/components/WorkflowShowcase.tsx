"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const BAR_SETS = [
  [82, 64, 48, 71],
  [58, 90, 66, 40],
  [74, 52, 85, 60],
  [45, 77, 59, 88],
  [91, 69, 43, 62],
  [66, 80, 55, 73],
];
const CHIPS = ["bg-emerald-400", "bg-amber-400", "bg-sky-400", "bg-emerald-400", "bg-rose-400"];

export function WorkflowMock({ accent, seed = 0, caption }: { accent: string; seed?: number; caption?: string }) {
  const bars = BAR_SETS[seed % BAR_SETS.length];
  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden border border-white/12 shadow-2xl shadow-black/40" style={{ background: "rgba(8,12,30,0.85)" }}>
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.04]">
          <span className="w-2 h-2 rounded-full bg-rose-400/80" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 h-2 w-28 rounded-full bg-white/10" />
        </div>
        <div className="flex">
          <div className="hidden sm:flex flex-col gap-2 p-3 border-r border-white/10 w-12">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="h-6 rounded-md" style={{ background: i === seed % 6 ? `${accent}55` : "rgba(255,255,255,0.07)" }} />
            ))}
          </div>
          <div className="flex-1 p-4 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg p-2.5 bg-white/[0.05] border border-white/8">
                  <div className="h-1.5 w-8 rounded-full bg-white/20 mb-2" />
                  <div className="h-3 w-12 rounded-full" style={{ background: `${accent}${i === 0 ? "cc" : "70"}` }} />
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3 bg-white/[0.04] border border-white/8 flex flex-col gap-2">
              {bars.map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-12 rounded-full bg-white/15" />
                  <div className="flex-1 h-2 rounded-full bg-white/8">
                    <div className="h-2 rounded-full" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${accent}80, ${accent})` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-white/[0.04] border border-white/8 divide-y divide-white/6">
              {[0, 1, 2].map((r) => (
                <div key={r} className="flex items-center gap-2 px-3 py-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${CHIPS[(r + seed) % CHIPS.length]}`} />
                  <span className="h-1.5 w-20 rounded-full bg-white/15" />
                  <span className="h-1.5 flex-1 rounded-full bg-white/8" />
                  <span className="h-4 w-10 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {caption && <p className="mt-2 text-center text-[11px] text-white/30">{caption}</p>}
    </div>
  );
}

export function WorkflowMetrics({ accent }: { accent: string }) {
  const { lang } = useLanguage();
  const m = translations[lang].workflowPage.metrics;
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
      {m.map((x) => (
        <div key={x.label} className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">{x.value}</div>
          <div className="text-[11px] leading-snug mt-0.5" style={{ color: accent }}>{x.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function WorkflowShowcase({
  accent,
  processes,
  icons,
}: {
  accent: string;
  processes: { label: string; items: string[] }[];
  icons: LucideIcon[];
}) {
  const { lang } = useLanguage();
  const w = translations[lang].workflowPage;
  const [active, setActive] = useState(0);
  const proc = processes[active];
  const benefit = w.benefits[active];
  const ActiveIcon = icons[active];

  return (
    <div className="flex flex-col gap-12">
      {/* 6대 공정 탭 + 화면 */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 rounded-full" style={{ background: accent }} />
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{w.tabsLabel}</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1">
            {processes.map((p, i) => {
              const Icon = icons[i];
              const on = i === active;
              return (
                <button
                  key={p.label}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left whitespace-nowrap lg:whitespace-normal transition-all duration-200 ${
                    on ? "text-white" : "border-white/8 text-white/50 hover:text-white/80 hover:border-white/20"
                  }`}
                  style={on ? { background: `${accent}22`, borderColor: `${accent}77` } : { background: "rgba(255,255,255,0.03)" }}
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: on ? accent : "rgba(255,255,255,0.08)" }}>
                    <Icon size={15} style={{ color: on ? "#06121f" : accent }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold tracking-widest opacity-60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="block text-sm font-bold">{p.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-white/10 p-5 sm:p-6 flex flex-col gap-5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}25` }}>
                <ActiveIcon size={20} style={{ color: accent }} />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">{benefit.headline}</h3>
                <p className="text-sm text-white/55 mt-1 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>

            <WorkflowMock accent={accent} seed={active} caption={w.mockCaption} />

            <div>
              <div className="text-[11px] font-bold tracking-widest text-white/35 mb-2">{w.featuresLabel}</div>
              <div className="flex flex-wrap gap-2">
                {proc.items.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/70 border border-white/10 bg-white/[0.04]">
                    <Check size={11} style={{ color: accent }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
              style={{ background: accent }}
            >
              <MessageCircle size={14} />
              {w.demoCta}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 전/후 비교 */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 rounded-full" style={{ background: accent }} />
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{w.compareTitle}</h2>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="hidden sm:grid grid-cols-[120px_1fr_1fr] text-xs font-bold tracking-wide">
            <div className="px-4 py-3" />
            <div className="px-4 py-3 text-white/45 border-l border-white/8">{w.beforeLabel}</div>
            <div className="px-4 py-3 border-l border-white/8" style={{ color: accent, background: `${accent}12` }}>{w.afterLabel}</div>
          </div>
          {w.compareRows.map((r) => (
            <div key={r.item} className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr] border-t border-white/8">
              <div className="px-4 pt-3 sm:py-3.5 text-sm font-bold text-white">{r.item}</div>
              <div className="px-4 py-2 sm:py-3.5 sm:border-l border-white/8 flex items-start gap-2 text-sm text-white/45">
                <X size={14} className="mt-0.5 flex-shrink-0 text-rose-400/80" />
                {r.before}
              </div>
              <div className="px-4 pt-2 pb-3 sm:py-3.5 sm:border-l border-white/8 flex items-start gap-2 text-sm text-white" style={{ background: `${accent}0d` }}>
                <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                {r.after}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors hover:bg-white/10"
          style={{ borderColor: `${accent}77`, color: accent }}
        >
          <MessageCircle size={14} />
          {w.demoCta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
