"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

function Label({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: accent }}>{children}</h2>
    </div>
  );
}

type Figure = { src: string; w: number; h: number; title: string; caption: string; note: string };

function Frame({ f }: { f: Figure }) {
  return (
    // 원본보다 크게 늘리면 흐려지므로 원본 폭을 넘지 않게 제한
    <div className="rounded-2xl overflow-hidden bg-white border border-white/10" style={{ maxWidth: f.w }}>
      <Image src={f.src} alt={f.title} width={f.w} height={f.h} className="w-full h-auto" />
    </div>
  );
}

function Caption({ f }: { f: Figure }) {
  return (
    <>
      <h3 className="text-sm font-bold text-white">{f.title}</h3>
      <p className="mt-1.5 text-xs text-white/60 leading-relaxed">{f.caption}</p>
      <p className="mt-2 text-[11px] text-white/40 leading-relaxed">{f.note}</p>
    </>
  );
}

/* 솔루션별 실제 화면·도식 (public/solutions/figures) */
export default function SolutionFigures({ id, accent }: { id: string; accent: string }) {
  const { lang } = useLanguage();
  const t = translations[lang].solutionFigures;
  const figs = (t.items as Record<string, Figure[]>)[id];
  if (!figs?.length) return null;

  return (
    <div className="mt-2">
      <Label accent={accent}>{t.label}</Label>

      {figs.length === 1 ? (
        // 그림 하나: 그림 옆에 설명. 세로로 긴 그림은 폭을 좁게
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className={figs[0].h > figs[0].w ? "lg:col-span-2" : "lg:col-span-3"}>
            <Frame f={figs[0]} />
          </div>
          <div className={figs[0].h > figs[0].w ? "lg:col-span-3" : "lg:col-span-2"}>
            <Caption f={figs[0]} />
          </div>
        </div>
      ) : (
        // 그림 여러 개: 그림마다 아래에 설명
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {figs.map((f, i) => (
            <figure key={f.src} className={i === 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <Frame f={f} />
              <figcaption className="mt-3">
                <Caption f={f} />
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 실제 산출물 형식 예시 (코드 블록) ── */
const JSON_SAMPLE = `{
  "본문": [
    {
      "페이지": "00000052",
      "본문": "第八章 英雄의否運\\r\\n一 한니발의理想\\r\\n古來未曾有의칸네大戰役은、 카테-\\r\\n나智略이豊富한한니발은、 로마의都門"
    }
  ]
}`;

const XML_SAMPLE = `<page width="1950" height="2982" resolution="300">
  <block blockType="Text"><text><par>
    <line l="436" t="590" r="1674" b="860" baseline="860">
      <formatting>
        <charParams l="729" t="626" r="959" b="860" cc="87">교</charParams>
        <charParams l="979" t="652" r="1167" b="825" cc="76">사</charParams>
        <charParams l="1153" t="649" r="1263" b="821" cc="63">회</charParams>
      </formatting>
    </line>
  </par></text></block>
</page>`;

const TXT_SAMPLE = `00000052
第八章 英雄의否運
一 한니발의理想
古來未曾有의칸네大戰役은、 카테-
나智略이豊富한한니발은、 로마의都門`;

function Code({ title, desc, code, accent }: { title: string; desc: string; code: string; accent: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10">
        <span className="text-xs font-bold font-mono" style={{ color: accent }}>{title}</span>
        <span className="text-[11px] text-white/45 text-right leading-snug">{desc}</span>
      </div>
      <pre className="p-4 text-[12px] leading-relaxed text-white/75 font-mono whitespace-pre-wrap break-all"><code>{code}</code></pre>
    </div>
  );
}

export function OutputSamples({ variant, accent }: { variant: "xml" | "batch"; accent: string }) {
  const { lang } = useLanguage();
  const t = translations[lang].outputSamples;
  return (
    <div className="mt-2">
      <Label accent={accent}>{t.label}</Label>
      {variant === "xml" ? (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Code title={t.json.title} desc={t.json.desc} code={JSON_SAMPLE} accent={accent} />
          <Code title={t.xml.title} desc={t.xml.desc} code={XML_SAMPLE} accent={accent} />
        </div>
      ) : (
        <div className="mt-5 max-w-2xl">
          <Code title={t.txt.title} desc={t.txt.desc} code={TXT_SAMPLE} accent={accent} />
        </div>
      )}
      <p className="mt-3 text-[11px] text-white/40 leading-relaxed">{t.note}</p>
    </div>
  );
}
