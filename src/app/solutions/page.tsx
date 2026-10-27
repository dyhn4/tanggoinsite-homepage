"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, GitBranch, PenLine, ScanSearch, Braces,
  Layers, FileText, BrainCircuit, ChevronRight, Check,
  Briefcase, ShieldCheck, BookOpen, ClipboardCheck, Package, Settings,
  ExternalLink, Gift, MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import type { Translations } from "@/lib/translations";

/* ─────────────────────────────────────────────
   타입 정의
───────────────────────────────────────────── */
type SolBase = {
  id: string;
  icon: LucideIcon;
  title: string;
  badge: string;
  bg: string;
  orbs: [string, string, string];
  accent: string;
  tag: string;
};

type ProcessIcon = LucideIcon;

type OcrStep = {
  value: string;
  width: string;
  highlight?: boolean;
};

type WorkflowSol  = SolBase & { kind: "workflow";  processIcons: ProcessIcon[]; ocrSteps?: never };
type EditorSol    = SolBase & { kind: "editor";    featureIcons: string[]; ocrSteps?: never };
type OcrSol       = SolBase & { kind: "ocr";       f1Score: string; ocrSteps: OcrStep[] };
type XmlSol       = SolBase & { kind: "xml";       featureIcons: string[] };
type BatchSol     = SolBase & { kind: "batch";     outputIcons: string[] };
type PdfSol       = SolBase & { kind: "pdf";       featureIcons: string[] };
type ExplorerSol  = SolBase & { kind: "explorer";  capabilityIcons: string[] };

type AnySolution =
  | WorkflowSol | EditorSol | OcrSol | XmlSol
  | BatchSol | PdfSol | ExplorerSol;

/* ─────────────────────────────────────────────
   정적 메타 (아이콘·색상·시각 데이터만)
───────────────────────────────────────────── */
const PROCESS_ICONS: ProcessIcon[] = [Briefcase, ShieldCheck, BookOpen, ClipboardCheck, Package, Settings];

const solutions: AnySolution[] = [
  {
    kind: "workflow",
    id: "tango-workflow", icon: GitBranch,
    title: "Tango Workflow",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #0a1628 0%, #0f2d6b 35%, #1a56c4 65%, #0ea5e9 100%)",
    orbs: ["rgba(29,78,216,0.55)", "rgba(14,165,233,0.40)", "rgba(99,102,241,0.30)"],
    accent: "#38bdf8", tag: "blue",
    processIcons: PROCESS_ICONS,
  },
  {
    kind: "editor",
    id: "moon-editor", icon: PenLine,
    title: "MooN Editor",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #1a0533 0%, #4c1d95 35%, #7c3aed 65%, #a855f7 100%)",
    orbs: ["rgba(124,58,237,0.55)", "rgba(168,85,247,0.40)", "rgba(196,181,253,0.20)"],
    accent: "#c084fc", tag: "violet",
    featureIcons: ["🔍", "🎯", "✏️", "📝", "🗂️"],
  },
  {
    kind: "ocr",
    id: "moon-ai-ocr", icon: ScanSearch,
    title: "MooN AI OCR",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #061b2e 0%, #0c4a6e 35%, #0284c7 65%, #06b6d4 100%)",
    orbs: ["rgba(3,105,161,0.55)", "rgba(6,182,212,0.40)", "rgba(56,189,248,0.30)"],
    accent: "#38bdf8", tag: "sky",
    f1Score: "99.8%",
    ocrSteps: [
      { value: "99.8%", width: "99", highlight: true },
      { value: "95.7%", width: "95" },
      { value: "92.6%", width: "92" },
    ],
  },
  {
    kind: "xml",
    id: "tango-xml", icon: Braces,
    title: "Tango XML(JSON)",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #022c22 0%, #065f46 35%, #059669 65%, #34d399 100%)",
    orbs: ["rgba(5,150,105,0.55)", "rgba(52,211,153,0.40)", "rgba(110,231,183,0.25)"],
    accent: "#34d399", tag: "emerald",
    featureIcons: ["📄", "🏷️", "⚡"],
  },
  {
    kind: "batch",
    id: "tango-batch", icon: Layers,
    title: "Tango Batch",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #2d0f00 0%, #7c2d12 35%, #c2410c 65%, #fb923c 100%)",
    orbs: ["rgba(194,65,12,0.55)", "rgba(251,146,60,0.40)", "rgba(253,186,116,0.25)"],
    accent: "#fb923c", tag: "orange",
    outputIcons: ["📊", "🖼️", "📑", "📚", "📈", "📰"],
  },
  {
    kind: "pdf",
    id: "tango-pdf", icon: FileText,
    title: "Tango PDF",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #1c0008 0%, #881337 35%, #e11d48 65%, #fb7185 100%)",
    orbs: ["rgba(225,29,72,0.55)", "rgba(251,113,133,0.40)", "rgba(253,164,175,0.25)"],
    accent: "#fb7185", tag: "rose",
    featureIcons: ["🔗", "📑", "📖", "🗂️"],
  },
  {
    kind: "explorer",
    id: "moon-ai-explorer", icon: BrainCircuit,
    title: "MooN AI Explorer",
    badge: "Plug in Program",
    bg: "linear-gradient(135deg, #0f0a2e 0%, #312e81 35%, #4338ca 65%, #818cf8 100%)",
    orbs: ["rgba(67,56,202,0.55)", "rgba(129,140,248,0.40)", "rgba(196,181,253,0.25)"],
    accent: "#818cf8", tag: "indigo",
    capabilityIcons: ["🧠", "🖼️", "📖", "🌐", "🤖"],
  },
];

/* ─────────────────────────────────────────────
   섹션 콘텐츠 렌더러
───────────────────────────────────────────── */
type TSol = Translations["solutionsPage"]["solutions"][0];
type TLabels = Omit<Translations["solutionsPage"], "solutions">;

function SectionContent({ sol, tSol, labels }: { sol: AnySolution; tSol: TSol; labels: TLabels }) {
  const accent = sol.accent;

  if (sol.kind === "workflow") {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <SectionLabel accent={accent}>{labels.workflowProcessLabel}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {tSol.processes.map((p, pi) => {
              const PIcon = sol.processIcons[pi] ?? Briefcase;
              return (
                <div key={p.label} className="rounded-xl p-4 border border-white/6 hover:border-white/12 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${accent}20` }}>
                      <PIcon size={13} style={{ color: accent }} />
                    </div>
                    <h3 className="font-bold text-white text-sm">{p.label}</h3>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-white/50">
                        <ChevronRight size={11} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <SectionLabel accent={accent}>{labels.workflowAutoLabel}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
            {tSol.automation.map((item) => (
              <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/6 text-sm text-white/70"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <Check size={14} className="flex-shrink-0" style={{ color: accent }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sol.kind === "editor") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.featuresLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {tSol.editorFeatures.map((f, fi) => (
            <div key={f.name} className="rounded-xl p-4 border border-white/6 hover:border-white/12 hover:-translate-y-0.5 transition-all group"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{sol.featureIcons[fi] ?? "✨"}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-white text-sm">{f.name}</h3>
                    {f.stage && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${accent}20`, color: accent }}>
                        {f.stage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/55 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sol.kind === "ocr") {
    const champStep = sol.ocrSteps.find(s => s.highlight);
    const rivalSteps = sol.ocrSteps.filter(s => !s.highlight);
    const champVal = champStep ? parseFloat(champStep.value) : 0;

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-36 h-36 rounded-full border-4"
            style={{ borderColor: `${accent}50`, background: `${accent}10`, boxShadow: `0 0 40px ${accent}30` }}>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{labels.avgAccuracyLabel}</p>
            <p className="text-3xl font-black" style={{ color: accent }}>{sol.f1Score}</p>
          </div>
          <div className="flex-1">
            <SectionLabel accent={accent}>{labels.featuresLabel}</SectionLabel>
            <ul className="mt-3 flex flex-col gap-2">
              {tSol.ocrFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                  <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionLabel accent={accent}>{labels.comparisonLabel}</SectionLabel>
          <div className="mt-4 flex flex-col gap-3">

            {champStep && (
              <div className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-5"
                style={{ background: `linear-gradient(135deg, ${accent}22 0%, ${accent}0d 100%)`, border: `1.5px solid ${accent}60`, boxShadow: `0 0 40px ${accent}25, inset 0 0 40px ${accent}08` }}>
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `${accent}18` }} />

                <div className="flex-shrink-0 flex flex-col items-center gap-1.5 z-10">
                  <span className="text-4xl drop-shadow-lg">🏆</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{ background: `${accent}30`, color: accent, border: `1px solid ${accent}50` }}>
                    {labels.rankBadge}
                  </span>
                </div>

                <div className="flex-1 z-10">
                  <div className="flex items-end justify-between mb-2.5">
                    <span className="text-sm font-bold text-white/90">{tSol.accuracyLabels[0] ?? "A.I. OCR (MooN)"}</span>
                    <span className="text-4xl font-black leading-none" style={{ color: accent }}>{champStep.value}</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full relative overflow-hidden"
                      style={{ width: `${champStep.width}%`, background: `linear-gradient(90deg, ${accent}80, ${accent})`, boxShadow: `0 0 16px ${accent}90` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 z-10 hidden sm:flex flex-col items-center gap-1">
                  <span className="text-xs font-black text-white whitespace-nowrap px-3 py-1.5 rounded-xl"
                    style={{ background: `${accent}40`, border: `1px solid ${accent}60` }}>
                    {labels.bestBadge}
                  </span>
                </div>
              </div>
            )}

            {rivalSteps.map((step, si) => {
              const gap = (champVal - parseFloat(step.value)).toFixed(1);
              return (
                <div key={si} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs font-semibold text-white/35 w-20 flex-shrink-0">{tSol.accuracyLabels[si + 1] ?? step.value}</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{ width: `${step.width}%`, background: "rgba(255,255,255,0.2)" }} />
                  </div>
                  <span className="text-sm font-bold text-white/40 w-12 text-right">{step.value}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap"
                    style={{ background: "rgba(239,68,68,0.12)", color: "rgba(252,165,165,0.75)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    -{gap}%p
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-white/30">{labels.comparisonNote}</p>
        </div>
      </div>
    );
  }

  if (sol.kind === "xml") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.coreFeaturesLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {tSol.namedFeatures.map((f, fi) => (
            <div key={f.name} className="rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-3xl block mb-3">{sol.featureIcons[fi] ?? "⚡"}</span>
              <h3 className="font-bold text-white mb-1.5 text-sm">{f.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sol.kind === "batch") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.outputsLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {tSol.outputs.map((o, i) => (
            <div key={o.name} className="relative rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="absolute top-3 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity font-black text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <span className="text-2xl block mb-2.5">{sol.outputIcons[i] ?? "📄"}</span>
              <h3 className="font-bold text-white text-sm mb-1.5">{o.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sol.kind === "pdf") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.featuresLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {tSol.namedFeatures.map((f, fi) => (
            <div key={f.name} className="flex gap-3 rounded-xl p-4 border border-white/6 hover:border-white/12 hover:-translate-y-0.5 transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-2xl flex-shrink-0">{sol.featureIcons[fi] ?? "📄"}</span>
              <div>
                <h3 className="font-bold text-white mb-1 text-sm">{f.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sol.kind === "explorer") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.aiCapabilitiesLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {tSol.capabilities.map((c, ci) => (
            <div key={c.name} className="rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-3xl block mb-3">{sol.capabilityIcons[ci] ?? "🤖"}</span>
              <h3 className="font-bold text-white mb-1.5 text-sm">{c.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function SectionLabel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{children}</h2>
    </div>
  );
}

/* ─────────────────────────────────────────────
   메인 컴포넌트
───────────────────────────────────────────── */
export default function SolutionsPage() {
  const { lang } = useLanguage();
  const tp = translations[lang].solutionsPage;
  const { solutions: tSolutions, ...labels } = tp;

  const [activeId, setActiveId] = useState("tango-workflow");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { threshold: 0.4 }
    );
    solutions.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const cta = translations[lang].solutionHome;
  const activeTitle = solutions.find((s) => s.id === activeId)?.title ?? "";

  return (
    <div className="bg-slate-950 min-h-screen pb-20">

      {/* 상단 헤더 */}
      <div className="sticky top-0 z-50 border-b border-white/8"
        style={{ background: "rgba(10,12,26,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-sky-300 transition-colors text-sm font-medium group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            {labels.backHome}
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 justify-center">
            {solutions.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeId === s.id ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                  style={activeId === s.id ? { background: "rgba(255,255,255,0.1)" } : {}}
                >
                  <Icon size={12} />
                  {s.title}
                </button>
              );
            })}
          </div>

          <span className="text-sm font-black tracking-tight whitespace-nowrap" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Tango</span><span className="text-white/70">Insight</span>
          </span>
        </div>
      </div>

      {/* 솔루션 섹션 */}
      {solutions.map((sol, idx) => {
        const Icon = sol.icon;
        const tSol = tSolutions[idx];
        return (
          <section key={sol.id} id={sol.id} className="relative overflow-hidden">

            {/* 히어로 */}
            <div className="relative min-h-[300px] flex items-center" style={{ background: sol.bg }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="animate-orb-1 absolute w-[400px] h-[400px] rounded-full blur-[100px] -top-24 -left-24"
                  style={{ background: sol.orbs[0] }} />
                <div className="animate-orb-2 absolute w-[320px] h-[320px] rounded-full blur-[80px] -bottom-16 -right-16"
                  style={{ background: sol.orbs[1] }} />
                <div className="animate-orb-3 absolute w-[240px] h-[240px] rounded-full blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ background: sol.orbs[2] }} />
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1 animate-fade-up">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full border"
                        style={{ borderColor: `${sol.accent}40`, color: sol.accent, background: `${sol.accent}15` }}>
                        {sol.badge}
                      </span>
                      <span className="text-white/30 text-xs">#{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">{sol.title}</h1>
                    <p className="text-base font-semibold mb-3" style={{ color: sol.accent }}>{tSol.subtitle}</p>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xl whitespace-pre-line">{tSol.description}</p>
                    {cta.evidence[sol.id] && (
                      <div className="mt-4 inline-flex items-start gap-2 max-w-xl rounded-xl border px-3.5 py-2.5 text-xs font-semibold leading-snug"
                        style={{ borderColor: `${sol.accent}50`, background: `${sol.accent}15`, color: sol.accent }}>
                        <ShieldCheck size={15} className="flex-shrink-0 mt-px" />
                        {cta.evidence[sol.id]}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-2xl flex items-center justify-center animate-glow"
                        style={{ background: `linear-gradient(135deg,${sol.accent}30 0%,${sol.accent}15 100%)`, border: `1px solid ${sol.accent}30`, boxShadow: `0 0 40px ${sol.accent}30` }}>
                        <Icon size={52} style={{ color: sol.accent }} strokeWidth={1.2} />
                      </div>
                      <div className="absolute inset-0 -m-3 rounded-[1.75rem] border opacity-20 animate-pulse"
                        style={{ borderColor: sol.accent }} />
                      <div className="absolute inset-0 -m-6 rounded-[2.25rem] border opacity-10"
                        style={{ borderColor: sol.accent }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="bg-slate-950" style={{ borderTop: `1px solid ${sol.accent}20` }}>
              <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
                <SectionContent sol={sol} tSol={tSol} labels={labels} />

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-5 border border-white/8"
                  style={{ background: `linear-gradient(135deg,${sol.accent}10 0%,transparent 60%)` }}>
                  <div>
                    <p className="font-bold text-white text-base">{sol.title} {labels.ctaQuestion}</p>
                    <p className="text-sm text-white/40 mt-0.5">{labels.ctaDesc}</p>
                  </div>
                  <Link href="/contact"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                    style={{ background: `linear-gradient(135deg,${sol.accent}60,${sol.accent})` }}>
                    {labels.ctaBtn} <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                </div>
              </div>
            </div>

            {idx < solutions.length - 1 && (
              <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${sol.accent}30,transparent)` }} />
            )}
          </section>
        );
      })}

      {/* 하단 고정 문의 바 */}
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10"
        style={{ background: "rgba(10,12,26,0.94)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center sm:justify-between gap-3">
          <p className="hidden sm:block text-sm font-semibold text-white/80">
            {cta.barText.replace("{name}", activeTitle)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href="https://ai.tangoinsight.kr" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 text-white/80 text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors">
              {cta.demoBtn}<ExternalLink size={13} />
            </a>
            <Link href="/apply"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs sm:text-sm font-semibold hover:bg-sky-500/30 transition-colors">
              <Gift size={13} />{cta.sampleBtn}
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-900/40 transition-colors">
              <MessageCircle size={13} />{cta.contactBtn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
