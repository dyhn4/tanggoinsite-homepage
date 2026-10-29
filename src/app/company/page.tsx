"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, Target,
  BookOpen, Shield, Zap, Users, Award, Calendar, Clock,
  Building2, ChevronRight, Sparkles, Globe, Lock,
  Phone, MapPin, Star, FileCheck, CheckCircle2, Trophy,
  Cpu, Database, FileText, Layers,
} from "lucide-react";
import { Noto_Sans_KR } from "next/font/google";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

/* ─── 카운터 애니메이션 ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        let cur = 0;
        const inc = target / steps;
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(cur));
        }, 1400 / steps);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── 정적 데이터 (시각/구조 전용) ─── */
const valuesStatic = [
  { icon: Target,   gradient: "from-blue-600 to-sky-500"    },
  { icon: Shield,   gradient: "from-indigo-600 to-blue-500" },
  { icon: Sparkles, gradient: "from-sky-600 to-cyan-500"    },
];

const technologiesStatic = [
  { icon: BookOpen, tag: "CORE ENGINE", accent: "#38bdf8" },
  { icon: Globe,    tag: "PLATFORM",    accent: "#818cf8" },
  { icon: Lock,     tag: "DEPLOYMENT",  accent: "#34d399" },
];

const businessDomainsStatic = [
  { icon: Database, color: "#38bdf8" },
  { icon: Cpu,      color: "#818cf8" },
  { icon: Layers,   color: "#34d399" },
  { icon: FileText, color: "#fb923c" },
];

const servicesStatic = [
  { icon: BookOpen },
  { icon: Users    },
  { icon: Zap      },
  { icon: Award    },
];

const clients = [
  { name: "국립중앙도서관",         eng: "National Library of Korea",         logo: "/logos/nl.png",    stat: "108,594,914면", times: 15,   highlight: true  },
  { name: "국회도서관",             eng: "National Assembly Library",          logo: "/logos/nanet.png", stat: "78,141,238면",  times: 11,   highlight: false },
  { name: "대통령기록관",            eng: "Presidential Archives",             logo: "/logos/mois.png",  stat: "1,468,278면",   times: null, highlight: false },
  { name: "국립장애인도서관",        eng: "National Library for the Disabled", logo: "/logos/nld.png",   stat: "220,390면",     times: 2,    highlight: false },
];

const statsStatic: { value: number; numSize: string; suffix?: string }[] = [
  { value: 36230147,  numSize: "text-2xl xl:text-3xl" },
  { value: 260245890, numSize: "text-2xl xl:text-3xl" },
  { value: 4,         numSize: "text-5xl xl:text-6xl" },
  { value: 7,         numSize: "text-5xl xl:text-6xl" },
];

const certificationsStatic = [
  { icon: Globe,        color: "#38bdf8" },
  { icon: FileCheck,    color: "#818cf8" },
  { icon: Star,         color: "#fb923c" },
  { icon: Trophy,       color: "#34d399" },
  { icon: CheckCircle2, color: "#60a5fa" },
  { icon: CheckCircle2, color: "#a78bfa" },
];

const ipAssetsStatic = [
  { color: "#38bdf8" },
  { color: "#818cf8" },
  { color: "#34d399" },
  { color: "#fb923c" },
  { color: "#f472b6" },
  { color: "#a3e635" },
];

const majorProjectsStatic = [
  {
    client: "국립중앙도서관",
    badgeColor: "#ef4444",
    rows: [
      { year: "2026", books: "306책",   pages: "30,854면",  chars: "16,442,242자",  f1: "0.967" },
      { year: "2025", books: "65책",    pages: "15,404면",  chars: "14,467,147자",  f1: "0.958" },
      { year: "2024", books: "55책",    pages: "11,799면",  chars: "11,682,856자",  f1: "0.951" },
      { year: "2023", books: "217책",   pages: "13,898면",  chars: "10,080,144자",  f1: "0.930" },
    ],
  },
  {
    client: "국립중앙도서관",
    badgeColor: "#0ea5e9",
    rows: [
      { year: "2025", books: "1,649책", pages: "326,909면", chars: "260,245,890자", f1: "0.946" },
    ],
  },
];

const heroStatsStatic = [
  { icon: Calendar,  value: "2022"  },
  { icon: Award,     value: "0.964" },
  { icon: Clock,     value: "6"     },
  { icon: FileCheck, value: "6"     },
];

const companyInfoIcons = [Building2, Users, Calendar, Zap, MapPin, Phone];

/* ─── 메인 페이지 ─── */
export default function CompanyPage() {
  const { lang } = useLanguage();
  const t = translations[lang].companyPage;
  const bgHandleRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/ai-background.js";
    script.async = true;
    script.onload = () => {
      bgHandleRef.current = (window as any).AIBackground?.mount({
        style: "sphere",
        theme: "purpleBlue",
        speed: 0.7,
        grain: true,
        target: "#company-hero",
      });
    };
    document.body.appendChild(script);
    return () => {
      bgHandleRef.current?.destroy();
      bgHandleRef.current = null;
      if (document.body.contains(script)) script.remove();
    };
  }, []);

  return (
    <div className={`min-h-screen bg-white ${notoSansKR.className}`}>

      {/* ── 상단 네비 ── */}
      <nav
        className="sticky top-0 z-30 border-b border-white/10"
        style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(14px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            {t.backHome}
          </Link>
          <span className="text-base font-black tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">Tango</span><span className="text-white">Insight</span>
          </span>
          <Link
            href="/contact"
            className="text-sm font-semibold text-white px-4 py-1.5 rounded-full transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}
          >
            {t.contactBtn}
          </Link>
        </div>
      </nav>

      {/* ── 1. 히어로 ── */}
      <section id="company-hero" className="relative isolate min-h-[100vh] flex flex-col justify-center overflow-hidden" style={{ background: "#070710" }}>

        {/* 코너 글로우 */}
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.13) 0%, transparent 60%)" }} />
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(77,124,255,0.11) 0%, transparent 60%)" }} />
        <div className="absolute top-1/4 -right-20 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(63,182,255,0.08) 0%, transparent 60%)" }} />

        {/* 별 필드 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)", backgroundSize: "80px 80px", opacity: 0.2 }} />

        {/* 오비탈 링 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: "510px", height: "510px", border: "1px solid rgba(124,92,255,0.12)" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: "730px", height: "730px", border: "1px solid rgba(77,124,255,0.08)" }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: "950px", height: "950px", border: "1px solid rgba(63,182,255,0.05)" }} />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/12 border border-blue-400/25 text-blue-300 text-xs font-bold tracking-[0.2em] uppercase mb-6">
              <Building2 size={13} />
              {t.heroBadge}
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-none tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              <span className="bg-gradient-to-r from-white via-sky-100 to-blue-300 bg-clip-text text-transparent">
                탱고인사이트
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-sky-300 font-semibold mb-6 tracking-tight">
              Tangoinsight Co., Ltd.
            </p>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl whitespace-pre-line">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-xl shadow-violet-900/50"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>
                {t.heroCtaConsult} <ArrowRight size={16} />
              </Link>
              <Link href="/solutions"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] transition-all backdrop-blur-sm">
                {t.heroCtaSolutions} <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* 핵심 수치 바 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {heroStatsStatic.map((s, i) => {
              const hs = t.heroStats[i];
              return (
                <div key={i}
                  className="flex flex-col gap-1 p-5 rounded-2xl bg-white/[0.05] border border-blue-400/15 hover:border-blue-400/35 hover:bg-blue-500/10 transition-all duration-300">
                  <s.icon size={16} className="text-sky-400 mb-1" />
                  <div className="text-2xl font-black text-white leading-none">
                    {s.value}<span className="text-sky-400 text-sm ml-1">{hs.unit}</span>
                  </div>
                  <div className="text-slate-400 text-xs">{hs.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. 미션 · 비전 · 핵심 가치 ── */}
      <section className="py-20 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
            <div className="p-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-blue-500 mb-3">{t.missionLabel}</div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-snug" style={{ whiteSpace: "pre-line" }}>
                &ldquo;{t.missionTitle}&rdquo;
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{t.missionDesc}</p>
            </div>
            <div className="p-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">{t.visionLabel}</div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-snug" style={{ whiteSpace: "pre-line" }}>
                &ldquo;{t.visionTitle}&rdquo;
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{t.visionDesc}</p>
            </div>
          </div>

          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-slate-100 text-slate-600 mb-3">CORE VALUES</span>
            <h2 className="text-3xl font-black text-slate-900">{t.coreValuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {valuesStatic.map((v, i) => {
              const tv = t.values[i];
              return (
                <div key={i}
                  className="group p-7 rounded-3xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-5 shadow-md`}>
                    <v.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-3 group-hover:text-blue-700 transition-colors">{tv.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{tv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. 기술 역량 (다크) ── */}
      <section className="py-20 px-6 sm:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #0c1a35 60%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-blue-400/25 bg-blue-500/10 text-blue-400 mb-3">TECHNOLOGY</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{t.techSectionTitle}</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto whitespace-pre-line">{t.techSectionDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {technologiesStatic.map((tech, i) => {
              const tt = t.technologies[i];
              return (
                <div key={i}
                  className="group p-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${tech.accent}08 0%, transparent 60%)`,
                    borderColor: `${tech.accent}25`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${tech.accent}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = `${tech.accent}25`)}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${tech.accent}20`, border: `1px solid ${tech.accent}30` }}>
                      <tech.icon size={22} style={{ color: tech.accent }} />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full"
                      style={{ color: tech.accent, background: `${tech.accent}15`, border: `1px solid ${tech.accent}20` }}>
                      {tech.tag}
                    </span>
                  </div>

                  <h3 className="text-white font-black text-lg mb-1">{tt.title}</h3>
                  <p className="text-sm font-semibold mb-5" style={{ color: tech.accent }}>{tt.subtitle}</p>

                  <ul className="space-y-2.5">
                    {tt.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-slate-400 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: tech.accent }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. 주요 사업 분야 ── */}
      <section className="py-20 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-blue-100 text-blue-700 border border-blue-200 mb-3">BUSINESS DOMAIN</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">{t.bizDomainTitle}</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">{t.bizDomainDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {businessDomainsStatic.map((domain, i) => {
              const td = t.businessDomains[i];
              return (
                <div key={i}
                  className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${domain.color}20`, border: `1px solid ${domain.color}30` }}>
                    <domain.icon size={20} style={{ color: domain.color }} />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm mb-4">{td.title}</h3>
                  <ul className="space-y-1.5">
                    {td.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-500 text-xs">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: domain.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. 서비스 영역 ── */}
      <section className="py-20 px-6 sm:px-10 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-blue-100 text-blue-700 border border-blue-200 mb-3">SERVICES</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">{t.servicesSectionTitle}</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">{t.servicesSectionDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {servicesStatic.map((svc, i) => {
              const ts = t.services[i];
              return (
                <div key={i}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <svc.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{ts.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">{ts.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link href="/solutions"
              className="inline-flex items-center gap-2 text-blue-700 font-semibold text-sm hover:gap-3 transition-all">
              {t.solutionsLinkLabel} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. 대외 인증 & 지적재산권 (다크) ── */}
      <section className="py-20 px-6 sm:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #0c1a35 60%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-blue-400/25 bg-blue-500/10 text-blue-400 mb-3">CERTIFICATIONS</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{t.certsSectionTitle}</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{t.certsSectionDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {certificationsStatic.map((cert, i) => {
              const tc = t.certifications[i];
              return (
                <div key={i}
                  className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: `${cert.color}08`, borderColor: `${cert.color}25` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${cert.color}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = `${cert.color}25`)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${cert.color}20` }}>
                      <cert.icon size={18} style={{ color: cert.color }} />
                    </div>
                    <span className="text-xs font-bold tracking-wide text-slate-400">{tc.label}</span>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{tc.value}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{tc.sub}</div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-white font-black text-lg">{t.ipSectionTitle}</h3>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/25">6건</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ipAssetsStatic.map((ip, i) => {
                const ti = t.ipAssets[i];
                return (
                  <div key={i}
                    className="p-4 rounded-xl border text-center transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: `${ip.color}08`, borderColor: `${ip.color}25` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${ip.color}50`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${ip.color}25`)}
                  >
                    <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
                      style={{ background: `${ip.color}20` }}>
                      <FileCheck size={14} style={{ color: ip.color }} />
                    </div>
                    <div className="text-white font-bold text-xs mb-1 leading-tight">{ti.name}</div>
                    <div className="text-slate-500 text-[10px]">{ti.type}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. 주요 수행 실적 ── */}
      <section className="py-20 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-blue-100 text-blue-700 border border-blue-200 mb-3">TRACK RECORD</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">{t.trackSectionTitle}</h2>
            <p className="text-slate-500 text-sm">{t.trackSectionDesc}</p>
          </div>

          <div className="space-y-6 mb-12">
            {majorProjectsStatic.map((proj, i) => {
              const tm = t.majorProjects[i];
              const th = t.tableHeaders;
              return (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                    <h3 className="font-black text-slate-900 text-base">{tm.title}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ background: proj.badgeColor }}>
                      {tm.badge}
                    </span>
                    <span className="text-xs text-slate-500">{tm.clientPrefix} {proj.client}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100/70">
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 tracking-wide">{th.year}</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 tracking-wide">{th.books}</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 tracking-wide">{th.pages}</th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 tracking-wide">{th.chars}</th>
                          <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 tracking-wide">{th.f1}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proj.rows.map((row) => (
                          <tr key={row.year} className="border-t border-slate-100">
                            <td className="px-6 py-3 font-bold text-slate-900">{row.year}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{row.books}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{row.pages}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{row.chars}</td>
                            <td className="px-6 py-3 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                                {row.f1}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. 누적 수행 실적 (다크) ── */}
      <section className="py-20 px-6 sm:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a 60%, #0f172a)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest border border-blue-400/25 bg-blue-500/10 text-blue-400 mb-3">STATISTICS</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{t.statsSectionTitle}</h2>
            <p className="text-slate-400 text-sm">{t.statsSectionDesc}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsStatic.map((s, i) => {
              const si = t.statsItems[i];
              return (
                <div key={i}
                  className="p-6 xl:p-8 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:border-blue-400/30 hover:bg-blue-500/[0.08] transition-all duration-300 flex flex-col items-center justify-center min-h-[9rem]">
                  <div className={`${s.numSize} font-black text-white tabular-nums leading-none mb-1`}>
                    <CountUp target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-sky-400 text-sm font-bold mb-2">{si.unit}</div>
                  <div className="text-slate-400 text-xs tracking-wide">{si.label}</div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">{t.statsNote}</p>
        </div>
      </section>

      {/* ── 9. 주요 고객사 ── */}
      <section className="py-20 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-slate-100 text-slate-600 mb-3">CLIENTS</span>
            <h2 className="text-3xl font-black text-slate-900 mb-3">{t.clientsSectionTitle}</h2>
            <p className="text-slate-500 text-sm">{t.clientsSectionDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {clients.map((c) => (
              <div key={c.name}
                className="group flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                    <Image src={c.logo} alt={c.name} width={40} height={40} className="object-contain" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-snug">{c.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{t.clientDesc}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-xs">{t.ocrDataLabel}</span>
                    <span className="text-blue-700 font-bold text-xs">{c.stat}</span>
                  </div>
                  {c.times !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">{t.techAppliedLabel}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>
                        {c.times}{t.timesUnit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-800 text-sm mb-1">{t.historyPrompt}</p>
              <p className="text-slate-500 text-xs">{t.historyDesc}</p>
            </div>
            <Link href="/history"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>
              {t.historyBtn} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. 회사 정보 ── */}
      <section className="py-16 px-6 sm:px-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-slate-200 text-slate-600 mb-3">COMPANY INFO</span>
            <h2 className="text-2xl font-black text-slate-900">{t.companyInfoTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.companyInfoItems.map((item, i) => {
              const Icon = companyInfoIcons[i];
              return (
                <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 tracking-wide block mb-0.5">{item.label}</span>
                    <span className="text-slate-800 text-sm font-medium">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. CTA 배너 ── */}
      <section className="py-20 px-6 sm:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0284c7 50%, #0ea5e9 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold tracking-widest mb-6">
            <Sparkles size={13} />
            FREE CONSULTATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">{t.ctaTitle}</h2>
          <p className="text-blue-100 text-base mb-10 max-w-xl mx-auto leading-relaxed">{t.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-700 font-black text-base transition-all hover:-translate-y-0.5 shadow-2xl hover:shadow-white/30">
              {t.ctaApplyBtn} <ArrowRight size={18} />
            </Link>
            <Link href="/faq"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-all">
              {t.ctaFaqBtn}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
