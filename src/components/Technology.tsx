"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GitBranch, PenLine, ScanSearch, Braces, Layers, FileText, BrainCircuit, Wand2, Languages,
  ArrowRight, ExternalLink, Gift, MessageCircle, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const stepIcons = [Wand2, ScanSearch, PenLine, FileText, Braces, Layers, BrainCircuit, Languages];
const DEMO_URL = "https://ai.tangoinsight.kr";

export default function Technology() {
  const { lang } = useLanguage();
  const t = translations[lang].solutionHome;
  const [active, setActive] = useState(0);
  const scenario = t.scenarios[active];
  const workflowFocus = active === 1;

  return (
    <section
      id="technology"
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 bg-white pt-24 pb-8"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-5">
        <div className="text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-sm mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{t.title}</h2>
          <p className="text-slate-500 text-sm sm:text-base">{t.subtitle}</p>
        </div>

        {/* 시나리오 탭 */}
        <div className="flex flex-wrap justify-center gap-2">
          {t.scenarios.map((s, i) => (
            <button
              key={s.tab}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === i
                  ? "bg-blue-700 border-blue-700 text-white shadow-lg shadow-blue-700/25"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700"
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        {/* 시나리오 패널 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-0.5">{t.problemLabel}</div>
                <p className="text-slate-700 text-sm leading-relaxed">{scenario.problem}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-bold tracking-widest text-blue-600 mb-0.5">{t.solutionLabel}</div>
                <p className="text-slate-900 font-semibold text-base leading-relaxed">{scenario.solution}</p>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-2">{t.usedLabel}</div>
              <div className="flex flex-wrap gap-2">
                {scenario.steps.map((si) => (
                  <Link
                    key={t.steps[si].id}
                    href={`/solutions#${t.steps[si].id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-colors"
                  >
                    {t.steps[si].name}
                    <ArrowRight size={12} />
                  </Link>
                ))}
                {workflowFocus && (
                  <Link
                    href="/solutions#tango-workflow"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Tango Workflow
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div
            className="lg:col-span-2 rounded-2xl p-6 text-white flex flex-col justify-center gap-4"
            style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #0ea5e9 100%)" }}
          >
            {scenario.results.map((r) => (
              <div key={r.label}>
                <div className="text-3xl sm:text-4xl font-black tracking-tight">{r.value}</div>
                <div className="text-blue-100 text-sm">{r.label}</div>
              </div>
            ))}
            {scenario.note && <p className="text-blue-200/80 text-xs">{scenario.note}</p>}
          </div>
        </div>

        {/* 전 과정 파이프라인 */}
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-2 text-center">{t.pipelineLabel}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {t.steps.map((step, i) => {
              const Icon = stepIcons[i];
              const on = scenario.steps.includes(i);
              return (
                <Link
                  key={step.id}
                  href={`/solutions#${step.id}`}
                  className={`group relative flex flex-col items-center text-center gap-1 rounded-xl border px-2 py-3 transition-all duration-300 ${
                    on
                      ? "bg-gradient-to-br from-blue-700 to-sky-500 border-transparent text-white shadow-lg shadow-blue-500/25 -translate-y-0.5"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-200"
                  }`}
                >
                  <span className={`absolute top-1.5 left-2 text-[10px] font-bold ${on ? "text-white/70" : "text-slate-300"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon size={20} className={on ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                  <span className={`text-xs font-bold leading-tight ${on ? "text-white" : "text-slate-700"}`}>{step.title}</span>
                  <span className={`text-[10px] leading-tight ${on ? "text-blue-100" : "text-slate-400"}`}>{step.name}</span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/solutions#tango-workflow"
            className={`mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              workflowFocus
                ? "bg-gradient-to-r from-blue-800 to-sky-500 text-white shadow-lg shadow-blue-500/25"
                : "bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100"
            }`}
          >
            <GitBranch size={16} />
            {t.workflowLabel}
          </Link>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            {t.demoBtn}
            <ExternalLink size={14} />
          </a>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-sm font-semibold hover:bg-sky-200 transition-colors"
          >
            <Gift size={14} />
            {t.sampleBtn}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-lg shadow-blue-700/20 transition-all hover:-translate-y-0.5"
          >
            <MessageCircle size={14} />
            {t.contactBtn}
          </Link>
          <Link href="/solutions" className="text-sm text-slate-500 hover:text-blue-700 transition-colors inline-flex items-center gap-1">
            {t.moreBtn}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
