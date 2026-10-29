"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const INTERVAL = 5500;
const HREFS = ["/solutions#moon-ai-ocr", "/solutions#moon-translator", "/solutions#moon-translator"];
const COPPER = "#e0a06b";

function WindowBar({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-3 h-3 rounded-full bg-blue-400" />
      <div className="w-3 h-3 rounded-full bg-sky-400" />
      <div className="w-3 h-3 rounded-full bg-cyan-400" />
      <span className="text-slate-400 text-xs ml-2 font-mono">{path}</span>
    </div>
  );
}

function Skeleton({ rows = 4 }: { rows?: number }) {
  const all = [
    ["w-16", "w-32", "w-20"],
    ["w-24", "w-28", "w-16"],
    ["w-20", "w-36", "w-12"],
    ["w-28", "w-20", "w-24"],
  ].slice(0, rows);
  return (
    <div className="space-y-3 mb-5">
      {all.map((row, index) => (
        <div key={index} className="flex gap-2 items-center">
          {row.map((width, i) => (
            <div
              key={i}
              className={`${width} h-3 rounded-full bg-blue-300/25 animate-pulse`}
              style={{ animationDelay: `${index * 0.25 + i * 0.15}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SlideShell({
  active, href, cta, children,
}: { active: boolean; href: string; cta: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
      className={`group col-start-1 row-start-1 block h-full transition-all duration-700 ${
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="relative h-full flex flex-col bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-blue-950/40 transition-colors group-hover:border-sky-300/40">
        {children}
        <div className="mt-auto pt-4 flex items-center justify-end gap-1.5 text-xs font-semibold text-sky-200/80 group-hover:text-sky-100 transition-colors">
          {cta}
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function HeroVisual() {
  const { lang } = useLanguage();
  const hero = translations[lang].hero;
  const hs = translations[lang].heroSlides;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % hs.dots.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, hs.dots.length]);

  const tags = [
    { top: hero.liveTag, bottom: hero.heritageTag },
    { top: hs.translate.liveTag, bottom: hs.translate.tag },
    { top: hs.chart.liveTag, bottom: hs.chart.tag },
  ];

  const maxBar = Math.max(...hs.chart.bars.map((b) => b.value));

  return (
    <div
      className="relative animate-[float_4s_ease-in-out_infinite]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/25 via-sky-400/20 to-cyan-400/20 blur-2xl animate-pulse" />

      <div className="relative grid">
        {/* 1) AI OCR */}
        <SlideShell active={idx === 0} href={HREFS[0]} cta={hs.ocrCta}>
          <WindowBar path="heritage-ai.scan / live" />
          <Skeleton rows={4} />
          <div className="relative flex-1 min-h-[14rem] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/45">
            <div className="absolute inset-0 p-5 text-slate-300/80 leading-8 text-lg">
              訓民正音 國之語音 異乎中國
              <br />
              與文字不相流通 故愚民有所欲言
              <br />
              而終不得伸其情者多矣
              <br />
              予爲此憫然 新制二十八字
            </div>
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-sky-400/25 to-transparent animate-[scan_2.4s_ease-in-out_infinite]" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-white rounded-2xl p-4 shadow-lg backdrop-blur-md">
              <div className="text-blue-700 text-xs font-bold mb-1">{hero.ocrLabel}</div>
              <div className="text-slate-900 text-sm font-semibold">{hero.ocrResult}</div>
            </div>
          </div>
        </SlideShell>

        {/* 2) 현대어 번역 */}
        <SlideShell active={idx === 1} href={HREFS[1]} cta={hs.translate.cta}>
          <WindowBar path={hs.translate.path} />
          <Skeleton rows={2} />
          <div className="relative flex-1 min-h-[17.5rem] rounded-2xl overflow-hidden border border-white/10 bg-slate-950/45">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-amber-300/15 to-transparent animate-[scan_2.8s_ease-in-out_infinite]" />
            <div className="relative p-5 flex flex-col gap-3">
              {hs.translate.lines.map((l, i) => (
                <div key={l.from} className={`transition-all duration-700 ${idx === 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"}`} style={{ transitionDelay: `${i * 160}ms` }}>
                  <div className="text-xs text-slate-400 leading-tight">{l.from}</div>
                  <div className="text-base text-slate-100 font-semibold leading-snug flex items-start gap-1.5">
                    <ArrowRight size={14} className="mt-1.5 flex-shrink-0" style={{ color: COPPER }} />
                    {l.to}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-white rounded-2xl p-4 shadow-lg backdrop-blur-md">
              <div className="text-xs font-bold mb-1" style={{ color: "#b45309" }}>{hs.translate.resultLabel}</div>
              <div className="text-slate-900 text-sm font-semibold">{hs.translate.result}</div>
            </div>
          </div>
        </SlideShell>

        {/* 3) 번역 성능 그래프 */}
        <SlideShell active={idx === 2} href={HREFS[2]} cta={hs.chart.cta}>
          <WindowBar path={hs.chart.path} />
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-white font-bold text-base">{hs.chart.title}</span>
            <span className="text-xs text-slate-400">({hs.chart.hint})</span>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-slate-950/45 px-4 pt-9 pb-3">
            {/* 감소율 브래킷: 초기 → TVI v4 */}
            <div className="absolute left-[12.5%] w-[50%] top-3 h-3 border-t border-x border-white/35 rounded-t-sm flex justify-center">
              <span className="-mt-2.5 px-2 h-5 text-[11px] font-black rounded-full flex items-center" style={{ background: COPPER, color: "#1f2937" }}>
                {hs.chart.drop}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 items-end h-36">
              {hs.chart.bars.map((b, i) => (
                <div key={b.label} className="flex flex-col items-center justify-end h-full">
                  <span className={`text-sm font-black tabular-nums mb-1 ${"hl" in b && b.hl ? "text-white" : "text-slate-300"}`}>{b.value}</span>
                  <div
                    className="w-full rounded-t-md transition-all ease-out"
                    style={{
                      height: idx === 2 ? `${(b.value / maxBar) * 100}%` : "0%",
                      transitionDuration: "900ms",
                      transitionDelay: `${i * 120}ms`,
                      maxHeight: "7.5rem",
                      background: "hl" in b && b.hl ? `linear-gradient(180deg, ${COPPER}, #b9743c)` : "rgba(148,163,184,0.45)",
                      boxShadow: "hl" in b && b.hl ? `0 0 22px ${COPPER}66` : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3 mt-2 border-t border-white/10 pt-2">
              {hs.chart.bars.map((b) => (
                <span key={b.label} className={`text-[11px] text-center leading-tight ${"hl" in b && b.hl ? "font-bold" : "text-slate-400"}`} style={"hl" in b && b.hl ? { color: COPPER } : undefined}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-[1fr_4.5rem_4.5rem] px-4 py-1.5 text-[10px] font-bold tracking-wide text-slate-400">
              <span>{hs.chart.metricsHead[0]}</span>
              <span className="text-right" style={{ color: COPPER }}>{hs.chart.metricsHead[1]}</span>
              <span className="text-right">{hs.chart.metricsHead[2]}</span>
            </div>
            {hs.chart.metrics.map((m) => (
              <div key={m.label} className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center px-4 py-2 border-t border-white/10">
                <span className="text-xs text-slate-300">{m.label}</span>
                <span className="text-right text-base font-black tabular-nums" style={{ color: COPPER }}>{m.a}</span>
                <span className="text-right text-sm tabular-nums text-slate-400">{m.b}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-slate-400/80 leading-snug">{hs.chart.note}</p>
        </SlideShell>
      </div>

      {/* 떠 있는 태그 */}
      <div className="absolute -top-4 -right-4 z-10 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-900/40 transition-all duration-500" key={`top-${idx}`}>
        {tags[idx].top}
      </div>
      <div className="absolute -bottom-4 -left-4 z-10 bg-white/95 text-slate-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-500" key={`bottom-${idx}`}>
        {tags[idx].bottom}
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {hs.dots.map((d, i) => (
          <button
            key={d}
            type="button"
            aria-label={d}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-7 bg-sky-300" : "w-2 bg-white/30 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
