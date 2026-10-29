"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const CHARS = "訓民正音國語文字不相流通愚民有所欲言終得伸情者多矣予爲此憫然新制二十八字覽者易習便於日用耳".split("");

const timeline = [
  {
    year: 2026,
    items: [
      "고문헌(근대자료) 원문 텍스트 데이터베이스 구축사업(완료 · 306책 · 16,442,242자)",
      "현대간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(탱고워크플로우 공급)(기술지원)",
      "문화예술자료 디지털화 및 지식정보자원 공유기반 구축 사업(AI OCR 공급)(기술지원)",
    ],
  },
  {
    year: 2025,
    items: [
      "고문헌(근대자료) 원문 텍스트 데이터베이스 구축사업",
      "디지털화 원문(현대자료) AI 텍스트 데이터 구축사업",
      "시각장애인용 대체자료 기본장서 제작사업",
      "문화예술자료 디지털화 및 지식정보자원 공유기반 구축 사업",
      "국회도서관 원문DB 구축사업(DB III)",
      "단행자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
    ],
  },
  {
    year: 2024,
    items: [
      "고문헌(근대자료) 원문 텍스트 데이터베이스 구축사업",
      "기본장서 텍스트 데이터베이스 구축 연구용역",
      "국회도서관 원문DB 구축사업(DB II)",
      "문화예술자료 디지털화 및 지식정보자원 공유기반 구축 사업",
      "단행자료 디지털화 및 지식정보자원 공유기반 구축 사업",
      "행정안전부 대통령기록관 비전자대통령 기록물 전자화 사업",
      "차세대 통합자료관리시스템 고도화 사업(기술지원)",
    ],
  },
  {
    year: 2023,
    items: [
      "고문헌(근대자료) 원문 텍스트 데이터베이스 구축사업(기술지원)",
      "고문헌·문화예술 자료 디지털화 및 지식정보자원 공유기반 구축 사업",
      "인공지능 기반 고문헌 필사본 텍스트구축 연구용역 사업",
      "연속간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
      "현대간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
      "국회도서관 원문DB 구축사업(II)",
    ],
  },
  {
    year: 2022,
    items: [
      "국회도서관 원문DB 구축사업(DBIII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBI)",
      "연속간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
      "현대간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
    ],
  },
  {
    year: 2021,
    items: [
      "국회도서관 원문DB 구축사업(DBIII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBI)(기술지원)",
      "현대간행물 자료 디지털화 및 지식정보자원 공유기반 구축 사업(기술지원)",
    ],
  },
  {
    year: 2020,
    items: [
      "국회도서관 원문DB 구축사업(DBIII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBII)(기술지원)",
      "국회도서관 원문DB 구축사업(DBI)(기술지원)",
    ],
  },
];

type Particle = {
  x: number;
  y: number;
  char: string;
  size: number;
  opacity: number;
  speed: number;   // 상승 속도
  drift: number;   // 좌우 흔들림
  driftSpeed: number;
  rotation: number;
  rotSpeed: number;
  phase: number;   // 사인 위상
};

function makeParticle(w: number, h: number, randomY = false): Particle {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + Math.random() * 200,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    size: 14 + Math.floor(Math.random() * 18),
    opacity: 0.13 + Math.random() * 0.17,
    speed: 0.25 + Math.random() * 0.45,
    drift: (Math.random() - 0.5) * 0.6,
    driftSpeed: 0.004 + Math.random() * 0.006,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.008,
    phase: Math.random() * Math.PI * 2,
  };
}

export default function HistoryPage() {
  const { lang } = useLanguage();
  const t = translations[lang].historyPage;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: 30 }, () =>
      makeParticle(canvas.width, canvas.height, true)
    );

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x + Math.sin(p.phase + t * p.driftSpeed) * 18, p.y);
        ctx.rotate(p.rotation + t * p.rotSpeed);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // 살짝 파란 기운 도는 잉크 느낌
        ctx.fillStyle = `rgba(30, 64, 175, ${p.opacity})`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        p.y -= p.speed;

        // 화면 위로 사라지면 아래에서 다시 등장
        if (p.y < -40) {
          Object.assign(p, makeParticle(canvas.width, canvas.height, false));
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "#f7f6f2" }}
    >
      {/* 도트 그리드 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.2) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 떠오르는 한자 캔버스 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* 상단 헤더 바 */}
      <div
        className="sticky top-0 z-30 border-b border-slate-200/80"
        style={{ background: "rgba(247,246,242,0.92)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            {t.backHome}
          </Link>
          <span
            className="text-base font-black tracking-tight"
            style={{ fontFamily: "'Sora', 'Pretendard', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Tango</span><span className="text-slate-900">Insight</span>
          </span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-14" style={{ zIndex: 2 }}>

        {/* 페이지 타이틀 */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-blue-700" />
            <span className="text-blue-700 font-bold text-xs tracking-[0.2em] uppercase">{t.heroLabel}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4" style={{ whiteSpace: "pre-line" }}>
            {t.heroTitle}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md whitespace-pre-line">
            {t.heroDesc}
          </p>
        </div>

        {/* 타임라인 */}
        <div className="relative">
          {/* 세로 선 */}
          <div
            className="absolute top-0 bottom-0 w-[2px] left-[72px] sm:left-[110px]"
            style={{
              background: "linear-gradient(to bottom, #1d4ed8 0%, #1d4ed8 70%, transparent 100%)",
              opacity: 0.18,
            }}
          />

          <div className="flex flex-col gap-10">
            {timeline.map((entry, idx) => (
              <div key={entry.year} className="relative flex items-start gap-0">

                {/* 연도 */}
                <div className="flex-shrink-0 flex flex-col items-end pr-4 sm:pr-6 pt-3 w-[72px] sm:w-[110px]">
                  <span
                    className="text-xl sm:text-3xl font-black tabular-nums"
                    style={{ color: idx === 0 ? "#1d4ed8" : "#94a3b8", lineHeight: 1 }}
                  >
                    {entry.year}
                  </span>
                </div>

                {/* 노드 */}
                <div
                  className="relative flex-shrink-0"
                  style={{ width: "2px", marginTop: "14px" }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 -translate-x-[6px]"
                    style={{
                      background: idx === 0 ? "#1d4ed8" : "#fff",
                      borderColor: idx === 0 ? "#1d4ed8" : "#cbd5e1",
                      boxShadow: idx === 0 ? "0 0 0 4px rgba(29,78,216,0.12)" : "none",
                    }}
                  />
                </div>

                {/* 카드 목록 */}
                <div className="flex-1 pl-7 pb-2">
                  <div className="flex flex-col gap-2">
                    {entry.items.map((item, i) => (
                      <div
                        key={i}
                        className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-white/80 border border-slate-200/80 hover:border-blue-200 hover:shadow-md hover:bg-white transition-all duration-200"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)" }}
                      >
                        <div
                          className="mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: idx === 0 ? "#1d4ed8" : "#94a3b8" }}
                        />
                        <span
                          className="text-sm leading-relaxed group-hover:text-slate-800 transition-colors duration-200"
                          style={{ color: idx === 0 ? "#1e293b" : "#64748b" }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 종단 */}
          <div className="flex items-center gap-3 mt-8 pl-[84px] sm:pl-[122px]">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-300" />
            <span className="text-slate-400 text-xs">{t.growthNote}</span>
          </div>
        </div>

        {/* 고객사 */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-4">{t.clientsLabel}</p>
          <div className="flex flex-wrap gap-3">
            {["국회도서관", "국립중앙도서관", "국립장애인도서관", "행정안전부"].map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white/80 border border-slate-200"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
