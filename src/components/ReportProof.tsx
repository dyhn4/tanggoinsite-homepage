"use client";

import { Check, ArrowRight, ArrowDown, GitFork, UserCheck, FileText, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

function useReport() {
  const { lang } = useLanguage();
  return translations[lang].report2026;
}

function Label({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{children}</h2>
    </div>
  );
}

const Basis = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-2 text-xs text-white/40 leading-relaxed">{children}</p>
);

const card = { background: "rgba(255,255,255,0.03)" } as const;

/* ── MooN AI OCR: 엔진 재학습 성과 ── */
export function OcrRetrain({ accent }: { accent: string }) {
  const t = useReport().ocr;
  return (
    <div className="mt-2">
      <Label accent={accent}>{t.label}</Label>
      <Basis>{t.basis}</Basis>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {t.metrics.map((m, i) => (
          <div
            key={m.label}
            className="rounded-xl border px-4 py-4"
            style={i === 0 ? { borderColor: `${accent}60`, background: `${accent}14` } : { borderColor: "rgba(255,255,255,0.1)", ...card }}
          >
            <div className={`font-black tracking-tight leading-tight text-white ${i === 0 ? "text-xl sm:text-2xl" : "text-xl"}`}>{m.value}</div>
            <div className="text-[11px] leading-snug mt-1.5" style={{ color: i === 0 ? accent : "rgba(255,255,255,0.5)" }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {t.steps.map((st, i) => (
          <div key={st.title} className="relative rounded-xl border border-white/10 p-4" style={card}>
            <span className="text-[10px] font-bold tracking-widest" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-sm font-bold text-white mt-1">{st.title}</h3>
            <p className="text-xs text-white/50 leading-relaxed mt-1">{st.desc}</p>
            {i < t.steps.length - 1 && <ArrowRight size={14} className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30" />}
            {i < t.steps.length - 1 && <ArrowDown size={14} className="sm:hidden absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-10 text-white/30" />}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 p-5" style={card}>
        <div className="text-[11px] font-bold tracking-widest text-white/45 mb-3">{t.finalLabel}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {t.final.map((f) => (
            <div key={f.label}>
              <div className="text-2xl font-black text-white tabular-nums">{f.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {t.notes.map((n) => (
          <li key={n} className="flex items-start gap-1.5 text-xs text-white/40 leading-relaxed">
            <Check size={11} className="mt-0.5 flex-shrink-0" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── MooN Translator: 국가기관 수행 사례 ── */
export function TranslatorCase({ accent }: { accent: string }) {
  const t = useReport().translator;
  return (
    <div>
      <Label accent={accent}>{t.label}</Label>
      <Basis>{t.basis}</Basis>

      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {t.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/10 px-4 py-4" style={card}>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">{m.value}</div>
            <div className="text-[11px] mt-1" style={{ color: accent }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-[11px] font-bold tracking-widest text-white/45">{t.flowLabel}</div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {t.flow.map((st, i) => (
          <div key={st.title} className="relative rounded-xl border border-white/10 p-4" style={card}>
            <span className="text-[10px] font-bold tracking-widest" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-sm font-bold text-white mt-1">{st.title}</h3>
            <p className="text-xs text-white/50 leading-relaxed mt-1">{st.desc}</p>
            {i < t.flow.length - 1 && <ArrowRight size={14} className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30" />}
            {i < t.flow.length - 1 && <ArrowDown size={14} className="sm:hidden absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-10 text-white/30" />}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: `${accent}40`, background: `${accent}10` }}>
        <div className="text-[11px] font-bold tracking-widest" style={{ color: accent }}>{t.goalLabel}</div>
        <p className="mt-1.5 text-base font-semibold text-white leading-relaxed">{t.goal}</p>
      </div>

      <div className="mt-6 text-[11px] font-bold tracking-widest text-white/45">{t.checksLabel}</div>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {t.checks.map((c, i) => (
          <div key={c.title} className="rounded-lg border border-white/8 p-3" style={card}>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-slate-900" style={{ background: accent }}>{i + 1}</span>
              <span className="text-xs font-bold text-white">{c.title}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-white/45 leading-snug">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-[11px] font-bold tracking-widest text-white/45">{t.exampleLabel}</div>
      <div className="mt-2 rounded-2xl border border-white/10 overflow-hidden" style={card}>
        {t.example.map((e) => (
          <div key={e.from} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.4fr_1fr] items-center gap-x-4 gap-y-1 px-4 py-3 border-b border-white/8 last:border-b-0">
            <span className="text-sm text-white/55">{e.from}</span>
            <ArrowRight size={13} className="hidden sm:block text-white/30" />
            <span className="text-sm font-semibold text-white">{e.to}</span>
            <span className="text-[11px] sm:text-right" style={{ color: accent }}>{e.kind}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/40 leading-relaxed">{t.exampleNote}</p>

      <div className="mt-6 text-[11px] font-bold tracking-widest text-white/45">{t.outputLabel}</div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {t.outputs.map((o) => (
          <div key={o.title} className="flex items-start gap-3 rounded-xl border border-white/10 p-4" style={card}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}22` }}>
              <FileText size={15} style={{ color: accent }} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{o.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed mt-0.5">{o.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tango Batch: 납품 산출물 ── */
export function DeliverablesBlock({ accent }: { accent: string }) {
  const t = useReport().batch;
  return (
    <div className="mt-2">
      <Label accent={accent}>{t.label}</Label>
      <Basis>{t.basis}</Basis>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border border-white/10 p-5" style={card}>
          <div className="text-[11px] font-bold tracking-widest text-white/45 mb-3">{t.dataLabel}</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {t.data.map((d, i) => (
              <li key={d} className="flex items-center gap-2.5 text-sm text-white/75">
                <span className="w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center flex-shrink-0 text-slate-900" style={{ background: accent }}>{i + 1}</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-white/10 p-5" style={card}>
          <div className="text-[11px] font-bold tracking-widest text-white/45 mb-3">{t.docsLabel}</div>
          <ul className="flex flex-col gap-2">
            {t.docs.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-white/75">
                <Check size={14} className="flex-shrink-0" style={{ color: accent }} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/40 leading-relaxed">{t.note}</p>
    </div>
  );
}

/* ── Tango XML(JSON): JSON 구조 ── */
export function JsonStructureBlock({ accent }: { accent: string }) {
  const t = useReport().xml;
  return (
    <div className="mt-2">
      <Label accent={accent}>{t.label}</Label>
      <Basis>{t.basis}</Basis>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 p-5 font-mono" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="text-[11px] font-bold tracking-widest text-white/45 mb-3 font-sans">{t.areasLabel}</div>
          <div className="flex flex-col gap-2">
            {t.areas.map((a) => (
              <div key={a.title} className="flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5">
                <span className="text-xs font-black w-14" style={{ color: accent }}>{a.title}</span>
                <span className="text-xs text-white/60 font-sans">{a.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: `${accent}40`, background: `${accent}10` }}>
            <div className="text-[11px] font-bold tracking-widest" style={{ color: accent }}>{t.improveLabel}</div>
            <p className="mt-1.5 text-sm text-white leading-relaxed">{t.improve}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 flex items-center gap-4" style={card}>
            <div className="text-3xl font-black text-white tabular-nums">{t.verifiedValue}</div>
            <div className="text-xs text-white/55 leading-snug">{t.verifiedLabel}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] font-bold tracking-widest text-white/45">{t.effectsLabel}</div>
      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {t.effects.map((e) => (
          <li key={e} className="flex items-start gap-2 rounded-xl border border-white/8 px-4 py-3 text-sm text-white/70 leading-snug" style={card}>
            <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Tango Workflow: 표준 공정 설계 + AI 활용 원칙 ── */
export function WorkflowDesignBlock({ accent }: { accent: string }) {
  const t = useReport().workflow;
  const p = useReport().principle;
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Label accent={accent}>{t.label}</Label>
        <Basis>{t.basis}</Basis>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {t.stages.map((st, i) => (
            <div key={st.title} className="relative rounded-2xl border border-white/10 p-4" style={card}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center text-slate-900" style={{ background: accent }}>{i + 1}</span>
                <h3 className="text-sm font-bold text-white">{st.title}</h3>
              </div>
              <ul className="flex flex-col gap-1.5">
                {st.steps.map((s) => (
                  <li key={s} className="flex items-start gap-1.5 text-xs text-white/60 leading-snug">
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: `${accent}40`, background: `${accent}10` }}>
          <GitFork size={18} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
          <div>
            <h3 className="text-sm font-bold text-white">{t.branchTitle}</h3>
            <p className="text-xs text-white/60 leading-relaxed mt-1">{t.branchDesc}</p>
          </div>
        </div>
      </div>

      <div>
        <Label accent={accent}>{p.label}</Label>
        <Basis>{p.basis}</Basis>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {p.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-white/10 px-4 py-4" style={card}>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">{m.value}</div>
              <div className="text-[11px] mt-1" style={{ color: accent }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-[11px] font-bold tracking-widest text-white/45">{p.stepsLabel}</div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {p.steps.map((s, i) => (
            <div key={s} className="relative flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3" style={card}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}25` }}>
                {i === 2 ? <UserCheck size={14} style={{ color: accent }} /> : <ShieldCheck size={14} style={{ color: accent }} />}
              </span>
              <span className="text-sm font-semibold text-white">{s}</span>
              {i < p.steps.length - 1 && <ArrowRight size={14} className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30" />}
              {i < p.steps.length - 1 && <ArrowDown size={14} className="sm:hidden absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-10 text-white/30" />}
            </div>
          ))}
        </div>

        <div className="mt-5 text-[11px] font-bold tracking-widest text-white/45">{p.limitsLabel}</div>
        <div className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {p.limits.map((l) => (
            <div key={l.title} className="rounded-xl border border-white/8 p-4" style={card}>
              <h3 className="text-sm font-bold text-white">{l.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed mt-1">{l.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm font-semibold" style={{ color: accent }}>{p.note}</p>
      </div>
    </div>
  );
}
