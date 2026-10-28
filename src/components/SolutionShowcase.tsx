"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, X, ArrowRight, MessageCircle, Search, Bot } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

type Item = { headline: string[]; metrics: { value: string; label: string }[]; compare: { item: string; before: string; after: string }[] };

function useShowcase(id: string) {
  const { lang } = useLanguage();
  const sc = translations[lang].solutionShowcase;
  return { common: sc.common, item: (sc.items as Record<string, Item>)[id] as Item | undefined };
}

export function hasShowcase(id: string) {
  return id in translations.ko.solutionShowcase.items;
}

export function SolutionHeadline({ id }: { id: string }) {
  const { item } = useShowcase(id);
  if (!item) return null;
  return (
    <>
      {item.headline[0]}
      <br />
      {item.headline[1]}
    </>
  );
}

export function SolutionMetrics({ id, accent }: { id: string; accent: string }) {
  const { item } = useShowcase(id);
  if (!item) return null;
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
      {item.metrics.map((x) => (
        <div key={x.label} className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">{x.value}</div>
          <div className="text-[11px] leading-snug mt-1" style={{ color: accent }}>{x.label}</div>
        </div>
      ))}
    </div>
  );
}

const Line = ({ w, c = "bg-white/15", h = "h-1.5" }: { w: string; c?: string; h?: string }) => (
  <span className={`block rounded-full ${h} ${c}`} style={{ width: w }} />
);

function MockBody({ id, accent }: { id: string; accent: string }) {
  const hl = { background: `${accent}55` };
  switch (id) {
    case "moon-editor":
      return (
        <div className="grid grid-cols-5 gap-3 p-4">
          <div className="col-span-3 rounded-lg bg-white/[0.04] border border-white/8 p-3 flex flex-col gap-2">
            {[90, 76, 84, 60, 88, 70].map((w, i) => (
              <div key={i} className="flex gap-1.5 items-center">
                <Line w={`${w}%`} />
                {i % 2 === 0 && <span className="h-3 w-5 rounded" style={hl} />}
              </div>
            ))}
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <div className="rounded-lg bg-white/[0.04] border border-white/8 p-2.5 flex flex-col gap-1.5">
              <Line w="50%" c="bg-white/25" />
              <div className="flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-6 w-6 rounded" style={hl} />)}</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] border border-white/8 p-2.5 flex flex-col gap-1.5">
              <Line w="70%" /><Line w="45%" />
              <span className="h-5 rounded-md" style={{ background: accent, opacity: 0.85 }} />
            </div>
          </div>
        </div>
      );
    case "moon-ai-ocr":
      return (
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="relative rounded-lg bg-white/[0.06] border border-white/8 p-3 flex flex-col gap-2 overflow-hidden">
            {[88, 72, 80, 64, 84].map((w, i) => <Line key={i} w={`${w}%`} c="bg-white/20" h="h-2" />)}
            <span className="absolute inset-x-0 top-1/3 h-8" style={{ background: `linear-gradient(to bottom, transparent, ${accent}55, transparent)` }} />
          </div>
          <div className="rounded-lg bg-white/[0.04] border border-white/8 p-3 flex flex-col gap-2">
            {[88, 72, 80, 64, 84].map((w, i) => <Line key={i} w={`${w}%`} c={i === 2 ? "" : "bg-white/20"} h="h-2" />)}
            <span className="mt-1 self-start rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${accent}30`, color: accent }}>OCR</span>
          </div>
        </div>
      );
    case "tango-xml":
      return (
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-lg bg-white/[0.04] border border-white/8 p-3 flex flex-col gap-2">
            {[85, 70, 78, 60].map((w, i) => <Line key={i} w={`${w}%`} h="h-2" />)}
          </div>
          <div className="rounded-lg bg-black/30 border border-white/8 p-3 flex flex-col gap-1.5 font-mono">
            {[["0%", "40%"], ["10%", "55%"], ["10%", "35%"], ["10%", "48%"], ["0%", "30%"]].map(([ml, w], i) => (
              <div key={i} className="flex items-center gap-1" style={{ marginLeft: ml }}>
                <span className="text-[10px]" style={{ color: accent }}>&lt;/&gt;</span>
                <Line w={w} c={i % 2 ? "bg-white/20" : ""} />
              </div>
            ))}
          </div>
        </div>
      );
    case "tango-batch":
      return (
        <div className="p-4 flex flex-col gap-2.5">
          {[92, 74, 58, 33].map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-white/[0.04] border border-white/8 px-3 py-2">
              <span className="w-5 h-6 rounded-sm bg-white/15" />
              <div className="flex-1">
                <Line w="45%" c="bg-white/25" />
                <div className="mt-1.5 h-1.5 rounded-full bg-white/8">
                  <div className="h-1.5 rounded-full" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${accent}80, ${accent})` }} />
                </div>
              </div>
              <span className="h-4 w-9 rounded-full" style={{ background: `${accent}30` }} />
            </div>
          ))}
        </div>
      );
    case "tango-pdf":
      return (
        <div className="grid grid-cols-5 gap-3 p-4">
          <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/8 p-3 flex flex-col gap-2">
            {[["0%", "70%"], ["12%", "55%"], ["12%", "62%"], ["0%", "66%"], ["12%", "50%"]].map(([ml, w], i) => (
              <div key={i} className="flex items-center gap-1.5" style={{ marginLeft: ml }}>
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: accent }} />
                <Line w={w} c={i % 3 ? "bg-white/20" : "bg-white/35"} />
              </div>
            ))}
          </div>
          <div className="col-span-3 rounded-lg bg-white/[0.06] border border-white/8 p-3 flex flex-col gap-2">
            <Line w="40%" c="bg-white/30" h="h-2" />
            {[90, 80, 86, 70, 84, 60].map((w, i) => <Line key={i} w={`${w}%`} c="bg-white/15" />)}
          </div>
        </div>
      );
    case "moon-ai-explorer":
      return (
        <div className="p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-2">
            <Search size={13} style={{ color: accent }} />
            <Line w="50%" c="bg-white/25" />
          </div>
          <div className="self-end rounded-xl rounded-tr-sm px-3 py-2" style={{ background: `${accent}35` }}>
            <Line w="90px" c="bg-white/50" />
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${accent}30` }}>
              <Bot size={13} style={{ color: accent }} />
            </span>
            <div className="rounded-xl rounded-tl-sm bg-white/[0.06] border border-white/8 px-3 py-2 flex flex-col gap-1.5 flex-1">
              {[92, 80, 55].map((w, i) => <Line key={i} w={`${w}%`} c="bg-white/20" />)}
            </div>
          </div>
        </div>
      );
    case "moon-translator":
      return <Image src="/solutions/translator/translate.webp" alt="MooN Translator" width={1430} height={742} className="w-full h-auto" unoptimized />;
    default:
      return null;
  }
}

export function SolutionMock({ id, accent }: { id: string; accent: string }) {
  const { common } = useShowcase(id);
  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden border border-white/12 shadow-2xl shadow-black/40" style={{ background: "rgba(8,12,30,0.85)" }}>
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.04]">
          <span className="w-2 h-2 rounded-full bg-rose-400/80" />
          <span className="w-2 h-2 rounded-full bg-amber-400/80" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          <span className="ml-2 h-2 w-28 rounded-full bg-white/10" />
        </div>
        <MockBody id={id} accent={accent} />
      </div>
      <p className="mt-2 text-center text-[11px] text-white/30">{id === "moon-translator" ? common.realCaption : common.mockCaption}</p>
    </div>
  );
}

export default function SolutionCompare({ id, name, accent }: { id: string; name: string; accent: string }) {
  const { common, item } = useShowcase(id);
  if (!item) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3">
        <div className="h-px w-6 rounded-full" style={{ background: accent }} />
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>
          {common.compareTitle.replace("{name}", name)}
        </h2>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="hidden sm:grid grid-cols-[120px_1fr_1fr] text-xs font-bold tracking-wide">
          <div className="px-4 py-3" />
          <div className="px-4 py-3 text-white/45 border-l border-white/8">{common.beforeLabel}</div>
          <div className="px-4 py-3 border-l border-white/8" style={{ color: accent, background: `${accent}12` }}>{name}</div>
        </div>
        {item.compare.map((r) => (
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
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
        style={{ background: accent }}
      >
        <MessageCircle size={14} />
        {common.demoCta}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
