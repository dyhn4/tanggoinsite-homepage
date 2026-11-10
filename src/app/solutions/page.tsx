"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, GitBranch, PenLine, ScanSearch, Braces,
  Layers, FileText, BrainCircuit, ChevronRight, Check,
  Briefcase, ShieldCheck, BookOpen, ClipboardCheck, Package, Settings,
  ExternalLink, Gift, MessageCircle, Languages, Wand2,
  Ruler, Eraser, Focus, SunMoon, ScanText, Group, Type, Pilcrow, Table2,
  Link2, ListChecks, Bookmark, ListTree, FileCode, Tags, FileOutput, Images,
  FileSearch, Library, BarChart3, Newspaper, Eye, Image as ImageIcon,
  MessageCircleQuestion, Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import type { Translations } from "@/lib/translations";
import WorkflowShowcase, { WorkflowMock, WorkflowMetrics } from "@/components/WorkflowShowcase";
import TranslatorShowcase from "@/components/TranslatorShowcase";
import { OcrRetrain, DeliverablesBlock, JsonStructureBlock, WorkflowDesignBlock } from "@/components/ReportProof";
import SolutionCompare, { SolutionHeadline, SolutionMetrics, SolutionMock, hasShowcase } from "@/components/SolutionShowcase";
import SolutionFigures, { OutputSamples } from "@/components/SolutionFigures";

/* ─────────────────────────────────────────────
   타입 정의
───────────────────────────────────────────── */
type SolBase = {
  id: string;
  icon: LucideIcon;
  title: string;
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
type EditorSol    = SolBase & { kind: "editor";    featureIcons: LucideIcon[]; ocrSteps?: never };
type OcrSol       = SolBase & { kind: "ocr";       f1Score: string; ocrSteps: OcrStep[] };
type XmlSol       = SolBase & { kind: "xml";       featureIcons: LucideIcon[] };
type BatchSol     = SolBase & { kind: "batch";     outputIcons: LucideIcon[] };
type PdfSol       = SolBase & { kind: "pdf";       featureIcons: LucideIcon[] };
type ExplorerSol  = SolBase & { kind: "explorer";  capabilityIcons: LucideIcon[] };
type TranslatorSol = SolBase & { kind: "translator" };
type ImageSol     = SolBase & { kind: "image";     featureIcons: LucideIcon[] };

type AnySolution =
  | WorkflowSol | ImageSol | EditorSol | OcrSol | XmlSol
  | BatchSol | PdfSol | ExplorerSol | TranslatorSol;

/* 화면 순서 = 메인 솔루션 섹션의 공정 순서. 번역 데이터는 id로 찾는다. */
const TR_INDEX: Record<string, number> = {
  "tango-workflow": 0, "moon-editor": 1, "moon-ai-ocr": 2, "tango-xml": 3,
  "tango-batch": 4, "tango-pdf": 5, "moon-ai-explorer": 6, "moon-translator": 7,
  "tango-image": 8,
};

/* ─────────────────────────────────────────────
   정적 메타 (아이콘·색상·시각 데이터만)
───────────────────────────────────────────── */
const PROCESS_ICONS: ProcessIcon[] = [Briefcase, ShieldCheck, BookOpen, ClipboardCheck, Package, Settings];

const solutions: AnySolution[] = [
  {
    kind: "workflow",
    id: "tango-workflow", icon: GitBranch,
    title: "Tango Workflow",
    accent: "#38bdf8", tag: "blue",
    processIcons: PROCESS_ICONS,
  },
  {
    kind: "image",
    id: "tango-image", icon: Wand2,
    title: "Tango Image",
    accent: "#facc15", tag: "gold",
    featureIcons: [Ruler, Eraser, Focus, SunMoon],
  },
  {
    kind: "ocr",
    id: "moon-ai-ocr", icon: ScanSearch,
    title: "MooN AI OCR",
    accent: "#38bdf8", tag: "sky",
    f1Score: "99.8%",
    ocrSteps: [
      { value: "99.8%", width: "99", highlight: true },
      { value: "95.7%", width: "95" },
      { value: "92.6%", width: "92" },
    ],
  },
  {
    kind: "editor",
    id: "moon-editor", icon: PenLine,
    title: "MooN Editor",
    accent: "#c084fc", tag: "violet",
    featureIcons: [ScanText, Group, Type, Pilcrow, Table2],
  },
  {
    kind: "pdf",
    id: "tango-pdf", icon: FileText,
    title: "Tango PDF",
    accent: "#fb7185", tag: "rose",
    featureIcons: [Link2, ListChecks, Bookmark, ListTree],
  },
  {
    kind: "xml",
    id: "tango-xml", icon: Braces,
    title: "Tango XML(JSON)",
    accent: "#34d399", tag: "emerald",
    featureIcons: [FileCode, Tags, Braces],
  },
  {
    kind: "batch",
    id: "tango-batch", icon: Layers,
    title: "Tango Batch",
    accent: "#fb923c", tag: "orange",
    outputIcons: [FileOutput, Images, FileSearch, Library, BarChart3, Newspaper],
  },
  {
    kind: "explorer",
    id: "moon-ai-explorer", icon: BrainCircuit,
    title: "MooN AI Explorer",
    accent: "#818cf8", tag: "indigo",
    capabilityIcons: [Eye, ImageIcon, BookOpen, Languages, MessageCircleQuestion],
  },
  {
    kind: "translator",
    id: "moon-translator", icon: Languages,
    title: "MooN Translator",
    accent: "#e0a06b", tag: "copper",
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
        <WorkflowShowcase accent={accent} processes={tSol.processes} icons={sol.processIcons} />
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
        <WorkflowDesignBlock accent={accent} />
      </div>
    );
  }

  if (sol.kind === "translator") {
    return <TranslatorShowcase accent={accent} />;
  }

  if (sol.kind === "image") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.coreFeaturesLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {tSol.namedFeatures.map((f, fi) => (
            <div key={f.name} className="rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <FeatureIcon icon={sol.featureIcons[fi]} accent={accent} className="mb-3" />
              <h3 className="font-bold text-white mb-1.5 text-sm">{f.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
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
            <div key={f.name} className={`rounded-xl p-4 border border-white/6 hover:border-white/12 hover:-translate-y-0.5 transition-all group ${
                fi === tSol.editorFeatures.length - 1 && tSol.editorFeatures.length % 2 === 1 ? "sm:col-span-2" : ""
              }`}
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-start gap-3">
                <FeatureIcon icon={sol.featureIcons[fi]} accent={accent} className="flex-shrink-0" />
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
                  <Trophy size={36} strokeWidth={1.5} style={{ color: accent }} />
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

        <SolutionFigures id={sol.id} accent={accent} />

        <OcrRetrain accent={accent} />
      </div>
    );
  }

  if (sol.kind === "xml") {
    return (
      <div className="flex flex-col gap-10">
      <div>
        <SectionLabel accent={accent}>{labels.coreFeaturesLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {tSol.namedFeatures.map((f, fi) => (
            <div key={f.name} className="rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <FeatureIcon icon={sol.featureIcons[fi]} accent={accent} className="mb-3" />
              <h3 className="font-bold text-white mb-1.5 text-sm">{f.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <OutputSamples variant="xml" accent={accent} />
      <JsonStructureBlock accent={accent} />
      </div>
    );
  }

  if (sol.kind === "batch") {
    return (
      <div className="flex flex-col gap-10">
      <div>
        <SectionLabel accent={accent}>{labels.outputsLabel}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {tSol.outputs.map((o, i) => (
            <div key={o.name} className="relative rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="absolute top-3 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity font-black text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <FeatureIcon icon={sol.outputIcons[i]} accent={accent} className="mb-3" />
              <h3 className="font-bold text-white text-sm mb-1.5">{o.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <OutputSamples variant="batch" accent={accent} />
      <DeliverablesBlock accent={accent} />
      </div>
    );
  }

  if (sol.kind === "pdf") {
    return (
      <div className="flex flex-col gap-10">
        <div>
          <SectionLabel accent={accent}>{labels.featuresLabel}</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {tSol.namedFeatures.map((f, fi) => (
              <div key={f.name} className="flex gap-3 rounded-xl p-4 border border-white/6 hover:border-white/12 hover:-translate-y-0.5 transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <FeatureIcon icon={sol.featureIcons[fi]} accent={accent} className="flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm">{f.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <SolutionFigures id={sol.id} accent={accent} />
      </div>
    );
  }

  if (sol.kind === "explorer") {
    return (
      <div>
        <SectionLabel accent={accent}>{labels.aiCapabilitiesLabel}</SectionLabel>
        {/* 5개: 윗줄 3개 + 아랫줄 2개를 폭에 맞춰 늘려 빈칸이 생기지 않게 한다 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
          {tSol.capabilities.map((c, ci) => (
            <div key={c.name} className={`rounded-xl p-5 border border-white/6 hover:border-white/15 hover:-translate-y-0.5 transition-all group ${
                ci < 3 ? "lg:col-span-2" : "lg:col-span-3"
              } ${ci === tSol.capabilities.length - 1 && tSol.capabilities.length % 2 === 1 ? "sm:col-span-2" : ""}`}
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <FeatureIcon icon={sol.capabilityIcons[ci]} accent={accent} className="mb-3" />
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

function FeatureIcon({ icon: Icon, accent, className = "" }: { icon?: LucideIcon; accent: string; className?: string }) {
  if (!Icon) return null;
  return (
    <span className={`w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center ${className}`}>
      <Icon size={20} strokeWidth={1.5} style={{ color: accent }} />
    </span>
  );
}

function SectionLabel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-sm font-bold tracking-widest" style={{ color: accent }}>{children}</h2>
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const dragMoved = useRef(false);

  // 상단 탭: 마우스 휠·드래그로 좌우 이동
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    let startX = 0;
    let startLeft = 0;
    let down = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      dragMoved.current = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved.current = true;
      if (dragMoved.current) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      setTimeout(() => { dragMoved.current = false; }, 0);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // 현재 섹션 탭이 보이도록 자동 이동
  useEffect(() => {
    const el = tabsRef.current;
    const btn = el?.querySelector<HTMLElement>(`[data-tab="${activeId}"]`);
    if (!el || !btn) return;
    const target = btn.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  // 현재 위치: 상단 헤더 아래 기준선(120px)을 지난 마지막 섹션.
  // 섹션이 화면보다 훨씬 길어서 '화면에 보이는 비율'로는 판별할 수 없다.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = solutions[0].id;
      for (const s of solutions) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = solutions[solutions.length - 1].id;
      }
      setActiveId(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const cta = translations[lang].solutionHome;
  const wf = translations[lang].workflowPage;
  const activeTitle = solutions.find((s) => s.id === activeId)?.title ?? "";

  // 왼쪽 목록 묶음 (순서는 solutions 배열과 같다)
  const groups: { label: string; ids: string[] }[] = lang === "ko"
    ? [
        { label: "공정 관리",   ids: ["tango-workflow"] },
        { label: "전처리·인식", ids: ["tango-image", "moon-ai-ocr"] },
        { label: "교정·편집",   ids: ["moon-editor"] },
        { label: "산출물",      ids: ["tango-pdf", "tango-xml", "tango-batch"] },
        { label: "AI 서비스",   ids: ["moon-ai-explorer", "moon-translator"] },
      ]
    : [
        { label: "Workflow",         ids: ["tango-workflow"] },
        { label: "Preprocess · OCR", ids: ["tango-image", "moon-ai-ocr"] },
        { label: "Proofreading",     ids: ["moon-editor"] },
        { label: "Deliverables",     ids: ["tango-pdf", "tango-xml", "tango-batch"] },
        { label: "AI Services",      ids: ["moon-ai-explorer", "moon-translator"] },
      ];

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

          <div ref={tabsRef} className="relative overflow-x-auto scrollbar-hide flex-1 min-w-0 cursor-grab active:cursor-grabbing select-none xl:hidden">
            <div className="flex items-center gap-1 w-max mx-auto">
            {solutions.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  data-tab={s.id}
                  onClick={() => { if (dragMoved.current) return; document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
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
          </div>

          <span className="text-sm font-black tracking-tight whitespace-nowrap" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Tango</span><span className="text-white/70">Insight</span>
          </span>
        </div>
      </div>

      <div className="xl:grid xl:grid-cols-[240px_minmax(0,1fr)]">

      {/* 왼쪽 솔루션 목록 (넓은 화면) */}
      <aside className="hidden xl:block sticky top-14 self-start h-[calc(100vh-3.5rem-4.5rem)] overflow-y-auto border-r border-white/8 px-5 py-7">
        <nav aria-label="solutions">
          {groups.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="px-3 mb-1.5 text-[11px] font-bold text-white/35 tracking-wide">{g.label}</p>
              {g.ids.map((id) => {
                const s = solutions.find((x) => x.id === id);
                if (!s) return null;
                const no = String(solutions.indexOf(s) + 1).padStart(2, "0");
                const active = activeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    aria-current={active ? "true" : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[13px] transition-colors ${
                      active ? "bg-white/10 text-white font-bold" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <span className="w-5 text-[11px] tabular-nums" style={{ color: active ? s.accent : "rgba(255,255,255,0.3)" }}>{no}</span>
                    {s.title}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
      {/* 솔루션 섹션 */}
      {solutions.map((sol, idx) => {
        const Icon = sol.icon;
        const tSol = tSolutions[TR_INDEX[sol.id]];
        return (
          <section key={sol.id} id={sol.id} className="relative overflow-hidden scroll-mt-14">

            {/* 히어로 */}
            <div className="relative min-h-[300px] md:min-h-[450px] flex items-center bg-[#0b1a33]">
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">{sol.title}</h1>
                    {sol.kind === "workflow" ? (
                      <p className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug" style={{ color: sol.accent }}>
                        {wf.headline[0]}<br />{wf.headline[1]}
                      </p>
                    ) : hasShowcase(sol.id) ? (
                      <p className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug" style={{ color: sol.accent }}>
                        <SolutionHeadline id={sol.id} />
                      </p>
                    ) : (
                      <p className="text-base font-semibold mb-3" style={{ color: sol.accent }}>{tSol.subtitle}</p>
                    )}
                    <p className="text-white/60 text-sm leading-relaxed max-w-xl whitespace-pre-line">{tSol.description}</p>
                    {cta.evidence[sol.id] && (
                      <div className="mt-4 inline-flex items-start gap-2 max-w-xl rounded-xl border px-3.5 py-2.5 text-xs font-semibold leading-snug"
                        style={{ borderColor: `${sol.accent}50`, background: `${sol.accent}15`, color: sol.accent }}>
                        <ShieldCheck size={15} className="flex-shrink-0 mt-px" />
                        {cta.evidence[sol.id]}
                      </div>
                    )}
                    {sol.kind === "workflow" && <WorkflowMetrics accent={sol.accent} />}
                    {sol.kind !== "workflow" && hasShowcase(sol.id) && <SolutionMetrics id={sol.id} accent={sol.accent} />}
                  </div>

                  {sol.kind === "workflow" ? (
                    <div className="w-full md:w-[420px] flex-shrink-0">
                      <WorkflowMock accent={sol.accent} caption={wf.mockCaption} />
                    </div>
                  ) : hasShowcase(sol.id) ? (
                    <div className="w-full md:w-[420px] flex-shrink-0">
                      <SolutionMock id={sol.id} accent={sol.accent} />
                    </div>
                  ) : (
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-2xl flex items-center justify-center border border-white/10 bg-white/[0.03]">
                      <Icon size={48} style={{ color: sol.accent }} strokeWidth={1.2} />
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="bg-slate-950" style={{ borderTop: `1px solid ${sol.accent}20` }}>
              <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
                <SectionContent sol={sol} tSol={tSol} labels={labels} />
                {sol.kind !== "workflow" && <SolutionCompare id={sol.id} name={sol.title} accent={sol.accent} />}

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-6 py-5 border border-white/8">
                  <div>
                    <p className="font-bold text-white text-base">{sol.title} {labels.ctaQuestion}</p>
                    <p className="text-sm text-white/40 mt-0.5">{labels.ctaDesc}</p>
                  </div>
                  <Link href="/contact"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors">
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
      </div>
      </div>

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
